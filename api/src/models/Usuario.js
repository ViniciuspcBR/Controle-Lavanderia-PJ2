const mongoose = require('mongoose');

const usuarioSchema = new mongoose.Schema({
  nome:       { type: String, required: true },
  email:      { type: String, required: true },
  senha_hash: { type: String, required: true },
  perfil:     { type: String, default: 'operador' },
  ativo:      { type: Boolean, default: true },
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

module.exports = mongoose.model('Usuario', usuarioSchema);
