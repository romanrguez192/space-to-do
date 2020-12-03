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
    alignItems: "center",
    paddingLeft: 25,
    paddingRight: 25,
    paddingBottom: 25,
  },
  addButton: {
    backgroundColor: "#e54e42",
    height: 60,
    width: 60,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 50,
    
  },
});
