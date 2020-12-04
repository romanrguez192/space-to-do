import React, { useState, useRef, useEffect } from "react";
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

  const loginUser = async () => {
    if (user.email.trim() === "" || user.password.trim() === "") {
      Alert.alert("Error", "Ingresa tu correo y tu contraseña.");
      return;
    }

    // TODO: Mantener al usuario con su cuenta ingresada

    setVisibleOverlay(true);

    await firebase
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
              Alert.alert("Error", "Este usuario ya no existe.");
              return;
            }
            const userData = firestoreDocument.data();
            setVisibleOverlay(false);
            // TODO: Mejorar navegación
            props.navigation.navigate("Inicio", {user: userData});
          })
          .catch((error) => {
            // TODO: Textos de error
            alert(error);
          });
      })
      .catch((error) => {
        // TODO: Textos de error
        alert(error);
      });

    setVisibleOverlay(false);
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
