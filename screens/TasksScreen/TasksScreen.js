import styles from "./styles";
import { firebase } from "../../firebase/config";
import ContentLoader, {
  FacebookLoader,
  InstagramLoader,
} from "react-native-easy-content-loader";
import { Appbar, DefaultTheme, Checkbox } from "react-native-paper";
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
} from "react-native";
import { Input, Icon, ListItem, Avatar, Overlay } from "react-native-elements";
import { useFocusEffect } from "@react-navigation/native";

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
            primary: props.list.theme,
          },
        }}
      >
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
        <Appbar.Action icon="dots-vertical" />
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

  const getTasks = () => {
    const tasksRef = firebase.firestore().collection("tasks");
    return (
      tasksRef
        .where("listID", "==", props.list.id)
        //.orderBy("createdAt", "desc")
        .onSnapshot((snapshot) => {
          const data = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setTasks(data);
          setLoading(false);
        })
    );
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

  const renderList = ({ item }) => {
    return (
      <View style={styles.shadow}>
        <View style={{ flexDirection: "row" }}>
          <TouchableOpacity style={styles.buttonList}>
            <Icon
              flexDirection="row"
              type="font-awesome"
              name="thumb-tack"
              color={props.list.theme}
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

  return (
    <View>
      <CustomHeader />
      <SafeAreaView style={styles.areaview}>
        <FlatList
          data={tasks}
          renderItem={renderList}
          keyExtractor={(item) => item.id}
        />
      </SafeAreaView>
    </View>
  );
};

export default TasksScreen;
