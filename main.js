let db;
let openRequest;
let mostId =0;
let allCompleted = false;
let countCompleted = 0;
let lengthTasks =0;
let com = 
{
  set countCompleted(d)
  {
    const list = document.getElementsByClassName("todo-list")[0];
    const main = document.getElementsByClassName("main")[0];
    countCompleted+=d;
    const length = list.children.length;
    console.log(countCompleted,length);

    addCountUi();
   
    if(countCompleted === list.children.length)
    {
      console.log("выбраны все элементы");
      document.getElementById("toggle-all").checked = true;
    }
    else
    {
      document.getElementById("toggle-all").checked = false;
    }
    if(countCompleted>0)
    {
       
        document.getElementsByClassName(" clear-completed")[0].style.display="block";
    }
    else
    {
        document.getElementsByClassName(" clear-completed")[0].style.display="none";
    }
    if(length<1)
    {
      document.getElementsByClassName("main")[0].style.display="none";
    }
    else
    {
      document.getElementsByClassName("main")[0].style.display="block";
    }
  },

 
}


window.onload = function () {
  document.getElementsByClassName("new-todo")[0].addEventListener("change", addNew);
  document.getElementById("toggle-all").addEventListener("click",chooseAll);
  document.getElementsByClassName(" clear-completed")[0].addEventListener("click",clearCompleted);

  let filters = document.getElementsByClassName("filters")[0].children;
  filters[0].addEventListener("click",()=>filter("all"));
  filters[1].addEventListener("click",()=>filter("active"));
  filters[2].addEventListener("click",()=>filter("completed"));

 let openRequest = indexedDB.open("store", 2);

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
 

function clearCompleted()
{
    let list = document.getElementsByClassName("todo-list")[0];
   while(countCompleted)
    {   
      let li = list.firstChild;
      let checkBox = li.firstChild.firstChild;
       if(checkBox.checked)
       {
        console.log(li);
         del({target:checkBox});

       }
    }
}
function addCountUi()
{
    const list = document.getElementsByClassName("todo-list")[0];
    const length = list.children.length;
    document.getElementsByClassName("todo-count")[0].innerText =`${length -  countCompleted} items left`;
}
function chooseAll()
{
  let inp =document.getElementById("toggle-all");
  let list = document.getElementsByClassName("todo-list")[0];
  let val;
  if(inp.checked)
  {
     val =true;
  }
  else
  {
     val =false;
  }
  inp.checked =val;

  for(nodeTask of list.childNodes){ 
    console.log(nodeTask);
    let checkBox = nodeTask.firstChild.firstChild;
    checkBox.checked =val;
   editSt({target:checkBox},val)
  }
}
function filter(f="all")
{
  f = (f)?f:"all";
  let list = document.getElementsByClassName("todo-list")[0];
  let filters = document.getElementsByClassName("filters")[0].children;
    filters[0].firstElementChild.setAttribute("class","");
    filters[1].firstElementChild.setAttribute("class","");
    filters[2].firstElementChild.setAttribute("class","");
    switch(f)
    {
      case"active":
      filters[1].firstElementChild.setAttribute("class","selected");
      break;
      case"completed":
      filters[2].firstElementChild.setAttribute("class","selected");
      break;
      case"all":
        filters[0].firstElementChild.setAttribute("class","selected");
        break;
    }
 for(nodeTask of list.children){
   
    switch(f)
    {
      case"active":
      if(!nodeTask.firstChild.firstChild.checked)
      {
        nodeTask.style.display = ""
        console.log( filters[0].firstElementChild);
        
      }
      else
      {
        nodeTask.style.display = "none"
        
      }
        
      break;
      case"completed":
      if(nodeTask.firstChild.firstChild.checked)
      {
        nodeTask.style.display = ""
      }
      else
      {
        nodeTask.style.display="none"
      }
        
      break;
      case"all":
        nodeTask.style.display = ""
        break;
    }
    
  }
}
function loadTasks()
{
  let list = document.getElementsByClassName("todo-list")[0];
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
      if(task.status)
      {
        countCompleted+=1;
        li.setAttribute("class","completed");
      }
       
     
       
    }
    com.countCompleted = 0;
    const currentUrl = window.location.href;
    const typeFilter = currentUrl.split('/').slice(-1)[0];
    filter(typeFilter);
  };

  request.onerror = function () {
    console.log("Ошибка", request.error);
  };

}
function addNew(e, check = false, addToBD = true, id) {
  console.log(mostId);
  let value = e.target.value;
  e.target.value = "";
  let list = document.getElementsByClassName("todo-list")[0];
  console.log(list.childNodes.length);


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

  li = document.createElement("li");
  li.id = id;
  li.append(createView(value,check));

  list.insertBefore(li, list.firstChild);
  addCountUi();
}

function editSt(e,check=null) {
  
    let view = e.target.parentNode;
    let li = view.parentNode;
    
    let transaction = db.transaction("tasks", "readwrite");
    let  tasks = transaction.objectStore("tasks");
    console.log(+li.id);
    let request = tasks.get(+li.id); 
    request.onsuccess = function () {
      let task = request.result;
      console.log(task.status);
      task["status"] = (check!==null)?check:!task.status;
      console.log(task.status);
      if(task.status)
      {
       com.countCompleted = 1;
       li.setAttribute("class","completed");
      }
      else
      {
        com.countCompleted = -1;
        li.setAttribute("class","");
      }
      tasks.put(task);
    };
   
  }
//сохраняем статус и текст во временное хранилище,меняем наполнение на input с этим тектом для редактирования 

function edit(e) {
  let view = e.target.parentNode;
  let li = view.parentNode;
  li.setAttribute("class","editing");

  let text = view.children[1].innerText;
 
  inp = document.createElement("input");
  inp.classList.add("edit");
  inp.value = text;

  inp.addEventListener("change", save);
  inp.addEventListener("blur", save);
  li.appendChild(inp);
  li.lastChild.focus();
}

let cashValue;
function save(e) {
  let newText = e.target.value;
  let li = e.target.parentNode;
  li.setAttribute("class","");
  li.removeChild(li.lastChild);

  let view = li.firstChild;
  let label =  view.querySelector("label");
  label.innerText=newText;
  cashValue = newText;

  let transaction = db.transaction("tasks", "readwrite"); 
  
  tasks = transaction.objectStore("tasks");
  request = tasks.get(+li.id);

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
  let view = e.target.parentNode;
  let li = view.parentNode;
  let ul = li.parentNode;
  let checkBox = view.firstChild;
  const isCompleted =   checkBox.checked
  
  ul.removeChild(li);
  let transaction = db.transaction("tasks", "readwrite");

  tasks = transaction.objectStore("tasks");
  request = tasks.delete(+li.id); 

  request.onsuccess = function () {
    console.log("Задача удалена");
  };

  request.onerror = function () {
    console.log("Ошибка", request.error);
  };
  if(isCompleted)
  {
    com.countCompleted = -1;
    console.log(countCompleted)
  }
}


function createView(text,checked)
{
  let view = document.createElement("div");
  view.classList.add("view");

  let checkInput = document.createElement("input");
  checkInput.classList.add("toggle");
  checkInput.type = "checkbox";
  checkInput.checked= checked;
  checkInput.addEventListener("click",editSt);
  view.appendChild(checkInput);

  let label = document.createElement("label")
  label.innerText =text;
  label.addEventListener("dblclick",edit)
  
  view.appendChild(label);

  let destroy = document.createElement("button");
  destroy.classList.add("destroy");
  destroy.addEventListener("click",del);
  view.appendChild(destroy);

  return view;

}
