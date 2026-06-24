const express = require('express');
const router = express.Router();
const Pedido = require('../models/Pedido');

/**
 * @swagger
 * tags:
 *   name: Pedidos
 *   description: Gerenciamento de pedidos (João)
 */

/**
 * @swagger
 * /pedidos:
 *   get:
 *     summary: Lista todos os pedidos
 *     tags: [Pedidos]
 *     responses:
 *       200:
 *         description: Lista de pedidos retornada com sucesso
 */
router.get('/', async (req, res) => {
  try {
    const pedidos = await Pedido.find();
    res.json(pedidos);
  } catch (erro) {
    res.status(500).json({ erro: erro.message });
  }
});

/**
 * @swagger
 * /pedidos/status/{status}:
 *   get:
 *     summary: Busca pedidos por status
 *     tags: [Pedidos]
 *     parameters:
 *       - in: path
 *         name: status
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Pedidos encontrados
 *       404:
 *         description: Nenhum pedido encontrado
 */
router.get('/status/:status', async (req, res) => {
  try {
    const resultado = await Pedido.find({
      status: { $regex: req.params.status, $options: 'i' }
    });
    if (resultado.length === 0) {
      return res.status(404).json({ erro: 'Nenhum pedido encontrado com esse status' });
    }
    res.json(resultado);
  } catch (erro) {
    res.status(500).json({ erro: erro.message });
  }
});

/**
 * @swagger
 * /pedidos/data/{data}:
 *   get:
 *     summary: Busca pedidos por data de entrada (formato YYYY-MM-DD)
 *     tags: [Pedidos]
 *     parameters:
 *       - in: path
 *         name: data
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Pedidos encontrados
 *       404:
 *         description: Nenhum pedido encontrado
 */
router.get('/data/:data', async (req, res) => {
  try {
    const inicio = new Date(req.params.data);
    const fim = new Date(req.params.data);
    fim.setDate(fim.getDate() + 1);
    const resultado = await Pedido.find({
      data_entrada: { $gte: inicio, $lt: fim }
    });
    if (resultado.length === 0) {
      return res.status(404).json({ erro: 'Nenhum pedido encontrado com essa data' });
    }
    res.json(resultado);
  } catch (erro) {
    res.status(500).json({ erro: erro.message });
  }
});

/**
 * @swagger
 * /pedidos/{id}:
 *   get:
 *     summary: Busca pedido por ID
 *     tags: [Pedidos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Pedido encontrado
 *       404:
 *         description: Pedido não encontrado
 */
router.get('/:id', async (req, res) => {
  try {
    const pedido = await Pedido.findById(req.params.id);
    if (!pedido) return res.status(404).json({ erro: 'Pedido não encontrado' });
    res.json(pedido);
  } catch (erro) {
    res.status(500).json({ erro: erro.message });
  }
});

/**
 * @swagger
 * /pedidos:
 *   post:
 *     summary: Cadastra um novo pedido
 *     tags: [Pedidos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               cliente_id:
 *                 type: string
 *               usuario_id:
 *                 type: string
 *               status:
 *                 type: string
 *               data_prevista:
 *                 type: string
 *               valor_total:
 *                 type: number
 *               observacoes:
 *                 type: string
 *     responses:
 *       201:
 *         description: Pedido criado com sucesso
 */
router.post('/', async (req, res) => {
  try {
    const novo = new Pedido(req.body);
    await novo.save();
    res.status(201).json(novo);
  } catch (erro) {
    res.status(500).json({ erro: erro.message });
  }
});

/**
 * @swagger
 * /pedidos/{id}:
 *   put:
 *     summary: Atualiza um pedido
 *     tags: [Pedidos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *               data_prevista:
 *                 type: string
 *               data_saida:
 *                 type: string
 *               valor_total:
 *                 type: number
 *               observacoes:
 *                 type: string
 *     responses:
 *       200:
 *         description: Pedido atualizado com sucesso
 *       404:
 *         description: Pedido não encontrado
 */
router.put('/:id', async (req, res) => {
  try {
    const atualizado = await Pedido.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!atualizado) return res.status(404).json({ erro: 'Pedido não encontrado' });
    res.json(atualizado);
  } catch (erro) {
    res.status(500).json({ erro: erro.message });
  }
});

/**
 * @swagger
 * /pedidos/{id}:
 *   delete:
 *     summary: Remove um pedido
 *     tags: [Pedidos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Pedido removido com sucesso
 *       404:
 *         description: Pedido não encontrado
 */
router.delete('/:id', async (req, res) => {
  try {
    const removido = await Pedido.findByIdAndDelete(req.params.id);
    if (!removido) return res.status(404).json({ erro: 'Pedido não encontrado' });
    res.json({ mensagem: 'Pedido removido com sucesso', pedido: removido });
  } catch (erro) {
    res.status(500).json({ erro: erro.message });
  }
});

module.exports = router;
