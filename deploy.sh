#!/bin/bash

echo "==============================================="
echo "  Script Auto Install & Deploy Portfolio + QRIS"
echo "==============================================="

# Cek Root/Sudo
if [ "$EUID" -ne 0 ]; then
  echo "❌ Harap jalankan script ini dengan sudo (contoh: sudo ./deploy.sh)"
  exit
fi

echo -e "\n[1/5] 🔄 Memperbarui package list & install dependency dasar..."
apt update -y
apt install curl git -y

echo -e "\n[2/5] 📦 Mengecek & Install Node.js..."
if ! command -v node &> /dev/null; then
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
    apt install -y nodejs
else
    echo "✅ Node.js sudah terinstall: $(node -v)"
fi

echo -e "\n[3/5] 📦 Mengecek & Install PM2..."
if ! command -v pm2 &> /dev/null; then
    npm install -g pm2
else
    echo "✅ PM2 sudah terinstall"
fi

echo -e "\n[4/5] 📦 Install dependencies & setup environment..."
npm install

if [ ! -f .env ]; then
    echo "API_KEY=ISI_KEY_ANDA_DISINI" > .env
    echo "NODE_ENV=production" >> .env
    echo "PORT=1001" >> .env
    echo "⚠️  .env dibuat. WAJIB edit API_KEY sebelum melanjutkan!"
else
    echo "✅ .env sudah ada."
fi

echo -e "\n[5/5] 🚀 Menjalankan aplikasi dengan PM2..."
pm2 stop ecosystem.config.js 2>/dev/null
pm2 delete ecosystem.config.js 2>/dev/null
pm2 start ecosystem.config.js
pm2 save
pm2 startup systemd -u root --hp /root 2>/dev/null | grep "sudo env PATH" | bash

DOMAIN_OR_IP=$(curl -s ifconfig.me 2>/dev/null || echo "localhost")

echo -e "\n==============================================="
echo " 🎉 AUTO DEPLOY SELESAI!"
echo "==============================================="
echo "🌐 Akses Web: http://$DOMAIN_OR_IP:1001"
echo "⚙️  API QRIS : http://$DOMAIN_OR_IP:1001/api/generate"
echo "❗ PENTING   : Edit .env dan isi API_KEY yang benar, lalu jalankan: pm2 restart all"
