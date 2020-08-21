import { StyleSheet, ImageBackground } from "react-native";
import backgroundImage from "../../assets/images/overlay-back.png";
const image = { backgroundImage };

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#9d9d9d",
  },
  image: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
  },
  overlayText: {
    color: "#FFF",
    marginVertical: 10,
  },
  overlay: {
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "100%",
  },
  button: {
    backgroundColor: "#FFF",
    marginVertical: 40,
  },
  buttonTitle: {
    color: "#BB1F13",
    fontSize: 25,
    marginHorizontal: 5,
  },
});

export default styles;
