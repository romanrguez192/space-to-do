import styles from "./styles";
import { firebase } from "../../firebase/config";
import ContentLoader, {
  FacebookLoader,
  InstagramLoader,
} from "react-native-easy-content-loader";
import {
  Appbar,
  DefaultTheme,
  List,
  IconButton,
  Divider,
  Menu,
} from "react-native-paper";
import React, {
  useState,
  useRef,
  useEffect,
  useLayoutEffect,
  useCallback,
} from "react";
import {
  Text,
  FlatList,
  View,
  TouchableOpacity,
  ScrollView,
  Alert,
  SafeAreaView,
  KeyboardAvoidingView,
  StyleSheet,
  Image,
  Dimensions,
} from "react-native";
import { Input, Icon, ListItem, Avatar, Overlay } from "react-native-elements";
import { useFocusEffect } from "@react-navigation/native";
import * as Animatable from "react-native-animatable";
import Collapsible from "react-native-collapsible";
import Accordion from "react-native-collapsible/Accordion";
import { CheckBox } from 'react-native-elements'

const TasksScreen = (props) => {
  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState(null);
  const [visibleMenu, setVisibleMenu] = useState(false);
  const [showCompleted, setShowCompleted] = useState(true);

  const theme = {
    ...DefaultTheme,
    roundness: 2,
    colors: {
      ...DefaultTheme.colors,
      primary: props.list.theme,
    },
  };

  const CustomHeader = () => {
    return (
      <Appbar.Header theme={theme}>
        <Appbar.BackAction
          onPress={() => props.navigation.navigate("Mis Listas")}
        />
        <Appbar.Content title={props.list.name} />
        <Appbar.Action
          icon="plus"
          onPress={() =>
            props.navigation.push("Crear Tarea", { list: props.list })
          }
        />
        <Appbar.Action icon="dots-vertical" onPress={openMenu} />
      </Appbar.Header>
    );
  };

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      const unsubscribe = getTasks(props.list.id);
      return () => {
        setLoading(true);
        unsubscribe();
      };
    }, [props.list.id])
  );

  const changeOrder = (ord) => {
    closeMenu();

    if (!tasks) return;

    var sortFunction;

    if (ord == "asc") {
      sortFunction = (a, b) => {
        if (a.limit < b.limit) {
          return -1;
        }
        if (a.limit > b.limit) {
          return 1;
        }
        // a debe ser igual b
        return 0;
      };
    } else if (ord == "desc") {
      sortFunction = (a, b) => {
        if (a.limit > b.limit) {
          return -1;
        }
        if (a.limit < b.limit) {
          return 1;
        }
        // a debe ser igual b
        return 0;
      };
    } else if (ord == "alpha") {
      sortFunction = (a, b) => {
        if (a.title.toUpperCase() < b.title.toUpperCase()) {
          return -1;
        }
        if (a.title.toUpperCase() > b.title.toUpperCase()) {
          return 1;
        }
        // a debe ser igual b
        return 0;
      };
    }

    tasks.sort(sortFunction);
  };

  const getTasks = () => {
    const tasksRef = firebase.default.firestore().collection("tasks");
    return tasksRef
      .where("listID", "==", props.list.id)
      .orderBy("limit", "asc")
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

  //Elimina una tarea a partir de su id
  const deleteTask = (taskID) => {
    const taskRef = firebase.firestore().collection("tasks").doc(taskID);
    taskRef.delete().catch(() => {
      Alert.alert(
        "Hubo un error al intentar eliminar su tarea, revise su conexión a internet."
      );
    });
  };

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

  const openMenu = () => setVisibleMenu(true);

  const closeMenu = () => setVisibleMenu(false);

  const renderList = (items) => {
    return (
      <List.Section title="Tareas" titleStyle={{color: "black"}}>
        {items.map((item) => {
          if (showCompleted || !item.done) {
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
                  <CheckBox
                    checked={item.done}
                    uncheckedColor={props.list.theme}
                    onPress={() => setDone(item)}
                    checkedColor={props.list.theme}
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
                    theme={theme}
                  >
                    <TouchableOpacity activeOpacity={0.7} /*onLongPress={}*/>
                      <List.Item
                        style={{ paddingTop: 0 }}
                        description={item.description}
                        descriptionStyle={
                          item.done
                            ? { textDecorationLine: "line-through", color: '#57606f'}
                            : {color: "#57606f"}
                          
                        }
                        titleStyle={{ display: "none"}}
                      />
                    </TouchableOpacity>
                  </List.Accordion>
                  <View
                        style={{
                          borderBottomWidth: 1,
                          borderBottomColor: '#bbb',
                          marginLeft: 10,
                          marginRight: 10,
                        }}
                    />
                </View>
              </View>
            );
          }
        })}
      </List.Section>
    );
  };

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

  const onPressShowCompleted = () => {
    closeMenu();
    setShowCompleted(!showCompleted);
  };

  return (
    <>
      <CustomHeader />
      <Menu
        visible={visibleMenu}
        onDismiss={closeMenu}
        anchor={{ x: Dimensions.get("window").width, y: 60 }}
      >
        <Menu.Item
          onPress={() => onPressShowCompleted()}
          title={(showCompleted ? "Ocultar" : "Mostrar") + " completadas"}
        />
        <Divider />
        <Menu.Item
          icon="alphabetical"
          onPress={() => changeOrder("alpha")}
          title="Ordenar alfabéticamente"
          titleStyle={{left:-20}}
        />
        <Menu.Item
          icon="arrow-up"
          onPress={() => changeOrder("asc")}
          title="Ordenar ascendente"
          titleStyle={{left:-20}}
        />
        <Menu.Item
          icon="arrow-down"
          onPress={() => changeOrder("desc")}
          title="Ordenar descendente"
          titleStyle={{left:-20}}
        />
      </Menu>
      <ScrollView>
        <SafeAreaView style={styles.areaview}>
          {tasks ? (
            renderList(tasks)
          ) : (
            <Image
              source={require("../../assets/fondotareas.png")}
              style={styles.fondo}
            />
          )}
        </SafeAreaView>
      </ScrollView>
    </>
  );
};

export default TasksScreen;
