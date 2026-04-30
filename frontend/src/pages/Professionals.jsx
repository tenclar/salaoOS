import React, { useEffect, useState } from 'react';
import api from '../services/api';

function Professionals() {
  const [professionals, setProfessionals] = useState([]);

  useEffect(() => {
    api.get('/professionals')
      .then(response => {
        setProfessionals(response.data);
      })
      .catch(error => {
        console.error('Error fetching professionals:', error);
      });
  }, []);

  return (
    <div className="professionals-page">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2>Gerenciar Profissionais</h2>
        <button className="btn-primary">+ Novo Profissional</button>
      </div>

      <div className="card">
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nome</th>
              <th>Especialidade</th>
              <th>Email</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {professionals.length === 0 ? (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center' }}>Nenhum profissional cadastrado.</td>
              </tr>
            ) : (
              professionals.map(pro => (
                <tr key={pro.id}>
                  <td>{pro.id}</td>
                  <td>{pro.name}</td>
                  <td>{pro.specialty}</td>
                  <td>{pro.email}</td>
                  <td>
                    <button style={{ marginRight: '10px' }}>Editar</button>
                    <button style={{ color: 'red' }}>Excluir</button>
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

export default Professionals;
