import { StyleSheet, Dimensions } from "react-native";

// Dimensiones de la ventana
const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

// Estilos
export default StyleSheet.create({
  shadow: {
    height: 70,
    top: -25,
    justifyContent: "center",
    backgroundColor:"#fff",
    marginTop: 10,
    shadowColor: "#000",
  },
  imgProfile:{
    width: windowWidth,
    resizeMode: 'contain',
    height: windowWidth,
  },
  container: {
    backgroundColor: "#fff",
  },
  userStyle: {
    fontSize: 40,
    color: "#fff",
    fontWeight: "bold",
    marginLeft: 30,
    top: -70,
  },
  editButton: {
    zIndex: 100,
    width: 50,
    height: 50,
    left: windowWidth * 0.75,
    top: -80,
    borderRadius: 50,
    backgroundColor:"#e54e42",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.32,
    shadowRadius: 5.46,
    elevation: 9,
  },
  iconStyle: {
    width: 50,
    height: 50,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  informationContainer: {
    backgroundColor: "#fff",
    top: -75,
  },
  titleInformation: {
    fontSize: 18,
    color: "#2d3f50",
    fontWeight: "bold",
    marginBottom: 5,
    marginLeft: 25,
  },
  subtitleInformation: {
    fontSize: 18,
    color: "#bbb",
    marginLeft: 25,
  },
});
