import React, { useState, useEffect, useRef } from "react";
import FullCalendar from "@fullcalendar/react"; // must go before plugins
import dayGridPlugin from "@fullcalendar/daygrid";
import classnames from "classnames";
import { allSessions } from "api/session";
import timeGridPlugin from "@fullcalendar/timegrid";
import addDays from "date-fns/addDays";
import interactionPlugin from "@fullcalendar/interaction";
import ReactBSAlert from "react-bootstrap-sweetalert";
import {
  Button,
  ButtonGroup,
  Card,
  CardHeader,
  CardBody,
  FormGroup,
  Form,
  Input,
  Modal,
  Container,
  Row,
  Col,
  Breadcrumb,
  BreadcrumbItem,
  Label,
  ModalBody,
} from "reactstrap";
import { ToastContainer, toast } from "react-toastify";
import Loader from "components/Loader/Loader";
//React Datepicker
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { isAuthenticated } from "api/auth";
//Addevent and getEvent functions
import {
  addCalender,
  getCalender,
  updateEvent,
  deleteEvents,
} from "api/calender";
import "./Calendar.css";
import moment from "moment";
import { Table } from "ant-table-extensions";
import { SearchOutlined } from "@ant-design/icons";
import { updateCalendarError } from "constants/errors";
import { deleteCalendarError, fetchingStaffFailed } from "constants/errors";

import { allStaffs } from "api/staff";

const Calendar = () => {
  const { user, token } = isAuthenticated();
  const [events, setEvents] = React.useState([]);
  const [alert, setAlert] = React.useState(null);
  const [modalAdd, setModalAdd] = React.useState(false);
  const [modalChange, setModalChange] = React.useState(false);
  const [startDate, setStartDate] = React.useState(new Date());
  const [endDate, setEndDate] = React.useState();
  const [radios, setRadios] = React.useState(null);
  const [eventId, setEventId] = React.useState(null);
  const [eventTitle, setEventTitle] = React.useState(null);
  const [eventDescription, setEventDescription] = React.useState(null);
  const [description, setDescription] = React.useState(null);
  const [assignTeachers, setAssignTeachers] = React.useState(null);
  // eslint-disable-next-line
  const [event, setEvent] = React.useState(null);
  const [currentDate, setCurrentDate] = React.useState(null);
  const calendarRef = React.useRef(null);
  const [checked, setChecked] = React.useState(false);
  const [sessions, setSessions] = useState([]);
  const [editing, setEditing] = React.useState(false);
  const [eventList, setEventList] = React.useState([]);
  const [selectSessionId, setSelectSessionId] = useState("");
  const [staff, setStaff] = useState([]);
  const [sessionID, setSessionID] = useState("");
  const [staffId, setStaffId] = useState("");
  const [filterSessionId, setFilterSessionId] = useState("");
  const [permissions, setPermissions] = useState([]);
  const [eventDetails, setEventDetails] = useState({});
  const [viewModal, setViewModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [addLoading, setAddLoading] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [assignTeacherName, setAssignTeacherName] = useState(null);
  const [eventsList, setEventsList] = useState([]);
  const [calendarView, setCalendarView] = useState("dayGridMonth");
  let permission1 = [];
  useEffect(() => {
    // console.log(user);
    if (user.permissions["School Calendar"]) {
      permission1 = user.permissions["School Calendar"];
      setPermissions(permission1);
      // console.log(permissions);
    }
  }, [calendarView]);

  useEffect(() => {
    getAllStaff();
    getSession();
  }, []);

  useEffect(() => {
    const { current: calendarDom } = calendarRef;
    const API = calendarDom ? calendarDom.getApi() : null;
    API && API.changeView(calendarView);
  }, [calendarView]);

  const getAllStaff = async () => {
    try {
      console.log(user.school, user._id, "allStaff");
      const { data } = await allStaffs(user.school, user._id);
      if (data.err) {
        return toast.error(data.err);
      }
      // console.log(data, "@@@@@@@@");
      setStaff(data);
    } catch (err) {
      toast.error(fetchingStaffFailed);
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
  const handleSubmitEvent = async () => {
    var formData = new FormData();
    formData.set("name", eventTitle);
    formData.set("event_from", new Date(startDate));
    formData.set("event_to", new Date(endDate));
    formData.set("description", description);
    // formData.set("assignTeachers", assignTeachers)
    formData.set("event_type", radios);
    formData.set("school", user.school);
    formData.set("assignTeachers", assignTeachers);
    formData.set("session", sessionID);

    // console.log("str", new Date(startDate));
    // console.log("end", new Date(endDate));
    try {
      setAddLoading(true);
      await addCalender(user._id, token, formData);
      setModalAdd(false);
      toast.success("Event addedd successfully");
      setChecked(!checked);
      setAddLoading(false);
    } catch (err) {
      toast.error(err);
      setAddLoading(false);
    }
    setEvents(undefined);
    setStartDate(undefined);
    setEndDate(undefined);
    setRadios("bg-info");
    setEventTitle(undefined);
  };

  //Get Events
  useEffect(() => {
    getEvents();
  }, [checked]);
  const getEvents = async () => {
    const { user, token } = isAuthenticated();
    setLoading(true);
    const events1 = await getCalender(user._id, user.school, token);
    console.log("----------->", events1);
    setEvents(events1);
    let event = [];
    events1.map((events) => {
      event.push({
        title: events.name,
        start: events.event_from,
        end: events.event_to,
        className: events.event_type,
        description: events.description,
        id: events._id,
        assignTeacher: events.assignTeachers && events.assignTeachers._id,
        assignTeacherName:
          events.assignTeachers &&
          events.assignTeachers.firstname +
            " " +
            events.assignTeachers.lastname,
      });
    });
    console.log(event);
    setEventsList(event);
    //Ant Table Data Source
    const data = [];
    events1.map((events, index) => {
      data.push({
        key: events._id,
        event_name: events.name,
        start_date: events.event_from.split("T")[0],
        end_date: events.event_to.split("T")[0],
        action: (
          <h5 key={index + 1} className="mb-0">
            <Button
              className="btn-sm pull-right"
              color="primary"
              type="button"
              key={"view" + index + 1}
              onClick={() => {
                setViewModal(true);
                // console.log(events);
                setEventDetails(events);
              }}
            >
              {/* <i className="fas fa-user" /> */}
              View More{" "}
            </Button>
          </h5>
        ),
      });
    });
    setEventList(data);
    setChecked(false);
    setLoading(false);
  };

  //Edit Events
  const changeEvent = async () => {
    const { user, token } = isAuthenticated();
    var formData = new FormData();
    formData.set("name", eventTitle);
    formData.set("event_from", new Date(startDate));
    formData.set("event_to", new Date(endDate));
    formData.set("description", description);
    formData.set("assignTeachers", assignTeachers);
    formData.set("event_type", radios);
    formData.set("school", user.school);
    // sessions.map((data) => {
    //   if (data.status === "current") {
    //     formData.set("session", data._id);
    //   }
    // });

    try {
      setEditLoading(true);
      const updateEvents = await updateEvent(
        user._id,
        eventId,
        token,
        formData
      );
      setEvents(updateEvents);
      setChecked(true);
      setEditLoading(false);
    } catch (err) {
      setEditLoading(false);
      toast.error(updateCalendarError);
    }
    setModalChange(false);
    setRadios("bg-info");
    setEventTitle(undefined);
    setEventDescription(undefined);
    setEventId(undefined);
    setEvent(undefined);
  };

  //Delete Events Confirm Box
  const deleteEventSweetAlert = () => {
    setAlert(
      <ReactBSAlert
        warning
        style={{ display: "block", marginTop: "-100px" }}
        title="Are you sure?"
        onConfirm={() => {
          setAlert(false);
          setRadios("bg-info");
          setEventTitle(undefined);
          setEventDescription(undefined);
          setEventId(undefined);
        }}
        onCancel={() => deleteEvent()}
        confirmBtnCssClass="btn-secondary"
        cancelBtnBsStyle="danger"
        confirmBtnText="Cancel"
        cancelBtnText="Yes, delete it"
        showCancel
        btnSize=""
      >
        You won't be able to revert this!
      </ReactBSAlert>
    );
  };

  //Delete Events
  const deleteEvent = async () => {
    try {
      const { user, token } = isAuthenticated();
      const deleEvents = await deleteEvents(eventId, user._id, token);
      setEvent(undefined);
      toast.success("Event Deleted Successfully");
      setEvents(deleEvents);
      setChecked(true);
    } catch (err) {
      toast.error(deleteCalendarError);
    }
    setModalChange(false);
    setRadios("bg-info");
    setEventTitle(undefined);
    setEventDescription(undefined);
    setEventId(undefined);
    setEvent(undefined);
  };
  useEffect(() => {
    if (events.length > 0) {
      filterEvents();
    }
  }, [filterSessionId]);

  const filterEvents = async () => {
    let filteredEvents = await events.filter(
      (event) => event.session.toString() === filterSessionId.toString()
    );
    const data = [];
    filteredEvents.map((events, index) => {
      data.push({
        key: events._id,
        event_name: events.name,
        start_date: events.event_from.split("T")[0],
        end_date: events.event_to.split("T")[0],
        action: (
          <h5 key={index + 1} className="mb-0">
            <Button
              className="btn-sm pull-right"
              color="success"
              type="button"
              key={"view" + index + 1}
              // onClick={() => handleStaffDetails(data[i])}
            >
              <i className="fas fa-user" />
              View More{" "}
            </Button>
          </h5>
        ),
      });
    });
    setEventList(data);
    setChecked(false);
  };

  //Ant Table Column
  const columns = [
    {
      title: "Event Name",
      dataIndex: "event_name",
      width: 150,
      align: "center",
      sorter: (a, b) => a.event_name > b.event_name,
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
        return record.event_name.toLowerCase().includes(value.toLowerCase());
      },
    },
    {
      title: "Start Date",
      dataIndex: "start_date",
      width: 150,
      align: "center",
      sorter: (a, b) => a.start_date > b.start_date,
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
        return record.start_date.toLowerCase().includes(value.toLowerCase());
      },
    },
    {
      title: "End Date",
      dataIndex: "end_date",
      width: 150,
      align: "center",
      sorter: (a, b) => a.end_date > b.end_date,
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
        return record.end_date.toLowerCase().includes(value.toLowerCase());
      },
    },
    {
      title: "Action",
      key: "action",
      align: "center",
      dataIndex: "action",
      fixed: "right",
    },
  ];
  const changeView = (newView) => {
    console.log(newView);
    setCalendarView(newView);
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
    setSessionID(defaultSession._id);
  };

  return (
    <>
      <ToastContainer
        position="bottom-right"
        autoClose={1000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
      <div className="header header-dark bg-info pb-6 content__title content__title--calendar">
        <Container fluid>
          <div className="header-body">
            <Row className="align-items-center py-4">
              <Col lg="6">
                {/* <h6 className="fullcalendar-title h2 text-white d-inline-block mb-0 mr-1">
                  {currentDate}
                </h6> */}
                <Breadcrumb
                  className="d-none d-md-inline-block ml-lg-4"
                  listClassName="breadcrumb-links breadcrumb-dark"
                >
                  <BreadcrumbItem>
                    <a href="#pablo" onClick={(e) => e.preventDefault()}>
                      <i className="fas fa-home" />
                    </a>
                  </BreadcrumbItem>
                  <BreadcrumbItem>
                    <a href="#pablo" onClick={(e) => e.preventDefault()}>
                      Dashboard
                    </a>
                  </BreadcrumbItem>
                  <BreadcrumbItem aria-current="page" className="active">
                    Calendar
                  </BreadcrumbItem>
                </Breadcrumb>
              </Col>
              <Col className="mt-3 mt-md-0 text-md-right" lg="6">
                <Button
                  className="btn-neutral"
                  color="default"
                  onClick={() => setEditing(true)}
                  size="sm"
                >
                  View Events
                </Button>
                {/* <Button
                  className="fullcalendar-btn-prev btn-neutral"
                  color="default"
                  onClick={() => {
                    calendar.prev();
                    
                  }}
                  size="sm"
                >
                  <i className="fas fa-angle-left" />
                </Button>
                <Button
                  className="fullcalendar-btn-next btn-neutral"
                  color="default"
                  onClick={() => {
                    calendar.next();
                  }}
                  size="sm"
                >
                  <i className="fas fa-angle-right" />
                </Button> */}

                <Button
                  className="btn-neutral"
                  color="default"
                  data-calendar-view="basicMonth"
                  onClick={() => changeView("dayGridMonth")}
                  size="sm"
                >
                  Month
                </Button>
                <Button
                  className="btn-neutral"
                  color="default"
                  data-calendar-view="basicWeek"
                  onClick={() => changeView("dayGridWeek")}
                  size="sm"
                >
                  Week
                </Button>
                <Button
                  className="btn-neutral"
                  color="default"
                  data-calendar-view="basicDay"
                  onClick={() => changeView("dayGridDay")}
                  size="sm"
                >
                  Day
                </Button>
              </Col>
            </Row>
          </div>
        </Container>
      </div>
      <Container className="mt--6 w-100" fluid>
        <Row>
          <div className="col">
            <Card className="card-calendar w-100">
              <CardBody className="p-0">
                <FullCalendar
                  height="80vh"
                  plugins={[dayGridPlugin, interactionPlugin, timeGridPlugin]}
                  initialView={calendarView}
                  selectable={true}
                  ref={calendarRef}
                  headerToolbar={{
                    left: "title",
                  }}
                  dateClick={(info) => {
                    if (permissions && !permissions.includes("add")) {
                      return;
                    }
                    console.log("info", info);
                    let date = new Date();
                    let yesterday = new Date(
                      date.getTime() - 24 * 60 * 60 * 1000
                    );

                    console.log(
                      new Date(info.date).getTime() < yesterday.getTime()
                    );
                    if (new Date(info.date).getTime() < yesterday.getTime()) {
                      console.log("here");
                      return;
                    }
                    setModalAdd(true);
                    // setStartDate(
                    //   new Date(info.start).toISOString().split("T")[0]
                    // );
                    setStartDate(info.date);
                    setEndDate(info.date);
                    setRadios("bg-info");
                  }}
                  eventClick={({ event }) => {
                    if (permissions && !permissions.includes("edit")) {
                      return;
                    }
                    console.log("event", event);
                    setEventId(event.id);
                    setEventTitle(event.title);
                    setDescription(event._def.extendedProps.description);
                    setRadios(event.classNames[0]);
                    setStartDate(event.start);
                    setEndDate(event.end);
                    setEvent(event);
                    setAssignTeachers(event._def.extendedProps.assignTeacher);
                    setAssignTeacherName(
                      event._def.extendedProps.assignTeacherName
                    );
                    setModalChange(true);
                  }}
                  events={eventsList}
                />
              </CardBody>
            </Card>
            {/* {permissions && permissions.includes("add".trim()) && (
          
             )} */}
            <Modal
              isOpen={modalAdd}
              toggle={() => setModalAdd(false)}
              className="modal-dialog-centered modal-secondary"
            >
              {addLoading ? (
                <Loader />
              ) : (
                <>
                  <div className="modal-body">
                    <form className="new-event--form">
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
                            onChange={(e) => setSessionID(e.target.value)}
                            value={sessionID}
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
                      <Row className="mt-2">
                        <Col>
                          <label className="form-control-label">
                            Event title
                          </label>
                          <Input
                            className="form-control-alternative new-event--title"
                            placeholder="Event Title"
                            type="text"
                            onChange={(e) => setEventTitle(e.target.value)}
                            required
                          />
                        </Col>
                      </Row>
                      <Row className="mt-2">
                        <Col>
                          <Label
                            className="form-control-label"
                            htmlFor="example-date-input"
                          >
                            From
                          </Label>
                          <DatePicker
                            className="datePicker"
                            showTimeSelect
                            dateFormat="yyyy MMMM, dd h:mm aa"
                            selected={startDate}
                            selectsStart
                            startDate={startDate}
                            minDate={new Date()}
                            onChange={(date) => setStartDate(date)}
                            strictParsing
                            value={startDate}
                            required
                            placeholderText="dd-mm-yyyy"
                            // filterDate={disableSunday}

                            // excludeDates={addDays(new Date(),6)}
                          />
                        </Col>
                      </Row>
                      <Row className="mt-2">
                        <Col>
                          <Label
                            className="form-control-label"
                            htmlFor="example-date-input"
                          >
                            To
                          </Label>
                          <DatePicker
                            className="datePicker"
                            showTimeSelect
                            dateFormat="yyyy MMMM, dd h:mm aa"
                            selected={endDate}
                            selectsStart
                            minDate={new Date(startDate)}
                            startDate={startDate}
                            onChange={(date) => setEndDate(date)}
                            strictParsing
                            value={endDate}
                            required
                            placeholderText="dd-mm-yyyy"
                          />
                        </Col>
                      </Row>
                      <Row className="mt-2">
                        <Col>
                          <Label
                            className="form-control-label"
                            htmlFor="example-date-input"
                          >
                            Teacher
                          </Label>
                          <Input
                            type="select"
                            onChange={(e) => setAssignTeachers(e.target.value)}
                          >
                            <option value={""}>{"Select Staff"}</option>
                            {staff &&
                              staff.map((staff, i) => (
                                <option key={i} value={staff._id}>
                                  {staff.firstname} {staff.lastname}
                                </option>
                              ))}
                          </Input>
                        </Col>
                      </Row>
                      <Row className="mt-2">
                        <Col>
                          <Label
                            className="form-control-label"
                            htmlFor="example-date-input"
                          >
                            Description
                          </Label>
                          <Input
                            className="form-control-alternative new-event--title w-100 descrip"
                            placeholder="Description"
                            type="textarea"
                            onChange={(e) => setDescription(e.target.value)}
                            required
                          />
                        </Col>
                      </Row>
                      <Row>
                        <Col>
                          <label className="form-control-label d-block mb-3 mt-2">
                            Status color
                          </label>
                          <ButtonGroup
                            className="btn-group-toggle btn-group-colors event-tag"
                            data-toggle="buttons"
                          >
                            <Button
                              className={classnames("bg-info", {
                                active: radios === "bg-info",
                              })}
                              color=""
                              id="bg-info"
                              type="button"
                              onClick={() => setRadios("bg-info")}
                              value="bg-info"
                            />
                            <Button
                              className={classnames("bg-warning", {
                                active: radios === "bg-warning",
                              })}
                              color=""
                              id="bg-warning"
                              type="button"
                              onClick={() => setRadios("bg-warning")}
                              value="bg-warning"
                            />
                            <Button
                              className={classnames("bg-danger", {
                                active: radios === "bg-danger",
                              })}
                              color=""
                              id="bg-danger"
                              type="button"
                              onClick={() => setRadios("bg-danger")}
                              value="bg-danger"
                            />
                          </ButtonGroup>
                        </Col>
                      </Row>
                    </form>
                  </div>
                  <div className="modal-footer">
                    <Button
                      className="new-event--add"
                      color="primary"
                      type="button"
                      onClick={handleSubmitEvent}
                    >
                      Add event
                    </Button>
                    <Button
                      className="ml-auto"
                      color="link"
                      type="button"
                      onClick={() => setModalAdd(false)}
                    >
                      Close
                    </Button>
                  </div>
                </>
              )}
            </Modal>
            {/* {permissions && permissions.includes("edit") && (
          
            )} */}
            <Modal
              isOpen={modalChange}
              toggle={() => setModalChange(false)}
              className="modal-dialog-centered modal-secondary"
            >
              {editLoading ? (
                <Loader />
              ) : (
                <>
                  <div className="modal-body">
                    <Form className="edit-event--form">
                      <Row>
                        <Col>
                          <label className="form-control-label">
                            Event title
                          </label>
                          <Input
                            className="form-control-alternative edit-event--title"
                            placeholder="Event Title"
                            type="text"
                            defaultValue={eventTitle}
                            onChange={(e) => setEventTitle(e.target.value)}
                            required
                          />
                        </Col>
                      </Row>
                      <Row>
                        <Col md="12">
                          <Label
                            className="form-control-label"
                            htmlFor="example-date-input"
                          >
                            From
                          </Label>
                          <DatePicker
                            className="datePicker"
                            showTimeSelect
                            dateFormat="yyyy MMMM, dd h:mm aa"
                            selected={startDate}
                            selectsStart
                            startDate={startDate}
                            onChange={(date) => setStartDate(date)}
                            minDate={new Date()}
                            strictParsing
                            value={startDate}
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
                            className="datePicker"
                            showTimeSelect
                            dateFormat="yyyy MMMM, dd h:mm aa"
                            // dateFormat="'YYYY-MM-dd', h:mm"
                            selected={endDate}
                            selectsStart
                            minDate={new Date(startDate)}
                            startDate={endDate}
                            onChange={(date) => setEndDate(date)}
                            strictParsing
                            value={endDate}
                            required
                          />
                        </Col>
                      </Row>
                      <Row>
                        <Col>
                          <Label
                            className="form-control-label"
                            htmlFor="example-date-input"
                          >
                            Teacher
                          </Label>
                          <Input
                            className="form-control-alternative new-event--title descrip"
                            id="exampleFormControlSelect3"
                            type="select"
                            onChange={(e) => setAssignTeachers(e.target.value)}
                            required
                          >
                            <option selected disabled>
                              {assignTeacherName}
                            </option>
                            <hr />
                            {staff.map((staff, i) => (
                              <option key={i} value={staff._id}>
                                {staff.firstname} {staff.lastname}
                              </option>
                            ))}
                          </Input>
                        </Col>
                      </Row>
                      <Row>
                        <Col>
                          <label className="form-control-label">
                            Description
                          </label>
                          <Input
                            className="form-control-alternative edit-event--description textarea-autosize"
                            placeholder="Event Desctiption"
                            type="textarea"
                            defaultValue={description}
                            onChange={(e) => setDescription(e.target.value)}
                            required
                          />
                          <i className="form-group--bar" />
                        </Col>
                      </Row>
                      <Row>
                        <Col>
                          <input className="edit-event--id" type="hidden" />

                          <label className="form-control-label d-block mb-3">
                            Status color
                          </label>
                          <ButtonGroup
                            className="btn-group-toggle btn-group-colors event-tag mb-0"
                            data-toggle="buttons"
                          >
                            <Button
                              className={classnames("bg-info", {
                                active: radios === "bg-info",
                              })}
                              color=""
                              id="bg-info"
                              type="button"
                              onClick={() => setRadios("bg-info")}
                              value="bg-info"
                            />
                            <Button
                              className={classnames("bg-warning", {
                                active: radios === "bg-warning",
                              })}
                              color=""
                              id="bg-warning"
                              type="button"
                              onClick={() => setRadios("bg-warning")}
                              value="bg-warning"
                            />
                            <Button
                              className={classnames("bg-danger", {
                                active: radios === "bg-danger",
                              })}
                              color=""
                              id="bg-danger"
                              type="button"
                              onClick={() => setRadios("bg-danger")}
                              value="vaccation"
                            />
                          </ButtonGroup>
                        </Col>
                      </Row>
                    </Form>
                  </div>
                  <div className="modal-footer">
                    <Button color="primary" onClick={changeEvent}>
                      Update
                    </Button>
                    {permissions && permissions.includes("delete") && (
                      <Button
                        color="danger"
                        onClick={() => {
                          setModalChange(false);
                          deleteEvent();
                        }}
                      >
                        Delete
                      </Button>
                    )}

                    <Button
                      className="ml-auto"
                      color="link"
                      onClick={() => setModalChange(false)}
                    >
                      Close
                    </Button>
                  </div>
                </>
              )}
            </Modal>
          </div>
        </Row>
      </Container>
      <Modal
        className="modal-dialog-centered"
        isOpen={viewModal}
        toggle={() => setViewModal(false)}
        size="md"
      >
        <div className="modal-header ">
          <h6 className="modal-title" id="modal-title-default">
            Event Details
          </h6>
          <button
            aria-label="Close"
            className="close"
            data-dismiss="modal"
            type="button"
            onClick={() => setViewModal(false)}
          >
            <span aria-hidden={true}>×</span>
          </button>
        </div>
        <ModalBody className="mt--4" >
          <Row>
            <Col align="center">
              <h4 className="mt-3 mb-1">Event Name</h4>
              <span className="text-md">{eventDetails.name}</span>
            </Col>
            <Col align="center">
              <h4 className="mt-3 mb-1">Event Detail</h4>
              <span className="text-md">{eventDetails.description}</span>
            </Col>
          
          </Row>
          <Row>
          <Col align="center">
              <h4 className="mt-3 mb-1">Event type</h4>
              <span className="text-md">{eventDetails.event_type}</span>
            </Col>
            <Col align="center">
              <h4 className="mt-3 mb-1">Event From</h4>
              <span className="text-md">{moment(eventDetails.event_from).format("DD/MM/YYYY")}</span>
            </Col>
            </Row>
          <Row>
            <Col align="center">
              <h4 className="mt-3 mb-1">Event to</h4>
              <span className="text-md">{moment(eventDetails.event_to).format("DD/MM/YYYY")}</span>
            </Col>
            <Col align="center">
              <h4 className="mt-3 mb-1">Event Teachers</h4>
             
              {eventDetails.assignTeachers &&
                eventDetails.assignTeachers.firstname +
                  " " +
                  eventDetails.assignTeachers.lastname}
            </Col>
          </Row>
        </ModalBody>
      </Modal>

      <Modal
        style={{ height: "65vh", marginTop: "8rem" }}
        isOpen={editing}
        toggle={() => setEditing(false)}
        size="lg"
        scrollable
      >
        <div className="modal-header">
          <h2 className="modal-title" id="modal-title-default">
            {editing ? "Event List" : ""}
          </h2>
          <button
            aria-label="Close"
            className="close"
            data-dismiss="modal"
            type="button"
            onClick={() => setEditing(false)}
          >
            <span aria-hidden={true}>×</span>
          </button>
        </div>
        {editLoading ? (
          <Loader />
        ) : (
          <ModalBody>
            {/* <Label className="form-control-label" htmlFor="example-date-input">
            Search
          </Label>
          <Input
            className="form-control-alternative new-event--title"
            placeholder="Event Title"
            type="text"
            // onChange={(e) => setEventTitle(e.target.value)}
            required
          />
          <Button className="mt-2">Search</Button> */}
            <Table columns={columns} dataSource={eventList} />
          </ModalBody>
        )}
      </Modal>
    </>
  );
};

export default Calendar;
