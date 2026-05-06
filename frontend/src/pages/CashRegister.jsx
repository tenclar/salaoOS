import React, { useState, useEffect } from 'react';
import api from '../services/api';

function CashRegister() {
  const [currentSession, setCurrentSession] = useState(null);
  const [summary, setSummary] = useState(null);
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [initialAmount, setInitialAmount] = useState('0');
  const [finalAmountActual, setFinalAmountActual] = useState('');
  const [notes, setNotes] = useState('');

  const fetchSessionData = async () => {
    setIsLoading(true);
    try {
      const sessionRes = await api.get('/cash-sessions/current');
      setCurrentSession(sessionRes.data);
      
      if (sessionRes.data) {
        const summaryRes = await api.get('/cash-sessions/current/summary');
        setSummary(summaryRes.data);
      } else {
        const historyRes = await api.get('/cash-sessions/history');
        setHistory(historyRes.data);
      }
    } catch (error) {
      console.error('Erro ao buscar dados do caixa:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSessionData();
  }, []);

  const [isConfirmingClose, setIsConfirmingClose] = useState(false);

  const handleOpenCash = async (e) => {
    e.preventDefault();
    try {
      await api.post('/cash-sessions/open', { initial_amount: initialAmount, notes });
      fetchSessionData();
    } catch (error) {
      console.error('Erro ao abrir caixa:', error);
      alert('Erro ao abrir caixa.');
    }
  };

  const handleCloseCash = async (e) => {
    e.preventDefault();
    try {
      await api.post('/cash-sessions/close', { final_amount_actual: finalAmountActual, notes });
      setFinalAmountActual('');
      setNotes('');
      setIsConfirmingClose(false);
      fetchSessionData();
    } catch (error) {
      console.error('Erro ao fechar caixa:', error);
      alert('Erro ao fechar caixa.');
    }
  };

  if (isLoading) return <div className="page-container">Carregando...</div>;

  return (
    <div className="page-container">
      <div className="page-header">
        <h2>Gestão de Caixa</h2>
      </div>

      {!currentSession ? (
        <div className="card" style={{ maxWidth: '500px', margin: '20px auto' }}>
          <h3>Abrir Caixa</h3>
          <p className="mb-4">O caixa está fechado no momento. Informe o valor inicial para começar as operações.</p>
          <form onSubmit={handleOpenCash}>
            <div className="form-group">
              <label>Valor Inicial em Fundo (R$)</label>
              <input 
                type="number" 
                step="0.01" 
                className="form-control" 
                value={initialAmount} 
                onChange={(e) => setInitialAmount(e.target.value)} 
                required 
              />
            </div>
            <div className="form-group">
              <label>Observações</label>
              <textarea 
                className="form-control" 
                value={notes} 
                onChange={(e) => setNotes(e.target.value)} 
              />
            </div>
            <button type="submit" className="btn btn-primary w-100">Abrir Caixa</button>
          </form>

          <div className="mt-4">
            <h4>Últimos Fechamentos</h4>
            <table className="data-table mt-2" style={{ fontSize: '0.9rem' }}>
              <thead>
                <tr>
                  <th>Data</th>
                  <th>Status</th>
                  <th>Saldo Final</th>
                </tr>
              </thead>
              <tbody>
                {history.map(h => (
                  <tr key={h.id}>
                    <td>{new Date(h.opened_at).toLocaleDateString()}</td>
                    <td>{h.status}</td>
                    <td>R$ {h.final_amount_actual ? parseFloat(h.final_amount_actual).toFixed(2) : '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="dashboard-grid">
          <div className="card" style={{ gridColumn: 'span 2' }}>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h3>Caixa Aberto</h3>
              <span className="badge badge-success">Sessão #{currentSession.id}</span>
            </div>
            <p><strong>Aberto em:</strong> {new Date(currentSession.opened_at).toLocaleString()}</p>
            
            <div className="dashboard-grid mt-4">
              <div className="stat-card">
                <h3>Fundo Inicial</h3>
                <p className="stat-value">R$ {parseFloat(currentSession.initial_amount).toFixed(2)}</p>
              </div>
              <div className="stat-card">
                <h3>Vendas / Entradas</h3>
                <p className="stat-value" style={{ color: 'green' }}>+ R$ {summary?.income.toFixed(2)}</p>
              </div>
              <div className="stat-card">
                <h3>Saídas / Sangrias</h3>
                <p className="stat-value" style={{ color: 'red' }}>- R$ {summary?.expense.toFixed(2)}</p>
              </div>
              <div className="stat-card">
                <h3>Saldo Esperado</h3>
                <p className="stat-value" style={{ color: 'blue' }}>R$ {summary?.expected.toFixed(2)}</p>
              </div>
            </div>

            <hr className="my-4" style={{ margin: '20px 0', border: 'none', borderTop: '1px solid #eee' }} />

            <div className="mt-4" style={{ maxWidth: '400px' }}>
              <h3>Fechar Caixa</h3>
              {!isConfirmingClose ? (
                <button className="btn btn-danger w-100 mt-2" onClick={() => setIsConfirmingClose(true)}>Iniciar Fechamento</button>
              ) : (
                <form onSubmit={handleCloseCash} className="mt-2" style={{ border: '1px dashed red', padding: '15px', borderRadius: '8px' }}>
                  <div className="form-group">
                    <label>Valor Real em Caixa (Conferência)</label>
                    <input 
                      type="number" 
                      step="0.01" 
                      className="form-control" 
                      placeholder="Contagem física do dinheiro"
                      value={finalAmountActual} 
                      onChange={(e) => setFinalAmountActual(e.target.value)} 
                      required 
                    />
                  </div>
                  <div className="form-group">
                    <label>Observações de Fechamento</label>
                    <textarea 
                      className="form-control" 
                      value={notes} 
                      onChange={(e) => setNotes(e.target.value)} 
                    />
                  </div>
                  <div className="actions-cell">
                    <button type="submit" className="btn btn-danger w-100">Confirmar e Fechar</button>
                    <button type="button" className="btn btn-secondary" onClick={() => setIsConfirmingClose(false)}>Cancelar</button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CashRegister;
