import axios from 'axios'


const api =  axios.create({
    baseURL:import.meta.env.VITE_API_URL || 'http://localhost:4000/api',
    withCredentials: true,
});

// Response interceptor for global Toast alerts
api.interceptors.response.use(
    (response) => response,
    (error) => {
        const message = error.response?.data?.message || "Something went wrong";
        // Call your toast library here (e.g., toast.error(message))
        return Promise.reject(error);
    }
);


export default api