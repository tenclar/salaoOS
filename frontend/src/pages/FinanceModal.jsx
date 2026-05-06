import React, { useState, useEffect } from 'react';
import api from '../services/api';

function FinanceModal({ transaction, onClose }) {
  const [formData, setFormData] = useState({
    type: 'receita',
    category: '',
    description: '',
    amount: '',
    status: 'pendente',
    due_date: new Date().toISOString().split('T')[0],
    payment_date: '',
    payment_method: 'dinheiro',
    client_id: '',
    professional_id: ''
  });

  const [clients, setClients] = useState([]);
  const [professionals, setProfessionals] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [clientsRes, profsRes] = await Promise.all([
          api.get('/clients'),
          api.get('/professionals')
        ]);
        setClients(clientsRes.data);
        setProfessionals(profsRes.data);
      } catch (error) {
        console.error('Erro ao buscar dados:', error);
      }
    };
    fetchData();

    if (transaction) {
      setFormData({
        ...transaction,
        due_date: transaction.due_date ? new Date(transaction.due_date).toISOString().split('T')[0] : '',
        payment_date: transaction.payment_date ? new Date(transaction.payment_date).toISOString().split('T')[0] : '',
        client_id: transaction.client_id || '',
        professional_id: transaction.professional_id || ''
      });
    }
  }, [transaction]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const dataToSubmit = { ...formData };
      if (!dataToSubmit.client_id) dataToSubmit.client_id = null;
      if (!dataToSubmit.professional_id) dataToSubmit.professional_id = null;
      if (!dataToSubmit.payment_date) dataToSubmit.payment_date = null;

      if (transaction) {
        await api.put(`/finance/${transaction.id}`, dataToSubmit);
      } else {
        await api.post('/finance', dataToSubmit);
      }
      onClose();
    } catch (error) {
      console.error('Erro ao salvar transação:', error);
      alert('Erro ao salvar. Verifique os campos.');
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '600px' }}>
        <div className="modal-header">
          <h2>{transaction ? 'Editar Transação' : 'Nova Transação'}</h2>
          <button className="btn-close" onClick={onClose}>×</button>
        </div>
        
        <form onSubmit={handleSubmit} className="modal-body form-grid">
          <div className="form-group">
            <label>Tipo</label>
            <select name="type" value={formData.type} onChange={handleChange} required className="form-control">
              <option value="receita">Receita</option>
              <option value="despesa">Despesa</option>
            </select>
          </div>

          <div className="form-group">
            <label>Categoria</label>
            <input type="text" name="category" value={formData.category} onChange={handleChange} required className="form-control" placeholder="Ex: Serviços, Produtos, Água, Luz..." />
          </div>

          <div className="form-group" style={{ gridColumn: 'span 2' }}>
            <label>Descrição</label>
            <input type="text" name="description" value={formData.description} onChange={handleChange} required className="form-control" />
          </div>

          <div className="form-group">
            <label>Valor (R$)</label>
            <input type="number" step="0.01" name="amount" value={formData.amount} onChange={handleChange} required className="form-control" />
          </div>

          <div className="form-group">
            <label>Status</label>
            <select name="status" value={formData.status} onChange={handleChange} required className="form-control">
              <option value="pendente">Pendente</option>
              <option value="pago">Pago</option>
              <option value="cancelado">Cancelado</option>
            </select>
          </div>

          <div className="form-group">
            <label>Data de Vencimento</label>
            <input type="date" name="due_date" value={formData.due_date} onChange={handleChange} required className="form-control" />
          </div>

          <div className="form-group">
            <label>Data de Pagamento</label>
            <input type="date" name="payment_date" value={formData.payment_date} onChange={handleChange} className="form-control" />
          </div>

          <div className="form-group">
            <label>Forma de Pagamento</label>
            <select name="payment_method" value={formData.payment_method} onChange={handleChange} className="form-control">
              <option value="dinheiro">Dinheiro</option>
              <option value="cartao_credito">Cartão de Crédito</option>
              <option value="cartao_debito">Cartão de Débito</option>
              <option value="pix">PIX</option>
              <option value="transferencia">Transferência</option>
              <option value="outro">Outro</option>
            </select>
          </div>

          <div className="form-group">
            <label>Cliente (Opcional)</label>
            <select name="client_id" value={formData.client_id} onChange={handleChange} className="form-control">
              <option value="">Selecione...</option>
              {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>

          <div className="form-group">
            <label>Profissional (Opcional)</label>
            <select name="professional_id" value={formData.professional_id} onChange={handleChange} className="form-control">
              <option value="">Selecione...</option>
              {professionals.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </div>

          <div className="modal-actions" style={{ gridColumn: 'span 2' }}>
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancelar</button>
            <button type="submit" className="btn btn-primary">Salvar</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default FinanceModal;
