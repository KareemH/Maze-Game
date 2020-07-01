//--------------------------- INTIALIZATION LOGIC -----------------------------
// Get references to buttons that start or progress the games
const nextButton = document.querySelector("#next");
const restartButton = document.querySelector("#restart");
const readyButton = document.querySelector("#ready");

// Get references to dynamically changing input
const score = document.querySelector(".score");
const level = document.querySelector(".levels");
const time = document.querySelector(".time");
//----------------------------------------------------------------------------
// Global variables
let intervalId; // Get access to which timer we're maintaining
let locallyStoredLevel = Number(localStorage.getItem("level"));
let locallyStoredScore = Number(localStorage.getItem("score"));
let locallyStoredTotal = Number(localStorage.getItem("total"));
let locallyStoredCellsX = Number(localStorage.getItem("cellsx"));
let locallyStoredCellsY = Number(localStorage.getItem("cellsy"));

let cellsHorizontal = locallyStoredCellsX > 6 ? locallyStoredCellsX : 6;
let cellsVertical = locallyStoredCellsY > 4 ? locallyStoredCellsY : 3;

//--------------------------- EVENT LISTENERS -----------------------------
// When a user clicks on the ready button
readyButton.addEventListener("click", (event) => {
  Body.setStatic(ball, false); // The ball is no longer static and will move
  timerActivate(); // Since a game has started, it is time to activate the timer to see how fast a user can reach the goal
  readyButton.classList.add("hidden"); // The readyButtton no longer needs to be visible
  nextLevel(); // Activate this function to progress to the next level
});

restartButton.addEventListener("click", (event) => {
  newGame();
});

// Clicking on the next level button will progress to a harder round
nextButton.addEventListener("click", (event) => {
  location.reload(); // Reload/refresh the page
  // A user's progress will be saved in local storage!
});
//----------------------------------------------------------------------------

//--------------------------- GAME CONTROLS -----------------------------
// A user wants to start a new game
const newGame = () => {
  location.reload(); // Refresh the page
  localStorage.clear(); // Clear out the local storage so that a user's progress is not referenced
};

// A user is progressing to the next level, so increase the X/Y cells
const incrementCells = () => {
  let addCellsX = cellsHorizontal + 2;
  let addCellsY = Math.floor((cellsHorizontal + 2) * 0.67);

  storeLocally("cellsx", addCellsX);
  storeLocally("cellsy", addCellsY);
};

// If a user progresses successfully, then their total score should be updated
const totalScore = () => {
  let newCurrentTotal = locallyStoredScore + locallyStoredTotal;
  storeLocally("total", newCurrentTotal);
};

// If a user progresses successfully, then they shall proceed to the next level
const nextLevel = () => {
  let currentLevel = Number(level.innerHTML);
  let nextLevel = currentLevel + 1;

  // Propagate this change back to the view
  level.innerHTML = nextLevel;
  storeLocally("level", nextLevel);
};

// Use the amount of time left as the score
const amountOfPoints = (points) => {
  let timeLeft = Number(time.innerHTML);
  let currentPoints = level.innerHTML * timeLeft;

  storeLocally("score", currentPoints);
};

// Start the timer to initiate gameplay
const timerActivate = () => {
  intervalId = setInterval(() => {
    let timeLeft = time.innerHTML;

    if (timeLeft > 0) {
      time.innerHTML = timeLeft - 1;
    } else {
      clearInterval(intervalId);
      gameOver();
    }
  }, 10);
};

// Stop ther timer
const timerStop = () => {
  clearInterval(intervalId);
  amountOfPoints();
  totalScore();
};
//----------------------------------------------------------------------------

//--------------------------- LOCAL STORAGE OPERATIONS -----------------------------
const storeLocally = (key, value) => {
  switch (key) {
    case "level":
      localStorage.setItem("level", value);
    case "score":
      localStorage.setItem("score", value);
    case "total":
      localStorage.setItem("total", value);
    case "cellsx":
      localStorage.setItem("cellsx", value);
    case "cellsy":
      localStorage.setItem("cellsy", value);
  }
};

//--------------------------- UPDATE SCOREBOARD -----------------------------

// With every refresh, the scoreboard must retrieve data from local storage to inform the user their progress on the interface
window.onload = () => {
  score.innerHTML = locallyStoredScore + locallyStoredTotal;
  level.innerHTML = locallyStoredLevel;
};
