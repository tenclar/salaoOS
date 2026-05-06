import React, { useState, useEffect } from 'react';
import api from '../services/api';

function ProfessionalPayments() {
  const [professionals, setProfessionals] = useState([]);
  const [selectedProfessional, setSelectedProfessional] = useState(null);
  const [pendingItems, setPendingItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('dinheiro');
  const [notes, setNotes] = useState('');

  const fetchProfessionals = async () => {
    try {
      const res = await api.get('/professional-payments/pending');
      setProfessionals(res.data);
    } catch (error) {
      console.error('Erro ao buscar profissionais:', error);
    }
  };

  useEffect(() => {
    fetchProfessionals();
  }, []);

  const handleOpenDetails = async (professional) => {
    try {
      const res = await api.get(`/professional-payments/pending/${professional.id}`);
      setPendingItems(res.data);
      setSelectedProfessional(professional);
      setSelectedItems(res.data.map(i => i.id)); // Selecionar todos por padrão
      setIsModalOpen(true);
    } catch (error) {
      console.error('Erro ao buscar itens pendentes:', error);
    }
  };

  const handleToggleItem = (itemId) => {
    if (selectedItems.includes(itemId)) {
      setSelectedItems(selectedItems.filter(id => id !== itemId));
    } else {
      setSelectedItems([...selectedItems, itemId]);
    }
  };

  const calculateTotal = () => {
    return pendingItems
      .filter(item => selectedItems.includes(item.id))
      .reduce((sum, item) => sum + parseFloat(item.commission_amount), 0);
  };

  const handleProcessPayment = async () => {
    if (selectedItems.length === 0) return alert('Selecione ao menos um item.');
    
    try {
      await api.post('/professional-payments/pay', {
        professionalId: selectedProfessional.id,
        itemIds: selectedItems,
        paymentMethod,
        notes
      });
      
      alert('Pagamento registrado com sucesso!');
      setIsModalOpen(false);
      fetchProfessionals();
    } catch (error) {
      console.error('Erro ao processar pagamento:', error);
      alert('Erro ao processar pagamento.');
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h2>Pagamento de Profissionais</h2>
      </div>

      <div className="data-table-container mt-4">
        <table className="data-table">
          <thead>
            <tr>
              <th>Profissional</th>
              <th>Taxa Padrão</th>
              <th>Itens Pendentes</th>
              <th>Valor Total Pendente</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {professionals.map((p) => (
              <tr key={p.id}>
                <td>{p.name}</td>
                <td>{p.default_rate}%</td>
                <td>{p.items_count}</td>
                <td style={{ fontWeight: 'bold', color: 'red' }}>R$ {parseFloat(p.pending_amount).toFixed(2)}</td>
                <td className="actions-cell">
                  <button className="btn btn-small btn-primary" onClick={() => handleOpenDetails(p)}>
                    Ver Detalhes / Pagar
                  </button>
                </td>
              </tr>
            ))}
            {professionals.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center">Nenhum pagamento pendente encontrado.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="modal-backdrop">
          <div className="modal-content" style={{ maxWidth: '800px' }}>
            <div className="modal-header">
              <h3>Pagamento: {selectedProfessional?.name}</h3>
              <button className="btn-close" onClick={() => setIsModalOpen(false)}>&times;</button>
            </div>
            <div className="modal-body">
              <div style={{ maxHeight: '300px', overflowY: 'auto', marginBottom: '20px' }}>
                <table className="data-table">
                  <thead>
                    <tr>
                      <th><input type="checkbox" checked={selectedItems.length === pendingItems.length} onChange={(e) => {
                        if (e.target.checked) setSelectedItems(pendingItems.map(i => i.id));
                        else setSelectedItems([]);
                      }} /></th>
                      <th>Data</th>
                      <th>Serviço/Produto</th>
                      <th>Valor Item</th>
                      <th>Comissão (%)</th>
                      <th>Vlr. Comissão</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pendingItems.map((item) => (
                      <tr key={item.id}>
                        <td>
                          <input 
                            type="checkbox" 
                            checked={selectedItems.includes(item.id)} 
                            onChange={() => handleToggleItem(item.id)} 
                          />
                        </td>
                        <td>{new Date(item.order_date).toLocaleDateString()}</td>
                        <td>{item.service_name || item.product_name}</td>
                        <td>R$ {parseFloat(item.total_price).toFixed(2)}</td>
                        <td>{item.commission_rate}%</td>
                        <td>R$ {parseFloat(item.commission_amount).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="form-grid">
                <div className="form-group">
                  <label>Método de Pagamento</label>
                  <select 
                    className="form-control" 
                    value={paymentMethod} 
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  >
                    <option value="dinheiro">Dinheiro</option>
                    <option value="pix">PIX</option>
                    <option value="cartao_debito">Cartão de Débito</option>
                    <option value="transferencia">Transferência</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Observações</label>
                  <input 
                    className="form-control" 
                    placeholder="Opcional"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  />
                </div>
              </div>

              <div className="payment-summary mt-4" style={{ textAlign: 'right', fontSize: '1.2rem' }}>
                <strong>Total a Pagar: </strong>
                <span style={{ color: 'red', fontWeight: 'bold' }}>R$ {calculateTotal().toFixed(2)}</span>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>Cancelar</button>
              <button 
                className="btn btn-success" 
                onClick={handleProcessPayment}
                disabled={selectedItems.length === 0}
              >
                Confirmar Pagamento
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProfessionalPayments;
