<?php

namespace App\Services;

class BpjsCalculator
{
    public const MAX_WAGE_KES = 12000000.0;
    public const MAX_WAGE_JP = 10042300.0;

    /**
     * Calculate all BPJS health and employment contributions.
     *
     * @param float $baseWage Basic wage + fixed allowance
     * @param float $jkkRate Percentage rate for JKK (default 0.24% for low risk)
     * @return array
     */
    public function calculate(float $baseWage, float $jkkRate = 0.24): array
    {
        $wage = max(0.0, $baseWage);

        // BPJS Kesehatan (Cap Rp 12.000.000)
        $wageKes = min($wage, self::MAX_WAGE_KES);
        $bpjsKesCompany = round($wageKes * 0.04, 2);
        $bpjsKesEmployee = round($wageKes * 0.01, 2);

        // BPJS Ketenagakerjaan
        // JKK & JKM (perusahaan saja, tanpa cap)
        $bpjsJkk = round($wage * ($jkkRate / 100), 2);
        $bpjsJkm = round($wage * 0.003, 2); // 0.30%

        // JHT (3.7% perusahaan, 2.0% karyawan, tanpa cap)
        $bpjsJhtCompany = round($wage * 0.037, 2);
        $bpjsJhtEmployee = round($wage * 0.020, 2);

        // JP (2.0% perusahaan, 1.0% karyawan, cap Rp 10.042.300)
        $wageJp = min($wage, self::MAX_WAGE_JP);
        $bpjsJpCompany = round($wageJp * 0.02, 2);
        $bpjsJpEmployee = round($wageJp * 0.01, 2);

        $totalCompany = round(
            $bpjsKesCompany + $bpjsJkk + $bpjsJkm + $bpjsJhtCompany + $bpjsJpCompany,
            2
        );

        $totalEmployee = round(
            $bpjsKesEmployee + $bpjsJhtEmployee + $bpjsJpEmployee,
            2
        );

        return [
            'bpjs_kes_company' => $bpjsKesCompany,
            'bpjs_kes_employee' => $bpjsKesEmployee,
            'bpjs_jkk' => $bpjsJkk,
            'bpjs_jkm' => $bpjsJkm,
            'bpjs_jht_company' => $bpjsJhtCompany,
            'bpjs_jht_employee' => $bpjsJhtEmployee,
            'bpjs_jp_company' => $bpjsJpCompany,
            'bpjs_jp_employee' => $bpjsJpEmployee,
            'total_company' => $totalCompany,
            'total_employee' => $totalEmployee,
        ];
    }
}

