// import React, { Component } from "react";
// import { StyleSheet, Text, View } from "react-native";
// import Swiper from "react-native-swiper";

// const styles = StyleSheet.create({
//   swiperContainer: {
//     height: 200,
//   },
//   wrapper: {},
//   slide1: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     backgroundColor: "#9DD6EB",
//   },
//   slide2: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     backgroundColor: "#97CAE5",
//   },
//   slide3: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     backgroundColor: "#92BBD9",
//   },
//   text: {
//     color: "#fff",
//     fontSize: 30,
//     fontWeight: "bold",
//   },
// });

// export default class HomeSwiper extends Component {
//   render() {
//     return (
//         <View style={styles.swiperContainer}>
//         <Swiper autoplay={true} showsButtons={true}>
//           <View style={styles.slide1}>
//             <Text style={styles.text}>Hello Swiper</Text>
//           </View>
//           <View style={styles.slide2}>
//             <Text style={styles.text}>Beautiful</Text>
//           </View>
//           <View style={styles.slide3}>
//             <Text style={styles.text}>And simple</Text>
//           </View>
//         </Swiper>
//       </View>
//     );
//   }
// }

import React, { Component } from "react";
import { StyleSheet, Text, View, Image } from "react-native";
import Swiper from "react-native-swiper";

const styles = StyleSheet.create({
  swiperContainer: {
    height: 200, // Adjust the height as needed
  },
  slide: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    color: "#fff",
    fontSize: 30,
    fontWeight: "bold",
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
});

export default class HomeSwiper extends Component {
  render() {
    return (
      <View style={styles.swiperContainer}>
        <Swiper autoplay={true} loop={true} showsPagination={false}>
          <View style={styles.slide}>
            <Image
              source={require("../../assets//md1.jpg")}
              style={styles.image}
            />
          </View>
          <View style={styles.slide}>
            <Image
              source={require("../../assets//md2.jpg")}
              style={styles.image}
            />
          </View>
          <View style={styles.slide}>
            <Image
              source={require("../../assets//md3.jpg")}
              style={styles.image}
            />
          </View>
        </Swiper>
      </View>
    );
  }
}
