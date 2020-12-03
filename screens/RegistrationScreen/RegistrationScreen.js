import React, { useState, useRef, useEffect } from "react";
import {
  ScrollView,
  TouchableOpacity,
  Text,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  View,
} from "react-native";
import { Input, Icon, Overlay } from "react-native-elements";
import RadioForm from "react-native-simple-radio-button";
import styles from "./styles";
import { firebase } from "../../firebase/config";

// Pantalla de Registro
const RegistrationScreen = () => {
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

    if (values.some((value) => value === "")) {
      // TODO: Cambiar alerta
      alert("Debe llenar todos los campos.");
      return;
    }

    if (user.password !== user.confirmPassword) {
      // TODO: Cambiar alerta
      alert("Las contraseñas deben coincidir");
      return;
    }

    const usersRef = firebase.firestore().collection("users");
    let validUsername = true;
    setVisibleOverlay(true);

    await usersRef.get().then((snapshot) => {
      if (snapshot.docs.some((doc) => doc.data().username === user.username)) {
        validUsername = false;
      }
    });

    if (!validUsername) {
      setVisibleOverlay(false);
      // TODO: Cambiar alerta
      alert("Nombre de usuario no disponible");
      return;
    }

    firebase
      .auth()
      .createUserWithEmailAndPassword(user.email, user.password)
      .then((response) => {
        const uid = response.user.uid;
        const data = {
          id: uid,
          name: user.name,
          username: user.username,
          email: user.email,
          gender: user.gender,
        };
        usersRef
          .doc(uid)
          .set(data)
          .then(() => {
            setVisibleOverlay(false);
            // TODO: Cambiar alerta y redirigir
            alert("Usuario creado");
          })
          .catch((error) => {
            // TODO: Texto errores
            alert(error);
          });
      })
      .catch((error) => {
        // TODO: Texto errores
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

          <Overlay isVisible={visibleOverlay} overlayStyle={{ padding: 60 }}>
            <ActivityIndicator size="large" color="#9e9e9e" />
          </Overlay>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default RegistrationScreen;
