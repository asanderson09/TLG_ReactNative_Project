import { createAppContainer } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";

import Game from "./views/game/game";
import Landing from "./views/landing/landing";
import Instructions from "./views/landing/instructions";

const AppNavigator = createStackNavigator(
  {
    Game,
    Landing,
    Instructions,
  },
  {
    initialRouteName: "Landing",
  }
);

export default createAppContainer(AppNavigator);
