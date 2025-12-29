import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import React from "react";

/**
 * Hàm đệ quy để lấy text từ React Node (JSX)
 */
export const extractTextFromJSX = (node: any): any => {
  if (node === null || node === undefined) return "";
  if (typeof node === "string" || typeof node === "number" || typeof node === "boolean") return node;
  if (Array.isArray(node))
    return node
      .map((child) => extractTextFromJSX(child))
      .join(" ")
      .trim();
  if (React.isValidElement(node)) {
    const props = node.props as any;
    if (props && props.children) return extractTextFromJSX(props.children);
    return "";
  }
  return String(node);
};

/**
 * Hàm để lấy các cột lá (leaf columns) từ cấu trúc cột lồng nhau
 */
export const flattenColumns = (columns: any[]): any[] => {
  let result: any[] = [];
  columns.forEach((col) => {
    if (col.children) {
      result = result.concat(flattenColumns(col.children));
    } else {
      result.push(col);
    }
  });
  return result;
};

const getHeaderDepth = (columns: any[]): number => {
  let maxDepth = 0;
  const traverse = (cols: any[], depth: number) => {
    maxDepth = Math.max(maxDepth, depth);
    cols.forEach((col) => {
      if (col.children && col.children.length > 0) traverse(col.children, depth + 1);
    });
  };
  traverse(columns, 1);
  return maxDepth;
};

const getColSpan = (column: any): number => {
  if (!column.children || column.children.length === 0) return 1;
  return column.children.reduce((acc: number, child: any) => acc + getColSpan(child), 0);
};

/**
 * Xuất dữ liệu ra file Excel với border và tiêu đề căn giữa
 */
export const exportToExcel = async (originColumns: any[], dataSource: any[], fileName: string) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Data");

  // 1. Lọc cột
  const filterColumns = originColumns.filter((col) => col.key !== "action" && col.dataIndex !== "action");
  const maxDepth = getHeaderDepth(filterColumns);
  const leafColumns = flattenColumns(filterColumns);

  // 2. Tạo Header với Merges
  const fillHeader = (cols: any[], rowIdx: number, colStart: number) => {
    let currentC = colStart;
    cols.forEach((col) => {
      const colSpan = getColSpan(col);
      const rowSpan = col.children && col.children.length > 0 ? 1 : maxDepth - rowIdx;

      const cell = worksheet.getRow(rowIdx + 1).getCell(currentC + 1);
      cell.value = extractTextFromJSX(col.title);

      // Style cho header: Canh giữa, Border, In đậm, Màu nền nhẹ
      cell.alignment = { vertical: "middle", horizontal: "center", wrapText: true };
      cell.font = { bold: true };
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFF2F2F2" }
      };

      if (colSpan > 1 || rowSpan > 1) {
        worksheet.mergeCells(rowIdx + 1, currentC + 1, rowIdx + rowSpan, currentC + colSpan);
      }

      if (col.children && col.children.length > 0) {
        fillHeader(col.children, rowIdx + 1, currentC);
      }
      currentC += colSpan;
    });
  };

  fillHeader(filterColumns, 0, 0);

  // 3. Điền Dữ liệu
  dataSource.forEach((item, index) => {
    const rowIdx = maxDepth + index + 1;
    const row = worksheet.getRow(rowIdx);

    leafColumns.forEach((col, colIdx) => {
      const dataIndex = col.dataIndex as string;
      const value = dataIndex ? (item as any)[dataIndex] : undefined;
      const cell = row.getCell(colIdx + 1);

      if (col.render) {
        cell.value = extractTextFromJSX(col.render(value, item, index));
      } else {
        cell.value = value ?? "";
      }
    });
  });

  // 4. Áp dụng Border cho toàn bộ bảng và Auto-width
  worksheet.eachRow((row) => {
    row.eachCell((cell) => {
      cell.border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" }
      };
    });
  });

  // Set độ rộng cột dựa trên width của config
  leafColumns.forEach((col, idx) => {
    const antdWidth = typeof col.width === "number" ? col.width : 160;
    worksheet.getColumn(idx + 1).width = Math.max(10, antdWidth / 7.5);
    worksheet.getColumn(idx + 1).alignment = col.align ? { horizontal: col.align } : { horizontal: "left" };
  });

  // 5. Xuất file
  const buffer = await workbook.xlsx.writeBuffer();
  saveAs(new Blob([buffer]), `${fileName}_${new Date().getTime()}.xlsx`);
};
