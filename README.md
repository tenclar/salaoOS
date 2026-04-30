# Beauty Center – Sistema de Gestão de Salão de Beleza

## Visão geral
Este repositório contém a **estrutura completa** de um sistema web para gerenciamento de salão de beleza, chamado **Beauty Center**. O objetivo inicial (MVP) inclui os módulos essenciais:

- Agenda
- Cadastro de Clientes
- Cadastro de Profissionais
- Serviços
- Produtos & Estoque
- Caixa / Vendas
- Financeiro (contas a pagar/receber)
- Pacotes de Serviços
- Integração básica com WhatsApp (templates e endpoint de disparo)

A aplicação está dividida em **frontend** (React + Vite) e **backend** (Node + Express) e utiliza **MySQL** como banco de dados, conectado ao localhost com usuário `root` e senha `root`, banco `salaobc`.

## Tecnologias
- **Frontend**: React, Vite, JavaScript (ou TypeScript), CSS vanilla, Google Font *Outfit*.
- **Backend**: Node.js, Express, JWT, MySQL (via Knex).
- **Banco de dados**: MySQL – servidor local (`localhost`), usuário `root`, senha `root`, banco `salaobc`.
- **Gerenciamento de dependências**: npm (ou yarn).

## Estrutura de pastas
```
beauty-center/
├─ backend/               # API RESTful
│   ├─ src/
│   │   ├─ config/       # DB & JWT config
│   │   ├─ controllers/  # Lógica de cada recurso
│   │   ├─ middlewares/  # Autenticação, erros
│   │   ├─ models/       # Definições de tabelas (Knex)
│   │   ├─ routes/       # Rotas por módulo
│   │   └─ index.js      # Entrada do servidor
│   ├─ migrations/        # Scripts de criação de tabelas
│   ├─ seeds/             # Dados de exemplo
│   └─ package.json
│
├─ frontend/              # SPA React
│   ├─ public/
│   │   └─ index.html
│   ├─ src/
│   │   ├─ assets/       # Ícones, imagens
│   │   ├─ components/   # UI reutilizável (cards, tabelas…)
│   │   ├─ pages/        # Telas principais
│   │   ├─ routes/       # React‑Router
│   │   ├─ services/     # Chamadas à API (axios)
│   │   └─ main.jsx
│   ├─ vite.config.js
│   └─ package.json
│
├─ db/                     # Arquivo SQLite e migrations
│   └─ beauty_center.db
│
├─ docs/                  # Documentação
│   ├─ DESIGN.md          # Guia de cores, tipografia e layout
│   └─ API.md             # Endpoints da API
│
├─ .gitignore
└─ README.md               # Este documento
```

## Primeiros passos
1. **Instalar dependências**
   ```bash
   cd backend && npm install
   cd ../frontend && npm install
   ```
2. **Criar banco de dados** (executar migrações)
   ```bash
   cd backend
   npx knex migrate:latest
   ```
3. **Rodar a aplicação**
   - Backend: `npm run dev` (servidor na porta 4000)
   - Frontend: `npm run dev` (Vite na porta 5173)
4. Acesse `http://localhost:5173` no navegador.

## Contribuição
Sinta‑se à vontade para abrir **issues** e **pull requests**. Para alterações de design, siga o guia em `docs/DESIGN.md`.

---
*Esta estrutura foi gerada automaticamente para iniciar o desenvolvimento do Beauty Center.*
