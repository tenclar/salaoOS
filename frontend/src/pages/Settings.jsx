import React, { useState } from 'react';
import Professionals from './Professionals';
import Roles from './Roles';
import Services from './Services';
import Rooms from './Rooms';
import Products from './Products';

function Settings() {
  const [activeTab, setActiveTab] = useState('professionals');

  const tabs = [
    { id: 'professionals', label: 'Cadastro de Profissionais' },
    { id: 'roles', label: 'Cargos e Perfis' },
    { id: 'services', label: 'Serviços' },
    { id: 'products', label: 'Produtos' },
    { id: 'rooms', label: 'Salas' }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'professionals':
        return <Professionals />;
      case 'roles':
        return <Roles />;
      case 'services':
        return <Services />;
      case 'products':
        return <Products />;
      case 'rooms':
        return <Rooms />;
      default:
        return null;
    }
  };

  return (
    <div className="settings-page">
      <div style={{ marginBottom: '20px' }}>
        <h2>Configurações do Sistema</h2>
        <p style={{ color: 'var(--color-text-muted)' }}>Ajuste os parâmetros principais do salão.</p>
      </div>

      <div className="card" style={{ display: 'flex', gap: '30px', padding: 0, overflow: 'hidden' }}>
        
        {/* Sidebar das configurações */}
        <div style={{ width: '250px', backgroundColor: '#fafafa', borderRight: '1px solid var(--color-border)', display: 'flex', flexDirection: 'column' }}>
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: '16px 20px',
                textAlign: 'left',
                backgroundColor: activeTab === tab.id ? 'rgba(207, 174, 110, 0.1)' : 'transparent',
                color: activeTab === tab.id ? 'var(--color-gold)' : 'var(--color-black)',
                border: 'none',
                borderLeft: activeTab === tab.id ? '4px solid var(--color-gold)' : '4px solid transparent',
                borderBottom: '1px solid var(--color-border)',
                cursor: 'pointer',
                fontWeight: activeTab === tab.id ? '600' : '400',
                transition: 'all 0.2s ease',
                fontSize: '1rem'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Conteúdo principal das configurações */}
        <div style={{ flex: 1, padding: '30px' }}>
          {renderContent()}
        </div>

      </div>
    </div>
  );
}

export default Settings;
