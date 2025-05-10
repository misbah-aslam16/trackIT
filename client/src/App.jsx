import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

// Components
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import Navbar from './components/Navbar';

// Task Management Components
import TaskForm from './components/TaskForm';
import TaskList from './components/Tasklist';
import SearchBar from './components/SearchBar';
import { fetchTasks, createTask, updateTask, deleteTask } from './api';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  // Task Management States
  const [tasks, setTasks] = useState([]);
  const [currentTask, setCurrentTask] = useState(null);

  // Search and Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterPriority, setFilterPriority] = useState('');

  // Filtered tasks based on search and filters
  const filteredTasks = tasks.filter(task => {
    // Search term filter
    const matchesSearch =
      searchTerm === '' ||
      task.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.assignedTo?.toLowerCase().includes(searchTerm.toLowerCase());

    // Status filter
    const matchesStatus = filterStatus === '' || task.status === filterStatus;

    // Priority filter (will be implemented later)
    const matchesPriority = filterPriority === '' || task.priority === filterPriority;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (token && userData) {
      setIsAuthenticated(true);
      setUser(JSON.parse(userData));
    }
  }, []);

  // Load tasks
  const loadTasks = async () => {
    // Create params object for API filtering
    const params = {};

    // Only add filters that are set
    if (filterStatus) params.status = filterStatus;
    if (filterPriority) params.priority = filterPriority;
    if (searchTerm) params.search = searchTerm;

    const { data } = await fetchTasks(params);
    setTasks(data);
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadTasks();
    }
  }, [isAuthenticated]);

  // Reload tasks when search or filters change
  useEffect(() => {
    if (isAuthenticated) {
      loadTasks();
    }
  }, [searchTerm, filterStatus, filterPriority]);

  // Task Handlers
  const handleSave = async (task) => {
    if (currentTask) {
      await updateTask(currentTask._id, task);
    } else {
      task.status = task.status || 'To Do'; // Default status
      await createTask(task);
    }
    setCurrentTask(null);
    loadTasks();
  };

  const handleEdit = (task) => {
    setCurrentTask(task);
  };

  const handleDelete = async (id) => {
    await deleteTask(id);
    loadTasks();
  };

  const handleMove = async (id, newStatus) => {
    const task = tasks.find(t => t._id === id);
    if (task) {
      await updateTask(id, { ...task, status: newStatus });
      loadTasks();
    }
  };

  const handleCancel = () => {
    setCurrentTask(null);
  };

  // Search and filter handlers
  const handleSearchChange = (value) => {
    setSearchTerm(value);
  };

  const handleFilterChange = (filterType, value) => {
    if (filterType === 'status') {
      setFilterStatus(value);
    } else if (filterType === 'priority') {
      setFilterPriority(value);
    }
  };

  const login = (userData, token) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setIsAuthenticated(true);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <Router>
      <div className="app">
        <Navbar isAuthenticated={isAuthenticated} logout={logout} user={user} />
        <div className="container">
          <Routes>
            <Route
              path="/"
              element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login login={login} />}
            />
            <Route
              path="/login"
              element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login login={login} />}
            />
            <Route
              path="/register"
              element={isAuthenticated ? <Navigate to="/login" /> : <Register />}
            />
            <Route
              path="/dashboard"
              element={
                isAuthenticated ? (
                  <div>
                    <Dashboard user={user} tasks={tasks} />
                    <div className="container">
                      <div style={{
                        textAlign: 'center',
                        margin: '40px 0 30px',
                        position: 'relative'
                      }}>
                        <h1 style={{
                          fontSize: '2rem',
                          fontWeight: '600',
                          color: '#333',
                          position: 'relative',
                          display: 'inline-block',
                          paddingBottom: '10px'
                        }}>
                          <i className="fas fa-clipboard-list" style={{ marginRight: '12px', color: '#3498db' }}></i>
                          Task Board
                        </h1>
                        <div style={{
                          position: 'absolute',
                          bottom: '0',
                          left: '50%',
                          transform: 'translateX(-50%)',
                          width: '80px',
                          height: '4px',
                          background: 'linear-gradient(90deg, #3498db, #9b59b6)',
                          borderRadius: '2px'
                        }}></div>
                      </div>

                      <SearchBar
                        searchTerm={searchTerm}
                        onSearchChange={handleSearchChange}
                        filterStatus={filterStatus}
                        filterPriority={filterPriority}
                        onFilterChange={handleFilterChange}
                      />

                      <TaskForm
                        currentTask={currentTask}
                        onSave={handleSave}
                        onCancel={handleCancel}
                      />

                      <TaskList
                        tasks={filteredTasks}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        onMove={handleMove}
                      />
                    </div>
                  </div>
                ) : (
                  <Navigate to="/login" />
                )
              }
            />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
