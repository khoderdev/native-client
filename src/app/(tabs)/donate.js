import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, Button } from "react-native";
import BarcodeSection from "../../components/BarcodeSection";
import Donor from "../../components/Donor";
import { useDonationContext } from "../contexts/DonationContext";

const Donate = () => {
  const {
    donationForm,
    setDonationForm,
    fetchDonors,
    donors,
    handleSubmit,
    recipients,
    selectedDonorId,
    setSelectedDonorId,
    setModalVisible,
    setScannedData,
  } = useDonationContext();

  // State for barcode
  const [barcodeData, setBarcodeData] = useState(null);

  // State for recipient
  const [selectedRecipient, setSelectedRecipient] = useState("");

  // State for focused input
  const [focusedInput, setFocusedInput] = useState("");

  // Handler for input focus
  const handleFocus = (inputName) => {
    setFocusedInput(inputName);
  };

  // Handler for input blur
  const handleBlur = () => {
    setFocusedInput("");
  };

  // Fetch donors when component mounts
  useEffect(() => {
    fetchDonors();
  }, []);

  // Handler for barcode scanned
  const handleBarcodeScanned = (data) => {
    console.log("Scanned data:", data);
    setBarcodeData(data);
  };

  // Handler for submit button pressed
  const handlePressSubmitButton = () => {
    console.log("Submit button pressed");
    handleSubmit();
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.innerContainer}>
        <Text style={styles.title}>Donate Medication</Text>

        {/* Donor Section */}
        <Donor
          selectedDonorId={selectedDonorId}
          setSelectedDonorId={setSelectedDonorId}
          donors={donors}
          selectedRecipient={selectedRecipient}
          handleRecipientChange={(value) => setSelectedRecipient(value)}
          recipients={recipients}
          donationForm={donationForm}
          setDonationForm={setDonationForm}
          focusedInput={focusedInput}
          handleFocus={handleFocus}
          handleBlur={handleBlur}
        />

        {/* Barcode Section */}
        <BarcodeSection
          barcodeData={barcodeData}
          handleBarcodeScanned={handleBarcodeScanned}
          setBarcodeData={setBarcodeData}
          setModalVisible={setModalVisible}
          setScannedData={setScannedData}
        />

        {/* Submit Button */}
        <View style={styles.submitButtonContainer}>
          <Button title="Submit" onPress={handlePressSubmitButton} />
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  innerContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  submitButtonContainer: {
    marginTop: 20,
    marginBottom: 50,
  },
});

export default Donate;
