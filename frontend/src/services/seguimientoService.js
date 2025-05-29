import api from '../axiosConfig';

export const getAllSeguimientos = () => api.get('/api/seguimiento');
export const getSeguimientosByPaquete = (id_paquete) => api.get(`/api/seguimiento/${id_paquete}`);
export const addSeguimiento = (data) => api.post('/api/seguimiento', data);
export const getResumenEstados = () => api.get('/api/seguimiento/resumen/estado');
