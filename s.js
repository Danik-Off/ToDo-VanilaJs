let db;
let openRequest;
let mostId =0;
let allCompleted = false;
let countCompleted = 0;
let com = 
{
  get countCompleted()
  {

  },
  set countCompleted(d)
  {
    const list = document.getElementById("list");
    countCompleted+=d;
    console.log(countCompleted,list.children.length);
    if(countCompleted === list.children.length)
    {
      console.log("выбраны все элементы");
    }
    else
    {

    }
  }
}
window.onload = function () {
  let inp = document.getElementById("newTask");
  inp.addEventListener("change", addNew);




  openRequest = indexedDB.open("store", 2);

  openRequest.onerror = function () {
    console.error("Error", openRequest.error);
  };

  openRequest.onsuccess = function () {
    db = openRequest.result;
    loadTasks();
  };
  openRequest.onupgradeneeded = function () {
    let db = openRequest.result;
    if (!db.objectStoreNames.contains("tasks")) {
      db.createObjectStore("tasks", { keyPath: "id" }); // создаём хранилище
    }
  };
};
function chooseAll()
{
  let list = document.getElementById("list");
  let val;
  if(allCompleted)
  {
     val =false;
     allCompleted =false;
  }
  else
  {
     val =true;
  }
  for(nodeTask of list.children){ 
   editSt({target:nodeTask.firstChild})
  }
}
function filter(f)
{
  let list = document.getElementById("list");
 for(nodeTask of list.children){
   
    switch(f)
    {
      case"active":
      if(nodeTask.firstChild.checked)
      {
        nodeTask.style.display = ""
      }
      else
      {
        nodeTask.style.display = "none"
      }
        
      break;
      case"completed":
      if(!nodeTask.firstChild.checked)
      {
        nodeTask.style.display = ""
      }
      else
      {
        nodeTask.style.display="none"
      }
        
      break;
      default:
        nodeTask.style.display = ""
        break;
    }
    
  }
}
function loadTasks()
{
  let list = document.getElementById("list");
  while(list.firstChild)
  {
    list.removeChild(list.firstChild )
  }
  let transaction = db.transaction("tasks", "readwrite"); // (1)
  // получить хранилище объектов для работы с ним
  request = transaction.objectStore("tasks").getAll(); // (2)

  request.onsuccess = function () {
    tasks = request.result;
    for(task of tasks)
    {
      addNew({ target: { value: task.text } }, task.status, false, task.id);
    }
   
  };

  request.onerror = function () {
    console.log("Ошибка", request.error);
  };

}
function addNew(e, check = false, addToBD = true, id) {
  console.log(mostId);
  let value = e.target.value;
  e.target.value = "";
  let list = document.getElementById("list");
  console.log(list.childNodes.length);
  li = document.createElement("li");

  if (addToBD) {
    id = (+mostId + 1);
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
      console.log("Задача добавлена в бд ", request.result);
    };

    request.onerror = function () {
      console.log("Ошибка", request.error);
    };
  }
 (mostId<id)? mostId = id:null;
  CreateLi(li, value, check, id);
  list.insertBefore(li, list.firstChild);
}

//сохраняем статус и текст во временное хранилище,меняем наполнение на input с этим тектом для редактирования
function edit(e) {
  let li = e.target.parentNode;
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
  request = tasks.get(+li.id); // (2)
  // tasks.clear();
  request.onsuccess = function () {
    let task = request.result;
    console.log(task);
    task["status"] = !task.status;
    if(task.status)
    {
     com.countCompleted = 1;
    }
    else
    {
      com.countCompleted = -1;
    }
    tasks.put(task);
  };
 
}
function save(e) {
  let value = e.target.value;
  let li = e.target.parentNode;
  cashValue = value;
  li.innerHTML = "";
  CreateLi(li, value, cashSt, +li.id);
  let transaction = db.transaction("tasks", "readwrite"); // (1)
  // получить хранилище объектов для работы с ним
  tasks = transaction.objectStore("tasks");
  console.log(li.id.toString());
  request = tasks.get(+li.id); // (2)
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
  request = tasks.delete(+li.id); // (2)
  // tasks.clear();

  request.onsuccess = function () {
    console.log("Задача удалена");
  };

  request.onerror = function () {
    console.log("Ошибка", request.error);
  };

  transaction.oncomplete = function() {
    console.log("Транзакция завершена успешно");
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
