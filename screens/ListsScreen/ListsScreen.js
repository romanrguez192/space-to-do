import React, { useState, useRef, useEffect } from "react";
import { Text, FlatList, View, TouchableOpacity, ScrollView, Alert } from "react-native";
import { Input, Icon, ListItem, Avatar, Overlay } from "react-native-elements";
import styles from "./styles";
import { firebase } from "../../firebase/config";
import ContentLoader, {
  FacebookLoader,
  InstagramLoader,
} from "react-native-easy-content-loader";

const ListsScreen = (props) => {
  const [visibleOverlay, setVisibleOverlay] = useState(false);
  const [loading, setLoading] = useState(true);
  const [lists, setLists] = useState(null);

  useEffect(() => {
    getLists(props.route.params.userID);
  }, []);

  const getLists = (userID) => {
    const listsRef = firebase.firestore().collection("lists");
    listsRef
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
      <ContentLoader
        active
        loading={loading}
        avatarStyles={{ display: "none" }}
        listSize={5}
        tHeight={20}
        tWidth={150}
        sTWidth={200}
      ></ContentLoader>
    );
  }

  const toggleOverlay = () => {
    setVisibleOverlay(!visibleOverlay);
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

      firebase
        .firestore()
        .collection("lists")
        .add({
          ...list,
          createdBy: props.route.params.userID,
        })
        .then((ref) => {
          Alert.alert(
            "Lista creado",
            "¡Tu lista ha sido creada correctamente! Vamos a verla."
          );
          // TODO: Colocar navegación hacia la nueva lista
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
          labelStyle={{fontSize:18, color:"#2d3f50"}}
          onChangeText={(value) => handleChangeText("name", value)}
        />
            <Text style={{fontSize:18, color:"#2d3f50", fontWeight:"bold",paddingLeft:10,paddingBottom:10}}>Color de la Lista</Text>
            <View style={{flexDirection: 'row', justifyContent: "center", alignItems: "center", paddingBottom: 20,paddingLeft:10}}>
              <TouchableOpacity style={{paddingRight: 5}}>
               <Icon type= "font-awesome" name= "circle" color= "#3b99d8" size={40}/>
              </TouchableOpacity>
              <TouchableOpacity style={{paddingRight: 5}}> 
               <Icon type= "font-awesome" name= "circle" color= "#e54e42" size={40}/>
              </TouchableOpacity>
              <TouchableOpacity style={{paddingRight: 5}}> 
               <Icon type= "font-awesome" name= "circle" color= "#7b1fa2" size={40}/>
              </TouchableOpacity>
              <TouchableOpacity style={{paddingRight: 5}}> 
               <Icon type= "font-awesome" name= "circle" color= "#43a047" size={40}/>
              </TouchableOpacity>
              <TouchableOpacity style={{paddingRight: 5}}> 
               <Icon type= "font-awesome" name= "circle" color= "#ffea00" size={40}/>
              </TouchableOpacity>
              <TouchableOpacity style={{paddingRight: 5}}> 
               <Icon type= "font-awesome" name= "circle" color= "#ec407a" size={40}/>
              </TouchableOpacity>
       
            </View>
        <TouchableOpacity style={styles.button} onPress={() => createList()}>
          <Text style={styles.buttonText}>Crear lista</Text>
        </TouchableOpacity>
      </View>
    );
  };

  // const listss = [
  //   {
  //     id: "1",
  //     name: "AAA",
  //     theme: "blue",
  //   },
  //   {
  //     id: "2",
  //     name: "Casa",
  //     theme: "yellow",
  //   },
  //   {
  //     id: "3",
  //     name: "Colegio",
  //     theme: "green",
  //   },
  //   {
  //     id: "35",
  //     name: "Colegio",
  //     theme: "green",
  //   },
  //   {
  //     id: "32",
  //     name: "Colegio",
  //     theme: "green",
  //   },
  //   {
  //     id: "322",
  //     name: "Colegio",
  //     theme: "green",
  //   },
  //   {
  //     id: "31",
  //     name: "Colegio",
  //     theme: "green",
  //   },
  //   {
  //     id: "311",
  //     name: "Colegio",
  //     theme: "green",
  //   },
  //   {
  //     id: "3111",
  //     name: "Colegio",
  //     theme: "green",
  //   },
  //   {
  //     id: "3b",
  //     name: "Colegio",
  //     theme: "green",
  //   },
  //   {
  //     id: "3bb",
  //     name: "Colegio",
  //     theme: "green",
  //   },
  //   {
  //     id: "3sg",
  //     name: "Colegio",
  //     theme: "green",
  //   },
  //   {
  //     id: "3gas",
  //     name: "Colegio",
  //     theme: "green",
  //   },
  //   {
  //     id: "3fdsa",
  //     name: "Colegio",
  //     theme: "green",
  //   },
  //   {
  //     id: "3asd",
  //     name: "Colegio",
  //     theme: "green",
  //   },
  // ];

  const renderList = ({ item }) => {
    return (
      <View style={styles.shadow}>
           <TouchableOpacity style={styles.buttonList}>
              <Icon flexDirection='row' type= "font-awesome" name= "list-ul" color= "#3b99d8"/>
              <Text style={styles.nameList}>{item.name}</Text>
           </TouchableOpacity>
           <Text style={{marginLeft: 55, color: "#808080", marginBottom: 10}}>5 Tareas pendientes</Text>
      </View>
    );
  };

  return (
      <View style={styles.vista}>
        <TouchableOpacity
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
        </TouchableOpacity>
        <Overlay isVisible={visibleOverlay} onBackdropPress={toggleOverlay}>
          <CreateList />
        </Overlay>
        <FlatList
          style={{ flex: 1, marginBottom: 50 }}
          data={lists}
          renderItem={renderList}
          keyExtractor={(item) => item.id}
        />
      </View>
  );
};

export default ListsScreen;
