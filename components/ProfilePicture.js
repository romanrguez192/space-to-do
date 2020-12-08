import React, { useEffect, useState } from "react";
import { View } from 'react-native';
import { Avatar } from "react-native-elements";

const ProfilePicture = (props) => {

  const [user, setUser] = useState({
    name: "",
    email: "",
    gender: "",
    imageID: "",
    username: "",
    avatarColor: "",
    id:"",
  });

  const getTitleByName = (name) => {
    let resul = name.toUpperCase().charAt(0);
    if (name.indexOf(" ") + 1 === 0) return resul;
    return resul.concat(name.toUpperCase().charAt(name.indexOf(" ") + 1));
  };

  useEffect(()=>{
    getUserByID(props.userID)
  },[])

  const getUserByID = async (id) => {
    const dbRef = firebase.firestore().collection("users").doc(id);
    const doc = await dbRef.get();
    const resul = doc.data();
    setUser(resul);
  };

  return (
    <View>
      {props.image === "" ? (
        <Avatar
          size="medium"
          title={getTitleByName(user.name)}
          containerStyle={{ backgroundColor: user.avatarColor }, props.style}
        />
      ) : (
        <Avatar 
          size="medium" 
          source={{ uri: props.image }} 
          containerStyle={props.style}

        />
      )}
    </View>
  );
};

export default ProfilePicture;
