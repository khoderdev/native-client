import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Dimensions,
} from "react-native";

export default function DrugsInput(props) {
  const [arr, setArr] = useState([]);
  const [leaveVal, setLeaveVal] = useState("");
  const [leaveFlag, setLeaveFlag] = useState(false);
  const [absenceTypeBorderBottomColor, setAbsenceTypeBorderBottomColor] =
    useState("black");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch("http://85.112.70.8:3000/donor/all");
      const data = await response.json();
      console.log("Fetched donors list:", data);
      setArr(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const arryFilter = (str) => {
    if (!str) {
      setArr(props.data || []);
    } else {
      const filteredArr = arr.filter((item) =>
        item.DonorName.toUpperCase().includes(str.toUpperCase())
      );
      setArr(filteredArr);
    }
  };

  const onTrigger = (attTypeId) => {
    if (props.parentCallback) {
      props.parentCallback(attTypeId);
    }
  };

  return (
    <View style={styles.container}>
      <View style={{ alignSelf: "center", alignContent: "center" }}>
        <TextInput
          editable
          value={leaveVal}
          placeholderTextColor={props.placeholderTextColor}
          style={{
            backgroundColor: props.backgroundColorTextInput,
            width: Dimensions.get("window").width - (props.widthBySide || 0),
            height: 50,
            borderWidth: 0.5,
            borderColor: "black",
            borderBottomColor: absenceTypeBorderBottomColor,
            borderBottomWidth: props.borderBottomWidth || 2,
            borderRadius: props.borderRadius || 7,
            paddingHorizontal: 10,
          }}
          selectionColor={"#006e51"}
          placeholder={props.placeholder}
          onChangeText={(text) => {
            setLeaveVal(text);
            setLeaveFlag(true);
            arryFilter(text);
          }}
          onFocus={() => {
            setLeaveFlag(true);
            arryFilter();
            setAbsenceTypeBorderBottomColor(props.onFocusBottomColor);
          }}
          onBlur={() => {
            setLeaveFlag(false);
            setAbsenceTypeBorderBottomColor(
              props.absenceTypeBorderBottomColor || "black"
            );
          }}
        />

        {leaveFlag && (
          <ScrollView
            keyboardShouldPersistTaps={"always"}
            nestedScrollEnabled={true}
            style={{
              position: "absolute",
              top: 50,
              height: 135,
              elevation: 2,
              zIndex: 1000,
              width: Dimensions.get("window").width - (props.widthBySide || 0),
            }}
          >
            {arr.length > 0 ? (
              arr.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => {
                    setLeaveVal(item.DonorName);
                    setLeaveFlag(false);
                    onTrigger(item.DonorId);
                  }}
                >
                  <View
                    style={{
                      height: 40,
                      borderRadius: props.borderRadiusList || 10,
                      marginTop: props.listMarginTop || 0,
                      padding: 7,
                      elevation: 10,
                      borderBottomWidth: 0.5,
                      borderBottomColor: props.borderBottomColor || "black",
                      backgroundColor: props.listBackgroundColor || "white",
                    }}
                  >
                    <Text style={{ color: props.listTextColor || "black" }}>
                      {item.DonorName}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))
            ) : (
              <Text
                style={{
                  height: 40,
                  borderRadius: 1,
                  padding: 7,
                  elevation: 2,
                  backgroundColor: "white",
                  textAlign: "center",
                }}
              >
                Not Found
              </Text>
            )}
          </ScrollView>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
  },
});
