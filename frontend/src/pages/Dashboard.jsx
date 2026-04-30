import React from 'react';

function Dashboard() {
  return (
    <div className="dashboard-page">
      <div className="card">
        <h3>Visão Geral</h3>
        <p>Bem-vindo ao sistema Beauty Center. Aqui você poderá ver os indicadores principais do salão.</p>
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
        <div className="card">
          <h4>Atendimentos Hoje</h4>
          <h2 style={{ fontSize: '2.5rem', color: 'var(--color-gold)', marginTop: '10px' }}>12</h2>
        </div>
        <div className="card">
          <h4>Faturamento Diário</h4>
          <h2 style={{ fontSize: '2.5rem', color: 'var(--color-gold)', marginTop: '10px' }}>R$ 1.450</h2>
        </div>
        <div className="card">
          <h4>Novos Clientes</h4>
          <h2 style={{ fontSize: '2.5rem', color: 'var(--color-gold)', marginTop: '10px' }}>3</h2>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
