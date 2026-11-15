<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Surat Penawaran Kerja - {{ $candidate->full_name }}</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
    <style>
        @page {
            size: A4 portrait;
            margin: 15mm 20mm;
        }
        * {
            box-sizing: border-box;
        }
        body {
            font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            color: #0f172a;
            background: #f8fafc;
            margin: 0;
            padding: 30px;
            font-size: 13px;
            line-height: 1.6;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
        }
        .letter-wrapper {
            max-width: 800px;
            margin: 0 auto;
            background: #ffffff;
            border: 1px solid #cbd5e1;
            border-radius: 12px;
            padding: 45px 50px;
            box-shadow: 0 10px 25px -5px rgba(15, 23, 42, 0.08);
        }
        .header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            padding-bottom: 20px;
            border-bottom: 2px solid #0f172a;
        }
        .logo-box img {
            height: 48px;
            width: auto;
            object-fit: contain;
        }
        .company-info h1 {
            font-size: 18px;
            font-weight: 900;
            margin: 0 0 4px 0;
            color: #0f172a;
            letter-spacing: -0.3px;
            text-transform: uppercase;
        }
        .company-info p {
            margin: 0;
            font-size: 11px;
            color: #475569;
        }
        .doc-meta {
            text-align: right;
            font-size: 11px;
            color: #475569;
        }
        .doc-meta .badge {
            display: inline-block;
            background: #0f172a;
            color: #ffffff;
            font-size: 9px;
            font-weight: 800;
            letter-spacing: 1px;
            padding: 4px 10px;
            border-radius: 4px;
            text-transform: uppercase;
            margin-bottom: 6px;
        }
        .double-rule {
            border-top: 1px solid #0f172a;
            margin-top: 2px;
            margin-bottom: 25px;
        }
        .letter-title {
            text-align: center;
            font-size: 16px;
            font-weight: 900;
            letter-spacing: 0.5px;
            text-transform: uppercase;
            color: #0f172a;
            margin-bottom: 25px;
            text-decoration: underline;
            text-underline-offset: 4px;
        }
        .salutation {
            margin-bottom: 18px;
        }
        .table-offer {
            width: 100%;
            border-collapse: collapse;
            margin: 18px 0;
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 8px;
            overflow: hidden;
        }
        .table-offer td {
            padding: 8px 14px;
            font-size: 12px;
            border-bottom: 1px solid #e2e8f0;
            vertical-align: top;
        }
        .table-offer tr:last-child td {
            border-bottom: none;
        }
        .table-offer .label {
            width: 220px;
            color: #64748b;
            font-weight: 600;
        }
        .table-offer .value {
            font-weight: 700;
            color: #0f172a;
        }
        .signatures {
            display: flex;
            justify-content: space-between;
            margin-top: 45px;
            page-break-inside: avoid;
        }
        .signature-box {
            width: 260px;
            text-align: center;
        }
        .signature-space {
            height: 70px;
        }
        .signature-name {
            font-weight: 800;
            font-size: 13px;
            border-bottom: 1px solid #0f172a;
            padding-bottom: 4px;
            margin-bottom: 4px;
        }
        .signature-role {
            font-size: 11px;
            color: #64748b;
        }
        .no-print-bar {
            max-width: 800px;
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
        .btn-close {
            background: #e2e8f0;
            color: #334155;
        }
        @media print {
            body {
                background: #ffffff;
                padding: 0;
            }
            .letter-wrapper {
                border: none;
                box-shadow: none;
                padding: 0;
                max-width: 100%;
            }
            .no-print-bar {
                display: none;
            }
        }
    </style>
</head>
<body>
    <div class="no-print-bar">
        <span style="font-size: 12px; color: #64748b; font-weight: 600;">
            Pratinjau Resmi Surat Penawaran Kerja &bull; Ref: {{ $refNumber }}
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

    <div class="letter-wrapper">
        <div class="header">
            <div class="logo-box">
                <img src="/light-mode-logo.png" alt="Company Logo" onerror="this.style.display='none'">
                <div class="company-info" style="margin-top: 8px;">
                    <h1>{{ $company->name ?? 'PT CRAVE GLOBAL GROUP' }}</h1>
                    <p>{{ $company->address ?? 'MSIG Tower Lantai 38, Jl. Jend. Sudirman Kav 21, Jakarta Selatan 12920' }}</p>
                    <p>Tel: +62 21 5789 1234 &bull; Email: talent@craveservices.my.id &bull; Web: www.craveservices.my.id</p>
                </div>
            </div>
            <div class="doc-meta">
                <div class="badge">Official Job Offer</div>
                <p><strong>Ref:</strong> {{ $refNumber }}</p>
                <p><strong>Tanggal:</strong> {{ $letterDate }}</p>
            </div>
        </div>
        <div class="double-rule"></div>

        <div class="letter-title">SURAT PENAWARAN KERJA (OFFERING LETTER)</div>

        <div class="salutation">
            Kepada Yth,<br>
            <strong>{{ $candidate->full_name }}</strong><br>
            Email: {{ $candidate->email }} &bull; Tel: {{ $candidate->phone }}<br>
            Di Tempat
        </div>

        <p>
            Dengan hormat,<br>
            Sehubungan dengan rangkaian proses seleksi dan wawancara yang telah Anda lalui dengan hasil yang sangat baik, kami dari <strong>{{ $company->name ?? 'Crave Group' }}</strong> dengan bangga dan antusias menyampaikan penawaran kerja resmi kepada Anda untuk bergabung bersama tim kami dengan rincian sebagai berikut:
        </p>

        <table class="table-offer">
            <tr>
                <td class="label">Posisi / Jabatan</td>
                <td class="value">{{ $job->title ?? 'Software Engineer' }}</td>
            </tr>
            <tr>
                <td class="label">Departemen / Divisi</td>
                <td class="value">{{ $job->department?->name ?? 'Technology & Product' }}</td>
            </tr>
            <tr>
                <td class="label">Lokasi Kerja &amp; Cabang</td>
                <td class="value">{{ $job->branch?->name ?? 'Kantor Pusat Jakarta' }} ({{ $job->workplace_type ?? 'Hybrid' }})</td>
            </tr>
            <tr>
                <td class="label">Status Hubungan Kerja</td>
                <td class="value">{{ $job->employment_type ?? 'PKWTT (Tetap)' }}</td>
            </tr>
            <tr>
                <td class="label">Gaji Pokok yang Ditawarkan</td>
                <td class="value" style="font-size: 14px; color: #0284c7; font-family: monospace;">
                    Rp {{ number_format($candidate->offered_salary ?? $job->min_salary ?? 10000000, 0, ',', '.') }} / bulan
                </td>
            </tr>
            <tr>
                <td class="label">Paket Tunjangan &amp; Fasilitas</td>
                <td class="value">
                    • BPJS Kesehatan (4% Perusahaan : 1% Pekerja)<br>
                    • BPJS Ketenagakerjaan (JKK, JKM, JHT, JP)<br>
                    • Voucher Makan Crave Canteen Pass<br>
                    • Fleksibilitas Kerja &amp; Cuti Tahunan Sesuai Regulasi
                </td>
            </tr>
            <tr>
                <td class="label">Estimasi Tanggal Mulai Bekerja</td>
                <td class="value">{{ now()->addDays(14)->translatedFormat('d F Y') }} (Dapat disesuaikan)</td>
            </tr>
        </table>

        <p>
            Surat penawaran ini berlaku selama <strong>5 (lima) hari kerja</strong> sejak tanggal diterbitkan. Mohon untuk membubuhkan tanda tangan persetujuan pada kolom di bawah ini dan mengirimkan kembali salinan surat ini kepada tim Talent Acquisition kami.
        </p>

        <p>
            Kami percaya dedikasi dan keahlian Anda akan membawa kontribusi signifikan bagi perkembangan Crave Group. Selamat bergabung!
        </p>

        <div class="signatures">
            <div class="signature-box">
                <div class="signature-role">Atas Nama Perusahaan,</div>
                <div class="signature-space"></div>
                <div class="signature-name">Eka Revandi</div>
                <div class="signature-role">Lead Project &amp; HR Director</div>
            </div>

            <div class="signature-box">
                <div class="signature-role">Diterima &amp; Disetujui Oleh,</div>
                <div class="signature-space"></div>
                <div class="signature-name">{{ $candidate->full_name }}</div>
                <div class="signature-role">Kandidat Penerima Penawaran</div>
            </div>
        </div>
    </div>
</body>
</html>

