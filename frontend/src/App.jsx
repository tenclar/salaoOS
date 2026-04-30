import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

// Placeholder Components
import Dashboard from './pages/Dashboard';
import Clients from './pages/Clients';
import Professionals from './pages/Professionals';
import Appointments from './pages/Appointments';
import Settings from './pages/Settings';

function App() {
  return (
    <Router>
      <div className="app-container">
        <aside className="sidebar">
          <div className="logo-area">
            <h2>Beauty Center</h2>
          </div>
          <nav className="nav-menu">
            <Link to="/" className="nav-link">Dashboard</Link>
            <Link to="/appointments" className="nav-link">Agenda</Link>
            <Link to="/clients" className="nav-link">Clientes</Link>
            <Link to="/settings" className="nav-link">Configurações</Link>
          </nav>
        </aside>
        
        <main className="main-content">
          <header className="top-header">
            <div className="header-title">
              <h1>Sistema de Gestão</h1>
            </div>
          </header>
          
          <div className="page-content">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/appointments" element={<Appointments />} />
              <Route path="/clients" element={<Clients />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </div>
        </main>
      </div>
    </Router>
  );
}

export default App;
