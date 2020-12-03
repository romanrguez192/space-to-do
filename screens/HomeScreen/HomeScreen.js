import React, { useState, useRef, useEffect } from "react";
import {
  ScrollView,
  TouchableOpacity,
  Text,
  Image,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Input, Icon } from "react-native-elements";
import styles from "./styles";
import { firebase } from "../../firebase/config";

// Pantalla de Inicio de Sesión
const HomeScreen = (props) => {

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
            type='font-awesome'
            name='plus'
            size={40}
            color='#fff'
            alignItems='center'
            style={styles.addButton}/>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default HomeScreen;
