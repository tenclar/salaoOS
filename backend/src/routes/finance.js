const express = require('express');
const router = express.Router();
const knex = require('../config/db');

// Listar transações (com filtros de tipo, mês e ano opcionais)
router.get('/', async (req, res) => {
  try {
    const { type, month, year } = req.query;
    let query = knex('transactions')
      .leftJoin('clients', 'transactions.client_id', 'clients.id')
      .leftJoin('professionals', 'transactions.professional_id', 'professionals.id')
      .select(
        'transactions.*',
        'clients.name as client_name',
        'professionals.name as professional_name'
      )
      .orderBy('transactions.due_date', 'desc');

    if (type) {
      query = query.where('transactions.type', type);
    }
    
    // Filtering by month and year if provided (assuming YYYY-MM format or passing year/month separately)
    if (month && year) {
      query = query.whereRaw('EXTRACT(MONTH FROM transactions.due_date) = ?', [month])
                   .whereRaw('EXTRACT(YEAR FROM transactions.due_date) = ?', [year]);
    } else if (year) {
      query = query.whereRaw('EXTRACT(YEAR FROM transactions.due_date) = ?', [year]);
    }

    const transactions = await query;
    res.json(transactions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao buscar transações' });
  }
});

// Obter resumo do caixa (receitas, despesas, saldo)
router.get('/summary', async (req, res) => {
  try {
    const { month, year } = req.query;
    let query = knex('transactions').select('type').sum('amount as total');

    // Default to current month/year if not provided? Or just return all time if not provided.
    // Let's filter if provided
    if (month && year) {
      query = query.whereRaw('EXTRACT(MONTH FROM due_date) = ?', [month])
                   .whereRaw('EXTRACT(YEAR FROM due_date) = ?', [year]);
    }

    const summary = await query.groupBy('type');
    
    let income = 0;
    let expense = 0;
    
    summary.forEach(item => {
      if (item.type === 'receita') income = parseFloat(item.total);
      if (item.type === 'despesa') expense = parseFloat(item.total);
    });

    res.json({
      income,
      expense,
      balance: income - expense
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao obter resumo do caixa' });
  }
});

// Criar nova transação
router.post('/', async (req, res) => {
  try {
    const { type, category, description, amount, status, due_date, payment_date, payment_method, client_id, professional_id, order_id } = req.body;
    
    // Vincular ao caixa aberto, se houver
    const openSession = await knex('cash_sessions').where('status', 'aberto').first();
    
    const [id] = await knex('transactions').insert({
      type, category, description, amount, status, due_date, payment_date, payment_method, client_id, professional_id, order_id,
      cash_session_id: openSession ? openSession.id : null
    });
    
    res.status(201).json({ id, message: 'Transação criada com sucesso' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao criar transação' });
  }
});

// Atualizar transação
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    updateData.updated_at = knex.fn.now();
    
    const count = await knex('transactions').where({ id }).update(updateData);
    if (count === 0) return res.status(404).json({ error: 'Transação não encontrada' });
    
    res.json({ message: 'Transação atualizada com sucesso' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao atualizar transação' });
  }
});

// Deletar transação
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const count = await knex('transactions').where({ id }).del();
    if (count === 0) return res.status(404).json({ error: 'Transação não encontrada' });
    
    res.json({ message: 'Transação removida com sucesso' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao remover transação' });
  }
});

module.exports = router;
