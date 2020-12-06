import React, { useState, useRef, useEffect } from "react";
import {
  ScrollView,
  TouchableOpacity,
  Text,
  Image,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  View,
  Button,
  ActivityIndicator,
  Alert,
  Dimensions,
} from "react-native";
import { Input, Icon, Avatar, ListItem } from "react-native-elements";
import styles from "./styles";
import { firebase } from "../../firebase/config";
import uuid4 from "uuid/v4";
import * as ImagePicker from "expo-image-picker";
import * as Permissions from "expo-permissions";
import LoadScreen from "../LoadScreen/LoadScreen";
import calendario from "../../assets/calendario.jpg"

// Pantalla de Inicio de Sesión
const HomeScreen = (props) => {
  useEffect(() => {
    getUserByID(props.extraData);
  }, []);


  const windowWidth = Dimensions.get("window").width;
  const windowHeight = Dimensions.get("window").height;

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
  const [image, setImage] = useState({ uri: "" });
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const getUserByID = async (id) => {
    const dbRef = firebase.firestore().collection("users").doc(id);
    const doc = await dbRef.get();
    const resul = doc.data();
    setUser(resul);
    getImageByID(resul.imageID);
    setLoading(false);
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

  const updateUser = async (imageID) => {
    const dbRef = firebase.firestore().collection("users").doc(props.extraData);
    await dbRef.set({ ...user, imageID });
    getImageByID(imageID);
  };

  const pickImage = async () => {
    const permission = await Permissions.askAsync(Permissions.CAMERA_ROLL);
    if (permission.granted) {
      const resulImage = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        aspect: [3, 3],
        quality: 1,
      });

      if (!resulImage.cancelled) {
        const uuid = uuid4();
        setUser({ ...user, imageID: uuid });
        uploadImage(resulImage.uri)
          .then((resolve) => {
            const ref = firebase.storage().ref().child(`images/${uuid}.jpg`);
            ref
              .put(resolve)
              .then((resolve) => {
                updateUser(uuid);
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
          setImage({ uri: resolve });
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      setImage({ uri: "" });
    }
  };

  const getTitleByName = (name) => {
    let resul = name.toUpperCase().charAt(0);
    if (name.indexOf(" ") + 1 === 0) return resul;
    return resul.concat(name.toUpperCase().charAt(name.indexOf(" ") + 1));
  };

  if (loading) {
    return <LoadScreen />;
  }

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
          updateUser("");
        })
        .catch((err) => console.log("Cannot be deleted: " + err));
    }
  };

  return (
    <SafeAreaView style={styles.areaview}>
      <KeyboardAvoidingView
        enabled
        behavior={Platform.OS === "ios" ? "padding" : null}
        style={styles.keyboardstyle}
        keyboardVerticalOffset="100"
      >
        <ScrollView contentContainerStyle={styles.container}>
          <Text style={styles.messageStyle}>¡Hola, {user.username}!</Text>
          <View style={styles.pantContainer}>
          <TouchableOpacity underlayColor='rgba(73,182,77,1,0.9)' >
            <View style={styles.categoriesItemContainer}>
              <Image style={styles.categoriesPhoto} source={calendario} />
              <Text style={styles.categoriesName}>CALENDARIO</Text>
            </View>
          </TouchableOpacity>
          </View>
          <View
            style={{
              borderBottomColor: "#bbb",
              borderBottomWidth: 1,
            }}
          />
          {/* EJEMPLO PARA CARGAR LA IMAGEN */}
          <ListItem key={user.id}>
            {user.imageID === "" ? (
              <Avatar
                size="medium"
                title={getTitleByName(user.name)}
                containerStyle={{ backgroundColor: user.avatarColor }}
              />
            ) : (
              <Avatar size="medium" source={{ uri: image.uri }} />
            )}

            <ListItem.Content>
              <ListItem.Title>{user.name}</ListItem.Title>
              <ListItem.Subtitle>{user.email}</ListItem.Subtitle>
            </ListItem.Content>
            <Icon name="add" onPress={pickImage} />
            <View>
              <Button title="delete" onPress={deleteImage}></Button>
            </View>
          </ListItem>
          {/* FIN DE EJEMPLO */}

          <View>{/* TODO: AGREGAR LA LISTA DE TAREAS POR CULMINAR */}</View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default HomeScreen;
