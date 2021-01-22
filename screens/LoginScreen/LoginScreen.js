import React, { useState, useRef, useEffect, useLayoutEffect } from "react";
import {
  ScrollView,
  TouchableOpacity,
  Text,
  Image,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Input, Icon, Overlay } from "react-native-elements";
import logo from "../../assets/logo.png";
import styles from "./styles";
import { firebase } from "../../firebase/config";
import { Appbar, DefaultTheme } from "react-native-paper";

// Pantalla de Inicio de Sesión
const LoginScreen = (props) => {
  const [visiblePassword, setVisiblePassword] = useState(false);
  const passwordInput = useRef(null);
  const [visibleOverlay, setVisibleOverlay] = useState(false);
  const [eyeIcon, setEyeIcon] = useState(null);
  const [user, setUser] = useState({
    email: "",
    password: "",
  });

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
        <Appbar.Content title="Iniciar Sesión" />
      </Appbar.Header>
    );
  };

  useLayoutEffect(() => {
    props.navigation.setOptions({
      header: () => <CustomHeader />,
    });
  }, [props.navigation]);

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

  const handleChangeText = (name, value) => {
    setUser({ ...user, [name]: value });
  };

  const loginUser = () => {
    if (user.email.trim() === "" || user.password.trim() === "") {
      Alert.alert("Error", "Ingresa tu correo y tu contraseña, por favor.");
      return;
    }

    setVisibleOverlay(true);

    firebase
      .auth()
      .signInWithEmailAndPassword(user.email.trim(), user.password)
      .then((response) => {
        const uid = response.user.uid;
        const usersRef = firebase.firestore().collection("users");
        usersRef
          .doc(uid)
          .get()
          .then((firestoreDocument) => {
            if (!firestoreDocument.exists) {
              Alert.alert(
                "Error",
                "Este usuario ya no existe, intenta de nuevo."
              );
              return;
            }
            setVisibleOverlay(false);
            Alert.alert("Enhorabuena", "Has iniciado sesión correctamente.");
          })
          .catch((error) => {
            setVisibleOverlay(false);
            Alert.alert(
              "Error",
              "Revisa tu conexión a internet y vuelve a intentar."
            );
          });
      })
      .catch((error) => {
        setVisibleOverlay(false);
        let message = error.code;
        if (error.code == "auth/invalid-email") {
          message = "Ingresa una dirección de correo electrónico válida.";
        } else if (
          error.code == "auth/user-not-found" ||
          error.code == "auth/wrong-password"
        ) {
          message = "Correo o contraseña inválidos, intenta nuevamente.";
        }
        Alert.alert("Error", message);
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
            onChangeText={(value) => handleChangeText("email", value)}
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
            onChangeText={(value) => handleChangeText("password", value)}
          />
          {/* Botón para ingresar */}
          <TouchableOpacity style={styles.button} onPress={() => loginUser()}>
            <Text style={styles.buttonText}>Ingresar</Text>
          </TouchableOpacity>
          {/* Botón para registrarse */}
          <TouchableOpacity
            onPress={() => props.navigation.navigate("Registrarse")}
          >
            <Text style={styles.buttonText2}>
              ¿No tienes cuenta? ¡Regístrate aquí!
            </Text>
          </TouchableOpacity>
          <Overlay isVisible={visibleOverlay} overlayStyle={{ padding: 70 }}>
            <ActivityIndicator size="large" color="#9e9e9e" />
          </Overlay>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default LoginScreen;
