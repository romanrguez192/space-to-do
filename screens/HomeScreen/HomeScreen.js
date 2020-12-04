import React, { useState, useRef, useEffect } from "react";
import {
  ScrollView,
  TouchableOpacity,
  Text,
  Image,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Button,
} from "react-native";
import { Input, Icon } from "react-native-elements";
import styles from "./styles";
import { firebase } from "../../firebase/config";

// Pantalla de Inicio de Sesión
const HomeScreen = (props) => {

  const singout = () => {
    firebase.auth().signOut().then(() => {
      // Sign-out successful.
      alert("Saliste de tu cuenta");
    }).catch((error) => {
      // An error happened.
      alert(error);
    });
  }

  return (
    <SafeAreaView style={styles.areaview}>
      <KeyboardAvoidingView
        enabled
        behavior={Platform.OS === "ios" ? "padding" : null}
        style={styles.keyboardstyle}
        keyboardVerticalOffset="100"
      >
        <ScrollView contentContainerStyle={styles.container}>
          <TouchableOpacity>
            <Icon
              type="font-awesome"
              name="plus"
              size={40}
              color="#fff"
              alignItems="center"
              style={styles.addButton}
            />
          </TouchableOpacity>
          <Text>{props.extraData.name}</Text>
          <Button title="Salir" onPress={() => singout()} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default HomeScreen;
