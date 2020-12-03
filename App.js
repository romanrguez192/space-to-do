import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import LoginScreen from "./screens/LoginScreen/LoginScreen";
import RegistrationScreen from "./screens/RegistrationScreen/RegistrationScreen";

// Stack Navigator que permite la navegación entre pantallas
const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
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
      </Stack.Navigator>
    </NavigationContainer>
  );
}
