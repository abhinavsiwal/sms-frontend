import React from "react";
import { Table } from "ant-table-extensions";

const AntTable = ({
  columns,
  data,
  exportFileName,
  disabled = false,
  showPagination = true,
  showOverFlow = false,
}) => {
  return (
    <div
    style={{  overflowX: `${showOverFlow ?"auto":""}` }}
    >
      <Table
        style={{ whiteSpace: "pre" }}
        columns={columns}
        dataSource={data}
        exportableProps={{
          fileName: exportFileName,
          showColumnPicker: true,
          disabled: disabled,
        }}
        // pagination={false}
        pagination={
          showPagination
            ? {
                pageSizeOptions: ["5", "10", "30", "60", "100", "1000"],
                showSizeChanger: true,
              }
            : false
        }
      />
    </div>
  );
};

export default AntTable;
