import React, { useState } from "react";
import { StyleSheet, Pressable, View, Text } from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Link } from "expo-router";
import { DonationProvider } from "../contexts/DonationContext";
import HomeSwiper from "../../components/Swiper";

export default function TabOneScreen() {
  const [isFloatingButtonVisible, setIsFloatingButtonVisible] = useState(true);

  const handlePress = () => {
    console.log("Floating button pressed!");
  };

  return (
    <DonationProvider>
      <View className="bg-zinc-800" style={styles.container}>
        <HomeSwiper />
        <Text style={styles.title}>Med Donation</Text>
        <Link
          suppressHighlighting
          className="flex h-13 w-36 mt-10 items-center justify-center overflow-hidden rounded-md bg-[#0096FF] px-4 pt-5 py-4 text-sm font-medium text-white web:shadow ios:shadow transition-colors hover:bg-gray-900/90 active:bg-gray-400/90 web:focus-visible:outline-none web:focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 dark:hover:bg-gray-50/90 dark:focus-visible:ring-gray-300"
          href="/donate"
        >
          <View className="flex flex-row items-center justify-center">
            <Text className="text-white font-bold">Donate now</Text>
            <FontAwesome
              name="heartbeat"
              size={20}
              color="#fff"
              style={{ marginLeft: 5 }}
            />
          </View>
        </Link>
        {/* <Link
          suppressHighlighting
          className="flex h-13 w-36 mt-10 items-center justify-center overflow-hidden rounded-md bg-[#0096FF] px-4 pt-5 py-4 text-sm font-medium text-white web:shadow ios:shadow transition-colors hover:bg-gray-900/90 active:bg-gray-400/90 web:focus-visible:outline-none web:focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 dark:hover:bg-gray-50/90 dark:focus-visible:ring-gray-300"
          href="/donates"
        >
          <View className="flex flex-row items-center justify-center">
            <Text className="text-white font-bold">Donate now</Text>
            <FontAwesome
              name="heartbeat"
              size={20}
              color="#fff"
              style={{ marginLeft: 5 }}
            />
          </View>
        </Link> */}
      </View>
    </DonationProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    // backgroundColor: 'red',
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
  },
  title: {
    // backgroundColor: 'red',
    color: "#fff",
    fontSize: 30,
    fontWeight: "bold",
    marginTop: 30,
  },
  inspirationalText: {
    color: "#fff",
    fontSize: 16,
    marginTop: 10,
    paddingHorizontal: 20,
    textAlign: "center",
    lineHeight: 24,
  },
  floatingButtonContainer: {
    position: "absolute",
    bottom: 30,
    right: 25,
    zIndex: 9999,
  },
  floatingButton: {
    fontSize: 40,
    color: "#0096FF",
  },
});
