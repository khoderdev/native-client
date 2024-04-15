import React from "react";
import { StyleSheet, View, Text, Image, TouchableOpacity } from "react-native";


import { Link } from "expo-router";
import { DonationProvider } from "../app/contexts/DonationContext";

export default function TabOneScreen() {
    return (
        <DonationProvider>
            <View style={styles.container}>
                <Image
                    source={require("../../assets/logo.png")}
                    style={styles.image}
                />
                <View className="flex flex-row w-full justify-around p-10 mt-36">
                    <Link suppressHighlighting href="/donate">

                        <TouchableOpacity >
                            <Image
                                source={require("../../assets/1.png")}
                                style={styles.buttonImage}
                            />
                        </TouchableOpacity>
                    </Link>

                    <Link suppressHighlighting href="/list">
                        <TouchableOpacity >
                            <Image
                                source={require("../../assets/2.png")}
                                style={styles.buttonImage}
                            />
                        </TouchableOpacity>
                    </Link>
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
        padding: 10
    },
    image: {
        width: "85%",
        height: 150,
        resizeMode: "contain",
    },

    buttonImage: {
        width: 120,
        height: 120,
        resizeMode: "contain",
    },
});
