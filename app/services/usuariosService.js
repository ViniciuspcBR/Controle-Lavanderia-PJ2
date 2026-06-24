// Serviço de Usuários
// Entidade: usuarios | Responsável: Vinicius Cardoso
import api from './api';

const RESOURCE = '/usuarios';

export const usuariosService = {
  listar: () => api.get(RESOURCE),
  buscarPorId: (id) => api.get(`${RESOURCE}/${id}`),
  buscarPorNome: (nome) => api.get(`${RESOURCE}/nome/${nome}`),
  criar: (dados) => api.post(RESOURCE, dados),
  atualizar: (id, dados) => api.put(`${RESOURCE}/${id}`, dados),
  remover: (id) => api.delete(`${RESOURCE}/${id}`),
};

export default usuariosService;
