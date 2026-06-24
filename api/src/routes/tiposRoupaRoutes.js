const express = require('express');
const router = express.Router();
const TipoRoupa = require('../models/TipoRoupa');

/**
 * @swagger
 * tags:
 *   name: Tipos de Roupa
 *   description: Gerenciamento de tipos de roupa (Vinicius Cardoso)
 */

/**
 * @swagger
 * /tipos-roupa:
 *   get:
 *     summary: Lista todos os tipos de roupa
 *     tags: [Tipos de Roupa]
 *     responses:
 *       200:
 *         description: Lista retornada com sucesso
 */
router.get('/', async (req, res) => {
  try {
    const tipos = await TipoRoupa.find();
    res.json(tipos);
  } catch (erro) {
    res.status(500).json({ erro: erro.message });
  }
});

/**
 * @swagger
 * /tipos-roupa/nome/{nome}:
 *   get:
 *     summary: Busca tipos de roupa por nome
 *     tags: [Tipos de Roupa]
 *     parameters:
 *       - in: path
 *         name: nome
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Tipos de roupa encontrados
 *       404:
 *         description: Nenhum tipo encontrado
 */
router.get('/nome/:nome', async (req, res) => {
  try {
    const resultado = await TipoRoupa.find({
      nome: { $regex: req.params.nome, $options: 'i' }
    });
    if (resultado.length === 0) {
      return res.status(404).json({ erro: 'Nenhum tipo de roupa encontrado com esse nome' });
    }
    res.json(resultado);
  } catch (erro) {
    res.status(500).json({ erro: erro.message });
  }
});

/**
 * @swagger
 * /tipos-roupa/{id}:
 *   get:
 *     summary: Busca tipo de roupa por ID
 *     tags: [Tipos de Roupa]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Tipo de roupa encontrado
 *       404:
 *         description: Tipo de roupa não encontrado
 */
router.get('/:id', async (req, res) => {
  try {
    const tipo = await TipoRoupa.findById(req.params.id);
    if (!tipo) return res.status(404).json({ erro: 'Tipo de roupa não encontrado' });
    res.json(tipo);
  } catch (erro) {
    res.status(500).json({ erro: erro.message });
  }
});

/**
 * @swagger
 * /tipos-roupa:
 *   post:
 *     summary: Cadastra um novo tipo de roupa
 *     tags: [Tipos de Roupa]
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
 *     responses:
 *       201:
 *         description: Tipo de roupa criado com sucesso
 */
router.post('/', async (req, res) => {
  try {
    const novo = new TipoRoupa(req.body);
    await novo.save();
    res.status(201).json(novo);
  } catch (erro) {
    res.status(500).json({ erro: erro.message });
  }
});

/**
 * @swagger
 * /tipos-roupa/{id}:
 *   put:
 *     summary: Atualiza um tipo de roupa
 *     tags: [Tipos de Roupa]
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
 *     responses:
 *       200:
 *         description: Tipo de roupa atualizado com sucesso
 *       404:
 *         description: Tipo de roupa não encontrado
 */
router.put('/:id', async (req, res) => {
  try {
    const atualizado = await TipoRoupa.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!atualizado) return res.status(404).json({ erro: 'Tipo de roupa não encontrado' });
    res.json(atualizado);
  } catch (erro) {
    res.status(500).json({ erro: erro.message });
  }
});

/**
 * @swagger
 * /tipos-roupa/{id}:
 *   delete:
 *     summary: Remove um tipo de roupa
 *     tags: [Tipos de Roupa]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Tipo de roupa removido com sucesso
 *       404:
 *         description: Tipo de roupa não encontrado
 */
router.delete('/:id', async (req, res) => {
  try {
    const removido = await TipoRoupa.findByIdAndDelete(req.params.id);
    if (!removido) return res.status(404).json({ erro: 'Tipo de roupa não encontrado' });
    res.json({ mensagem: 'Tipo de roupa removido com sucesso', tipo_roupa: removido });
  } catch (erro) {
    res.status(500).json({ erro: erro.message });
  }
});

module.exports = router;
