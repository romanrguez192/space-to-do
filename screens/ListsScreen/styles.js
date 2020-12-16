import { StyleSheet, Dimensions } from "react-native";

// Dimensiones de la ventana
const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

// Estilos
export default StyleSheet.create({
  button: {
    backgroundColor: "#e54e42",
    paddingHorizontal: 80,
    paddingVertical: 15,
    borderRadius: 5,
    marginBottom: 20,
    alignItems: "center",
  },
  areaview: {
    flex: 1,
    backgroundColor: "#fff",
  },
  vista: {
    flex: 1,
  },

  iconStyle: {
    width: 50,
    height: 50,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    fontSize: 20,
    color: "#fff",
  },
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
  messageStyle: {
    color: "#2d3f50",
    fontSize: 20,
    textAlign: "center",
    marginTop: 20,
    marginBottom: 50,
    fontWeight: "500",
  },
  nameList: {
    fontSize: 18,
    color: "#2d3f50",
    marginLeft: 14,
    fontWeight: "400",
  },
  buttonList: {
    flexDirection: "row",
    marginLeft: 20,
    marginTop: 10,
    marginRight: 20,
    height: 40,
    alignItems: "center",
  },
  shadow: {
    borderRadius: 10,
    marginTop: 10,
    marginBottom: 10,
    marginLeft: 20,
    marginRight: 20,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.32,
    shadowRadius: 5.46,
    elevation: 9,
  },
  scrollContainer: {
    height: 60,
    width: windowWidth * 0.7,
  },
  fondo: {
    width: windowWidth,
    height: windowHeight * 0.9,
  },
  options: {
    textAlign: "center",
    fontSize: 20,
    paddingTop: 10,
    paddingBottom: 10,
    paddingHorizontal: 20,
  },
  buttonOptions: {
    flexDirection: "row",
    height: 40,
    alignItems: "center",
    borderRadius: 5,
    borderBottomWidth: 4,
    borderBottomColor: "#FC3A2F",
  },
});
