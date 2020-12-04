import React, { useState, useEffect } from "react";
import { ActivityIndicator, View, Text } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import LoginScreen from "./screens/LoginScreen/LoginScreen";
import RegistrationScreen from "./screens/RegistrationScreen/RegistrationScreen";
import HomeScreen from "./screens/HomeScreen/HomeScreen";
import { firebase } from "./firebase/config";

// Stack Navigator que permite la navegación entre pantallas
const Stack = createStackNavigator();

export default function App() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const usersRef = firebase.firestore().collection("users");
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        usersRef
          .doc(user.uid)
          .get()
          .then((document) => {
            const userData = document.data();
            setLoading(false);
            setUser(userData);
          })
          .catch((error) => {
            setLoading(false);
          });
      } else {
        setLoading(false);
      }
    });
  }, []);

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <ActivityIndicator size="large" color="#9e9e9e" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {user ? (
          <Stack.Screen
            name="Inicio"
            options={{
              title: "Inicio",
              headerTitleStyle: { color: "#2d3f50" },
            }}
          >
            {(props) => <HomeScreen {...props} extraData={user} />}
          </Stack.Screen>
        ) : (
          <>
            {/* Pantalla de Inicio de Sesión */}
            <Stack.Screen
              name="Iniciar Sesión"
              component={LoginScreen}
              options={{
                title: "Iniciar Sesión",
                headerTitleStyle: { color: "#2d3f50" },
              }}
            />
            {/* Pantalla de Registro */}
            <Stack.Screen
              name="Registrarse"
              component={RegistrationScreen}
              options={{
                title: "Registrarse",
                headerTitleStyle: { color: "#2d3f50" },
              }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
