import React, { useState, useEffect } from 'react';
import api from '../services/api';
import OrderModal from './OrderModal';

function Orders() {
  const [orders, setOrders] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingOrderId, setEditingOrderId] = useState(null);

  const fetchOrders = async () => {
    try {
      const res = await api.get('/orders');
      setOrders(res.data);
    } catch (error) {
      console.error('Erro ao buscar comandas:', error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleOpenModal = (orderId = null) => {
    setEditingOrderId(orderId);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setEditingOrderId(null);
    setIsModalOpen(false);
    fetchOrders();
  };

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja cancelar esta comanda?')) {
      try {
        await api.delete(`/orders/${id}`);
        fetchOrders();
      } catch (error) {
        console.error('Erro ao cancelar comanda:', error);
      }
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h2>Comandas</h2>
        <button className="btn btn-primary" onClick={() => handleOpenModal()}>Nova Comanda</button>
      </div>

      <div className="data-table-container mt-4">
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Data</th>
              <th>Cliente</th>
              <th>Total (R$)</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id}>
                <td>#{o.id}</td>
                <td>{new Date(o.created_at).toLocaleDateString()}</td>
                <td>{o.client_name || 'Avulso'}</td>
                <td>R$ {parseFloat(o.total_amount).toFixed(2)}</td>
                <td>
                  <span className={`badge ${o.status === 'aberta' ? 'badge-warning' : o.status === 'fechada' ? 'badge-success' : 'badge-danger'}`}>
                    {o.status.toUpperCase()}
                  </span>
                </td>
                <td className="actions-cell">
                  <button className="btn btn-small btn-secondary" onClick={() => handleOpenModal(o.id)}>Gerenciar</button>
                  {o.status === 'aberta' && (
                    <button className="btn btn-small btn-danger" onClick={() => handleDelete(o.id)}>Cancelar</button>
                  )}
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr>
                <td colSpan="6" className="text-center">Nenhuma comanda encontrada.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <OrderModal 
          orderId={editingOrderId} 
          onClose={handleCloseModal} 
        />
      )}
    </div>
  );
}

export default Orders;
