<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('performance_reviews', function (Blueprint $table) {
            $table->id();
            $table->foreignId('company_id')->constrained('companies')->onDelete('cascade');
            $table->foreignId('employee_id')->constrained('employees')->onDelete('cascade');
            $table->foreignId('reviewer_id')->nullable()->constrained('employees')->onDelete('set null');
            $table->string('reviewer_type')->default('peer'); // self, supervisor, peer, subordinate
            $table->string('cycle_name')->default('Q4 2026');
            $table->enum('status', ['pending', 'completed'])->default('pending');
            $table->float('score_technical')->default(0);
            $table->float('score_communication')->default(0);
            $table->float('score_initiative')->default(0);
            $table->float('score_problem_solving')->default(0);
            $table->float('score_integrity')->default(0);
            $table->float('overall_score')->default(0);
            $table->text('strengths')->nullable();
            $table->text('improvements')->nullable();
            $table->timestamp('completed_at')->nullable();
            $table->timestamps();

            $table->index(['company_id', 'employee_id']);
            $table->index(['company_id', 'reviewer_id']);
            $table->index(['company_id', 'cycle_name']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('performance_reviews');
    }
};
