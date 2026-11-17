#!/usr/bin/env bash
# ==============================================================================
# Crave HRM - AWS EC2 Free Tier Automated Setup Script (Ubuntu 24.04 LTS)
# Domain Target: hrm.craveservices.my.id
# Run with: sudo bash deploy/setup-aws-ec2.sh
# ==============================================================================

set -e

echo "🚀 [1/8] Memperbarui Repositori Paket Sistem..."
sudo apt-get update && sudo apt-get upgrade -y
sudo apt-get install -y curl wget git unzip software-properties-common ufw

echo "💾 [2/8] Mengaktifkan Linux Swap 2GB (Krusial untuk RAM 1GB EC2 Free Tier)..."
if [ ! -f /swapfile ]; then
    sudo fallocate -l 2G /swapfile
    sudo chmod 600 /swapfile
    sudo mkswap /swapfile
    sudo swapon /swapfile
    echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
    echo "✅ Swap 2GB berhasil diaktifkan."
else
    echo "ℹ️ Swap file sudah ada, lewati."
fi

echo "🐘 [3/8] Menginstall PHP 8.3, PHP-FPM, dan Ekstensi Laravel..."
sudo add-apt-repository -y ppa:ondrej/php
sudo apt-get update
sudo apt-get install -y php8.3-fpm php8.3-cli php8.3-common php8.3-mysql php8.3-zip php8.3-gd \
    php8.3-mbstring php8.3-curl php8.3-xml php8.3-bcmath php8.3-intl php8.3-sqlite3

echo "📦 [4/8] Menginstall Composer & Node.js LTS..."
if ! command -v composer &> /dev/null; then
    curl -sS https://getcomposer.org/installer | php
    sudo mv composer.phar /usr/local/bin/composer
fi

if ! command -v node &> /dev/null; then
    curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
    sudo apt-get install -y nodejs
fi

echo "🗄️ [5/8] Menginstall & Menyiapkan Database MySQL 8.0..."
sudo apt-get install -y mysql-server
sudo systemctl enable --now mysql

DB_NAME="crave_hrm"
DB_USER="crave_admin"
DB_PASS="CraveHRM_Secret2026!"

sudo mysql -e "CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
sudo mysql -e "CREATE USER IF NOT EXISTS '${DB_USER}'@'localhost' IDENTIFIED BY '${DB_PASS}';"
sudo mysql -e "GRANT ALL PRIVILEGES ON \`${DB_NAME}\`.* TO '${DB_USER}'@'localhost';"
sudo mysql -e "FLUSH PRIVILEGES;"
echo "✅ Database '${DB_NAME}' & user '${DB_USER}' siap digunakan."

echo "🌐 [6/8] Menginstall Nginx Web Server & Certbot SSL..."
sudo apt-get install -y nginx certbot python3-certbot-nginx

# Buat direktori aplikasi jika belum ada
sudo mkdir -p /var/www/crave-hrm
sudo chown -R $USER:www-data /var/www/crave-hrm

# Pasang konfigurasi Nginx Crave HRM
sudo cp deploy/nginx-hrm.conf /etc/nginx/sites-available/crave-hrm
sudo ln -sf /etc/nginx/sites-available/crave-hrm /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t && sudo systemctl reload nginx

echo "⚙️ [7/8] Menyiapkan Background Queue Worker (Systemd)..."
cat << 'EOF' | sudo tee /etc/systemd/system/crave-worker.service
[Unit]
Description=Crave HRM Background Queue Worker
After=network.target mysql.service

[Service]
User=www-data
Group=www-data
Restart=always
ExecStart=/usr/bin/php /var/www/crave-hrm/artisan queue:work --sleep=3 --tries=3 --max-time=3600
RestartSec=5

[Install]
WantedBy=multi-user.target
EOF

sudo systemctl daemon-reload
sudo systemctl enable crave-worker

echo "🛡️ [8/8] Menyiapkan Firewall UFW..."
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw --force enable

echo ""
echo "=============================================================================="
echo "🎉 Setup Server AWS EC2 Selesai!"
echo "Langkah selanjutnya:"
echo "1. Pastikan domain DNS A record 'hrm.craveservices.my.id' sudah mengarah ke IP publik EC2 ini."
echo "2. Jalankan perintah deploy aplikasi: bash deploy/deploy.sh"
echo "3. Terbitkan sertifikat SSL gratis: sudo certbot --nginx -d hrm.craveservices.my.id"
echo "=============================================================================="
