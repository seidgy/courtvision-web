# CourtVision AI - Web 🏀

Frontend web para análise estatística da NBA com geração de Parlays utilizando Inteligência Artificial.

## 📋 Funcionalidades

### 🔐 Autenticação
- Tela de login com JWT
- Perfil de usuário
- Alteração de senha

### 📊 Dashboard
- Estatísticas principais (taxa de acerto, lucro, ROI)
- Jogos do dia
- Parlays recentes

### 🏀 Jogos
- Lista de jogos da NBA
- Filtros por data, status e time
- Detalhes do jogo com jogadores

### 📈 Parlays
- Geração de parlays com IA
- Análise detalhada de cada aposta
- Histórico de parlays
- Acompanhamento de resultados

### 👤 Perfil
- Informações pessoais
- Estatísticas do usuário
- Configurações da conta

### 🔧 Admin (para administradores)
- Gestão de usuários
- Visualização de todos os parlays
- Sincronização de dados

## 🛠️ Tecnologias

- **Nuxt 3** com **Vue 3**
- **TypeScript**
- **Tailwind CSS**
- **Nuxt UI** (componentes)
- **Pinia** (state management)
- **Chart.js** (gráficos)

## 🚀 Instalação

### Pré-requisitos
- Node.js 18+
- API CourtVision rodando (veja [courtvision_api](../courtvision_api/))

### 1. Clone o repositório
```bash
git clone https://github.com/seu-usuario/courtvision-web.git
cd courtvision-web
```

### 2. Instale as dependências
```bash
npm install
```

### 3. Configure as variáveis de ambiente
```bash
cp .env.example .env
# Edite o arquivo .env com suas configurações
```

### 4. Inicie o servidor de desenvolvimento
```bash
npm run dev
```

A aplicação estará disponível em `http://localhost:3000`

## ⚙️ Configuração

### Variáveis de Ambiente (.env)
```env
# API URL
NUXT_PUBLIC_API_BASE_URL=http://localhost:3001/api

# App
NODE_ENV=development
```

## 📖 Scripts Disponíveis

```bash
npm run dev          # Inicia em modo desenvolvimento
npm run build        # Compila para produção
npm run generate     # Gera site estático
npm run preview      # Preview da build
```

## 📁 Estrutura de Pastas

```
courtvision_web/
├── assets/           # Assets (CSS, imagens)
├── components/       # Componentes Vue
├── composables/      # Composables
├── layouts/          # Layouts da aplicação
├── middleware/       # Middleware de autenticação
├── pages/            # Páginas da aplicação
│   ├── admin/        # Painel administrativo
│   ├── games/        # Jogos
│   ├── parlays/      # Parlays
│   ├── dashboard.vue # Dashboard
│   ├── login.vue     # Login
│   └── profile.vue   # Perfil
├── plugins/          # Plugins Nuxt
├── stores/           # Pinia stores
├── types/            # Tipos TypeScript
└── utils/            # Utilitários
```

## 🎨 Design System

A aplicação utiliza **Nuxt UI** como biblioteca de componentes, com as seguintes cores principais:

- **Primária:** Orange (#f97316)
- **Secundária:** Blue (#3b82f6)
- **Sucesso:** Green (#22c55e)
- **Erro:** Red (#ef4444)
- **Aviso:** Yellow (#eab308)

## 🐳 Docker

```bash
# Build da imagem
docker build -t courtvision-web .

# Executar container
docker run -p 3000:3000 --env-file .env courtvision-web
```

## 🔗 Integração com API

O frontend se comunica com a API através de um plugin Axios configurado em `plugins/api.ts`. Todas as requisições autenticadas incluem o token JWT automaticamente.

### Stores (Pinia)

- **`auth.ts`** - Gerenciamento de autenticação
- **`games.ts`** - Dados de jogos, times e jogadores
- **`parlays.ts`** - Parlays e análises
- **`users.ts`** - Gestão de usuários (admin)

## 📄 Licença

Este projeto está licenciado sob a licença MIT.
