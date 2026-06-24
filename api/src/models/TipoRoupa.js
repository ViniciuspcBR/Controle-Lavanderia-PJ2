const mongoose = require('mongoose');

const tipoRoupaSchema = new mongoose.Schema({
  nome:      { type: String, required: true },
  descricao: { type: String },
});

module.exports = mongoose.model('TipoRoupa', tipoRoupaSchema);
