// backend/src/routes/dashboard.js
const express = require('express');
const router = express.Router();
const knex = require('../config/db');

// Obter estatísticas do dashboard
router.get('/stats', async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];

    // Agendamentos de hoje
    const [todayAppointments] = await knex('appointments')
      .where('date', today)
      .whereNotIn('status', ['cancelado', 'faltou'])
      .count('id as count');

    // Faturamento diário (transações do tipo receita pagas hoje)
    const [dailyRevenue] = await knex('transactions')
      .where('type', 'receita')
      .where('status', 'pago')
      .whereRaw('DATE(payment_date) = ?', [today])
      .sum('amount as total');

    // Novos clientes (cadastrados hoje)
    const [newClients] = await knex('clients')
      .whereRaw('DATE(created_at) = ?', [today])
      .count('id as count');

    // Comandas abertas
    const [openOrders] = await knex('orders')
      .where('status', 'aberta')
      .count('id as count');

    // Total de profissionais ativos
    const [totalProfessionals] = await knex('professionals')
      .where('active', true)
      .count('id as count');

    // Total de serviços ativos
    const [totalServices] = await knex('services')
      .where('active', true)
      .count('id as count');

    // Faturamento mensal
    const currentMonth = new Date().getMonth() + 1;
    const currentYear = new Date().getFullYear();
    const [monthlyRevenue] = await knex('transactions')
      .where('type', 'receita')
      .where('status', 'pago')
      .whereRaw('EXTRACT(MONTH FROM payment_date) = ?', [currentMonth])
      .whereRaw('EXTRACT(YEAR FROM payment_date) = ?', [currentYear])
      .sum('amount as total');

    // Próximos agendamentos de hoje (ainda não realizados)
    const upcomingAppointments = await knex('appointments')
      .select(
        'appointments.*',
        'clients.name as client_name',
        'services.name as service_name',
        'professionals.name as professional_name'
      )
      .leftJoin('clients', 'appointments.client_id', 'clients.id')
      .leftJoin('services', 'appointments.service_id', 'services.id')
      .leftJoin('professionals', 'appointments.professional_id', 'professionals.id')
      .where('appointments.date', today)
      .whereNotIn('appointments.status', ['cancelado', 'faltou', 'finalizado'])
      .orderBy('appointments.start_time', 'asc')
      .limit(5);

    res.json({
      today_appointments: parseInt(todayAppointments.count) || 0,
      daily_revenue: parseFloat(dailyRevenue.total) || 0,
      new_clients: parseInt(newClients.count) || 0,
      open_orders: parseInt(openOrders.count) || 0,
      total_professionals: parseInt(totalProfessionals.count) || 0,
      total_services: parseInt(totalServices.count) || 0,
      monthly_revenue: parseFloat(monthlyRevenue.total) || 0,
      upcoming_appointments: upcomingAppointments
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({ error: 'Erro ao buscar estatísticas do dashboard' });
  }
});

module.exports = router;
