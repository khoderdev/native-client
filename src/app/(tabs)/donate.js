import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableWithoutFeedback,
} from "react-native";
import BarcodeSection from "../../components/BarcodeSection";
import Donor from "../../components/Donor";
import MedicationDetailsSection from "../../components/MedicationDetailsSection";
import {
  DonationProvider,
  useDonationContext,
} from "../contexts/DonationContext";
import { useContext } from "react";

const Donate = () => {
  const {
    donationForm,
    setDonationForm,
    fetchDonors,
    fetchRecipients,
    donors,
    handleSubmit,
    recipients,
    setRecipients,
    selectedRecipient,
    setSelectedRecipient,
    selectedDonorId,
    setSelectedDonorId,
    setSelectedDrugName,
    handleAddToDonation,
    scannedData,
    setScannedData,
    drugNames,
    fetchDrugNames,
    setModalVisible,
    focusedInput,
    DonationPurpose,
    setDonationPurpose,
    handleFocus,
    handleBlur,
    handleBarcodeScanned,
    handleFieldChange,
  } = useDonationContext();
const [forms, setForms] = useState([{}]);
  const [barcodeData, setBarcodeData] = useState([]); // Define barcodeData state in Donate component
const addForm = () => {
  setForms([...forms, {}]);
};

const DonationForm = () => {
  const { donationForm, setDonationForm } = useDonationContext();

  const handleInputChange = (name, value) => {
    setDonationForm({
      ...donationForm,
      [name]: value,
    });
  };

  return (
    <View>
     
      {/* Add more fields as needed */}
      <BarcodeSection
            setModalVisible={setModalVisible}
            donationForm={donationForm}
            setDonationForm={setDonationForm}
            setSelectedDrugName={setSelectedDrugName}
            barcodeData={barcodeData} // Pass barcodeData as prop
            setBarcodeData={setBarcodeData} // Pass setBarcodeData as prop
            handleBarcodeScanned={handleBarcodeScanned}
            handleAddToDonation={handleAddToDonation}
            scannedData={scannedData}
            setScannedData={setScannedData}
            drugNames={drugNames}
            fetchDrugNames={fetchDrugNames}
            handleFieldChange={handleFieldChange}
          />

          {/* Medication Details Section */}
          <MedicationDetailsSection
            selectedDrugName={donationForm.selectedDrugName}
            handleDrugNameChange={(value) => {
              console.log("Selected drug name changed:", value);
              setDonationForm({ ...donationForm, selectedDrugName: value });
            }}
            donationForm={donationForm}
            setDonationForm={setDonationForm}
            focusedInput={focusedInput}
            handleFocus={handleFocus}
            handleBlur={handleBlur}
            drugNames={drugNames}
            handleFieldChange={handleFieldChange}
          />

    </View>
  );
};
  // Fetch donors when component mounts
  useEffect(() => {
    fetchDonors();
    fetchRecipients();
  }, []);

  // Handler for submit button pressed
  // Handler for submit button pressed
  const handlePressSubmitButton = () => {
    console.log("Submit button pressed. Donation Form:", donationForm);
    handleSubmit();

    // Reset form fields after submission
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
      scannedData: [],
      medicationDetails: [],
      selectedDrugName: "",
      selectedRecipient: "",
    });
  };
  
  console.log("Rendering Donate component. Donation Form:", donationForm);

  return (
    <DonationProvider>
      <ScrollView style={styles.container}>
        <View style={styles.innerContainer}>
          {/* Donor Section */}
          <View style={styles.roundedContainer}>
            <Donor
              selectedDonorId={selectedDonorId}
              setSelectedDonorId={setSelectedDonorId}
              donors={donors}
              selectedRecipient={selectedRecipient}
              handleRecipientChange={(value) => {
                console.log("Recipient changed:", value);
                setSelectedRecipient(value);
              }}
              recipients={recipients}
              setSelectedRecipient={setSelectedRecipient}
              setDonationPurpose={setDonationPurpose}
              donationForm={donationForm}
              setDonationForm={setDonationForm}
              focusedInput={focusedInput}
              handleFocus={handleFocus}
              handleBlur={handleBlur}
            />
          </View>

          {/* Barcode Section */}
          <BarcodeSection
            setModalVisible={setModalVisible}
            donationForm={donationForm}
            setDonationForm={setDonationForm}
            setSelectedDrugName={setSelectedDrugName}
            barcodeData={barcodeData} // Pass barcodeData as prop
            setBarcodeData={setBarcodeData} // Pass setBarcodeData as prop
            handleBarcodeScanned={handleBarcodeScanned}
            handleAddToDonation={handleAddToDonation}
            scannedData={scannedData}
            setScannedData={setScannedData}
            drugNames={drugNames}
            fetchDrugNames={fetchDrugNames}
            handleFieldChange={handleFieldChange}
          />

          {/* Medication Details Section */}
          <MedicationDetailsSection
            selectedDrugName={donationForm.selectedDrugName}
            handleDrugNameChange={(value) => {
              console.log("Selected drug name changed:", value);
              setDonationForm({ ...donationForm, selectedDrugName: value });
            }}
            donationForm={donationForm}
            setDonationForm={setDonationForm}
            focusedInput={focusedInput}
            handleFocus={handleFocus}
            handleBlur={handleBlur}
            drugNames={drugNames}
            handleFieldChange={handleFieldChange}
          />

<View>
    {forms.map((form, index) => (
      <DonationForm key={index} />
    ))}
    <TouchableWithoutFeedback onPress={addForm}>
      <View style={styles.addButton}>
        <Text style={styles.addButtonText}>Add</Text>
      </View>
    </TouchableWithoutFeedback>
    <TouchableWithoutFeedback onPress={handlePressSubmitButton}>
      <View style={styles.submitButton}>
        <Text style={styles.submitButtonText}>Submit</Text>
      </View>
    </TouchableWithoutFeedback>
  </View>

        </View>
      </ScrollView>
    </DonationProvider>
    
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  innerContainer: {
    paddingHorizontal: 20,
  },
  roundedContainer: {
    borderWidth: 1,
    borderColor: "#999",
    borderRadius: 20,
    padding: 10,
    paddingTop: 20,
    position: "relative",
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
    paddingHorizontal: 23,
    paddingVertical: 10,
    borderWidth: 1,
    borderRadius: 60,
    borderColor: "#00a651",
    marginTop: 10,
  },
  addButton: {
    width: 100,
    alignSelf: "center",
    paddingHorizontal: 23,
    paddingVertical: 10,
    borderWidth: 1,
    borderRadius: 60,
    borderColor: "#00a651",
    marginTop: 10,
  },
  addButtonText: {
    color: "#00a651",
    fontSize: 16,
    fontWeight: "bold",
    alignSelf: "center",
  },
});

export default Donate;
