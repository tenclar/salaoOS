const express = require('express');
const router = express.Router();
const knex = require('../config/db');

// Listar todas as salas
router.get('/', async (req, res) => {
  try {
    const rooms = await knex('rooms').orderBy('id', 'asc');
    res.json(rooms);
  } catch (error) {
    console.error('Error fetching rooms:', error);
    res.status(500).json({ error: 'Erro ao buscar salas' });
  }
});

// Buscar sala por ID
router.get('/:id', async (req, res) => {
  try {
    const room = await knex('rooms').where({ id: req.params.id }).first();
    if (room) {
      res.json(room);
    } else {
      res.status(404).json({ error: 'Sala não encontrada' });
    }
  } catch (error) {
    console.error('Error fetching room:', error);
    res.status(500).json({ error: 'Erro ao buscar sala' });
  }
});

// Criar nova sala
router.post('/', async (req, res) => {
  try {
    const { name, description, capacity, active } = req.body;
    
    const [id] = await knex('rooms').insert({
      name,
      description,
      capacity: capacity || 1,
      active: active !== undefined ? active : true
    }).returning('id');

    const newRoom = await knex('rooms').where({ id: id.id || id }).first(); // Handle different DB returns
    res.status(201).json(newRoom);
  } catch (error) {
    console.error('Error creating room:', error);
    res.status(500).json({ error: 'Erro ao criar sala' });
  }
});

// Atualizar sala
router.put('/:id', async (req, res) => {
  try {
    const { name, description, capacity, active } = req.body;

    const updated = await knex('rooms')
      .where({ id: req.params.id })
      .update({
        name,
        description,
        capacity,
        active,
        updated_at: knex.fn.now()
      });

    if (updated) {
      const room = await knex('rooms').where({ id: req.params.id }).first();
      res.json(room);
    } else {
      res.status(404).json({ error: 'Sala não encontrada' });
    }
  } catch (error) {
    console.error('Error updating room:', error);
    res.status(500).json({ error: 'Erro ao atualizar sala' });
  }
});

// Excluir sala
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await knex('rooms').where({ id: req.params.id }).del();
    if (deleted) {
      res.json({ message: 'Sala excluída com sucesso' });
    } else {
      res.status(404).json({ error: 'Sala não encontrada' });
    }
  } catch (error) {
    console.error('Error deleting room:', error);
    res.status(500).json({ error: 'Erro ao excluir sala' });
  }
});

module.exports = router;
