<?php

namespace Database\Seeders;

use App\Models\Company;
use App\Models\Holiday;
use Illuminate\Database\Seeder;

class HolidaySeeder extends Seeder
{
    public function run(): void
    {
        $nationalHolidays = [
            ['name' => 'Tahun Baru 2026 Masehi', 'date' => '2026-01-01', 'type' => 'national', 'description' => 'Hari Libur Nasional Tahun Baru'],
            ['name' => "Isra Mi'raj Nabi Muhammad SAW", 'date' => '2026-01-16', 'type' => 'national', 'description' => "Peringatan Isra Mi'raj 1447 H"],
            ['name' => 'Tahun Baru Imlek 2577 Kongzili', 'date' => '2026-02-17', 'type' => 'national', 'description' => 'Hari Libur Nasional Imlek'],
            ['name' => 'Hari Suci Nyepi Tahun Baru Saka 1948', 'date' => '2026-03-21', 'type' => 'national', 'description' => 'Tahun Baru Saka 1948'],
            ['name' => 'Hari Raya Idul Fitri 1447 H (Hari ke-1)', 'date' => '2026-03-22', 'type' => 'national', 'description' => 'Hari Raya Idul Fitri 1447 H'],
            ['name' => 'Hari Raya Idul Fitri 1447 H (Hari ke-2)', 'date' => '2026-03-23', 'type' => 'national', 'description' => 'Hari Raya Idul Fitri 1447 H'],
            ['name' => 'Cuti Bersama Idul Fitri 1447 H', 'date' => '2026-03-24', 'type' => 'collective_leave', 'description' => 'Cuti Bersama Resmi Pemerintah'],
            ['name' => 'Cuti Bersama Idul Fitri 1447 H', 'date' => '2026-03-25', 'type' => 'collective_leave', 'description' => 'Cuti Bersama Resmi Pemerintah'],
            ['name' => 'Wafat Yesus Kristus (Jumat Agung)', 'date' => '2026-04-03', 'type' => 'national', 'description' => 'Hari Libur Nasional'],
            ['name' => 'Hari Buruh Internasional (May Day)', 'date' => '2026-05-01', 'type' => 'national', 'description' => 'Hari Buruh Internasional'],
            ['name' => 'Kenaikan Yesus Kristus', 'date' => '2026-05-14', 'type' => 'national', 'description' => 'Hari Libur Nasional'],
            ['name' => 'Hari Raya Idul Adha 1447 H', 'date' => '2026-05-28', 'type' => 'national', 'description' => 'Hari Raya Kurban 1447 H'],
            ['name' => 'Hari Raya Waisak 2570 BE', 'date' => '2026-05-31', 'type' => 'national', 'description' => 'Hari Raya Waisak'],
            ['name' => 'Hari Lahir Pancasila', 'date' => '2026-06-01', 'type' => 'national', 'description' => 'Peringatan Hari Lahir Pancasila'],
            ['name' => 'Tahun Baru Islam 1448 H', 'date' => '2026-06-16', 'type' => 'national', 'description' => '1 Muharram 1448 Hijriah'],
            ['name' => 'Hari Kemerdekaan RI ke-81', 'date' => '2026-08-17', 'type' => 'national', 'description' => 'Proklamasi Kemerdekaan Republik Indonesia'],
            ['name' => 'Maulid Nabi Muhammad SAW', 'date' => '2026-08-25', 'type' => 'national', 'description' => 'Peringatan Maulid Nabi SAW'],
            ['name' => 'Hari Raya Natal', 'date' => '2026-12-25', 'type' => 'national', 'description' => 'Hari Raya Natal'],
            ['name' => 'Cuti Bersama Natal', 'date' => '2026-12-26', 'type' => 'collective_leave', 'description' => 'Cuti Bersama Resmi Pemerintah'],
        ];

        foreach ($nationalHolidays as $item) {
            Holiday::updateOrCreate(
                ['name' => $item['name'], 'date' => $item['date']],
                array_merge($item, ['company_id' => null])
            );
        }

        // Add an internal company holiday for Crave Holding
        $holding = Company::where('slug', 'crave-holding')->first() ?? Company::first();
        if ($holding) {
            Holiday::updateOrCreate(
                ['name' => 'Crave Annual Anniversary & Innovation Day', 'date' => '2026-11-29', 'company_id' => $holding->id],
                [
                    'name' => 'Crave Annual Anniversary & Innovation Day',
                    'date' => '2026-11-29',
                    'company_id' => $holding->id,
                    'type' => 'company_holiday',
                    'description' => 'Hari libur internal tahunan perusahaan merayakan inovasi Crave Group.',
                ]
            );
        }
    }
}
