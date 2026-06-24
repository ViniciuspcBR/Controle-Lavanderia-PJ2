const mongoose = require('mongoose');

const pedidoItemSchema = new mongoose.Schema({
  pedido_id:      { type: String, required: true },
  tipo_roupa_id:  { type: String, required: true },
  quantidade:     { type: Number, default: 1 },
  descricao:      { type: String },
  status:         { type: String, default: 'recebido' },
  valor_total:    { type: Number, default: 0 },
});

module.exports = mongoose.model('PedidoItem', pedidoItemSchema);
