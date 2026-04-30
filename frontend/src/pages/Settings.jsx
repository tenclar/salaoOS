import React, { useState } from 'react';
import Professionals from './Professionals';

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
        return (
          <div>
            <h3>Cargos e Perfis de Acesso</h3>
            <p>Defina cargos, permissões e acessos ao sistema.</p>
            <button className="btn-primary" style={{ marginTop: '10px' }}>+ Novo Cargo</button>
            <div style={{ marginTop: '20px', padding: '20px', border: '1px dashed #ccc', borderRadius: '8px' }}>
              <p style={{ color: 'var(--color-text-muted)' }}>Módulo de cargos e perfis em construção...</p>
            </div>
          </div>
        );
      case 'services':
        return (
          <div>
            <h3>Serviços Oferecidos</h3>
            <p>Cadastre e gerencie os serviços prestados (ex: Corte, Coloração, Manicure).</p>
            <button className="btn-primary" style={{ marginTop: '10px' }}>+ Novo Serviço</button>
            <div style={{ marginTop: '20px', padding: '20px', border: '1px dashed #ccc', borderRadius: '8px' }}>
              <p style={{ color: 'var(--color-text-muted)' }}>Módulo de serviços em construção...</p>
            </div>
          </div>
        );
      case 'products':
        return (
          <div>
            <h3>Produtos e Estoque</h3>
            <p>Gerencie produtos para venda ou uso interno.</p>
            <button className="btn-primary" style={{ marginTop: '10px' }}>+ Novo Produto</button>
            <div style={{ marginTop: '20px', padding: '20px', border: '1px dashed #ccc', borderRadius: '8px' }}>
              <p style={{ color: 'var(--color-text-muted)' }}>Módulo de produtos em construção...</p>
            </div>
          </div>
        );
      case 'rooms':
        return (
          <div>
            <h3>Salas e Espaços</h3>
            <p>Gerencie a disponibilidade de salas, macas e lavatórios.</p>
            <button className="btn-primary" style={{ marginTop: '10px' }}>+ Nova Sala</button>
            <div style={{ marginTop: '20px', padding: '20px', border: '1px dashed #ccc', borderRadius: '8px' }}>
              <p style={{ color: 'var(--color-text-muted)' }}>Módulo de salas em construção...</p>
            </div>
          </div>
        );
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
