//game constants and variables
let inputDirection = { x: 0, y: 0 };
const foodSound = new Audio("../music/food.mp3");
const gameOverSound = new Audio("../music/gameover.mp3");
const moveSound = new Audio("../music/move.mp3");
const musicSound = new Audio("../music/music.mp3");
let speed = 5;
let score = 0;
let lastPaintTime = 0;
let snakeArr = [
  {
    x: 13,
    y: 15,
  },
];
let food = { x: 6, y: 7 };

//game functions

//making main func a game loop
function main(ctime) {
  // ctime=current time
  window.requestAnimationFrame(main);
  //console.log(ctime);
  if ((ctime - lastPaintTime) / 1000 < 1 / speed) {
    return;
  }
  lastPaintTime = ctime;
  gameEngine();
}

function isCollide(snake) {
  //if you bump into yourself
  for (let i = 1; i < snakeArr.length; i++) {
    if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) {
      return true;
    }
  }
  //if you bump into wall
  if (
    snake[0].x >= 18 ||
    snake[0].x <= 0 ||
    snake[0].y >= 18 ||
    snake[0].y <= 0
  ) {
    return true;
  }
}
function gameEngine() {
  //part 1 :updating the snake array & food
  if (isCollide(snakeArr)) {
    gameOverSound.play();
    musicSound.pause();
    inputDirection = { x: 0, y: 0 };
    alert("Game Over,Press any Key to Play Again!");
    snakeArr = [
      {
        x: 13,
        y: 15,
      },
    ];
    musicSound.play();
    score = 0;
  }

  //if you have eaten the food ,increment the score and regenerate the food
  if (snakeArr[0].y === food.y && snakeArr[0].x === food.x) {
    foodSound.play();
    score += 1;
    if (score > hiscoreval) {
      hiscoreval = score;
      localStorage.setItem("hiscore", JSON.stringify(hiscoreval));
      highScoreBox.innerHTML = "High Score:" + hiscoreval;
    }
    scoreBox.innerHTML = "Score:" + score;
    //unshift adds to front of array,that is one more segment at head in direction of movement
    snakeArr.unshift({
      x: snakeArr[0].x + inputDirection.x,
      y: snakeArr[0].y + inputDirection.y,
    });
    //updating loc of food
    let a = 2;
    let b = 16;
    //grid is form 1-18,for easy we chose 2-16
    food = {
      x: Math.round(a + (b - a) * Math.random()),
      y: Math.round(a + (b - a) * Math.random()),
    };
  }

  //moving the snake
  for (let i = snakeArr.length - 2; i >= 0; i--) {
    //loop starting from 2nd last element
    snakeArr[i + 1] = { ...snakeArr[i] };
    //last element=2nd last element
    //to avoid referencing problem and create a new object we use destructuring
  }
  snakeArr[0].x += inputDirection.x;
  snakeArr[0].y += inputDirection.y;

  //part 2 :display the snake and food

  //display the snake
  board.innerHTML = "";
  snakeArr.forEach((e, index) => {
    snakeElement = document.createElement("div");
    snakeElement.style.gridRowStart = e.y;
    snakeElement.style.gridColumnStart = e.x;
    if (index === 0) {
      snakeElement.classList.add("head");
    } else {
      snakeElement.classList.add("snake");
    }
    board.appendChild(snakeElement);
  });

  //display the food
  foodElement = document.createElement("div");
  foodElement.style.gridRowStart = food.y;
  foodElement.style.gridColumnStart = food.x;
  foodElement.classList.add("food");
  board.appendChild(foodElement);
}

//main logic starts here
musicSound.play();
let hiscore = localStorage.getItem("hiscore");
//to clear local storage : localStorage.clear()
if (hiscore === null) {
  hiscoreval = 0;
  localStorage.setItem("hiscore", JSON.stringify(hiscoreval));
  //we have to set a string , directly integer won't work
} else {
  hiscoreval = JSON.parse(hiscore);
  highScoreBox.innerHTML = "High Score:" + hiscore;
}
window.requestAnimationFrame(main);

window.addEventListener("keydown", (e) => {
  inputDirection = { x: 0, y: 1 }; //start the game towards y=1
  moveSound.play();
  switch (e.key) {
    case "ArrowUp":
      console.log("ArrowUp");
      //snake wont move diagnally so either x or y 0
      // -> +ve x and |(down) is +ve y
      inputDirection.x = 0; //up
      inputDirection.y = -1; // if we dec y then it will move up
      break;
    case "ArrowDown":
      console.log("ArrowDown");
      inputDirection.x = 0;
      inputDirection.y = 1; // to move down y inc
      break;
    case "ArrowLeft":
      console.log("ArrowLeft");
      inputDirection.x = -1;
      inputDirection.y = 0;
      break;
    case "ArrowRight":
      console.log("ArrowRight");
      inputDirection.x = 1;
      inputDirection.y = 0;
      break;
    default:
      break;
  }
});
