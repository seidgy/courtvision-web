#!/bin/bash

# CourtVision AI - Web Setup Script

echo "🏀 CourtVision AI - Web Setup"
echo "==============================="
echo ""

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Verificar Node.js
echo -e "${BLUE}Verificando Node.js...${NC}"
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js não encontrado. Por favor, instale o Node.js 18+${NC}"
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo -e "${RED}❌ Node.js versão $NODE_VERSION encontrada. Requerido: 18+${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Node.js $(node -v) encontrado${NC}"

# Criar .env se não existir
if [ ! -f .env ]; then
    echo -e "${YELLOW}Criando arquivo .env...${NC}"
    cp .env.example .env
    echo -e "${GREEN}✅ .env criado. Por favor, edite com suas configurações.${NC}"
else
    echo -e "${GREEN}✅ .env já existe${NC}"
fi

# Instalar dependências
echo -e "${BLUE}Instalando dependências...${NC}"
npm install

echo ""
echo -e "${GREEN}✅ Setup do Web concluído!${NC}"
echo ""
echo "Próximos passos:"
echo "================"
echo ""
echo "1. Configure o arquivo .env com a URL da API"
echo "   NUXT_PUBLIC_API_BASE_URL=http://localhost:3001/api"
echo ""
echo "2. Certifique-se de que a API está rodando"
echo ""
echo "3. Inicie o servidor de desenvolvimento:"
echo "   npm run dev"
echo ""
echo "A aplicação estará disponível em http://localhost:3000"
echo ""
