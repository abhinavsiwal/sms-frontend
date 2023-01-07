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
import { allStaffs } from "api/staff";
import { SearchOutlined } from "@ant-design/icons";
import SimpleHeader from "components/Headers/SimpleHeader.js";
import moment from "moment";
import { isAuthenticated } from "api/auth";
import { ToastContainer, toast } from "react-toastify";
import { allSessions } from "api/session";
import LoadingScreen from "react-loading-screen";
import {
  updateTimeTable,
  staffPeriodList,
  getPeriodsByDay1,
} from "api/Time Table";

const StaffView = () => {
  const { user, token } = isAuthenticated();
  const [sessions, setSessions] = React.useState([]);
  const [loading, setLoading] = useState(false);
  const [allStaff, setAllStaff] = useState([]);
  const [show, setShow] = useState(false);
  const [timetableData, setTimetableData] = useState([]);
  const [searchData, setSearchData] = React.useState({
    teacher: "",
    session: "",
  });
  const [allPeriods, setAllPeriods] = useState([]);
  const [periods1, setPeriods1] = useState([]);
  const [checked, setChecked] = useState(false);
  const [workingDays, setWorkingDays] = useState(0);
  const WorkingDaysList = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];
  useEffect(() => {
    getAllStaffs();
    getSession();
  }, [checked]);

  const getAllStaffs = async () => {
    try {
      setLoading(true);
      const { data } = await allStaffs(user.school, user._id);
      console.log("staff=>=>=>=>=>=>==>=>=>=>=>", data);
      let teachingStaff = data.filter(
        (staff) => staff.assign_role.name === "Teacher"
      );
      console.log(teachingStaff);
      setAllStaff(teachingStaff);
      setLoading(false);
    } catch (err) {
      console.log(err);
      toast.error("Fetching Staffs Failed");
      setLoading(false);
    }
  };
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
    if (name === "teacher") {
      setShow(true);
      getSchedulesForStaff(event.target.value);
    }
  };

  const getSchedulesForStaff = async (id) => {
    const formData = { staff: id };
    const formData1 = {
      staff: id,
      role: "STA",
    };
    try {
      setLoading(true);
      const data = await staffPeriodList(user.school, user._id, formData);
      const data1 = await getPeriodsByDay1(user.school, user._id, formData1);
      console.log("data1", data1);
      console.log(data);
      setPeriods1(data1.data);
      if (data.err) {
        toast.error(data.err);
        setLoading(false);
        return;
      }
      if (data1.err) {
        toast.error(data1.err);
        setLoading(false);
        return;
      }
      setAllPeriods(data.data);
      setLoading(false);
    } catch (error) {
      console.log(error);
      toast.error("Something Went Wrong!");
      setLoading(false);
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
      session: JSON.stringify(defaultSession),
    });
    setWorkingDays(defaultSession.working_days);
  };
  useEffect(() => {
    if(searchData.session === "") return;
    let session = JSON.parse(searchData.session);
    console.log(session);
    setWorkingDays(session.working_days);
  }, [searchData.session]);


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
                  <option value="" disabled>
                    Select Session
                  </option>
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
                  htmlFor="example4cols2Input"
                >
                  Select Teacher
                </label>
                <Input
                  type="select"
                  className="form-control"
                  value={searchData.teacher}
                  onChange={handleChange("teacher")}
                >
                  <option value="" disabled>
                    Select Teacher
                  </option>
                  {allStaff &&
                    allStaff.map((staff) => {
                      return (
                        <option key={staff._id} value={staff._id}>
                          {staff.firstname + " " + staff.lastname}
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
                      {WorkingDaysList.slice(0,workingDays).map((day, index) => {
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
                    {allPeriods.length > 0 &&
                      allPeriods.map((period, i) => {
                        return (
                          <tr key={i}>
                            <th>
                              {period.period_id.start.substring(0, 5) +
                                "-" +
                                period.period_id.end.substring(0, 5)}
                            </th>
                            {WorkingDaysList.slice(0,workingDays).map((day, index) => {
                            
                              return (
                                <td key={index}>
                                  <p>
                                    {periods1[day]?.find(
                                      (d) =>
                                        (d.subject !== null ||
                                          d.subject !== "") &&
                                        (d.subject_id !== null ||
                                          d.subject_id === "") &&
                                        period.period_id.start === d.start &&
                                        period.period_id.end === d.end
                                    )
                                      ? periods1[day]?.find(
                                          (d) =>
                                            (d.subject !== null ||
                                              d.subject !== "") &&
                                            (d.subject_id !== null ||
                                              d.subject_id !== "") &&
                                            period.period_id.start === d.start &&
                                            period.period_id.end === d.end
                                        ).subject
                                      : ""}
                                  </p>
                           
                                  <p>
                                    {periods1[day]?.find(
                                      (d) =>
                                        (d.subject !== null ||
                                          d.subject !== "") &&
                                        (d.subject_id !== null ||
                                          d.subject_id === "") &&
                                        period.period_id.start === d.start &&
                                        period.period_id.end === d.end
                                    )
                                      ? periods1[day]?.find(
                                          (d) =>
                                            (d.subject !== null ||
                                              d.subject !== "") &&
                                            (d.subject_id !== null ||
                                              d.subject_id !== "") &&
                                            period.period_id.start === d.start &&
                                            period.period_id.end === d.end
                                        ).class.name + "-"+ periods1[day]?.find(
                                          (d) =>
                                            (d.subject !== null ||
                                              d.subject !== "") &&
                                            (d.subject_id !== null ||
                                              d.subject_id !== "") &&
                                            period.period_id.start === d.start &&
                                            period.period_id.end === d.end
                                        ).section.name
                                      : ""}
                                  </p>
                                  <p>
                                    {periods1[day]?.find(
                                      (d) =>
                                        (d.subject !== null ||
                                          d.subject !== "") &&
                                        (d.subject_id !== null ||
                                          d.subject_id === "") &&
                                        period.period_id.start === d.start &&
                                        period.period_id.end === d.end
                                    )
                                      ? periods1[day]?.find(
                                          (d) =>
                                            (d.subject !== null ||
                                              d.subject !== "") &&
                                            (d.subject_id !== null ||
                                              d.subject_id !== "") &&
                                            period.period_id.start === d.start &&
                                            period.period_id.end === d.end
                                        ).meet_link
                                      : ""}
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

export default StaffView;
