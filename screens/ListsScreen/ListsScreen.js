import React, { useState, useRef, useEffect } from "react";
import { Text, FlatList, View, TouchableOpacity, Alert } from "react-native";
import { Input, Icon, ListItem, Avatar, Overlay } from "react-native-elements";
import styles from "./styles";
import { firebase } from "../../firebase/config";

const ListsScreen = () => {
  const [visible, setVisible] = useState(false);

  const toggleOverlay = () => {
    setVisible(!visible);
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

      // firebase
      //   .firestore()
      //   .collection("lists")
      //   .add({
      //     ...list,
      //     createdBy:
      //   })
      //   .then((ref) => {
      //     console.log("Added doc with ID: ", ref.id);
      //     // Added doc with ID:  ZzhIgLqELaoE3eSsOazu
      //   });
    };

    return (
      <View>
        <Input
          placeholder="Ej: Trabajo"
          label="Nombre de la Lista"
          onChangeText={(value) => handleChangeText("title", value)}
        />
        <Input
          placeholder="Solo una prueba"
          label="Tema"
          onChangeText={(value) => handleChangeText("theme", value)}
        />
        <TouchableOpacity style={styles.button} onPress={() => createList()}>
          <Text style={styles.buttonText}>Crear lista</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const lists = [
    {
      id: "1",
      name: "Trabajo",
      theme: "blue",
    },
    {
      id: "2",
      name: "Casa",
      theme: "yellow",
    },
    {
      id: "3",
      name: "Colegio",
      theme: "green",
    },
    {
      id: "35",
      name: "Colegio",
      theme: "green",
    },
    {
      id: "32",
      name: "Colegio",
      theme: "green",
    },
    {
      id: "322",
      name: "Colegio",
      theme: "green",
    },
    {
      id: "31",
      name: "Colegio",
      theme: "green",
    },
    {
      id: "311",
      name: "Colegio",
      theme: "green",
    },
    {
      id: "3111",
      name: "Colegio",
      theme: "green",
    },
    {
      id: "3b",
      name: "Colegio",
      theme: "green",
    },
    {
      id: "3bb",
      name: "Colegio",
      theme: "green",
    },
    {
      id: "3sg",
      name: "Colegio",
      theme: "green",
    },
    {
      id: "3gas",
      name: "Colegio",
      theme: "green",
    },
    {
      id: "3fdsa",
      name: "Colegio",
      theme: "green",
    },
    {
      id: "3asd",
      name: "Colegio",
      theme: "green",
    },
  ];

  const renderList = ({ item }) => {
    return (
      <ListItem bottomDivider>
        <ListItem.Content>
          <ListItem.Title>{item.name}</ListItem.Title>
        </ListItem.Content>
        <ListItem.Chevron />
      </ListItem>
    );
  };

  return (
    <View style={{flex: 1}}>
      <TouchableOpacity
        style={styles.buttonAddStyle}
        onPress={() => toggleOverlay()}
      >
        <Icon
          type="font-awesome"
          name="plus"
          size={30}
          color="#FF8C00"
          backgroundColor="#FF8C0050"
          alignItems="center"
          style={styles.iconStyle}
        />
      </TouchableOpacity>
      <Overlay isVisible={visible} onBackdropPress={toggleOverlay}>
        <CreateList />
      </Overlay>
      <FlatList
        style={{flex: 1, marginBottom: 50}}
        data={lists}
        renderItem={renderList}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

export default ListsScreen;
