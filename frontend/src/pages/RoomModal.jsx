import React, { useState, useEffect } from 'react';
import api from '../services/api';

function RoomModal({ isOpen, onClose, roomData, onSave }) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    capacity: 1,
    active: true
  });

  useEffect(() => {
    if (roomData) {
      setFormData({
        name: roomData.name || '',
        description: roomData.description || '',
        capacity: roomData.capacity || 1,
        active: roomData.active !== undefined ? roomData.active : true
      });
    } else {
      setFormData({
        name: '',
        description: '',
        capacity: 1,
        active: true
      });
    }
  }, [roomData, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Prepare payload
    const payload = {
      ...formData,
      capacity: parseInt(formData.capacity, 10)
    };

    if (roomData && roomData.id) {
      // Update
      api.put(`/rooms/${roomData.id}`, payload)
        .then(() => {
          onSave();
          onClose();
        })
        .catch(err => {
          console.error('Error updating room:', err);
          alert('Erro ao atualizar sala.');
        });
    } else {
      // Create
      api.post('/rooms', payload)
        .then(() => {
          onSave();
          onClose();
        })
        .catch(err => {
          console.error('Error creating room:', err);
          alert('Erro ao criar sala.');
        });
    }
  };

  return (
    <div className="modal-overlay" style={overlayStyle}>
      <div className="modal-content card" style={contentStyle}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2>{roomData ? 'Editar Sala' : 'Nova Sala'}</h2>
          <button onClick={onClose} style={closeBtnStyle}>&times;</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group" style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>Nome da Sala *</label>
            <input 
              type="text" 
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="form-control"
              style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
              placeholder="Ex: Sala de Estética 1"
            />
          </div>

          <div className="form-group" style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>Descrição</label>
            <textarea 
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="form-control"
              style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px', minHeight: '80px' }}
              placeholder="Descreva os equipamentos, uso recomendado, etc."
            />
          </div>

          <div className="form-row" style={{ display: 'flex', gap: '15px', marginBottom: '20px' }}>
            <div className="form-group" style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: '5px' }}>Capacidade (Pessoas)</label>
              <input 
                type="number" 
                name="capacity"
                value={formData.capacity}
                onChange={handleChange}
                min="1"
                required
                className="form-control"
                style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
              />
            </div>

            <div className="form-group" style={{ flex: 1, display: 'flex', alignItems: 'flex-end', paddingBottom: '8px' }}>
              <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                <input 
                  type="checkbox" 
                  name="active"
                  checked={formData.active}
                  onChange={handleChange}
                  style={{ marginRight: '8px' }}
                />
                Sala Ativa
              </label>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
            <button type="button" onClick={onClose} style={{ padding: '8px 16px', background: '#f5f5f5', border: '1px solid #ccc', borderRadius: '4px', cursor: 'pointer' }}>
              Cancelar
            </button>
            <button type="submit" className="btn-primary" style={{ padding: '8px 16px', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
              Salvar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const overlayStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 1000
};

const contentStyle = {
  width: '100%',
  maxWidth: '500px',
  backgroundColor: '#fff',
  padding: '30px',
  borderRadius: '8px',
  boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
};

const closeBtnStyle = {
  background: 'none',
  border: 'none',
  fontSize: '24px',
  cursor: 'pointer',
  lineHeight: 1
};

export default RoomModal;
