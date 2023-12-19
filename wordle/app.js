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

const wordList = ["piano", "patio", "horse", "darts"].map((word) =>
  word.toUpperCase()
);
const randomIndex = Math.floor(Math.random() * wordList.length);
const choiceWord = wordList[randomIndex];

const pressedAlphabets = [];
let currentPressedAlphabet = "";
let lock = 0;

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

// 1,2,3,4,5 => i < 1 => i = 0
// j = 0,1,2,3,4
// 6,7,8,9,10 => i < 2 => i = 1
// j = 5,6,7,8,9
function updateGrid() {
  for (let i = 0; i < Math.ceil(pressedAlphabets.length || 1 / 5); i++) {
    const row = grid.children[i];
    for (let j = 0; j < 5; j++) {
      const box = row.children[j];
      box.innerText = pressedAlphabets[j + i * 5] || null;
    }
  }
}

function keyDown(e) {
  const regex = /[A-Z]/;
  const keyDownAlphabet = e.key.toUpperCase();
  const isKeyDownBackSpace = e.key === "Backspace";
  const isKeyDownEnter = e.key === "Enter";

  // 백 스페이스 누르면 글자가 지워진다.
  if (isKeyDownBackSpace) {
    lock = 0;
    pressedAlphabets.pop();
    updateGrid();
  } else if (pressedAlphabets.length % 5 === 0 && isKeyDownEnter) {
    // 엔터를 누르면 lock이 풀려서 다음 칸으로 타자를 칠 수 있다.
    lock = 0;
    for (let i = 0; i < Math.ceil(pressedAlphabets.length || 1 / 5); i++) {
      const row = grid.children[i];
      for (let j = 0; j < 5; j++) {
        const box = row.children[j];
        const choiceWordArray = [...choiceWord];
        const isIncludes = choiceWordArray.includes(box.innerText);
        const isIncludedPositionSame =
          isIncludes && box.innerText === choiceWordArray[j];

        // 글자가 포함되고 위치까지 같으면 녹색
        // 글자가 포함되고 위치가 다르면 노란색
        // 지운 횟수가 5회 됬을 때 백스페이스 잠금
        if (isIncludedPositionSame) {
          box.style.backgroundColor = "green";
        } else if (isIncludes) {
          box.style.backgroundColor = "yellow";
        }
      }
    }
  }

  // lock 걸리면 글자 입력 못함.
  if (lock) return;

  // 백 스페이스, 엔터키 제외한 key들은 입력된다.
  if (regex.test(keyDownAlphabet) && !isKeyDownBackSpace && !isKeyDownEnter) {
    pressedAlphabets.push(keyDownAlphabet);
    // 한줄이 다 입력되면 lock 걸려서 입력이 안된다.
    if (pressedAlphabets.length % 5 === 0) {
      lock = 1;
    }
    updateGrid();
  }
}
