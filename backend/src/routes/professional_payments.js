const express = require('express');
const router = express.Router();
const knex = require('../config/db');

// Listar totais pendentes por profissional
router.get('/pending', async (req, res) => {
  try {
    const pendingCommissions = await knex('order_items')
      .join('professionals', 'order_items.professional_id', 'professionals.id')
      .join('orders', 'order_items.order_id', 'orders.id')
      .select(
        'professionals.id',
        'professionals.name',
        'professionals.commission_rate as default_rate'
      )
      .sum('order_items.commission_amount as pending_amount')
      .count('order_items.id as items_count')
      .where('order_items.commission_paid', false)
      .where('orders.status', 'fechada') // Apenas comandas fechadas geram comissão a pagar? 
      .groupBy('professionals.id', 'professionals.name', 'professionals.commission_rate');

    res.json(pendingCommissions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao buscar comissões pendentes' });
  }
});

// Listar itens pendentes de um profissional específico
router.get('/pending/:professionalId', async (req, res) => {
  try {
    const { professionalId } = req.params;
    const items = await knex('order_items')
      .join('orders', 'order_items.order_id', 'orders.id')
      .leftJoin('services', 'order_items.service_id', 'services.id')
      .leftJoin('products', 'order_items.product_id', 'products.id')
      .leftJoin('clients', 'orders.client_id', 'clients.id')
      .select(
        'order_items.*',
        'orders.created_at as order_date',
        'services.name as service_name',
        'products.name as product_name',
        'clients.name as client_name'
      )
      .where('order_items.professional_id', professionalId)
      .where('order_items.commission_paid', false)
      .where('orders.status', 'fechada')
      .orderBy('orders.created_at', 'desc');

    res.json(items);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao buscar itens pendentes do profissional' });
  }
});

// Registrar pagamento de comissões
router.post('/pay', async (req, res) => {
  try {
    const { professionalId, itemIds, paymentMethod, notes } = req.body;

    if (!itemIds || itemIds.length === 0) {
      return res.status(400).json({ error: 'Nenhum item selecionado para pagamento' });
    }

    await knex.transaction(async (trx) => {
      // 1. Buscar os itens para calcular o total e validar
      const items = await trx('order_items')
        .whereIn('id', itemIds)
        .where('professional_id', professionalId)
        .where('commission_paid', false);

      if (items.length === 0) {
        throw new Error('Itens não encontrados ou já pagos');
      }

      const totalAmount = items.reduce((sum, item) => sum + parseFloat(item.commission_amount), 0);

      // 2. Marcar itens como pagos
      await trx('order_items')
        .whereIn('id', itemIds)
        .update({ commission_paid: true });

      // 3. Obter sessão de caixa aberta
      const openSession = await trx('cash_sessions').where('status', 'aberto').first();

      // 4. Gerar transação de despesa
      const professional = await trx('professionals').where({ id: professionalId }).first();
      
      await trx('transactions').insert({
        type: 'despesa',
        category: 'Comissões',
        description: `Pagamento de comissão - ${professional.name}${notes ? ': ' + notes : ''}`,
        amount: totalAmount,
        status: 'pago',
        due_date: knex.fn.now(),
        payment_date: knex.fn.now(),
        payment_method: paymentMethod || 'dinheiro',
        professional_id: professionalId,
        cash_session_id: openSession ? openSession.id : null
      });
    });

    res.json({ message: 'Pagamento de comissão registrado com sucesso' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message || 'Erro ao registrar pagamento' });
  }
});

module.exports = router;
