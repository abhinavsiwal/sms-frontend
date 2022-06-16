import React from "react";

//import react-strap
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
} from "reactstrap";
import PermissionsGate from "routeGuard/PermissionGate";

//import CSS
import "./TimeTable.css";

//React-select
import Select from "react-select";

// core components
import SimpleHeader from "components/Headers/SimpleHeader.js";

//React Datepicker
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

// import moment Library
import moment from "moment";
import { SCOPES } from "routeGuard/permission-maps";

//import Class Api
import { allClass } from "api/class";
import { updateTimeTable } from "../../../api/Time Table";
import { isAuthenticated } from "api/auth";

//Import ToastContainer
import { ToastContainer, toast } from "react-toastify";
import { allSessions } from "api/session";

import { Popconfirm } from "antd";
import ViewTimeTable from "./ViewTimeTable";

function AddTimeTable(editId) {
  const [timeTableData, setTimeTableData] = React.useState({
    class: null,
    section: null,
    session: null,
    prd: "",
    subjects: "",
    teachers: "",
    selectMode: "",
    link: "",
  });
  const [startDate, setStartDate] = React.useState(new Date());
  const startDuration = moment(startDate).format("LT");
  const [endDate, setEndDate] = React.useState(new Date());
  const endDuration = moment(endDate).format("LT");
  const [startTimeRecises, setStartTimeRecises] = React.useState(new Date());
  const startTime = moment(startTimeRecises).format("LT");
  const [endTimeRecises, setEndTimeRecises] = React.useState(new Date());
  const endTime = moment(endTimeRecises).format("LT");
  const [classess, setClassess] = React.useState([]);
  const [sessions, setSessions] = React.useState([]);
  const [selectMultipleDays, setSelectMultipleDays] = React.useState();
  const [array, setArray] = React.useState([]);
  const [checked, setChecked] = React.useState(false);
  const [editing, setEditing] = React.useState(false);
  const [formData] = React.useState(new FormData());
  const [lecturer, setLectures] = React.useState([]);
  const [lect, setLect] = React.useState({
    Monday: [],
    Tuesday: [],
    Wednesday: [],
    Thursday: [],
    Friday: [],
    Saturday: [],
  });

  React.useEffect(async () => {
    getClass();
    getSession();

    const getLectures = localStorage.getItem("lecture");
    const parsedLectures = JSON.parse(getLectures);
    setLectures(parsedLectures);
  }, [checked]);

  const roleOptions = [
    { value: "Monday", label: "Monday" },
    { value: "Tuesday", label: "Tuesday" },
    { value: "Wednesday", label: "Wednesday" },
    { value: "Thursday", label: "Thursday" },
    { value: "Friday", label: "Friday" },
    { value: "Saturday", label: "Saturday" },
  ];

  const handleChange = (name) => (event) => {
    // formData.set(name, event.target.value);
    setTimeTableData({ ...timeTableData, [name]: event.target.value });
  };

  //Taking Values from react-select
  const handleSubjectChange = (e) => {
    var value = [];
    for (var i = 0, l = e.length; i < l; i++) {
      value.push(e[i].value);
    }
    setSelectMultipleDays(value);
  };

  // const [timePeriod, setTimePeriod] = React.useState([]);

  const getClass = async () => {
    const { user, token } = isAuthenticated();
    const classes = await allClass(user._id, user.school, token);
    if (classes.err) {
      return toast.error("Something Went Wrong!");
    } else {
      setClassess(classes);
    }
  };

  const getSession = async () => {
    const { user, token } = isAuthenticated();
    const session = await allSessions(user._id, user.school, token);
    if (session.err) {
      return toast.error("Something Went Wrong!");
    } else {
      setSessions(session);
    }
  };

  //Onclick Add Data into The Table
  const handleData = async (e) => {
    e.preventDefault();
    const data = [];
    data.push(lect);

    //Create Data Object
    let lectDays = {
      name: timeTableData.prd,
      time: startDuration + " - " + endDuration,
      teacher: timeTableData.teachers,
      subject: timeTableData.subjects,
      type: timeTableData.selectMode,
      lunch: startTime + " - " + endTime,
    };
    if (lectDays.type === "Online") {
      lectDays.link = timeTableData.link;
    }

    //Checking Values
    selectMultipleDays.map((days) => {
      if (days === "Monday") {
        lect.Monday.push(lectDays);
      }
      if (days === "Tuesday") {
        lect.Tuesday.push(lectDays);
      }
      if (days === "Wednesday") {
        lect.Wednesday.push(lectDays);
      }
      if (days === "Thursday") {
        lect.Thursday.push(lectDays);
      }
      if (days === "Friday") {
        lect.Friday.push(lectDays);
      }
      if (days === "Saturday") {
        lect.Saturday.push(lectDays);
      }
      localStorage.setItem("lecture", JSON.stringify(data));
    });
    if (checked === true) {
      setChecked(false);
    } else {
      setChecked(true);
    }

    // if (lectDays.type === "Online") {
    //   lectDays.link = timeTableData.link;
    // }

    // for (let key in selectMultipleDays) {
    //   lectures[selectMultipleDays[key]] = [lectDays];
    // }

    // console.log("lecture", lectures);
    // let arr = array;
    // arr.push(lectures);
    // setArray(arr);
  };

  //Create Table
  const handleSubmitData = async () => {
    const { user, token } = isAuthenticated();
    formData.set("class", timeTableData.class);
    formData.set("section", timeTableData.section);
    formData.set("session", timeTableData.session);
    formData.set("school", user.school);
    formData.set("lecture", JSON.stringify(lecturer));
    // console.log("lectures", JSON.stringify(lecturer));

    try {
      const resp = await updateTimeTable(editId, user._id, token, formData);
      console.log("resp", resp);
      if (resp.err) {
        return toast.error(resp.err);
      }
      toast.success("TimeTable Updated Successfully");
      setEditing(true);
    } catch (err) {
      toast.error("Something Went Wrong!");
    }
  };

  //Delete Data From The Table
  const deleteHandler = () => {
    localStorage.removeItem("lecture");
    if (checked === true) {
      setChecked(false);
    } else {
      setChecked(true);
    }
  };

  return (
    <div>
      {editing ? (
        <>
          <ViewTimeTable />
        </>
      ) : (
        <>
          <SimpleHeader name="Time" parentName="Update TimeTable" />
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

          <PermissionsGate scopes={[SCOPES.canCreate]}>
            <Container className="mt--6 shadow-lg" fluid>
              <Form onSubmit={handleData}>
                <Card>
                  <CardBody>
                    <Row className="m-4">
                      <Col md="4">
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
                          value={timeTableData.class}
                          required
                        >
                          <option value="" disabled selected>
                            Select Class
                          </option>
                          {classess.map((clas) => {
                            return (
                              <option key={clas._id} value={clas._id}>
                                {clas.name}
                              </option>
                            );
                          })}
                        </Input>
                      </Col>
                      <Col md="4">
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
                          value={timeTableData.section}
                          required
                          placeholder="Add Periods"
                        >
                          <option value="" disabled selected>
                            Select Section
                          </option>
                          {classess.map((sections) => {
                            return sections.section.map((sec) => {
                              return (
                                <option value={sec._id} key={sec._id}>
                                  {sec.name}
                                </option>
                              );
                            });
                          })}
                        </Input>
                      </Col>
                      <Col md="4">
                        <Label
                          className="form-control-label"
                          htmlFor="xample-date-input"
                        >
                          Select Session
                        </Label>
                        <Input
                          id="example4cols3Input"
                          type="select"
                          onChange={handleChange("session")}
                          value={timeTableData.session}
                          required
                          placeholder="Add Periods"
                        >
                          <option value="" disabled selected>
                            Select Session
                          </option>
                          {sessions.map((session) => {
                            return (
                              <option value={session._id} key={session._id}>
                                {session.name}
                              </option>
                            );
                          })}
                        </Input>
                      </Col>
                    </Row>

                    {timeTableData.class !== null &&
                      timeTableData.section !== null &&
                      timeTableData.session !== null && (
                        <>
                          <Row className="m-4">
                            <Col md="6">
                              <Label
                                className="form-control-label"
                                htmlFor="xample-date-input"
                              >
                                Select Days
                              </Label>
                              <Select
                                isMulti
                                name="colors"
                                options={roleOptions}
                                onChange={handleSubjectChange}
                                className="basic-multi-select"
                                classNamePrefix="select"
                                required
                              />
                            </Col>
                            <Col md="6">
                              <Label
                                className="form-control-label"
                                htmlFor="xample-date-input"
                              >
                                Add Lecture
                              </Label>
                              <Input
                                id="example4cols3Input"
                                type="text"
                                onChange={handleChange("prd")}
                                value={timeTableData.prd}
                                placeholder="Add Periods"
                                required
                              ></Input>
                            </Col>
                          </Row>
                          <Row className="m-4">
                            <Col md="2">
                              <Label
                                className="form-control-label"
                                htmlFor="xample-date-input"
                              ></Label>
                              <p
                                className="form-control-label"
                                htmlFor="xample-date-input"
                              >
                                Lecture Time
                              </p>
                            </Col>
                            <Col md="2">
                              <Label
                                className="form-control-label"
                                htmlFor="xample-date-input"
                              >
                                From
                              </Label>
                              <DatePicker
                                id="exampleFormControlSelect3"
                                className="Period-Time"
                                selected={startDate}
                                onChange={(date) => setStartDate(date)}
                                showTimeSelect
                                showTimeSelectOnly
                                timeIntervals={15}
                                timeCaption="Time"
                                dateFormat="h:mm aa"
                              />
                            </Col>
                            <Col md="2">
                              <Label
                                className="form-control-label"
                                htmlFor="example-date-input"
                              >
                                To
                              </Label>
                              <DatePicker
                                id="exampleFormControlSelect3"
                                className="Period-Time"
                                selected={endDate}
                                onChange={(date) => setEndDate(date)}
                                showTimeSelect
                                showTimeSelectOnly
                                timeIntervals={15}
                                timeCaption="Time"
                                dateFormat="h:mm aa"
                              />
                            </Col>

                            <Col md="2">
                              <Label
                                className="form-control-label"
                                htmlFor="xample-date-input"
                              ></Label>
                              <p
                                className="form-control-label"
                                htmlFor="xample-date-input"
                              >
                                Recises Time
                              </p>
                            </Col>
                            <Col md="2">
                              <Label
                                className="form-control-label"
                                htmlFor="xample-date-input"
                              >
                                From
                              </Label>
                              <DatePicker
                                id="exampleFormControlSelect3"
                                className="Period-Time"
                                selected={startTimeRecises}
                                onChange={(date) => setStartTimeRecises(date)}
                                showTimeSelect
                                showTimeSelectOnly
                                timeIntervals={15}
                                timeCaption="Time"
                                dateFormat="h:mm aa"
                              />
                            </Col>
                            <Col md="2">
                              <Label
                                className="form-control-label"
                                htmlFor="example-date-input"
                              >
                                To
                              </Label>
                              <DatePicker
                                id="exampleFormControlSelect3"
                                className="Period-Time"
                                selected={endTimeRecises}
                                onChange={(date) => setEndTimeRecises(date)}
                                showTimeSelect
                                showTimeSelectOnly
                                timeIntervals={15}
                                timeCaption="Time"
                                dateFormat="h:mm aa"
                              />
                            </Col>
                          </Row>

                          <Row className="d-flex justify-content-center mb-4 m-4">
                            <Col md="3">
                              <Label
                                className="form-control-label"
                                htmlFor="xample-date-input"
                              >
                                Subjects
                              </Label>
                              <Input
                                id="exampleFormControlSelect3"
                                type="select"
                                onChange={handleChange("subjects")}
                                value={timeTableData.subjects}
                                required
                              >
                                <option value="" disabled selected>
                                  Subjects
                                </option>
                                <option>Physics</option>
                                <option>Chemistry</option>
                                <option>Maths</option>
                                <option>Hindi</option>
                              </Input>
                            </Col>
                            <Col md="3">
                              <Label
                                className="form-control-label"
                                htmlFor="xample-date-input"
                              >
                                Teachers
                              </Label>
                              <Input
                                id="exampleFormControlSelect3"
                                type="select"
                                onChange={handleChange("teachers")}
                                value={timeTableData.teachers}
                                required
                              >
                                <option value="" disabled selected>
                                  Teacher
                                </option>
                                <option>David</option>
                                <option>Sam</option>
                                <option>Mike</option>
                                <option>Jordan</option>
                              </Input>
                            </Col>

                            <Col md="3">
                              <Label
                                className="form-control-label"
                                htmlFor="xample-date-input"
                              >
                                Select Mode
                              </Label>
                              <Input
                                id="exampleFormControlSelect3"
                                type="select"
                                onChange={handleChange("selectMode")}
                                value={timeTableData.selectMode}
                                required
                              >
                                <option value="" disabled selected>
                                  Select Mode
                                </option>
                                <option>Offline</option>
                                <option>Online</option>
                              </Input>
                            </Col>
                            {timeTableData.selectMode === "Online" && (
                              <Col md="3">
                                <Label
                                  className="form-control-label"
                                  htmlFor="xample-date-input"
                                >
                                  Link
                                </Label>
                                <Input
                                  id="exampleFormControlSelect3"
                                  type="text"
                                  onChange={handleChange("link")}
                                  value={timeTableData.link}
                                  placeholder="Enter Link here"
                                  required
                                ></Input>
                              </Col>
                            )}
                          </Row>
                          <Row className="d-flex justify-content-between">
                            <div>
                              <Button color="primary" onClick={handleData}>
                                Add
                              </Button>
                            </div>
                            <div>
                              <Button
                                color="primary"
                                onClick={handleSubmitData}
                              >
                                Submit
                              </Button>
                            </div>
                          </Row>
                        </>
                      )}
                  </CardBody>
                </Card>
              </Form>
            </Container>
          </PermissionsGate>
          <Container className="mt--0 shadow-lg table-responsive" fluid>
            <Card>
              <CardHeader>Time Table</CardHeader>
              <CardBody>
                <Table bordered>
                  <thead>
                    <tr>
                      {lecturer === null ? (
                        <h3>Empty</h3>
                      ) : (
                        <>
                          {lecturer.map((days) => {
                            return Object.keys(days).map((day) => {
                              return (
                                <>
                                  <th>{day}</th>
                                </>
                              );
                            });
                          })}
                        </>
                      )}
                      <th>Action</th>
                    </tr>
                  </thead>
                  {/* {JSON.stringify(lecturer)} */}
                  <>
                    {lecturer &&
                      lecturer.map((arr, index) => {
                        return (
                          <tbody>
                            <tr>
                              <td>
                                <>
                                  {lecturer &&
                                    arr.Monday &&
                                    arr.Monday.map((Monday) => {
                                      return (
                                        <h3>
                                          Name:{Monday.name}
                                          <br /> Time:{Monday.time}
                                          <br /> Subject:{Monday.subject}
                                          <br /> Mode: {Monday.type}
                                          <br /> Teacher: {Monday.teacher}
                                          <br /> Lunch: {Monday.lunch}
                                          {Monday.link &&
                                            arr.Monday.map((link) => {
                                              return (
                                                <>
                                                  <br /> Link:{link.link}
                                                </>
                                              );
                                            })}
                                          <hr />
                                        </h3>
                                      );
                                    })}
                                </>
                              </td>

                              <td>
                                <>
                                  {lecturer &&
                                    arr.Tuesday &&
                                    arr.Tuesday.map((Monday) => {
                                      return (
                                        <h3>
                                          Name:{Monday.name}
                                          <br /> Time:{Monday.time}
                                          <br /> Subject:{Monday.subject}
                                          <br /> Mode: {Monday.type}
                                          <br /> Teacher: {Monday.teacher}
                                          <br /> Lunch: {Monday.lunch}
                                          {Monday.link &&
                                            arr.Monday.map((link) => {
                                              return (
                                                <>
                                                  <br /> Link:{link.link}
                                                </>
                                              );
                                            })}
                                          <hr />
                                        </h3>
                                      );
                                    })}
                                </>
                              </td>
                              <td>
                                <>
                                  {lecturer &&
                                    arr.Wednesday &&
                                    arr.Wednesday.map((Monday) => {
                                      return (
                                        <h3>
                                          Name:{Monday.name}
                                          <br /> Time:{Monday.time}
                                          <br /> Subject:{Monday.subject}
                                          <br /> Mode: {Monday.type}
                                          <br /> Teacher: {Monday.teacher}
                                          <br /> Lunch: {Monday.lunch}
                                          {Monday.link &&
                                            arr.Monday.map((link) => {
                                              return (
                                                <>
                                                  <br /> Link:{link.link}
                                                </>
                                              );
                                            })}
                                          <hr />
                                        </h3>
                                      );
                                    })}
                                </>
                              </td>
                              <td>
                                <>
                                  {lecturer &&
                                    arr.Thursday &&
                                    arr.Thursday.map((Monday) => {
                                      return (
                                        <h3>
                                          Name:{Monday.name}
                                          <br /> Time:{Monday.time}
                                          <br /> Subject:{Monday.subject}
                                          <br /> Mode: {Monday.type}
                                          <br /> Teacher: {Monday.teacher}
                                          <br /> Lunch: {Monday.lunch}
                                          {Monday.link &&
                                            arr.Monday.map((link) => {
                                              return (
                                                <>
                                                  <br /> Link:{link.link}
                                                </>
                                              );
                                            })}
                                          <hr />
                                        </h3>
                                      );
                                    })}
                                </>
                              </td>
                              <td>
                                <>
                                  {lecturer &&
                                    arr.Friday &&
                                    arr.Friday.map((Monday) => {
                                      return (
                                        <h3>
                                          Name:{Monday.name}
                                          <br /> Time:{Monday.time}
                                          <br /> Subject:{Monday.subject}
                                          <br /> Mode: {Monday.type}
                                          <br /> Teacher: {Monday.teacher}
                                          <hr />
                                          <br /> Lunch: {Monday.lunch}
                                          {Monday.link &&
                                            arr.Monday.map((link) => {
                                              return (
                                                <>
                                                  <br /> Link:{link.link}
                                                </>
                                              );
                                            })}
                                        </h3>
                                      );
                                    })}
                                </>
                              </td>
                              <td>
                                <>
                                  {lecturer &&
                                    arr.Friday &&
                                    arr.Saturday.map((Monday) => {
                                      return (
                                        <h3>
                                          Name:{Monday.name}
                                          <br /> Time:{Monday.time}
                                          <br /> Subject:{Monday.subject}
                                          <br /> Mode: {Monday.type}
                                          <br /> Teacher: {Monday.teacher}
                                          <br /> Lunch: {Monday.lunch}
                                          {Monday.link &&
                                            arr.Monday.map((link) => {
                                              return (
                                                <>
                                                  <br /> Link:{link.link}
                                                </>
                                              );
                                            })}
                                          <hr />
                                        </h3>
                                      );
                                    })}
                                </>
                              </td>
                              <td>
                                <Button
                                  className="btn-sm pull-right"
                                  color="danger"
                                  type="button"
                                >
                                  <Popconfirm
                                    title="Sure to delete?"
                                    onConfirm={() => deleteHandler(index)}
                                  >
                                    <i className="fas fa-trash" />
                                  </Popconfirm>
                                </Button>
                              </td>
                            </tr>
                          </tbody>
                        );
                      })}
                  </>
                </Table>
              </CardBody>
            </Card>
          </Container>
        </>
      )}
    </div>
  );
}

export default AddTimeTable;
