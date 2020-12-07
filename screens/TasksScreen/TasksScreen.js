import React, { useState, useRef, useEffect } from "react";
import { Text, View } from "react-native";
import styles from "./styles";
import { firebase } from "../../firebase/config";
import ContentLoader, {
  FacebookLoader,
  InstagramLoader,
} from "react-native-easy-content-loader";
import { Appbar, DefaultTheme } from "react-native-paper";

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
            primary: "#e54e42",
          },
        }}
      >
        <Appbar.BackAction onPress={() => props.navigation.navigate("Mis Listas")} />
        <Appbar.Content title={props.route.params.list.name} />
        <Appbar.Action
          icon="plus"
        />
        <Appbar.Action
          icon="dots-vertical"
        />
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

  return (
    <View>
      <CustomHeader />
      <Text>Tareas</Text>
    </View>
  );
};

export default TasksScreen;
