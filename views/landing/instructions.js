import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { View, ImageBackground, AsyncStorage } from "react-native";
import { Text } from "../../components/text/text";
import overlayBack from "../../assets/images/overlay-back.png";
import { Button, Icon, Overlay } from "react-native-elements";

import instructionStyles from "./instructions-styles";

const Instructions = () => {
  return (
    <ImageBackground
      source={overlayBack}
      style={instructionStyles.overlay}
      imageStyle={{ opacity: 0.8, backgroundColor: "rgba(0,0,0,.6)" }}
    >
      <View style={instructionStyles.container}>
        <Text h1 h1style={instructionStyles.title}>
          Instructions
        </Text>
        <Text> </Text>
        <Text style={instructionStyles.instructionText}>
          Avoid all Work to become a Sr Dev!!
        </Text>

        <Text h2> </Text>
        <Text h3>Obstacles</Text>
        <Text style={instructionStyles.legendText}>Email :</Text>
        <Text style={instructionStyles.legendText}>Computer :</Text>
        <Text style={instructionStyles.legendText}>Other :</Text>
        <Text h2> </Text>

        <Text h3>Power Ups</Text>
        <Text style={instructionStyles.futureText}>COMING SOON!</Text>
      </View>
    </ImageBackground>
  );
};

export default Instructions;
