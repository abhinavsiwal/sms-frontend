import React, { useState, useEffect, useReducer } from "react";

//import react-strap
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  Input,
  Button,
  CardHeader,
} from "reactstrap";

//import CSS
import "./TimeTable.css";

// core components
import SimpleHeader from "components/Headers/SimpleHeader.js";

//React Datepicker
import "react-datepicker/dist/react-datepicker.css";
// import moment Library
import moment from "moment";
import LoadingScreen from "react-loading-screen";

//import Class Api
import { allClass } from "api/class";
import { createTimeTable } from "../../../api/Time Table";
import { isAuthenticated } from "api/auth";

//Import ToastContainer
import { ToastContainer, toast } from "react-toastify";
import { fetchingClassError } from "constants/errors";
import { addTimetableError } from "constants/errors";
import { allSessions } from "api/session";
import { allStaffs } from "api/staff";
import { allSubjects } from "api/subjects";
import { getSingleTimeTable } from "../../../api/Time Table";

import { Popconfirm, Space, TimePicker } from "antd";

function AddTimeTable() {
  const [classs, setClasss] = useState("");
  const [sections, setSections] = useState("");
  const [sessions, setSessions] = useState("");
  const [staff, setStaff] = useState("");
  const [subject, setSubject] = useState("");
  const [currentSession, setCurrentSession] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSection, setSelectedSection] = useState("");
  const [step, setStep] = useState(0);
  const [myObj, setMyObj] = useState({});
  const [periodArray, setPeriodArray] = useState([{ time: "" }]);
  const [periodArrayMain, setPeriodArrayMain] = useState([]);
  const [ignored, forceUpdate] = useReducer((x) => x + 1, 0);
  const [days, setDays] = useState([
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ]);

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

  const getAllSession = async () => {
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

  useEffect(async () => {
    setShowLoad(true);
    await getAllClass();
    await getAllSession();
    setShowLoad(false);
  }, []);

  const handleChange = () => {};
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

  const handleSession = (e) => {
    e.preventDefault();
    if (e.target.value === "") {
    } else {
      var data = JSON.parse(e.target.value);
      var working_days = [];
      for (var i = 0; i < data.working_days; i++) {
        working_days.push(days[i]);
      }
      setDays(working_days);
      setCurrentSession(data._id);
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
        setShowLoad(false);
        return toast.error("TimeTable is Already Created");
      } else {
        setShowLoad(false);
        setStep(1);
      }
    } catch (err) {
      toast.error("Something Went Wrong!");
    }
  };

  const handleAddPeriod = (e) => {
    e.preventDefault();
    var data = periodArray;
    data.push({ time: "" });
    setPeriodArray(data);
    forceUpdate();
  };

  const handlelunch = (e) => {
    e.preventDefault();
    var data = periodArray;
    data.push({ name: "Lunch" });
    setPeriodArray(data);
    forceUpdate();
  };

  const handlechangeTime = (index) => (time, timeString) => {
    var data = periodArray;
    if (data[index].name === "Lunch") {
      data[index]["time"] = time;
    } else {
      data[index] = time;
      setPeriodArray(data);
    }
  };

  const handleGenerateLayout = async (e) => {
    setShowLoad(true);
    e.preventDefault();
    if (periodArray.length <= 1) {
      setShowLoad(false);
      toast.error("Please Select Atleast 2 Periods !");
    } else if (periodArray.length >= 1) {
      var temp = false;
      periodArray.map((data) => {
        if (data === null || data.time === "") {
          temp = true;
        }
      });
      if (temp === true) {
        setShowLoad(false);

        toast.error("Please Enter Time Of Period !");
      } else {
        let checker = false;
        let first = periodArray[0];
        for (let i = 1; i < periodArray.length; i++) {
          if (periodArray[i].time) {
            console.log(moment(periodArray[i].time[0]) < moment(first[1]));
            if (moment(periodArray[i].time[0]) < moment(first[1])) {
              checker = true;
              first = periodArray[i].time;
            } else {
              first = periodArray[i].time;
            }
          } else {
            console.log(moment(periodArray[i][0]) < moment(first[1]));
            if (moment(periodArray[i][0]) < moment(first[1])) {
              checker = true;
              first = periodArray[i];
            } else {
              first = periodArray[i];
            }
          }
        }
        if (checker === true) {
          setShowLoad(false);
          toast.error("Please Enter Valid Time Range");
        } else {
          await getAllStaff();
          await getAllSubject();
          var period_Array_Main = [];
          await periodArray.map(async (data) => {
            if (data.name && data.name === "Lunch") {
              var start = "";
              var end = "";
              for (var i = 0; i < data.time.length; i++) {
                var time = moment(data.time[i]).format("hh:mm A");
                if (i === 0) {
                  start = `${time}`;
                } else {
                  end = `${time}`;
                }
              }
              var temp = start + " - " + end;
              data.time = temp;
              period_Array_Main.push(data);
            } else {
              var start = "";
              var end = "";
              for (var i = 0; i < data.length; i++) {
                var time = moment(data[i]).format("hh:mm A");
                if (i === 0) {
                  start = `${time}`;
                } else {
                  end = `${time}`;
                }
              }
              period_Array_Main.push(start + " - " + end);
            }
          });
          setPeriodArrayMain(period_Array_Main);
          var temp = {};
          await days.map(async (data) => {
            temp[data] = {};
            period_Array_Main.map(async (data2) => {
              if (data2.name) {
              } else {
                temp[data][data2] = {};
              }
            });
          });
          setMyObj(temp);
          setStep(2);
          setShowLoad(false);
        }
      }
    } else {
    }
  };

  const handleTimeTableData = (day, time) => (e) => {
    var name = e.target.value;
    var myObj_temp = myObj;
    myObj_temp[day][time] = {
      ...myObj_temp[day][time],
      time: time,
      period_name: name,
    };
    setMyObj(myObj_temp);
  };
  const handleTimeTableDataForMeet = (day, time) => (e) => {
    var meetlink = e.target.value;
    var myObj_temp = myObj;
    myObj_temp[day][time] = {
      ...myObj_temp[day][time],
      meet: meetlink,
    };
    setMyObj(myObj_temp);
  };
  const handleTimeTableDataForTeacher = (day, time) => (e) => {
    if (e.target.value === "") {
    } else {
      var teacherData = JSON.parse(e.target.value);
      var myObj_temp = myObj;
      myObj_temp[day][time] = {
        ...myObj_temp[day][time],
        teacherID: teacherData._id,
        teacherName: teacherData.firstname + " " + teacherData.lastname,
      };
      setMyObj(myObj_temp);
    }
  };
  const handleTimeTableDataForSubject = (day, time) => (e) => {
    if (e.target.value === "") {
    } else {
      var subjectData = JSON.parse(e.target.value);
      var myObj_temp = myObj;
      myObj_temp[day][time] = {
        ...myObj_temp[day][time],
        subjectID: subjectData._id,
        subjectName: subjectData.name,
      };
      setMyObj(myObj_temp);
    }
  };

  const handleSubmit = async (e) => {
    setShowLoad(true);
    e.preventDefault();
    var formdata = new FormData();
    var checker = true;
    await days.map(async (data) => {
      await periodArrayMain.map(async (data2) => {
        if (data2 && data2.name && data2.name === "Lunch") {
        } else {
          console.log(Object.keys(myObj[data][data2]).length !== 0);
          if (Object.keys(myObj[data][data2]).length !== 0) {
            checker = false;
          }
        }
      });
    });
    if (checker === false) {
      formdata.set("lecture", JSON.stringify(myObj));
      formdata.set("session", currentSession);
      formdata.set("class", selectedClass._id);
      formdata.set("section", selectedSection._id);
      formdata.set("timeSlots", JSON.stringify(periodArrayMain));
      formdata.set("working_day", JSON.stringify(days));
      const { user, token } = isAuthenticated();
      formdata.set("school", user.school);
      try {
        const timetable = await createTimeTable(user._id, token, formdata);
        if (timetable.err) {
          setShowLoad(false);
          toast.error(timetable.err);
        } else {
          setShowLoad(false);
          toast.success("TimeTable Create SuccessFully!");
          setTimeout(() => {
            window.location.reload(1);
          }, 1000);
        }
      } catch (err) {
        setShowLoad(false);
        toast.error("Something Went Wrong!");
      }
    } else {
      setShowLoad(false);
      toast.error("Fill Same Fields First!");
    }
  };

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
            <h2>Add TimeTable</h2>
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
                      htmlFor="example4cols2Input"
                    >
                      Session
                    </label>

                    <select
                      required
                      className="form-control"
                      onChange={handleSession}
                    >
                      <option value="">Select Session</option>
                      {sessions &&
                        sessions.map((data) => {
                          return (
                            <option key={data._id} value={JSON.stringify(data)}>
                              {data.name}
                            </option>
                          );
                        })}
                    </select>
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
                <h4>Class: {selectedClass.name}</h4>
                <h4>Section: {selectedSection.name}</h4>
                <br />
                <form onSubmit={handleGenerateLayout}>
                  <p style={{ color: "red" }}>
                    Note : Please Enter Periods Time Wise not rendom
                  </p>
                  <Row>
                    <Col>
                      <label
                        className="form-control-label"
                        htmlFor="exampleFormControlSelect3"
                      >
                        Enter Period
                      </label>
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      {periodArray.map((data, index) => {
                        if (data.name && data.name === "Lunch") {
                          return (
                            <>
                              <h2>{index + 1}</h2>
                              <h2>Lunch</h2>
                              <Space>
                                <TimePicker.RangePicker
                                  use12Hours
                                  format="h:mm a"
                                  required
                                  onChange={handlechangeTime(index)}
                                />
                              </Space>
                              <br />
                            </>
                          );
                        } else {
                          return (
                            <>
                              <h2>{index + 1}</h2>
                              <Space>
                                <TimePicker.RangePicker
                                  use12Hours
                                  format="h:mm a"
                                  required
                                  onChange={handlechangeTime(index)}
                                />
                              </Space>
                              <br />
                            </>
                          );
                        }
                      })}
                      <br />
                      <br />
                      <Button type="button" onClick={handleAddPeriod}>
                        Add One More Period
                      </Button>
                      <Button type="button" onClick={handlelunch}>
                        Add lunch
                      </Button>
                    </Col>
                  </Row>
                  <Row className="next_button">
                    <Col>
                      <Button color="primary" type="submit">
                        Generate Layout
                      </Button>
                    </Col>
                  </Row>
                </form>
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
                                    <div className="form-group">
                                      <span>Name</span>
                                      <input
                                        className="form-field"
                                        type="text"
                                        onChange={handleTimeTableData(
                                          data1,
                                          data
                                        )}
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
                                        <option value="" disabled selected>
                                          Select Teacher
                                        </option>
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
                                        <option value="" disabled selected>
                                          Select Subject
                                        </option>
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
                                    <div className="form-group">
                                      <span>Meet Link</span>
                                      <input
                                        onChange={handleTimeTableDataForMeet(
                                          data1,
                                          data
                                        )}
                                        className="form-field"
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
                        onConfirm={handleSubmit}
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

export default AddTimeTable;
