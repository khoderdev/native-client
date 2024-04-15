import React, { useState, useEffect, useRef } from "react";
import uuid from 'react-native-uuid';
import {
  View,
  StyleSheet,
  TextInput,
  StatusBar,
  Platform,
  Modal,
  TouchableWithoutFeedback,
  Text,
  Dimensions,
  ScrollView,
  Alert,
  Linking
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from '@react-native-picker/picker'
import { useDonationContext } from "../app/contexts/DonationContext";
import { Camera } from "expo-camera";
import { TouchableOpacity } from "react-native";
import { AntDesign, MaterialCommunityIcons } from "@expo/vector-icons";
import { Keyboard } from "react-native";
import axios from "axios";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

const SuccessMessage = ({ visible }: { visible: boolean }) =>
  visible ? (
    <View style={styles.successMessage}>
      <AntDesign name="checkcircle" size={24} color="white" />
      <Text style={styles.successText}>Success</Text>
    </View>
  ) : null;

const ErrorMessage = ({
  visible,
  message,
}: {
  visible: boolean;
  message: string;
}) =>
  visible ? (
    <View style={styles.errorText}>
      <AntDesign name="exclamationcircle" size={24} color="white" />
      <Text style={styles.errorText}>{message}</Text>
    </View>
  ) : null;

export default function Donate() {
  const { donationForm, setDonationForm, addDonation, recipients, selectedDonorId,
    setSelectedDonorId, drugNames, donors, fetchDonors, fetchRecipients, fetchDrugs, selectedDrugName, handleDrugNameChange, } = useDonationContext();
  const [scanBarcodeVisible, setScanBarcodeVisible] = useState(false);
  const [showScannedInputs, setShowScannedInputs] = useState(false);
  const [successVisible, setSuccessVisible] = useState(false);
  const [touchedScreen, setTouchedScreen] = useState(false);
  const [errorVisible, setErrorVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [focusedInput, setFocusedInput] = useState(null);
  const [confirmationVisible, setConfirmationVisible] = useState(false);
  const [selectedRecipient, setSelectedRecipient] = useState('');
  // const [selectedDonor, setSelectedDonor] = useState("");
  const [date, setDate] = useState(new Date());
  const [mode, setMode] = useState('date');
  const [show, setShow] = useState(false);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [cameraVisible, setCameraVisible] = useState(true);
  const cameraRef = useRef(null);
  const previousZoomRef = useRef(null);
  const [flashMode, setFlashMode] = useState(Camera.Constants.FlashMode.off);
  const [zoom, setZoom] = useState(0.1);
  const [resetForm, setResetForm] = useState(false);

  useEffect(() => {
    // Fetch donors, recipients, and drugs data initially
    fetchDonors();
    fetchRecipients();
    fetchDrugs();
  }, []);

  
  
  // Update DonationDate in donationForm state when date changes
  useEffect(() => {
    setDonationForm({
      ...donationForm,
      DonationDate: date, // Update DonationDate with selected date
    });
  }, [date]); // Only re-run the effect if date changes



  const handleRecipientChange = (recipientId) => {
    const selectedRecipient = recipients.find(recipient => recipient.RecipientId.toString() === recipientId);
    if (selectedRecipient) {
      const recipientIdInt = parseInt(recipientId, 10); // Convert recipientId to integer
      setSelectedRecipient(recipientIdInt.toString()); // Set selectedRecipient as string for consistency
      setDonationForm(prevState => ({
        ...prevState,
        RecipientId: recipientIdInt, // Set recipientId as integer
        RecipientName: selectedRecipient.RecipientName // Set the recipient name in donationForm
      }));
    }
  };


  const handleFocus = (inputName) => {
    setFocusedInput(inputName);
  };

  const handleBlur = () => {
    setFocusedInput(null);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!touchedScreen) {
        Keyboard.dismiss();
      }
    }, 2500);

    return () => clearTimeout(timer);
  }, [touchedScreen]);


  // Function to handle submission confirmation
  const handleConfirmation = () => {
    setConfirmationVisible(true);
  };

  const handleSubmit = async () => {
    try {
      Keyboard.dismiss();

      // Perform form validation
      if (
        !donationForm.LOT ||
        !donationForm.ExpiryDate ||
        !donationForm.GTIN
      ) {
        throw new Error("you must scan the required Barcode fields.");
      }

      // Add donation
      await addDonation();

      // Clear form fields only if submission is successful
      setDonationForm({
        // DonorId: uuid.v4(),
        DonorId: "",
        RecipientId: "",
        DrugName: "",
        Quantity: "",
        Presentation: "",
        Form: "",
        DonationPurpose: "",
        DonationDate: "",
        ProductionDate: "2024-03-31",
        Laboratory: "",
        LaboratoryCountry: "",
        LOT: "",
        ExpiryDate: "",
        GTIN: "",
        Serial: "",
      });

      // Toggle the reset flag to force reset the form fields
      setResetForm(true);

      // Display success message
      setSuccessVisible(true);
      // Display confirmation modal
      handleConfirmation();
      // Hide the success message after 2 seconds
      setTimeout(() => {
        setSuccessVisible(true);
      }, 2000);
    } catch (error: any) {
      if (error.message === "Failed to add donation") {
        setErrorMessage("Failed to add donation.");
      } else {
        setErrorMessage(error.message); // Handle other types of errors
      }
      setErrorVisible(true);
    }
  };

  // Effect to reset the form fields when the reset flag changes
  useEffect(() => {
    if (resetForm) {
      setDonationForm({
        DonorId: "",
        RecipientId: "",
        DrugName: "",
        Quantity: "",
        Presentation: "",
        Form: "",
        DonationPurpose: "",
        DonationDate: "",
        ProductionDate: "2024-03-31",
        Laboratory: "",
        LaboratoryCountry: "",
        LOT: "",
        ExpiryDate: "",
        GTIN: "",
        Serial: "",
      });
      // Reset the reset flag
      setResetForm(false);
    }
  }, [resetForm]);

  const handleBarcodeScanned = ({ type, data }: { type: string; data: string }) => {
    console.log(`Barcode with type ${type} and data ${data} has been scanned!`);
    try {
      const response = { gtin: '', lot: '', sn: '', exp: '' };
      let responseCode = data;

      const prefixes = [
        { prefix: '01', key: 'gtin', length: 14 },
        { prefix: '17', key: 'exp', length: 6 },
        { prefix: '10', key: 'lot' },
        { prefix: '21', key: 'sn' },
      ];

      prefixes.forEach(({ prefix, key, length }) => {
        const position = responseCode.indexOf(prefix);

        if (position !== -1) {
          const start = position + prefix.length;
          let end;

          if (length) {
            // For fixed-length AIs, calculate the end position based on the length
            end = start + length;
          } else {
            // For variable-length AIs, find the position of the next GS or the end of the string
            const gsPosition = responseCode.indexOf(String.fromCharCode(29), start);
            end = gsPosition !== -1 ? gsPosition : responseCode.length;
          }

          response[key] = responseCode.substring(start, end);
          responseCode = responseCode.slice(0, position) + responseCode.slice(end);
        }
      });

      // Log individual scanned values
      console.log("Scanned GTIN:", response.gtin);
      console.log("Scanned Lot:", response.lot);
      console.log("Scanned EXP:", response.exp);
      console.log("Scanned Serial:", response.sn);

      // Format the expiration date as YYYY-MM-DD
      const expDate = response.exp;
      const formattedExpDate = expDate ? `20${expDate.slice(0, 2)}-${expDate.slice(2, 4)}-${expDate.slice(4)}` : '';

      // Update state with the scanned data
      setDonationForm({
        ...donationForm,
        GTIN: response.gtin,
        LOT: response.lot,
        ExpiryDate: formattedExpDate,
        Serial: response.sn,
      });

      // Close the scan modal after scanning
      setScanBarcodeVisible(false);
      setShowScannedInputs(true);
    } catch (error) {
      console.error("Error parsing scanned data:", error);
      // Handle error, such as displaying an error message to the user
      setErrorVisible(true);
      setErrorMessage(error.message);
    }
  };

  const handleScanBarcode = async () => {
    const { status } = await Camera.requestCameraPermissionsAsync();

    if (status === 'granted') {
      // Permission granted, show barcode scanner
      setScanBarcodeVisible(true);
    } else {
      // Permission denied or not granted yet
      Alert.alert(
        'Camera Permission Required',
        'To scan barcodes, this app needs access to your camera. Please enable camera access in your device settings.',
        [
          {
            text: 'Cancel',
            style: 'cancel',
            onPress: () => console.log('Cancel Pressed'),
          },
          {
            text: 'Go to Settings',
            onPress: () => openSettings(),
          },
        ],
        { cancelable: false }
      );
    }
  };

  const openSettings = () => {
    // Open app settings so user can grant camera permission manually
    Linking.openSettings();
  };

  const handleCloseBarcodeModal = () => {
    setScanBarcodeVisible(false);
  };

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  function flipCamera() {
    setType(
      type === Camera.Constants.Type.back
        ? Camera.Constants.Type.front
        : Camera.Constants.Type.back
    );
  }

  function toggleFlash() {
    setFlashMode(
      flashMode === Camera.Constants.FlashMode.off
        ? Camera.Constants.FlashMode.torch
        : Camera.Constants.FlashMode.off
    );
  }

  function handlePinchGesture(event) {
    const touch1 = event.nativeEvent.touches[0];
    const touch2 = event.nativeEvent.touches[1];

    if (!touch1 || !touch2) return;

    const distance = Math.sqrt(
      Math.pow(touch2.pageX - touch1.pageX, 2) + Math.pow(touch2.pageY - touch1.pageY, 2)
    );

    if (!previousZoomRef.current) {
      previousZoomRef.current = distance;
      return;
    }

    const delta = previousZoomRef.current - distance;
    const zoomFactor = delta / 500; // Adjust this value as needed for zoom speed

    setZoom(prevZoom => Math.max(0, Math.min(prevZoom + zoomFactor, 1)));
    previousZoomRef.current = distance;
  }

  function zoomIn() {
    setZoom(prevZoom => Math.min(prevZoom + 0.1, 1));
  }

  function zoomOut() {
    setZoom(prevZoom => Math.max(prevZoom - 0.1, 0));
  }


  return (
    <>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.scrollViewContent}
        className="bg-zinc-800"
      >
        <TouchableWithoutFeedback onPress={dismissKeyboard}>
          <View style={styles.container}>
            <Text className='text-3xl text-white font-semibold'>Donate</Text>
            <View >
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Donor:</Text>
                <View style={styles.pickerContainer}>
                  <Picker
                    selectedValue={selectedDonorId}
                    onValueChange={(itemValue, itemIndex) =>
                      setSelectedDonorId(itemValue)
                    }
                    style={styles.picker}
                    itemStyle={styles.pickerItem}
                  >
                    <Picker.Item label="Select a donor" value={null} />
                    {donors && donors.map((donor) => (
                      <Picker.Item
                        key={`${donor.DonorId}-${donor.DonorName}`}
                        label={donor.DonorName}
                        value={donor}
                      />
                    ))}
                  </Picker>
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Recipient:</Text>
                <View style={styles.pickerContainer}>
                  <Picker
                    selectedValue={selectedRecipient}
                    onValueChange={handleRecipientChange}
                    style={styles.picker}
                    itemStyle={styles.pickerItem}
                  >
                    <Picker.Item label="Select" value="" />
                    {recipients && recipients.map((recipient) => (
                      <Picker.Item
                        key={recipient.RecipientId}
                        label={recipient.RecipientName}
                        value={recipient.RecipientId.toString()}
                      />
                    ))}
                  </Picker>
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Medicine Name:</Text>
                <View style={styles.pickerContainer}>
                  <Picker
                    selectedValue={selectedDrugName}
                    onValueChange={handleDrugNameChange}
                    style={styles.picker}
                  >
                    {drugNames.map((name, index) => (
                      <Picker.Item key={index} label={name} value={name} />
                    ))}
                  </Picker>
                </View>
              </View>


              <View style={styles.inputGroup}>
                <Text style={styles.label}>Presentation:</Text>
                <TextInput
                  value={donationForm.Presentation}
                  onChangeText={(text) =>
                    setDonationForm({ ...donationForm, Presentation: text })
                  }
                  placeholder="Presentation"
                  placeholderTextColor="#999"
                  style={[
                    styles.input,
                    focusedInput === "presentation" && styles.inputFocused,
                  ]}
                  onFocus={() => handleFocus("presentation")}
                  onBlur={handleBlur}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Form:</Text>
                <TextInput
                  value={donationForm.Form}
                  onChangeText={(text) =>
                    setDonationForm({ ...donationForm, Form: text })
                  }
                  placeholder="Form"
                  placeholderTextColor="#999"
                  style={[
                    styles.input,
                    focusedInput === "Form" && styles.inputFocused,
                  ]}
                  onFocus={() => handleFocus("Form")}
                  onBlur={handleBlur}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Quantity:</Text>
                <TextInput
                  value={donationForm.Quantity}
                  onChangeText={(text) => {
                    // Remove non-numeric characters
                    const numericValue = text.replace(/[^0-9]/g, '');
                    // Update the state only if the input is a valid positive integer
                    if (numericValue === '' || /^\d+$/.test(numericValue)) {
                      setDonationForm({ ...donationForm, Quantity: numericValue });
                    }
                  }}
                  placeholder="Quantity"
                  placeholderTextColor="#999"
                  style={[
                    styles.input,
                    focusedInput === "Quantity" && styles.inputFocused,
                  ]}
                  onFocus={() => handleFocus("Quantity")}
                  onBlur={handleBlur}
                  keyboardType="numeric"
                />
              </View>


              <View style={styles.inputGroup}>
                <Text style={styles.label}>Laboratory:</Text>
                <TextInput
                  value={donationForm.Laboratory}
                  onChangeText={(text) =>
                    setDonationForm({ ...donationForm, Laboratory: text })
                  }
                  placeholder="Laboratory"
                  placeholderTextColor="#999"
                  style={[
                    styles.input,
                    focusedInput === "laboratory" && styles.inputFocused,
                  ]}
                  onFocus={() => handleFocus("laboratory")}
                  onBlur={handleBlur}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Lab Country:</Text>
                <TextInput
                  value={donationForm.LaboratoryCountry}
                  onChangeText={(text) =>
                    setDonationForm({ ...donationForm, LaboratoryCountry: text })
                  }
                  placeholder="Laboratory Country"
                  placeholderTextColor="#999"
                  style={[
                    styles.input,
                    focusedInput === "LaboratoryCountry" && styles.inputFocused,
                  ]}
                  onFocus={() => handleFocus("LaboratoryCountry")}
                  onBlur={handleBlur}
                />
              </View>



              <View style={styles.inputGroup}>
                <Text style={styles.label}>Purpose:</Text>
                <TextInput
                  value={donationForm.DonationPurpose}
                  onChangeText={(text) =>
                    setDonationForm({ ...donationForm, DonationPurpose: text })
                  }
                  placeholder="Donation Purpose"
                  placeholderTextColor="#999"
                  style={[
                    styles.input,
                    focusedInput === "DonationPurpose" && styles.inputFocused,
                  ]}
                  onFocus={() => handleFocus("DonationPurpose")}
                  onBlur={handleBlur}
                />
              </View>


              {/* Conditionally Render the Scanned QR inputs after optaing the data */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>LOT#:</Text>
                {showScannedInputs && (
                  <TextInput
                    value={donationForm.LOT}
                    onChangeText={(text) =>
                      setDonationForm({ ...donationForm, LOT: text })
                    }
                    placeholder="Lot#"
                    placeholderTextColor="#999"
                    style={styles.input}
                    editable={true}
                  />
                )}
              </View>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>EXP:</Text>
                {showScannedInputs && (
                  <TextInput
                    value={donationForm.ExpiryDate}
                    onChangeText={(text) =>
                      setDonationForm({ ...donationForm, ExpiryDate: text })
                    }
                    placeholder="Exp"
                    placeholderTextColor="#999"
                    style={styles.input}
                    editable={true}
                  />
                )}
              </View>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>GTIN:</Text>
                {showScannedInputs && (
                  <TextInput
                    value={donationForm.GTIN}
                    onChangeText={(text) =>
                      setDonationForm({ ...donationForm, GTIN: text })
                    }
                    placeholder="Gtin"
                    placeholderTextColor="#999"
                    style={styles.input}
                    editable={true}
                  />
                )}
              </View>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Serial:</Text>
                {showScannedInputs && (
                  <TextInput
                    value={donationForm.Serial}
                    onChangeText={(text) =>
                      setDonationForm({ ...donationForm, Serial: text })
                    }
                    placeholder="Serial"
                    placeholderTextColor="#999"
                    style={styles.input}
                    editable={true}
                  />
                )}
              </View>

              <SuccessMessage visible={successVisible} />

              <View style={styles.errorTextContainer}>
                <ErrorMessage visible={errorVisible} message={errorMessage} />
              </View>

              <TouchableOpacity
                style={styles.submitButton}
                onPress={handleSubmit}
              >
                <Text style={styles.submitButtonText}>Submit</Text>
              </TouchableOpacity>
            </View>

            {/* <Text style={styles.scanText}>Scan</Text> */}
            <Modal visible={scanBarcodeVisible} animationType="slide">
              <TouchableWithoutFeedback onPress={dismissKeyboard}>
                <View style={styles.cameraContainer}>
                  <Camera
                    style={styles.camera}
                    type={type}
                    flashMode={flashMode}
                    ref={cameraRef}
                    zoom={zoom}
                    autoFocus={Camera.Constants.AutoFocus.on}
                    onTouchStart={handlePinchGesture}
                    onTouchMove={handlePinchGesture}
                    onTouchEnd={() => previousZoomRef.current = null}
                    onBarCodeScanned={handleBarcodeScanned}
                  >
                    <View style={styles.buttonContainer}>
                      <TouchableOpacity style={styles.iconButton} onPress={flipCamera}>
                        <MaterialCommunityIcons name="camera-switch" size={24} color="white" />
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.iconButton} onPress={toggleFlash}>
                        <MaterialCommunityIcons name={flashMode === Camera.Constants.FlashMode.off ? 'flash-off' : 'flash'} size={24} color="white" />
                      </TouchableOpacity>
                    </View>
                  </Camera>

                  <View style={styles.zoomButtonsContainer}>
                    <TouchableOpacity style={styles.zoomInButton} onPress={zoomIn}>
                      <Text style={styles.text}>+</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.zoomOutButton} onPress={zoomOut}>
                      <Text style={styles.text}>-</Text>
                    </TouchableOpacity>
                  </View>

                  <TouchableOpacity
                    onPress={handleCloseBarcodeModal}
                    style={styles.closeButton}
                  >
                    <AntDesign name="close" size={24} color="#0096FF" />
                  </TouchableOpacity>
                </View>
              </TouchableWithoutFeedback>
            </Modal>
          </View>
        </TouchableWithoutFeedback>
      </ScrollView>
      <MaterialCommunityIcons
        name="qrcode-scan"
        size={windowWidth * 0.1}
        style={styles.scanIcon}
        onPress={handleScanBarcode}
      />
    </>
  );
}

const styles = StyleSheet.create({
  scrollViewContent: {
    flexGrow: 1,
    alignItems: "center",
    paddingBottom: 80,
    paddingTop: 25,
    // paddingLeft: 10,
    borderWidth: 2,
    // borderColor: 'blue'
  },
  container: {
    // flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    // backgroundColor: "#222831",
    position: "relative",
    padding: 0,
    // borderWidth: 2,
    // borderColor: 'red',
    marginBottom: 20
  },
  datePicker: {
    width: "100%",
  },
  input: {
    color: "#fff",
    height: windowHeight * 0.07,
    width: windowWidth * 0.8,
    marginVertical: windowHeight * 0.01,
    borderWidth: 1,
    borderRadius: 20,
    borderColor: "#fff",
    padding: 15,
  },
  placeholder: {
    color: "#fff",
  },
  inputFocused: {
    borderColor: "#0096FF",
  },

  inputGroup: {
    marginBottom: 20,
  },
  pickerContainer: {
    borderColor: '#fff',
    borderWidth: 1,
    borderRadius: 20,
    marginTop: 10,
    height: windowHeight * 0.07,
  },
  // pickerContainer: {
  //   height: windowHeight * 0.07,
  //   marginTop: 10,
  //   marginBottom: 10,
  //   // paddingLeft: 15,
  //   paddingBottom: 20,
  //   borderWidth: 1,
  //   borderRadius: 20,
  //   borderColor: '#fff'
  // },
  picker: {
    color: '#fff',
    // height: 3,
    width: '100%',
    borderRadius: 20,
    // paddingBottom:50
  },
  pickerItem: {
    color: '#fff',
    fontSize: 16,
  },

  label: {
    color: "#fff",
    marginRight: 10,
    fontSize: 16,
    fontWeight: "bold",
  },
  successMessage: {
    backgroundColor: "#00a651",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 8,
    borderRadius: 5,
    marginTop: 10,
  },
  successText: {
    color: "white",
    fontWeight: "bold",
    marginLeft: 5,
  },
  errorTextContainer: {
    alignItems: "center",
    color: "red",
    fontWeight: "bold",
    marginTop: 5,
  },
  errorText: {
    color: "red",
    fontWeight: "bold",
    marginLeft: 5,
    marginTop: 5,
  },
  closeButton: {
    position: "absolute",
    top: windowHeight * 0.05,
    right: windowWidth * 0.05,
    zIndex: 1,
  },
  scanText: {
    position: "absolute",
    color: "#0096FF",
    fontSize: 20,
    bottom: windowHeight * 0.06,
    right: windowWidth * 0.1 + 10,
    zIndex: 1,
    fontFamily: "Roboto",
  },
  scanIcon: {
    position: "absolute",
    color: "#0096FF",
    bottom: windowHeight * 0.03,
    right: windowWidth * 0.06,
    zIndex: 1,
  },
  submitButton: {
    position: "absolute",
    bottom: -50,
    left: 100,
    zIndex: 1,
    backgroundColor: "#0096FF",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  submitButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  cameraContainer: {
    backgroundColor: "rgb(39 39 42)",
    flex: 1,
    justifyContent: "center",
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flexDirection: "column",
    justifyContent: "space-between",
    alignContent: "space-between",
    position: "absolute",
    top: 100,
    right: 7,
    gap: 10,

  },
  text: {
    fontSize: 24,
    color: "white",
  },
  iconButton: {
    padding: 10,
  },
  zoomButtonsContainer: {
    position: 'absolute',
    bottom: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  zoomInButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginHorizontal: 5,

  },
  zoomOutButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 20,
    paddingHorizontal: 22,
    paddingVertical: 10,
    marginHorizontal: 5,

  },
});

function setError(arg0: string) {
  throw new Error("Function not implemented.");
}