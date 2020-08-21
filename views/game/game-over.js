import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { ImageBackground, AsyncStorage, View } from "react-native";
import { Button, Icon, Overlay } from "react-native-elements";
import overlayBack from "../../assets/images/overlay-back.png";
import styles from "./game-styles";
import { Text } from "../../components/text/text";
import { Landing } from "../landing/landing";

const KEY = "@shaky-shuttle:high-score";

const GameOver = ({ showOverlay, score, reloadApp, navigation }) => {
  const [highScore, setHighScore] = useState("0");
  const [Score1, setScore1] = useState("0");
  const [Score2, setScore2] = useState("0");
  const [Score3, setScore3] = useState("0");
  const [Score4, setScore4] = useState("0");
  const [Score5, setScore5] = useState("0");

  const storeData = async () => {
    if (showOverlay) {
      try {
        const highScore = (await AsyncStorage.getItem(KEY)) || "0";

        if (score > parseInt(Score1, 10)) {
          setScore1(score);
          setScore2(Score1);
          setScore3(Score2);
          setScore4(Score3);
          setScore5(Score4);
          await AsyncStorage.setItem(KEY, String(score));
        } else if (score > parseInt(Score2)) {
          setScore2(score);
          setScore3(Score2);
          setScore4(Score3);
          setScore5(Score4);
          await AsyncStorage.setItem(KEY, String(score));
        } else if (score > parseInt(Score3)) {
          setScore3(score);
          setScore4(Score3);
          setScore5(Score4);
          await AsyncStorage.setItem(KEY, String(score));
        } else if (score > parseInt(Score4)) {
          setScore4(score);
          setScore5(Score4);
          await AsyncStorage.setItem(KEY, String(score));
        } else if (score > parseInt(Score5)) {
          setScore5(score);
          await AsyncStorage.setItem(KEY, String(score));
        }
      } catch (error) {
        console.error("error saving high score");
      }
    }
  };

  useEffect(() => {
    storeData();
  }, [showOverlay]);

  return (
    <Overlay isVisible={showOverlay}>
      <ImageBackground
        source={overlayBack}
        style={styles.overlay}
        imageStyle={{ opacity: 0.8, backgroundColor: "rgba(0,0,0,.6)" }}
      >
        <Text h1 h1Style={styles.overlayText}>
          Score
        </Text>
        <Text h3 h3Style={styles.overlayText}>
          {score}
        </Text>
        <Text style={styles.overlayText}>High Scores</Text>
        <Text style={styles.overlayText}>1 - {Score1}</Text>
        <Text style={styles.overlayText}>2 - {Score2}</Text>
        <Text style={styles.overlayText}>3 - {Score3}</Text>
        <Text style={styles.overlayText}>4 - {Score4}</Text>
        <Text style={styles.overlayText}>5 - {Score5}</Text>
        <Button
          title="Restart"
          buttonStyle={styles.button}
          titleStyle={styles.buttonTitle}
          onPress={reloadApp}
          icon={<Icon size={25} type="font-awesome" color="#BB1F13" />}
          iconRight
        />
        <Button
          title="Home"
          buttonStyle={styles.button}
          titleStyle={styles.buttonTitle}
          onPress={() => navigation.navigate({ Landing })}
          icon={<Icon size={25} type="font-awesome" color="#BB1F13" />}
          iconRight
        />
      </ImageBackground>
    </Overlay>
  );
};

GameOver.propTypes = {
  showOverlay: PropTypes.bool.isRequired,
  score: PropTypes.number.isRequired,
  reloadApp: PropTypes.func.isRequired,
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
};

export default GameOver;
