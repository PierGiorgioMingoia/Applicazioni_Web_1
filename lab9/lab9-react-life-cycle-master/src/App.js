import React from 'react';
import './App.css';
import TodoList from './js/TodoList';
import { OptionalTodoForm } from "./js/TodoForm";
import NavBar from './js/NavBar';
import Filters from './js/Filters';
import API from './js/API';
import moment from 'moment';


class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = { tasks: [], projects: [], mode: 'view', filter: 'All', editedTask: null };
  }

  getProjects(tasks) {
    return [...new Set(tasks.map(task => task.project))];
  }

  componentDidMount() {
    // fake loading the exams from the API server
    API.getTasks().then((tasks) => {
      tasks.forEach(element => {
        element.deadline = moment(element.deadline);
      });
      this.setState({ tasks: tasks, projects: this.getProjects(tasks) })
    });
  }

  filterTasks = (filter) => {
    switch (filter) {
      case 'filter-all':
        API.getTasks().then((tasks) => {
          tasks.forEach(element => {
            element.deadline = moment(element.deadline);
          });
          this.setState({ tasks: tasks, filter: 'all' })
        });
        break;
      case 'filter-important':
        API.getImportantTasks().then((tasks) => this.setState({ tasks: tasks, filter: 'Important' }));
        break;
      case 'filter-today':
        API.getTodayTasks().then((tasks) => this.setState({ tasks: tasks, filter: 'Today' }));
        break;
      case 'filter-week':
        API.getWeeklyTasks().then((tasks) => this.setState({ tasks: tasks, filter: 'Next Week' }));
        break;
      case 'filter-private':
        API.getPrivateTasks().then((tasks) => this.setState({ tasks: tasks, filter: 'Private' }));
        break;
      case 'filter-shared':
        API.getSharedTasks().then((tasks) => this.setState({ tasks: tasks, filter: 'Shared' }));
        break;
      default:
        API.getTasks().then((tasks) => this.setState({ tasks: tasks, filter: 'All' }));
        break;
    }
  }

  deleteTask = (task) => {
    this.setState((state) => ({ tasks: state.tasks.filter((t) => t.id !== task.id) }));
  }

  addOrEditTask = (task) => {
    API.addTask(task);
    /*
    this.setState((state) => {
      // generate a fake id for newly inserted tasks
      if(!task.id)
        task.id = state.tasks.slice(-1)[0].id + 1;
      // remove possible duplicates 
      let buildState = state.tasks.filter((t) => t.id !== task.id);
      // add new task
      buildState.push(task);
      //sort tasks by id
      buildState = buildState.sort((a, b) => a.id - b.id);
      return {tasks: buildState};
    });*/
    API.getTasks().then((tasks) => {
      tasks.forEach(element => {
        element.deadline = moment(element.deadline);
      });
      this.setState({ tasks: tasks, projects: this.getProjects(tasks), mode: 'view' })
    });
  }

  openTaskForm = () => {
    this.setState({ mode: 'add', editedTask: null });
  }

  closeTaskForm = () => {
    this.setState({ mode: 'view', editedTask: null });
  }

  requireEditTask = (task) => {
    this.setState({ mode: 'edit', editedTask: task });
  }

  render() {
    return (
      <div>
        <NavBar />
        <div className="container-fluid">
          <div className="row vheight-100">
            <aside className="collapse d-sm-block col-sm-4 col-12 bg-light below-nav" id="left-sidebar">
              <Filters projects={this.state.projects} filterTasks={this.filterTasks} />
            </aside>
            <main className="col-sm-8 col-12 below-nav">
              <h1>{this.state.filter}</h1>

              <TodoList tasks={this.state.tasks} mode={this.state.mode} addOrEditTask={this.addOrEditTask} requireEditTask={this.requireEditTask} deleteTask={this.deleteTask} />
              <OptionalTodoForm mode={this.state.mode} addOrEditTask={this.addOrEditTask} editedTask={this.state.editedTask} cancelTask={this.closeTaskForm}></OptionalTodoForm>
              {this.state.mode === "view" && (<button type="button" className="btn btn-lg btn-success fixed-right-bottom" onClick={() => this.openTaskForm()}>&#43;</button>)}
              {this.state.mode !== "view" && (<button type="button" className="btn btn-lg btn-danger fixed-right-bottom" onClick={() => this.closeTaskForm()}>X</button>)}

            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
