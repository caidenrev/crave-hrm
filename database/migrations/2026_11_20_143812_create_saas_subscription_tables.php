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
        Schema::table('companies', function (Blueprint $table) {
            $table->string('subscription_status')->default('trial')->after('is_active'); // trial, active, grace, expired, suspended
            $table->timestamp('trial_ends_at')->nullable()->after('subscription_status');
            $table->timestamp('current_period_end')->nullable()->after('trial_ends_at');
            $table->string('plan_name')->default('Pro HR')->after('current_period_end');
            $table->integer('max_employees')->default(50)->after('plan_name');
            $table->text('founder_note')->nullable()->after('max_employees');
            $table->timestamp('suspended_at')->nullable()->after('founder_note');
            $table->string('suspended_reason')->nullable()->after('suspended_at');
        });

        Schema::create('subscription_plans', function (Blueprint $table) {
            $table->id();
            $table->integer('months')->unique(); // 1, 6, 12
            $table->bigInteger('price');
            $table->bigInteger('original_price')->nullable();
            $table->integer('discount_pct')->default(0);
            $table->string('label');
            $table->text('description')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        Schema::create('subscription_invoices', function (Blueprint $table) {
            $table->id();
            $table->foreignId('company_id')->constrained('companies')->onDelete('cascade');
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->string('order_id')->unique();
            $table->string('plan_name');
            $table->integer('months');
            $table->bigInteger('amount');
            $table->string('status')->default('pending'); // pending, paid, expired, cancelled
            $table->string('source')->default('midtrans'); // midtrans, manual
            $table->string('payment_type')->nullable(); // qris, bank_transfer, echannel, credit_card, gopay, shopeepay, manual
            $table->string('payment_reference')->nullable();
            $table->string('snap_token')->nullable();
            $table->timestamp('period_start')->nullable();
            $table->timestamp('period_end')->nullable();
            $table->timestamp('paid_at')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();

            $table->index(['company_id', 'status']);
            $table->index(['order_id']);
        });

        // Insert default subscription plans
        \Illuminate\Support\Facades\DB::table('subscription_plans')->insert([
            [
                'months' => 1,
                'price' => 299000,
                'original_price' => 299000,
                'discount_pct' => 0,
                'label' => '1 Bulan (Fleksibel)',
                'description' => 'Akses lengkap ke seluruh modul HR, presensi geofence, penggajian PPh 21 TER, & kantin QR.',
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'months' => 6,
                'price' => 1524000,
                'original_price' => 1794000,
                'discount_pct' => 15,
                'label' => '6 Bulan (Hemat 15%)',
                'description' => 'Paket semesteran terpopuler untuk efisiensi biaya operasional HR perusahaan berkembang.',
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'months' => 12,
                'price' => 2691000,
                'original_price' => 3588000,
                'discount_pct' => 25,
                'label' => '12 Bulan (Hemat 25%)',
                'description' => 'Solusi tahunan paling hemat. Bebas gangguan renewal dengan dukungan prioritas tim Crave.',
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);

        // Set default trial_ends_at for existing companies
        \Illuminate\Support\Facades\DB::table('companies')->whereNull('trial_ends_at')->update([
            'trial_ends_at' => now()->addDays(14),
            'subscription_status' => 'trial',
        ]);
        // Set holding to active
        \Illuminate\Support\Facades\DB::table('companies')->where('is_holding', true)->update([
            'subscription_status' => 'active',
            'current_period_end' => now()->addYears(10),
        ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('subscription_invoices');
        Schema::dropIfExists('subscription_plans');
        Schema::table('companies', function (Blueprint $table) {
            $table->dropColumn([
                'subscription_status',
                'trial_ends_at',
                'current_period_end',
                'plan_name',
                'max_employees',
                'founder_note',
                'suspended_at',
                'suspended_reason',
            ]);
        });
    }
};
