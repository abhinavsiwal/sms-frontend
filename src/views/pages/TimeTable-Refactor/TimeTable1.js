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
import SimpleHeader from "components/Headers/SimpleHeader.js";
import DataTable from "react-data-table-component";
import TimePicker from "rc-time-picker";
import "rc-time-picker/assets/index.css";
import moment from "moment";
import { allClass } from "api/class";
import { isAuthenticated } from "api/auth";
import { ToastContainer, toast } from "react-toastify";
import { allSessions } from "api/session";
import { allStaffs } from "api/staff";
import { allSubjects } from "api/subjects";
import { Popconfirm } from "antd";
import LoadingScreen from "react-loading-screen";
import { getTimeTableForClass } from "api/Time Table";
import { allStaffs } from "api/staff";

const TimeTable1 = () => {
  let timeFormat = "HH:mm";
  const { user, token } = isAuthenticated();
  let timeFormat2 = "HH:mm A";
  const [classes, setClasses] = useState([]);
  const [sessions, setSessions] = React.useState([]);
  const [classId, setClassId] = useState("");
  const [classSectionId, setclassSectionId] = useState("");
  const [loading, setLoading] = useState(false);
  const [allStaff, setAllStaff] = useState([]);
  const [schedules, setSchedules] = useState(null);
  const [newSchedule, setNewSchedule] = useState({
    fromTime: moment().format(timeFormat),
    toTime: moment().format(timeFormat),
    errMessage: "",
  });

  const [showBreak, setShowBreak] = useState(false);
  const [teachers, setTeachers] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [admin, setAdmin] = useState(false);
  const [show, setShow] = useState(false);
  const [breaks, setBreaks] = useState({
    fromTime: moment().format(timeFormat),
    toTime: moment().format(timeFormat),
    breakName: "",
    errMessage: "",
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
  let usedSlots = [];
  const [timeTableData, setTimeTableData] = React.useState({
    class: "",
    section: "",
    session: "",
  });
  const [selectedClass, setSelectedClass] = useState({});

  useEffect(() => {
    getClass();
    getSession();
    getSubjects();
    getAllStaffs();
    // getMappedSchedules();
  }, [checked]);

  //Getting Class data
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
  //Getting Subject data
  const getSubjects = async () => {
    const { user, token } = isAuthenticated();
    try {
      const subject = await allSubjects(user._id, user.school, token);
      console.log("subject", subject);
      if (subject.err) {
        return toast.error(subject.err);
      } else {
        setSubjects(subject);
      }
    } catch (err) {
      toast.error("Something Went Wrong!");
    }
  };
// Get All staff data
const getAllStaffs = async () => {
    try {
      setLoading(true);
      const { data } = await allStaffs(user.school, user._id);
      console.log(data);
      //   let canteenStaff = data.find((staff) => staff.assign_role === "library");
      setAllStaff(data);
      setLoading(false);
    } catch (err) {
      console.log(err);
      toast.error("Fetching Staffs Failed");
      setLoading(false);
    }
  };
  const handleChange = (name) => (event) => {
    setTimeTableData({ ...timeTableData, [name]: event.target.value });
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
      setAdmin(true);
      setShow(true);
      getSchedulesForClass();
    }
  };

  async function getSchedulesForClass() {
    const formData = new FormData();
    formData.set("class", "628515691e4eb6ec425d2ca9");
    formData.set("section", "628516d11e4eb6ec425d2d44");
    try {
      setLoading(true);
      const data = await getTimeTableForClass(user.school, user._id, formData);
      console.log(data);
      if (data.err) {
        toast.error(data.err);
        return setLoading(false);
      }
      setLoading(false);
    } catch (err) {
      console.log(err);
      toast.error("Something Went Wrong!");
      setLoading(false);
    }
  }
  function getMoment(time) {
    return moment(new Date().toDateString() + " " + time);
  }

  const getTimetableColumnList = (plainText = false) => {
    const columns = [
      {
        name: "Schedule",
        cell: (schedule) =>
          getMoment(schedule.fromTime).format(timeFormat2) +
          " - " +
          getMoment(schedule.toTime).format(timeFormat2),
      },
      ...WorkingDaysList.map((day) => {
        return {
          name: day,
          width: "200px",
          center: true,
          cell: (allSchedules) => {
            const schedule = allSchedules[day];
            if (typeof schedule === "string") {
              return <div className="text-success">{schedule}</div>;
            }
            if (!admin || plainText) {
              return (
                <div className="d-flex flex-column">
                  <div className="font-weight-bold">{schedule.subject}</div>
                  <div>
                    {/* {teachers &&
                    teachers.filter(
                      (teacher) =>
                        Number(teacher.id) === Number(schedule.staffId)
                    )[0]
                      ? " - " +
                        teachers.filter(
                          (teacher) =>
                            Number(teacher.id) === Number(schedule.staffId)
                        )[0].name
                      : null} */}
                    {schedule.staff.firstname + " " + schedule.staff.lastname}
                  </div>
                </div>
              );
            }
            return (
              <div className="d-flex flex-column">
                <select
                  className="custom-select"
                  value={schedule.subject_id}
                  //   onChange={(event) =>
                  //     handleInputChange(
                  //       event,
                  //       `schedules.${schedule.index}.subject`
                  //     )
                  //   }
                >
                  <option value="" disabled={true} selected={true}>
                    Subject
                  </option>
                  {subjects.map((subject) => {
                    if (subjects.indexOf(subject) === -1) {
                      return null;
                    }
                    return <option value={subject._id}>{subject.name}</option>;
                  })}
                </select>

              </div>
            );
          },
        };
      }),
    ];
  };

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
              <Col md="6">
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
                  {classes.map((clas) => {
                    return (
                      <option key={clas._id} value={clas._id}>
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
              <h2>Add Periods</h2>
            </CardHeader>
            <CardBody>
              <form className="col-12">
                {admin && (
                  <>
                    <Row>
                      <div className="col-12 row">
                        <label className="font-weight-bold col-2">
                          <i className="fa fa-plus" />
                          &nbsp;Add Period
                        </label>
                        <div className="">
                          <TimePicker
                            value={getMoment(newSchedule.fromTime)}
                            use12Hours={true}
                            showSecond={false}
                            allowEmpty={false}
                            // onChange={(event) => {
                            //   setNewSchedule({
                            //     ...newSchedule,
                            //     errMessage: "",
                            //     fromTime: event.format(timeFormat),
                            //     toTime:
                            //       newSchedule.toTime.localeCompare(
                            //         event.format(timeFormat)
                            //       ) > -1
                            //         ? newSchedule.toTime
                            //         : event.format(timeFormat),
                            //   });
                            // }}
                          />
                        </div>
                        <div className="col-auto text-center">to</div>
                        <div className="col-auto">
                          <TimePicker
                            value={getMoment(newSchedule.toTime)}
                            use12Hours={true}
                            showSecond={false}
                            allowEmpty={false}
                            // onChange={(event) => {
                            //   setNewSchedule({
                            //     ...newSchedule,
                            //     errMessage: "",
                            //     toTime:
                            //       event
                            //         .format(timeFormat)
                            //         .localeCompare(newSchedule.fromTime) > -1
                            //         ? event.format(timeFormat)
                            //         : newSchedule.fromTime,
                            //   });
                            // }}
                          />
                        </div>
                        <div className="col-auto">
                          <button
                            type="button"
                            className="btn btn-primary"
                            // onClick={addPeriod}
                          >
                            <i className="fa fa-plus" />
                            &nbsp;Add Period
                          </button>
                        </div>
                        <div className="col-auto">
                          <button
                            type="button"
                            className="btn btn-primary"
                            onClick={() => {
                              setShowBreak(true);
                            }}
                          >
                            <i className="fa fa-plus" />
                            &nbsp;Create-Break
                          </button>
                        </div>
                        <div className="col-auto">
                          <button
                            type="button"
                            className="btn btn-primary"
                            // onClick={addPeriod}
                          >
                            <i className="fa fa-plus" />
                            &nbsp;Online Class
                          </button>
                        </div>
                      </div>
                    </Row>
                    {showBreak && (
                      <div className=" row mt-2">
                        <div className="col-auto">
                          <label className="font-weight-bold">Break Name</label>
                          <Input placeholder="name" type="text" />
                        </div>
                        <div
                          className="col-auto d-flex  flex-col"
                          style={{ display: "flex", flexDirection: "column" }}
                        >
                          <label className="font-weight-bold">From</label>
                          <TimePicker
                            value={getMoment(breaks.fromTime)}
                            use12Hours={true}
                            showSecond={false}
                            allowEmpty={false}
                            disabled={!admin}
                            // onChange={(event) => {
                            //   handleInputChange(
                            //     {
                            //       target: { value: event.format(timeFormat) },
                            //     },
                            //     "recess.fromTime"
                            //   );

                            //   setRecess({
                            //     ...recess,
                            //     toTime:
                            //       recess.toTime.localeCompare(
                            //         event.format(timeFormat)
                            //       ) > -1
                            //         ? recess.toTime
                            //         : event.format(timeFormat),
                            //   });
                            // }}
                          />
                        </div>

                        <div
                          className="col-auto"
                          style={{ display: "flex", flexDirection: "column" }}
                        >
                          <label className="font-weight-bold">To</label>
                          <TimePicker
                            value={getMoment(breaks.toTime)}
                            use12Hours={true}
                            showSecond={false}
                            allowEmpty={false}
                            disabled={!admin}
                            // onChange={(event) =>
                            //   handleInputChange(
                            //     {
                            //       target: {
                            //         value:
                            //           event
                            //             .format(timeFormat)
                            //             .localeCompare(recess.fromTime) > -1
                            //             ? event.format(timeFormat)
                            //             : recess.fromTime,
                            //       },
                            //     },
                            //     "recess.toTime"
                            //   )
                            // }
                          />
                        </div>
                        <div className="col-auto mt-4">
                          <Button
                            type="button"
                            size="sm"
                            color="primary"
                            className="btn btn-primary"
                          >
                            <i className="fa fa-plus" />
                            &nbsp;Create
                          </Button>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </form>
            </CardBody>
          </Card>
        </Container>
      )}
    </>
  );
};

export default TimeTable1;
