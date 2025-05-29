import api from '../axiosConfig';

export const getAllPaquetes = () => api.get('/api/paquetes/registropaq');
export const getPaqueteById = (id) => api.get(`/api/paquetes/registropaq/${id}`);
export const addPaquete = (data) => api.post('/api/paquetes/registropaq', data);
export const updatePaquete = (id, data) => api.put(`/api/paquetes/registropaq/${id}`, data);
export const deletePaquete = (id) => api.delete(`/api/paquetes/registropaq/${id}`);
export const updatePaqueteEstado = (id, data) => api.put(`/api/paquetes/registropaq/${id}/estado`, data);
