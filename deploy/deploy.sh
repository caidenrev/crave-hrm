#!/usr/bin/env bash
# ==============================================================================
# Crave HRM - Continuous Deployment Script (Amazon Linux 2023 / EC2)
# ==============================================================================

set -e

# Pastikan PATH mencakup binary composer, php, dan node
export PATH=$PATH:/usr/local/bin:/usr/bin

APP_DIR="/var/www/crave-hrm"
cd "$APP_DIR"

echo "📥 [1/6] Mengambil kode terbaru dari Git main..."
git fetch origin main
git reset --hard origin/main

echo "📦 [2/6] Memperbarui Composer dependencies..."
composer install --no-dev --optimize-autoloader --no-interaction --ignore-platform-req=php+

echo "🗄️ [3/6] Menjalankan migrasi database (TiDB Cloud)..."
php artisan migrate --force

echo "⚛️ [4/6] Membangun aset Vite frontend..."
if [ -f package.json ]; then
    npm install --prefer-offline --no-audit
    npm run build
fi

echo "⚡ [5/6] Mengoptimalkan cache Laravel..."
php artisan storage:link || true
php artisan config:cache
php artisan route:cache
php artisan view:cache

echo "🔒 [6/6] Menyelaraskan permission storage & reload services..."
sudo chmod -R 777 storage bootstrap/cache
sudo systemctl reload php-fpm || sudo systemctl restart php-fpm
sudo systemctl reload nginx || sudo systemctl restart nginx

echo "🚀 [DONE] Deployment Sukses! https://hrm.craveservices.my.id"
