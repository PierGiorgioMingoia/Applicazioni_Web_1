//when the page is loaded 

console.log(moment("2020-01-01", "YYYY-MM-DD").format("MMM Do YY")      );

window.addEventListener('load',event =>{
    loadTasks();
});

let filters = ['All', 'Important', 'Today', 'Next 7 Dayz', 'Private', 'Shared' ];
let projects = ['Web Application I', 'Personal'];
let activeFilter = 2;
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
        const today = new Date();
        let newArray = tasks.filter(function(e1){
            return e1.time.getDate() == today.getDate();
        });
        console.log(newArray);
        creatTasksList(newArray);
         
    }else if(activeFilter == 3){
        //next 7 day
    }else if(activeFilter == 4){
        //private
    }else if(activeFilter == 5){
        //private
    }else if(activeFilter == 6){
        //shared
    }
}


function creatTasksList(tasks){
    
    tasks.forEach(task =>{
        console.log(tasks);
        console.log(task.description);
        let li = document.createElement('li');
        li.className = "list-group-item";
        let  div = document.createElement('div');
        div.className = "d-flex w-100 justify-content-between";
        let checkbox = document.createElement('div');
        checkbox.className = "custom-control custom-checkbox";
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
        label.for = "${input.id}";
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