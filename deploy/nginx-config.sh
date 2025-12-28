#!/bin/bash

# Script de Configuração do Nginx para Track ERP
# Uso: bash nginx-config.sh SEU_IP_OU_DOMINIO

set -e

if [ -z "$1" ]; then
    echo "❌ Erro: Informe o IP ou domínio"
    echo "Uso: bash nginx-config.sh SEU_IP_OU_DOMINIO"
    exit 1
fi

DOMAIN=$1

echo "🌐 Configurando Nginx para: $DOMAIN"

# Criar configuração do Nginx
cat > /etc/nginx/sites-available/track-erp << EOF
server {
    listen 80;
    server_name $DOMAIN;

    # Logs
    access_log /var/log/nginx/track-erp-access.log;
    error_log /var/log/nginx/track-erp-error.log;

    # Proxy para o Node.js
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
        
        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # Aumentar tamanho máximo de upload
    client_max_body_size 10M;
}
EOF

# Ativar site
ln -sf /etc/nginx/sites-available/track-erp /etc/nginx/sites-enabled/

# Remover configuração padrão
rm -f /etc/nginx/sites-enabled/default

# Testar configuração
echo "🔍 Testando configuração do Nginx..."
nginx -t

# Reiniciar Nginx
echo "🔄 Reiniciando Nginx..."
systemctl restart nginx

echo ""
echo "✅ Nginx configurado com sucesso!"
echo ""
echo "🌐 Acesse seu ERP em: http://$DOMAIN"
echo ""
echo "📝 Para adicionar SSL (HTTPS), rode:"
echo "   bash /var/www/track_erp/deploy/ssl-setup.sh $DOMAIN"
echo ""
