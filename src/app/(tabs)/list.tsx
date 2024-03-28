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
  const [donationsList, setDonationsList] = useState([]);



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
        const { status } = await MediaLibrary.requestPermissionsAsync();
        setStoragePermissionGranted(status === 'granted');
      } catch (error) {
        console.error('Error requesting storage permission:', error);
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

  const handleDonationPress = (item) => {
    setSelectedDonation(item);
  };

  const generateExcel = async () => {
    try {
      // Handle permission request if not granted
      if (!storagePermissionGranted) {
        const { status } = await MediaLibrary.requestPermissionsAsync();
        setStoragePermissionGranted(status === 'granted');
        if (!storagePermissionGranted) {
          Alert.alert(
            'Permission Required',
            "Please grant permission to access your device's storage to export data."
          );
          return;
        }
      }

      // Check if sharing is available
      const sharingAvailable = await Sharing.isAvailableAsync();
      if (!sharingAvailable) {
        throw new Error('Sharing is not available on this device.');
      }

      // Filter out unnecessary properties from donations
      const filteredDonations = donations.map(({ __v, ...rest }) => rest);

      // Create a new Excel workbook
      const wb = XLSX.utils.book_new();

      // Convert filtered donations data to a worksheet
      const ws = XLSX.utils.json_to_sheet(filteredDonations);

      // Append the worksheet to the workbook with the name "Donations"
      XLSX.utils.book_append_sheet(wb, ws, 'Donations');

      // Write workbook data to a base64 string
      const base64 = XLSX.write(wb, { type: 'base64' });

      // Define filename for the Excel file
      const filename = 'Donations.xlsx';

      // Save Excel file to device storage
      const filePath = `${FileSystem.documentDirectory}${filename}`;
      await FileSystem.writeAsStringAsync(filePath, base64, {
        encoding: FileSystem.EncodingType.Base64,
      });

      // Share Excel file with the user
      await Sharing.shareAsync(filePath);

      // Display success message
      Alert.alert('Success', 'Excel file exported and saved to device storage.');
    } catch (error) {
      console.error('Error exporting data:', error);
      Alert.alert('Export Failed', 'Failed to export data. Please try again.');
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
              <Text style={styles.DrugName}>{item.DrugName}</Text>
              <Text>Presentation: {item.Presentation}</Text>
              <Text>Form: {item.Form}</Text>
              <Text>Laboratory: {item.Laboratory}</Text>
              <Text>Donation Date: {item.DonationDate}</Text>
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
  DrugName: {
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
