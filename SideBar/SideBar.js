import React, { useState, useRef, useEffect } from "react";
import { View } from "react-native";
import styles from "./styles";
import {
    Avatar,
    Title,
    Caption,
    Paragraph,
    Drawer,
    Text,
    TouchableRipple,
    Switch,
    Button
} from 'react-native-paper';
import { Icon } from "react-native-elements";

import {
    DrawerContentScrollView,
    DrawerItem,
} from '@react-navigation/drawer';

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

function Sidebar({...props}){
  return(
    <View style={{flex: 1}}>
      <DrawerContentScrollView {...props}>
        <View>
          <View style={styles.userInfoSection}>
            <View style={{flexDirection: 'row', marginTop: 15}}>
              <Avatar.Image
                source={{
                  uri: 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png'
                }}
                size={60}
              />
              <View style={{marginLeft:10}}>
                <Title style={styles.title}>Miguelanggelo Sumoza</Title>
                <Caption style={styles.caption}>@username</Caption>
              </View>
            </View>

            <Drawer.Section style={styles.drawerSection}>
            <DrawerItem
              icon={({color,size}) => (
                <Icon
                  type="font-awesome"
                  name="home"
                  color="#3b99d8"
                />
              )}
              label="Inicio"
              labelStyle={{fontSize: 20, color: "#2d3f50"}}
              /* onPress={} */
            />
            <DrawerItem
              icon={({color,size}) => (
                <Icon
                  type="font-awesome"
                  name="tasks"
                  color="#3b99d8"
                />
              )}
              label="Tus Listas"
              labelStyle={{fontSize: 20, color: "#2d3f50"}}
              /* onPress={} */
            />
            <DrawerItem
              icon={({color,size}) => (
                <Icon
                  type="font-awesome"
                  name="star"
                  color="#3b99d8"
                />
              )}
              label="Importantes"
              labelStyle={{fontSize: 20, color: "#2d3f50"}}
              /* onPress={} */
            />
            <DrawerItem
              icon={({color,size}) => (
                <Icon
                  type="font-awesome"
                  name="search"
                  color="#3b99d8"
                />
              )}
              label="Buscar"
              labelStyle={{fontSize: 20, color: "#2d3f50"}}
              /* onPress={} */
            />
            <DrawerItem
              icon={({color,size}) => (
                <Icon
                  type="font-awesome"
                  name="cog"
                  color="#3b99d8"
                />
              )}
              label="Ajustes"
              labelStyle={{fontSize: 20, color: "#2d3f50"}}
              /* onPress={} */
            />
            </Drawer.Section>


          </View>
        </View>
      </DrawerContentScrollView>
      <Drawer.Section style={styles.bottomDrawerSection}>
        <DrawerItem
          icon={({color,size}) => (
            <Icon
              type="font-awesome"
              name="sign-out"
              color="#e54e42"
            />
          )}
          label="Salir"
          labelStyle={{fontSize: 20, color: "#2d3f50"}}
          onPress={() => singout()}
        />
      </Drawer.Section>
    </View>
  );
}
export default Sidebar;
