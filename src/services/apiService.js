// src/services/apiService.js
import axios from 'axios';

const API_URL = 'http://localhost:4000/api';

// Function to handle login
export const login = async (email, password) => {
  const response = await axios.post(`${API_URL}/auth/login`, { email, password });
  return response.data;
};

// Function to handle signup
export const signup = async (email, password, role) => {
  const response = await axios.post(`${API_URL}/auth/signup`, { email, password, role });
  return response.data;
};

// Function to register vehicle
export const registerVehicle = async (userId, vehicleDetails) => {
  const response = await axios.post(`${API_URL}/vehicles/register`, { userId, vehicleDetails });
  return response.data;
};

// Function to upload a fine
export const uploadFine = async (officerId, fineDetails, userId) => {
  const response = await axios.post(`${API_URL}/fines/upload`, { officerId, fineDetails, userId });
  return response.data;
};
