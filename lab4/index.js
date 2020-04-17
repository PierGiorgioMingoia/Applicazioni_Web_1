//when the page is loaded 


window.addEventListener('load',event =>{
    loadTasks();
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
        createTimeOut(tasks);
       
    }else if(activeFilter == 1){

        title.innerHTML = "Important";
        let newArray = tasks.filter(function (e1){
            return e1.important;
        });
        console.log(newArray);
        creatTasksList(newArray);
        createTimeOut(newArray);

    }else if(activeFilter == 2){

        title.innerHTML = "Today";
        const today = moment();
        let newArray = tasks.filter(function(e1){
            return e1.time.startOf('day').isSame(today.startOf('day')) ;
        });
        console.log(newArray);
        creatTasksList(newArray);
        createTimeOut(newArray);
         
    }else if(activeFilter == 3){
        //next 7 day.
        title.innerHTML = "Next 7 days"
        const today = moment();
        let newArray = tasks.filter(function(e1){
            return e1.time.diff(today,'days')<=7 && e1.time.diff(today,'days')>=0 ;
        })
        creatTasksList(newArray);
        createTimeOut(newArray);

    }else if(activeFilter == 4){
        //private
        title.innerHTML = "Private";
        let newArray = tasks.filter(function(e1){
            return !e1.shared;
        });
        creatTasksList(newArray);
        createTimeOut(newArray);

    }else if(activeFilter == 5){
        //shared
        title.innerHTML = "Shared";
        let newArray = tasks.filter(function(e1){
            return e1.shared;
        });
        creatTasksList(newArray);
        createTimeOut(newArray);
    }
}


function creatTasksList(tasks){
    
    tasks.forEach(task =>{

        const li = document.createElement('li');
        li.id = "task"+task.id;
        li.className = 'list-group-item';
        if(task.expired){
            li.className = "list-group-item bg-warning";
        }else{
            li.className = "list-group-item";
        }
        const innerDiv = document.createElement('div');
        innerDiv.className = 'custom-control custom-checkbox';
        const externalDiv = document.createElement('div');
        externalDiv.className = 'd-flex w-100 justify-content-between';
        
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = "check-t"+ task.id;
        if(task.important)
            checkbox.className = 'custom-control-input important';
        else
            checkbox.className = 'custom-control-input';

        innerDiv.appendChild(checkbox);
    
        const descriptionText = document.createElement('label');
        descriptionText.className = 'description custom-control-label';
        descriptionText.innerText = task.description;
        descriptionText.htmlFor = "check-t"+ task.id;
        innerDiv.appendChild(descriptionText);
        

        let span = document.createElement('span');
        span.className = "badge badge-success ml-4";
        span.innerText = task.project;
        innerDiv.appendChild(span);
        
        externalDiv.appendChild(innerDiv);
        if(task.deadline){
            externalDiv.insertAdjacentHTML('beforeend',`<small>${task.date}</small>`);
        }else{
            
        }
        if(task.shared){
            innerDiv.insertAdjacentHTML('afterend',`<svg class="bi bi-person-square" width="1.2em" height="1.2em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" d="M14 1H2a1 1 0 00-1 1v12a1 1 0 001 1h12a1 1 0 001-1V2a1 1 0 00-1-1zM2 0a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V2a2 2 0 00-2-2H2z" clip-rule="evenodd"/>
            <path fill-rule="evenodd" d="M2 15v-1c0-1 1-4 6-4s6 3 6 4v1H2zm6-6a3 3 0 100-6 3 3 0 000 6z" clip-rule="evenodd"/>
          </svg>`);
        }else{

        }
       
    
    li.appendChild(externalDiv);
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
    let box = document.getElementById("task"+id);
    box.className = "list-group-item bg-warning";

}

function findTask(id){
   const a = tasks.map(function(e){
       return e.id;
   }).indexOf(id);
   return a;   
}


function createTimeOut(tasks){
    console.log("TIMEOUT");
    let today = moment();
    tasks.forEach(task =>{
        if(task.deadline){
            let a = setTimeout(taskExpire,task.time.diff(today),task.id);
            timeOut.push(a);
        }
    });

}
function openForm() {
    document.getElementById("myForm").style.display = "block";
  }
  
  function closeForm() {
    document.getElementById("myForm").style.display = "none";
  }