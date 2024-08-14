const toDoForm = document.querySelector('#todo-form');
const toDoInput = toDoForm.querySelector('input');
const toDoList = document.querySelector('#todo-list');
const allDelete = document.querySelector('.allDelete');
const txt = document.querySelector('.txt');
const TODOS_KEY = "todos";

document.write('<script src ="script.js"></script>')


let toDos = new Array();

function saveToDos() { //item을 localStorage에 저장합니다.
    typeof(Storage) !== 'undefined' && localStorage.setItem(TODOS_KEY, JSON.stringify(toDos));
};

function allDeleteToDo() { //전체 item을 삭제
    localStorage.clear(toDos);
    toDoList.innerText = '';
};

function deleteToDo(e) { //각각의 item을 삭제
    const li = e.target.parentElement;
    li.remove();
    toDos = toDos.filter((toDo) => toDo.id !== parseInt(li.id));
    toDos.length === 0 && (txt.innerText = '최근검색어 내역이 없습니다.')
    saveToDos();
};

 
function paintToDo(newTodo) { //화면에 뿌림
    const {id, text} = newTodo;
    const item = document.createElement("li");
    const span = document.createElement("span");
    const button = document.createElement("buttons");
    const btn_btn = document.createElement("buttons");//search 버튼 속성 생성

    item.id = id;
    span.innerText = text;//즐겨찾기에 리스트가 포함되는 영역임
    button.innerText = '❌';
    btn_btn.innerText = '⭐';
    
    btn_btn.addEventListener("click",()=>{
    ps.keywordSearch( text, placesSearchCB); 

    }); //search 클릭 이벤트 //즐겨찾기 리스트에 지금 내용이 비어있다
    button.addEventListener("click", deleteToDo);
    allDelete.addEventListener("click", allDeleteToDo);

    item.appendChild(span);
    item.appendChild(btn_btn); //상속
    item.appendChild(button);
    toDoList.appendChild(item);
    newTodo !== null && allDelete.classList.remove('off');
};

function handleToDoSubmit(event) { //form 전송
    event.preventDefault();
    const inputvalue = document.getElementById("keyword").value;
    const newTodoObj = {
        id: Date.now(),
        text: inputvalue
    };
    toDos.push(newTodoObj);
    paintToDo(newTodoObj);
    saveToDos();
};

toDoForm.addEventListener('submit', handleToDoSubmit);

const savedToDos = JSON.parse(localStorage.getItem(TODOS_KEY));
if(savedToDos !== null) {
    toDos = savedToDos //전에 있던 items들을 계속 가지도 있다록 합니다. 
    savedToDos.forEach(paintToDo);
}