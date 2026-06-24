// Serviço de Pedidos
// Entidade: pedidos | Responsável: João
import api from './api';

const RESOURCE = '/pedidos';

export const pedidosService = {
  listar: () => api.get(RESOURCE),
  buscarPorId: (id) => api.get(`${RESOURCE}/${id}`),
  buscarPorStatus: (status) => api.get(`${RESOURCE}/status/${status}`),
  buscarPorData: (data) => api.get(`${RESOURCE}/data/${data}`),
  criar: (dados) => api.post(RESOURCE, dados),
  atualizar: (id, dados) => api.put(`${RESOURCE}/${id}`, dados),
  remover: (id) => api.delete(`${RESOURCE}/${id}`),
};

export default pedidosService;
