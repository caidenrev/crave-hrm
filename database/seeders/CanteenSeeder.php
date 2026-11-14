<?php

namespace Database\Seeders;

use App\Models\CanteenVendor;
use App\Models\CanteenVoucher;
use App\Models\Company;
use App\Models\Employee;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class CanteenSeeder extends Seeder
{
    public function run(): void
    {
        $companies = Company::all();
        $adminUser = User::first();

        foreach ($companies as $company) {
            // 1. Create Vendors
            $vendorsData = [
                [
                    'code' => 'VND-01',
                    'name' => 'Katering Bu Siti (Prasmanan Nusantara)',
                    'pic_name' => 'Siti Rahayu',
                    'pic_phone' => '0812-8881-2345',
                    'location' => 'Lantai 1 Kantin Barat - Booth 01',
                    'price_per_meal' => 25000.00,
                    'status' => 'active',
                    'notes' => 'Menu harian: Nasi rames, rendang, ayam bakar, tempe orek, dan aneka sayur mayur.',
                ],
                [
                    'code' => 'VND-02',
                    'name' => 'Dapur Sedap Rasa (Aneka Ayam & Ikan)',
                    'pic_name' => 'Budi Santoso',
                    'pic_phone' => '0813-9992-3456',
                    'location' => 'Lantai 1 Kantin Barat - Booth 02',
                    'price_per_meal' => 25000.00,
                    'status' => 'active',
                    'notes' => 'Menu harian: Ayam geprek, ikan fillet krispi, telur balado, capcay, dan sambal matah.',
                ],
                [
                    'code' => 'VND-03',
                    'name' => 'Kantin Sehat Crave (Fit & Salad Bar)',
                    'pic_name' => 'Maya Putri',
                    'pic_phone' => '0815-7773-4567',
                    'location' => 'Food Court Tower B - Booth 05',
                    'price_per_meal' => 28000.00,
                    'status' => 'active',
                    'notes' => 'Menu harian: Chicken breast bowl, gado-gado spesial, salad buah, jus alpukat rendah gula.',
                ],
            ];

            $createdVendors = [];
            foreach ($vendorsData as $vData) {
                $vendor = CanteenVendor::updateOrCreate(
                    ['company_id' => $company->id, 'code' => $vData['code']],
                    $vData
                );
                $createdVendors[] = $vendor;
            }

            // 2. Create Vouchers for Employees in this company
            $employees = Employee::where('company_id', $company->id)->take(10)->get();
            if ($employees->isEmpty()) {
                continue;
            }

            $today = Carbon::today();

            // Seed historical vouchers for the past 14 days
            for ($dayOffset = 14; $dayOffset >= 1; $dayOffset--) {
                $date = $today->copy()->subDays($dayOffset);
                if ($date->isWeekend()) {
                    continue; // Skip weekend
                }

                foreach ($employees as $idx => $emp) {
                    // 80% employees redeem vouchers
                    if (($idx + $dayOffset) % 5 === 0) {
                        continue;
                    }

                    $vendor = $createdVendors[($idx + $dayOffset) % count($createdVendors)];
                    $voucherCode = 'CRV-CRN-' . $date->format('Ymd') . '-' . strtoupper(Str::random(5));
                    $token = 'CRV-QR-' . $date->timestamp . '-' . Str::random(24);

                    CanteenVoucher::create([
                        'company_id' => $company->id,
                        'employee_id' => $emp->id,
                        'vendor_id' => $vendor->id,
                        'voucher_code' => $voucherCode,
                        'encrypted_token' => $token,
                        'meal_date' => $date->format('Y-m-d'),
                        'meal_type' => 'lunch',
                        'nominal_value' => $vendor->price_per_meal,
                        'status' => 'redeemed',
                        'expires_at' => $date->copy()->setTime(14, 0, 0),
                        'redeemed_at' => $date->copy()->setTime(12, rand(10, 50), rand(10, 59)),
                        'redeemed_by' => $adminUser?->id,
                        'ip_address' => '192.168.1.' . rand(10, 99),
                        'device_info' => 'Crave Merchant Scanner v2.0 - POS Kasir',
                    ]);
                }
            }

            // Seed today's vouchers
            foreach ($employees as $idx => $emp) {
                $voucherCode = 'CRV-CRN-' . $today->format('Ymd') . '-' . strtoupper(Str::random(5));
                $token = 'CRV-QR-' . $today->timestamp . '-' . Str::random(24);

                // First 2 employees already redeemed today
                if ($idx < 2) {
                    $vendor = $createdVendors[0];
                    CanteenVoucher::create([
                        'company_id' => $company->id,
                        'employee_id' => $emp->id,
                        'vendor_id' => $vendor->id,
                        'voucher_code' => $voucherCode,
                        'encrypted_token' => $token,
                        'meal_date' => $today->format('Y-m-d'),
                        'meal_type' => 'lunch',
                        'nominal_value' => $vendor->price_per_meal,
                        'status' => 'redeemed',
                        'expires_at' => $today->copy()->setTime(14, 0, 0),
                        'redeemed_at' => $today->copy()->setTime(12, 15, 0),
                        'redeemed_by' => $adminUser?->id,
                        'ip_address' => '192.168.1.15',
                        'device_info' => 'Crave Merchant Scanner v2.0 - POS Kasir',
                    ]);
                } else {
                    // Active vouchers ready to be scanned with 60s TTL
                    CanteenVoucher::create([
                        'company_id' => $company->id,
                        'employee_id' => $emp->id,
                        'vendor_id' => null,
                        'voucher_code' => $voucherCode,
                        'encrypted_token' => $token,
                        'meal_date' => $today->format('Y-m-d'),
                        'meal_type' => 'lunch',
                        'nominal_value' => 25000.00,
                        'status' => 'active',
                        'expires_at' => now()->addSeconds(60),
                        'redeemed_at' => null,
                        'redeemed_by' => null,
                    ]);
                }
            }
        }
    }
}
