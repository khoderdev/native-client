import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Modal, Pressable, ScrollView, TextInput, Button } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import colors from "../misc/colors";
import { useDonationContext } from "./contexts/DonationContext";

interface DonationDetailsProps {
    donation: {
        DonorName: string;
        RecipientId: string;
        DrugName: string;
        Quantity: string;
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

    const handleSave = () => {
        // Update the context state with edited data
        // Note: You can perform validation before updating the state
        setDonationForm(donationForm);
        setEditMode(false);
        onClose(); // Close the modal after saving
    };

    // Filter out _id and __v keys
    const filteredDonationForm = Object.fromEntries(
        Object.entries(donationForm).filter(([key]) => key !== "_id" && key !== "__v")
    );

    const labelMapping = {
        DonorName: "Donor Name",
        RecipientId: "Recipient",
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
                                {key === "RecipientId" ? (
                                    <Text style={styles.value}>{recipientName}</Text>
                                ) : (
                                    !editMode ? (
                                        // Convert Date object to string before rendering
                                        <Text style={styles.value}>{value instanceof Date ? value.toLocaleDateString() : value}</Text>
                                    ) : (
                                        <TextInput
                                            style={styles.input}
                                            value={value !== null ? value.toString() : ''}
                                            onChangeText={(text) =>
                                                setDonationForm((prevData) => ({
                                                    ...prevData,
                                                    [key]: text,
                                                }))
                                            }
                                        />
                                    )
                                )}
                            </View>
                        ))}
                    </ScrollView>

                    {/* Conditionally render "Edit" or "Update" button based on editMode */}
                    {!editMode ? (
                        <Button title="Edit" onPress={() => setEditMode(true)} />
                    ) : (
                        <Button title="Update" onPress={handleSave} />
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
        backgroundColor: "rgba(0, 0, 0, 0.6)",
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
    editButtonContainer: {
        position: 'absolute',
        bottom: 20,
        alignSelf: 'center',
        width: '90%'
    },
    closeIconContainer: {
        position: "absolute",
        top: 10,
        right: 10,
    },
});

export default DonationDetails;
