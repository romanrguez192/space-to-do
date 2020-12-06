import React from "react";
import { View } from 'react-native';
import { Avatar } from "react-native-elements";

const ProfilePicture = (props) => {

  const getTitleByName = (name) => {
    let resul = name.toUpperCase().charAt(0);
    if (name.indexOf(" ") + 1 === 0) return resul;
    return resul.concat(name.toUpperCase().charAt(name.indexOf(" ") + 1));
  };

  return (
    <View>
      {props.user.imageID === "" ? (
        <Avatar
          size="medium"
          title={getTitleByName(props.user.name)}
          containerStyle={{ backgroundColor: props.user.avatarColor }}
        />
      ) : (
        <Avatar size="medium" source={{ uri: props.image.uri }} />
      )}
    </View>
  );
};

export default ProfilePicture;
