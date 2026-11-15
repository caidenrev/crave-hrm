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
        Schema::create('job_postings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('company_id')->constrained('companies')->onDelete('cascade');
            $table->foreignId('branch_id')->nullable()->constrained('branches')->onDelete('set null');
            $table->foreignId('department_id')->nullable()->constrained('departments')->onDelete('set null');
            $table->foreignId('designation_id')->nullable()->constrained('designations')->onDelete('set null');
            $table->string('title');
            $table->string('slug')->index();
            $table->string('employment_type')->default('PKWTT'); // PKWTT, PKWT, Internship, Freelance
            $table->string('workplace_type')->default('On-site'); // On-site, Hybrid, Remote
            $table->string('experience_level')->default('Mid Level'); // Entry Level, Mid Level, Senior Level, Lead / Manager
            $table->decimal('min_salary', 15, 2)->nullable();
            $table->decimal('max_salary', 15, 2)->nullable();
            $table->boolean('show_salary')->default(true);
            $table->longText('description');
            $table->longText('requirements')->nullable();
            $table->longText('benefits')->nullable();
            $table->integer('vacancies_count')->default(1);
            $table->date('deadline')->nullable();
            $table->string('status')->default('published'); // draft, published, closed
            $table->timestamps();
        });

        Schema::create('candidates', function (Blueprint $table) {
            $table->id();
            $table->foreignId('company_id')->constrained('companies')->onDelete('cascade');
            $table->foreignId('job_posting_id')->constrained('job_postings')->onDelete('cascade');
            $table->string('full_name');
            $table->string('email');
            $table->string('phone');
            $table->string('current_company')->nullable();
            $table->string('current_title')->nullable();
            $table->string('linkedin_url')->nullable();
            $table->string('portfolio_url')->nullable();
            $table->string('resume_path')->nullable();
            $table->text('cover_letter')->nullable();
            $table->string('source')->default('Career Portal'); // Career Portal, LinkedIn, Referral, Job Fair, Direct
            $table->string('stage')->default('applied'); // applied, screening, interview, offering, hired, rejected
            $table->unsignedTinyInteger('rating')->default(0); // 0-5
            $table->longText('interview_notes')->nullable();
            $table->dateTime('interview_scheduled_at')->nullable();
            $table->string('interview_meeting_link')->nullable();
            $table->decimal('offered_salary', 15, 2)->nullable();
            $table->text('rejection_reason')->nullable();
            $table->boolean('is_converted_to_employee')->default(false);
            $table->foreignId('employee_id')->nullable()->constrained('employees')->onDelete('set null');
            $table->date('hired_at')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('candidates');
        Schema::dropIfExists('job_postings');
    }
};

