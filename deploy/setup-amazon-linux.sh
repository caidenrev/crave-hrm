#!/usr/bin/env bash
# ==============================================================================
# Crave HRM - Amazon Linux 2023 (AL2023) Automated Setup Script
# Run with: sudo bash deploy/setup-amazon-linux.sh
# ==============================================================================

set -e

echo "🚀 [1/7] Memperbarui Repositori Paket Amazon Linux 2023..."
sudo dnf update -y

echo "💾 [2/7] Mengaktifkan Linux Swap 2GB (Krusial untuk RAM 1GB EC2)..."
if [ ! -f /swapfile ]; then
    sudo dd if=/dev/zero of=/swapfile bs=128M count=16
    sudo chmod 600 /swapfile
    sudo mkswap /swapfile
    sudo swapon /swapfile
    echo '/swapfile swap swap defaults 0 0' | sudo tee -a /etc/fstab
    echo "✅ Swap 2GB berhasil diaktifkan."
else
    echo "ℹ️ Swap file sudah ada, lewati."
fi

echo "🐘 [3/7] Menginstall Nginx, PHP, dan Ekstensi Laravel..."
sudo dnf install -y nginx git unzip tar \
    php-cli php-fpm php-mysqlnd php-mbstring php-xml php-curl \
    php-zip php-bcmath php-intl php-gd php-opcache php-process

sudo systemctl enable --now nginx
sudo systemctl enable --now php-fpm

echo "📦 [4/7] Menginstall Composer & Node.js..."
if ! command -v composer &> /dev/null; then
    curl -sS https://getcomposer.org/installer | php
    sudo mv composer.phar /usr/local/bin/composer
fi

if ! command -v node &> /dev/null; then
    sudo dnf install -y nodejs npm
fi

echo "🌐 [5/7] Mengkonfigurasi Nginx untuk Crave HRM..."
sudo mkdir -p /var/www/crave-hrm
sudo chown -R ec2-user:nginx /var/www/crave-hrm

# Buat konfigurasi Nginx vhost untuk Amazon Linux
cat << 'EOF' | sudo tee /etc/nginx/conf.d/crave-hrm.conf
server {
    listen 80;
    listen [::]:80;
    server_name hrm.craveservices.my.id;

    root /var/www/crave-hrm/public;
    index index.php index.html;

    client_max_body_size 25M;

    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;

    gzip on;
    gzip_vary on;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types text/plain text/css text/xml application/json application/javascript image/svg+xml;

    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    location ~* ^/build/.*\.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
        expires 1y;
        add_header Cache-Control "public, no-transform, immutable";
        access_log off;
        try_files $uri =404;
    }

    location ^~ /storage/ {
        expires 30d;
        add_header Cache-Control "public";
        access_log off;
        try_files $uri =404;
    }

    location ~ \.php$ {
        fastcgi_pass unix:/run/php-fpm/www.sock;
        fastcgi_index index.php;
        fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
        include fastcgi_params;
        fastcgi_buffer_size 16k;
        fastcgi_buffers 4 16k;
    }

    location ~ /\.(?!well-known).* {
        deny all;
    }
}
EOF

sudo nginx -t && sudo systemctl reload nginx

echo "⚙️ [6/7] Menyiapkan Background Queue Worker (Systemd)..."
cat << 'EOF' | sudo tee /etc/systemd/system/crave-worker.service
[Unit]
Description=Crave HRM Background Queue Worker
After=network.target

[Service]
User=nginx
Group=nginx
Restart=always
ExecStart=/usr/bin/php /var/www/crave-hrm/artisan queue:work --sleep=3 --tries=3 --max-time=3600
RestartSec=5

[Install]
WantedBy=multi-user.target
EOF

sudo systemctl daemon-reload
sudo systemctl enable crave-worker

echo "🛡️ [7/7] Mengatur Izin Folder Storage..."
sudo chmod -R 775 /var/www/crave-hrm/storage /var/www/crave-hrm/bootstrap/cache 2>/dev/null || true

echo ""
echo "=============================================================================="
echo "🎉 Setup Amazon Linux Selesai!"
echo "=============================================================================="
