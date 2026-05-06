import React, { useEffect, useState } from 'react';
import api from '../services/api';
import RoomModal from './RoomModal';

function Rooms() {
  const [rooms, setRooms] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);

  const loadRooms = () => {
    api.get('/rooms')
      .then(response => {
        setRooms(response.data);
      })
      .catch(error => {
        console.error('Error fetching rooms:', error);
      });
  };

  useEffect(() => {
    loadRooms();
  }, []);

  const handleOpenModal = (room = null) => {
    setSelectedRoom(room);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedRoom(null);
  };

  const handleDelete = (id) => {
    if (window.confirm('Tem certeza que deseja excluir esta sala?')) {
      api.delete(`/rooms/${id}`)
        .then(() => {
          loadRooms();
        })
        .catch(err => {
          console.error('Error deleting room:', err);
          alert('Erro ao excluir sala.');
        });
    }
  };

  return (
    <div className="rooms-page">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <h3>Salas e Espaços</h3>
          <p style={{ color: 'var(--color-text-muted)' }}>Gerencie a disponibilidade de salas, macas e lavatórios.</p>
        </div>
        <button className="btn-primary" onClick={() => handleOpenModal()}>+ Nova Sala</button>
      </div>

      <div className="card">
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nome</th>
              <th>Descrição</th>
              <th>Capacidade</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {rooms.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center' }}>Nenhuma sala cadastrada.</td>
              </tr>
            ) : (
              rooms.map(room => (
                <tr key={room.id}>
                  <td>{room.id}</td>
                  <td><strong>{room.name}</strong></td>
                  <td>{room.description || '-'}</td>
                  <td>{room.capacity} pessoa(s)</td>
                  <td>
                    <span style={{ 
                      padding: '4px 8px', 
                      borderRadius: '12px', 
                      fontSize: '0.85em',
                      backgroundColor: room.active ? 'rgba(76, 175, 80, 0.1)' : 'rgba(244, 67, 54, 0.1)',
                      color: room.active ? '#4CAF50' : '#F44336'
                    }}>
                      {room.active ? 'Ativo' : 'Inativo'}
                    </span>
                  </td>
                  <td>
                    <button style={{ marginRight: '10px' }} onClick={() => handleOpenModal(room)}>Editar</button>
                    <button style={{ color: 'red', cursor: 'pointer', background: 'transparent', border: 'none' }} onClick={() => handleDelete(room.id)}>Excluir</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <RoomModal 
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        roomData={selectedRoom}
        onSave={loadRooms}
      />
    </div>
  );
}

export default Rooms;
