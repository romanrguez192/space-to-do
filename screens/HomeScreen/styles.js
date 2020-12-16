import { StyleSheet, Dimensions, ImageBackground } from "react-native";
import { block } from "react-native-reanimated";

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
  categoriesItemContainer: {
    flex: 1,
    margin: 10,
    justifyContent: 'center',
    alignItems: 'center',
    height: 215,
    borderColor: '#cccccc',
    borderWidth: 0.5,
    borderRadius: 20,
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
    paddingBottom: 20,
    textAlign: "center",
    overflow: "hidden",
    paddingTop: 20,
    fontWeight: 'bold',
  },
  fondo: {
    resizeMode: 'contain',
    width: windowWidth,
    height: windowHeight *0.9,
    left: -25,
    top: -200,

  },
  categoriesItemContainer: {
    flex: 1,
    margin: 10,
    justifyContent: 'center',
    alignItems: 'center',
    height: windowHeight * 0.10,
    borderColor: '#cccccc',
    borderWidth: 0.5,
    borderRadius: 30,
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
});
