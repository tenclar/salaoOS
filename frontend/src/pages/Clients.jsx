import React, { useEffect, useState } from 'react';
import api from '../services/api';

function Clients() {
  const [clients, setClients] = useState([]);

  useEffect(() => {
    // Fetch clients from backend
    api.get('/clients')
      .then(response => {
        setClients(response.data);
      })
      .catch(error => {
        console.error('Error fetching clients:', error);
      });
  }, []);

  return (
    <div className="clients-page">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2>Gerenciar Clientes</h2>
        <button className="btn-primary">+ Novo Cliente</button>
      </div>

      <div className="card">
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nome</th>
              <th>Email</th>
              <th>Telefone</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {clients.length === 0 ? (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center' }}>Nenhum cliente cadastrado.</td>
              </tr>
            ) : (
              clients.map(client => (
                <tr key={client.id}>
                  <td>{client.id}</td>
                  <td>{client.name}</td>
                  <td>{client.email}</td>
                  <td>{client.phone}</td>
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

export default Clients;
