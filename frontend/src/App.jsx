import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

// Placeholder Components
import Dashboard from './pages/Dashboard';
import Clients from './pages/Clients';
import ClientForm from './pages/ClientForm';
import Professionals from './pages/Professionals';
import Appointments from './pages/Appointments';
import Settings from './pages/Settings';
import Finance from './pages/Finance';
import Orders from './pages/Orders';
import CashRegister from './pages/CashRegister';
import ProfessionalPayments from './pages/ProfessionalPayments';


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
            <Link to="/orders" className="nav-link">Comandas</Link>
            <Link to="/cash-register" className="nav-link">Caixa</Link>
            
            <div className="nav-group">
              <div className="nav-link nav-group-title">Financeiro</div>
              <div className="nav-sub-menu">
                <Link to="/finance/receivable" className="nav-sub-link">Contas a Receber</Link>
                <Link to="/finance/payable" className="nav-sub-link">Contas a Pagar</Link>
                <Link to="/finance/professional-payments" className="nav-sub-link">Pagto. Profissionais</Link>
                <Link to="/finance" className="nav-sub-link">Geral</Link>

              </div>
            </div>

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
              <Route path="/clients/new" element={<ClientForm />} />
              <Route path="/clients/:id/edit" element={<ClientForm />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/cash-register" element={<CashRegister />} />
              <Route path="/finance" element={<Finance />} />
              <Route path="/finance/receivable" element={<Finance filterType="receita" />} />
              <Route path="/finance/payable" element={<Finance filterType="despesa" />} />
              <Route path="/finance/professional-payments" element={<ProfessionalPayments />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </div>
        </main>
      </div>
    </Router>
  );
}

export default App;
