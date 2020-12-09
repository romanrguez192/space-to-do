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
  inputText: {
    color: "#2d3f50",
  },
  button: {
    marginTop: 20,
    paddingHorizontal: 80,
    paddingVertical: 15,
    borderRadius: 5,
    marginBottom: 20,
  },
  buttonText: {
    fontSize: 20,
    color: "#fff",
  },
});
