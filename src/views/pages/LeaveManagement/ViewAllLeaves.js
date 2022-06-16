import React, { useEffect, useState, useRef } from "react";
import { isAuthenticated } from "api/auth";
import {
  Card,
  CardHeader,
  CardBody,
  Input,
  Container,
  Row,
  Col,
  Button,
  CardImg,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Modal,
  ModalBody,
} from "reactstrap";
import SimpleHeader from "components/Headers/SimpleHeader.js";
import { SearchOutlined } from "@ant-design/icons";
import AntTable from "../tables/AntTable";
import Loader from "components/Loader/Loader";
import { Popconfirm } from "antd";
import { toast, ToastContainer } from "react-toastify";
import {
  getAllLeaves,
  getAllStaffLeaves,
  getAllStudentLeaves,
  editLeave
} from "../../../api/leave";

const ViewAllLeaves = () => {
  const { user } = isAuthenticated();
  const [studentLeaveData, setStudentLeaveData] = useState([]);
  const [staffLeaveData, setStaffLeaveData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState(1);
  const [editing, setEditing] = useState(false);
  const [editStatus, setEditStatus] = useState("");
  const [editLeaveId, setEditLeaveId] = useState("");
  const [editLoading, setEditLoading] = useState(false);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    getAllLeavesHandler();
  }, [checked]);

  const columns1 = [
    {
      title: "Name",
      dataIndex: "name",
      align:"left",
      sorter: (a, b) => a.name > b.name,
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
        return record.name.toLowerCase().includes(value.toLowerCase());
      },
    },
    {
      title: "Department",
      dataIndex: "department",
      width: "40%",
      sorter: (a, b) => a.department > b.department,
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
        return record.department.toLowerCase().includes(value.toLowerCase());
      },
    },
    {
      title: "Date From",
      dataIndex: "date_from",
      width: "40%",
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
      align:"left",
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
      align:"left",
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
    {
      title: "Leave Type",
      dataIndex: "leave_type",
      align:"left",
      sorter: (a, b) => a.leave_type > b.leave_type,
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
        return record.leave_type.toLowerCase().includes(value.toLowerCase());
      },
    },
    {
      title: "Reason",
      dataIndex: "reason",
      align:"left",
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
      align:"left",
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
      align:"left",
    },
  ];
  const columns2 = [
    {
      title: "Name",
      dataIndex: "name",
      align:"left",
      sorter: (a, b) => a.name > b.name,
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
        return record.name.toLowerCase().includes(value.toLowerCase());
      },
    },
    {
      title: "Class",
      dataIndex: "class",
      align:"left",
      sorter: (a, b) => a.class > b.class,
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
        return record.class.toLowerCase().includes(value.toLowerCase());
      },
    },
    {
      title: "Section",
      dataIndex: "section",
      align:"left",
      sorter: (a, b) => a.section > b.section,
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
        return record.section.toLowerCase().includes(value.toLowerCase());
      },
    },
    {
      title: "Date From",
      dataIndex: "date_from",
      align:"left",
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
      align:"left",
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
      width: "40%",
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

    {
      title: "Reason",
      dataIndex: "reason",
      align:"left",
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
      align:"left",
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
      align:"left",
    },
  ];

  const getAllLeavesHandler = async () => {
    try {
      setLoading(true);
      const data = await getAllLeaves(user._id, user.school);
      console.log(data);

      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  const getAllStaffLeavesHandler = async () => {
    try {
      setLoading(true);
      const data = await getAllStaffLeaves(user._id, user.school);
      console.log(data);
      let tableData = [];
      data.forEach((leave, i) => {
        // console.log(leave);
        tableData.push({
          key: i,
          name:
            leave.staff && leave.staff.firstname + " " + leave.staff.lastname,
          department: leave.department && leave.department.name,
          date_from: leave.dateFrom,
          date_to: leave.dateTo,
          no_of_days: leave.noOfDays,
          leave_type: leave.leaveType,
          reason: leave.reason,
          status: leave.status,
          action: (
            <h5 key={i + 1} className="mb-0">
              <Button
                className="btn-sm pull-right"
                color="primary"
                type="button"
                key={"edit" + i + 1}
                onClick={() => {
                  setEditStatus(leave.status);
                  setEditing(true);
                  setEditLeaveId(leave._id);
                }}
              >
                <i className="fas fa-user-edit" />
              </Button>
            </h5>
          ),
        });
      });
      setStaffLeaveData(tableData);
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };
  function getFormattedDate(date1) {
    let date = new Date(date1);
    var year = date.getFullYear();

    var month = (1 + date.getMonth()).toString();
    month = month.length > 1 ? month : "0" + month;

    var day = date.getDate().toString();
    day = day.length > 1 ? day : "0" + day;

    return day + "/" + month + "/" + year;
  }
  const getAllStudentLeavesHandler = async () => {
    try {
      setLoading(true);
      const data = await getAllStudentLeaves(user._id, user.school);
      console.log(data);
      let tableData = [];
      data.forEach((leave, i) => {
        tableData.push({
          key: i,
          name:
            leave.student &&
            leave.student.firstname + " " + leave.student.lastname,
          class: leave.class && leave.class.name,
          section: leave.section && leave.section.name,
          date_from:getFormattedDate(leave.dateFrom),
          date_to: getFormattedDate(leave.dateTo),
          no_of_days: leave.noOfDays,
          reason: leave.reason,
          status: leave.status,
          action: (
            <h5 key={i + 1} className="mb-0">
              <Button
                className="btn-sm pull-right"
                color="primary"
                type="button"
                key={"edit" + i + 1}
                onClick={() => {
                  setEditStatus(leave.status);
                  setEditing(true);
                  setEditLeaveId(leave._id);
                }}
              >
                <i className="fas fa-user-edit" />
              </Button>
            </h5>
          ),
        });
      });
      setStudentLeaveData(tableData);
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log(view);
    if (view === 1) {
      getAllStudentLeavesHandler();
    } else if (view === 2) {
      getAllStaffLeavesHandler();
    }
  }, [view,checked]);

  const handleEdit = async () => {
    const formData = new FormData();
    formData.set("id",editLeaveId);
    formData.set("status",editStatus);
    try {
      setEditLoading(true);
      const data = await editLeave(user._id,formData);
      if (data.err) {
        toast.error(data.err);
        setEditLoading(false);
        return;
      }
      setEditing(false);
      setEditLeaveId("");
      setEditStatus("");
      setChecked(!checked);
      toast.success("Leave edited successfully");
      setEditLoading(false);
    } catch (err) {
      console.log(err);
      toast.error("Error editing leave");
      setEditLoading(false);
    }
  };

  return (
    <>
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
      <SimpleHeader name="View All Leaves" />
      <Container className="mt--6" fluid>
        <div className="card-wrapper">
          <Card className="mb-4">
            <CardHeader className="buttons-head">
              <div>
                <Button
                  color={`${view === 1 ? "warning" : "primary"}`}
                  type="button"
                  onClick={() => {
                    setView(1);
                  }}
                >
                  Student
                </Button>{" "}
                <Button
                  color={`${view === 2 ? "warning" : "primary"}`}
                  type="button"
                  onClick={() => {
                    setView(2);
                  }}
                >
                  Staff
                </Button>
              </div>
            </CardHeader>
            <CardBody>
              {loading ? (
                <Loader />
              ) : (
                <>
                  <div style={{ overflowX: "auto" }}>
                    {view === 1 && (
                      <AntTable
                        columns={columns2}
                        data={studentLeaveData}
                        pagination={true}
                        exportFileName="SubjectDetails"
                      />
                    )}
                  </div>
                  <div style={{ overflowX: "auto" }}>
                    {view === 2 && (
                      <AntTable
                        columns={columns1}
                        data={staffLeaveData}
                        pagination={true}
                        exportFileName="SubjectDetails"
                      />
                    )}
                  </div>
                </>
              )}
            </CardBody>
          </Card>
        </div>
        <Modal
          className="modal-dialog-centered"
          isOpen={editing}
          toggle={() => setEditing(false)}
          size="md"
        >
          <div className="modal-header">
            <h2 className="modal-title" id="modal-title-default">
              Edit Status
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
              <Row>
                <Col>
                  <label className="form-control-label">Status</label>
                  <Input
                    id="form-class-name"
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value)}
                    placeholder="Class Name"
                    type="select"
                  >
                    <option value="">Select Status</option>
                    <option value="Awaiting">Awaiting</option>
                    <option value="Approved">Approved</option>
                    <option value="Declined">Declined</option>
                    <option value="Cancelled">Cancelled</option>
                  </Input>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Button
                    color="success"
                    type="button"
                    className="mt-2"
                    onClick={handleEdit}
                  >
                    Save changes
                  </Button>
                </Col>
              </Row>
            </ModalBody>
          )}
        </Modal>
      </Container>
    </>
  );
};

export default ViewAllLeaves;
