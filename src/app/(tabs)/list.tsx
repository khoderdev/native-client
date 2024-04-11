import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  FlatList,
  RefreshControl,
  TouchableOpacity,
  Button,
  Alert,
  Platform,
} from "react-native";
import colors from "../../misc/colors";
import { useDonationContext } from "../contexts/DonationContext";
import DonationDetails from "../DonationDetails";
import * as XLSX from "xlsx";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import * as MediaLibrary from "expo-media-library";

const Donation = () => {
  const { donations, fetchDonations } = useDonationContext();
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedDonation, setSelectedDonation] = useState(null);
  const [storagePermissionGranted, setStoragePermissionGranted] =
    useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("Fetching donations...");
        await fetchDonations();
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching donations:", error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const checkStoragePermission = async () => {
      try {
        const { status } = await MediaLibrary.requestPermissionsAsync(); // Request storage permission using expo-media-library
        setStoragePermissionGranted(status === "granted");
      } catch (error) {
        console.error("Error requesting storage permission:", error);
        setStoragePermissionGranted(false);
      }
    };

    checkStoragePermission();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchDonations();
    setRefreshing(false);
  };

 const handleDonationPress = async (item) => {
  try {
    const response = await fetch(`http://85.112.70.8:3000/donations/${item.id}`);
    const donationDetails = await response.json();
    setSelectedDonation(donationDetails);
  } catch (error) {
    console.error("Error fetching donation details:", error);
  }
};

  const generateExcel = async () => {
    try {
      if (!storagePermissionGranted) {
        // Ask for storage permission
        await MediaLibrary.requestPermissionsAsync(); // Request storage permission using expo-media-library
        const { status } = await MediaLibrary.getPermissionsAsync(); // Check if permission granted
        setStoragePermissionGranted(status === "granted");
        if (!storagePermissionGranted) {
          // Permission not granted
          Alert.alert(
            "Permission Required",
            "To export data, please grant permission to access your device's storage."
          );
          return;
        }
      }

      // Check if sharing is available
      const sharingAvailable = await Sharing.isAvailableAsync();
      if (!sharingAvailable) {
        throw new Error("Sharing is not available on this device.");
      }

      // Filtering out the "__v" property from each donation object
      const filteredDonations = donations.map(({ __v, ...rest }) => rest);

      // Creating a new Excel workbook
      let wb = XLSX.utils.book_new();

      // Converting the filtered donations data to a worksheet
      let ws = XLSX.utils.json_to_sheet(filteredDonations);

      // Appending the worksheet to the workbook with the name "Donations"
      XLSX.utils.book_append_sheet(wb, ws, "Donations");

      // Writing the workbook data to a base64 string
      const base64 = XLSX.write(wb, { type: "base64" });

      // Defining the filename for the Excel file
      const filename = "Donations.xlsx";

      // Save the Excel file to device storage
      const filePath = `${FileSystem.documentDirectory}${filename}`;
      await FileSystem.writeAsStringAsync(filePath, base64, {
        encoding: FileSystem.EncodingType.Base64,
      });

      console.log("Excel data written to file:", filePath);

      // Share the Excel file with the user
      await Sharing.shareAsync(filePath);

      // Display a success message
      Alert.alert(
        "Success",
        "Excel file exported and saved to device storage."
      );
    } catch (error) {
      console.error("Error exporting data:", error);
      Alert.alert("Export Failed", "Failed to export data. Please try again.");
    }
  };

  if (isLoading) {
    return <Text>Loading...</Text>;
  }

  return (
    <View style={styles.mainContainer}>
      <FlatList
        data={donations}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handleDonationPress(item)}>
            <View style={styles.container}>
              <Text style={styles.name}>{item.name}</Text>
              <Text>Presentation: {item.presentation}</Text>
              <Text>Form: {item.form}</Text>
              <Text>Laboratory: {item.laboratory}</Text>
            </View>
          </TouchableOpacity>
        )}
        keyExtractor={(item, index) => index.toString()}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.PRIMARY]}
          />
        }
      />
      {selectedDonation && (
        <DonationDetails
          donation={selectedDonation}
          onClose={() => setSelectedDonation(null)}
        />
      )}
      <View style={styles.exportButtonContainer}>
        <Button title="Export to Excel" onPress={generateExcel} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    padding: 10,
    paddingTop: 40,
  },
  container: {
    backgroundColor: colors.PRIMARY,
    padding: 10,
    borderRadius: 10,
    marginVertical: 10,
  },
  name: {
    fontWeight: "bold",
    fontSize: 16,
    color: colors.LIGHT,
  },
  exportButtonContainer: {
    position: "absolute",
    top: Platform.OS === "ios" ? 36 : 6,
    right: 12,
    // marginBottom: 40,
  },
});

export default Donation;
