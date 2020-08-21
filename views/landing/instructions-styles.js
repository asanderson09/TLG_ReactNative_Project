import { StyleSheet } from "react-native";

const instructionStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#9d9d9d",
  },
  overlay: {
    justifyContent: "space-evenly",
    alignItems: "center",
    width: "100%",
    height: "100%",
  },
  button: {
    backgroundColor: "#FFF",
    borderRadius: 50,
    width: 200,
    opacity: 0.8,
    margin: 2,
  },
  buttonTitle: {
    color: "green",
    fontSize: 25,
  },
  instructionText: {
    fontSize: 25,
    color: "blue",
  },
  legendText: {
    fontSize: 23,
    color: "darkred",
  },

  titleContainer: {
    justifyContent: "space-around",
    alignItems: "center",
  },
  futureText: {
    fontSize: 25,
    color: "green",
  },
});

export default instructionStyles;
