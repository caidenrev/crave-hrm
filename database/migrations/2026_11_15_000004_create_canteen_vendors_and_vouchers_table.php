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
        Schema::create('canteen_vendors', function (Blueprint $table) {
            $table->id();
            $table->foreignId('company_id')->constrained('companies')->onDelete('cascade');
            $table->string('code')->index();
            $table->string('name');
            $table->string('pic_name');
            $table->string('pic_phone')->nullable();
            $table->string('location');
            $table->decimal('price_per_meal', 12, 2)->default(25000.00);
            $table->enum('status', ['active', 'inactive'])->default('active');
            $table->text('notes')->nullable();
            $table->timestamps();
        });

        Schema::create('canteen_vouchers', function (Blueprint $table) {
            $table->id();
            $table->foreignId('company_id')->constrained('companies')->onDelete('cascade');
            $table->foreignId('employee_id')->constrained('employees')->onDelete('cascade');
            $table->foreignId('vendor_id')->nullable()->constrained('canteen_vendors')->nullOnDelete();
            $table->string('voucher_code')->index();
            $table->string('encrypted_token', 255)->unique();
            $table->date('meal_date')->index();
            $table->string('meal_type')->default('lunch');
            $table->decimal('nominal_value', 12, 2)->default(25000.00);
            $table->enum('status', ['active', 'redeemed', 'expired', 'cancelled'])->default('active');
            $table->timestamp('expires_at')->nullable()->index();
            $table->timestamp('redeemed_at')->nullable();
            $table->foreignId('redeemed_by')->nullable()->constrained('users')->nullOnDelete();
            $table->string('ip_address')->nullable();
            $table->string('device_info')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('canteen_vouchers');
        Schema::dropIfExists('canteen_vendors');
    }
};
