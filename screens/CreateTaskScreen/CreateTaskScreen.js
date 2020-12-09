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
  });
  
  const [date, setDate] = useState(new Date());
  const [mode, setMode] = useState("date");
  const [show, setShow] = useState(false);

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === "ios");
    setDate(currentDate);
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

  props.navigation.setOptions({
    header: () => <CustomHeader />,
  });

  const handleChangeText = (name, value) => {
    setTask({ ...task, [name]: value });
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
              labelStyle={{marginTop: 20, color: "#2d3f50"}}
              label="Título"
              onChangeText={(value) => handleChangeText("title", value)}
            />
            <Input
              labelStyle={{color: "#2d3f50"}}
              label="Descripción"
              onChangeText={(value) => handleChangeText("description", value)}
              multiline={true}
            />
          </View>
          <Text>{date.toString()}</Text>
          <Button onPress={showDatepicker} title="Show date picker!" />

          <Button onPress={showTimepicker} title="Show time picker!" />

          {show && (
            <DateTimePicker
              value={date}
              style={styles.pickerStyle}
              mode={mode}
              is24Hour={true}
              display="default"
              onChange={onChange}
            />
          )}
          <TouchableOpacity
            style={{
              ...styles.button,
              backgroundColor: props.route.params.list.theme,
            }}
          >
            <Text style={styles.buttonText}>Crear Tarea</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default CreateTaskScreen;
