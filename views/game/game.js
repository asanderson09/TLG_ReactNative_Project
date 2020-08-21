import { AppState, Dimensions, StatusBar, Vibration, View } from "react-native";
import { Computer, Duck, Email, Floor, Rocket, Star } from "./renderers";
import { Physics, Tilt, Trajectory } from "./systems";
import React, { PureComponent } from "react";

import { Accelerometer } from "expo-sensors";
import { GameEngine } from "react-native-game-engine";
import GameOver from "./game-over";
import Matter from "matter-js";
import Score from "./score";
import { get } from "lodash";
import randomInt from "random-int";
import styles from "./game-styles";
import backgroundImage from "../../assets/images/overlay-back.png";

const image = { backgroundImage };
const STAR_COUNT = 20;
const INIT_COMPLEXITY = 3;
const { width, height } = Dimensions.get("window");

let COUNTER = 1;

class Game extends PureComponent {
  static navigationOptions = {
    headerShown: false,
  };

  constructor(props) {
    super(props);

    this.state = this.initState;
  }

  componentDidMount() {
    this._subscription = Accelerometer.addListener(({ x }) => {
      Matter.Body.set(this.refs.engine.state.entities.rocket.body, {
        tilt: x,
      });
    });

    this.incrementScore();
    AppState.addEventListener("change", this.handleAppStateChange);
  }

  componentDidUpdate(prevProps, prevState) {
    const { complexity } = this.state;
    if (complexity !== prevState.complexity && complexity !== INIT_COMPLEXITY) {
      const { world } = this.refs.engine.props.entities.physics;
      const { obstacle, body } = this.obstacle;

      Matter.World.addBody(world, body);
      const updatedObstacles = {
        ...this.state.entities,
        [`obstacle_${COUNTER}`]: obstacle,
      };

      COUNTER += 1;

      this.setState({ entities: updatedObstacles }, () =>
        this.refs.engine.swap(updatedObstacles)
      );
    }
  }

  componentWillUnmount() {
    this._subscription && this._subscription.remove();
    this._subscription = null;
    AppState.removeEventListener("change", this.handleAppStateChange);
  }

  handleAppStateChange = (nextAppState) => {
    this.setState({ appState: nextAppState }, this.incrementScore);
  };

  reloadApp = () => {
    const { engine } = this.state.entities.physics;
    Matter.World.clear(engine.world);
    Matter.Engine.clear(engine);
    Matter.Events.off(engine, "collisionStart"); // clear all past events;

    const newState = {
      ...this.initState,
    };
    this.setState(newState, () => {
      this.refs.engine.swap(newState.entities);
      this.incrementScore();
    });
  };

  incrementScore = () => {
    const { showOverlay, appState } = this.state;
    if (!showOverlay && appState === "active") {
      this.setState(
        ({ score }) => {
          const increase = Math.floor(score / 50);
          const complexity = increase < 3 ? 3 : increase;

          return { score: score + 1, complexity };
        },
        () => setTimeout(this.incrementScore, 100)
      );
    }
  };

  setupCollisionHandler = (engine) => {
    Matter.Events.on(engine, "collisionStart", (event) => {
      const { pairs } = event;
      const objA = pairs[0].bodyA.label;
      const objB = pairs[0].bodyB.label;
      // if star reaches floor, reset position
      if (objA === "floor" && objB === "star") {
        Matter.Body.setPosition(pairs[0].bodyB, {
          x: randomInt(1, width - 10),
          y: 0,
        });
      }
      // if obstacle collides another obstacle, bounce away
      if (objA === "obstacle" && objB === "obstacle") {
      }
      // if obstacle reaches floor, reset position and trajectory
      if (objA === "floor" && objB === "obstacle") {
        Matter.Body.set(pairs[0].bodyB, {
          trajectory: randomInt(-5, 5) / 10,
        });
        Matter.Body.setPosition(pairs[0].bodyB, {
          x: randomInt(1, width - 30),
          y: randomInt(0, -100),
        });
      }
      // if obstacle hits nerd, show overlay, aka. set score and gameover
      if (objA === "rocket" && objB === "obstacle") {
        this.setState({ showOverlay: true });
        //vibration when nerd hits obstacle
        Vibration.vibrate(1000);
      }
    });
  };

  get stars() {
    const stars = {};
    for (let x = 1; x <= STAR_COUNT; x++) {
      const size = randomInt(10, 20);
      Object.assign(stars, {
        [`star_${x}`]: {
          body: Matter.Bodies.rectangle(
            randomInt(1, width - 10),
            randomInt(0, height),
            size,
            size,
            {
              frictionAir: 0.1,
              isSensor: true,
              label: "star",
            }
          ),
          opacity: randomInt(1, 5) / 10,
          size: [size, size],
          renderer: Star,
        },
      });
    }

    const starsInWorld = Object.values(stars).map((star) => star.body);
    return { stars, starsInWorld };
  }
  //  pick a number between 0 and 2, and choose that element in the options array
  get obstacle() {
    const options = [this.getComputer, this.getEmail, this.getDuck];
    const element = randomInt(0, options.length - 1);
    const { obstacle, body } = options[element]();

    return { obstacle, body };
  }
  // create computer matter AND physics -> .rectangle( x, y, width, height, [options])
  getComputer = () => {
    const body = Matter.Bodies.rectangle(
      randomInt(1, width - 50),
      randomInt(0, -200),
      60,
      34,
      {
        isStatic: false,
        frictionAir: 0.15,
        label: "obstacle",
        trajectory: randomInt(-5, 5) / 10,
      }
    );
    const computer = { body, size: [75, 50], renderer: Computer };

    return { obstacle: computer, body };
  };
  // email
  getEmail = () => {
    const body = Matter.Bodies.rectangle(
      randomInt(1, width - 50),
      randomInt(0, -200),
      70,
      35,
      {
        isStatic: false,
        frictionAir: 0.15,
        label: "obstacle",
        trajectory: randomInt(-5, 5) / 10,
      }
    );
    const email = { body, size: [75, 50], renderer: Email };

    return { obstacle: email, body };
  };
  // duck
  getDuck = () => {
    const body = Matter.Bodies.rectangle(
      randomInt(1, width - 50),
      randomInt(0, -200),
      75,
      20,
      {
        isStatic: false,
        frictionAir: 0.15,
        label: "obstacle",
        trajectory: randomInt(-5, 5) / 10,
      }
    );
    const duck = { body, size: [50, 20], renderer: Duck };

    return { obstacle: duck, body };
  };
  // create obstacles array
  get obstacles() {
    const obstacles = {};
    const bodies = [];
    // start with 3 obstacles
    for (let i = 0; i < 3; i++) {
      const { obstacle, body } = this.obstacle;
      Object.assign(obstacles, { [`obstacle_${COUNTER}`]: obstacle });
      bodies.push(body);

      COUNTER += 1;
    }

    return { obstacles, bodies };
  }

  get initState() {
    return {
      complexity: INIT_COMPLEXITY,
      score: 0,
      entities: this.entities,
      showOverlay: false,
      appState: "active",
      objectCounter: 1,
    };
  }
  // entities are the pieces that interact and carry form
  get entities() {
    const engine =
      get(this, "state.entities.physics.engine") ||
      Matter.Engine.create({ enableSleeping: false });
    const { world } = engine;
    const rocket = Matter.Bodies.rectangle(width / 2, height - 120, 25, 50, {
      isStatic: true,
      tilt: 0,
      label: "rocket",
    });
    const floor = Matter.Bodies.rectangle(width / 2, height, width + 100, 10, {
      isStatic: true,
      isSensor: true,
      label: "floor",
    });
    const { obstacles, bodies } = this.obstacles;
    const { stars, starsInWorld } = this.stars;
    //
    this.setupCollisionHandler(engine);
    Matter.World.add(world, [rocket, floor, ...bodies, ...starsInWorld]);

    return {
      physics: {
        engine,
        world,
      },
      ...stars,
      ...obstacles,
      rocket: { body: rocket, size: [50, 100], renderer: Rocket },
      floor: {
        body: floor,
        size: [width + 100, 5],
        renderer: Floor,
      },
    };
  }

  render() {
    const { showOverlay, entities, score, appState } = this.state;

    return (
      <GameEngine
        style={styles.container}
        ref="engine"
        systems={[Physics, Tilt, Trajectory]}
        entities={entities}
        running={appState === "active"}
      >
        <Score score={score} />
        <StatusBar hidden />
        <GameOver
          showOverlay={showOverlay}
          score={score}
          reloadApp={this.reloadApp}
        />
      </GameEngine>
    );
  }
}

export default Game;
