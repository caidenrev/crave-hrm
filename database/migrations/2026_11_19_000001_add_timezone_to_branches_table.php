<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        if (Schema::hasTable('branches') && !Schema::hasColumn('branches', 'timezone')) {
            Schema::table('branches', function (Blueprint $table) {
                $table->string('timezone', 50)->default('Asia/Jakarta')->after('office_ips');
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (Schema::hasTable('branches') && Schema::hasColumn('branches', 'timezone')) {
            Schema::table('branches', function (Blueprint $table) {
                $table->dropColumn('timezone');
            });
        }
    }
};
