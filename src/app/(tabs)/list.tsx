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
  const { donations, fetchDonations, recipients, drugs, fetchRecipients } = useDonationContext();
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedDonation, setSelectedDonation] = useState(null);
  const [storagePermissionGranted, setStoragePermissionGranted] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("Fetching donations...");
        await fetchDonations();
        console.log("Fetched donations:", donations);

        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);
  // Call fetchRecipients before rendering the FlatList
  useEffect(() => {
    fetchRecipients();
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

  const getRecipientName = (recipientId) => {
    const recipient = recipients.find(recipient => recipient.RecipientId === recipientId);
    return recipient ? recipient.RecipientName : 'Unknown';
  };

  // const getRecipientName = (recipientId) => {
  //   const recipient = recipients.find(recipient => recipient.RecipientId === recipientId);
  //   return recipient ? recipient.RecipientName : 'Unknown';
  // };

  // const getRecipientName = (recipientId) => {
  //   console.log("Recipient ID:", recipientId);
  //   console.log("Recipients:", recipients);

  //   const recipient = recipients.find(recipient => recipient.RecipientId === recipientId);
  //   console.log("Recipient:", recipient);

  //   return recipient ? recipient.RecipientName : 'Unknown';
  // };
  // const getRecipientName = (recipientId) => {
  //   console.log("Recipient ID:", recipientId);
  //   console.log("Recipients:", recipients);

  //   const recipient = recipients.find(recipient => recipient.RecipientId === recipientId);
  //   console.log("Recipient:", recipient);

  //   return recipient ? recipient.RecipientName : 'Unknown';
  // };
  // const getRecipientName = (recipientId) => {
  //   const recipient = recipients.find(recipient => recipient.RecipientId === recipientId);
  //   return recipient ? recipient.RecipientName : 'Unknown';
  // };



  const generateExcel = async () => {
    try {
      if (!storagePermissionGranted) {
        const { status } = await MediaLibrary.requestPermissionsAsync();
        setStoragePermissionGranted(status === 'granted');
        if (!storagePermissionGranted) {
          Alert.alert(
            'Permission Required',
            "To export data, please grant permission to access your device's storage."
          );
          return;
        }
      }

      const sharingAvailable = await Sharing.isAvailableAsync();
      if (!sharingAvailable) {
        throw new Error('Sharing is not available on this device.');
      }

      const filteredDonations = donations.map(({ __v, ...rest }) => rest);

      const wb = XLSX.utils.book_new();

      const ws = XLSX.utils.json_to_sheet(filteredDonations);

      XLSX.utils.book_append_sheet(wb, ws, 'Donations');

      const base64 = XLSX.write(wb, { type: 'base64' });

      const filename = 'Donations.xlsx';

      const filePath = `${FileSystem.documentDirectory}${filename}`;
      await FileSystem.writeAsStringAsync(filePath, base64, {
        encoding: FileSystem.EncodingType.Base64,
      });

      console.log('Excel data written to file:', filePath);

      await Sharing.shareAsync(filePath);

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
        renderItem={({ item }) => {
          const recipientName = getRecipientName(item.RecipientId); // Get recipient name using recipient ID
          const drugName = item.Drug ? item.Drug.DrugName : 'Unknown';

          return (
            <TouchableOpacity style={styles.container} onPress={() => handleDonationPress(item)}>
              <View style={styles.innerContainer}>
                {/* <Text style={styles.label}>Medicine Name:</Text> */}
                <Text style={styles.drugText}>{drugName}</Text>
              </View>
              <View style={styles.innerContainer}>
                <Text style={styles.label}>Presentation:</Text>
                <Text style={styles.text}>{item.Presentation}</Text>
              </View>
              
              <View style={styles.innerContainer}>
                <Text style={styles.label}>Form:</Text>
                <Text style={styles.text}>{item.Form}</Text>
              </View>

              <View style={styles.innerContainer}>
                <Text style={styles.label}>Quantity:</Text>
                <Text style={styles.text}>{item.Quantity}</Text>
              </View>

            </TouchableOpacity>
          );
        }}
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
    paddingTop: 40,
    backgroundColor: "#27272A",
    paddingHorizontal: 10,
  },
  container: {
    backgroundColor: "#0096FF",
    borderRadius: 10,
    marginVertical: 10,
    padding: 15,
  },
  innerContainer: {
    flexDirection: 'row',
    // justifyContent: 'space-between',
    marginBottom: 5,
  },
  label: {
    fontWeight: 'bold',
    color: '#fff',
    marginRight: 5
  },
  text: {
    color: '#fff',
  },
  drugText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  exportButtonContainer: {
    position: "absolute",
    top: Platform.OS === "ios" ? 36 : 6,
    right: 12,
  },
});

export default Donation;
