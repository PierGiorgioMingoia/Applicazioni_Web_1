const tasks = [
    {   
        "id" : 0,
        "description" : "Completare Lab2",
        "project"     : "Web Application I",
        "important" : false,
        "shared" : false,
        "with" : null,
        "deadline" : true,
        "time" :  moment("2021-04-06 4:30","YYYY-MM-DD HH:mm"),
        "date" : moment("2021-04-06 4:30","YYYY-MM-DD HH:mm").format('LLLL'),
        "completed" : false,
        "expired": false
    },
    {
        "id" : 1,
        "description" : "Buy some groceries",
        "project"     : "Personal",
        "important" : true,
        "shared" : true,
        "with" : "Marzia",
        "deadline" : true,
        "time" : moment("2020-04-06 4:30","YYYY-MM-DD HH:mm"),
        "date" :  moment("2020-04-06 4:30","YYYY-MM-DD HH:mm").format('LLLL'),
        "completed": false,
        "expired":false
    },
    {
        "id" : 2,
        "description" : "Buy some pasta",
        "project"     : "Personal",
        "important" : false,
        "shared" : true,
        "with" : "Marzia",
        "deadline" : true,
        "time" : moment("2020-04-09 22:16","YYYY-MM-DD HH:mm"),
        "date" :  moment("2020-04-09 22:16","YYYY-MM-DD HH:mm").format('LLLL'),
        "completed": false,
        "expired":false
    },
    {
        "id" : 3,
        "description" : "Buy some rape",
        "project"     : "Personal",
        "important" : true,
        "shared" : true,
        "with" : "Marzia",
        "deadline" : true,
        "time" : moment("2020-04-17 9:12","YYYY-MM-DD HH:mm"),
        "date" :   moment("2020-04-17 9:12","YYYY-MM-DD HH:mm").format('LLLL'),
        "completed": false,
        "expired":false
    }
]
let filters = ['All', 'Important', 'Today', 'Next 7 Dayz', 'Private', 'Shared' ];
const projects = ['Web Application I', 'Personal'];

const app = new App(tasks,filters);

window.addEventListener('load',event =>{
    app.loadTasks();
    app.loadProjects();
});
