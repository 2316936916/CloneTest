import { useCallback } from 'react';
import XLSX from 'xlsx';

const useXLSXExport = (fieldList) => {
  const action = useCallback((data, fileName, sheetName = 'sheet1') => {
    const wb = XLSX.utils.book_new();
    wb.SheetNames.push(sheetName);
    const aoa = [
      fieldList.map((fieldItem) => fieldItem.key),
    ];
    const len = data.length;
    for (let i = 0; i < len; i++) {
      const d = data[i];
      const row = [];
      for (let j = 0; j < fieldList.length; j++) {
        const fieldItem = fieldList[j];
        row.push(fieldItem.getValue(d));
      }
      aoa.push(row);
    }
    const ws = XLSX.utils.aoa_to_sheet(aoa);
    ws['!cols'] = fieldList.map((item) => ({
      wpx: item.width,
    }));
    wb.Sheets[sheetName] = ws;
    XLSX.writeFile(wb, `${fileName}.xlsx`);
  }, [fieldList]);

  return {
    action,
  };
};

export default useXLSXExport;
