const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./src/swagger');
const conectar = require('./src/db/db');
const Usuario = require('./src/models/Usuario');

const usuariosRoutes = require('./src/routes/usuariosRoutes');
const clientesRoutes = require('./src/routes/clientesRoutes');
const tiposRoupaRoutes = require('./src/routes/tiposRoupaRoutes');
const servicosRoutes = require('./src/routes/servicosRoutes');
const pedidosRoutes = require('./src/routes/pedidosRoutes');
const pedidoItensRoutes = require('./src/routes/pedidoItensRoutes');
const pedidoItemServicosRoutes = require('./src/routes/pedidoItemServicosRoutes');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/usuarios', usuariosRoutes);
app.use('/clientes', clientesRoutes);
app.use('/tipos-roupa', tiposRoupaRoutes);
app.use('/servicos', servicosRoutes);
app.use('/pedidos', pedidosRoutes);
app.use('/pedido-itens', pedidoItensRoutes);
app.use('/pedido-item-servicos', pedidoItemServicosRoutes);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

const PORT = 3000;

async function seed() {
  const senha_hash = bcrypt.hashSync('123456', 10);
  await Usuario.findOneAndUpdate(
    { email: 'admin@lavanderia.com' },
    { nome: 'Administrador', email: 'admin@lavanderia.com', senha_hash, perfil: 'admin', ativo: true },
    { upsert: true, new: true }
  );
  console.log('Usuário admin garantido: admin@lavanderia.com / 123456');
}

conectar().then(async () => {
  await seed();
  app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
    console.log(`Swagger em http://localhost:${PORT}/api-docs`);
  });
});
