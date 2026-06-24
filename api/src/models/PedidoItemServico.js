const mongoose = require('mongoose');

const pedidoItemServicoSchema = new mongoose.Schema({
  pedido_item_id:  { type: String, required: true },
  servico_id:      { type: String, required: true },
  preco_unitario:  { type: Number, default: 0 },
  quantidade:      { type: Number, default: 1 },
  valor_total:     { type: Number, default: 0 },
});

module.exports = mongoose.model('PedidoItemServico', pedidoItemServicoSchema);
