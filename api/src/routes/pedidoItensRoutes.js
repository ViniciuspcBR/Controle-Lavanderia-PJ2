const express = require('express');
const router = express.Router();
const PedidoItem = require('../models/PedidoItem');

/**
 * @swagger
 * tags:
 *   name: Itens do Pedido
 *   description: Gerenciamento de itens do pedido (Matheus Lenz)
 */

/**
 * @swagger
 * /pedido-itens:
 *   get:
 *     summary: Lista todos os itens de pedido
 *     tags: [Itens do Pedido]
 *     responses:
 *       200:
 *         description: Lista retornada com sucesso
 */
router.get('/', async (req, res) => {
  try {
    const itens = await PedidoItem.find();
    res.json(itens);
  } catch (erro) {
    res.status(500).json({ erro: erro.message });
  }
});

/**
 * @swagger
 * /pedido-itens/pedido/{pedido_id}:
 *   get:
 *     summary: Busca itens por ID do pedido
 *     tags: [Itens do Pedido]
 *     parameters:
 *       - in: path
 *         name: pedido_id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Itens encontrados
 *       404:
 *         description: Nenhum item encontrado
 */
router.get('/pedido/:pedido_id', async (req, res) => {
  try {
    const resultado = await PedidoItem.find({ pedido_id: req.params.pedido_id });
    if (resultado.length === 0) {
      return res.status(404).json({ erro: 'Nenhum item encontrado para esse pedido' });
    }
    res.json(resultado);
  } catch (erro) {
    res.status(500).json({ erro: erro.message });
  }
});

/**
 * @swagger
 * /pedido-itens/{id}:
 *   get:
 *     summary: Busca item de pedido por ID
 *     tags: [Itens do Pedido]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Item encontrado
 *       404:
 *         description: Item não encontrado
 */
router.get('/:id', async (req, res) => {
  try {
    const item = await PedidoItem.findById(req.params.id);
    if (!item) return res.status(404).json({ erro: 'Item não encontrado' });
    res.json(item);
  } catch (erro) {
    res.status(500).json({ erro: erro.message });
  }
});

/**
 * @swagger
 * /pedido-itens:
 *   post:
 *     summary: Cadastra um novo item de pedido
 *     tags: [Itens do Pedido]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               pedido_id:
 *                 type: string
 *               tipo_roupa_id:
 *                 type: string
 *               quantidade:
 *                 type: integer
 *               descricao:
 *                 type: string
 *               status:
 *                 type: string
 *               valor_total:
 *                 type: number
 *     responses:
 *       201:
 *         description: Item criado com sucesso
 */
router.post('/', async (req, res) => {
  try {
    const novo = new PedidoItem(req.body);
    await novo.save();
    res.status(201).json(novo);
  } catch (erro) {
    res.status(500).json({ erro: erro.message });
  }
});

/**
 * @swagger
 * /pedido-itens/{id}:
 *   put:
 *     summary: Atualiza um item de pedido
 *     tags: [Itens do Pedido]
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
 *               quantidade:
 *                 type: integer
 *               descricao:
 *                 type: string
 *               status:
 *                 type: string
 *               valor_total:
 *                 type: number
 *     responses:
 *       200:
 *         description: Item atualizado com sucesso
 *       404:
 *         description: Item não encontrado
 */
router.put('/:id', async (req, res) => {
  try {
    const atualizado = await PedidoItem.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!atualizado) return res.status(404).json({ erro: 'Item não encontrado' });
    res.json(atualizado);
  } catch (erro) {
    res.status(500).json({ erro: erro.message });
  }
});

/**
 * @swagger
 * /pedido-itens/{id}:
 *   delete:
 *     summary: Remove um item de pedido
 *     tags: [Itens do Pedido]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Item removido com sucesso
 *       404:
 *         description: Item não encontrado
 */
router.delete('/:id', async (req, res) => {
  try {
    const removido = await PedidoItem.findByIdAndDelete(req.params.id);
    if (!removido) return res.status(404).json({ erro: 'Item não encontrado' });
    res.json({ mensagem: 'Item removido com sucesso', item: removido });
  } catch (erro) {
    res.status(500).json({ erro: erro.message });
  }
});

module.exports = router;
