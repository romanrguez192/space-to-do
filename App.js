import React, { useState, useEffect } from "react";
import { ActivityIndicator, View, Text, Button, Alert } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createDrawerNavigator } from "@react-navigation/drawer";
import {
  LoginScreen,
  HomeScreen,
  RegistrationScreen,
  ListsScreen,
  LoadScreen,
  TasksScreen,
  CalendarScreen,
  UserScreen,
  CreateTaskScreen,
} from "./screens";
import { firebase } from "./firebase/config";
import Sidebar from "./SideBar/SideBar";

// Drawer Navigator que permite la navegación con un menú desplegable
const Drawer = createDrawerNavigator();

// Stack Navigator que permite la navegación entre pantallas
const Stack = createStackNavigator();

// TODO: General, recordar colocar todos los catch con alertas de errores

export default function App() {
  const [loading, setLoading] = useState(true);
  const [userID, setUserID] = useState("");

  useEffect(() => {
    connect();
  }, []);

  const connect = async () => {
    const usersRef = firebase.firestore().collection("users");
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        usersRef
          .doc(user.uid)
          .get()
          .then(async (document) => {
            setUserID(document.id);
            setLoading(false);
          })
          .catch((error) => {
            Alert.alert(
              "Error de conexión",
              "Se produjo un error al establecer la conexión, ¿deseas volverlo a intentar?",
              [{ text: "Sí", onPress: () => connect() }, { text: "No" }]
            );
          });
      } else {
        setUserID("");
        setLoading(false);
      }
    });
  };

  if (loading) {
    return <LoadScreen />;
  }
  
  const TasksStack = (props) => {
    return (
      <Stack.Navigator>
        <Stack.Screen name="Tareas" options={{ headerShown: false }}>
          {(propsStack) => <TasksScreen {...propsStack} list={props.route.params.list} />}
        </Stack.Screen>
        <Stack.Screen
          name="Crear Tarea"
          component={CreateTaskScreen}
          options={{ headerShown: true }}
        />
      </Stack.Navigator>
    )
  }

  const DrawerNavigator = () => {
    return (
      <Drawer.Navigator
        initialRouteName="Inicio"
        drawerContent={(props) => <Sidebar {...props} userID={userID} />}
      >
        <Drawer.Screen name="Inicio" options={{ headerShown: true }}>
          {(props) => <HomeScreen {...props} userID={userID} />}
        </Drawer.Screen>
        <Drawer.Screen
          name="Mis Listas"
          component={ListsScreen}
          options={{ headerShown: false }}
          userID={userID}
        />
        <Drawer.Screen
          name="Tareas"
          component={TasksStack}
          options={{ headerShown: false }}
        />
        <Drawer.Screen
          name="Calendario"
          component={CalendarScreen}
          options={{ headerShown: false }}
          userID={userID}
        />
        <Drawer.Screen name="Perfil" options={{ headerShown: true }}>
          {(props) => <UserScreen {...props} userID={userID} />}
        </Drawer.Screen>
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
            <Stack.Screen name="Iniciar Sesión" component={LoginScreen} />
            {/* Pantalla de Registro */}
            <Stack.Screen name="Registrarse" component={RegistrationScreen} />
          </Stack.Navigator>
        </>
      )}
    </NavigationContainer>
  );
}
