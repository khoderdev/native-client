import React, { useState } from "react";
import {
    View,
    StyleSheet,
    Modal,
    TouchableWithoutFeedback,
    Text,
    Dimensions,
    ScrollView,
    Alert,
    Linking,
    Image,
    TouchableOpacity,
    GestureResponderEvent
} from "react-native";
import { Camera } from "expo-camera";
import { AntDesign } from "@expo/vector-icons";
import { Keyboard } from "react-native";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

const SuccessMessage = ({ visible }: { visible: boolean }) => (
    visible ? (
        <View style={styles.successMessage}>
            <AntDesign name="checkcircle" size={24} color="white" />
            <Text style={styles.successText}>Success</Text>
        </View>
    ) : null
);

const ErrorMessage = ({
    visible,
    message,
}: {
    visible: boolean;
    message: string;
}) => (
    visible ? (
        <View style={styles.errorText}>
            <AntDesign name="exclamationcircle" size={24} color="white" />
            <Text style={styles.errorText}>{message}</Text>
        </View>
    ) : null
);

export default function BarcodeScanner() {

    const [cameraVisible, setCameraVisible] = useState(false);
    const [barcodeData, setBarcodeData] = useState([]);

    const [modalVisible, setModalVisible] = useState(false);
    // Function to handle barcode scanned
    const handleBarcodeScanned = ({ type, data }) => {
        console.log(`Barcode with type ${type} and data ${data} has been scanned!`);
        try {
            // Parse scanned data
            const response = { GTIN: '', LOT: '', ExpiryDate: '', Serial: '' };
            let responseCode = data;

            const prefixes = [
                { prefix: '01', key: 'GTIN', length: 14 },
                { prefix: '10', key: 'LOT' },
                { prefix: '17', key: 'ExpiryDate', length: 6 },
                { prefix: '21', key: 'Serial' },
            ];

            prefixes.forEach(({ prefix, key, length }) => {
                const position = responseCode.indexOf(prefix);

                if (position !== -1) {
                    const start = position + prefix.length;
                    let end;

                    if (length) {
                        end = start + length;
                    } else {
                        const gsPosition = responseCode.indexOf(String.fromCharCode(29), start);
                        end = gsPosition !== -1 ? gsPosition : responseCode.length;
                    }

                    response[key] = responseCode.substring(start, end);
                    responseCode = responseCode.slice(0, position) + responseCode.slice(end);
                }
            });

            // Append the parsed response to the barcode data
            const newData = [...barcodeData, response];
            setBarcodeData(newData);
            setCameraVisible(false); // Close camera modal after scanning
            setModalVisible(true); // Open modal to display new barcode section
        } catch (error) {
            console.error("Error parsing scanned data:", error);
            // Handle error
        }
    };

    const handleCloseModals = () => {
        setCameraVisible(false);
        setModalVisible(false);
    };

    // Function to open the camera modal and initiate scanning
    const openCamera = () => {
        setCameraVisible(true);
    };

    // Function to add more barcode input sections
    const addMoreSections = () => {
        openCamera();
    };

    const dismissKeyboard = () => {
        Keyboard.dismiss();
    };

    return (
        <>
            <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.scrollViewContent}>

                <View style={styles.barcodeContainer}>
                    <TouchableOpacity onPress={openCamera}>
                        <Image
                            source={require("../../assets/2d.png")}
                            style={{
                                width: 350,
                                height: 120,
                                resizeMode: "contain"
                            }}
                        />
                    </TouchableOpacity>

                    <TouchableOpacity onPress={openCamera}>
                        <Image
                            source={require("../../assets/pressHere.png")}
                            style={{
                                width: 200,
                                height: 80,
                                resizeMode: "contain"
                            }}
                        />
                    </TouchableOpacity>
                </View>

                {/* Camera modal */}
                <Modal visible={cameraVisible} animationType="slide">
                    <View style={styles.cameraContainer}>
                        <Camera
                            style={styles.camera}
                            type={Camera.Constants.Type.back}
                            onBarCodeScanned={handleBarcodeScanned}
                        />
                        <TouchableOpacity style={styles.closeButton} onPress={() => setCameraVisible(false)}>
                            <AntDesign name="close" size={24} color="#00a651" />
                        </TouchableOpacity>
                    </View>
                </Modal>
            </ScrollView>
        </>
    );
}

const styles = StyleSheet.create({
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
    container: {
        alignItems: "center",
        justifyContent: "flex-start",
        position: "relative",
        padding: 0,
        marginBottom: 20
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
    placeholder: {
        color: "#121212",
    },
    inputFocused: {
        borderColor: "#00a651",
    },
    inputGroup: {
        marginBottom: 20,
    },
    label: {
        color: "#999",
        marginRight: 10,
        fontSize: 16,
        fontWeight: "bold",
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
