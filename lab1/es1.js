"use strict";

const readlineSync = require('readline-sync');


//wait for user's response 

//const userName = readlineSync.question(' May I have your name? ');
//console.log(' Hi '+userName+' !');

const options = [" insert new task ", " remove task"," remove date task ", " show tasks "," close "];
let tasks = [];
let index = 0;

function start(){
    
    const index = readlineSync.keyInSelect(options, 'Which action?');

    if(index == 0){
        insertTask();
    
        //console.log(tasks)
    }

    if(index == 1){
        removeTask();

        //console.log('remove')
    }
    if(index == 2){

        removeDayTask();

    }
    if(index == 3){

        showTasks();
       // console.log('show')
    }

    else{
        return;
    }


}

function insertTask(){

    const task = new Object();
    task.title = readlineSync.question(' Add a title for the task: ');
    task.description = readlineSync.question(' Add a description: ');
    if (readlineSync.keyInYN(' Is it urgent?')) {
        // 'Y' key was pressed.
        task.urgent = 'urgent';
        
      } else {
        
        task.urgent = 'not urgent';
        
      }
      if (readlineSync.keyInYN(' Is it shared?')) {
        // 'Y' key was pressed.
        task.shared = 'shared';
        
      } else {
        
        task.shared = 'private';
        
      }
      if (readlineSync.keyInYN(' Do you want to add a deadline?')) {
        // 'Y' key was pressed.
        let data = readlineSync.question(' Insert the date YYYY-MM-DD-HH-M ');
        let arr  = [...data.split('-')];
        console.log(arr);
        data = new Date(Date.UTC(arr[0],arr[1]-1,arr[2],arr[3],arr[4],0,0));
        let today = new Date();

        if(data.getTime()> today.getTime()){
            task.deadline = data;
           /* task.timeOut = setTimeout(function(){
                deadTask(index);
                console.log(index);
            },10000);
            console.log('Hola')*/
            
        }else{
            console.log(' Date non valid ');
            return start();
        }


      } else {
        
        task.deadline = false;
        
      }
    index++;
    tasks.push(task);
    return start();
}

function removeTask(){

    const t = readlineSync.question(' Which task you want to remove? ');
    let c = checkTitle(t,tasks);
    //console.log(c);
    if(c[0]){
        tasks.splice(c[1],1);
    }else{
        console.log(' Task not found ')
    }
    //console.log(tasks);
    return start();
}

function checkTitle(t,arr){

    let x = [false,null];
    for (let i = 0; i<arr.length; i++){
        //console.log(arr[i].title);
        if(arr[i].title === t){
            x[0] = true;
            x[1] = i;
        }
    }
    return x ;
}

function checkDate(d,arr){

    let x = [false,null];
    for (let i = 0; i<arr.length; i++){

        if(arr[i].deadline != false ){

            if(arr[i].deadline.getDate() === d.getDate() && arr[i].deadline.getMonth() === d.getMonth() && arr[i].deadline.getFullYear() === d.getFullYear()){
            x[0] = true;
            x[1] = i;
            }
        }
    }
    return x;

}

function showTasks(){

    let b = [...tasks];
    b.sort(compareTitle);
    console.log(b);
    return start();

}

function compareTitle(a,b){
    if (a.title < b.title)
     return -1;
  if (a.title > b.title)
    return 1;
  return 0;
}

function removeDayTask(){

    const data = readlineSync.question(' Insert the date YYYY-MM-DD ');
    const d = new Date(data);

    const c = checkDate(d,tasks);
    if(c[0]){
        for(let i = 0; i<tasks.length; i++){
            console.log(i);
            if(tasks[i].deadline != false){
                if(tasks[i].deadline.getDate() === d.getDate() && tasks[i].deadline.getMonth() === d.getMonth() && tasks[i].deadline.getFullYear() === d.getFullYear()){
                    console.log('S');
                    tasks.splice(i,1);
                    i = 0;
                }
            }
        }
       
    }else{
        console.log(' Date not found ')
    }
    return start();

}
function deadTask(i){
    //tasks.splice(i,1);
    console.log('dead');
}

start();