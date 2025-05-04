import axios from 'axios';

const api = axios.create({
    baseURL: '/api/', // Proxy to Django backend
});

export const getDashboardStats = () => api.get('dashboard/stats/');
export const getCalendarEvents = () => api.get('calendar/');
export const getVeterinaryServices = () => api.get('veterinary/');
export const getKnowledgeHub = () => api.get('knowledge/');
export const getUserData = () => api.get('user/');
