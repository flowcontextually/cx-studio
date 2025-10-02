// /home/dpwanjala/repositories/cx-studio/src/widgets/OutputViewer/renderers/TableOutput.tsx

import React, { useMemo } from "react";
import { HotTable } from "@handsontable/react-wrapper";
import { Text } from "@mantine/core";
// --- START OF FIX: Import types from Handsontable ---
import { Handsontable } from "@/shared/lib/handsontable";
// --- END OF FIX ---

interface TableOutputProps {
  data: Record<string, any>[];
}

export default function TableOutput({ data }: TableOutputProps) {
  if (!data || data.length === 0) {
    return <Text c="dimmed">No records to display.</Text>;
  }

  const { colHeaders, columns, tableData } = useMemo(() => {
    const headers = Object.keys(data[0]);

    // --- START OF FIX: Define types for the renderer function ---
    const columnSettings = headers.map((key) => ({
      data: key,
      title: key.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()),
      // Type the arguments for the custom renderer function
      renderer: (
        _instance: Handsontable.Core, // We use an underscore to indicate it's unused
        td: HTMLTableCellElement,
        _row: number,
        _col: number,
        _prop: string | number,
        value: any,
        _cellProperties: Handsontable.CellProperties
      ) => {
        // Now TypeScript knows what 'td' and 'value' are
        if (typeof value === "object" && value !== null) {
          td.innerText = JSON.stringify(value);
        } else {
          td.innerText = String(value ?? "");
        }
        return td;
      },
    }));
    // --- END OF FIX ---

    return { colHeaders: headers, columns: columnSettings, tableData: data };
  }, [data]);

  // ... rest of the component remains the same
  return (
    <div
      className="handsontable-container"
      style={{ width: "100%", height: "auto" }}
    >
      <HotTable
        data={tableData}
        colHeaders={colHeaders}
        columns={columns}
        rowHeaders={true}
        height="auto"
        width="100%"
        autoWrapRow={true}
        autoWrapCol={true}
        manualColumnResize={true}
        manualRowResize={true}
        colWidths={150}
        filters={true}
        dropdownMenu={true}
        columnSorting={true}
        stretchH="all"
        licenseKey="non-commercial-and-evaluation"
      />
    </div>
  );
}
