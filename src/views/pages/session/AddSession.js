import React, { useEffect, useState, useRef } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  Form,
  Input,
  Button,
  Modal,
  ModalBody,
  ModalFooter,
} from "reactstrap";
import { useReactToPrint } from "react-to-print";
import SimpleHeader from "components/Headers/SimpleHeader";
import { Popconfirm } from "antd";
import PermissionsGate from "routeGuard/PermissionGate";
import { isAuthenticated } from "api/auth";
import { allSessions, addSession, editSession } from "api/session";
import { ToastContainer, toast } from "react-toastify";
import AntTable from "../tables/AntTable";
import { SearchOutlined } from "@ant-design/icons";
import Loader from "components/Loader/Loader";
import { Table } from "ant-table-extensions";
import { deleteSession } from "api/session";
import { fetchingSessionError } from "constants/errors";
import { addSessionError } from "constants/errors";
import { deleteSessionError } from "constants/errors";
import { deleteSessionSuccess, addSessionSuccess } from "constants/success";

//React Datepicker
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

// import moment Library
import moment from "moment";

const AddSession = () => {
  const [sessionList, setSessionList] = useState([]);
  const [reload, setReload] = useState(false);
  const [loading, setLoading] = useState(false);
  const [checked, setChecked] = useState(false);
  const [startTime, setStartTime] = useState(new Date());
  const startTimeDuration = moment(startTime).format("LT");
  const [editing, setEditing] = useState(false);
  const [editSessionName, setEditSessionName] = useState("");
  const [editStartDate, setEditStartDate] = useState("");
  const [editEndDate, setEditEndDate] = useState("");
  const [editWorkingDay, setEditWorkingDay] = useState("");
  const [editWorkingTime, setEditWorkingTime] = useState(new Date());
  const editTimeDuration = moment(editWorkingTime).format("LT");
  const [editSessionId, setEditSessionId] = useState("");
  const [feesmethod, setFeesmethod] = useState("");
  const [dateExpire, setDateExpire] = useState(false);
  const [date, setDate] = useState(new Date());
  const [sessionData, setSessionData] = useState({
    name: "",
    start_date: "",
    end_date: "",
    fees_method: "",
    working_days: "",
  });
  const { user, token } = isAuthenticated();
  const [file, setFile] = useState();

  const fileReader = new FileReader();

  const [check, setCheck] = useState(false);
  const [permissions, setPermissions] = useState([]);
  const handleOnChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleOnSubmit = (e) => {
    e.preventDefault();

    if (file) {
      fileReader.onload = function (event) {
        const csvOutput = event.target.result;
      };

      fileReader.readAsText(file);
    }
  };
  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  let permission1 = [];
  useEffect(() => {
    // console.log(user);
    if (user.permissions["Session"]) {
      permission1 = user.permissions["Session"];
      setPermissions(permission1);
    }
  }, []);

  useEffect(() => {
    const getAllSessions = () => {
      // All Sections
      allSessions(user._id, user.school, token)
        .then((res) => {
          // console.log(res);
          const data = [];
          for (let i = 0; i < res.length; i++) {
            data.push({
              key: i,
              session: res[i].name,
              start_date: moment(res[i].start_date).format("DD-MM-YYYY"),
              end_date: moment(res[i].end_date).format("DD-MM-YYYY"),
              working_days: res[i].working_days,
              working_time: res[i].working_time,
              year: res[i].year,
              fees_method: res[i].fees_method,
              action: (
                <h5 key={i + 1} className="mb-0">
                  {permission1 && permission1.includes("edit") && (
                    <Button
                      className="btn-sm pull-right"
                      color="primary"
                      type="button"
                      key={"edit" + i + 1}
                      onClick={() =>
                        rowHandler(
                          res[i]._id,
                          res[i].name,
                          res[i].fees_method,
                          res[i].start_date.split("T")[0],
                          res[i].end_date.split("T")[0],
                          res[i].working_days
                        )
                      }
                    >
                      <i className="fas fa-user-edit" />
                    </Button>
                  )}

                  {/* {permissions && permissions.includes("delete") && (
                   
                  )} */}
                </h5>
              ),
            });
          }
          var Current_number = 0;
          var Closed_number = 0;
          data.map((d) => {
            if (d.status === "current") {
              setCheck(false);
              Current_number++;
            } else {
              Closed_number++;
            }
          });
          if (data.length === Closed_number) {
            setCheck(true);
          }
          setSessionList(data);
          setLoading(true);
        })
        .catch((err) => {
          console.log(err);
          toast.error(fetchingSessionError);
        });
    };
    getAllSessions();
  }, [reload, checked]);

  async function handleDelete(sessionId) {
    const { user, token } = isAuthenticated();
    try {
      await deleteSession(sessionId, user._id, token);
      if (checked === false) {
        setChecked(true);
      } else {
        setChecked(false);
      }
      toast.success(deleteSessionSuccess);
    } catch (err) {
      toast.error(deleteSessionError);
    }
  }

  //Edit Session
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    // console.log("clicked");
    const { user, token } = isAuthenticated();
    let formData = new FormData();
    formData.set("name", editSessionName);
    formData.set("start_date", editStartDate);
    formData.set("end_date", editEndDate);
    formData.set("working_days", editWorkingDay);
    formData.set("working_time", editTimeDuration);
    formData.set("fees_method", feesmethod);

    try {
      const updateSession = await editSession(
        editSessionId,
        user._id,
        token,
        formData
      );
      console.log(updateSession);
      // console.log("updateDepartments", updateSession);
      if (updateSession.err) {
        setEditing(false);
        toast.error(updateSession.err);
      } else {
        setEditing(false);
        if (checked === false) {
          setChecked(true);
        } else {
          setChecked(false);
        }
      }
    } catch (err) {
      toast.error(err);
    }
  };

  //Getting values from fetch
  function rowHandler(id, name, fees_method, startDate, endDate, working_days) {
    // e.stopPropagation();
    setEditing(true);
    let nowDate = new Date();
    var startdate = new Date(startDate); // Now
    startdate.setDate(startdate.getDate() + 30); // Set now + 30 days as the new date
    if (startdate > nowDate) {
      setDateExpire(true);
    } else {
      setDateExpire(false);
    }
    setEditSessionName(name);
    setFeesmethod(fees_method);
    setEditStartDate(startDate);
    setEditEndDate(endDate);
    setEditSessionId(id);
    setEditWorkingDay(working_days);
  }

  const columns = [
    {
      title: "Session",
      dataIndex: "session",
      align: "left",
      // width: 150,
      width: "20%",
      sorter: (a, b) => a.session > b.session,
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
        return record.session.toLowerCase().includes(value.toLowerCase());
      },
    },
    {
      title: "Fees Method",
      key: "fees_method",
      align: "left",
      dataIndex: "fees_method",
      sorter: (a, b) => a.fees_method > b.fees_method,
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
        return record.fees_method.toLowerCase().includes(value.toLowerCase());
      },
    },
    {
      title: "Start Date",
      dataIndex: "start_date",
      align: "left",
      // width: 150,
      width: "20%",
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
      align: "left",
      width: "20%",
      // width: 150,
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
      title: "Working Days",
      dataIndex: "working_days",
      align: "left",
      // width: 150,
      sorter: (a, b) => a.working_days > b.working_days,
    },
    {
      title: "Working Time",
      align: "left",
      dataIndex: "working_time",
      // width: 150,
      width: "10%",
      sorter: (a, b) => a.working_time > b.working_time,
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
        return record.working_time.toLowerCase().includes(value.toLowerCase());
      },
    },
    {
      title: "Year",
      dataIndex: "year",
      align: "left",
      width: "20%",
      // width: 150,
      sorter: (a, b) => a.year > b.year,
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
        return record.year.toLowerCase().includes(value.toLowerCase());
      },
    },

    {
      title: "Action",
      key: "action",
      dataIndex: "action",
      fixed: "right",
      align: "left",
    },
  ];

  const [formData] = useState(new FormData());
  const handleChange = (name) => (event) => {
    formData.set(name, event.target.value);
    setSessionData({ ...sessionData, [name]: event.target.value });
  };

  const handleDate = (name) => (event) => {
    formData.set(name, event.target.value);
    setDate(event.target.value);
    setSessionData({
      ...sessionData,
      [name]: event.target.value,
      end_date: "",
    });
  };

  //Final Submit
  const handleFormChange = async (e) => {
    e.preventDefault();
    const { user, token } = isAuthenticated();
    formData.set("school", user.school);
    const year =
      formData.get("start_date").slice(2, 4) +
      "-" +
      formData.get("end_date").slice(2, 4);
    formData.set("year", year);
    formData.set("working_days", sessionData.working_days);
    formData.set("working_time", startTimeDuration);
    try {
      const resp = await addSession(user._id, token, formData);
      // console.log(resp);
      setSessionData({
        name: "",
        start_date: "",
        end_date: "",
        fees_method: "",
        working_days: "",
      });
      if (resp.err) {
        return toast.error(resp.err);
      } else {
        toast.success(addSessionSuccess);
        setChecked(!checked);
      }
      // setReload(true);
    } catch (err) {
      toast.error(addSessionError);
    }
  };

  return (
    <>
      <SimpleHeader name="Add Session" />
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
      <Container className="mt--6" fluid>
        <Row>
          {/* {permissions && permissions.includes("add") && (
              
            )} */}
          <Col>
            <div className="card-wrapper">
              <Card>
                <Form onSubmit={handleFormChange} className="mb-4">
                  <CardBody>
                    <Row>
                      <Col>
                        <label
                          className="form-control-label"
                          htmlFor="example4cols2Input"
                        >
                          Session
                        </label>
                        <Input
                          id="example4cols2Input"
                          placeholder="Session"
                          type="text"
                          onChange={handleChange("name")}
                          value={sessionData.name}
                          required
                        />
                      </Col>
                    </Row>
                    <Row className="mt-4">
                      <Col>
                        <label
                          className="form-control-label"
                          htmlFor="example-date-input"
                        >
                          Starting Date
                        </label>
                        <Input
                          id="example-date-input"
                          type="date"
                          onChange={handleDate("start_date")}
                          required
                          placeholder="dd-mm-yyyy"
                          value={sessionData.start_date}
                        />
                      </Col>
                    </Row>
                    <Row className="mt-4">
                      <Col>
                        <label
                          className="form-control-label"
                          htmlFor="example-date-input"
                        >
                          Ending Date
                        </label>
                        <Input
                          id="example-date-input"
                          value={sessionData.end_date}
                          type="date"
                          min={moment(date).format("YYYY-MM-DD")}
                          placeholder="dd-mm-yyyy"
                          onChange={handleChange("end_date")}
                          required
                        />
                      </Col>
                    </Row>
                    <Row className="mt-4">
                      <Col>
                        <label
                          className="form-control-label"
                          htmlFor="example-date-input"
                        >
                          Working Days
                        </label>
                        <Input
                          id="example-date-input"
                          type="number"
                          max="7"
                          min="1"
                          onChange={handleChange("working_days")}
                          value={sessionData.working_days}
                          placeholder="Working Days"
                          required
                        />
                      </Col>
                    </Row>
                    <Row className="mt-4">
                      <Col>
                        <label
                          className="form-control-label"
                          htmlFor="example-date-input"
                        >
                          Working Time
                        </label>
                        <DatePicker
                          id="exampleFormControlSelect3"
                          className="Period-Time"
                          selected={startTime}
                          onChange={(date) => setStartTime(date)}
                          showTimeSelect
                          showTimeSelectOnly
                          timeIntervals={15}
                          timeCaption="Time"
                          dateFormat="h:mm aa"
                        />
                      </Col>
                      <Col>
                        <label
                          className="form-control-label"
                          htmlFor="example-date-input"
                        >
                          Fees Method
                        </label>
                        <select
                          required
                          value={sessionData.fees_method}
                          className="form-control"
                          onChange={handleChange("fees_method")}
                        >
                          <option value="">Select Fees Method</option>
                          <option value="monthly">Monthly</option>
                          <option value="quarterly">Quarterly</option>
                          <option value="half_yearly">Half-Yearly</option>
                          <option value="yearly">Yearly</option>
                        </select>
                      </Col>
                    </Row>
                    <Row className="mt-4 float-right">
                      <Col
                        style={{ display: "flex", justifyContent: "center" }}
                      >
                        <Button color="primary" type="submit">
                          Submit
                        </Button>
                      </Col>
                    </Row>
                  </CardBody>
                </Form>
              </Card>
            </div>
          </Col>

          {/* <Col>
            <div className="card-wrapper">
              <Card>
                <CardBody>
                  <Button
                    color="primary"
                    className="mb-2"
                    onClick={handlePrint}
                  >
                    Print
                  </Button>
                  <Row className="ml-2">
                    {loading && sessionList ? (
                      <div ref={componentRef}>
                        <AntTable
                          columns={columns}
                          data={sessionList}
                          pagination={true}
                          exportFileName="SessionDetails"
                        />
                      </div>
                    ) : (
                      <Loader />
                    )}
                  </Row>
                </CardBody>
              </Card>
            </div>
          </Col> */}
          <Col>
            <div className="card-wrapper">
              <Card>
                <CardBody>
                  <Button
                    color="primary"
                    className="mb-2"
                    onClick={handlePrint}
                    style={{ float: "right" }}
                  >
                    Print
                  </Button>
                  {loading && sessionList ? (
                    permission1 && permission1.includes("edit") ? (
                      <div ref={componentRef}>
                        <AntTable
                          columns={columns}
                          data={sessionList}
                          pagination={true}
                          exportFileName="SessionDetails"
                        />
                      </div>
                    ) : (
                      <div className="main_table_div_session">
                        <Table
                          style={{ whiteSpace: "pre" }}
                          columns={columns}
                          dataSource={sessionList}
                          pagination={{
                            pageSizeOptions: [
                              "5",
                              "10",
                              "30",
                              "60",
                              "100",
                              "1000",
                            ],
                            showSizeChanger: true,
                          }}
                        />
                      </div>
                    )
                  ) : (
                    <Loader />
                  )}
                </CardBody>
              </Card>
            </div>
          </Col>
        </Row>
        <Modal
          className="modal-dialog-centered"
          isOpen={editing}
          toggle={() => setEditing(false)}
          size="lg"
        >
          <div className="modal-header">
            <h2 className="modal-title" id="modal-title-default">
              {editing ? "Edit Form" : "Create Form"}
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
          <Form onSubmit={handleEditSubmit}>
            <ModalBody>
              <Row>
                <Col>
                  <label className="form-control-label">Session Name</label>
                  <Input
                    id="form-department-name"
                    value={editSessionName}
                    onChange={(e) => setEditSessionName(e.target.value)}
                    placeholder="School Address"
                    type="text"
                  />
                </Col>
              </Row>
              <Row className="mt-4">
                <Col>
                  <label
                    className="form-control-label"
                    htmlFor="example-date-input"
                  >
                    Starting Date
                  </label>
                  <Input
                    id="example-date-input"
                    type="date"
                    onChange={(e) => setEditStartDate(e.target.value)}
                    required
                    value={editStartDate}
                  />
                </Col>
              </Row>
              <Row className="mt-4">
                <Col>
                  <label
                    className="form-control-label"
                    htmlFor="example-date-input"
                  >
                    Ending Date
                  </label>
                  <Input
                    id="example-date-input"
                    value={editEndDate}
                    type="date"
                    min={moment(editStartDate).format("YYYY-MM-DD")}
                    onChange={(e) => setEditEndDate(e.target.value)}
                    required
                  />
                </Col>
              </Row>
              <Row className="mt-4">
                <Col>
                  <label
                    className="form-control-label"
                    htmlFor="example-date-input"
                  >
                    Working Days
                  </label>
                  <Input
                    id="example-date-input"
                    value={editWorkingDay}
                    type="number"
                    max="7"
                    min="1"
                    onChange={(e) => setEditWorkingDay(e.target.value)}
                    required
                    placeholder="Working Days"
                  />
                </Col>
              </Row>
              <Row className="mt-4">
                <Col>
                  <label
                    className="form-control-label"
                    htmlFor="example-date-input"
                  >
                    Working Time
                  </label>
                  <DatePicker
                    id="exampleFormControlSelect3"
                    className="Period-Time"
                    selected={editWorkingTime}
                    onChange={(date) => setEditWorkingTime(date)}
                    showTimeSelect
                    showTimeSelectOnly
                    timeIntervals={15}
                    timeCaption="Time"
                    dateFormat="h:mm aa"
                  />
                </Col>
                {dateExpire && (
                  <Col>
                    <label
                      className="form-control-label"
                      htmlFor="example-date-input"
                    >
                      Fees Method
                    </label>
                    <select
                      required
                      value={feesmethod}
                      className="form-control"
                      onChange={(e) => setFeesmethod(e.target.value)}
                    >
                      <option value="">Select Fees Method</option>
                      <option value="monthly">Monthly</option>
                      <option value="quarterly">Quarterly</option>
                      <option value="half_yearly">Half-Yearly</option>
                      <option value="yearly">Yearly</option>
                    </select>
                  </Col>
                )}
              </Row>
            </ModalBody>
            <ModalFooter>
              <Button color="success" type="submit">
                Save changes
              </Button>
            </ModalFooter>
          </Form>
        </Modal>
      </Container>
    </>
  );
};

export default AddSession;
