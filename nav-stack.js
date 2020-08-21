import { createAppContainer } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";

import Game from "./views/game/game";
import Landing from "./views/landing/landing";
import Instructions from "./views/landing/instructions";
import GameOver from "./views/game/game-over";

const AppNavigator = createStackNavigator(
  {
    Game,
    Landing,
    Instructions,
    GameOver,
  },
  {
    initialRouteName: "Landing",
  }
);

export default createAppContainer(AppNavigator);
