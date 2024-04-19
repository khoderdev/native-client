import React from "react";
import { View, Text, StyleSheet, TextInput } from "react-native";
import { Picker } from "@react-native-picker/picker";

const MedicationDetailsSection = ({
    selectedDrugName,
    handleDrugNameChange,
    donationForm,
    setDonationForm,
    focusedInput,
    handleFocus,
    handleBlur,
    drugNames,
}) => {
    return (
        <View style={styles.roundedContainer}>
            <Text style={styles.topText}>Medication Details</Text>

            {/* Medicine Name */}
            <View style={styles.inputGroup}>
                <Text style={styles.label}>Medicine Name:</Text>
                <View style={styles.pickerContainer}>
                    <Picker
                        selectedValue={selectedDrugName}
                        onValueChange={(value) => handleDrugNameChange(value)}
                        // onValueChange={handleDrugNameChange}
                        style={styles.picker}
                    >
                        {drugNames && drugNames.length > 0 ? (
                            drugNames.map((name, index) => (
                                <Picker.Item key={index} label={name} value={name} />
                            ))
                        ) : (
                            <Picker.Item label="No options available" value="" />
                        )}
                    </Picker>
                </View>
            </View>

            {/* Presentation and Form */}
            <View style={styles.inputGroup}>
                <View style={styles.flexRowContainer}>
                    <Text style={styles.label}>Presentation:</Text>
                    <TextInput
                        value={donationForm.Presentation}
                        onChangeText={(text) =>
                            setDonationForm({ ...donationForm, Presentation: text })
                        }
                        placeholder="Presentation"
                        placeholderTextColor="#999"
                        style={[
                            styles.presentationFormInput,
                            focusedInput === "presentation" && styles.inputFocused,
                        ]}
                        onFocus={() => handleFocus("presentation")}
                        onBlur={handleBlur}
                    />
                </View>
                <View style={styles.flexRowContainer}>
                    <Text style={styles.label}>Form:</Text>
                    <TextInput
                        value={donationForm.Form}
                        onChangeText={(text) =>
                            setDonationForm({ ...donationForm, Form: text })
                        }
                        placeholder="Form"
                        placeholderTextColor="#999"
                        style={[
                            styles.presentationFormInput,
                            focusedInput === "Form" && styles.inputFocused,
                        ]}
                        onFocus={() => handleFocus("Form")}
                        onBlur={handleBlur}
                    />
                </View>
            </View>

            {/* Laboratory and Lab Country */}
            <View style={styles.inputGroup}>
                <View style={styles.flexRowContainer}>
                    <Text style={styles.label}>Laboratory:</Text>
                    <TextInput
                        value={donationForm.Laboratory}
                        onChangeText={(text) =>
                            setDonationForm({ ...donationForm, Laboratory: text })
                        }
                        placeholder="Laboratory"
                        placeholderTextColor="#999"
                        style={[
                            styles.presentationFormInput,
                            focusedInput === "laboratory" && styles.inputFocused,
                        ]}
                        onFocus={() => handleFocus("laboratory")}
                        onBlur={handleBlur}
                    />
                </View>
                <View style={styles.flexRowContainer}>
                    <Text style={styles.label}>Lab Country:</Text>
                    <TextInput
                        value={donationForm.LaboratoryCountry}
                        onChangeText={(text) =>
                            setDonationForm({ ...donationForm, LaboratoryCountry: text })
                        }
                        placeholder="Laboratory Country"
                        placeholderTextColor="#999"
                        style={[
                            styles.presentationFormInput,
                            focusedInput === "LaboratoryCountry" && styles.inputFocused,
                        ]}
                        onFocus={() => handleFocus("LaboratoryCountry")}
                        onBlur={handleBlur}
                    />
                </View>
            </View>

            {/* Quantity */}
            <View style={styles.inputGroup}>
                <Text style={styles.qtyLabel}>Add Quantity</Text>
                <TextInput
                    value={donationForm.Quantity}
                    onChangeText={(text) => {
                        // Remove non-numeric characters
                        const numericValue = text.replace(/[^0-9]/g, "");
                        // Update the state only if the input is a valid positive integer
                        if (numericValue === "" || /^\d+$/.test(numericValue)) {
                            setDonationForm({ ...donationForm, Quantity: numericValue });
                        }
                    }}
                    placeholder="Quantity"
                    placeholderTextColor="#999"
                    style={[
                        styles.quantityInput,
                        focusedInput === "Quantity" && styles.inputFocused,
                    ]}
                    onFocus={() => handleFocus("Quantity")}
                    onBlur={handleBlur}
                    keyboardType="numeric"
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
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
    inputGroup: {
        marginBottom: 20,
    },
    flexRowContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    pickerContainer: {
        borderColor: "#00a651",
        borderWidth: 1,
        borderRadius: 20,
        marginTop: 10,
        height: 50,
    },
    picker: {
        color: "#121212",
        width: "100%",
        borderRadius: 20,
    },
    label: {
        color: "#999",
        marginRight: 10,
        fontSize: 16,
        fontWeight: "bold",
    },
    qtyLabel: {
        color: "#999",
        marginRight: 10,
        fontSize: 16,
        fontWeight: "bold",
        alignSelf: "center",
    },
    presentationFormInput: {
        color: "#000",
        height: 50,
        width: "48%",
        borderWidth: 1,
        borderRadius: 20,
        borderColor: "#00a651",
        padding: 15,
    },
    quantityInput: {
        color: "#000",
        height: 50,
        width: "100%",
        borderWidth: 1,
        borderRadius: 20,
        borderColor: "#00a651",
        padding: 15,
        alignSelf: "center",
    },
    inputFocused: {
        borderColor: "#0096FF",
    },
});

export default MedicationDetailsSection;
