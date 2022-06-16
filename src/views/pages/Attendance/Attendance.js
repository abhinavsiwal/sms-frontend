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
import Loader from "components/Loader/Loader";
// import { Table } from "ant-table-extensions";
// import { Table } from "antd";
import { postAttendance, searchAttendance } from "api/attendance";
import "./Attendance.css";

//Loader
// import Loader from "../../../components/Loader/Loader";

// core components
import SimpleHeader from "components/Headers/SimpleHeader.js";
import { useSelector } from "react-redux";
import LoadingScreen from "react-loading-screen";
import { allClass } from "api/class";

//import moment from moment for Date
import moment from "moment";

import { getAttendence } from "api/attendance";
import { allStudents, filterStudent } from "api/student";
import { isAuthenticated } from "api/auth";
import { sendRequestWithJson, sendRequest } from "api/api";
import { toast, ToastContainer } from "react-toastify";
import { fetchingAttendanceError } from "constants/errors";
import { fetchingClassError } from "constants/errors";

import { addAttendanceError } from "constants/errors";
import { addAttendanceSuccess } from "constants/success";
import { allSessions } from "api/session";
import { updateAttendance } from "../../../api/attendance";

function Attendance() {
  //start and end date of month
  const { user, token } = isAuthenticated();
  const startOfMonth = moment().startOf("month").format("YYYY-MM-DD");
  const endOfMonth = moment().endOf("month").format("YYYY-MM-DD");
  const endOfDayOfMonths = moment().endOf("month").format("DD");
  const [selectedClassIndex, setselectedClassIndex] = useState(0);
  const [attendance, setAttendance] = React.useState({
    dateFrom: startOfMonth,
    dateTo: endOfMonth,
    name: "",
    studentId: "",
    session: "",
    selectClass: "",
    selectSection: "",
  });
  const [classes, setClasses] = useState("");
  const [attendanceData, setAttendanceData] = useState([]);
  const [attendanceData1, setattendanceData1] = useState({});
  const [viewAttendance, setViewAttendance] = useState(false);
  const [allAttendance, setAllAttendance] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [selectedClassId, setSelectedClassId] = useState("");
  const [selectSessionId, setSelectSessionId] = useState("");
  const [selectDate, setSelectDate] = useState("");
  // const [sections, setSections] = useState({})
  const [selectedClass, setSelectedClass] = useState({});
  // console.log("attendance", attendance);
  // console.log(classes);
  const [addAttendance, setAddAttendance] = useState([]);
  // const [loading, setLoading] = React.useState(true);
  const [attendanceStatus, setAttendanceStatus] = useState([]);
  const [atd, setAtd] = React.useState({});
  const [columns, setColumns] = useState([]);
  const [students1, setStudents1] = useState([]);
  const [file, setFile] = useState();
  const fileReader = new FileReader();
  const [loading, setLoading] = useState(false);
  const [modelLoading, setModelLoading] = useState(false);
  const [model2Loading, setModel2Loading] = useState(false);
  const [editPart, setEditPart] = useState(false);
  const [permissions, setPermissions] = useState([]);
  const [addLoading, setAddLoading] = useState(false);
  const [editAttedanceData, setEditAttedanceData] = useState([]);
  const [editAttedance, setEditAttedance] = useState(false);
  const [editAttedanceStudent, setEditAttedanceStudent] = useState("");

  const handleOnChange = (e) => {
    setFile(e.target.files[0]);
  };
  const [today, setToday] = useState("");
  const handleOnSubmit = (e) => {
    e.preventDefault();

    if (file) {
      fileReader.onload = function (event) {
        const csvOutput = event.target.result;
      };

      fileReader.readAsText(file);
    }
  };

  const getAllClass = async () => {
    const { user, token } = isAuthenticated();
    const classes = await allClass(user._id, user.school, token);
    if (classes.err) {
      return toast.error(fetchingClassError);
    } else {
      setClasses(classes);
      return;
    }
  };

  useEffect(() => {
    let today1 = new Date();
    // console.log(today1);
    let day = today1.getDate();
    // console.log(day);
    let month = today1.getMonth() + 1;
    let year = today1.getFullYear();
    let date = day + "-" + month + "-" + year;
    setToday(date);
  }, []);

  // console.log("atd", atd);
  let permission1 = [];
  useEffect(async () => {
    setLoading(true);
    // console.log(user);
    if (user.permissions["Attendance"]) {
      permission1 = user.permissions["Attendance"];
      // console.log(permissions);
      setPermissions(permission1);
    }
    await getAllClass();
    await getSession();
    setLoading(false);
  }, []);

  //Getting Session data
  const getSession = async () => {
    const { user, token } = isAuthenticated();
    try {
      const session = await allSessions(user._id, user.school, token);
      if (session.err) {
        return toast.error(session.err);
      } else {
        setSessions(session);
        return;
      }
    } catch (err) {
      toast.error("Something Went Wrong!");
    }
  };

  //modal window for addAttendance
  const [modal, setModal] = React.useState(false);
  const toggle = async () => {
    setModal(!modal);
    setModelLoading(true);
    await getAllStudents(attendance.selectSection, attendance.selectClass);

    setModelLoading(false);
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

  useEffect(() => {
    let columns1 = [
      {
        title: "#",
        width: 50,
        dataIndex: "hash",
        key: "hash",
        fixed: "left",
      },
      {
        title: "Name",
        width: 50,
        dataIndex: "name",
        key: "name",
        fixed: "left",
      },
    ];
    setColumns(columns1);
  }, []);

  useEffect(() => {
    setAttendance({ ...attendance, atd });
  }, [atd]);
  let tableData = [];

  //Columns of ant Table

  // useEffect(() => {
  //   console.log(attendanceData1.workingDay);
  //   for (let i = 1; i <= attendanceData1.workingDay; i++) {
  //     columns.push({
  //       key: i,
  //       title: i,
  //       width: 110,
  //       dataIndex: "status",
  //     });
  //   }
  // }, [attendanceData]);

  useEffect(async () => {
    setLoading(true);
    await getAllAttendance();
    setLoading(false);
  }, []);

  const getAllAttendance = async () => {
    try {
      const data = await getAttendence(user.school, user._id);
      // console.log(data);
      // setAllAttendance(data);
      const tableData = [];
      for (let i = 0; i < data.length; i++) {
        let date = data[i].date.slice(8, 10);
        for (let j = 0; j < endOfDayOfMonths; j++) {
          if (date.toString() === j.toString()) {
            tableData.push({
              key: j,
              status: data.attendance_status,
            });
          }
        }
      }
    } catch (err) {
      console.log(err);
      toast.error(fetchingAttendanceError);
    }
  };

  // let attendance2=[];
  const submitAttendance = (studentId) => async (event) => {
    // console.log(studentId);
    // console.log(event.target.value);
    let today = new Date();
    let day = today.getDate();
    let month = today.getMonth() + 1;
    let year = today.getFullYear();

    let date = year + "-" + month + "-" + day;
    let sessionId1;

    sessions.map((data) => {
      if (data.status === "current") {
        // formData.set("session", data._id);
        sessionId1 = data._id;
      }
    });

    let attendance1 = {};

    addAttendance &&
      addAttendance.forEach((element, index) => {
        // console.log(element);
        if (element.student === studentId) {
          // console.log("here");
          addAttendance[index].attendance_status = event.target.value;
          return;
        } else {
          attendance1 = {
            attendance_status: event.target.value,
            date,
            session: sessionId1,
            class: attendance.selectClass,
            section: attendance.selectSection,
            school: user.school,
            student: studentId,
          };
        }
      });

    if (addAttendance.length === 0) {
      attendance1 = {
        attendance_status: event.target.value,
        date,
        session: sessionId1,
        class: attendance.selectClass,
        section: attendance.selectSection,
        school: user.school,
        student: studentId,
      };
    }

    setAddAttendance([...addAttendance, attendance1]);

    // console.log(attendance1);
    // attendance2.push(attendance1);
    // console.log(attendance2);
  };

  const submitHandler = async () => {
    // console.log(addAttendance);

    let arr = addAttendance;
    const uniqueAttendance = Array.from(new Set(arr.map((a) => a.student))).map(
      (id) => {
        return arr.find((a) => a.student === id);
      }
    );

    // console.log(uniqueAttendance);
    let newAttendance = uniqueAttendance.filter(
      (value) => Object.keys(value).length !== 0
    );
    // console.log(newAttendance);

    let formData = new FormData();
    formData.set("attendance", JSON.stringify(newAttendance));
    formData.set("school", user.school);
    formData.set("class", attendance.selectClass);
    formData.set("section", attendance.selectSection);
    try {
      setAddLoading(true);
      const data = await postAttendance(user._id, formData);
      if (data && data.err) {
        setModal(false);
        setAddLoading(false);
        toast.error(data.err);
      } else {
        toast.success(addAttendanceSuccess);
        setModal(false);
        setAddLoading(false);
        setTimeout(() => {
          window.location.reload(1);
        }, 1000);
      }
    } catch (err) {
      console.log(err);
      setAddLoading(false);
      toast.error(addAttendanceError);
    }
  };

  const searchHandler = async (e) => {
    e.preventDefault();
    if (
      attendance.selectClass === "" &&
      attendance.studentId === "" &&
      attendance.selectSection === "" &&
      attendance.name === ""
    ) {
      toast.error("Please Select Filter To Search");
    } else if (
      attendance.selectClass !== "" &&
      attendance.selectSection === ""
    ) {
      toast.error("Please Select Section!");
    } else {
      setLoading(true);
      if (attendance.name !== "") {
        const formData = new FormData();
        let data1 = {
          name: attendance.name,
          start_date: attendance.dateFrom,
          end_date: attendance.dateTo,
          session: attendance.session,
        };
        try {
          const data = await searchAttendance(user._id, user.school, data1);
          setattendanceData1(data);
          // delete data.workingDay;
          // delete data.classTeacher;

          setViewAttendance(true);
          // console.log(data.studentDatas);
          let students = [];
          for (const key in data.studentDatas) {
            // console.log(`${key}: ${data.studentDatas[key]}`);
            // console.log(key);
            let obj = {};
            obj[key] = data.studentDatas[key];
            students.push(obj);
          }
          setStudents1(students);
          setLoading(false);
        } catch (err) {
          console.log(err);
          setLoading(false);
        }
      } else if (attendance.studentId !== "") {
        // getAllStudents(attendance.selectSection, attendance.selectClass);
        // console.log(attendance);
        const formData = new FormData();
        let data1 = {
          studentID: attendance.studentId,
          start_date: attendance.dateFrom,
          end_date: attendance.dateTo,
          session: attendance.session,
        };
        try {
          const data = await searchAttendance(user._id, user.school, data1);
          setattendanceData1(data);
          // delete data.workingDay;
          // delete data.classTeacher;

          setViewAttendance(true);
          // console.log(data.studentDatas);
          let students = [];
          for (const key in data.studentDatas) {
            // console.log(`${key}: ${data.studentDatas[key]}`);
            // console.log(key);
            let obj = {};
            obj[key] = data.studentDatas[key];
            students.push(obj);
          }
          setStudents1(students);
          setLoading(false);
        } catch (err) {
          console.log(err);
          setLoading(false);
        }
      } else {
        // console.log(attendance);
        const formData = new FormData();
        formData.set("classId", attendance.selectClass);
        formData.set("sectionId", attendance.selectSection);
        var dt = new Date();
        let year = dt.getFullYear();
        let month = (dt.getMonth() + 1).toString().padStart(2, "0");
        let day = dt.getDate().toString().padStart(2, "0");
        let data1 = {
          class: attendance.selectClass,
          section: attendance.selectSection,
          start_date: attendance.dateFrom,
          end_date: attendance.dateTo,
          today_date: year + "-" + month + "-" + day,
          session: attendance.session,
        };
        try {
          const data = await searchAttendance(user._id, user.school, data1);
          setattendanceData1(data);
          // delete data.workingDay;
          // delete data.classTeacher;

          setViewAttendance(true);
          // console.log(data.studentDatas);
          let students = [];
          for (const key in data.studentDatas) {
            // console.log(`${key}: ${data.studentDatas[key]}`);
            // console.log(key);
            let obj = {};
            obj[key] = data.studentDatas[key];
            students.push(obj);
          }
          // var studentWithSID = [];
          // for (const key2 in students) {
          //   var temp = students[key2].split(",");
          //   studentWithSID.push(temp);
          // }

          setStudents1(students);
          setLoading(false);
        } catch (err) {
          console.log(err);
          setLoading(false);
        }
      }
    }
  };

  const getAllStudents = async (section, clas) => {
    const formData = {
      section,
      class: clas,
    };

    const data = await filterStudent(user.school, user._id, formData);
    console.log(data);
    for (let i = 0; i < data.length; i++) {
      let check = false;
      for (let j = 0; j < students1.length; j++) {
        let temp = Object.keys(students1[j]).toString().split(",")[1];
        if (
          data[i].SID === temp &&
          attendanceData1.studentDatas[Object.keys(students1[j])].length ===
            attendanceData1.workingDay.length &&
          attendanceData1.Today === true
        ) {
          check = true;
        }
      }
      if (check === false) {
        tableData.push({
          key: data[i]._id,
          SID: data[i].SID,
          hash: `${i + 1}`,
          name: data[i].firstname + " " + data[i].lastname,
        });
      }
    }
    console.log(tableData);
    setAttendanceData(tableData);
  };

  const toggleEdit = (e) => {
    e.preventDefault();
    setEditAttedance(false);
    setEditPart(true);
  };

  const handleTimeChange = async (e) => {
    e.preventDefault();
    setModel2Loading(true);
    if (attendance.selectClass === "" && attendance.name !== "") {
      var dt = new Date(e.target.value);
      let year = dt.getFullYear();
      let month = (dt.getMonth() + 1).toString().padStart(2, "0");
      let day = dt.getDate().toString().padStart(2, "0");
      let day2 = (dt.getDate() + 1).toString().padStart(2, "0");
      var data1 = {
        name: attendance.name,
        start_date: year + "-" + month + "-" + day,
        end_date: year + "-" + month + "-" + day,
        session: attendance.session,
      };
      setSelectDate(year + "-" + month + "-" + day);
    } else if (
      attendance.selectClass === "" &&
      attendance.name === "" &&
      attendance.studentId !== ""
    ) {
      var dt = new Date(e.target.value);
      let year = dt.getFullYear();
      let month = (dt.getMonth() + 1).toString().padStart(2, "0");
      let day = dt.getDate().toString().padStart(2, "0");
      let day2 = (dt.getDate() + 1).toString().padStart(2, "0");
      var data1 = {
        studentID: attendance.studentId,
        start_date: year + "-" + month + "-" + day,
        end_date: year + "-" + month + "-" + day,
        session: attendance.session,
      };
      setSelectDate(year + "-" + month + "-" + day);
    } else {
      var dt = new Date(e.target.value);
      let year = dt.getFullYear();
      let month = (dt.getMonth() + 1).toString().padStart(2, "0");
      let day = dt.getDate().toString().padStart(2, "0");
      let day2 = (dt.getDate() + 1).toString().padStart(2, "0");
      var data1 = {
        class: attendance.selectClass,
        section: attendance.selectSection,
        start_date: year + "-" + month + "-" + day,
        end_date: year + "-" + month + "-" + day,
        session: attendance.session,
      };
      setSelectDate(year + "-" + month + "-" + day);
    }
    try {
      const data = await searchAttendance(user._id, user.school, data1);
      if (data && data.err) {
        toast.error(data.err);
      } else {
        let students = [];
        for (const key in data.studentDatas) {
          let obj = {};
          obj[key] = data.studentDatas[key];
          students.push(obj);
        }
        setEditAttedanceStudent(students);
        setEditAttedance(true);
        setModel2Loading(false);
      }
    } catch (error) {
      setModel2Loading(false);
    }
  };

  const handleStatus = (studentID) => (e) => {
    e.preventDefault();
    let List = editAttedanceData;
    let temp = { id: studentID, attendance_status: e.target.value };
    List.push(temp);
    setEditAttedanceData(List);
  };

  const submitEditAttedance = async (e) => {
    e.preventDefault();
    if (editAttedanceData.length === 0) {
      toast.error("First Change Status Before Submit");
    } else {
      setModel2Loading(true);
      if (
        attendance.selectClass === "" &&
        attendance.studentId === "" &&
        attendance.name !== ""
      ) {
        var formdata = new FormData();
        formdata.set("ID", true);
        formdata.set("date", selectDate);
        formdata.set("editAttedance", JSON.stringify(editAttedanceData));
      } else if (
        attendance.selectClass === "" &&
        attendance.name === "" &&
        attendance.studentId !== ""
      ) {
        var formdata = new FormData();
        formdata.set("ID", true);
        formdata.set("date", selectDate);
        formdata.set("editAttedance", JSON.stringify(editAttedanceData));
      } else {
        var formdata = new FormData();
        formdata.set("class", attendance.selectClass);
        formdata.set("section", attendance.selectSection);
        formdata.set("date", selectDate);
        formdata.set("editAttedance", JSON.stringify(editAttedanceData));
      }

      try {
        const data = await updateAttendance(user._id, user.school, formdata);
        if (data && data.err) {
          toast.error(data.err);
        } else {
          setModel2Loading(false);

          toast.success("Update Attendance is Done!");
          setTimeout(() => {
            window.location.reload(1);
          }, 1000);
        }
      } catch (error) {
        setModel2Loading(false);
      }
    }
  };

  return (
    <div>
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
      {/* {permissions && permissions.includes("add") && ( */}
      <Container className="mt--6 shadow-lg" fluid>
        <Form onSubmit={searchHandler}>
          <Card>
            <CardBody>
              <LoadingScreen
                loading={loading}
                bgColor="#f1f1f1"
                spinnerColor="#9ee5f8"
                textColor="#676767"
                text="Please Wait..."
              ></LoadingScreen>
              <Row>
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
              <br />
              {attendance.selectClass === "" && (
                <Row md="4" className="d-flex justify-content-center mb-4">
                  <Col md="6">
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
                  <Col md="6">
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
                </Row>
              )}
              <Row md="4" className="d-flex justify-content-center mb-4">
                <Col md="6">
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
                <Col md="6">
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
                {/* </Row> */}
                {/* <Row className="d-flex justify-content-center mb-4"> */}
              </Row>
              {attendance.studentId === "" && attendance.name === "" && (
                <Row>
                  <Col md="6">
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
                  <Col md="6">
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
                </Row>
              )}
              <Row>
                <Col className="mt-4">
                  <Button type="submit" color="primary">
                    Search
                  </Button>
                </Col>
              </Row>
            </CardBody>
          </Card>
        </Form>
      </Container>
      {viewAttendance && (
        <Container className="mt--0 shadow-lg table-responsive" fluid>
          <Row>
            <Col>
              <Card>
                <CardHeader>
                  <Row className="header_main">
                    <Col md={3}>
                      <div className="col-sm">
                        <h3 className="start-end">
                          {startOfMonth} - {endOfMonth}
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
                    {attendance.selectClass !== "" &&
                      attendance.selectSection !== "" &&
                      attendance.name === "" &&
                      attendance.studentId === "" && (
                        <Col className="buttons" md={3}>
                          {!attendanceData1.classTeacher && (
                            <>
                              <div className="col-sm">
                                <Button
                                  className="attendance-button"
                                  onClick={toggle}
                                  color="primary"
                                  size="sm"
                                >
                                  Add Attendance
                                </Button>
                              </div>
                              <div className="col-sm">
                                <Button
                                  className="attendance-button"
                                  onClick={toggleEdit}
                                  color="primary"
                                  size="sm"
                                >
                                  Edit Attendance
                                </Button>
                              </div>
                            </>
                          )}
                        </Col>
                      )}
                    {attendance.selectClass === "" &&
                      (attendance.name !== "" ||
                        attendance.studentId !== "") && (
                        <Col className="buttons" md={3}>
                          {!attendanceData1.classTeacher && (
                            <>
                              <div className="col-sm">
                                <Button
                                  className="attendance-button"
                                  onClick={toggleEdit}
                                  color="primary"
                                >
                                  Edit Attendance
                                </Button>
                              </div>
                            </>
                          )}
                        </Col>
                      )}
                  </Row>
                </CardHeader>
                <CardBody>
                  {/* <Table
                    columns={columns}
                    dataSource={attendanceData}
                    scroll={{ x: 1300, y: 600 }}
                  /> */}
                  {students1.length === 0 && (
                    <h3 style={{ padding: "10px" }}>No Student Data Found</h3>
                  )}
                  <div className="attendance_main_div">
                    <table>
                      <thead>
                        <th style={{ width: "50px" }}>#</th>
                        <th className="table_fix first">Student Name</th>
                        <th
                          className="table_fix second"
                          style={{ width: "150px" }}
                        >
                          Student ID
                        </th>
                        {attendanceData1.workingDay.map((day) => {
                          return <th key={day}>{day}</th>;
                        })}
                      </thead>

                      <tbody>
                        {students1.length > 0 &&
                          students1.map((student, index) => {
                            return (
                              <>
                                <tr key={index}>
                                  <td>{index + 1}</td>
                                  <td className="table_fix first tabledata">
                                    {Object.keys(student) &&
                                      Object.keys(student)
                                        .toString()
                                        .split(",")[0]}
                                  </td>
                                  <td className="table_fix second tabledata">
                                    {Object.keys(student) &&
                                      Object.keys(student)
                                        .toString()
                                        .split(",")[1]}
                                  </td>
                                  {student[Object.keys(student)].map(
                                    (status, index) => {
                                      // console.log(status, index);
                                      if (status === "P") {
                                        return (
                                          <td key={index}>
                                            <p
                                              className="ni ni-single-02"
                                              id="attendance_icons"
                                              style={{
                                                background: "green",
                                                color: "white",
                                                fontSize: "30px",
                                                padding: "5px",
                                                borderRadius: "50%",
                                              }}
                                            ></p>
                                          </td>
                                        );
                                      } else if (status === "A") {
                                        return (
                                          <td key={index}>
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
                                          </td>
                                        );
                                      } else if (status === "L") {
                                        return (
                                          <td key={index}>
                                            <p
                                              className="ni ni-single-02"
                                              id="attendance_icons"
                                              style={{
                                                background: "rgb(243, 243, 71)",
                                                color: "white",
                                                fontSize: "30px",
                                                padding: "5px",
                                                borderRadius: "50%",
                                              }}
                                            ></p>
                                          </td>
                                        );
                                      } else if (status === "HF") {
                                        return (
                                          <td key={index}>
                                            <p
                                              className="ni ni-single-02"
                                              id="attendance_icons"
                                              style={{
                                                background: "blue",
                                                color: "white",
                                                fontSize: "30px",
                                                padding: "5px",
                                                borderRadius: "50%",
                                              }}
                                            ></p>
                                          </td>
                                        );
                                      } else if (status === "N") {
                                        return (
                                          <td key={index}>
                                            <p
                                              className="ni ni-single-02"
                                              id="attendance_icons"
                                              style={{
                                                background: "black",
                                                color: "white",
                                                fontSize: "30px",
                                                padding: "5px",
                                                borderRadius: "50%",
                                              }}
                                            ></p>
                                          </td>
                                        );
                                      }
                                    }
                                  )}
                                </tr>
                              </>
                            );
                          })}
                      </tbody>
                    </table>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
          <Modal
            backdrop="static"
            size="xl"
            scrollable
            isOpen={modal}
            toggle={() => {
              setModal(false);
            }}
            className="custom-modal-style"
          >
            <ModalHeader
              isClose={modal}
              toggle={() => {
                setModal(false);
              }}
            >
              Add Attendance
            </ModalHeader>
            {addLoading ? (
              <Loader />
            ) : (
              <ModalBody className="modal-body">
                <LoadingScreen
                  loading={modelLoading}
                  bgColor="#f1f1f1"
                  spinnerColor="#9ee5f8"
                  textColor="#676767"
                  text="Please Wait..."
                ></LoadingScreen>
                {attendanceData.length > 0 ? (
                  <>
                    <div className="model_table_main">
                      <Table className="model_table" bordered>
                        <thead>
                          <tr>
                            <th>Name</th>
                            <th>Present</th>
                            <th>Absent</th>
                            <th>Half Day</th>
                            <th>Leave</th>
                          </tr>
                        </thead>
                        <tbody>
                          {attendanceData &&
                            attendanceData.map((student, index) => {
                              return (
                                <>
                                  <tr key={index}>
                                    <td style={{ fontWeight: "500" }}>
                                      {student.name}
                                    </td>
                                    <td>
                                      {" "}
                                      <input
                                        type="radio"
                                        onChange={submitAttendance(student.key)}
                                        value="P"
                                        checked={atd.present}
                                        name={index}
                                      />
                                      Present
                                    </td>
                                    <td>
                                      <input
                                        type="radio"
                                        onChange={submitAttendance(student.key)}
                                        value="A"
                                        name={index}
                                      />{" "}
                                      Absent
                                    </td>
                                    <td>
                                      <input
                                        type="radio"
                                        name={index}
                                        value="HF"
                                        onChange={submitAttendance(student.key)}
                                      />{" "}
                                      Half Day
                                    </td>
                                    <td>
                                      <input
                                        type="radio"
                                        value="L"
                                        name={index}
                                        onChange={submitAttendance(student.key)}
                                      />{" "}
                                      Leave
                                    </td>
                                  </tr>
                                </>
                              );
                            })}
                        </tbody>
                      </Table>
                    </div>
                    <div className="col-sm">
                      <Button
                        className="attendance-button"
                        onClick={submitHandler}
                        color="primary"
                      >
                        Submit
                      </Button>
                    </div>
                  </>
                ) : (
                  <h2>No Student Data is Found</h2>
                )}
              </ModalBody>
            )}
          </Modal>
          <Modal
            backdrop="static"
            size="xl"
            scrollable
            isOpen={editPart}
            className="custom-modal-style"
          >
            <ModalHeader isClose={editPart} toggle={() => setEditPart(false)}>
              Edit Attendance
            </ModalHeader>
            <ModalBody className="modal-body">
              <LoadingScreen
                loading={model2Loading}
                bgColor="#f1f1f1"
                spinnerColor="#9ee5f8"
                textColor="#676767"
                text="Please Wait..."
              ></LoadingScreen>
              <Row>
                <Col md="12">
                  <Label
                    className="form-control-label"
                    htmlFor="xample-date-input"
                  >
                    Select Time
                  </Label>
                  <Input
                    className="form-control"
                    id="exampleFormControlSelect3"
                    type="date"
                    onChange={handleTimeChange}
                    // required
                  />
                </Col>
              </Row>
              <br />
              {editAttedance && (
                <>
                  <div className="model_table_main">
                    <Table className="model_table" bordered>
                      <thead>
                        <tr>
                          <th>Name</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {editAttedanceStudent &&
                        editAttedanceStudent.length > 0 ? (
                          editAttedanceStudent.map((student, index) => {
                            return (
                              <>
                                <tr key={index}>
                                  <td style={{ fontWeight: "500" }}>
                                    {Object.keys(student) &&
                                      Object.keys(student)
                                        .toString()
                                        .split(",")[0]}
                                  </td>
                                  <td>
                                    <Input
                                      className="form-control"
                                      id="exampleFormControlSelect3"
                                      type="select"
                                      onChange={handleStatus(
                                        Object.keys(student)
                                          .toString()
                                          .split(",")[2]
                                      )}
                                      // required
                                    >
                                      <option
                                        selected
                                        value={Object.values(student)[0]}
                                        disabled
                                      >
                                        {Object.values(student)[0]}
                                      </option>
                                      <option value="P">Present</option>
                                      <option value="A">Absent</option>
                                      <option value="L">Leave</option>
                                      <option value="HF">Half Day</option>
                                    </Input>
                                  </td>
                                </tr>
                              </>
                            );
                          })
                        ) : (
                          <h3>No Student Data is Found</h3>
                        )}
                      </tbody>
                    </Table>
                  </div>
                  <br />
                  {editAttedance && editAttedanceStudent.length > 0 && (
                    <div className="col-sm">
                      <Button
                        className="attendance-button"
                        onClick={submitEditAttedance}
                        color="primary"
                      >
                        Submit
                      </Button>
                    </div>
                  )}
                </>
              )}
            </ModalBody>
          </Modal>
        </Container>
      )}
    </div>
  );
}

export default Attendance;
