import React, { useState, useRef, useEffect, useLayoutEffect } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
  ScrollView,
  Alert,
} from "react-native";
import styles from "./styles";
import { firebase } from "../../firebase/config";
import ContentLoader, {
  FacebookLoader,
  InstagramLoader,
} from "react-native-easy-content-loader";
import ProfilePicture from "../../components/ProfilePicture";
import "../../global";
import { Icon } from "react-native-elements";
import * as Permissions from "expo-permissions";
import * as ImagePicker from "expo-image-picker";
import { v4 as uuidv4 } from "uuid";
import { Appbar, DefaultTheme } from "react-native-paper";

const UserScreen = (props) => {
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
        <Appbar.Content title="Mi Perfil" />
      </Appbar.Header>
    );
  };

  useLayoutEffect(() => {
    props.navigation.setOptions({
      header: () => <CustomHeader />,
    });
  }, [props.navigation]);

  useEffect(() => {
    getUserByID(props.userID);
  }, []);

  const [user, setUser] = useState({
    name: "",
    email: "",
    gender: "",
    imageID: "",
    username: "",
    avatarColor: "",
    id: "",
  });
  const [loading, setLoading] = useState(true);
  const [image, setImage] = useState("");

  const getUserByID = async (id) => {
    const dbRef = firebase.firestore().collection("users").doc(id);
    const doc = await dbRef.get();
    const resul = doc.data();
    setUser(resul);
    getImageByID(resul.imageID);
    setLoading(false);
  };

  const singout = () => {
    firebase
      .auth()
      .signOut()
      .then(() => {
        // Sign-out successful.
        alert("Saliste de tu cuenta");
      })
      .catch((error) => {
        // An error happened.
        alert(error);
      });
  };

  const updateImage = async (value) => {
    const dbRef = firebase.firestore().collection("users").doc(props.userID);
    await dbRef.set({ ...user, imageID: value });
    getImageByID(value);
  };

  const pickImage = async () => {
    if (user.imageID) deleteImage();

    const permission = await Permissions.askAsync(Permissions.CAMERA_ROLL);
    if (permission.granted) {
      const resulImage = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        aspect: [3, 3],
        quality: 1,
      });

      if (!resulImage.cancelled) {
        setLoading(true);
        const uuid = uuidv4();
        setUser({ ...user, imageID: uuid });
        uploadImage(resulImage.uri)
          .then((resolve) => {
            const ref = firebase.storage().ref().child(`images/${uuid}.jpg`);
            ref
              .put(resolve)
              .then((resolve) => {
                updateImage(uuid);
                Alert.alert("Imagen subida correctamente");
              })
              .catch((err) => {
                Alert.alert("No se pudo cargar la imagen intente de nuevo");
              });
          })
          .catch((err) => {
            console.log(err);
          });
      }
    }
  };

  const getImageByID = async (id) => {
    if (id !== "") {
      firebase
        .storage()
        .ref(`images/${id}.jpg`)
        .getDownloadURL()
        .then((resolve) => {
          setImage(resolve);
          global.image = resolve;
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      setImage("");
      global.image = "";
    }
    setLoading(false);
  };

  const deleteImage = () => {
    if (!(user.imageID === "")) {
      const imageRef = firebase.default
        .storage()
        .ref(`images/${user.imageID}.jpg`);
      imageRef
        .delete()
        .then(() => {
          console.log("Deleted");
          setUser({ ...user, imageID: "" });
          updateUser("imageID", "");
          setImage("");
          global.image = "";
        })
        .catch((err) => console.log("Cannot be deleted: " + err));
    }
  };

  const uploadImage = (uri) => {
    return new Promise((resolve, reject) => {
      let xhr = new XMLHttpRequest();
      xhr.onerror = reject;
      xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
          resolve(xhr.response);
        }
      };
      xhr.open("GET", uri);
      xhr.responseType = "blob";
      xhr.send();
    });
  };

  return (
    <SafeAreaView style={styles.areaview}>
      <ContentLoader
        active
        loading={loading}
        avatarStyles={{ display: "none" }}
        listSize={5}
        tHeight={20}
        tWidth={150}
        sTWidth={200}
      >
        <KeyboardAvoidingView
          enabled
          behavior={Platform.OS === "ios" ? "padding" : null}
          style={styles.keyboardstyle}
          keyboardVerticalOffset="100"
        >
          <ScrollView contentContainerStyle={styles.container}>
            <ProfilePicture
              image={image}
              name={user.name}
              color={user.avatarColor}
              style={styles.imgProfile}
              styleTitle={styles.picName}
            />
            <Text style={styles.userStyle}>{user.username}</Text>
            <TouchableOpacity style={styles.editButton} onPress={pickImage}>
              <Icon
                type="font-awesome"
                name="pencil"
                size={20}
                color="#ffffff"
                backgroundColor="#e54e42"
                alignItems="center"
                style={styles.iconStyle}
              />
            </TouchableOpacity>
            <View style={styles.informationContainer}>
              <View style={styles.shadow}>
                <Text style={styles.titleInformation}>Nombre</Text>
                <Text style={styles.subtitleInformation}>{user.name}</Text>
              </View>
              <View style={styles.shadow}>
                <Text style={styles.titleInformation}>Correo Electrónico</Text>
                <Text style={styles.subtitleInformation}>{user.email}</Text>
              </View>
              <View style={styles.shadow}>
                <Text style={styles.titleInformation}>Género</Text>
                <Text style={styles.subtitleInformation}>
                  {user.gender === "M" ? "Masculino" : "Femenino"}
                </Text>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </ContentLoader>
    </SafeAreaView>
  );
};

export default UserScreen;
