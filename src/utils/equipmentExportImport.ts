import ExcelJS from 'exceljs';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Equipment } from '../types';
import { formatDateBR, getTodayDateString } from './storage';

/**
 * Normalizes date display format to DD/MM/AAAA
 */
export function formatDisplayDate(dateStr?: string): string {
  if (!dateStr || !dateStr.trim()) return '-';
  const clean = dateStr.trim();
  // If already DD/MM/AAAA
  if (/^\d{2}\/\d{2}\/\d{4}$/.test(clean)) return clean;
  // If YYYY-MM-DD
  if (/^\d{4}-\d{2}-\d{2}/.test(clean)) {
    const [y, m, d] = clean.split('T')[0].split('-');
    return `${d}/${m}/${y}`;
  }
  return formatDateBR(clean);
}

/**
 * Exports equipments list to professional Excel (.xlsx) file
 * Sequence: Equipamento, Placa, Prefixo, Modelo, Marca, Fornecedor, Obra, Chassi, Data de Desmobilização
 */
export async function exportEquipmentsToExcel(
  equipments: Equipment[],
  obraLabel = 'Geral'
): Promise<void> {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'Makmo Gestão de Frotas';
  workbook.created = new Date();

  const sheet = workbook.addWorksheet('Base de Equipamentos', {
    views: [{ showGridLines: true }],
  });

  // Title Row
  sheet.mergeCells('A1:I1');
  const titleCell = sheet.getCell('A1');
  titleCell.value = `MAKMO INFRAESTRUTURA • BASE DE DADOS DE EQUIPAMENTOS - ${obraLabel.toUpperCase()}`;
  titleCell.font = { name: 'Arial', size: 13, bold: true, color: { argb: 'FFFFFFFF' } };
  titleCell.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FF1F2937' },
  };
  titleCell.alignment = { vertical: 'middle', horizontal: 'center' };
  sheet.getRow(1).height = 30;

  // Subtitle info
  sheet.mergeCells('A2:I2');
  const subCell = sheet.getCell('A2');
  subCell.value = `Data de emissão: ${formatDateBR(getTodayDateString())} | Total de máquinas: ${equipments.length}`;
  subCell.font = { name: 'Arial', size: 9, italic: true, color: { argb: 'FF4B5563' } };
  subCell.alignment = { vertical: 'middle', horizontal: 'center' };
  sheet.getRow(2).height = 18;

  // Header Row - Sequence strictly:
  // 1. Equipamento, 2. Placa, 3. Prefixo, 4. Modelo, 5. Marca, 6. Fornecedor, 7. Obra, 8. Chassi, 9. Data de Desmobilização
  const headers = [
    'Equipamento',
    'Placa',
    'Prefixo',
    'Modelo',
    'Marca',
    'Fornecedor',
    'Obra',
    'Chassi',
    'Data de Desmobilização',
  ];

  const headerRow = sheet.addRow(headers);
  headerRow.height = 24;

  headerRow.eachCell((cell) => {
    cell.font = { name: 'Arial', size: 10, bold: true, color: { argb: 'FF000000' } };
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFF59E0B' }, // Amber-500
    };
    cell.alignment = { vertical: 'middle', horizontal: 'center' };
    cell.border = {
      top: { style: 'thin', color: { argb: 'FF9CA3AF' } },
      left: { style: 'thin', color: { argb: 'FF9CA3AF' } },
      bottom: { style: 'medium', color: { argb: 'FF1F2937' } },
      right: { style: 'thin', color: { argb: 'FF9CA3AF' } },
    };
  });

  // Data Rows
  equipments.forEach((eq, idx) => {
    const row = sheet.addRow([
      eq.type || '-',
      eq.plate || '-',
      eq.prefix || eq.code || '-',
      eq.model || (eq.brandModel ? eq.brandModel : '-'),
      eq.brand || '-',
      eq.supplier || 'Frota Própria',
      eq.location || '-',
      eq.chassis || '-',
      formatDisplayDate(eq.demobilizationDate),
    ]);

    row.height = 20;
    const isEven = idx % 2 === 0;

    row.eachCell((cell, colNumber) => {
      cell.font = { name: 'Arial', size: 9 };
      cell.alignment = {
        vertical: 'middle',
        horizontal: colNumber === 2 || colNumber === 3 || colNumber === 8 || colNumber === 9 ? 'center' : 'left',
      };
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: isEven ? 'FFFFFFFF' : 'FFF9FAFB' },
      };
      cell.border = {
        top: { style: 'thin', color: { argb: 'FFE5E7EB' } },
        left: { style: 'thin', color: { argb: 'FFE5E7EB' } },
        bottom: { style: 'thin', color: { argb: 'FFE5E7EB' } },
        right: { style: 'thin', color: { argb: 'FFE5E7EB' } },
      };
    });
  });

  // Adjust column widths
  sheet.columns = [
    { width: 28 }, // 1. Equipamento
    { width: 14 }, // 2. Placa
    { width: 14 }, // 3. Prefixo
    { width: 22 }, // 4. Modelo
    { width: 20 }, // 5. Marca
    { width: 24 }, // 6. Fornecedor
    { width: 20 }, // 7. Obra
    { width: 24 }, // 8. Chassi
    { width: 24 }, // 9. Data de Desmobilização
  ];

  // Write and trigger download
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  const safeObra = obraLabel.replace(/[/\\?%*:|"<>]/g, '-').replace(/\s+/g, '_');
  a.download = `Equipamentos_${safeObra}_${getTodayDateString()}.xlsx`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Exports equipments list to professional PDF file
 * Sequence: Equipamento, Placa, Prefixo, Modelo, Marca, Fornecedor, Obra, Chassi, Data de Desmobilização
 */
export function exportEquipmentsToPDF(
  equipments: Equipment[],
  obraLabel = 'Geral'
): void {
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4',
  });

  // Title Banner
  doc.setFillColor(31, 41, 55); // Dark Slate #1F2937
  doc.rect(0, 0, 297, 20, 'F');

  doc.setTextColor(245, 158, 11); // Amber #F59E0B
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.text('MAKMO INFRAESTRUTURA', 14, 10);

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(10);
  doc.text(`BASE DE DADOS DE EQUIPAMENTOS • ${obraLabel.toUpperCase()}`, 14, 16);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(209, 213, 219);
  doc.text(
    `Emissão: ${formatDateBR(getTodayDateString())} | Total de Registros: ${equipments.length}`,
    297 - 14,
    14,
    { align: 'right' }
  );

  // Table Data - Sequence:
  // 1. Equipamento, 2. Placa, 3. Prefixo, 4. Modelo, 5. Marca, 6. Fornecedor, 7. Obra, 8. Chassi, 9. Data de Desmobilização
  const head = [
    [
      'Equipamento',
      'Placa',
      'Prefixo',
      'Modelo',
      'Marca',
      'Fornecedor',
      'Obra',
      'Chassi',
      'Data de Desmobilização',
    ],
  ];

  const body = equipments.map((eq) => [
    eq.type || '-',
    eq.plate || '-',
    eq.prefix || eq.code || '-',
    eq.model || (eq.brandModel ? eq.brandModel : '-'),
    eq.brand || '-',
    eq.supplier || 'Frota Própria',
    eq.location || '-',
    eq.chassis || '-',
    formatDisplayDate(eq.demobilizationDate),
  ]);

  autoTable(doc, {
    startY: 24,
    head,
    body,
    theme: 'grid',
    styles: {
      fontSize: 8,
      cellPadding: 2,
      valign: 'middle',
      lineColor: [229, 231, 235],
      lineWidth: 0.1,
    },
    headStyles: {
      fillColor: [245, 158, 11], // Amber 500
      textColor: [0, 0, 0],
      fontStyle: 'bold',
      halign: 'center',
    },
    alternateRowStyles: {
      fillColor: [249, 250, 251],
    },
    columnStyles: {
      0: { cellWidth: 38 }, // Equipamento
      1: { halign: 'center', cellWidth: 22 }, // Placa
      2: { halign: 'center', cellWidth: 20 }, // Prefixo
      3: { cellWidth: 32 }, // Modelo
      4: { cellWidth: 28 }, // Marca
      5: { cellWidth: 36 }, // Fornecedor
      6: { cellWidth: 28 }, // Obra
      7: { halign: 'center', cellWidth: 34 }, // Chassi
      8: { halign: 'center', cellWidth: 31 }, // Data de Desmobilização
    },
    didDrawPage: (data) => {
      // Footer page numbering
      const str = `Página ${data.pageNumber} de ${doc.getNumberOfPages()}`;
      doc.setFontSize(8);
      doc.setTextColor(156, 163, 175);
      doc.text(str, 297 - 14, 205, { align: 'right' });
    },
  });

  const safeObra = obraLabel.replace(/[/\\?%*:|"<>]/g, '-').replace(/\s+/g, '_');
  doc.save(`Equipamentos_${safeObra}_${getTodayDateString()}.pdf`);
}

/**
 * Parses uploaded Excel or CSV file to import equipments with Chassi and Desmobilizacao
 */
export async function parseEquipmentsFromExcel(
  file: File,
  defaultLocation?: string
): Promise<Array<Omit<Equipment, 'id' | 'createdAt' | 'updatedAt'>>> {
  const buffer = await file.arrayBuffer();
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.load(buffer);

  const worksheet = workbook.worksheets[0];
  if (!worksheet) {
    throw new Error('Nenhuma planilha encontrada no arquivo Excel.');
  }

  const result: Array<Omit<Equipment, 'id' | 'createdAt' | 'updatedAt'>> = [];

  // Identify column indices based on header row
  let headerRowIndex = 1;
  let colEquip = -1;
  let colPlaca = -1;
  let colPrefixo = -1;
  let colModelo = -1;
  let colMarca = -1;
  let colFornecedor = -1;
  let colObra = -1;
  let colChassi = -1;
  let colDesmob = -1;
  let colHorimetro = -1;

  worksheet.eachRow((row, rowNumber) => {
    if (headerRowIndex === 1) {
      const values = row.values as Array<any>;
      const hasKeywords = values.some(
        (v) =>
          typeof v === 'string' &&
          /equipamento|placa|prefixo|modelo|marca|fornecedor|obra|chassi/i.test(v)
      );
      if (hasKeywords) {
        headerRowIndex = rowNumber;
        values.forEach((v, idx) => {
          if (typeof v === 'string') {
            const low = v.toLowerCase();
            if (low.includes('equipamento') || low.includes('tipo')) colEquip = idx;
            else if (low.includes('placa')) colPlaca = idx;
            else if (low.includes('prefixo') || low.includes('código') || low.includes('codigo')) colPrefixo = idx;
            else if (low.includes('modelo')) colModelo = idx;
            else if (low.includes('marca')) colMarca = idx;
            else if (low.includes('fornecedor') || low.includes('locador')) colFornecedor = idx;
            else if (low.includes('obra') || low.includes('local')) colObra = idx;
            else if (low.includes('chassi')) colChassi = idx;
            else if (low.includes('desmobiliza') || low.includes('desmobilização')) colDesmob = idx;
            else if (low.includes('horímetro') || low.includes('horimetro')) colHorimetro = idx;
          }
        });
        return;
      }
    }

    if (rowNumber > headerRowIndex) {
      const rowVals = row.values as Array<any>;
      const rawType = colEquip > -1 ? String(rowVals[colEquip] || '').trim() : '';
      const rawPlate = colPlaca > -1 ? String(rowVals[colPlaca] || '').trim().toUpperCase() : '';
      const rawPrefix = colPrefixo > -1 ? String(rowVals[colPrefixo] || '').trim().toUpperCase() : '';
      const rawModel = colModelo > -1 ? String(rowVals[colModelo] || '').trim() : '';
      const rawBrand = colMarca > -1 ? String(rowVals[colMarca] || '').trim() : '';
      const rawSupplier = colFornecedor > -1 ? String(rowVals[colFornecedor] || '').trim() : 'Frota Própria';
      const rawLocation = colObra > -1 ? String(rowVals[colObra] || '').trim() : defaultLocation || '';
      const rawChassi = colChassi > -1 ? String(rowVals[colChassi] || '').trim() : '';
      const rawDesmobVal = colDesmob > -1 ? rowVals[colDesmob] : '';
      let desmobStr = '';
      if (rawDesmobVal instanceof Date) {
        const d = String(rawDesmobVal.getDate()).padStart(2, '0');
        const m = String(rawDesmobVal.getMonth() + 1).padStart(2, '0');
        const y = rawDesmobVal.getFullYear();
        desmobStr = `${d}/${m}/${y}`;
      } else if (rawDesmobVal) {
        desmobStr = String(rawDesmobVal).trim();
      }

      const rawHorimetro = colHorimetro > -1 ? parseFloat(String(rowVals[colHorimetro] || '0').replace(',', '.')) : 0;

      // Only add if there is minimum identification
      if (rawType || rawPlate || rawPrefix) {
        const cleanCode = rawPrefix || rawPlate || `EQ-${result.length + 1}`;
        result.push({
          type: rawType || 'Equipamento',
          plate: rawPlate,
          prefix: rawPrefix,
          model: rawModel,
          brand: rawBrand,
          supplier: rawSupplier || 'Frota Própria',
          location: rawLocation || defaultLocation || '',
          chassis: rawChassi,
          demobilizationDate: desmobStr,
          code: cleanCode,
          currentHourMeter: isNaN(rawHorimetro) ? 0 : rawHorimetro,
        });
      }
    }
  });

  return result;
}
