<?php

namespace App\Services;

use App\Models\Company;
use App\Models\PayrollPeriod;
use Carbon\Carbon;
use ZipArchive;

class PayrollExcelService
{
    /**
     * Generate styled Excel (.xlsx) workbook for Payroll Master Recap.
     */
    public static function generate(PayrollPeriod $period, ?Company $company = null): string
    {
        $tempFile = tempnam(sys_get_temp_dir(), 'crave_payroll_') . '.xlsx';

        $zip = new ZipArchive();
        if ($zip->open($tempFile, ZipArchive::CREATE | ZipArchive::OVERWRITE) !== true) {
            throw new \RuntimeException("Tidak dapat membuat file Excel XLSX di sistem.");
        }

        // 1. [Content_Types].xml
        $zip->addFromString('[Content_Types].xml', self::getContentTypesXml());

        // 2. _rels/.rels
        $zip->addFromString('_rels/.rels', self::getRootRelsXml());

        // 3. xl/_rels/workbook.xml.rels
        $zip->addFromString('xl/_rels/workbook.xml.rels', self::getWorkbookRelsXml());

        // 4. xl/workbook.xml
        $zip->addFromString('xl/workbook.xml', self::getWorkbookXml('Rekap Payroll'));

        // 5. xl/styles.xml (Colors, borders, typography, alignments, and number formats)
        $zip->addFromString('xl/styles.xml', self::getStylesXml());

        // 6. xl/worksheets/sheet1.xml (Data rows, styled cells, column widths)
        $sheetXml = self::buildSheetXml($period, $company);
        $zip->addFromString('xl/worksheets/sheet1.xml', $sheetXml);

        $zip->close();

        return $tempFile;
    }

    /**
     * Generate styled Excel (.xlsx) workbook for Bank Corporate Batch Transfer.
     */
    public static function generateBankBatch(PayrollPeriod $period, string $bankCode, ?Company $company = null): string
    {
        $tempFile = tempnam(sys_get_temp_dir(), 'crave_bank_batch_') . '.xlsx';

        $zip = new ZipArchive();
        if ($zip->open($tempFile, ZipArchive::CREATE | ZipArchive::OVERWRITE) !== true) {
            throw new \RuntimeException("Tidak dapat membuat file Excel XLSX batch transfer bank di sistem.");
        }

        $bankCode = strtoupper(trim($bankCode));

        // 1. [Content_Types].xml
        $zip->addFromString('[Content_Types].xml', self::getContentTypesXml());

        // 2. _rels/.rels
        $zip->addFromString('_rels/.rels', self::getRootRelsXml());

        // 3. xl/_rels/workbook.xml.rels
        $zip->addFromString('xl/_rels/workbook.xml.rels', self::getWorkbookRelsXml());

        // 4. xl/workbook.xml
        $zip->addFromString('xl/workbook.xml', self::getWorkbookXml("Batch {$bankCode}"));

        // 5. xl/styles.xml (Colors, borders, typography, alignments, and number formats)
        $zip->addFromString('xl/styles.xml', self::getStylesXml());

        // 6. xl/worksheets/sheet1.xml
        $sheetXml = self::buildBankBatchSheetXml($period, $bankCode, $company);
        $zip->addFromString('xl/worksheets/sheet1.xml', $sheetXml);

        $zip->close();

        return $tempFile;
    }

    private static function getContentTypesXml(): string
    {
        return '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' .
            '<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">' .
            '<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>' .
            '<Default Extension="xml" ContentType="application/xml"/>' .
            '<Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>' .
            '<Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>' .
            '<Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/>' .
            '</Types>';
    }

    private static function getRootRelsXml(): string
    {
        return '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' .
            '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">' .
            '<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/>' .
            '</Relationships>';
    }

    private static function getWorkbookRelsXml(): string
    {
        return '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' .
            '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">' .
            '<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/>' .
            '<Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>' .
            '</Relationships>';
    }

    private static function getWorkbookXml(string $sheetName = 'Rekap Payroll'): string
    {
        $escapedName = htmlspecialchars($sheetName, ENT_XML1, 'UTF-8');
        return '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' .
            '<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">' .
            '<sheets>' .
            '<sheet name="' . $escapedName . '" sheetId="1" r:id="rId1"/>' .
            '</sheets>' .
            '</workbook>';
    }

    private static function getStylesXml(): string
    {
        return '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' .
            '<styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">' .
            '<numFmts count="2">' .
            '<numFmt numFmtId="164" formatCode="#,##0"/>' .
            '<numFmt numFmtId="165" formatCode="0.00%"/>' .
            '</numFmts>' .
            '<fonts count="7">' .
            '<!-- 0: Regular Slate -->' .
            '<font><sz val="10"/><name val="Plus Jakarta Sans"/><color rgb="FF0F172A"/></font>' .
            '<!-- 1: Bold Slate -->' .
            '<font><b/><sz val="10"/><name val="Plus Jakarta Sans"/><color rgb="FF0F172A"/></font>' .
            '<!-- 2: White Bold Header -->' .
            '<font><b/><sz val="10"/><name val="Plus Jakarta Sans"/><color rgb="FFFFFFFF"/></font>' .
            '<!-- 3: Company Title 14pt Royal Blue -->' .
            '<font><b/><sz val="14"/><name val="Plus Jakarta Sans"/><color rgb="FF1B5CFE"/></font>' .
            '<!-- 4: Doc Title 11pt Deep Navy -->' .
            '<font><b/><sz val="11"/><name val="Plus Jakarta Sans"/><color rgb="FF0F172A"/></font>' .
            '<!-- 5: Subtitle 9pt Slate Gray -->' .
            '<font><i/><sz val="9"/><name val="Plus Jakarta Sans"/><color rgb="FF64748B"/></font>' .
            '<!-- 6: Take Home Pay Green Bold -->' .
            '<font><b/><sz val="10"/><name val="Plus Jakarta Sans"/><color rgb="FF047857"/></font>' .
            '</fonts>' .
            '<fills count="8">' .
            '<fill><patternFill patternType="none"/></fill>' .
            '<fill><patternFill patternType="gray125"/></fill>' .
            '<!-- 2: Royal Blue Header #1B5CFE -->' .
            '<fill><patternFill patternType="solid"><fgColor rgb="FF1B5CFE"/></patternFill></fill>' .
            '<!-- 3: Alternating Row Tint #F8FAFC -->' .
            '<fill><patternFill patternType="solid"><fgColor rgb="FFF8FAFC"/></patternFill></fill>' .
            '<!-- 4: Bruto Highlight #EFF6FF -->' .
            '<fill><patternFill patternType="solid"><fgColor rgb="FFEFF6FF"/></patternFill></fill>' .
            '<!-- 5: Take Home Pay Soft Green #ECFDF5 -->' .
            '<fill><patternFill patternType="solid"><fgColor rgb="FFECFDF5"/></patternFill></fill>' .
            '<!-- 6: Total Row Highlight #F1F5F9 -->' .
            '<fill><patternFill patternType="solid"><fgColor rgb="FFF1F5F9"/></patternFill></fill>' .
            '<!-- 7: Soft Amber #FFFBEB -->' .
            '<fill><patternFill patternType="solid"><fgColor rgb="FFFFFBEB"/></patternFill></fill>' .
            '</fills>' .
            '<borders count="3">' .
            '<!-- 0: None -->' .
            '<border><left/><right/><top/><bottom/><diagonal/></border>' .
            '<!-- 1: Thin light gray border #CBD5E1 -->' .
            '<border>' .
            '<left style="thin"><color rgb="FFCBD5E1"/></left>' .
            '<right style="thin"><color rgb="FFCBD5E1"/></right>' .
            '<top style="thin"><color rgb="FFCBD5E1"/></top>' .
            '<bottom style="thin"><color rgb="FFCBD5E1"/></bottom>' .
            '</border>' .
            '<!-- 2: Total row border: top thin, bottom double -->' .
            '<border>' .
            '<left style="thin"><color rgb="FFCBD5E1"/></left>' .
            '<right style="thin"><color rgb="FFCBD5E1"/></right>' .
            '<top style="thin"><color rgb="FF64748B"/></top>' .
            '<bottom style="double"><color rgb="FF0F172A"/></bottom>' .
            '</border>' .
            '</borders>' .
            '<cellStyleXfs count="1">' .
            '<xf numFmtId="0" fontId="0" fillId="0" borderId="0"/>' .
            '</cellStyleXfs>' .
            '<cellXfs count="17">' .
            '<!-- 0: Default -->' .
            '<xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/>' .
            '<!-- 1: Table Header (Font 2, Fill 2 Royal Blue, Border 1, Center) -->' .
            '<xf numFmtId="0" fontId="2" fillId="2" borderId="1" xfId="0" applyFont="1" applyFill="1" applyBorder="1" applyAlignment="1">' .
            '<alignment horizontal="center" vertical="center" wrapText="1"/>' .
            '</xf>' .
            '<!-- 2: Data Regular Left (Font 0, Border 1) -->' .
            '<xf numFmtId="0" fontId="0" fillId="0" borderId="1" xfId="0" applyFont="1" applyBorder="1" applyAlignment="1">' .
            '<alignment horizontal="left" vertical="center"/>' .
            '</xf>' .
            '<!-- 3: Data Zebra Left (Font 0, Fill 3, Border 1) -->' .
            '<xf numFmtId="0" fontId="0" fillId="3" borderId="1" xfId="0" applyFont="1" applyFill="1" applyBorder="1" applyAlignment="1">' .
            '<alignment horizontal="left" vertical="center"/>' .
            '</xf>' .
            '<!-- 4: Data Regular Center (Font 0, Border 1) -->' .
            '<xf numFmtId="0" fontId="0" fillId="0" borderId="1" xfId="0" applyFont="1" applyBorder="1" applyAlignment="1">' .
            '<alignment horizontal="center" vertical="center"/>' .
            '</xf>' .
            '<!-- 5: Data Zebra Center (Font 0, Fill 3, Border 1) -->' .
            '<xf numFmtId="0" fontId="0" fillId="3" borderId="1" xfId="0" applyFont="1" applyFill="1" applyBorder="1" applyAlignment="1">' .
            '<alignment horizontal="center" vertical="center"/>' .
            '</xf>' .
            '<!-- 6: Data Regular Currency (Font 0, Border 1, #,##0) -->' .
            '<xf numFmtId="164" fontId="0" fillId="0" borderId="1" xfId="0" applyNumberFormat="1" applyFont="1" applyBorder="1" applyAlignment="1">' .
            '<alignment horizontal="right" vertical="center"/>' .
            '</xf>' .
            '<!-- 7: Data Zebra Currency (Font 0, Fill 3, Border 1, #,##0) -->' .
            '<xf numFmtId="164" fontId="0" fillId="3" borderId="1" xfId="0" applyNumberFormat="1" applyFill="1" applyBorder="1" applyAlignment="1">' .
            '<alignment horizontal="right" vertical="center"/>' .
            '</xf>' .
            '<!-- 8: Data Bruto Highlight (Font 1 bold, Fill 4 Soft Blue, Border 1, #,##0) -->' .
            '<xf numFmtId="164" fontId="1" fillId="4" borderId="1" xfId="0" applyNumberFormat="1" applyFont="1" applyFill="1" applyBorder="1" applyAlignment="1">' .
            '<alignment horizontal="right" vertical="center"/>' .
            '</xf>' .
            '<!-- 9: Data Take Home Pay (Font 6 bold green, Fill 5 Soft Green, Border 1, #,##0) -->' .
            '<xf numFmtId="164" fontId="6" fillId="5" borderId="1" xfId="0" applyNumberFormat="1" applyFont="1" applyFill="1" applyBorder="1" applyAlignment="1">' .
            '<alignment horizontal="right" vertical="center"/>' .
            '</xf>' .
            '<!-- 10: Data Regular Percentage (Font 0, Border 1, 0.00%) -->' .
            '<xf numFmtId="165" fontId="0" fillId="0" borderId="1" xfId="0" applyNumberFormat="1" applyFont="1" applyBorder="1" applyAlignment="1">' .
            '<alignment horizontal="right" vertical="center"/>' .
            '</xf>' .
            '<!-- 11: Data Zebra Percentage (Font 0, Fill 3, Border 1, 0.00%) -->' .
            '<xf numFmtId="165" fontId="0" fillId="3" borderId="1" xfId="0" applyNumberFormat="1" applyFill="1" applyBorder="1" applyAlignment="1">' .
            '<alignment horizontal="right" vertical="center"/>' .
            '</xf>' .
            '<!-- 12: Total Row Label (Font 1 bold, Fill 6, Border 2, Center) -->' .
            '<xf numFmtId="0" fontId="1" fillId="6" borderId="2" xfId="0" applyFont="1" applyFill="1" applyBorder="1" applyAlignment="1">' .
            '<alignment horizontal="center" vertical="center"/>' .
            '</xf>' .
            '<!-- 13: Total Row Currency (Font 1 bold, Fill 6, Border 2, #,##0) -->' .
            '<xf numFmtId="164" fontId="1" fillId="6" borderId="2" xfId="0" applyNumberFormat="1" applyFont="1" applyFill="1" applyBorder="1" applyAlignment="1">' .
            '<alignment horizontal="right" vertical="center"/>' .
            '</xf>' .
            '<!-- 14: Title Company (Font 3 Royal Blue) -->' .
            '<xf numFmtId="0" fontId="3" fillId="0" borderId="0" xfId="0" applyFont="1"/>' .
            '<!-- 15: Title Document (Font 4 Deep Navy) -->' .
            '<xf numFmtId="0" fontId="4" fillId="0" borderId="0" xfId="0" applyFont="1"/>' .
            '<!-- 16: Title Subtitle (Font 5 Slate Gray) -->' .
            '<xf numFmtId="0" fontId="5" fillId="0" borderId="0" xfId="0" applyFont="1"/>' .
            '</cellXfs>' .
            '</styleSheet>';
    }

    private static function buildSheetXml(PayrollPeriod $period, ?Company $company = null): string
    {
        $companyName = strtoupper($company?->name ?? 'CRAVE GLOBAL GROUP (HOLDING)');
        $periodName = strtoupper($period->name ?? ("PERIODE " . Carbon::create($period->year, $period->month, 1)->translatedFormat('F Y')));
        $printedAt = Carbon::now()->translatedFormat('d F Y, H:i') . ' WIB';

        $columns = [
            ['name' => 'No', 'width' => 6],
            ['name' => 'NIK', 'width' => 14],
            ['name' => 'Nama Karyawan', 'width' => 26],
            ['name' => 'Departemen', 'width' => 22],
            ['name' => 'Jabatan', 'width' => 22],
            ['name' => 'PTKP', 'width' => 10],
            ['name' => 'Kategori TER', 'width' => 14],
            ['name' => 'Tarif TER (%)', 'width' => 14],
            ['name' => 'Gaji Pokok', 'width' => 18],
            ['name' => 'Tunjangan Tetap', 'width' => 18],
            ['name' => 'Tunjangan Variabel', 'width' => 18],
            ['name' => 'Uang Lembur', 'width' => 16],
            ['name' => 'Reimbursement', 'width' => 16],
            ['name' => 'Penghasilan Bruto', 'width' => 20],
            ['name' => 'PPh 21 TER', 'width' => 16],
            ['name' => 'BPJS Kes (1%)', 'width' => 16],
            ['name' => 'BPJS JHT (2%)', 'width' => 16],
            ['name' => 'BPJS JP (1%)', 'width' => 16],
            ['name' => 'Total Potongan', 'width' => 18],
            ['name' => 'Take Home Pay', 'width' => 20],
            ['name' => 'Bank', 'width' => 12],
            ['name' => 'Nomor Rekening', 'width' => 20],
            ['name' => 'Status Pembayaran', 'width' => 18],
        ];

        // Column definitions with specific widths
        $colsXml = '<cols>';
        foreach ($columns as $idx => $col) {
            $colNum = $idx + 1;
            $colsXml .= '<col min="' . $colNum . '" max="' . $colNum . '" width="' . $col['width'] . '" customWidth="1"/>';
        }
        $colsXml .= '</cols>';

        $rowsXml = '';

        // Row 1: Company Title
        $rowsXml .= '<row r="1" ht="26" customHeight="1">' .
            self::cellXml('A1', $companyName, 14, 's') .
            '</row>';

        // Row 2: Document Title
        $rowsXml .= '<row r="2" ht="20" customHeight="1">' .
            self::cellXml('A2', "MASTER REKAPITULASI PAYROLL KARYAWAN & PAJAK PPH 21 TER : {$periodName}", 15, 's') .
            '</row>';

        // Row 3: Subtitle / Timestamp
        $rowsXml .= '<row r="3" ht="18" customHeight="1">' .
            self::cellXml('A3', "Status Periode: " . strtoupper($period->status ?? 'FINALIZED') . " | Dicetak pada: {$printedAt} | Crave HRM SaaS", 16, 's') .
            '</row>';

        // Row 4: Blank Spacer
        $rowsXml .= '<row r="4" ht="12" customHeight="1"></row>';

        // Row 5: Table Header (Royal Electric Blue fill #1B5CFE, White bold text)
        $headerRow = '<row r="5" ht="30" customHeight="1">';
        foreach ($columns as $idx => $col) {
            $cellRef = self::colLetter($idx) . '5';
            $headerRow .= self::cellXml($cellRef, $col['name'], 1, 's');
        }
        $headerRow .= '</row>';
        $rowsXml .= $headerRow;

        // Data Rows starting from row 6
        $currentRow = 6;
        $totalGajiPokok = 0;
        $totalTunjTetap = 0;
        $totalTunjVar = 0;
        $totalLembur = 0;
        $totalReimburse = 0;
        $totalBruto = 0;
        $totalPph21 = 0;
        $totalBpjsKes = 0;
        $totalBpjsJht = 0;
        $totalBpjsJp = 0;
        $totalPotongan = 0;
        $totalThp = 0;

        foreach ($period->items as $idx => $item) {
            $isZebra = ($idx % 2 === 1);
            $styleLeft = $isZebra ? 3 : 2;
            $styleCenter = $isZebra ? 5 : 4;
            $styleCurrency = $isZebra ? 7 : 6;
            $stylePercent = $isZebra ? 11 : 10;

            $nik = $item->employee->nik ?? '-';
            $name = $item->employee->nama_lengkap ?? '-';
            $dept = ($item->employee && $item->employee->relationLoaded('department') && $item->employee->department)
                ? $item->employee->department->name
                : ($item->employee->department_name ?? 'Operasional');
            $designation = ($item->employee && $item->employee->relationLoaded('designation') && $item->employee->designation)
                ? $item->employee->designation->name
                : ($item->employee->designation_name ?? 'Staf');
            $ptkp = $item->ptkp_status ?? 'TK/0';
            $terCat = 'Kategori ' . ($item->ter_category ?? 'A');
            $terRate = ($item->ter_rate ?? 0) / 100; // formatted as 0.00%

            $gaji = (float) $item->gaji_pokok;
            $tunjTetap = (float) $item->tunjangan_tetap;
            $tunjVar = (float) $item->tunjangan_tidak_tetap;
            $lembur = (float) $item->uang_lembur;
            $reimburse = (float) $item->reimbursement_total;
            $bruto = (float) $item->penghasilan_bruto;
            $pph21 = (float) $item->pph21;
            $bpjsKes = (float) $item->bpjs_kes_employee;
            $bpjsJht = (float) $item->bpjs_jht_employee;
            $bpjsJp = (float) $item->bpjs_jp_employee;
            $potongan = (float) $item->total_potongan;
            $thp = (float) $item->take_home_pay;

            $bank = strtoupper($item->employee->bank_name ?? 'BCA');
            $rek = $item->employee->bank_account_number ?? '-';
            $status = strtoupper($item->payment_status ?? 'DIBAYAR');

            // Accumulate totals
            $totalGajiPokok += $gaji;
            $totalTunjTetap += $tunjTetap;
            $totalTunjVar += $tunjVar;
            $totalLembur += $lembur;
            $totalReimburse += $reimburse;
            $totalBruto += $bruto;
            $totalPph21 += $pph21;
            $totalBpjsKes += $bpjsKes;
            $totalBpjsJht += $bpjsJht;
            $totalBpjsJp += $bpjsJp;
            $totalPotongan += $potongan;
            $totalThp += $thp;

            $r = $currentRow;
            $rowXml = '<row r="' . $r . '" ht="22" customHeight="1">';
            $rowXml .= self::cellXml("A{$r}", $idx + 1, $styleCenter, 'n');
            $rowXml .= self::cellXml("B{$r}", $nik, $styleCenter, 's');
            $rowXml .= self::cellXml("C{$r}", $name, $styleLeft, 's');
            $rowXml .= self::cellXml("D{$r}", $dept, $styleLeft, 's');
            $rowXml .= self::cellXml("E{$r}", $designation, $styleLeft, 's');
            $rowXml .= self::cellXml("F{$r}", $ptkp, $styleCenter, 's');
            $rowXml .= self::cellXml("G{$r}", $terCat, $styleCenter, 's');
            $rowXml .= self::cellXml("H{$r}", $terRate, $stylePercent, 'n');
            $rowXml .= self::cellXml("I{$r}", $gaji, $styleCurrency, 'n');
            $rowXml .= self::cellXml("J{$r}", $tunjTetap, $styleCurrency, 'n');
            $rowXml .= self::cellXml("K{$r}", $tunjVar, $styleCurrency, 'n');
            $rowXml .= self::cellXml("L{$r}", $lembur, $styleCurrency, 'n');
            $rowXml .= self::cellXml("M{$r}", $reimburse, $styleCurrency, 'n');
            // Bruto (Style 8: Soft Blue highlight)
            $rowXml .= self::cellXml("N{$r}", $bruto, 8, 'n');
            $rowXml .= self::cellXml("O{$r}", $pph21, $styleCurrency, 'n');
            $rowXml .= self::cellXml("P{$r}", $bpjsKes, $styleCurrency, 'n');
            $rowXml .= self::cellXml("Q{$r}", $bpjsJht, $styleCurrency, 'n');
            $rowXml .= self::cellXml("R{$r}", $bpjsJp, $styleCurrency, 'n');
            $rowXml .= self::cellXml("S{$r}", $potongan, $styleCurrency, 'n');
            // Take Home Pay (Style 9: Soft Green highlight)
            $rowXml .= self::cellXml("T{$r}", $thp, 9, 'n');
            $rowXml .= self::cellXml("U{$r}", $bank, $styleCenter, 's');
            $rowXml .= self::cellXml("V{$r}", $rek, $styleCenter, 's');
            $rowXml .= self::cellXml("W{$r}", $status, $styleCenter, 's');
            $rowXml .= '</row>';

            $rowsXml .= $rowXml;
            $currentRow++;
        }

        // Summary / Total Row
        $totR = $currentRow;
        $totalRow = '<row r="' . $totR . '" ht="26" customHeight="1">';
        $totalRow .= self::cellXml("A{$totR}", 'TOTAL', 12, 's');
        $totalRow .= self::cellXml("B{$totR}", '', 12, 's');
        $totalRow .= self::cellXml("C{$totR}", count($period->items) . ' KARYAWAN', 12, 's');
        $totalRow .= self::cellXml("D{$totR}", '', 12, 's');
        $totalRow .= self::cellXml("E{$totR}", '', 12, 's');
        $totalRow .= self::cellXml("F{$totR}", '', 12, 's');
        $totalRow .= self::cellXml("G{$totR}", '', 12, 's');
        $totalRow .= self::cellXml("H{$totR}", '', 12, 's');
        $totalRow .= self::cellXml("I{$totR}", $totalGajiPokok, 13, 'n');
        $totalRow .= self::cellXml("J{$totR}", $totalTunjTetap, 13, 'n');
        $totalRow .= self::cellXml("K{$totR}", $totalTunjVar, 13, 'n');
        $totalRow .= self::cellXml("L{$totR}", $totalLembur, 13, 'n');
        $totalRow .= self::cellXml("M{$totR}", $totalReimburse, 13, 'n');
        $totalRow .= self::cellXml("N{$totR}", $totalBruto, 13, 'n');
        $totalRow .= self::cellXml("O{$totR}", $totalPph21, 13, 'n');
        $totalRow .= self::cellXml("P{$totR}", $totalBpjsKes, 13, 'n');
        $totalRow .= self::cellXml("Q{$totR}", $totalBpjsJht, 13, 'n');
        $totalRow .= self::cellXml("R{$totR}", $totalBpjsJp, 13, 'n');
        $totalRow .= self::cellXml("S{$totR}", $totalPotongan, 13, 'n');
        $totalRow .= self::cellXml("T{$totR}", $totalThp, 13, 'n');
        $totalRow .= self::cellXml("U{$totR}", '', 12, 's');
        $totalRow .= self::cellXml("V{$totR}", '', 12, 's');
        $totalRow .= self::cellXml("W{$totR}", '', 12, 's');
        $totalRow .= '</row>';
        $rowsXml .= $totalRow;

        return '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' .
            '<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">' .
            '<sheetViews><sheetView tabSelected="1" workbookViewId="0"><pane ySplit="5" topLeftCell="A6" activePane="bottomLeft" state="frozen"/></sheetView></sheetViews>' .
            $colsXml .
            '<sheetData>' . $rowsXml . '</sheetData>' .
            '</worksheet>';
    }

    private static function buildBankBatchSheetXml(PayrollPeriod $period, string $bankCode, ?Company $company = null): string
    {
        $companyName = strtoupper($company?->name ?? 'CRAVE GLOBAL GROUP (HOLDING)');
        $periodName = strtoupper($period->name ?? ("PERIODE " . Carbon::create($period->year, $period->month, 1)->translatedFormat('F Y')));
        $printedAt = Carbon::now()->translatedFormat('d F Y, H:i') . ' WIB';

        $bankTitles = [
            'BCA' => 'KLIKBCA BISNIS BATCH TRANSFER',
            'MANDIRI' => 'MANDIRI CASH MANAGEMENT (MCM 2.0)',
            'BRI' => 'BRI CASH MANAGEMENT SYSTEM (CMS)',
            'BNI' => 'BNI DIRECT CORPORATE',
            'BSI' => 'BSI NET BANKING CMS (SYARIAH)',
            'CIMB' => 'BIZCHANNEL@CIMB NIAGA',
            'PERMATA' => 'PERMATA E-BUSINESS CORPORATE',
            'DANAMON' => 'DANAMON CASH CONNECT',
            'BTN' => 'BTN CASH MANAGEMENT SYSTEM (CMS)',
        ];
        $bankTitle = $bankTitles[$bankCode] ?? "BATCH TRANSFER BANK {$bankCode}";

        $allValidItems = $period->items->filter(fn($i) => (float) $i->take_home_pay > 0);
        $filtered = $allValidItems->filter(function ($item) use ($bankCode) {
            $empBank = strtoupper(trim($item->employee->bank_name ?? ''));
            return str_contains($empBank, $bankCode);
        });

        // Jika belum ada karyawan spesifik dengan bank ini, gunakan semua karyawan aktif agar tidak kosong
        $items = $filtered->isNotEmpty() ? $filtered : $allValidItems;

        $columns = [
            ['name' => 'No', 'width' => 6],
            ['name' => 'Nomor Rekening Tujuan', 'width' => 24],
            ['name' => 'Nama Pemilik Rekening', 'width' => 28],
            ['name' => 'Nominal Transfer (IDR)', 'width' => 22],
            ['name' => 'Berita Transfer / Keterangan Gaji', 'width' => 32],
            ['name' => 'Bank Tujuan', 'width' => 16],
            ['name' => 'NIK Karyawan', 'width' => 18],
            ['name' => 'Departemen', 'width' => 22],
            ['name' => 'Jabatan', 'width' => 22],
            ['name' => 'Status Validasi Rekening', 'width' => 22],
        ];

        $colsXml = '<cols>';
        foreach ($columns as $idx => $col) {
            $colNum = $idx + 1;
            $colsXml .= '<col min="' . $colNum . '" max="' . $colNum . '" width="' . $col['width'] . '" customWidth="1"/>';
        }
        $colsXml .= '</cols>';

        $rowsXml = '';

        // Row 1: Company Title
        $rowsXml .= '<row r="1" ht="28" customHeight="1">' .
            self::cellXml('A1', $companyName, 14, 's') .
            '</row>';

        // Row 2: Doc Title
        $rowsXml .= '<row r="2" ht="22" customHeight="1">' .
            self::cellXml('A2', "DAFTAR BATCH TRANSFER PAYROLL — {$bankTitle}", 15, 's') .
            '</row>';

        // Row 3: Subtitle & Timestamp
        $subtitleText = "Periode: {$periodName} | Tanggal Ekspor: {$printedAt} | Total Penerima: " . count($items) . " Rekening";
        $rowsXml .= '<row r="3" ht="18" customHeight="1">' .
            self::cellXml('A3', $subtitleText, 16, 's') .
            '</row>';

        // Row 4: Spacer
        $rowsXml .= '<row r="4" ht="8" customHeight="1"/>';

        // Row 5: Table Header (Royal Blue Background #1B5CFE, Bold White)
        $headerRow = '<row r="5" ht="28" customHeight="1">';
        foreach ($columns as $idx => $col) {
            $cellRef = self::colLetter($idx) . '5';
            $headerRow .= self::cellXml($cellRef, $col['name'], 1, 's');
        }
        $headerRow .= '</row>';
        $rowsXml .= $headerRow;

        // Data Rows starting at Row 6
        $currentRow = 6;
        $totalNominal = 0;

        foreach ($items as $idx => $item) {
            $r = $currentRow;
            $isZebra = ($idx % 2 === 1);
            $styleLeft = $isZebra ? 3 : 2;
            $styleCenter = $isZebra ? 5 : 4;

            $emp = $item->employee;
            $account = (string) ($emp->bank_account_number ?? '0000000000');
            $nama = (string) ($emp->nama_lengkap ?? 'Karyawan');
            $nominal = (float) $item->take_home_pay;
            $totalNominal += $nominal;
            $berita = "Gaji " . ($period->name ?? $periodName);
            $bank = (string) ($emp->bank_name ?? $bankCode);
            $nik = (string) ($emp->nik ?? '-');
            $dept = ($emp && $emp->relationLoaded('department') && $emp->department)
                ? (string) $emp->department->name
                : ($emp->department_name ?? 'Operasional');
            $desig = ($emp && $emp->relationLoaded('designation') && $emp->designation)
                ? (string) $emp->designation->name
                : ($emp->designation_name ?? 'Staf');
            $statusRekening = 'Tervalidasi / Siap Kirim';

            // Neutralize formula injection
            if ($account !== '' && in_array($account[0], ['=', '+', '-', '@'], true)) {
                $account = "'" . $account;
            }
            if ($nama !== '' && in_array($nama[0], ['=', '+', '-', '@'], true)) {
                $nama = "'" . $nama;
            }

            $rowXml = '<row r="' . $r . '" ht="22" customHeight="1">';
            $rowXml .= self::cellXml("A{$r}", $idx + 1, $styleCenter, 'n');
            $rowXml .= self::cellXml("B{$r}", $account, $styleCenter, 's');
            $rowXml .= self::cellXml("C{$r}", $nama, $styleLeft, 's');
            // Nominal: Style 9 (Soft Green highlight, bold green text, #,##0 currency)
            $rowXml .= self::cellXml("D{$r}", $nominal, 9, 'n');
            $rowXml .= self::cellXml("E{$r}", $berita, $styleLeft, 's');
            $rowXml .= self::cellXml("F{$r}", $bank, $styleCenter, 's');
            $rowXml .= self::cellXml("G{$r}", $nik, $styleCenter, 's');
            $rowXml .= self::cellXml("H{$r}", $dept, $styleLeft, 's');
            $rowXml .= self::cellXml("I{$r}", $desig, $styleLeft, 's');
            $rowXml .= self::cellXml("J{$r}", $statusRekening, $styleCenter, 's');
            $rowXml .= '</row>';

            $rowsXml .= $rowXml;
            $currentRow++;
        }

        // Total Row
        $totR = $currentRow;
        $totalRow = '<row r="' . $totR . '" ht="26" customHeight="1">';
        $totalRow .= self::cellXml("A{$totR}", 'TOTAL DISBURSEMENT BATCH', 12, 's');
        $totalRow .= self::cellXml("B{$totR}", '', 12, 's');
        $totalRow .= self::cellXml("C{$totR}", count($items) . ' REKENING', 12, 's');
        $totalRow .= self::cellXml("D{$totR}", $totalNominal, 13, 'n');
        $totalRow .= self::cellXml("E{$totR}", '', 12, 's');
        $totalRow .= self::cellXml("F{$totR}", '', 12, 's');
        $totalRow .= self::cellXml("G{$totR}", '', 12, 's');
        $totalRow .= self::cellXml("H{$totR}", '', 12, 's');
        $totalRow .= self::cellXml("I{$totR}", '', 12, 's');
        $totalRow .= self::cellXml("J{$totR}", '', 12, 's');
        $totalRow .= '</row>';
        $rowsXml .= $totalRow;

        return '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' .
            '<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">' .
            '<sheetViews><sheetView tabSelected="1" workbookViewId="0"><pane ySplit="5" topLeftCell="A6" activePane="bottomLeft" state="frozen"/></sheetView></sheetViews>' .
            $colsXml .
            '<sheetData>' . $rowsXml . '</sheetData>' .
            '</worksheet>';
    }

    private static function cellXml(string $cellRef, mixed $value, int $styleId, string $type = 's'): string
    {
        if ($type === 'n') {
            $numVal = is_numeric($value) ? $value : 0;
            return '<c r="' . $cellRef . '" s="' . $styleId . '"><v>' . $numVal . '</v></c>';
        }

        $escaped = htmlspecialchars((string) $value, ENT_XML1, 'UTF-8');
        return '<c r="' . $cellRef . '" s="' . $styleId . '" t="inlineStr"><is><t>' . $escaped . '</t></is></c>';
    }

    private static function colLetter(int $colIndex): string
    {
        $letters = '';
        while ($colIndex >= 0) {
            $letters = chr($colIndex % 26 + 65) . $letters;
            $colIndex = intdiv($colIndex, 26) - 1;
        }
        return $letters;
    }
}
