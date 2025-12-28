#!/bin/bash

# Script de Configuração SSL com Let's Encrypt
# Uso: bash ssl-setup.sh SEU_DOMINIO

set -e

if [ -z "$1" ]; then
    echo "❌ Erro: Informe o domínio"
    echo "Uso: bash ssl-setup.sh SEU_DOMINIO"
    echo "Exemplo: bash ssl-setup.sh erp.seudominio.com"
    exit 1
fi

DOMAIN=$1

echo "🔒 Configurando SSL para: $DOMAIN"

# Instalar Certbot
echo "📦 Instalando Certbot..."
apt install -y certbot python3-certbot-nginx

# Obter certificado
echo "📜 Obtendo certificado SSL..."
certbot --nginx -d $DOMAIN --non-interactive --agree-tos --email admin@$DOMAIN

# Configurar renovação automática
echo "⏰ Configurando renovação automática..."
systemctl enable certbot.timer
systemctl start certbot.timer

echo ""
echo "✅ SSL configurado com sucesso!"
echo ""
echo "🌐 Acesse seu ERP em: https://$DOMAIN"
echo ""
echo "📝 O certificado será renovado automaticamente a cada 90 dias"
echo ""
