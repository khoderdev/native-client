import React, { useState, useEffect } from "react";
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
} from "react-native";
import { useDonationContext } from "./contexts/DonationContext";
import { Camera } from "expo-camera";
import { TouchableOpacity } from "react-native";
import { AntDesign, MaterialCommunityIcons } from "@expo/vector-icons";
import { Keyboard } from "react-native";

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
  const { donationForm, setDonationForm, addDonation } = useDonationContext();
  const [scanBarcodeVisible, setScanBarcodeVisible] = useState(false);
  const [showScannedInputs, setShowScannedInputs] = useState(false);
  const [successVisible, setSuccessVisible] = useState(false);
  const [touchedScreen, setTouchedScreen] = useState(false);
  const [errorVisible, setErrorVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [focusedInput, setFocusedInput] = useState(null);

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

  const handleSubmit = async () => {
    try {
      Keyboard.dismiss();

      // Perform form validation
      if (
        !donationForm.scannedLot ||
        !donationForm.scannedExp ||
        !donationForm.scannedGtin
      ) {
        throw new Error("you must scan the required Barcode fields.");
      }

      // Add donation
      await addDonation();

      // Clear form fields only if submission is successful
      setDonationForm({
        name: "",
        presentation: "",
        form: "",
        laboratory: "",
        scannedLot: "",
        scannedExp: "",
        scannedGtin: "",
      });

      // Display success message
      setSuccessVisible(true);

      // Hide the success message after 2 seconds
      setTimeout(() => {
        setSuccessVisible(false);
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
  const handleBarcodeScanned = ({ type, data }: { type: string; data: string }) => {
    console.log(`Barcode with type ${type} and data ${data} has been scanned!`);
    try {
      // Parse GS1 AI (Application Identifiers) from the scanned data
      const aiMatches = data.match(/\(01\)\d+\(10\)\d{4,}\(17\)\d{6}\(21\)\d{6}/);
      if (aiMatches && aiMatches.length > 0) {
        const aiData = aiMatches[0];
  
        // Extract GTIN, lot number, expiry date, and serial number from AI data
        const scannedGtinMatch = aiData.match(/\(01\)\d+/);
        const scannedLotMatch = aiData.match(/\(10\)\d{4,}/);
        const scannedExpMatch = aiData.match(/\(17\)\d{6}/);
        const scannedSerialMatch = aiData.match(/\(21\)\d{6}/);
  
        if (scannedGtinMatch && scannedLotMatch && scannedExpMatch && scannedSerialMatch) {
          const scannedGtin = scannedGtinMatch[0].substring(3);
          const scannedLot = scannedLotMatch[0].substring(4);
          const scannedExp = scannedExpMatch[0].substring(4);
          const scannedSerial = scannedSerialMatch[0].substring(4);
  
          // Log individual scanned values
          console.log("Scanned GTIN:", scannedGtin);
          console.log("Scanned Lot:", scannedLot);
          console.log("Scanned EXP:", scannedExp);
          console.log("Scanned Serial:", scannedSerial);
  
          // Update state with the scanned data
          setDonationForm({
            ...donationForm,
            scannedGtin,
            scannedLot,
            scannedExp,
            scannedSerial,
          });
  
          // Close the scan modal after scanning
          setScanBarcodeVisible(false);
          setShowScannedInputs(true);
          return;
        }
      }
      throw new Error("Failed to parse AI data from the scanned barcode.");
    } catch (error) {
      console.error("Error parsing scanned data:", error);
      // Handle error, such as displaying an error message to the user
      setErrorVisible(true);
      setErrorMessage(error.message);
    }
  };
  
  const handleScanBarcode = async () => {
    const { status } = await Camera.requestCameraPermissionsAsync();
    if (status === "granted") {
      setScanBarcodeVisible(true);
    } else {
      console.log("Camera permission denied");
    }
  };

  const handleCloseBarcodeModal = () => {
    setScanBarcodeVisible(false);
  };

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  return (
    <ScrollView
      className="bg-zinc-800"
      contentContainerStyle={styles.container}
    >
      <TouchableWithoutFeedback onPress={dismissKeyboard}>
        <View style={styles.container}>
          <View style={styles.inputsContainer}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Name:</Text>
              <TextInput
                value={donationForm.name}
                onChangeText={(text) =>
                  setDonationForm({ ...donationForm, name: text })
                }
                placeholder="Name"
                placeholderTextColor="#999"
                style={[
                  styles.input,
                  focusedInput === "name" && styles.inputFocused,
                ]}
                onFocus={() => handleFocus("name")}
                onBlur={handleBlur}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Presentation:</Text>
              <TextInput
                value={donationForm.presentation}
                onChangeText={(text) =>
                  setDonationForm({ ...donationForm, presentation: text })
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
                value={donationForm.form}
                onChangeText={(text) =>
                  setDonationForm({ ...donationForm, form: text })
                }
                placeholder="Form"
                placeholderTextColor="#999"
                style={[
                  styles.input,
                  focusedInput === "form" && styles.inputFocused,
                ]}
                onFocus={() => handleFocus("form")}
                onBlur={handleBlur}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Laboratory:</Text>
              <TextInput
                value={donationForm.laboratory}
                onChangeText={(text) =>
                  setDonationForm({ ...donationForm, laboratory: text })
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

            {/* Conditionally Render the Scanned QR inputs after optaing the data */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>LOT#:</Text>
              {showScannedInputs && (
                <TextInput
                  value={donationForm.scannedLot}
                  onChangeText={(text) =>
                    setDonationForm({ ...donationForm, scannedLot: text })
                  }
                  placeholder="Scanned Lot#"
                  placeholderTextColor="#999"
                  style={styles.input}
                  editable={false}
                />
              )}
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>EXP:</Text>
              {showScannedInputs && (
                <TextInput
                  value={donationForm.scannedExp}
                  onChangeText={(text) =>
                    setDonationForm({ ...donationForm, scannedExp: text })
                  }
                  placeholder="Scanned Exp"
                  placeholderTextColor="#999"
                  style={styles.input}
                  editable={false}
                />
              )}
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>GTIN:</Text>
              {showScannedInputs && (
                <TextInput
                  value={donationForm.scannedGtin}
                  onChangeText={(text) =>
                    setDonationForm({ ...donationForm, scannedGtin: text })
                  }
                  placeholder="Scanned Gtin"
                  placeholderTextColor="#999"
                  style={styles.input}
                  editable={false}
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

          <MaterialCommunityIcons
            name="qrcode-scan"
            size={windowWidth * 0.1}
            style={styles.scanIcon}
            onPress={handleScanBarcode}
          />
          {/* <Text style={styles.scanText}>Scan</Text> */}
          <Modal visible={scanBarcodeVisible} animationType="slide">
            <View style={styles.container}>
              <Camera
                onBarCodeScanned={handleBarcodeScanned}
                style={StyleSheet.absoluteFillObject}
              />
              <TouchableOpacity
                onPress={handleCloseBarcodeModal}
                style={styles.closeButton}
              >
                <AntDesign name="close" size={24} color="#0096FF" />
              </TouchableOpacity>
            </View>
          </Modal>

          {/* Include other components */}
          <StatusBar
            backgroundColor={Platform.OS === "ios" ? "white" : "transparent"}
          />
        </View>
      </TouchableWithoutFeedback>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    // backgroundColor: "#222831",
    position: "relative",
    padding: 10,
  },
  inputsContainer: {
    // flex: 1,
    // alignItems: 'center',
    // justifyContent: 'flex-start',
    // borderWidth: 1,
    // borderColor: "#00ffc0",
    // position: 'relative',
  },
  input: {
    color: "#fff",
    height: windowHeight * 0.05,
    width: windowWidth * 0.8,
    marginVertical: windowHeight * 0.01,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: "#fff",
    padding: 10,
  },
  placeholder: {
    color: "#fff",
  },
  inputFocused: {
    borderColor: "#0096FF",
  },

  inputGroup: {
    flexDirection: "column",
    alignItems: "flex-start",
    // marginBottom: 5,
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
    color: "#0096FF",
    bottom: windowHeight * -0.3,
    left: windowWidth * 0.4,
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
});

function setError(arg0: string) {
  throw new Error("Function not implemented.");
}
