import { StyleSheet, Dimensions } from "react-native";

// Dimensiones de la ventana
const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

// Estilos
export default StyleSheet.create({
    nameList: {
        fontSize: 20,
        color: "#2d3f50",
        marginLeft: 10,
        fontWeight: "400",
      },
      shadow: {
        marginTop: 10,
        marginBottom: 10,
        marginLeft: 20,
        marginRight: 20,
        backgroundColor:"#fff",
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 4,
        },
        shadowOpacity: 0.32,
        shadowRadius: 5.46,
        elevation: 9,
      },
      buttonList: {
        flexDirection: 'row',
        marginLeft: 20,
        marginTop: 10,
        marginRight: 20,
        height: 40,
        width: windowWidth * 0.48,
        alignItems: "center",
        marginBottom: 10,
      },
      nameListStyle: {
        fontSize: 25,
        color: "#fff",
        fontWeight: "bold",
      },
      subtitleStyle: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#2d3f50",
        paddingBottom: 25,
      },
    
      titleStyle: {
        flexDirection: 'row',
        borderBottomLeftRadius: 50,
        paddingLeft: 25,
        paddingTop: 20,
        paddingBottom: 20,
        backgroundColor:"#3b99d8",
        marginBottom: 25,
      },
      container: {
        marginTop: 20,
      },
});
