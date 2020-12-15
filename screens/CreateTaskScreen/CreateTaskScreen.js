import styles from "./styles";
import { firebase } from "../../firebase/config";
import ContentLoader, {
  FacebookLoader,
  InstagramLoader,
} from "react-native-easy-content-loader";
import { Appbar, DefaultTheme, Checkbox } from "react-native-paper";
import React, { useState, useRef, useEffect, useLayoutEffect } from "react";
import {
  Text,
  FlatList,
  View,
  TouchableOpacity,
  ScrollView,
  Alert,
  SafeAreaView,
  KeyboardAvoidingView,
  Button,
} from "react-native";
import { Input, Icon, ListItem, Avatar, Overlay } from "react-native-elements";
import DateTimePicker from "@react-native-community/datetimepicker";

const CreateTaskScreen = (props) => {
  const [task, setTask] = useState({
    title: "",
    description: "",
    limit: new Date(),
  });

  const [mode, setMode] = useState("date");
  const [show, setShow] = useState(false);

  useLayoutEffect(() => {
    props.navigation.setOptions({
      header: () => <CustomHeader />,
    });
  }, [props.navigation]);

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || task.limit;
    setShow(Platform.OS === "ios");
    setTask({ ...task, limit: currentDate });
  };

  const showMode = (currentMode) => {
    setShow(true);
    setMode(currentMode);
  };

  const showDatepicker = () => {
    showMode("date");
  };

  const showTimepicker = () => {
    showMode("time");
  };

  const CustomHeader = () => {
    return (
      <Appbar.Header
        theme={{
          ...DefaultTheme,
          roundness: 2,
          colors: {
            ...DefaultTheme.colors,
            primary: props.route.params.list.theme,
          },
        }}
      >
        <Appbar.BackAction
          onPress={() =>
            props.navigation.navigate("Tareas", {
              list: props.route.params.list,
            })
          }
        />
        <Appbar.Content title="Crear Tarea" />
      </Appbar.Header>
    );
  };

  const handleChangeText = (name, value) => {
    setTask({ ...task, [name]: value });
  };

  const createTask = () => {
    if (task.title === "") {
      Alert.alert(
        "Error en la creación",
        "Ingresa un título para tu tarea, por favor."
      );
      return;
    }

    const taskRef = firebase.firestore().collection("tasks");
    taskRef
      .add({
        ...task,
        date: (new Date().getTime() / 1000).toFixed(0) ,
        limit: (task.limit.getTime() / 1000).toFixed(0),
        done: false,
        listID: props.route.params.list.id,
      })
      .then(() => {
        Alert.alert("Enhorabuena", "Tu tarea ha sido creada existosamente.");
        props.navigation.navigate("Tareas", {
          list: props.route.params.list,
        });
      })
      .catch(() => {
        Alert.alert(
          "Error en la creación",
          "No se pudo crear la tarea, revise su conexión a internet."
        );
      });
  };

  return (
    <SafeAreaView style={styles.areaview}>
      <KeyboardAvoidingView
        enabled
        behavior={Platform.OS === "ios" ? "padding" : null}
        style={styles.keyboardstyle}
        keyboardVerticalOffset="100"
      >
        <ScrollView contentContainerStyle={styles.container}>
          <View style={styles.shadow}>
            <Input
              labelStyle={{ marginTop: 20, color: "#2d3f50" }}
              label="Título"
              onChangeText={(value) => handleChangeText("title", value)}
            />
            <Input
              labelStyle={{ color: "#2d3f50" }}
              label="Descripción"
              onChangeText={(value) => handleChangeText("description", value)}
              multiline={true}
            />
          </View>

          <TouchableOpacity
            onPress={showDatepicker}
            style={{ marginBottom: 15 }}
          >
            <Text
              style={{
                color: props.route.params.list.theme,
                fontSize: 17,
                fontWeight: "bold",
              }}
            >
              Selecciona una fecha límite.
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={showTimepicker}
            style={{ marginBottom: 15 }}
          >
            <Text
              style={{
                color: props.route.params.list.theme,
                fontSize: 17,
                fontWeight: "bold",
              }}
            >
              Selecciona una hora límite.
            </Text>
          </TouchableOpacity>

          {show && (
            <DateTimePicker
              value={task.limit}
              style={styles.pickerStyle}
              mode={mode}
              display="default"
              onChange={onChange}
            />
          )}
          <TouchableOpacity
            style={{
              ...styles.button,
              backgroundColor: props.route.params.list.theme,
            }}
            onPress={() => createTask()}
          >
            <Text style={styles.buttonText}>Crear Tarea</Text>
          </TouchableOpacity>
          <Text>{`a`}</Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default CreateTaskScreen;
