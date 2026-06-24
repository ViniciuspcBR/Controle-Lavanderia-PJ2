const express = require('express');
const router = express.Router();
const Cliente = require('../models/Cliente');

/**
 * @swagger
 * tags:
 *   name: Clientes
 *   description: Gerenciamento de clientes (Gabriel Borges)
 */

/**
 * @swagger
 * /clientes:
 *   get:
 *     summary: Lista todos os clientes
 *     tags: [Clientes]
 *     responses:
 *       200:
 *         description: Lista de clientes retornada com sucesso
 */
router.get('/', async (req, res) => {
  try {
    const clientes = await Cliente.find();
    res.json(clientes);
  } catch (erro) {
    res.status(500).json({ erro: erro.message });
  }
});

/**
 * @swagger
 * /clientes/nome/{nome}:
 *   get:
 *     summary: Busca clientes por nome
 *     tags: [Clientes]
 *     parameters:
 *       - in: path
 *         name: nome
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Clientes encontrados
 *       404:
 *         description: Nenhum cliente encontrado
 */
router.get('/nome/:nome', async (req, res) => {
  try {
    const resultado = await Cliente.find({
      nome: { $regex: req.params.nome, $options: 'i' }
    });
    if (resultado.length === 0) {
      return res.status(404).json({ erro: 'Nenhum cliente encontrado com esse nome' });
    }
    res.json(resultado);
  } catch (erro) {
    res.status(500).json({ erro: erro.message });
  }
});

/**
 * @swagger
 * /clientes/{id}:
 *   get:
 *     summary: Busca cliente por ID
 *     tags: [Clientes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Cliente encontrado
 *       404:
 *         description: Cliente não encontrado
 */
router.get('/:id', async (req, res) => {
  try {
    const cliente = await Cliente.findById(req.params.id);
    if (!cliente) return res.status(404).json({ erro: 'Cliente não encontrado' });
    res.json(cliente);
  } catch (erro) {
    res.status(500).json({ erro: erro.message });
  }
});

/**
 * @swagger
 * /clientes:
 *   post:
 *     summary: Cadastra um novo cliente
 *     tags: [Clientes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *               telefone:
 *                 type: string
 *               email:
 *                 type: string
 *               cpf_cnpj:
 *                 type: string
 *               observacoes:
 *                 type: string
 *     responses:
 *       201:
 *         description: Cliente criado com sucesso
 */
router.post('/', async (req, res) => {
  try {
    const novo = new Cliente(req.body);
    await novo.save();
    res.status(201).json(novo);
  } catch (erro) {
    res.status(500).json({ erro: erro.message });
  }
});

/**
 * @swagger
 * /clientes/{id}:
 *   put:
 *     summary: Atualiza um cliente
 *     tags: [Clientes]
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
 *               telefone:
 *                 type: string
 *               email:
 *                 type: string
 *               cpf_cnpj:
 *                 type: string
 *               observacoes:
 *                 type: string
 *     responses:
 *       200:
 *         description: Cliente atualizado com sucesso
 *       404:
 *         description: Cliente não encontrado
 */
router.put('/:id', async (req, res) => {
  try {
    const atualizado = await Cliente.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!atualizado) return res.status(404).json({ erro: 'Cliente não encontrado' });
    res.json(atualizado);
  } catch (erro) {
    res.status(500).json({ erro: erro.message });
  }
});

/**
 * @swagger
 * /clientes/{id}:
 *   delete:
 *     summary: Remove um cliente
 *     tags: [Clientes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Cliente removido com sucesso
 *       404:
 *         description: Cliente não encontrado
 */
router.delete('/:id', async (req, res) => {
  try {
    const removido = await Cliente.findByIdAndDelete(req.params.id);
    if (!removido) return res.status(404).json({ erro: 'Cliente não encontrado' });
    res.json({ mensagem: 'Cliente removido com sucesso', cliente: removido });
  } catch (erro) {
    res.status(500).json({ erro: erro.message });
  }
});

module.exports = router;
