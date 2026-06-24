const mongoose = require('mongoose');

const servicoSchema = new mongoose.Schema({
  nome:       { type: String, required: true },
  descricao:  { type: String },
  preco_base: { type: Number, default: 0 },
  ativo:      { type: Boolean, default: true },
});

module.exports = mongoose.model('Servico', servicoSchema);
