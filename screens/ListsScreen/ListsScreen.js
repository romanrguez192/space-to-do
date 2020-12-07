import React, { useState, useRef, useEffect, useLayoutEffect } from "react";
import {
  Text,
  FlatList,
  View,
  TouchableOpacity,
  ScrollView,
  Alert,
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
    return listsRef
      .where("createdBy", "==", userID)
      //.orderBy("createdAt", "desc")
      .onSnapshot((snapshot) => {
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setLists(data);
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

  const toggleOverlay = () => {
    setVisibleOverlay(!visibleOverlay);
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

    const createList = () => {
      if (list.name.trim() === "") {
        Alert.alert("Error", "Ingresa un nombre para tu lista, por favor.");
        return;
      }

      //TODO: Verificar selección de tema

      const listObj = { ...list, createdBy: props.route.params.userID };

      firebase
        .firestore()
        .collection("lists")
        .add(listObj)
        .then((ref) => {
          toggleOverlay();
          Alert.alert(
            "Lista creado",
            "¡Tu lista ha sido creada correctamente! Vamos a verla."
          );
          openList({ ...listObj, id: ref });
        })
        .catch((error) => {
          // TODO: Alertas de errores...
          console.error("Error ", error);
        });
    };

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
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            paddingBottom: 20,
            paddingLeft: 10,
          }}
        >
          <TouchableOpacity style={{ paddingRight: 5 }}>
            <Icon type="font-awesome" name="circle" color="#3b99d8" size={40} />
          </TouchableOpacity>
          <TouchableOpacity style={{ paddingRight: 5 }}>
            <Icon type="font-awesome" name="circle" color="#e54e42" size={40} />
          </TouchableOpacity>
          <TouchableOpacity style={{ paddingRight: 5 }}>
            <Icon type="font-awesome" name="circle" color="#7b1fa2" size={40} />
          </TouchableOpacity>
          <TouchableOpacity style={{ paddingRight: 5 }}>
            <Icon type="font-awesome" name="circle" color="#43a047" size={40} />
          </TouchableOpacity>
          <TouchableOpacity style={{ paddingRight: 5 }}>
            <Icon type="font-awesome" name="circle" color="#ffea00" size={40} />
          </TouchableOpacity>
          <TouchableOpacity style={{ paddingRight: 5 }}>
            <Icon type="font-awesome" name="circle" color="#ec407a" size={40} />
          </TouchableOpacity>
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
            color="#3b99d8"
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
      {/* <TouchableOpacity
        style={styles.buttonAddStyle}
        onPress={() => toggleOverlay()}
      >
        <Icon
          type="font-awesome"
          name="plus"
          size={30}
          color="#ffffff"
          backgroundColor="#e54e42"
          alignItems="center"
          style={styles.iconStyle}
        />
      </TouchableOpacity> */}
      <Overlay isVisible={visibleOverlay} onBackdropPress={toggleOverlay}>
        <CreateList />
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
