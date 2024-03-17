import React, { useState, useEffect, useRef } from "react";
import { Camera } from 'expo-camera';
import { Button, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View, Keyboard, Dimensions, ScrollView, TouchableWithoutFeedback } from "react-native";
import { AntDesign, MaterialCommunityIcons } from '@expo/vector-icons';
import { useDonationContext } from './contexts/DonationContext';


const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const SuccessMessage = ({ visible }: { visible: boolean }) => (
    visible ? (
        <View style={styles.successMessage}>
            <AntDesign name="checkcircle" size={24} color="white" />
            <Text style={styles.successText}>Success</Text>
        </View>
    ) : null
);

const ErrorMessage = ({ visible, message }: { visible: boolean, message: string }) => (
    visible ? (
        <View style={styles.errorText}>
            <AntDesign name="exclamationcircle" size={24} color="white" />
            <Text style={styles.errorText}>{message}</Text>
        </View>
    ) : null
);


export default function CameraComponent() {
    const { donationForm, setDonationForm, addDonation } = useDonationContext();
    const [hasPermission, setHasPermission] = useState(null);
    const [type, setType] = useState(Camera.Constants.Type.back);
    const [flashMode, setFlashMode] = useState(Camera.Constants.FlashMode.off);
    const [zoom, setZoom] = useState(0.1);
    const [isBarcodeScannerVisible, setBarcodeScannerVisible] = useState(true);
    const [scannedModalVisible, setScannedModalVisible] = useState(false);
    const [focusedInput, setFocusedInput] = useState(null);
    const [gtin, setGtin] = useState("");
    const [lot, setLot] = useState("");
    const [exp, setExp] = useState("");
    const cameraRef = useRef(null);
    const previousZoomRef = useRef(null);
    const [touchedScreen, setTouchedScreen] = useState(false);
    const [successVisible, setSuccessVisible] = useState(false);
    const [errorVisible, setErrorVisible] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const handleFocus = (inputName) => {
        setFocusedInput(inputName);
    };

    const handleBlur = () => {
        setFocusedInput(null);
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            if (!touchedScreen) {
                Keyboard.dismiss();
            }
        }, 2500);

        return () => clearTimeout(timer);
    }, [touchedScreen]);

    useEffect(() => {
        (async () => {
            const { status } = await Camera.requestCameraPermissionsAsync();
            setHasPermission(status === "granted");
        })();
    }, []);

    if (hasPermission === null) {
        return <View />;
    }
    if (!hasPermission) {
        return (
            <View style={styles.container}>
                <Text style={{ textAlign: "center" }}>
                    We need your permission to show the camera
                </Text>
                <Button
                    title="Grant Permission"
                    onPress={() => {
                        Camera.requestCameraPermissionsAsync().then(({ status }) => {
                            setHasPermission(status === "granted");
                        });
                    }}
                />
            </View>
        );
    }

    function flipCamera() {
        setType(
            type === Camera.Constants.Type.back
                ? Camera.Constants.Type.front
                : Camera.Constants.Type.back
        );
    }

    function toggleFlash() {
        setFlashMode(
            flashMode === Camera.Constants.FlashMode.off
                ? Camera.Constants.FlashMode.torch
                : Camera.Constants.FlashMode.off
        );
    }

    function handlePinchGesture(event) {
        const touch1 = event.nativeEvent.touches[0];
        const touch2 = event.nativeEvent.touches[1];

        if (!touch1 || !touch2) return;

        const distance = Math.sqrt(
            Math.pow(touch2.pageX - touch1.pageX, 2) + Math.pow(touch2.pageY - touch1.pageY, 2)
        );

        if (!previousZoomRef.current) {
            previousZoomRef.current = distance;
            return;
        }

        const delta = previousZoomRef.current - distance;
        const zoomFactor = delta / 500; // Adjust this value as needed for zoom speed

        setZoom(prevZoom => Math.max(0, Math.min(prevZoom + zoomFactor, 1)));
        previousZoomRef.current = distance;
    }

    function zoomIn() {
        setZoom(prevZoom => Math.min(prevZoom + 0.1, 1));
    }

    function zoomOut() {
        setZoom(prevZoom => Math.max(prevZoom - 0.1, 0));
    }

    const handleBarcodeScanned = ({ type, data }) => {
        console.log(`Barcode with type ${type} and data ${data} has been scanned!`);
        try {
            // Remove unwanted characters from the scanned data
            const cleanData = data.replace(/[^0-9A-Za-z↔]/g, "");

            // Extracting GTIN, LOT, and EXP from the cleaned scanned data
            const scannedGtin = cleanData.substring(1, 16);
            let scannedLot = cleanData.substring(16, 21); // Extracting 5-digit LOT value
            let scannedExp = cleanData.substring(21);

            // Manipulating the scanned LOT and EXP values
            scannedLot = scannedLot.substring(2) + scannedExp.substring(0, 2); // Remove first 2 digits from LOT and add first 2 digits from EXP
            scannedExp = scannedExp.substring(2); // Remove first 2 digits from EXP

            // Update state with the assigned data parts
            // setDonationForm({ scannedGtin, scannedLot, scannedExp });
            setDonationForm({ ...donationForm, scannedGtin, scannedLot, scannedExp });
            // Auto-fill input fields with scanned data
            setGtin(scannedGtin);
            setLot(scannedLot);
            setExp(scannedExp);

            // Open the scanned data modal after scanning
            setScannedModalVisible(true);
            setBarcodeScannerVisible(false); // Close the barcode scanner modal
        } catch (error) {
            // Logging error if any occurs during parsing scanned data
            console.error("Error parsing scanned data:", error);
            // Handle error, such as displaying an error message to the user
        }
    };

    const handleCloseScannedModal = () => {
        setScannedModalVisible(false);
    };

    const handleSubmit = async () => {
        try {
            Keyboard.dismiss();

            // Perform form validation
            if (!donationForm.scannedLot || !donationForm.scannedExp || !donationForm.scannedGtin) {
                throw new Error('you must scan the required Barcode fields.');
            }

            // Add donation
            await addDonation();

            // Clear form fields only if submission is successful
            setDonationForm({
                name: '',
                presentation: '',
                form: '',
                laboratory: '',
                scannedLot: '',
                scannedExp: '',
                scannedGtin: '',
            });

            // Display success message
            setSuccessVisible(true);

            // Hide the success message after 2 seconds
            setTimeout(() => {
                setSuccessVisible(false);
            }, 2000);
        } catch (error: any) {
            if (error.message === 'Failed to add donation') {
                setErrorMessage('Failed to add donation.');
            } else {
                setErrorMessage(error.message); // Handle other types of errors
            }
            setErrorVisible(true);
        }
    };

    const dismissKeyboard = () => {
        Keyboard.dismiss();
    };

    return (
        <View className='bg-zinc-800' style={styles.container}>
            <ScrollView className='bg-zinc-800' contentContainerStyle={styles.container}>
                <TouchableWithoutFeedback onPress={dismissKeyboard}>
                    <View style={styles.cameraContainer}>
                        <Camera
                            style={styles.camera}
                            type={type}
                            flashMode={flashMode}
                            ref={cameraRef}
                            zoom={zoom}
                            autoFocus={Camera.Constants.AutoFocus.on}
                            onTouchStart={handlePinchGesture}
                            onTouchMove={handlePinchGesture}
                            onTouchEnd={() => previousZoomRef.current = null}
                            onBarCodeScanned={handleBarcodeScanned}
                        >
                            <View style={styles.buttonContainer}>
                                <TouchableOpacity style={styles.iconButton} onPress={flipCamera}>
                                    <MaterialCommunityIcons name="camera-switch" size={24} color="white" />
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.iconButton} onPress={toggleFlash}>
                                    <MaterialCommunityIcons name={flashMode === Camera.Constants.FlashMode.off ? 'flash-off' : 'flash'} size={24} color="white" />
                                </TouchableOpacity>
                            </View>
                        </Camera>
                        <View style={styles.zoomButtonsContainer}>
                            <TouchableOpacity style={styles.zoomInButton} onPress={zoomIn}>
                                <Text style={styles.text}>+</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.zoomOutButton} onPress={zoomOut}>
                                <Text style={styles.text}>-</Text>
                            </TouchableOpacity>
                        </View>
                        <Modal

                            visible={scannedModalVisible}
                            onRequestClose={handleCloseScannedModal}
                            animationType="slide"
                        >
                            <View className='bg-zinc-800 border-2 border-red-500 h-full'>
                                <View style={styles.inputContainer}>
                                    <View>
                                        <Text style={styles.label}>Name:</Text>
                                        <TextInput
                                            value={donationForm.name}
                                            onChangeText={(text) => setDonationForm({ ...donationForm, name: text })}
                                            placeholder="Name"
                                            placeholderTextColor="#999"
                                            style={[styles.input, focusedInput === 'name' && styles.inputFocused]}
                                            onFocus={() => handleFocus('name')}
                                            onBlur={handleBlur}
                                        />
                                    </View>

                                    <View>
                                        <Text style={styles.label}>Presentation:</Text>
                                        <TextInput
                                            value={donationForm.presentation}
                                            onChangeText={(text) => setDonationForm({ ...donationForm, presentation: text })}
                                            placeholder="Presentation"
                                            placeholderTextColor="#999"
                                            style={[styles.input, focusedInput === 'presentation' && styles.inputFocused]}
                                            onFocus={() => handleFocus('presentation')}
                                            onBlur={handleBlur}
                                        />
                                    </View>

                                    <View>
                                        <Text style={styles.label}>Form:</Text>
                                        <TextInput
                                            value={donationForm.form}
                                            onChangeText={(text) => setDonationForm({ ...donationForm, form: text })}
                                            placeholder="Form"
                                            placeholderTextColor="#999"
                                            style={[styles.input, focusedInput === 'form' && styles.inputFocused]}
                                            onFocus={() => handleFocus('form')}
                                            onBlur={handleBlur}
                                        />
                                    </View>

                                    <View>
                                        <Text style={styles.label}>Laboratory:</Text>
                                        <TextInput
                                            value={donationForm.laboratory}
                                            onChangeText={(text) => setDonationForm({ ...donationForm, laboratory: text })}
                                            placeholder="Laboratory"
                                            placeholderTextColor="#999"
                                            style={[styles.input, focusedInput === 'laboratory' && styles.inputFocused]}
                                            onFocus={() => handleFocus('laboratory')}
                                            onBlur={handleBlur}
                                        />
                                    </View>

                                    <Text style={styles.label}>GTIN:</Text>
                                    <TextInput
                                        placeholder="GTIN"
                                        value={gtin}
                                        style={[styles.input, focusedInput === 'GTIN' && styles.inputFocused]}
                                        onChangeText={setGtin}
                                        onFocus={() => handleFocus('GTIN')}
                                        onBlur={handleBlur}
                                    />

                                    <Text style={styles.label}>LOT#:</Text>
                                    <TextInput
                                        placeholder="LOT"
                                        value={lot}
                                        style={[styles.input, focusedInput === 'LOT' && styles.inputFocused]}
                                        onChangeText={setLot}
                                        onFocus={() => handleFocus('LOT')}
                                        onBlur={handleBlur}
                                    />

                                    <Text style={styles.label}>EXP:</Text>
                                    <TextInput
                                        placeholder="EXP"
                                        value={exp}
                                        style={[styles.input, focusedInput === 'EXP' && styles.inputFocused]}
                                        onChangeText={setExp}
                                        onFocus={() => handleFocus('EXP')}
                                        onBlur={handleBlur}
                                    />
                                </View>
                                <TouchableOpacity
                                    onPress={handleCloseScannedModal}
                                    style={styles.closeButton}
                                >
                                    <AntDesign name="close" size={24} color="#0096FF" />
                                </TouchableOpacity>

                                <View className='p-10'>
                                    <Button title="Submit" onPress={handleSubmit} />
                                </View>
                            </View>
                        </Modal>
                    </View>
                </TouchableWithoutFeedback >
            </ScrollView >
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    cameraContainer: {
        backgroundColor: "rgb(39 39 42)",
        flex: 1,
        justifyContent: "center",
    },
    camera: {
        flex: 1,
    },
    buttonContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingHorizontal: 20,
        paddingBottom: 20,
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

    text: {
        fontSize: 16,
        color: "white",
    },
    inputContainer: {
        // backgroundColor: 'red',
        marginTop: 60,
        marginBottom: 10,
        paddingHorizontal: 20,
    },
    label: {
        color: "#fff",
        marginRight: 10,
        fontSize: 16,
        fontWeight: 'bold',
    },

    inputFocused: {
        borderColor: '#0096FF',
    },
    input: {
        color: '#fff',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        paddingHorizontal: 10,
        paddingVertical: 8,
        marginBottom: 10,
    },
    // input: {
    //     color: '#fff',
    //     // height: windowHeight * 0.05,
    //     // width: windowWidth * 0.8,
    //     // marginVertical: windowHeight * 0.01,
    //     borderWidth: 1,
    //     borderRadius: 5,
    //     borderColor: "#fff",
    //     padding: 10,
    // },
    submitButton: {
        zIndex: 1,
        backgroundColor: '#0096FF',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 5,
    },
    submitButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    closeButton: {
        position: 'absolute',
        top: windowHeight * 0.03,
        right: windowWidth * 0.05,
        zIndex: 1,
    },
});
