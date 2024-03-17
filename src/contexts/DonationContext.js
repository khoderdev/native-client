// import React, { createContext, useContext, useState } from "react";

// const DonationContext = createContext();

// export const useDonationContext = () => useContext(DonationContext);

// export const DonationProvider = ({ children }) => {
//   const [donations, setDonations] = useState([]);
//   const [donationForm, setDonationForm] = useState({
//     name: "",
//     presentation: "",
//     form: "",
//     laboratory: "",
//     scannedLot: "",
//     scannedExp: "",
//     scannedGtin: "",
//   });
//   const [error, setError] = useState(null); // State for handling errors

//   const fetchDonations = async () => {
//     try {
//       const response = await fetch(
//         "http://1.1.1.250:5000/api/donations"
//         // "https://60fb-85-112-70-8.ngrok-free.app/api/donations"
//       );
//       if (!response.ok) {
//         throw new Error("Failed to fetch donations. Please try again later.");
//       }
//       const data = await response.json();
//       setDonations(data);
//     } catch (error) {
//       console.error("Error fetching donations:", error);
//       setError(error.message); // Set error state
//     }
//   };

//   const addDonation = async () => {
//     try {
//       const response = await fetch(
//         "http://1.1.1.250:5000/api/donations",
//         // "https://60fb-85-112-70-8.ngrok-free.app/api/donations",
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify(donationForm),
//         }
//       );

//       if (!response.ok) {
//         throw new Error("Failed to add donation");
//       }

//       console.log("Donation added successfully");
//       fetchDonations(); // Fetch updated donations
//     } catch (error) {
//       console.error("Error adding donation:", error);
//       setError(error.message); // Set error state
//     }
//   };

//   return (
//     <DonationContext.Provider
//       value={{
//         donations,
//         fetchDonations,
//         donationForm,
//         setDonationForm,
//         addDonation,
//         error, // Pass error state to the context
//       }}
//     >
//       {children}
//     </DonationContext.Provider>
//   );
// };
import React, { createContext, useContext, useState, useEffect } from "react";
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
  });
  const [error, setError] = useState(null); // State for handling errors

  useEffect(() => {
    // Load donations from AsyncStorage when the component mounts
    loadDonations();
  }, []);

  const loadDonations = async () => {
    try {
      const storedDonations = await AsyncStorage.getItem("donations");
      if (storedDonations !== null) {
        setDonations(JSON.parse(storedDonations));
      }
    } catch (error) {
      console.error("Error loading donations from AsyncStorage:", error);
      setError("Failed to load donations.");
    }
  };

  const saveDonations = async (data) => {
    try {
      await AsyncStorage.setItem("donations", JSON.stringify(data));
    } catch (error) {
      console.error("Error saving donations to AsyncStorage:", error);
      setError("Failed to save donations.");
    }
  };

  const fetchDonations = async () => {
    try {
      const response = await fetch(
        // "http://1.1.1.250:5000/api/donations"
         "https://nodejs-production-fb52.up.railway.app/api/donations"
        // "https://60fb-85-112-70-8.ngrok-free.app/api/donations"
      );
      if (!response.ok) {
        throw new Error(
          "Failed to fetch donations. Please try again later."
        );
      }
      const data = await response.json();
      setDonations(data);
      saveDonations(data); // Save fetched donations to AsyncStorage
    } catch (error) {
      console.error("Error fetching donations:", error);
      setError("Failed to fetch donations.");
    }
  };

  const addDonation = async () => {
    try {
      const response = await fetch(
        // "http://1.1.1.250:5000/api/donations",
        "https://nodejs-production-fb52.up.railway.app/api/donations",
        // "https://60fb-85-112-70-8.ngrok-free.app/api/donations",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(donationForm),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to add donation");
      }

      console.log("Donation added successfully");
      fetchDonations(); // Fetch updated donations
    } catch (error) {
      console.error("Error adding donation:", error);
      setError("Failed to add donation.");
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
        error, // Pass error state to the context
      }}
    >
      {children}
    </DonationContext.Provider>
  );
};
