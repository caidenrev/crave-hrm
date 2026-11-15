<?php

namespace App\Services;

use App\Models\PayrollPeriod;
use Illuminate\Support\Collection;

class BankExportService
{
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
            default => $this->generateBca($period, $items),
        };
    }

    protected function generateBca(PayrollPeriod $period, Collection $items): array
    {
        $filename = "BCA_Payroll_{$period->year}_{$period->month}.csv";
        $lines = [];
        $lines[] = "Nomor Rekening,Nama Penerima,Nominal,Berita Transfer,Email";

        foreach ($items as $item) {
            $account = $item->employee->bank_account_number ?? '0000000000';
            $name = str_replace(',', ' ', $item->employee->nama_lengkap ?? 'Karyawan');
            $amount = (int) round($item->take_home_pay);
            $note = "Gaji {$period->name}";
            $email = $item->employee->email ?? '';

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
            $account = $item->employee->bank_account_number ?? '0000000000';
            $name = str_replace(',', ' ', $item->employee->nama_lengkap ?? 'Karyawan');
            $amount = (int) round($item->take_home_pay);
            $note = "Gaji {$period->name}";

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
            $account = $item->employee->bank_account_number ?? '0000000000';
            $name = str_replace('|', ' ', $item->employee->nama_lengkap ?? 'Karyawan');
            $amount = (int) round($item->take_home_pay);
            $note = "Gaji {$period->name}";

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
            $account = $item->employee->bank_account_number ?? '0000000000';
            $name = str_replace(',', ' ', $item->employee->nama_lengkap ?? 'Karyawan');
            $amount = (int) round($item->take_home_pay);
            $note = "Payroll {$period->name}";

            $lines[] = "{$account},{$name},{$amount},IDR,{$note}";
        }

        return [
            'filename' => $filename,
            'content' => implode("\r\n", $lines),
            'mime_type' => 'text/plain',
        ];
    }
}

