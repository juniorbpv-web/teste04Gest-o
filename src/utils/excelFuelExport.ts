import ExcelJS from 'exceljs';
import { FuelDispense, Equipment } from '../types';
import { formatDateBR, getTodayDateString } from './storage';

/**
 * Generates the official horizontal Makmo Combustível logo on a canvas
 * matching the user's specification image:
 * - "m", "mo" in Dark Navy (#0c2340)
 * - "a" and "k" (< chevron) in Teal (#20bca9)
 * - Fuel dispenser nozzle in Teal over "ak" with fuel droplet
 * - Teal divider lines flanking "C O M B U S T Í V E L"
 *
 * Returns a Base64 PNG data string for embedding in Excel files.
 */
export function getMakmoCombustivelHorizontalLogoBase64(): string {
  if (typeof document === 'undefined') return '';

  try {
    const width = 640;
    const height = 180;
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return '';

    // Transparent / clean white canvas
    ctx.clearRect(0, 0, width, height);

    ctx.save();
    // Scale and translate for crisp high-DPI rendering
    ctx.translate(20, 20);
    ctx.scale(1.35, 1.35);

    const navy = '#0c2340';
    const teal = '#20bca9';

    // 1. Fuel Nozzle & Hose above "ak"
    ctx.save();
    // Hose
    ctx.strokeStyle = teal;
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();
    ctx.moveTo(130, 32);
    ctx.bezierCurveTo(138, 12, 160, -6, 185, 2);
    ctx.bezierCurveTo(200, 7, 210, 18, 205, 30);
    ctx.stroke();

    // Nozzle body
    ctx.fillStyle = teal;
    ctx.beginPath();
    ctx.moveTo(196, 24);
    ctx.lineTo(210, 15);
    ctx.lineTo(216, 22);
    ctx.lineTo(228, 12);
    ctx.lineTo(232, 17);
    ctx.lineTo(218, 28);
    ctx.lineTo(212, 34);
    ctx.closePath();
    ctx.fill();

    // Fuel droplet falling on the right
    ctx.beginPath();
    ctx.moveTo(234, 25);
    ctx.quadraticCurveTo(238, 32, 235, 36);
    ctx.arc(233, 36, 2.5, 0, Math.PI);
    ctx.quadraticCurveTo(230, 32, 234, 25);
    ctx.fill();
    ctx.restore();

    // 2. Vector Letters for "makmo"
    if (typeof Path2D !== 'undefined') {
      // Letter 1: 'm' (Navy)
      const pM1 = new Path2D(
        'M 34 25 L 82 25 A 14 14 0 0 1 96 39 L 96 85 L 82 85 L 82 43 A 4 4 0 0 0 78 39 L 65 39 A 4 4 0 0 0 61 43 L 61 85 L 47 85 L 47 43 A 4 4 0 0 0 43 39 L 30 39 A 4 4 0 0 0 26 43 L 26 85 L 12 85 L 12 39 A 14 14 0 0 1 26 25 Z'
      );
      ctx.fillStyle = navy;
      ctx.fill(pM1, 'evenodd');

      // Letter 2: 'a' (Teal)
      const pA = new Path2D(
        'M 124 25 L 148 25 A 14 14 0 0 1 162 39 L 162 85 L 148 85 L 148 78 A 14 14 0 0 1 134 85 L 124 85 A 14 14 0 0 1 110 71 L 110 39 A 14 14 0 0 1 124 25 Z M 125 40 A 4 4 0 0 0 124 44 L 124 66 A 4 4 0 0 0 128 70 L 134 70 A 4 4 0 0 0 138 66 L 138 44 A 4 4 0 0 0 134 40 Z'
      );
      ctx.fillStyle = teal;
      ctx.fill(pA, 'evenodd');

      // Letter 3: 'k' Chevron (Teal)
      const pK = new Path2D(
        'M 198 25 L 178 54 A 4 4 0 0 0 178 58 L 198 85 L 214 85 L 193 57 A 1.5 1.5 0 0 1 193 55 L 214 25 Z'
      );
      ctx.fillStyle = teal;
      ctx.fill(pK);

      // Letter 4: 'm' (Navy)
      const pM2 = new Path2D(
        'M 248 25 L 296 25 A 14 14 0 0 1 310 39 L 310 85 L 296 85 L 296 43 A 4 4 0 0 0 292 39 L 279 39 A 4 4 0 0 0 275 43 L 275 85 L 261 85 L 261 43 A 4 4 0 0 0 257 39 L 244 39 A 4 4 0 0 0 240 43 L 240 85 L 226 85 L 226 39 A 14 14 0 0 1 240 25 Z'
      );
      ctx.fillStyle = navy;
      ctx.fill(pM2, 'evenodd');

      // Letter 5: 'o' (Navy)
      const pO = new Path2D(
        'M 338 25 L 366 25 A 14 14 0 0 1 380 39 L 380 71 A 14 14 0 0 1 366 85 L 338 85 A 14 14 0 0 1 324 71 L 324 39 A 14 14 0 0 1 338 25 Z M 340 40 A 4 4 0 0 0 338 44 L 338 66 A 4 4 0 0 0 342 70 L 362 70 A 4 4 0 0 0 366 66 L 366 44 A 4 4 0 0 0 362 40 Z'
      );
      ctx.fillStyle = navy;
      ctx.fill(pO, 'evenodd');
    }

    // 3. Subtitle "— C O M B U S T Í V E L —"
    // Left line
    ctx.strokeStyle = teal;
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(12, 104);
    ctx.lineTo(52, 104);
    ctx.stroke();

    // Spaced text "C O M B U S T Í V E L"
    ctx.fillStyle = navy;
    ctx.font = '700 13px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    const text = 'COMBUSTÍVEL';
    const centerX = 196;
    const y = 104;
    const spacing = 7.5;
    let totalW = 0;
    for (let i = 0; i < text.length; i++) {
      totalW += ctx.measureText(text[i]).width + (i < text.length - 1 ? spacing : 0);
    }
    let curX = centerX - totalW / 2;
    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      const charW = ctx.measureText(char).width;
      ctx.fillText(char, curX + charW / 2, y);
      curX += charW + spacing;
    }

    // Right line
    ctx.beginPath();
    ctx.moveTo(340, 104);
    ctx.lineTo(380, 104);
    ctx.stroke();

    ctx.restore();

    return canvas.toDataURL('image/png');
  } catch (err) {
    console.error('Error rendering Makmo Combustível logo on canvas:', err);
    return '';
  }
}

export interface ExportFuelExcelOptions {
  obraText?: string;
  responsibleText?: string;
  customFilename?: string;
}

/**
 * Standardized Excel Export for Fuel Management (Gestão de Abastecimento).
 *
 * Sequence and Layout strictly identical to the user's standardized specification:
 * 1. Top Header:
 *    - Left: Official Makmo Combustível Logo (PNG Embedded)
 *    - Center: "GESTÃO DE ABASTECIMENTO" (Bold, 16pt)
 *    - Center: "OBRA: 063/064" (Bold, 14pt)
 *    - Center: "Responsável Roberto Jr" (Blue, 11pt)
 * 2. Table Column Headers (10 columns in EXACT sequence):
 *    1. Data
 *    2. Comboio
 *    3. Placa
 *    4. Equipamento
 *    5. Fornecedor
 *    6. Obra
 *    7. Horímetro
 *    8. Iniciante
 *    9. Encerrante
 *    10. Litros
 * 3. Color styling:
 *    - Header row: Steel Blue background (#366EA8 / #336699) with white bold text
 *    - Data rows: Clean, aligned cells with light grid borders
 *    - Numbers: Formatted with decimal precision and standard Excel accounting totals
 */
export async function exportFuelReportToExcel(
  dispenses: FuelDispense[],
  equipments: Equipment[] = [],
  options: ExportFuelExcelOptions = {}
): Promise<void> {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'Makmo Infraestrutura';
  workbook.lastModifiedBy = 'Makmo Gestão de Abastecimento';
  workbook.created = new Date();
  workbook.modified = new Date();

  const worksheet = workbook.addWorksheet('Abastecimentos', {
    views: [{ showGridLines: true }],
    pageSetup: { orientation: 'landscape', fitToPage: true, fitToWidth: 1, fitToHeight: 0 },
  });

  // Setup Column Widths
  worksheet.columns = [
    { key: 'data', width: 14 }, // A: Data
    { key: 'comboio', width: 14 }, // B: Comboio
    { key: 'placa', width: 16 }, // C: Placa
    { key: 'equipamento', width: 28 }, // D: Equipamento
    { key: 'fornecedor', width: 22 }, // E: Fornecedor
    { key: 'obra', width: 16 }, // F: Obra
    { key: 'horimetro', width: 15 }, // G: Horímetro
    { key: 'iniciante', width: 14 }, // H: Iniciante
    { key: 'encerrante', width: 14 }, // I: Encerrante
    { key: 'litros', width: 16 }, // J: Litros
  ];

  // Set Row Heights for Header Section
  worksheet.getRow(1).height = 24;
  worksheet.getRow(2).height = 22;
  worksheet.getRow(3).height = 20;
  worksheet.getRow(4).height = 12; // Empty separator row
  worksheet.getRow(5).height = 26; // Table Header Row

  // Embed the Makmo Combustível Logo
  const logoDataUrl = getMakmoCombustivelHorizontalLogoBase64();
  if (logoDataUrl) {
    try {
      const base64Clean = logoDataUrl.replace(/^data:image\/png;base64,/, '');
      const imageId = workbook.addImage({
        base64: base64Clean,
        extension: 'png',
      });
      worksheet.addImage(imageId, {
        tl: { col: 0.1, row: 0.15 },
        ext: { width: 215, height: 60 },
        editAs: 'oneCell',
      });
    } catch (imgErr) {
      console.warn('Could not embed logo in Excel:', imgErr);
    }
  }

  // Determine Obra and Responsible text dynamically or from standard
  const uniqueObras = Array.from(new Set(dispenses.map((d) => d.location).filter(Boolean)));
  const defaultObra = uniqueObras.length === 1 ? uniqueObras[0] : '063/064';
  const obraText = options.obraText ? `OBRA: ${options.obraText}` : `OBRA: ${defaultObra}`;
  const responsibleText = options.responsibleText
    ? `Responsável ${options.responsibleText}`
    : 'Responsável Roberto Jr';

  // Title: "GESTÃO DE ABASTECIMENTO" (Merged D1:J1 or C1:J1)
  worksheet.mergeCells('C1:J1');
  const titleCell = worksheet.getCell('C1');
  titleCell.value = 'GESTÃO DE ABASTECIMENTO';
  titleCell.font = { name: 'Calibri', size: 16, bold: true, color: { argb: 'FF0A192F' } };
  titleCell.alignment = { vertical: 'middle', horizontal: 'center' };

  // Subtitle: "OBRA: 063/064" (Merged D2:J2 or C2:J2)
  worksheet.mergeCells('C2:J2');
  const obraCell = worksheet.getCell('C2');
  obraCell.value = obraText;
  obraCell.font = { name: 'Calibri', size: 14, bold: true, color: { argb: 'FF000000' } };
  obraCell.alignment = { vertical: 'middle', horizontal: 'center' };

  // Responsible: "Responsável Roberto Jr" (Merged D3:J3 or C3:J3)
  worksheet.mergeCells('C3:J3');
  const respCell = worksheet.getCell('C3');
  respCell.value = responsibleText;
  respCell.font = { name: 'Calibri', size: 11, bold: true, color: { argb: 'FF1D4ED8' } }; // Blue color matching user screenshot
  respCell.alignment = { vertical: 'middle', horizontal: 'center' };

  // Table Headers (Row 5) in exact sequence requested:
  // Data | Comboio | Placa | Equipamento | Fornecedor | Obra | Horímetro | Iniciante | Encerrante | Litros
  const headers = [
    'Data',
    'Comboio',
    'Placa',
    'Equipamento',
    'Fornecedor',
    'Obra',
    'Horímetro',
    'Iniciante',
    'Encerrante',
    'Litros',
  ];

  const headerRow = worksheet.getRow(5);
  headers.forEach((headerText, index) => {
    const colNumber = index + 1;
    const cell = headerRow.getCell(colNumber);
    cell.value = headerText;
    cell.font = { name: 'Calibri', size: 11, bold: true, color: { argb: 'FFFFFFFF' } };
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF366EA8' }, // Corporate Steel-Blue matching the user's reference image
    };
    cell.alignment = {
      vertical: 'middle',
      horizontal: 'center',
      wrapText: false,
    };
    cell.border = {
      top: { style: 'thin', color: { argb: 'FF2A5785' } },
      left: { style: 'thin', color: { argb: 'FF2A5785' } },
      bottom: { style: 'medium', color: { argb: 'FF1C3D60' } },
      right: { style: 'thin', color: { argb: 'FF2A5785' } },
    };
  });

  const thinBorder: Partial<ExcelJS.Borders> = {
    top: { style: 'thin', color: { argb: 'FFD1D5DB' } },
    left: { style: 'thin', color: { argb: 'FFD1D5DB' } },
    bottom: { style: 'thin', color: { argb: 'FFD1D5DB' } },
    right: { style: 'thin', color: { argb: 'FFD1D5DB' } },
  };

  let currentRowIdx = 6;
  let totalLiters = 0;

  if (dispenses.length === 0) {
    const emptyRow = worksheet.getRow(currentRowIdx);
    emptyRow.height = 24;
    worksheet.mergeCells(`A${currentRowIdx}:J${currentRowIdx}`);
    const emptyCell = emptyRow.getCell(1);
    emptyCell.value = 'Nenhum registro de abastecimento para o filtro selecionado.';
    emptyCell.font = { name: 'Calibri', size: 10, italic: true, color: { argb: 'FF6B7280' } };
    emptyCell.alignment = { vertical: 'middle', horizontal: 'center' };
    emptyCell.border = thinBorder;
    currentRowIdx++;
  } else {
    dispenses.forEach((d) => {
      const equip = equipments.find(
        (eq) =>
          (eq.plate && eq.plate.trim().toUpperCase() === d.equipmentCode.trim().toUpperCase()) ||
          eq.code.trim().toUpperCase() === d.equipmentCode.trim().toUpperCase() ||
          (eq.prefix && eq.prefix.trim().toUpperCase() === d.equipmentCode.trim().toUpperCase())
      );

      const dataStr = formatDateBR(d.date);
      const comboioStr = d.convoyPlate || '';
      const placaStr = equip?.plate || d.equipmentCode || '-';
      const equipamentoStr = (
        d.equipmentType ||
        equip?.type ||
        equip?.equipmentType ||
        equip?.model ||
        equip?.prefix ||
        d.equipmentCode ||
        '-'
      ).toUpperCase();
      const fornecedorStr = d.supplier || equip?.supplier || '-';
      const obraStr = d.location || equip?.location || defaultObra;

      // Numerical Horímetro parsing
      let horimetroVal: number | string = '-';
      if (d.equipmentMeter !== undefined && d.equipmentMeter !== null) {
        if (typeof d.equipmentMeter === 'number' && !isNaN(d.equipmentMeter)) {
          horimetroVal = d.equipmentMeter;
        } else {
          const parsed = parseFloat(
            String(d.equipmentMeter)
              .replace(/\b(horas|hora|km|h)\b/gi, '')
              .replace(',', '.')
              .trim()
          );
          horimetroVal = !isNaN(parsed) ? parsed : String(d.equipmentMeter).trim();
        }
      }

      const inicianteVal = Number(d.initialMeter) || 0;
      const encerranteVal = Number(d.finalMeter) || 0;
      const litrosVal = Number(d.liters) || 0;
      totalLiters += litrosVal;

      const row = worksheet.getRow(currentRowIdx);
      row.height = 20;

      // 1. Data (Centered)
      const c1 = row.getCell(1);
      c1.value = dataStr;
      c1.alignment = { vertical: 'middle', horizontal: 'center' };
      c1.font = { name: 'Calibri', size: 10 };
      c1.border = thinBorder;

      // 2. Comboio (Centered)
      const c2 = row.getCell(2);
      c2.value = comboioStr;
      c2.alignment = { vertical: 'middle', horizontal: 'center' };
      c2.font = { name: 'Calibri', size: 10, bold: true };
      c2.border = thinBorder;

      // 3. Placa (Centered)
      const c3 = row.getCell(3);
      c3.value = placaStr;
      c3.alignment = { vertical: 'middle', horizontal: 'center' };
      c3.font = { name: 'Calibri', size: 10, bold: true };
      c3.border = thinBorder;

      // 4. Equipamento (Left-aligned)
      const c4 = row.getCell(4);
      c4.value = equipamentoStr;
      c4.alignment = { vertical: 'middle', horizontal: 'left' };
      c4.font = { name: 'Calibri', size: 10 };
      c4.border = thinBorder;

      // 5. Fornecedor (Left-aligned)
      const c5 = row.getCell(5);
      c5.value = fornecedorStr;
      c5.alignment = { vertical: 'middle', horizontal: 'left' };
      c5.font = { name: 'Calibri', size: 10 };
      c5.border = thinBorder;

      // 6. Obra (Centered)
      const c6 = row.getCell(6);
      c6.value = obraStr;
      c6.alignment = { vertical: 'middle', horizontal: 'center' };
      c6.font = { name: 'Calibri', size: 10 };
      c6.border = thinBorder;

      // 7. Horímetro (Right-aligned / Centered)
      const c7 = row.getCell(7);
      c7.value = horimetroVal;
      c7.alignment = { vertical: 'middle', horizontal: 'right' };
      c7.font = { name: 'Calibri', size: 10 };
      if (typeof horimetroVal === 'number') {
        c7.numFmt = Number.isInteger(horimetroVal) ? '#,##0' : '#,##0.0';
      }
      c7.border = thinBorder;

      // 8. Iniciante (Right-aligned numeric)
      const c8 = row.getCell(8);
      c8.value = inicianteVal;
      c8.alignment = { vertical: 'middle', horizontal: 'right' };
      c8.font = { name: 'Calibri', size: 10 };
      c8.numFmt = '#,##0.0';
      c8.border = thinBorder;

      // 9. Encerrante (Right-aligned numeric)
      const c9 = row.getCell(9);
      c9.value = encerranteVal;
      c9.alignment = { vertical: 'middle', horizontal: 'right' };
      c9.font = { name: 'Calibri', size: 10 };
      c9.numFmt = '#,##0.0';
      c9.border = thinBorder;

      // 10. Litros (Right-aligned numeric)
      const c10 = row.getCell(10);
      c10.value = litrosVal;
      c10.alignment = { vertical: 'middle', horizontal: 'right' };
      c10.font = { name: 'Calibri', size: 10, bold: true };
      c10.numFmt = '#,##0.0';
      c10.border = thinBorder;

      currentRowIdx++;
    });

    // Summary / Total Row
    const totalRow = worksheet.getRow(currentRowIdx);
    totalRow.height = 22;

    worksheet.mergeCells(`A${currentRowIdx}:I${currentRowIdx}`);
    const labelTotalCell = totalRow.getCell(1);
    labelTotalCell.value = 'TOTAL GERAL DE LITROS:';
    labelTotalCell.alignment = { vertical: 'middle', horizontal: 'right' };
    labelTotalCell.font = { name: 'Calibri', size: 11, bold: true, color: { argb: 'FF1F2937' } };
    labelTotalCell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFF3F4F6' },
    };

    // Border across merged cells
    for (let c = 1; c <= 9; c++) {
      totalRow.getCell(c).border = {
        top: { style: 'thin', color: { argb: 'FF9CA3AF' } },
        bottom: { style: 'double', color: { argb: 'FF111827' } },
        left: c === 1 ? { style: 'thin', color: { argb: 'FF9CA3AF' } } : undefined,
      };
    }

    const valueTotalCell = totalRow.getCell(10);
    // Use formula if rows exist, or direct total
    const startRow = 6;
    const endRow = currentRowIdx - 1;
    valueTotalCell.value = {
      formula: `SUM(J${startRow}:J${endRow})`,
      result: Number(totalLiters.toFixed(1)),
    };
    valueTotalCell.numFmt = '#,##0.0';
    valueTotalCell.alignment = { vertical: 'middle', horizontal: 'right' };
    valueTotalCell.font = { name: 'Calibri', size: 11, bold: true, color: { argb: 'FF000000' } };
    valueTotalCell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFFDE047' }, // Soft yellow highlight on total liters
    };
    valueTotalCell.border = {
      top: { style: 'thin', color: { argb: 'FF9CA3AF' } },
      bottom: { style: 'double', color: { argb: 'FF111827' } },
      right: { style: 'thin', color: { argb: 'FF9CA3AF' } },
      left: { style: 'thin', color: { argb: 'FF9CA3AF' } },
    };
  }

  // Generate and download XLSX buffer
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  const today = getTodayDateString();
  const filename = options.customFilename || `makmo_relatorio_abastecimentos_${today}.xlsx`;
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
