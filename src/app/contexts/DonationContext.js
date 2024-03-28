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
    // DonorId: uuid.v4(),
    DonorId: 1,
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
    const saveDonations = async () => {
      try {
        await AsyncStorage.setItem("donations", JSON.stringify(donations));
      } catch (error) {
        console.error("Error saving donations to AsyncStorage:", error);
      }
    };
    saveDonations();
  }, [donations]);

  // useEffect(() => {
  //   // Load donations from AsyncStorage when component mounts
  //   const loadDonations = async () => {
  //     try {
  //       const storedDonations = await AsyncStorage.getItem("donations");
  //       if (storedDonations) {
  //         setDonations(JSON.parse(storedDonations));
  //       }
  //     } catch (error) {
  //       console.error("Error loading donations from AsyncStorage:", error);
  //     }
  //   };
  //   loadDonations();

  //   fetchRecipients();
  //   fetchDrugs();
  // }, []);

  // useEffect(() => {
  //   // Save donations to AsyncStorage whenever the 'donations' state changes
  //   const saveDonations = async () => {
  //     try {
  //       await AsyncStorage.setItem("donations", JSON.stringify(donations));
  //     } catch (error) {
  //       console.error("Error saving donations to AsyncStorage:", error);
  //     }
  //   };
  //   saveDonations();
  // }, [donations]);

  const fetchDonations = async () => {
    try {
      const response = await axios.get(
        "http://85.112.70.8:3000/donation/all"
        // "https://ea6b-85-112-70-8.ngrok-free.app/donation/all"
      );

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

      if (error.response && error.response.status >= 500) {
        const storedData = await AsyncStorage.getItem("donations");
        if (storedData) {
          setDonations(JSON.parse(storedData));
        }
        Alert.alert(
          "Offline",
          "Failed to load data. You are currently offline. Please check your internet connection.",
          [{ text: "OK" }],
          { cancelable: false }
        );
      } else {
        Alert.alert(
          "Error",
          "Failed to fetch donations. Please try again later.",
          [{ text: "OK" }],
          { cancelable: false }
        );
      }
    }
  };

  // const fetchDonations = async () => {
  //   try {
  //     // Fetch donations from the server
  //     const response = await axios.get(
  //       "https://ea6b-85-112-70-8.ngrok-free.app/donation/all"
  //     );

  //     const data = response.data.map((donation) => ({
  //       ...donation,
  //       DonationDate: new Date(donation.DonationDate).toLocaleDateString(
  //         "en-GB"
  //       ),
  //       ExpiryDate: new Date(donation.ExpiryDate).toLocaleDateString("en-GB"),
  //     }));

  //     // Update state with fetched data
  //     setDonations(data);
  //   } catch (error) {
  //     console.error("Error fetching donations:", error);

  //     // Handle server errors
  //     if (error.response && error.response.status >= 500) {
  //       // Load data from AsyncStorage if server is unreachable
  //       const storedData = await AsyncStorage.getItem("donations");
  //       if (storedData) {
  //         setDonations(JSON.parse(storedData));
  //       }
  //       // Display offline alert
  //       Alert.alert(
  //         "Offline",
  //         "Failed to load data. You are currently offline. Please check your internet connection.",
  //         [{ text: "OK" }],
  //         { cancelable: false }
  //       );
  //     } else {
  //       // Display generic error message for other errors
  //       Alert.alert(
  //         "Error",
  //         "Failed to fetch donations. Please try again later.",
  //         [{ text: "OK" }],
  //         { cancelable: false }
  //       );
  //     }
  //   }
  // };

  const fetchDrugs = async () => {
    try {
      const response = await axios.get(
        "http://85.112.70.8:3000/drugs/all"
        // "https://ea6b-85-112-70-8.ngrok-free.app/drugs/all"
      );
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
      const response = await axios.get("http://85.112.70.8:3000/recipient/all");
      const recipientsData = response.data;
      setRecipients(recipientsData);
      // Assuming RecipientId is fetched from response data, modify the logic according to your data structure
      // For example, you might set RecipientId to the first recipient's id
      if (recipientsData.length > 0) {
        setDonationForm((prevState) => ({
          ...prevState,
          RecipientId: recipientsData[0].id, // Modify this according to your data structure
        }));
      }
    } catch (error) {
      console.error("Error fetching recipients:", error);
      // Handle error
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
        "http://85.112.70.8:3000/donation/add",
        // "https://ea6b-85-112-70-8.ngrok-free.app/donation/add",
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

  // Function to update a donation
  const updateDonation = async (donationId, updatedDonation) => {
    try {
      updatedDonation.DonationDate = new Date(updatedDonation.DonationDate);
      updatedDonation.ExpiryDate = new Date(updatedDonation.ExpiryDate);

      const response = await axios.put(
        // `https://ea6b-85-112-70-8.ngrok-free.app/donation/${donationId}`,
        `http://85.112.70.8:3000/donation/${donationId}`,
        updatedDonation,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        console.log("Donation updated successfully");

        // Update donations state with the edited donation
        setDonations((prevDonations) =>
          prevDonations.map((donation) =>
            donation._id === donationId ? updatedDonation : donation
          )
        );
      } else {
        throw new Error("Failed to update donation");
      }
    } catch (error) {
      console.error("Error updating donation:", error);

      Alert.alert(
        "Error",
        error.message || "Failed to update donation. Please try again later.",
        [{ text: "OK" }]
      );
    }
  };

  // // Function to update a donation
  // const updateDonation = async (donationId, updatedDonation) => {
  //   try {
  //     // Convert date strings to Date objects
  //     updatedDonation.DonationDate = new Date(updatedDonation.DonationDate);
  //     updatedDonation.ExpiryDate = new Date(updatedDonation.ExpiryDate);

  //     // Make a PUT request to update the donation
  //     const response = await axios.put(
  //       `https://ea6b-85-112-70-8.ngrok-free.app/donation/${donationId}`,
  //       updatedDonation,
  //       {
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //       }
  //     );

  //     // Check if the request was successful
  //     if (response.status === 200) {
  //       console.log("Donation updated successfully");

  //       // Fetch updated donations
  //       fetchDonations();
  //     } else {
  //       throw new Error("Failed to update donation");
  //     }
  //   } catch (error) {
  //     console.error("Error updating donation:", error);

  //     // Display user-friendly error message
  //     Alert.alert(
  //       "Error",
  //       error.message || "Failed to update donation. Please try again later.",
  //       [{ text: "OK" }]
  //     );
  //   }
  // };

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
        updateDonation,
      }}
    >
      {children}
    </DonationContext.Provider>
  );
};
