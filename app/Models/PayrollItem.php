<?php

namespace App\Models;

use App\Traits\BelongsToCompany;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PayrollItem extends Model
{
    use HasFactory, BelongsToCompany;

    protected $fillable = [
        'company_id',
        'payroll_period_id',
        'employee_id',
        'gaji_pokok',
        'tunjangan_tetap',
        'tunjangan_tidak_tetap',
        'uang_lembur',
        'reimbursement_total',
        'penghasilan_bruto',
        'bpjs_kes_company',
        'bpjs_jkk',
        'bpjs_jkm',
        'bpjs_jht_company',
        'bpjs_jp_company',
        'bpjs_kes_employee',
        'bpjs_jht_employee',
        'bpjs_jp_employee',
        'pph21',
        'potongan_keterlambatan',
        'potongan_lainnya',
        'total_potongan',
        'take_home_pay',
        'ptkp_status',
        'ter_category',
        'ter_rate',
        'payment_status',
        'paid_at',
        'details',
    ];

    protected $casts = [
        'gaji_pokok' => 'decimal:2',
        'tunjangan_tetap' => 'decimal:2',
        'tunjangan_tidak_tetap' => 'decimal:2',
        'uang_lembur' => 'decimal:2',
        'reimbursement_total' => 'decimal:2',
        'penghasilan_bruto' => 'decimal:2',
        'bpjs_kes_company' => 'decimal:2',
        'bpjs_jkk' => 'decimal:2',
        'bpjs_jkm' => 'decimal:2',
        'bpjs_jht_company' => 'decimal:2',
        'bpjs_jp_company' => 'decimal:2',
        'bpjs_kes_employee' => 'decimal:2',
        'bpjs_jht_employee' => 'decimal:2',
        'bpjs_jp_employee' => 'decimal:2',
        'pph21' => 'decimal:2',
        'potongan_keterlambatan' => 'decimal:2',
        'potongan_lainnya' => 'decimal:2',
        'total_potongan' => 'decimal:2',
        'take_home_pay' => 'decimal:2',
        'ter_rate' => 'decimal:2',
        'paid_at' => 'datetime',
        'details' => 'array',
    ];

    public function company(): BelongsTo
    {
        return $this->belongsTo(Company::class);
    }

    public function period(): BelongsTo
    {
        return $this->belongsTo(PayrollPeriod::class, 'payroll_period_id');
    }

    public function payrollPeriod(): BelongsTo
    {
        return $this->belongsTo(PayrollPeriod::class, 'payroll_period_id');
    }

    public function getGajiBersihAttribute()
    {
        return $this->take_home_pay;
    }

    public function employee(): BelongsTo
    {
        return $this->belongsTo(Employee::class);
    }
}

