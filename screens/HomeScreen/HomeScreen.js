import React, { useState, useRef, useEffect, useLayoutEffect } from "react";
import {
  ScrollView,
  TouchableOpacity,
  Text,
  Image,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  View,
  Button,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Input, Icon, ListItem } from "react-native-elements";
import styles from "./styles";
import { firebase } from "../../firebase/config";
import uuid4 from "uuid/v4";
import * as ImagePicker from "expo-image-picker";
import * as Permissions from "expo-permissions";
import LoadScreen from "../LoadScreen/LoadScreen";
import ContentLoader, {
  FacebookLoader,
  InstagramLoader,
} from "react-native-easy-content-loader";
import ProfilePicture from "../../components/ProfilePicture";
import { Searchbar, Avatar } from "react-native-paper";
import { Appbar, DefaultTheme } from "react-native-paper";

// Pantalla de Inicio de Sesión
const HomeScreen = (props) => {
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
        <Appbar.Action icon="menu" onPress={() => props.navigation.toggleDrawer()} />
        <Appbar.Content title="Inicio" />
      </Appbar.Header>
    );
  };

  const [user, setUser] = useState(null);

  useLayoutEffect(() => {
    props.navigation.setOptions({
      header: () => <CustomHeader />,
    });
  }, [props.navigation]);

  const getUserByID = async (id) => {
    const dbRef = firebase.firestore().collection("users").doc(id);
    const doc = await dbRef.get();
    const resul = doc.data();
    setUser(resul);
    setLoading(false)
  };

  useEffect(() => {
    getUserByID(props.userID)
  }, []);

  
  const [loading, setLoading] = useState(true);

  return (
    <SafeAreaView style={styles.areaview}>
      <ContentLoader
        active
        loading={loading}
        avatarStyles={{ display: "none" }}
        listSize={5}
        tHeight={20}
        tWidth={150}
        sTWidth={200}
      >
        <KeyboardAvoidingView
          enabled
          behavior={Platform.OS === "ios" ? "padding" : null}
          style={styles.keyboardstyle}
          keyboardVerticalOffset="100"
        >
          <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.shadow}>
              <Text style={styles.messageStyle}>Miguel....</Text>
            </View>

            <View
              style={{
                borderBottomColor: "#bbb",
                borderBottomWidth: 1,
              }}
            />
            <View>{/* TODO: AGREGAR LA LISTA DE TAREAS POR CULMINAR */}</View>
          </ScrollView>
        </KeyboardAvoidingView>
      </ContentLoader>
    </SafeAreaView>
  );
};

export default HomeScreen;
