import { StyleSheet, Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    justifyContent: "space-around",
    alignItems: "center",
    flex: 1,
  },
  video: {
    height,
    width,
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    position: "absolute",
  },
  button: {
    backgroundColor: "#FFF",
    borderRadius: 50,
    width: 200,
    opacity: 0.8,
    margin: 2,
  },
  buttonTitle: {
    color: "#BB1F13",
    fontSize: 25,
  },
  title: {
    color: "#FFF",
    marginVertical: 20,
  },
  titleContainer: {
    justifyContent: "space-around",
    alignItems: "center",
  },
  highScore: {
    color: "red",
    fontSize: 18,
  },
});

export default styles;
