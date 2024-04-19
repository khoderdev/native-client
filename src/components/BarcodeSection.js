import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Button,
  ScrollView,
  TouchableOpacity,
  Image,
  Modal,
  TextInput,
  StyleSheet,
} from "react-native";
import { Camera } from "expo-camera";
import MedicationDetailsSection from "./MedicationDetailsSection";
import { useDonationContext } from "../app/contexts/DonationContext";

const BarcodeSection = ({ setModalVisible }) => {
  const {
    donationForm,
    setDonationForm,
    selectedDrugName,
    setSelectedDrugName,
    barcodeData,
    handleBarcodeScanned,
    handleAddToDonation,
    scannedData,
    setScannedData,
    drugNames,
    fetchDrugNames,
  } = useDonationContext();
  const [cameraVisible, setCameraVisible] = useState(false);
  const [focusedInput, setFocusedInput] = useState("");

  useEffect(() => {
    if (barcodeData && barcodeData.length > 0) {
      setScannedData(barcodeData);
    }
  }, [barcodeData]);

  useEffect(() => {
    // Fetch drug names when component mounts
    fetchDrugNames();
  }, []); // Empty dependency array ensures it fetches only once when the component mounts

  const openCamera = () => {
    setCameraVisible(true);
  };

  const handleBarcodeScannedLocal = (data) => {
    // Update barcodeData in context
    handleBarcodeScanned(data);
    // Close camera modal
    setCameraVisible(false);
    // Show the barcode modal
    setModalVisible(true);
  };

  // Handler for input focus
  const handleFocus = (inputName) => {
    setFocusedInput(inputName);
  };

  // Handler for input blur
  const handleBlur = () => {
    setFocusedInput("");
  };

  const handleDrugNameChange = (value) => {
    // Update the selected drug name
    setSelectedDrugName(value);
  };

  console.log("Scanned data:", scannedData);
  console.log("Camera visible:", cameraVisible);
  console.log("Donation form:", donationForm); // Log donation form to see if drugNames are fetched
  console.log("Selected drug name:", selectedDrugName); // Log selected drug name

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={openCamera}>
        <Image
          source={require("../../assets/2d.png")}
          style={styles.barcodeImage}
        />
      </TouchableOpacity>

      <Modal visible={cameraVisible}>
        <Camera
          onBarCodeScanned={handleBarcodeScannedLocal}
          style={{ flex: 1 }}
        />
        <Button title="Close" onPress={() => setCameraVisible(false)} />
      </Modal>

      {scannedData && scannedData.length > 0 && (
        <Modal visible={true}>
          <ScrollView>
            {scannedData.map((data, index) => (
              <View key={index} style={styles.barcodeDataContainer}>
                <Text style={styles.label}>GTIN:</Text>
                <TextInput
                  style={styles.input}
                  value={data.GTIN}
                  onChangeText={(value) =>
                    setScannedData((prevData) => {
                      const newData = [...prevData];
                      newData[index].GTIN = value;
                      return newData;
                    })
                  }
                />
                <Text style={styles.label}>LOT:</Text>
                <TextInput
                  style={styles.input}
                  value={data.LOT}
                  onChangeText={(value) =>
                    setScannedData((prevData) => {
                      const newData = [...prevData];
                      newData[index].LOT = value;
                      return newData;
                    })
                  }
                />
                <Text style={styles.label}>Expiry Date:</Text>
                <TextInput
                  style={styles.input}
                  value={data.ExpiryDate}
                  onChangeText={(value) =>
                    setScannedData((prevData) => {
                      const newData = [...prevData];
                      newData[index].ExpiryDate = value;
                      return newData;
                    })
                  }
                />
                <Text style={styles.label}>Serial:</Text>
                <TextInput
                  style={styles.input}
                  value={data.Serial}
                  onChangeText={(value) =>
                    setScannedData((prevData) => {
                      const newData = [...prevData];
                      newData[index].Serial = value;
                      return newData;
                    })
                  }
                />

                {index === scannedData.length - 1 && (
                  <TouchableOpacity onPress={openCamera}>
                    <Text style={styles.addMoreButton}>Add More</Text>
                  </TouchableOpacity>
                )}
              </View>
            ))}
            <MedicationDetailsSection
              drugNames={drugNames}
              selectedDrugName={selectedDrugName}
              handleDrugNameChange={handleDrugNameChange}
              donationForm={donationForm}
              setDonationForm={setDonationForm}
              focusedInput={focusedInput}
              handleFocus={handleFocus}
              handleBlur={handleBlur}
            />
            <Button title="Add to donation" onPress={handleAddToDonation} />
          </ScrollView>
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  barcodeImage: {
    width: 100,
    height: 100,
  },
  barcodeDataContainer: {
    marginBottom: 20,
  },
  label: {
    fontWeight: "bold",
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  addMoreButton: {
    color: "blue",
    textDecorationLine: "underline",
    marginBottom: 10,
  },
});

export default BarcodeSection;
