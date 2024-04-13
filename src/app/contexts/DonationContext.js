import React, { createContext, useContext, useEffect, useState } from "react";
import { Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const DonationContext = createContext();

export const useDonationContext = () => useContext(DonationContext);

export const DonationProvider = ({ children }) => {
  const [donations, setDonations] = useState([]);
  const [donors, setDonors] = useState([]);
  const [selectedDonorId, setSelectedDonorId] = useState("");
  const [recipients, setRecipients] = useState([]);
  const [drugs, setDrugs] = useState([]);
  const [drugNames, setDrugNames] = useState([]);
  const [selectedDrugName, setSelectedDrugName] = useState("");
  const [donationForm, setDonationForm] = useState({
    DonorId: "",
    DrugId: "",
    DonorName: "",
    DonorType: "Individual",
    // RecipientId: "",
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

  useEffect(() => {
    const loadDonations = async () => {
      try {
        const storedDonations = await AsyncStorage.getItem("donations");
        if (storedDonations) {
          setDonations(JSON.parse(storedDonations));
        }
      } catch (error) {
        console.error("Error loading donations from AsyncStorage:", error);
        throw new Error("Failed to load donations from AsyncStorage");
      }
    };
    loadDonations();

    fetchRecipients();
    fetchDrugs();
    fetchDrugNames();
    fetchDonors();
  }, []);

  const fetchDrugNames = async () => {
    try {
      const response = await axios.get("http://85.112.70.8:3000/drugs/all");
      const drugsData = response.data;
      const drugNames = drugsData.map((drug) => drug.DrugName);

      setDrugNames(drugNames);
      if (drugNames.length > 0) {
        setDonationForm((prevState) => ({
          ...prevState,
          DrugName: drugNames[0], // Set the default value to the first drug name
        }));
      }
    } catch (error) {
      console.error("Error fetching drug names:", error);
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
        console.error("Error saving donations to AsyncStorage:", error);
        throw new Error("Failed to save donations to AsyncStorage");
      }
    };
    saveDonations();
  }, [donations]);

  const fetchDonations = async () => {
    try {
      const response = await axios.get("http://85.112.70.8:3000/donation/all");
      const data = response.data.map((donation) => ({
        ...donation,
        DonationDate: new Date(donation.DonationDate).toLocaleDateString(
          "en-GB"
        ),
        ExpiryDate: new Date(donation.ExpiryDate).toLocaleDateString("en-GB"),
      }));
      setDonations(data);
    } catch (error) {
      console.error("Error fetching donations:", error);
      handleFetchDonationsError(error);
    }
  };

  const handleFetchDonationsError = async (error) => {
    try {
      if (error.response && error.response.status >= 500) {
        const storedData = await AsyncStorage.getItem("donations");
        if (storedData) {
          setDonations(JSON.parse(storedData));
        }
        showAlert(
          "Offline",
          "Failed to load data. You are currently offline. Please check your internet connection."
        );
      } else {
        showAlert(
          "Error",
          "Failed to fetch donations. Please try again later."
        );
      }
    } catch (err) {
      console.error("Error handling fetch donations error:", err);
      showAlert(
        "Error",
        "An unexpected error occurred while handling fetch donations error."
      );
    }
  };

  const showAlert = (title, message) => {
    Alert.alert(title, message, [{ text: "OK" }], { cancelable: false });
  };

  // Function to fetch donors and set state
  const fetchDonors = async () => {
    try {
      const response = await axios.get("http://85.112.70.8:3000/donor/all");
      const donorsData = response.data;
      setDonors(donorsData); // Set donors state here
      setSelectedDonorId(donorsData[0]?.DonorId || null); // Set the selected donor id
      if (donorsData.length > 0) {
        setDonationForm((prevState) => ({
          ...prevState,
          DonorId: donorsData[0]?.DonorId || "", // Set the DonorId in the donation form
          DonorName: donorsData[0]?.DonorName || "", // Set the DonorName in the donation form
        }));
      }
    } catch (error) {
      console.error("Error fetching donors:", error);
      showAlert("Error", "Failed to fetch donors. Please try again later.");
    }
  };

  const addDonation = async () => {
    try {
      const requiredFields = [
        "DrugName",
        // "RecipientId",
        "Presentation",
        "Form",
        "DonationDate",
        "ExpiryDate",
        "Quantity",
        "DonationPurpose",
        "Laboratory",
        "LaboratoryCountry",
        "Serial",
      ];
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

      const data = {
        ...donationForm,
        DonorId: selectedDonorId, // Set DonorId based on selected donor
        DrugId: selectedDrug._id, // Set DrugId based on selected drug
      };

      const response = await axios.post(
        "http://85.112.70.8:3000/donation/add",
        data,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 201) {
        console.log("Donation added successfully");
        fetchDonations();
      } else {
        // throw new Error("Failed to add donation");
      }
    } catch (error) {
      console.error("Error adding donation:", error);
      showAlert(
        "Error",
        error.message || "Failed to add donation. Please try again later."
      );
    }
  };

  const fetchDrugs = async () => {
    try {
      const response = await axios.get("http://85.112.70.8:3000/drugs/all");
      const drugsData = response.data;
      // console.log("Drugs Data:", drugsData); // Log drugs data
      setDrugs(drugsData);
      if (drugsData.length > 0) {
        setDonationForm((prevState) => ({
          ...prevState,
          DrugName: drugsData[0].DrugID,
        }));
      }
    } catch (error) {
      console.error("Error fetching drugs:", error);
      showAlert("Error", "Failed to fetch drugs.");
    }
  };

  // const fetchRecipients = async () => {
  //   try {
  //     const response = await axios.get("http://85.112.70.8:3000/recipient/all");
  //     const recipientsData = response.data;

  //     // Map the response data to include only necessary fields (RecipientId and RecipientName)
  //     const mappedRecipients = recipientsData.map((recipient) => ({
  //       RecipientId: recipient.RecipientId,
  //       RecipientName: recipient.RecipientName,
  //     }));

  //     setRecipients(mappedRecipients);

  //     if (mappedRecipients.length > 0) {
  //       // Assuming you want to set the first recipient as the default in the donation form
  //       setDonationForm((prevState) => ({
  //         ...prevState,
  //         RecipientId: mappedRecipients[0].RecipientId,
  //         RecipientName: mappedRecipients[0].RecipientName, // You may also set the RecipientName if needed
  //       }));
  //     }
  //   } catch (error) {
  //     console.error("Error fetching recipients:", error);
  //     showAlert("Error", "Failed to fetch recipients.");
  //   }
  // };

  const fetchRecipients = async () => {
    try {
      const response = await axios.get("http://85.112.70.8:3000/recipient/all");
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
      console.error("Error fetching recipients:", error);
      showAlert("Error", "Failed to fetch recipients.");
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

      if (!response.ok) {
        throw new Error("Failed to update donation");
      }

      const responseData = await response.json();
      console.log("Donation updated successfully:", responseData);
      return responseData;
    } catch (error) {
      console.error("Error updating donation:", error);
      throw error;
    }
  };

  return (
    <DonationContext.Provider
      value={{
        donations,
        fetchDrugs,
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
      }}
    >
      {children}
    </DonationContext.Provider>
  );
};
