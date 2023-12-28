"use strict";
/*
1. 키패드에 누른 알파벳이 보드에 표시되어야 한다.
2. 총 5개의 알파벳을 누를 수 있다. 그리고 엔터를 눌러야 다음 밑에 칸으로 넘어감.
3. backspace누르면 보드에 있는 알파벳이 지워진다.
3. 엔터 누를 시 정답 단어 스펠링에 포함이 된다면 노란색, 위치까지 맞다면 초록색, 포함 안되면 검은색
*/

// Selectors
const grid = document.getElementById("grid");

// EventListners
document.addEventListener("keydown", keyDown);

// Functions
buildGrid();

const wordList = ["piano", "patio", "horse", "darts"];
const randomIndex = Math.floor(Math.random() * wordList.length);
const choiceWord = wordList[randomIndex];

const pressedWords = ["apple", "piasd", "piano"];
let currentPressedWord = "";

function buildGrid() {
  for (let i = 0; i < 6; i++) {
    const row = document.createElement("div");
    row.className = "row";
    for (let j = 0; j < 5; j++) {
      const box = document.createElement("div");
      box.className = "box";
      row.appendChild(box);
    }
    grid.appendChild(row);
  }
}
updateGrid();

function updateGrid() {
  let row = grid.firstChild;
  for (const pressedWord of pressedWords) {
    drawRowWord(row, pressedWord);
    row = row.nextSibling;
  }
  drawRowLetter(row, currentPressedWord);
}

function drawRowWord(row, pressedWord) {
  for (let i = 0; i < 5; i++) {
    const box = row.children[i];
    if (pressedWord[i]) {
      box.innerText = pressedWord[i];
    } else {
      box.innerHTML = `<div>X</div>`;
    }
    box.style.backgroundColor = getBackGroundColor(pressedWord, i);
  }
}

function drawRowLetter(row, currentPressedWord) {
  console.log(currentPressedWord.length);
  for (let i = 0; i < 5; i++) {
    const box = row.children[i];
    if (currentPressedWord) {
      box.innerText = currentPressedWord[i] || "";
    } else {
      box.innerHTML = `<div>X</div>`;
    }
  }
}

function getBackGroundColor(pressedWord, i) {
  const choiceWordLetter = choiceWord[i];
  const pressedWordLetter = pressedWord[i];

  if (!pressedWordLetter) return;
  if (choiceWordLetter === pressedWordLetter) {
    return "#538f4e";
  } else if (choiceWord.includes(pressedWord[i])) {
    return "#b59f3b";
  } else {
    return "#939598";
  }
}

function keyDown(e) {
  const pressedKey = e.key.toLowerCase();
  if (pressedKey === "enter") {
    if (currentPressedWord.length < 5) return;
    if (!wordList.includes(currentPressedWord)) {
      return alert("이 단어는 없는 단어입니다!");
    } else {
      pressedWords.push(currentPressedWord);
      currentPressedWord = "";
    }
  } else if (pressedKey === "backspace") {
    currentPressedWord = currentPressedWord.slice(0, -1);
    console.log(currentPressedWord);
  } else if (/[a-z]/.test(pressedKey)) {
    if (currentPressedWord.length === 5) return;
    currentPressedWord += pressedKey;
  }
  updateGrid();
}
