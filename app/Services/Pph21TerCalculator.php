<?php

namespace App\Services;

class Pph21TerCalculator
{
    /**
     * Map PTKP status to TER Category (A, B, or C).
     */
    public function getTerCategory(?string $ptkpStatus): string
    {
        $status = strtoupper(trim((string) $ptkpStatus));

        return match ($status) {
            'TK/0', 'TK/1', 'K/0' => 'A',
            'TK/2', 'TK/3', 'K/1', 'K/2' => 'B',
            'K/3' => 'C',
            default => 'A',
        };
    }

    /**
     * Calculate monthly PPh 21 based on gross income and PTKP status.
     *
     * @param float $grossIncome
     * @param string|null $ptkpStatus
     * @return array{category: string, rate: float, tax_amount: float}
     */
    public function calculateMonthlyTax(float $grossIncome, ?string $ptkpStatus): array
    {
        $category = $this->getTerCategory($ptkpStatus);
        $rate = $this->lookupTerRate($grossIncome, $category);
        $taxAmount = round(($grossIncome * $rate) / 100, 2);

        return [
            'category' => $category,
            'rate' => $rate,
            'tax_amount' => $taxAmount,
        ];
    }

    /**
     * Lookup official 2024 TER rate in percent.
     */
    public function lookupTerRate(float $grossIncome, string $category): float
    {
        if ($grossIncome <= 0) {
            return 0.0;
        }

        return match ($category) {
            'A' => $this->lookupCategoryA($grossIncome),
            'B' => $this->lookupCategoryB($grossIncome),
            'C' => $this->lookupCategoryC($grossIncome),
            default => $this->lookupCategoryA($grossIncome),
        };
    }

    private function lookupCategoryA(float $income): float
    {
        if ($income <= 5400000) return 0.0;
        if ($income <= 5650000) return 0.25;
        if ($income <= 5950000) return 0.5;
        if ($income <= 6300000) return 0.75;
        if ($income <= 6750000) return 1.0;
        if ($income <= 7500000) return 1.25;
        if ($income <= 8550000) return 1.5;
        if ($income <= 9650000) return 1.75;
        if ($income <= 10050000) return 2.0;
        if ($income <= 10350000) return 2.25;
        if ($income <= 10700000) return 2.5;
        if ($income <= 11050000) return 3.0;
        if ($income <= 11600000) return 3.5;
        if ($income <= 12500000) return 4.0;
        if ($income <= 13750000) return 5.0;
        if ($income <= 15100000) return 6.0;
        if ($income <= 16950000) return 7.0;
        if ($income <= 19750000) return 8.0;
        if ($income <= 24150000) return 9.0;
        if ($income <= 26450000) return 10.0;
        if ($income <= 28000000) return 11.0;
        if ($income <= 30050000) return 12.0;
        if ($income <= 32400000) return 13.0;
        if ($income <= 35400000) return 14.0;
        if ($income <= 39100000) return 15.0;
        if ($income <= 43850000) return 16.0;
        if ($income <= 47800000) return 17.0;
        if ($income <= 51400000) return 18.0;
        if ($income <= 56300000) return 19.0;
        if ($income <= 62200000) return 20.0;
        if ($income <= 68600000) return 21.0;
        if ($income <= 77500000) return 22.0;
        if ($income <= 89000000) return 23.0;
        if ($income <= 103000000) return 24.0;
        if ($income <= 125000000) return 25.0;
        if ($income <= 157000000) return 26.0;
        if ($income <= 206000000) return 27.0;
        if ($income <= 337000000) return 28.0;
        if ($income <= 454000000) return 29.0;
        if ($income <= 550000000) return 30.0;
        if ($income <= 695000000) return 31.0;
        if ($income <= 910000000) return 32.0;
        if ($income <= 1400000000) return 33.0;
        return 34.0;
    }

    private function lookupCategoryB(float $income): float
    {
        if ($income <= 6200000) return 0.0;
        if ($income <= 6500000) return 0.25;
        if ($income <= 6850000) return 0.5;
        if ($income <= 7300000) return 0.75;
        if ($income <= 9200000) return 1.0;
        if ($income <= 10750000) return 1.5;
        if ($income <= 12550000) return 2.0;
        if ($income <= 13700000) return 3.0;
        if ($income <= 15100000) return 4.0;
        if ($income <= 16950000) return 5.0;
        if ($income <= 19750000) return 6.0;
        if ($income <= 24150000) return 7.0;
        if ($income <= 26450000) return 8.0;
        if ($income <= 28000000) return 9.0;
        if ($income <= 30050000) return 10.0;
        if ($income <= 32400000) return 11.0;
        if ($income <= 35400000) return 12.0;
        if ($income <= 39100000) return 13.0;
        if ($income <= 43850000) return 14.0;
        if ($income <= 47800000) return 15.0;
        if ($income <= 51400000) return 16.0;
        if ($income <= 56300000) return 17.0;
        if ($income <= 62200000) return 18.0;
        if ($income <= 68600000) return 19.0;
        if ($income <= 77500000) return 20.0;
        if ($income <= 89000000) return 21.0;
        if ($income <= 103000000) return 22.0;
        if ($income <= 125000000) return 23.0;
        if ($income <= 157000000) return 24.0;
        if ($income <= 206000000) return 25.0;
        if ($income <= 337000000) return 26.0;
        if ($income <= 454000000) return 27.0;
        if ($income <= 550000000) return 28.0;
        if ($income <= 695000000) return 29.0;
        if ($income <= 910000000) return 30.0;
        if ($income <= 1400000000) return 31.0;
        if ($income <= 1405000000) return 32.0;
        if ($income <= 1411000000) return 33.0;
        return 34.0;
    }

    private function lookupCategoryC(float $income): float
    {
        if ($income <= 6600000) return 0.0;
        if ($income <= 6950000) return 0.25;
        if ($income <= 7350000) return 0.5;
        if ($income <= 7800000) return 0.75;
        if ($income <= 8850000) return 1.0;
        if ($income <= 9800000) return 1.25;
        if ($income <= 10950000) return 1.5;
        if ($income <= 11200000) return 1.75;
        if ($income <= 12050000) return 2.0;
        if ($income <= 12950000) return 3.0;
        if ($income <= 14150000) return 4.0;
        if ($income <= 15550000) return 5.0;
        if ($income <= 17050000) return 6.0;
        if ($income <= 19500000) return 7.0;
        if ($income <= 22700000) return 8.0;
        if ($income <= 24750000) return 9.0;
        if ($income <= 26750000) return 10.0;
        if ($income <= 29250000) return 11.0;
        if ($income <= 32750000) return 12.0;
        if ($income <= 36400000) return 13.0;
        if ($income <= 41400000) return 14.0;
        if ($income <= 45850000) return 15.0;
        if ($income <= 49500000) return 16.0;
        if ($income <= 53850000) return 17.0;
        if ($income <= 58500000) return 18.0;
        if ($income <= 64000000) return 19.0;
        if ($income <= 71000000) return 20.0;
        if ($income <= 80000000) return 21.0;
        if ($income <= 93000000) return 22.0;
        if ($income <= 109000000) return 23.0;
        if ($income <= 129000000) return 24.0;
        if ($income <= 163000000) return 25.0;
        if ($income <= 211000000) return 26.0;
        if ($income <= 374000000) return 27.0;
        if ($income <= 459000000) return 28.0;
        if ($income <= 555000000) return 29.0;
        if ($income <= 704000000) return 30.0;
        if ($income <= 957000000) return 31.0;
        if ($income <= 1405000000) return 32.0;
        if ($income <= 1419000000) return 33.0;
        return 34.0;
    }
}

