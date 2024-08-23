import * as XLSX from 'xlsx';

const exportToExcel = (fileName, dataRef) => {
    const workbook = XLSX.utils.table_to_book(dataRef, { sheet: 'Sheet1' });

    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];

    const columnWidths = getColumnWidths(dataRef);

    worksheet['!cols'] = columnWidths;

    XLSX.writeFile(workbook, `${fileName}.xlsx`);
}

const getColumnWidths = (tableRef) => {
    const columns = tableRef.querySelectorAll('tr:first-child td');
    const colWidths = [];

    columns.forEach((column, columnIndex) => {
        const colTextLengths = [];
        const rows = tableRef.querySelectorAll('tr');

        rows.forEach(row => {
            const cell = row.querySelectorAll('td')[columnIndex];
            const cellText = cell ? cell.innerText : '';
            colTextLengths.push(cellText.length);
        });

        const maxLength = Math.max(...colTextLengths);
        colWidths.push({ wch: maxLength + 2 });
    });

    return colWidths;
}

export { exportToExcel };