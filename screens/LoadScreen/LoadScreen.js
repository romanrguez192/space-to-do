import React from "react";
import { View, ActivityIndicator } from "react-native";

const LoadScreen = () => {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <ActivityIndicator size="large" color="#9e9e9e" />
    </View>
  );
};

export default LoadScreen;
