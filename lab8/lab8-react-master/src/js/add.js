import React from 'react';

const OptionalForm = (props) => {
    if (props.mode === 'view') return null;
    else {
        return <div className={'jumbotron'}>
            <TaskForm task={props.task} mode={props.mode} addOrEditTask={props.addOrEditTask} cancelTask={props.cancelTask} />
        </div>
    }
}

class TaskForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = this.props.task ? { ...this.props.task } : { description: null, privateTask: null, important: null, deadline: null, project: null }
    }

    updateField = (name, value) => {
        this.setState({ [name]: value });
    }

    doInsertTask = (task) => {
        if (this.form.checkValidity()) {
            this.props.addOrEditTask(task);
        } else {
            this.form.reportValidity();
        }
    }

    doCancel = () => {
        this.props.cancelTask();
    }

    validateForm = (event) => {
        event.preventDefault();
    }

    render() {
        return <form className='' onSubmit={this.validateForm} ref={form => this.form = form}>
            <TaskFormData task={{ description: this.state.description || '', privateTask: this.state.privateTask || '', important: this.state.important || '', deadline: this.state.deadline || '', project: this.state.project || '' }}
                updateField={this.updateField}
                mode={this.props.mode}
            />
            <TaskFormControls insert={() => this.doInsertTask(this.state)} cancel={this.doCancel} mode={this.props.mode} />
        </form>
    }

}

const TaskFormControls = (props) => {
    return <div className={'form-row'}>
        <button type='button' className='btn btn-primary' onClick={props.insert}>
            {props.mode === 'add' ? 'Insert' : 'Modify'}
        </button>
        &nbsp;
        <button type='button' className="btn btn-secondary" onClick={props.cancel}>Cancel</button>
    </div>
}

const TaskFormData = (props) => {
    return <div className={'form-row'}>
        <div className={'form-group'}>
            <label htmlFor='inputDescription'>Description</label>
            <input id='inputDescription' className={'form-control'} type='text' name='description' value={props.task.description} required={true}
                onChange={(ev) => props.updateField(ev.target.name, ev.target.value)} />
        </div>
        <div className={'form-group'}>
            <label htmlFor='selectPrivate'>Private</label>
            <select id='selectPrivate' className={'form-control'} required={true}
                name='privateTask'
                value={props.task.privateTask}
                onChange={(ev) => props.updateField(ev.target.name, ev.target.value)}>
                <option value={true}> true </option>
                <option value={false}> false</option>
            </select></div>
        <div className={'form-group'}>
            <label htmlFor='selectImportant'>Important</label>
            <select id='selectImportant' className={'form-control'} required={true}
                name='important'
                value={props.task.important}
                onChange={(ev) => props.updateField(ev.target.name, ev.target.value)}>
                <option value={true}> true </option>
                <option value={false}> false</option>
            </select></div>
        <div className={'form-group'}>
            <label htmlFor='inputDate'>Date</label>
            <input id='inputDate' className={'form-control'} required={true}
                type='date'
                name='deadline'
                value={props.task.deadline}
                onChange={(ev) => props.updateField(ev.target.name, ev.target.value)}
            />
            {/*onChange={(ev) => props.updateDate(ev.target.value)}*/}
            <div className={'form-group'}>
                <label htmlFor='inputProject'>Project</label>
                <input id='inputProject' className={'form-control'} type='text' name='project' value={props.task.project} required={true}
                    onChange={(ev) => props.updateField(ev.target.name, ev.target.value)} />
            </div>
        </div>
    </div>
}

export default OptionalForm;