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
import { SearchOutlined } from "@ant-design/icons";
import SimpleHeader from "components/Headers/SimpleHeader.js";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";
import { allClass } from "api/class";
import { isAuthenticated } from "api/auth";
import { ToastContainer, toast } from "react-toastify";
import { allSessions } from "api/session";
import { allSubjects } from "api/subjects";
import { Popconfirm } from "antd";
import LoadingScreen from "react-loading-screen";
import { getTimeTableForClass, updatePeriod } from "api/Time Table";
import { allStaffs } from "api/staff";
import AntTable from "../tables/AntTable";
const TimeTable1 = () => {
  const { user, token } = isAuthenticated();
  const [classes, setClasses] = useState([]);
  const [sessions, setSessions] = React.useState([]);
  const [classId, setClassId] = useState("");
  const [startDate, setStartDate] = React.useState(new Date());
  const [endDate, setEndDate] = React.useState(new Date());
  const [breakStartTime, setBreakStartTime] = React.useState(new Date());
  const [breakEndTime, setBreakEndTime] = React.useState(new Date());
  const [breakName, setBreakName] = useState("");
  const [classSectionId, setclassSectionId] = useState("");
  const [loading, setLoading] = useState(false);
  const [allStaff, setAllStaff] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [show, setShow] = useState(false);
  const [showBreak, setShowBreak] = useState(false);
  const [selectedClass, setSelectedClass] = useState({});
  const [timetableData, setTimetableData] = useState([]);
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
    getSubjects();
    getAllStaffs();
    // getMappedSchedules();
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
      console.log("staff=>=>=>=>=>=>==>=>=>=>=>", data);
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
      let tableData1 = [];
      data.forEach((schedule, index) => {
        tableData1.push({
          key: index,
          schedule: schedule?.period_id?.start + "-" + schedule?.period_id?.end,
          day: schedule.period_id.day,
        });
      });
      console.log(tableData1);
      setTimetableData(tableData1);
      setLoading(false);
    } catch (err) {
      console.log(err);
      toast.error("Something Went Wrong!");
      setLoading(false);
    }
  }

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
  const filterPassedTime = (time) => {
    const currentDate = new Date(startDate);
    const selectedDate = new Date(time);

    return currentDate.getTime() < selectedDate.getTime();
  };
  const filterBreakTime = (time) => {
    const currentDate = new Date(breakStartTime);
    const selectedDate = new Date(time);

    return currentDate.getTime() < selectedDate.getTime();
  };

  const columns = [
    {
      title: "Schedule",
      dataIndex: "name",
      align: "left",
      sorter: (a, b) => a.schedule > b.schedule,
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm }) => {
        return (
          <>
            <Input
              autoFocus
              placeholder="Type text here"
              value={selectedKeys[0]}
              onChange={(e) => {
                setSelectedKeys(e.target.value ? [e.target.value] : []);
                confirm({ closeDropdown: false });
              }}
              onBlur={() => {
                confirm();
              }}
            ></Input>
          </>
        );
      },
      filterIcon: () => {
        return <SearchOutlined />;
      },
      onFilter: (value, record) => {
        return record.schedule.toLowerCase().includes(value.toLowerCase());
      },
    },
    ...WorkingDaysList.map((day, index) => {
      return {
        title: day,
        dataIndex: day,
        align: "left",
        key: index,
      };
    }),
  ];

  const addPeriodHandler = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.set("class", searchData.class);
      formData.set("section", searchData.section);
      formData.set("start", startDate);
      formData.set("end", endDate);
      // formData.set("day","Monday");
      formData.set("type", "P");
      setLoading(true);
      const data = await updatePeriod(user.school, user._id, formData);
      console.log(data);
      if (data.err) {
        toast.error(data.err);
        return setLoading(false);
      }
      toast.success("Period Added Successfully");
      setLoading(false);
      setChecked(!checked);
    } catch (err) {
      console.log(err);
      toast.error("Something Went Wrong!");
      setLoading(false);
    }
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
              <h2>Add Periods</h2>
            </CardHeader>
            <CardBody>
              <form onSubmit={addPeriodHandler}>
                <Row className="mb-4">
                  <Col>
                    <label
                      className="form-control-label"
                      htmlFor="example4cols2Input"
                    >
                      From
                    </label>
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
                      required
                      filterTime={filterPassedTime}
                    />
                  </Col>
                  <Col>
                    <Button
                      color="primary"
                      type="submit"
                      style={{ marginTop: "2rem" }}
                    >
                      Add Period
                    </Button>
                  </Col>
                  <Col>
                    <Button
                      color="success"
                      style={{ marginTop: "2rem" }}
                      onClick={() => setShowBreak(!showBreak)}
                    >
                      Add Break
                    </Button>
                  </Col>
                </Row>
              </form>
              <form>
                {showBreak && (
                  <Row className="mb-4">
                    <Col>
                      <Label
                        className="form-control-label"
                        htmlFor="example4cols2Input"
                      >
                        Break Name
                      </Label>
                      <Input
                        id="example4cols2Input"
                        placeholder="Name"
                        type="text"
                        onChange={(e) => setBreakName(e.target.value)}
                        value={breakName}
                        required
                      />
                    </Col>
                    <Col>
                      <label
                        className="form-control-label"
                        htmlFor="example4cols2Input"
                      >
                        From
                      </label>
                      <DatePicker
                        id="exampleFormControlSelect3"
                        className="Period-Time"
                        selected={breakStartTime}
                        onChange={(date) => setBreakStartTime(date)}
                        showTimeSelect
                        showTimeSelectOnly
                        timeIntervals={15}
                        timeCaption="Time"
                        dateFormat="h:mm aa"
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
                      <DatePicker
                        id="exampleFormControlSelect3"
                        className="Period-Time"
                        selected={breakEndTime}
                        onChange={(date) => setBreakEndTime(date)}
                        showTimeSelect
                        showTimeSelectOnly
                        timeIntervals={15}
                        timeCaption="Time"
                        dateFormat="h:mm aa"
                        required
                        filterTime={filterBreakTime}
                      />
                    </Col>
                    <Col>
                      <Button
                        color="success"
                        style={{ marginTop: "2rem" }}
                        // onClick={() => setShowBreak(!showBreak)}
                      >
                        Add Break
                      </Button>
                    </Col>
                  </Row>
                )}
              </form>
              <AntTable
                columns={columns}
                data={timetableData}
                pagination={true}
                exportFileName="timetable"
              />
            </CardBody>
          </Card>
        </Container>
      )}
    </>
  );
};

export default TimeTable1;
