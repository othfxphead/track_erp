#!/bin/bash

# Script de Atualização do Track ERP
# Execute sempre que fizer push no GitHub

set -e

echo "🔄 Atualizando Track ERP..."

cd /var/www/track_erp

# Fazer backup do .env
cp .env .env.backup

# Atualizar código
echo "📥 Baixando atualizações do GitHub..."
git pull origin main

# Restaurar .env
mv .env.backup .env

# Instalar novas dependências
echo "📦 Instalando dependências..."
pnpm install

# Fazer build
echo "🔨 Fazendo build..."
pnpm build

# Reiniciar aplicação
echo "🔄 Reiniciando aplicação..."
pm2 restart track-erp

echo ""
echo "✅ Atualização concluída!"
echo ""
echo "📊 Status da aplicação:"
pm2 status
echo ""
echo "📝 Para ver os logs:"
echo "   pm2 logs track-erp"
echo ""
