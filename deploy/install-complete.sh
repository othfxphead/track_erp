#!/bin/bash

# Script de Instalação Completa do TRACK ERP
# Versão: 2.0 - Definitiva
# Autor: Manus AI

set -e  # Para em caso de erro

echo "========================================="
echo "  INSTALAÇÃO COMPLETA DO TRACK ERP"
echo "========================================="
echo ""

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Função para print colorido
print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

print_info() {
    echo -e "${YELLOW}→ $1${NC}"
}

# Verificar se está rodando como root
if [ "$EUID" -ne 0 ]; then 
    print_error "Por favor, execute como root (sudo bash install-complete.sh)"
    exit 1
fi

# Pedir IP da VPS
read -p "Digite o IP da sua VPS: " VPS_IP
if [ -z "$VPS_IP" ]; then
    print_error "IP não pode ser vazio!"
    exit 1
fi

print_info "Iniciando instalação para IP: $VPS_IP"
echo ""

# 1. Atualizar sistema
print_info "Atualizando sistema..."
apt update -qq
apt upgrade -y -qq
print_success "Sistema atualizado"

# 2. Instalar dependências básicas
print_info "Instalando dependências básicas..."
apt install -y -qq curl wget git build-essential
print_success "Dependências instaladas"

# 3. Instalar Node.js 22.x
print_info "Instalando Node.js 22.x..."
if ! command -v node &> /dev/null; then
    curl -fsSL https://deb.nodesource.com/setup_22.x | bash -
    apt install -y nodejs
fi
print_success "Node.js $(node -v) instalado"

# 4. Instalar pnpm
print_info "Instalando pnpm..."
if ! command -v pnpm &> /dev/null; then
    npm install -g pnpm
fi
print_success "pnpm $(pnpm -v) instalado"

# 5. Instalar PM2
print_info "Instalando PM2..."
if ! command -v pm2 &> /dev/null; then
    npm install -g pm2
    pm2 startup systemd -u root --hp /root
fi
print_success "PM2 instalado"

# 6. Instalar PostgreSQL
print_info "Instalando PostgreSQL..."
if ! command -v psql &> /dev/null; then
    apt install -y postgresql postgresql-contrib
    systemctl start postgresql
    systemctl enable postgresql
fi
print_success "PostgreSQL instalado"

# 7. Criar banco de dados
print_info "Configurando banco de dados..."
sudo -u postgres psql -c "DROP DATABASE IF EXISTS track_erp;" 2>/dev/null || true
sudo -u postgres psql -c "DROP USER IF EXISTS track_user;" 2>/dev/null || true
sudo -u postgres psql -c "CREATE USER track_user WITH PASSWORD 'track_password_2024';"
sudo -u postgres psql -c "CREATE DATABASE track_erp OWNER track_user;"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE track_erp TO track_user;"
print_success "Banco de dados criado"

# 8. Instalar Nginx
print_info "Instalando Nginx..."
if ! command -v nginx &> /dev/null; then
    apt install -y nginx
    systemctl start nginx
    systemctl enable nginx
fi
print_success "Nginx instalado"

# 9. Clonar repositório
print_info "Clonando repositório..."
rm -rf /var/www/track_erp
mkdir -p /var/www
cd /var/www
git clone https://github.com/othfxphead/track_erp.git
cd track_erp
print_success "Repositório clonado"

# 10. Criar arquivo .env
print_info "Criando arquivo .env..."
cat > .env << EOF
# Database
DATABASE_URL=postgresql://track_user:track_password_2024@localhost:5432/track_erp

# Server
PORT=3000
NODE_ENV=production

# JWT
JWT_SECRET=$(openssl rand -hex 32)

# OpenAI (IMPORTANTE: Adicione sua chave real depois)
OPENAI_API_KEY=sk-proj-COLOQUE_SUA_CHAVE_AQUI

# Focus NFe (IMPORTANTE: Adicione seu token real depois)
FOCUS_NFE_TOKEN=COLOQUE_SEU_TOKEN_AQUI
FOCUS_NFE_AMBIENTE=homologacao

# Frontend
VITE_API_URL=http://${VPS_IP}/api
EOF
print_success "Arquivo .env criado"

# 11. Instalar dependências
print_info "Instalando dependências do projeto (pode demorar 2-3 minutos)..."
pnpm install --prod=false
print_success "Dependências instaladas"

# 12. Executar migrations do banco
print_info "Executando migrations do banco..."
pnpm db:push || print_error "Erro ao executar migrations (pode ser normal se já existirem)"

# 13. Fazer build do projeto
print_info "Fazendo build do projeto (pode demorar 1-2 minutos)..."
pnpm build
print_success "Build concluído"

# 14. Configurar Nginx
print_info "Configurando Nginx..."
cat > /etc/nginx/sites-available/track-erp << 'NGINX_EOF'
server {
    listen 80;
    server_name VPS_IP_PLACEHOLDER;

    # Diretório dos arquivos estáticos
    root /var/www/track_erp/dist/public;
    index index.html;

    # Logs
    access_log /var/log/nginx/track-erp-access.log;
    error_log /var/log/nginx/track-erp-error.log;

    # Servir arquivos estáticos diretamente
    location /assets/ {
        try_files $uri =404;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # API e tRPC vão para o Node.js
    location /api/ {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # WebSocket para tRPC
    location /trpc/ {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # Todas as outras rotas servem o index.html (SPA)
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Aumentar tamanho máximo de upload
    client_max_body_size 10M;
}
NGINX_EOF

# Substituir placeholder pelo IP real
sed -i "s/VPS_IP_PLACEHOLDER/$VPS_IP/g" /etc/nginx/sites-available/track-erp

# Ativar site
ln -sf /etc/nginx/sites-available/track-erp /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default

# Testar configuração
nginx -t
systemctl restart nginx
print_success "Nginx configurado"

# 15. Iniciar aplicação com PM2
print_info "Iniciando aplicação..."
cd /var/www/track_erp
pm2 delete track-erp 2>/dev/null || true
pm2 start dist/index.js --name track-erp
pm2 save
print_success "Aplicação iniciada"

# 16. Configurar firewall (se UFW estiver instalado)
if command -v ufw &> /dev/null; then
    print_info "Configurando firewall..."
    ufw allow 80/tcp
    ufw allow 443/tcp
    ufw allow 22/tcp
    print_success "Firewall configurado"
fi

echo ""
echo "========================================="
echo "  ✓ INSTALAÇÃO CONCLUÍDA COM SUCESSO!"
echo "========================================="
echo ""
echo "📊 Informações do Sistema:"
echo "  • URL de Acesso: http://$VPS_IP"
echo "  • Backend: http://localhost:3000"
echo "  • Banco de Dados: PostgreSQL (localhost:5432)"
echo "  • Logs: pm2 logs track-erp"
echo ""
echo "⚠️  IMPORTANTE - Configure suas chaves:"
echo "  1. Edite o arquivo: nano /var/www/track_erp/.env"
echo "  2. Adicione sua OPENAI_API_KEY"
echo "  3. Adicione seu FOCUS_NFE_TOKEN"
echo "  4. Reinicie: pm2 restart track-erp"
echo ""
echo "🔧 Comandos Úteis:"
echo "  • Ver status: pm2 status"
echo "  • Ver logs: pm2 logs track-erp"
echo "  • Reiniciar: pm2 restart track-erp"
echo "  • Atualizar código: cd /var/www/track_erp && git pull && pnpm build && pm2 restart track-erp"
echo ""
echo "🎉 Acesse agora: http://$VPS_IP"
echo ""
