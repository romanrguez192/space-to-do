import React, { useState, useRef, useEffect } from "react";
import { Text, View } from "react-native";
import styles from "./styles";
import { firebase } from "../../firebase/config";
import { Appbar, DefaultTheme } from "react-native-paper";

const CalendarScreen = (props) => {
  const CustomHeader = () => {
    return (
      <Appbar.Header
        theme={{
          ...DefaultTheme,
          roundness: 2,
          colors: {
            ...DefaultTheme.colors,
            primary: "#e54e42",
          },
        }}
      >
        <Appbar.Action
          icon="menu"
          onPress={() => props.navigation.toggleDrawer()}
        />
        <Appbar.Content title="Calendario" />
        <Appbar.Action icon="dots-vertical" />
      </Appbar.Header>
    );
  };

  return (
    <View>
      <CustomHeader />
      <Text style={{ fontWeight: "bold" }}>Calendario</Text>
    </View>
  );
};

export default CalendarScreen;
