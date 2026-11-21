<?php

namespace App\Models;

use App\Traits\BelongsToCompany;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class LeaveType extends Model
{
    use HasFactory, BelongsToCompany;

    protected $fillable = [
        'company_id',
        'name',
        'code',
        'days_allocated',
        'is_paid',
        'requires_attachment',
        'is_active',
        'description',
    ];

    protected $casts = [
        'days_allocated' => 'integer',
        'is_paid' => 'boolean',
        'requires_attachment' => 'boolean',
        'is_active' => 'boolean',
    ];

    public function company(): BelongsTo
    {
        return $this->belongsTo(Company::class);
    }

    public function leaveBalances(): HasMany
    {
        return $this->hasMany(LeaveBalance::class);
    }

    public function leaveRequests(): HasMany
    {
        return $this->hasMany(LeaveRequest::class);
    }

    /**
     * Auto-seed default Indonesian statutory leave types for a company.
     */
    public static function seedDefaultsForCompany(int $companyId): void
    {
        $defaultTypes = [
            [
                'name' => 'Cuti Tahunan',
                'code' => 'ANNUAL',
                'days_allocated' => 12,
                'is_paid' => true,
                'requires_attachment' => false,
                'description' => 'Hak cuti tahunan resmi 12 hari kerja per tahun kalender.',
            ],
            [
                'name' => 'Cuti Sakit',
                'code' => 'SICK',
                'days_allocated' => 14,
                'is_paid' => true,
                'requires_attachment' => true,
                'description' => 'Izin sakit. Wajib melampirkan surat keterangan dokter jika lebih dari 1 hari.',
            ],
            [
                'name' => 'Cuti Melahirkan / Hamil',
                'code' => 'MATERNITY',
                'days_allocated' => 90,
                'is_paid' => true,
                'requires_attachment' => true,
                'description' => 'Hak cuti bersalin bagi karyawati (3 bulan / 90 hari kalender).',
            ],
            [
                'name' => 'Cuti Menikah',
                'code' => 'MARRIAGE',
                'days_allocated' => 3,
                'is_paid' => true,
                'requires_attachment' => false,
                'description' => 'Cuti pernikahan resmi karyawan (3 hari kerja).',
            ],
            [
                'name' => 'Cuti Duka Cita',
                'code' => 'BEREAVEMENT',
                'days_allocated' => 2,
                'is_paid' => true,
                'requires_attachment' => false,
                'description' => 'Cuti kedukaan anggota keluarga inti meninggal dunia (2 hari kerja).',
            ],
            [
                'name' => 'Izin Tidak Berbayar (Unpaid)',
                'code' => 'UNPAID',
                'days_allocated' => 0,
                'is_paid' => false,
                'requires_attachment' => false,
                'description' => 'Izin keperluan pribadi tanpa tunjangan gaji harian.',
            ],
        ];

        foreach ($defaultTypes as $type) {
            static::firstOrCreate(
                [
                    'company_id' => $companyId,
                    'code' => $type['code'],
                ],
                array_merge($type, ['company_id' => $companyId, 'is_active' => true])
            );
        }
    }
}
