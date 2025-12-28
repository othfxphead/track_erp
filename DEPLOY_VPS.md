# 🚀 Guia de Deploy do Track ERP na VPS Hostinger

Este guia contém todos os passos para colocar seu ERP no ar na VPS Hostinger Ubuntu.

---

## 📋 Pré-requisitos

- VPS Hostinger com Ubuntu
- Acesso SSH (root ou sudo)
- IP da VPS (ou domínio apontado)

---

## 🎯 Instalação Rápida (5 minutos)

### **Passo 1: Conectar na VPS via SSH**

```bash
ssh root@SEU_IP_VPS
```

### **Passo 2: Baixar e executar script de instalação**

```bash
# Criar diretório temporário
mkdir -p /tmp/track_erp_install
cd /tmp/track_erp_install

# Baixar script de instalação
curl -O https://raw.githubusercontent.com/othfxphead/track_erp/main/deploy/install.sh

# Executar instalação
bash install.sh
```

**O script vai instalar:**
- ✅ Node.js 22
- ✅ PostgreSQL
- ✅ Nginx
- ✅ PM2
- ✅ Clonar o projeto
- ✅ Criar banco de dados
- ✅ Fazer build

---

### **Passo 3: Configurar variáveis de ambiente**

Após a instalação, edite o arquivo `.env`:

```bash
nano /var/www/track_erp/.env
```

**Edite estas linhas importantes:**

```env
# OpenAI (OBRIGATÓRIO para IA funcionar)
OPENAI_API_KEY=sk-proj-XXXXXXXX

# Focus NFe (OBRIGATÓRIO para emissão de notas)
FOCUS_NFE_TOKEN=seu_token_aqui
```

**Salve:** `Ctrl + O`, `Enter`, `Ctrl + X`

---

### **Passo 4: Configurar Nginx**

```bash
cd /var/www/track_erp/deploy
bash nginx-config.sh SEU_IP_VPS
```

**Exemplo:**
```bash
bash nginx-config.sh 45.123.45.67
```

---

### **Passo 5: Reiniciar aplicação**

```bash
pm2 restart track-erp
```

---

## 🎉 Pronto! Acesse seu ERP

Abra no navegador:

```
http://SEU_IP_VPS
```

---

## 🔒 Adicionar SSL (HTTPS) - Opcional

Se você tem um **domínio** apontado para a VPS:

```bash
cd /var/www/track_erp/deploy
bash ssl-setup.sh seu-dominio.com
```

Depois acesse:
```
https://seu-dominio.com
```

---

## 🔄 Atualizar o Sistema

Sempre que fizer alterações no código e der push no GitHub:

```bash
cd /var/www/track_erp/deploy
bash update.sh
```

---

## 📊 Comandos Úteis

### Ver status da aplicação
```bash
pm2 status
```

### Ver logs em tempo real
```bash
pm2 logs track-erp
```

### Reiniciar aplicação
```bash
pm2 restart track-erp
```

### Parar aplicação
```bash
pm2 stop track-erp
```

### Ver uso de recursos
```bash
pm2 monit
```

---

## 🗄️ Banco de Dados

### Acessar PostgreSQL
```bash
sudo -u postgres psql track_erp
```

### Fazer backup do banco
```bash
sudo -u postgres pg_dump track_erp > backup_$(date +%Y%m%d).sql
```

### Restaurar backup
```bash
sudo -u postgres psql track_erp < backup_20241228.sql
```

---

## 🔧 Solução de Problemas

### Aplicação não inicia

```bash
# Ver logs de erro
pm2 logs track-erp --err

# Verificar se o banco está rodando
sudo systemctl status postgresql

# Verificar se a porta 3000 está livre
netstat -tulpn | grep 3000
```

### Nginx não funciona

```bash
# Testar configuração
nginx -t

# Ver logs do Nginx
tail -f /var/log/nginx/track-erp-error.log

# Reiniciar Nginx
systemctl restart nginx
```

### Banco de dados não conecta

```bash
# Verificar se PostgreSQL está rodando
sudo systemctl status postgresql

# Reiniciar PostgreSQL
sudo systemctl restart postgresql

# Verificar conexão
sudo -u postgres psql -c "\l"
```

---

## 🔐 Segurança

### Firewall (UFW)

```bash
# Ativar firewall
ufw enable

# Permitir SSH
ufw allow 22

# Permitir HTTP
ufw allow 80

# Permitir HTTPS
ufw allow 443

# Ver status
ufw status
```

### Atualizar sistema regularmente

```bash
apt update && apt upgrade -y
```

---

## 📝 Variáveis de Ambiente Completas

Arquivo: `/var/www/track_erp/.env`

```env
# Ambiente
NODE_ENV=production
PORT=3000

# Banco de Dados
DATABASE_URL=postgresql://track_erp_user:track_erp_password_2024@localhost:5432/track_erp

# Sessão
SESSION_SECRET=sua_chave_secreta_aleatoria_aqui

# OpenAI (para IA)
OPENAI_API_KEY=sk-proj-XXXXXXXX

# Focus NFe (para notas fiscais)
FOCUS_NFE_TOKEN=seu_token_focus_nfe

# AWS S3 (opcional, para uploads)
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_REGION=us-east-1
AWS_S3_BUCKET=
```

---

## 🎯 Checklist de Deploy

- [ ] VPS Ubuntu configurada
- [ ] Acesso SSH funcionando
- [ ] Script de instalação executado
- [ ] Arquivo .env configurado com chaves reais
- [ ] Nginx configurado
- [ ] Aplicação rodando (pm2 status)
- [ ] Acesso via navegador funcionando
- [ ] Firewall configurado (opcional)
- [ ] SSL configurado (opcional, se tiver domínio)

---

## 📞 Suporte

Se tiver problemas:

1. Verifique os logs: `pm2 logs track-erp`
2. Verifique o status: `pm2 status`
3. Verifique o Nginx: `nginx -t`
4. Verifique o PostgreSQL: `sudo systemctl status postgresql`

---

## 🚀 Performance

### Aumentar recursos do PM2

```bash
pm2 delete track-erp
pm2 start pnpm --name "track-erp" --max-memory-restart 500M -- start
pm2 save
```

### Otimizar PostgreSQL

```bash
# Editar configuração
sudo nano /etc/postgresql/*/main/postgresql.conf

# Aumentar memória compartilhada
shared_buffers = 256MB
effective_cache_size = 1GB

# Reiniciar
sudo systemctl restart postgresql
```

---

**Desenvolvido por**: Manus AI  
**Data**: 28 de Dezembro de 2024  
**Projeto**: Track ERP  
**GitHub**: https://github.com/othfxphead/track_erp
