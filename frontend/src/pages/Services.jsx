import React, { useEffect, useState } from 'react';
import api from '../services/api';
import ServiceModal from './ServiceModal';

function Services() {
  const [services, setServices] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState(null);

  const loadServices = () => {
    api.get('/services')
      .then(response => {
        setServices(response.data);
      })
      .catch(error => {
        console.error('Error fetching services:', error);
      });
  };

  useEffect(() => {
    loadServices();
  }, []);

  const handleOpenModal = (service = null) => {
    setSelectedService(service);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedService(null);
  };

  const handleDelete = (id) => {
    if (window.confirm('Tem certeza que deseja excluir este serviço?')) {
      api.delete(`/services/${id}`)
        .then(() => {
          loadServices();
        })
        .catch(err => {
          console.error('Error deleting service:', err);
          alert('Erro ao excluir serviço.');
        });
    }
  };

  return (
    <div className="services-page">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <h3>Serviços Oferecidos</h3>
          <p style={{ color: 'var(--color-text-muted)' }}>Cadastre e gerencie os serviços prestados (ex: Corte, Coloração, Manicure).</p>
        </div>
        <button className="btn-primary" onClick={() => handleOpenModal()}>+ Novo Serviço</button>
      </div>

      <div className="card">
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nome</th>
              <th>Categoria</th>
              <th>Preço</th>
              <th>Duração</th>
              <th>Comissão</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {services.length === 0 ? (
              <tr>
                <td colSpan="8" style={{ textAlign: 'center' }}>Nenhum serviço cadastrado.</td>
              </tr>
            ) : (
              services.map(service => (
                <tr key={service.id}>
                  <td>{service.id}</td>
                  <td><strong>{service.name}</strong></td>
                  <td>{service.category || '-'}</td>
                  <td>R$ {Number(service.price).toFixed(2)}</td>
                  <td>{service.duration_minutes} min</td>
                  <td>{Number(service.commission_rate).toFixed(2)}%</td>
                  <td>
                    <span style={{ 
                      padding: '4px 8px', 
                      borderRadius: '12px', 
                      fontSize: '0.85em',
                      backgroundColor: service.active ? 'rgba(76, 175, 80, 0.1)' : 'rgba(244, 67, 54, 0.1)',
                      color: service.active ? '#4CAF50' : '#F44336'
                    }}>
                      {service.active ? 'Ativo' : 'Inativo'}
                    </span>
                  </td>
                  <td>
                    <button style={{ marginRight: '10px' }} onClick={() => handleOpenModal(service)}>Editar</button>
                    <button style={{ color: 'red', cursor: 'pointer', background: 'transparent', border: 'none' }} onClick={() => handleDelete(service.id)}>Excluir</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <ServiceModal 
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        serviceData={selectedService}
        onSave={loadServices}
      />
    </div>
  );
}

export default Services;
