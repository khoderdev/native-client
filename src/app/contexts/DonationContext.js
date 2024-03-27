import React, { createContext, useContext, useEffect, useState } from "react";
import { Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import uuid from "react-native-uuid";

const DonationContext = createContext();

export const useDonationContext = () => useContext(DonationContext);

const clearAsyncStorage = async () => {
  try {
    await AsyncStorage.clear();
    console.log("AsyncStorage cleared successfully.");
  } catch (error) {
    console.error("Error clearing AsyncStorage:", error);
  }
};

export const DonationProvider = ({ children }) => {
  const [donations, setDonations] = useState([]);
  const [recipients, setRecipients] = useState([]);
  const [drugs, setDrugs] = useState([]);
  const [donationForm, setDonationForm] = useState({
    DonorId: uuid.v4(),
    // DonorId: 1,
    DonorName: "",
    RecipientId: "",
    DrugName: "",
    Quantity: "",
    Presentation: "",
    Form: "",
    DonationPurpose: "",
    DonationDate: new Date().toISOString(),
    Laboratory: "",
    LaboratoryCountry: "",
    LOT: "",
    ExpiryDate: "",
    GTIN: "",
    Serial: "",
  });

  useEffect(() => {
    // Load donations from AsyncStorage when component mounts
    const loadDonations = async () => {
      try {
        const storedDonations = await AsyncStorage.getItem("donations");
        if (storedDonations) {
          setDonations(JSON.parse(storedDonations));
        }
      } catch (error) {
        console.error("Error loading donations from AsyncStorage:", error);
      }
    };
    loadDonations();

    fetchRecipients();
    fetchDrugs();
  }, []);

  useEffect(() => {
    // Save donations to AsyncStorage whenever the 'donations' state changes
    const saveDonations = async () => {
      try {
        await AsyncStorage.setItem("donations", JSON.stringify(donations));
      } catch (error) {
        console.error("Error saving donations to AsyncStorage:", error);
      }
    };
    saveDonations();
  }, [donations]);

  const fetchDonations = async () => {
    try {
      // Fetch donations from the server
      const response = await axios.get("http://1.1.1.250:9000/donation/all");

      const data = response.data.map((donation) => ({
        ...donation,
        DonationDate: new Date(donation.DonationDate).toLocaleDateString(
          "en-GB"
        ),
        ExpiryDate: new Date(donation.ExpiryDate).toLocaleDateString("en-GB"),
      }));

      // Update state with fetched data
      setDonations(data);
    } catch (error) {
      console.error("Error fetching donations:", error);

      // Handle server errors
      if (error.response && error.response.status >= 500) {
        // Load data from AsyncStorage if server is unreachable
        const storedData = await AsyncStorage.getItem("donations");
        if (storedData) {
          setDonations(JSON.parse(storedData));
        }
        // Display offline alert
        Alert.alert(
          "Offline",
          "Failed to load data. You are currently offline. Please check your internet connection.",
          [{ text: "OK" }],
          { cancelable: false }
        );
      } else {
        // Display generic error message for other errors
        Alert.alert(
          "Error",
          "Failed to fetch donations. Please try again later.",
          [{ text: "OK" }],
          { cancelable: false }
        );
      }
    }
  };

  const fetchDrugs = async () => {
    try {
      const response = await axios.get("http://1.1.1.250:9000/drugs/all");
      const drugsData = response.data;
      setDrugs(drugsData);
      // Assuming drugName is fetched from response data, modify the logic according to your data structure
      // For example, you might set RecipientId to the first drug's id
      if (drugsData.length > 0) {
        setDonationForm((prevState) => ({
          ...prevState,
          drugName: drugsData[0].id, // Modify this according to your data structure
        }));
      }
    } catch (error) {
      console.error("Error fetching drugs:", error);
      // Handle error
    }
  };

  const fetchRecipients = async () => {
    try {
      // Fetch recipients from the server
      const response = await axios.get("http://1.1.1.250:9000/recipient/all");
      const data = response.data;

      // Extract recipients from _id
      const recipients = data.map((recipient) => ({
        _id: recipient._id,
        RecipientName: recipient.RecipientName,
        RecipientType: recipient.RecipientType,
        Address: recipient.Address,
        City: recipient.City,
        Country: recipient.Country,
        ContactPerson: recipient.ContactPerson,
        ContactNumber: recipient.ContactNumber,
        IsActive: recipient.IsActive,
        CreatedDate: recipient.CreatedDate,
        UpdatedDate: recipient.UpdatedDate,
      }));

      // Update state with extracted recipients
      setRecipients(recipients);
    } catch (error) {
      console.error("Error fetching recipients:", error);

      // Handle server errors
      if (error.response && error.response.status >= 500) {
        // Display offline alert
        Alert.alert(
          "Offline",
          "Failed to load data. You are currently offline. Please check your internet connection.",
          [{ text: "OK" }],
          { cancelable: false }
        );
      } else {
        // Display generic error message for other errors
        Alert.alert(
          "Error",
          "Failed to fetch recipients. Please try again later.",
          [{ text: "OK" }],
          { cancelable: false }
        );
      }
    }
  };

  // clear existing data from AsyncStorage
  // clearAsyncStorage();

  const addDonation = async () => {
    try {
      // Check if all required fields are present in donationForm
      const requiredFields = [
        "RecipientId",
        "Presentation",
        "Form",
        "RecipientId",
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

      // Make a POST request to add a new donation
      const response = await axios.post(
        "http://1.1.1.250:9000/donation/add",
        donationForm,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      // Check if the request was successful
      if (response.status === 201) {
        console.log("Donation added successfully");

        // Fetch updated donations
        fetchDonations();
      } else {
        throw new Error("Failed to add donation");
      }
    } catch (error) {
      console.error("Error adding donation:", error);

      // Display user-friendly error message
      Alert.alert(
        "Error",
        error.message || "Failed to add donation. Please try again later.",
        [{ text: "OK" }]
      );
    }
  };

  return (
    <DonationContext.Provider
      value={{
        donations,
        drugs,
        recipients,
        setRecipients,
        fetchDonations,
        fetchRecipients,
        donationForm,
        setDonationForm,
        addDonation,
      }}
    >
      {children}
    </DonationContext.Provider>
  );
};
