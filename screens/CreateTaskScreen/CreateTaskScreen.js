import styles from "./styles";
import { firebase } from "../../firebase/config";
import ContentLoader, {
  FacebookLoader,
  InstagramLoader,
} from "react-native-easy-content-loader";
import { Appbar, DefaultTheme, Checkbox } from "react-native-paper";
import React, { useState, useRef, useEffect, useLayoutEffect } from "react";
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

const CreateTaskScreen = () => {
    return (
        <View>
            <Text>Create</Text>
        </View>
    )
}

export default CreateTaskScreen;