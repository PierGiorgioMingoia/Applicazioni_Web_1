import React from 'react';
import './App.css';
import TodoList from './js/TodoList';
import NavBar from './js/NavBar';
import Filters from './js/Filters';
import moment from 'moment';
import OptionalForm from './js/add';
import Task from './js/task';

const tasks = [
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

class App extends React.Component {

  getProjects() {
    return [...new Set(this.state.tasks.map(task => task.project))];
  }


  filterTasks = (filter) => {

    switch (filter) {
      case 'all':
        this.setState((state) => ({ tasks: tasks, af: 'all' }));
        break;
      case 'important':
        this.setState((state) => ({ tasks: tasks.filter((task) => task.important === true), af: 'important' }));
        break;
      case 'today':
        this.setState((state) => ({ tasks: tasks.filter((task) => task.deadline.day() === moment().day()), af: 'today' }));
        break;
      case '7days':
        this.setState((state) => ({ tasks: tasks.filter((task) => task.deadline <= moment().add(7, 'days')), af: '7days' }));
        break;
      case 'private':
        this.setState((state) => ({ tasks: tasks.filter((task) => task.privateTask === true), af: 'private' }));
        break;
      case 'shared':
        this.setState((state) => ({ tasks: tasks.filter((task) => task.privateTask === false), af: 'shared' }));
        break;
      default:
        this.setState((state) => ({ tasks: tasks }));
        break;
    }
  }


  addOrEditTask = (task) => {
    this.setState((state) => {
      let buildState = tasks.filter((t) => t.id !== task.id);
      let a = new Task(5,task.description,task.important,task.privateTask,task.deadline,task.project)
      buildState.push(a);
      return { tasks: buildState }
    });
    this.setState({ mode: 'view' });
  }

  requireEditTask = (task) => {
    this.setState({ mode: 'edit', editedTask: task });
  }

  cancelTask = () => {
    this.setState({ mode: 'view', editedTask: null });

  }
  openTaskForm = () => {
    this.setState({ mode: 'add', editedTask: null });
  }

  constructor(props) {
    super(props);
    this.state = { tasks: tasks, af: 'all', filteredTasks: [], mode:'view', editedTask:null };

  }


  render() {
    return (
      <div>
        <NavBar />
        <div className="container-fluid">
          <div className="row vheight-100">
            <aside className="collapse d-sm-block col-sm-4 col-12 bg-light below-nav" id="left-sidebar">
              <Filters active={this.state.af} projects={this.getProjects()} filter={this.filterTasks} />
            </aside>
            <main className="col-sm-8 col-12 below-nav">
              <TodoList active={this.state.af} tasks={this.state.tasks} />
              <OptionalForm mode ={this.state.mode} task={this.state.editedTask} addOrEditTask ={this.addOrEditTask} cancelTask={this.cancelTask}/>
              <button type="button" className="btn btn-lg btn-success fixed-right-bottom" onClick ={()=>this.openTaskForm()}>&#43;</button>
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
