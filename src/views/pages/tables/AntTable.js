import React from "react";
import { Table } from "ant-table-extensions";

const AntTable = ({ columns, data, exportFileName }) => {
  return (
    <div
    // style={{ overflowX: "auto" }}
    >
      <Table
        style={{ whiteSpace: "pre" }}
        columns={columns}
        dataSource={data}
        exportableProps={{
          fileName: exportFileName,
          showColumnPicker: true,
        }}
        pagination={{
          pageSizeOptions: ["5", "10", "30", "60", "100", "1000"],
          showSizeChanger: true,
        }}
      />
    </div>
  );
};

export default AntTable;
