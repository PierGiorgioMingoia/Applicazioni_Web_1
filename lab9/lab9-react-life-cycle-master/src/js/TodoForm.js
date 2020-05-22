import React from 'react';
import moment from 'moment'

function OptionalTodoForm(props) {

    let {mode, addOrEditTask, editedTask, closeTaskForm} = props;

    if (mode === 'view')
        return null;
    else {
        return <div className={'jumbotron'}>
            <TodoForm mode = {mode} addOrEditTask = {addOrEditTask} task={editedTask} cancelTask = {closeTaskForm}></TodoForm>

        </div>;
    }
}

class TodoForm extends React.Component {

    constructor(props) {
        super(props);
        if(this.props.task){
            this.state = {...this.props.task};
            if(this.props.task.deadline){
                this.state.deadlineDate = this.props.task.deadline.format("YYYY-MM-DD");
                this.state.deadlineTime = this.props.task.deadline.format("HH:mm");
            }

        } else {
            this.state = {description: '', project: '', important: false, privateTask: true, deadlineDate: '', deadlineTime: ''};
        }       
    }

    updateField = (name, value) => {
        this.setState({[name]: value});
    }

    insert = () => {
        if (!this.form.checkValidity()) {
            this.form.reportValidity();
        } else {
            let task = Object.assign({}, this.state);
            if(task.deadlineDate !== "" && task.deadlineTime !== "")
                task.deadline = moment(task.deadlineDate + " " + task.deadlineTime);
            else if(task.deadlineDate !== "")
                task.deadline = moment(task.deadlineDate);
            this.props.addOrEditTask(task);
        }  
    }
   
    render() {
        if (this.props.mode === 'view')
            return null;
        else {
            return( <div>
            <form method="POST" onSubmit={(event) => event.preventDefault()} action="" id="addForm" ref={form => this.form = form}>  
                <div className="form-row">  
                    <div className="col">
                        <label htmlFor="form_description">Description</label>
                        <input type="text" className="form-control input-lg" name="description" 
                            placeholder="Type a description..." id="form_description" 
                            value = {this.state.description}
                            onChange={(ev) => this.updateField(ev.target.name, ev.target.value)}
                            required/>
                    </div>
                    <div className="col">
                        <label htmlFor="form_project">Project</label>
                        <input type="text" className="form-control input-lg" name="project" 
                            placeholder="Type a project for the task..." id="form_project"
                            value = {this.state.project}
                            onChange={(ev) => this.updateField(ev.target.name, ev.target.value)}/>
                    </div>
                </div> 

                <div className="form-row">  
                    <div className="col">
                        <label htmlFor="form_important" className="control-label">Important</label>
                        <input type="checkbox" name="important" id="form_important"
                            checked = {this.state.important}
                            onChange={(ev) => this.updateField(ev.target.name, ev.target.checked)}/>          
                    </div>
                    <div className="col">
                        <label htmlFor="form_private" className="control-label">Private</label>
                        <input type="checkbox" name="privateTask" id="form_private" 
                            checked = {this.state.privateTask}
                            onChange={(ev) => this.updateField(ev.target.name, ev.target.checked)}/>    
                    </div>
                </div> 

                <div className="form-row">  
                    <div className="col">
                        <label htmlFor ="form_deadline_date" className="control-label">Date</label>
                        <input type="date" className="form-control input-lg" name="deadlineDate" id="form_deadline_date"
                            value = {this.state.deadlineDate}
                            onChange={(ev) => this.updateField(ev.target.name, ev.target.value)}/>
                    </div>
                    <div className="col">
                        <label htmlFor="form_deadline_time">Time</label>
                        <input type="time" className="form-control input-lg" name="deadlineTime" id="form_deadline_time"
                            value = {this.state.deadlineTime}
                            onChange={(ev) => this.updateField(ev.target.name, ev.target.value)}/>
                    </div>
                </div> 
               
                <div className="form-group">
                    <div>
                        <button type="submit" className="btn btn-primary" onClick = {() => this.insert()}>{this.props.mode === 'add' ? 'Add' : 'Update'}</button>
                    </div>
                </div>
            </form>
        </div>);
        }
    }
}

export  {TodoForm, OptionalTodoForm};
