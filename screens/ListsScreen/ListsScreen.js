import React, { useState, useRef, useEffect, useLayoutEffect } from "react";
import {
  Text,
  FlatList,
  View,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Input, Icon, ListItem, Avatar, Overlay } from "react-native-elements";
import styles from "./styles";
import { firebase } from "../../firebase/config";
import ContentLoader, {
  FacebookLoader,
  InstagramLoader,
} from "react-native-easy-content-loader";
import { Appbar, DefaultTheme } from "react-native-paper";

const ListsScreen = (props) => {
  const [visibleOverlay, setVisibleOverlay] = useState(false);
  const [loading, setLoading] = useState(true);
  const [creatingList, setCreatingList] = useState(false);
  const [lists, setLists] = useState(null);

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
        <Appbar.Action
          icon="menu"
          onPress={() => props.navigation.toggleDrawer()}
        />
        <Appbar.Content title="Mis listas" />
        <Appbar.Action
          icon="plus"
          onPress={() => {
            if (!loading) toggleOverlay();
          }}
        />
        <Appbar.Action icon="dots-vertical" />
      </Appbar.Header>
    );
  };

  useEffect(() => {
    const unsubscribe = getLists(props.route.params.userID);

    return unsubscribe;
  }, []);

  const getLists = (userID) => {
    const listsRef = firebase.firestore().collection("lists");
    return (
      listsRef
        .where("createdBy", "==", userID)
        //.orderBy("createdAt", "desc")
        .onSnapshot((snapshot) => {
          const data = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setLists(data);
          setLoading(false);
        })
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

  //Elimina una lista y sus tareas, y recibe como parametro el id de la lista
  const deleteList = (listID) => {
    const listRef = firebase.firestore().collection("lists").doc(listID);
    listRef.delete().then(() => {
      const tasks = firebase.firestore().collection('tasks').where("listID", "==", listID)
      tasks.onSnapshot(snapshot => {
        snapshot.docs.forEach(doc => {
          doc.ref.delete()
        })
      })
    }).catch(() => {
      Alert.alert("Ocurrio un error al eliminar esta lista, revise su conexión a internet.")
    })
  } 

  const toggleOverlay = () => {
    if (!creatingList) setVisibleOverlay(!visibleOverlay);
  };

  const openList = (list) => {
    props.navigation.navigate("Tareas", { list });
  };

  // TODO: Mover a otro archivo
  const CreateList = () => {
    const [list, setList] = useState({
      name: "",
      theme: "",
    });

    const handleChangeText = (name, value) => {
      setList({ ...list, [name]: value });
    };

    const createList = async () => {
      if (list.name.trim() === "" || list.theme === "") {
        Alert.alert(
          "Error",
          "Ingresa un nombre y un color para tu lista, por favor."
        );
        return;
      }

      //TODO: Verificar selección de tema

      const listObj = { ...list, createdBy: props.route.params.userID };

      setCreatingList(true);

      await firebase
        .firestore()
        .collection("lists")
        .add(listObj)
        .then((ref) => {
          toggleOverlay();
          Alert.alert(
            "Lista creado",
            "¡Tu lista ha sido creada correctamente!"
          );
          openList({ ...listObj, id: String(ref) });
        })
        .catch((error) => {
          // TODO: Alertas de errores...
          console.error("Error ", error);
        });

      setCreatingList(false);
    };

    const colors = [
      "#3b99d8",
      "#e54e42",
      "#7b1fa2",
      "#43a047",
      "#ffea00",
      "#ec407a",
      "#F50057",
      "#E54E42",
      "#EC407A",
      "#880E4F",
      "#43A047",
      "#FF4081",
      "#4A148C",
      "#D500F9",
      "#4527A0",
      "#1B5E20",
      "#00695C",
      "#00BFA5",
      "#00C853",
      "#C0CA33",
      "#64DD17",
      "#EEFF41",
      "#F57F17",
      "#FFCA28",
      "#FF5722",
      "#DD2C00",
      "#546E7A",
      "#3712F1",
    ];

    return (
      <View>
        <Input
          placeholder="Ej: Trabajo"
          label="Nombre de la Lista"
          labelStyle={{ fontSize: 18, color: "#2d3f50" }}
          onChangeText={(value) => handleChangeText("name", value)}
        />
        <Text
          style={{
            fontSize: 18,
            color: "#2d3f50",
            fontWeight: "bold",
            paddingLeft: 10,
            paddingBottom: 10,
          }}
        >
          Color de la Lista
        </Text>
        <View style={styles.scrollContainer}>
          <ScrollView
            horizontal={true}
            style={{
              alignContent: "center",
              flexDirection: "row",
              paddingBottom: 20,
              marginLeft: 10,
              marginRight: 10,
              height: 40,
            }}
          >
            {colors.map((color) => {
              return (
                <TouchableOpacity
                  key={color}
                  onPress={() => setList({ ...list, theme: color })}
                  style={{ paddingRight: 5, height: 40 }}
                >
                  <Icon
                    type="font-awesome"
                    name={color == list.theme ? "check-circle" : "circle"}
                    color={color}
                    size={40}
                  />
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
        <TouchableOpacity style={styles.button} onPress={() => createList()}>
          <Text style={styles.buttonText}>Crear lista</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderList = ({ item }) => {
    return (
      <View style={styles.shadow}>
        <TouchableOpacity
          style={styles.buttonList}
          onPress={() => openList(item)}
        >
          <Icon
            flexDirection="row"
            type="font-awesome"
            name="list-ul"
            color={item.theme ? item.theme : "black"}
          />
          <Text style={styles.nameList}>{item.name}</Text>
        </TouchableOpacity>
        <Text style={{ marginLeft: 55, color: "#808080", marginBottom: 10 }}>
          5 Tareas pendientes
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.vista}>
      <CustomHeader />
      <Overlay isVisible={visibleOverlay} onBackdropPress={toggleOverlay}>
        {creatingList ? (
          <ActivityIndicator
            size="large"
            color="#9e9e9e"
            style={{ margin: 50 }}
          />
        ) : (
          <CreateList />
        )}
      </Overlay>
      <FlatList
        data={lists}
        renderItem={renderList}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

export default ListsScreen;
