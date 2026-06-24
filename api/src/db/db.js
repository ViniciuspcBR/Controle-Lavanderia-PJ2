const mongoose = require('mongoose');

const MONGO_URI = 'mongodb://localhost:27017/controle_lavanderia';

async function conectar() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Conectado ao MongoDB com sucesso');
  } catch (erro) {
    console.error('Erro ao conectar ao MongoDB:', erro.message);
    process.exit(1);
  }
}

module.exports = conectar;
