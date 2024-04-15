// // // // import React, { useEffect, useState } from "react";
// // // // import {
// // // //   View,
// // // //   StyleSheet,
// // // //   Text,
// // // //   FlatList,
// // // //   RefreshControl,
// // // //   TouchableOpacity,
// // // //   Alert,
// // // //   Platform,
// // // // } from "react-native";
// // // // import colors from "../../misc/colors";
// // // // import { useDonationContext } from "../contexts/DonationContext";
// // // // import DonationDetails from "../DonationDetails";
// // // // import * as XLSX from "xlsx";
// // // // import * as FileSystem from "expo-file-system";
// // // // import * as Sharing from "expo-sharing";
// // // // import * as MediaLibrary from "expo-media-library";
// // // // import { Button } from 'react-native-paper';



// // // // const Donation = () => {
// // // //   const { donations, fetchDonations, recipients, drugs, fetchRecipients, donors } = useDonationContext();
// // // //   const [isLoading, setIsLoading] = useState(true);
// // // //   const [refreshing, setRefreshing] = useState(false);
// // // //   const [selectedDonation, setSelectedDonation] = useState(null);
// // // //   const [storagePermissionGranted, setStoragePermissionGranted] = useState(false);


// // // //   useEffect(() => {
// // // //     const fetchData = async () => {
// // // //       try {
// // // //         console.log("Fetching donations...");
// // // //         await fetchDonations();
// // // //         console.log("Fetched donations:", donations);

// // // //         setIsLoading(false);
// // // //       } catch (error) {
// // // //         console.error("Error fetching data:", error);
// // // //         setIsLoading(false);
// // // //       }
// // // //     };

// // // //     fetchData();
// // // //   }, []);

// // // //   useEffect(() => {
// // // //     fetchRecipients();
// // // //   }, []);

// // // //   useEffect(() => {
// // // //     const checkStoragePermission = async () => {
// // // //       try {
// // // //         const { status } = await MediaLibrary.requestPermissionsAsync();
// // // //         setStoragePermissionGranted(status === 'granted');
// // // //       } catch (error) {
// // // //         console.error('Error requesting storage permission:', error);
// // // //         setStoragePermissionGranted(false);
// // // //       }
// // // //     };

// // // //     checkStoragePermission();
// // // //   }, []);

// // // //   const onRefresh = async () => {
// // // //     setRefreshing(true);
// // // //     await fetchDonations();
// // // //     setRefreshing(false);
// // // //   };

// // // //   const handleDonationPress = async (donation) => {
// // // //     const donationId = donation.DonationId;
// // // //     try {
// // // //       const response = await fetch(`http://1.1.1.250:3000/donation/${donationId}`);
// // // //       const donationDetails = await response.json();
// // // //       setSelectedDonation(donationDetails);
// // // //     } catch (error) {
// // // //       console.error("Error fetching donation details:", error);
// // // //       throw error;
// // // //     }
// // // //   };

// // // //   const getRecipientName = (recipientId) => {
// // // //     const recipient = recipients.find(recipient => recipient.RecipientId === recipientId);
// // // //     return recipient ? recipient.RecipientName : 'Unknown';
// // // //   };
// // // //   const getDonorName = (donorId) => {
// // // //     const donor = donors.find(donor => donor.DonorId === donorId);
// // // //     return donor ? donor.DonorName : 'Unknown';
// // // //   }

// // // //   const generateExcel = async () => {
// // // //     try {
// // // //       if (!storagePermissionGranted) {
// // // //         const { status } = await MediaLibrary.requestPermissionsAsync();
// // // //         setStoragePermissionGranted(status === 'granted');
// // // //         if (!storagePermissionGranted) {
// // // //           Alert.alert(
// // // //             'Permission Required',
// // // //             "To export data, please grant permission to access your device's storage."
// // // //           );
// // // //           return;
// // // //         }
// // // //       }

// // // //       const sharingAvailable = await Sharing.isAvailableAsync();
// // // //       if (!sharingAvailable) {
// // // //         throw new Error('Sharing is not available on this device.');
// // // //       }

// // // //       const filteredDonations = donations.map(({ __v, ...rest }) => rest);

// // // //       const wb = XLSX.utils.book_new();

// // // //       const ws = XLSX.utils.json_to_sheet(filteredDonations);

// // // //       XLSX.utils.book_append_sheet(wb, ws, 'Donations');

// // // //       const base64 = XLSX.write(wb, { type: 'base64' });

// // // //       const filename = 'Donations.xlsx';

// // // //       const filePath = `${FileSystem.documentDirectory}${filename}`;
// // // //       await FileSystem.writeAsStringAsync(filePath, base64, {
// // // //         encoding: FileSystem.EncodingType.Base64,
// // // //       });

// // // //       console.log('Excel data written to file:', filePath);

// // // //       await Sharing.shareAsync(filePath);

// // // //       Alert.alert('Success', 'Excel file exported and saved to device storage.');
// // // //     } catch (error) {
// // // //       console.error('Error exporting data:', error);
// // // //       Alert.alert('Export Failed', 'Failed to export data. Please try again.');
// // // //     }
// // // //   };

// // // //   if (isLoading) {
// // // //     return <Text>Loading...</Text>;
// // // //   }

// // // //   return (
// // // //     <View style={styles.mainContainer}>
// // // //       <FlatList
// // // //         data={donations}
// // // //         renderItem={({ item }) => {
// // // //           const recipientName = getRecipientName(item.RecipientId);
// // // //           const donorName = getDonorName(item.DonorId);
// // // //           const drugName = item.BatchLotTrackings.map(batchLot => batchLot.DrugName).join(', ');

// // // //           return (
// // // //             <TouchableOpacity style={styles.container} onPress={() => handleDonationPress(item)}>
// // // //               <View className='flex justify-center' style={styles.rowContainer}>
// // // //                 <View style={styles.columnContainer}>
// // // //                   <View style={styles.labelTextContainer}>
// // // //                     <Text style={styles.label}>From:</Text>
// // // //                     <Text style={styles.text}>{donorName}</Text>
// // // //                   </View>
// // // //                   <View style={styles.labelTextContainer}>
// // // //                     <Text style={styles.label}>To:</Text>
// // // //                     <Text style={styles.text}>{recipientName}</Text>
// // // //                   </View>
// // // //                 </View>

// // // //                 <View style={styles.columnContainer}>
// // // //                   <View style={styles.labelTextContainer}>
// // // //                     <Text style={styles.label}>Date:</Text>
// // // //                     <Text style={styles.text}>{item.DonationDate}</Text>
// // // //                   </View>
// // // //                   <View style={styles.labelTextContainer}>
// // // //                     <Text style={styles.label}>Quantity:</Text>
// // // //                     <Text style={styles.text}>{item.Quantity}</Text>
// // // //                   </View>
// // // //                 </View>
// // // //               </View>
// // // //             </TouchableOpacity>
// // // //           );
// // // //         }}
// // // //         keyExtractor={(item, index) => index.toString()}
// // // //         refreshControl={
// // // //           <RefreshControl
// // // //             refreshing={refreshing}
// // // //             onRefresh={onRefresh}
// // // //             colors={[colors.PRIMARY]}
// // // //           />
// // // //         }
// // // //       />


// // // //       {selectedDonation && (
// // // //         <DonationDetails
// // // //           donation={selectedDonation}
// // // //           onClose={() => setSelectedDonation(null)}
// // // //         />
// // // //       )}

// // // //       <View style={styles.exportButtonContainer}>
// // // //         <Button textColor='white' rippleColor='#00a651c4' buttonColor="#00a651" mode="contained"  theme={{ colors: { primary: 'green' } }} onPress={generateExcel}>
// // // //           Export to Xls File
// // // //         </Button>

// // // //       </View>
// // // //     </View>
// // // //   );
// // // // }

// // // // const styles = StyleSheet.create({
// // // //   mainContainer: {
// // // //     flex: 1,
// // // //     // paddingTop: 40,
// // // //     backgroundColor: "#fff",
// // // //     paddingHorizontal: 10,
// // // //     padding: 10,
// // // //     borderWidth: 2,
// // // //     borderColor: "red",
// // // //   },

// // // //   container: {
// // // //     backgroundColor: "#fff",
// // // //     borderRadius: 10,
// // // //     borderWidth: 2,
// // // //     borderColor: "#00a651",
// // // //     marginVertical: 10,
// // // //     padding: 15,
// // // //     display: 'flex',
// // // //     justifyContent: 'center'
// // // //   },

// // // //   rowContainer: {
// // // //     flexDirection: 'row',
// // // //     justifyContent: 'center',
// // // //   },

// // // //   columnContainer: {
// // // //     flex: 1,
// // // //     flexDirection: 'column',
// // // //     marginHorizontal: 5,
// // // //   },

// // // //   labelTextContainer: {
// // // //     marginBottom: 10,
// // // //   },

// // // //   label: {
// // // //     fontWeight: 'bold',
// // // //     color: '#999',
// // // //   },

// // // //   text: {
// // // //     color: '#121212',
// // // //   },

// // // //   exportButtonContainer: {
// // // //     position: "absolute",
// // // //     top: Platform.OS === "ios" ? 36 : 6,
// // // //     right: 12,
// // // //     borderRadius: 60
// // // //   },
// // // // });

// // // // export default Donation;





// // // import React, { useEffect, useState } from "react";
// // // import {
// // //   View,
// // //   StyleSheet,
// // //   Text,
// // //   FlatList,
// // //   RefreshControl,
// // //   TouchableOpacity,
// // //   Alert,
// // //   Platform,
// // // } from "react-native";
// // // import colors from "../../misc/colors";
// // // import { useDonationContext } from "../contexts/DonationContext";
// // // import DonationDetails from "../DonationDetails";
// // // import * as XLSX from "xlsx";
// // // import * as FileSystem from "expo-file-system";
// // // import * as Sharing from "expo-sharing";
// // // import * as MediaLibrary from "expo-media-library";
// // // import { Button } from 'react-native-paper';

// // // const Donation = () => {
// // //   const { donations, fetchDonations, recipients, drugs, fetchRecipients, donors } = useDonationContext();
// // //   const [isLoading, setIsLoading] = useState(true);
// // //   const [refreshing, setRefreshing] = useState(false);
// // //   const [selectedDonation, setSelectedDonation] = useState(null);
// // //   const [selectedItems, setSelectedItems] = useState([]);
// // //   const [storagePermissionGranted, setStoragePermissionGranted] = useState(false);

// // //   useEffect(() => {
// // //     const fetchData = async () => {
// // //       try {
// // //         console.log("Fetching donations...");
// // //         await fetchDonations();
// // //         console.log("Fetched donations:", donations);
// // //         setIsLoading(false);
// // //       } catch (error) {
// // //         console.error("Error fetching data:", error);
// // //         setIsLoading(false);
// // //       }
// // //     };

// // //     fetchData();
// // //   }, []);

// // //   useEffect(() => {
// // //     fetchRecipients();
// // //   }, []);

// // //   useEffect(() => {
// // //     const checkStoragePermission = async () => {
// // //       try {
// // //         const { status } = await MediaLibrary.requestPermissionsAsync();
// // //         setStoragePermissionGranted(status === 'granted');
// // //       } catch (error) {
// // //         console.error('Error requesting storage permission:', error);
// // //         setStoragePermissionGranted(false);
// // //       }
// // //     };

// // //     checkStoragePermission();
// // //   }, []);

// // //   const onRefresh = async () => {
// // //     setRefreshing(true);
// // //     await fetchDonations();
// // //     setRefreshing(false);
// // //   };

// // //   const handleDonationPress = async (donation) => {
// // //     const donationId = donation.DonationId;
// // //     try {
// // //       const response = await fetch(`http://1.1.1.250:3000/donation/${donationId}`);
// // //       const donationDetails = await response.json();
// // //       setSelectedDonation(donationDetails);
// // //     } catch (error) {
// // //       console.error("Error fetching donation details:", error);
// // //       throw error;
// // //     }
// // //   };

// // //   const toggleItemSelection = (donationId) => {
// // //     const index = selectedItems.indexOf(donationId);
// // //     if (index !== -1) {
// // //       // Item already selected, remove it
// // //       setSelectedItems(selectedItems.filter(id => id !== donationId));
// // //     } else {
// // //       // Item not selected, add it
// // //       setSelectedItems([...selectedItems, donationId]);
// // //     }
// // //   };

// // //   const getRecipientName = (recipientId) => {
// // //     const recipient = recipients.find(recipient => recipient.RecipientId === recipientId);
// // //     return recipient ? recipient.RecipientName : 'Unknown';
// // //   };

// // //   const getDonorName = (donorId) => {
// // //     const donor = donors.find(donor => donor.DonorId === donorId);
// // //     return donor ? donor.DonorName : 'Unknown';
// // //   }

// // //   const generateExcel = async () => {
// // //     try {
// // //       if (!storagePermissionGranted) {
// // //         const { status } = await MediaLibrary.requestPermissionsAsync();
// // //         setStoragePermissionGranted(status === 'granted');
// // //         if (!storagePermissionGranted) {
// // //           Alert.alert(
// // //             'Permission Required',
// // //             "To export data, please grant permission to access your device's storage."
// // //           );
// // //           return;
// // //         }
// // //       }

// // //       const sharingAvailable = await Sharing.isAvailableAsync();
// // //       if (!sharingAvailable) {
// // //         throw new Error('Sharing is not available on this device.');
// // //       }

// // //       const selectedDonations = donations.filter(donation => selectedItems.includes(donation.DonationId));

// // //       const wb = XLSX.utils.book_new();

// // //       selectedDonations.forEach((donation, index) => {
// // //         const ws = XLSX.utils.json_to_sheet([donation]);
// // //         XLSX.utils.book_append_sheet(wb, ws, `Donation${index + 1}`);
// // //       });

// // //       const base64 = XLSX.write(wb, { type: 'base64' });

// // //       const filename = 'SelectedDonations.xlsx';

// // //       const filePath = `${FileSystem.documentDirectory}${filename}`;
// // //       await FileSystem.writeAsStringAsync(filePath, base64, {
// // //         encoding: FileSystem.EncodingType.Base64,
// // //       });

// // //       console.log('Excel data written to file:', filePath);

// // //       await Sharing.shareAsync(filePath);

// // //       Alert.alert('Success', 'Excel file exported and saved to device storage.');
// // //     } catch (error) {
// // //       console.error('Error exporting data:', error);
// // //       Alert.alert('Export Failed', 'Failed to export data. Please try again.');
// // //     }
// // //   };

// // //   if (isLoading) {
// // //     return <Text>Loading...</Text>;
// // //   }

// // //   return (
// // //     <View style={styles.mainContainer}>
// // //       <FlatList
// // //         data={donations}
// // //         renderItem={({ item }) => {
// // //           const recipientName = getRecipientName(item.RecipientId);
// // //           const donorName = getDonorName(item.DonorId);
// // //           const drugName = item.BatchLotTrackings.map(batchLot => batchLot.DrugName).join(', ');

// // //           return (
// // //             <TouchableOpacity
// // //               style={[styles.container, selectedItems.includes(item.DonationId) ? { backgroundColor: '#e6e6e6' } : null]}
// // //               onPress={() => handleDonationPress(item)}
// // //               onLongPress={() => toggleItemSelection(item.DonationId)}
// // //             >
// // //               <View className='flex justify-center' style={styles.rowContainer}>
// // //                 <View style={styles.columnContainer}>
// // //                   <View style={styles.labelTextContainer}>
// // //                     <Text style={styles.label}>From:</Text>
// // //                     <Text style={styles.text}>{donorName}</Text>
// // //                   </View>
// // //                   <View style={styles.labelTextContainer}>
// // //                     <Text style={styles.label}>To:</Text>
// // //                     <Text style={styles.text}>{recipientName}</Text>
// // //                   </View>
// // //                 </View>

// // //                 <View style={styles.columnContainer}>
// // //                   <View style={styles.labelTextContainer}>
// // //                     <Text style={styles.label}>Date:</Text>
// // //                     <Text style={styles.text}>{item.DonationDate}</Text>
// // //                   </View>
// // //                   <View style={styles.labelTextContainer}>
// // //                     <Text style={styles.label}>Quantity:</Text>
// // //                     <Text style={styles.text}>{item.Quantity}</Text>
// // //                   </View>
// // //                 </View>
// // //               </View>
// // //             </TouchableOpacity>
// // //           );
// // //         }}
// // //         keyExtractor={(item, index) => index.toString()}
// // //         refreshControl={
// // //           <RefreshControl
// // //             refreshing={refreshing}
// // //             onRefresh={onRefresh}
// // //             colors={[colors.PRIMARY]}
// // //           />
// // //         }
// // //       />

// // //       {selectedDonation && (
// // //         <DonationDetails
// // //           donation={selectedDonation}
// // //           onClose={() => setSelectedDonation(null)}
// // //         />
// // //       )}

// // //       <View style={styles.exportButtonContainer}>
// // //         <Button
// // //           textColor='white'
// // //           rippleColor='#00a651c4'
// // //           buttonColor="#00a651"
// // //           mode="contained"
// // //           theme={{ colors: { primary: 'green' } }}
// // //           onPress={generateExcel}
// // //         >
// // //           Export to Xls File
// // //         </Button>
// // //       </View>
// // //     </View>
// // //   );
// // // }

// // // const styles = StyleSheet.create({
// // //   mainContainer: {
// // //     flex: 1,
// // //     // paddingTop: 40,
// // //     backgroundColor: "#fff",
// // //     paddingHorizontal: 10,
// // //     padding: 10,
// // //     borderWidth: 2,
// // //     borderColor: "red",
// // //   },

// // //   container: {
// // //     backgroundColor: "#fff",
// // //     borderRadius: 10,
// // //     borderWidth: 2,
// // //     borderColor: "#00a651",
// // //     marginVertical: 10,
// // //     padding: 15,
// // //     display: 'flex',
// // //     justifyContent: 'center'
// // //   },

// // //   rowContainer: {
// // //     flexDirection: 'row',
// // //     justifyContent: 'center',
// // //   },

// // //   columnContainer: {
// // //     flex: 1,
// // //     flexDirection: 'column',
// // //     marginHorizontal: 5,
// // //   },

// // //   labelTextContainer: {
// // //     marginBottom: 10,
// // //   },

// // //   label: {
// // //     fontWeight: 'bold',
// // //     color: '#999',
// // //   },

// // //   text: {
// // //     color: '#121212',
// // //   },

// // //   exportButtonContainer: {
// // //     position: "absolute",
// // //     top: Platform.OS === "ios" ? 36 : 6,
// // //     right: 12,
// // //     borderRadius: 60
// // //   },
// // // });

// // // export default Donation;


// // import React, { useEffect, useState } from "react";
// // import {
// //   View,
// //   StyleSheet,
// //   Text,
// //   FlatList,
// //   RefreshControl,
// //   TouchableOpacity,
// //   Alert,
// //   Platform,
// //   Modal,
// // } from "react-native";
// // import colors from "../../misc/colors";
// // import { useDonationContext } from "../contexts/DonationContext";
// // import DonationDetails from "../DonationDetails";
// // import * as XLSX from "xlsx";
// // import * as FileSystem from "expo-file-system";
// // import * as Sharing from "expo-sharing";
// // import * as MediaLibrary from "expo-media-library";
// // import { Button } from 'react-native-paper';
// // import { Ionicons } from '@expo/vector-icons';
// // import { useNavigation } from "expo-router";

// // const Donation = () => {
// //   const { donations, fetchDonations, recipients, drugs, fetchRecipients, donors } = useDonationContext();
// //   const navigation = useNavigation();
// //   const [isLoading, setIsLoading] = useState(true);
// //   const [refreshing, setRefreshing] = useState(false);
// //   const [selectedDonation, setSelectedDonation] = useState(null);
// //   const [selectedItemIds, setSelectedItemIds] = useState([]);
// //   const [storagePermissionGranted, setStoragePermissionGranted] = useState(false);
// //   const [modalVisible, setModalVisible] = useState(false);

// //   useEffect(() => {
// //     const fetchData = async () => {
// //       try {
// //         console.log("Fetching donations...");
// //         await fetchDonations();
// //         console.log("Fetched donations:", donations);
// //         setIsLoading(false);
// //       } catch (error) {
// //         console.error("Error fetching data:", error);
// //         setIsLoading(false);
// //       }
// //     };

// //     fetchData();
// //   }, []);

// //   useEffect(() => {
// //     fetchRecipients();
// //   }, []);

// //   useEffect(() => {
// //     const checkStoragePermission = async () => {
// //       try {
// //         const { status } = await MediaLibrary.requestPermissionsAsync();
// //         setStoragePermissionGranted(status === 'granted');
// //       } catch (error) {
// //         console.error('Error requesting storage permission:', error);
// //         setStoragePermissionGranted(false);
// //       }
// //     };

// //     checkStoragePermission();
// //   }, []);

// //   useEffect(() => {
// //     const unsubscribe = navigation.addListener('beforeRemove', (e) => {
// //       if (selectedItemIds.length > 0) {
// //         // Prevent default behavior of leaving the screen
// //         e.preventDefault();
// //         // Show confirmation modal
// //         setModalVisible(true);
// //       }
// //     });

// //     return unsubscribe;
// //   }, [navigation, selectedItemIds]);

// //   const onRefresh = async () => {
// //     setRefreshing(true);
// //     await fetchDonations();
// //     setRefreshing(false);
// //   };

// //   const handleDonationPress = (item) => {
// //     const index = selectedItemIds.indexOf(item.DonationId);
// //     if (index !== -1) {
// //       // Item already selected, remove it
// //       setSelectedItemIds(selectedItemIds.filter(id => id !== item.DonationId));
// //     } else {
// //       // Item not selected, add it
// //       setSelectedItemIds([...selectedItemIds, item.DonationId]);
// //     }
// //   };

// //   const getRecipientName = (recipientId) => {
// //     const recipient = recipients.find(recipient => recipient.RecipientId === recipientId);
// //     return recipient ? recipient.RecipientName : 'Unknown';
// //   };

// //   const getDonorName = (donorId) => {
// //     const donor = donors.find(donor => donor.DonorId === donorId);
// //     return donor ? donor.DonorName : 'Unknown';
// //   }

// //   const generateExcel = async () => {
// //     try {
// //       if (!storagePermissionGranted) {
// //         const { status } = await MediaLibrary.requestPermissionsAsync();
// //         setStoragePermissionGranted(status === 'granted');
// //         if (!storagePermissionGranted) {
// //           Alert.alert(
// //             'Permission Required',
// //             "To export data, please grant permission to access your device's storage."
// //           );
// //           return;
// //         }
// //       }

// //       const sharingAvailable = await Sharing.isAvailableAsync();
// //       if (!sharingAvailable) {
// //         throw new Error('Sharing is not available on this device.');
// //       }

// //       const selectedDonations = donations.filter(donation => selectedItemIds.includes(donation.DonationId));

// //       const wb = XLSX.utils.book_new();

// //       selectedDonations.forEach((donation, index) => {
// //         const ws = XLSX.utils.json_to_sheet([donation]);
// //         XLSX.utils.book_append_sheet(wb, ws, `Donation${index + 1}`);
// //       });

// //       const base64 = XLSX.write(wb, { type: 'base64' });

// //       const filename = 'SelectedDonations.xlsx';

// //       const filePath = `${FileSystem.documentDirectory}${filename}`;
// //       await FileSystem.writeAsStringAsync(filePath, base64, {
// //         encoding: FileSystem.EncodingType.Base64,
// //       });

// //       console.log('Excel data written to file:', filePath);

// //       await Sharing.shareAsync(filePath);

// //       Alert.alert('Success', 'Excel file exported and saved to device storage.');
// //     } catch (error) {
// //       console.error('Error exporting data:', error);
// //       Alert.alert('Export Failed', 'Failed to export data. Please try again.');
// //     }
// //   };

// //   if (isLoading) {
// //     return <Text>Loading...</Text>;
// //   }

// //   return (
// //     <View style={styles.mainContainer}>
// //       <FlatList
// //         data={donations}
// //         renderItem={({ item }) => {
// //           const recipientName = getRecipientName(item.RecipientId);
// //           const donorName = getDonorName(item.DonorId);
// //           const isSelected = selectedItemIds.includes(item.DonationId);

// //           return (
// //             <TouchableOpacity
// //               style={[styles.container, isSelected ? { backgroundColor: '#e6e6e6' } : null]}
// //               onPress={() => handleDonationPress(item)}
// //             >
// //               <View className='flex justify-center' style={styles.rowContainer}>
// //                 <View style={styles.columnContainer}>
// //                   <View style={styles.labelTextContainer}>
// //                     <Text style={styles.label}>From:</Text>
// //                     <Text style={styles.text}>{donorName}</Text>
// //                   </View>
// //                   <View style={styles.labelTextContainer}>
// //                     <Text style={styles.label}>To:</Text>
// //                     <Text style={styles.text}>{recipientName}</Text>
// //                   </View>
// //                 </View>

// //                 <View style={styles.columnContainer}>
// //                   <View style={styles.labelTextContainer}>
// //                     <Text style={styles.label}>Date:</Text>
// //                     <Text style={styles.text}>{item.DonationDate}</Text>
// //                   </View>
// //                   <View style={styles.labelTextContainer}>
// //                     <Text style={styles.label}>Quantity:</Text>
// //                     <Text style={styles.text}>{item.Quantity}</Text>
// //                   </View>
// //                 </View>

// //                 <TouchableOpacity onPress={() => handleDonationPress(item)}>
// //                   <Ionicons
// //                     name={isSelected ? 'checkbox' : 'checkbox-outline'}
// //                     size={24}
// //                     color={isSelected ? colors.PRIMARY : '#999'}
// //                   />
// //                 </TouchableOpacity>
// //               </View>
// //             </TouchableOpacity>
// //           );
// //         }}
// //         keyExtractor={(item, index) => index.toString()}
// //         refreshControl={
// //           <RefreshControl
// //             refreshing={refreshing}
// //             onRefresh={onRefresh}
// //             colors={[colors.PRIMARY]}
// //           />
// //         }
// //       />

// //       {selectedDonation && (
// //         <DonationDetails
// //           donation={selectedDonation}
// //           onClose={() => setSelectedDonation(null)}
// //         />
// //       )}

// //       <View style={styles.exportButtonContainer}>
// //         <Button
// //           textColor='white'
// //           rippleColor='#00a651c4'
// //           buttonColor="#00a651"
// //           mode="contained"
// //           theme={{ colors: { primary: 'green' } }}
// //           onPress={generateExcel}
// //         >
// //           Export to Xls File
// //         </Button>
// //       </View>

// //       <Modal
// //         animationType="slide"
// //         transparent={true}
// //         visible={modalVisible}
// //         onRequestClose={() => {
// //           setModalVisible(false);
// //         }}
// //       >
// //         <View style={styles.modalContainer}>
// //           <View style={styles.modalContent}>
// //             <Text style={styles.modalText}>Are you sure you want to deselect all items?</Text>
// //             <View style={styles.modalButtons}>
// //               <Button onPress={() => { setSelectedItemIds([]); setModalVisible(false); }}>Yes</Button>
// //               <Button onPress={() => setModalVisible(false)}>No</Button>
// //             </View>
// //           </View>
// //         </View>
// //       </Modal>
// //     </View>
// //   );
// // }

// // const styles = StyleSheet.create({
// //   mainContainer: {
// //     flex: 1,
// //     // paddingTop: 40,
// //     backgroundColor: "#fff",
// //     paddingHorizontal: 10,
// //     padding: 10,
// //     borderWidth: 2,
// //     borderColor: "red",
// //   },

// //   container: {
// //     backgroundColor: "#fff",
// //     borderRadius: 10,
// //     borderWidth: 2,
// //     borderColor: "#00a651",
// //     marginVertical: 10,
// //     padding: 15,
// //     display: 'flex',
// //     justifyContent: 'center'
// //   },

// //   rowContainer: {
// //     flexDirection: 'row',
// //     justifyContent: 'space-between',
// //     alignItems: 'center',
// //   },

// //   columnContainer: {
// //     flex: 1,
// //     flexDirection: 'column',
// //     marginHorizontal: 5,
// //   },

// //   labelTextContainer: {
// //     marginBottom: 10,
// //   },

// //   label: {
// //     fontWeight: 'bold',
// //     color: '#999',
// //   },

// //   text: {
// //     color: '#121212',
// //   },

// //   exportButtonContainer: {
// //     position: "absolute",
// //     top: Platform.OS === "ios" ? 36 : 6,
// //     right: 12,
// //     borderRadius: 60
// //   },

// //   modalContainer: {
// //     flex: 1,
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //     backgroundColor: 'rgba(0, 0, 0, 0.5)',
// //   },

// //   modalContent: {
// //     backgroundColor: '#fff',
// //     padding: 20,
// //     borderRadius: 10,
// //     alignItems: 'center',
// //   },

// //   modalText: {
// //     marginBottom: 20,
// //     textAlign: 'center',
// //   },

// //   modalButtons: {
// //     flexDirection: 'row',
// //     justifyContent: 'space-between',
// //   },
// // });

// // export default Donation;










// // // -------------------------------------------------------------------



// import React, { useEffect, useState } from "react";
// import {
//   View,
//   StyleSheet,
//   Text,
//   FlatList,
//   RefreshControl,
//   TouchableOpacity,
//   Alert,
//   Platform,
//   Modal,
// } from "react-native";
// import colors from "../../misc/colors";
// import { useDonationContext } from "../contexts/DonationContext";
// import DonationDetails from "../DonationDetails";
// import * as XLSX from "xlsx";
// import * as FileSystem from "expo-file-system";
// import * as Sharing from "expo-sharing";
// import * as MediaLibrary from "expo-media-library";
// import { Button } from 'react-native-paper';
// import { Ionicons } from '@expo/vector-icons';
// import { useNavigation } from "expo-router";

// const Donation = () => {
//   const { donations, fetchDonations, recipients, drugs, fetchRecipients, donors } = useDonationContext();
//   const navigation = useNavigation();
//   const [isLoading, setIsLoading] = useState(true);
//   const [refreshing, setRefreshing] = useState(false);
//   const [selectedDonation, setSelectedDonation] = useState(null);
//   const [selectedItemIds, setSelectedItemIds] = useState([]);
//   const [storagePermissionGranted, setStoragePermissionGranted] = useState(false);
//   const [modalVisible, setModalVisible] = useState(false);
//   const [longPressActivated, setLongPressActivated] = useState(false);

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

//   useEffect(() => {
//     fetchRecipients();
//   }, []);

//   useEffect(() => {
//     const checkStoragePermission = async () => {
//       try {
//         const { status } = await MediaLibrary.requestPermissionsAsync();
//         setStoragePermissionGranted(status === 'granted');
//       } catch (error) {
//         console.error('Error requesting storage permission:', error);
//         setStoragePermissionGranted(false);
//       }
//     };

//     checkStoragePermission();
//   }, []);

//   useEffect(() => {
//     const unsubscribe = navigation.addListener('beforeRemove', (e) => {
//       if (selectedItemIds.length > 0) {
//         // Prevent default behavior of leaving the screen
//         e.preventDefault();
//         // Show confirmation modal
//         setModalVisible(true);
//       }
//     });

//     return unsubscribe;
//   }, [navigation, selectedItemIds]);

//   const onRefresh = async () => {
//     setRefreshing(true);
//     await fetchDonations();
//     setRefreshing(false);
//   };

//   const handleDonationPress = (item) => {
//     if (!longPressActivated) {
//       const index = selectedItemIds.indexOf(item.DonationId);
//       if (index !== -1) {
//         // Item already selected, remove it
//         setSelectedItemIds(selectedItemIds.filter(id => id !== item.DonationId));
//       } else {
//         // Item not selected, add it
//         setSelectedItemIds([...selectedItemIds, item.DonationId]);
//       }
//     }
//   };

//   const handleLongPress = () => {
//     setLongPressActivated(true);
//   };

//   const handleCheckboxPress = (item) => {
//     const index = selectedItemIds.indexOf(item.DonationId);
//     if (index !== -1) {
//       // Item already selected, remove it
//       setSelectedItemIds(selectedItemIds.filter(id => id !== item.DonationId));
//     } else {
//       // Item not selected, add it
//       setSelectedItemIds([...selectedItemIds, item.DonationId]);
//     }
//   };

//   const getRecipientName = (recipientId) => {
//     const recipient = recipients.find(recipient => recipient.RecipientId === recipientId);
//     return recipient ? recipient.RecipientName : 'Unknown';
//   };

//   const getDonorName = (donorId) => {
//     const donor = donors.find(donor => donor.DonorId === donorId);
//     return donor ? donor.DonorName : 'Unknown';
//   }

//   const generateExcel = async () => {
//     try {
//       if (!storagePermissionGranted) {
//         const { status } = await MediaLibrary.requestPermissionsAsync();
//         setStoragePermissionGranted(status === 'granted');
//         if (!storagePermissionGranted) {
//           Alert.alert(
//             'Permission Required',
//             "To export data, please grant permission to access your device's storage."
//           );
//           return;
//         }
//       }

//       const sharingAvailable = await Sharing.isAvailableAsync();
//       if (!sharingAvailable) {
//         throw new Error('Sharing is not available on this device.');
//       }

//       const selectedDonations = donations.filter(donation => selectedItemIds.includes(donation.DonationId));

//       const wb = XLSX.utils.book_new();

//       selectedDonations.forEach((donation, index) => {
//         const ws = XLSX.utils.json_to_sheet([donation]);
//         XLSX.utils.book_append_sheet(wb, ws, `Donation${index + 1}`);
//       });

//       const base64 = XLSX.write(wb, { type: 'base64' });

//       const filename = 'SelectedDonations.xlsx';

//       const filePath = `${FileSystem.documentDirectory}${filename}`;
//       await FileSystem.writeAsStringAsync(filePath, base64, {
//         encoding: FileSystem.EncodingType.Base64,
//       });

//       console.log('Excel data written to file:', filePath);

//       await Sharing.shareAsync(filePath);

//       Alert.alert('Success', 'Excel file exported and saved to device storage.');
//     } catch (error) {
//       console.error('Error exporting data:', error);
//       Alert.alert('Export Failed', 'Failed to export data. Please try again.');
//     }
//   };

//   if (isLoading) {
//     return <Text>Loading...</Text>;
//   }

//   return (
//     <View style={styles.mainContainer}>
//       <FlatList
//         data={donations}
//         renderItem={({ item }) => {
//           const recipientName = getRecipientName(item.RecipientId);
//           const donorName = getDonorName(item.DonorId);
//           const isSelected = selectedItemIds.includes(item.DonationId);

//           return (
//             <TouchableOpacity
//               style={[styles.container, isSelected ? { backgroundColor: '#e6e6e6' } : null]}
//               onPress={() => handleDonationPress(item)}
//               onLongPress={handleLongPress}
//             >
//               <View className='flex justify-center' style={styles.rowContainer}>
//                 <View style={styles.columnContainer}>
//                   <View style={styles.labelTextContainer}>
//                     <Text style={styles.label}>From:</Text>
//                     <Text style={styles.text}>{donorName}</Text>
//                   </View>
//                   <View style={styles.labelTextContainer}>
//                     <Text style={styles.label}>To:</Text>
//                     <Text style={styles.text}>{recipientName}</Text>
//                   </View>
//                 </View>

//                 <View style={styles.columnContainer}>
//                   <View style={styles.labelTextContainer}>
//                     <Text style={styles.label}>Date:</Text>
//                     <Text style={styles.text}>{item.DonationDate}</Text>
//                   </View>
//                   <View style={styles.labelTextContainer}>
//                     <Text style={styles.label}>Quantity:</Text>
//                     <Text style={styles.text}>{item.Quantity}</Text>
//                   </View>
//                 </View>

//                 {longPressActivated && (
//                   <TouchableOpacity onPress={() => handleCheckboxPress(item)}>
//                     <Ionicons name={isSelected ? 'checkbox-outline' : 'square-outline'} size={24} color="black" />
//                   </TouchableOpacity>
//                 )}
//               </View>
//             </TouchableOpacity>
//           );
//         }}
//         keyExtractor={(item, index) => index.toString()}
//         refreshControl={
//           <RefreshControl
//             refreshing={refreshing}
//             onRefresh={onRefresh}
//             colors={[colors.PRIMARY]}
//           />
//         }
//       />

//       {selectedDonation && (
//         <DonationDetails
//           donation={selectedDonation}
//           onClose={() => setSelectedDonation(null)}
//         />
//       )}

//       <View style={styles.exportButtonContainer}>
//         <Button
//           textColor='white'
//           rippleColor='#00a651c4'
//           buttonColor="#00a651"
//           mode="contained"
//           theme={{ colors: { primary: 'green' } }}
//           onPress={generateExcel}
//         >
//           Export to Xls File
//         </Button>
//       </View>

//       <Modal
//         animationType="slide"
//         transparent={true}
//         visible={modalVisible}
//         onRequestClose={() => {
//           setModalVisible(false);
//         }}
//       >
//         <View style={styles.modalContainer}>
//           <View style={styles.modalContent}>
//             <Text style={styles.modalText}>Are you sure you want to deselect all items?</Text>
//             <View style={styles.modalButtons}>
//               <Button onPress={() => { setSelectedItemIds([]); setModalVisible(false); }}>Yes</Button>
//               <Button onPress={() => setModalVisible(false)}>No</Button>
//             </View>
//           </View>
//         </View>
//       </Modal>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   mainContainer: {
//     flex: 1,
//     // paddingTop: 40,
//     backgroundColor: "#fff",
//     paddingHorizontal: 10,
//     padding: 10,
//     borderWidth: 2,
//     borderColor: "red",
//   },

//   container: {
//     backgroundColor: "#fff",
//     borderRadius: 10,
//     borderWidth: 2,
//     borderColor: "#00a651",
//     marginVertical: 10,
//     padding: 15,
//     display: 'flex',
//     justifyContent: 'center'
//   },

//   rowContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//   },

//   columnContainer: {
//     flex: 1,
//     flexDirection: 'column',
//     marginHorizontal: 5,
//   },

//   labelTextContainer: {
//     marginBottom: 10,
//   },

//   label: {
//     fontWeight: 'bold',
//     color: '#999',
//   },

//   text: {
//     color: '#121212',
//   },

//   exportButtonContainer: {
//     position: "absolute",
//     top: Platform.OS === "ios" ? 36 : 6,
//     right: 12,
//     borderRadius: 60
//   },

//   modalContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: 'rgba(0, 0, 0, 0.5)',
//   },

//   modalContent: {
//     backgroundColor: '#fff',
//     padding: 20,
//     borderRadius: 10,
//     alignItems: 'center',
//   },

//   modalText: {
//     marginBottom: 20,
//     textAlign: 'center',
//   },

//   modalButtons: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//   },
// });

// export default Donation;


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
import { useNavigation } from "expo-router";

const Donation = () => {
  const { donations, fetchDonations, recipients, drugs, fetchRecipients, donors } = useDonationContext();
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedDonation, setSelectedDonation] = useState(null);
  const [selectedItemIds, setSelectedItemIds] = useState([]);
  const [storagePermissionGranted, setStoragePermissionGranted] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [longPressActivated, setLongPressActivated] = useState(false);




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

  useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', (e) => {
      if (selectedItemIds.length > 0) {
        // Prevent default behavior of leaving the screen
        e.preventDefault();
        // Show confirmation modal
        setModalVisible(true);
      }
    });

    return unsubscribe;
  }, [navigation, selectedItemIds]);

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

  const handleLongPress = () => {
    if (!longPressActivated) {
      setLongPressActivated(true);
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
              onPress={() => handleDonationPress(item)}
              onLongPress={handleLongPress}
            >
              <View className='flex justify-center' style={styles.rowContainer}>
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

                {longPressActivated ? (
                  <TouchableOpacity onPress={() => handleCheckboxPress(item)}>
                    <Ionicons name={isSelected ? 'checkbox-outline' : 'square-outline'} size={24} color="black" />
                  </TouchableOpacity>
                ) : null}
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
              <Button onPress={() => { setSelectedItemIds([]); setModalVisible(false); }}>Yes</Button>
              <Button onPress={() => setModalVisible(false)}>No</Button>
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
    // paddingTop: 40,
    backgroundColor: "#fff",
    paddingHorizontal: 10,
    padding: 10,
    borderWidth: 2,
    borderColor: "red",
  },

  container: {
    backgroundColor: "#fff",
    borderRadius: 10,
    borderWidth: 2,
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
  },
});

export default Donation;
