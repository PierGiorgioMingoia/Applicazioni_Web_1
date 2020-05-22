import React from 'react';
import TodoItem from './TodoItem';



const TodoList = (props) => {

  let {tasks, mode, addOrEditTask, requireEditTask, deleteTask} = props;

  if (mode !== 'view')
    return null;
  else {
    return (
      <div>
        {tasks && 
        <ul className ="list-group list-group-flush">
          {tasks.map((t) => <TodoItem key = {t.id} task = {t} deleteTask = {deleteTask} addOrEditTask = {addOrEditTask} requireEditTask = {requireEditTask}/>)}
          
        </ul>}
      </div>
    );
  }
}

export default TodoList;
