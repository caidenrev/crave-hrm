<?php

namespace App\Services;

use App\Models\Employee;
use Carbon\Carbon;
use Exception;

class OvertimeCalculatorService
{
    /**
     * Constant divisor defined in Indonesian PP 35/2021.
     */
    public const HOURLY_RATE_DIVISOR = 173;

    /**
     * Calculate hourly wage rate based on employee's base salary (1/173).
     */
    public function calculateHourlyRate(float $monthlySalary): float
    {
        if ($monthlySalary <= 0) {
            return 0.0;
        }

        return round($monthlySalary / self::HOURLY_RATE_DIVISOR, 2);
    }

    /**
     * Calculate duration in decimal hours between start_time and end_time.
     */
    public function calculateDurationHours(string $startTime, string $endTime): float
    {
        $start = Carbon::parse($startTime);
        $end = Carbon::parse($endTime);

        if ($end->lessThanOrEqualTo($start)) {
            // Handle overnight shifts if end time is next day
            $end->addDay();
        }

        $minutes = $start->diffInMinutes($end);
        return round($minutes / 60, 2);
    }

    /**
     * Calculate multiplier equivalent hours under PP 35/2021 rules.
     *
     * @param float $durationHours
     * @param string $dayType ('workday', 'weekend', 'holiday')
     * @return float
     */
    public function calculateMultiplierHours(float $durationHours, string $dayType = 'workday'): float
    {
        if ($durationHours <= 0) {
            return 0.0;
        }

        $remaining = $durationHours;
        $totalMultiplier = 0.0;

        if ($dayType === 'workday') {
            // Hari kerja: Jam pertama 1.5x, jam berikutnya 2x
            if ($remaining >= 1.0) {
                $totalMultiplier += 1.0 * 1.5;
                $remaining -= 1.0;
            } else {
                $totalMultiplier += $remaining * 1.5;
                $remaining = 0;
            }

            if ($remaining > 0) {
                $totalMultiplier += $remaining * 2.0;
            }
        } else {
            // Hari istirahat mingguan / libur resmi:
            // 8 jam pertama: 2x
            // Jam ke-9: 3x
            // Jam ke-10 dan seterusnya: 4x
            $firstTier = min($remaining, 8.0);
            $totalMultiplier += $firstTier * 2.0;
            $remaining -= $firstTier;

            if ($remaining > 0) {
                $secondTier = min($remaining, 1.0);
                $totalMultiplier += $secondTier * 3.0;
                $remaining -= $secondTier;
            }

            if ($remaining > 0) {
                $totalMultiplier += $remaining * 4.0;
            }
        }

        return round($totalMultiplier, 2);
    }

    /**
     * Compute full overtime package for an employee submission.
     *
     * @return array{duration_hours: float, hourly_rate: float, multiplier_hours: float, estimated_amount: float}
     */
    public function calculateOvertime(Employee $employee, string $startTime, string $endTime, string $dayType = 'workday'): array
    {
        $durationHours = $this->calculateDurationHours($startTime, $endTime);
        $baseSalary = (float) ($employee->gaji_pokok ?? 0);
        $hourlyRate = $this->calculateHourlyRate($baseSalary);
        $multiplierHours = $this->calculateMultiplierHours($durationHours, $dayType);
        $estimatedAmount = round($multiplierHours * $hourlyRate, 2);

        return [
            'duration_hours' => $durationHours,
            'hourly_rate' => $hourlyRate,
            'multiplier_hours' => $multiplierHours,
            'estimated_amount' => $estimatedAmount,
        ];
    }
}
