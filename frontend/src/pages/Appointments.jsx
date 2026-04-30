import React, { useEffect, useState } from 'react';
import api from '../services/api';

function Appointments() {
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    api.get('/appointments')
      .then(response => {
        setAppointments(response.data);
      })
      .catch(error => {
        console.error('Error fetching appointments:', error);
      });
  }, []);

  return (
    <div className="appointments-page">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2>Agenda do Salão</h2>
        <button className="btn-primary">+ Novo Agendamento</button>
      </div>

      <div className="card">
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Data/Hora</th>
              <th>Cliente (ID)</th>
              <th>Profissional (ID)</th>
              <th>Serviço (ID)</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {appointments.length === 0 ? (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center' }}>Nenhum agendamento encontrado.</td>
              </tr>
            ) : (
              appointments.map(appt => (
                <tr key={appt.id}>
                  <td>{appt.id}</td>
                  <td>{new Date(appt.date).toLocaleString()}</td>
                  <td>{appt.client_id}</td>
                  <td>{appt.professional_id}</td>
                  <td>{appt.service_id}</td>
                  <td>{appt.status}</td>
                  <td>
                    <button style={{ marginRight: '10px' }}>Editar</button>
                    <button style={{ color: 'red' }}>Cancelar</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Appointments;
