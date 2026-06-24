// Serviço de Itens do Pedido
// Entidade: pedido_itens | Responsável: Matheus Lenz
import api from './api';

const RESOURCE = '/pedido-itens';

export const pedidoItensService = {
  listar: () => api.get(RESOURCE),
  buscarPorId: (id) => api.get(`${RESOURCE}/${id}`),
  buscarPorPedido: (pedidoId) => api.get(`${RESOURCE}/pedido/${pedidoId}`),
  criar: (dados) => api.post(RESOURCE, dados),
  atualizar: (id, dados) => api.put(`${RESOURCE}/${id}`, dados),
  remover: (id) => api.delete(`${RESOURCE}/${id}`),
};

export default pedidoItensService;
