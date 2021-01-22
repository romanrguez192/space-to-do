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
import { Icon, Input, Overlay } from "react-native-elements";
import * as Permissions from "expo-permissions";
import * as ImagePicker from "expo-image-picker";
import { v4 as uuidv4 } from "uuid";
import { Appbar, Button, DefaultTheme } from "react-native-paper";
import { color } from "react-native-reanimated";

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
  let pass;
  const [loading, setLoading] = useState(true);
  const [image, setImage] = useState("");
  const [changing, setChanging] = useState(false);
  const [icon, setIcon] = useState("pencil");
  const [changeName, setChangeName] = useState(null);
  const [visibleOverlay, setVisibleOverlay] = useState(false);

  const getUserByID = async (id) => {
    const dbRef = firebase.firestore().collection("users").doc(id);
    const doc = await dbRef.get();
    const resul = doc.data();
    setUser(resul);
    getImageByID(resul.imageID);
    setLoading(false);
  };

  const toggleOverlay = () => {
    setVisibleOverlay(!visibleOverlay);
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

  const updateUser = async (key, value) => {
    const dbRef = firebase.firestore().collection("users").doc(props.userID);
    await dbRef.set({ ...user, [key]: value });
    if (key === "imageID") getImageByID(value);
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
        if (user.imageID) deleteImage();
        setLoading(true);
        const uuid = uuidv4();
        setUser({ ...user, imageID: uuid });
        uploadImage(resulImage.uri)
          .then((resolve) => {
            const ref = firebase.storage().ref().child(`images/${uuid}.jpg`);
            ref
              .put(resolve)
              .then((resolve) => {
                updateUser("imageID", uuid);
                Alert.alert("Enhorabuena", "Imagen subida correctamente.");
              })
              .catch((err) => {
                Alert.alert(
                  "Error",
                  "No se pudo cargar la imagen, intenta de nuevo."
                );
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

  const deleteListsAndTasks = () => {
    const listsRef = firebase.firestore().collection("lists");
    listsRef.where("createdBy", "==", user.id).onSnapshot((snapshot) => {
      snapshot.docs.forEach((doc) => {
        const taskRef = firebase.firestore().collection("tasks");
        taskRef.where("listID", "==", doc.ref.id).onSnapshot((snapshot1) => {
          snapshot1.docs.forEach((docc) => {
            docc.ref.delete().catch(() => {
              Alert.alert(
                "Error",
                "Ocurrió un error al intentar eliminar la cuenta."
              );
            });
          });
        });

        doc.ref.delete().catch(() => {
          Alert.alert(
            "Error",
            "Ocurrió un error al intentar eliminar la cuenta."
          );
        });
      });
    });
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
        .catch((err) => {
          Alert.alert(
            "Error",
            "Ocurrió un error al intentar eliminar la cuenta."
          );
        });
    }
  };

  const deleteAccount = () => {
    const credential = firebase.auth.EmailAuthProvider.credential(
      user.email,
      pass
    );
    const userRef = firebase.auth().currentUser;
    userRef
      .reauthenticateWithCredential(credential)
      .then(() => {
        firebase.default
          .firestore()
          .collection("users")
          .doc(props.userID)
          .delete()
          .catch(() => {
            Alert.alert(
              "Error",
              "Ocurrió un error al intentar eliminar la cuenta."
            );
            return;
          });

        deleteListsAndTasks();

        if (user.imageID) {
          const imageRef = firebase.storage().ref(`images/${user.imageID}.jpg`);
          imageRef.delete().catch((err) => {
            Alert.alert(
              "Error",
              "Ocurrió un error al intentar eliminar la cuenta."
            );
          });
        }

        userRef
          .delete()
          .then(() => {
            Alert.alert("Enhorabuena", "Cuenta eliminada satisfactoriamente");
          })
          .catch(() => {
            Alert.alert(
              "Error",
              "Ocurrió un error al intentar eliminar la cuenta."
            );
          });
      })
      .catch(() => {
        Alert.alert(
          "Error",
          "Ocurrió un error al intentar eliminar la cuenta."
        );
      });
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

  const handlerIconPress = () => {
    if (icon === "pencil") {
      setIcon("check");
      setChangeName(user.name);
      setChanging(true);
    } else {
      if (changeName !== user.name) {
        global.name = changeName;
        setUser({ ...user, name: changeName });
        updateUser("name", changeName);
      }
      setIcon("pencil");
      setChanging(false);
    }
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
                name="camera"
                size={20}
                color="#ffffff"
                backgroundColor="#e54e42"
                alignItems="center"
                style={styles.iconStyle}
              />
            </TouchableOpacity>
            <TouchableOpacity style={styles.deleteButton} onPress={deleteImage}>
              <Icon
                type="font-awesome"
                name="trash"
                size={20}
                color="#ffffff"
                backgroundColor="#e54e42"
                alignItems="center"
                style={styles.iconStyle2}
              />
            </TouchableOpacity>
            <View style={styles.informationContainer}>
              <View style={styles.shadow}>
                <View style={{ flexDirection: "row", marginTop: 20 }}>
                  <Text style={styles.titleInformation}>Nombre</Text>
                  <TouchableOpacity
                    onPress={handlerIconPress}
                    style={{ width: 40 }}
                  >
                    <Icon
                      type="font-awesome"
                      name={icon}
                      size={20}
                      color="#2c3e50"
                    />
                  </TouchableOpacity>
                </View>

                {changing ? (
                  <Input
                    style={styles.inputStyle}
                    placeholder="Nombre Completo"
                    value={changeName}
                    onChangeText={(value) => setChangeName(value)}
                    autoCapitalize="words"
                  />
                ) : (
                  <Text style={styles.subtitleInformation}>{user.name}</Text>
                )}
              </View>

              <Overlay
                contentContainerStyle={styles.overStyle}
                isVisible={visibleOverlay}
                onBackdropPress={toggleOverlay}
              >
                <View style={styles.overStyle}>
                  <Text
                    style={{
                      // fontWeight: "bold",
                      textAlign: "center",
                      fontSize: 17,
                      marginTop: 15,
                    }}
                  >
                    Para poder proceder a la eliminación de su cuenta,
                    necesitamos asegurarnos que se trata del usuario de la
                    cuenta, a continuación ingrese su contraseña:
                  </Text>
                  <Input
                    secureTextEntry={true}
                    autoCapitalize="none"
                    onChangeText={(value) => (pass = value)}
                  />
                  <Button
                    theme={{
                      ...DefaultTheme,
                      roundness: 2,
                      colors: {
                        ...DefaultTheme.colors,
                        primary: "#e54e42",
                      },
                    }}
                    onPress={deleteAccount}
                  >
                    ELIMINAR
                  </Button>
                </View>
              </Overlay>

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
              <TouchableOpacity
                style={styles.deleteAccount}
                onPress={toggleOverlay}
              >
                <Text
                  style={{ color: "#e54e42", fontSize: 15, fontWeight: "bold" }}
                >
                  ELIMINAR CUENTA
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </ContentLoader>
    </SafeAreaView>
  );
};

export default UserScreen;
