import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Button,
  TouchableWithoutFeedback,
} from "react-native";
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

  const [isSubmitPressed, setIsSubmitPressed] = useState(false);

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
    // setIsSubmitPressed(true);
    handleSubmit();
    setIsSubmitPressed(true);

    // Simulate button release after 200 milliseconds
    setTimeout(() => {
      setIsSubmitPressed(false);
    }, 200);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.innerContainer}>
        {/* Donor Section */}
        <View style={styles.roundedContainer}>
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
        </View>

        {/* Barcode Section */}
        <BarcodeSection
          barcodeData={barcodeData}
          handleBarcodeScanned={handleBarcodeScanned}
          setBarcodeData={setBarcodeData}
          setModalVisible={setModalVisible}
          setScannedData={setScannedData}
        />
        {/* Submit Button */}
        <TouchableWithoutFeedback
          onPress={handlePressSubmitButton}
          onPressIn={() => setIsSubmitPressed(true)}
          onPressOut={() => setIsSubmitPressed(false)}
        >
          <View
            style={[
              styles.submitButton,
              isSubmitPressed && styles.submitButtonPressed,
            ]}
          >
            <Text
              style={[
                styles.submitButtonText,
                isSubmitPressed && styles.submitButtonTextPressed,
              ]}
            >
              Submit
            </Text>
          </View>
        </TouchableWithoutFeedback>
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
    // paddingTop: 20,
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
    // marginVertical: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },

  submitButtonText: {
    color: "#00a651",
    fontSize: 16,
    fontWeight: "bold",
  },

  submitButton: {
    width: 100,
    alignSelf: "center",
    zIndex: 1,
    paddingHorizontal: 23,
    paddingVertical: 10,
    borderWidth: 1,
    borderRadius: 60,
    borderColor: "#00a651",
    marginTop: 10,
  },
  submitButtonPressed: {
    backgroundColor: "#00a651",
  },
  submitButtonTextPressed: {
    color: "#fff", // Change to the desired text color when pressed
  },
});

export default Donate;
