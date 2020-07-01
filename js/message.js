const winningMessage = () => {
  document.querySelector(".winner").classList.remove("hidden");
  setTimeout(() => {
    document.querySelector(".winner").classList.add("hidden");
    document.querySelector(".next-game").classList.remove("hidden");
  }, 3000);
};

const gameOver = () => {
  document.querySelector(".game-over").classList.remove("hidden");
  setTimeout(() => {
    document.querySelector(".game-over").add("hidden");
    newGame();
  }, 10000);
};
