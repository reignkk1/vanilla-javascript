"use strict";
/*
1. 키패드에 누른 알파벳이 보드에 표시되어야 한다.
2. 총 5개의 알파벳을 누를 수 있다. 그리고 엔터를 눌러야 다음 밑에 칸으로 넘어감.
3. backspace누르면 보드에 있는 알파벳이 지워진다.
4. 엔터 누를 시 정답 단어 스펠링에 포함이 된다면 노란색, 위치까지 맞다면 초록색, 포함 안되면 검은색
5. 실패 시 모달창 띄우며 다시하기, 성공 했을 때 폭죽!
*/

// Selectors
const grid = document.getElementById("grid");
const keyboard = document.getElementById("keyboard");
const modal = document.getElementById("modal");

// EventListners
document.addEventListener("keydown", handleKeyDown);

// Functions
const wordList = ["piano", "apple"];
const randomIndex = Math.floor(Math.random() * wordList.length);

// 색깔
const GREEN = "#538f4e";
const YELLOW = "#b59f3b";
const GREY = "#3A3A3C";

let choiceWord;
let lettersColor = new Map();
let pressedWords = [];
let currentPressedWord = "";

buildGrid();
updateGrid();
buildKeyBoard();
drawRandomWord();

// 단어 랜덤으로 뽑기
function drawRandomWord() {
  choiceWord = wordList[Math.floor(Math.random() * wordList.length)];
}

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
      if (letter === "◀") {
        letter = "backspace";
      }
      handleKey(letter);
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
  const boxes = document.querySelectorAll(".box");
  if (!pressedWords.length) {
    boxes.forEach((box) => {
      box.style.backgroundColor = "black";
      box.innerText = "";
    });
  }

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
  if (!row) return;
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
function handleKeyDown(e) {
  const pressedKey = e.key.toLowerCase();
  handleKey(pressedKey);
}

// 키 눌렀을 때 로직
function handleKey(pressedKey) {
  if (pressedWords.length === 6) return;
  if (pressedKey === "enter") {
    if (currentPressedWord.length < 5) return;
    pressedWords.push(currentPressedWord);
    currentPressedWord = "";
    updateKeyBoardColor();
    drawModal();
  } else if (pressedKey === "backspace") {
    currentPressedWord = currentPressedWord.slice(0, -1);
  } else if (/^[a-z]$/.test(pressedKey)) {
    if (currentPressedWord.length === 5) return;
    currentPressedWord += pressedKey;
  }
  updateGrid();
}

// 키보드 버튼 배경색 업뎃 로직
function updateKeyBoardColor() {
  const buttons = document.querySelectorAll(".keyboard-button");
  if (!pressedWords.length)
    return buttons.forEach(
      (button) => (button.style.backgroundColor = "#818384")
    );

  for (const pressedWord of pressedWords) {
    for (let i = 0; i < pressedWord.length; i++) {
      const color = getBackGroundColor(pressedWord, i);
      const prevColor = lettersColor.get(pressedWord[i]);
      lettersColor.set(pressedWord[i], getBetterColor(prevColor, color));
    }
  }
  buttons.forEach((button) => {
    const letter = button.innerText.toLowerCase();
    button.style.backgroundColor = lettersColor.get(letter);
  });
}

// 모달 창 띄우기
function drawModal() {
  const success = pressedWords[pressedWords.length - 1] === choiceWord;
  if (success) {
    createModalInner("정답! 축하드립니다!");
    drawRandomWord();
  } else if (pressedWords.length === 6) {
    createModalInner("실패! 다시 도전해주세요!");
  }
}

// 모달 inner 생성
function createModalInner(title) {
  const container = document.createElement("div");
  const div = document.createElement("div");
  const h1 = document.createElement("h1");
  const button = document.createElement("button");

  modal.style.display = "flex";
  container.className = "modal-inner";
  h1.innerText = title;
  button.innerText = "다시하기";
  button.onclick = () => {
    modal.style.display = "none";
    pressedWords = [];
    lettersColor.clear();
    updateKeyBoardColor();
    updateGrid();
    modal.removeChild(container);
  };

  div.appendChild(h1);
  div.appendChild(button);

  container.appendChild(div);
  modal.appendChild(container);
}

function getBetterColor(prev, cur) {
  if (prev === GREEN || cur === GREEN) {
    return GREEN;
  } else if (prev === YELLOW || cur === YELLOW) {
    return YELLOW;
  } else if (prev === GREY || cur === GREY) {
    return GREY;
  }
}

// 글자 박스 배경색 로직
function getBackGroundColor(pressedWord, i) {
  const choiceWordLetter = choiceWord[i];
  const pressedWordLetter = pressedWord[i];

  if (!pressedWordLetter) return;
  if (choiceWordLetter === pressedWordLetter) {
    return GREEN;
  } else if (choiceWord.includes(pressedWord[i])) {
    return YELLOW;
  } else {
    return GREY;
  }
}

/*
할일

초기화 시키는 함수 짜기
배포
성공/실패 모달 문구

*/
