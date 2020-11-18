const Table = ({ columns, rows, onClick }) => (
  <div className="table-container">
    <div className="table-header">
      {columns.map(({ label, className }, index) => (
        <span
          className={`table-header-item ${className || ""}`}
          key={`table-header-${index}`}
        >
          {label}
        </span>
      ))}
    </div>
    <div className="table-body">
      {rows.map((row, index) => (
        <div
          key={`table-row-${index}`}
          className="table-row"
          onClick={() => {
            onClick ? onClick(row) : null;
          }}
        >
          {columns.map(({ id, render, className }, index2) => (
            <div
              key={`table-row-item-${index2}`}
              className={`table-row-item ${className || ""}`}
            >
              {render ? render(row) : row[id]}
            </div>
          ))}
        </div>
      ))}
    </div>
  </div>
);

export default Table;
