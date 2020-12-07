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
} from "react-native";
import { Input, Icon, ListItem } from "react-native-elements";
import styles from "./styles";
import { firebase } from "../../firebase/config";
import uuid4 from "uuid/v4";
import * as ImagePicker from "expo-image-picker";
import * as Permissions from "expo-permissions";
import LoadScreen from "../LoadScreen/LoadScreen";
import ContentLoader,{ FacebookLoader, InstagramLoader } from "react-native-easy-content-loader";
import ProfilePicture from "../../components/ProfilePicture";
import { Searchbar, Avatar } from 'react-native-paper';

// Pantalla de Inicio de Sesión
const HomeScreen = (props) => {

  useEffect(() => {
    getUserByID(props.extraData);
  }, []);

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
  const [user, setUser] = useState({
    username: "",
    email: "",
    name: "",
    imageID: "",
    avatarColor: "",
    id: "",
    gender: "",
  });
  const [loading, setLoading] = useState(true);

  const getUserByID = async (id) => {
    const dbRef = firebase.firestore().collection("users").doc(id);
    const doc = await dbRef.get();
    const resul = doc.data();
    setUser(resul);
    getImageByID(resul.imageID);
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
    if(user.imageID)
      deleteImage()

    const permission = await Permissions.askAsync(Permissions.CAMERA_ROLL);
    if (permission.granted) {
      const resulImage = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        aspect: [3, 3],
        quality: 1,
      });

      if (!resulImage.cancelled) {
        setLoading(true)
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
    setLoading(false)
  };

  

  // if (loading) {
  //   return <LoadScreen />;
  // }

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
      <ContentLoader
        active
        loading={loading}
        avatarStyles={{display:'none'}}
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
            <View style={styles.shadow}>
              <Text style={styles.messageStyle}>Miguel....</Text>
            </View>
            
            <View
              style={{
                borderBottomColor: "#bbb",
                borderBottomWidth: 1,
              }}
            />
            {/* EJEMPLO PARA CARGAR LA IMAGEN */}
            <ListItem key={user.id}>
              <ProfilePicture user={user} image={image} />
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
      </ContentLoader>
    </SafeAreaView>
  );
};

export default HomeScreen;
