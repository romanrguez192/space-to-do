import React, { useState, useRef, useEffect } from "react";
import { Text, FlatList, View, TouchableOpacity } from "react-native";
import { Input, Icon, ListItem, Avatar, Overlay } from "react-native-elements";

import styles from "./styles";
import { firebase } from "../../firebase/config";

const ListsScreen = () => {
  const [list, setList] = useState({
    title: "",
    subtitle: "",
    theme: "",
    listItem: "",
  });
  const [visible, setVisible] = useState(false);

  const handleChangeText = (name, value) => {
    setList({ ...list, [name]: value });
  };

  const toggleOverlay = () => {
    setVisible(!visible);
  };
  const createList = () => {};
  return (
    <View>
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
        <Input
          placeholder="Ej: Compras"
          label="Título"
          onChangeText={(value) => handleChangeText("title", value)}
        />
        <TouchableOpacity style={styles.button} onPress={createList()}>
          <Text style={styles.buttonText}>Crear lista</Text>
        </TouchableOpacity>
      </Overlay>
      <TouchableOpacity>
        <FlatList />
      </TouchableOpacity>
    </View>
  );
};

export default ListsScreen;
