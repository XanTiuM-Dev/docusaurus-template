import React from "react";

type CSVTableProps = {
  title?: string;
  src: string; // chemin vers le CSV
  maxRows?: number;
  data: string[][];
};

export default function CSVTable({ title, src, maxRows = 10, data, }: CSVTableProps) {
  return (
    <div className="csvBlock theme-code-block">
      {(title || src) && (
        <div className="csvBlockHeader">
          <span className="csvBlockTitle">{title ?? src}</span>
          <span className="csvBlockLang">CSV</span>
        </div>
      )}

      <div className="csvBlockContent" style={{ "--csv-max-rows": maxRows } as React.CSSProperties}>
        <table className="csvBlockTable">
          <thead className="csvBlockHead">
            <tr className="csvBlockRow csvRowHead">
              {data[0].map((col, idx) => (
                <th key={idx} className="csvBlockCell csvCellHead">
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="csvBlockBody">
            {data.slice(1).map((row, rIdx) => (
              <tr key={rIdx} className="csvBlockRow csvRowBody">
                {row.map((cell, cIdx) => (
                  <td key={cIdx} className="csvBlockCell csvCellBody">
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
