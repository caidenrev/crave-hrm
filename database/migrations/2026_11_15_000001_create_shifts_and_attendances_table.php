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
        Schema::create('shifts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('company_id')->constrained('companies')->onDelete('cascade');
            $table->string('name');
            $table->string('code')->nullable();
            $table->time('start_time')->default('08:00:00');
            $table->time('end_time')->default('17:00:00');
            $table->integer('late_tolerance_minutes')->default(15);
            $table->boolean('is_flexible')->default(false);
            $table->boolean('is_active')->default(true);
            $table->text('description')->nullable();
            $table->timestamps();

            $table->index(['company_id', 'is_active']);
        });

        Schema::create('shift_swaps', function (Blueprint $table) {
            $table->id();
            $table->foreignId('company_id')->constrained('companies')->onDelete('cascade');
            $table->foreignId('requester_id')->constrained('employees')->onDelete('cascade');
            $table->foreignId('target_employee_id')->constrained('employees')->onDelete('cascade');
            $table->foreignId('requested_shift_id')->constrained('shifts')->onDelete('cascade');
            $table->foreignId('target_shift_id')->constrained('shifts')->onDelete('cascade');
            $table->date('swap_date');
            $table->string('status')->default('pending'); // pending, approved, rejected
            $table->text('reason')->nullable();
            $table->foreignId('approved_by')->nullable()->constrained('users')->onDelete('set null');
            $table->timestamp('approved_at')->nullable();
            $table->timestamps();

            $table->index(['company_id', 'status']);
        });

        Schema::create('attendances', function (Blueprint $table) {
            $table->id();
            $table->foreignId('company_id')->constrained('companies')->onDelete('cascade');
            $table->foreignId('employee_id')->constrained('employees')->onDelete('cascade');
            $table->foreignId('shift_id')->nullable()->constrained('shifts')->onDelete('set null');
            $table->foreignId('branch_id')->nullable()->constrained('branches')->onDelete('set null');
            $table->date('date');
            $table->time('clock_in_time')->nullable();
            $table->time('clock_out_time')->nullable();
            $table->decimal('clock_in_lat', 10, 8)->nullable();
            $table->decimal('clock_in_lng', 11, 8)->nullable();
            $table->string('clock_in_ip')->nullable();
            $table->integer('clock_in_distance_meters')->nullable();
            $table->longText('clock_in_selfie_url')->nullable();
            $table->decimal('clock_out_lat', 10, 8)->nullable();
            $table->decimal('clock_out_lng', 11, 8)->nullable();
            $table->string('clock_out_ip')->nullable();
            $table->integer('clock_out_distance_meters')->nullable();
            $table->longText('clock_out_selfie_url')->nullable();
            $table->string('status')->default('present'); // present, late, early_leave, absent
            $table->string('geofence_status')->default('valid_geofence'); // valid_geofence, valid_ip, outside_geofence, exempt
            $table->integer('late_minutes')->default(0);
            $table->integer('early_leave_minutes')->default(0);
            $table->integer('work_duration_minutes')->default(0);
            $table->text('notes')->nullable();
            $table->boolean('is_corrected')->default(false);
            $table->text('correction_reason')->nullable();
            $table->foreignId('corrected_by')->nullable()->constrained('users')->onDelete('set null');
            $table->timestamps();

            $table->unique(['company_id', 'employee_id', 'date']);
            $table->index(['company_id', 'date']);
            $table->index(['company_id', 'status']);
        });

        // Add default_shift_id to employees table if not present
        if (Schema::hasTable('employees') && !Schema::hasColumn('employees', 'default_shift_id')) {
            Schema::table('employees', function (Blueprint $table) {
                $table->foreignId('default_shift_id')->nullable()->after('designation_id')->constrained('shifts')->onDelete('set null');
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (Schema::hasTable('employees') && Schema::hasColumn('employees', 'default_shift_id')) {
            Schema::table('employees', function (Blueprint $table) {
                $table->dropForeign(['default_shift_id']);
                $table->dropColumn('default_shift_id');
            });
        }

        Schema::dropIfExists('attendances');
        Schema::dropIfExists('shift_swaps');
        Schema::dropIfExists('shifts');
    }
};
