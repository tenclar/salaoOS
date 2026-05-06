import React, { useEffect, useState } from 'react';
import api from '../services/api';
import RoleModal from './RoleModal';

function Roles() {
  const [roles, setRoles] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);

  const loadRoles = () => {
    api.get('/roles')
      .then(response => {
        setRoles(response.data);
      })
      .catch(error => {
        console.error('Error fetching roles:', error);
      });
  };

  useEffect(() => {
    loadRoles();
  }, []);

  const handleOpenModal = (role = null) => {
    setSelectedRole(role);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedRole(null);
  };

  const handleDelete = (id) => {
    if (window.confirm('Tem certeza que deseja excluir este cargo?')) {
      api.delete(`/roles/${id}`)
        .then(() => {
          loadRoles();
        })
        .catch(err => {
          console.error('Error deleting role:', err);
          alert('Erro ao excluir cargo.');
        });
    }
  };

  return (
    <div className="roles-page">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <h3>Cargos e Perfis de Acesso</h3>
          <p style={{ color: 'var(--color-text-muted)' }}>Defina cargos, permissões e acessos ao sistema.</p>
        </div>
        <button className="btn-primary" onClick={() => handleOpenModal()}>+ Novo Cargo</button>
      </div>

      <div className="card">
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nome</th>
              <th>Descrição</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {roles.length === 0 ? (
              <tr>
                <td colSpan="4" style={{ textAlign: 'center' }}>Nenhum cargo cadastrado.</td>
              </tr>
            ) : (
              roles.map(role => (
                <tr key={role.id}>
                  <td>{role.id}</td>
                  <td><strong>{role.name}</strong></td>
                  <td>{role.description || '-'}</td>
                  <td>
                    <button style={{ marginRight: '10px' }} onClick={() => handleOpenModal(role)}>Editar</button>
                    <button style={{ color: 'red', cursor: 'pointer', background: 'transparent', border: 'none' }} onClick={() => handleDelete(role.id)}>Excluir</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <RoleModal 
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        roleData={selectedRole}
        onSave={loadRoles}
      />
    </div>
  );
}

export default Roles;
