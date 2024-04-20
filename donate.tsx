// // // import React, { useState, useEffect, useRef } from "react";
// // // import {
// // //   View,
// // //   StyleSheet,
// // //   TextInput,
// // //   StatusBar,
// // //   Platform,
// // //   Modal,
// // //   TouchableWithoutFeedback,
// // //   Text,
// // //   Dimensions,
// // //   ScrollView,
// // //   Alert,
// // //   Linking,
// // //   Image
// // // } from "react-native";
// // // import { Picker } from '@react-native-picker/picker'
// // // import { useDonationContext } from "../contexts/DonationContext";
// // // import { Camera } from "expo-camera";
// // // import { TouchableOpacity } from "react-native";
// // // import { AntDesign, MaterialCommunityIcons } from "@expo/vector-icons";
// // // import { Keyboard } from "react-native";


// const windowWidth = Dimensions.get("window").width;
// const windowHeight = Dimensions.get("window").height;

// // // const SuccessMessage = ({ visible }: { visible: boolean }) =>
// // //   visible ? (
// // //     <View style={styles.successMessage}>
// // //       <AntDesign name="checkcircle" size={24} color="white" />
// // //       <Text style={styles.successText}>Success</Text>
// // //     </View>
// // //   ) : null;

// // // const ErrorMessage = ({
// // //   visible,
// // //   message,
// // // }: {
// // //   visible: boolean;
// // //   message: string;
// // // }) =>
// // //   visible ? (
// // //     <View style={styles.errorText}>
// // //       <AntDesign name="exclamationcircle" size={24} color="white" />
// // //       <Text style={styles.errorText}>{message}</Text>
// // //     </View>
// // //   ) : null;

// // // export default function Donate() {
//   const { donationForm, setDonationForm, addDonation, recipients, selectedDonorId,
//     setSelectedDonorId, drugNames, donors, fetchDonors, fetchRecipients, fetchDrugs, selectedDrugName, handleDrugNameChange, } = useDonationContext();
// // //   const [scanBarcodeVisible, setScanBarcodeVisible] = useState(false);
// // //   const [showScannedInputs, setShowScannedInputs] = useState(false);
// // //   const [successVisible, setSuccessVisible] = useState(false);
// // //   const [touchedScreen, setTouchedScreen] = useState(false);
// // //   const [errorVisible, setErrorVisible] = useState(false);
// // //   const [errorMessage, setErrorMessage] = useState("");
// // //   const [focusedInput, setFocusedInput] = useState(null);
// // //   const [confirmationVisible, setConfirmationVisible] = useState(false);
// // //   const [selectedRecipient, setSelectedRecipient] = useState('');
// // //   // const [selectedDonor, setSelectedDonor] = useState("");
// // //   const [date, setDate] = useState(new Date());
// // //   // const [mode, setMode] = useState('date');
// // //   // const [show, setShow] = useState(false);
// // //   const [type, setType] = useState(Camera.Constants.Type.back);
// // //   // const [cameraVisible, setCameraVisible] = useState(true);
// // //   const cameraRef = useRef(null);
// // //   const previousZoomRef = useRef(null);
// // //   const [flashMode, setFlashMode] = useState(Camera.Constants.FlashMode.off);
// // //   const [zoom, setZoom] = useState(0.1);
// // //   const [resetForm, setResetForm] = useState(false);
// // //   const [barcodeData, setBarcodeData] = useState([]);
// // //   const [cameraVisible, setCameraVisible] = useState(false);
// // //   const [numSections, setNumSections] = useState(1)
// // //   const [modalVisible, setModalVisible] = useState(false);

//   useEffect(() => {
//     // Fetch donors, recipients, and drugs data initially
//     fetchDonors();
//     fetchRecipients();
//     fetchDrugs();
//   }, []);



// // //   // Update DonationDate in donationForm state when date changes
// // //   useEffect(() => {
// // //     setDonationForm({
// // //       ...donationForm,
// // //       DonationDate: date, // Update DonationDate with selected date
// // //     });
// // //   }, [date]); // Only re-run the effect if date changes



//   const handleRecipientChange = (recipientId) => {
//     const selectedRecipient = recipients.find(recipient => recipient.RecipientId.toString() === recipientId);
//     if (selectedRecipient) {
//       const recipientIdInt = parseInt(recipientId, 10); // Convert recipientId to integer
//       setSelectedRecipient(recipientIdInt.toString()); // Set selectedRecipient as string for consistency
//       setDonationForm(prevState => ({
//         ...prevState,
//         RecipientId: recipientIdInt, // Set recipientId as integer
//         RecipientName: selectedRecipient.RecipientName // Set the recipient name in donationForm
//       }));
//     }
//   };


// // //   const handleFocus = (inputName) => {
// // //     setFocusedInput(inputName);
// // //   };

// // //   const handleBlur = () => {
// // //     setFocusedInput(null);
// // //   };

// // //   useEffect(() => {
// // //     const timer = setTimeout(() => {
// // //       if (!touchedScreen) {
// // //         Keyboard.dismiss();
// // //       }
// // //     }, 2500);

// // //     return () => clearTimeout(timer);
// // //   }, [touchedScreen]);


//   // Function to handle submission confirmation
//   const handleConfirmation = () => {
//     setConfirmationVisible(true);
//   };

// // //   const handleSubmit = async () => {
// // //     try {
// // //       Keyboard.dismiss();

// // //       // Perform form validation
// // //       if (
// // //         !donationForm.LOT ||
// // //         !donationForm.ExpiryDate ||
// // //         !donationForm.GTIN
// // //       ) {
// // //         throw new Error("you must scan the required Barcode fields.");
// // //       }

// // //       // Add donation
// // //       await addDonation();

// // //       // Clear form fields only if submission is successful
// // //       setDonationForm({
// // //         // DonorId: uuid.v4(),
// // //         DonorId: "",
// // //         RecipientId: "",
// // //         DrugName: "",
// // //         Quantity: "",
// // //         Presentation: "",
// // //         Form: "",
// // //         DonationPurpose: "",
// // //         DonationDate: "",
// // //         ProductionDate: "2024-03-31",
// // //         Laboratory: "",
// // //         LaboratoryCountry: "",
// // //         LOT: "",
// // //         ExpiryDate: "",
// // //         GTIN: "",
// // //         Serial: "",
// // //       });

// // //       // Toggle the reset flag to force reset the form fields
// // //       setResetForm(true);

// // //       // Display success message
// // //       setSuccessVisible(true);
// // //       // Display confirmation modal
// // //       handleConfirmation();
// // //       // Hide the success message after 2 seconds
// // //       setTimeout(() => {
// // //         setSuccessVisible(true);
// // //       }, 2000);
// // //     } catch (error: any) {
// // //       if (error.message === "Failed to add donation") {
// // //         setErrorMessage("Failed to add donation.");
// // //       } else {
// // //         setErrorMessage(error.message); // Handle other types of errors
// // //       }
// // //       setErrorVisible(true);
// // //     }
// // //   };

// // //   // Effect to reset the form fields when the reset flag changes
// // //   useEffect(() => {
// // //     if (resetForm) {
// // //       setDonationForm({
// // //         DonorId: "",
// // //         RecipientId: "",
// // //         DrugName: "",
// // //         Quantity: "",
// // //         Presentation: "",
// // //         Form: "",
// // //         DonationPurpose: "",
// // //         DonationDate: "",
// // //         ProductionDate: "2024-03-31",
// // //         Laboratory: "",
// // //         LaboratoryCountry: "",
// // //         LOT: "",
// // //         ExpiryDate: "",
// // //         GTIN: "",
// // //         Serial: "",
// // //       });
// // //       // Reset the reset flag
// // //       setResetForm(false);
// // //     }
// // //   }, [resetForm]);

// // //   // Function to add a new barcode data object
// // //   const addBarcode = (newBarcode) => {
// // //     setBarcodeData([...barcodeData, newBarcode]);
// // //   };

// // //   // Function to handle barcode scanned
// // //   // Function to handle barcode scanned
// // //   const handleBarcodeScanned = ({ type, data }) => {
// // //     console.log(`Barcode with type ${type} and data ${data} has been scanned!`);
// // //     try {
// // //       // Parse scanned data
// // //       const response = { GTIN: '', LOT: '', ExpiryDate: '', Serial: '' };
// // //       let responseCode = data;

// // //       const prefixes = [
// // //         { prefix: '01', key: 'GTIN', length: 14 },
// // //         { prefix: '10', key: 'LOT' },
// // //         { prefix: '17', key: 'ExpiryDate', length: 6 },
// // //         { prefix: '21', key: 'Serial' },
// // //       ];

// // //       prefixes.forEach(({ prefix, key, length }) => {
// // //         const position = responseCode.indexOf(prefix);

// // //         if (position !== -1) {
// // //           const start = position + prefix.length;
// // //           let end;

// // //           if (length) {
// // //             end = start + length;
// // //           } else {
// // //             const gsPosition = responseCode.indexOf(String.fromCharCode(29), start);
// // //             end = gsPosition !== -1 ? gsPosition : responseCode.length;
// // //           }

// // //           response[key] = responseCode.substring(start, end);
// // //           responseCode = responseCode.slice(0, position) + responseCode.slice(end);
// // //         }
// // //       });

// // //       // Append the parsed response to the barcode data
// // //       const newData = [...barcodeData, response];
// // //       setBarcodeData(newData);
// // //       setCameraVisible(false); // Close camera modal after scanning
// // //       setModalVisible(true); // Open modal to display new barcode section
// // //     } catch (error) {
// // //       console.error("Error parsing scanned data:", error);
// // //       // Handle error
// // //     }
// // //   };


// // //   // Function to open the camera modal and initiate scanning
// // //   const openCamera = () => {
// // //     setCameraVisible(true);
// // //   };

// // //   // Function to add more barcode input sections
// // //   const addMoreSections = () => {
// // //     openCamera();
// // //   };


// // //   const handleScanBarcode = async () => {
// // //     const { status } = await Camera.requestCameraPermissionsAsync();

// // //     if (status === 'granted') {
// // //       // Permission granted, show barcode scanner
// // //       setScanBarcodeVisible(true);
// // //     } else {
// // //       // Permission denied or not granted yet
// // //       Alert.alert(
// // //         'Camera Permission Required',
// // //         'To scan barcodes, this app needs access to your camera. Please enable camera access in your device settings.',
// // //         [
// // //           {
// // //             text: 'Cancel',
// // //             style: 'cancel',
// // //             onPress: () => console.log('Cancel Pressed'),
// // //           },
// // //           {
// // //             text: 'Go to Settings',
// // //             onPress: () => openSettings(),
// // //           },
// // //         ],
// // //         { cancelable: false }
// // //       );
// // //     }
// // //   };

// // //   const openSettings = () => {
// // //     // Open app settings so user can grant camera permission manually
// // //     Linking.openSettings();
// // //   };

// // //   const handleCloseBarcodeModal = () => {
// // //     setScanBarcodeVisible(false);
// // //   };

// // //   const dismissKeyboard = () => {
// // //     Keyboard.dismiss();
// // //   };

// // //   function flipCamera() {
// // //     setType(
// // //       type === Camera.Constants.Type.back
// // //         ? Camera.Constants.Type.front
// // //         : Camera.Constants.Type.back
// // //     );
// // //   }

// // //   function toggleFlash() {
// // //     setFlashMode(
// // //       flashMode === Camera.Constants.FlashMode.off
// // //         ? Camera.Constants.FlashMode.torch
// // //         : Camera.Constants.FlashMode.off
// // //     );
// // //   }

// // //   function handlePinchGesture(event) {
// // //     const touch1 = event.nativeEvent.touches[0];
// // //     const touch2 = event.nativeEvent.touches[1];

// // //     if (!touch1 || !touch2) return;

// // //     const distance = Math.sqrt(
// // //       Math.pow(touch2.pageX - touch1.pageX, 2) + Math.pow(touch2.pageY - touch1.pageY, 2)
// // //     );

// // //     if (!previousZoomRef.current) {
// // //       previousZoomRef.current = distance;
// // //       return;
// // //     }

// // //     const delta = previousZoomRef.current - distance;
// // //     const zoomFactor = delta / 500; // Adjust this value as needed for zoom speed

// // //     setZoom(prevZoom => Math.max(0, Math.min(prevZoom + zoomFactor, 1)));
// // //     previousZoomRef.current = distance;
// // //   }

// // //   function zoomIn() {
// // //     setZoom(prevZoom => Math.min(prevZoom + 0.1, 1));
// // //   }

// // //   function zoomOut() {
// // //     setZoom(prevZoom => Math.max(prevZoom - 0.1, 0));
// // //   }

// // //   return (
// // //     <>
// // //       <ScrollView
// // //         style={{ flex: 1 }}
// // //         contentContainerStyle={styles.scrollViewContent}
// // //       >
// // //         <TouchableWithoutFeedback onPress={dismissKeyboard}>
// // //           <View style={styles.container}>

// // //             <View style={styles.donorsIinputs}>
// // //               <View>
// // //                 <View style={styles.inputGroup}>
// // //                   <Text style={styles.label}>Donor:</Text>
// // //                   <View style={styles.pickerContainer}>
// // //                     <Picker
// // //                       selectedValue={selectedDonorId}
// // //                       onValueChange={(itemValue, itemIndex) =>
// // //                         setSelectedDonorId(itemValue)
// // //                       }
// // //                       style={styles.picker}
// // //                       itemStyle={styles.pickerItem}
// // //                     >
// // //                       <Picker.Item label="Select a donor" value={null} />
// // //                       {donors && donors.map((donor) => (
// // //                         <Picker.Item
// // //                           key={`${donor.DonorId}-${donor.DonorName}`}
// // //                           label={donor.DonorName}
// // //                           value={donor}
// // //                         />
// // //                       ))}
// // //                     </Picker>
// // //                   </View>
// // //                 </View>

// // //                 <View style={styles.inputGroup}>
// // //                   <Text style={styles.label}>Recipient:</Text>
// // //                   <View style={styles.pickerContainer}>
// // //                     <Picker
// // //                       selectedValue={selectedRecipient}
// // //                       onValueChange={handleRecipientChange}
// // //                       style={styles.picker}
// // //                       itemStyle={styles.pickerItem}
// // //                     >
// // //                       <Picker.Item label="Select" value="" />
// // //                       {recipients && recipients.map((recipient) => (
// // //                         <Picker.Item
// // //                           key={recipient.RecipientId}
// // //                           label={recipient.RecipientName}
// // //                           value={recipient.RecipientId.toString()}
// // //                         />
// // //                       ))}
// // //                     </Picker>
// // //                   </View>
// // //                 </View>

// // //                 <View style={styles.inputGroup}>
// // //                   <Text style={styles.label}>Purpose:</Text>
// // //                   <TextInput
// // //                     value={donationForm.DonationPurpose}
// // //                     onChangeText={(text) =>
// // //                       setDonationForm({ ...donationForm, DonationPurpose: text })
// // //                     }
// // //                     multiline={true}
// // //                     numberOfLines={4}
// // //                     placeholder="Donation Purpose"
// // //                     placeholderTextColor="#999"
// // //                     style={[
// // //                       styles.purposeInput,
// // //                       focusedInput === "DonationPurpose" && styles.inputFocused,
// // //                     ]}
// // //                     onFocus={() => handleFocus("DonationPurpose")}
// // //                     onBlur={handleBlur}
// // //                   />
// // //                 </View>
// // //               </View>
// // //             </View>

//             <View style={styles.barcodeContainer}>
//               <TouchableOpacity onPress={openCamera}>
//                 <Image
//                   source={require("../../../assets/2d.png")}
//                   style={{
//                     width: 400,
//                     height: 150,
//                     resizeMode: "contain"
//                   }}
//                 />
//               </TouchableOpacity>


//               <TouchableOpacity onPress={openCamera}>
//                 <Image
//                   source={require("../../../assets/pressHere.png")}
//                   style={{
//                     width: 200,
//                     height: 80,
//                     resizeMode: "contain"
//                   }}
//                 />
//               </TouchableOpacity>
//             </View>

// // //             {/* Render dynamic barcode containers and inputs */}
// // //             {barcodeData.map((data, index) => (
// // //               <View key={index} style={styles.roundedContainer}>
// // //                 <Text style={styles.topText}>2D Barcode</Text>

// // //                 <View style={styles.inputGroup}>
// // //                   <Text style={styles.label}>GTIN:</Text>
// // //                   <TextInput
// // //                     value={data.GTIN}
// // //                     onChangeText={(text) => {
// // //                       const newData = [...barcodeData];
// // //                       newData[index].GTIN = text;
// // //                       setBarcodeData(newData);
// // //                     }}
// // //                     placeholder="Gtin"
// // //                     placeholderTextColor="#999"
// // //                     style={styles.input}
// // //                     editable={true}
// // //                   />
// // //                 </View>

// // //                 <View style={styles.inputGroup}>
// // //                   <Text style={styles.label}>LOT/Batch Number:</Text>
// // //                   <TextInput
// // //                     value={data.LOT}
// // //                     onChangeText={(text) => {
// // //                       const newData = [...barcodeData];
// // //                       newData[index].LOT = text;
// // //                       setBarcodeData(newData);
// // //                     }}
// // //                     placeholder="Lot#"
// // //                     placeholderTextColor="#999"
// // //                     style={styles.input}
// // //                     editable={true}
// // //                   />
// // //                 </View>

// // //                 <View style={styles.inputGroup}>
// // //                   <Text style={styles.label}>EXP:</Text>
// // //                   <TextInput
// // //                     value={data.ExpiryDate}
// // //                     onChangeText={(text) => {
// // //                       const newData = [...barcodeData];
// // //                       newData[index].ExpiryDate = text;
// // //                       setBarcodeData(newData);
// // //                     }}
// // //                     placeholder="Exp"
// // //                     placeholderTextColor="#999"
// // //                     style={styles.input}
// // //                     editable={true}
// // //                   />
// // //                 </View>

// // //                 <View style={styles.inputGroup}>
// // //                   <Text style={styles.label}>Serial:</Text>
// // //                   <TextInput
// // //                     value={data.Serial}
// // //                     onChangeText={(text) => {
// // //                       const newData = [...barcodeData];
// // //                       newData[index].Serial = text;
// // //                       setBarcodeData(newData);
// // //                     }}
// // //                     placeholder="Serial"
// // //                     placeholderTextColor="#999"
// // //                     style={styles.input}
// // //                     editable={true}
// // //                   />
// // //                 </View>
// // //               </View>
// // //             ))}

// // //             <View style={styles.roundedContainer}>
// // //               <Text style={styles.topText}>Medication Details</Text>

// // //               <View style={styles.inputGroup}>
// // //                 <Text style={styles.label}>Medicine Name:</Text>
// // //                 <View style={styles.pickerContainer}>
// // //                   <Picker
// // //                     selectedValue={selectedDrugName}
// // //                     onValueChange={handleDrugNameChange}
// // //                     style={styles.picker}
// // //                   >
// // //                     {drugNames.map((name, index) => (
// // //                       <Picker.Item key={index} label={name} value={name} />
// // //                     ))}
// // //                   </Picker>
// // //                 </View>
// // //               </View>

// // //               <View style={{ flexDirection: 'row', gap: 6 }}>
// // //                 <View style={styles.inputGroup}>
// // //                   <Text style={styles.label}>Presentation:</Text>
// // //                   <TextInput
// // //                     value={donationForm.Presentation}
// // //                     onChangeText={(text) =>
// // //                       setDonationForm({ ...donationForm, Presentation: text })
// // //                     }
// // //                     placeholder="Presentation"
// // //                     placeholderTextColor="#999"
// // //                     style={[
// // //                       styles.presentationFormInput,
// // //                       focusedInput === "presentation" && styles.inputFocused,
// // //                     ]}
// // //                     onFocus={() => handleFocus("presentation")}
// // //                     onBlur={handleBlur}
// // //                   />
// // //                 </View>

// // //                 <View style={styles.inputGroup}>
// // //                   <Text style={styles.label}>Form:</Text>
// // //                   <TextInput
// // //                     value={donationForm.Form}
// // //                     onChangeText={(text) =>
// // //                       setDonationForm({ ...donationForm, Form: text })
// // //                     }
// // //                     placeholder="Form"
// // //                     placeholderTextColor="#999"
// // //                     style={[
// // //                       styles.presentationFormInput,
// // //                       focusedInput === "Form" && styles.inputFocused,
// // //                     ]}
// // //                     onFocus={() => handleFocus("Form")}
// // //                     onBlur={handleBlur}
// // //                   />
// // //                 </View>
// // //               </View>

// // //               <View style={{ flexDirection: 'row', gap: 6 }}>
// // //                 <View style={styles.inputGroup}>
// // //                   <Text style={styles.label}>Laboratory:</Text>
// // //                   <TextInput
// // //                     value={donationForm.Laboratory}
// // //                     onChangeText={(text) =>
// // //                       setDonationForm({ ...donationForm, Laboratory: text })
// // //                     }
// // //                     placeholder="Laboratory"
// // //                     placeholderTextColor="#999"
// // //                     style={[
// // //                       styles.presentationFormInput,
// // //                       focusedInput === "laboratory" && styles.inputFocused,
// // //                     ]}
// // //                     onFocus={() => handleFocus("laboratory")}
// // //                     onBlur={handleBlur}
// // //                   />
// // //                 </View>

// // //                 <View style={styles.inputGroup}>
// // //                   <Text style={styles.label}>Lab Country:</Text>
// // //                   <TextInput
// // //                     value={donationForm.LaboratoryCountry}
// // //                     onChangeText={(text) =>
// // //                       setDonationForm({ ...donationForm, LaboratoryCountry: text })
// // //                     }
// // //                     placeholder="Laboratory Country"
// // //                     placeholderTextColor="#999"
// // //                     style={[
// // //                       styles.presentationFormInput,
// // //                       focusedInput === "LaboratoryCountry" && styles.inputFocused,
// // //                     ]}
// // //                     onFocus={() => handleFocus("LaboratoryCountry")}
// // //                     onBlur={handleBlur}
// // //                   />
// // //                 </View>
// // //               </View>

// // //               <View style={styles.inputGroup}>
// // //                 <Text style={styles.qtyLabel}>Add Quantity</Text>
// // //                 <TextInput
// // //                   value={donationForm.Quantity}
// // //                   onChangeText={(text) => {
// // //                     // Remove non-numeric characters
// // //                     const numericValue = text.replace(/[^0-9]/g, '');
// // //                     // Update the state only if the input is a valid positive integer
// // //                     if (numericValue === '' || /^\d+$/.test(numericValue)) {
// // //                       setDonationForm({ ...donationForm, Quantity: numericValue });
// // //                     }
// // //                   }}
// // //                   placeholder="Quantity"
// // //                   placeholderTextColor="#999"
// // //                   style={[
// // //                     styles.quantityInput,
// // //                     focusedInput === "Quantity" && styles.inputFocused,
// // //                   ]}
// // //                   onFocus={() => handleFocus("Quantity")}
// // //                   onBlur={handleBlur}
// // //                   keyboardType="numeric"
// // //                 />
// // //               </View>
// // //             </View>

// // //             <SuccessMessage visible={successVisible} />

// // //             <View style={styles.errorTextContainer}>
// // //               <ErrorMessage visible={errorVisible} message={errorMessage} />
// // //             </View>

// // //             <View style={styles.buttonsContainer}>

// // //               <TouchableOpacity style={styles.addMoreBtn} onPress={addMoreSections}>
// // //                 <Text style={styles.addMoreBtnText}>Add more</Text>
// // //               </TouchableOpacity>

// // //               <TouchableOpacity
// // //                 style={styles.submitButton}
// // //                 onPress={handleSubmit}
// // //               >
// // //                 <Text style={styles.submitButtonText}>Submit</Text>
// // //               </TouchableOpacity>
// // //             </View>

// // //             {/* Camera modal */}
// // //             <Modal visible={cameraVisible} animationType="slide">
// // //               <View style={styles.cameraContainer}>
// // //                 <Camera
// // //                   style={styles.camera}
// // //                   type={Camera.Constants.Type.back}
// // //                   onBarCodeScanned={handleBarcodeScanned}
// // //                 />
// // //                 <TouchableOpacity style={styles.closeButton} onPress={() => setCameraVisible(false)}>
// // //                   <AntDesign name="close" size={24} color="#00a651" />
// // //                 </TouchableOpacity>
// // //               </View>
// // //             </Modal>
// // //           </View>
// // //         </TouchableWithoutFeedback>
// // //       </ScrollView>
// // //     </>
// // //   );
// // // }

// // // const styles = StyleSheet.create({
// // //   scrollViewContent: {
// // //     backgroundColor: '#fff',
// // //     flexGrow: 1,
// // //     alignItems: "center",
// // //     paddingBottom: 80,
// // //     paddingTop: 25,
// // //   },

//   roundedContainer: {
//     width: "auto",
//     borderWidth: 1,
//     borderColor: '#999',
//     borderRadius: 20,
//     padding: 10,
//     paddingTop: 20,
//     position: 'relative',
//     marginBottom: 20,
//     marginVertical: 10
//   },

//   barcodeContainer: {
//     width: "auto",
//     display: "flex",
//     flexDirection: "column",
//     justifyContent: "center",
//     alignItems: "center",
//     position: 'relative',
//     marginVertical: 25
//   },

// // //   topText: {
// // //     backgroundColor: '#fff',
// // //     position: 'absolute',
// // //     top: -15,
// // //     paddingHorizontal: 10,
// // //     alignSelf: 'center',
// // //     fontSize: 20,
// // //     fontWeight: "bold",
// // //     color: "#999"
// // //   },

// // //   container: {
// // //     alignItems: "center",
// // //     justifyContent: "flex-start",
// // //     position: "relative",
// // //     padding: 0,
// // //     marginBottom: 20
// // //   },

// // //   datePicker: {
// // //     width: "100%",
// // //   },

//   input: {
//     color: "#000",
//     height: windowHeight * 0.07,
//     width: windowWidth * 0.8,
//     marginVertical: windowHeight * 0.01,
//     borderWidth: 1,
//     borderRadius: 20,
//     borderColor: "#00a651",
//     padding: 15,
//   },

//   quantityInput: {
//     color: "#000",
//     height: windowHeight * 0.07,
//     width: windowWidth * 0.8,
//     marginVertical: windowHeight * 0.01,
//     borderWidth: 1,
//     borderRadius: 20,
//     borderColor: "#00a651",
//     padding: 15,
//     alignSelf: "center"
//   },

//   presentationFormInput: {
//     color: "#000",
//     height: windowHeight * 0.07,
//     width: windowWidth * 0.4,
//     marginVertical: windowHeight * 0.01,
//     borderWidth: 1,
//     borderRadius: 20,
//     borderColor: "#00a651",
//     padding: 15,
//   },

//   donorsIinputs: {
//     borderWidth: 1,
//     borderRadius: 20,
//     borderColor: "#999",
//     padding: 15,
//     marginBottom: 20
//   },

//   containerTitleContainer: {
//     position: 'relative',
//     borderBottomWidth: 1,
//     borderBottomColor: 'black',
//   },

// // //   containerTitle: {
// // //     position: 'absolute',
// // //     top: -10,
// // //     backgroundColor: 'white',
// // //     paddingHorizontal: 10,
// // //   },

// // //   scanInputs: {
// // //     borderWidth: 1,
// // //     borderRadius: 20,
// // //     borderColor: "#999",
// // //     padding: 15,
// // //     marginBottom: 20
// // //   },

// // //   drugInfoInputs: {
// // //     borderWidth: 1,
// // //     borderRadius: 20,
// // //     borderColor: "#999",
// // //     padding: 15,
// // //   },

// // //   purposeInput: {
// // //     color: "#000",
// // //     width: windowWidth * 0.8,
// // //     marginVertical: windowHeight * 0.01,
// // //     borderWidth: 1,
// // //     borderRadius: 20,
// // //     borderColor: "#00a651",
// // //     padding: 10,
// // //   },

// // //   placeholder: {
// // //     color: "#121212",
// // //   },

// // //   inputFocused: {
// // //     borderColor: "#00a651",
// // //   },

// // //   inputGroup: {
// // //     marginBottom: 20,
// // //   },

// // //   pickerContainer: {
// // //     borderColor: '#00a651',
// // //     borderWidth: 1,
// // //     borderRadius: 20,
// // //     marginTop: 10,
// // //     height: windowHeight * 0.07,
// // //   },

// // //   picker: {
// // //     color: '#121212',
// // //     width: '100%',
// // //     borderRadius: 20,
// // //   },

// // //   pickerItem: {
// // //     color: '#000',
// // //     fontSize: 16,
// // //   },

// // //   label: {
// // //     color: "#999",
// // //     marginRight: 10,
// // //     fontSize: 16,
// // //     fontWeight: "bold",
// // //   },
// // //   qtyLabel: {
// // //     color: "#999",
// // //     marginRight: 10,
// // //     fontSize: 16,
// // //     fontWeight: "bold",
// // //     alignSelf: "center"
// // //   },

// // //   successMessage: {
// // //     backgroundColor: "#00a651",
// // //     flexDirection: "row",
// // //     alignItems: "center",
// // //     justifyContent: "center",
// // //     padding: 8,
// // //     borderRadius: 5,
// // //     marginTop: 10,
// // //   },

// // //   successText: {
// // //     color: "white",
// // //     fontWeight: "bold",
// // //     marginLeft: 5,
// // //   },

// // //   errorTextContainer: {
// // //     alignItems: "center",
// // //     color: "red",
// // //     fontWeight: "bold",
// // //     marginTop: 5,
// // //   },

// // //   errorText: {
// // //     color: "red",
// // //     fontWeight: "bold",
// // //     marginLeft: 5,
// // //     marginTop: 5,
// // //   },

// // //   closeButton: {
// // //     position: "absolute",
// // //     top: windowHeight * 0.05,
// // //     right: windowWidth * 0.05,
// // //     zIndex: 1,
// // //   },

// // //   scanText: {
// // //     position: "absolute",
// // //     color: "#0096FF",
// // //     fontSize: 20,
// // //     bottom: windowHeight * 0.06,
// // //     right: windowWidth * 0.1 + 10,
// // //     zIndex: 1,
// // //     fontFamily: "Roboto",
// // //   },

// // //   scanIcon: {
// // //     position: "absolute",
// // //     color: "#00a651",
// // //     bottom: windowHeight * 0.03,
// // //     right: windowWidth * 0.06,
// // //     zIndex: 1,
// // //   },

// // //   buttonsContainer: {
// // //     display: "flex",
// // //     flexDirection: "row",
// // //     justifyContent: "space-around",
// // //     width: 300,
// // //   },

// // //   addMoreBtn: {
// // //     zIndex: 1,
// // //     backgroundColor: "#00a651",
// // //     paddingHorizontal: 20,
// // //     paddingVertical: 10,
// // //     borderRadius: 60,
// // //   },

// // //   submitButton: {
// // //     zIndex: 1,
// // //     paddingHorizontal: 20,
// // //     paddingVertical: 10,
// // //     borderWidth: 1,
// // //     borderRadius: 60,
// // //     borderColor: "#00a651"
// // //   },

// // //   addMoreBtnText: {
// // //     color: "white",
// // //     fontSize: 16,
// // //     fontWeight: "bold",
// // //   },

// // //   submitButtonText: {
// // //     color: "#00a651",
// // //     fontSize: 16,
// // //     fontWeight: "bold",
// // //   },

// // //   cameraContainer: {
// // //     backgroundColor: "#fff",
// // //     flex: 1,
// // //     justifyContent: "center",
// // //   },
// // //   camera: {
// // //     flex: 1,
// // //   },

// // //   buttonContainer: {
// // //     flexDirection: "column",
// // //     justifyContent: "space-between",
// // //     alignContent: "space-between",
// // //     position: "absolute",
// // //     top: 100,
// // //     right: 7,
// // //     gap: 10,

// // //   },

// // //   text: {
// // //     fontSize: 24,
// // //     color: "white",
// // //   },

// // //   iconButton: {
// // //     padding: 10,
// // //   },

// // //   zoomButtonsContainer: {
// // //     position: 'absolute',
// // //     bottom: 20,
// // //     flexDirection: 'row',
// // //     justifyContent: 'center',
// // //     alignItems: 'center',
// // //     width: '100%',
// // //   },

// // //   zoomInButton: {
// // //     backgroundColor: 'rgba(0, 0, 0, 0.5)',
// // //     borderRadius: 20,
// // //     paddingHorizontal: 20,
// // //     paddingVertical: 10,
// // //     marginHorizontal: 5,
// // //   },

// // //   zoomOutButton: {
// // //     backgroundColor: 'rgba(0, 0, 0, 0.5)',
// // //     borderRadius: 20,
// // //     paddingHorizontal: 22,
// // //     paddingVertical: 10,
// // //     marginHorizontal: 5,
// // //   },
// // // });



// // // /////////////////////////////////////////////////////////////


// // // import React, { useState, useEffect, useRef } from "react";
// // // import {
// // //   View,
// // //   StyleSheet,
// // //   TextInput,
// // //   StatusBar,
// // //   Platform,
// // //   Modal,
// // //   TouchableWithoutFeedback,
// // //   Text,
// // //   Dimensions,
// // //   ScrollView,
// // //   Alert,
// // //   Linking,
// // //   Image
// // // } from "react-native";
// // // import { Picker } from '@react-native-picker/picker'
// // // import { useDonationContext } from "../contexts/DonationContext";
// // // import { Camera } from "expo-camera";
// // // import { TouchableOpacity } from "react-native";
// // // import { AntDesign, MaterialCommunityIcons } from "@expo/vector-icons";
// // // import { Keyboard } from "react-native";


// // // const windowWidth = Dimensions.get("window").width;
// // // const windowHeight = Dimensions.get("window").height;

// // // const SuccessMessage = ({ visible }: { visible: boolean }) =>
// // //   visible ? (
// // //     <View style={styles.successMessage}>
// // //       <AntDesign name="checkcircle" size={24} color="white" />
// // //       <Text style={styles.successText}>Success</Text>
// // //     </View>
// // //   ) : null;

// // // const ErrorMessage = ({
// // //   visible,
// // //   message,
// // // }: {
// // //   visible: boolean;
// // //   message: string;
// // // }) =>
// // //   visible ? (
// // //     <View style={styles.errorText}>
// // //       <AntDesign name="exclamationcircle" size={24} color="white" />
// // //       <Text style={styles.errorText}>{message}</Text>
// // //     </View>
// // //   ) : null;

// // // export default function Donate() {
// // //   const { donationForm, setDonationForm, addDonation, recipients, selectedDonorId,
// // //     setSelectedDonorId, drugNames, donors, fetchDonors, fetchRecipients, fetchDrugs, selectedDrugName, handleDrugNameChange, } = useDonationContext();
// // //   const [scanBarcodeVisible, setScanBarcodeVisible] = useState(false);
// // //   const [showScannedInputs, setShowScannedInputs] = useState(false);
// // //   const [successVisible, setSuccessVisible] = useState(false);
// // //   const [touchedScreen, setTouchedScreen] = useState(false);
// // //   const [errorVisible, setErrorVisible] = useState(false);
// // //   const [errorMessage, setErrorMessage] = useState("");
// // //   const [focusedInput, setFocusedInput] = useState(null);
// // //   const [confirmationVisible, setConfirmationVisible] = useState(false);
// // //   const [selectedRecipient, setSelectedRecipient] = useState('');
// // //   // const [selectedDonor, setSelectedDonor] = useState("");
// // //   const [date, setDate] = useState(new Date());
// // //   // const [mode, setMode] = useState('date');
// // //   // const [show, setShow] = useState(false);
// // //   const [type, setType] = useState(Camera.Constants.Type.back);
// // //   // const [cameraVisible, setCameraVisible] = useState(true);
// // //   const cameraRef = useRef(null);
// // //   const previousZoomRef = useRef(null);
// // //   const [flashMode, setFlashMode] = useState(Camera.Constants.FlashMode.off);
// // //   const [zoom, setZoom] = useState(0.1);
// // //   const [resetForm, setResetForm] = useState(false);
// // //   const [barcodeData, setBarcodeData] = useState([]);
// // //   const [cameraVisible, setCameraVisible] = useState(false);
// // //   const [numSections, setNumSections] = useState(1)
// // //   const [modalVisible, setModalVisible] = useState(false);

// // //   useEffect(() => {
// // //     // Fetch donors, recipients, and drugs data initially
// // //     fetchDonors();
// // //     fetchRecipients();
// // //     fetchDrugs();
// // //   }, []);



// // //   // Update DonationDate in donationForm state when date changes
// // //   useEffect(() => {
// // //     setDonationForm({
// // //       ...donationForm,
// // //       DonationDate: date, // Update DonationDate with selected date
// // //     });
// // //   }, [date]); // Only re-run the effect if date changes



// // //   const handleRecipientChange = (recipientId) => {
// // //     const selectedRecipient = recipients.find(recipient => recipient.RecipientId.toString() === recipientId);
// // //     if (selectedRecipient) {
// // //       const recipientIdInt = parseInt(recipientId, 10); // Convert recipientId to integer
// // //       setSelectedRecipient(recipientIdInt.toString()); // Set selectedRecipient as string for consistency
// // //       setDonationForm(prevState => ({
// // //         ...prevState,
// // //         RecipientId: recipientIdInt, // Set recipientId as integer
// // //         RecipientName: selectedRecipient.RecipientName // Set the recipient name in donationForm
// // //       }));
// // //     }
// // //   };


// // //   const handleFocus = (inputName) => {
// // //     setFocusedInput(inputName);
// // //   };

// // //   const handleBlur = () => {
// // //     setFocusedInput(null);
// // //   };

// // //   useEffect(() => {
// // //     const timer = setTimeout(() => {
// // //       if (!touchedScreen) {
// // //         Keyboard.dismiss();
// // //       }
// // //     }, 2500);

// // //     return () => clearTimeout(timer);
// // //   }, [touchedScreen]);


// // //   // Function to handle submission confirmation
// // //   const handleConfirmation = () => {
// // //     setConfirmationVisible(true);
// // //   };

// // //   const handleSubmit = async () => {
// // //     try {
// // //       Keyboard.dismiss();

// // //       // Perform form validation
// // //       if (
// // //         !donationForm.LOT ||
// // //         !donationForm.ExpiryDate ||
// // //         !donationForm.GTIN
// // //       ) {
// // //         throw new Error("you must scan the required Barcode fields.");
// // //       }

// // //       // Add donation
// // //       await addDonation();

// // //       // Clear form fields only if submission is successful
// // //       setDonationForm({
// // //         // DonorId: uuid.v4(),
// // //         DonorId: "",
// // //         RecipientId: "",
// // //         DrugName: "",
// // //         Quantity: "",
// // //         Presentation: "",
// // //         Form: "",
// // //         DonationPurpose: "",
// // //         DonationDate: "",
// // //         ProductionDate: "2024-03-31",
// // //         Laboratory: "",
// // //         LaboratoryCountry: "",
// // //         LOT: "",
// // //         ExpiryDate: "",
// // //         GTIN: "",
// // //         Serial: "",
// // //       });

// // //       // Toggle the reset flag to force reset the form fields
// // //       setResetForm(true);

// // //       // Display success message
// // //       setSuccessVisible(true);
// // //       // Display confirmation modal
// // //       handleConfirmation();
// // //       // Hide the success message after 2 seconds
// // //       setTimeout(() => {
// // //         setSuccessVisible(true);
// // //       }, 2000);
// // //     } catch (error: any) {
// // //       if (error.message === "Failed to add donation") {
// // //         setErrorMessage("Failed to add donation.");
// // //       } else {
// // //         setErrorMessage(error.message); // Handle other types of errors
// // //       }
// // //       setErrorVisible(true);
// // //     }
// // //   };

// // //   // Effect to reset the form fields when the reset flag changes
// // //   useEffect(() => {
// // //     if (resetForm) {
// // //       setDonationForm({
// // //         DonorId: "",
// // //         RecipientId: "",
// // //         DrugName: "",
// // //         Quantity: "",
// // //         Presentation: "",
// // //         Form: "",
// // //         DonationPurpose: "",
// // //         DonationDate: "",
// // //         ProductionDate: "2024-03-31",
// // //         Laboratory: "",
// // //         LaboratoryCountry: "",
// // //         LOT: "",
// // //         ExpiryDate: "",
// // //         GTIN: "",
// // //         Serial: "",
// // //       });
// // //       // Reset the reset flag
// // //       setResetForm(false);
// // //     }
// // //   }, [resetForm]);

// // //   // Function to add a new barcode data object
// // //   const addBarcode = (newBarcode) => {
// // //     setBarcodeData([...barcodeData, newBarcode]);
// // //   };

// // //   // Function to handle barcode scanned
// // //   // Function to handle barcode scanned
// // //   const handleBarcodeScanned = ({ type, data }) => {
// // //     console.log(`Barcode with type ${type} and data ${data} has been scanned!`);
// // //     try {
// // //       // Parse scanned data
// // //       const response = { GTIN: '', LOT: '', ExpiryDate: '', Serial: '' };
// // //       let responseCode = data;

// // //       const prefixes = [
// // //         { prefix: '01', key: 'GTIN', length: 14 },
// // //         { prefix: '10', key: 'LOT' },
// // //         { prefix: '17', key: 'ExpiryDate', length: 6 },
// // //         { prefix: '21', key: 'Serial' },
// // //       ];

// // //       prefixes.forEach(({ prefix, key, length }) => {
// // //         const position = responseCode.indexOf(prefix);

// // //         if (position !== -1) {
// // //           const start = position + prefix.length;
// // //           let end;

// // //           if (length) {
// // //             end = start + length;
// // //           } else {
// // //             const gsPosition = responseCode.indexOf(String.fromCharCode(29), start);
// // //             end = gsPosition !== -1 ? gsPosition : responseCode.length;
// // //           }

// // //           response[key] = responseCode.substring(start, end);
// // //           responseCode = responseCode.slice(0, position) + responseCode.slice(end);
// // //         }
// // //       });

// // //       // Append the parsed response to the barcode data
// // //       const newData = [...barcodeData, response];
// // //       setBarcodeData(newData);
// // //       setCameraVisible(false); // Close camera modal after scanning
// // //       setModalVisible(true); // Open modal to display new barcode section
// // //     } catch (error) {
// // //       console.error("Error parsing scanned data:", error);
// // //       // Handle error
// // //     }
// // //   };

// // //   const handleCloseModals = () => {
// // //     setCameraVisible(false);
// // //     setModalVisible(false);
// // //   };

// // //   // Function to open the camera modal and initiate scanning
// // //   const openCamera = () => {
// // //     setCameraVisible(true);
// // //   };

// // //   // Function to add more barcode input sections
// // //   const handleAddMoreBarcode = () => {
// // //     openCamera();
// // //   };


// // //   const handleScanBarcode = async () => {
// // //     const { status } = await Camera.requestCameraPermissionsAsync();

// // //     if (status === 'granted') {
// // //       // Permission granted, show barcode scanner
// // //       setScanBarcodeVisible(true);
// // //     } else {
// // //       // Permission denied or not granted yet
// // //       Alert.alert(
// // //         'Camera Permission Required',
// // //         'To scan barcodes, this app needs access to your camera. Please enable camera access in your device settings.',
// // //         [
// // //           {
// // //             text: 'Cancel',
// // //             style: 'cancel',
// // //             onPress: () => console.log('Cancel Pressed'),
// // //           },
// // //           {
// // //             text: 'Go to Settings',
// // //             onPress: () => openSettings(),
// // //           },
// // //         ],
// // //         { cancelable: false }
// // //       );
// // //     }
// // //   };

// // //   const openSettings = () => {
// // //     // Open app settings so user can grant camera permission manually
// // //     Linking.openSettings();
// // //   };

// // //   const handleCloseBarcodeModal = () => {
// // //     setScanBarcodeVisible(false);
// // //   };

// // //   const dismissKeyboard = () => {
// // //     Keyboard.dismiss();
// // //   };

// // //   function flipCamera() {
// // //     setType(
// // //       type === Camera.Constants.Type.back
// // //         ? Camera.Constants.Type.front
// // //         : Camera.Constants.Type.back
// // //     );
// // //   }

// // //   function toggleFlash() {
// // //     setFlashMode(
// // //       flashMode === Camera.Constants.FlashMode.off
// // //         ? Camera.Constants.FlashMode.torch
// // //         : Camera.Constants.FlashMode.off
// // //     );
// // //   }

// // //   function handlePinchGesture(event) {
// // //     const touch1 = event.nativeEvent.touches[0];
// // //     const touch2 = event.nativeEvent.touches[1];

// // //     if (!touch1 || !touch2) return;

// // //     const distance = Math.sqrt(
// // //       Math.pow(touch2.pageX - touch1.pageX, 2) + Math.pow(touch2.pageY - touch1.pageY, 2)
// // //     );

// // //     if (!previousZoomRef.current) {
// // //       previousZoomRef.current = distance;
// // //       return;
// // //     }

// // //     const delta = previousZoomRef.current - distance;
// // //     const zoomFactor = delta / 500; // Adjust this value as needed for zoom speed

// // //     setZoom(prevZoom => Math.max(0, Math.min(prevZoom + zoomFactor, 1)));
// // //     previousZoomRef.current = distance;
// // //   }

// // //   function zoomIn() {
// // //     setZoom(prevZoom => Math.min(prevZoom + 0.1, 1));
// // //   }

// // //   function zoomOut() {
// // //     setZoom(prevZoom => Math.max(prevZoom - 0.1, 0));
// // //   }


// // //   return (
// // //     <>



// // //       <View style={styles.donorsIinputs}>
// // //         <View >
// // //           <View style={styles.inputGroup}>
// // //             <Text style={styles.label}>Donor:</Text>
// // //             <View style={styles.pickerContainer}>
// // //               <Picker
// // //                 selectedValue={selectedDonorId}
// // //                 onValueChange={(itemValue, itemIndex) =>
// // //                   setSelectedDonorId(itemValue)
// // //                 }
// // //                 style={styles.picker}
// // //                 itemStyle={styles.pickerItem}
// // //               >
// // //                 <Picker.Item label="Select a donor" value={null} />
// // //                 {donors && donors.map((donor) => (
// // //                   <Picker.Item
// // //                     key={`${donor.DonorId}-${donor.DonorName}`}
// // //                     label={donor.DonorName}
// // //                     value={donor}
// // //                   />
// // //                 ))}
// // //               </Picker>
// // //             </View>
// // //           </View>

// // //           <View style={styles.inputGroup}>
// // //             <Text style={styles.label}>Recipient:</Text>
// // //             <View style={styles.pickerContainer}>
// // //               <Picker
// // //                 selectedValue={selectedRecipient}
// // //                 onValueChange={handleRecipientChange}
// // //                 style={styles.picker}
// // //                 itemStyle={styles.pickerItem}
// // //               >
// // //                 <Picker.Item label="Select" value="" />
// // //                 {recipients && recipients.map((recipient) => (
// // //                   <Picker.Item
// // //                     key={recipient.RecipientId}
// // //                     label={recipient.RecipientName}
// // //                     value={recipient.RecipientId.toString()}
// // //                   />
// // //                 ))}
// // //               </Picker>
// // //             </View>
// // //           </View>

// // //           <View style={styles.inputGroup}>
// // //             <Text style={styles.label}>Purpose:</Text>
// // //             <TextInput
// // //               value={donationForm.DonationPurpose}
// // //               onChangeText={(text) =>
// // //                 setDonationForm({ ...donationForm, DonationPurpose: text })
// // //               }
// // //               multiline={true}
// // //               numberOfLines={4}
// // //               placeholder="Donation Purpose"
// // //               placeholderTextColor="#999"
// // //               style={[
// // //                 styles.purposeInput,
// // //                 focusedInput === "DonationPurpose" && styles.inputFocused,
// // //               ]}
// // //               onFocus={() => handleFocus("DonationPurpose")}
// // //               onBlur={handleBlur}
// // //             />
// // //           </View>
// // //         </View>
// // //       </View>

// // //       <View style={styles.barcodeContainer}>
// // //         <TouchableOpacity onPress={openCamera}>
// // //           <Image
// // //             source={require("../../../assets/2d.png")}
// // //             style={{
// // //               width: 400,
// // //               height: 150,
// // //               resizeMode: "contain"
// // //             }}
// // //           />
// // //         </TouchableOpacity>


// // //         <TouchableOpacity onPress={openCamera}>
// // //           <Image
// // //             source={require("../../../assets/pressHere.png")}
// // //             style={{
// // //               width: 200,
// // //               height: 80,
// // //               resizeMode: "contain"
// // //             }}
// // //           />
// // //         </TouchableOpacity>
// // //       </View>


// // //       {Array.from({ length: numSections }).map((_, index) => (
// // //         <View key={index}>
// // //           <View style={styles.roundedContainer}>
// // //             <Text style={styles.topText}>Medication Details</Text>

// // //             {/* Medication Details Inputs */}
// // //             <View style={styles.inputGroup}>
// // //               <Text style={styles.label}>Medicine Name:</Text>
// // //               <View style={styles.pickerContainer}>
// // //                 <Picker
// // //                   selectedValue={selectedDrugName}
// // //                   onValueChange={handleDrugNameChange}
// // //                   style={styles.picker}
// // //                 >
// // //                   {drugNames.map((name, index) => (
// // //                     <Picker.Item key={index} label={name} value={name} />
// // //                   ))}
// // //                 </Picker>
// // //               </View>
// // //             </View>

// // //             <View className='flex flex-row gap-6'>
// // //               <View style={styles.inputGroup}>
// // //                 <Text style={styles.label}>Presentation:</Text>
// // //                 <TextInput
// // //                   value={donationForm.Presentation}
// // //                   onChangeText={(text) =>
// // //                     setDonationForm({ ...donationForm, Presentation: text })
// // //                   }
// // //                   placeholder="Presentation"
// // //                   placeholderTextColor="#999"
// // //                   style={[
// // //                     styles.presentationFormInput,
// // //                     focusedInput === "presentation" && styles.inputFocused,
// // //                   ]}
// // //                   onFocus={() => handleFocus("presentation")}
// // //                   onBlur={handleBlur}
// // //                 />
// // //               </View>

// // //               <View style={styles.inputGroup}>
// // //                 <Text style={styles.label}>Form:</Text>
// // //                 <TextInput
// // //                   value={donationForm.Form}
// // //                   onChangeText={(text) =>
// // //                     setDonationForm({ ...donationForm, Form: text })
// // //                   }
// // //                   placeholder="Form"
// // //                   placeholderTextColor="#999"
// // //                   style={[
// // //                     styles.presentationFormInput,
// // //                     focusedInput === "Form" && styles.inputFocused,
// // //                   ]}
// // //                   onFocus={() => handleFocus("Form")}
// // //                   onBlur={handleBlur}
// // //                 />
// // //               </View>
// // //             </View>

// // //             <View className='flex flex-row gap-6'>
// // //               <View style={styles.inputGroup}>
// // //                 <Text style={styles.label}>Laboratory:</Text>
// // //                 <TextInput
// // //                   value={donationForm.Laboratory}
// // //                   onChangeText={(text) =>
// // //                     setDonationForm({ ...donationForm, Laboratory: text })
// // //                   }
// // //                   placeholder="Laboratory"
// // //                   placeholderTextColor="#999"
// // //                   style={[
// // //                     styles.presentationFormInput,
// // //                     focusedInput === "laboratory" && styles.inputFocused,
// // //                   ]}
// // //                   onFocus={() => handleFocus("laboratory")}
// // //                   onBlur={handleBlur}
// // //                 />
// // //               </View>

// // //               <View style={styles.inputGroup}>
// // //                 <Text style={styles.label}>Lab Country:</Text>
// // //                 <TextInput
// // //                   value={donationForm.LaboratoryCountry}
// // //                   onChangeText={(text) =>
// // //                     setDonationForm({ ...donationForm, LaboratoryCountry: text })
// // //                   }
// // //                   placeholder="Laboratory Country"
// // //                   placeholderTextColor="#999"
// // //                   style={[
// // //                     styles.presentationFormInput,
// // //                     focusedInput === "LaboratoryCountry" && styles.inputFocused,
// // //                   ]}
// // //                   onFocus={() => handleFocus("LaboratoryCountry")}
// // //                   onBlur={handleBlur}
// // //                 />
// // //               </View>
// // //             </View>

// // //             <View style={styles.inputGroup}>
// // //               <Text style={styles.qtyLabel}>Add Quantity</Text>
// // //               <TextInput
// // //                 value={donationForm.Quantity}
// // //                 onChangeText={(text) => {
// // //                   // Remove non-numeric characters
// // //                   const numericValue = text.replace(/[^0-9]/g, '');
// // //                   // Update the state only if the input is a valid positive integer
// // //                   if (numericValue === '' || /^\d+$/.test(numericValue)) {
// // //                     setDonationForm({ ...donationForm, Quantity: numericValue });
// // //                   }
// // //                 }}
// // //                 placeholder="Quantity"
// // //                 placeholderTextColor="#999"
// // //                 style={[
// // //                   styles.quantityInput,
// // //                   focusedInput === "Quantity" && styles.inputFocused,
// // //                 ]}
// // //                 onFocus={() => handleFocus("Quantity")}
// // //                 onBlur={handleBlur}
// // //                 keyboardType="numeric"
// // //               />
// // //             </View>
// // //           </View>

// // //           {/* 2D Barcode Section */}
// // //           <Modal visible={modalVisible} animationType="slide">
// // //             <ScrollView
// // //               style={{ flex: 1 }}
// // //               contentContainerStyle={styles.scrollViewContent}
// // //             >
// // //               <View>
// // //                 {/* Render dynamic barcode containers and inputs */}
// // //                 {barcodeData.map((data, idx) => (
// // //                   <View key={idx} style={styles.roundedContainer}>
// // //                     <Text style={styles.topText}>2D Barcode</Text>
// // //                     {/* Barcode input fields */}
// // //                     <View style={styles.inputGroup}>
// // //                       <Text style={styles.label}>GTIN:</Text>
// // //                       <TextInput
// // //                         value={data.GTIN}
// // //                         onChangeText={(text) => {
// // //                           const newData = [...barcodeData];
// // //                           newData[idx].GTIN = text;
// // //                           setBarcodeData(newData);
// // //                         }}
// // //                         placeholder="Gtin"
// // //                         placeholderTextColor="#999"
// // //                         style={styles.input}
// // //                         editable={true}
// // //                       />
// // //                     </View>

// // //                     <View style={styles.inputGroup}>
// // //                       <Text style={styles.label}>LOT/Batch Number:</Text>
// // //                       <TextInput
// // //                         value={data.LOT}
// // //                         onChangeText={(text) => {
// // //                           const newData = [...barcodeData];
// // //                           newData[idx].LOT = text;
// // //                           setBarcodeData(newData);
// // //                         }}
// // //                         placeholder="Lot#"
// // //                         placeholderTextColor="#999"
// // //                         style={styles.input}
// // //                         editable={true}
// // //                       />
// // //                     </View>

// // //                     <View style={styles.inputGroup}>
// // //                       <Text style={styles.label}>EXP:</Text>
// // //                       <TextInput
// // //                         value={data.ExpiryDate}
// // //                         onChangeText={(text) => {
// // //                           const newData = [...barcodeData];
// // //                           newData[idx].ExpiryDate = text;
// // //                           setBarcodeData(newData);
// // //                         }}
// // //                         placeholder="Exp"
// // //                         placeholderTextColor="#999"
// // //                         style={styles.input}
// // //                         editable={true}
// // //                       />
// // //                     </View>

// // //                     <View style={styles.inputGroup}>
// // //                       <Text style={styles.label}>Serial:</Text>
// // //                       <TextInput
// // //                         value={data.Serial}
// // //                         onChangeText={(text) => {
// // //                           const newData = [...barcodeData];
// // //                           newData[idx].Serial = text;
// // //                           setBarcodeData(newData);
// // //                         }}
// // //                         placeholder="Serial"
// // //                         placeholderTextColor="#999"
// // //                         style={styles.input}
// // //                         editable={true}
// // //                       />
// // //                     </View>
// // //                   </View>
// // //                 ))}
// // //                 {/* Add more button for adding new barcode section */}
// // //                 <TouchableOpacity onPress={handleAddMoreBarcode}>
// // //                   <Text>Add more</Text>
// // //                 </TouchableOpacity>
// // //                 {/* Close button for the modal */}
// // //                 <TouchableOpacity onPress={() => setModalVisible(false)}>
// // //                   <Text>Close</Text>
// // //                 </TouchableOpacity>
// // //               </View>
// // //             </ScrollView>
// // //           </Modal>
// // //         </View>
// // //       ))}
// // //     </>
// // //   );
// // // }

// // // const styles = StyleSheet.create({
// // //   scrollViewContent: {
// // //     backgroundColor: '#fff',
// // //     flexGrow: 1,
// // //     alignItems: "center",
// // //     paddingBottom: 80,
// // //     paddingTop: 25,
// // //   },

// // //   roundedContainer: {
// // //     width: "auto",
// // //     borderWidth: 1,
// // //     borderColor: '#999',
// // //     borderRadius: 20,
// // //     padding: 10,
// // //     paddingTop: 20,
// // //     position: 'relative',
// // //     marginBottom: 20,
// // //     marginVertical: 10
// // //   },

// // //   barcodeContainer: {
// // //     width: "auto",
// // //     display: "flex",
// // //     flexDirection: "column",
// // //     justifyContent: "center",
// // //     alignItems: "center",
// // //     position: 'relative',
// // //     marginVertical: 25
// // //   },

// // //   topText: {
// // //     backgroundColor: '#fff',
// // //     position: 'absolute',
// // //     top: -15,
// // //     paddingHorizontal: 10,
// // //     alignSelf: 'center',
// // //     fontSize: 20,
// // //     fontWeight: "bold",
// // //     color: "#999"
// // //   },

// // //   container: {
// // //     alignItems: "center",
// // //     justifyContent: "flex-start",
// // //     position: "relative",
// // //     padding: 0,
// // //     marginBottom: 20
// // //   },

// // //   datePicker: {
// // //     width: "100%",
// // //   },

// // //   input: {
// // //     color: "#000",
// // //     height: windowHeight * 0.07,
// // //     width: windowWidth * 0.8,
// // //     marginVertical: windowHeight * 0.01,
// // //     borderWidth: 1,
// // //     borderRadius: 20,
// // //     borderColor: "#00a651",
// // //     padding: 15,
// // //   },

// // //   quantityInput: {
// // //     color: "#000",
// // //     height: windowHeight * 0.07,
// // //     width: windowWidth * 0.8,
// // //     marginVertical: windowHeight * 0.01,
// // //     borderWidth: 1,
// // //     borderRadius: 20,
// // //     borderColor: "#00a651",
// // //     padding: 15,
// // //     alignSelf: "center"
// // //   },

// // //   presentationFormInput: {
// // //     color: "#000",
// // //     height: windowHeight * 0.07,
// // //     width: windowWidth * 0.4,
// // //     marginVertical: windowHeight * 0.01,
// // //     borderWidth: 1,
// // //     borderRadius: 20,
// // //     borderColor: "#00a651",
// // //     padding: 15,
// // //   },

// // //   donorsIinputs: {
// // //     borderWidth: 1,
// // //     borderRadius: 20,
// // //     borderColor: "#999",
// // //     padding: 15,
// // //     marginBottom: 20
// // //   },

// // //   containerTitleContainer: {
// // //     position: 'relative',
// // //     borderBottomWidth: 1,
// // //     borderBottomColor: 'black',
// // //   },

// // //   containerTitle: {
// // //     position: 'absolute',
// // //     top: -10,
// // //     backgroundColor: 'white',
// // //     paddingHorizontal: 10,
// // //   },

// // //   scanInputs: {
// // //     borderWidth: 1,
// // //     borderRadius: 20,
// // //     borderColor: "#999",
// // //     padding: 15,
// // //     marginBottom: 20
// // //   },

// // //   drugInfoInputs: {
// // //     borderWidth: 1,
// // //     borderRadius: 20,
// // //     borderColor: "#999",
// // //     padding: 15,
// // //   },

//   purposeInput: {
//     color: "#000",
//     width: windowWidth * 0.8,
//     marginVertical: windowHeight * 0.01,
//     borderWidth: 1,
//     borderRadius: 20,
//     borderColor: "#00a651",
//     padding: 10,
//   },

// // //   placeholder: {
// // //     color: "#121212",
// // //   },

// // //   inputFocused: {
// // //     borderColor: "#00a651",
// // //   },

// // //   inputGroup: {
// // //     marginBottom: 20,
// // //   },

// // //   pickerContainer: {
// // //     borderColor: '#00a651',
// // //     borderWidth: 1,
// // //     borderRadius: 20,
// // //     marginTop: 10,
// // //     height: windowHeight * 0.07,
// // //   },

// // //   picker: {
// // //     color: '#121212',
// // //     width: '100%',
// // //     borderRadius: 20,
// // //   },

// // //   pickerItem: {
// // //     color: '#000',
// // //     fontSize: 16,
// // //   },

// // //   label: {
// // //     color: "#999",
// // //     marginRight: 10,
// // //     fontSize: 16,
// // //     fontWeight: "bold",
// // //   },
// // //   qtyLabel: {
// // //     color: "#999",
// // //     marginRight: 10,
// // //     fontSize: 16,
// // //     fontWeight: "bold",
// // //     alignSelf: "center"
// // //   },

// // //   successMessage: {
// // //     backgroundColor: "#00a651",
// // //     flexDirection: "row",
// // //     alignItems: "center",
// // //     justifyContent: "center",
// // //     padding: 8,
// // //     borderRadius: 5,
// // //     marginTop: 10,
// // //   },

// // //   successText: {
// // //     color: "white",
// // //     fontWeight: "bold",
// // //     marginLeft: 5,
// // //   },

// // //   errorTextContainer: {
// // //     alignItems: "center",
// // //     color: "red",
// // //     fontWeight: "bold",
// // //     marginTop: 5,
// // //   },

// // //   errorText: {
// // //     color: "red",
// // //     fontWeight: "bold",
// // //     marginLeft: 5,
// // //     marginTop: 5,
// // //   },

// // //   closeButton: {
// // //     position: "absolute",
// // //     top: windowHeight * 0.05,
// // //     right: windowWidth * 0.05,
// // //     zIndex: 1,
// // //   },

// // //   scanText: {
// // //     position: "absolute",
// // //     color: "#0096FF",
// // //     fontSize: 20,
// // //     bottom: windowHeight * 0.06,
// // //     right: windowWidth * 0.1 + 10,
// // //     zIndex: 1,
// // //     fontFamily: "Roboto",
// // //   },

// // //   scanIcon: {
// // //     position: "absolute",
// // //     color: "#00a651",
// // //     bottom: windowHeight * 0.03,
// // //     right: windowWidth * 0.06,
// // //     zIndex: 1,
// // //   },

// // //   buttonsContainer: {
// // //     display: "flex",
// // //     flexDirection: "row",
// // //     justifyContent: "space-around",
// // //     width: 300,
// // //   },

//   addMoreBtn: {
//     zIndex: 1,
//     backgroundColor: "#00a651",
//     paddingHorizontal: 20,
//     paddingVertical: 10,
//     borderRadius: 60,
//   },

// // //   submitButton: {
// // //     zIndex: 1,
// // //     paddingHorizontal: 20,
// // //     paddingVertical: 10,
// // //     borderWidth: 1,
// // //     borderRadius: 60,
// // //     borderColor: "#00a651"
// // //   },

// // //   addMoreBtnText: {
// // //     color: "white",
// // //     fontSize: 16,
// // //     fontWeight: "bold",
// // //   },

// // //   submitButtonText: {
// // //     color: "#00a651",
// // //     fontSize: 16,
// // //     fontWeight: "bold",
// // //   },

// // //   cameraContainer: {
// // //     backgroundColor: "#fff",
// // //     flex: 1,
// // //     justifyContent: "center",
// // //   },
// // //   camera: {
// // //     flex: 1,
// // //   },

// // //   buttonContainer: {
// // //     flexDirection: "column",
// // //     justifyContent: "space-between",
// // //     alignContent: "space-between",
// // //     position: "absolute",
// // //     top: 100,
// // //     right: 7,
// // //     gap: 10,

// // //   },

// // //   text: {
// // //     fontSize: 24,
// // //     color: "white",
// // //   },

// // //   iconButton: {
// // //     padding: 10,
// // //   },

// // //   zoomButtonsContainer: {
// // //     position: 'absolute',
// // //     bottom: 20,
// // //     flexDirection: 'row',
// // //     justifyContent: 'center',
// // //     alignItems: 'center',
// // //     width: '100%',
// // //   },

// // //   zoomInButton: {
// // //     backgroundColor: 'rgba(0, 0, 0, 0.5)',
// // //     borderRadius: 20,
// // //     paddingHorizontal: 20,
// // //     paddingVertical: 10,
// // //     marginHorizontal: 5,
// // //   },

// // //   zoomOutButton: {
// // //     backgroundColor: 'rgba(0, 0, 0, 0.5)',
// // //     borderRadius: 20,
// // //     paddingHorizontal: 22,
// // //     paddingVertical: 10,
// // //     marginHorizontal: 5,
// // //   },
// // // });

// // import React, { useState, useEffect, useRef } from "react";
// // import {
// //   View,
// //   StyleSheet,
// //   TextInput,
// //   StatusBar,
// //   Platform,
// //   Modal,
// //   TouchableWithoutFeedback,
// //   Text,
// //   Dimensions,
// //   ScrollView,
// //   Alert,
// //   Linking,
// //   Image
// // } from "react-native";
// // import { Picker } from '@react-native-picker/picker'
// // import { useDonationContext } from "../contexts/DonationContext";
// // import { Camera } from "expo-camera";
// // import { TouchableOpacity } from "react-native";
// // import { AntDesign, MaterialCommunityIcons } from "@expo/vector-icons";
// // import { Keyboard } from "react-native";
// // import { BarcodeAndMedicationDetails } from "../BarcodeAndMedicationDetails";
// // import BarcodeScanner from "../BarcodeScanner";

// // const windowWidth = Dimensions.get("window").width;
// // const windowHeight = Dimensions.get("window").height;

// // const SuccessMessage = ({ visible }: { visible: boolean }) =>
// //   visible ? (
// //     <View style={styles.successMessage}>
// //       <AntDesign name="checkcircle" size={24} color="white" />
// //       <Text style={styles.successText}>Success</Text>
// //     </View>
// //   ) : null;

// // const ErrorMessage = ({
// //   visible,
// //   message,
// // }: {
// //   visible: boolean;
// //   message: string;
// // }) =>
// //   visible ? (
// //     <View style={styles.errorText}>
// //       <AntDesign name="exclamationcircle" size={24} color="white" />
// //       <Text style={styles.errorText}>{message}</Text>
// //     </View>
// //   ) : null;

// // export default function Donate() {
// //   const { donationForm, setDonationForm, addDonation, recipients, selectedDonorId,
// //     setSelectedDonorId, drugNames, donors, fetchDonors, fetchRecipients, fetchDrugs, selectedDrugName, handleDrugNameChange, } = useDonationContext();
// //   const [scanBarcodeVisible, setScanBarcodeVisible] = useState(false);
// //   const [successVisible, setSuccessVisible] = useState(false);
// //   const [touchedScreen, setTouchedScreen] = useState(false);
// //   const [errorVisible, setErrorVisible] = useState(false);
// //   const [errorMessage, setErrorMessage] = useState("");
// //   const [focusedInput, setFocusedInput] = useState(null);
// //   const [confirmationVisible, setConfirmationVisible] = useState(false);
// //   const [selectedRecipient, setSelectedRecipient] = useState('');
// //   const [date, setDate] = useState(new Date());
// //   const [type, setType] = useState(Camera.Constants.Type.back);
// //   const cameraRef = useRef(null);
// //   const previousZoomRef = useRef(null);
// //   const [flashMode, setFlashMode] = useState(Camera.Constants.FlashMode.off);
// //   const [zoom, setZoom] = useState(0.1);
// //   const [resetForm, setResetForm] = useState(false);
// //   const [barcodeData, setBarcodeData] = useState([]);
// //   const [cameraVisible, setCameraVisible] = useState(false);
// //   const [modalVisible, setModalVisible] = useState(false);
// //   const [cameraVisibilities, setCameraVisibilities] = useState([]);

// //   // Function to toggle camera visibility for a specific instance
// //   const toggleCameraVisibility = (index) => {
// //     const updatedVisibilities = [...cameraVisibilities];
// //     updatedVisibilities[index] = !updatedVisibilities[index];
// //     setCameraVisibilities(updatedVisibilities);
// //   };
// //   // Function to handle barcode scanned event
// //   const handleBarcodeScanned = (scannedData) => {
// //     // Update barcode data state
// //     setBarcodeData([...barcodeData, scannedData]);
// //   };

// //   const openModal = () => {
// //     setModalVisible(true);
// //   };

// //   const closeModal = () => {
// //     setModalVisible(false);
// //   };

// //   useEffect(() => {

// //     fetchDonors();
// //     fetchRecipients();
// //     fetchDrugs();
// //   }, []);

// //   useEffect(() => {
// //     setDonationForm({
// //       ...donationForm,
// //       DonationDate: date,
// //     });
// //   }, [date]);

// //   const handleRecipientChange = (recipientId) => {
// //     const selectedRecipient = recipients.find(recipient => recipient.RecipientId.toString() === recipientId);
// //     if (selectedRecipient) {
// //       const recipientIdInt = parseInt(recipientId, 10);
// //       setSelectedRecipient(recipientIdInt.toString());
// //       setDonationForm(prevState => ({
// //         ...prevState,
// //         RecipientId: recipientIdInt,
// //         RecipientName: selectedRecipient.RecipientName
// //       }));
// //     }
// //   };

// //   const handleFocus = (inputName) => {
// //     setFocusedInput(inputName);
// //   };

// //   const handleBlur = () => {
// //     setFocusedInput(null);
// //   };

// //   useEffect(() => {
// //     const timer = setTimeout(() => {
// //       if (!touchedScreen) {
// //         Keyboard.dismiss();
// //       }
// //     }, 2500);

// //     return () => clearTimeout(timer);
// //   }, [touchedScreen]);


// //   // Function to handle submission confirmation
// //   const handleConfirmation = () => {
// //     setConfirmationVisible(true);
// //   };

// //   const handleSubmit = async () => {
// //     try {
// //       Keyboard.dismiss();


// //       // Add barcode data to the donationForm
// //       const lastBarcode = barcodeData[barcodeData.length - 1];
// //       if (lastBarcode) {
// //         setDonationForm(prevState => ({
// //           ...prevState,
// //           LOT: lastBarcode.LOT || prevState.LOT,
// //           ExpiryDate: lastBarcode.ExpiryDate || prevState.ExpiryDate,
// //           GTIN: lastBarcode.GTIN || prevState.GTIN,

// //         }));
// //       }

// //       // Perform form validation
// //       if (
// //         !donationForm.LOT ||
// //         !donationForm.ExpiryDate ||
// //         !donationForm.GTIN
// //       ) {
// //         throw new Error("you must scan the required Barcode fields.");
// //       }

// //       // Add donation
// //       await addDonation();

// //       // Clear form fields only if submission is successful
// //       setDonationForm({
// //         // DonorId: uuid.v4(),
// //         DonorId: "",
// //         RecipientId: "",
// //         DrugName: "",
// //         Quantity: "",
// //         Presentation: "",
// //         Form: "",
// //         DonationPurpose: "",
// //         DonationDate: "",
// //         ProductionDate: "2024-03-31",
// //         Laboratory: "",
// //         LaboratoryCountry: "",
// //         LOT: "",
// //         ExpiryDate: "",
// //         GTIN: "",
// //         Serial: "",
// //       });

// //       // Toggle the reset flag to force reset the form fields
// //       setResetForm(true);

// //       // Clear barcode data
// //       setBarcodeData([]);

// //       // Display success message
// //       setSuccessVisible(true);

// //       // Display confirmation modal
// //       handleConfirmation();

// //       // Hide the success message after 2 seconds
// //       setTimeout(() => {
// //         setSuccessVisible(true);
// //       }, 2000);
// //     } catch (error: any) {
// //       if (error.message === "Failed to add donation") {
// //         setErrorMessage("Failed to add donation.");
// //       } else {
// //         setErrorMessage(error.message); // Handle other types of errors
// //       }
// //       setErrorVisible(true);
// //     }
// //   };

// //   // Effect to reset the form fields when the reset flag changes
// //   useEffect(() => {
// //     if (resetForm) {
// //       setDonationForm({
// //         DonorId: "",
// //         RecipientId: "",
// //         DrugName: "",
// //         Quantity: "",
// //         Presentation: "",
// //         Form: "",
// //         DonationPurpose: "",
// //         DonationDate: "",
// //         ProductionDate: "2024-03-31",
// //         Laboratory: "",
// //         LaboratoryCountry: "",
// //         LOT: "",
// //         ExpiryDate: "",
// //         GTIN: "",
// //         Serial: "",
// //       });
// //       // Reset the reset flag
// //       setResetForm(false);
// //     }
// //   }, [resetForm]);

// //   // Function to add a new barcode data object
// //   const addBarcode = (newBarcode) => {
// //     setBarcodeData([...barcodeData, newBarcode]);
// //   };




// //   // Function to open the camera modal and initiate scanning
// //   const openCamera = () => {
// //     setCameraVisible(true);
// //   };

// //   // Function to add more barcode input sections
// //   const addMoreSections = () => {
// //     openCamera();
// //   };



// //   const handleCloseBarcodeModal = () => {
// //     setScanBarcodeVisible(false);
// //   };

// //   const dismissKeyboard = () => {
// //     Keyboard.dismiss();
// //   };


// //   return (
// //     <>
// //       <ScrollView
// //         style={{ flex: 1 }}
// //         contentContainerStyle={styles.scrollViewContent}
// //       >

// //         <TouchableWithoutFeedback onPress={dismissKeyboard}>
// //           <View style={styles.container}>

// //             <View style={styles.donorsIinputs}>
// //               <View>
// //                 <View style={styles.inputGroup}>
// //                   <Text style={styles.label}>Donor:</Text>
// //                   <View style={styles.pickerContainer}>
// //                     <Picker
// //                       selectedValue={selectedDonorId}
// //                       onValueChange={(itemValue, itemIndex) =>
// //                         setSelectedDonorId(itemValue)
// //                       }
// //                       style={styles.picker}
// //                       itemStyle={styles.pickerItem}
// //                     >
// //                       <Picker.Item label="Select a donor" value={null} />
// //                       {donors && donors.map((donor) => (
// //                         <Picker.Item
// //                           key={`${donor.DonorId}-${donor.DonorName}`}
// //                           label={donor.DonorName}
// //                           value={donor}
// //                         />
// //                       ))}
// //                     </Picker>
// //                   </View>
// //                 </View>

// //                 <View style={styles.inputGroup}>
// //                   <Text style={styles.label}>Recipient:</Text>
// //                   <View style={styles.pickerContainer}>
// //                     <Picker
// //                       selectedValue={selectedRecipient}
// //                       onValueChange={handleRecipientChange}
// //                       style={styles.picker}
// //                       itemStyle={styles.pickerItem}
// //                     >
// //                       <Picker.Item label="Select" value="" />
// //                       {recipients && recipients.map((recipient) => (
// //                         <Picker.Item
// //                           key={recipient.RecipientId}
// //                           label={recipient.RecipientName}
// //                           value={recipient.RecipientId.toString()}
// //                         />
// //                       ))}
// //                     </Picker>
// //                   </View>
// //                 </View>

// //                 <View style={styles.inputGroup}>
// //                   <Text style={styles.label}>Purpose:</Text>
// //                   <TextInput
// //                     value={donationForm.DonationPurpose}
// //                     onChangeText={(text) =>
// //                       setDonationForm({ ...donationForm, DonationPurpose: text })
// //                     }
// //                     multiline={true}
// //                     numberOfLines={4}
// //                     placeholder="Donation Purpose"
// //                     placeholderTextColor="#999"
// //                     style={[
// //                       styles.purposeInput,
// //                       focusedInput === "DonationPurpose" && styles.inputFocused,
// //                     ]}
// //                     onFocus={() => handleFocus("DonationPurpose")}
// //                     onBlur={handleBlur}
// //                   />
// //                 </View>
// //               </View>
// //             </View>

// //             <SuccessMessage visible={successVisible} />

// //             <View style={styles.errorTextContainer}>
// //               <ErrorMessage visible={errorVisible} message={errorMessage} />
// //             </View>

// //             <View style={styles.buttonsContainer}>

// //               <TouchableOpacity style={styles.addMoreBtn} onPress={addMoreSections}>
// //                 <Text style={styles.addMoreBtnText}>Add more</Text>
// //               </TouchableOpacity>

//               <TouchableOpacity
//                 style={styles.submitButton}
//                 onPress={handleSubmit}
//               >
//                 <Text style={styles.submitButtonText}>Submit</Text>
//               </TouchableOpacity>
// //             </View>


// //             <BarcodeAndMedicationDetails
// //               barcodeData={barcodeData}
// //               setBarcodeData={setBarcodeData}
// //             />

// //             {/* Camera modal */}
// //             <View visible={cameraVisible} animationType="slide">
// //               <BarcodeScanner
// //                 type={Camera.Constants.Type.back}
// //                 onBarCodeScanned={handleBarcodeScanned}
// //               />
// //             </View>

// //           </View>
// //         </TouchableWithoutFeedback>
// //       </ScrollView>
// //     </>
// //   );
// // }


// // const styles = StyleSheet.create({
// //   scrollViewContent: {
// //     backgroundColor: '#fff',
// //     flexGrow: 1,
// //     alignItems: "center",
// //     paddingBottom: 80,
// //     paddingTop: 25,
// //   },

// //   scrollView: {
// //     flexGrow: 1,
// //     padding: 10,
// //   },

// //   roundedContainer: {
// //     width: "auto",
// //     borderWidth: 1,
// //     borderColor: '#999',
// //     borderRadius: 20,
// //     padding: 10,
// //     paddingTop: 20,
// //     position: 'relative',
// //     marginBottom: 20,
// //     marginVertical: 10
// //   },

// //   barcodeContainer: {
// //     width: "auto",
// //     display: "flex",
// //     flexDirection: "column",
// //     justifyContent: "center",
// //     alignItems: "center",
// //     position: 'relative',
// //     // marginVertical: 25
// //   },

// //   topText: {
// //     backgroundColor: '#fff',
// //     position: 'absolute',
// //     top: -15,
// //     paddingHorizontal: 10,
// //     alignSelf: 'center',
// //     fontSize: 20,
// //     fontWeight: "bold",
// //     color: "#999"
// //   },

// //   container: {
// //     alignItems: "center",
// //     justifyContent: "flex-start",
// //     position: "relative",
// //     padding: 0,
// //     marginBottom: 20
// //   },

// //   datePicker: {
// //     width: "100%",
// //   },

// //   input: {
// //     color: "#000",
// //     height: windowHeight * 0.07,
// //     width: windowWidth * 0.8,
// //     marginVertical: windowHeight * 0.01,
// //     borderWidth: 1,
// //     borderRadius: 20,
// //     borderColor: "#00a651",
// //     padding: 15,
// //   },

// //   quantityInput: {
// //     color: "#000",
// //     height: windowHeight * 0.07,
// //     width: windowWidth * 0.8,
// //     marginVertical: windowHeight * 0.01,
// //     borderWidth: 1,
// //     borderRadius: 20,
// //     borderColor: "#00a651",
// //     padding: 15,
// //     alignSelf: "center"
// //   },

// //   presentationFormInput: {
// //     color: "#000",
// //     height: windowHeight * 0.07,
// //     width: windowWidth * 0.4,
// //     marginVertical: windowHeight * 0.01,
// //     borderWidth: 1,
// //     borderRadius: 20,
// //     borderColor: "#00a651",
// //     padding: 15,
// //   },

// //   donorsIinputs: {
// //     borderWidth: 1,
// //     borderRadius: 20,
// //     borderColor: "#999",
// //     padding: 15,
// //     marginBottom: 20
// //   },

// //   containerTitleContainer: {
// //     position: 'relative',
// //     borderBottomWidth: 1,
// //     borderBottomColor: 'black',
// //   },

// //   containerTitle: {
// //     position: 'absolute',
// //     top: -10,
// //     backgroundColor: 'white',
// //     paddingHorizontal: 10,
// //   },

// //   scanInputs: {
// //     borderWidth: 1,
// //     borderRadius: 20,
// //     borderColor: "#999",
// //     padding: 15,
// //     marginBottom: 20
// //   },

// //   drugInfoInputs: {
// //     borderWidth: 1,
// //     borderRadius: 20,
// //     borderColor: "#999",
// //     padding: 15,
// //   },

// //   purposeInput: {
// //     color: "#000",
// //     width: windowWidth * 0.8,
// //     marginVertical: windowHeight * 0.01,
// //     borderWidth: 1,
// //     borderRadius: 20,
// //     borderColor: "#00a651",
// //     padding: 10,
// //   },

// //   placeholder: {
// //     color: "#121212",
// //   },

// //   inputFocused: {
// //     borderColor: "#00a651",
// //   },

// //   inputGroup: {
// //     marginBottom: 20,
// //   },

//   pickerContainer: {
//     borderColor: '#00a651',
//     borderWidth: 1,
//     borderRadius: 20,
//     marginTop: 10,
//     height: windowHeight * 0.07,
//   },

// //   picker: {
// //     color: '#121212',
// //     width: '100%',
// //     borderRadius: 20,
// //   },

// //   pickerItem: {
// //     color: '#000',
// //     fontSize: 16,
// //   },

// //   label: {
// //     color: "#999",
// //     marginRight: 10,
// //     fontSize: 16,
// //     fontWeight: "bold",
// //   },
// //   qtyLabel: {
// //     color: "#999",
// //     marginRight: 10,
// //     fontSize: 16,
// //     fontWeight: "bold",
// //     alignSelf: "center"
// //   },

// //   successMessage: {
// //     backgroundColor: "#00a651",
// //     flexDirection: "row",
// //     alignItems: "center",
// //     justifyContent: "center",
// //     padding: 8,
// //     borderRadius: 5,
// //     marginTop: 10,
// //   },

// //   successText: {
// //     color: "white",
// //     fontWeight: "bold",
// //     marginLeft: 5,
// //   },

// //   errorTextContainer: {
// //     alignItems: "center",
// //     color: "red",
// //     fontWeight: "bold",
// //     marginTop: 5,
// //   },

// //   errorText: {
// //     color: "red",
// //     fontWeight: "bold",
// //     marginLeft: 5,
// //     marginTop: 5,
// //   },

// //   closeButton: {
// //     position: "absolute",
// //     top: windowHeight * 0.05,
// //     right: windowWidth * 0.05,
// //     zIndex: 1,
// //   },

// //   scanText: {
// //     position: "absolute",
// //     color: "#0096FF",
// //     fontSize: 20,
// //     bottom: windowHeight * 0.06,
// //     right: windowWidth * 0.1 + 10,
// //     zIndex: 1,
// //     fontFamily: "Roboto",
// //   },

// //   scanIcon: {
// //     position: "absolute",
// //     color: "#00a651",
// //     bottom: windowHeight * 0.03,
// //     right: windowWidth * 0.06,
// //     zIndex: 1,
// //   },

// //   buttonsContainer: {
// //     display: "flex",
// //     flexDirection: "row",
// //     justifyContent: "space-around",
// //     width: 300,
// //   },

// //   addMoreBtn: {
// //     zIndex: 1,
// //     backgroundColor: "#00a651",
// //     paddingHorizontal: 20,
// //     paddingVertical: 10,
// //     borderRadius: 60,
// //   },

// //   submitButton: {
//     zIndex: 1,
//     paddingHorizontal: 20,
//     paddingVertical: 10,
//     borderWidth: 1,
//     borderRadius: 60,
//     borderColor: "#00a651"
// //   },

// //   addMoreBtnText: {
// //     color: "white",
// //     fontSize: 16,
// //     fontWeight: "bold",
// //   },

//   submitButtonText: {
//     color: "#00a651",
//     fontSize: 16,
//     fontWeight: "bold",
//   },

// //   cameraContainer: {
// //     backgroundColor: "#fff",
// //     flex: 1,
// //     justifyContent: "center",
// //   },
// //   camera: {
// //     flex: 1,
// //   },

// //   buttonContainer: {
// //     flexDirection: "column",
// //     justifyContent: "space-between",
// //     alignContent: "space-between",
// //     position: "absolute",
// //     top: 100,
// //     right: 7,
// //     gap: 10,

// //   },

// //   text: {
// //     fontSize: 24,
// //     color: "white",
// //   },

// //   iconButton: {
// //     padding: 10,
// //   },

// //   zoomButtonsContainer: {
// //     position: 'absolute',
// //     bottom: 20,
// //     flexDirection: 'row',
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //     width: '100%',
// //   },

// //   zoomInButton: {
// //     backgroundColor: 'rgba(0, 0, 0, 0.5)',
// //     borderRadius: 20,
// //     paddingHorizontal: 20,
// //     paddingVertical: 10,
// //     marginHorizontal: 5,
// //   },

// //   zoomOutButton: {
// //     backgroundColor: 'rgba(0, 0, 0, 0.5)',
// //     borderRadius: 20,
// //     paddingHorizontal: 22,
// //     paddingVertical: 10,
// //     marginHorizontal: 5,
// //   },
// // });





// // /////////////////////////////////////////////////////////////////////////////



// // Donate.js
// import React, { useState } from "react";
// import { View, Text, StyleSheet, ScrollView, TextInput, Button } from "react-native";
// import BarcodeSection from "../../components/BarcodeSection";
// import MedicationDetailsSection from "../../components/MedicationDetailsSection";
// import Donor from "../../components/Donor";

// const Donate = () => {
//   // State for barcode
//   const [barcode, setBarcode] = useState("");

//   // State for medication details
//   const [donationForm, setDonationForm] = useState({
//     drugNames: ["Drug A", "Drug B", "Drug C"], // Sample data for drug names
//     Presentation: "",
//     Form: "",
//     Laboratory: "",
//     LaboratoryCountry: "",
//     Quantity: "",
//   });

//   // State for focused input
//   const [focusedInput, setFocusedInput] = useState("");
//   const [modalVisible, setModalVisible] = useState(false);
//   // Handler for changing drug name
//   const handleDrugNameChange = (itemValue) => {
//     setDonationForm({ ...donationForm, selectedDrugName: itemValue });
//   };

//   // Handler for input focus
//   const handleFocus = (inputName) => {
//     setFocusedInput(inputName);
//   };

//   // Handler for input blur
//   const handleBlur = () => {
//     setFocusedInput("");
//   };
  

//   return (
//     <ScrollView style={styles.container}>
//       <View style={styles.innerContainer}>
//         <Text style={styles.title}>Donate Medication</Text>
//         {/* Barcode Section */}
//         <BarcodeSection
//           barcode={barcode}
//           setBarcode={setBarcode}
//           setModalVisible={setModalVisible}
//         />

//         {/* Medication Details Section */}
//         <MedicationDetailsSection
//           selectedDrugName={donationForm.selectedDrugName}
//           handleDrugNameChange={handleDrugNameChange}
//           donationForm={donationForm}
//           setDonationForm={setDonationForm}
//           focusedInput={focusedInput}
//           handleFocus={handleFocus}
//           handleBlur={handleBlur}
//         />

//         {/* Submit Button */}
//         <View style={styles.submitButtonContainer}>
//           <Button title="Submit" onPress={() => console.log("Form submitted")} />
//         </View>
//       </View>
//     </ScrollView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#fff",
//   },
//   innerContainer: {
//     padding: 20,
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: "bold",
//     marginBottom: 20,
//   },
//   submitButtonContainer: {
//     marginTop: 20,
//   },
// });

// export default Donate;
