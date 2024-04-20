import React, { createContext, useContext, useEffect, useState } from "react";
import { Alert, Keyboard } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const DonationContext = createContext();

export const useDonationContext = () => useContext(DonationContext);

export const DonationProvider = ({ children }) => {
  const [donations, setDonations] = useState([]);
  const [donors, setDonors] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [selectedDonorId, setSelectedDonorId] = useState("");
  const [recipients, setRecipients] = useState([]);
  const [drugs, setDrugs] = useState([]);
  const [drugNames, setDrugNames] = useState([]);
  const [selectedDrugName, setSelectedDrugName] = useState("");
  const [barcodeData, setBarcodeData] = useState([]);
  const [cameraVisible, setCameraVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [scanBarcodeVisible, setScanBarcodeVisible] = useState(false);
  const [errorVisible, setErrorVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [scannedData, setScannedData] = useState(null);
  const [resetForm, setResetForm] = useState(false);
  const [successVisible, setSuccessVisible] = useState(false);
  const [confirmationVisible, setConfirmationVisible] = useState(false);

  const [donationForm, setDonationForm] = useState({
    DonorId: "",
    DrugId: "",
    DonorName: "",
    DonorType: "Individual",
    selectedDrugName: "",
    medicationDetails: [],
    DrugName: "",
    Quantity: "",
    Presentation: "",
    Form: "",
    DonationPurpose: "",
    DonationDate: new Date().toISOString(),
    ProductionDate: "2024-03-31",
    Laboratory: "",
    LaboratoryCountry: "",
    LOT: "",
    ExpiryDate: "",
    GTIN: "",
    Serial: "",
  });

  // Function to toggle edit mode
  const toggleEditMode = () => {
    setEditMode((prevMode) => !prevMode);
  };

  useEffect(() => {
    const loadDonations = async () => {
      try {
        const storedDonations = await AsyncStorage.getItem("donations");
        if (storedDonations) {
          setDonations(JSON.parse(storedDonations));
        }
      } catch (error) {
        handleAsyncStorageError(
          "Error loading donations from AsyncStorage:",
          error
        );
      }
    };

    const fetchData = async () => {
      try {
        // Fetch recipients, drugs, drug names, and donors
        await Promise.all([
          fetchRecipients(),
          fetchDrugs(),
          fetchDrugNames(),
          fetchDonors(),
        ]);
      } catch (error) {
        handleFetchDataError(error);
      }
    };

    loadDonations();
    fetchData();
  }, []);

  const fetchDrugNames = async () => {
    try {
      const response = await axios.get("http://1.1.1.250:3000/drugs/all");
      const drugsData = response.data;
      const drugNames = drugsData.map((drug) => drug.DrugName);

      setDrugNames(drugNames);
      if (drugNames.length > 0) {
        setSelectedDrugName();
        setDonationForm((prevState) => ({
          ...prevState,
          DrugName: drugNames[0],
        }));
      }
    } catch (error) {
      handleAxiosError("Error fetching drug names:", error);
    }
  };

  const handleDrugNameChange = (drugName) => {
    setSelectedDrugName(drugName);
    setDonationForm({ ...donationForm, DrugName: drugName });
  };

  useEffect(() => {
    const saveDonations = async () => {
      try {
        await AsyncStorage.setItem("donations", JSON.stringify(donations));
      } catch (error) {
        handleAsyncStorageError(
          "Error saving donations to AsyncStorage:",
          error
        );
      }
    };

    saveDonations();
  }, [donations]);

  const fetchDonations = async () => {
    try {
      const response = await axios.get("http://1.1.1.250:3000/donation/all");
      const data = response.data.map((donation) => ({
        ...donation,
        DonationDate: new Date(donation.DonationDate).toLocaleDateString(
          "en-GB"
        ),
        ExpiryDate: new Date(donation.ExpiryDate).toLocaleDateString("en-GB"),
      }));
      setDonations(data);
    } catch (error) {
      handleAxiosError("Error fetching donations:", error);
      handleFetchDonationsError(error);
    }
  };

  const showAlert = (title, message) => {
    Alert.alert(title, message, [{ text: "OK" }], { cancelable: false });
  };

  const fetchDonors = async () => {
    try {
      const response = await axios.get("http://1.1.1.250:3000/donor/all");
      const donorsData = response.data;

      setDonors(donorsData);
      setSelectedDonorId(donorsData[0]?.DonorId || null);

      if (donorsData.length > 0) {
        setDonationForm((prevState) => ({
          ...prevState,
          DonorId: donorsData[0]?.DonorId || "",
          DonorName: donorsData[0]?.DonorName || "",
        }));
      }
    } catch (error) {
      handleAxiosError("Error fetching donors:", error);
    }
  };

  const addDonation = async () => {
    try {
      const requiredFields = [
        "DrugName",
        "RecipientId",
        "Presentation",
        "Form",
        "ExpiryDate",
        "Serial",
      ];

      // Check for missing required fields
      const missingFields = requiredFields.filter(
        (field) => !donationForm.hasOwnProperty(field)
      );

      if (missingFields.length > 0) {
        throw new Error(
          `Missing required field(s): ${missingFields.join(", ")}`
        );
      }

      // Get the selected drug object
      const selectedDrug = drugs.find(
        (drug) => drug.DrugName === selectedDrugName
      );

      if (!selectedDrug) {
        throw new Error("Selected drug not found");
      }

      // Find the selected donor
      const selectedDonor = donors.find(
        (donor) => donor.DonorId === selectedDonorId
      );

      console.log("Selected donor:", selectedDonor);

      if (!selectedDonor) {
        throw new Error("Selected donor not found");
      }

      // Format the ExpiryDate to the expected format (YYYY-MM-DD)
      const formattedExpiryDate = new Date(donationForm.ExpiryDate)
        .toISOString()
        .split("T")[0];

      // Prepare data for the donation
      const data = {
        ...donationForm,
        DonorId: selectedDonorId,
        DrugId: selectedDrug._id,
        ExpiryDate: formattedExpiryDate, // Use the formatted ExpiryDate
      };

      // Send POST request to add donation
      const response = await axios.post(
        "http://1.1.1.250:3000/donation/add",
        data,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      // Check if donation was added successfully
      if (response.status === 201) {
        console.log("Donation added successfully");
        // Fetch donations after adding a new one
        fetchDonations();
      } else {
        throw new Error("Failed to add donation");
      }
    } catch (error) {
      console.error("Error adding donation:", error);
      // Handle errors
    }
  };

  const fetchDrugs = async () => {
    try {
      const response = await axios.get("http://1.1.1.250:3000/drugs/all");
      const drugsData = response.data;

      setDrugs(drugsData);

      if (drugsData.length > 0) {
        setDonationForm((prevState) => ({
          ...prevState,
          DrugName: drugsData[0].DrugID,
        }));
      }
    } catch (error) {
      handleAxiosError("Error fetching drugs:", error);
    }
  };

  const fetchRecipients = async () => {
    try {
      const response = await axios.get("http://1.1.1.250:3000/recipient/all");
      const recipientsData = response.data;

      const mappedRecipients = recipientsData.map((recipient) => ({
        RecipientId: recipient.RecipientId,
        RecipientName: recipient.RecipientName,
      }));

      setRecipients(mappedRecipients);

      if (mappedRecipients.length > 0) {
        setDonationForm((prevState) => ({
          ...prevState,
          RecipientId: mappedRecipients[0].RecipientId,
          RecipientName: mappedRecipients[0].RecipientName,
        }));
      }
    } catch (error) {
      handleAxiosError("Error fetching recipients:", error);
    }
  };

  const updateDonation = async (donationId, updatedData) => {
    try {
      const response = await fetch(`/donation/${donationId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
      });

      // Check if the response status is not ok
      if (!response.ok) {
        // Throw an error with a custom message
        throw new Error("Failed to update donation");
      }

      // Parse the response data
      const responseData = await response.json();
      console.log("Donation updated successfully:", responseData);
      // Return the response data
      return responseData;
    } catch (error) {
      // Log the error
      console.error("Error updating donation:", error);
      // Throw the error again to propagate it to the caller
      throw error;
    }
  };

  const handleAxiosError = (message, error) => {
    console.error(message, error);
    if (error.response) {
      console.error("Server responded with error:", error.response.status);
    } else if (error.request) {
      console.error("No response received from server:", error.request);
    } else {
      console.error("Error setting up the request:", error.message);
    }
  };

  const handleAsyncStorageError = (message, error) => {
    console.error(message, error);
    if (error.code === "ERR_STORAGE_FULL") {
      console.error("Storage is full. Please free up space.");
    } else if (error.code === "ERR_STORAGE_PERMISSION_DENIED") {
      console.error("Storage permission denied. Please grant permission.");
    } else {
      console.error("Failed to save donations to AsyncStorage:", error.message);
    }
  };

  const handleFetchDataError = (error) => {
    console.error("Error fetching data:", error);
    showAlert("Error", "Failed to fetch data. Please try again later.");
  };

  const handleFetchDonationsError = (error) => {
    if (error.response && error.response.status === 404) {
      console.error("Donations not found. The server returned a 404 error.");
    } else if (error.code === "ECONNREFUSED") {
      console.error(
        "Connection refused. Please check your network connection."
      );
    } else {
      console.error("Failed to fetch donations:", error.message);
    }
  };

  const handleBarcodeScanned = ({ type, data }) => {
    console.log(`Barcode with type ${type} and data ${data} has been scanned!`);
    try {
      // Parse scanned data
      const response = { GTIN: "", LOT: "", ExpiryDate: "", Serial: "" };
      let responseCode = data;

      const prefixes = [
        { prefix: "01", key: "GTIN", length: 14 },
        { prefix: "10", key: "LOT" },
        { prefix: "17", key: "ExpiryDate", length: 6 },
        { prefix: "21", key: "Serial" },
      ];

      prefixes.forEach(({ prefix, key, length }) => {
        const position = responseCode.indexOf(prefix);

        if (position !== -1) {
          const start = position + prefix.length;
          let end;

          if (length) {
            end = start + length;
          } else {
            const gsPosition = responseCode.indexOf(
              String.fromCharCode(29),
              start
            );
            end = gsPosition !== -1 ? gsPosition : responseCode.length;
          }

          response[key] = responseCode.substring(start, end);
          responseCode =
            responseCode.slice(0, position) + responseCode.slice(end);
        }
      });

      console.log("Parsed response:", response);

      // Update scannedData state immutably
      setScannedData((prevData) => [...(prevData || []), response]);
      setBarcodeData((prevBarcodeData) => [
        ...(prevBarcodeData || []),
        response,
      ]);
      setCameraVisible(false); // Close camera modal after scanning
      setModalVisible(true); // Open modal to display new barcode section

      // Update the donationForm with scanned barcode data
      setDonationForm((prevForm) => ({
        ...prevForm,
        LOT: response.LOT || prevForm.LOT,
        ExpiryDate: response.ExpiryDate || prevForm.ExpiryDate,
        GTIN: response.GTIN || prevForm.GTIN,
      }));
    } catch (error) {
      console.error("Error parsing scanned data:", error);
      // Handle error
    }
  };

  // Function to handle submission confirmation
  const handleConfirmation = () => {
    setConfirmationVisible(true);
  };

  // Function to open the camera modal and initiate scanning
  const openCamera = () => {
    setCameraVisible(true);
  };

  // Function to add more barcode input sections
  const addMoreSections = () => {
    openCamera();
  };

  const handleSubmit = async () => {
    try {
      console.log("Submitting donation...");
      Keyboard.dismiss();

      // Add barcode data to the donationForm
      const lastBarcode = barcodeData[barcodeData.length - 1];
      if (lastBarcode) {
        setDonationForm((prevState) => ({
          ...prevState,
          LOT: lastBarcode.LOT || prevState.LOT,
          ExpiryDate: lastBarcode.ExpiryDate || prevState.ExpiryDate,
          GTIN: lastBarcode.GTIN || prevState.GTIN,
        }));
      }

      // Perform form validation
      if (!donationForm.LOT || !donationForm.ExpiryDate || !donationForm.GTIN) {
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

      // Clear barcode data
      setBarcodeData([]);

      // Display success message
      setSuccessVisible(true);

      // Display confirmation modal
      handleConfirmation();

      // Hide the success message after 2 seconds
      setTimeout(() => {
        setSuccessVisible(true);
      }, 2000);
      console.log("Donation submitted successfully");
    } catch (error) {
      console.error("Error submitting donation:", error);
      if (error.message === "Failed to add donation") {
        setErrorMessage("Failed to add donation.");
      } else {
        setErrorMessage(error.message);
      }
      setErrorVisible(true);
    }
  };

  const handleAddToDonation = () => {
    setDonationForm((prevForm) => ({
      ...prevForm,
      medicationDetails: [
        ...prevForm.medicationDetails,
        ...barcodeData.map((data) => ({
          GTIN: data.GTIN,
          LOT: data.LOT,
          ExpiryDate: data.ExpiryDate,
          Serial: data.Serial,
        })),
      ],
    }));
    setBarcodeData([]);
    setScannedData(null);
  };

  return (
    <DonationContext.Provider
      value={{
        donations,
        fetchDrugs,
        editMode,
        toggleEditMode,
        drugs,
        donors,
        drugNames,
        setDrugNames,
        selectedDrugName,
        setSelectedDrugName,
        fetchDrugNames,
        handleDrugNameChange,
        recipients,
        setRecipients,
        fetchDonors,
        fetchDonations,
        selectedDonorId,
        setSelectedDonorId,
        fetchRecipients,
        donationForm,
        setDonationForm,
        addDonation,
        updateDonation,
        setDonations,
        addMoreSections,
        openCamera,
        setCameraVisible,
        handleBarcodeScanned,
        setBarcodeData,
        setModalVisible,
        handleSubmit,
        modalVisible,
        setModalVisible,
        scannedData,
        setScannedData,
        handleAddToDonation,
      }}
    >
      {children}
    </DonationContext.Provider>
  );
};
