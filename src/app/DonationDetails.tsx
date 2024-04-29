// import React, { useState, useEffect } from "react";
// import { View, Text, StyleSheet, Modal, Pressable, ScrollView, TextInput, Button } from "react-native";
// import { Ionicons } from '@expo/vector-icons';
// import colors from "../misc/colors";
// import { useDonationContext } from "./contexts/DonationContext";
// import axios from "axios";

// interface DonationDetailsProps {
//     donation: {
//         DonationId: number;
//         DonorName: string;
//         RecipientId: number;
//         DrugName: string;
//         Quantity: number;
//         Presentation: string;
//         Form: string;
//         DonationPurpose: string;
//         Laboratory: string;
//         LaboratoryCountry: string;
//         LOT: string;
//         GTIN: string;
//         Serial: string;
//         DonationDate: string;
//         ExpiryDate: string;
//     };
//     onClose: () => void;
// }

// const DonationDetails: React.FC<DonationDetailsProps> = ({ donation, onClose }) => {
//     const { donationForm, setDonationForm, recipients } = useDonationContext();
//     const [editMode, setEditMode] = useState(false);
//     const [recipientName, setRecipientName] = useState("");

//     const updateDonation = async (DonationId, updatedData) => {
//         try {
//             // Make a PUT request to the server API endpoint with the updated donation data
//             const response = await axios.put(
//                 `http://85.112.70.8:3000/donation/${DonationId}`,
//                 updatedData
//             );

//             // Return the updated donation from the server response
//             return response.data;
//         } catch (error) {
//             // Log the error for debugging and tracing
//             console.error("Error updating donation:", error);

//             // If the error has a response object, extract error message from it
//             if (error.response) {
//                 console.error("Server error response:", error.response.data);
//                 throw new Error("Failed to update donation: " + error.response.data.message);
//             } else if (error.request) {
//                 // If the request was made but no response was received
//                 console.error("No response received from server.");
//                 throw new Error("Failed to update donation: No response received from server.");
//             } else {
//                 // Something happened in setting up the request that triggered an error
//                 console.error("Error setting up request:", error.message);
//                 throw new Error("Failed to update donation: Error setting up request.");
//             }
//         }
//     };


//     // Set initial values when donation prop changes
//     useEffect(() => {
//         setDonationForm(donation);
//         if (recipients) {
//             const recipient = recipients.find(recipient => recipient._id === donation.RecipientId);
//             if (recipient) {
//                 setRecipientName(recipient.RecipientName);
//             }
//         }
//     }, [donation, recipients]);

//     const handleSave = async () => {
//         try {
//             await updateDonation(donation.DonationId, donationForm); // Assuming donationForm contains updated data
//             setEditMode(false);
//             onClose();
//         } catch (error) {
//             // Handle error if needed
//             console.error("Error updating donation:", error.message);
//         }
//     };

//     // Filter out ID fields, dates, and improve styles
//     // const filteredDonationForm = Object.fromEntries(
//     //     Object.entries(donationForm).filter(
//     //         ([key, value]) =>
//     //             !['_id', 'DonationId', 'RecipientId', 'DrugID', 'ManufacturerID', 'DonationDate'].includes(key) &&
//     //             typeof value !== 'object' // Excludes date objects
//     //     )
//     // );


//     const editableFields = ['Quantity', 'Presentation', 'Form', 'DonationPurpose', 'Laboratory', 'LaboratoryCountry', 'LOT', 'GTIN', 'Serial'];

//     // // Filter out fields based on editableFields array
//     // const filteredDonationForm = Object.fromEntries(
//     //     Object.entries(donationForm).filter(([key, value]) => editableFields.includes(key))
//     // );

//     const filteredDonationForm = Object.fromEntries(
//         editableFields.map((key) => [key, donationForm[key] || ""]) // Add missing keys with empty values
//     );
//     // Format the expiration date as YYYY-MM-DD
//     const formattedExpDate = donation.ExpiryDate ? `20${donation.ExpiryDate.slice(0, 2)}-${donation.ExpiryDate.slice(2, 4)}-${donation.ExpiryDate.slice(4)}` : '';

//     const labelMapping = {
//         DonorName: "Donor Name",
//         DrugName: "Drug Name",
//         Quantity: "Quantity",
//         Presentation: "Presentation",
//         Form: "Form",
//         DonationPurpose: "Donation Purpose",
//         Laboratory: "Laboratory",
//         LaboratoryCountry: "Laboratory Country",
//         LOT: "LOT",
//         GTIN: "GTIN",
//         Serial: "Serial",
//         DonationDate: "Donation Date",
//         ExpiryDate: "Expiry Date",
//     };

//     return (
//         <Modal
//             animationType="slide"
//             transparent={true}
//             visible={true}
//             onRequestClose={onClose}
//         >
//             <Pressable style={styles.modalContainer}>
//                 <View style={styles.modalContent}>
//                     <View style={styles.header}>
//                         <Text style={styles.title}>Donation Details</Text>
//                         <Pressable style={styles.closeIconContainer} onPress={onClose}>
//                             <Ionicons name="close" size={24} color={colors.LIGHT} />
//                         </Pressable>
//                     </View>

//                     <ScrollView contentContainerStyle={styles.scrollView}>
//                         {Object.entries(filteredDonationForm).map(([key, value]) => (
//                             <View key={key} style={styles.detailItem}>
//                                 <Text style={styles.label}>{labelMapping[key]}:</Text>
//                                 {!editMode ? (
//                                     <Text style={styles.value}>{value}</Text>
//                                 ) : (
//                                     <TextInput
//                                         style={styles.input}
//                                         value={value !== null ? value.toString() : ""}
//                                         onChangeText={(text) =>
//                                             setDonationForm((prevData) => ({
//                                                 ...prevData,
//                                                 [key]: text,
//                                             }))
//                                         }
//                                         editable={editableFields.includes(key)} // Allow editing only for fields in editableFields array
//                                     />
//                                 )}
//                             </View>
//                         ))}
//                     </ScrollView>
//                     {!editMode ? (
//                         <Button title="Edit" onPress={() => setEditMode(true)} />
//                     ) : (
//                         <View style={styles.buttonsContainer}>

//                             <Button title="Cancel" onPress={() => {
//                                 setDonationForm(donation);
//                                 setEditMode(false);
//                             }}
//                             />
//                             <Button title="Update" onPress={handleSave} />
//                         </View>
//                     )}
//                 </View>
//             </Pressable>
//         </Modal>
//     );
// };

// const styles = StyleSheet.create({
//     modalContainer: {
//         flex: 1,
//         justifyContent: "center",
//         alignItems: "center",

//         backgroundColor: "#fff",
//     },
//     modalContent: {
//         backgroundColor: "#fff",
//         padding: 20,
//         borderRadius: 10,
//         width: "100%",
//         height: "100%",
//     },
//     header: {
//         flexDirection: "row",
//         justifyContent: "space-between",
//         marginBottom: 20,
//     },
//     title: {
//         fontSize: 20,
//         fontWeight: "bold",
//         color: "121212",
//     },
//     scrollView: {
//         flexGrow: 1,
//     },
//     detailItem: {
//         marginBottom: 10,
//     },
//     label: {
//         fontWeight: "bold",
//         fontSize: 16,
//         marginBottom: 5,
//         color: "121212",
//     },
//     value: {
//         fontSize: 16,
//         color: "121212",
//     },
//     input: {
//         height: 40,
//         color: "#000",
//         borderWidth: 1,
//         borderRadius: 20,
//         borderColor: "#00a651",
//         padding: 15,
//     },
//     closeIconContainer: {
//         position: "absolute",
//         top: 10,
//         right: 10,
//     },
//     buttonsContainer: {
//         flexDirection: "row",
//         justifyContent: "space-around",
//         marginTop: 10,
//     },

// });

// export default DonationDetails;

// import React, { useState, useEffect } from "react";
// import { View, Text, StyleSheet, Modal, Pressable, ScrollView, TextInput, Button, TouchableOpacity } from "react-native";
// import { Ionicons } from '@expo/vector-icons';
// import colors from "../misc/colors";
// import { useDonationContext } from "./contexts/DonationContext";
// import axios from "axios";

// interface DonationDetailsProps {
//     donation: {
//         DonationId: number;
//         DonorName: string;
//         RecipientId: number;
//         DrugName: string;
//         Quantity: number;
//         Presentation: string;
//         Form: string;
//         DonationPurpose: string;
//         Laboratory: string;
//         LaboratoryCountry: string;
//         LOT: string;
//         GTIN: string;
//         Serial: string;
//     };
//     onClose: () => void;
// }

// const CustomButton = ({ title, onPress }) => {
//     return (
//         <TouchableOpacity style={styles.button} onPress={onPress}>
//             <Text style={styles.buttonText}>{title}</Text>
//         </TouchableOpacity>
//     );
// };


// const DonationDetails: React.FC<DonationDetailsProps> = ({ donation, onClose }) => {
//     const { donationForm, setDonationForm, recipients } = useDonationContext();
//     const [editMode, setEditMode] = useState(false);
//     const [recipientName, setRecipientName] = useState("");

//     useEffect(() => {
//         // Initialize donationForm with the values of the donation
//         setDonationForm(donation);
//     }, [donation]);


//     const updateDonation = async (DonationId, updatedData) => {
//         try {
//             // Make a PUT request to the server API endpoint with the updated donation data
//             const response = await axios.put(
//                 `http://85.112.70.8:3000/donation/${DonationId}`,
//                 updatedData
//             );

//             // Return the updated donation from the server response
//             return response.data;
//         } catch (error) {
//             // Log the error for debugging and tracing
//             console.error("Error updating donation:", error);

//             // If the error has a response object, extract error message from it
//             if (error.response) {
//                 console.error("Server error response:", error.response.data);
//                 throw new Error("Failed to update donation: " + error.response.data.message);
//             } else if (error.request) {
//                 // If the request was made but no response was received
//                 console.error("No response received from server.");
//                 throw new Error("Failed to update donation: No response received from server.");
//             } else {
//                 // Something happened in setting up the request that triggered an error
//                 console.error("Error setting up request:", error.message);
//                 throw new Error("Failed to update donation: Error setting up request.");
//             }
//         }
//     };

//     // Set initial values when donation prop changes
//     useEffect(() => {
//         // Check if recipients exist and set recipient name
//         if (recipients) {
//             const recipient = recipients.find(recipient => recipient._id === donation.RecipientId);
//             if (recipient) {
//                 setRecipientName(recipient.RecipientName);
//             }
//         }
//     }, [donation, recipients]);

//     const handleSave = async () => {
//         try {
//             await updateDonation(donation.DonationId, donationForm); // Assuming donationForm contains updated data
//             setEditMode(false);
//             onClose();
//         } catch (error) {
//             // Handle error if needed
//             console.error("Error updating donation:", error.message);
//         }
//     };

//     const editableFields = ['Quantity', 'Presentation', 'Form', 'DonationPurpose', 'Laboratory', 'LaboratoryCountry', 'LOT', 'GTIN', 'Serial'];

//     const filteredDonationForm = Object.fromEntries(
//         editableFields.map((key) => [key, donationForm[key] || ""])
//     );

//     const labelMapping = {
//         DonorName: "Donor Name",
//         DrugName: "Drug Name",
//         Quantity: "Quantity",
//         Presentation: "Presentation",
//         Form: "Form",
//         DonationPurpose: "Donation Purpose",
//         Laboratory: "Laboratory",
//         LaboratoryCountry: "Laboratory Country",
//         LOT: "LOT",
//         GTIN: "GTIN",
//         Serial: "Serial",
//     };

//     return (
//         <Modal
//             animationType="slide"
//             transparent={true}
//             visible={true}
//             onRequestClose={onClose}
//         >
//             <Pressable style={styles.modalContainer}>
//                 <View style={styles.modalContent}>
//                     <View style={styles.header}>
//                         <Text style={styles.title}>Donation Details</Text>
//                         <Pressable style={styles.closeIconContainer} onPress={onClose}>
//                             <Ionicons name="close" size={26} color={colors.PRIMARY} />
//                         </Pressable>
//                     </View>

//                     <ScrollView contentContainerStyle={styles.scrollView}>
//                         {Object.entries(filteredDonationForm).map(([key, value]) => (
//                             <View key={key} style={styles.detailItem}>
//                                 <Text style={styles.label}>{labelMapping[key]}:</Text>
//                                 {!editMode ? (
//                                     <Text style={styles.value}>{value}</Text>
//                                 ) : (
//                                     <TextInput
//                                         style={styles.input}
//                                         value={donationForm[key] != null ? donationForm[key].toString() : ""}
//                                         onChangeText={(text) =>
//                                             setDonationForm((prevData) => ({
//                                                 ...prevData,
//                                                 [key]: text,
//                                             }))
//                                         }
//                                         editable={editableFields.includes(key)}
//                                     />

//                                 )}
//                             </View>
//                         ))}

//                     </ScrollView>
//                     {!editMode ? (
//                         <CustomButton title="Edit" onPress={() => setEditMode(true)} />
//                     ) : (
//                         <View style={styles.buttonsContainer}>
//                             <CustomButton title="Cancel" onPress={() => {
//                                 setDonationForm(donation);
//                                 setEditMode(false);
//                             }} />
//                             <CustomButton title="Update" onPress={handleSave} />
//                         </View>
//                     )}

//                 </View>
//             </Pressable>
//         </Modal>
//     );
// };

// const styles = StyleSheet.create({
//     modalContainer: {
//         flex: 1,
//         justifyContent: "center",
//         alignItems: "center",

//         backgroundColor: "#fff",
//     },
//     modalContent: {
//         backgroundColor: "#fff",
//         padding: 20,
//         borderRadius: 10,
//         width: "100%",
//         height: "100%",
//     },
//     header: {
//         flexDirection: "row",
//         justifyContent: "space-between",
//         marginBottom: 20,
//     },

//     title: {
//         fontSize: 20,
//         fontWeight: "bold",
//         color: "121212",
//     },

//     scrollView: {
//         flexGrow: 1,
//     },

//     detailItem: {
//         marginBottom: 10,
//     },

//     label: {
//         fontWeight: "bold",
//         fontSize: 16,
//         marginBottom: 5,
//         color: "121212",
//     },

//     value: {
//         fontSize: 16,
//         color: "121212",
//     },

//     input: {
//         height: 40,
//         color: "#000",
//         borderWidth: 1,
//         borderRadius: 20,
//         borderColor: "#00a651",
//         padding: 10,
//     },

//     closeIconContainer: {
//         position: "absolute",
//         top: 10,
//         right: 10,
//         color: "#00a651",
//     },

//     buttonsContainer: {
//         flexDirection: "row",
//         justifyContent: "space-around",
//         marginTop: 10,
//     },
//     cancelButton: {
//         backgroundColor: 'transparent',
//         borderWidth: 1,
//         borderRadius: 60,
//         borderColor: "#00a651",
//     },
//     cancelButtonText: {
//         color: '#00a651',
//     },

//     button: {
//         backgroundColor: "#00a651",
//         paddingHorizontal: 20,
//         paddingVertical: 10,
//         borderRadius: 60,
//         alignItems: "center",
//     },
//     buttonText: {
//         color: "#fff",
//         fontSize: 16,
//         fontWeight: "bold",
//     },

// });

// export default DonationDetails;


// ------------------------------------------------------------


import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Modal, Pressable, ScrollView, TextInput, Button, TouchableOpacity } from "react-native";
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import colors from "../misc/colors";
import { useDonationContext } from "./contexts/DonationContext";

import Donate from "./(tabs)/donate";

interface DonationDetailsProps {
    donation: {
        DonationId: number;
        DonorName: string;
        RecipientId: number;
        DrugName: string;
        Quantity: number;
        Presentation: string;
        Form: string;
        DonationPurpose: string;
        Laboratory: string;
        LaboratoryCountry: string;
        LOT: string;
        GTIN: string;
        Serial: string;
    };
    onClose: () => void;
}

const CustomButton = ({ title, onPress }) => {
    return (
        <TouchableOpacity style={styles.button} onPress={onPress}>
            <Text style={styles.buttonText}>{title}</Text>
        </TouchableOpacity>
    );
};

const DonationDetails: React.FC<DonationDetailsProps> = ({ donation, onClose }) => {
    const { donationForm, setDonationForm, recipients, toggleEditMode, setDonations } = useDonationContext();
    const [editMode, setEditMode] = useState(false);
    const [recipientName, setRecipientName] = useState("");
    const [showDonateForm, setShowDonateForm] = useState(false);
    const navigation = useNavigation();


    const handleEdit = () => {
        toggleEditMode(); // Toggle edit mode when "Edit" button is clicked
        navigation.navigate('donate'); // Navigate to the Donate screen
    };

    const handleSave = () => {
        setShowDonateForm(false);
    };

    useEffect(() => {
        // Initialize donationForm with the values of the donation
        setDonationForm(donation);
    }, [donation]);


    // Set initial values when donation prop changes
    useEffect(() => {
        // Check if recipients exist and set recipient name
        if (recipients) {
            const recipient = recipients.find(recipient => recipient._id === donation.RecipientId);
            if (recipient) {
                setRecipientName(recipient.RecipientName);
            }
        }
    }, [donation, recipients]);


    const editableFields = ['Quantity', 'Presentation', 'Form', 'DonationPurpose', 'Laboratory', 'LaboratoryCountry', 'LOT', 'GTIN', 'Serial'];

    const filteredDonationForm = Object.fromEntries(
        editableFields.map((key) => [key, donationForm[key] || ""])
    );

    const labelMapping = {
        DonorName: "Donor Name",
        DrugName: "Drug Name",
        Quantity: "Quantity",
        Presentation: "Presentation",
        Form: "Form",
        DonationPurpose: "Donation Purpose",
        Laboratory: "Laboratory",
        LaboratoryCountry: "Laboratory Country",
        LOT: "LOT",
        GTIN: "GTIN",
        Serial: "Serial",
    };

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={true}
            onRequestClose={onClose}
        >
            <Pressable style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <View style={styles.header}>
                        <Text style={styles.title}>Donation Details</Text>
                        <Pressable style={styles.closeIconContainer} onPress={onClose}>
                            <Ionicons name="close" size={26} color={colors.PRIMARY} />
                        </Pressable>
                    </View>

                    <ScrollView contentContainerStyle={styles.scrollView}>
                        {Object.entries(filteredDonationForm).map(([key, value]) => (
                            <View key={key} style={styles.detailItem}>
                                <Text style={styles.label}>{labelMapping[key]}:</Text>
                                {!editMode ? (
                                    <Text style={styles.value}>{value}</Text>
                                ) : (
                                    <TextInput
                                        style={styles.input}
                                        value={donationForm[key] != null ? donationForm[key].toString() : ""}
                                        onChangeText={(text) =>
                                            setDonationForm((prevData) => ({
                                                ...prevData,
                                                [key]: text,
                                            }))
                                        }
                                        editable={editableFields.includes(key)}
                                    />

                                )}
                            </View>
                        ))}

                    </ScrollView>
                    {!editMode ? (
                        <CustomButton title="Edit" onPress={handleEdit} />
                    ) : (
                        <CustomButton title="Save" onPress={handleSave} />
                    )}

                </View>
            </Pressable>

            {/* Render the Donate form component when showDonateForm is true */}
            {showDonateForm && <Donate onClose={() => setShowDonateForm(false)} />}
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",

        backgroundColor: "#fff",
    },
    modalContent: {
        backgroundColor: "#fff",
        padding: 20,
        borderRadius: 10,
        width: "100%",
        height: "100%",
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 20,
    },

    title: {
        fontSize: 20,
        fontWeight: "bold",
        color: "121212",
    },

    scrollView: {
        flexGrow: 1,
    },

    detailItem: {
        marginBottom: 10,
    },

    label: {
        fontWeight: "bold",
        fontSize: 16,
        marginBottom: 5,
        color: "121212",
    },

    value: {
        fontSize: 16,
        color: "121212",
    },

    input: {
        height: 40,
        color: "#000",
        borderWidth: 1,
        borderRadius: 20,
        borderColor: "#00a651",
        padding: 10,
    },

    closeIconContainer: {
        position: "absolute",
        top: 10,
        right: 10,
        color: "#00a651",
    },

    buttonsContainer: {
        flexDirection: "row",
        justifyContent: "space-around",
        marginTop: 10,
    },
    cancelButton: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderRadius: 60,
        borderColor: "#00a651",
    },
    cancelButtonText: {
        color: '#00a651',
    },

    button: {
        backgroundColor: "#00a651",
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 60,
        alignItems: "center",
    },
    buttonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },

});

export default DonationDetails;
