import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../services/api';

function ClientForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    whatsapp: '',
    email: '',
    birthdate: '',
    address: '',
    notes: '',
    preferences: '',
    allergies: ''
  });

  const [loading, setLoading] = useState(isEditMode);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isEditMode) {
      api.get(`/clients/${id}`)
        .then(response => {
          const clientData = response.data;
          if (clientData.birthdate) {
            // Format date to YYYY-MM-DD for the input type="date"
            clientData.birthdate = new Date(clientData.birthdate).toISOString().split('T')[0];
          }
          setFormData(clientData);
          setLoading(false);
        })
        .catch(err => {
          console.error('Error fetching client:', err);
          setError('Erro ao carregar dados do cliente.');
          setLoading(false);
        });
    }
  }, [id, isEditMode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    // Convert empty strings to null to prevent MySQL errors (e.g. for dates)
    const payload = Object.fromEntries(
      Object.entries(formData).map(([key, value]) => [key, value === '' ? null : value])
    );

    const request = isEditMode 
      ? api.put(`/clients/${id}`, payload)
      : api.post('/clients', payload);

    request
      .then(() => {
        navigate('/clients');
      })
      .catch(err => {
        console.error('Error saving client:', err);
        setError('Erro ao salvar os dados do cliente.');
        setSaving(false);
      });
  };

  if (loading) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="client-form-page">
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px', gap: '15px' }}>
        <button className="btn-secondary" onClick={() => navigate('/clients')}>&larr; Voltar</button>
        <h2>{isEditMode ? 'Editar Cliente' : 'Novo Cliente'}</h2>
      </div>

      {error && <div style={{ color: 'red', marginBottom: '15px' }}>{error}</div>}

      <div className="card">
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
            <label htmlFor="name">Nome *</label>
            <input type="text" id="name" name="name" value={formData.name || ''} onChange={handleChange} required style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px' }}>
            <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              <label htmlFor="phone">Telefone</label>
              <input type="text" id="phone" name="phone" value={formData.phone || ''} onChange={handleChange} style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} />
            </div>

            <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              <label htmlFor="whatsapp">WhatsApp</label>
              <input type="text" id="whatsapp" name="whatsapp" value={formData.whatsapp || ''} onChange={handleChange} style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} />
            </div>

            <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              <label htmlFor="birthdate">Data de Nascimento</label>
              <input type="date" id="birthdate" name="birthdate" value={formData.birthdate || ''} onChange={handleChange} style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} />
            </div>
          </div>

          <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
            <label htmlFor="email">E-mail</label>
            <input type="email" id="email" name="email" value={formData.email || ''} onChange={handleChange} style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} />
          </div>

          <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
            <label htmlFor="address">Endereço</label>
            <input type="text" id="address" name="address" value={formData.address || ''} onChange={handleChange} style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} />
          </div>

          <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
            <label htmlFor="preferences">Preferências</label>
            <textarea id="preferences" name="preferences" value={formData.preferences || ''} onChange={handleChange} rows="2" style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} />
          </div>

          <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
            <label htmlFor="allergies">Alergias</label>
            <textarea id="allergies" name="allergies" value={formData.allergies || ''} onChange={handleChange} rows="2" style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} />
          </div>

          <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
            <label htmlFor="notes">Notas adicionais</label>
            <textarea id="notes" name="notes" value={formData.notes || ''} onChange={handleChange} rows="3" style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} />
          </div>

          <div style={{ marginTop: '10px' }}>
            <button type="submit" className="btn-primary" disabled={saving}>
              {saving ? 'Salvando...' : 'Salvar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ClientForm;
