import React, { useState } from "react";
import {
  View,
  Text,
  Modal,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const ScannedDataScreen = ({ route }) => {
  const { scannedData } = route?.params || {};
  const [modalVisible, setModalVisible] = useState(true);
  const navigation = useNavigation();

  const resetState = () => {
    // Reset state or close the modal
    setModalVisible(false);
    // You can perform additional actions here, such as navigating back
    navigation.goBack();
  };

  return (
    <Modal visible={modalVisible}>
      <ScrollView>
        <View>
          <TouchableOpacity onPress={resetState} style={styles.closeButton}>
            <AntDesign name="close" size={24} color="#00a651" />
          </TouchableOpacity>
          {/* Render medication details for each drug */}
          {scannedData &&
            scannedData.map((data, index) => (
              <View key={index}>
                {/* Display scanned data */}
                <Text>GTIN:</Text>
                <TextInput
                  value={data.GTIN}
                  onChangeText={(value) => {
                    // Handle input change
                  }}
                  style={styles.input}
                />
                <Text>LOT/Batch Number:</Text>
                <TextInput
                  value={data.LOT}
                  onChangeText={(value) => {
                    // Handle input change
                  }}
                  style={styles.input}
                />
                <Text>Expiry Date:</Text>
                <TextInput
                  value={data.ExpiryDate}
                  onChangeText={(value) => {
                    // Handle input change
                  }}
                  style={styles.input}
                />
                <Text>Serial Number:</Text>
                <TextInput
                  value={data.Serial}
                  onChangeText={(value) => {
                    // Handle input change
                  }}
                  style={styles.input}
                />
                {/* Add more fields as needed */}
              </View>
            ))}
        </View>
      </ScrollView>
    </Modal>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor:'#999'
  },
  closeButton: {
    position: "absolute",
    top: 20,
    right: 20,
    zIndex: 1,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 10,
  },
});
export default ScannedDataScreen;
