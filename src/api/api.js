import axios from "axios";

const API_BASE_URL = "http://localhost:8000";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("access_token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

// ENDPOINTS

export const registerUser = async (userData) => {
  const response = await api.post("/auth/register", userData);
  return response.data;
};

export const verifyEmail = async (verifyData) => {
  const response = await api.post("/auth/verify-email", verifyData);
  return response.data;
};

export const loginUser = async (credentials) => {
  const response = await api.post("/auth/login", credentials);
  return response.data;
};

export const getTasks = async () => {
  const response = await api.get("/task/");
  return response.data;
};

export const getTaskById = async (id) => {
  const response = await api.get(`/task/${id}`);
  return response.data;
};

export const createTask = async (taskData) => {
  const response = await api.post("/task/", taskData);
  return response.data;
};


export const updateTask = async (id, taskData) => {
  const response = await api.put(`/task/${id}`, taskData);
  return response.data;
};


export const deleteTask = async (id) => {
  const response = await api. delete(`/task/${id}`);
  return response.data;
};

export const getReminders = async () => {
  const response = await api. get('/reminder/');
  return response. data;
};


export const createReminder = async (reminderData) => {
  const response = await api. post('/reminder/', reminderData);
  return response.data;
};

export const healthCheck = async () => {
  const response = await api.get('/health');
  return response.data;
};

export default api;