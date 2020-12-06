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
  },
  pantContainer: {
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
  },
  titleIMG:{
    color: "#fff"
  },
  categoriesPhoto: {
    width: windowWidth * 0.8,
    height: windowHeight * 0.25,
    borderRadius: 30,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 7,
    },
    shadowOpacity: 0.43,
    shadowRadius: 9.51,
    elevation: 15,
  },
  categoriesName: {
    flex: 1,
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 8,
    height: 12,
    color: "#2d3f50"
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
});
