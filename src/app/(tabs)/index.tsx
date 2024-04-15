// import React from "react";
// import { StyleSheet, View, Text, Image, TouchableOpacity } from "react-native";
// import { Stack } from 'expo-router';


// import { Link } from '@react-navigation/native';
// // import { Link } from "expo-router";
// import { DonationProvider } from "../contexts/DonationContext";

// export default function TabOneScreen() {
//   return (
//     <DonationProvider>
//       <View style={styles.container}>
//         <Image
//           source={require("../../../assets/logo.png")}
//           style={styles.image}
//         />


//         <View className="flex flex-row w-full justify-around p-10 mt-36">
//           <Link suppressHighlighting to="/donate">

//             <TouchableOpacity >
//               <Image
//                 source={require("../../../assets/1.png")}
//                 style={styles.buttonImage}
//               />
//             </TouchableOpacity>
//           </Link>

//           <Link suppressHighlighting to="/list">
//             <TouchableOpacity >
//               <Image
//                 source={require("../../../assets/2.png")}
//                 style={styles.buttonImage}
//               />
//             </TouchableOpacity>
//           </Link>
//         </View>
//       </View>
//     </DonationProvider>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     alignItems: "center",
//     justifyContent: "flex-start",
//     padding: 10
//   },
//   image: {
//     width: "85%",
//     height: 150,
//     resizeMode: "contain",
//   },

//   buttonImage: {
//     width: 120,
//     height: 120,
//     resizeMode: "contain",
//   },
// });



import React from "react";
import { StyleSheet, View, Image, TouchableOpacity } from "react-native";
import { useNavigation } from '@react-navigation/native';

import { DonationProvider } from "../contexts/DonationContext";

export default function TabOneScreen() {
  const navigation = useNavigation();

  return (
    <DonationProvider>
      <View style={styles.container}>
        <Image
          source={require("../../../assets/logo.png")}
          style={styles.image}
        />

        <View className="flex flex-row w-full justify-around p-10 mt-36">
          <TouchableOpacity onPress={() => navigation.navigate('donate')}>
            <Image
              source={require("../../../assets/1.png")}
              style={styles.buttonImage}
            />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('list')}>
            <Image
              source={require("../../../assets/2.png")}
              style={styles.buttonImage}
            />

          </TouchableOpacity>
        </View>
      </View>
    </DonationProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    backgroundColor:"#fff",
    padding: 10
  },

  image: {
    width: "85%",
    height: 150,
    resizeMode: "contain",
  },

  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    paddingTop: 20,
  },

  buttonImage: {
    width: 120,
    height: 120,
    resizeMode: "contain",
  },
});
