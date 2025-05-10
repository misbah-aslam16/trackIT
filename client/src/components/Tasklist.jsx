import React from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const TaskList = ({ tasks, onEdit, onDelete, onMove }) => {
  // Helper function to get priority icon
  const getPriorityIcon = (priority) => {
    switch(priority) {
      case 'High': return 'fas fa-arrow-up';
      case 'Medium': return 'fas fa-equals';
      case 'Low': return 'fas fa-arrow-down';
      default: return 'fas fa-equals';
    }
  };

  // Helper function to format due date
  const formatDueDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Check if it's today or tomorrow
    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow';
    } else {
      // Format as MM/DD/YYYY
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined
      });
    }
  };

  // Helper function to check if task is overdue
  const isOverdue = (dateString) => {
    const dueDate = new Date(dateString);
    dueDate.setHours(23, 59, 59, 999); // End of the day
    const today = new Date();
    return dueDate < today && dateString !== '';
  };
  // Group tasks by status
  const todoTasks = tasks.filter(task => task.status === 'To Do');
  const inProgressTasks = tasks.filter(task => task.status === 'In Progress');
  const doneTasks = tasks.filter(task => task.status === 'Done');

  const onDragEnd = (result) => {
    const { destination, source, draggableId } = result;

    // If there's no destination or the item was dropped back in its original position
    if (!destination ||
        (destination.droppableId === source.droppableId &&
         destination.index === source.index)) {
      return;
    }

    // Find the task that was dragged
    const task = tasks.find(t => t._id === draggableId);

    // Determine the new status based on the destination droppable
    let newStatus;
    switch (destination.droppableId) {
      case 'todo':
        newStatus = 'To Do';
        break;
      case 'inProgress':
        newStatus = 'In Progress';
        break;
      case 'done':
        newStatus = 'Done';
        break;
      default:
        return;
    }

    // Update the task status if it changed
    if (task && task.status !== newStatus) {
      onMove(task._id, newStatus);
    }
  };

  // Get status-specific icon and class
  const getTaskStatusInfo = (status) => {
    switch(status) {
      case 'To Do':
        return {
          icon: 'fas fa-clipboard-list',
          className: 'todo',
          color: '#e74c3c'
        };
      case 'In Progress':
        return {
          icon: 'fas fa-spinner fa-spin',
          className: 'in-progress',
          color: '#f39c12'
        };
      case 'Done':
        return {
          icon: 'fas fa-check-circle',
          className: 'done',
          color: '#2ecc71'
        };
      default:
        return {
          icon: 'fas fa-tasks',
          className: '',
          color: '#3498db'
        };
    }
  };

  // Task card component
  const TaskCard = ({ task, index }) => {
    const { icon, className, color } = getTaskStatusInfo(task.status);

    return (
      <Draggable draggableId={task._id} index={index}>
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            className={`task-card ${className}`}
            style={{
              ...provided.draggableProps.style
            }}
          >
            <h3>
              <i className={icon} style={{ color }}></i>
              {task.title}
            </h3>

            <p>{task.description}</p>

            <div className="task-meta">
              <span>
                <i className="fas fa-user"></i>
                {task.assignedTo || 'Unassigned'}
              </span>
              <span>
                <i className="fas fa-tag"></i>
                {task.status}
              </span>

              {task.priority && (
                <span className={`priority-badge priority-${task.priority.toLowerCase()}`}>
                  <i className={getPriorityIcon(task.priority)}></i>
                  {task.priority}
                </span>
              )}

              {task.dueDate && (
                <span className={`due-date ${isOverdue(task.dueDate) ? 'overdue' : ''}`}>
                  <i className="fas fa-calendar-alt"></i>
                  {formatDueDate(task.dueDate)}
                </span>
              )}
            </div>

            <div className="task-actions">
              <button
                className="edit"
                onClick={() => onEdit(task)}
              >
                <i className="fas fa-edit"></i> Edit
              </button>

              <button
                className="delete"
                onClick={() => onDelete(task._id)}
              >
                <i className="fas fa-trash-alt"></i> Delete
              </button>

              {task.status === 'To Do' && (
                <button
                  className="move"
                  onClick={() => onMove(task._id, 'In Progress')}
                >
                  <i className="fas fa-arrow-right"></i> Start
                </button>
              )}

              {task.status === 'In Progress' && (
                <button
                  className="complete"
                  onClick={() => onMove(task._id, 'Done')}
                >
                  <i className="fas fa-check"></i> Complete
                </button>
              )}
            </div>
          </div>
        )}
      </Draggable>
    );
  };

  // Column component
  const Column = ({ title, tasks, droppableId }) => {
    // Get column icon based on title
    const getColumnIcon = () => {
      switch(title) {
        case 'To Do': return 'fas fa-list-ul';
        case 'In Progress': return 'fas fa-spinner';
        case 'Done': return 'fas fa-check-double';
        default: return 'fas fa-tasks';
      }
    };

    return (
      <div className="task-column">
        <h2 className="column-header">
          <i className={getColumnIcon()} style={{ marginRight: '8px' }}></i>
          {title}
        </h2>
        <Droppable droppableId={droppableId}>
          {(provided) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              style={{
                minHeight: '300px',
                padding: '8px'
              }}
            >
              {tasks.length === 0 ? (
                <div style={{
                  textAlign: 'center',
                  padding: '2rem',
                  color: '#aaa',
                  fontSize: '0.9rem',
                  fontStyle: 'italic'
                }}>
                  <i className="fas fa-inbox" style={{ fontSize: '2rem', marginBottom: '1rem', display: 'block' }}></i>
                  No tasks in this column
                </div>
              ) : (
                tasks.map((task, index) => (
                  <TaskCard key={task._id} task={task} index={index} />
                ))
              )}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </div>
    );
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="task-board">
        <Column title="To Do" tasks={todoTasks} droppableId="todo" />
        <Column title="In Progress" tasks={inProgressTasks} droppableId="inProgress" />
        <Column title="Done" tasks={doneTasks} droppableId="done" />
      </div>
    </DragDropContext>
  );
};

export default TaskList;
