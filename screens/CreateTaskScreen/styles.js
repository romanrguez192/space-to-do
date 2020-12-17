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
  shadow: {
    marginTop: 25,
    marginBottom: 25,
    borderRadius: 10,
    width: windowWidth * 0.85,
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
  pickerStyle: {
    backgroundColor: "#fff",
    width: windowWidth * 0.25,
    flex: 1,
    alignContent: 'center',
    justifyContent: 'center',

  }
});
