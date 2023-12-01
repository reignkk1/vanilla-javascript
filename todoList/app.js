// Selectors
const todoInput = document.querySelector(".todo-input");
const todoButton = document.querySelector(".todo-button");
const todoList = document.querySelector(".todo-list");
const todoOption = document.querySelector(".filter-todo");

// Event Listeners
todoButton.addEventListener("click", createTodo);
todoList.addEventListener("click", eventTodoList);
todoOption.addEventListener("change", changeOption);
window.addEventListener("DOMContentLoaded", loadedContent);

// Functions
function renderTodo(id, todo, completed) {
  const todoSpan = document.createElement("span");
  todoSpan.innerText = todo;

  const deleteButton = document.createElement("button");
  deleteButton.classList.add("delete-button");
  deleteButton.innerText = "🗑️";

  const completeButton = document.createElement("button");
  completeButton.classList.add("complete-button");
  completeButton.innerText = "✅";

  const buttons = document.createElement("div");
  buttons.classList.add("buttons");
  buttons.appendChild(completeButton);
  buttons.appendChild(deleteButton);

  const newTodo = document.createElement("li");
  newTodo.id = id;
  newTodo.classList.add("todo-item");
  if (completed) newTodo.classList.add("completed");

  newTodo.appendChild(todoSpan);
  newTodo.appendChild(buttons);

  todoList.appendChild(newTodo);
}

function createTodo(event) {
  event.preventDefault();
  if (!todoInput.value.trim()) return (todoInput.value = "");
  const todo = todoInput.value;
  const id = Date.now();

  const todos = JSON.parse(localStorage.getItem("todos")) || [];
  localStorageTodosUpdate([...todos, { id, value: todo, completed: false }]);

  renderTodo(id, todo);
  todoInput.value = "";
}

function eventTodoList(event) {
  const clickedNode = event.target;
  const todoItem = clickedNode.parentElement.parentElement;
  const todos = JSON.parse(localStorage.getItem("todos"));

  if (clickedNode.classList[0] === "delete-button") {
    todoItem.remove();
    const newTodos = todos.filter((todo) => todo.id !== +todoItem.id);
    localStorageTodosUpdate(newTodos);
  } else if (clickedNode.classList[0] === "complete-button") {
    todoItem.classList.toggle("completed");
    const newTodos = todos.map((todo) => {
      if (todo.id === +todoItem.id) {
        return { ...todo, completed: !todo.completed };
      } else {
        return todo;
      }
    });
    localStorageTodosUpdate(newTodos);
  }
}

function changeOption(event) {
  const optionValue = event.target.value;
  const todos = todoList.childNodes;

  todos.forEach((todo) => {
    switch (optionValue) {
      case "all":
        todo.style.display = "flex";
        break;
      case "completed":
        if (todo.classList.contains("completed")) {
          todo.style.display = "flex";
        } else {
          todo.style.display = "none";
        }
        break;
      case "uncompleted":
        if (!todo.classList.contains("completed")) {
          todo.style.display = "flex";
        } else {
          todo.style.display = "none";
        }
    }
  });
}

function loadedContent() {
  const todos = JSON.parse(localStorage.getItem("todos"));
  todos.forEach(({ id, value, completed }) => renderTodo(id, value, completed));
}

function localStorageTodosUpdate(newTodos) {
  localStorage.setItem("todos", JSON.stringify(newTodos));
}
