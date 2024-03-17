import React from 'react';
import { StyleSheet } from 'react-native';

import { ExternalLink } from './ExternalLink';
import { MonoText } from './StyledText';
import { Text, View } from './Themed';

import Colors from '@/constants/Colors';

interface EditScreenInfoProps {
  path: string;
  onClose?: () => void; // Define onClose as an optional function prop
}

export default function EditScreenInfo({ path, onClose }: EditScreenInfoProps) {
  return (
    <View>
      <View style={styles.getStartedContainer}>
        <Text
          style={styles.getStartedText}
          lightColor="rgba(0,0,0,0.8)"
          darkColor="rgba(255,255,255,0.8)">
          Open up the code for this screen:
        </Text>

        <View
          style={[styles.codeHighlightContainer, styles.homeScreenFilename]}
          darkColor="rgba(255,255,255,0.05)"
          lightColor="rgba(0,0,0,0.05)">
          <MonoText>{path}</MonoText>
        </View>

        <Text
          style={styles.getStartedText}
          lightColor="rgba(0,0,0,0.8)"
          darkColor="rgba(255,255,255,0.8)">
          Change any of the text, save the file, and your app will automatically update.
        </Text>
      </View>

      <View style={styles.helpContainer}>
        <ExternalLink
          style={styles.helpLink}
          href="https://docs.expo.io/get-started/create-a-new-app/#opening-the-app-on-your-phonetablet">
          <Text style={styles.helpLinkText} lightColor={Colors.light.tint}>
            Tap here if your app doesn't automatically update after making changes
          </Text>
        </ExternalLink>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  getStartedContainer: {
    alignItems: 'center',
    marginHorizontal: 50,
  },
  homeScreenFilename: {
    marginVertical: 7,
  },
  codeHighlightContainer: {
    borderRadius: 3,
    paddingHorizontal: 4,
  },
  getStartedText: {
    fontSize: 17,
    lineHeight: 24,
    textAlign: 'center',
  },
  helpContainer: {
    marginTop: 15,
    marginHorizontal: 20,
    alignItems: 'center',
  },
  helpLink: {
    paddingVertical: 15,
  },
  helpLinkText: {
    textAlign: 'center',
  },
});


// ///////////////////////////////////////////////////////////////////////////
// ///////////////////////////////////////////////////////////////////////////
// ///////////////////////////////////////////////////////////////////////////
// ///////////////////////////////////////////////////////////////////////////

// import React, { useEffect, useState } from "react";
// import { View, StyleSheet, Modal, Text, StatusBar, TextInput, TouchableWithoutFeedback, Keyboard } from "react-native";
// import colors from "../misc/colors";
// import RoundIconBtn from "./RoundIconBtn";

// const EditScreenInfo = ({ visible, onClose, onSubmit, note, isEdit }) => {
//   const [title, setTitle] = useState("");
//   const [desc, setDesc] = useState("");

//   const handleModalClose = () => {
//     Keyboard.dismiss();
//   };

//   useEffect(() => {
//     if (isEdit) {
//       setTitle(note.title);
//       setDesc(note.desc);
//     }
//   }, [isEdit]);

//   const handleOnChangeText = (text, valueFor) => {
//     if (valueFor === "title") setTitle(text);
//     if (valueFor === "desc") setDesc(text);
//   };

//   const handleSubmit = async () => {
//     if (!title.trim() && !desc.trim()) return onClose(); // Ensure onClose is a function

//     const noteData = { title, desc };
//     const requestOptions = {
//       method: isEdit ? "PUT" : "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(noteData),
//     };

//     try {
//       const response = await fetch("http://1.1.1.250:5000/api/donations", requestOptions);
//       const data = await response.json();

//       onSubmit(data); // Assuming onSubmit function handles the response data
//       onClose(); // Ensure onClose is a function
//     } catch (error) {
//       console.error("Error submitting note:", error);
//     }
//   };

//   const closeModal = () => {
//     if (!isEdit) {
//       setTitle("");
//       setDesc("");
//     }
//     onClose(); // Ensure onClose is a function
//   };

//   return (
//     <>
//       <StatusBar hidden />
//       <Modal visible={visible} animationType="fade">
//         <View style={styles.container}>
//           <TextInput
//             value={title}
//             onChangeText={(text) => handleOnChangeText(text, "title")}
//             placeholder="Title"
//             style={[styles.input, styles.title]}
//           />
//           <TextInput
//             value={desc}
//             multiline
//             placeholder="Note"
//             style={[styles.input, styles.desc]}
//             onChangeText={(text) => handleOnChangeText(text, "desc")}
//           />
//           <View style={styles.btnContainer}>
//             <RoundIconBtn
//               size={15}
//               antIconName="check"
//               onPress={handleSubmit}
//             />
//             {title.trim() || desc.trim() ? (
//               <RoundIconBtn
//                 size={15}
//                 style={{ marginLeft: 15 }}
//                 antIconName="close"
//                 onPress={closeModal}
//               />
//             ) : null}
//           </View>
//         </View>
//         <TouchableWithoutFeedback onPress={handleModalClose}>
//           <View style={[styles.modalBG, StyleSheet.absoluteFillObject]} />
//         </TouchableWithoutFeedback>
//       </Modal>
//     </>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     paddingHorizontal: 20,
//     paddingTop: 15,
//   },
//   input: {
//     borderBottomWidth: 2,
//     borderBottomColor: colors.PRIMARY,
//     fontSize: 20,
//     color: colors.DARK,
//   },
//   title: {
//     height: 40,
//     marginBottom: 15,
//     fontWeight: "bold",
//   },
//   desc: {
//     height: 100,
//   },
//   modalBG: {
//     flex: 1,
//     zIndex: -1,
//   },
//   btnContainer: {
//     flexDirection: "row",
//     justifyContent: "center",
//     paddingVertical: 15,
//   },
// });

// export default EditScreenInfo;
