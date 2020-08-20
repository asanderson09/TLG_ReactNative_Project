import * as Font from "expo-font";

import React, { PureComponent } from "react";

import { AppLoading } from "expo";
import AppNavigator from "./nav-stack";
import { Asset } from "expo-asset";

export default class App extends PureComponent {
  state = {
    isLoadingComplete: false,
  };

  loadResourcesAsync = async () =>
    Promise.all([
      Asset.loadAsync([
        require("./assets/images/icon.png"),
        require("./assets/images/overlay-back.png"),

        // was old planet
        require("./assets/images/email.png"),
        // was old rocket
        require("./assets/images/nerd.png"),
        // was old satellite
        require("./assets/images/computer.png"),
        require("./assets/images/splash.png"),
        require("./assets/images/star.png"),
        // was old UFO
        require("./assets/images/duck.gif"),

      ]),
      Font.loadAsync({
        orbitron: require("./assets/fonts/Orbitron-VariableFont-wght.ttf"),
      }),
    ]);

  handleLoadingError = (error) => {
    console.warn(error);
  };

  handleFinishLoading = () => {
    this.setState({ isLoadingComplete: true });
  };

  render() {
    if (!this.state.isLoadingComplete) {
      return (
        <AppLoading
          startAsync={this.loadResourcesAsync}
          onError={this.handleLoadingError}
          onFinish={this.handleFinishLoading}
        />
      );
    }

    return <AppNavigator />;
  }
}
