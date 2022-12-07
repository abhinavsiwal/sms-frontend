import React, { useState, useEffect } from "react";
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
  CardHeader,
  Table,
  Modal,
  ModalBody,
} from "reactstrap";
import "./style.css";
import { SearchOutlined } from "@ant-design/icons";
import SimpleHeader from "components/Headers/SimpleHeader.js";
import LoadingScreen from "react-loading-screen";
import moment from "moment";
import { allClass } from "api/class";
import { isAuthenticated } from "api/auth";
import { ToastContainer, toast } from "react-toastify";
import { allSessions } from "api/session";
import {
  updateTimeTable,
  getPeriodsByDay1,
  updatePeriodV2,
} from "api/Time Table";
import {
  getTimeTableForClass,
  updatePeriod,
  getAllPeriods,
} from "api/Time Table";

const StudentView = () => {
  const { user, token } = isAuthenticated();
  const [classes, setClasses] = useState([]);
  const [sessions, setSessions] = React.useState([]);
  const [classId, setClassId] = useState("");
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);
  const [timetableData, setTimetableData] = useState([]);
  const [allPeriods, setAllPeriods] = useState([]);
  const [periods1, setPeriods1] = useState({});
  const [selectedClass, setSelectedClass] = useState({});
  const [searchData, setSearchData] = React.useState({
    class: "",
    section: "",
    session: "",
  });
  const WorkingDaysList = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const [checked, setChecked] = useState(false);
  useEffect(() => {
    getClass();
    getSession();
  }, [checked]);

  const getClass = async () => {
    try {
      const classes = await allClass(user._id, user.school, token);
      console.log(classes);
      if (classes.err) {
        return toast.error(classes.err);
      } else {
        setClasses(classes);
      }
    } catch (err) {
      toast.error("Something Went Wrong!");
    }
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
    setSearchData({ ...searchData, [name]: event.target.value });
    console.log(name);
    if (name === "class") {
      console.log("@@@@@@@@=>", event.target.value);
      // setSelectedClassId(event.target.value);
      let selectedClass = classes.find(
        (item) => item._id.toString() === event.target.value.toString()
      );
      console.log(selectedClass);
      setSelectedClass(selectedClass);
    }
    if (name === "section") {
      setShow(true);
      getSchedulesForClass(event.target.value);
    }
  };
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

  async function getSchedulesForClass(sect) {
    const formData = new FormData();
    formData.set("class", searchData.class);
    formData.set("section", sect);
    const formData1 = {
      class: searchData.class,
      section: sect,
      role: "STD",
    };
    try {
      setLoading(true);
      const data = await getTimeTableForClass(user.school, user._id, formData);
      const data1 = await getAllPeriods(user.school, user._id, formData);
      const data2 = await getPeriodsByDay1(user.school, user._id, formData1);
      console.log(data, "data");
      console.log("data1", data1);
      setPeriods1(data2.data);
      if (data.err) {
        toast.error(data.err);
        return setLoading(false);
      }

      setTimetableData(data);
      setAllPeriods(data1);
      console.log(data2, "data2");
      setLoading(false);
    } catch (err) {
      console.log(err);
      toast.error("Something Went Wrong!");
      setLoading(false);
    }
  }

  return (
    <>
      <SimpleHeader name="Class View" parentName="Time Table" />
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
      />
      <Container className="mt--6 shadow-lg">
        <Card>
          <CardBody>
            <Row className="m-4">
              <Col>
                <label
                  className="form-control-label"
                  htmlFor="example4cols2Input"
                >
                  Select Session
                </label>

                <select
                  required
                  className="form-control"
                  onChange={handleChange("session")}
                  value={searchData.session}
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
              <Col>
                <Label
                  className="form-control-label"
                  htmlFor="xample-date-input"
                >
                  Select Class
                </Label>
                <Input
                  id="example4cols3Input"
                  type="select"
                  onChange={handleChange("class")}
                  value={searchData.class}
                  required
                >
                  <option value="" disabled selected>
                    Select Class
                  </option>
                  {classes.map((clas) => {
                    return (
                      <option key={clas._id} value={clas._id}>
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
                  id="example4cols3Input"
                  type="select"
                  onChange={handleChange("section")}
                  value={searchData.section}
                  required
                  placeholder="Add Periods"
                >
                  <option value="" disabled selected>
                    Select Section
                  </option>
                  {selectedClass.section &&
                    selectedClass.section.map((section) => {
                      console.log(section.name);
                      return (
                        <option value={section._id} key={section._id} selected>
                          {section.name}
                        </option>
                      );
                    })}
                </Input>
              </Col>
            </Row>
          </CardBody>
        </Card>
      </Container>
      {show && (
        <Container>
          <Card>
            <CardHeader>
              <h2>Time Table - Class View</h2>
            </CardHeader>
            <CardBody>
              <div className="table_div_fees">
                <table className="fees_table">
                  <thead style={{ backgroundColor: "#d3d3d3" }}>
                    <tr>
                      <th style={{ backgroundColor: "#d3d3d3" }}>Schedule</th>
                      {WorkingDaysList.map((day, index) => {
                        return (
                          <th
                            key={index}
                            style={{ backgroundColor: "#d3d3d3" }}
                          >
                            {day}
                          </th>
                        );
                      })}
                    </tr>
                  </thead>
                  <tbody>
                    {allPeriods &&
                      allPeriods.map((period, index) => {
                        console.log(period);
                        return (
                          <tr key={index}>
                            <th>
                              {period.start.substring(0, 5) +
                                "-" +
                                period.end.substring(0, 5)}
                            </th>
                            {WorkingDaysList.map((day, index) => {
                              console.log(
                                periods1[day].find(
                                  (d) =>
                                    d.subject !== null &&
                                    d.subject !== "" &&
                                    d.subject._id !== "" &&
                                    d.subject._id !== null &&
                                    period.start === d.start &&
                                    period.end === d.end
                                )
                              );
                              return (
                                <td key={index}>
                                  <p>
                                    {periods1[day].find(
                                      (d) =>
                                        (d.subject !== null ||
                                          d.subject !== "") &&
                                        (d.subject_id !== null ||
                                          d.subject_id === "") &&
                                        period.start === d.start &&
                                        period.end === d.end
                                    )
                                      ? periods1[day].find(
                                          (d) =>
                                            (d.subject !== null ||
                                              d.subject !== "") &&
                                            (d.subject_id !== null ||
                                              d.subject_id !== "") &&
                                            period.start === d.start &&
                                            period.end === d.end
                                        ).subject
                                      : ""}
                                  </p>
                                  <p>
                                    {
                                      periods1[day].find(
                                        (d) =>
                                          period.start === d.start &&
                                          period.end === d.end &&
                                          (d.staff !== null || d.staff !== {})
                                      )?.staff?.firstname
                                    }
                                  </p>
                                </td>
                              );
                            })}
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
            </CardBody>
          </Card>
        </Container>
      )}
    </>
  );
};

export default StudentView;
