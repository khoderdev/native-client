import React, { createContext, useContext, useEffect, useState } from "react";
import { Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const DonationContext = createContext();

export const useDonationContext = () => useContext(DonationContext);

export const DonationProvider = ({ children }) => {
  const [donations, setDonations] = useState([]);
  const [donationForm, setDonationForm] = useState({
    name: "",
    presentation: "",
    form: "",
    laboratory: "",
    scannedLot: "",
    scannedExp: "",
    scannedGtin: "",
    scannedSerial: "",
  });

  useEffect(() => {
    fetchDonations();
  }, []);

  const fetchDonations = async () => {
    try {
      const storedData = await AsyncStorage.getItem("donations");
      if (storedData) {
        setDonations(JSON.parse(storedData));
      }

      const response = await fetch("http://localhost:3000/api/donations");
      if (!response.ok) {
        throw new Error("Server error");
      }
      const data = await response.json();
      setDonations(data);
      await AsyncStorage.setItem("donations", JSON.stringify(data));
    } catch (error) {
      console.error("Error fetching donations:", error);
      // If the error is due to the server being unreachable, load data from AsyncStorage
      if (error.message === "Server error") {
        const storedData = await AsyncStorage.getItem("donations");
        if (storedData) {
          setDonations(JSON.parse(storedData));
        }
        Alert.alert(
          "Offline",
          "Failed to fetch donations. You are currently offline. Please check your internet connection.",
          [{ text: "OK" }],
          { cancelable: false }
        );
      } else {
        // Otherwise, display a generic error message
        Alert.alert(
          "Error",
          "Failed to fetch donations. Please try again later.",
          [{ text: "OK" }],
          { cancelable: false }
        );
      }
    }
  };

  const addDonation = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/donations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(donationForm),
      });

      if (!response.ok) {
        throw new Error("Failed to add donation");
      }

      console.log("Donation added successfully");
      fetchDonations(); // Fetch updated donations
    } catch (error) {
      console.error("Error adding donation:", error);
      Alert.alert("Error", "Failed to add donation. Please try again later.", [
        { text: "OK" },
      ]);
    }
  };

  return (
    <DonationContext.Provider
      value={{
        donations,
        fetchDonations,
        donationForm,
        setDonationForm,
        addDonation,
      }}
    >
      {children}
    </DonationContext.Provider>
  );
};
