import axios from 'axios';

const API = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000', // Set this in your `.env` file
});

export const getCows = async () => {
    const response = await API.get('/'); // Backend endpoint for getting all cows
    return response.data;
};

export const addCow = async (cowData: { name: string; tag_Number: string; weight: number; age: number; gender: string }) => {
    const response = await API.post('/', cowData); // Backend endpoint for adding a cow
    return response.data;
};
