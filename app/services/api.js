import axios from 'axios';

// URL base da API "Controle de Lavanderia" (Projeto 01)
export const API_BASE_URL = 'http://localhost:3000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
