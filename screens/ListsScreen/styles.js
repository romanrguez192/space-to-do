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
    alignItems: 'center',
  },
  areaview: {
    flex: 1,
    backgroundColor: "#fff",
  },
  vista: {
    flex: 1,
  },
  buttonAddStyle: {
    position: "absolute",
    marginTop: windowHeight * 0.8,
    marginLeft: windowWidth * 0.75,
    zIndex: 100,
    elevation: 3,
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
    fontSize:20,
    textAlign:"center", 
    marginTop: 20, 
    marginBottom: 50,
    fontWeight: "500",
  },
  nameList: {
    fontSize: 20,
    color: "#2d3f50",
    marginLeft: 10,
    fontWeight: "400",
  },
  buttonList: {
    flexDirection: 'row',
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
  scrollContainer: {
    height: 60,
    width: windowWidth * 0.7,
  },
});
