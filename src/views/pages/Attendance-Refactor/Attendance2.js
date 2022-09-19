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

const Attendance2 = (props) => {
  const { user, token } = isAuthenticated();
  const today = new Date();
  const [classes, setClasses] = useState([]);
  const [studentSearchParam, setstudentSearchParam] = useState({
    name: "",
    classId: "",
    studentId: "",
    classSection: "",
  });
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
  const [joiningDates, setJoiningDates] = useState({});
  const [sessions, setSessions] = useState([]);
  const [checked, setChecked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedClass, setSelectedClass] = useState({});
  const [viewAttendance, setViewAttendance] = useState(false);
  const [attendance, setAttendance] = useState({
    dateFrom: startDate,
    dateTo: endDate,
    name: "",
    studentId: "",
    session: "",
    selectClass: "",
    selectSection: "",
  });

  const attendanceData = {
    holidays: [],
    attendanceList: [
      {
        id: null,
        personId: 20,
        firstName: "Thanggousei",
        lastName: "Haokip",
        heldOnDate: null,
        classId: 7,
        status: null,
        assignedByEvent: null,
      },
      {
        id: null,
        personId: 34,
        firstName: "Nehminlun",
        lastName: "Haokip",
        heldOnDate: null,
        classId: 7,
        status: null,
        assignedByEvent: null,
      },
      {
        id: null,
        personId: 47,
        firstName: "Veihoiching",
        lastName: "Haokip",
        heldOnDate: null,
        classId: 7,
        status: null,
        assignedByEvent: null,
      },
      {
        id: null,
        personId: 56,
        firstName: "Lamdeihoi",
        lastName: "Haokip"  ,
        heldOnDate: null,
        classId: 7,
        status: null,
        assignedByEvent: null,
      },
      {
        id: null,
        personId: 69,
        firstName: "Kamgoumang",
        lastName: "Haokip",
        heldOnDate: null,
        classId: 7,
        status: null,
        assignedByEvent: null,
      },
      {
        id: null,
        personId: 82,
        firstName: "Hoineithem",
        lastName: "Haokip",
        heldOnDate: null,
        classId: 7,
        status: null,
        assignedByEvent: null,
      },
      {
        id: null,
        personId: 120,
        firstName: "Thongkhosei",
        lastName: "Haokip",
        heldOnDate: null,
        classId: 7,
        status: null,
        assignedByEvent: null,
      },
      {
        id: null,
        personId: 122,
        firstName: "Robert Lamgunmang",
        lastName: "Haokip",
        heldOnDate: null,
        classId: 7,
        status: null,
        assignedByEvent: null,
      },
      {
        id: null,
        personId: 132,
        firstName: "Lamneilhing",
        lastName: "Haokip",
        heldOnDate: null,
        classId: 7,
        status: null,
        assignedByEvent: null,
      },
      {
        id: null,
        personId: 133,
        firstName: "Lhingvangnei",
        lastName: "Haokip",
        heldOnDate: null,
        classId: 7,
        status: null,
        assignedByEvent: null,
      },
      {
        id: null,
        personId: 139,
        firstName: "Nehminhao",
        lastName: "Haokip",
        heldOnDate: null,
        classId: 7,
        status: null,
        assignedByEvent: null,
      },
      {
        id: null,
        personId: 144,
        firstName: "Manggunmon",
        lastName: "Haokip",
        heldOnDate: null,
        classId: 7,
        status: null,
        assignedByEvent: null,
      },
      {
        id: null,
        personId: 148,
        firstName: "Hemgougin",
        lastName: "Haokip",
        heldOnDate: null,
        classId: 7,
        status: null,
        assignedByEvent: null,
      },
      {
        id: null,
        personId: 150,
        firstName: "Haolenmang",
        lastName: "Haokip",
        heldOnDate: null,
        classId: 7,
        status: null,
        assignedByEvent: null,
      },
      {
        id: null,
        personId: 154,
        firstName: "Lamneithem",
        lastName: "Haokip",
        heldOnDate: null,
        classId: 7,
        status: null,
        assignedByEvent: null,
      },
      {
        id: null,
        personId: 155,
        firstName: "Nehminsang",
        lastName: "Haokip",
        heldOnDate: null,
        classId: 7,
        status: null,
        assignedByEvent: null,
      },
      {
        id: null,
        personId: 194,
        firstName: "Lunsanglen",
        lastName: "Haokip",
        heldOnDate: null,
        classId: 7,
        status: null,
        assignedByEvent: null,
      },
      {
        id: null,
        personId: 200,
        firstName: "Lamneihoi",
        lastName: "Haokip",
        heldOnDate: null,
        classId: 7,
        status: null,
        assignedByEvent: null,
      },
      {
        id: null,
        personId: 211,
        firstName: "Lunkhongam",
        lastName: "Haokip",
        heldOnDate: null,
        classId: 7,
        status: null,
        assignedByEvent: null,
      },
      {
        id: null,
        personId: 214,
        firstName: "Joicy Kimneilhing",
        lastName: "Haokip",
        heldOnDate: null,
        classId: 7,
        status: null,
        assignedByEvent: null,
      },
      {
        id: null,
        personId: 226,
        firstName: "Khupminthang",
        lastName: "Haokip",
        heldOnDate: null,
        classId: 7,
        status: null,
        assignedByEvent: null,
      },
      {
        id: null,
        personId: 235,
        firstName: "Lamminlal",
        lastName: "Haokip",
        heldOnDate: null,
        classId: 7,
        status: null,
        assignedByEvent: null,
      },
      {
        id: null,
        personId: 239,
        firstName: "Lhingneihoi",
        lastName: "Kipgen",
        heldOnDate: null,
        classId: 7,
        status: null,
        assignedByEvent: null,
      },
      {
        id: null,
        personId: 243,
        firstName: "Nemneikim",
        lastName: "Haokip",
        heldOnDate: null,
        classId: 7,
        status: null,
        assignedByEvent: null,
      },
      {
        id: null,
        personId: 251,
        firstName: "Benjamin Lungousem",
        lastName: "Haokip",
        heldOnDate: null,
        classId: 7,
        status: null,
        assignedByEvent: null,
      },
      {
        id: null,
        personId: 255,
        firstName: "Nengkhochin",
        lastName: "Haokip",
        heldOnDate: null,
        classId: 7,
        status: null,
        assignedByEvent: null,
      },
      {
        id: null,
        personId: 260,
        firstName: "Hatjaneng",
        lastName: "Haokip",
        heldOnDate: null,
        classId: 7,
        status: null,
        assignedByEvent: null,
      },
      {
        id: null,
        personId: 273,
        firstName: "Lamneingah",
        lastName: "Haokip",
        heldOnDate: null,
        classId: 7,
        status: null,
        assignedByEvent: null,
      },
      {
        id: null,
        personId: 308,
        firstName: "Kimneilam",
        lastName: "Haokip",
        heldOnDate: null,
        classId: 7,
        status: null,
        assignedByEvent: null,
      },
      {
        id: null,
        personId: 319,
        firstName: "Micheal Mangminlal",
        lastName: "Haokip",
        heldOnDate: null,
        classId: 7,
        status: null,
        assignedByEvent: null,
      },
      {
        id: null,
        personId: 322,
        firstName: "Lhingboineng",
        lastName: "Haokip",
        heldOnDate: null,
        classId: 7,
        status: null,
        assignedByEvent: null,
      },
      {
        id: null,
        personId: 325,
        firstName: "Lunminlen",
        lastName: "Kongsai",
        heldOnDate: null,
        classId: 7,
        status: null,
        assignedByEvent: null,
      },
      {
        id: null,
        personId: 337,
        firstName: "Lalboilen",
        lastName: "Haokip",
        heldOnDate: null,
        classId: 7,
        status: null,
        assignedByEvent: null,
      },
      {
        id: null,
        personId: 341,
        firstName: "Onminlen",
        lastName: "Haokip",
        heldOnDate: null,
        classId: 7,
        status: null,
        assignedByEvent: null,
      },
      {
        id: null,
        personId: 345,
        firstName: "Demkhomang",
        lastName: "Haokip",
        heldOnDate: null,
        classId: 7,
        status: null,
        assignedByEvent: null,
      },
      {
        id: null,
        personId: 350,
        firstName: "Benjamin Paokhongam",
        lastName: "Haokip",
        heldOnDate: null,
        classId: 7,
        status: null,
        assignedByEvent: null,
      },
      {
        id: null,
        personId: 360,
        firstName: "Tingboineng",
        lastName: "Haokip",
        heldOnDate: null,
        classId: 7,
        status: null,
        assignedByEvent: null,
      },
      {
        id: null,
        personId: 365,
        firstName: "Hoineikim",
        lastName: "Haokip",
        heldOnDate: null,
        classId: 7,
        status: null,
        assignedByEvent: null,
      },
      {
        id: null,
        personId: 378,
        firstName: "Lal Daniel",
        lastName: "Haokip",
        heldOnDate: null,
        classId: 7,
        status: null,
        assignedByEvent: null,
      },
      {
        id: null,
        personId: 384,
        firstName: "Nemneihoi",
        lastName: "Haokip",
        heldOnDate: null,
        classId: 7,
        status: null,
        assignedByEvent: null,
      },
    ],
    joiningDates: {
      20: "2021-02-08T00:00:00",
      34: "2021-02-08T00:00:00",
      47: "2021-02-08T00:00:00",
      56: "2021-02-08T00:00:00",
      69: "2021-02-08T00:00:00",
      82: "2021-02-08T00:00:00",
      120: "2021-02-08T00:00:00",
      122: "2021-02-08T00:00:00",
      132: "2021-02-08T00:00:00",
      133: "2021-02-08T00:00:00",
      139: "2021-02-08T00:00:00",
      144: "2021-02-08T00:00:00",
      148: "2021-02-08T00:00:00",
      150: "2021-02-08T00:00:00",
      154: "2021-02-08T00:00:00",
      155: "2021-02-08T00:00:00",
      194: "2021-02-08T00:00:00",
      200: "2021-02-08T00:00:00",
      211: "2021-02-08T00:00:00",
      214: "2021-02-08T00:00:00",
      226: "2021-02-08T00:00:00",
      235: "2021-02-08T00:00:00",
      239: "2021-02-08T00:00:00",
      243: "2021-02-08T00:00:00",
      251: "2021-02-08T00:00:00",
      255: "2021-02-08T00:00:00",
      260: "2021-02-08T00:00:00",
      273: "2021-02-08T00:00:00",
      308: "2021-02-08T00:00:00",
      319: "2021-02-08T00:00:00",
      322: "2021-02-08T00:00:00",
      325: "2021-02-08T00:00:00",
      337: "2021-02-08T00:00:00",
      341: "2021-02-08T00:00:00",
      345: "2021-02-08T00:00:00",
      350: "2021-02-08T00:00:00",
      360: "2021-02-08T00:00:00",
      365: "2021-02-08T00:00:00",
      378: "2021-02-08T00:00:00",
      384: "2021-02-08T00:00:00",
    },
  };

  const getAllClass = async () => {
    const { user, token } = isAuthenticated();
    const classes = await allClass(user._id, user.school, token);
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
    setAttendance({
      ...attendance,
      session: defaultSession._id,
    });
  };

  //Getting Session data
  const getSession = async () => {
    const { user, token } = isAuthenticated();
    try {
      const session = await allSessions(user._id, user.school, token);
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
    setAttendance({
      ...attendance,
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

  const handleSearch = (e) => {
    e.preventDefault();
    console.log("clicked");
    setViewAttendance(true);
    const holidays = attendanceData.holidays.map((holiday) => {
      return {
        from: new Date(holiday.from),
        to: new Date(holiday.to),
      };
    });
    const joiningDates = attendanceData.joiningDates;
    Object.keys(joiningDates).forEach((key) => {
      joiningDates[key] = new Date(joiningDates[key]);
    });
    const absentList = attendanceData.attendanceList;
    processAbsentList(absentList, joiningDates);
    setHolidays(holidays);
    setJoiningDates(joiningDates);
  };

  const processAbsentList = (absentList, joiningDates) => {
    const absentDictionary = {};
    absentList.forEach((absent) => {
      if (!absentDictionary[absent.personId]) {
        absentDictionary[absent.personId] = {
          info: absent,
        };
      }
      const heldOnDate = formatDate(new Date(absent.heldOnDate));
      if (absent.status) {
        absentDictionary[absent.personId][heldOnDate] = absent;
      }
    });
    let attendanceList = [];
    for (let studentId of Object.keys(absentDictionary)) {
      const student = {
        id: studentId,
        firstName: absentDictionary[studentId].info.firstName,
        lastName: absentDictionary[studentId].info.lastName,
        classId: absentDictionary[studentId].info.classId,
        joiningDate: joiningDates[studentId],
        attendance: [],
      };
      for (
        var dateIterator = new Date(startDate.getTime());
        dateIterator <= endDate;
        dateIterator.setDate(dateIterator.getDate() + 1)
      ) {
        const dateString = formatDate(dateIterator);
        const attendanceRecord = {
          heldOnDate: new Date(dateIterator.getTime()),
        };
        if (absentDictionary[studentId][dateString]) {
          const absent = absentDictionary[studentId][dateString];
          attendanceRecord.id = absent.id;
          attendanceRecord.status = absent.status;
        } else {
          attendanceRecord.status = "P";
        }
        student.attendance.push(attendanceRecord);
      }
      attendanceList.push(student);
    }
    attendanceList = attendanceList.sort((a, b) => {
      return (a.firstName + " " + a.lastName).localeCompare(
        b.firstName + " " + b.lastName
      );
    });
    setAttendanceList(attendanceList);
    setOldAttendanceList(copyObject(attendanceList));
    setLoading(false);
    setStartDateAfterSearch(startDate);
    setEndDateAfterSearch(endDate);
  };

  const copyObject = (object) => {
    return JSON.parse(JSON.stringify(object));
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

  const changeAttendance = (studentIndex, dateIndex) => {
    console.log(studentIndex, dateIndex);

    const attendanceList1 = attendanceList;
    console.log(attendanceList1);
    const student = attendanceList1[studentIndex];
    switch (student.attendance[dateIndex].status) {
      case "P":
        student.attendance[dateIndex].status = "A";
        break;
      case "A":
        student.attendance[dateIndex].status = "L";
        break;
      case "L":
        student.attendance[dateIndex].status = "P";
        break;
      default:
        break;
    }
    attendanceList1[studentIndex] = student;
    setAttendanceList(attendanceList1);
  };

  const commitAttendance = () => {
    const attendanceList1 = attendanceList;
    const oldAttendanceList1 = oldAttendanceList;
    const attendanceBody = [];
    for (let studentIndex in attendanceList1) {
      for (let attendanceIndex in attendanceList1[studentIndex].attendance) {
        if (
          attendanceList1[studentIndex].attendance[attendanceIndex].status ===
          oldAttendanceList1[studentIndex].attendance[attendanceIndex].status
        ) {
          continue;
        }
        if (
          oldAttendanceList1[studentIndex].attendance[attendanceIndex]
            .status === "P"
        ) {
          attendanceBody.push({
            personId: attendanceList1[studentIndex].id,
            heldOnDate: setTimeZoneToUTC(
              attendanceList1[studentIndex].attendance[attendanceIndex]
                .heldOnDate
            ),
            classId: attendanceList1[studentIndex].classId,
            status:
              attendanceList1[studentIndex].attendance[attendanceIndex].status,
            assignedByEvent: "insert",
          });
        } else if (
          attendanceList1[studentIndex].attendance[attendanceIndex].status ===
          "P"
        ) {
          attendanceBody.push({
            id: attendanceList1[studentIndex].attendance[attendanceIndex].id,
            personId: attendanceList1[studentIndex].id,
            heldOnDate: setTimeZoneToUTC(
              attendanceList1[studentIndex].attendance[attendanceIndex]
                .heldOnDate
            ),
            classId: attendanceList1[studentIndex].classId,
            status:
              attendanceList1[studentIndex].attendance[attendanceIndex].status,
            assignedByEvent: "delete",
          });
        } else {
          attendanceBody.push({
            id: attendanceList1[studentIndex].attendance[attendanceIndex].id,
            personId: attendanceList1[studentIndex].id,
            heldOnDate: this.setTimeZoneToUTC(
              attendanceList1[studentIndex].attendance[attendanceIndex]
                .heldOnDate
            ),
            classId: attendanceList1[studentIndex].classId,
            status:
              attendanceList1[studentIndex].attendance[attendanceIndex].status,
            assignedByEvent: "update",
          });
        }
      }
    }
    if (!attendanceBody.length) {
      toast.success("Attendance Saved");
      return;
    }
    // setLoading(true);
    // setChecked(false);
    console.log(attendanceBody);
  };

  const setTimeZoneToUTC = (date) => {
    return new Date(
      Date.UTC(
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
        date.getHours(),
        date.getMinutes()
      )
    );
  };

  return (
    <React.Fragment>
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
                    value={attendance.name}
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
                    value={attendance.studentId}
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
                    value={attendance.dateFrom}
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
                    value={attendance.dateTo}
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
                    value={attendance.selectClass}
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
                    value={attendance.selectSection}
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
                    value={attendance.session}
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
      {viewAttendance && (
        <React.Fragment>
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
                <Col md={6}>
                  <div className="icons_list">
                    <div className="icons_div">
                      <p
                        className="ni ni-single-02"
                        id="attendance_icons"
                        style={{
                          background: "green",
                          color: "white",
                          padding: "5px",
                          fontSize: "30px",
                          borderRadius: "50%",
                        }}
                      ></p>
                      <span className="tags">Present</span>
                    </div>
                    <div className="icons_div">
                      <p
                        className="ni ni-single-02"
                        id="attendance_icons"
                        style={{
                          background: "rgb(201, 3, 3)",
                          color: "white",
                          fontSize: "30px",
                          padding: "5px",
                          borderRadius: "50%",
                        }}
                      ></p>
                      <span className="tags">Absent</span>
                    </div>
                    <div className="icons_div">
                      <p
                        className="ni ni-single-02"
                        id="attendance_icons"
                        style={{
                          background: "rgb(243, 243, 71)",
                          color: "white",
                          padding: "5px",
                          fontSize: "30px",
                          borderRadius: "50%",
                        }}
                      ></p>
                      <span className="tags">Leave</span>
                    </div>
                    <div className="icons_div">
                      <p
                        id="attendance_icons"
                        className="ni ni-single-02"
                        style={{
                          background: "blue",
                          color: "white",
                          padding: "5px",
                          fontSize: "30px",
                          borderRadius: "50%",
                        }}
                      ></p>
                      <span className="tags">Half Day</span>
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
              <Row>
                <Col>
                  <AttendanceTable
                    // {...props}
                    attendanceList={attendanceList}
                    isLoading={loading}
                    startDate={startDateAfterSearch}
                    endDate={endDateAfterSearch}
                    changeAttendance={changeAttendance}
                    holidays={holidays}
                  />
                </Col>
              </Row>
            </CardHeader>
          </Card>
        </Container>
        </React.Fragment>
      )}
    </React.Fragment>
  );
};

export default Attendance2;