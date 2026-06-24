const mongoose = require('mongoose');

const pedidoSchema = new mongoose.Schema({
  cliente_id:    { type: String, required: true },
  usuario_id:    { type: String },
  status:        { type: String, default: 'recebido' },
  data_entrada:  { type: Date, default: Date.now },
  data_prevista: { type: Date },
  data_saida:    { type: Date },
  valor_total:   { type: Number, default: 0 },
  observacoes:   { type: String },
});

module.exports = mongoose.model('Pedido', pedidoSchema);
