"use strict";

// Selectors
const todoInput = document.querySelector(".todo-input");
const todoButton = document.querySelector(".todo-button");
const todoUl = document.querySelector(".todo-list");
const todoOptions = document.querySelector(".filter-todo");

// State
let todos = [];
let option = "all";

// Event Listeners
todoButton.addEventListener("click", handleClickButton);
window.addEventListener("DOMContentLoaded", contentLoaded);
todoUl.addEventListener("click", handleClickList);
todoOptions.addEventListener("change", changeOption);

// Functions
function setTodos(value) {
  if (Array.isArray(value)) {
    todos = value;
  } else {
    todos.push(value);
  }
  localStorage.setItem("todos", JSON.stringify(todos));
  render();
}

function setOption(value) {
  option = value;
  render();
}

function changeOption() {
  setOption(todoOptions.value);
}

function handleClickButton(event) {
  event.preventDefault();
  const todoData = { id: Date.now(), value: todoInput.value, completed: false };
  setTodos(todoData);
  todoInput.value = "";
}

function handleClickList(event) {
  const listElement = event.target.parentElement.parentElement;
  if (event.target.classList[0] === "complete-button") {
    setTodos(
      todos.map((todo) => {
        if (todo.id === +listElement.id) {
          return { ...todo, completed: !todo.completed };
        } else {
          return todo;
        }
      })
    );
  } else if (event.target.classList[0] === "delete-button") {
    setTodos(todos.filter((todo) => todo.id !== +listElement.id));
  }
}

function contentLoaded() {
  const todos = JSON.parse(localStorage.getItem("todos")) || [];
  setTodos(todos);
}

function render() {
  const listHTML = todos
    .filter(({ completed }) => {
      if (option === "all") return true;
      if (option === "completed") return completed;
      return !completed;
    })
    .map(
      ({ id, value, completed }) => `
        <li id=${id} class="todo-item ${completed && "completed"}">
          <span>${value}</span>
          <div class="buttons">
            <button class="complete-button">✅</button>
            <button class="delete-button">🗑️</button>
          </div>
        </li>
          `
    )

    .join("");
  todoUl.innerHTML = listHTML;
}
