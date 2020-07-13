import React from 'react';
import './App.css';
import Header from './components/Header';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Collapse from 'react-bootstrap/Collapse';
import Filters from './components/Filters';
import TodoList from './components/TodoList';
import TodoForm from './components/TodoForm';
import API from './api/API';
import { BrowserRouter as Router, Route, Link, Switch } from 'react-router-dom';

class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = { tasks: [], projects: [], filter: 'All', openMobileMenu: false, modalOpen: false, editedTask: null };
  }

  getProjects(tasks) {
    return [...new Set(tasks.map((task) => {
      if (task.project)
        return task.project;
      else
        return null;
    }))];
  }

  componentDidMount() {
    // fake loading the tasks from the API server, and create the projects list
    API.getTasks().then((tasks) => this.setState({ tasks: tasks, projects: this.getProjects(tasks) }));
  }

  toggleModal = () => {
    this.setState((state) => ({ modalOpen: !state.modalOpen, editedTask: null }));
  }

  showSidebar = () => {
    this.setState((state) => ({ openMobileMenu: !state.openMobileMenu }));
  }

  filterTasks = (filter, project) => {
    switch (filter) {
      case 'filter-important':
        API.getTasks('important').then((tasks) => this.setState({ tasks: tasks, filter: 'Important' }));
        break;
      case 'filter-today':
        API.getTasks('today').then((tasks) => this.setState({ tasks: tasks, filter: 'Today' }));
        break;
      case 'filter-week':
        API.getTasks('week').then((tasks) => this.setState({ tasks: tasks, filter: 'Next Week' }));
        break;
      case 'filter-private':
        API.getTasks('private').then((tasks) => this.setState({ tasks: tasks, filter: 'Private' }));
        break;
      case 'filter-shared':
        API.getTasks('shared').then((tasks) => this.setState({ tasks: tasks, filter: 'Shared' }));
        break;
      case 'filter-project':
        API.getTasks(project).then((tasks) => this.setState({ tasks: tasks, filter: project }));
        break;
      default:
        API.getTasks().then((tasks) => this.setState({ tasks: tasks, filter: 'All' }));
        break;
    }
  }

  addOrEditTask = (task) => {
    if (!task.id) {
      //ADD
      API.addTask(task)
        .then(() => {
          //get the updated list of tasks from the server
          API.getTasks().then((tasks) => this.setState({ tasks: tasks, filter: 'All', projects: this.getProjects(tasks) }));
        })
        .catch((errorObj) => {

        });
    } else {
      //UPDATE
      API.updateTask(task)
        .then(() => {
          //get the updated list of tasks from the server
          API.getTasks().then((tasks) => this.setState({ tasks: tasks, filter: 'All', projects: this.getProjects(tasks) }));
        })
        .catch((errorObj) => {

        });
    }
  }

  editTask = (task) => {
    this.toggleModal();
    this.setState({ editedTask: task });
  }

  deleteTask = (task) => {
    API.deleteTask(task.id)
      .then(() => {
        //get the updated list of tasks from the server
        API.getTasks().then((tasks) => this.setState({ tasks: tasks, filter: 'All', projects: this.getProjects(tasks) }));
      })
      .catch((errorObj) => {

      });
  }

  render() {
    return (
      <>
        <Router>
          <Header showSidebar={this.showSidebar} />
          <Container fluid>
            <Row className="vheight-100">
              <Collapse in={this.state.openMobileMenu}>
                <Col sm={4} bg="light" id="left-sidebar" className="collapse d-sm-block below-nav">
                  <Filters projects={this.state.projects} filterTasks={this.filterTasks} activeFilter={this.state.filter} />
                </Col>
              </Collapse>
              <Col sm={8} className="below-nav">
                <Route path='/'>
                  <h1>{this.state.filter}</h1>
                  <Link to='/add'>
                    <Button variant="success" size="lg" className="fixed-right-bottom" onClick={this.toggleModal}>&#43;</Button>
                  </Link>
                </Route>
                <Route path='/:filter'>
                  <TodoList tasks={this.state.tasks} editTask={this.editTask} updateTask={this.addOrEditTask} deleteTask={this.deleteTask} />
                </Route>

              </Col>
              <Route path='/add'>
                <TodoForm modalOpen={this.state.modalOpen} toggleModal={this.toggleModal} addOrEditTask={this.addOrEditTask} task={this.state.editedTask} />
              </Route>
            </Row>
          </Container>
        </Router>
      </>
    );
  }
}

export default App;
