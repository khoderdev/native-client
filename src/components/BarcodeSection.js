import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Button,
  ScrollView,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Image,
  Modal,
  TextInput,
  StyleSheet,
  Dimensions,
} from "react-native";
import { Camera } from "expo-camera";
import MedicationDetailsSection from "./MedicationDetailsSection";
import { useDonationContext } from "../app/contexts/DonationContext";
import { AntDesign } from "@expo/vector-icons";
import * as Permissions from 'expo-permissions';


const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

const BarcodeSection = ({
  setModalVisible,
  drugNames,
  fetchDrugNames,
  handleFieldChange,
}) => {
  const {
    donationForm,
    setDonationForm,
    scannedData,
    setScannedData,
    handleAddToDonation,
    response,
    setLOT,
    setGTIN,
    setExpiryDate,
    setSerial,
    handleBarcodeScanned,
  } = useDonationContext();

 useEffect(() => {
  setLOT((response && response.LOT) || donationForm.LOT);
  setExpiryDate((response && response.ExpiryDate) || donationForm.ExpiryDate);
  setGTIN((response && response.GTIN) || donationForm.GTIN);
  setSerial((response && response.Serial) || donationForm.Serial);
}, [response, donationForm]);

  const [cameraVisible, setCameraVisible] = useState(false);
  const [drugCount, setDrugCount] = useState(1);
  const [selectedDrugNames, setSelectedDrugNames] = useState([""]);
  const [focusedInput, setFocusedInput] = useState("");

  const [addMoreButtonHover, setAddMoreButtonHover] = useState(false);
  const [addToDonationButtonHover, setAddToDonationButtonHover] =
    useState(false);
  const [addMoreButtonPressed, setAddMoreButtonPressed] = useState(false);
  const [addToDonationButtonPressed, setAddToDonationButtonPressed] =
    useState(false);
    const [hasCameraPermission, setHasCameraPermission] = useState(null);
   

useEffect(() => {
  (async () => {
    const { status } = await Camera.requestCameraPermissionsAsync();
    setHasCameraPermission(status === 'granted');
  })();
}, []);
    const openCamera = () => {
      if (hasCameraPermission) {
        setCameraVisible(true);
      } else {
        alert('Sorry, we need camera permissions to make this work!');
      }
    };
  const handleBarcodeScannedLocal = (data) => {
    handleBarcodeScanned(data);
    setCameraVisible(false);
    setModalVisible(true);
  };

  const resetState = () => {
    setScannedData([]);
    setDonationForm({ ...donationForm, LOT: "", ExpiryDate: "", GTIN: "" });
    setModalVisible(false);
  };

  const handleAddMore = () => {
    setCameraVisible(true);
    setDrugCount((prevCount) => prevCount + 1);
    setSelectedDrugNames((prevNames) => [...prevNames, ""]);
  };

  const handleManualAddMore = () => {
    setDrugCount((prevCount) => prevCount + 1);
    setSelectedDrugNames((prevNames) => [...prevNames, ""]);
    setModalVisible(true);
  };

  const handleFocus = (inputName) => {
    setFocusedInput(inputName);
  };

  const handleBlur = () => {
    setFocusedInput("");
  };

  const handleDrugNameChange = (value, index) => {
    setSelectedDrugNames((prevNames) => {
      const updatedNames = [...prevNames];
      updatedNames[index] = value;
      return updatedNames;
    });
  };
  const handleManualDataEntry = () => {
  setModalVisible(true);
};

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.barcodeContainer}>
        <TouchableOpacity onPress={openCamera} activeOpacity={0.6}>
          <Image
            source={require("../../assets/2d.png")}
            style={{
              width: 240,
              height: 110,
              resizeMode: "contain",
            }}
          />
        </TouchableOpacity>

        <TouchableOpacity onPress={handleManualDataEntry} activeOpacity={0.6}>
          <Image
            source={require("../../assets/pressHere.png")}
            style={{
              width: 200,
              height: 50,
              resizeMode: "contain",
            }}
          />
        </TouchableOpacity>
      </View>

      <Modal visible={cameraVisible}>
        <Camera
          onBarCodeScanned={handleBarcodeScannedLocal}
          style={{ flex: 1 }}
        />
        <TouchableOpacity
          style={styles.closeButton}
          title="Close"
          onPress={() => setCameraVisible(false)}
        >
          <AntDesign name="close" size={24} color="#00a651" />
        </TouchableOpacity>
      </Modal>

      {scannedData && scannedData.length > 0 && (
        <Modal visible={true}>
          <ScrollView>
            <View style={styles.innerContainer}>
              <TouchableOpacity
                onPress={resetState}
                style={styles.closeButton}
                title="Close"
              >
                <AntDesign name="close" size={24} color="#00a651" />
              </TouchableOpacity>

              {[...Array(drugCount)].map((_, index) => (
                <View key={index} style={styles.mainRoundedContainer}>
                  <Text style={styles.drugTopText}>Drug {index + 1}</Text>
                  {scannedData && scannedData[index] && (
                    <View style={styles.roundedContainer}>
                      <Text style={styles.topText}>2d Barcode</Text>
                      <Text style={styles.label}>GTIN</Text>
                      <TextInput
                        style={[styles.input, { textAlign: "center" }]}
                        value={scannedData[index].GTIN}
                        onChangeText={(value) =>
                          handleFieldChange(value, index, "GTIN")
                        }
                      />
                      <Text style={styles.label}>LOT/Batch Number</Text>
                      <TextInput
                        style={[styles.input, { textAlign: "center" }]}
                        value={scannedData[index].LOT}
                        onChangeText={(value) =>
                          handleFieldChange(value, index, "LOT")
                        }
                      />
                      <Text style={styles.label}>Expiry Date</Text>
                      <TextInput
                        style={[styles.input, { textAlign: "center" }]}
                        value={scannedData[index].ExpiryDate}
                        onChangeText={(value) =>
                          handleFieldChange(value, index, "ExpiryDate")
                        }
                      />
                      <Text style={styles.label}>Serial Number</Text>
                      <TextInput
                        style={[styles.input, { textAlign: "center" }]}
                        value={scannedData[index].Serial}
                        onChangeText={(value) =>
                          handleFieldChange(value, index, "Serial")
                        }
                      />
                    </View>
                  )}

                  <MedicationDetailsSection
                    drugNames={drugNames}
                    selectedDrugName={selectedDrugNames[index]}
                    handleDrugNameChange={(value) =>
                      handleDrugNameChange(value, index)
                    }
                    handleFieldChange={handleFieldChange}
                    donationForm={donationForm}
                    setDonationForm={setDonationForm}
                    focusedInput={focusedInput}
                    handleFocus={handleFocus}
                    handleBlur={handleBlur}
                  />
                </View>
              ))}

              <View style={styles.bottomButtonsContainer}>
                <TouchableWithoutFeedback
                  onPress={handleAddMore}
                  onMouseEnter={() => setAddMoreButtonHover(true)}
                  onMouseLeave={() => setAddMoreButtonHover(false)}
                  onPressIn={() => setAddMoreButtonPressed(true)}
                  onPressOut={() => setAddMoreButtonPressed(false)}
                >
                  <View
                    style={[
                      styles.addMoreButton,
                      addMoreButtonHover && styles.addMoreButtonHover,
                      addMoreButtonPressed && styles.addMoreButtonPressed,
                    ]}
                  >
                    <Text
                      style={[
                        styles.addMoreBtnText,
                        addMoreButtonPressed && styles.buttonTextPressed,
                      ]}
                    >
                      Add More
                    </Text>
                  </View>
                </TouchableWithoutFeedback>

                <TouchableWithoutFeedback
                  onPress={handleAddToDonation}
                  onMouseEnter={() => setAddToDonationButtonHover(true)}
                  onMouseLeave={() => setAddToDonationButtonHover(false)}
                  onPressIn={() => setAddToDonationButtonPressed(true)}
                  onPressOut={() => setAddToDonationButtonPressed(false)}
                >
                  <View
                    style={[
                      styles.addToDonationButton,
                      addToDonationButtonHover &&
                        styles.addToDonationButtonHover,
                      addToDonationButtonPressed &&
                        styles.addToDonationButtonPressed,
                    ]}
                  >
                    <Text
                      style={[
                        styles.addToDonationBtnText,
                        addToDonationButtonPressed &&
                          styles.addToDonationBtnTextPressed,
                      ]}
                    >
                      Add to donation
                    </Text>
                  </View>
                </TouchableWithoutFeedback>
              </View>
            </View>
          </ScrollView>
        </Modal>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  innerContainer: {
    paddingHorizontal: 10,
    paddingTop: 60,
  },

  roundedContainer: {
    width: "auto",
    borderWidth: 1,
    borderColor: "#999",
    borderRadius: 20,
    padding: 10,
    paddingTop: 20,
    position: "relative",
    marginBottom: 20,
    marginVertical: 10,
  },
  mainRoundedContainer: {
    width: "auto",
    borderWidth: 1.5,
    borderColor: "#00a651",
    borderRadius: 20,
    padding: 10,
    paddingTop: 20,
    position: "relative",
    marginBottom: 20,
    marginVertical: 10,
  },
  topText: {
    backgroundColor: "#fff",
    position: "absolute",
    top: -15,
    paddingHorizontal: 10,
    alignSelf: "center",
    fontSize: 20,
    fontWeight: "bold",
    color: "#999",
  },
  drugTopText: {
    backgroundColor: "#fff",
    position: "absolute",
    top: -15,
    paddingHorizontal: 10,
    alignSelf: "center",
    fontSize: 20,
    fontWeight: "bold",
    color: "#121212",
  },

  barcodeDataContainer: {
    marginBottom: 20,
  },

  barcodeContainer: {
    width: "auto",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    marginVertical: 0,
  },

  label: {
    color: "#999",
    marginRight: 10,
    fontSize: 16,
    fontWeight: "bold",
  },

  input: {
    color: "#000",
    height: windowHeight * 0.06,
    width: windowWidth * 0.8,
    marginVertical: windowHeight * 0.01,
    borderWidth: 1,
    borderRadius: 20,
    borderColor: "#00a651",
    padding: 15,
  },

  bottomButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    marginBottom: 20,
    gap: 8,
  },

  addMoreButton: {
    width: 150,
    zIndex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    paddingHorizontal: 44,
    paddingVertical: 10,
    borderColor: "#00a651",
    borderRadius: 60,
    borderWidth: 0.5,
  },
  addMoreButtonHover: {
    backgroundColor: "#00a651",
  },
  addMoreBtnText: {
    color: "#00a651",
  },
  addToDonationButton: {
    width: 150,
    zIndex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: "#00a651",
    borderRadius: 60,
  },
  addToDonationButtonHover: {
    backgroundColor: "#00a651",
  },
  addToDonationBtnText: {
    color: "#fff",
  },

  addMoreButtonPressed: {
    backgroundColor: "#008f47",
  },
  addToDonationButtonPressed: {
    backgroundColor: "#fff",
    borderColor: "#008f47",
    borderWidth: 1,
    borderRadius: 60,
  },
  buttonTextPressed: {
    color: "#fff",
  },
  addToDonationBtnTextPressed: {
    color: "#008f47",
  },

  closeButton: {
    position: "absolute",
    top: windowHeight * 0.03,
    right: windowWidth * 0.05,
    zIndex: 1,
  },
});

export default BarcodeSection;
