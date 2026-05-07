import React, { useEffect, useState } from 'react';
import api from '../services/api';

function Professionals() {
  const [professionals, setProfessionals] = useState([]);
  const [roles, setRoles] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  const initialFormState = {
    name: '',
    phone: '',
    email: '',
    role: '',
    specialty: '',
    commission_rate: 0
  };
  
  const [formData, setFormData] = useState(initialFormState);

  const fetchProfessionals = () => {
    api.get('/professionals')
      .then(response => {
        setProfessionals(response.data);
      })
      .catch(error => {
        console.error('Error fetching professionals:', error);
      });
  };

  const fetchRoles = () => {
    api.get('/roles')
      .then(response => {
        setRoles(response.data);
      })
      .catch(error => {
        console.error('Error fetching roles:', error);
      });
  };

  useEffect(() => {
    fetchProfessionals();
    fetchRoles();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleOpenForm = (pro = null) => {
    if (pro) {
      setEditingId(pro.id);
      setFormData({
        name: pro.name || '',
        phone: pro.phone || '',
        email: pro.email || '',
        role: pro.role || 'profissional',
        specialty: pro.specialty || '',
        commission_rate: pro.commission_rate || 0
      });
    } else {
      setEditingId(null);
      setFormData(initialFormState);
    }
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingId(null);
    setFormData(initialFormState);
  };

  const [professionalToDelete, setProfessionalToDelete] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`/professionals/${editingId}`, formData);
      } else {
        await api.post('/professionals', formData);
      }
      handleCloseForm();
      fetchProfessionals();
    } catch (error) {
      console.error('Error saving professional:', error);
    }
  };

  const handleDeleteRequest = (id) => {
    setProfessionalToDelete(id);
  };

  const confirmDelete = async () => {
    if (!professionalToDelete) return;
    try {
      await api.delete(`/professionals/${professionalToDelete}`);
      setProfessionalToDelete(null);
      fetchProfessionals();
    } catch (error) {
      console.error('Error deleting professional:', error);
    }
  };

  const cancelDelete = () => {
    setProfessionalToDelete(null);
  };

  return (
    <div className="professionals-page">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2>Gerenciar Profissionais</h2>
        {!isFormOpen && (
          <button className="btn-primary" onClick={() => handleOpenForm()}>
            + Novo Profissional
          </button>
        )}
      </div>

      {isFormOpen ? (
        <div className="card" style={{ maxWidth: '600px', margin: '0 auto' }}>
          <h3>{editingId ? 'Editar Profissional' : 'Novo Profissional'}</h3>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '20px' }}>
            <div className="form-group">
              <label>Nome *</label>
              <input type="text" name="name" value={formData.name} onChange={handleInputChange} required className="form-control" />
            </div>
            
            <div style={{ display: 'flex', gap: '15px' }}>
              <div className="form-group" style={{ flex: 1 }}>
                <label>Telefone</label>
                <input type="text" name="phone" value={formData.phone} onChange={handleInputChange} className="form-control" />
              </div>
              <div className="form-group" style={{ flex: 1 }}>
                <label>Email</label>
                <input type="email" name="email" value={formData.email} onChange={handleInputChange} className="form-control" />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '15px' }}>
              <div className="form-group" style={{ flex: 1 }}>
                <label>Cargo *</label>
                <select name="role" value={formData.role} onChange={handleInputChange} required className="form-control" style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ddd' }}>
                  <option value="">Selecione um cargo...</option>
                  {roles.map(role => (
                    <option key={role.id} value={role.name}>{role.name}</option>
                  ))}
                </select>
              </div>
              <div className="form-group" style={{ flex: 1 }}>
                <label>Especialidade</label>
                <input type="text" name="specialty" value={formData.specialty} onChange={handleInputChange} className="form-control" placeholder="Ex: Cabelereiro, Manicure..." />
              </div>
            </div>

            <div className="form-group">
              <label>Taxa de Comissão (%)</label>
              <input type="number" step="0.01" name="commission_rate" value={formData.commission_rate} onChange={handleInputChange} className="form-control" />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
              <button type="button" className="btn-secondary" onClick={handleCloseForm} style={{ padding: '10px 20px', border: '1px solid #ccc', borderRadius: '4px', cursor: 'pointer', backgroundColor: '#fff' }}>
                Cancelar
              </button>
              <button type="submit" className="btn-primary">
                Salvar
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="card">
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nome</th>
                <th>Especialidade</th>
                <th>Cargo</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {professionals.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: '20px' }}>Nenhum profissional cadastrado.</td>
                </tr>
              ) : (
                professionals.map(pro => (
                  <tr key={pro.id}>
                    <td>{pro.id}</td>
                    <td>{pro.name}</td>
                    <td>{pro.specialty || '-'}</td>
                    <td>{pro.role || '-'}</td>
                    <td>
                      <button 
                        onClick={() => handleOpenForm(pro)} 
                        style={{ marginRight: '10px', color: 'var(--color-gold)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}
                      >
                        Editar
                      </button>
                      <button 
                        onClick={() => handleDeleteRequest(pro.id)} 
                        style={{ color: '#dc3545', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}
                      >
                        Excluir
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal de Confirmação de Exclusão */}
      {professionalToDelete && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
          <div style={{ backgroundColor: '#fff', padding: '30px', borderRadius: '8px', maxWidth: '400px', width: '100%', textAlign: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}>
            <h3 style={{ marginBottom: '15px', color: '#212121' }}>Confirmar Exclusão</h3>
            <p style={{ marginBottom: '25px', color: '#666' }}>Tem certeza que deseja excluir este profissional? Esta ação não pode ser desfeita.</p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '15px' }}>
              <button 
                onClick={cancelDelete} 
                style={{ padding: '10px 20px', border: '1px solid #ccc', borderRadius: '4px', cursor: 'pointer', backgroundColor: '#fff', fontWeight: 'bold' }}
              >
                Cancelar
              </button>
              <button 
                onClick={confirmDelete} 
                style={{ padding: '10px 20px', border: 'none', borderRadius: '4px', cursor: 'pointer', backgroundColor: '#dc3545', color: '#fff', fontWeight: 'bold' }}
              >
                Sim, Excluir
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Professionals;
