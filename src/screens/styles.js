import { StyleSheet, Dimensions } from "react-native";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    alignItems: "center",
    justifyContent: "flex-center",
    backgroundColor: "#999",
    position: "relative",
    padding: 40,
  },

  input: {
    backgroundColor: "#fff",
    color: "#0096FF",
    height: windowHeight * 0.05,
    width: windowWidth * 0.8,
    marginVertical: windowHeight * 0.01,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: "#000",
    padding: 10,
  },
  placeholder: {
    color: "#999",
  },
  inputFocused: {
    borderColor: "#0096FF",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  // buttonsContainer: {
  //     borderWidth: 1,
  //     backgroundColor: "#000",
  //     flexDirection: "row",
  //     gap: 20,
  //     // width:'100%',
  //     marginTop: 20,
  // },
  denyButton: {
    backgroundColor: "red",
    padding: 10,
    borderRadius: 2,
    marginLeft: 10, // To add space between buttons
  },
  buttonText: {
    color: "white",
  },
  permissionsText: {
    fontWeight: "regular",
    fontSize: 18,
  },
  inputGroup: {
    flexDirection: "column",
    alignItems: "flex-start",
    // marginBottom: 5,
  },
  label: {
    color: "#000",
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
  scanIcon: {
    position: "absolute",
    color: "#0096FF",
    bottom: windowHeight * 0.01,
    left: windowWidth * 0.3,
    zIndex: 1,
  },
  closeButtonText: {
    color: "#0096FF",
    fontWeight: "bold",
  },

  submitButton: {
    position: "absolute",
    bottom: -50,
    left: 100,
    zIndex: 1,
    backgroundColor: "#0096FF",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  submitButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  // zoomButton: {
  //   backgroundColor: "#0096FF",
  //   paddingHorizontal: 20,
  //   paddingVertical: 10,
  //   borderRadius: 5,
  //   marginVertical: 5,
  // },
  // zoomButtonText: {
  //   position:"absolute",
  //   bottom:70,
  //   color: "white",
  //   fontSize: 16,
  //   fontWeight: "bold",
  // },
  camera: {
    width: "100%",
    height: "100%",
  },
});
