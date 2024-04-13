// import React, { createContext, useContext, useEffect, useState } from "react";
// import { Alert } from "react-native";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import axios from "axios";

// const DonationContext = createContext();

// export const useDonationContext = () => useContext(DonationContext);

// export const DonationProvider = ({ children }) => {
//   const [donations, setDonations] = useState([]);
//   const [donors, setDonors] = useState([]);
//   const [selectedDonorId, setSelectedDonorId] = useState("");
//   const [recipients, setRecipients] = useState([]);
//   const [drugs, setDrugs] = useState([]);
//   const [drugNames, setDrugNames] = useState([]);
//   const [selectedDrugName, setSelectedDrugName] = useState("");
//   const [donationForm, setDonationForm] = useState({
//     DonorId: "",
//     DrugId: "",
//     DonorName: "",
//     DonorType: "Individual",
//     // RecipientId: "",
//     DrugName: "",
//     Quantity: "",
//     Presentation: "",
//     Form: "",
//     DonationPurpose: "",
//     DonationDate: new Date().toISOString(),
//     ProductionDate: "2024-03-31",
//     Laboratory: "",
//     LaboratoryCountry: "",
//     LOT: "",
//     ExpiryDate: "",
//     GTIN: "",
//     Serial: "",
//   });

//   useEffect(() => {
//     const loadDonations = async () => {
//       try {
//         const storedDonations = await AsyncStorage.getItem("donations");
//         if (storedDonations) {
//           setDonations(JSON.parse(storedDonations));
//         }
//       } catch (error) {
//         console.error("Error loading donations from AsyncStorage:", error);
//         throw new Error("Failed to load donations from AsyncStorage");
//       }
//     };
//     loadDonations();

//     fetchRecipients();
//     fetchDrugs();
//     fetchDrugNames();
//     fetchDonors();
//   }, []);

//   const fetchDrugNames = async () => {
//     try {
//       const response = await axios.get("http://85.112.70.8:3000/drugs/all");
//       const drugsData = response.data;
//       const drugNames = drugsData.map((drug) => drug.DrugName);
//       setDrugNames(drugNames);
//       if (drugNames.length > 0) {
//         setDonationForm((prevState) => ({
//           ...prevState,
//           DrugName: drugNames[0], // Set the default value to the first drug name
//         }));
//       }
//     } catch (error) {
//       console.error("Error fetching drug names:", error);
//     }
//   };

//   const handleDrugNameChange = (drugName) => {
//     setSelectedDrugName(drugName);
//     setDonationForm({ ...donationForm, DrugName: drugName });
//   };

//   useEffect(() => {
//     const saveDonations = async () => {
//       try {
//         await AsyncStorage.setItem("donations", JSON.stringify(donations));
//       } catch (error) {
//         console.error("Error saving donations to AsyncStorage:", error);
//         throw new Error("Failed to save donations to AsyncStorage");
//       }
//     };
//     saveDonations();
//   }, [donations]);

//   const fetchDonations = async () => {
//     try {
//       const response = await axios.get("http://85.112.70.8:3000/donation/all");
//       const data = response.data.map((donation) => ({
//         ...donation,
//         DonationDate: new Date(donation.DonationDate).toLocaleDateString(
//           "en-GB"
//         ),
//         ExpiryDate: new Date(donation.ExpiryDate).toLocaleDateString("en-GB"),
//       }));
//       setDonations(data);
//     } catch (error) {
//       console.error("Error fetching donations:", error);
//       handleFetchDonationsError(error);
//     }
//   };

//   const handleFetchDonationsError = async (error) => {
//     try {
//       if (error.response && error.response.status >= 500) {
//         const storedData = await AsyncStorage.getItem("donations");
//         if (storedData) {
//           setDonations(JSON.parse(storedData));
//         }
//         showAlert(
//           "Offline",
//           "Failed to load data. You are currently offline. Please check your internet connection."
//         );
//       } else {
//         showAlert(
//           "Error",
//           "Failed to fetch donations. Please try again later."
//         );
//       }
//     } catch (err) {
//       console.error("Error handling fetch donations error:", err);
//       showAlert(
//         "Error",
//         "An unexpected error occurred while handling fetch donations error."
//       );
//     }
//   };

//   const showAlert = (title, message) => {
//     Alert.alert(title, message, [{ text: "OK" }], { cancelable: false });
//   };

//   // Function to fetch donors and set state
//   const fetchDonors = async () => {
//     try {
//       const response = await axios.get("http://85.112.70.8:3000/donor/all");
//       const donorsData = response.data;
//       setDonors(donorsData); // Set donors state here
//       setSelectedDonorId(donorsData[0]?.DonorId || null); // Set the selected donor id
//       if (donorsData.length > 0) {
//         setDonationForm((prevState) => ({
//           ...prevState,
//           DonorId: donorsData[0]?.DonorId || "", // Set the DonorId in the donation form
//           DonorName: donorsData[0]?.DonorName || "", // Set the DonorName in the donation form
//         }));
//       }
//     } catch (error) {
//       console.error("Error fetching donors:", error);
//       showAlert("Error", "Failed to fetch donors. Please try again later.");
//     }
//   };

//   const addDonation = async () => {
//     try {
//       const requiredFields = [
//         "DrugName",
//         // "RecipientId",
//         "Presentation",
//         "Form",
//         "DonationDate",
//         "ExpiryDate",
//         "Quantity",
//         "DonationPurpose",
//         "Laboratory",
//         "LaboratoryCountry",
//         "Serial",
//       ];
//       const missingFields = requiredFields.filter(
//         (field) => !donationForm.hasOwnProperty(field)
//       );

//       if (missingFields.length > 0) {
//         throw new Error(
//           `Missing required field(s): ${missingFields.join(", ")}`
//         );
//       }

//       // Get the selected drug object
//       const selectedDrug = drugs.find(
//         (drug) => drug.DrugName === selectedDrugName
//       );

//       if (!selectedDrug) {
//         throw new Error("Selected drug not found");
//       }

//       const data = {
//         ...donationForm,
//         DonorId: selectedDonorId, // Set DonorId based on selected donor
//         DrugId: selectedDrug._id, // Set DrugId based on selected drug
//       };

//       const response = await axios.post(
//         "http://85.112.70.8:3000/donation/add",
//         data,
//         {
//           headers: {
//             "Content-Type": "application/json",
//           },
//         }
//       );

//       if (response.status === 201) {
//         console.log("Donation added successfully");
//         fetchDonations();
//       } else {
//         // throw new Error("Failed to add donation");
//       }
//     } catch (error) {
//       console.error("Error adding donation:", error);
//       showAlert(
//         "Error",
//         error.message || "Failed to add donation. Please try again later."
//       );
//     }
//   };

//   const fetchDrugs = async () => {
//     try {
//       const response = await axios.get("http://85.112.70.8:3000/drugs/all");
//       const drugsData = response.data;
//       // console.log("Drugs Data:", drugsData); // Log drugs data
//       setDrugs(drugsData);
//       if (drugsData.length > 0) {
//         setDonationForm((prevState) => ({
//           ...prevState,
//           DrugName: drugsData[0].DrugID,
//         }));
//       }
//     } catch (error) {
//       console.error("Error fetching drugs:", error);
//       showAlert("Error", "Failed to fetch drugs.");
//     }
//   };

//   // const fetchRecipients = async () => {
//   //   try {
//   //     const response = await axios.get("http://85.112.70.8:3000/recipient/all");
//   //     const recipientsData = response.data;

//   //     // Map the response data to include only necessary fields (RecipientId and RecipientName)
//   //     const mappedRecipients = recipientsData.map((recipient) => ({
//   //       RecipientId: recipient.RecipientId,
//   //       RecipientName: recipient.RecipientName,
//   //     }));

//   //     setRecipients(mappedRecipients);

//   //     if (mappedRecipients.length > 0) {
//   //       // Assuming you want to set the first recipient as the default in the donation form
//   //       setDonationForm((prevState) => ({
//   //         ...prevState,
//   //         RecipientId: mappedRecipients[0].RecipientId,
//   //         RecipientName: mappedRecipients[0].RecipientName, // You may also set the RecipientName if needed
//   //       }));
//   //     }
//   //   } catch (error) {
//   //     console.error("Error fetching recipients:", error);
//   //     showAlert("Error", "Failed to fetch recipients.");
//   //   }
//   // };

//   const fetchRecipients = async () => {
//     try {
//       const response = await axios.get("http://85.112.70.8:3000/recipient/all");
//       const recipientsData = response.data;
//       const mappedRecipients = recipientsData.map((recipient) => ({
//         RecipientId: recipient.RecipientId,
//         RecipientName: recipient.RecipientName,
//       }));

//       setRecipients(mappedRecipients);

//       if (mappedRecipients.length > 0) {
//         setDonationForm((prevState) => ({
//           ...prevState,
//           RecipientId: mappedRecipients[0].RecipientId,
//           RecipientName: mappedRecipients[0].RecipientName,
//         }));
//       }
//     } catch (error) {
//       console.error("Error fetching recipients:", error);
//       showAlert("Error", "Failed to fetch recipients.");
//     }
//   };

//   const updateDonation = async (donationId, updatedData) => {
//     try {
//       const response = await fetch(`/donation/${donationId}`, {
//         method: "PUT",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(updatedData),
//       });

//       if (!response.ok) {
//         throw new Error("Failed to update donation");
//       }

//       const responseData = await response.json();
//       console.log("Donation updated successfully:", responseData);
//       return responseData;
//     } catch (error) {
//       console.error("Error updating donation:", error);
//       throw error;
//     }
//   };

//   return (
//     <DonationContext.Provider
//       value={{
//         donations,
//         fetchDrugs,
//         drugs,
//         donors,
//         drugNames,
//         setDrugNames,
//         selectedDrugName,
//         setSelectedDrugName,
//         fetchDrugNames,
//         handleDrugNameChange,
//         recipients,
//         setRecipients,
//         fetchDonors,
//         fetchDonations,
//         selectedDonorId,
//         setSelectedDonorId,
//         fetchRecipients,
//         donationForm,
//         setDonationForm,
//         addDonation,
//         updateDonation,
//         setDonations,
//       }}
//     >
//       {children}
//     </DonationContext.Provider>
//   );
// };

// ---------------------------------------------------------------------------

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
        showAlert("Error", "Failed to load donations from AsyncStorage.");
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
        console.error("Error fetching data:", error);
        showAlert("Error", "Failed to fetch data. Please try again later.");
      }
    };

    loadDonations();
    fetchData();
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
          // DrugName: drugNames[0], // Set the default value to the first drug name
        }));
      }
    } catch (error) {
      // Log the error with context
      console.error("Error fetching drug names:", error);

      // Handle specific error cases gracefully
      if (error.response) {
        // Server responded with an error status code
        console.error("Server responded with error:", error.response.status);
        // You can display a user-friendly message or take appropriate action here
      } else if (error.request) {
        // The request was made but no response was received
        console.error("No response received from server:", error.request);
        // You can inform the user about the network issue or retry the request
      } else {
        // Something happened in setting up the request that triggered an error
        console.error("Error setting up the request:", error.message);
        // You can inform the user about the unexpected error or handle it gracefully
      }

      // Propagate the error to higher-level components for centralized handling
      throw error;
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
        // Log the error with context
        console.error("Error saving donations to AsyncStorage:", error);

        // Handle specific error cases gracefully
        if (error.code === "ERR_STORAGE_FULL") {
          // Storage is full, prompt the user to free up space or take other actions
          console.error("Storage is full. Please free up space.");
          // You can inform the user about the issue or take appropriate action
        } else if (error.code === "ERR_STORAGE_PERMISSION_DENIED") {
          // Permission denied, ask the user to grant storage permission
          console.error("Storage permission denied. Please grant permission.");
          // You can prompt the user to grant permission or navigate to settings
        } else {
          // Other errors
          console.error(
            "Failed to save donations to AsyncStorage:",
            error.message
          );
          // You can inform the user about the unexpected error or handle it gracefully
        }

        // Propagate the error to higher-level components for centralized handling
        throw error;
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
      // Log the error with context
      console.error("Error fetching donations:", error);

      // Handle specific error cases gracefully
      if (error.response && error.response.status === 404) {
        console.error("Donations not found. The server returned a 404 error.");
        // You can inform the user about the issue or take appropriate action
      } else if (error.code === "ECONNREFUSED") {
        console.error(
          "Connection refused. Please check your network connection."
        );
        // You can prompt the user to check their network connection or retry later
      } else {
        // Other errors
        console.error("Failed to fetch donations:", error.message);
        // You can inform the user about the unexpected error or handle it gracefully
      }

      // Propagate the error to higher-level components for centralized handling
      handleFetchDonationsError(error);
    }
  };

  // const handleFetchDonationsError = async (error) => {
  //   try {
  //     if (error.response && error.response.status >= 500) {
  //       const storedData = await AsyncStorage.getItem("donations");
  //       if (storedData) {
  //         setDonations(JSON.parse(storedData));
  //       }
  //       showAlert(
  //         "Offline",
  //         "Failed to load data. You are currently offline. Please check your internet connection."
  //       );
  //     } else {
  //       showAlert(
  //         "Error",
  //         "Failed to fetch donations. Please try again later."
  //       );
  //     }
  //   } catch (err) {
  //     console.error("Error handling fetch donations error:", err);
  //     showAlert(
  //       "Error",
  //       "An unexpected error occurred while handling fetch donations error."
  //     );
  //   }
  // };

  const showAlert = (title, message) => {
    Alert.alert(title, message, [{ text: "OK" }], { cancelable: false });
  };

  // Function to fetch donors and set state
  const fetchDonors = async () => {
    try {
      const response = await axios.get("http://85.112.70.8:3000/donor/all");
      const donorsData = response.data;

      // Set donors state here
      setDonors(donorsData);

      // Set the selected donor id
      setSelectedDonorId(donorsData[0]?.DonorId || null);

      // Set the DonorId and DonorName in the donation form if donorsData is not empty
      if (donorsData.length > 0) {
        setDonationForm((prevState) => ({
          ...prevState,
          DonorId: donorsData[0]?.DonorId || "",
          DonorName: donorsData[0]?.DonorName || "",
        }));
      }
    } catch (error) {
      // Log the error
      console.error("Error fetching donors:", error);

      // Show an error message to the user
      // showAlert("Error", "Failed to fetch donors. Please try again later.");
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

      // Prepare data for the donation
      const data = {
        ...donationForm,
        DonorId: selectedDonorId, // Set DonorId based on selected donor
        DrugId: selectedDrug._id, // Set DrugId based on selected drug
      };

      // Send POST request to add donation
      const response = await axios.post(
        "http://85.112.70.8:3000/donation/add",
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
        // Throw an error if the status code is not 201
        // throw new Error("Failed to add donation");
      }
    } catch (error) {
      // Log the error
      // console.error("Error adding donation:", error);
      // Show an error message to the user
      // showAlert(
      //   "Error",
      //   error.message || "Failed to add donation. Please try again later."
      // );
    }
  };

  const fetchDrugs = async () => {
    try {
      const response = await axios.get("http://85.112.70.8:3000/drugs/all");
      const drugsData = response.data;

      // Set drugs data in the state
      setDrugs(drugsData);

      // Check if there are drugs available
      if (drugsData.length > 0) {
        // Set the DrugName in the donation form to the first drug's DrugID
        setDonationForm((prevState) => ({
          ...prevState,
          DrugName: drugsData[0].DrugID,
        }));
      }
    } catch (error) {
      // Log the error
      console.error("Error fetching drugs:", error);
      // Show an alert to the user
      showAlert("Error", "Failed to fetch drugs.");
    }
  };

  const fetchRecipients = async () => {
    try {
      const response = await axios.get("http://85.112.70.8:3000/recipient/all");
      const recipientsData = response.data;

      // Map the recipients data to extract relevant information
      const mappedRecipients = recipientsData.map((recipient) => ({
        RecipientId: recipient.RecipientId,
        RecipientName: recipient.RecipientName,
      }));

      // Set the recipients data in the state
      setRecipients(mappedRecipients);

      // Check if there are recipients available
      if (mappedRecipients.length > 0) {
        // Set the RecipientId and RecipientName in the donation form to the first recipient's data
        setDonationForm((prevState) => ({
          ...prevState,
          RecipientId: mappedRecipients[0].RecipientId,
          RecipientName: mappedRecipients[0].RecipientName,
        }));
      }
    } catch (error) {
      // Log the error
      console.error("Error fetching recipients:", error);
      // Show an alert to the user
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
