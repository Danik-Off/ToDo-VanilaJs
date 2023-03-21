const openRequest = indexedDB.open("todoDB", 1);
let db;
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
  inputNewToDo.addEventListener("blur", addNewTask);
  openRequest.onsuccess = () => {};
};

function addNewTask(e) {
  const text = e.value;
  const id = 0;
  const sampleTask = `<li data-id="${id}">
	                    <div class="view">
		                  <input class="toggle" type="checkbox">
		                  <label>${text}</label>
		                  <button class="destroy"></button>
	                    </div>
                      </li>`;
  const tempVar = document.createElement("div");
  tempVar.innerHTML = sampleTask;
  const domElementTask = tempVar.firstChild;
  //domElementTask.addEventListener();
  
}

function hadlerTask(e)
{
  const task = e.currentTarget;
  alert(this);
}

function editTask() {}

function deleteTask() {}
