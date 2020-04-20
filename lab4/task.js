const checkboxImportant = document.getElementById('gridCheck1');

checkboxImportant.addEventListener('change', function(){
    if(this.checked){
    
    } else {
      
    }
});

const checkboxShared = document.getElementById('gridCheck2');
const inputWith = document.getElementById('inputWith2');

checkboxShared.addEventListener('change',function(){
    if(this.checked){
        inputWith.disabled = false;
    } else {
        inputWith.disabled = true;
    }
});

const checkboxDeadline = document.getElementById('gridCheck3');
const inputDate = document.getElementById('inputDate3');

checkboxDeadline.addEventListener('change',function(){
    if(this.checked){
        inputDate.disabled = false;
    } else {
        inputDate.disabled = true;
    }
});

const addTaskB = document.getElementById('addTaskB');
const desctiptionInput = document.getElementById('inputDescription1');
const projectInput = document.getElementById('inputProject');

addTaskB.addEventListener('click',function(){

    let today = moment();
    console.log('HOLA');
    let w = null;
    let mom = null;
    if(desctiptionInput.value != "" || projectInput.value != ""){
        
        if(checkboxDeadline.checked){
            let tmp = inputDate.value+"";
            console.log(tmp);
            let res = tmp.split("T");
            let time = res[0]+' '+res[1];
             mom = moment(time,"YYYY-MM-DD HH:mm");
            console.log(time);
            if(mom<today){
                alert("Insert correct value");
                return;
            }
        }else{
             mom = null;
        }
        if(checkboxShared.checked){
         w = inputWith.value
        }else{
         w = null;
        }


        const task = new Task(desctiptionInput.value,projectInput.value,checkboxImportant.checked,checkboxShared.checked,w,checkboxDeadline.checked,mom)
        console.log(task);
        app.tasks.push(task);
        app.loadTasks();
    }else{
        alert('Fill missing values');
    }
});

let index = 4;

class Task{

    constructor(description,project,important,shared,wit,deadline,time){

        this.id = index
        index++;
        this.description = description;
        if(!projects.includes(project)){
            projects.push(project);
            app.loadProjects();
        }
        this.project = project;
        this.important = important;
        this.shared = shared;
        this.with = wit;
        this.deadline = deadline;
        this.time =  time;
        if(time!=null){
            this.date = time.format('LLLL');
        }else{
            this.date = null;
        }
        this.expired = false;
        this.completed = false;

    }
}