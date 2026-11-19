<?php

namespace App\Services;

use App\Models\PayrollPeriod;
use Illuminate\Support\Collection;

class BankExportService
{
    public const SUPPORTED_BANKS = [
        'BCA',
        'MANDIRI',
        'BRI',
        'BNI',
        'BSI',
        'CIMB',
        'PERMATA',
        'DANAMON',
        'BTN',
    ];

    /**
     * Neutralize spreadsheet formula injection payloads (=, +, -, @, tab, CR)
     * and strip delimiter characters for safe CSV/TXT export.
     */
    public static function sanitizeCell(?string $value, string $stripChars = ','): string
    {
        $clean = str_replace(["\r", "\n"], ' ', (string) ($value ?? ''));
        if ($stripChars !== '') {
            $clean = str_replace(str_split($stripChars), ' ', $clean);
        }
        $clean = trim($clean);

        if ($clean !== '' && in_array($clean[0], ['=', '+', '-', '@', "\t"], true)) {
            $clean = "'" . $clean;
        }

        return str_replace('"', '""', $clean);
    }

    /**
     * Generate file content and metadata for bank corporate batch transfer.
     */
    public function generateExport(PayrollPeriod $period, string $bankFormat): array
    {
        $period->load(['items.employee', 'company']);
        $items = $period->items->filter(fn($item) => $item->take_home_pay > 0);

        $bankFormat = strtoupper(trim($bankFormat));

        return match ($bankFormat) {
            'BCA' => $this->generateBca($period, $items),
            'MANDIRI' => $this->generateMandiri($period, $items),
            'BRI' => $this->generateBri($period, $items),
            'BNI' => $this->generateBni($period, $items),
            'BSI' => $this->generateBsi($period, $items),
            'CIMB' => $this->generateCimb($period, $items),
            'PERMATA' => $this->generatePermata($period, $items),
            'DANAMON' => $this->generateDanamon($period, $items),
            'BTN' => $this->generateBtn($period, $items),
            default => $this->generateBca($period, $items),
        };
    }

    protected function generateBca(PayrollPeriod $period, Collection $items): array
    {
        $filename = "BCA_Payroll_{$period->year}_{$period->month}.csv";
        $lines = [];
        $lines[] = "Nomor Rekening,Nama Penerima,Nominal,Berita Transfer,Email";

        foreach ($items as $item) {
            $account = self::sanitizeCell($item->employee->bank_account_number ?? '0000000000');
            $name = self::sanitizeCell($item->employee->nama_lengkap ?? 'Karyawan');
            $amount = (int) round($item->take_home_pay);
            $note = self::sanitizeCell("Gaji {$period->name}");
            $email = self::sanitizeCell($item->employee->email ?? '');

            $lines[] = "{$account},\"{$name}\",{$amount},\"{$note}\",{$email}";
        }

        return [
            'filename' => $filename,
            'content' => implode("\r\n", $lines),
            'mime_type' => 'text/csv',
        ];
    }

    protected function generateMandiri(PayrollPeriod $period, Collection $items): array
    {
        $filename = "MCM_Payroll_{$period->year}_{$period->month}.csv";
        $lines = [];
        $lines[] = "Tanggal Efektif,Rekening Sumber,Rekening Tujuan,Nama Penerima,Mata Uang,Nominal,Keterangan";

        $date = $period->payment_date ? $period->payment_date->format('Ymd') : date('Ymd');
        $sourceAccount = "1200012345678";

        foreach ($items as $item) {
            $account = self::sanitizeCell($item->employee->bank_account_number ?? '0000000000');
            $name = self::sanitizeCell($item->employee->nama_lengkap ?? 'Karyawan');
            $amount = (int) round($item->take_home_pay);
            $note = self::sanitizeCell("Gaji {$period->name}");

            $lines[] = "{$date},{$sourceAccount},{$account},\"{$name}\",IDR,{$amount},\"{$note}\"";
        }

        return [
            'filename' => $filename,
            'content' => implode("\r\n", $lines),
            'mime_type' => 'text/csv',
        ];
    }

    protected function generateBri(PayrollPeriod $period, Collection $items): array
    {
        $filename = "BRI_CMS_Payroll_{$period->year}_{$period->month}.txt";
        $lines = [];

        foreach ($items as $item) {
            $account = self::sanitizeCell($item->employee->bank_account_number ?? '0000000000', '|');
            $name = self::sanitizeCell($item->employee->nama_lengkap ?? 'Karyawan', '|');
            $amount = (int) round($item->take_home_pay);
            $note = self::sanitizeCell("Gaji {$period->name}", '|');

            $lines[] = "001|{$account}|{$name}|{$amount}|{$note}";
        }

        return [
            'filename' => $filename,
            'content' => implode("\r\n", $lines),
            'mime_type' => 'text/plain',
        ];
    }

    protected function generateBni(PayrollPeriod $period, Collection $items): array
    {
        $filename = "BNI_Direct_Payroll_{$period->year}_{$period->month}.txt";
        $lines = [];

        foreach ($items as $item) {
            $account = self::sanitizeCell($item->employee->bank_account_number ?? '0000000000');
            $name = self::sanitizeCell($item->employee->nama_lengkap ?? 'Karyawan');
            $amount = (int) round($item->take_home_pay);
            $note = self::sanitizeCell("Payroll {$period->name}");

            $lines[] = "{$account},{$name},{$amount},IDR,{$note}";
        }

        return [
            'filename' => $filename,
            'content' => implode("\r\n", $lines),
            'mime_type' => 'text/plain',
        ];
    }

    protected function generateBsi(PayrollPeriod $period, Collection $items): array
    {
        $filename = "BSI_Payroll_{$period->year}_{$period->month}.csv";
        $lines = [];
        $lines[] = "Tanggal,Rekening Tujuan,Nama Penerima,Mata Uang,Nominal,Keterangan,Email";

        $date = $period->payment_date ? $period->payment_date->format('Ymd') : date('Ymd');

        foreach ($items as $item) {
            $account = self::sanitizeCell($item->employee->bank_account_number ?? '0000000000');
            $name = self::sanitizeCell($item->employee->nama_lengkap ?? 'Karyawan');
            $amount = (int) round($item->take_home_pay);
            $note = self::sanitizeCell("Gaji {$period->name}");
            $email = self::sanitizeCell($item->employee->email ?? '');

            $lines[] = "{$date},{$account},\"{$name}\",IDR,{$amount},\"{$note}\",{$email}";
        }

        return [
            'filename' => $filename,
            'content' => implode("\r\n", $lines),
            'mime_type' => 'text/csv',
        ];
    }

    protected function generateCimb(PayrollPeriod $period, Collection $items): array
    {
        $filename = "CIMB_BizChannel_Payroll_{$period->year}_{$period->month}.csv";
        $lines = [];
        $lines[] = "Credit Account,Beneficiary Name,Currency,Amount,Payment Reference,Beneficiary Email";

        foreach ($items as $item) {
            $account = self::sanitizeCell($item->employee->bank_account_number ?? '0000000000');
            $name = self::sanitizeCell($item->employee->nama_lengkap ?? 'Karyawan');
            $amount = (int) round($item->take_home_pay);
            $note = self::sanitizeCell("Payroll {$period->name}");
            $email = self::sanitizeCell($item->employee->email ?? '');

            $lines[] = "{$account},\"{$name}\",IDR,{$amount},\"{$note}\",{$email}";
        }

        return [
            'filename' => $filename,
            'content' => implode("\r\n", $lines),
            'mime_type' => 'text/csv',
        ];
    }

    protected function generatePermata(PayrollPeriod $period, Collection $items): array
    {
        $filename = "Permata_eBusiness_Payroll_{$period->year}_{$period->month}.csv";
        $lines = [];
        $lines[] = "No Rekening,Nama Penerima,Nominal,Mata Uang,Deskripsi,Email";

        foreach ($items as $item) {
            $account = self::sanitizeCell($item->employee->bank_account_number ?? '0000000000');
            $name = self::sanitizeCell($item->employee->nama_lengkap ?? 'Karyawan');
            $amount = (int) round($item->take_home_pay);
            $note = self::sanitizeCell("Gaji {$period->name}");
            $email = self::sanitizeCell($item->employee->email ?? '');

            $lines[] = "{$account},\"{$name}\",{$amount},IDR,\"{$note}\",{$email}";
        }

        return [
            'filename' => $filename,
            'content' => implode("\r\n", $lines),
            'mime_type' => 'text/csv',
        ];
    }

    protected function generateDanamon(PayrollPeriod $period, Collection $items): array
    {
        $filename = "Danamon_CashConnect_Payroll_{$period->year}_{$period->month}.csv";
        $lines = [];
        $lines[] = "Value Date,Beneficiary Account,Beneficiary Name,Currency,Transfer Amount,Remarks";

        $date = $period->payment_date ? $period->payment_date->format('Ymd') : date('Ymd');

        foreach ($items as $item) {
            $account = self::sanitizeCell($item->employee->bank_account_number ?? '0000000000');
            $name = self::sanitizeCell($item->employee->nama_lengkap ?? 'Karyawan');
            $amount = (int) round($item->take_home_pay);
            $note = self::sanitizeCell("Gaji {$period->name}");

            $lines[] = "{$date},{$account},\"{$name}\",IDR,{$amount},\"{$note}\"";
        }

        return [
            'filename' => $filename,
            'content' => implode("\r\n", $lines),
            'mime_type' => 'text/csv',
        ];
    }

    protected function generateBtn(PayrollPeriod $period, Collection $items): array
    {
        $filename = "BTN_CMS_Payroll_{$period->year}_{$period->month}.csv";
        $lines = [];
        $lines[] = "Rekening Tujuan,Nama Penerima,Nominal,Berita,Email";

        foreach ($items as $item) {
            $account = self::sanitizeCell($item->employee->bank_account_number ?? '0000000000');
            $name = self::sanitizeCell($item->employee->nama_lengkap ?? 'Karyawan');
            $amount = (int) round($item->take_home_pay);
            $note = self::sanitizeCell("Payroll {$period->name}");
            $email = self::sanitizeCell($item->employee->email ?? '');

            $lines[] = "{$account},\"{$name}\",{$amount},\"{$note}\",{$email}";
        }

        return [
            'filename' => $filename,
            'content' => implode("\r\n", $lines),
            'mime_type' => 'text/csv',
        ];
    }
}
