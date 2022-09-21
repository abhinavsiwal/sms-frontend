import React, { useEffect, useState } from "react";

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
  const [searchData, setSearchData] = useState({
    dateFrom: startDate,
    dateTo: endDate,
    name: "",
    studentId: "",
    session: "",
    selectClass: "",
    selectSection: "",
  });
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
      from_date: searchData.dateFrom,
      to_date: searchData.dateTo,
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
    attendance.map((att) => {
      console.log(att);
      for (let date = start; date <= end; date.setDate(date.getDate() + 1)) {
        console.log("date");
        let attendanceList = [];
        att.attandance.map((item) => {
          console.log(item);
          console.log(new Date(item.date).toDateString() === date.toDateString());
          if (new Date(item.date).toDateString() === date.toDateString()) {
            console.log("here");
            attendanceList.push({
              date: date,
              attendance_status: item.attendance_status,
            });
          } else {
            attendanceList.push({
              date: date,
              attendance_status: "P",
            });
          }
        });
        att.attandance = attendanceList;
      }
    });
    console.log(attendance);
    // for (let date = start; date <= end; date.setDate(date.getDate() + 1)) {
    //   console.log(attendance);
    //   attendance.map((att) => {
    //     console.log(att);
    //     let attendanceList = [];

    //     att.attandance.map((item) => {
    //       if (new Date(item.date).toDateString() === date.toDateString()) {
    //         attendanceList.push({
    //           date: item.date,
    //           status: item.status,
    //         });
    //       } else {
    //         attendanceList.push({
    //           date: date,
    //           status: "P",
    //         });
    //       }
    //     });
    //     att.attandance = attendanceList;
    //   });
    // }
    // console.log(attendance);
  };
  const formatDate = (date) => {
    var d = date ? new Date(date) : new Date(),
      month = "" + (d.getMonth() + 1),
      day = "" + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;

    return [year, month, day].join("");
  };
  const dataSource = [
    {
      key: "1",
      name: "Mike",
      age: 32,
      address: "10 Downing Street",
    },
    {
      key: "2",
      name: "John",
      age: 42,
      address: "10 Downing Street",
    },
  ];

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Age",
      dataIndex: "age",
      key: "age",
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
    },
  ];
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
                  <Input
                    className="form-control"
                    id="example-date-input"
                    type="date"
                    onChange={handleChange("dateFrom")}
                    value={searchData.dateFrom}
                    required
                  />
                </Col>
                <Col>
                  <Label
                    className="form-control-label"
                    htmlFor="example-date-input"
                  >
                    To
                  </Label>
                  <Input
                    className="form-control"
                    id="example-date-input"
                    type="date"
                    onChange={handleChange("dateTo")}
                    value={searchData.dateTo}
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
              </Row>
              <Row className="mt-4 float-right">
                <Col>
                  <Button color="primary" type="submit">
                    Search
                  </Button>
                </Col>
              </Row>
            </form>
          </CardBody>
        </Card>
      </Container>
      <Container className="mt--0 shadow-lg table-responsive" fluid>
        <Card>
          <CardBody>
            <AntTable
              columns={columns}
              data={dataSource}
              pagination={true}
              exportFileName="Attendance"
            />
          </CardBody>
        </Card>
      </Container>
    </>
  );
};
export default Attendance1;
