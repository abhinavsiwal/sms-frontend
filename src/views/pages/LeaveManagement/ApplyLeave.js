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
  ModalFooter,
  ModalBody,
} from "reactstrap";
import AntTable from "../tables/AntTable";
import { SearchOutlined } from "@ant-design/icons";
import SimpleHeader from "components/Headers/SimpleHeader";
import { isAuthenticated } from "api/auth";
import { ToastContainer, toast } from "react-toastify";
import { allSessions } from "api/session";
import Loader from "components/Loader/Loader";
import {
  createLeave,
  getLeaveBySID,
  deleteLeaveBySID,
  editLeave,
} from "../../../api/leave";
import { Popconfirm } from "antd";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const ApplyLeave = () => {
  const { user } = isAuthenticated();
  const [addLoading, setAddLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [leave, setLeave] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [checked, setChecked] = useState(false);
  const [dateFrom, setDateFrom] = useState();
  const [dateTo, setDateTo] = useState();
  const [leaveData, setLeaveData] = useState({
    leaveType: "",
    from: "",
    fromType: "",
    to: "",
    toType: "",
    reason: "",
    priority: "",
    section: "",
    session: "",
  });
  function getFormattedDate(date1) {
    let date = new Date(date1);
    var year = date.getFullYear();

    var month = (1 + date.getMonth()).toString();
    month = month.length > 1 ? month : "0" + month;

    var day = date.getDate().toString();
    day = day.length > 1 ? day : "0" + day;

    return day + "/" + month + "/" + year;
  }
  const columns = [
    {
      title: "Date From",
      dataIndex: "date_from",
      // width: "40%",
      align: "left",
      sorter: (a, b) => a.date_from > b.date_from,
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
        return record.date_from.toLowerCase().includes(value.toLowerCase());
      },
    },
    {
      title: "Date To",
      dataIndex: "date_to",
      // width: "40%",
      align: "left",
      sorter: (a, b) => a.date_to > b.date_to,
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
        return record.date_to.toLowerCase().includes(value.toLowerCase());
      },
    },
    {
      title: "No of Days",
      dataIndex: "no_of_days",
      // width: "40%",
      align: "left",
      sorter: (a, b) => a.no_of_days > b.no_of_days,
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
        return record.no_of_days.toLowerCase().includes(value.toLowerCase());
      },
    },
    // {
    //   title: "Leave Type",
    //   dataIndex: "leave_type",
    //   // width: "40%",
    //   sorter: (a, b) => a.leave_type > b.leave_type,
    //   filterDropdown: ({ setSelectedKeys, selectedKeys, confirm }) => {
    //     return (
    //       <>
    //         <Input
    //           autoFocus
    //           placeholder="Type text here"
    //           value={selectedKeys[0]}
    //           onChange={(e) => {
    //             setSelectedKeys(e.target.value ? [e.target.value] : []);
    //             confirm({ closeDropdown: false });
    //           }}
    //           onBlur={() => {
    //             confirm();
    //           }}
    //         ></Input>
    //       </>
    //     );
    //   },
    //   filterIcon: () => {
    //     return <SearchOutlined />;
    //   },
    //   onFilter: (value, record) => {
    //     return record.leave_type.toLowerCase().includes(value.toLowerCase());
    //   },
    // },
    {
      title: "Reason",
      dataIndex: "reason",
      // width: "40%",
      align: "left",
      sorter: (a, b) => a.reason > b.reason,
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
        return record.reason.toLowerCase().includes(value.toLowerCase());
      },
    },
    {
      title: "Status",
      dataIndex: "status",
      // width: "40%",
      align: "left",
      sorter: (a, b) => a.status > b.status,
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
        return record.status.toLowerCase().includes(value.toLowerCase());
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

  const handleChange = (name) => async (e) => {
    setLeaveData({ ...leaveData, [name]: e.target.value });
    console.log(name, e.target.value);
  };

  useEffect(() => {
    getLeave();
    getSession();
  }, [checked]);
  const getSession = async () => {
    const { user, token } = isAuthenticated();
    try {
      const session = await allSessions(user._id, user.school, token);
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
  const getLeave = async () => {
    try {
      setLoading(true);
      const data = await getLeaveBySID(user._id, user.SID);
      if (data.err) {
        toast.error(data.err);
        setLoading(false);
        return;
      }
      let tableData = [];
      for (let i = 0; i < data.length; i++) {
        tableData.push({
          key: i,
          date_from: getFormattedDate(data[i].dateFrom),
          date_to: getFormattedDate(data[i].dateTo),
          no_of_days: data[i].noOfDays,
          leave_type: data[i].leaveType,
          reason: data[i].reason,
          status: data[i].status,
          action: (
            <h5 key={i + 1} className="mb-0">
              <Button
                className="btn-sm pull-right"
                color="danger"
                type="button"
                key={"delete" + i + 1}
              >
                <Popconfirm
                  title="Sure to Cancel?"
                  onConfirm={() => handleDelete(data[i]._id, data[i].dateFrom)}
                >
                  Cancel
                </Popconfirm>
              </Button>
            </h5>
          ),
        });
      }
      setLeave(tableData);
      setLoading(false);
    } catch (err) {
      console.log(err);
      toast.error("Fetching Leaves Failed");
      setLoading(false);
    }
  };

  const handleDelete = async (leaveId, dateFrom) => {
    let dateFrom1 = new Date(dateFrom);
    let today = new Date();

    if (today > dateFrom1) {
      toast.error("You can't cancel this leave");
      return;
    }

    let formData = new FormData();
    formData.set("status", "Cancelled");
    formData.set("id", leaveId);
    try {
      setLoading(true);
      const data = await editLeave(user._id, formData);
      console.log(data);
      if (data.err) {
        toast.error(data.err);
        setLoading(false);
        return;
      }
      toast.success("Leave Cancelled Successfully");
      setChecked(!checked);
      setLoading(false);
    } catch (err) {
      console.log(err);
      toast.error("Deleting Leave Failed");
      setLoading(false);
    }
  };

  const handleLeaveSubmit = async (e) => {
    console.log(leaveData);
    e.preventDefault();
    const formData = new FormData();
    formData.set("dateFrom", dateFrom);
    formData.set("dateTo", dateTo);
    formData.set("reason", leaveData.reason);
    formData.set("userId", user._id);
    formData.set("user", user.user);
    formData.set("session", leaveData.session);
    if (user.user === "student") {
      formData.set("section", user.section);
      formData.set("class", user.class);
    } else if (user.user === "staff") {
      formData.set("leaveType", leaveData.leaveType);
      formData.set("department", user.department);
    }

    try {
      setAddLoading(true);
      const data = await createLeave(user._id, formData);
      console.log(data);
      if (data.err) {
        toast.error(data.err);
        setAddLoading(false);
        return;
      }
      setChecked(!checked);
      toast.success("Leave Applied Successfully");
      setLeaveData({
        leaveType: "",
        from: "",
        fromType: "",
        to: "",
        toType: "",
        reason: "",
        priority: "",
      });
      setAddLoading(false);
    } catch (err) {
      console.log(err);
      toast.error("Leave Application Failed");
      setAddLoading(false);
    }
  };

  const filterPassedTime = (time) => {
    const currentDate = new Date(dateFrom);
    const selectedDate = new Date(time);

    return currentDate < selectedDate;
  };
  return (
    <>
      <SimpleHeader name="Apply Leave" parentName="Leave Management" />
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
          {addLoading ? (
            <Loader />
          ) : (
            <Col lg="12">
              <Card>
                <CardBody>
                  <Form className="mb-4" onSubmit={handleLeaveSubmit}>
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
                          onChange={handleChange("session")}
                          value={leaveData.session}
                        >
                          <option value="" disabled>
                            Select Session
                          </option>
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
                    {user.user === "staff" && (
                      <Row>
                        <Col>
                          <label
                            className="form-control-label"
                            htmlFor="example4cols2Input"
                          >
                            Leave Type
                          </label>
                          <Input
                            id="example4cols2Input"
                            placeholder="Leave Type"
                            type="select"
                            onChange={handleChange("leaveType")}
                            value={leaveData.leaveType}
                            required
                          >
                            <option value="">Select Leave Type</option>
                            <option value="Earned Leave">Earned Leave</option>
                            <option value="LOP Leave">LOP Leave</option>
                            <option value="Comp Off Leave">
                              Comp Off Leave
                            </option>
                          </Input>
                        </Col>
                      </Row>
                    )}

                    <Row>
                      <Col>
                        <label
                          className="form-control-label"
                          htmlFor="example4cols2Input"
                        >
                          From
                        </label>
                        <DatePicker
                          id="exampleFormControlSelect3"
                          dateFormat="dd/MM/yyyy"
                          placeholderText="dd/mm/yyyy"
                          selected={dateFrom}
                          onChange={(date) => setDateFrom(date)}
                          howMonthDropdown
                          showYearDropdown
                          dropdownMode="select"
                          className="datePicker"
                          required
                          minDate={new Date()}
                        />
                      </Col>
                      <Col>
                        <label
                          className="form-control-label"
                          htmlFor="example4cols2Input"
                        >
                          Day Type
                        </label>
                        <Input
                          id="example4cols2Input"
                          placeholder="Leave Type"
                          type="select"
                          onChange={handleChange("fromType")}
                          value={leaveData.fromType}
                          required
                        >
                          <option value="">Select Day Type</option>
                          <option value="Full">Full</option>
                          <option value="Half">Half</option>
                        </Input>
                      </Col>

                      <Col>
                        <label
                          className="form-control-label"
                          htmlFor="example4cols2Input"
                        >
                          To
                        </label>
                        <DatePicker
                          id="exampleFormControlSelect3"
                          dateFormat="dd/MM/yyyy"
                          placeholderText="dd/mm/yyyy"
                          selected={dateTo}
                          onChange={(date) => setDateTo(date)}
                          howMonthDropdown
                          showYearDropdown
                          dropdownMode="select"
                          className="datePicker"
                          required
                          minDate={new Date()}
                          
                          filterDate={filterPassedTime}
                        />
                      </Col>
                      <Col>
                        <label
                          className="form-control-label"
                          htmlFor="example4cols2Input"
                        >
                          Day Type
                        </label>
                        <Input
                          id="example4cols2Input"
                          placeholder="Leave Type"
                          type="select"
                          onChange={handleChange("toType")}
                          value={leaveData.toType}
                          required
                        >
                          <option value="">Select Day Type</option>
                          <option value="Full">Full</option>
                          <option value="Half">Half</option>
                        </Input>
                      </Col>
                    </Row>
                    <Row>
                      <Col>
                        <label
                          className="form-control-label"
                          htmlFor="example4cols2Input"
                        >
                          Reason
                        </label>
                        <Input
                          id="example4cols2Input"
                          placeholder="Reason"
                          type="textarea"
                          onChange={handleChange("reason")}
                          value={leaveData.reason}
                          required
                        />
                      </Col>

                      <Col>
                        <label
                          className="form-control-label"
                          htmlFor="example4cols2Input"
                        >
                          Priority
                        </label>
                        <Input
                          id="example4cols2Input"
                          placeholder="Leave Type"
                          type="select"
                          onChange={handleChange("priority")}
                          value={leaveData.priority}
                          required
                        >
                          <option value="">Select Priority</option>
                          <option value="Critical">Critical</option>
                          <option value="Advance">Advance</option>
                        </Input>
                      </Col>
                    </Row>
                    {/* <Row>
                      <Col>
                        <label
                          className="form-control-label"
                          htmlFor="example4cols2Input"
                        >
                          Approved By
                        </label>
                        <Input
                          id="example4cols2Input"
                          placeholder="Leave Type"
                          type="select"
                          //   onChange={handleChange("name")}
                          //   value={classData.name}
                          required
                        >
                          <option value="">Select Staff</option>
                          <option value="">Critical</option>
                          <option value="">Advance</option>
                        </Input>
                      </Col>
                    </Row> */}
                    <Row className="mt-4">
                      <Col
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          width: "100%",
                        }}
                      >
                        <Button color="primary" type="submit">
                          Submit
                        </Button>
                      </Col>
                    </Row>
                  </Form>
                </CardBody>
              </Card>
            </Col>
          )}
          <Col>
            <div className="card-wrapper">
              <Card>
                <CardBody>
                  {loading ? (
                    <Loader />
                  ) : (
                    <AntTable
                      columns={columns}
                      data={leave}
                      pagination={true}
                      exportFileName="LeaveDetails"
                    />
                  )}
                </CardBody>
              </Card>
            </div>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default ApplyLeave;
