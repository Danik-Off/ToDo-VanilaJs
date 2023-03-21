const openRequest = indexedDB.open("todoDB", 1);

openRequest.onupgradeneeded = () => {
  db = openRequest.result;
  if (!db.objectStoreNames.contains("books")) {
    // если хранилище "books" не существует
    db.createObjectStore("books", { keyPath: "id" }); // создаём хранилище
  }
};

openRequest.onsuccess = () => {
  db = openRequest.result;
};

window.onload = () => {
  const inputNewToDo = document.querySelector(".new-todo");
  inputNewToDo.addEventListener("change", addNewTask);
  openRequest.onsuccess = loadTasks;
};

function loadTasks() {}

function addNewTask(e) {
  const todoList = document.querySelector(".todo-list");
  const text = e.target.value;
  const id = 0;
  const sampleTask = `<li data-id="${id}">
	                    <div class="view">
		                  <input class="toggle" type="checkbox"/>
		                  <label class="text">${text}</label>
		                  <button class="destroy"></button>
	                    </div>
                      </li>`;
  const tempVar = document.createElement("div");
  const inputNewToDo = document.querySelector(".new-todo");
  inputNewToDo.value = "";

  tempVar.innerHTML = sampleTask;
  const domElementTask = tempVar.firstChild;
  domElementTask.addEventListener("click", hadlerTask);
  todoList.insertBefore(domElementTask, todoList.firstChild);
}

function hadlerTask(e) {
  const task = e.currentTarget;
  const element = e.target;
  console.log(task, element.className);
  if (element.className === "destroy") deleteTask(e);
  if (element.className === "toggle") updateStatusTask(e);
  if (element.className === "text") editTask(e);
}

function updateStatusTask() {}

function editTask() {}

function deleteTask(e) {
  const task = e.currentTarget;
  task.parentNode.removeChild(task);
}
