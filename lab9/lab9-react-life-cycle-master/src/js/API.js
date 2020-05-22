import moment from 'moment';


const APIURL = new URL('http://localhost:3010');
let tasks = [
    {
        "id": 1,
        "description": "Complete Lab 3",
        "important": true,
        "privateTask": false,
        "deadline": moment("2020-04-03T11:00:00"),
        "project": "WebApp I",
        "completed": true
    },
    {
        "id": 2,
        "description": "Watch Mr. Robot",
        "important": false,
        "privateTask": true,
        "deadline": moment("2020-05-31T18:59:00"),
        "project": "Personal",
        "completed": false
    },
    {
        "id": 3,
        "description": "Go for a walk",
        "important": true,
        "privateTask": true,
        "deadline": moment("2020-04-18T08:00:00"),
        "project": "Personal",
        "completed": false
    }];


const isToday = (date) => {
    return date.isSame(moment(), 'day');
}

const isNextWeek = (date) => {
    const nextWeek = moment().add(1, 'weeks');
    const tomorrow = moment().add(1, 'days');
    return date.isAfter(tomorrow) && date.isBefore(nextWeek);
}

async function getTasks() {
    return fetch(new URL('/tasks', APIURL))
        .then((response) => {
            if (response.ok) {
                return response.json();
            } else {
                throw response.statusText;
            }
        }).catch((error) => {
            throw error;
        });
}

async function getImportantTasks() {
    return fetch(new URL('/tasks', APIURL))
        .then((response) => {
            if (response.ok) {
                return response.json();
            } else {
                throw response.statusText;
            }
        }).then((data) => {
            return data.filter((e1) => {
                e1.deadline = moment(e1.deadline);
                return e1.important;
            });
        }).catch((error) => {
            throw error;
        });
}

async function getTodayTasks() {
    return tasks.filter((el) => {
        if (el.deadline)
            return isToday(el.deadline);
        else
            return false;
    });
}

async function getWeeklyTasks() {
    return tasks.filter((el) => {
        if (el.deadline)
            return isNextWeek(el.deadline);
        else
            return false;
    });
}

async function getPrivateTasks() {
    return tasks.filter((el) => {
        return el.privateTask;
    });
}

async function getSharedTasks() {
    return tasks.filter((el) => {
        return !el.privateTask;
    });
}

async function getByProject(project) {
    return tasks.filter((el) => {
        return el.project === project;
    });
}

async function addTask(task) {
    let newId = 0;
    if (API.getTasks().lenght !== 0) newId = Math.max(...API.getTasks().then((data)=>data.map((m) => m.id)) + 1);
    task.id = newId;
    fetch(new URL('/tasks', APIURL), {
        method: 'POST', // or 'PUT'
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(task),
    })
}

const API = { getTasks, getImportantTasks, getTodayTasks, getWeeklyTasks, getPrivateTasks, getSharedTasks, getByProject, addTask };
export default API;
