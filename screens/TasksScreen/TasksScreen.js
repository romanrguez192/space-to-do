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
} from "react-native";
import { Input, Icon, ListItem, Avatar, Overlay } from "react-native-elements";

const TasksScreen = (props) => {
  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState(null);

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
          onPress={() => props.navigation.navigate("Mis Listas")}
        />
        <Appbar.Content title={props.route.params.list.name} />
        <Appbar.Action
          icon="plus"
          onPress={() => props.navigation.navigate("Crear Tarea", {list: props.route.params.list})}
        />
        <Appbar.Action icon="dots-vertical" />
      </Appbar.Header>
    );
  };

  useEffect(() => {
    getTasks(props.route.params.list.id);
  }, []);

  const getTasks = () => {
    const tasksRef = firebase.firestore().collection("tasks");
    tasksRef
      .where("listID", "==", props.route.params.list.id)
      //.orderBy("createdAt", "desc")
      .onSnapshot((snapshot) => {
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setTasks(data);
        setLoading(false);
      });

    if (loading) {
      return (
        <View>
          <CustomHeader />
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
  };

  const taskss = [
    {
      id: "a",
      title: "Esto de aquí",
      description: "Lo otro"
    },
    {
      id: "b",
      title: "Tarea de aquí",
      description: "Lo otro"
    },
    {
      id: "c",
      title: "Mar de aquí",
      description: "Lo otro"
    },
  ]

  const renderList = ({ item }) => {
    return (
      <View style={styles.shadow}>
        <View style={{ flexDirection: "row" }}>
          <TouchableOpacity style={styles.buttonList}>
            <Icon
              flexDirection="row"
              type="font-awesome"
              name="thumb-tack"
              color={props.route.params.list.theme}
            />
            <Text numberOfLines={1} style={styles.nameList}>
              {item.title}
            </Text>
          </TouchableOpacity>
          <View style={{ justifyContent: "flex-end", flex: 1 }}>
            <Checkbox.Item status="indeterminate" style={{ right: 10 }} />
          </View>
        </View>
      </View>
    );
  };

  return (
    <View>
      <CustomHeader />
      <SafeAreaView style={styles.areaview}>
        <FlatList
          data={tasks}
          renderItem={renderList}
          keyExtractor={(item) => item.id}
        />

        {/* <ScrollView contentContainerStyle={{ color: "#fff" }}>
          <View style={styles.container}>
            <View style={styles.shadow}>
              <View style={{ flexDirection: "row" }}>
                <TouchableOpacity style={styles.buttonList}>
                  <Icon
                    flexDirection="row"
                    type="font-awesome"
                    name="thumb-tack"
                    color="#3b99d8"
                  />
                  <Text numberOfLines={1} style={styles.nameList}>
                    Tarea
                  </Text>
                </TouchableOpacity>
                <View style={{ justifyContent: "flex-end", flex: 1 }}>
                  <Checkbox.Item status="indeterminate" style={{ right: 10 }} />
                </View>
              </View>
            </View>
            <View style={styles.shadow}>
              <View style={{ flexDirection: "row" }}>
                <TouchableOpacity style={styles.buttonList}>
                  <Icon
                    flexDirection="row"
                    type="font-awesome"
                    name="thumb-tack"
                    color="#3b99d8"
                  />
                  <Text numberOfLines={1} style={styles.nameList}>
                    Otra tarea cualquiera
                  </Text>
                </TouchableOpacity>
                <View style={{ justifyContent: "flex-end", flex: 1 }}>
                  <Checkbox.Item status="indeterminate" style={{ right: 10 }} />
                </View>
              </View>
            </View>
            <View style={styles.shadow}>
              <View style={{ flexDirection: "row" }}>
                <TouchableOpacity style={styles.buttonList}>
                  <Icon
                    flexDirection="row"
                    type="font-awesome"
                    name="thumb-tack"
                    color="#3b99d8"
                  />
                  <Text numberOfLines={1} style={styles.nameList}>
                    FUNCIONOAAAAAAAAAAA
                  </Text>
                </TouchableOpacity>
                <View style={{ justifyContent: "flex-end", flex: 1 }}>
                  <Checkbox.Item status="indeterminate" style={{ right: 10 }} />
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
  */}
      </SafeAreaView>
    </View>
  );
};

export default TasksScreen;
