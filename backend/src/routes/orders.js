const express = require('express');
const router = express.Router();
const knex = require('../config/db');

// Listar comandas
router.get('/', async (req, res) => {
  try {
    const orders = await knex('orders')
      .leftJoin('clients', 'orders.client_id', 'clients.id')
      .select('orders.*', 'clients.name as client_name')
      .orderBy('orders.created_at', 'desc');
    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao buscar comandas' });
  }
});

// Obter comanda e seus itens
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const order = await knex('orders')
      .leftJoin('clients', 'orders.client_id', 'clients.id')
      .select('orders.*', 'clients.name as client_name')
      .where('orders.id', id)
      .first();
      
    if (!order) return res.status(404).json({ error: 'Comanda não encontrada' });
    
    const items = await knex('order_items')
      .leftJoin('services', 'order_items.service_id', 'services.id')
      .leftJoin('products', 'order_items.product_id', 'products.id')
      .leftJoin('professionals', 'order_items.professional_id', 'professionals.id')
      .select(
        'order_items.*',
        'services.name as service_name',
        'products.name as product_name',
        'professionals.name as professional_name'
      )
      .where('order_items.order_id', id);
      
    res.json({ ...order, items });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao buscar detalhes da comanda' });
  }
});

// Criar nova comanda
router.post('/', async (req, res) => {
  try {
    const { client_id, notes, status } = req.body;
    const [id] = await knex('orders').insert({
      client_id: client_id || null,
      notes: notes || '',
      status: status || 'aberta'
    });
    res.status(201).json({ id, message: 'Comanda criada com sucesso' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao criar comanda' });
  }
});

// Atualizar status ou notas da comanda
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes, client_id } = req.body;
    
    const count = await knex('orders').where({ id }).update({
      status, notes, client_id, updated_at: knex.fn.now()
    });
    
    if (count === 0) return res.status(404).json({ error: 'Comanda não encontrada' });
    res.json({ message: 'Comanda atualizada com sucesso' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao atualizar comanda' });
  }
});

// Adicionar item à comanda
router.post('/:id/items', async (req, res) => {
    try {
      const { id } = req.params;
      const { item_type, service_id, product_id, professional_id, quantity, unit_price } = req.body;
      
      const qty = parseInt(quantity) || 1;
      const price = parseFloat(unit_price) || 0;
      const total_price = qty * price;
      
      await knex.transaction(async (trx) => {
        let commission_rate = 0;
        let commission_amount = 0;

        // Se houver um profissional, buscar a taxa de comissão dele
        if (professional_id) {
          const professional = await trx('professionals').where({ id: professional_id }).first();
          if (professional) {
            commission_rate = professional.commission_rate || 0;
            // No momento, aplicamos comissão apenas sobre serviços, ou conforme regra de negócio
            // Se quiser aplicar em produtos também, remover a verificação item_type === 'servico'
            if (item_type === 'servico') {
              commission_amount = (total_price * commission_rate) / 100;
            }
          }
        }

        // Inserir item
        await trx('order_items').insert({
          order_id: id,
          item_type,
          service_id: service_id || null,
          product_id: product_id || null,
          professional_id: professional_id || null,
          quantity: qty,
          unit_price: price,
          total_price,
          commission_rate,
          commission_amount,
          commission_paid: false
        });
        
        // Atualizar total da comanda
        await trx('orders').where({ id }).increment('total_amount', total_price);
      });
      
      res.status(201).json({ message: 'Item adicionado com sucesso' });
    } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao adicionar item' });
  }
});

// Remover item da comanda
router.delete('/:id/items/:itemId', async (req, res) => {
  try {
    const { id, itemId } = req.params;
    
    await knex.transaction(async (trx) => {
      const item = await trx('order_items').where({ id: itemId, order_id: id }).first();
      if (!item) throw new Error('Item não encontrado');
      
      await trx('order_items').where({ id: itemId }).del();
      await trx('orders').where({ id }).decrement('total_amount', item.total_price);
    });
    
    res.json({ message: 'Item removido com sucesso' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message || 'Erro ao remover item' });
  }
});

// Fechar comanda e gerar transação
router.post('/:id/close', async (req, res) => {
  try {
    const { id } = req.params;
    const { payment_method } = req.body;
    
    await knex.transaction(async (trx) => {
      const order = await trx('orders').where({ id }).first();
      if (!order) throw new Error('Comanda não encontrada');
      if (order.status === 'fechada') throw new Error('Comanda já está fechada');
      
      // Mudar status para fechada
      await trx('orders').where({ id }).update({ status: 'fechada', updated_at: knex.fn.now() });
      
      // Obter sessão de caixa aberta
      const openSession = await trx('cash_sessions').where('status', 'aberto').first();

      // Gerar transação (receita)
      await trx('transactions').insert({
        type: 'receita',
        category: 'Comandas',
        description: `Recebimento ref. à comanda #${id}`,
        amount: order.total_amount,
        status: 'pago',
        due_date: knex.fn.now(),
        payment_date: knex.fn.now(),
        payment_method: payment_method || 'dinheiro',
        client_id: order.client_id,
        order_id: order.id,
        cash_session_id: openSession ? openSession.id : null
      });
    });
    
    res.json({ message: 'Comanda fechada e pagamento registrado com sucesso' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message || 'Erro ao fechar comanda' });
  }
});

// Remover/Cancelar comanda
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const count = await knex('orders').where({ id }).update({ status: 'cancelada', updated_at: knex.fn.now() });
    if (count === 0) return res.status(404).json({ error: 'Comanda não encontrada' });
    res.json({ message: 'Comanda cancelada com sucesso' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao cancelar comanda' });
  }
});

module.exports = router;
