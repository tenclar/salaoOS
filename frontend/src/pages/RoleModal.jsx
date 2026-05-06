import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import api from '../services/api';

const AVAILABLE_PERMISSIONS = [
  { id: 'appointments', label: 'Agenda (Agendamentos)' },
  { id: 'clients', label: 'Clientes' },
  { id: 'professionals', label: 'Profissionais' },
  { id: 'services', label: 'Serviços' },
  { id: 'products', label: 'Produtos' },
  { id: 'finance', label: 'Financeiro' },
  { id: 'settings', label: 'Configurações' }
];

function RoleModal({ isOpen, onClose, roleData, onSave }) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    permissions: {}
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen) {
      if (roleData) {
        // Edit mode
        setFormData({
          name: roleData.name || '',
          description: roleData.description || '',
          permissions: typeof roleData.permissions === 'string' 
            ? JSON.parse(roleData.permissions) 
            : (roleData.permissions || {})
        });
      } else {
        // Create mode
        setFormData({
          name: '',
          description: '',
          permissions: {}
        });
      }
      setError(null);
    }
  }, [isOpen, roleData]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePermissionChange = (permId) => {
    setFormData(prev => ({
      ...prev,
      permissions: {
        ...prev.permissions,
        [permId]: !prev.permissions[permId]
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (roleData && roleData.id) {
        await api.put(`/roles/${roleData.id}`, formData);
      } else {
        await api.post('/roles', formData);
      }
      onSave(); // trigger refresh
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Erro ao salvar o cargo');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h3>{roleData ? 'Editar Cargo' : 'Novo Cargo'}</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
            <X size={24} color="var(--color-text-muted)" />
          </button>
        </div>
        <div className="modal-body">
          {error && <div style={{ color: 'red', marginBottom: '16px' }}>{error}</div>}
          <form id="role-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Nome do Cargo</label>
              <input 
                type="text" 
                className="form-control" 
                name="name" 
                value={formData.name} 
                onChange={handleChange} 
                placeholder="Ex: Gerente"
                required 
              />
            </div>
            <div className="form-group">
              <label>Descrição</label>
              <textarea 
                className="form-control" 
                name="description" 
                value={formData.description} 
                onChange={handleChange} 
                placeholder="Descrição curta sobre as responsabilidades"
                rows="2" 
              />
            </div>
            
            <div className="form-group" style={{ marginTop: '20px' }}>
              <label>Permissões de Acesso</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '10px' }}>
                {AVAILABLE_PERMISSIONS.map(perm => (
                  <label key={perm.id} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={!!formData.permissions[perm.id]}
                      onChange={() => handlePermissionChange(perm.id)}
                    />
                    <span>{perm.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </form>
        </div>
        <div className="modal-footer">
          <button type="button" className="btn-secondary" onClick={onClose}>Cancelar</button>
          <button type="submit" form="role-form" className="btn-primary" disabled={loading}>
            {loading ? 'Salvando...' : 'Salvar Cargo'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default RoleModal;
