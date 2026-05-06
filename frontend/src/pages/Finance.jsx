import React, { useState, useEffect } from 'react';
import api from '../services/api';
import FinanceModal from './FinanceModal';

function Finance({ filterType }) {
  const [transactions, setTransactions] = useState([]);
  const [summary, setSummary] = useState({ income: 0, expense: 0, balance: 0 });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);

  const fetchFinanceData = async () => {
    try {
      const transRes = await api.get('/finance', { params: { type: filterType } });
      setTransactions(transRes.data);
      const summaryRes = await api.get('/finance/summary');
      setSummary(summaryRes.data);
    } catch (error) {
      console.error('Erro ao buscar dados financeiros:', error);
    }
  };

  useEffect(() => {
    fetchFinanceData();
  }, [filterType]);

  const handleOpenModal = (transaction = null) => {
    setEditingTransaction(transaction);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setEditingTransaction(null);
    setIsModalOpen(false);
    fetchFinanceData();
  };

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir esta transação?')) {
      try {
        await api.delete(`/finance/${id}`);
        fetchFinanceData();
      } catch (error) {
        console.error('Erro ao excluir transação:', error);
      }
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h2>
          {filterType === 'receita' ? 'Contas a Receber' : 
           filterType === 'despesa' ? 'Contas a Pagar' : 
           'Financeiro Geral'}
        </h2>
        <button className="btn btn-primary" onClick={() => handleOpenModal({ type: filterType || 'receita' })}>
          Nova {filterType === 'despesa' ? 'Despesa' : 'Receita'}
        </button>
      </div>

      <div className="dashboard-grid">
        <div className="stat-card">
          <h3>Receitas</h3>
          <p className="stat-value" style={{ color: 'green' }}>R$ {summary.income.toFixed(2)}</p>
        </div>
        <div className="stat-card">
          <h3>Despesas</h3>
          <p className="stat-value" style={{ color: 'red' }}>R$ {summary.expense.toFixed(2)}</p>
        </div>
        <div className="stat-card">
          <h3>Saldo Geral</h3>
          <p className="stat-value" style={{ color: summary.balance >= 0 ? 'green' : 'red' }}>R$ {summary.balance.toFixed(2)}</p>
        </div>
      </div>

      <div className="data-table-container mt-4">
        <table className="data-table">
          <thead>
            <tr>
              <th>Data Venc.</th>
              <th>Descrição</th>
              <th>Categoria</th>
              <th>Tipo</th>
              <th>Valor</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((t) => (
              <tr key={t.id}>
                <td>{new Date(t.due_date).toLocaleDateString()}</td>
                <td>{t.description}</td>
                <td>{t.category}</td>
                <td>
                  <span className={`badge ${t.type === 'receita' ? 'badge-success' : 'badge-danger'}`}>
                    {t.type.toUpperCase()}
                  </span>
                </td>
                <td>R$ {parseFloat(t.amount).toFixed(2)}</td>
                <td>{t.status}</td>
                <td className="actions-cell">
                  <button className="btn btn-small btn-secondary" onClick={() => handleOpenModal(t)}>Editar</button>
                  <button className="btn btn-small btn-danger" onClick={() => handleDelete(t.id)}>Excluir</button>
                </td>
              </tr>
            ))}
            {transactions.length === 0 && (
              <tr>
                <td colSpan="7" className="text-center">Nenhuma transação encontrada.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <FinanceModal 
          transaction={editingTransaction} 
          onClose={handleCloseModal} 
        />
      )}
    </div>
  );
}

export default Finance;
