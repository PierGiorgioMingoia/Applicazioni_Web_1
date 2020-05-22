import React from 'react';

function createProject(project) {
    return (
        <a href="/#" key = {project} className="list-group-item list-group-item-action">{project}</a>
    );
}
class Filters extends React.Component {
    constructor(props) {
        super(props);
        this.state = {filter : 'filter-all'};
    }

    render() {
        return (
            <div>
                <div className="list-group list-group-flush">
                    <a href="/#" id = "filter-all" onClick = {() => {this.props.filterTasks("filter-all"); this.setState({filter: "filter-all"});}} className={this.state.filter === "filter-all" ? "list-group-item list-group-item-action active":"list-group-item list-group-item-action"}>All</a>
                    <a href="/#" id = "filter-important" onClick = {() => {this.props.filterTasks("filter-important"); this.setState({filter: "filter-important"});}} className={this.state.filter === "filter-important" ? "list-group-item list-group-item-action active":"list-group-item list-group-item-action"}>Important</a>
                    <a href="/#" id = "filter-today" onClick = {() => {this.props.filterTasks("filter-today"); this.setState({filter: "filter-today"});}} className={this.state.filter === "filter-today" ? "list-group-item list-group-item-action active":"list-group-item list-group-item-action"}>Today</a>
                    <a href="/#" id = "filter-week" onClick = {() => {this.props.filterTasks("filter-week"); this.setState({filter: "filter-week"});}} className={this.state.filter === "filter-week" ? "list-group-item list-group-item-action active":"list-group-item list-group-item-action"}>Next 7 Days</a>
                    <a href="/#" id = "filter-private" onClick = {() => {this.props.filterTasks("filter-private"); this.setState({filter: "filter-private"});}} className={this.state.filter === "filter-private" ? "list-group-item list-group-item-action active":"list-group-item list-group-item-action"}>Private</a>
                    <a href="/#" id = "filter-shared" onClick = {() => {this.props.filterTasks("filter-shared"); this.setState({filter: "filter-shared"});}} className={this.state.filter === "filter-shared" ? "list-group-item list-group-item-action active":"list-group-item list-group-item-action"}>Shared With...</a>
                </div>
        
                <div className="my-5">
                    <h6 className="border-bottom border-gray p-3 mb-0">Projects</h6>
                    <div className="list-group list-group-flush" id = "projects">
                        {this.props.projects.map(createProject) }
                    </div>
                </div>
              </div>
            );
    }
}

export default Filters;