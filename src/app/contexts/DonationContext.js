// DonationContext.js
import React, { createContext, useContext, useState } from "react";

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
  });

  const fetchDonations = async () => {
    try {
      const response = await fetch("http://1.1.1.250:5000/api/donations");
      if (!response.ok) {
        throw new Error("Failed to fetch donations. Please try again later.");
      }
      const data = await response.json();
      setDonations(data);
    } catch (error) {
      console.error("Error fetching donations:", error);
      // Optionally, display an error message to the user
      alert("Failed to fetch donations. Please try again later.");
    }
  };

  const addDonation = async () => {
    try {
      const response = await fetch("http://1.1.1.250:5000/api/donations", {
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
