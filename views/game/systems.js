import { Dimensions } from "react-native";
import Matter from "matter-js";
import randomInt from "random-int";

const { width, height } = Dimensions.get("window");
// where the nerd is and how it moves
const Tilt = (state) => {
  const { rocket } = state;
  const xTilt = rocket.body.xtilt;
  const yTilt = rocket.body.ytilt;
  let xPos = rocket.body.position.x;
  let yPos = rocket.body.position.y;
  // if nerd attempts to go out of bounds, keep in
  if (xPos >= width - 25 && xTilt > 0) {
    xPos = width - 25;
  } else if (xPos <= 25 && xTilt < 0) {
    xPos = 25;
  } else {
    // turn on a dime or like a semi-truck
    xPos += xTilt * 20;
  }
  // give rocket a small range of freedom in the y direction
  if (yPos >= height - 200 && yTilt > 0) {
    yPos = height - 200;
  } else if (yPos <= height - 120 && yTilt < 0) {
    yPos = height - 120;
  } else {
    // turn on a dime or like a semi-truck
    yPos += yTilt * 2;
  }

  // set nerd's y-position to a fixed amount, set x-position to changing xPos
  Matter.Body.setPosition(rocket.body, {
    x: xPos,
    y: yPos,
  });

  return state;
};
// trajectory sets path for entities that are obstacles
const Trajectory = (entities) => {
  const obstacles = Object.values(entities).filter(
    (item) => item.body && item.body.label === "obstacle"
  );
  // if obstcle starts out of bounds, give a slight curved path to follow and reposition initial position
  obstacles.forEach((item) => {
    if (item.body.position.x > width || item.body.position.x < 0) {
      Matter.Body.set(item.body, {
        trajectory: randomInt(-5, 5) / 10,
      });
      Matter.Body.setPosition(item.body, {
        x: randomInt(0, width - 30),
        y: 0,
      });
    }
    // set (x, y) of obstacle
    Matter.Body.setPosition(item.body, {
      x: item.body.position.x + item.body.trajectory,
      y: item.body.position.y,
    });
  });

  return entities;
};
// insert time and gravity
const Physics = (entities, { time }) => {
  const { engine } = entities.physics;
  engine.world.gravity.y = 0.5;
  Matter.Engine.update(engine, time.delta);
  return entities;
};

export { Tilt, Physics, Trajectory };
