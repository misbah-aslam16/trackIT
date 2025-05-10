import React, { useState, useEffect } from 'react';

const TaskForm = ({ currentTask, onSave, onCancel }) => {
  const [task, setTask] = useState({
    title: '',
    description: '',
    assignedTo: '',
    status: 'To Do',
    priority: 'Medium',
    dueDate: ''
  });

  useEffect(() => {
    if (currentTask) {
      setTask(currentTask);
    }
  }, [currentTask]);

  const handleChange = (e) => {
    setTask({ ...task, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(task);
    setTask({
      title: '',
      description: '',
      assignedTo: '',
      status: 'To Do',
      priority: 'Medium',
      dueDate: ''
    });
  };

  // Get icon for status
  const getStatusIcon = (status) => {
    switch(status) {
      case 'To Do': return 'fas fa-clipboard-list';
      case 'In Progress': return 'fas fa-spinner';
      case 'Done': return 'fas fa-check-circle';
      default: return 'fas fa-tasks';
    }
  };

  // Get icon and color for priority
  const getPriorityInfo = (priority) => {
    switch(priority) {
      case 'High':
        return { icon: 'fas fa-arrow-up', color: '#e74c3c' };
      case 'Medium':
        return { icon: 'fas fa-equals', color: '#f39c12' };
      case 'Low':
        return { icon: 'fas fa-arrow-down', color: '#3498db' };
      default:
        return { icon: 'fas fa-equals', color: '#f39c12' };
    }
  };

  return (
    <form onSubmit={handleSubmit} className="task-form">
      <h3>
        {currentTask ? (
          <>
            <i className="fas fa-edit" style={{ marginRight: '10px' }}></i>
            Edit Task
          </>
        ) : (
          <>
            <i className="fas fa-plus-circle" style={{ marginRight: '10px' }}></i>
            Create New Task
          </>
        )}
      </h3>

      <div className="form-group">
        <label htmlFor="title">
          <i className="fas fa-heading" style={{ marginRight: '8px' }}></i>
          Task Title
        </label>
        <input
          type="text"
          id="title"
          name="title"
          placeholder="Enter task title"
          value={task.title}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="description">
          <i className="fas fa-align-left" style={{ marginRight: '8px' }}></i>
          Task Description
        </label>
        <textarea
          id="description"
          name="description"
          placeholder="Enter task details"
          value={task.description}
          onChange={handleChange}
          rows="3"
        />
      </div>

      <div className="form-group">
        <label htmlFor="assignedTo">
          <i className="fas fa-user" style={{ marginRight: '8px' }}></i>
          Assigned To
        </label>
        <input
          type="text"
          id="assignedTo"
          name="assignedTo"
          placeholder="Enter user name"
          value={task.assignedTo}
          onChange={handleChange}
        />
      </div>

      <div className="form-group">
        <label htmlFor="status">
          <i className="fas fa-tasks" style={{ marginRight: '8px' }}></i>
          Status
        </label>
        <select
          id="status"
          name="status"
          value={task.status}
          onChange={handleChange}
        >
          <option value="To Do">To Do</option>
          <option value="In Progress">In Progress</option>
          <option value="Done">Done</option>
        </select>
      </div>

      <div className="form-row">
        <div className="form-group form-group-half">
          <label htmlFor="priority">
            <i className="fas fa-flag" style={{ marginRight: '8px' }}></i>
            Priority
          </label>
          <select
            id="priority"
            name="priority"
            value={task.priority || 'Medium'}
            onChange={handleChange}
            className={`priority-select priority-${task.priority?.toLowerCase() || 'medium'}`}
          >
            <option value="High">High Priority</option>
            <option value="Medium">Medium Priority</option>
            <option value="Low">Low Priority</option>
          </select>
        </div>

        <div className="form-group form-group-half">
          <label htmlFor="dueDate">
            <i className="fas fa-calendar-alt" style={{ marginRight: '8px' }}></i>
            Due Date
          </label>
          <input
            type="date"
            id="dueDate"
            name="dueDate"
            value={task.dueDate || ''}
            onChange={handleChange}
            min={new Date().toISOString().split('T')[0]}
          />
        </div>
      </div>

      <div className="form-actions">
        <button type="submit" className="btn btn-primary">
          <i className={currentTask ? "fas fa-save" : "fas fa-plus"}></i>
          {currentTask ? 'Update Task' : 'Add Task'}
        </button>

        {currentTask && (
          <button type="button" onClick={onCancel} className="btn btn-danger">
            <i className="fas fa-times"></i>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

export default TaskForm;
