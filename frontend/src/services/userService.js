import api from '../axiosConfig';

export const getAllUsers = () => api.get('/api/users');
export const addUser = (data) => api.post('/api/users', data);
export const deleteUser = (id) => api.delete(`/api/users/${id}`);
export const updateUser = (id, data) => api.put(`/api/users/${id}`, data);
export const getAllSeguimientos = () => api.get('/api/seguimiento');
