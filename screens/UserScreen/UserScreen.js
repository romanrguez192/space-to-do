import React, { useState, useRef, useEffect } from "react";
import { Text, View } from "react-native";
import styles from "./styles";
import { firebase } from "../../firebase/config";
import ContentLoader, {
  FacebookLoader,
  InstagramLoader,
} from "react-native-easy-content-loader";

const UserScreen = () => {

  

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
            <Avatar containerStyle={styles.imgProfile} title="CD" source={image}/>
            <Text style={styles.userStyle}>{user.name}</Text>
            <TouchableOpacity style={styles.editButton}
            >
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
                <Text style={styles.subtitleInformation}>José Saad</Text>
              </View>
              <View style={styles.shadow}>
                <Text style={styles.titleInformation}>Correo Electrónico</Text>
                <Text style={styles.subtitleInformation}>tugatitasalvaje@gmail.com</Text>
              </View>
              <View style={styles.shadow}>
                <Text style={styles.titleInformation}>Género</Text>
                <Text style={styles.subtitleInformation}>Masculino</Text>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </ContentLoader>
    </SafeAreaView>
  );
};

export default UserScreen;
