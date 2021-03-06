import React, { useState, useRef, useEffect } from "react";
import { View, TouchableOpacity, Alert } from "react-native";
import styles from "./styles";
import {
  Avatar,
  Title,
  Caption,
  Paragraph,
  Drawer,
  Text,
  TouchableRipple,
  Switch,
  Button,
} from "react-native-paper";
import { Icon } from "react-native-elements";
import { firebase } from "../firebase/config";
import { DrawerContentScrollView, DrawerItem } from "@react-navigation/drawer";
import ProfilePicture from "../components/ProfilePicture";
import { LoadScreen } from "../screens";
import "../global";

function Sidebar({ ...props }) {
  const [user, setUser] = useState({
    name: "",
    email: "",
    gender: "",
    imageID: "",
    username: "",
    avatarColor: "",
    id: "",
  });
  const [loading, setLoading] = useState(true);

  const getUserByID = async (id) => {
    const dbRef = firebase.firestore().collection("users").doc(id);
    const doc = await dbRef.get();
    const resul = doc.data();
    setUser(resul);
    global.name = resul.name;
    getImageByID(resul.imageID);
    setLoading(false);
  };

  const getImageByID = async (id) => {
    if (id !== "") {
      firebase
        .storage()
        .ref(`images/${id}.jpg`)
        .getDownloadURL()
        .then((resolve) => {
          global.image = resolve;
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      global.image = "";
    }
    setLoading(false);
  };

  useEffect(() => {
    getUserByID(props.userID);
  }, []);

  const singout = () => {
    Alert.alert("Cerrar Sesión", "¿Estás seguro de que deseas cerrar sesión?", [
      { text: "No" },
      {
        text: "Sí",
        onPress: () => {
          firebase
            .auth()
            .signOut()
            .then(() => {
              // Sign-out successful.
            })
            .catch((error) => {
              // An error happened.
              alert(error);
            });
        },
      },
    ]);
  };

  if (loading) {
    return <LoadScreen />;
  }

  return (
    <View style={{ flex: 1 }}>
      <DrawerContentScrollView {...props}>
        <View>
          <View style={styles.userInfoSection}>
            <TouchableOpacity
              onPress={() =>
                props.navigation.navigate("Perfil", { userID: props.userID })
              }
              style={{ flexDirection: "row", marginTop: 15 }}
            >
              <ProfilePicture
                style={{ zIndex: 1 }}
                name={global.name}
                color={user.avatarColor}
                image={global.image}
              />
              <View style={{ marginLeft: 10 }}>
                <Title style={styles.title}>{global.name}</Title>
                <Caption style={styles.caption}>@{user.username}</Caption>
              </View>
            </TouchableOpacity>

            <Drawer.Section style={styles.drawerSection}>
              <DrawerItem
                icon={({ color, size }) => (
                  <Icon type="font-awesome" name="home" color="#2d3f50" />
                )}
                label="Inicio"
                labelStyle={{ fontSize: 17, color: "#2d3f50" }}
                onPress={() => props.navigation.navigate("Inicio")}
              />
              <DrawerItem
                icon={({ color, size }) => (
                  <Icon type="font-awesome" name="tasks" color="#2d3f50" />
                )}
                label="Mis Listas"
                labelStyle={{ fontSize: 17, color: "#2d3f50" }}
                onPress={() =>
                  props.navigation.navigate("Mis Listas", {
                    userID: props.userID,
                  })
                }
              />
              <DrawerItem
                icon={({ color, size }) => (
                  <Icon type="font-awesome" name="calendar" color="#2d3f50" />
                )}
                label="Calendario"
                labelStyle={{ fontSize: 17, color: "#2d3f50" }}
                onPress={() =>
                  props.navigation.navigate("Calendario", {
                    userID: props.userID,
                  })
                }
              />
            </Drawer.Section>
          </View>
        </View>
      </DrawerContentScrollView>
      <Drawer.Section style={styles.bottomDrawerSection}>
        <DrawerItem
          icon={({ color, size }) => (
            <Icon type="font-awesome" name="sign-out" color="#e54e42" />
          )}
          label="Salir"
          labelStyle={{ fontSize: 17, color: "#2d3f50" }}
          onPress={() => singout()}
        />
      </Drawer.Section>
    </View>
  );
}
export default Sidebar;
