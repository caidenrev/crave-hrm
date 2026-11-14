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
        Schema::create('leave_types', function (Blueprint $table) {
            $table->id();
            $table->foreignId('company_id')->constrained('companies')->onDelete('cascade');
            $table->string('name');
            $table->string('code', 30);
            $table->integer('days_allocated')->default(12);
            $table->boolean('is_paid')->default(true);
            $table->boolean('requires_attachment')->default(false);
            $table->boolean('is_active')->default(true);
            $table->text('description')->nullable();
            $table->timestamps();

            $table->unique(['company_id', 'code']);
        });

        Schema::create('leave_balances', function (Blueprint $table) {
            $table->id();
            $table->foreignId('company_id')->constrained('companies')->onDelete('cascade');
            $table->foreignId('employee_id')->constrained('employees')->onDelete('cascade');
            $table->foreignId('leave_type_id')->constrained('leave_types')->onDelete('cascade');
            $table->integer('year')->default(2026);
            $table->integer('total_allocated')->default(12);
            $table->integer('used_days')->default(0);
            $table->integer('pending_days')->default(0);
            $table->integer('remaining_days')->default(12);
            $table->timestamps();

            $table->unique(['company_id', 'employee_id', 'leave_type_id', 'year']);
            $table->index(['company_id', 'employee_id', 'year']);
        });

        Schema::create('leave_requests', function (Blueprint $table) {
            $table->id();
            $table->foreignId('company_id')->constrained('companies')->onDelete('cascade');
            $table->foreignId('employee_id')->constrained('employees')->onDelete('cascade');
            $table->foreignId('leave_type_id')->constrained('leave_types')->onDelete('cascade');
            $table->date('start_date');
            $table->date('end_date');
            $table->integer('total_days')->default(1);
            $table->text('reason');
            $table->longText('attachment_url')->nullable();
            
            // Sequential multi-level approval: pending_supervisor -> pending_hr -> approved | rejected | cancelled
            $table->string('status')->default('pending_supervisor'); 
            
            // Level 1: Atasan Langsung (Direct Supervisor)
            $table->foreignId('supervisor_id')->nullable()->constrained('users')->onDelete('set null');
            $table->string('supervisor_status')->default('pending'); // pending, approved, rejected
            $table->text('supervisor_notes')->nullable();
            $table->timestamp('supervisor_action_at')->nullable();

            // Level 2: HR Admin
            $table->foreignId('hr_id')->nullable()->constrained('users')->onDelete('set null');
            $table->string('hr_status')->default('pending'); // pending, approved, rejected
            $table->text('hr_notes')->nullable();
            $table->timestamp('hr_action_at')->nullable();

            $table->timestamps();

            $table->index(['company_id', 'status']);
            $table->index(['company_id', 'employee_id']);
            $table->index(['company_id', 'start_date', 'end_date']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('leave_requests');
        Schema::dropIfExists('leave_balances');
        Schema::dropIfExists('leave_types');
    }
};
