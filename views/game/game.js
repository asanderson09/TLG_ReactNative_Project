import { AppState, Dimensions, StatusBar, Vibration, View } from "react-native";
import { CodeSym, Computer, Duck, Email, Floor, Rocket } from "./renderers";
import { Physics, Tilt, Trajectory } from "./systems";
import React, { PureComponent } from "react";

import { Accelerometer } from "expo-sensors";
import { GameEngine } from "react-native-game-engine";
import GameOver from "./game-over";
import Matter from "matter-js";
import Score from "./score";
import backgroundImage from "../../assets/images/overlay-back.png";
import { get } from "lodash";
import randomInt from "random-int";
import styles from "./game-styles";

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
  // Accelerometer finds phone's (x, y) tilt orientation
  // and we set { xtilt, ytilt} to rocket's entity physics
  componentDidMount() {
    this._subscription = Accelerometer.addListener(({ x, y }) => {
      Matter.Body.set(this.refs.engine.state.entities.rocket.body, {
        xtilt: x,
        ytilt: y,
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
          const increase = Math.floor(score / 30);
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
      // if codeSym reaches floor, reset position
      if (objA === "floor" && objB === "codeSym") {
        Matter.Body.setPosition(pairs[0].bodyB, {
          x: randomInt(1, width - 10),
          y: 0,
        });
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
      // if obstacle hits rocket, show overlay, aka. set score and gameover
      if (objA === "rocket" && objB === "obstacle") {
        this.setState({ showOverlay: true });
        //vibration when nerd hits obstacle
        Vibration.vibrate(1000);
      }
    });
  };
  // old stars
  get codeSyms() {
    const codeSyms = {};
    for (let x = 1; x <= STAR_COUNT; x++) {
      const size = randomInt(10, 20);
      Object.assign(codeSyms, {
        [`star_${x}`]: {
          body: Matter.Bodies.rectangle(
            randomInt(1, width - 10),
            randomInt(0, height),
            size,
            size,
            {
              frictionAir: 0.1,
              isSensor: true,
              label: "codeSym",
            }
          ),
          opacity: randomInt(1, 5) / 10,
          size: [size, size],
          renderer: CodeSym,
        },
      });
    }

    const starsInWorld = Object.values(codeSyms).map((codeSym) => codeSym.body);
    return { codeSyms, starsInWorld };
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
      randomInt(0, -100),
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
      randomInt(0, -50),
      50,
      90,
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

  getDuck = () => {
    const body = Matter.Bodies.rectangle(
      randomInt(1, width - 50),
      randomInt(0, -120),
      75,
      75,
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
      xtilt: 0,
      ytilt: 0,
      label: "rocket",
    });
    const floor = Matter.Bodies.rectangle(width / 2, height, width + 100, 10, {
      isStatic: true,
      isSensor: true,
      label: "floor",
    });
    const { obstacles, bodies } = this.obstacles;
    const { codeSyms, starsInWorld } = this.codeSyms;
    //
    this.setupCollisionHandler(engine);
    Matter.World.add(world, [rocket, floor, ...bodies, ...starsInWorld]);

    return {
      physics: {
        engine,
        world,
      },
      ...codeSyms,
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
