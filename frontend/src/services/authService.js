import axios from 'axios';

const API = 'http://localhost:3000';

export const register = async (userData) => {
    const response = await axios.post(
        `${API}/register`,
        userData
    );

    return response.data;
};

export const login = async (userData) => {
    const response = await axios.post(
        `${API}/login`,
        userData
    );

    return response.data;
};