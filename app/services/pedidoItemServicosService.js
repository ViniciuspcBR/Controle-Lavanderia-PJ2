// Serviço de Serviços do Item do Pedido
// Entidade: pedido_item_servicos | Responsável: Vilson Vinicius
import api from './api';

const RESOURCE = '/pedido-item-servicos';

export const pedidoItemServicosService = {
  listar: () => api.get(RESOURCE),
  buscarPorId: (id) => api.get(`${RESOURCE}/${id}`),
  buscarPorItem: (pedidoItemId) => api.get(`${RESOURCE}/item/${pedidoItemId}`),
  buscarPorServico: (servicoId) => api.get(`${RESOURCE}/servico/${servicoId}`),
  criar: (dados) => api.post(RESOURCE, dados),
  atualizar: (id, dados) => api.put(`${RESOURCE}/${id}`, dados),
  remover: (id) => api.delete(`${RESOURCE}/${id}`),
};

export default pedidoItemServicosService;
