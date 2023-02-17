var db;
var openRequest;
var mostId;
window.onload = function () {
  let inp = document.getElementById("newTask");
  inp.addEventListener("change", addNew);
  openRequest = indexedDB.open("store", 2);

  openRequest.onerror = function () {
    console.error("Error", openRequest.error);
  };

  openRequest.onsuccess = function () {
    db = openRequest.result;
    let transaction = db.transaction("tasks", "readwrite"); // (1)
    // получить хранилище объектов для работы с ним
    request = transaction.objectStore("tasks").getAll(); // (2)

    request.onsuccess = function () {
      // (4)
      for (task of request.result) {
        if (task.id > mostId) mostId = task.id;

        e = { target: { value: "" } };
        e.target.value = task.text;
        addNew(e, task.status, false, task.id);
      }
    };

    request.onerror = function () {
      console.log("Ошибка", request.error);
    };
  };
  openRequest.onupgradeneeded = function () {
    let db = openRequest.result;
    if (!db.objectStoreNames.contains("tasks")) {
      // если хранилище "books" не существует
      db.createObjectStore("tasks", { keyPath: "id" }); // создаём хранилище
    }
  };
};

function addNew(e, check = false, addToBD = true, id) {
  let value = e.target.value;
  e.target.value = "";
  let list = document.getElementById("list");
  id = (mostId + list.childNodes.length - 1).toString();
  li = document.createElement("li");

  if (addToBD) {
    let transaction = db.transaction("tasks", "readwrite"); // (1)

    // получить хранилище объектов для работы с ним
    let books = transaction.objectStore("tasks"); // (2)
    ln = list;
    let book = {
      id: id,
      text: value,
      status: check,
    };

    let request = books.add(book); // (3)

    request.onsuccess = function () {
      // (4)
      console.log("Книга добавлена в хранилище", request.result);
    };

    request.onerror = function () {
      console.log("Ошибка", request.error);
    };
  }
  CreateLi(li, value, check, id);
  list.insertBefore(li, list.firstChild);
}

//В случае если человек подтвердил выполнение задания,меняем статус и удаляем кнопки кроме "удалить"
function completed(e) {
  let li = e.target.parentNode;
  let ul = li.parentNode;
  nodes = li.childNodes;
  for (let i = nodes.length - 2; i > 0; i--) {
    el = nodes[i];

    if (el.nodeName === "BUTTON") {
      li.removeChild(el);
    }
  }
  nodes[1].innerText = "выполнено";
}

//сохраняем статус и текст во временное хранилище,меняем наполнение на input с этим тектом для редактирования
function edit(e) {
  let li = e.target.parentNode;
  let ul = li.parentNode;
  cashSt = li.childNodes[0].checked;
  value = li.childNodes[1].innerText;
  while (li.firstChild) {
    li.removeChild(li.firstChild);
  }
  inp = document.createElement("input");
  inp.value = value;
  inp.addEventListener("change", save);
  inp.addEventListener("blur", save);
  li.appendChild(inp);
  li.firstChild.focus();
}
cashValue = "";
function editSt(e) {
  let li = e.target.parentNode;
  let transaction = db.transaction("tasks", "readwrite"); // (1)
  // получить хранилище объектов для работы с ним
  tasks = transaction.objectStore("tasks");
  console.log(li.id.toString());
  request = tasks.get(li.id); // (2)
  // tasks.clear();
  request.onsuccess = function () {
    let task = request.result;
    console.log(task);
    task["status"] = !task.status;
    tasks.put(task);
  };
}
function save(e) {
  let value = e.target.value;
  let li = e.target.parentNode;
  cashValue = value;
  li.innerHTML = "";
  CreateLi(li, value, cashSt, li.id);
  let transaction = db.transaction("tasks", "readwrite"); // (1)
  // получить хранилище объектов для работы с ним
  tasks = transaction.objectStore("tasks");
  console.log(li.id.toString());
  request = tasks.get(li.id); // (2)
  // tasks.clear();
  request.onsuccess = function () {
    let task = request.result;
    console.log(task);
    task["text"] = cashValue;
    tasks.put(task);
  };

  request.onerror = function () {
    console.log("Ошибка", request.error);
  };
}

function del(e) {
  let li = e.target.parentNode;
  let ul = li.parentNode;
  ul.removeChild(li);
  let transaction = db.transaction("tasks", "readwrite"); // (1)
  // получить хранилище объектов для работы с ним
  tasks = transaction.objectStore("tasks");
  request = tasks.delete(li.id); // (2)
  // tasks.clear();
  request.onsuccess = function () {
    let id = request.result;
    console.log(id);
  };

  request.onerror = function () {
    console.log("Ошибка", request.error);
  };
}

function CreateLi(li, valueText, check = false, id) {
  //console.log(id);
  li.id = id;
  btnOk = document.createElement("input");
  btnOk.type = "checkbox";
  btnOk.addEventListener("click", editSt);
  btnOk.checked = check;
  li.append(btnOk);

  text = document.createElement("div");
  text.innerText = valueText;
  text.addEventListener("dblclick", edit);
  li.append(text);

  btnDel = document.createElement("button");
  btnDel.innerText = "del";
  btnDel.addEventListener("click", del);
  li.append(btnDel);
}
