import React, { useState, useRef, useEffect } from "react";
import {
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Text,
  Image,
  Dimensions,
  SafeAreaView,
} from "react-native";
import { Input, Icon } from "react-native-elements";
import { color, Value } from "react-native-reanimated";
import logo from "../assets/logo.png";

// Pantalla de Inicio de Sesión
const LoginScreen = () => {
  const [visiblePassword, setVisiblePassword] = useState(false);
  const passwordInput = useRef(null);

  // Función para crear el icono del ojo con o sin slash ("eye" o "eye-slash" como parámetro)
  const createEyeIcon = (name) => {
    return (
      <Icon
        type="font-awesome"
        name={name}
        color="#ccc"
        onPress={() => setVisiblePassword(!visiblePassword)}
      />
    );
  };

  const [eyeIcon, setEyeIcon] = useState(createEyeIcon("eye-slash"));

  // Función a ejecutar cuando cambia la visibilidad de la contraseña
  useEffect(() => {
    if (visiblePassword) {
      passwordInput.current.setNativeProps({ secureTextEntry: false }); // La hace visible
      setEyeIcon(createEyeIcon("eye"));
    } else {
      passwordInput.current.setNativeProps({ secureTextEntry: true }); // la hace no visible
      setEyeIcon(createEyeIcon("eye-slash"));
    }
  }, [visiblePassword]);

  return (
   <SafeAreaView style={styles.areaview}>
    <ScrollView contentContainerStyle={styles.container}>
      {/* Logo de Space To Do */}
      <Image source={logo} style={styles.logo} />
      {/* Correo electrónico */}
      <Input
        labelStyle={styles.inputText}
        placeholder="email@address.com"
        leftIcon={{ type: "font-awesome", name: "envelope", color: "#bbb" }}
        label="Correo Electrónico"
        leftIconContainerStyle={{ marginRight: 5 }}
        autoCapitalize="none"
        autoCompleteType="email"
      />
      {/* Contraseña */}
      <Input
        labelStyle={styles.inputText}
        ref={passwordInput}
        placeholder="Contraseña"
        leftIcon={{ type: "font-awesome", name: "lock", color: "#bbb" }}
        label="Contraseña"
        secureTextEntry={true}
        leftIconContainerStyle={{ marginRight: 5 }}
        rightIcon={eyeIcon}
        righttIconContainerStyle={{ marginLeft: 5 }}
      />
      {/* Botón para ingresar */}
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Ingresar</Text>
      </TouchableOpacity>
    </ScrollView>
   </SafeAreaView>
  );
};

// Dimensiones de la ventana
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

// Estilos
const styles = StyleSheet.create({
  areaview: {
    flex: 1,
    backgroundColor: '#fff',
  },

  container: {
    backgroundColor: "#fff",
    alignItems: "center",
    paddingLeft: 25,
    paddingRight: 25,
    paddingBottom: 25,
  },
  inputText: {
    color: "#2d3f50",
  },
  button: {
    backgroundColor: "#e54e42",
    marginTop: 20,
    paddingHorizontal: 80,
    paddingVertical: 15,
    borderRadius: 5,
  },
  buttonText: {
    fontSize: 20,
    color: "#fff",
  },
  logo: {
    width: windowWidth * 0.6,
    height: windowHeight * 0.5,
    resizeMode: "contain",
  },
});

export default LoginScreen;
