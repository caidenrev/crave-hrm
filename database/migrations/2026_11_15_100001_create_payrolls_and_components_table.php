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
        Schema::create('salary_components', function (Blueprint $table) {
            $table->id();
            $table->foreignId('company_id')->constrained('companies')->cascadeOnDelete();
            $table->string('name');
            $table->enum('type', ['earning', 'deduction'])->default('earning');
            $table->boolean('is_taxable')->default(true);
            $table->boolean('is_fixed')->default(true);
            $table->decimal('default_amount', 15, 2)->default(0);
            $table->timestamps();

            $table->index(['company_id', 'type']);
        });

        Schema::create('payroll_periods', function (Blueprint $table) {
            $table->id();
            $table->foreignId('company_id')->constrained('companies')->cascadeOnDelete();
            $table->string('name'); // e.g. "Payroll November 2026"
            $table->unsignedTinyInteger('month'); // 1 - 12
            $table->unsignedSmallInteger('year'); // e.g. 2026
            $table->date('start_date');
            $table->date('end_date');
            $table->date('payment_date');
            $table->enum('status', ['draft', 'processing', 'finalized'])->default('draft');
            $table->unsignedInteger('total_employees')->default(0);
            $table->decimal('total_gross', 15, 2)->default(0);
            $table->decimal('total_deductions', 15, 2)->default(0);
            $table->decimal('total_net_pay', 15, 2)->default(0);
            $table->foreignId('processed_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('processed_at')->nullable();
            $table->timestamps();

            $table->unique(['company_id', 'month', 'year']);
            $table->index(['company_id', 'status']);
        });

        Schema::create('payroll_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('company_id')->constrained('companies')->cascadeOnDelete();
            $table->foreignId('payroll_period_id')->constrained('payroll_periods')->cascadeOnDelete();
            $table->foreignId('employee_id')->constrained('employees')->cascadeOnDelete();

            // Penghasilan (Earnings)
            $table->decimal('gaji_pokok', 15, 2)->default(0);
            $table->decimal('tunjangan_tetap', 15, 2)->default(0);
            $table->decimal('tunjangan_tidak_tetap', 15, 2)->default(0);
            $table->decimal('uang_lembur', 15, 2)->default(0);
            $table->decimal('reimbursement_total', 15, 2)->default(0);
            $table->decimal('penghasilan_bruto', 15, 2)->default(0);

            // Kontribusi Perusahaan (Employer Benefits)
            $table->decimal('bpjs_kes_company', 15, 2)->default(0); // 4%
            $table->decimal('bpjs_jkk', 15, 2)->default(0);         // 0.24%
            $table->decimal('bpjs_jkm', 15, 2)->default(0);         // 0.30%
            $table->decimal('bpjs_jht_company', 15, 2)->default(0); // 3.7%
            $table->decimal('bpjs_jp_company', 15, 2)->default(0);  // 2.0%

            // Potongan Karyawan (Employee Deductions)
            $table->decimal('bpjs_kes_employee', 15, 2)->default(0); // 1%
            $table->decimal('bpjs_jht_employee', 15, 2)->default(0); // 2.0%
            $table->decimal('bpjs_jp_employee', 15, 2)->default(0);  // 1.0%
            $table->decimal('pph21', 15, 2)->default(0);
            $table->decimal('potongan_keterlambatan', 15, 2)->default(0);
            $table->decimal('potongan_lainnya', 15, 2)->default(0);
            $table->decimal('total_potongan', 15, 2)->default(0);

            // Take Home Pay
            $table->decimal('take_home_pay', 15, 2)->default(0);

            // Metadata Pajak & Status
            $table->string('ptkp_status', 10)->default('TK/0');
            $table->string('ter_category', 5)->default('A');
            $table->decimal('ter_rate', 5, 2)->default(0); // in percent, e.g. 1.50
            $table->enum('payment_status', ['unpaid', 'paid'])->default('unpaid');
            $table->timestamp('paid_at')->nullable();
            $table->json('details')->nullable(); // JSON breakdown for customized breakdown

            $table->timestamps();

            $table->unique(['payroll_period_id', 'employee_id']);
            $table->index(['company_id', 'payment_status']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('payroll_items');
        Schema::dropIfExists('payroll_periods');
        Schema::dropIfExists('salary_components');
    }
};

