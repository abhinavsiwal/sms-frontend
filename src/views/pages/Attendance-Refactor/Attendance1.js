import React, { useEffect, useState, useReducer } from "react";

import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  Form,
  Label,
  Input,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  CardHeader,
  Table,
} from "reactstrap";

import { postAttendance, searchAttendance } from "api/attendance";
import SimpleHeader from "components/Headers/SimpleHeader.js";
import LoadingScreen from "react-loading-screen";
import { allClass } from "api/class";
import DatePicker from "react-datepicker";
import { toast, ToastContainer } from "react-toastify";
import { allSessions } from "api/session";
import { isAuthenticated } from "api/auth";
import AttendanceTable from "./AttendanceTable";
import { getStudentAttendance } from "api/attendance";
import DataTable from "react-data-table-component";
import AntTable from "../tables/AntTable";
import { element } from "prop-types";
import Logo from "react-loading-screen/dist/components/Logo";
import { updateAttendance } from "api/attendance";
import { updateStudentAttendance } from "api/attendance";
const Attendance1 = () => {
  const { user, token } = isAuthenticated();
  const today = new Date();
  const [classes, setClasses] = useState([]);
  const [startDate, setStartDate] = useState(
    new Date(today.getFullYear(), today.getMonth(), 1)
  );
  const [endDate, setEndDate] = useState(
    new Date(today.getFullYear(), today.getMonth() + 1, 1)
  );
  const [startDateAfterSearch, setStartDateAfterSearch] = useState(
    today.getFullYear(),
    today.getMonth(),
    1
  );
  const [endDateAfterSearch, setEndDateAfterSearch] = useState(
    today.getFullYear(),
    today.getMonth() + 1,
    0
  );
  const [attendanceList, setAttendanceList] = useState([]);
  const [oldAttendanceList, setOldAttendanceList] = useState([]);
  const [holidays, setHolidays] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [checked, setChecked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedClass, setSelectedClass] = useState({});
  const [viewAttendance, setViewAttendance] = useState(false);
  const [readOnly, setReadOnly] = useState(false);
  const [formData, setFormData] = useState([]);
  const [searchData, setSearchData] = useState({
    dateFrom: startDate,
    dateTo: endDate,
    name: "",
    studentId: "",
    session: "",
    selectClass: "",
    selectSection: "",
  });
  const [ignored, forceUpdate] = useReducer((x) => x + 1, 0);
  const getAllClass = async () => {
    const { user, token } = isAuthenticated();
    const classes = await allClass(user._id, user.school, token);
    console.log(classes);
    if (classes.err) {
      return toast.error(classes.err);
    } else {
      setClasses(classes);
      return;
    }
  };
  useEffect(() => {
    getAllClass();
    getSession();
  }, [checked]);

  useEffect(() => {
    if (sessions.length !== 0) {
      defaultSession1();
    }
  }, [sessions]);

  const defaultSession1 = async () => {
    const defaultSession = await sessions.find(
      (session) => session.status === "current"
    );
    setSearchData({
      ...searchData,
      session: defaultSession._id,
    });
  };

  //Getting Session data
  const getSession = async () => {
    const { user, token } = isAuthenticated();
    try {
      const session = await allSessions(user._id, user.school, token);
      console.log(session);
      if (session.err) {
        return toast.error(session.err);
      } else {
        setSessions(session);
      }
    } catch (err) {
      toast.error("Something Went Wrong!");
    }
  };
  const handleChange = (name) => (event) => {
    // formData.set(name, event.target.value);
    setSearchData({
      ...searchData,
      [name]: event.target.value,
    });
    if (name === "selectClass") {
      if (event.target.value === "") {
        setSelectedClass("");
      } else {
        let selectedClass = classes.find(
          (item) => item._id.toString() === event.target.value.toString()
        );
        // console.log(selectedClass);
        setSelectedClass(selectedClass);
      }
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();

    const formData = {
      session: searchData.session,
      from_date: startDate.toISOString().split('T')[0],
      to_date: endDate.toISOString().split('T')[0],
      class: searchData.selectClass,
      section: searchData.selectSection,
      name: searchData.name,
      studentId: searchData.studentId,
    };

    try {
      setLoading(true);
      const data = await getStudentAttendance(user._id, user.school, formData);
      console.log(data);
      if (data.err) {
        setLoading(false);
        return toast.error(data.err);
      }
      setViewAttendance(true);
      processAbsentList(data);
      setLoading(false);
    } catch (err) {
      console.log(err);
      toast.error("Something Went Wrong!");
      setLoading(false);
    }
  };

  const processAbsentList = (attendance) => {
    console.log(new Date(searchData.dateFrom), new Date(searchData.dateTo));
    const start = new Date(searchData.dateFrom);
    const end = new Date(searchData.dateTo);
    let dates = [];
    let loop = new Date(start);
    while (loop <= end) {
      dates.push(new Date(loop));
      let newDate = loop.setDate(loop.getDate() + 1);
      loop = new Date(newDate);
    }
    console.log(dates);
    console.log(attendance);
    attendance.forEach((att) => {
      console.log(att);
      let attendanceList = [];
      dates.forEach((date) => {
        const found = att.attandance.find(
          (el) => new Date(el.date).toDateString() === date.toDateString()
        );
        if (found) {
          attendanceList.push({
            date: date,
            attendance_status: found.attendance_status,
          });
        } else if (!found) {
          attendanceList.push({
            date: date,
            attendance_status: "P",
          });
        }
      });

      console.log(attendanceList);
      att.attandance = attendanceList;
    });
    console.log(attendance);
    setAttendanceList(attendance);
  };

  const formatDate = (date) => {
    var d = date ? new Date(date) : new Date(),
      month = "" + (d.getMonth() + 1),
      day = "" + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;

    return [year, month, day].join("/");
  };
  const formatDate1 = (date) => {
    var d = date ? new Date(date) : new Date(),
      month = "" + (d.getMonth() + 1),
      day = "" + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;

    return [year, month, day].join("-");
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
        cell: (person) => person.firstname + " " + person.lastname,
        width: "200px",
      },
    ];
    for (
      let date = new Date(searchData.dateFrom), index = 0;
      date <= new Date(searchData.dateTo);
      date.setDate(date.getDate() + 1), index++
    ) {
      columns.push({
        name: <span title={formatDate(date)}>{date.getDate()}</span>,
        center: true,
        cell: (person, studentIndex) => {
          const status = person.attandance[index].attendance_status;
          const currentDate = person.attandance[index].date;
          if (currentDate < person.joiningDate) {
            return null;
          }
          if (currentDate > new Date()) {
            return null;
          }

          return (
            <span
              style={{ cursor: readOnly ? "default" : "pointer" }}
              onClick={(event) =>
                !readOnly ? changeAttendance(studentIndex, index) : null
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
              ) : status === "H" ? (
                <i
                  className="ni ni-single-02 text-light bg-info p-2"
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
  const changeAttendance = (studentIndex, dateIndex) => {
    console.log(studentIndex, dateIndex);
    const attendanceList1 = attendanceList;
    const student = attendanceList1[studentIndex];

    switch (student.attandance[dateIndex].attendance_status) {
      case "P":
        student.attandance[dateIndex].attendance_status = "A";
        break;
      case "A":
        student.attandance[dateIndex].attendance_status = "L";
        break;
      case "L":
        student.attandance[dateIndex].attendance_status = "H";
        break;
      case "H":
        student.attandance[dateIndex].attendance_status = "P";
        break;
      default:
        break;
    }
    attendanceList1[studentIndex] = student;
    setAttendanceList(attendanceList1);
    forceUpdate();
    console.log(student);
    console.log(student.attandance[dateIndex]);

    let obj = {
      attendance_status: student.attandance[dateIndex].attendance_status,
      date:formatDate1(student.attandance[dateIndex].date),
      student: student._id,
    };
    setFormData([...formData, obj]);
  };
  useEffect(() => {
    getColumnList();
  }, [attendanceList]);

  const commitAttendance = async () => {
    console.log(formData);
    let attendanceData = formData.filter(
      (v, i, a) => a.findLastIndex((v2) => v2.student === v.student) === i
    );
    console.log(attendanceData);
    const formD = {
      attandance_data: attendanceData,
      class: searchData.selectClass,
      section: searchData.selectSection,
      from_date:formatDate1(searchData.dateFrom),
      to_date: formatDate1(searchData.dateTo),
      session: searchData.session,
    };
    try {
      setLoading(true);
      const data = await updateStudentAttendance(
        user._id,
        user.school,
        JSON.stringify(formD)
      );
      console.log(data);
      if (data.err) {
        toast.error(data.err);
        return setLoading(false);
      }
      setLoading(false);
      toast.success("Attendance Updated Successfully");
      setViewAttendance(false);
      setSearchData({
        
        dateFrom: startDate,
        dateTo: endDate,
        session: "",
        selectClass: "",
        selectSection: "",
      });
      setAttendanceList([]);
      setFormData([]);
    } catch (err) {
      console.log(err);
      setLoading(false);
      toast.error("Something went wrong");
    }
  };

  return (
    <>
      <SimpleHeader name="Student" parentName="Attendance" />
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
      <LoadingScreen
        loading={loading}
        bgColor="#f1f1f1"
        spinnerColor="#9ee5f8"
        textColor="#676767"
        text="Please Wait..."
      ></LoadingScreen>
      <Container className="mt--6" fluid>
        <Card>
          <CardHeader>
            <h2>Student Attendance</h2>
          </CardHeader>
          <CardBody>
            <form onSubmit={handleSearch}>
              <Row>
                <Col>
                  <Label
                    className="form-control-label"
                    htmlFor="xample-date-input"
                  >
                    Name
                  </Label>
                  <Input
                    className="form-control"
                    id="example4cols2Input"
                    placeholder="Name"
                    onChange={handleChange("name")}
                    value={searchData.name}
                    type="text"
                  />
                </Col>

                <Col>
                  <Label
                    className="form-control-label"
                    htmlFor="xample-date-input"
                  >
                    StudentID
                  </Label>
                  <Input
                    className="form-control"
                    id="example4cols2Input"
                    placeholder="StudentID"
                    type="text"
                    onChange={handleChange("studentId")}
                    value={searchData.studentId}
                  />
                </Col>
                <Col>
                  <Label
                    className="form-control-label"
                    htmlFor="xample-date-input"
                  >
                    From
                  </Label>
                  <DatePicker
                    dateFormat="dd/MM/yyyy"
                    placeholderText="dd/mm/yyyy"
                    onChange={(date) => setStartDate(date)}
                    value={startDate}
                    selected={startDate}
                    required
                    showMonthDropdown
                    showYearDropdown
                    dropdownMode="select"
                    className="datePicker"
                  />
                </Col>
                <Col>
                  <Label
                    className="form-control-label"
                    htmlFor="example-date-input"
                  >
                    To
                  </Label>
                  <DatePicker
                    dateFormat="dd/MM/yyyy"
                    placeholderText="dd/mm/yyyy"
                    onChange={(date) => setEndDate(date)}
                    value={endDate}
                    selected={endDate}
                    required
                    showMonthDropdown
                    showYearDropdown
                    dropdownMode="select"
                    className="datePicker"
                  />
                </Col>
              </Row>
              <Row>
                <Col>
                  <Label
                    className="form-control-label"
                    htmlFor="xample-date-input"
                  >
                    Select Class
                  </Label>
                  <Input
                    className="form-control"
                    id="exampleFormControlSelect3"
                    type="select"
                    onChange={handleChange("selectClass")}
                    value={searchData.selectClass}
                    // required
                  >
                    <option value="" selected>
                      Select Class
                    </option>
                    {classes &&
                      classes.map((clas, index) => {
                        // setselectedClassIndex(index)
                        // console.log(clas);
                        return (
                          <option value={clas._id} key={index}>
                            {clas.name}
                          </option>
                        );
                      })}
                  </Input>
                </Col>
                <Col>
                  <Label
                    className="form-control-label"
                    htmlFor="xample-date-input"
                  >
                    Select Section
                  </Label>
                  <Input
                    className="form-control"
                    id="exampleFormControlSelect3"
                    type="select"
                    onChange={handleChange("selectSection")}
                    value={searchData.selectSection}
                    // required
                  >
                    <option value="" disabled>
                      Select Section
                    </option>
                    {selectedClass !== "" &&
                      selectedClass.section &&
                      selectedClass.section.map((section) => {
                        // console.log(section.name);
                        return (
                          <option
                            value={section._id}
                            key={section._id}
                            selected
                          >
                            {section.name}
                          </option>
                        );
                      })}
                  </Input>
                </Col>
                <Col>
                  <label
                    className="form-control-label"
                    htmlFor="example4cols2Input"
                  >
                    Session
                  </label>

                  <select
                    className="form-control"
                    required
                    onChange={handleChange("session")}
                    value={searchData.session}
                  >
                    <option value="" disabled>
                      Select Session
                    </option>
                    {sessions &&
                      sessions.map((data) => {
                        return (
                          <option key={data._id} value={data._id}>
                            {data.name}
                          </option>
                        );
                      })}
                  </select>
                </Col>
                <Col style={{marginTop:"2rem"}} >
                  <Button color="primary" type="submit">
                    Search
                  </Button>
                </Col>
              </Row>
              <Row className="mt-4 float-right">
             
              </Row>
            </form>
          </CardBody>
        </Card>
      </Container>
      {viewAttendance && (
        <Container className="mt--0 shadow-lg table-responsive" fluid>
          <Card>
            <CardHeader>
              <Row className="header_main">
                <Col md={3}>
                  <div className="col-sm">
                    <h3 className="start-end">
                      {/* {startOfMonth} - {endOfMonth} */}
                    </h3>
                  </div>
                </Col>
                <Col>
                  <div className="icons_list">
                    <div>
                      <i
                        className="ni ni-single-02 text-light bg-success p-2"
                        style={{ borderRadius: "50%" }}
                      />
                      <span className="tags p-2">Present</span>
                    </div>
                    <div>
                      <i
                        className="ni ni-single-02 text-light bg-danger p-2"
                        style={{ borderRadius: "50%" }}
                      />
                      <span className="tags p-2">Absent</span>
                    </div>
                    <div>
                      <i
                        className="ni ni-single-02 text-light bg-warning p-2"
                        style={{ borderRadius: "50%" }}
                      />
                      <span className="tags p-2">Leave</span>
                    </div>
                    <div>
                      <i
                        className="ni ni-single-02 text-light bg-info p-2"
                        style={{ borderRadius: "50%" }}
                      />
                      <span className="tags p-2">Half Day</span>
                    </div>
                  </div>
                </Col>
                <Col className="buttons" md={3}>
                  <div className="col-sm">
                    <Button
                      className="attendance-button"
                      onClick={commitAttendance}
                      color="primary"
                    >
                      Save
                    </Button>
                  </div>
                </Col>
              </Row>
            </CardHeader>
            <CardBody>
              <DataTable
                columns={getColumnList()}
                data={attendanceList}
                persistTableHead={true}
                progressPending={loading}
                selectableRowsVisibleOnly={true}
              />
            </CardBody>
          </Card>
        </Container>
      )}
    </>
  );
};
export default Attendance1;
