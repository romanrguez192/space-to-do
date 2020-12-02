import React, { useState, useRef, useEffect } from "react";
import {
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Text,
  Image,
  Dimensions,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  View,
  TouchableHighlight,
  ToastAndroid,
} from "react-native";
import { Input, Icon } from "react-native-elements";
import { color, Value } from "react-native-reanimated";
import RadioForm, {
    RadioButton, 
    RadioButtonInput, 
    RadioButtonLabel
  } from 'react-native-simple-radio-button';

// Pantalla de Registro
const RegisterScreen = () => {
  const [visiblePassword, setVisiblePassword] = useState(false);
  const passwordInput = useRef(null);
  const passwordInput2 = useRef(null);

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

  // variables
  var genero = [
    {label: "Masculino", value: 0},
    {label: "Femenino", value: 1},
  ];

  const [eyeIcon, setEyeIcon] = useState(createEyeIcon("eye-slash"));

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


  return (
   <SafeAreaView style={styles.areaview}>
     <KeyboardAvoidingView
      enabled behavior={Platform.OS === 'ios' ? 'padding' : null}
      style = {styles.keyboardstyle}
      keyboardVerticalOffset = '100'
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
          autoCapitalize="none"
        />
        {/* Usuario */}
        <Input
          labelStyle={styles.inputText}
          placeholder="Usuario"
          leftIcon={{ type: "font-awesome", name: "user", color: "#bbb" }}
          label="Usuario"
          leftIconContainerStyle={{ marginRight: 5 }}
          autoCapitalize="none"
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
        {/* Confirmar Contraseña */}
        <Input
          labelStyle={styles.inputText}
          ref={passwordInput2}
          placeholder="Confirmar Contraseña"
          leftIcon={{ type: "font-awesome", name: "lock", color: "#bbb" }}
          label="Confirmar Contraseña"
          secureTextEntry={true}
          leftIconContainerStyle={{ marginRight: 5 }}
          rightIcon={eyeIcon}
          righttIconContainerStyle={{ marginLeft: 5 }}
        />        
        <Text style={styles.textTitle}>Género</Text>
        {/* Genero */}
        <RadioForm
            radio_props={genero}
            initial={-1}
            labelHorizontal={false}
            onPress={(value) => {}}
            formHorizontal={true}
            buttonColor = {'#2f81b7'}
            labelColor = {'#2d3f50'}
            selectedButtonColor={'#3b99d8'}
            selectedLabelColor={'#2d3f50'}
            style = {styles.radiostyle}
        />
        {/* Botón para finalizar registro */}
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Registrarse</Text>
        </TouchableOpacity>
      </ScrollView>
      </KeyboardAvoidingView>
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

  keyboardstyle: {
    flexGrow: 1,
  },

  textTitle: {
    fontWeight: 'bold',
    color: "#2d3f50",
    fontSize: 16,
    marginBottom: 10,
  },

  bienvenida: {
    color: "#2d3f50",
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    marginTop: 20,
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
    marginBottom: 20,
  },

  button2: {
    backgroundColor: "pink",
    marginTop: 20,
    paddingHorizontal: 30,
    paddingVertical: 30,
    borderRadius: 5,
  },

  buttonText: {
    fontSize: 20,
    color: "#fff",
  },
  logo: {
    width: windowWidth * 0.6,
    height: windowHeight * 0.4,
    resizeMode: "contain",
  },
});

export default RegisterScreen;
