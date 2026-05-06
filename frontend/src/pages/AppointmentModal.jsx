import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import api from '../services/api';

function AppointmentModal({ isOpen, onClose, selectedDate, selectedTime, professionalId, onSave }) {
  const [clients, setClients] = useState([]);
  const [services, setServices] = useState([]);
  const [professionals, setProfessionals] = useState([]);
  const [formData, setFormData] = useState({
    client_id: '',
    professional_id: professionalId || '',
    service_id: '',
    date: selectedDate,
    start_time: selectedTime,
    notes: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen) {
      setFormData(prev => ({ 
        ...prev, 
        date: selectedDate, 
        start_time: selectedTime,
        professional_id: professionalId || ''
      }));
      fetchData();
    }
  }, [isOpen, selectedDate, selectedTime, professionalId]);

  const fetchData = async () => {
    try {
      const [clientsRes, servicesRes, profRes] = await Promise.all([
        api.get('/clients'),
        api.get('/services'),
        api.get('/professionals')
      ]);
      setClients(clientsRes.data);
      setServices(servicesRes.data);
      setProfessionals(profRes.data);
    } catch (err) {
      console.error('Error fetching data for modal', err);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Calculate end_time based on service duration
    const service = services.find(s => s.id === parseInt(formData.service_id));
    if (!service) {
      setError("Por favor, selecione um serviço.");
      setLoading(false);
      return;
    }

    const startParts = formData.start_time.split(':');
    const startDate = new Date();
    startDate.setHours(parseInt(startParts[0]), parseInt(startParts[1]), 0);
    
    const endDate = new Date(startDate.getTime() + service.duration_minutes * 60000);
    const end_time = `${endDate.getHours().toString().padStart(2, '0')}:${endDate.getMinutes().toString().padStart(2, '0')}:00`;

    const payload = {
      ...formData,
      end_time,
      duration_minutes: service.duration_minutes,
      value: service.price,
      status: 'pendente'
    };

    try {
      await api.post('/appointments', payload);
      onSave(); // trigger refresh
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Erro ao criar agendamento');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h3>Novo Agendamento</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
            <X size={24} color="var(--color-text-muted)" />
          </button>
        </div>
        <div className="modal-body">
          {error && <div style={{ color: 'red', marginBottom: '16px' }}>{error}</div>}
          <form id="appointment-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Data</label>
              <input type="date" className="form-control" name="date" value={formData.date} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Horário de Início</label>
              <input type="time" className="form-control" name="start_time" value={formData.start_time} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Cliente</label>
              <select className="form-control" name="client_id" value={formData.client_id} onChange={handleChange} required>
                <option value="">Selecione um cliente</option>
                {clients.map(client => (
                  <option key={client.id} value={client.id}>{client.name}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Profissional</label>
              <select className="form-control" name="professional_id" value={formData.professional_id} onChange={handleChange} required>
                <option value="">Selecione um profissional</option>
                {professionals.map(prof => (
                  <option key={prof.id} value={prof.id}>{prof.name}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Serviço</label>
              <select className="form-control" name="service_id" value={formData.service_id} onChange={handleChange} required>
                <option value="">Selecione um serviço</option>
                {services.map(service => (
                  <option key={service.id} value={service.id}>{service.name} ({service.duration_minutes} min)</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Observações</label>
              <textarea className="form-control" name="notes" value={formData.notes} onChange={handleChange} rows="2" />
            </div>
          </form>
        </div>
        <div className="modal-footer">
          <button className="btn-secondary" onClick={onClose}>Cancelar</button>
          <button type="submit" form="appointment-form" className="btn-primary" disabled={loading}>
            {loading ? 'Salvando...' : 'Salvar Agendamento'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default AppointmentModal;
