import React, { useEffect, useState } from 'react';
import api from '../services/api';

function Professionals() {
  const [professionals, setProfessionals] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  const initialFormState = {
    name: '',
    phone: '',
    email: '',
    role: 'profissional',
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

  useEffect(() => {
    fetchProfessionals();
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`/professionals/${editingId}`, formData);
        alert('Profissional atualizado com sucesso!');
      } else {
        await api.post('/professionals', formData);
        alert('Profissional criado com sucesso!');
      }
      handleCloseForm();
      fetchProfessionals();
    } catch (error) {
      console.error('Error saving professional:', error);
      alert('Erro ao salvar profissional.');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este profissional?')) {
      try {
        await api.delete(`/professionals/${id}`);
        alert('Profissional excluído com sucesso!');
        fetchProfessionals();
      } catch (error) {
        console.error('Error deleting professional:', error);
        alert('Erro ao excluir profissional.');
      }
    }
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
                  <option value="profissional">Profissional / Especialista</option>
                  <option value="recepcao">Recepção / Gerência</option>
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
                    <td>{pro.role === 'recepcao' ? 'Recepção' : 'Profissional'}</td>
                    <td>
                      <button 
                        onClick={() => handleOpenForm(pro)} 
                        style={{ marginRight: '10px', color: 'var(--color-gold)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}
                      >
                        Editar
                      </button>
                      <button 
                        onClick={() => handleDelete(pro.id)} 
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
    </div>
  );
}

export default Professionals;
