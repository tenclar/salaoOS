import React, { useState, useEffect } from 'react';
import api from '../services/api';

function OrderModal({ orderId, onClose }) {
  const [order, setOrder] = useState(null);
  const [clients, setClients] = useState([]);
  const [services, setServices] = useState([]);
  const [products, setProducts] = useState([]);
  const [professionals, setProfessionals] = useState([]);

  // Form for new order header
  const [client_id, setClientId] = useState('');
  const [notes, setNotes] = useState('');

  // Form for new item
  const [newItem, setNewItem] = useState({
    item_type: 'servico',
    service_id: '',
    product_id: '',
    professional_id: '',
    quantity: 1,
    unit_price: ''
  });

  // Fetch initial data
  useEffect(() => {
    const fetchBaseData = async () => {
      try {
        const [cliRes, srvRes, prodRes, profRes] = await Promise.all([
          api.get('/clients'),
          api.get('/services'),
          api.get('/products'),
          api.get('/professionals')
        ]);
        setClients(cliRes.data);
        setServices(srvRes.data);
        setProducts(prodRes.data);
        setProfessionals(profRes.data);
      } catch (error) {
        console.error('Erro ao buscar dados auxiliares', error);
      }
    };
    fetchBaseData();
  }, []);

  const fetchOrderDetails = async () => {
    if (!orderId) return;
    try {
      const res = await api.get(`/orders/${orderId}`);
      setOrder(res.data);
    } catch (error) {
      console.error('Erro ao buscar detalhes da comanda', error);
    }
  };

  useEffect(() => {
    if (orderId) fetchOrderDetails();
  }, [orderId]);

  const [isClosing, setIsClosing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('dinheiro');

  // Handlers for creating order
  const handleCreateOrder = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/orders', { client_id: client_id || null, notes });
      // Reload as editing
      const newId = res.data.id;
      const orderRes = await api.get(`/orders/${newId}`);
      setOrder(orderRes.data);
    } catch (error) {
      console.error('Erro ao criar comanda', error);
    }
  };

  // Handlers for adding item
  const handleItemChange = (e) => {
    const { name, value } = e.target;
    const update = { ...newItem, [name]: value };
    
    // Auto-fill price
    if (name === 'service_id' && update.item_type === 'servico') {
      const srv = services.find(s => s.id === parseInt(value));
      if (srv) update.unit_price = srv.price;
    }
    if (name === 'product_id' && update.item_type === 'produto') {
      const prod = products.find(p => p.id === parseInt(value));
      if (prod) update.unit_price = prod.sale_price;
    }
    
    setNewItem(update);
  };

  const handleAddItem = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...newItem };
      if (!payload.service_id) payload.service_id = null;
      if (!payload.product_id) payload.product_id = null;
      if (!payload.professional_id) payload.professional_id = null;

      await api.post(`/orders/${order.id}/items`, payload);
      // Reset form and reload items
      setNewItem({
        item_type: 'servico', service_id: '', product_id: '', professional_id: '', quantity: 1, unit_price: ''
      });
      fetchOrderDetails();
    } catch (error) {
      console.error('Erro ao adicionar item', error);
      alert('Erro ao adicionar item. Verifique os dados.');
    }
  };

  const handleRemoveItem = async (itemId) => {
    try {
      await api.delete(`/orders/${order.id}/items/${itemId}`);
      fetchOrderDetails();
    } catch (error) {
      console.error('Erro ao remover item', error);
    }
  };

  const handleCloseOrder = async () => {
    try {
      await api.post(`/orders/${order.id}/close`, { payment_method: paymentMethod });
      onClose();
    } catch (error) {
      console.error('Erro ao fechar comanda', error);
      alert('Erro ao fechar comanda.');
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '800px' }}>
        <div className="modal-header">
          <h2>{order ? `Gerenciar Comanda #${order.id}` : 'Nova Comanda'}</h2>
          <button className="btn-close" onClick={onClose}>×</button>
        </div>
        
        <div className="modal-body">
          {!order ? (
            // Create Order Form
            <form onSubmit={handleCreateOrder} className="form-grid">
              <div className="form-group">
                <label>Cliente (Opcional)</label>
                <select className="form-control" value={client_id} onChange={(e) => setClientId(e.target.value)}>
                  <option value="">Cliente Avulso</option>
                  {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div className="form-group" style={{ gridColumn: 'span 2' }}>
                <label>Observações</label>
                <input type="text" className="form-control" value={notes} onChange={(e) => setNotes(e.target.value)} />
              </div>
              <div className="modal-actions" style={{ gridColumn: 'span 2' }}>
                <button type="submit" className="btn btn-primary">Abrir Comanda</button>
              </div>
            </form>
          ) : (
            // Manage Order
            <div>
              <div className="order-summary mb-4" style={{ background: '#f5f5f5', padding: '15px', borderRadius: '8px' }}>
                <p><strong>Status:</strong> {order.status.toUpperCase()}</p>
                <p><strong>Cliente:</strong> {order.client_name || 'Avulso'}</p>
                <p><strong>Total:</strong> R$ {parseFloat(order.total_amount).toFixed(2)}</p>
                
                {order.status === 'aberta' && (
                  <div className="mt-2">
                    {!isClosing ? (
                      <button className="btn btn-success" onClick={() => setIsClosing(true)}>Fechar Comanda e Receber</button>
                    ) : (
                      <div className="payment-confirmation" style={{ border: '1px dashed green', padding: '10px', marginTop: '10px' }}>
                        <p><strong>Confirmar Fechamento:</strong></p>
                        <div className="form-group mt-2">
                          <label>Forma de Pagamento</label>
                          <select className="form-control" value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
                            <option value="dinheiro">Dinheiro</option>
                            <option value="cartao_credito">Cartão de Crédito</option>
                            <option value="cartao_debito">Cartão de Débito</option>
                            <option value="pix">PIX</option>
                          </select>
                        </div>
                        <div className="actions-cell mt-2">
                          <button className="btn btn-success" onClick={handleCloseOrder}>Confirmar Recebimento</button>
                          <button className="btn btn-secondary" onClick={() => setIsClosing(false)}>Voltar</button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {order.status === 'aberta' && (
                <div className="add-item-section mb-4" style={{ border: '1px solid #ddd', padding: '15px', borderRadius: '8px' }}>
                  <h3>Adicionar Item</h3>
                  <form onSubmit={handleAddItem} className="form-grid mt-2">
                    <div className="form-group">
                      <label>Tipo</label>
                      <select name="item_type" value={newItem.item_type} onChange={handleItemChange} className="form-control">
                        <option value="servico">Serviço</option>
                        <option value="produto">Produto</option>
                      </select>
                    </div>

                    {newItem.item_type === 'servico' ? (
                      <div className="form-group">
                        <label>Serviço</label>
                        <select name="service_id" value={newItem.service_id} onChange={handleItemChange} required className="form-control">
                          <option value="">Selecione...</option>
                          {services.map(s => <option key={s.id} value={s.id}>{s.name} (R$ {s.price})</option>)}
                        </select>
                      </div>
                    ) : (
                      <div className="form-group">
                        <label>Produto</label>
                        <select name="product_id" value={newItem.product_id} onChange={handleItemChange} required className="form-control">
                          <option value="">Selecione...</option>
                          {products.map(p => <option key={p.id} value={p.id}>{p.name} (R$ {p.sale_price})</option>)}
                        </select>
                      </div>
                    )}

                    <div className="form-group">
                      <label>Profissional</label>
                      <select name="professional_id" value={newItem.professional_id} onChange={handleItemChange} required={newItem.item_type === 'servico'} className="form-control">
                        <option value="">Nenhum/Selecione...</option>
                        {professionals.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                      </select>
                    </div>

                    <div className="form-group">
                      <label>Qtd</label>
                      <input type="number" name="quantity" min="1" value={newItem.quantity} onChange={handleItemChange} required className="form-control" />
                    </div>

                    <div className="form-group">
                      <label>Preço Unit.</label>
                      <input type="number" step="0.01" name="unit_price" value={newItem.unit_price} onChange={handleItemChange} required className="form-control" />
                    </div>

                    <div className="form-group d-flex align-items-end">
                      <button type="submit" className="btn btn-secondary w-100 mt-4">Adicionar</button>
                    </div>
                  </form>
                </div>
              )}

              <div className="items-list">
                <h3>Itens da Comanda</h3>
                <table className="data-table mt-2">
                  <thead>
                    <tr>
                      <th>Tipo</th>
                      <th>Item</th>
                      <th>Profissional</th>
                      <th>Qtd</th>
                      <th>Preço Unit.</th>
                      <th>Total</th>
                      {order.status === 'aberta' && <th>Ação</th>}
                    </tr>
                  </thead>
                  <tbody>
                    {order.items && order.items.map(item => (
                      <tr key={item.id}>
                        <td>{item.item_type}</td>
                        <td>{item.item_type === 'servico' ? item.service_name : item.product_name}</td>
                        <td>{item.professional_name || '-'}</td>
                        <td>{item.quantity}</td>
                        <td>R$ {parseFloat(item.unit_price).toFixed(2)}</td>
                        <td>R$ {parseFloat(item.total_price).toFixed(2)}</td>
                        {order.status === 'aberta' && (
                          <td>
                            <button className="btn btn-small btn-danger" onClick={() => handleRemoveItem(item.id)}>Remover</button>
                          </td>
                        )}
                      </tr>
                    ))}
                    {(!order.items || order.items.length === 0) && (
                      <tr>
                        <td colSpan={order.status === 'aberta' ? "7" : "6"} className="text-center">Nenhum item adicionado.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

            </div>
          )}
        </div>
        
        {order && (
          <div className="modal-footer mt-4">
            <button className="btn btn-secondary" onClick={onClose}>Fechar Janela</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default OrderModal;
