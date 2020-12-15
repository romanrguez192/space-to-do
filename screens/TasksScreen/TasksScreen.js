import styles from "./styles";
import { firebase } from "../../firebase/config";
import ContentLoader, {
  FacebookLoader,
  InstagramLoader,
} from "react-native-easy-content-loader";
import { Appbar, DefaultTheme, Checkbox, List, IconButton } from "react-native-paper";
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
} from "react-native";
import { Input, Icon, ListItem, Avatar, Overlay } from "react-native-elements";
import { useFocusEffect } from "@react-navigation/native";
import * as Animatable from "react-native-animatable";
import Collapsible from "react-native-collapsible";
import Accordion from "react-native-collapsible/Accordion";

const TasksScreen = (props) => {
  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState(null);
  const Theme = {
    ...DefaultTheme,
    roundness: 2,
    colors: {
      ...DefaultTheme.colors,
      primary: props.list.theme,
    },
  }
  const CustomHeader = () => {
    return (
      <Appbar.Header
        theme={Theme}
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
          // const data = snapshot.docs.map((doc) => ({
          //   id: doc.id,
          // ...doc.data(),
          // }));

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

  // const [config, setConfig] = useState({
  //   activeS: [],
  //   collapsed: true,
  //   multipleSelect: false,
  // });

  // const toggleExpanded = () => {
  //   setConfig({ ...config, collapsed: !config.collapsed });
  // };

  // const setSections = (sections) => {
  //   setConfig({
  //     ...config,
  //     activeS: sections.includes(undefined) ? [] : sections,
  //   });
  // };

  // const renderContent = (section, _, isActive) => {
  //   return (
  //     <Animatable.View
  //       duration={400}
  //       style={[styles.content, isActive ? styles.active : styles.inactive]}
  //       transition="color"
  //     >
  //       <Animatable.Text
  //         style={{ marginLeft: 46, color: "gray", fontSize: 15 }}
  //         duration={400}
  //         animation={isActive ? "slideInDown" : undefined}
  //       >
  //         {section.content}
  //       </Animatable.Text>
  //     </Animatable.View>
  //   );
  // };

  const [titleStyles, setTitleStyles] = useState({textDecorationLine:'line-through'})

  // const titleStyles = (done) => {
  //   return (done)? {textDecorationLine:"line-through"} : undefined
  // }

  const setDone = async(item) => {
    const dbRef = firebase.default.firestore().collection('tasks').doc(item.id)
    await dbRef.set({
      ...item,
      done: !(item.done),
    })
  }

  const getDateFromString = (limit) => {
    const resul= new Date(limit * 1000);
    return resul.getDate()  + "/" + (resul.getMonth() + 1) + "/" +  (resul.getFullYear() - 1969 );
  }

  const renderList = (items) => {
    return (
      <List.Section title="Tareas" >
        {
          items.map((item) => {
            return(
              <View style={{flex:1, flexDirection:'row'}}>
                <View style={{flex:.15, alignItems:'center', padding:0, margin:0}}>
                  <Checkbox.Item 
                    status={(item.done? "checked" : "unchecked")} 
                    onPress={() => setDone(item)} color={props.list.theme}
                    style={{padding:0, margin:0}}
                    />
                </View>
                <View style={{flex:.9}}>
                  <List.Accordion
                    title={item.title}
                    titleStyle={{fontWeight:'bold'},(item.done)? {textDecorationLine:'line-through'} : undefined}
                    style={{paddingBottom:0}}
                    theme={Theme}
                  >
                    <TouchableOpacity activeOpacity={0.7} /*onLongPress={}*/>
                      <List.Item 
                        style={{paddingTop:0}}
                        description={item.description}
                        descriptionStyle={(item.done)? {textDecorationLine:'line-through'} : undefined}
                        title={getDateFromString(item.limit)}
                        titleStyle={{fontSize:12}}
                      />
                    </TouchableOpacity>
                  </List.Accordion>
                </View>
              </View>
            )
          })
        }
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

  return (
    <>
      <CustomHeader />
      <ScrollView style={{ backgroundColor: "#fff" }}>
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
