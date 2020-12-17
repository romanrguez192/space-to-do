import React, { useState, useRef, useEffect, useLayoutEffect } from "react";
import {
  Text,
  Image,
  FlatList,
  View,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import { Input, Icon, ListItem, Avatar, Overlay } from "react-native-elements";
import styles from "./styles";
import { firebase } from "../../firebase/config";
import ContentLoader, {
  FacebookLoader,
  InstagramLoader,
} from "react-native-easy-content-loader";
import { Appbar, DefaultTheme, Menu } from "react-native-paper";

const ListsScreen = (props) => {
  const [visibleOverlay, setVisibleOverlay] = useState(false);
  const [loading, setLoading] = useState(true);
  const [creatingList, setCreatingList] = useState(false);
  const [lists, setLists] = useState(null);
  const [visibleOptions, setVisibleOptions] = useState(false);
  const [selectedList, setSelectedList] = useState(null);
  const [editing, setEditing] = useState(false);

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
      </Appbar.Header>
    );
  };

  useEffect(() => {
    const unsubscribe = getLists(props.route.params.userID);

    return unsubscribe;
  }, []);

  const getLists = (userID) => {
    const listsRef = firebase.firestore().collection("lists");
    return listsRef
      .where("createdBy", "==", userID)
      .orderBy("name", "asc")
      .onSnapshot((snapshot) => {
        const data = [];
        snapshot.docs.map((doc) => {
          data.push({
            id: doc.id,
            ...doc.data(),
          });
        });
        if (data.length === 0) setLists(null);
        else setLists(data);
        setLoading(false);
      });
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
    listRef
      .delete()
      .then(() => {
        const tasks = firebase
          .firestore()
          .collection("tasks")
          .where("listID", "==", listID);
        tasks.onSnapshot((snapshot) => {
          snapshot.docs.forEach((doc) => {
            doc.ref.delete();
          });
        });
      })
      .catch(() => {
        Alert.alert(
          "Error",
          "Ocurrió un error al eliminar esta lista, revise su conexión a internet."
        );
      });
  };

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

    const editList = async () => {
      if (list.name.trim() === "" || list.theme === "") {
        Alert.alert(
          "Error",
          "Ingresa un nombre y un color para tu lista, por favor."
        );
        return;
      }

      setCreatingList(true);

      await firebase
        .firestore()
        .collection("lists")
        .doc(selectedList.id)
        .update({
          name: list.name,
          theme: list.theme,
        })
        .then((ref) => {
          setCreatingList(false);
          toggleOverlay();
          setEditing(false);
          Alert.alert(
            "Lista editada",
            "¡Tu lista ha sido editada correctamente!"
          );
        })
        .catch((error) => {
          // TODO: Alertas de errores...
          console.error("Error ", error);
        });

      setCreatingList(false);
    };

    const createList = async () => {
      if (list.name.trim() === "" || list.theme === "") {
        Alert.alert(
          "Error",
          "Ingresa un nombre y un color para tu lista, por favor."
        );
        return;
      }

      const listObj = {
        ...list,
        createdBy: props.route.params.userID,
        count: 0,
      };

      setCreatingList(true);

      await firebase
        .firestore()
        .collection("lists")
        .add(listObj)
        .then((ref) => {
          toggleOverlay();
          Alert.alert(
            "Lista creada",
            "¡Tu lista ha sido creada correctamente!"
          );
          openList({ ...listObj, id: ref.id });
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
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            if (editing) {
              editList();
            } else {
              createList();
            }
          }}
        >
          <Text style={styles.buttonText}>
            {(editing ? "Editar" : "Crear") + " lista"}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  const showOptions = (item) => {
    setSelectedList(item);
    toggleOptions();
  };

  const renderList = ({ item }) => {
    return (
      <View style={styles.shadow}>
        <TouchableOpacity
          style={styles.buttonList}
          onPress={() => openList(item)}
          onLongPress={() => {
            showOptions(item);
          }}
        >
          <Icon
            flexDirection="row"
            type="font-awesome"
            name="list-ul"
            color={item.theme ? item.theme : "black"}
          />
          <Text style={styles.nameList}>{item.name}</Text>
        </TouchableOpacity>
        <Text style={{ marginLeft: 58, color: "#808080", marginBottom: 10 }}>
          {(!item.count ? "No hay" : item.count) +
            " tarea" +
            (item.count == 1 ? "" : "s") +
            " pendiente" +
            (item.count == 1 ? "" : "s")}
        </Text>
      </View>
    );
  };

  const toggleOptions = () => {
    setVisibleOptions(!visibleOptions);
  };

  const Options = () => {
    return (
      <View>
        <TouchableOpacity
          onPress={() => openList(selectedList)}
          style={styles.buttonOptions}
        >
          <Icon
            flexDirection="row"
            type="font-awesome"
            name="folder-open"
            color="black"
          />
          <Text style={styles.options}>Abrir lista</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            setEditing(true);
            toggleOverlay();
            toggleOptions();
          }}
          style={styles.buttonOptions}
        >
          <Icon
            flexDirection="row"
            type="font-awesome"
            name="edit"
            color="black"
          />
          <Text style={styles.options}>Editar lista</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            Alert.alert(
              "Eliminar Lista",
              "¿Estás seguro de que deseas eliminar esta lista?",
              [
                { text: "No" },
                {
                  text: "Sí",
                  onPress: () => {
                    deleteList(selectedList.id);
                    toggleOptions();
                  },
                },
              ]
            );
          }}
          style={styles.buttonOptions}
        >
          <Icon
            flexDirection="row"
            type="font-awesome"
            name="trash"
            color="black"
          />
          <Text style={styles.options}>Eliminar lista</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.vista}>
      <CustomHeader />
      <Overlay
        isVisible={visibleOverlay}
        onBackdropPress={() => {
          setEditing(false);
          toggleOverlay();
        }}
      >
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
      <Overlay isVisible={visibleOptions} onBackdropPress={toggleOptions}>
        <Options />
      </Overlay>
      {lists ? (
        <FlatList
          data={lists}
          renderItem={renderList}
          keyExtractor={(item) => item.id}
        />
      ) : (
        <Image
          source={require("../../assets/fondolist.png")}
          style={styles.fondo}
        />
      )}
    </View>
  );
};

export default ListsScreen;
