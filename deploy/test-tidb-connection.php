<?php
/**
 * Test Connection Script for TiDB Cloud Serverless
 * Run with: php deploy/test-tidb-connection.php
 */

require __DIR__ . '/../vendor/autoload.php';

$app = require_once __DIR__ . '/../bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

echo "========================================================\n";
echo "🔍 Menguji Koneksi ke TiDB Cloud Serverless...\n";
echo "========================================================\n";

$host = config('database.connections.mysql.host');
$port = config('database.connections.mysql.port');
$database = config('database.connections.mysql.database');
$username = config('database.connections.mysql.username');

echo "Host     : {$host}\n";
echo "Port     : {$port}\n";
echo "Database : {$database}\n";
echo "Username : {$username}\n";
echo "--------------------------------------------------------\n";

try {
    $pdo = DB::connection()->getPdo();
    echo "✅ KONEKSI BERHASIL TERHUBUNG!\n\n";

    // Cek SSL Cipher
    $sslQuery = DB::select("SHOW STATUS LIKE 'Ssl_cipher'");
    $sslCipher = $sslQuery[0]->Value ?? 'None';
    echo "🔒 Enkripsi TLS/SSL : " . ($sslCipher !== 'None' && !empty($sslCipher) ? "AKTIF ({$sslCipher})" : "TIDAK AKTIF") . "\n";

    // Cek Versi Database (TiDB / MySQL)
    $version = DB::select("SELECT VERSION() as ver");
    echo "📦 Versi Mesin      : " . ($version[0]->ver ?? 'Unknown') . "\n";

    echo "--------------------------------------------------------\n";
    echo "🎉 Database siap untuk menjalankan: php artisan migrate --force --seed\n";
    echo "========================================================\n";
} catch (\Throwable $e) {
    echo "❌ GAGAL TERHUBUNG KE DATABASE:\n";
    echo $e->getMessage() . "\n";
    echo "--------------------------------------------------------\n";
    echo "💡 Tips Periksa:\n";
    echo "1. Pastikan DB_HOST, DB_PORT (biasanya 4000), DB_USERNAME, dan DB_PASSWORD di .env sudah sesuai.\n";
    echo "2. Pastikan cluster TiDB Cloud Anda berstatus 'Running'.\n";
    echo "========================================================\n";
}
