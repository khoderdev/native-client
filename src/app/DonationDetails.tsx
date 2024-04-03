import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Modal, Pressable, ScrollView, TextInput, Button } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import colors from "../misc/colors";
import { useDonationContext } from "./contexts/DonationContext";
import axios from "axios";

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
        DonationDate: string;
        ExpiryDate: string;
    };
    onClose: () => void;
}

const DonationDetails: React.FC<DonationDetailsProps> = ({ donation, onClose }) => {
    const { donationForm, setDonationForm, recipients } = useDonationContext();
    const [editMode, setEditMode] = useState(false);
    const [recipientName, setRecipientName] = useState("");

    const updateDonation = async (DonationId, updatedData) => {
        try {
            // Make a PUT request to the server API endpoint with the updated donation data
            const response = await axios.put(
                `http://1.1.1.250:3000/donation/${DonationId}`,
                updatedData
            );

            // Return the updated donation from the server response
            return response.data;
        } catch (error) {
            console.error("Error updating donation:", error.message);
            throw error;
        }
    };

    // Set initial values when donation prop changes
    useEffect(() => {
        setDonationForm(donation);
        if (recipients) {
            const recipient = recipients.find(recipient => recipient._id === donation.RecipientId);
            if (recipient) {
                setRecipientName(recipient.RecipientName);
            }
        }
    }, [donation, recipients]);

    const handleSave = async () => {
        try {
            await updateDonation(donation.DonationId, donationForm); // Assuming donationForm contains updated data
            setEditMode(false);
            onClose();
        } catch (error) {
            // Handle error if needed
            console.error("Error updating donation:", error.message);
        }
    };

    // Filter out ID fields, dates, and improve styles
    const filteredDonationForm = Object.fromEntries(
        Object.entries(donationForm).filter(
            ([key, value]) =>
                !['_id', 'DonationId', 'RecipientId', 'DrugID', 'ManufacturerID', 'DonationDate'].includes(key) &&
                typeof value !== 'object' // Excludes date objects
        )
    );

    // Format the expiration date as YYYY-MM-DD
    const formattedExpDate = donation.ExpiryDate ? `20${donation.ExpiryDate.slice(0, 2)}-${donation.ExpiryDate.slice(2, 4)}-${donation.ExpiryDate.slice(4)}` : '';

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
        DonationDate: "Donation Date",
        ExpiryDate: "Expiry Date",
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
                            <Ionicons name="close" size={24} color={colors.LIGHT} />
                        </Pressable>
                    </View>

                    <ScrollView contentContainerStyle={styles.scrollView}>
                        {Object.entries(filteredDonationForm).map(([key, value]) => (
                            <View key={key} style={styles.detailItem}>
                                <Text style={styles.label}>{labelMapping[key]}:</Text>
                                {!editMode ? (
                                    // For non-date fields, display editable text input in edit mode
                                    <Text style={styles.value}>{value}</Text>
                                ) : (
                                    <TextInput
                                        style={styles.input}
                                        value={value !== null ? value.toString() : ""}
                                        onChangeText={(text) =>
                                            setDonationForm((prevData) => ({
                                                ...prevData,
                                                [key]: text,
                                            }))
                                        }
                                        editable={!['_id', 'DonationId', 'RecipientId', 'DrugID', 'ManufacturerID'].includes(key)}
                                    />
                                )}
                            </View>
                        ))}
                    </ScrollView>
                    {!editMode ? (
                        <Button title="Edit" onPress={() => setEditMode(true)} />
                    ) : (
                        <View style={styles.buttonsContainer}>

                            <Button title="Cancel" onPress={() => {
                                setDonationForm(donation); // Revert changes by resetting the form to original data
                                setEditMode(false); // Exit edit mode
                            }}
                            />
                            <Button title="Update" onPress={handleSave} />
                        </View>
                    )}
                </View>
            </Pressable>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#27272A",
        // backgroundColor: "rgba(0, 0, 0, 0.6)",
    },
    modalContent: {
        backgroundColor: colors.DARK,
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
        color: colors.PRIMARY,
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
        color: colors.GRAY,
    },
    value: {
        fontSize: 16,
        color: colors.LIGHT,
    },
    input: {
        height: 40,
        borderWidth: 1,
        borderColor: colors.GRAY,
        borderRadius: 5,
        padding: 10,
        color: colors.LIGHT,
    },
    closeIconContainer: {
        position: "absolute",
        top: 10,
        right: 10,
    },
    buttonsContainer: {
        flexDirection: "row",
        justifyContent: "space-around",
        marginTop: 10,
    },

});

export default DonationDetails;
