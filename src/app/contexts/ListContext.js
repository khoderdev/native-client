// import React, { createContext, useContext, useEffect, useState } from "react";
// import * as XLSX from "xlsx";
// import * as FileSystem from "expo-file-system";
// import * as Sharing from "expo-sharing";
// import * as MediaLibrary from "expo-media-library";
// import { Alert } from "react-native";

// const ListContext = createContext();

// export const useListContext = () => useContext(ListContext);

// export const ListProvider = ({ children, donations: initialDonations }) => {
//   const [isLoading, setIsLoading] = useState(true);
//   const [refreshing, setRefreshing] = useState(false);
//   const [selectedDonation, setSelectedDonation] = useState(null);
//   const [selectedItemIds, setSelectedItemIds] = useState([]);
//   const [storagePermissionGranted, setStoragePermissionGranted] =
//     useState(false);
//   const [modalVisible, setModalVisible] = useState(false);
//   const [longPressActivated, setLongPressActivated] = useState(false);

//   useEffect(() => {
//     checkStoragePermission();
//   }, []);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         console.log("Fetching donations...");
//         await fetchDonations();
//         console.log("Fetched donations:", donations);
//         setIsLoading(false);
//       } catch (error) {
//         console.error("Error fetching data:", error);
//         setIsLoading(false);
//       }
//     };

//     fetchData();
//   }, []);

//   const checkStoragePermission = async () => {
//     try {
//       const { status } = await MediaLibrary.requestPermissionsAsync();
//       setStoragePermissionGranted(status === "granted");
//     } catch (error) {
//       console.error("Error requesting storage permission:", error);
//       setStoragePermissionGranted(false);
//     }
//   };

//   const onRefresh = async () => {
//     setRefreshing(true);
//     await fetchDonations();
//     setRefreshing(false);
//   };

//   const generateExcel = async () => {
//     try {
//       if (!storagePermissionGranted) {
//         const { status } = await MediaLibrary.requestPermissionsAsync();
//         setStoragePermissionGranted(status === "granted");
//         if (!storagePermissionGranted) {
//           Alert.alert(
//             "Permission Required",
//             "To export data, please grant permission to access your device's storage."
//           );
//           return;
//         }
//       }

//       const sharingAvailable = await Sharing.isAvailableAsync();
//       if (!sharingAvailable) {
//         throw new Error("Sharing is not available on this device.");
//       }

//       const selectedDonations = donations.filter((donation) =>
//         selectedItemIds.includes(donation.DonationId)
//       );

//       const wb = XLSX.utils.book_new();

//       selectedDonations.forEach((donation, index) => {
//         const ws = XLSX.utils.json_to_sheet([donation]);
//         XLSX.utils.book_append_sheet(wb, ws, `Donation${index + 1}`);
//       });

//       const base64 = XLSX.write(wb, { type: "base64" });

//       const filename = "SelectedDonations.xlsx";

//       const filePath = `${FileSystem.documentDirectory}${filename}`;
//       await FileSystem.writeAsStringAsync(filePath, base64, {
//         encoding: FileSystem.EncodingType.Base64,
//       });

//       console.log("Excel data written to file:", filePath);

//       await Sharing.shareAsync(filePath);

//       Alert.alert(
//         "Success",
//         "Excel file exported and saved to device storage."
//       );
//     } catch (error) {
//       console.error("Error exporting data:", error);
//       Alert.alert("Export Failed", "Failed to export data. Please try again.");
//     }
//   };

//   const handleDonationPress = (item) => {
//     const index = selectedItemIds.indexOf(item.DonationId);
//     if (index !== -1) {
//       // Item already selected, remove it
//       setSelectedItemIds(
//         selectedItemIds.filter((id) => id !== item.DonationId)
//       );
//     } else {
//       // Item not selected, add it
//       setSelectedItemIds([...selectedItemIds, item.DonationId]);
//     }
//   };

//   const handleLongPress = () => {
//     if (!longPressActivated) {
//       setLongPressActivated(true);
//     }
//   };

//   const handleCheckboxPress = (item) => {
//     const index = selectedItemIds.indexOf(item.DonationId);
//     if (index !== -1) {
//       // Item already selected, remove it
//       setSelectedItemIds(
//         selectedItemIds.filter((id) => id !== item.DonationId)
//       );
//     } else {
//       // Item not selected, add it
//       setSelectedItemIds([...selectedItemIds, item.DonationId]);
//     }
//   };

//   return (
//     <ListContext.Provider
//       value={{
//         generateExcel,
//         checkStoragePermission,
//         selectedDonation,
//         setSelectedDonation,
//         selectedItemIds,
//         setSelectedItemIds,
//         handleDonationPress,
//         modalVisible,
//         setModalVisible,
//         handleLongPress,
//         longPressActivated,
//         handleCheckboxPress,
//         setRefreshing,
//         onRefresh,
//         refreshing,
//         isLoading,
//       }}
//     >
//       {children}
//     </ListContext.Provider>
//   );
// };

import React, { createContext, useContext, useEffect, useState } from "react";
import * as XLSX from "xlsx";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import * as MediaLibrary from "expo-media-library";
import { Alert } from "react-native";

const ListContext = createContext();

export const useListContext = () => useContext(ListContext);

export const ListProvider = ({ children, donations: initialDonations }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedDonation, setSelectedDonation] = useState(null);
  const [selectedItemIds, setSelectedItemIds] = useState([]);
  const [storagePermissionGranted, setStoragePermissionGranted] =
    useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [longPressActivated, setLongPressActivated] = useState(false);
  const [donations, setDonations] = useState(initialDonations || []);

  useEffect(() => {
    checkStoragePermission();
  }, []);

  useEffect(() => {
    if (initialDonations) {
      setDonations(initialDonations);
      setIsLoading(false);
    }
  }, [initialDonations]);

  const checkStoragePermission = async () => {
    try {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      setStoragePermissionGranted(status === "granted");
    } catch (error) {
      console.error("Error requesting storage permission:", error);
      setStoragePermissionGranted(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    // Fetch donations again
    await fetchDonations();
    setRefreshing(false);
  };

  const generateExcel = async () => {
    try {
      if (!storagePermissionGranted) {
        const { status } = await MediaLibrary.requestPermissionsAsync();
        setStoragePermissionGranted(status === "granted");
        if (!storagePermissionGranted) {
          Alert.alert(
            "Permission Required",
            "To export data, please grant permission to access your device's storage."
          );
          return;
        }
      }

      const sharingAvailable = await Sharing.isAvailableAsync();
      if (!sharingAvailable) {
        throw new Error("Sharing is not available on this device.");
      }

      const selectedDonations = donations.filter((donation) =>
        selectedItemIds.includes(donation.DonationId)
      );

      const wb = XLSX.utils.book_new();

      selectedDonations.forEach((donation, index) => {
        const ws = XLSX.utils.json_to_sheet([donation]);
        XLSX.utils.book_append_sheet(wb, ws, `Donation${index + 1}`);
      });

      const base64 = XLSX.write(wb, { type: "base64" });

      const filename = "SelectedDonations.xlsx";

      const filePath = `${FileSystem.documentDirectory}${filename}`;
      await FileSystem.writeAsStringAsync(filePath, base64, {
        encoding: FileSystem.EncodingType.Base64,
      });

      console.log("Excel data written to file:", filePath);

      await Sharing.shareAsync(filePath);

      Alert.alert(
        "Success",
        "Excel file exported and saved to device storage."
      );
    } catch (error) {
      console.error("Error exporting data:", error);
      Alert.alert("Export Failed", "Failed to export data. Please try again.");
    }
  };

  const handleDonationPress = (item) => {
    const index = selectedItemIds.indexOf(item.DonationId);
    if (index !== -1) {
      // Item already selected, remove it
      setSelectedItemIds(
        selectedItemIds.filter((id) => id !== item.DonationId)
      );
    } else {
      // Item not selected, add it
      setSelectedItemIds([...selectedItemIds, item.DonationId]);
    }
  };

  const handleLongPress = () => {
    if (!longPressActivated) {
      setLongPressActivated(true);
    }
  };

  const handleCheckboxPress = (item) => {
    const index = selectedItemIds.indexOf(item.DonationId);
    if (index !== -1) {
      // Item already selected, remove it
      setSelectedItemIds(
        selectedItemIds.filter((id) => id !== item.DonationId)
      );
    } else {
      // Item not selected, add it
      setSelectedItemIds([...selectedItemIds, item.DonationId]);
    }
  };

  return (
    <ListContext.Provider
      value={{
        generateExcel,
        selectedDonation,
        setSelectedDonation,
        selectedItemIds,
        setSelectedItemIds,
        handleDonationPress,
        modalVisible,
        setModalVisible,
        handleLongPress,
        longPressActivated,
        handleCheckboxPress,
        setRefreshing,
        onRefresh,
        refreshing,
        isLoading,
        donations,
      }}
    >
      {children}
    </ListContext.Provider>
  );
};
