#!/bin/bash

# Script de Instalação do Track ERP na VPS Ubuntu
# Execute como root ou com sudo

set -e

echo "🚀 Instalando Track ERP na VPS..."

# Atualizar sistema
echo "📦 Atualizando sistema..."
apt update && apt upgrade -y

# Instalar dependências básicas
echo "📦 Instalando dependências..."
apt install -y curl git nginx postgresql postgresql-contrib

# Instalar Node.js 22.x
echo "📦 Instalando Node.js 22..."
curl -fsSL https://deb.nodesource.com/setup_22.x | bash -
apt install -y nodejs

# Instalar pnpm
echo "📦 Instalando pnpm..."
npm install -g pnpm pm2

# Configurar PostgreSQL
echo "🗄️ Configurando PostgreSQL..."
sudo -u postgres psql -c "CREATE DATABASE track_erp;" || echo "Database já existe"
sudo -u postgres psql -c "CREATE USER track_erp_user WITH PASSWORD 'track_erp_password_2024';" || echo "User já existe"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE track_erp TO track_erp_user;"
sudo -u postgres psql -c "ALTER DATABASE track_erp OWNER TO track_erp_user;"

# Criar diretório do projeto
echo "📁 Criando diretório do projeto..."
mkdir -p /var/www/track_erp
cd /var/www/track_erp

# Clonar repositório
echo "📥 Clonando repositório..."
if [ -d ".git" ]; then
    echo "Repositório já existe, fazendo pull..."
    git pull origin main
else
    git clone https://github.com/othfxphead/track_erp.git .
fi

# Instalar dependências
echo "📦 Instalando dependências do projeto..."
pnpm install

# Criar arquivo .env
echo "⚙️ Criando arquivo .env..."
cat > .env << 'EOF'
NODE_ENV=production
DATABASE_URL=postgresql://track_erp_user:track_erp_password_2024@localhost:5432/track_erp
SESSION_SECRET=$(openssl rand -base64 32)
PORT=3000

# OpenAI (necessário para IA)
OPENAI_API_KEY=sua_chave_openai_aqui

# Focus NFe (necessário para emissão de notas)
FOCUS_NFE_TOKEN=seu_token_focus_nfe_aqui

# AWS S3 (opcional, para upload de arquivos)
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_REGION=us-east-1
AWS_S3_BUCKET=
EOF

echo "✅ Arquivo .env criado! EDITE com suas chaves reais:"
echo "   nano /var/www/track_erp/.env"

# Build do projeto
echo "🔨 Fazendo build do projeto..."
pnpm build

# Configurar PM2
echo "⚙️ Configurando PM2..."
pm2 delete track-erp 2>/dev/null || true
pm2 start pnpm --name "track-erp" -- start
pm2 save
pm2 startup systemd -u root --hp /root

echo ""
echo "✅ Instalação concluída!"
echo ""
echo "📝 Próximos passos:"
echo "1. Edite o arquivo .env com suas chaves:"
echo "   nano /var/www/track_erp/.env"
echo ""
echo "2. Rode o script de configuração do Nginx:"
echo "   bash /var/www/track_erp/deploy/nginx-config.sh SEU_IP_AQUI"
echo ""
echo "3. Reinicie o PM2:"
echo "   pm2 restart track-erp"
echo ""
