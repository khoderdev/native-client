// import React, { useEffect, useState } from "react";
// import {
//   View,
//   Text,
//   Button,
//   ScrollView,
//   TouchableOpacity,
//   TouchableWithoutFeedback,
//   Image,
//   Modal,
//   TextInput,
//   StyleSheet,
//   Dimensions,
// } from "react-native";
// import { Camera } from "expo-camera";
// import MedicationDetailsSection from "./MedicationDetailsSection";
// import { useDonationContext } from "../app/contexts/DonationContext";
// import { AntDesign } from "@expo/vector-icons";

// const windowWidth = Dimensions.get("window").width;
// const windowHeight = Dimensions.get("window").height;

// const BarcodeSection = ({ setModalVisible }) => {
//   const {
//     donationForm,
//     setDonationForm,
//     selectedDrugName,
//     setSelectedDrugName,
//     barcodeData,
//     handleBarcodeScanned,
//     handleAddToDonation,
//     scannedData,
//     setScannedData,
//     drugNames,
//     fetchDrugNames,
//   } = useDonationContext();
//   const [cameraVisible, setCameraVisible] = useState(false);
//   const [focusedInput, setFocusedInput] = useState("");
//   const [addMoreButtonHover, setAddMoreButtonHover] = useState(false);
//   const [addToDonationButtonHover, setAddToDonationButtonHover] =
//     useState(false);
//   const [addMoreButtonPressed, setAddMoreButtonPressed] = useState(false);
//   const [addToDonationButtonPressed, setAddToDonationButtonPressed] =
//     useState(false);

//   useEffect(() => {
//     if (barcodeData && barcodeData.length > 0) {
//       setScannedData(barcodeData);
//     }
//   }, [barcodeData]);

//   useEffect(() => {
//     // Fetch drug names when component mounts
//     fetchDrugNames();
//   }, []); // Empty dependency array ensures it fetches only once when the component mounts

//   const openCamera = () => {
//     setCameraVisible(true);
//   };

//   const handleBarcodeScannedLocal = (data) => {
//     // Update barcodeData in context
//     handleBarcodeScanned(data);
//     // Close camera modal
//     setCameraVisible(false);
//     // Show the barcode modal
//     setModalVisible(true);
//   };

//   // Handler for input focus
//   const handleFocus = (inputName) => {
//     setFocusedInput(inputName);
//   };

//   // Handler for input blur
//   const handleBlur = () => {
//     setFocusedInput("");
//   };

//   const handleDrugNameChange = (value) => {
//     // Update the selected drug name
//     setSelectedDrugName(value);
//   };

//   // console.log("Scanned data:", scannedData);
//   // console.log("Camera visible:", cameraVisible);
//   // console.log("Selected drug name:", selectedDrugName);

//   return (
//     <ScrollView contentContainerStyle={styles.container}>
//       <View style={styles.barcodeContainer}>
//         <TouchableOpacity onPress={openCamera} activeOpacity={0.6}>
//           <Image
//             source={require("../../assets/2d.png")}
//             style={{
//               width: 240,
//               height: 110,
//               resizeMode: "contain",
//             }}
//           />
//         </TouchableOpacity>

//         <TouchableOpacity onPress={openCamera} activeOpacity={0.6}>
//           <Image
//             source={require("../../assets/pressHere.png")}
//             style={{
//               width: 200,
//               height: 50,
//               resizeMode: "contain",
//             }}
//           />
//         </TouchableOpacity>
//       </View>

//       <Modal visible={cameraVisible}>
//         <Camera
//           onBarCodeScanned={handleBarcodeScannedLocal}
//           style={{ flex: 1 }}
//         />
//         <TouchableOpacity
//           style={styles.closeButton}
//           title="Close"
//           onPress={() => setCameraVisible(false)}
//         >
//           <AntDesign name="close" size={24} color="#00a651" />
//         </TouchableOpacity>
//       </Modal>

//       {scannedData && scannedData.length > 0 && (
//         <Modal visible={true}>
//           <ScrollView>
//             <View style={styles.innerContainer}>
//               <TouchableOpacity
//                 onPress={() => setScannedData([])}
//                 style={styles.closeButton}
//                 title="Close"
//               >
//                 <AntDesign name="close" size={24} color="#00a651" />
//               </TouchableOpacity>
//               {scannedData.map((data, index) => (
//                 <View key={index} style={styles.roundedContainer}>
//                   <Text style={styles.topText}>2d Barcode</Text>
//                   <Text style={styles.label}>GTIN:</Text>
//                   <TextInput
//                     style={[styles.input, { textAlign: "center" }]}
//                     value={data.GTIN}
//                     onChangeText={(value) =>
//                       setScannedData((prevData) => {
//                         const newData = [...prevData];
//                         newData[index].GTIN = value;
//                         return newData;
//                       })
//                     }
//                   />
//                   <Text style={styles.label}>LOT/Batch Number:</Text>
//                   <TextInput
//                     style={[styles.input, { textAlign: "center" }]}
//                     value={data.LOT}
//                     onChangeText={(value) =>
//                       setScannedData((prevData) => {
//                         const newData = [...prevData];
//                         newData[index].LOT = value;
//                         return newData;
//                       })
//                     }
//                   />
//                   <Text style={styles.label}>Expiry Date:</Text>
//                   <TextInput
//                     style={[styles.input, { textAlign: "center" }]}
//                     value={data.ExpiryDate}
//                     onChangeText={(value) =>
//                       setScannedData((prevData) => {
//                         const newData = [...prevData];
//                         newData[index].ExpiryDate = value;
//                         return newData;
//                       })
//                     }
//                   />
//                   <Text style={styles.label}>Serial Number:</Text>
//                   <TextInput
//                     style={[styles.input, { textAlign: "center" }]}
//                     value={data.Serial}
//                     onChangeText={(value) =>
//                       setScannedData((prevData) => {
//                         const newData = [...prevData];
//                         newData[index].Serial = value;
//                         return newData;
//                       })
//                     }
//                   />
//                 </View>
//               ))}
//               <MedicationDetailsSection
//                 drugNames={drugNames}
//                 selectedDrugName={selectedDrugName}
//                 handleDrugNameChange={handleDrugNameChange}
//                 donationForm={donationForm}
//                 setDonationForm={setDonationForm}
//                 focusedInput={focusedInput}
//                 handleFocus={handleFocus}
//                 handleBlur={handleBlur}
//               />
//             </View>
//             {/* Add More button and Add to donation button */}
//             <View style={styles.bottomButtonsContainer}>
//               <TouchableWithoutFeedback
//                 onPress={openCamera}
//                 onMouseEnter={() => setAddMoreButtonHover(true)}
//                 onMouseLeave={() => setAddMoreButtonHover(false)}
//                 onPressIn={() => setAddMoreButtonPressed(true)}
//                 onPressOut={() => setAddMoreButtonPressed(false)}
//               >
//                 <View
//                   style={[
//                     styles.addMoreButton,
//                     addMoreButtonHover && styles.addMoreButtonHover,
//                     addMoreButtonPressed && styles.addMoreButtonPressed,
//                   ]}
//                 >
//                   <Text
//                     style={[
//                       styles.addMoreBtnText,
//                       addMoreButtonPressed && styles.buttonTextPressed,
//                     ]}
//                   >
//                     Add More
//                   </Text>
//                 </View>
//               </TouchableWithoutFeedback>

//               <TouchableWithoutFeedback
//                 onPress={handleAddToDonation}
//                 onMouseEnter={() => setAddToDonationButtonHover(true)}
//                 onMouseLeave={() => setAddToDonationButtonHover(false)}
//                 onPressIn={() => setAddToDonationButtonPressed(true)}
//                 onPressOut={() => setAddToDonationButtonPressed(false)}
//               >
//                 <View
//                   style={[
//                     styles.addToDonationButton,
//                     addToDonationButtonHover && styles.addToDonationButtonHover,
//                     addToDonationButtonPressed &&
//                       styles.addToDonationButtonPressed,
//                   ]}
//                 >
//                   <Text
//                     style={[
//                       styles.addToDonationBtnText,
//                       addToDonationButtonPressed &&
//                         styles.addToDonationBtnTextPressed,
//                     ]}
//                   >
//                     Add to donation
//                   </Text>
//                 </View>
//               </TouchableWithoutFeedback>
//             </View>
//           </ScrollView>
//         </Modal>
//       )}
//     </ScrollView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   innerContainer: {
//     paddingHorizontal: 20,
//     paddingTop: 60,
//   },

//   roundedContainer: {
//     width: "auto",
//     borderWidth: 1,
//     borderColor: "#999",
//     borderRadius: 20,
//     padding: 10,
//     paddingTop: 20,
//     position: "relative",
//     marginBottom: 20,
//     marginVertical: 10,
//   },
//   topText: {
//     backgroundColor: "#fff",
//     position: "absolute",
//     top: -15,
//     paddingHorizontal: 10,
//     alignSelf: "center",
//     fontSize: 20,
//     fontWeight: "bold",
//     color: "#999",
//   },

//   barcodeDataContainer: {
//     marginBottom: 20,
//   },

//   barcodeContainer: {
//     width: "auto",
//     display: "flex",
//     flexDirection: "column",
//     justifyContent: "center",
//     alignItems: "center",
//     position: "relative",
//     marginVertical: 0,
//   },

//   label: {
//     color: "#999",
//     marginRight: 10,
//     fontSize: 16,
//     fontWeight: "bold",
//   },

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

//   bottomButtonsContainer: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     paddingHorizontal: 20,
//     marginBottom: 20,
//   },

//   addMoreButton: {
//     width: 150,
//     zIndex: 1,
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     alignSelf: "center",
//     paddingHorizontal: 44,
//     paddingVertical: 10,
//     borderColor: "#00a651",
//     borderRadius: 60,
//     borderWidth: 0.5,
//   },
//   addMoreButtonHover: {
//     backgroundColor: "#00a651",
//   },
//   addMoreBtnText: {
//     color: "#00a651",
//   },
//   addToDonationButton: {
//     width: 150,
//     zIndex: 1,
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     alignSelf: "center",
//     paddingHorizontal: 20,
//     paddingVertical: 10,
//     backgroundColor: "#00a651",
//     borderRadius: 60,
//   },
//   addToDonationButtonHover: {
//     backgroundColor: "#00a651",
//   },
//   addToDonationBtnText: {
//     color: "#fff",
//   },

//   addMoreButtonPressed: {
//     backgroundColor: "#008f47",
//   },
//   addToDonationButtonPressed: {
//     backgroundColor: "#fff",
//     borderColor: "#008f47",
//     borderWidth: 1,
//     borderRadius: 60,
//   },
//   buttonTextPressed: {
//     color: "#fff",
//   },
//   addToDonationBtnTextPressed: {
//     color: "#008f47",
//   },

//   closeButton: {
//     position: "absolute",
//     top: windowHeight * 0.03,
//     right: windowWidth * 0.05,
//     zIndex: 1,
//   },
// });

// export default BarcodeSection;

// /////////////////////////////////////////////////////////////////

// import React, { useEffect, useState } from "react";
// import {
//   View,
//   Text,
//   Button,
//   ScrollView,
//   TouchableOpacity,
//   TouchableWithoutFeedback,
//   Image,
//   Modal,
//   TextInput,
//   StyleSheet,
//   Dimensions,
// } from "react-native";
// import { Camera } from "expo-camera";
// import MedicationDetailsSection from "./MedicationDetailsSection";
// import { useDonationContext } from "../app/contexts/DonationContext";
// import { AntDesign } from "@expo/vector-icons";

// const windowWidth = Dimensions.get("window").width;
// const windowHeight = Dimensions.get("window").height;

// const BarcodeSection = ({ setModalVisible }) => {
//   const {
//     donationForm,
//     setDonationForm,
//     selectedDrugName,
//     setSelectedDrugName,
//     barcodeData,
//     handleBarcodeScanned,
//     handleAddToDonation,
//     scannedData,
//     setScannedData,
//     drugNames,
//     fetchDrugNames,
//   } = useDonationContext();
//   const [cameraVisible, setCameraVisible] = useState(false);
//   const [focusedInput, setFocusedInput] = useState("");
//   const [addMoreButtonHover, setAddMoreButtonHover] = useState(false);
//   const [addToDonationButtonHover, setAddToDonationButtonHover] =
//     useState(false);
//   const [addMoreButtonPressed, setAddMoreButtonPressed] = useState(false);
//   const [addToDonationButtonPressed, setAddToDonationButtonPressed] =
//     useState(false);
//   const [drugCount, setDrugCount] = useState(1);

//   useEffect(() => {
//     if (barcodeData && barcodeData.length > 0) {
//       setScannedData(barcodeData);
//     }
//   }, [barcodeData]);

//   useEffect(() => {
//     // Fetch drug names when component mounts
//     fetchDrugNames();
//   }, []); // Empty dependency array ensures it fetches only once when the component mounts

//   const openCamera = () => {
//     setCameraVisible(true);
//   };

//   // const handleBarcodeScannedLocal = (data) => {
//   //   // Update barcodeData in context
//   //   handleBarcodeScanned(data);
//   //   // Close camera modal
//   //   setCameraVisible(false);
//   //   // Show the barcode modal
//   //   setModalVisible(true);
//   // };

//   const handleBarcodeScannedLocal = (data) => {
//     // Update barcodeData in context
//     handleBarcodeScanned(data);
//     // Increment drug count
//     // setDrugCount((prevCount) => prevCount + 1);
//     // Close camera modal
//     setCameraVisible(false);
//     // Show the barcode modal
//     setModalVisible(true);
//   };

//   const handleAddMore = () => {
//     // Increment drug count
//     // setCameraVisible(true);
//     setDrugCount((prevCount) => prevCount + 1);
//   };

//   // Handler for input focus
//   const handleFocus = (inputName) => {
//     setFocusedInput(inputName);
//   };

//   // Handler for input blur
//   const handleBlur = () => {
//     setFocusedInput("");
//   };

//   const handleDrugNameChange = (value) => {
//     // Update the selected drug name
//     setSelectedDrugName(value);
//   };

//   // console.log("Scanned data:", scannedData);
//   // console.log("Camera visible:", cameraVisible);
//   // console.log("Selected drug name:", selectedDrugName);

//   // function to reset the state
//   const resetState = () => {
//     // Reset scannedData state
//     setScannedData([]);
//     // Reset drug count
//     setDrugCount(1);
//     // Reset input values in donationForm (if needed)
//     setDonationForm({}); // or any initial state you want
//     // Reset selected drug name
//     setSelectedDrugName("");
//     // Optionally, close the modal
//     setModalVisible(false);
//   };

//   return (
//     <ScrollView contentContainerStyle={styles.container}>
//       <View style={styles.barcodeContainer}>
//         <TouchableOpacity onPress={openCamera} activeOpacity={0.6}>
//           <Image
//             source={require("../../assets/2d.png")}
//             style={{
//               width: 240,
//               height: 110,
//               resizeMode: "contain",
//             }}
//           />
//         </TouchableOpacity>

//         <TouchableOpacity onPress={openCamera} activeOpacity={0.6}>
//           <Image
//             source={require("../../assets/pressHere.png")}
//             style={{
//               width: 200,
//               height: 50,
//               resizeMode: "contain",
//             }}
//           />
//         </TouchableOpacity>
//       </View>

//       <Modal visible={cameraVisible}>
//         <Camera
//           onBarCodeScanned={handleBarcodeScannedLocal}
//           style={{ flex: 1 }}
//         />
//         <TouchableOpacity
//           style={styles.closeButton}
//           title="Close"
//           onPress={() => setCameraVisible(false)}
//         >
//           <AntDesign name="close" size={24} color="#00a651" />
//         </TouchableOpacity>
//       </Modal>

//       {scannedData && scannedData.length > 0 && (
//         <Modal visible={true}>
//           <ScrollView>
//             <View style={styles.innerContainer}>
//               <TouchableOpacity
//                 onPress={resetState}
//                 // onPress={() => setScannedData([])}
//                 style={styles.closeButton}
//                 title="Close"
//               >
//                 <AntDesign name="close" size={24} color="#00a651" />
//               </TouchableOpacity>
//               {/* Render medication details for each drug */}
//               {[...Array(drugCount)].map((_, index) => (
//                 <View key={index} style={styles.mainRoundedContainer}>
//                   <Text style={styles.topText}>Drug {index + 1}</Text>
//                   {/* 2D Barcode Section */}
//                   <View>
//                     {scannedData &&
//                       scannedData.map((data, dataIndex) => (
//                         <View key={dataIndex} style={styles.roundedContainer}>
//                           <Text style={styles.topText}>2d Barcode</Text>
//                           <Text style={styles.label}>GTIN:</Text>
//                           <TextInput
//                             style={[styles.input, { textAlign: "center" }]}
//                             value={data.GTIN}
//                             onChangeText={(value) =>
//                               setScannedData((prevData) => {
//                                 const newData = [...prevData];
//                                 newData[index].GTIN = value;
//                                 return newData;
//                               })
//                             }
//                           />
//                           <Text style={styles.label}>LOT/Batch Number:</Text>
//                           <TextInput
//                             style={[styles.input, { textAlign: "center" }]}
//                             value={data.LOT}
//                             onChangeText={(value) =>
//                               setScannedData((prevData) => {
//                                 const newData = [...prevData];
//                                 newData[index].LOT = value;
//                                 return newData;
//                               })
//                             }
//                           />
//                           <Text style={styles.label}>Expiry Date:</Text>
//                           <TextInput
//                             style={[styles.input, { textAlign: "center" }]}
//                             value={data.ExpiryDate}
//                             onChangeText={(value) =>
//                               setScannedData((prevData) => {
//                                 const newData = [...prevData];
//                                 newData[index].ExpiryDate = value;
//                                 return newData;
//                               })
//                             }
//                           />
//                           <Text style={styles.label}>Serial Number:</Text>
//                           <TextInput
//                             style={[styles.input, { textAlign: "center" }]}
//                             value={data.Serial}
//                             onChangeText={(value) =>
//                               setScannedData((prevData) => {
//                                 const newData = [...prevData];
//                                 newData[index].Serial = value;
//                                 return newData;
//                               })
//                             }
//                           />
//                         </View>
//                       ))}
//                   </View>
//                   <MedicationDetailsSection
//                     drugNames={drugNames}
//                     selectedDrugName={selectedDrugName}
//                     handleDrugNameChange={handleDrugNameChange}
//                     donationForm={donationForm}
//                     setDonationForm={setDonationForm}
//                     focusedInput={focusedInput}
//                     handleFocus={handleFocus}
//                     handleBlur={handleBlur}
//                   />
//                 </View>
//               ))}
//               {/* Add More button and Add to donation button */}
//               <View style={styles.bottomButtonsContainer}>
//                 <TouchableWithoutFeedback
//                   onPress={handleAddMore}
//                   onMouseEnter={() => setAddMoreButtonHover(true)}
//                   onMouseLeave={() => setAddMoreButtonHover(false)}
//                   onPressIn={() => setAddMoreButtonPressed(true)}
//                   onPressOut={() => setAddMoreButtonPressed(false)}
//                 >
//                   <View
//                     style={[
//                       styles.addMoreButton,
//                       addMoreButtonHover && styles.addMoreButtonHover,
//                       addMoreButtonPressed && styles.addMoreButtonPressed,
//                     ]}
//                   >
//                     <Text
//                       style={[
//                         styles.addMoreBtnText,
//                         addMoreButtonPressed && styles.buttonTextPressed,
//                       ]}
//                     >
//                       Add More
//                     </Text>
//                   </View>
//                 </TouchableWithoutFeedback>

//                 <TouchableWithoutFeedback
//                   onPress={handleAddToDonation}
//                   onMouseEnter={() => setAddToDonationButtonHover(true)}
//                   onMouseLeave={() => setAddToDonationButtonHover(false)}
//                   onPressIn={() => setAddToDonationButtonPressed(true)}
//                   onPressOut={() => setAddToDonationButtonPressed(false)}
//                 >
//                   <View
//                     style={[
//                       styles.addToDonationButton,
//                       addToDonationButtonHover &&
//                         styles.addToDonationButtonHover,
//                       addToDonationButtonPressed &&
//                         styles.addToDonationButtonPressed,
//                     ]}
//                   >
//                     <Text
//                       style={[
//                         styles.addToDonationBtnText,
//                         addToDonationButtonPressed &&
//                           styles.addToDonationBtnTextPressed,
//                       ]}
//                     >
//                       Add to donation
//                     </Text>
//                   </View>
//                 </TouchableWithoutFeedback>
//               </View>
//             </View>
//           </ScrollView>
//         </Modal>
//       )}
//     </ScrollView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     alignItems: "center",
//     justifyContent: "center",
//   },

//   innerContainer: {
//     paddingHorizontal: 10,
//     paddingTop: 60,
//   },

//   roundedContainer: {
//     width: "auto",
//     borderWidth: 1,
//     borderColor: "#999",
//     borderRadius: 20,
//     padding: 10,
//     paddingTop: 20,
//     position: "relative",
//     marginBottom: 20,
//     marginVertical: 10,
//   },
//   mainRoundedContainer: {
//     width: "auto",
//     borderWidth: 1,
//     borderColor: "#00a651",
//     borderRadius: 20,
//     padding: 10,
//     paddingTop: 20,
//     position: "relative",
//     marginBottom: 20,
//     marginVertical: 10,
//   },
//   topText: {
//     backgroundColor: "#fff",
//     position: "absolute",
//     top: -15,
//     paddingHorizontal: 10,
//     alignSelf: "center",
//     fontSize: 20,
//     fontWeight: "bold",
//     color: "#999",
//   },

//   barcodeDataContainer: {
//     marginBottom: 20,
//   },

//   barcodeContainer: {
//     width: "auto",
//     display: "flex",
//     flexDirection: "column",
//     justifyContent: "center",
//     alignItems: "center",
//     position: "relative",
//     marginVertical: 0,
//   },

//   label: {
//     color: "#999",
//     marginRight: 10,
//     fontSize: 16,
//     fontWeight: "bold",
//   },

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

//   bottomButtonsContainer: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     paddingHorizontal: 10,
//     marginBottom: 20,
//     gap: 8,
//   },

//   addMoreButton: {
//     width: 150,
//     zIndex: 1,
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     alignSelf: "center",
//     paddingHorizontal: 44,
//     paddingVertical: 10,
//     borderColor: "#00a651",
//     borderRadius: 60,
//     borderWidth: 0.5,
//   },
//   addMoreButtonHover: {
//     backgroundColor: "#00a651",
//   },
//   addMoreBtnText: {
//     color: "#00a651",
//   },
//   addToDonationButton: {
//     width: 150,
//     zIndex: 1,
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     alignSelf: "center",
//     paddingHorizontal: 20,
//     paddingVertical: 10,
//     backgroundColor: "#00a651",
//     borderRadius: 60,
//   },
//   addToDonationButtonHover: {
//     backgroundColor: "#00a651",
//   },
//   addToDonationBtnText: {
//     color: "#fff",
//   },

//   addMoreButtonPressed: {
//     backgroundColor: "#008f47",
//   },
//   addToDonationButtonPressed: {
//     backgroundColor: "#fff",
//     borderColor: "#008f47",
//     borderWidth: 1,
//     borderRadius: 60,
//   },
//   buttonTextPressed: {
//     color: "#fff",
//   },
//   addToDonationBtnTextPressed: {
//     color: "#008f47",
//   },

//   closeButton: {
//     position: "absolute",
//     top: windowHeight * 0.03,
//     right: windowWidth * 0.05,
//     zIndex: 1,
//   },
// });

// export default BarcodeSection;

// ////////////////////////////////////////////////////////////////////////////////////
// ////////////////////////////////////////////////////////////////////////////////////
// ////////////////////////////////////////////////////////////////////////////////////
// ////////////////////////////////////////////////////////////////////////////////////

import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Button,
  ScrollView,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Image,
  Modal,
  TextInput,
  StyleSheet,
  Dimensions,
} from "react-native";
import { Camera } from "expo-camera";
import MedicationDetailsSection from "./MedicationDetailsSection";
import { useDonationContext } from "../app/contexts/DonationContext";
import { AntDesign } from "@expo/vector-icons";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

const BarcodeSection = ({ setModalVisible }) => {
  const {
    donationForm,
    setDonationForm,
    selectedDrugName,
    setSelectedDrugName,
    barcodeData,
    handleBarcodeScanned,
    handleAddToDonation,
    scannedData,
    setScannedData,
    drugNames,
    fetchDrugNames,
  } = useDonationContext();
  const [cameraVisible, setCameraVisible] = useState(false);
  const [focusedInput, setFocusedInput] = useState("");
  const [addMoreButtonHover, setAddMoreButtonHover] = useState(false);
  const [addToDonationButtonHover, setAddToDonationButtonHover] =
    useState(false);
  const [addMoreButtonPressed, setAddMoreButtonPressed] = useState(false);
  const [addToDonationButtonPressed, setAddToDonationButtonPressed] =
    useState(false);
  const [drugCount, setDrugCount] = useState(1);

  useEffect(() => {
    if (barcodeData && barcodeData.length > 0) {
      setScannedData(barcodeData);
    }
  }, [barcodeData]);

  useEffect(() => {
    fetchDrugNames();
  }, []);

  const openCamera = () => {
    setCameraVisible(true);
  };

  const handleBarcodeScannedLocal = (data) => {
    // Update barcodeData in context
    handleBarcodeScanned(data);

    setCameraVisible(false);
    // Show the barcode modal
    setModalVisible(true);
  };

  const handleAddMore = () => {
    setDrugCount((prevCount) => prevCount + 1);
  };

  // Handler for input focus
  const handleFocus = (inputName) => {
    setFocusedInput(inputName);
  };

  // Handler for input blur
  const handleBlur = () => {
    setFocusedInput("");
  };

  const handleDrugNameChange = (value) => {
    // Update the selected drug name
    setSelectedDrugName(value);
  };

  // function to reset the state
  const resetState = () => {
    // Reset scannedData state
    setScannedData([]);
    // Reset drug count
    setDrugCount(1);
    // Reset input values in donationForm (if needed)
    setDonationForm({}); // or any initial state you want
    // Reset selected drug name
    setSelectedDrugName("");
    // Optionally, close the modal
    setModalVisible(false);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.barcodeContainer}>
        <TouchableOpacity onPress={openCamera} activeOpacity={0.6}>
          <Image
            source={require("../../assets/2d.png")}
            style={{
              width: 240,
              height: 110,
              resizeMode: "contain",
            }}
          />
        </TouchableOpacity>

        <TouchableOpacity onPress={openCamera} activeOpacity={0.6}>
          <Image
            source={require("../../assets/pressHere.png")}
            style={{
              width: 200,
              height: 50,
              resizeMode: "contain",
            }}
          />
        </TouchableOpacity>
      </View>

      <Modal visible={cameraVisible}>
        <Camera
          onBarCodeScanned={handleBarcodeScannedLocal}
          style={{ flex: 1 }}
        />
        <TouchableOpacity
          style={styles.closeButton}
          title="Close"
          onPress={() => setCameraVisible(false)}
        >
          <AntDesign name="close" size={24} color="#00a651" />
        </TouchableOpacity>
      </Modal>

      {scannedData && scannedData.length > 0 && (
        <Modal visible={true}>
          <ScrollView>
            <View style={styles.innerContainer}>
              <TouchableOpacity
                onPress={resetState}
                style={styles.closeButton}
                title="Close"
              >
                <AntDesign name="close" size={24} color="#00a651" />
              </TouchableOpacity>
              {/* Render medication details for each drug */}
              {[...Array(drugCount)].map((_, index) => (
                <View key={index} style={styles.mainRoundedContainer}>
                  <Text style={styles.topText}>Drug {index + 1}</Text>
                  {/* 2D Barcode Section */}
                  <View>
                    {scannedData &&
                      scannedData.map((data, dataIndex) => (
                        <View key={dataIndex} style={styles.roundedContainer}>
                          <Text style={styles.topText}>2d Barcode</Text>
                          <Text style={styles.label}>GTIN:</Text>
                          <TextInput
                            style={[styles.input, { textAlign: "center" }]}
                            value={data.GTIN}
                            onChangeText={(value) =>
                              setScannedData((prevData) => {
                                const newData = [...prevData];
                                newData[index].GTIN = value;
                                return newData;
                              })
                            }
                          />
                          <Text style={styles.label}>LOT/Batch Number:</Text>
                          <TextInput
                            style={[styles.input, { textAlign: "center" }]}
                            value={data.LOT}
                            onChangeText={(value) =>
                              setScannedData((prevData) => {
                                const newData = [...prevData];
                                newData[index].LOT = value;
                                return newData;
                              })
                            }
                          />
                          <Text style={styles.label}>Expiry Date:</Text>
                          <TextInput
                            style={[styles.input, { textAlign: "center" }]}
                            value={data.ExpiryDate}
                            onChangeText={(value) =>
                              setScannedData((prevData) => {
                                const newData = [...prevData];
                                newData[index].ExpiryDate = value;
                                return newData;
                              })
                            }
                          />
                          <Text style={styles.label}>Serial Number:</Text>
                          <TextInput
                            style={[styles.input, { textAlign: "center" }]}
                            value={data.Serial}
                            onChangeText={(value) =>
                              setScannedData((prevData) => {
                                const newData = [...prevData];
                                newData[index].Serial = value;
                                return newData;
                              })
                            }
                          />
                        </View>
                      ))}
                    <MedicationDetailsSection
                      drugNames={drugNames}
                      selectedDrugName={selectedDrugName}
                      handleDrugNameChange={handleDrugNameChange}
                      donationForm={donationForm}
                      setDonationForm={setDonationForm}
                      focusedInput={focusedInput}
                      handleFocus={handleFocus}
                      handleBlur={handleBlur}
                    />
                  </View>
                </View>
              ))}

              {/* Add More button and Add to donation button */}
              <View style={styles.bottomButtonsContainer}>
                <TouchableWithoutFeedback
                  onPress={handleAddMore}
                  onMouseEnter={() => setAddMoreButtonHover(true)}
                  onMouseLeave={() => setAddMoreButtonHover(false)}
                  onPressIn={() => setAddMoreButtonPressed(true)}
                  onPressOut={() => setAddMoreButtonPressed(false)}
                >
                  <View
                    style={[
                      styles.addMoreButton,
                      addMoreButtonHover && styles.addMoreButtonHover,
                      addMoreButtonPressed && styles.addMoreButtonPressed,
                    ]}
                  >
                    <Text
                      style={[
                        styles.addMoreBtnText,
                        addMoreButtonPressed && styles.buttonTextPressed,
                      ]}
                    >
                      Add More
                    </Text>
                  </View>
                </TouchableWithoutFeedback>

                <TouchableWithoutFeedback
                  onPress={handleAddToDonation}
                  onMouseEnter={() => setAddToDonationButtonHover(true)}
                  onMouseLeave={() => setAddToDonationButtonHover(false)}
                  onPressIn={() => setAddToDonationButtonPressed(true)}
                  onPressOut={() => setAddToDonationButtonPressed(false)}
                >
                  <View
                    style={[
                      styles.addToDonationButton,
                      addToDonationButtonHover &&
                        styles.addToDonationButtonHover,
                      addToDonationButtonPressed &&
                        styles.addToDonationButtonPressed,
                    ]}
                  >
                    <Text
                      style={[
                        styles.addToDonationBtnText,
                        addToDonationButtonPressed &&
                          styles.addToDonationBtnTextPressed,
                      ]}
                    >
                      Add to donation
                    </Text>
                  </View>
                </TouchableWithoutFeedback>
              </View>
            </View>
          </ScrollView>
        </Modal>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  innerContainer: {
    paddingHorizontal: 10,
    paddingTop: 60,
  },

  roundedContainer: {
    width: "auto",
    borderWidth: 1,
    borderColor: "#999",
    borderRadius: 20,
    padding: 10,
    paddingTop: 20,
    position: "relative",
    marginBottom: 20,
    marginVertical: 10,
  },
  mainRoundedContainer: {
    width: "auto",
    borderWidth: 1,
    borderColor: "#00a651",
    borderRadius: 20,
    padding: 10,
    paddingTop: 20,
    position: "relative",
    marginBottom: 20,
    marginVertical: 10,
  },
  topText: {
    backgroundColor: "#fff",
    position: "absolute",
    top: -15,
    paddingHorizontal: 10,
    alignSelf: "center",
    fontSize: 20,
    fontWeight: "bold",
    color: "#999",
  },

  barcodeDataContainer: {
    marginBottom: 20,
  },

  barcodeContainer: {
    width: "auto",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    marginVertical: 0,
  },

  label: {
    color: "#999",
    marginRight: 10,
    fontSize: 16,
    fontWeight: "bold",
  },

  input: {
    color: "#000",
    height: windowHeight * 0.07,
    width: windowWidth * 0.8,
    marginVertical: windowHeight * 0.01,
    borderWidth: 1,
    borderRadius: 20,
    borderColor: "#00a651",
    padding: 15,
  },

  bottomButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    marginBottom: 20,
    gap: 8,
  },

  addMoreButton: {
    width: 150,
    zIndex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    paddingHorizontal: 44,
    paddingVertical: 10,
    borderColor: "#00a651",
    borderRadius: 60,
    borderWidth: 0.5,
  },
  addMoreButtonHover: {
    backgroundColor: "#00a651",
  },
  addMoreBtnText: {
    color: "#00a651",
  },
  addToDonationButton: {
    width: 150,
    zIndex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: "#00a651",
    borderRadius: 60,
  },
  addToDonationButtonHover: {
    backgroundColor: "#00a651",
  },
  addToDonationBtnText: {
    color: "#fff",
  },

  addMoreButtonPressed: {
    backgroundColor: "#008f47",
  },
  addToDonationButtonPressed: {
    backgroundColor: "#fff",
    borderColor: "#008f47",
    borderWidth: 1,
    borderRadius: 60,
  },
  buttonTextPressed: {
    color: "#fff",
  },
  addToDonationBtnTextPressed: {
    color: "#008f47",
  },

  closeButton: {
    position: "absolute",
    top: windowHeight * 0.03,
    right: windowWidth * 0.05,
    zIndex: 1,
  },
});

export default BarcodeSection;
