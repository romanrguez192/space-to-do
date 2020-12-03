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
  buttonText2: {
    marginBottom: 20,
    marginTop: 20,
    fontSize: 16,
    fontWeight: "bold",
    color: "#2c279f",
    flexDirection: 'row',
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
    backgroundColor: "#e54e42",
    marginTop: 20,
    paddingHorizontal: 80,
    paddingVertical: 15,
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
