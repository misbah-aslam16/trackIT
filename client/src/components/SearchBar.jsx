import React from 'react';

const SearchBar = ({ searchTerm, onSearchChange, onFilterChange, filterStatus, filterPriority }) => {
  return (
    <div className="search-container">
      <div className="search-bar">
        <i className="fas fa-search search-icon"></i>
        <input
          type="text"
          placeholder="Search tasks..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="search-input"
        />
        {searchTerm && (
          <button 
            className="search-clear-btn"
            onClick={() => onSearchChange('')}
          >
            <i className="fas fa-times"></i>
          </button>
        )}
      </div>
      
      <div className="filter-options">
        <select 
          className="filter-select"
          value={filterStatus}
          onChange={(e) => onFilterChange('status', e.target.value)}
        >
          <option value="">All Statuses</option>
          <option value="To Do">To Do</option>
          <option value="In Progress">In Progress</option>
          <option value="Done">Done</option>
        </select>
        
        <select 
          className="filter-select"
          value={filterPriority}
          onChange={(e) => onFilterChange('priority', e.target.value)}
        >
          <option value="">All Priorities</option>
          <option value="High">High Priority</option>
          <option value="Medium">Medium Priority</option>
          <option value="Low">Low Priority</option>
        </select>
      </div>
    </div>
  );
};

export default SearchBar;
