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
        Schema::create('announcements', function (Blueprint $table) {
            $table->id();
            $table->foreignId('company_id')->constrained('companies')->onDelete('cascade');
            $table->string('title');
            $table->string('slug')->nullable();
            $table->text('content');
            $table->string('category')->default('general'); // general, policy, urgent, event
            $table->string('priority')->default('normal'); // normal, high, urgent
            $table->boolean('is_pinned')->default(false);
            $table->date('published_at')->nullable();
            $table->foreignId('author_id')->nullable()->constrained('users')->onDelete('set null');
            $table->timestamps();

            $table->index(['company_id', 'is_pinned', 'published_at']);
        });

        Schema::create('holidays', function (Blueprint $table) {
            $table->id();
            $table->foreignId('company_id')->nullable()->constrained('companies')->onDelete('cascade');
            $table->string('name');
            $table->date('date');
            $table->string('type')->default('national'); // national, collective_leave, company_holiday
            $table->text('description')->nullable();
            $table->timestamps();

            $table->index(['company_id', 'date']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('holidays');
        Schema::dropIfExists('announcements');
    }
};
