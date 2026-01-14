import axios from 'axios';

// Default to localhost:3000 if not specified, but relative path might be better in production
// For now matching existing behavior
const API_BASE_URL = 'http://localhost:3000/api';

const remoteAPI = {
    getData: async () => {
        const response = await axios.get(`${API_BASE_URL}/data`);
        return response.data;
    },

    addCountry: async (countryName) => {
        const response = await axios.post(`${API_BASE_URL}/add`, { country: countryName });
        return response.data;
    },

    addUser: async (name, color) => {
        try {
            const response = await axios.post(`${API_BASE_URL}/new`, { name, color });
            return response.data;
        } catch (err) {
            throw err;
        }
    },

    switchUser: async (userId) => {
        try {
            const response = await axios.post(`${API_BASE_URL}/user`, { user: userId });
            return response.data;
        } catch (err) {
            throw err;
        }
    },

    deleteCountry: async (countryName) => {
        try {
            // Backend handles name lookup if 'country' is passed
            const response = await axios.post(`${API_BASE_URL}/delete/country`, { country: countryName });
            return response.data;
        } catch (err) {
            throw err;
        }
    },

    deleteUser: async (userId) => {
        try {
            const response = await axios.post(`${API_BASE_URL}/delete/user`, { user: userId });
            return response.data;
        } catch (err) {
            throw err;
        }
    }
};

export default remoteAPI;
