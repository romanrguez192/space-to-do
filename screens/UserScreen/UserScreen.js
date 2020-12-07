import React, { useState, useRef, useEffect } from "react";
import { Text, View } from "react-native";
import styles from "./styles";
import { firebase } from "../../firebase/config";

const UserScreen = () => {
  return (
    <View style={{flex:1 ,alignItems: 'center', justifyContent:'center'}}>
      <Text style={{fontWeight: 'bold'}}>Usuario</Text>
    </View>
  );
};

export default UserScreen;
