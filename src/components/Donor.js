// Donor.js
import React from "react";
import { View, Text, TextInput, StyleSheet, Dimensions } from "react-native";
import { Picker } from "@react-native-picker/picker";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

const Donor = ({
  selectedDonorId,
  setSelectedDonorId,
  donors,
  selectedRecipient,
  handleRecipientChange,
  recipients,
  donationForm,
  setDonationForm,
  focusedInput,
  handleFocus,
  handleBlur,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Donor:</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={selectedDonorId}
            onValueChange={(itemValue, itemIndex) =>
              setSelectedDonorId(itemValue)
            }
            style={styles.picker}
            itemStyle={styles.pickerItem}
          >
            <Picker.Item label="Select a donor" value={null} />
            {donors &&
              donors.map((donor) => (
                <Picker.Item
                  key={`${donor.DonorId}-${donor.DonorName}`}
                  label={donor.DonorName}
                  value={donor.DonorId}
                />
              ))}
          </Picker>
        </View>
      </View>
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Recipient:</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={selectedRecipient}
            onValueChange={handleRecipientChange}
            style={styles.picker}
            itemStyle={styles.pickerItem}
          >
            <Picker.Item label="Select" value="" />
            {recipients &&
              recipients.map((recipient) => (
                <Picker.Item
                  key={recipient.RecipientId}
                  label={recipient.RecipientName}
                  value={recipient.RecipientId.toString()}
                />
              ))}
          </Picker>
        </View>
      </View>
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Purpose:</Text>
        <TextInput
          value={donationForm.DonationPurpose}
          onChangeText={(text) =>
            setDonationForm({ ...donationForm, DonationPurpose: text })
          }
          multiline={true}
          numberOfLines={4}
          placeholder="Donation Purpose"
          placeholderTextColor="#999"
          style={[
            styles.purposeInput,
            { textAlign: "center" },
            focusedInput === "DonationPurpose" && styles.inputFocused,
          ]}
          onFocus={() => handleFocus("DonationPurpose")}
          onBlur={handleBlur}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // marginBottom: 20,
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

  pickerContainer: {
    borderColor: "#00a651",
    borderWidth: 1,
    borderRadius: 20,
    marginTop: 10,
    height: windowHeight * 0.07,
  },

  purposeInput: {
    color: "#000",
    width: windowWidth * 0.8,
    marginTop: 10,
    borderWidth: 1,
    borderRadius: 20,
    borderColor: "#00a651",
    padding: 10,
    // paddingTop: 10,
  },
});

export default Donor;
