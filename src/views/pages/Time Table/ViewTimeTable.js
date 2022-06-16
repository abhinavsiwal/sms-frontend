import React, { useState, useReducer, useEffect } from "react";

import {
  Container,
  Card,
  CardBody,
  CardHeader,
  Table,
  Button,
  Row,
  Col,
  Input,
} from "reactstrap";

// core components
import SimpleHeader from "components/Headers/SimpleHeader.js";

//Import ToastContainer
import { ToastContainer, toast } from "react-toastify";

import { isAuthenticated } from "api/auth";
import {
  deleteTimeTable,
  getSingleTimeTable,
  updateTimeTable,
} from "../../../api/Time Table";

import { Popconfirm } from "antd";
import { fetchingClassError } from "constants/errors";
import { allClass } from "api/class";
import { allStaffs } from "api/staff";
import { allSubjects } from "api/subjects";

// import moment Library
import moment from "moment";
import LoadingScreen from "react-loading-screen";

//React Datepicker
import "react-datepicker/dist/react-datepicker.css";

function ViewTimeTable() {
  const [classs, setClasss] = useState("");
  const [staff, setStaff] = useState("");
  const [subject, setSubject] = useState("");
  const [timeTableOne, setTimeTableOne] = useState("");
  const [timeTableID, setTimeTableID] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSection, setSelectedSection] = useState("");
  const [step, setStep] = useState(0);
  const [myObj, setMyObj] = useState({});
  const [periodArrayMain, setPeriodArrayMain] = useState([]);
  const [days, setDays] = useState("");
  const [ignored, forceUpdate] = useReducer((x) => x + 1, 0);
  const [showLoad, setShowLoad] = useState(false);

  const getAllClass = async () => {
    const { user, token } = isAuthenticated();
    const classes = await allClass(user._id, user.school, token);
    if (classes.err) {
      return toast.error(fetchingClassError);
    } else {
      setClasss(classes);
      return;
    }
  };

  const getAllSubject = async () => {
    const { user, token } = isAuthenticated();
    try {
      const subject = await allSubjects(user._id, user.school, token);
      if (subject.err) {
        return toast.error(subject.err);
      } else {
        setSubject(subject);
      }
    } catch (err) {
      toast.error("Something Went Wrong!");
    }
  };

  const getAllStaff = async () => {
    const { user, token } = isAuthenticated();
    try {
      const staff = await allStaffs(user.school, user._id);
      if (staff.data.err) {
        toast.error(staff.data.err);
      } else {
        setStaff(staff.data);
      }
    } catch (err) {
      toast.error("Something Went Wrong!");
    }
  };

  const handleClass = (e) => {
    setShowLoad(true);
    e.preventDefault();
    if (e.target.value === "") {
      setSelectedClass("");
      setShowLoad(false);
    } else {
      setSelectedClass(JSON.parse(e.target.value));
      setShowLoad(false);
    }
  };

  const handleSection = (e) => {
    e.preventDefault();
    if (e.target.value === "") {
    } else {
      setSelectedSection(JSON.parse(e.target.value));
    }
  };

  const handleNext = async (e) => {
    setShowLoad(true);
    e.preventDefault();
    const { user, token } = isAuthenticated();
    let row = {
      class: selectedClass._id,
      section: selectedSection._id,
    };
    try {
      const timeTable = await getSingleTimeTable(
        user.school,
        user._id,
        token,
        row
      );
      if (timeTable && timeTable.err) {
        setShowLoad(false);
        return toast.error(timeTable.err);
      } else if (timeTable && timeTable._id) {
        setTimeTableID(timeTable._id);
        setTimeTableOne(timeTable.lecture);
        setPeriodArrayMain(timeTable.timeSlots);
        setDays(timeTable.working_day);
        setShowLoad(false);
        setStep(1);
      } else {
        setShowLoad(false);
        return toast.error("TimeTable is not Created!");
      }
    } catch (err) {
      setShowLoad(false);
      toast.error("Something Went Wrong!");
    }
  };

  const handleDelete = async (e) => {
    setShowLoad(true);
    e.preventDefault();
    const { user, token } = isAuthenticated();
    try {
      const deletes = await deleteTimeTable(timeTableID, user._id, token);
      if (deletes.err) {
        return toast.error(deletes.err);
      } else {
        setShowLoad(false);
        toast.success("TimeTable Delete SuccessFully!");
        setTimeout(() => {
          window.location.reload(1);
        }, 1000);
      }
    } catch (err) {
      toast.error("Something Went Wrong!");
    }
  };

  const handleEdit = async (e) => {
    setShowLoad(true);
    e.preventDefault();
    await getAllStaff();
    await getAllSubject();
    var temp = {};
    await days.map(async (data) => {
      periodArrayMain.map((data2) => {
        if (data2.name) {
        } else {
          temp[data] = {};
          temp[data][data2] = {};
        }
      });
    });
    await days.map(async (data) => {
      if (timeTableOne[data]) {
        periodArrayMain.map((data2) => {
          if (timeTableOne[data][data2]) {
            temp[data][data2] = timeTableOne[data][data2];
          }
        });
      }
    });
    setTimeTableOne(temp);
    setStep(2);
    setShowLoad(false);
  };

  const handleEditSubmit = async (e) => {
    setShowLoad(true);
    e.preventDefault();
    var formdata = new FormData();
    formdata.set("lecture", JSON.stringify(timeTableOne));
    const { user, token } = isAuthenticated();
    try {
      const timetable = await updateTimeTable(
        timeTableID,
        user._id,
        token,
        formdata
      );
      if (timetable.err) {
        setShowLoad(false);
        toast.error(timetable.err);
      } else {
        setShowLoad(false);
        toast.success("TimeTable Updated SuccessFully!");
        setTimeout(() => {
          window.location.reload(1);
        }, 1000);
      }
    } catch (err) {
      setShowLoad(false);
      toast.error("Something Went Wrong!");
    }
  };

  const handleTimeTableData = (day, time) => (e) => {
    var name = e.target.value;
    var myObj_temp = timeTableOne;
    myObj_temp[day][time] = {
      ...myObj_temp[day][time],
      time: time,
      period_name: name,
    };
    setTimeTableOne(myObj_temp);

    forceUpdate();
  };
  const handleTimeTableDataForMeet = (day, time) => (e) => {
    var meetlink = e.target.value;
    var myObj_temp = timeTableOne;
    myObj_temp[day][time] = {
      ...myObj_temp[day][time],
      meet: meetlink,
    };
    setTimeTableOne(myObj_temp);
    forceUpdate();
  };
  const handleTimeTableDataForTeacher = (day, time) => (e) => {
    if (e.target.value === "") {
      var myObj_temp = timeTableOne;
      myObj_temp[day][time] = {
        ...myObj_temp[day][time],
        teacherID: "",
        teacherName: "",
      };
      setTimeTableOne(myObj_temp);

      forceUpdate();
    } else {
      var teacherData = JSON.parse(e.target.value);
      var myObj_temp = timeTableOne;
      myObj_temp[day][time] = {
        ...myObj_temp[day][time],
        teacherID: teacherData._id,
        teacherName: teacherData.firstname + " " + teacherData.lastname,
      };
      setTimeTableOne(myObj_temp);

      forceUpdate();
    }
  };
  const handleTimeTableDataForSubject = (day, time) => (e) => {
    if (e.target.value === "") {
      var myObj_temp = timeTableOne;
      myObj_temp[day][time] = {
        ...myObj_temp[day][time],
        subjectID: "",
        subjectName: "",
      };
      setTimeTableOne(myObj_temp);
      forceUpdate();
    } else {
      var subjectData = JSON.parse(e.target.value);
      var myObj_temp = timeTableOne;
      myObj_temp[day][time] = {
        ...myObj_temp[day][time],
        subjectID: subjectData._id,
        subjectName: subjectData.name,
      };
      setTimeTableOne(myObj_temp);

      forceUpdate();
    }
  };

  useEffect(async () => {
    setShowLoad(true);
    await getAllClass();
    setShowLoad(false);
  }, []);
  return (
    <>
      <SimpleHeader name="Time Table" parentName="Student TimeTable" />
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
        <Card>
          <LoadingScreen
            loading={showLoad}
            bgColor="#f1f1f1"
            spinnerColor="#9ee5f8"
            textColor="#676767"
            text="Please Wait..."
          ></LoadingScreen>
          <CardHeader>
            <h2>View TimeTable</h2>
          </CardHeader>
          <CardBody>
            {step == 0 && (
              <form onSubmit={handleNext}>
                <Row>
                  <Col>
                    <label
                      className="form-control-label"
                      htmlFor="exampleFormControlSelect3"
                    >
                      Select Class
                    </label>
                    <Input
                      id="example4cols3Input"
                      type="select"
                      onChange={handleClass}
                      required
                    >
                      <option value="" disabled selected>
                        Select Class
                      </option>
                      {classs &&
                        classs !== "" &&
                        classs.map((clas) => {
                          return (
                            <option key={clas._id} value={JSON.stringify(clas)}>
                              {clas.name}
                            </option>
                          );
                        })}
                    </Input>
                  </Col>
                  <Col>
                    <label
                      className="form-control-label"
                      htmlFor="exampleFormControlSelect3"
                    >
                      Select Section
                    </label>
                    <Input
                      id="example4cols3Input"
                      type="select"
                      onChange={handleSection}
                      required
                    >
                      <option value="" selected>
                        Select Section
                      </option>
                      {classs &&
                        classs !== "" &&
                        selectedClass !== "" &&
                        selectedClass.section.map((section) => {
                          return (
                            <option
                              key={section._id}
                              value={JSON.stringify(section)}
                            >
                              {section.name}
                            </option>
                          );
                        })}
                    </Input>
                  </Col>
                </Row>
                <br />
                <Row className="next_button">
                  <Col>
                    <Button color="primary" type="submit">
                      Next
                    </Button>
                  </Col>
                </Row>
              </form>
            )}
            {step == 1 && (
              <>
                <Row className="next_button">
                  <Col>
                    <Button color="primary" type="button">
                      <Popconfirm
                        title="Are You Sure to Edit?"
                        onConfirm={handleEdit}
                      >
                        Edit TimeTable
                      </Popconfirm>
                    </Button>
                    <Button color="danger" type="button">
                      <Popconfirm
                        title="Are You Sure to Delete?"
                        onConfirm={handleDelete}
                      >
                        Delete TimeTable
                      </Popconfirm>
                    </Button>
                  </Col>
                </Row>
                <br />
                <div className="table_main">
                  <table>
                    <thead>
                      <th>#Period</th>
                      {days.map((data) => {
                        return <th>{data}</th>;
                      })}
                    </thead>
                    <tbody>
                      {periodArrayMain.map((data, index) => {
                        if (data.name && data.name === "Lunch") {
                          return (
                            <tr className="lunch_row">
                              <td colspan={days.length + 1}>
                                {data.name}
                                <p>{data.time}</p>
                              </td>
                            </tr>
                          );
                        } else {
                          return (
                            <tr>
                              <td className="period_name">{data}</td>
                              {days.map((data1) => {
                                if (timeTableOne[data1]) {
                                  return (
                                    <td>
                                      {timeTableOne[data1][data] &&
                                        timeTableOne[data1][data].period_name &&
                                        timeTableOne[data1][data]
                                          .period_name !== "" && (
                                          <div class="form-group">
                                            <span>Name</span>
                                            <input
                                              class="form-field"
                                              type="text"
                                              disabled
                                              placeholder="Period 1"
                                              value={
                                                timeTableOne &&
                                                timeTableOne[data1] &&
                                                timeTableOne[data1][data] &&
                                                timeTableOne[data1][data]
                                                  .period_name
                                              }
                                            />
                                          </div>
                                        )}

                                      {timeTableOne[data1][data] &&
                                        timeTableOne[data1][data]
                                          .teacherName && (
                                          <div className="form-group">
                                            <select
                                              id="select_teacher"
                                              className="form-field"
                                              disabled
                                              value={
                                                timeTableOne &&
                                                timeTableOne[data1] &&
                                                timeTableOne[data1][data] &&
                                                timeTableOne[data1][data]
                                                  .teacherName
                                              }
                                            >
                                              <option
                                                value=""
                                                disabled
                                                selected
                                              >
                                                {timeTableOne[data1][data] &&
                                                  timeTableOne[data1][data]
                                                    .teacherName &&
                                                  timeTableOne[data1][data]
                                                    .teacherName}
                                              </option>
                                            </select>
                                          </div>
                                        )}
                                      {timeTableOne[data1][data] &&
                                        timeTableOne[data1][data]
                                          .subjectName && (
                                          <div className="form-group">
                                            <select
                                              id="select_teacher"
                                              className="form-field"
                                              disabled
                                            >
                                              <option
                                                value=""
                                                disabled
                                                selected
                                              >
                                                {timeTableOne[data1][data] &&
                                                  timeTableOne[data1][data]
                                                    .subjectName &&
                                                  timeTableOne[data1][data]
                                                    .subjectName}
                                              </option>
                                            </select>
                                          </div>
                                        )}
                                      {timeTableOne[data1][data] &&
                                        timeTableOne[data1][data].meet &&
                                        (timeTableOne[data1][data].meet !==
                                          undefined ||
                                          timeTableOne[data1][data].meet !==
                                            "") && (
                                          <div class="form-group">
                                            <span>
                                              <a
                                                href={
                                                  timeTableOne[data1][data].meet
                                                }
                                              >
                                                <i
                                                  id="video_icon"
                                                  className="fas fa-video"
                                                />
                                              </a>
                                            </span>
                                            <input
                                              onChange={handleTimeTableDataForMeet(
                                                data1,
                                                data
                                              )}
                                              disabled
                                              value={
                                                timeTableOne &&
                                                timeTableOne[data1] &&
                                                timeTableOne[data1][data] &&
                                                timeTableOne[data1][data].meet
                                              }
                                              class="form-field"
                                              type="text"
                                              placeholder="Period 1"
                                            />
                                          </div>
                                        )}
                                    </td>
                                  );
                                } else {
                                  return <td></td>;
                                }
                              })}
                            </tr>
                          );
                        }
                      })}
                    </tbody>
                  </table>
                  <br />
                </div>
              </>
            )}
            {step == 2 && (
              <>
                <div className="table_main">
                  <table>
                    <thead>
                      <th>#Period</th>
                      {days.map((data) => {
                        return <th>{data}</th>;
                      })}
                    </thead>
                    <tbody>
                      {periodArrayMain.map((data, index) => {
                        if (data.name && data.name === "Lunch") {
                          return (
                            <tr className="lunch_row">
                              <td colspan={days.length + 1}>
                                {data.name}
                                <p>{data.time}</p>
                              </td>
                            </tr>
                          );
                        } else {
                          return (
                            <tr>
                              <td className="period_name">{data}</td>
                              {days.map((data1) => {
                                return (
                                  <td>
                                    <div class="form-group">
                                      <span>Name</span>
                                      <input
                                        class="form-field"
                                        type="text"
                                        onChange={handleTimeTableData(
                                          data1,
                                          data
                                        )}
                                        value={
                                          timeTableOne &&
                                          timeTableOne[data1] &&
                                          timeTableOne[data1][data] &&
                                          timeTableOne[data1][data].period_name
                                        }
                                        placeholder="Period 1"
                                      />
                                    </div>

                                    <div className="form-group">
                                      <select
                                        id="select_teacher"
                                        className="form-field"
                                        onChange={handleTimeTableDataForTeacher(
                                          data1,
                                          data
                                        )}
                                      >
                                        {timeTableOne &&
                                        timeTableOne[data1] &&
                                        timeTableOne[data1][data] &&
                                        timeTableOne[data1][data]
                                          .teacherName ? (
                                          <>
                                            <option value="">
                                              Clear Teacher
                                            </option>
                                            <option value="" selected>
                                              {
                                                timeTableOne[data1][data]
                                                  .teacherName
                                              }
                                            </option>
                                            <hr />
                                          </>
                                        ) : (
                                          <option value="" selected>
                                            Select Teacher
                                          </option>
                                        )}
                                        {staff !== "" &&
                                          staff.map((data) => {
                                            return (
                                              <option
                                                value={JSON.stringify(data)}
                                              >
                                                {data.firstname +
                                                  " " +
                                                  data.lastname}
                                              </option>
                                            );
                                          })}
                                      </select>
                                    </div>
                                    <div className="form-group">
                                      <select
                                        id="select_teacher"
                                        className="form-field"
                                        onChange={handleTimeTableDataForSubject(
                                          data1,
                                          data
                                        )}
                                      >
                                        {timeTableOne &&
                                        timeTableOne[data1] &&
                                        timeTableOne[data1][data] &&
                                        timeTableOne[data1][data]
                                          .subjectName ? (
                                          <>
                                            <option value="">
                                              Clear Subject
                                            </option>
                                            <option value="" selected>
                                              {
                                                timeTableOne[data1][data]
                                                  .subjectName
                                              }
                                            </option>
                                            <hr />
                                          </>
                                        ) : (
                                          <option value="" disabled selected>
                                            Select Subject
                                          </option>
                                        )}
                                        {subject !== "" &&
                                          subject.map((data) => {
                                            return (
                                              <option
                                                value={JSON.stringify(data)}
                                              >
                                                {data.name}
                                              </option>
                                            );
                                          })}
                                      </select>
                                    </div>
                                    <div class="form-group">
                                      <span>Meet Link</span>
                                      <input
                                        onChange={handleTimeTableDataForMeet(
                                          data1,
                                          data
                                        )}
                                        value={
                                          timeTableOne &&
                                          timeTableOne[data1] &&
                                          timeTableOne[data1][data] &&
                                          timeTableOne[data1][data].meet
                                        }
                                        class="form-field"
                                        type="text"
                                        placeholder="Period 1"
                                      />
                                    </div>
                                  </td>
                                );
                              })}
                            </tr>
                          );
                        }
                      })}
                    </tbody>
                  </table>
                  <br />
                </div>
                <Row className="next_button">
                  <Col>
                    <Button color="primary" type="button">
                      <Popconfirm
                        title="Are You Sure to Submit?"
                        onConfirm={handleEditSubmit}
                      >
                        Submit TimeTable
                      </Popconfirm>
                    </Button>
                  </Col>
                </Row>
              </>
            )}
          </CardBody>
        </Card>
      </Container>
    </>
  );
}

export default ViewTimeTable;
