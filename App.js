import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";

// Stack Navigator que permite la navegación entre pantallas
const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        {/* Pantalla de Inicio de Sesión */}
        <Stack.Screen
          name="RegisterScreen"
          component={RegisterScreen}
          options={{
            title: "Iniciar Sesión",
            headerTitleStyle: { color: "#2d3f50" },
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
