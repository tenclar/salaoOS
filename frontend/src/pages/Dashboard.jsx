import React, { useState, useEffect } from 'react';
import { Calendar, Users, DollarSign, ShoppingBag, TrendingUp, Scissors, Clock } from 'lucide-react';
import api from '../services/api';

function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await api.get('/dashboard/stats');
      setStats(res.data);
    } catch (error) {
      console.error('Erro ao buscar estatísticas:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val || 0);
  };

  if (loading) {
    return (
      <div className="dashboard-page">
        <div className="card" style={{ textAlign: 'center', padding: '60px' }}>
          <div className="loading-spinner"></div>
          <p style={{ color: 'var(--color-text-muted)', marginTop: '16px' }}>Carregando dados...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <div style={{ marginBottom: '28px' }}>
        <h2 style={{ fontSize: '1.6rem', fontWeight: '700' }}>Visão Geral</h2>
        <p style={{ color: 'var(--color-text-muted)', marginTop: '4px' }}>
          Bem-vindo ao sistema Beauty Center. Acompanhe os indicadores principais do salão.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="dashboard-stats-grid">
        <div className="dashboard-kpi-card">
          <div className="kpi-icon" style={{ background: 'linear-gradient(135deg, #CFAE6E, #b89758)' }}>
            <Calendar size={22} color="#fff" />
          </div>
          <div className="kpi-info">
            <span className="kpi-label">Atendimentos Hoje</span>
            <span className="kpi-value">{stats?.today_appointments || 0}</span>
          </div>
        </div>

        <div className="dashboard-kpi-card">
          <div className="kpi-icon" style={{ background: 'linear-gradient(135deg, #4caf50, #388e3c)' }}>
            <DollarSign size={22} color="#fff" />
          </div>
          <div className="kpi-info">
            <span className="kpi-label">Faturamento Diário</span>
            <span className="kpi-value" style={{ color: '#4caf50' }}>{formatCurrency(stats?.daily_revenue)}</span>
          </div>
        </div>

        <div className="dashboard-kpi-card">
          <div className="kpi-icon" style={{ background: 'linear-gradient(135deg, #2196f3, #1565c0)' }}>
            <Users size={22} color="#fff" />
          </div>
          <div className="kpi-info">
            <span className="kpi-label">Novos Clientes</span>
            <span className="kpi-value">{stats?.new_clients || 0}</span>
          </div>
        </div>

        <div className="dashboard-kpi-card">
          <div className="kpi-icon" style={{ background: 'linear-gradient(135deg, #ff9800, #ef6c00)' }}>
            <ShoppingBag size={22} color="#fff" />
          </div>
          <div className="kpi-info">
            <span className="kpi-label">Comandas Abertas</span>
            <span className="kpi-value">{stats?.open_orders || 0}</span>
          </div>
        </div>
      </div>

      {/* Second row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px', marginBottom: '28px' }}>
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div className="kpi-icon-sm" style={{ background: 'rgba(207, 174, 110, 0.15)' }}>
            <TrendingUp size={20} color="var(--color-gold)" />
          </div>
          <div>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', marginBottom: '4px' }}>Faturamento Mensal</p>
            <p style={{ fontSize: '1.3rem', fontWeight: '700', color: 'var(--color-gold)' }}>{formatCurrency(stats?.monthly_revenue)}</p>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div className="kpi-icon-sm" style={{ background: 'rgba(33, 150, 243, 0.1)' }}>
            <Scissors size={20} color="#2196f3" />
          </div>
          <div>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', marginBottom: '4px' }}>Profissionais Ativos</p>
            <p style={{ fontSize: '1.3rem', fontWeight: '700' }}>{stats?.total_professionals || 0}</p>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div className="kpi-icon-sm" style={{ background: 'rgba(156, 39, 176, 0.1)' }}>
            <Scissors size={20} color="#9c27b0" />
          </div>
          <div>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', marginBottom: '4px' }}>Serviços Cadastrados</p>
            <p style={{ fontSize: '1.3rem', fontWeight: '700' }}>{stats?.total_services || 0}</p>
          </div>
        </div>
      </div>

      {/* Upcoming Appointments */}
      <div className="card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
          <Clock size={20} color="var(--color-gold)" />
          <h3 style={{ margin: 0 }}>Próximos Atendimentos</h3>
        </div>
        
        {stats?.upcoming_appointments?.length > 0 ? (
          <table className="data-table">
            <thead>
              <tr>
                <th>Horário</th>
                <th>Cliente</th>
                <th>Serviço</th>
                <th>Profissional</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {stats.upcoming_appointments.map((appt) => (
                <tr key={appt.id}>
                  <td style={{ fontWeight: '600' }}>{appt.start_time?.substring(0, 5)} - {appt.end_time?.substring(0, 5)}</td>
                  <td>{appt.client_name || `Cliente #${appt.client_id}`}</td>
                  <td>{appt.service_name || '-'}</td>
                  <td>{appt.professional_name || '-'}</td>
                  <td>
                    <span className={`badge ${
                      appt.status === 'confirmado' ? 'badge-success' :
                      appt.status === 'pendente' ? 'badge-warning' :
                      appt.status === 'atendendo' ? 'badge-info' : ''
                    }`}>
                      {appt.status?.charAt(0).toUpperCase() + appt.status?.slice(1)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--color-text-muted)' }}>
            <Calendar size={48} color="var(--color-border)" />
            <p style={{ marginTop: '12px' }}>Nenhum atendimento pendente para hoje.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
