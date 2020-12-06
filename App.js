import React, { useState, useEffect } from "react";
import { ActivityIndicator, View, Text, Button } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createDrawerNavigator } from "@react-navigation/drawer";
import {
  LoginScreen,
  HomeScreen,
  RegistrationScreen,
  ListsScreen,
  LoadScreen
} from "./screens";
import { firebase } from "./firebase/config";
import  Sidebar  from "./SideBar/SideBar";

// Drawer Navigator que permite la navegación con un menú desplegable
const Drawer = createDrawerNavigator();

// Stack Navigator que permite la navegación entre pantallas
const Stack = createStackNavigator();

export default function App() {
  const [loading, setLoading] = useState(true);
  const [userID, setUserID] = useState("");

  useEffect(() => {
    const usersRef = firebase.firestore().collection("users");
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        usersRef
          .doc(user.uid)
          .get()
          .then((document) => {
            setUserID(document.id);
            setLoading(false);
          })
          .catch((error) => {
            alert(error);
            setLoading(false);
          });
      } else {
        setUserID("");
        setLoading(false);
      }
    });
  }, []);

  if (loading) {
    return <LoadScreen/>
  }

  const DrawerNavigator = () => {
    return (
    <Drawer.Navigator initialRouteName="Nombre del Home" drawerContent={props => <Sidebar {...props}/>}>
        <Drawer.Screen name="Nombre del Home" options={{headerShown: true}}>
          {(props) => <HomeScreen {...props} extraData={userID} />}
        </Drawer.Screen>
        <Drawer.Screen name="Listas de Tareas" component={ListsScreen} options={{headerShown: true}}/>
      </Drawer.Navigator>
    );
  };

  return (
    <NavigationContainer>
      {userID ? (
        <DrawerNavigator />
      ) : (
        <>
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
        </>
      )}
    </NavigationContainer>
  );
}
