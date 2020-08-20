import { Image, View } from "react-native";

import React from "react";
import computer from "../../assets/images/computer.png";
import duck from "../../assets/images/duck.gif";
import email from "../../assets/images/email.png";
import rocket from "../../assets/images/nerd.png";
import star from "../../assets/images/star.png";
import styles from "./renderers-styles";

const Rocket = ({ body, size }) => {
  const { position } = body;
  const sizeWidth = size[0];
  const sizeHeight = size[1];
  const x = position.x - sizeWidth / 2;
  const { y } = position;

  return (
    <Image
      source={rocket}
      style={[
        styles.rocket,
        {
          left: x,
          top: y,
          width: sizeWidth,
          height: sizeHeight,
        },
      ]}
    />
  );
};

const Computer = ({ body, size }) => {
  const { position } = body;
  const sizeWidth = size[0];
  const sizeHeight = size[1];
  const x = position.x - sizeWidth / 2;
  const { y } = position;

  return (
    <Image
      source={computer}
      style={[
        styles.computer,
        {
          left: x,
          top: y,
          width: sizeWidth,
          height: sizeHeight,
        },
      ]}
    />
  );
};

const Email = ({ body, size }) => {
  const sizeWidth = size[0];
  const sizeHeight = size[1];
  const { position } = body;
  const x = position.x - sizeWidth / 2;
  const { y } = position;

  return (
    <Image
      source={email}
      style={[
        styles.computer,
        {
          left: x,
          top: y,
          width: sizeWidth,
          height: sizeHeight,
        },
      ]}
    />
  );
};

const Star = ({ body, size, opacity }) => {
  const sizeWidth = size[0];
  const sizeHeight = size[1];
  const x = body.position.x - sizeWidth / 2;
  const y = body.position.y - sizeHeight / 2;

  return (
    <Image
      source={star}
      style={[
        styles.star,
        {
          left: x,
          top: y,
          width: sizeWidth,
          height: sizeHeight,
          opacity,
        },
      ]}
    />
  );
};

const Duck = ({ body, size }) => {
  const sizeWidth = size[0];
  const sizeHeight = size[1];
  const x = body.position.x - sizeWidth / 2;
  const y = body.position.y - sizeHeight / 2;

  return (
    <Image
      source={duck}
      style={[
        styles.duck,
        {
          left: x,
          top: y,
        },
      ]}
    />
  );
};

const Floor = ({ body, size }) => {
  const width = size[0];
  const height = size[1];

  const x = body.position.x - width / 2;
  const y = body.position.y - height / 2;

  return (
    <View
      style={{
        position: "absolute",
        left: x,
        top: y,
        width,
        height,
        backgroundColor: "transparent",
      }}
    />
  );
};

export { Rocket, Floor, Star, Computer, Email, Duck };
