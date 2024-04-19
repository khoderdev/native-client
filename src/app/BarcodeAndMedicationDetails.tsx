import { Picker } from "@react-native-picker/picker";
import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, TextInput, Dimensions, Modal } from "react-native";
import { useDonationContext } from "./contexts/DonationContext";
import { Camera } from "expo-camera";
import { AntDesign } from "@expo/vector-icons";
import BarcodeScanner from "./BarcodeScanner";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

export const BarcodeAndMedicationDetails = ({ barcodeData }) => {
    const [numSections, setNumSections] = useState(1);
    const { donationForm, setDonationForm, handleBarcodeScanned, drugNames, selectedDrugName, handleDrugNameChange,
        setBarcodeData,
        handleSubmit } = useDonationContext();

    const [focusedInput, setFocusedInput] = useState(null);
    const [cameraVisible, setCameraVisible] = useState(false);

    // Function to open the camera modal and initiate scanning
    const openCamera = () => {
        setCameraVisible(true);
    };

    // Function to add more barcode input sections
    const addMoreSections = () => {
        openCamera();
    };

    const handleFocus = (inputName) => {
        setFocusedInput(inputName);
    };
    const handleBlur = () => {
        setFocusedInput(null);
    };

    return (
        <View style={styles.container}>
            {barcodeData.map((data, index) => (
                <React.Fragment key={index}>
                    <View style={styles.roundedContainer}>
                        <Text style={styles.topText}>2D Barcode</Text>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>GTIN:</Text>
                            <TextInput
                                value={data.GTIN}
                                onChangeText={(text) => {
                                    const newData = [...barcodeData];
                                    newData[index].GTIN = text;
                                    setBarcodeData(newData);
                                }}
                                placeholder="Gtin"
                                placeholderTextColor="#999"
                                style={styles.input}
                                editable={true}
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>LOT/Batch Number:</Text>
                            <TextInput
                                value={data.LOT}
                                onChangeText={(text) => {
                                    const newData = [...barcodeData];
                                    newData[index].LOT = text;
                                    setBarcodeData(newData);
                                }}
                                placeholder="Lot#"
                                placeholderTextColor="#999"
                                style={styles.input}
                                editable={true}
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>EXP:</Text>
                            <TextInput
                                value={data.ExpiryDate}
                                onChangeText={(text) => {
                                    const newData = [...barcodeData];
                                    newData[index].ExpiryDate = text;
                                    setBarcodeData(newData);
                                }}
                                placeholder="Exp"
                                placeholderTextColor="#999"
                                style={styles.input}
                                editable={true}
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Serial:</Text>
                            <TextInput
                                value={data.Serial}
                                onChangeText={(text) => {
                                    const newData = [...barcodeData];
                                    newData[index].Serial = text;
                                    setBarcodeData(newData);
                                }}
                                placeholder="Serial"
                                placeholderTextColor="#999"
                                style={styles.input}
                                editable={true}
                            />
                        </View>
                    </View>

                    <View style={styles.roundedContainer}>
                        <Text style={styles.topText}>Medication Details</Text>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Medicine Name:</Text>
                            <View style={styles.pickerContainer}>
                                <Picker
                                    selectedValue={selectedDrugName}
                                    onValueChange={handleDrugNameChange}
                                    style={styles.picker}
                                >
                                    {drugNames.map((name, index) => (
                                        <Picker.Item key={index} label={name} value={name} />
                                    ))}
                                </Picker>
                            </View>
                        </View>

                        <View style={{ flexDirection: 'row', gap: 6 }}>
                            <View style={styles.inputGroup}>
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

                            <View style={styles.inputGroup}>
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

                        <View style={{ flexDirection: 'row', gap: 6 }}>
                            <View style={styles.inputGroup}>
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

                            <View style={styles.inputGroup}>
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

                        <View style={styles.inputGroup}>
                            <Text style={styles.qtyLabel}>Add Quantity</Text>
                            <TextInput
                                value={donationForm.Quantity}
                                onChangeText={(text) => {
                                    // Remove non-numeric characters
                                    const numericValue = text.replace(/[^0-9]/g, '');
                                    // Update the state only if the input is a valid positive integer
                                    if (numericValue === '' || /^\d+$/.test(numericValue)) {
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

                    <View style={styles.buttonsContainer}>
                        <TouchableOpacity style={styles.addMoreBtn} onPress={openCamera}>
                            <Text style={styles.addMoreBtnText}>Add more</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.submitButton}
                            onPress={handleSubmit}
                        >
                            <Text style={styles.submitButtonText}>Submit</Text>
                        </TouchableOpacity>
                    </View>

                    < Modal visible={cameraVisible} animationType="slide">
                        <BarcodeScanner
                            type={Camera.Constants.Type.back}
                            onBarCodeScanned={(scannedData) => {
                                handleBarcodeScanned(scannedData); // Call the handleBarcodeScanned function with scanned data
                                setCameraVisible(false); // Close the camera modal after scanning
                            }}
                        />
                    </Modal>
                </React.Fragment >
            ))}
        </View >
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    scrollViewContent: {
        backgroundColor: '#fff',
        flexGrow: 1,
        alignItems: "center",
        paddingBottom: 80,
        paddingTop: 25,
    },

    roundedContainer: {
        width: "auto",
        borderWidth: 1,
        borderColor: '#999',
        borderRadius: 20,
        padding: 10,
        paddingTop: 20,
        position: 'relative',
        marginBottom: 20,
        marginVertical: 10
    },

    barcodeContainer: {
        width: "auto",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        position: 'relative',
        marginVertical: 25
    },

    topText: {
        backgroundColor: '#fff',
        position: 'absolute',
        top: -15,
        paddingHorizontal: 10,
        alignSelf: 'center',
        fontSize: 20,
        fontWeight: "bold",
        color: "#999"
    },

    datePicker: {
        width: "100%",
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

    quantityInput: {
        color: "#000",
        height: windowHeight * 0.07,
        width: windowWidth * 0.8,
        marginVertical: windowHeight * 0.01,
        borderWidth: 1,
        borderRadius: 20,
        borderColor: "#00a651",
        padding: 15,
        alignSelf: "center"
    },

    presentationFormInput: {
        color: "#000",
        height: windowHeight * 0.07,
        width: windowWidth * 0.4,
        marginVertical: windowHeight * 0.01,
        borderWidth: 1,
        borderRadius: 20,
        borderColor: "#00a651",
        padding: 15,
    },

    donorsIinputs: {
        borderWidth: 1,
        borderRadius: 20,
        borderColor: "#999",
        padding: 15,
        marginBottom: 20
    },

    containerTitleContainer: {
        position: 'relative',
        borderBottomWidth: 1,
        borderBottomColor: 'black',
    },

    containerTitle: {
        position: 'absolute',
        top: -10,
        backgroundColor: 'white',
        paddingHorizontal: 10,
    },

    scanInputs: {
        borderWidth: 1,
        borderRadius: 20,
        borderColor: "#999",
        padding: 15,
        marginBottom: 20
    },

    drugInfoInputs: {
        borderWidth: 1,
        borderRadius: 20,
        borderColor: "#999",
        padding: 15,
    },

    purposeInput: {
        color: "#000",
        width: windowWidth * 0.8,
        marginVertical: windowHeight * 0.01,
        borderWidth: 1,
        borderRadius: 20,
        borderColor: "#00a651",
        padding: 10,
    },

    placeholder: {
        color: "#121212",
    },

    inputFocused: {
        borderColor: "#00a651",
    },

    inputGroup: {
        marginBottom: 20,
    },

    pickerContainer: {
        borderColor: '#00a651',
        borderWidth: 1,
        borderRadius: 20,
        marginTop: 10,
        height: windowHeight * 0.07,
    },

    picker: {
        color: '#121212',
        width: '100%',
        borderRadius: 20,
    },

    pickerItem: {
        color: '#000',
        fontSize: 16,
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
        alignSelf: "center"
    },

    successMessage: {
        backgroundColor: "#00a651",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        padding: 8,
        borderRadius: 5,
        marginTop: 10,
    },

    successText: {
        color: "white",
        fontWeight: "bold",
        marginLeft: 5,
    },

    errorTextContainer: {
        alignItems: "center",
        color: "red",
        fontWeight: "bold",
        marginTop: 5,
    },

    errorText: {
        color: "red",
        fontWeight: "bold",
        marginLeft: 5,
        marginTop: 5,
    },

    closeButton: {
        position: "absolute",
        top: windowHeight * 0.05,
        right: windowWidth * 0.05,
        zIndex: 1,
    },

    scanText: {
        position: "absolute",
        color: "#0096FF",
        fontSize: 20,
        bottom: windowHeight * 0.06,
        right: windowWidth * 0.1 + 10,
        zIndex: 1,
        fontFamily: "Roboto",
    },

    scanIcon: {
        position: "absolute",
        color: "#00a651",
        bottom: windowHeight * 0.03,
        right: windowWidth * 0.06,
        zIndex: 1,
    },

    buttonsContainer: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-around",
        width: 300,
    },

    addMoreBtn: {
        zIndex: 1,
        backgroundColor: "#00a651",
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 60,
    },

    submitButton: {
        zIndex: 1,
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderWidth: 1,
        borderRadius: 60,
        borderColor: "#00a651"
    },

    addMoreBtnText: {
        color: "white",
        fontSize: 16,
        fontWeight: "bold",
    },

    submitButtonText: {
        color: "#00a651",
        fontSize: 16,
        fontWeight: "bold",
    },

    cameraContainer: {
        backgroundColor: "#fff",
        flex: 1,
        justifyContent: "center",
    },
    camera: {
        flex: 1,
    },

    buttonContainer: {
        flexDirection: "column",
        justifyContent: "space-between",
        alignContent: "space-between",
        position: "absolute",
        top: 100,
        right: 7,
        gap: 10,

    },

    text: {
        fontSize: 24,
        color: "white",
    },

    iconButton: {
        padding: 10,
    },

    zoomButtonsContainer: {
        position: 'absolute',
        bottom: 20,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
    },

    zoomInButton: {
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        borderRadius: 20,
        paddingHorizontal: 20,
        paddingVertical: 10,
        marginHorizontal: 5,
    },

    zoomOutButton: {
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        borderRadius: 20,
        paddingHorizontal: 22,
        paddingVertical: 10,
        marginHorizontal: 5,
    },

});