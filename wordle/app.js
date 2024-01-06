"use strict";
/*
1. 키패드에 누른 알파벳이 보드에 표시되어야 한다.
2. 총 5개의 알파벳을 누를 수 있다. 그리고 엔터를 눌러야 다음 밑에 칸으로 넘어감.
3. backspace누르면 보드에 있는 알파벳이 지워진다.
3. 엔터 누를 시 정답 단어 스펠링에 포함이 된다면 노란색, 위치까지 맞다면 초록색, 포함 안되면 검은색
*/

// Selectors
const grid = document.getElementById("grid");
const keyboard = document.getElementById("keyboard");

// EventListners
document.addEventListener("keydown", keyDown);

// Functions
const wordList = ["piano", "patio", "horse", "darts"];
const randomIndex = Math.floor(Math.random() * wordList.length);
const choiceWord = wordList[randomIndex];
const pressedWords = ["apple", "piasd", "piano"];

let currentPressedWord = "";

buildGrid();
updateGrid();
buildKeyBoard();

// 키보드 빌드
function buildKeyBoard() {
  drawKeyBoardRow("qwertyuiop");
  drawKeyBoardRow(" asdfghjkl ");
  drawKeyBoardRow("zxcvbnm", true);
}

// 키보드 열 그리기
function drawKeyBoardRow(letters, isLastRow = false) {
  const row = document.createElement("div");
  row.className = "keyboard-row";
  if (isLastRow) row.appendChild(createKeyBoardButton("enter"));
  for (const letter of letters) {
    row.appendChild(createKeyBoardButton(letter));
  }
  if (isLastRow) row.appendChild(createKeyBoardButton("◀"));
  keyboard.appendChild(row);
}

// 키보드 버튼 생성
function createKeyBoardButton(letter) {
  const button = document.createElement("button");
  button.innerText = letter;
  if (letter === " ") {
    button.className = "spaceButton";
  } else {
    button.className = "keyboard-button";
    button.onclick = () => {
      if (currentPressedWord.length === 5) return;
      currentPressedWord += letter;
      updateGrid();
    };
  }
  return button;
}

// 박스 빌드
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

// 박스 업뎃
function updateGrid() {
  let row = grid.firstChild;
  for (const pressedWord of pressedWords) {
    drawRowWord(row, pressedWord);
    row = row.nextSibling;
  }
  drawRowLetter(row, currentPressedWord);
}

// 단어 그리기
function drawRowWord(row, pressedWord) {
  for (let i = 0; i < 5; i++) {
    const box = row.children[i];
    if (pressedWord[i]) {
      box.innerText = pressedWord[i];
    }
    box.style.backgroundColor = getBackGroundColor(pressedWord, i);
  }
}

// 한 글자 씩 그리기
function drawRowLetter(row, currentPressedWord) {
  for (let i = 0; i < 5; i++) {
    const box = row.children[i];
    if (currentPressedWord) {
      box.innerText = currentPressedWord[i] || "";
    } else {
      box.innerText = "";
    }
  }
}

// 키보드 눌렀을 때 실행되는 이벤트
function keyDown(e) {
  const pressedKey = e.key.toLowerCase();
  if (pressedKey === "enter") {
    if (currentPressedWord.length < 5) return;
    pressedWords.push(currentPressedWord);
    currentPressedWord = "";
  } else if (pressedKey === "backspace") {
    currentPressedWord = currentPressedWord.slice(0, -1);
  } else if (/^[a-z]$/.test(pressedKey)) {
    if (currentPressedWord.length === 5) return;
    currentPressedWord += pressedKey;
  }
  updateGrid();
}

// 글자 박스 배경색 로직
function getBackGroundColor(pressedWord, i) {
  const choiceWordLetter = choiceWord[i];
  const pressedWordLetter = pressedWord[i];

  if (!pressedWordLetter) return;
  if (choiceWordLetter === pressedWordLetter) {
    return "#538f4e";
  } else if (choiceWord.includes(pressedWord[i])) {
    return "#b59f3b";
  } else {
    return "#3A3A3C";
  }
}
