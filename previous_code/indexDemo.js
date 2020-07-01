const {
  Engine,
  Render,
  Runner,
  World,
  Bodies,
  MouseConstraint,
  Mouse,
} = Matter;

const width = 800;
const height = 600;

const engine = Engine.create();
const { world } = engine;
const render = Render.create({
  element: document.body,
  engine: engine,
  options: {
    wireframes: false,
    width: width,
    height: height,
  },
});

Render.run(render);
Runner.run(Runner.create(), engine);

// Handling when user uses a mouses to click on shapes
// Creates drag and drop functionality
World.add(
  world,
  MouseConstraint.create(engine, {
    mouse: Mouse.create(render.canvas),
  })
);

// Walls
const walls = [
  // First parameter is the x-coordinate of the origin of the shape
  // Second parameter is the y-coordinate of the origin of the shape
  // Third parameter is the width
  // Fourth parameter is the height
  Bodies.rectangle(400, 0, 800, 40, { isStatic: true }), // top border wall
  Bodies.rectangle(400, 600, 800, 40, { isStatic: true }), // bottom border wall
  Bodies.rectangle(0, 300, 40, 600, { isStatic: true }), // left border wall
  Bodies.rectangle(800, 300, 40, 600, { isStatic: true }), // right border wall
];
World.add(world, walls);

// Random shapes
for (let i = 0; i < 50; i++) {
  if (Math.random() > 0.5) {
    World.add(
      world,
      Bodies.rectangle(Math.random() * width, Math.random() * height, 50, 50)
    );
  } else {
    World.add(
      world,
      Bodies.circle(Math.random() * width, Math.random() * height, 35)
    );
  }
}

const shape = Bodies.rectangle(200, 200, 50, 50, {
  //   isStatic: true,
});
World.add(world, shape);
