import axios from 'axios';

const API = axios.create({
  baseURL: 'https://trackit-production-494f.up.railway.app/api'
});

export const fetchTasks = (params = {}) => API.get('/tasks', { params });
export const createTask = (newTask) => API.post('/tasks', newTask);
export const updateTask = (id, updatedTask) => API.put(`/tasks/${id}`, updatedTask);
export const deleteTask = (id) => API.delete(`/tasks/${id}`);
