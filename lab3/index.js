//when the page is loaded 


window.addEventListener('load',event =>{
    loadTasks();
    createTimeOut();
});

let timeOut = [];
let filters = ['All', 'Important', 'Today', 'Next 7 Dayz', 'Private', 'Shared' ];
let projects = ['Web Application I', 'Personal'];
let activeFilter = 0;
let main = document.getElementById('main-tasks-cont');
let list = document.createElement('ul');
list.className =  "list-group list-group-flush";
const title = document.createElement('h1');
main.appendChild(title);
main.appendChild(list);

function loadTasks(){
    
    if(activeFilter === 0){
       
        title.innerHTML = "All";
        creatTasksList(tasks);
       
    }else if(activeFilter == 1){

        title.innerHTML = "Important";
        let newArray = tasks.filter(function (e1){
            return e1.important;
        });
        console.log(newArray);
        creatTasksList(newArray);

    }else if(activeFilter == 2){

        title.innerHTML = "Today";
        const today =moment();
        let newArray = tasks.filter(function(e1){
            return e1.time.startOf('day').isSame(today.startOf('day')) ;
        });
        console.log(newArray);
        creatTasksList(newArray);
         
    }else if(activeFilter == 3){
        //next 7 day.
        title.innerHTML = "Next 7 days"
        const today = moment();
        let newArray = tasks.filter(function(e1){
            return e1.time.diff(today,'days')<=7;
        })
        creatTasksList(newArray);

    }else if(activeFilter == 4){
        //private
        title.innerHTML = "Private";
        let newArray = tasks.filter(function(e1){
            return !e1.shared;
        });
        creatTasksList(newArray);

    }else if(activeFilter == 5){
        //shared
        title.innerHTML = "Shared";
        let newArray = tasks.filter(function(e1){
            return e1.shared;
        });
        creatTasksList(newArray);
    }
}


function creatTasksList(tasks){
    
    tasks.forEach(task =>{
        //console.log(tasks);
        //console.log(task.description);
        let li = document.createElement('li');
        li.className = "list-group-item";
        let  div = document.createElement('div');
        div.className = "d-flex w-100 justify-content-between";
        let checkbox = document.createElement('div');
        checkbox.className = "custom-control custom-checkbox";
        li.id = "box_"+task.id; 
        let input = document.createElement('input');

        if(task.important){
            input.className = "custom-control-input important";
        }else{
            input.className = "custom-control-input";
        }

        input.type = "checkbox"
        input.id = "check-"+task.id;
        let label = document.createElement('label');
        label.className = "custom-control-label",
        label.for = input.id;
        label.innerText = task.description;
        let span = document.createElement('span');
        span.className = "badge badge-success ml-4";
        span.innerText = task.project;
        checkbox.appendChild(input);
        checkbox.appendChild(label);
        checkbox.appendChild(span);
        div.appendChild(checkbox);

        if(task.shared){
            div.insertAdjacentHTML('beforeend',`<svg class="bi bi-person-square" width="1.2em" height="1.2em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" d="M14 1H2a1 1 0 00-1 1v12a1 1 0 001 1h12a1 1 0 001-1V2a1 1 0 00-1-1zM2 0a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V2a2 2 0 00-2-2H2z" clip-rule="evenodd"/>
            <path fill-rule="evenodd" d="M2 15v-1c0-1 1-4 6-4s6 3 6 4v1H2zm6-6a3 3 0 100-6 3 3 0 000 6z" clip-rule="evenodd"/>
          </svg>`);
        }else{

        }

        if(task.deadline){
            div.insertAdjacentHTML('beforeend',`<small>${task.date}</small>`);
        }else{
            
        }
        li.appendChild(div);
        list.appendChild(li);
    });

}

function filterChanged(x){

    if(x!=activeFilter){
        let f = document.getElementById("f"+x);
        let d = document.getElementById("f"+activeFilter);
        f.className = "list-group-item list-group-item-action active";
        d.className = "list-group-item list-group-item-action"
        activeFilter = x;
        list.innerHTML='';
        loadTasks();
        console.log("Tasks loaded");
    }else{

    }

}


//function when a task expire 

function taskExpire(id){

    const index = findTask(id);
    tasks[index].expired = true;
    let box = document.getElementById("box_"+id);
    box.className = "list-group-item bg-warning";

}

function findTask(id){
   const a = tasks.map(function(e){
       return e.id;
   }).indexOf(id);
   return a;   
}


function createTimeOut(){
    
    let today = moment();
    tasks.forEach(task =>{
        let a = setTimeout(taskExpire,task.time.diff(today),task.id);
        timeOut.push(a);
    });
    
}