import React, { useState, useRef, useEffect } from "react";
import { View } from "react-native";
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

function Sidebar({ ...props }) {
  const [user, setUser] = useState(null);
  const [image, setImage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getUserByID(props.userID);
  }, []);

  const getUserByID = async (id) => {
    const dbRef = firebase.firestore().collection("users").doc(id);
    const doc = await dbRef.get();
    const resul = doc.data();
    setUser(resul);
    getImageByID(resul.imageID);
  };

  const getImageByID = async (id) => {
    if (id !== "") {
      firebase
        .storage()
        .ref(`images/${id}.jpg`)
        .getDownloadURL()
        .then((resolve) => {
          setImage({ uri: resolve });
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      setImage({ uri: "" });
    }
    setLoading(false);
  };

  const singout = () => {
    firebase
      .auth()
      .signOut()
      .then(() => {
        // Sign-out successful.
        alert("Saliste de tu cuenta");
      })
      .catch((error) => {
        // An error happened.
        alert(error);
      });
  };

  if (loading) {
    return <LoadScreen />;
  }

  return (
    <View style={{ flex: 1 }}>
      <DrawerContentScrollView {...props}>
        <View>
          <View style={styles.userInfoSection}>
            <View style={{ flexDirection: "row", marginTop: 15 }}>
              <ProfilePicture user={user} image={image} />
              <View style={{ marginLeft: 10 }}>
                <Title style={styles.title}>{user.name}</Title>
                <Caption style={styles.caption}>{user.username}</Caption>
              </View>
            </View>

            <Drawer.Section style={styles.drawerSection}>
              <DrawerItem
                icon={({ color, size }) => (
                  <Icon type="font-awesome" name="home" color="#3b99d8" />
                )}
                label="Inicio"
                labelStyle={{ fontSize: 20, color: "#2d3f50" }}
                onPress={() => props.navigation.navigate("Nombre del Home")}
              />
              <DrawerItem
                icon={({ color, size }) => (
                  <Icon type="font-awesome" name="tasks" color="#3b99d8" />
                )}
                label="Mis Listas"
                labelStyle={{ fontSize: 20, color: "#2d3f50" }}
                onPress={() => props.navigation.navigate("Mis Listas", {userID: props.userID})}
              />
              <DrawerItem
                icon={({ color, size }) => (
                  <Icon type="font-awesome" name="star" color="#3b99d8" />
                )}
                label="Importantes"
                labelStyle={{ fontSize: 20, color: "#2d3f50" }}
                /* onPress={} */
              />
              <DrawerItem
                icon={({ color, size }) => (
                  <Icon type="font-awesome" name="search" color="#3b99d8" />
                )}
                label="Buscar"
                labelStyle={{ fontSize: 20, color: "#2d3f50" }}
                /* onPress={} */
              />
              <DrawerItem
                icon={({ color, size }) => (
                  <Icon type="font-awesome" name="cog" color="#3b99d8" />
                )}
                label="Ajustes"
                labelStyle={{ fontSize: 20, color: "#2d3f50" }}
                /* onPress={} */
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
          labelStyle={{ fontSize: 20, color: "#2d3f50" }}
          onPress={() => singout()}
        />
      </Drawer.Section>
    </View>
  );
}
export default Sidebar;
