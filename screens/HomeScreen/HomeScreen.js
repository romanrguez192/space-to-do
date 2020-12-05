import React, { useState, useRef, useEffect } from "react";
import {
  ScrollView,
  TouchableOpacity,
  Text,
  Image,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  View,
  Button,
} from "react-native";
import { Input, Icon } from "react-native-elements";
import styles from "./styles";
import { firebase } from "../../firebase/config";

// Pantalla de Inicio de Sesión
const HomeScreen = (props) => {
  const singout = () => {
    firebase
      .auth()
      .signOut()
      .then(() => {
        // Sign-out successful.
        alert("Saliste de tu cuenta");
      })
      .catch((error) => {
        // An error happened.
        alert(error);
      });
  };

  return (
    <SafeAreaView style={styles.areaview}>
      <KeyboardAvoidingView
        enabled
        behavior={Platform.OS === "ios" ? "padding" : null}
        style={styles.keyboardstyle}
        keyboardVerticalOffset="100"
      >
        <ScrollView contentContainerStyle={styles.container}>
          <Button title="Salir" onPress={() => singout()} />
          <Text style={styles.messageStyle}> ¡Hola Turco...!</Text>
          <View style={styles.ButtonContainer1}>
            <TouchableOpacity style={styles.buttonStyle}>
              <Icon
                type="font-awesome"
                name="tasks"
                size={30}
                color="#e54e42"
                backgroundColor="#e54e4250"
                alignItems="center"
                style={styles.iconStyle}
              />
              <Text
                style={{
                  paddingTop: 5,
                  left: 1,
                  fontSize: 15,
                  fontWeight: "500",
                  color: "#2d3f50",
                }}
              >
                Tareas
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.buttonStyle}>
              <Icon
                type="font-awesome"
                name="user"
                size={30}
                color="#3b99d8"
                backgroundColor="#3b99d850"
                alignItems="center"
                style={styles.iconStyle}
              />
              <Text
                style={{
                  paddingTop: 5,
                  left: 6,
                  fontSize: 15,
                  fontWeight: "500",
                  color: "#2d3f50",
                }}
              >
                Perfil
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.buttonStyle}>
              <Icon
                type="font-awesome"
                name="star"
                size={30}
                color="#8B008B"
                backgroundColor="#8B008B50"
                alignItems="center"
                style={styles.iconStyle}
              />
              <Text
                style={{
                  paddingTop: 5,
                  left: -13,
                  fontSize: 15,
                  fontWeight: "500",
                  color: "#2d3f50",
                }}
              >
                Importante
              </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.ButtonContainer1}>
            <TouchableOpacity style={styles.buttonStyle}>
              <Icon
                type="font-awesome"
                name="search"
                size={30}
                color="#2c279f"
                backgroundColor="#2c279f50"
                alignItems="center"
                style={styles.iconStyle}
              />
              <Text
                style={{
                  paddingTop: 5,
                  left: 1,
                  fontSize: 15,
                  fontWeight: "500",
                  color: "#2d3f50",
                }}
              >
                Buscar
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.buttonStyle}>
              <Icon
                type="font-awesome"
                name="plus"
                size={30}
                color="#FF8C00"
                backgroundColor="#FF8C0050"
                alignItems="center"
                style={styles.iconStyle}
              />
              <Text
                style={{
                  paddingTop: 5,
                  left: 2,
                  fontSize: 15,
                  fontWeight: "500",
                  color: "#2d3f50",
                }}
              >
                Añadir
              </Text>
            </TouchableOpacity>
          </View>
          <View
            style={{
              borderBottomColor: "#bbb",
              borderBottomWidth: 1,
            }}
          />
          <View>{/* TODO: AGREGAR LA LISTA DE TAREAS POR CULMINAR */}</View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default HomeScreen;
