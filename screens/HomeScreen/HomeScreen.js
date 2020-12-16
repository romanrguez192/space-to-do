import React, { useState, useRef, useEffect, useLayoutEffect } from "react";
import {
  ScrollView,
  TouchableOpacity,
  Text,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  View,
  Button,
  ActivityIndicator,
  Alert,
  Image,
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
import { Appbar, DefaultTheme, List, Checkbox } from "react-native-paper";

// Pantalla de Inicio de Sesión
const HomeScreen = (props) => {

  const theme = (color) => {
    return {
      ...DefaultTheme,
      roundness: 2,
      colors: {
        ...DefaultTheme.colors,
        primary: color,
      },
    }
  }

  const CustomHeader = () => {
    return (
      <Appbar.Header
        theme={theme("#e54e42")}
      >
        <Appbar.Action
          icon="menu"
          onPress={() => props.navigation.toggleDrawer()}
        />
        <Appbar.Content title="Inicio" />
      </Appbar.Header>
    );
  };

  const [user, setUser] = useState(null);
  const [tasks, setTasks] = useState(null);

  useLayoutEffect(() => {
    props.navigation.setOptions({
      header: () => <CustomHeader />,
    });
  }, [props.navigation]);

  const getData = async (id) => {
    const dbRef = firebase.firestore().collection("users").doc(id);
    const doc = await dbRef.get();
    const resul = doc.data();
    setUser(resul);
    getTasks();
  };

  const getTasks = () => {
    const tasksRef = firebase.firestore().collection("tasks");
    tasksRef
      .where("userID", "==", props.userID)
      .orderBy("limit", "asc")
      .limit(10)
      .onSnapshot((snapshot) => {
        const data = [];
        snapshot.docs.forEach((doc) => {
          data.push({
            id: doc.id,
            ...doc.data(),
          });
        });
        if (data.length === 0) setTasks(null);
        else setTasks(data);
        setLoading(false);
      });
  };

  useEffect(() => {
    getData(props.userID);
  }, []);

  const setDone = async (item) => {
    const dbRef = firebase.default.firestore().collection("tasks").doc(item.id);
    await dbRef
      .set({
        ...item,
        done: !item.done,
      })
      .then(async () => {
        const listsRef = firebase.default
          .firestore()
          .collection("lists")
          .doc(item.listID);
        await listsRef.update({
          count: firebase.firestore.FieldValue.increment(item.done ? 1 : -1),
        });
      });
  };

  const getDateFromString = (limit) => {
    const resul = new Date(limit * 1000);

    const getTime = (date) => {
      let hours = date.getHours() % 12;
      let minutes = date.getMinutes();

      hours = hours ? hours : 12;
      minutes = minutes < 10 ? "0" + minutes : minutes;

      return hours + ":" + minutes + " " + (date.getHours() < 12 ? "AM" : "PM");
    };

    return (
      resul.getDate() +
      "/" +
      (resul.getMonth() + 1) +
      "/" +
      resul.getFullYear() +
      " " +
      getTime(resul)
    );
  };

  const renderList = (items) => {
    return (
      <List.Section title="Tareas por culminar">
        {items.map((item) => {
          return (
            <View key={item.id} style={{ flex: 1, flexDirection: "row" }}>
              <View
                style={{
                  flex: 0.15,
                  alignItems: "center",
                  padding: 0,
                  margin: 0,
                }}
              >
                <Checkbox.Item
                  status={item.done ? "checked" : "unchecked"}
                  onPress={() => setDone(item)}
                  color={"dodgerblue"}
                  style={{ padding: 0, margin: 0 }}
                />
              </View>
              <View style={{ flex: 0.9 }}>
                <List.Accordion
                  title={item.title}
                  description={getDateFromString(item.limit)}
                  titleStyle={
                    ({ fontWeight: "bold" },
                    item.done
                      ? { textDecorationLine: "line-through" }
                      : undefined)
                  }
                  descriptionStyle={
                    new Date(item.limit * 1000) < new Date()
                      ? { color: "red" }
                      : undefined
                  }
                  style={{ paddingBottom: 0 }}
                  theme={theme("dodgerblue")}
                >
                  <TouchableOpacity activeOpacity={0.7} /*onLongPress={}*/>
                    <List.Item
                      style={{ paddingTop: 0 }}
                      description={item.description}
                      descriptionStyle={
                        item.done
                          ? { textDecorationLine: "line-through" }
                          : undefined
                      }
                      titleStyle={{ display: "none" }}
                    />
                  </TouchableOpacity>
                </List.Accordion>
              </View>
            </View>
          );
        })}
      </List.Section>
    );
  };

  const [loading, setLoading] = useState(true);

  if (loading) {
    return (
      <View>
        <ContentLoader
          active
          loading={loading}
          avatarStyles={{ display: "none" }}
          listSize={5}
          tHeight={20}
          tWidth={150}
          sTWidth={200}
        ></ContentLoader>
      </View>
    );
  }

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
            <Text style={styles.messageStyle}>TAREAS POR CULMINAR</Text>
            {tasks ? (
              renderList(tasks)
            ) : (
              <Image
                source={require("../../assets/fondotareas.png")}
                style={styles.fondo}
              />
            )}
          </ScrollView>
        </KeyboardAvoidingView>
      </ContentLoader>
    </SafeAreaView>
  );
};

export default HomeScreen;
