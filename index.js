const { Engine, Render, Runner, World, Bodies, Body, Events } = Matter;

// Maze dimensions based on number of cells
// const cellsHorizontal = 7;
// const cellsVertical = 7;
// Maze size
const width = window.innerWidth;
const height = window.innerHeight * 0.89;
// Cell sizes
const unitLengthX = width / cellsHorizontal;
const unitLengthY = height / cellsVertical;

// Bolierplate code in conjunction with Matter.js library
const engine = Engine.create();
engine.world.gravity.y = 0; // Disbable gravity in the y direction
const { world } = engine;
const render = Render.create({
  element: document.body,
  engine: engine,
  options: {
    wireframes: false,
    width: width,
    height: height,
    background: "black",
  },
});

Render.run(render);
Runner.run(Runner.create(), engine);

// Walls
const walls = [
  // First parameter is the x-coordinate of the origin of the shape
  // Second parameter is the y-coordinate of the origin of the shape
  // Third parameter is the width
  // Fourth parameter is the height
  Bodies.rectangle(width / 2, 0, width, 2, { isStatic: true }), // top border wall
  Bodies.rectangle(width / 2, height, width, 2, { isStatic: true }), // bottom border wall
  Bodies.rectangle(0, height / 2, 2, height, { isStatic: true }), // left border wall
  Bodies.rectangle(width, height / 2, 2, height, { isStatic: true }), // right border wall
];
World.add(world, walls);

//-------------------------------------------------------------------------------
// Maze generation

const shuffle = (arr) => {
  let counter = arr.length;
  while (counter > 0) {
    // Pick a random index inside the array
    const index = Math.floor(Math.random() * counter);
    counter--;

    // Swap elements between the positions of index and counter
    const temp = arr[counter];
    arr[counter] = arr[index];
    arr[index] = temp;
  }
  return arr;
};

// Say for instance, cellsVertical = 3 and cells Horizontal = 2
const grid = Array(cellsVertical) // Creates an outer array with 3 indicies
  .fill(null) // Fill each index with the null value initially
  .map(() => {
    // Map something onto each index
    return Array(cellsHorizontal).fill(false); // Each index will now get an Array of 3 indicies with entries as false
    // This in turn creates a 3 x 2 array, where the outer array of 3 holds a nested array of 3 in each index
  });

// This will hold all possible vertical positions
const verticals = Array(cellsVertical) // Creates an outer array with 3 indicies
  .fill(null) // Fill each index with the null value initially
  .map(() => Array(cellsHorizontal - 1).fill(false)); // Each index will now get an Array of 2 indicies with entries as false
// This in turn creates a 3 X 2 array to represent all vertical placements

// This will hold all possible vertical positions
const horizontals = Array(cellsVertical - 1) // Creates an array with 2 indicies
  .fill(null) // Fill each index with the null value initially
  .map(() => Array(cellsHorizontal).fill(false)); // Each index will now get an Array of 3 indicies with entries as false
// This in turn creates a 2 X 3 array to represent all horizontal placements
//-------------------------------------------------------------------------------

// Choose a random position to start generating the maze
// Will serve as starting locations
const startRow = Math.floor(Math.random() * cellsVertical);
const startColumn = Math.floor(Math.random() * cellsHorizontal);

const recursiveStepThroughMazeCells = (row, column) => {
  // If we have already vistied the cell at [row, column], then return
  if (grid[row][column] === true) {
    return;
  }

  // Mark this cell as being visited (updated the cell as true)
  // To keep track of what cells we visited, we have the grid array
  // False means it has not been visited
  grid[row][column] = true;

  // Assemble randomly-ordered list or neighbors
  // Manipulation of the current index position will provide the index position of neighboring cells
  const neighbors = shuffle([
    [row - 1, column, "up"], // Top neighbor
    [row, column + 1, "right"], // Right neighbor
    [row + 1, column, "down"], // Bottom neighbor
    [row, column - 1, "left"], // Left neighbor
  ]);
  // We have to randomly sort this list to provide a randomized looking maze

  // For each neighbor
  for (let neighbor of neighbors) {
    const [nextRow, nextColumn, direction] = neighbor;
    //* See if that neighbor is out of bounds */
    if (
      nextRow < 0 ||
      nextRow >= cellsVertical ||
      nextColumn < 0 ||
      nextColumn >= cellsHorizontal
    ) {
      // No position should be negative (less than 0) or greater than or equal to the maze size
      // Continue to the next iteration because the current [nextRow, nextColumn] is out of bounds and not valid for further processing
      continue;
    }

    //* If we have visited that neighbor, continue to next neighbor */
    if (grid[nextRow][nextColumn]) {
      // Continue to the next iteration because the current [nextRow, nextColumn] was already visited and not valid for further processing
      continue;
    }
    //*  Remove a wall from either the horizontals (up or down) or verticals (left or right) array */
    // Recall if cells is 3
    // Then verticals would be
    /* [ F F]
       [ F F] 
       [ F F]*/
    // In verticals, moving left or right allows the row number to stay the same, but the column element will change its position
    if (direction === "left") {
      verticals[row][column - 1] = true;
    } else if (direction === "right") {
      verticals[row][column] = true;
    }

    // Horizontals would be
    /* [ F F F]
       [ F F F] */
    // In horizontals, moving up or down allows the column number to stay the same, but the row element will change its position
    else if (direction === "up") {
      horizontals[row - 1][column] = true;
    } else if (direction === "down") {
      horizontals[row][column] = true;
    }

    recursiveStepThroughMazeCells(nextRow, nextColumn);
  }

  // console.log(horizontals, verticals);
  //* Visit that next cell (which means to call recursiveStepThroughMazeCall recursively with that new index as parameters) */
};

recursiveStepThroughMazeCells(startRow, startColumn);
// console.log("[", startRow, startColumn, "]");
// console.log(grid);

//-------------------------------------------------------------------------------
// Drawing the walls around the maze

// Horizontals is left to right
horizontals.forEach((row, rowIndex) => {
  row.forEach((open, columnIndex) => {
    if (open === true) {
      return;
    }

    const wall = Bodies.rectangle(
      columnIndex * unitLengthX + unitLengthX / 2, // x coordinate
      rowIndex * unitLengthY + unitLengthY, // y coordinate
      unitLengthX, // How wide the rectangle is in the x direction
      5, // How tall (essentially how thick) the rectangle is in the y direction
      {
        label: "wall",
        friction: 0.5,
        isStatic: true /*render: { fillStyle: "red" }*/,
      }
    );

    World.add(world, wall);
  });
});

// Vertical is top to bottom
verticals.forEach((row, rowIndex) => {
  row.forEach((open, columnIndex) => {
    if (open === true) {
      return;
    }

    const wall = Bodies.rectangle(
      columnIndex * unitLengthX + unitLengthX, // x coordinate
      rowIndex * unitLengthY + unitLengthY / 2, // y coordinate
      5, // Since vertical is top to bottom, we want to make the rectangle thin and 10 px wide
      unitLengthY, // Since vertical is top to bottom, we want to make the rectangle unitLength tall
      {
        label: "wall",
        friction: 0.5,
        isStatic: true,
        // render: { fillStyle: "red" },
      }
    );
    World.add(world, wall);
  });
});
//-------------------------------------------------------------------------------

//Making the ball and goal

// Goal coordinates
const goal = Bodies.rectangle(
  width - unitLengthX / 2, // x coordinate
  height - unitLengthY / 2, // y coordinate
  unitLengthX * 0.7, // the actual rectangle should be 70% wide in respect to the actual cell
  unitLengthY * 0.7, // the actual rectangle should be 70% tall in respect to the actual cell
  {
    label: "goal",
    isStatic: true,
    render: { fillStyle: "#2BFF88" },
  }
);
World.add(world, goal);

// Drawing out the ball
const ballRadius = Math.min(unitLengthX, unitLengthY) / 4;
const ball = Bodies.circle(unitLengthX / 2, unitLengthY / 2, ballRadius, {
  label: "ball",
  render: {
    fillStyle: "#FEE140",
  },
});
World.add(world, ball);

// Adding movement/velocity to the ball
document.addEventListener("keydown", (event) => {
  const { x, y } = ball.velocity;
  // Use keycode
  // The up or w key
  if (event.keyCode === 38 || event.keyCode === 87) {
    // console.log("move ball up");
    // Moving a ball in the up direction requires negative velocity in the y direction
    Body.setVelocity(ball, { x: x, y: y - 5 });
  }
  // The right or d key
  else if (event.keyCode === 39 || event.keyCode === 68) {
    // console.log("move ball right");
    // Moving a ball in the right direction requires positive velocity in the x direction
    Body.setVelocity(ball, { x: x + 5, y: y });
  }
  // The down or s key
  else if (event.keyCode === 40 || event.keyCode === 83) {
    // console.log("move ball down");
    // Moving a ball in the down direction requires positive velocity in the y direction
    Body.setVelocity(ball, { x: x, y: y + 5 });
  }
  // The left or a key
  else if (event.keyCode === 37 || event.keyCode === 65) {
    // console.log("move ball left");
    // Moving a ball in the left direction requires negative velocity in the x direction
    Body.setVelocity(ball, { x: x - 5, y: y });
  }
});

// document.addEventListener("keyup", (event) => {
//   const { x, y } = ball.velocity;
//   Body.setVelocity(ball, { x: 0, y: 0 });
// });

// Win condition
Events.on(engine, "collisionStart", (event) => {
  event.pairs.forEach((collision) => {
    const labels = ["ball", "goal"];
    // The ball and the goal are touching
    // That means the ball reached the goal and the user won
    if (
      labels.includes(collision.bodyA.label) &&
      labels.includes(collision.bodyB.label)
    ) {
      timerStop();
      incrementCells();
      winningMessage();

      document.querySelector(".winner").classList.remove("hidden");
      world.gravity.y = 1; // The world/rectangle object will fall apart downwards
      console.log("User won");
      world.bodies.forEach((body) => {
        // world.bodies is an array of all shapes in the current world
        if (body.label === "wall") {
          // If the shape has a label of "wall"
          Body.setStatic(body, false); // Make that shape's static property false
        }
      });
    }
  });
});
//-------------------------------------------------------------------------------
// Maze generation (old way)
// const grid = [];
// for (let i = 0; i < 3; i++) {
//   grid.push([]);
//   for (let j = 0; j < 3; j++) {
//     grid[i].push(false);
//     console.log(i);
//   }
// }
