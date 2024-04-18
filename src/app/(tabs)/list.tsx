import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  FlatList,
  RefreshControl,
  TouchableOpacity,
  Alert,
  Platform,
  Modal,
  BackHandler,
} from "react-native";
import colors from "../../misc/colors";
import { useDonationContext } from "../contexts/DonationContext";
import DonationDetails from "../DonationDetails";
import * as XLSX from "xlsx";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import * as MediaLibrary from "expo-media-library";
import { Button } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from "@react-navigation/native";

const Donation = () => {
  const { donations, fetchDonations, recipients, donors, fetchRecipients } = useDonationContext();
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedDonation, setSelectedDonation] = useState(null);
  const [selectedItemIds, setSelectedItemIds] = useState([]);
  const [storagePermissionGranted, setStoragePermissionGranted] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const [showCheckboxes, setShowCheckboxes] = useState(false);

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

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        if (selectedItemIds.length > 0) {
          setModalVisible(true);
          return true; // Do not exit the app
        }
        return false; // Exit the app
      };

      BackHandler.addEventListener('hardwareBackPress', onBackPress);

      return () =>
        BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }, [selectedItemIds])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchDonations();
    setRefreshing(false);
  };

  const handleDonationPress = (item) => {
    const index = selectedItemIds.indexOf(item.DonationId);
    if (index !== -1) {
      // Item already selected, remove it
      setSelectedItemIds(selectedItemIds.filter(id => id !== item.DonationId));
    } else {
      // Item not selected, add it
      setSelectedItemIds([...selectedItemIds, item.DonationId]);
    }
  };


  const handleCheckboxPress = (item) => {
    const index = selectedItemIds.indexOf(item.DonationId);
    if (index !== -1) {
      // Item already selected, remove it
      setSelectedItemIds(selectedItemIds.filter(id => id !== item.DonationId));
    } else {
      // Item not selected, add it
      setSelectedItemIds([...selectedItemIds, item.DonationId]);
    }
  };

  const getRecipientName = (recipientId) => {
    const recipient = recipients.find(recipient => recipient.RecipientId === recipientId);
    return recipient ? recipient.RecipientName : 'Unknown';
  };

  const getDonorName = (donorId) => {
    const donor = donors.find(donor => donor.DonorId === donorId);
    return donor ? donor.DonorName : 'Unknown';
  }

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

      const selectedDonations = donations.filter(donation => selectedItemIds.includes(donation.DonationId));

      const wb = XLSX.utils.book_new();

      selectedDonations.forEach((donation, index) => {
        const ws = XLSX.utils.json_to_sheet([donation]);
        XLSX.utils.book_append_sheet(wb, ws, `Donation${index + 1}`);
      });

      const base64 = XLSX.write(wb, { type: 'base64' });

      const filename = 'SelectedDonations.xlsx';

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

  const handleModalConfirm = () => {
    setSelectedItemIds([]);
    setModalVisible(false);
    setShowCheckboxes(false);
  };

  const handleModalCancel = () => {
    setModalVisible(false);
    setShowCheckboxes(false);
  };

  if (isLoading) {
    return <Text>Loading...</Text>;
  }

  return (
    <View style={styles.mainContainer}>
      <FlatList
        data={donations}
        renderItem={({ item }) => {
          const recipientName = getRecipientName(item.RecipientId);
          const donorName = getDonorName(item.DonorId);
          const isSelected = selectedItemIds.includes(item.DonationId);

          return (
            <TouchableOpacity
              style={[styles.container, isSelected ? { backgroundColor: '#e6e6e6' } : null]}
              onPress={() => {
                if (selectedItemIds.length === 0) {
                  setSelectedDonation(item);
                } else {
                  handleDonationPress(item);
                }
              }}
              onLongPress={() => {
                if (selectedItemIds.length === 0) {
                  setShowCheckboxes(true);
                  handleCheckboxPress(item);
                }
              }}
            >
              <View className='flex justify-center items-center' style={styles.rowContainer}>
                <View style={styles.columnContainer}>
                  <View style={styles.labelTextContainer}>
                    <Text style={styles.label}>From:</Text>
                    <Text style={styles.text}>{donorName}</Text>
                  </View>
                  <View style={styles.labelTextContainer}>
                    <Text style={styles.label}>To:</Text>
                    <Text style={styles.text}>{recipientName}</Text>
                  </View>
                </View>

                <View style={styles.columnContainer}>
                  <View style={styles.labelTextContainer}>
                    <Text style={styles.label}>Date:</Text>
                    <Text style={styles.text}>{item.DonationDate}</Text>
                  </View>
                  <View style={styles.labelTextContainer}>
                    <Text style={styles.label}>Quantity:</Text>
                    <Text style={styles.text}>{item.Quantity}</Text>
                  </View>
                </View>

                {showCheckboxes && (
                  <TouchableOpacity onPress={() => handleCheckboxPress(item)}>
                    <Ionicons
                      name={isSelected ? 'checkbox-outline' : 'square-outline'}
                      size={24}
                      color="black"
                    />
                  </TouchableOpacity>
                )}
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
        <Button
          textColor='white'
          rippleColor='#00a651c4'
          buttonColor="#00a651"
          mode="contained"
          theme={{ colors: { primary: 'green' } }}
          onPress={generateExcel}
        >
          Export to Xls File
        </Button>
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
        }}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>Are you sure you want to deselect all items?</Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity onPress={handleModalConfirm}>
                <Text style={[styles.buttonsText, styles.button]}>Yes</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleModalCancel}>
                <Text style={[styles.buttonsText, styles.button]}>No</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    paddingTop: 40,
    backgroundColor: "#fff",
    paddingHorizontal: 10,
    padding: 10,
  },

  container: {
    backgroundColor: "#fff",
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#00a651",
    marginVertical: 10,
    padding: 15,
    display: 'flex',
    justifyContent: 'center'
  },

  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  columnContainer: {
    flex: 1,
    flexDirection: 'column',
    marginHorizontal: 5,
  },

  labelTextContainer: {
    marginBottom: 10,
  },

  label: {
    fontWeight: 'bold',
    color: '#999',
  },

  text: {
    color: '#121212',
  },

  exportButtonContainer: {
    position: "absolute",
    top: Platform.OS === "ios" ? 36 : 6,
    right: 12,
    borderRadius: 60
  },

  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },

  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },

  modalText: {
    marginBottom: 20,
    textAlign: 'center',
  },

  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8

  },

  buttonsText: {
    color: "#00a651",
  },

  button: {
    borderWidth: 1,
    borderColor: "#00a651",
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
});

export default Donation;