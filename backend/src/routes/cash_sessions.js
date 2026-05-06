const express = require('express');
const router = express.Router();
const knex = require('../config/db');

// Obter sessão de caixa aberta atual
router.get('/current', async (req, res) => {
  try {
    const session = await knex('cash_sessions').where('status', 'aberto').first();
    res.json(session || null);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao buscar caixa atual' });
  }
});

// Abrir novo caixa
router.post('/open', async (req, res) => {
  try {
    const { initial_amount, notes } = req.body;
    
    // Verificar se já tem um aberto
    const existing = await knex('cash_sessions').where('status', 'aberto').first();
    if (existing) return res.status(400).json({ error: 'Já existe um caixa aberto' });

    const [id] = await knex('cash_sessions').insert({
      initial_amount: parseFloat(initial_amount) || 0,
      notes: notes || '',
      status: 'aberto',
      opened_at: knex.fn.now()
    });

    res.status(201).json({ id, message: 'Caixa aberto com sucesso' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao abrir caixa' });
  }
});

// Obter resumo para fechamento
router.get('/current/summary', async (req, res) => {
  try {
    const session = await knex('cash_sessions').where('status', 'aberto').first();
    if (!session) return res.status(404).json({ error: 'Nenhum caixa aberto' });

    const transactions = await knex('transactions')
      .where('cash_session_id', session.id)
      .select('type').sum('amount as total')
      .groupBy('type');

    let income = 0;
    let expense = 0;
    transactions.forEach(t => {
      if (t.type === 'receita') income = parseFloat(t.total);
      if (t.type === 'despesa') expense = parseFloat(t.total);
    });

    const expected = parseFloat(session.initial_amount) + income - expense;

    res.json({
      initial_amount: session.initial_amount,
      income,
      expense,
      expected
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao calcular resumo' });
  }
});

// Fechar caixa
router.post('/close', async (req, res) => {
  try {
    const { final_amount_actual, notes } = req.body;
    
    const session = await knex('cash_sessions').where('status', 'aberto').first();
    if (!session) return res.status(400).json({ error: 'Não há caixa aberto para fechar' });

    // Calcular esperado
    const transactions = await knex('transactions')
      .where('cash_session_id', session.id)
      .select('type').sum('amount as total')
      .groupBy('type');

    let income = 0;
    let expense = 0;
    transactions.forEach(t => {
      if (t.type === 'receita') income = parseFloat(t.total);
      if (t.type === 'despesa') expense = parseFloat(t.total);
    });

    const expected = parseFloat(session.initial_amount) + income - expense;

    await knex('cash_sessions').where({ id: session.id }).update({
      closed_at: knex.fn.now(),
      final_amount_expected: expected,
      final_amount_actual: parseFloat(final_amount_actual) || 0,
      status: 'fechado',
      notes: notes || session.notes,
      updated_at: knex.fn.now()
    });

    res.json({ message: 'Caixa fechado com sucesso', expected });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao fechar caixa' });
  }
});

// Histórico de caixas
router.get('/history', async (req, res) => {
  try {
    const history = await knex('cash_sessions').orderBy('opened_at', 'desc').limit(20);
    res.json(history);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao buscar histórico' });
  }
});

module.exports = router;
