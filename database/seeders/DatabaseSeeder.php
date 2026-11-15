<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            CompanySeeder::class,
            HolidaySeeder::class,
            AnnouncementSeeder::class,
            EmployeeSeeder::class,
            ShiftSeeder::class,
            LeaveTypeSeeder::class,
            CanteenSeeder::class,
            PayrollSeeder::class,
            RecruitmentSeeder::class,
        ]);
    }
}
