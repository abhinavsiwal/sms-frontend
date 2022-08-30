import React from "react";
import DataTable from "react-data-table-component";
const AttendanceTable = (props) => {
  const isHoliday = (date) => {
    if (!date.getDay()) {
      return true;
    }
    for (let holiday of props.holidays) {
      const from = new Date(holiday.from.getTime());
      const to = new Date(holiday.to.getTime());
      const dateClone = new Date(date.getTime());
      from.setHours(0, 0, 0, 0);
      to.setHours(0, 0, 0, 0);
      dateClone.setHours(0, 0, 0, 0);
      if (dateClone >= from && dateClone <= to) {
        return true;
      }
    }
    return false;
  };
  const formatDate = (date) => {
    var d = date ? new Date(date) : new Date(),
      month = "" + (d.getMonth() + 1),
      day = "" + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;

    return [day, month, year].join("/");
  };

  const getColumnList = () => {
    const columns = [
      {
        name: "#",
        cell: (person, index) => index + 1,
        width: "50px",
      },
      {
        name: "Name",
        cell: (person) => person.firstName + " " + person.lastName,
        width: "200px",
      },
    ];
    for (
      let date = new Date(props.startDate.getTime()), index = 0;
      date <= props.endDate;
      date.setDate(date.getDate() + 1), index++
    ) {
      columns.push({
        name: <span title={formatDate(date)}>{date.getDate()}</span>,
        center: true,
        cell: (person, studentIndex) => {
          const status = person.attendance[index].status;
          const currentDate = person.attendance[index].heldOnDate;
          if (currentDate < person.joiningDate) {
            return null;
          }
          if (currentDate > new Date()) {
            return null;
          }
          if (isHoliday(currentDate)) {
            return null;
          }
          return (
            <span
              style={{ cursor: props.readOnly ? "default" : "pointer" }}
              onClick={(event) =>
                !props.readOnly
                  ? props.changeAttendance(studentIndex, index)
                  : null
              }
            >
              {status === "P" ? (
                <i
                  className="ni ni-single-02 text-light bg-success p-2"
                  style={{ borderRadius: "50%" }}
                />
              ) : status === "A" ? (
                <i
                  className="ni ni-single-02 text-light bg-danger p-2"
                  style={{ borderRadius: "50%" }}
                />
              ) : status === "L" ? (
                <i
                  className="ni ni-single-02 text-light bg-warning p-2"
                  style={{ borderRadius: "50%" }}
                />
              ) : null}
            </span>
          );
        },
        width: "40px",
      });
    }
    return columns;
  };

  return (
    <div className="card">
      <DataTable
        columns={getColumnList()}
        data={props.attendanceList}
        persistTableHead={true}
        progressPending={props.isLoading}
        selectableRowsVisibleOnly={true}
      />
    </div>
  );
};
 
export default AttendanceTable;
