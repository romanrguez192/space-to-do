import { StyleSheet, Dimensions } from "react-native";

// Dimensiones de la ventana
const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

// Estilos
export default StyleSheet.create({
  areaview: {
    flex: 1,
    backgroundColor: "#fff",
  },
  keyboardstyle: {
    flexGrow: 1,
  },
  container: {
    backgroundColor: "#fff",
    paddingLeft: 25,
    paddingRight: 25,
    paddingBottom: 25,
  },
  buttonStyle: {
    paddingBottom: 15,
    paddingLeft: 20,
    paddingRight: 20,
  },  
  iconStyle: {
    width: 50,
    height: 50,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  messageStyle: {
    color: "#2d3f50",
    fontSize: 40,
    paddingBottom: 30,
    textAlign: "center",
    overflow: "hidden",
  },
  ButtonContainer1: {
    justifyContent: "center",
    flexDirection: 'row',
    alignItems: "center",
    alignSelf: "center",
  },
});
