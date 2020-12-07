import React, { useState, useRef, useEffect, useLayoutEffect } from "react";
import {
  ScrollView,
  TouchableOpacity,
  Text,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Input, Icon, Overlay } from "react-native-elements";
import RadioForm from "react-native-simple-radio-button";
import styles from "./styles";
import { firebase } from "../../firebase/config";
import { Appbar, DefaultTheme } from "react-native-paper";

// Pantalla de Registro
const RegistrationScreen = (props) => {
  const [visiblePassword, setVisiblePassword] = useState(false);
  const passwordInput = useRef(null);
  const passwordInput2 = useRef(null);
  const [eyeIcon, setEyeIcon] = useState(null);
  const [visibleOverlay, setVisibleOverlay] = useState(false);
  const [user, setUser] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    gender: "",
  });

  // Géneros para el Radiobutton
  const gender = [
    { label: "Masculino   ", value: 0 },
    { label: "Femenino", value: 1 },
  ];

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
        <Appbar.BackAction onPress={() => props.navigation.navigate("Iniciar Sesión")} />
        <Appbar.Content title="Registrarse"/>
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
      passwordInput2.current.setNativeProps({ secureTextEntry: false }); // La hace visible
      setEyeIcon(createEyeIcon("eye"));
    } else {
      passwordInput.current.setNativeProps({ secureTextEntry: true }); // la hace no visible
      setEyeIcon(createEyeIcon("eye-slash"));
      passwordInput2.current.setNativeProps({ secureTextEntry: true }); // la hace no visible
      setEyeIcon(createEyeIcon("eye-slash"));
    }
  }, [visiblePassword]);

  const handleChangeText = (name, value) => {
    setUser({ ...user, [name]: value });
  };

  const handleChangeGender = (value) => {
    setUser({ ...user, gender: value ? "F" : "M" });
  };

  const registerUser = async () => {
    const values = Object.values(user);

    if (values.some((value) => value.trim() === "")) {
      Alert.alert("Error", "Debe llenar todos los campos.");
      return;
    }

    if (user.username.trim().indexOf(" ") != -1) {
      Alert.alert("Error", "El nombre de usuario no puede contener espacios.");
      return;
    }

    if (user.password !== user.confirmPassword) {
      Alert.alert("Error", "Ambas contraseñas deben coincidir.");
      return;
    }

    const usersRef = firebase.firestore().collection("users");
    let validUsername = true;
    setVisibleOverlay(true);

    await usersRef.get().then((snapshot) => {
      if (
        snapshot.docs.some(
          (doc) => doc.data().username === user.username.trim()
        )
      ) {
        validUsername = false;
      }
    });

    if (!validUsername) {
      setVisibleOverlay(false);
      Alert.alert("Error", "Este nombre de usuario no está disponible");
      return;
    }

    const colorHEX = () => {
      const colores = ["#e67e22", "#8e44ad", "#1abc9c", "#e74c3c", "#16a085"];
      return colores[(Math.random() * (colores.length - 1)).toFixed()];
    };

    firebase
      .auth()
      .createUserWithEmailAndPassword(user.email.trim(), user.password)
      .then((response) => {
        const uid = response.user.uid;
        const data = {
          id: uid,
          name: user.name.trim(),
          username: user.username.trim(),
          email: user.email.trim(),
          gender: user.gender,
          imageID: "",
          avatarColor: colorHEX(),
        };
        usersRef
          .doc(uid)
          .set(data)
          .then(() => {
            setVisibleOverlay(false);
            // TODO: Cambiar esta alerta por una mejor
            Alert.alert("Enhorabuena", "Usuario creado satisfactoriamente");
          })
          .catch((error) => {
            setVisibleOverlay(false);
            // TODO: Texto errores
            alert(error);
          });
      })
      .catch((error) => {
        setVisibleOverlay(false);
        // TODO: Texto errores
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
          {/* Logo de Space To Do */}
          {/* <Image source={bienvenida} style={styles.logo} />*/}
          <Text style={styles.bienvenida}>¡Empieza a organizarte!</Text>
          {/* Nombre */}
          <Input
            labelStyle={styles.inputText}
            placeholder="Nombre Completo"
            leftIcon={{ type: "font-awesome", name: "user", color: "#bbb" }}
            label="Nombre Completo"
            leftIconContainerStyle={{ marginRight: 5 }}
            autoCapitalize="words"
            onChangeText={(value) => handleChangeText("name", value)}
          />
          {/* Usuario */}
          <Input
            labelStyle={styles.inputText}
            placeholder="Usuario"
            leftIcon={{ type: "font-awesome", name: "user", color: "#bbb" }}
            label="Usuario"
            leftIconContainerStyle={{ marginRight: 5 }}
            autoCapitalize="none"
            onChangeText={(value) => handleChangeText("username", value)}
          />
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
          {/* Confirmar Contraseña */}
          <Input
            labelStyle={styles.inputText}
            ref={passwordInput2}
            placeholder="Contraseña"
            leftIcon={{ type: "font-awesome", name: "lock", color: "#bbb" }}
            label="Confirmar Contraseña"
            secureTextEntry={true}
            leftIconContainerStyle={{ marginRight: 5 }}
            rightIcon={eyeIcon}
            righttIconContainerStyle={{ marginLeft: 5 }}
            onChangeText={(value) => handleChangeText("confirmPassword", value)}
          />
          <Text style={styles.textTitle}>Género</Text>
          {/* Género */}
          <RadioForm
            radio_props={gender}
            initial={-1}
            labelHorizontal={true}
            onPress={(value) => handleChangeGender(value)}
            formHorizontal={true}
            buttonColor={"#2d3f50"}
            labelColor={"#2d3f50"}
            selectedButtonColor={"#2d3f50"}
            selectedLabelColor={"#2d3f50"}
            style={styles.radiostyle}
          />
          {/* Botón para finalizar registro */}
          <TouchableOpacity
            style={styles.button}
            onPress={() => registerUser()}
          >
            <Text style={styles.buttonText}>Registrarse</Text>
          </TouchableOpacity>
          <Overlay isVisible={visibleOverlay} overlayStyle={{ padding: 70 }}>
            <ActivityIndicator size="large" color="#9e9e9e" />
          </Overlay>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default RegistrationScreen;
