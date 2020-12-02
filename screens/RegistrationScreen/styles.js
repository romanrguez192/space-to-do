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
  textTitle: {
    fontWeight: "bold",
    color: "#2d3f50",
    fontSize: 16,
    marginBottom: 10,
  },
  bienvenida: {
    color: "#2d3f50",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    marginTop: 20,
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
    backgroundColor: "#e54e42",
    marginTop: 20,
    paddingHorizontal: 80,
    paddingVertical: 15,
    borderRadius: 5,
    marginBottom: 20,
  },
  button2: {
    backgroundColor: "pink",
    marginTop: 20,
    paddingHorizontal: 30,
    paddingVertical: 30,
    borderRadius: 5,
  },
  buttonText: {
    fontSize: 20,
    color: "#fff",
  },
  logo: {
    width: windowWidth * 0.6,
    height: windowHeight * 0.4,
    resizeMode: "contain",
  },
});
