import React from 'react';

function createProject(project) {
    return (
        <a href="/#" key = {project} className="list-group-item list-group-item-action">{project}</a>
    );
}

const Filters = (props) => {
    let {projects} = props;
    let {active} = props;

  
    return (
    <div>
        <div className="list-group list-group-flush">
            <a href="/#" id = "filter-all" className={"list-group-item list-group-item-action"+(active==='all' ? ' active':'') } onClick={()=>props.filter('all')}>All</a>
            <a href="/#" id = "filter-important" className={"list-group-item list-group-item-action"+(active==='important' ? ' active':'') } onClick={()=>props.filter('important')}>Important</a>
            <a href="/#" id = "filter-today" className={"list-group-item list-group-item-action"+(active==='today' ? ' active':'') } onClick={()=>props.filter('today')}>Today</a>
            <a href="/#" id = "filter-week" className={"list-group-item list-group-item-action"+(active==='7days' ? ' active':'') } onClick={()=>props.filter('7days')}>Next 7 Days</a>
            <a href="/#" id = "filter-private" className={"list-group-item list-group-item-action"+(active==='private' ? ' active':'') } onClick={()=>props.filter('private')}>Private</a>
            <a href="/#" id = "filter-shared" className={"list-group-item list-group-item-action"+(active==='shared' ? ' active':'') } onClick={()=>props.filter('shared')}>Shared With...</a>
        </div>

        <div className="my-5">
            <h6 className="border-bottom border-gray p-3 mb-0">Projects</h6>
            <div className="list-group list-group-flush" id = "projects">
                {projects.map(createProject) }
            </div>
        </div>
      </div>
    );
  }
  
  export default Filters;