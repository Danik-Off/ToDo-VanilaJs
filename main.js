const openRequest = indexedDB.open("todoDB",1);
let db;
openRequest.onupgradeneeded =()=>{
db = openRequest.result;
if (!db.objectStoreNames.contains('books')) { // если хранилище "books" не существует
    db.createObjectStore('books', {keyPath: 'id'}); // создаём хранилище
  }

}

openRequest.onsuccess =()=>{
db = openRequest.result;
}

window.onload =()=>{
  
  
};
   