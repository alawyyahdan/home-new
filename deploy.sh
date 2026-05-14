#!/bin/bash

echo "==============================================="
echo "  Script Auto Install & Deploy Portfolio + QRIS  "
echo "==============================================="

# Cek Root/Sudo
if [ "$EUID" -ne 0 ]; then
  echo "❌ Harap jalankan script ini dengan sudo (contoh: sudo ./deploy.sh)"
  exit
fi

echo -e "\n[1/7] 🔄 Memperbarui package list & install dependency dasar..."
apt update -y
apt install curl git nginx -y

echo -e "\n[2/7] 📦 Mengecek & Install Node.js..."
if ! command -v node &> /dev/null; then
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
    apt install -y nodejs
else
    echo "✅ Node.js sudah terinstall: $(node -v)"
fi

echo -e "\n[3/7] 📦 Mengecek & Install PM2..."
if ! command -v pm2 &> /dev/null; then
    npm install -g pm2
else
    echo "✅ PM2 sudah terinstall"
fi

echo -e "\n[4/7] 📦 Menginstall project dependencies..."
echo "-> Frontend..."
npm install
echo "-> Backend..."
cd backend-qris
npm install
cd ..

echo -e "\n[5/7] ⚙️ Konfigurasi Environment Variables..."
if [ ! -f backend-qris/.env ]; then
    echo "API_KEY=ISI_KEY_ANDA_DISINI" > backend-qris/.env
    echo "NODE_ENV=production" >> backend-qris/.env
    echo "✅ backend-qris/.env dibuat."
else
    echo "✅ backend-qris/.env sudah ada."
fi

echo -e "\n[6/7] 🚀 Menjalankan aplikasi dengan PM2..."
# Hentikan aplikasi lama jika ada
pm2 stop ecosystem.config.js 2>/dev/null
pm2 delete ecosystem.config.js 2>/dev/null

# Jalankan ulang
pm2 start ecosystem.config.js
pm2 save
pm2 startup systemd -u root --hp /root 2>/dev/null | grep "sudo env PATH" | bash

echo -e "\n[7/7] ⚙️ Konfigurasi Nginx sebagai Reverse Proxy..."
DOMAIN_OR_IP=$(curl -s ifconfig.me || echo "localhost")

cat > /etc/nginx/sites-available/home-portfolio <<EOF
server {
    listen 80;
    server_name _; # Menerima request dari IP atau domain apapun

    # Routing Frontend (Port 1001)
    location / {
        proxy_pass http://localhost:1001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
    }

    # Routing Backend QRIS (Port 1002)
    location /api/ {
        proxy_pass http://localhost:1002;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOF

# Enable Nginx Config
ln -sf /etc/nginx/sites-available/home-portfolio /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default

# Restart Nginx
nginx -t && systemctl restart nginx

echo -e "\n==============================================="
echo " 🎉 AUTO DEPLOY SELESAI! "
echo "==============================================="
echo "🌐 Akses Web: http://$DOMAIN_OR_IP"
echo "⚙️ Akses API: http://$DOMAIN_OR_IP/api/"
echo "✅ PM2 Apps: (Frontend: 1001, Backend: 1002)"
echo "❗ PENTING: Jangan lupa edit backend-qris/.env untuk mengubah API_KEY Anda."
