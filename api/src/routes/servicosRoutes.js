const express = require('express');
const router = express.Router();
const Servico = require('../models/Servico');

/**
 * @swagger
 * tags:
 *   name: Serviços
 *   description: Gerenciamento de serviços (João)
 */

/**
 * @swagger
 * /servicos:
 *   get:
 *     summary: Lista todos os serviços
 *     tags: [Serviços]
 *     responses:
 *       200:
 *         description: Lista de serviços retornada com sucesso
 */
router.get('/', async (req, res) => {
  try {
    const servicos = await Servico.find();
    res.json(servicos);
  } catch (erro) {
    res.status(500).json({ erro: erro.message });
  }
});

/**
 * @swagger
 * /servicos/nome/{nome}:
 *   get:
 *     summary: Busca serviços por nome
 *     tags: [Serviços]
 *     parameters:
 *       - in: path
 *         name: nome
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Serviços encontrados
 *       404:
 *         description: Nenhum serviço encontrado
 */
router.get('/nome/:nome', async (req, res) => {
  try {
    const resultado = await Servico.find({
      nome: { $regex: req.params.nome, $options: 'i' }
    });
    if (resultado.length === 0) {
      return res.status(404).json({ erro: 'Nenhum serviço encontrado com esse nome' });
    }
    res.json(resultado);
  } catch (erro) {
    res.status(500).json({ erro: erro.message });
  }
});

/**
 * @swagger
 * /servicos/{id}:
 *   get:
 *     summary: Busca serviço por ID
 *     tags: [Serviços]
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
router.get('/:id', async (req, res) => {
  try {
    const servico = await Servico.findById(req.params.id);
    if (!servico) return res.status(404).json({ erro: 'Serviço não encontrado' });
    res.json(servico);
  } catch (erro) {
    res.status(500).json({ erro: erro.message });
  }
});

/**
 * @swagger
 * /servicos:
 *   post:
 *     summary: Cadastra um novo serviço
 *     tags: [Serviços]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *               descricao:
 *                 type: string
 *               preco_base:
 *                 type: number
 *               ativo:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: Serviço criado com sucesso
 */
router.post('/', async (req, res) => {
  try {
    const novo = new Servico(req.body);
    await novo.save();
    res.status(201).json(novo);
  } catch (erro) {
    res.status(500).json({ erro: erro.message });
  }
});

/**
 * @swagger
 * /servicos/{id}:
 *   put:
 *     summary: Atualiza um serviço
 *     tags: [Serviços]
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
 *               nome:
 *                 type: string
 *               descricao:
 *                 type: string
 *               preco_base:
 *                 type: number
 *               ativo:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Serviço atualizado com sucesso
 *       404:
 *         description: Serviço não encontrado
 */
router.put('/:id', async (req, res) => {
  try {
    const atualizado = await Servico.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!atualizado) return res.status(404).json({ erro: 'Serviço não encontrado' });
    res.json(atualizado);
  } catch (erro) {
    res.status(500).json({ erro: erro.message });
  }
});

/**
 * @swagger
 * /servicos/{id}:
 *   delete:
 *     summary: Remove um serviço
 *     tags: [Serviços]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Serviço removido com sucesso
 *       404:
 *         description: Serviço não encontrado
 */
router.delete('/:id', async (req, res) => {
  try {
    const removido = await Servico.findByIdAndDelete(req.params.id);
    if (!removido) return res.status(404).json({ erro: 'Serviço não encontrado' });
    res.json({ mensagem: 'Serviço removido com sucesso', servico: removido });
  } catch (erro) {
    res.status(500).json({ erro: erro.message });
  }
});

module.exports = router;
