import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import api from '../services/api';

function ServiceModal({ isOpen, onClose, serviceData, onSave }) {
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    description: '',
    price: '',
    duration_minutes: '',
    commission_rate: '',
    active: true
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen) {
      if (serviceData) {
        // Edit mode
        setFormData({
          name: serviceData.name || '',
          category: serviceData.category || '',
          description: serviceData.description || '',
          price: serviceData.price || '',
          duration_minutes: serviceData.duration_minutes || '',
          commission_rate: serviceData.commission_rate || '',
          active: serviceData.active !== undefined ? serviceData.active : true
        });
      } else {
        // Create mode
        setFormData({
          name: '',
          category: '',
          description: '',
          price: '',
          duration_minutes: '',
          commission_rate: '',
          active: true
        });
      }
      setError(null);
    }
  }, [isOpen, serviceData]);

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
        price: parseFloat(formData.price) || 0,
        duration_minutes: parseInt(formData.duration_minutes, 10) || 0,
        commission_rate: parseFloat(formData.commission_rate) || 0,
      };

      if (serviceData && serviceData.id) {
        await api.put(`/services/${serviceData.id}`, payload);
      } else {
        await api.post('/services', payload);
      }
      onSave(); // trigger refresh
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Erro ao salvar o serviço');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '600px' }}>
        <div className="modal-header">
          <h3>{serviceData ? 'Editar Serviço' : 'Novo Serviço'}</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
            <X size={24} color="var(--color-text-muted)" />
          </button>
        </div>
        <div className="modal-body">
          {error && <div style={{ color: 'red', marginBottom: '16px' }}>{error}</div>}
          <form id="service-form" onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
              <div className="form-group" style={{ gridColumn: '1 / span 2' }}>
                <label>Nome do Serviço</label>
                <input 
                  type="text" 
                  className="form-control" 
                  name="name" 
                  value={formData.name} 
                  onChange={handleChange} 
                  placeholder="Ex: Corte Feminino"
                  required 
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
                <label>Preço (R$)</label>
                <input 
                  type="number" 
                  step="0.01"
                  className="form-control" 
                  name="price" 
                  value={formData.price} 
                  onChange={handleChange} 
                  placeholder="0.00"
                  required 
                />
              </div>

              <div className="form-group">
                <label>Duração (minutos)</label>
                <input 
                  type="number" 
                  className="form-control" 
                  name="duration_minutes" 
                  value={formData.duration_minutes} 
                  onChange={handleChange} 
                  placeholder="Ex: 60"
                  required 
                />
              </div>

              <div className="form-group">
                <label>Taxa de Comissão (%)</label>
                <input 
                  type="number" 
                  step="0.01"
                  className="form-control" 
                  name="commission_rate" 
                  value={formData.commission_rate} 
                  onChange={handleChange} 
                  placeholder="Ex: 50.00"
                />
              </div>

              <div className="form-group" style={{ gridColumn: '1 / span 2' }}>
                <label>Descrição</label>
                <textarea 
                  className="form-control" 
                  name="description" 
                  value={formData.description} 
                  onChange={handleChange} 
                  placeholder="Descrição do serviço"
                  rows="3" 
                />
              </div>

              <div className="form-group" style={{ gridColumn: '1 / span 2', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <input 
                  type="checkbox" 
                  id="active"
                  name="active" 
                  checked={formData.active} 
                  onChange={handleChange} 
                />
                <label htmlFor="active" style={{ marginBottom: 0, cursor: 'pointer' }}>Serviço Ativo</label>
              </div>
            </div>
          </form>
        </div>
        <div className="modal-footer">
          <button type="button" className="btn-secondary" onClick={onClose}>Cancelar</button>
          <button type="submit" form="service-form" className="btn-primary" disabled={loading}>
            {loading ? 'Salvando...' : 'Salvar Serviço'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ServiceModal;
