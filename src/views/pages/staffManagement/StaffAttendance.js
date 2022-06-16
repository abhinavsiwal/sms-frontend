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
import "./style.css";
import SimpleHeader from "components/Headers/SimpleHeader.js";
import { useSelector } from "react-redux";
import LoadingScreen from "react-loading-screen";
import { getDepartment } from "api/department";
import moment from "moment";
import { isAuthenticated } from "api/auth";
import { toast, ToastContainer } from "react-toastify";
import { fetchingClassError } from "constants/errors";
import { allSessions } from "api/session";
import { getStaffByDepartment } from "api/staff";
import { allClass } from "api/class";
import {
  addStaffAttendance,
  searchStaffAttendance,
  updateAttendance,
} from "api/staffAttendance";

const StaffAttendance = () => {
  const { user, token } = isAuthenticated();
  const [classes, setClasses] = useState("");
  const startOfMonth = moment().startOf("month").format("YYYY-MM-DD");
  const endOfMonth = moment().endOf("month").format("YYYY-MM-DD");
  const endOfDayOfMonths = moment().endOf("month").format("DD");
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [staff1, setStaff1] = useState([]);
  const [attendance, setAttendance] = React.useState({
    dateFrom: startOfMonth,
    dateTo: endOfMonth,
    session: "",
    selectDepartment: "",
  });
  const [modal, setModal] = useState(false);
  const [staff, setStaff] = useState([]);
  const [addAttendance, setAddAttendance] = useState([]);
  const [today, setToday] = useState("");
  const [allDepartments, setAllDepartments] = useState([]);
  const [viewAttendance, setViewAttendance] = useState(false);
  const [modelLoading, setModelLoading] = useState(false);
  const [addLoading, setAddLoading] = useState(false);
  const [attendanceData, setAttendanceData] = useState([]);
  const [students1, setStudents1] = useState([]);
  const [attendanceData1, setattendanceData1] = useState({});
  const [model2Loading, setModel2Loading] = useState(false);
  const [editAttendance, setEditAttendance] = useState(false);
  const [editAttendanceStaff, setEditAttendanceStaff] = useState();
  const [editPart, setEditPart] = useState(false);
  const [selectDate, setSelectDate] = useState("");
  const [editAttendanceData, setEditAttendanceData] = useState([]);
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
  let tableData = [];
  useEffect(() => {
    getSession();
    getAllDepartment();
  }, []);

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

  const getAllDepartment = async () => {
    try {
      setLoading(true);
      const dept = await getDepartment(user.school, user._id, token);
      if (dept.err) {
        return toast.error(dept.err);
      }
      console.log(dept);
      setAllDepartments(dept);
      setLoading(false);
    } catch (err) {
      console.log(err);
      // toast.error("Error fetching departments");
      setLoading(false);
    }
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
        return;
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
  };

  const toggle = async () => {
    setModal(!modal);
    setModelLoading(true);
    await getAllStaff(attendance.selectDepartment);

    setModelLoading(false);
  };
  const getAllStaff = async (section, clas) => {
    const formData = {
      departmentId: attendance.selectDepartment,
    };

    const data = await getStaffByDepartment(user.school, user._id, formData);
    // console.log(data);
    console.log(staff1);
    for (let i = 0; i < data.length; i++) {
      let check = false;
      for (let j = 0; j < staff.length; j++) {
        let temp = Object.keys(staff[j]).toString().split(",")[1];
        if (
          data[i].SID === temp &&
          staff1.staffDatas[Object.keys(staff[j])].length ===
            staff1.workingDay.length &&
          staff1.Today === true
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

  const searchHandler = async (e) => {
    e.preventDefault();
    console.log(attendance);
    var dt = new Date();
    let year = dt.getFullYear();
    let month = (dt.getMonth() + 1).toString().padStart(2, "0");
    let day = dt.getDate().toString().padStart(2, "0");
    let formData = {
      department: attendance.selectDepartment,
      start_date: attendance.dateFrom,
      end_date: attendance.dateTo,
      session: attendance.session,
      today_date: year + "-" + month + "-" + day,
    };
    try {
      const data = await searchStaffAttendance(user.school, user._id, formData);
      console.log(data);
      setStaff1(data);
      setViewAttendance(true);
      let staffs = [];
      for (const key in data.staffDatas) {
        // console.log(`${key}: ${data.studentDatas[key]}`);
        // console.log(key);
        let obj = {};
        obj[key] = data.staffDatas[key];
        console.log(obj);
        staffs.push(obj);
      }
      console.log(staffs);
      setStaff(staffs);
    } catch (err) {
      console.log(err);
    }
  };

  const addAttendanceChangeHandler = (staffId) => async (e) => {
    console.log(staffId);
    console.log(e.target.value);

    let today = new Date();
    let day = today.getDate();
    let month = today.getMonth() + 1;
    let year = today.getFullYear();

    let date = year + "-" + month + "-" + day;

    let attendance1 = {};

    addAttendance &&
      addAttendance.forEach((element, index) => {
        if (element.staff === staffId) {
          // console.log("here");
          addAttendance[index].attendance_status = e.target.value;
          return;
        } else {
          attendance1 = {
            attendance_status: e.target.value,
            date,
            session: attendance.session,
            department: attendance.selectDepartment,
            school: user.school,
            staff: staffId,
          };
        }
      });

    if (addAttendance.length === 0) {
      attendance1 = {
        attendance_status: e.target.value,
        date,
        session: attendance.session,
        department: attendance.selectDepartment,
        school: user.school,
        staff: staffId,
      };
    }
    setAddAttendance([...addAttendance, attendance1]);
  };

  const submitHandler = async () => {
    console.log(addAttendance);
    let arr = addAttendance;
    const uniqueAttendance = Array.from(new Set(arr.map((a) => a.staff))).map(
      (id) => {
        return arr.find((a) => a.staff === id);
      }
    );

    // console.log(uniqueAttendance);
    let newAttendance = uniqueAttendance.filter(
      (value) => Object.keys(value).length !== 0
    );
    console.log(newAttendance);
    let formData = new FormData();
    formData.set("attendance", JSON.stringify(newAttendance));
    formData.set("school", user.school);
    formData.set("department", attendance.selectDepartment);
    try {
      setAddLoading(true);
      const data = await addStaffAttendance(user._id, formData);
      console.log(data);
      if (data && data.err) {
        setModal(false);
        setAddLoading(false);
        toast.error(data.err);
      } else {
        toast.success("Attendance Added Successfully");
        setModal(false);
        setAddLoading(false);
        setAddAttendance([]);
        setTimeout(() => {
          window.location.reload(1);
        }, 1000);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleTimeChange = async (e) => {
    e.preventDefault();
    setModel2Loading(true);
    var dt = new Date(e.target.value);
    let year = dt.getFullYear();
    let month = (dt.getMonth() + 1).toString().padStart(2, "0");
    let day = dt.getDate().toString().padStart(2, "0");
    let day2 = (dt.getDate() + 1).toString().padStart(2, "0");
    let data1 = {
      department: attendance.selectDepartment,
      start_date: year + "-" + month + "-" + day,
      end_date: year + "-" + month + "-" + day,
      session: attendance.session,
    };
    console.log(data1);
    setSelectDate(year + "-" + month + "-" + day);
    try {
      const data = await searchStaffAttendance(user.school, user._id, data1);
      if (data && data.err) {
        toast.error(data.err);
      } else {
        console.log(data);
        let staffs = [];
        for (const key in data.staffDatas) {
          let obj = {};
          obj[key] = data.staffDatas[key];
          console.log(obj);
          staffs.push(obj);
        }
        console.log(staffs);
        setEditAttendanceStaff(staffs);
        setEditAttendance(true);
        setModel2Loading(false);
      }
    } catch (error) {
      setModel2Loading(false);
    }
  };

  const handleStatus = (studentID) => (e) => {
    e.preventDefault();
    let List = editAttendanceData;
    let temp = { id: studentID, attendance_status: e.target.value };
    List.push(temp);
    setEditAttendanceData(List);
    console.log(editAttendanceData);
  };

  const submitEditAttedance = async (e) => {
    e.preventDefault();
    if (editAttendanceData.length === 0) {
      toast.error("First Change Status Before Submit");
    } else {
      setModel2Loading(true);
      var formdata = new FormData();
      formdata.set("department", attendance.selectDepartment);
      formdata.set("date", selectDate);
      formdata.set("editAttedance", JSON.stringify(editAttendanceData));
      formdata.set("session", attendance.session);

      try {
        const data = await updateAttendance(user._id, user.school, formdata);
        if (data && data.err) {
          toast.error(data.err);
        } else {
          setModel2Loading(false);
          setEditPart(false);
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
  const toggleEdit = (e) => {
    e.preventDefault();
    setEditAttendance(false);
    setEditPart(true);
  };

  return (
    <div>
      <SimpleHeader name="Staff" parentName="Attendance" />
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
                <Col md="6">
                  <label
                    className="form-control-label"
                    htmlFor="example4cols2Input"
                  >
                    From
                  </label>
                  <Input
                    className="form-control"
                    id="example-date-input"
                    type="date"
                    onChange={handleChange("dateFrom")}
                    value={attendance.dateFrom}
                    // required
                  />
                </Col>
                <Col md="6">
                  <label
                    className="form-control-label"
                    htmlFor="example4cols2Input"
                  >
                    To
                  </label>
                  <Input
                    className="form-control"
                    id="example-date-input"
                    type="date"
                    onChange={handleChange("dateTo")}
                    value={attendance.dateTo}
                    // required
                  />
                </Col>
              </Row>
              <Row>
                <Col md="6">
                  <Label
                    className="form-control-label"
                    htmlFor="xample-date-input"
                  >
                    Select Department
                  </Label>
                  <Input
                    className="form-control"
                    id="exampleFormControlSelect3"
                    type="select"
                    onChange={handleChange("selectDepartment")}
                    value={attendance.selectDepartment}
                    // required
                  >
                    <option value="" disabled>
                      Select Deparment
                    </option>
                    {allDepartments &&
                      allDepartments.map((dept, index) => {
                        // setselectedClassIndex(index)
                        // console.log(clas);
                        return (
                          <option value={dept._id} key={index}>
                            {dept.name}
                          </option>
                        );
                      })}
                  </Input>
                </Col>
                <Col md="6">
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
                    <option value="">Select Session</option>
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
                    <Col md="3">
                      <div className="col-sm">
                        <h3 className="start-end">
                          {startOfMonth} - {endOfMonth}
                        </h3>
                      </div>
                    </Col>
                    <Col md="6">
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
                    {attendance.section !== "" && (
                      <Col md="3" className="buttons">
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
                      </Col>
                    )}
                  </Row>
                </CardHeader>
                <CardBody>
                  {staff.length === 0 && (
                    <h3 style={{ padding: "10px" }}>No Staff Data Found</h3>
                  )}
                  <div className="attendance_main_div">
                    <table>
                      <thead>
                        <th style={{ width: "50px" }}>#</th>
                        <th>Staff Name</th>
                        <th style={{ width: "150px" }}>Staff ID</th>
                        {staff1.workingDay.map((day) => {
                          return <th key={day}>{day}</th>;
                        })}
                      </thead>

                      <tbody>
                        {staff.length > 0 &&
                          staff.map((student, index) => {
                            return (
                              <>
                                <tr key={index}>
                                  <td>{index + 1}</td>
                                  <td>
                                    {Object.keys(student) &&
                                      Object.keys(student)
                                        .toString()
                                        .split(",")[0]}
                                  </td>
                                  <td>
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
        </Container>
      )}
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
                      attendanceData.map((staff, index) => {
                        return (
                          <>
                            <tr key={index}>
                              <td style={{ fontWeight: "500" }}>
                                {staff.name}
                              </td>
                              <td>
                                {" "}
                                <input
                                  type="radio"
                                  onChange={addAttendanceChangeHandler(
                                    staff.key
                                  )}
                                  value="P"
                                  // checked={atd.present}
                                  name={index}
                                />
                                Present
                              </td>
                              <td>
                                <input
                                  type="radio"
                                  onChange={addAttendanceChangeHandler(
                                    staff.key
                                  )}
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
                                  onChange={addAttendanceChangeHandler(
                                    staff.key
                                  )}
                                />{" "}
                                Half Day
                              </td>
                              <td>
                                <input
                                  type="radio"
                                  value="L"
                                  name={index}
                                  onChange={addAttendanceChangeHandler(
                                    staff.key
                                  )}
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
            <h2>No Staff Data is Found</h2>
          )}
        </ModalBody>
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
              <Label className="form-control-label" htmlFor="xample-date-input">
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
          {editAttendance && (
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
                    {editAttendanceStaff && editAttendanceStaff.length > 0 ? (
                      editAttendanceStaff.map((student, index) => {
                        console.log(student);
                        return (
                          <>
                            <tr key={index}>
                              <td style={{ fontWeight: "500" }}>
                                {Object.keys(student) &&
                                  Object.keys(student).toString().split(",")[0]}
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
                      <h3>No Staff Data is Found</h3>
                    )}
                  </tbody>
                </Table>
              </div>
              <br />
              {editAttendance && editAttendanceStaff.length > 0 && (
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
    </div>
  );
};

export default StaffAttendance;
