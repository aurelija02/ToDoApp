let myregbtn = document.getElementById("regbtn");
let myregform = document.getElementById("regModal");
let span1 = document.getElementsByClassName("close")[0];

let mylogbtn = document.getElementById("loginbtn");
let mylogform = document.getElementById("logModal");
let span2 = document.getElementsByClassName("close2")[0];
let emailNumb = 0;

let usersEmailArray = [];
let usersArray = [];
let idNumb = 0;


myregbtn.onclick = function () {
    myregform.style.display = "block";
}
mylogbtn.onclick = function () {
    mylogform.style.display = "block";
}
// When the user clicks on <span> (x), close the modal
span1.onclick = function () {
    myregform.style.display = "none";
    // mylogform.style.display = "none";
}
span2.onclick = function () {
    mylogform.style.display = "none";
}
// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
    if (event.target == myregform || event.target == mylogform) {
        myregform.style.display = "none";
        mylogform.style.display = "none";
    }
}
/////////////////////////////////////////////// FETCH OUTSIDE
fetch("https://testapi.io/api/aurelija02/resource/userTable")
     .then(res => res.json())
     .then(data => data.data.forEach(element => {
        usersEmailArray.push(element.Email);
        usersArray.push(element);
        }))

console.log(usersArray);

//////////////////////////////////////////////// REGISTER

let signupbtn = document.getElementById("regFormId");
signupbtn.addEventListener("submit", checkEmail);
   
function checkEmail(e) {
    e.preventDefault();
    let myEmail = document.getElementById("email").value;

    if (usersEmailArray.includes(myEmail)) {
        let myerr = document.getElementById("error");
        myerr.textContent = "User with this email already exists!"
        myerr.style.display = "block"

    } else {
        savedata();
    }

}

async function savedata() {
    idNumb+=1;

    let myName = document.getElementById("name").value;
    let mySurname = document.getElementById("surname").value;
    let myEmail = document.getElementById("email").value;
    let myId = myName+"_"+idNumb;

    //cia reik ifo jei kartojasi ID

    await fetch("https://testapi.io/api/aurelija02/resource/userTable", {
        method: "POST",
        headers: {
            "Content-type": "application/json"
        },
        body: JSON.stringify({ Name: myName, Surname: mySurname, Email: myEmail, UserID: myId})
    })
    .then(res => res.json())
    .then(data => console.log(data));

    localStorage.setItem("user", JSON.stringify({
        id: myId,
        name: myName,
        surname: mySurname  
    }))

    location.reload();

    window.location.href = "http://127.0.0.1:3000/toDoApp/toDoApp.html";
}

//////////////////////////LOGIN

let loginbtn = document.getElementById("logFormId");
loginbtn.addEventListener("submit", checkdata);

function checkdata(e) {

    e.preventDefault();

    let myName = document.getElementById("name2").value;
    let mySurname = document.getElementById("surname2").value;

    let flag = true;
    for(let i = 0; i<usersArray.length && flag; i++){
        if (usersArray[i].Name == myName && usersArray[i].Surname == mySurname) {
            flag = false;
            console.log("registruotas vartotojas");
            let myId = usersArray[i].UserID;

            localStorage.setItem("user", JSON.stringify({
                id: myId,
                name: myName,
                surname: mySurname
            }))
            
            window.location.href = "http://127.0.0.1:3000/toDoApp/toDoApp.html"; 
        } 
    }
    if(flag){
        let logerr = document.getElementById("logerror");
        logerr.textContent = "There is no user with this name. Please register."
        logerr.style.display = "block"
    }

    // usersArray.forEach(el => {
        

    // })

}
