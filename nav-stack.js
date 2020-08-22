import Game from "./views/game/game";
import GameOver from "./views/game/game-over";
import Instructions from "./views/landing/instructions";
import Landing from "./views/landing/landing";
import { createAppContainer } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";

const AppNavigator = createStackNavigator(
  {
    Game: {
      screen: Game,
    },
    Landing: {
      screen: Landing,
    },
    Instructions: {
      screen: Instructions,
    },
    GameOver: {
      screen: GameOver,
    },
  },
  {
    initialRouteName: "Landing",
  }
);

export default createAppContainer(AppNavigator);
