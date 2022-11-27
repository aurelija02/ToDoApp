let myaddform = document.getElementById("taskform");
let myinputtype = document.getElementById("type");
let myinputcontent = document.getElementById("content");
let myinputendDate = document.getElementById("endDate");
let myTaskContainer = document.getElementById("tasks");

let userName
let userSurname
let myUserId;

let getUser = localStorage.getItem("user");

userName = JSON.parse(getUser).name;
userSurname = JSON.parse(getUser).surname;
myUserId = JSON.parse(getUser).id;

console.log(getUser);

let toDoList = [];

document.getElementById("userHead").textContent = userName + " " + userSurname;

getToDos();

let myaddbtn = document.getElementById("addbtn");

myaddbtn.addEventListener("click", ()=>{
  let addContainer = document.getElementById("addTaskContainer");
  addContainer.style.display = "block";
})

async function getToDos() {
  await fetch("https://testapi.io/api/aurelija02/resource/todoApp")
    .then(res => res.json())
    .then(data => data.data.forEach(element => {
      toDoList.push(element);
    }
    ))
  console.log(toDoList); 

  for (let i = 0; i < toDoList.length; i++) {
    if (toDoList[i].userId == myUserId) {

      let task_el = document.createElement('div');
      task_el.classList.add('taskContent');
      task_el.id = `task_${i}`

      let task_content_el = document.createElement('div');
      task_content_el.classList.add('content');
      task_el.appendChild(task_content_el);

      let task_input_el1 = document.createElement('input');
      task_input_el1.classList.add('textType');
      task_input_el1.type = 'text';
      task_input_el1.value = toDoList[i].type;
      task_input_el1.setAttribute('readonly', 'readonly');

      let task_input_el2 = document.createElement('textarea');
      task_input_el2.classList.add('textContent');
      task_input_el2.type = 'text';
      task_input_el2.setAttribute("wrap", "soft")
      task_input_el2.value = toDoList[i].content;
      task_input_el2.setAttribute('readonly', 'readonly');

      let task_input_el3 = document.createElement('input');
      task_input_el3.classList.add('textEndDate');
      task_input_el3.type = 'date';
      task_input_el3.value = toDoList[i].endDate;
      task_input_el3.setAttribute('readonly', 'readonly');

      task_content_el.appendChild(task_input_el1);
      task_content_el.appendChild(task_input_el2);
      task_content_el.appendChild(task_input_el3);

      const task_actions_el = document.createElement('div');
      task_actions_el.classList.add('actions');

      const edit_btn = document.createElement('button');
      edit_btn.classList.add('editbtn');
      edit_btn.id = `editbtn${i}`;
      edit_btn.innerText = 'Edit';
      

      const delete_btn = document.createElement('button');
      delete_btn.classList.add('deletebtn');
      delete_btn.id = `deletebtn_${i}`;
      delete_btn.innerText = 'Delete';

      task_actions_el.appendChild(edit_btn);
      task_actions_el.appendChild(delete_btn);

      task_el.appendChild(task_actions_el)
      myTaskContainer.appendChild(task_el);
      //myTaskContainer.appendChild(task_actions_el);

      localStorage.setItem(`post${i}`, JSON.stringify({
        postId: toDoList[i].id,
        origType: toDoList[i].type,
        origContent: toDoList[i].content,
        origEndDate: toDoList[i].endDate,
        editBtnId: edit_btn.id,
        deleteBtnId: delete_btn.id
      }))

      edit_btn.addEventListener('click', (e) => {
        if (edit_btn.innerText.toLowerCase() == "edit") {
          edit_btn.innerText = "Save";
          task_input_el1.removeAttribute("readonly");
          task_input_el1.focus();
          task_input_el2.removeAttribute("readonly");
          task_input_el2.focus();
          task_input_el3.removeAttribute("readonly");
          task_input_el3.focus();

        } else {
          edit_btn.innerText = "Edit";
          task_input_el1.setAttribute("readonly", "readonly");
          task_input_el2.setAttribute("readonly", "readonly");
          task_input_el3.setAttribute("readonly", "readonly");

          let updatedinput1 = task_input_el1.value;
          let updatedinput2 = task_input_el2.value;
          let updatedinput3 = task_input_el3.value;

          updateApi(toDoList, updatedinput1, updatedinput2, updatedinput3, myUserId, i);

        }

      });

      delete_btn.addEventListener('click', (e) => {
        let taskid = task_el.id;
        let delbtnid = delete_btn.id;
        let taskArr = taskid.split("_");
        let delbtnArr = delbtnid.split("_");

        if (taskArr[1] == delbtnArr[1]) {
          myTaskContainer.removeChild(task_el);

          console.log("pavyko istrinti");
          let getPost = localStorage.getItem(`post${delbtnArr[1]}`);
          mypostId = JSON.parse(getPost).postId;
          deletePost(mypostId);
        }

      });
    }
  }
}

function deletePost(mypostId) {
  console.log("esu delete funkcijoje");
  fetch(`https://testapi.io/api/aurelija02/resource/todoApp/${mypostId}`, {
    method: "DELETE",
  })
}

async function updateApi(myArray, updatedinput1, updatedinput2, updatedinput3, myUserId, i) {
  console.log("esu update funkcijoje");
  let myApiId = myArray[i].id;

  await fetch(`https://testapi.io/api/aurelija02/resource/todoApp/${myApiId}`, {
    method: "PUT",
    headers: {
      "Content-type": "application/json"
    },
    body: JSON.stringify({ type: updatedinput1, content: updatedinput2, endDate: updatedinput3, userId: myUserId })
  })
    .then(res => res.json())
  //.then(data => console.log(data));
  location.reload();
}


myaddform.addEventListener('submit', postToDo)

async function postToDo(e) {
  e.preventDefault();

  let taskType = myinputtype.value;
  let taskContent = myinputcontent.value;
  let taskEndDate = myinputendDate.value;

  await fetch("https://testapi.io/api/aurelija02/resource/todoApp", {
    method: "POST",
    headers: {
      "Content-type": "application/json"
    },
    body: JSON.stringify({ type: taskType, content: taskContent, endDate: taskEndDate, userId: myUserId })
  })
    .then(res => res.json())
    .then(data => console.log(data));

  let task_el = document.createElement('div');
  task_el.classList.add('taskContent');

  let task_content_el = document.createElement('div');
  task_content_el.classList.add('content');
  task_el.appendChild(task_content_el);

  let task_input_el1 = document.createElement('input');
  task_input_el1.classList.add('text1');
  task_input_el1.type = 'text';
  task_input_el1.value = taskType;
  task_input_el1.setAttribute('readonly', 'readonly');

  let task_input_el2 = document.createElement('input');
  task_input_el2.classList.add('text2');
  task_input_el2.type = 'text';
  task_input_el2.value = taskContent;
  task_input_el2.setAttribute('readonly', 'readonly');

  let task_input_el3 = document.createElement('input');
  task_input_el3.classList.add('text3');
  task_input_el3.type = 'date';
  task_input_el3.value = taskEndDate;
  task_input_el3.setAttribute('readonly', 'readonly');

  task_content_el.appendChild(task_input_el1);
  task_content_el.appendChild(task_input_el2);
  task_content_el.appendChild(task_input_el3);

  const task_actions_el = document.createElement('div');
  task_actions_el.classList.add('actions');

  const edit_btn = document.createElement('button');
  edit_btn.classList.add('editbtn');
  edit_btn.innerText = 'Edit';

  const delete_btn = document.createElement('button');
  delete_btn.classList.add('deletebtn');
  delete_btn.innerText = 'Delete';

  task_actions_el.appendChild(edit_btn);
  task_actions_el.appendChild(delete_btn);

  task_el.appendChild(task_actions_el)
  myTaskContainer.appendChild(task_el);

  myinputtype.value = '';
  myinputcontent.value = '';
  myinputendDate.value = '';

  location.reload();
  
}
