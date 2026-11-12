<?php

namespace Database\Seeders;

use App\Models\Announcement;
use App\Models\Company;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class AnnouncementSeeder extends Seeder
{
    public function run(): void
    {
        $companies = Company::all();
        $adminUser = User::first();

        foreach ($companies as $company) {
            Announcement::updateOrCreate(
                ['company_id' => $company->id, 'title' => 'Implementasi Radius Geofence GPS & Whitelist IP Kantor'],
                [
                    'company_id' => $company->id,
                    'title' => 'Implementasi Radius Geofence GPS & Whitelist IP Kantor',
                    'slug' => 'kebijakan-geofence-gps-ip-whitelist-' . $company->id,
                    'content' => "Diberitahukan kepada seluruh karyawan {$company->name}, mulai November 2026 sistem presensi pintar akan menerapkan validasi geofence radius 100m dan verifikasi IP publik kantor. Pastikan izin akses lokasi pada smartphone Anda aktif saat melakukan check-in harian.",
                    'category' => 'policy',
                    'priority' => 'urgent',
                    'is_pinned' => true,
                    'published_at' => now()->subDays(2)->toDateString(),
                    'author_id' => $adminUser?->id,
                ]
            );

            Announcement::updateOrCreate(
                ['company_id' => $company->id, 'title' => 'Townhall Crave Group Q4 & Peluncuran Fitur HRM'],
                [
                    'company_id' => $company->id,
                    'title' => 'Townhall Crave Group Q4 & Peluncuran Fitur HRM',
                    'slug' => 'townhall-crave-group-q4-' . $company->id,
                    'content' => "Mari bergabung dalam agenda Townhall kuartal keempat yang akan diselenggarakan secara hybrid. Kita akan membahas evaluasi KPI, pengumuman program retensi talenta, serta peluncuran modul Crave Canteen dan E-Recruitment.",
                    'category' => 'event',
                    'priority' => 'high',
                    'is_pinned' => false,
                    'published_at' => now()->subDay()->toDateString(),
                    'author_id' => $adminUser?->id,
                ]
            );

            Announcement::updateOrCreate(
                ['company_id' => $company->id, 'title' => 'Sosialisasi Kalender Libur Nasional 2026 SKB 3 Menteri'],
                [
                    'company_id' => $company->id,
                    'title' => 'Sosialisasi Kalender Libur Nasional 2026 SKB 3 Menteri',
                    'slug' => 'kalender-libur-nasional-2026-' . $company->id,
                    'content' => "Jadwal hari libur nasional dan cuti bersama tahun 2026 telah resmi disinkronkan ke dalam menu Kalender & Libur. Karyawan yang merencanakan cuti tahunan di sekitar hari raya disarankan mengajukan melalui portal paling lambat 14 hari sebelum hari H.",
                    'category' => 'general',
                    'priority' => 'normal',
                    'is_pinned' => false,
                    'published_at' => now()->toDateString(),
                    'author_id' => $adminUser?->id,
                ]
            );
        }
    }
}
