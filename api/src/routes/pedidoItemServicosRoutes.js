const express = require('express');
const router = express.Router();
const PedidoItemServico = require('../models/PedidoItemServico');

/**
 * @swagger
 * tags:
 *   name: Serviços do Item do Pedido
 *   description: Gerenciamento de serviços dos itens do pedido (Vilson Vinicius)
 */

/**
 * @swagger
 * /pedido-item-servicos:
 *   get:
 *     summary: Lista todos os serviços de itens de pedido
 *     tags: [Serviços do Item do Pedido]
 *     responses:
 *       200:
 *         description: Lista retornada com sucesso
 */
router.get('/', async (req, res) => {
  try {
    const servicos = await PedidoItemServico.find();
    res.json(servicos);
  } catch (erro) {
    res.status(500).json({ erro: erro.message });
  }
});

/**
 * @swagger
 * /pedido-item-servicos/item/{pedido_item_id}:
 *   get:
 *     summary: Busca serviços por ID do item do pedido
 *     tags: [Serviços do Item do Pedido]
 *     parameters:
 *       - in: path
 *         name: pedido_item_id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Serviços encontrados
 *       404:
 *         description: Nenhum serviço encontrado
 */
router.get('/item/:pedido_item_id', async (req, res) => {
  try {
    const resultado = await PedidoItemServico.find({ pedido_item_id: req.params.pedido_item_id });
    if (resultado.length === 0) {
      return res.status(404).json({ erro: 'Nenhum serviço encontrado para esse item' });
    }
    res.json(resultado);
  } catch (erro) {
    res.status(500).json({ erro: erro.message });
  }
});

/**
 * @swagger
 * /pedido-item-servicos/{id}:
 *   get:
 *     summary: Busca serviço de item por ID
 *     tags: [Serviços do Item do Pedido]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Serviço encontrado
 *       404:
 *         description: Serviço não encontrado
 */

/**
 * @swagger
 * /pedido-item-servicos/servico/{servico_id}:
 *   get:
 *     summary: Busca vínculos por ID do serviço
 *     tags: [Serviços do Item do Pedido]
 *     parameters:
 *       - in: path
 *         name: servico_id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Vínculos encontrados
 *       404:
 *         description: Nenhum vínculo encontrado
 */
router.get('/servico/:servico_id', async (req, res) => {
  try {
    const resultado = await PedidoItemServico.find({ servico_id: req.params.servico_id });
    if (resultado.length === 0) {
      return res.status(404).json({ erro: 'Nenhum vínculo encontrado para esse serviço' });
    }
    res.json(resultado);
  } catch (erro) {
    res.status(500).json({ erro: erro.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const servico = await PedidoItemServico.findById(req.params.id);
    if (!servico) return res.status(404).json({ erro: 'Serviço do item não encontrado' });
    res.json(servico);
  } catch (erro) {
    res.status(500).json({ erro: erro.message });
  }
});

/**
 * @swagger
 * /pedido-item-servicos:
 *   post:
 *     summary: Cadastra um novo serviço de item de pedido
 *     tags: [Serviços do Item do Pedido]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               pedido_item_id:
 *                 type: string
 *               servico_id:
 *                 type: string
 *               preco_unitario:
 *                 type: number
 *               quantidade:
 *                 type: integer
 *               valor_total:
 *                 type: number
 *     responses:
 *       201:
 *         description: Serviço do item criado com sucesso
 */
router.post('/', async (req, res) => {
  try {
    const novo = new PedidoItemServico(req.body);
    await novo.save();
    res.status(201).json(novo);
  } catch (erro) {
    res.status(500).json({ erro: erro.message });
  }
});

/**
 * @swagger
 * /pedido-item-servicos/{id}:
 *   put:
 *     summary: Atualiza um serviço de item de pedido
 *     tags: [Serviços do Item do Pedido]
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
 *               preco_unitario:
 *                 type: number
 *               quantidade:
 *                 type: integer
 *               valor_total:
 *                 type: number
 *     responses:
 *       200:
 *         description: Serviço do item atualizado com sucesso
 *       404:
 *         description: Serviço do item não encontrado
 */
router.put('/:id', async (req, res) => {
  try {
    const atualizado = await PedidoItemServico.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!atualizado) return res.status(404).json({ erro: 'Serviço do item não encontrado' });
    res.json(atualizado);
  } catch (erro) {
    res.status(500).json({ erro: erro.message });
  }
});

/**
 * @swagger
 * /pedido-item-servicos/{id}:
 *   delete:
 *     summary: Remove um serviço de item de pedido
 *     tags: [Serviços do Item do Pedido]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Serviço do item removido com sucesso
 *       404:
 *         description: Serviço do item não encontrado
 */
router.delete('/:id', async (req, res) => {
  try {
    const removido = await PedidoItemServico.findByIdAndDelete(req.params.id);
    if (!removido) return res.status(404).json({ erro: 'Serviço do item não encontrado' });
    res.json({ mensagem: 'Serviço do item removido com sucesso', servico: removido });
  } catch (erro) {
    res.status(500).json({ erro: erro.message });
  }
});

module.exports = router;
