import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import api from '../services/api';

function ProductModal({ isOpen, onClose, productData, onSave }) {
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    brand: '',
    type: 'venda',
    cost_price: '',
    sale_price: '',
    stock_quantity: '',
    min_stock: '',
    unit: '',
    supplier: '',
    expiration: '',
    active: true
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen) {
      if (productData) {
        // Edit mode
        setFormData({
          name: productData.name || '',
          category: productData.category || '',
          brand: productData.brand || '',
          type: productData.type || 'venda',
          cost_price: productData.cost_price || '',
          sale_price: productData.sale_price || '',
          stock_quantity: productData.stock_quantity || '',
          min_stock: productData.min_stock || '',
          unit: productData.unit || '',
          supplier: productData.supplier || '',
          expiration: productData.expiration ? new Date(productData.expiration).toISOString().split('T')[0] : '',
          active: productData.active !== undefined ? productData.active : true
        });
      } else {
        // Create mode
        setFormData({
          name: '',
          category: '',
          brand: '',
          type: 'venda',
          cost_price: '',
          sale_price: '',
          stock_quantity: '',
          min_stock: '',
          unit: '',
          supplier: '',
          expiration: '',
          active: true
        });
      }
      setError(null);
    }
  }, [isOpen, productData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ 
      ...formData, 
      [name]: type === 'checkbox' ? checked : value 
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const payload = {
        ...formData,
        cost_price: parseFloat(formData.cost_price) || 0,
        sale_price: parseFloat(formData.sale_price) || 0,
        stock_quantity: parseInt(formData.stock_quantity, 10) || 0,
        min_stock: parseInt(formData.min_stock, 10) || 0,
        expiration: formData.expiration || null
      };

      if (productData && productData.id) {
        await api.put(`/products/${productData.id}`, payload);
      } else {
        await api.post('/products', payload);
      }
      onSave(); // trigger refresh
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Erro ao salvar o produto');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '800px' }}>
        <div className="modal-header">
          <h3>{productData ? 'Editar Produto' : 'Novo Produto'}</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
            <X size={24} color="var(--color-text-muted)" />
          </button>
        </div>
        <div className="modal-body">
          {error && <div style={{ color: 'red', marginBottom: '16px' }}>{error}</div>}
          <form id="product-form" onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px' }}>
              <div className="form-group" style={{ gridColumn: '1 / span 2' }}>
                <label>Nome do Produto</label>
                <input 
                  type="text" 
                  className="form-control" 
                  name="name" 
                  value={formData.name} 
                  onChange={handleChange} 
                  placeholder="Ex: Shampoo Anticaspa"
                  required 
                />
              </div>

              <div className="form-group">
                <label>Marca</label>
                <input 
                  type="text" 
                  className="form-control" 
                  name="brand" 
                  value={formData.brand} 
                  onChange={handleChange} 
                  placeholder="Ex: L'Oréal"
                />
              </div>

              <div className="form-group">
                <label>Categoria</label>
                <input 
                  type="text" 
                  className="form-control" 
                  name="category" 
                  value={formData.category} 
                  onChange={handleChange} 
                  placeholder="Ex: Cabelo"
                />
              </div>

              <div className="form-group">
                <label>Tipo</label>
                <select 
                  className="form-control" 
                  name="type" 
                  value={formData.type} 
                  onChange={handleChange}
                >
                  <option value="venda">Venda</option>
                  <option value="consumo">Consumo Interno</option>
                </select>
              </div>

              <div className="form-group">
                <label>Fornecedor</label>
                <input 
                  type="text" 
                  className="form-control" 
                  name="supplier" 
                  value={formData.supplier} 
                  onChange={handleChange} 
                  placeholder="Nome do fornecedor"
                />
              </div>

              <div className="form-group">
                <label>Preço de Custo (R$)</label>
                <input 
                  type="number" 
                  step="0.01"
                  className="form-control" 
                  name="cost_price" 
                  value={formData.cost_price} 
                  onChange={handleChange} 
                  placeholder="0.00"
                />
              </div>

              <div className="form-group">
                <label>Preço de Venda (R$)</label>
                <input 
                  type="number" 
                  step="0.01"
                  className="form-control" 
                  name="sale_price" 
                  value={formData.sale_price} 
                  onChange={handleChange} 
                  placeholder="0.00"
                />
              </div>

              <div className="form-group">
                <label>Validade</label>
                <input 
                  type="date" 
                  className="form-control" 
                  name="expiration" 
                  value={formData.expiration} 
                  onChange={handleChange} 
                />
              </div>

              <div className="form-group">
                <label>Qtd. em Estoque</label>
                <input 
                  type="number" 
                  className="form-control" 
                  name="stock_quantity" 
                  value={formData.stock_quantity} 
                  onChange={handleChange} 
                  placeholder="0"
                />
              </div>

              <div className="form-group">
                <label>Estoque Mínimo</label>
                <input 
                  type="number" 
                  className="form-control" 
                  name="min_stock" 
                  value={formData.min_stock} 
                  onChange={handleChange} 
                  placeholder="0"
                />
              </div>

              <div className="form-group">
                <label>Unidade de Medida</label>
                <input 
                  type="text" 
                  className="form-control" 
                  name="unit" 
                  value={formData.unit} 
                  onChange={handleChange} 
                  placeholder="Ex: ml, un, g"
                />
              </div>

              <div className="form-group" style={{ gridColumn: '1 / span 3', display: 'flex', alignItems: 'center', gap: '10px', marginTop: '10px' }}>
                <input 
                  type="checkbox" 
                  id="active"
                  name="active" 
                  checked={formData.active} 
                  onChange={handleChange} 
                />
                <label htmlFor="active" style={{ marginBottom: 0, cursor: 'pointer' }}>Produto Ativo</label>
              </div>
            </div>
          </form>
        </div>
        <div className="modal-footer">
          <button type="button" className="btn-secondary" onClick={onClose}>Cancelar</button>
          <button type="submit" form="product-form" className="btn-primary" disabled={loading}>
            {loading ? 'Salvando...' : 'Salvar Produto'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductModal;
