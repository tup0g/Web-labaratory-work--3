import axios from 'axios';
import { Pizza } from '../types/Pizza';

const BASE = 'http://localhost:3001/api/pizzas';

export const pizzaApi = {
  getAll: () => axios.get<Pizza[]>(BASE).then(r => r.data),
  getById: (id: number) => axios.get<Pizza>(`${BASE}/${id}`).then(r => r.data),
  create: (pizza: Pizza) => axios.post<Pizza>(BASE, pizza).then(r => r.data),
  update: (id: number, pizza: Pizza) => axios.put(`${BASE}/${id}`, pizza).then(r => r.data),
  delete: (id: number) => axios.delete(`${BASE}/${id}`).then(r => r.data),
};
