import React, { useEffect, useState } from 'react';
import { format, parseISO, addDays, subDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, User, Plus } from 'lucide-react';
import api from '../services/api';
import AppointmentModal from './AppointmentModal';

function Appointments() {
  const [professionals, setProfessionals] = useState([]);
  const [selectedProfessional, setSelectedProfessional] = useState('');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [appointments, setAppointments] = useState([]);
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSlotTime, setSelectedSlotTime] = useState('08:00');

  const startHour = 8; // 08:00
  const endHour = 20; // 20:00
  const slotHeight = 120; // 60px for 30min = 120px for 1 hour. 1 minute = 2px.
  const pxPerMinute = 2;

  useEffect(() => {
    fetchProfessionals();
  }, []);

  useEffect(() => {
    if (selectedProfessional) {
      fetchAppointments();
    } else {
      setAppointments([]);
    }
  }, [selectedProfessional, currentDate]);

  const fetchProfessionals = async () => {
    try {
      const response = await api.get('/professionals');
      setProfessionals(response.data);
      if (response.data.length > 0) {
        setSelectedProfessional(response.data[0].id);
      }
    } catch (error) {
      console.error('Error fetching professionals:', error);
    }
  };

  const fetchAppointments = async () => {
    try {
      const formattedDate = format(currentDate, 'yyyy-MM-dd');
      const response = await api.get(`/appointments?professional_id=${selectedProfessional}&date=${formattedDate}`);
      setAppointments(response.data);
    } catch (error) {
      console.error('Error fetching appointments:', error);
    }
  };

  const handlePrevDay = () => setCurrentDate(subDays(currentDate, 1));
  const handleNextDay = () => setCurrentDate(addDays(currentDate, 1));
  
  const handleDateChange = (e) => {
    const newDate = parseISO(e.target.value);
    // Correct timezone offset issues if necessary
    setCurrentDate(new Date(newDate.getTime() + newDate.getTimezoneOffset() * 60000));
  };

  const openNewAppointment = (timeString) => {
    setSelectedSlotTime(timeString);
    setIsModalOpen(true);
  };

  // Generate slots for the grid (every 30 mins)
  const timeSlots = [];
  for (let h = startHour; h < endHour; h++) {
    timeSlots.push(`${h.toString().padStart(2, '0')}:00`);
    timeSlots.push(`${h.toString().padStart(2, '0')}:30`);
  }

  // Calculate position for an appointment block
  const getAppointmentStyle = (appt) => {
    const [hours, minutes] = appt.start_time.split(':').map(Number);
    const startInMinutes = (hours - startHour) * 60 + minutes;
    const top = startInMinutes * pxPerMinute;
    const height = appt.duration_minutes * pxPerMinute;
    
    return {
      top: `${top}px`,
      height: `${height}px`,
    };
  };

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
  };

  return (
    <div className="appointments-page">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2>Agenda do Salão</h2>
      </div>

      <div className="agenda-container">
        {/* SIDEBAR - Filtros */}
        <div className="agenda-sidebar">
          <div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-text-muted)', marginBottom: '10px' }}>
              <User size={18} /> Profissional
            </label>
            <select 
              className="form-control" 
              value={selectedProfessional} 
              onChange={(e) => setSelectedProfessional(e.target.value)}
            >
              <option value="">Selecione...</option>
              {professionals.map(p => (
                <option key={p.id} value={p.id}>{p.name} - {p.specialty || 'Geral'}</option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-text-muted)', marginBottom: '10px' }}>
              <CalendarIcon size={18} /> Data
            </label>
            <input 
              type="date" 
              className="form-control" 
              value={format(currentDate, 'yyyy-MM-dd')} 
              onChange={handleDateChange} 
            />
          </div>

          <button 
            className="btn-primary" 
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginTop: 'auto' }}
            onClick={() => openNewAppointment('08:00')}
          >
            <Plus size={20} /> Novo Agendamento
          </button>
        </div>

        {/* MAIN CALENDAR AREA */}
        <div className="agenda-main">
          <div className="calendar-header">
            <button onClick={handlePrevDay} className="btn-secondary" style={{ padding: '6px' }}><ChevronLeft size={24} /></button>
            <h3 style={{ textTransform: 'capitalize' }}>
              {format(currentDate, "EEEE, d 'de' MMMM", { locale: ptBR })}
            </h3>
            <button onClick={handleNextDay} className="btn-secondary" style={{ padding: '6px' }}><ChevronRight size={24} /></button>
          </div>

          <div className="calendar-grid">
            {timeSlots.map(time => (
              <div key={time} className="time-slot">
                <div className="time-label">{time}</div>
                <div className="slot-content">
                  <div 
                    className="slot-clickable-area" 
                    onClick={() => {
                      if (selectedProfessional) openNewAppointment(time);
                    }}
                  ></div>
                </div>
              </div>
            ))}

            {/* Render Appointments OVER the grid */}
            <div className="appointments-overlay">
              {appointments.map(appt => (
                <div 
                  key={appt.id} 
                  className={`appointment-block status-${appt.status}`}
                  style={getAppointmentStyle(appt)}
                >
                  <strong style={{ fontSize: '0.9rem' }}>{appt.client_name || `Cliente #${appt.client_id}`}</strong>
                  <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                    {appt.service_name} • {appt.start_time.substring(0,5)} - {appt.end_time.substring(0,5)}
                  </span>
                  <span style={{ fontSize: '0.8rem', marginTop: 'auto', fontWeight: 'bold' }}>
                    {formatCurrency(appt.value)}
                  </span>
                </div>
              ))}
            </div>
            
            {!selectedProfessional && (
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(255,255,255,0.8)', zIndex: 20, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <h3 style={{ color: 'var(--color-text-muted)' }}>Selecione um profissional para ver a agenda.</h3>
              </div>
            )}
          </div>
        </div>
      </div>

      <AppointmentModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        selectedDate={format(currentDate, 'yyyy-MM-dd')}
        selectedTime={selectedSlotTime}
        professionalId={selectedProfessional}
        onSave={fetchAppointments}
      />
    </div>
  );
}

export default Appointments;
