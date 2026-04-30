# Manual de Implantação - Digital Ocean

Este guia descreve como implantar a aplicação CourtVision AI em um servidor Ubuntu na Digital Ocean (ou qualquer VPS).

## Sumário

1. [Infraestrutura Recomendada](#infraestrutura-recomendada)
2. [Preparação do Servidor](#preparação-do-servidor)
3. [Banco de Dados PostgreSQL](#banco-de-dados-postgresql)
4. [Backend (API)](#backend-api)
5. [Frontend (Nuxt)](#frontend-nuxt)
6. [Nginx (Reverse Proxy)](#nginx-reverse-proxy)
7. [SSL com Let's Encrypt](#ssl-com-lets-encrypt)
8. [PM2 (Gerenciamento de Processos)](#pm2-gerenciamento-de-processos)
9. [Cron Job (Sync Diário)](#cron-job-sync-diário)
10. [Troubleshooting](#troubleshooting)

---

## Infraestrutura Recomendada

| Componente | Especificação Mínima |
|------------|---------------------|
| Droplet | 2 vCPUs / 4GB RAM / 80GB SSD |
| SO | Ubuntu 22.04 LTS |
| Banco | PostgreSQL 16 |
| Node.js | v22+ |
| Python | 3.10+ (para scripts de sync) |

---

## Preparação do Servidor

### 1. Acesse o servidor

```bash
ssh root@SEU_IP_DIGITAL_OCEAN
```

### 2. Atualize o sistema

```bash
apt update && apt upgrade -y
```

### 3. Instale dependências base

```bash
# Node.js (via NodeSource)
curl -fsSL https://deb.nodesource.com/setup_22.x | bash -
apt install -y nodejs

# Ferramentas de build
apt install -y build-essential python3-pip python3-venv git curl wget unzip

# PM2 (global)
npm install -g pm2

# Nginx
apt install -y nginx

# Certbot (SSL)
apt install -y certbot python3-certbot-nginx
```

### 4. Verifique instalações

```bash
node -v    # v22.x
npm -v     # 10.x
python3 --version  # 3.10+
git --version
```

---

## Banco de Dados PostgreSQL

### 1. Instale o PostgreSQL

```bash
# Adicione o repositório oficial
sudo sh -c 'echo "deb https://apt.postgresql.org/pub/repos/apt $(lsb_release -cs)-pgdg main" > /etc/apt/sources.list.d/pgdg.list'
wget --quiet -O - https://www.postgresql.org/media/keys/ACCC4CF8.asc | sudo apt-key add -
sudo apt update

# Instale
sudo apt install -y postgresql-16 postgresql-contrib

# Inicie e habilite
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

### 2. Crie o banco e usuário

```bash
sudo -u postgres psql
```

```sql
CREATE DATABASE courtvision;
CREATE USER courtvision WITH ENCRYPTED PASSWORD 'SUA_SENHA_FORTE_AQUI';
GRANT ALL PRIVILEGES ON DATABASE courtvision TO courtvision;
ALTER DATABASE courtvision OWNER TO courtvision;
\q
```

### 3. Configure acesso remoto (opcional, apenas para conexão externa)

```bash
sudo nano /etc/postgresql/16/main/postgresql.conf
```

Descomente e altere:
```
listen_addresses = '*'
```

```bash
sudo nano /etc/postgresql/16/main/pg_hba.conf
```

Adicione no final:
```
host    courtvision    courtvision    0.0.0.0/0    scram-sha-256
```

```bash
sudo systemctl restart postgresql
```

---

## Backend (API)

### 1. Clone o repositório

```bash
cd /opt
mkdir courtvision
cd courtvision
git clone https://github.com/seidgy/courtvision-api.git api
cd api
```

### 2. Configure variáveis de ambiente

```bash
cp .env.example .env
nano .env
```

Edite o `.env`:
```env
NODE_ENV=production
PORT=3001

# Database
DATABASE_URL="postgresql://courtvision:SUA_SENHA_FORTE_AQUI@localhost:5432/courtvision"

# JWT
JWT_SECRET="SUA_CHAVE_JWT_ALEATORIA_MINIMO_32_CARACTERES"
JWT_EXPIRES_IN="7d"

# Kimi AI (opcional - sem isso usa fallback estatístico)
KIMI_API_KEY=""
KIMI_BASE_URL="https://api.moonshot.cn/v1"
KIMI_MODEL="moonshot-v1-8k"
KIMI_FALLBACK_MODE=true

# Frontend URL (para CORS)
FRONTEND_URL="https://seudominio.com"
```

Gere uma chave JWT segura:
```bash
openssl rand -base64 32
```

### 3. Instale dependências e build

```bash
npm install

# Gere o cliente Prisma
npx prisma generate

# Execute as migrações
npx prisma migrate deploy

# Compile TypeScript
npm run build
```

### 4. Teste a API

```bash
node dist/server.js
```

Pressione `Ctrl+C` para parar após verificar que iniciou corretamente.

### 5. Configure o PM2

```bash
pm2 start dist/server.js --name "courtvision-api" --env production
pm2 save
pm2 startup systemd
```

Execute o comando que o `pm2 startup` sugerir (geralmente algo como):
```bash
sudo env PATH=$PATH:/usr/bin pm2 startup systemd -u root --hp /root
```

---

## Frontend (Nuxt)

### 1. Clone o repositório

```bash
cd /opt/courtvision
git clone https://github.com/seidgy/courtvision-web.git web
cd web
```

### 2. Configure variáveis de ambiente

```bash
cp .env.example .env
nano .env
```

```env
NUXT_PUBLIC_API_BASE_URL=https://api.seudominio.com/api
```

### 3. Instale e build

```bash
npm install
npm run build
```

O build gerará a pasta `.output/` com os arquivos estáticos e o servidor Nitro.

### 4. Configure o PM2

```bash
pm2 start .output/server/index.mjs --name "courtvision-web"
pm2 save
```

---

## Nginx (Reverse Proxy)

### 1. API (Backend)

```bash
nano /etc/nginx/sites-available/api.seudominio.com
```

```nginx
server {
    listen 80;
    server_name api.seudominio.com;

    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### 2. Web (Frontend)

```bash
nano /etc/nginx/sites-available/seudominio.com
```

```nginx
server {
    listen 80;
    server_name seudominio.com www.seudominio.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### 3. Ative os sites

```bash
ln -s /etc/nginx/sites-available/api.seudominio.com /etc/nginx/sites-enabled/
ln -s /etc/nginx/sites-available/seudominio.com /etc/nginx/sites-enabled/
rm /etc/nginx/sites-enabled/default  # remove o default
nginx -t
systemctl restart nginx
```

---

## SSL com Let's Encrypt

```bash
certbot --nginx -d seudominio.com -d www.seudominio.com -d api.seudominio.com
```

Siga as instruções interativas. O Certbot configurará automaticamente o SSL no Nginx.

**Renovação automática** (o Certbot já configura via cron, mas verifique):
```bash
certbot renew --dry-run
```

---

## PM2 (Gerenciamento de Processos)

### Comandos úteis

```bash
# Listar processos
pm2 status

# Logs
pm2 logs courtvision-api
pm2 logs courtvision-web

# Restart
pm2 restart courtvision-api
pm2 restart courtvision-web

# Monitoramento em tempo real
pm2 monit

# Atualizar após deploy
pm2 reload courtvision-api
pm2 reload courtvision-web
```

---

## Cron Job (Sync Diário)

### 1. Instale dependências Python

```bash
pip3 install requests pdfplumber psycopg2-binary nba-api
```

### 2. Configure o cron

```bash
crontab -e
```

Adicione:
```cron
# CourtVision - Sync diário às 06:00 UTC
0 6 * * * cd /opt/courtvision/api && /usr/bin/python3 scripts/daily_sync.py >> /var/log/courtvision-sync.log 2>&1
```

### 3. Crie o diretório de logs

```bash
mkdir -p /var/log
touch /var/log/courtvision-sync.log
```

---

## Deploy Automatizado (Script)

Crie um script de deploy no servidor:

```bash
nano /opt/courtvision/deploy.sh
```

```bash
#!/bin/bash
set -e

echo "===== DEPLOY COURTVISION ====="

# Backend
echo "[1/4] Atualizando API..."
cd /opt/courtvision/api
git pull origin main
npm install
npx prisma generate
npx prisma migrate deploy
npm run build
pm2 reload courtvision-api

# Frontend
echo "[2/4] Atualizando Web..."
cd /opt/courtvision/web
git pull origin main
npm install
npm run build
pm2 reload courtvision-web

echo "[3/4] Verificando status..."
pm2 status

echo "===== DEPLOY CONCLUÍDO ====="
```

```bash
chmod +x /opt/courtvision/deploy.sh
```

Execute quando houver atualizações:
```bash
/opt/courtvision/deploy.sh
```

---

## Variáveis de Ambiente (Resumo)

### Backend (`/opt/courtvision/api/.env`)

```env
NODE_ENV=production
PORT=3001
DATABASE_URL="postgresql://courtvision:SENHA@localhost:5432/courtvision"
JWT_SECRET="CHAVE_JWT_32_CARACTERES"
JWT_EXPIRES_IN="7d"
KIMI_API_KEY=""
KIMI_FALLBACK_MODE=true
FRONTEND_URL="https://seudominio.com"
```

### Frontend (`/opt/courtvision/web/.env`)

```env
NUXT_PUBLIC_API_BASE_URL=https://api.seudominio.com/api
```

---

## Troubleshooting

### Erro: "Cannot find module '@prisma/client'"
```bash
cd /opt/courtvision/api
npx prisma generate
npm run build
pm2 restart courtvision-api
```

### Erro: "Connection refused" no banco
```bash
sudo systemctl status postgresql
sudo -u postgres psql -c "\l"  # lista bancos
```

### Erro: 502 Bad Gateway
```bash
pm2 status  # verifique se API está rodando
pm2 logs courtvision-api
nginx -t
systemctl status nginx
```

### Reset do banco (cuidado!)
```bash
cd /opt/courtvision/api
npx prisma migrate reset --force
npx prisma db seed  # se houver seed
```

### Liberar porta ocupada
```bash
sudo lsof -i :3001
sudo kill -9 <PID>
```

---

## Checklist Pós-Deploy

- [ ] API responde em `https://api.seudominio.com/health` (ou rota válida)
- [ ] Frontend carrega em `https://seudominio.com`
- [ ] Login funciona
- [ ] Geração de parlay funciona
- [ ] SSL válido (cadeado verde)
- [ ] PM2 reinicia automaticamente após reboot
- [ ] Cron job configurado
- [ ] Logs rotativos configurados (logrotate)
