//Word and Hints Object
const options = {
  aroma: "images/aroma.png",
  pepper: "images/pepper.png",
  halt: "images/halt.png",
  jump: "images/jump.png",
  shuffle: "images/shuffle.png",
  chaos: "images/chaos.png",
  maze: "images/maze.png",
  cat: "images/cat.jpg",
  bat: "images/bat.jpg",
  dog: "images/dog.png",
  car: "images/car.png",
};

//Initial References
const message = document.getElementById("message");
const hintRef = document.querySelector(".hint-ref");
const controls = document.querySelector(".controls-container");
const startBtn = document.getElementById("start");
const letterContainer = document.getElementById("letter-container");
const userInpSection = document.getElementById("user-input-section");
const resultText = document.getElementById("result");
const word = document.getElementById("word");
const words = Object.keys(options);
let randomWord = "",
  randomHint = "";
let winCount = 0,
  lossCount = 0,
  timer,
  timerStarted = false,
  incorrectLetters = [],
  correctLetters = [];
let messageTimeout;

//Generate random value
const generateRandomValue = (array) => Math.floor(Math.random() * array.length);

//Function to block all the buttons
const blocker = () => {
  let lettersButtons = document.querySelectorAll(".letters");
  stopGame();
  if (timer) {
    clearInterval(timer);
  }
  displaySpellingReport();
};

//Function to start the game
startBtn.addEventListener("click", () => {
  controls.classList.add("hide");
  init();
});

//Function to stop the game
const stopGame = () => {
  controls.classList.remove("hide");
};

//Generate Word Function grom the words array
const generateWord = () => {
  letterContainer.classList.remove("hide");
  userInpSection.innerText = "";
  randomWord = words[generateRandomValue(words)];
  randomHint = options[randomWord];
  hintRef.innerHTML = `<div id="wordHint">
  <span>Hint: </span><img src="${randomHint}" alt="hint image" style="max-width: 200px; max-height: 200px;"></div>`;
  let displayItem = "";
  randomWord.split("").forEach((value) => {
    displayItem += '<span class="inputSpace">_ </span>';
  });

  //Display each element in a span el
  userInpSection.innerHTML = displayItem;
  userInpSection.innerHTML += `<div id='chanceCount'>Chances Left: ${lossCount}</div>`;
  startTimer();
};

//Function to start the timer when the game starts
const startTimer = () => {
  if (!timerStarted) {
    timerStarted = true;
    let timeLeft = 60;
    if (timer) {
      clearInterval(timer);
    }
    timer = setInterval(() => {
      if (timeLeft <= 0) {
        clearInterval(timer);
        //word.innerHTML = `The word was: <span>${randomWord}</span>`;
        resultText.innerHTML = "Time's up! Game Over";
        blocker();
      } else {
        document.getElementById("timer").innerText = `Time Left: ${timeLeft}s`;
      }
      timeLeft -= 1;
    }, 1000);
  }
};

//Function to initialize the game
const init = () => {
  clearTimeout(messageTimeout);
  winCount = 0;
  lossCount = 5;
  randomWord = "";
  word.innerText = "";
  randomHint = "";
  message.innerText = "";
  userInpSection.innerHTML = "";
  letterContainer.classList.add("hide");
  letterContainer.innerHTML = "";
  timerStarted = false;
  incorrectLetters = [];
  correctLetters = [];
  generateWord();

  //Display the timer in the user input section
  const timerDisplay = document.createElement("div");
  timerDisplay.id = "timer";
  timerDisplay.innerText = "Time Left: 60s";
  userInpSection.appendChild(timerDisplay);

  // Start the timer here
  startTimer();

  //Function to create letter buttons
  for (let i = 65; i < 91; i++) {
    let button = document.createElement("button");
    button.classList.add("letters");

    //Convert to string
    button.innerText = String.fromCharCode(i);

    //Character button onclick
    button.addEventListener("click", () => {
      showTemporaryMessage("Correct Letter", "#008000");

      let charArray = randomWord.toUpperCase().split("");
      let inputSpace = document.getElementsByClassName("inputSpace");

      //If array contains clicked value replace the matched Dash with Letter
      if (charArray.includes(button.innerText)) {
        charArray.forEach((char, index) => {
          //If character in array is same as clicked button
          if (char === button.innerText) {
            button.classList.add("correct");
            //Replace dash with letter
            inputSpace[index].innerText = char;
            //increment counter
            winCount += 1;
            correctLetters.push(char);
            //If winCount equals word length
            if (winCount == charArray.length) {
              resultText.innerHTML = "You Win";
              startBtn.innerText = "Continue";
              //block all buttons
              blocker();
            }
          }
        });
      } else {
        //lose count
        button.classList.add("incorrect");
        lossCount -= 1;
        incorrectLetters.push(button.innerText);
        document.getElementById(
          "chanceCount"
        ).innerText = `Chances Left: ${lossCount}`;
        showTemporaryMessage("Incorrect Letter", "#ff0000");

        if (!timerStarted) {
          startTimer();
        }
        if (lossCount == 0) {
          //word.innerHTML = `The word was: <span>${randomWord}</span>`;
          resultText.innerHTML = "Game Over";
          blocker();
        }
      }

      //Disable clicked buttons
      button.disabled = true;
    });

    //Append generated buttons to the letters container
    letterContainer.appendChild(button);
  }
};

const displaySpellingReport = () => {
  const reportContainer = document.createElement("div");
  reportContainer.id = "spelling-report";
  reportContainer.innerHTML = `
    <br>
    <h3>Spelling Report</h3>
    <p>Word: ${randomWord}</p>
    <p>Correct letters: ${correctLetters.join(", ")}</p>
    <p>Incorrect letters: ${incorrectLetters.join(", ")}</p>
    <p>Accuracy: ${((correctLetters.length / randomWord.length) * 100).toFixed(2)}%</p>
  `;
  resultText.appendChild(reportContainer);
};

const showTemporaryMessage = (text, color, duration = 2000) => {
  clearTimeout(messageTimeout);
  message.innerText = text;
  message.style.color = color;
  messageTimeout = setTimeout(() => {
    message.innerText = "";
  }, duration);
};

window.onload = () => {
  init();
};
