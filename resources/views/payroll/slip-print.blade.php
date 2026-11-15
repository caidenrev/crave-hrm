@php
function terbilangRupiah($nilai) {
    $nilai = abs((int) round($nilai));
    $huruf = array("", "Satu", "Dua", "Tiga", "Empat", "Lima", "Enam", "Tujuh", "Delapan", "Sembilan", "Sepuluh", "Sebelas");
    $temp = "";
    if ($nilai < 12) {
        $temp = " ". $huruf[$nilai];
    } else if ($nilai < 20) {
        $temp = terbilangRupiah($nilai - 10). " Belas";
    } else if ($nilai < 100) {
        $temp = terbilangRupiah((int)($nilai / 10))." Puluh". terbilangRupiah($nilai % 10);
    } else if ($nilai < 200) {
        $temp = " Seratus" . terbilangRupiah($nilai - 100);
    } else if ($nilai < 1000) {
        $temp = terbilangRupiah((int)($nilai / 100)) . " Ratus" . terbilangRupiah($nilai % 100);
    } else if ($nilai < 2000) {
        $temp = " Seribu" . terbilangRupiah($nilai - 1000);
    } else if ($nilai < 1000000) {
        $temp = terbilangRupiah((int)($nilai / 1000)) . " Ribu" . terbilangRupiah($nilai % 1000);
    } else if ($nilai < 1000000000) {
        $temp = terbilangRupiah((int)($nilai / 1000000)) . " Juta" . terbilangRupiah($nilai % 1000000);
    } else if ($nilai < 1000000000000) {
        $temp = terbilangRupiah((int)($nilai / 1000000000)) . " Milyar" . terbilangRupiah(fmod($nilai,1000000000));
    }
    return trim($temp);
}

$thp = (int) round($item->take_home_pay);
$terbilangText = terbilangRupiah($thp) . " Rupiah";
$slipRef = "SLIP/" . ($item->period->year ?? date('Y')) . "/" . str_pad($item->period->month ?? date('m'), 2, '0', STR_PAD_LEFT) . "/" . str_pad($item->id, 5, '0', STR_PAD_LEFT);
$authHash = strtoupper(substr(hash('sha256', $slipRef . $item->take_home_pay . ($item->employee->nik ?? '000')), 0, 16));
@endphp
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Slip Gaji - {{ $item->employee->nama_lengkap ?? 'Karyawan' }} - {{ $item->period->name ?? '' }}</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
    <style>
        @page {
            size: A4 portrait;
            margin: 12mm 15mm;
        }
        * {
            box-sizing: border-box;
        }
        body {
            font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            color: #0f172a;
            background: #f1f5f9;
            margin: 0;
            padding: 24px;
            font-size: 12px;
            line-height: 1.5;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
        }
        .slip-wrapper {
            max-width: 820px;
            margin: 0 auto;
            background: #ffffff;
            border: 1px solid #cbd5e1;
            border-radius: 12px;
            padding: 36px 40px;
            box-shadow: 0 10px 25px -5px rgba(15, 23, 42, 0.08);
            position: relative;
        }
        /* Formal Top Bar */
        .corporate-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            padding-bottom: 18px;
            border-bottom: 2px solid #0f172a;
        }
        .logo-box {
            display: flex;
            align-items: center;
            gap: 14px;
        }
        .company-logo {
            height: 44px;
            width: auto;
            object-fit: contain;
        }
        .company-info h1 {
            font-size: 18px;
            font-weight: 900;
            letter-spacing: -0.3px;
            color: #0f172a;
            margin: 0 0 2px 0;
            text-transform: uppercase;
        }
        .company-info p {
            margin: 0;
            font-size: 11px;
            color: #475569;
            line-height: 1.35;
        }
        .doc-meta {
            text-align: right;
        }
        .doc-title {
            font-size: 16px;
            font-weight: 800;
            letter-spacing: 0.5px;
            color: #0f172a;
            margin: 0 0 4px 0;
            text-transform: uppercase;
        }
        .confidential-badge {
            display: inline-block;
            background: #0f172a;
            color: #ffffff;
            font-size: 9px;
            font-weight: 800;
            letter-spacing: 1px;
            padding: 3px 8px;
            border-radius: 4px;
            text-transform: uppercase;
            margin-bottom: 4px;
        }
        .doc-meta p {
            margin: 0;
            font-size: 11px;
            color: #64748b;
            font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
        }
        .double-rule {
            border-top: 1px solid #0f172a;
            margin-top: 2px;
            margin-bottom: 20px;
        }
        /* Metadata Grid */
        .meta-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 22px;
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 8px;
            overflow: hidden;
        }
        .meta-table td {
            padding: 7px 12px;
            font-size: 11.5px;
            vertical-align: top;
            border-bottom: 1px solid #f1f5f9;
        }
        .meta-table tr:last-child td {
            border-bottom: none;
        }
        .meta-table .label {
            width: 130px;
            color: #64748b;
            font-weight: 500;
        }
        .meta-table .value {
            font-weight: 700;
            color: #0f172a;
        }
        .meta-divider {
            width: 1px;
            background: #e2e8f0;
            padding: 0 !important;
        }
        /* Accounting Breakdown */
        .breakdown-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
        }
        .breakdown-table th {
            background: #0f172a;
            color: #ffffff;
            font-size: 11px;
            font-weight: 800;
            letter-spacing: 0.5px;
            text-align: left;
            padding: 9px 12px;
            text-transform: uppercase;
        }
        .breakdown-table th.amount-head {
            text-align: right;
            width: 130px;
        }
        .breakdown-table td {
            padding: 7px 12px;
            font-size: 11.5px;
            border-bottom: 1px solid #f1f5f9;
        }
        .breakdown-table .zebra {
            background: #fcfdfe;
        }
        .breakdown-table .amount {
            text-align: right;
            font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
            font-weight: 600;
            color: #0f172a;
        }
        .breakdown-table .subtotal-row {
            background: #f1f5f9;
            font-weight: 800;
            border-top: 2px solid #cbd5e1;
            border-bottom: 2px solid #cbd5e1;
        }
        .breakdown-table .subtotal-row td {
            padding: 8px 12px;
            font-size: 12px;
        }
        /* Take Home Pay Box */
        .thp-container {
            border: 2px solid #0f172a;
            border-radius: 8px;
            background: #f8fafc;
            padding: 14px 18px;
            margin-bottom: 20px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .thp-title {
            font-size: 13px;
            font-weight: 800;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            color: #0f172a;
            margin-bottom: 4px;
        }
        .thp-terbilang {
            font-size: 11px;
            font-style: italic;
            color: #475569;
            line-height: 1.4;
            max-width: 480px;
        }
        .thp-value {
            font-size: 24px;
            font-weight: 900;
            font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
            color: #0f172a;
            letter-spacing: -0.5px;
            text-align: right;
            white-space: nowrap;
        }
        /* Employer Benefits Footnote */
        .employer-box {
            background: #ffffff;
            border: 1px solid #e2e8f0;
            border-radius: 6px;
            padding: 10px 14px;
            margin-bottom: 24px;
            font-size: 10.5px;
            color: #64748b;
            line-height: 1.5;
        }
        .employer-box strong {
            color: #334155;
        }
        /* Signatures */
        .signatures-area {
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
            margin-top: 30px;
            padding-top: 10px;
        }
        .signature-col {
            text-align: center;
            width: 220px;
        }
        .signature-title {
            font-size: 11px;
            color: #475569;
            font-weight: 600;
            margin-bottom: 60px;
        }
        .signature-name {
            font-size: 12px;
            font-weight: 800;
            color: #0f172a;
            border-top: 1px solid #0f172a;
            padding-top: 5px;
        }
        .signature-role {
            font-size: 10px;
            color: #64748b;
        }
        .stamp-box {
            border: 1.5px dashed #0284c7;
            border-radius: 8px;
            padding: 6px 12px;
            display: inline-block;
            color: #0284c7;
            font-size: 9.5px;
            font-weight: 800;
            letter-spacing: 0.5px;
            text-transform: uppercase;
            text-align: center;
        }
        /* Footer */
        .legal-footer {
            margin-top: 26px;
            padding-top: 12px;
            border-top: 1px dashed #cbd5e1;
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 9.5px;
            color: #94a3b8;
        }
        .no-print-toolbar {
            max-width: 820px;
            margin: 0 auto 16px auto;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .btn-action {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            padding: 8px 18px;
            border-radius: 8px;
            font-size: 12px;
            font-weight: 700;
            cursor: pointer;
            border: none;
            transition: all 0.2s;
        }
        .btn-print {
            background: #0f172a;
            color: #ffffff;
        }
        .btn-print:hover {
            background: #1e293b;
        }
        .btn-close {
            background: #e2e8f0;
            color: #334155;
        }
        .btn-close:hover {
            background: #cbd5e1;
        }
        @media print {
            body {
                background: #ffffff;
                padding: 0;
            }
            .slip-wrapper {
                border: none;
                box-shadow: none;
                padding: 0;
                max-width: 100%;
            }
            .no-print-toolbar {
                display: none;
            }
        }
    </style>
</head>
<body>
    <div class="no-print-toolbar">
        <span style="font-size: 12px; color: #64748b; font-weight: 600;">
            Pratinjau Resmi Slip Gaji &bull; {{ $item->period->name ?? '' }}
        </span>
        <div style="display: flex; gap: 8px;">
            <button class="btn-action btn-print" onclick="window.print()">
                🖨️ Cetak / Simpan PDF
            </button>
            <button class="btn-action btn-close" onclick="window.close()">
                Tutup
            </button>
        </div>
    </div>

    <div class="slip-wrapper">
        <!-- Corporate Formal Header -->
        <div class="corporate-header">
            <div class="logo-box">
                <img src="/light-mode-logo.png" alt="Company Logo" class="company-logo" onerror="this.style.display='none'">
                <div class="company-info">
                    <h1>{{ $item->company->name ?? 'CRAVE GLOBAL GROUP (HOLDING)' }}</h1>
                    <p>{{ $item->company->address ?? 'MSIG Tower Floor 38, Jl Jendral Sudirman Kav 21, Jakarta Selatan 12920' }}</p>
                    <p>NPWP: 01.234.567.8-012.000 &bull; Tel: +62 21 5789 1234 &bull; Email: payroll@craveservices.my.id</p>
                </div>
            </div>
            <div class="doc-meta">
                <div class="confidential-badge">Strictly Confidential</div>
                <div class="doc-title">SLIP GAJI KARYAWAN</div>
                <p>{{ $slipRef }}</p>
            </div>
        </div>
        <div class="double-rule"></div>

        <!-- Employee & Tax Metadata Grid -->
        <table class="meta-table">
            <tr>
                <td class="label">Nomor Induk (NIK)</td>
                <td class="value">{{ $item->employee->nik ?? '-' }}</td>
                <td class="meta-divider"></td>
                <td class="label">Periode Upah</td>
                <td class="value">{{ $item->period->name ?? 'November 2026' }}</td>
            </tr>
            <tr>
                <td class="label">Nama Lengkap</td>
                <td class="value">{{ $item->employee->nama_lengkap ?? '-' }}</td>
                <td class="meta-divider"></td>
                <td class="label">Tanggal Transfer</td>
                <td class="value">{{ $item->period->payment_date ? $item->period->payment_date->format('d F Y') : date('d F Y') }}</td>
            </tr>
            <tr>
                <td class="label">Departemen</td>
                <td class="value">{{ $item->employee->department->name ?? 'Divisi Korporat' }}</td>
                <td class="meta-divider"></td>
                <td class="label">Status Pajak &amp; TER</td>
                <td class="value">{{ $item->ptkp_status ?? 'TK/0' }} &bull; TER {{ $item->ter_category ?? 'A' }} ({{ number_format($item->ter_rate, 2) }}%)</td>
            </tr>
            <tr>
                <td class="label">Jabatan</td>
                <td class="value">{{ $item->employee->designation->name ?? '-' }}</td>
                <td class="meta-divider"></td>
                <td class="label">Rekening Bank</td>
                <td class="value">{{ $item->employee->bank_name ?? 'Bank' }} &bull; {{ $item->employee->bank_account_number ?? '-' }}</td>
            </tr>
            <tr>
                <td class="label">Status Kerja</td>
                <td class="value">{{ $item->employee->status_kerja ?? 'PKWTT (Tetap)' }}</td>
                <td class="meta-divider"></td>
                <td class="label">Status Pembayaran</td>
                <td class="value" style="color: #0284c7;">{{ $item->payment_status === 'paid' ? 'LUNAS (PROCESSED)' : 'DRAFT' }}</td>
            </tr>
        </table>

        <!-- Accounting Breakdown Tables (Two Columns) -->
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
            <!-- Column 1: Penghasilan -->
            <div>
                <table class="breakdown-table">
                    <thead>
                        <tr>
                            <th>I. PENGHASILAN (EARNINGS)</th>
                            <th class="amount-head">JUMLAH (RP)</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Gaji Pokok (Basic Salary)</td>
                            <td class="amount">{{ number_format($item->gaji_pokok, 0, ',', '.') }}</td>
                        </tr>
                        @if($item->tunjangan_tetap > 0)
                        <tr class="zebra">
                            <td>Tunjangan Tetap</td>
                            <td class="amount">{{ number_format($item->tunjangan_tetap, 0, ',', '.') }}</td>
                        </tr>
                        @endif
                        @if($item->tunjangan_tidak_tetap > 0)
                        <tr>
                            <td>Tunjangan Variabel / Kehadiran</td>
                            <td class="amount">{{ number_format($item->tunjangan_tidak_tetap, 0, ',', '.') }}</td>
                        </tr>
                        @endif
                        @if($item->uang_lembur > 0)
                        <tr class="zebra">
                            <td>Upah Lembur Resmi (PP 35/2021)</td>
                            <td class="amount">{{ number_format($item->uang_lembur, 0, ',', '.') }}</td>
                        </tr>
                        @endif
                        @if($item->reimbursement_total > 0)
                        <tr>
                            <td>Reimbursement Operasional</td>
                            <td class="amount">{{ number_format($item->reimbursement_total, 0, ',', '.') }}</td>
                        </tr>
                        @endif
                        <!-- Dummy filling for aesthetic balance -->
                        @if(!($item->tunjangan_tetap > 0) && !($item->uang_lembur > 0))
                        <tr class="zebra">
                            <td style="color: #94a3b8; font-style: italic;">Tunjangan Operasional</td>
                            <td class="amount" style="color: #94a3b8;">0</td>
                        </tr>
                        @endif
                        <tr class="subtotal-row">
                            <td>TOTAL PENGHASILAN BRUTO (A)</td>
                            <td class="amount">{{ number_format($item->penghasilan_bruto, 0, ',', '.') }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <!-- Column 2: Potongan -->
            <div>
                <table class="breakdown-table">
                    <thead>
                        <tr>
                            <th>II. POTONGAN (DEDUCTIONS)</th>
                            <th class="amount-head">JUMLAH (RP)</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>PPh 21 TER ({{ number_format($item->ter_rate, 2) }}%)</td>
                            <td class="amount">{{ number_format($item->pph21, 0, ',', '.') }}</td>
                        </tr>
                        <tr class="zebra">
                            <td>BPJS Kesehatan Pekerja (1%)</td>
                            <td class="amount">{{ number_format($item->bpjs_kes_employee, 0, ',', '.') }}</td>
                        </tr>
                        <tr>
                            <td>BPJS Ketenagakerjaan JHT Pekerja (2%)</td>
                            <td class="amount">{{ number_format($item->bpjs_jht_employee, 0, ',', '.') }}</td>
                        </tr>
                        <tr class="zebra">
                            <td>BPJS Ketenagakerjaan JP Pekerja (1%)</td>
                            <td class="amount">{{ number_format($item->bpjs_jp_employee, 0, ',', '.') }}</td>
                        </tr>
                        @if($item->potongan_keterlambatan > 0)
                        <tr>
                            <td>Potongan Absensi &amp; Keterlambatan</td>
                            <td class="amount">{{ number_format($item->potongan_keterlambatan, 0, ',', '.') }}</td>
                        </tr>
                        @endif
                        @if($item->potongan_lainnya > 0)
                        <tr class="zebra">
                            <td>Potongan Lainnya / Pinjaman</td>
                            <td class="amount">{{ number_format($item->potongan_lainnya, 0, ',', '.') }}</td>
                        </tr>
                        @endif
                        <tr class="subtotal-row">
                            <td>TOTAL POTONGAN UPAH (B)</td>
                            <td class="amount">{{ number_format($item->total_potongan, 0, ',', '.') }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <!-- Take Home Pay Executive Banner -->
        <div class="thp-container">
            <div>
                <div class="thp-title">GAJI BERSIH DITERIMA (TAKE HOME PAY = A - B)</div>
                <div class="thp-terbilang">
                    <strong>Terbilang:</strong> {{ $terbilangText }}
                </div>
            </div>
            <div class="thp-value">
                Rp {{ number_format($item->take_home_pay, 0, ',', '.') }}
            </div>
        </div>

        <!-- Employer Benefits Info Box -->
        <div class="employer-box">
            <strong>Catatan Manfaat Kesejahteraan Ditanggung Perusahaan (Tidak Memotong Gaji):</strong><br>
            BPJS Kesehatan (4%): Rp {{ number_format($item->bpjs_kes_company, 0, ',', '.') }} &bull;
            JKK (0.24%): Rp {{ number_format($item->bpjs_jkk, 0, ',', '.') }} &bull;
            JKM (0.30%): Rp {{ number_format($item->bpjs_jkm, 0, ',', '.') }} &bull;
            JHT (3.7%): Rp {{ number_format($item->bpjs_jht_company, 0, ',', '.') }} &bull;
            JP (2%): Rp {{ number_format($item->bpjs_jp_company, 0, ',', '.') }}
        </div>

        <!-- Signatures & Verification Area -->
        <div class="signatures-area">
            <div class="signature-col">
                <div class="signature-title">Diterima Oleh,</div>
                <div class="signature-name">{{ $item->employee->nama_lengkap ?? 'Karyawan' }}</div>
                <div class="signature-role">Karyawan Penerima Upah</div>
            </div>

            <div style="text-align: center;">
                <div class="stamp-box">
                    ★ CRAVE HRM SYSTEM ★<br>
                    DIGITALLY VERIFIED<br>
                    HASH: {{ $authHash }}
                </div>
            </div>

            <div class="signature-col">
                <div class="signature-title">Disahkan Oleh,</div>
                <div class="signature-name">{{ $item->period->processor->name ?? 'Eka Revandi' }}</div>
                <div class="signature-role">Corporate Finance &amp; HR Manager</div>
            </div>
        </div>

        <!-- Legal Disclaimer Footer -->
        <div class="legal-footer">
            <span>Dokumen ini sah dan diterbitkan secara elektronik berdasarkan UU Ketenagakerjaan No. 13/2003, PP No. 36/2021, dan PMK No. 168/2023.</span>
            <span>Ref: {{ $authHash }} &bull; Cetak: {{ date('d/m/Y H:i') }} WIB</span>
        </div>
    </div>
</body>
</html>
