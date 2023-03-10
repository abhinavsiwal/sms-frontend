import React, { useEffect, useState, useReducer } from "react";
import {
  Container,
  Card,
  Input,
  CardHeader,
  CardBody,
  Row,
  Col,
  Button,
  Form,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "reactstrap";
import { Popconfirm } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { allSessions } from "api/session";
import { Table } from "ant-table-extensions";
import AntTable from "../tables/AntTable";

import SimpleHeader from "components/Headers/SimpleHeader";
import LoadingScreen from "react-loading-screen";

import { isAuthenticated } from "api/auth";
import { toast, ToastContainer } from "react-toastify";
import { getStaffByDepartment, allStaffs } from "api/staff";
import { getDepartment } from "api/department";
import { addDeptBudget } from "api/Budget";
import { getDeptBudget } from "api/Budget";
import { deleteDeptBudget } from "api/Budget";

const DeptBudgetMaster = () => {
  const [loading, setLoading] = useState(false);
  const { user, token } = isAuthenticated();
  const [sessions, setSessions] = useState("");
  const [allocationData, setAllocationData] = useState({
    department: "",
    session: "",
    used: "",
    status: "",
    allocated: "",
  });
  const [editData, setEditData] = useState({
    id: "",
    department: "",
    session: "",
    allocated: "",
  });
  const [tableData, setTableData] = useState([]);
  const [editing, setEditing] = useState(false);

  const [allDepartments, setAllDepartments] = useState([]);

  const [checked, setChecked] = useState(false);

  const getAllDepartment = async () => {
    try {
      setLoading(true);
      const dept = await getDepartment(user.school, user._id, token);
      if (dept.err) {
        return toast.error(dept.err);
      }
      console.log(dept);
      setAllDepartments(dept);
      setLoading(false);
    } catch (err) {
      console.log(err);
      // toast.error("Error fetching departments");
      setLoading(false);
    }
  };
  const getSession = async () => {
    try {
      setLoading(true);
      const session = await allSessions(user._id, user.school, token);
      if (session.err) {
        setLoading(false);
        return toast.error(session.err);
      } else {
        setSessions(session);
        return;
      }
      setLoading(false);
    } catch (err) {
      setLoading(false);
      toast.error("Something Went Wrong!");
    }
  };

  useEffect(() => {
    getAllDepartment();
    getSession();
    getBudgetHandler();
  }, [checked]);

  const handleChange = (name) => async (event) => {
    setAllocationData({ ...allocationData, [name]: event.target.value });
  };

  const handleEditChange = (name) => async (event) => {
    setEditData({ ...editData, [name]: event.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.set("department", allocationData.department);
    formData.set("session", allocationData.session);
    formData.set("allocated", allocationData.allocated);
    try {
      setLoading(true);
      const data = await addDeptBudget(user.school, user._id, formData);
      console.log(data);
      if (data.err) {
        setLoading(false);
        return toast.error(data.err);
      }
      setLoading(false);
      toast.success("Budget Added Successfully");
      setAllocationData({
        department: "",
        session: "",
        used: "",
        status: "",
        allocated: "",
      });
      setChecked(!checked);
    } catch (err) {
      console.log(err);
      toast.error("Error fetching staff");
      setLoading(false);
    }
  };
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.set("department", editData.department);
    formData.set("session", editData.session);
    formData.set("allocated", editData.allocated);
    formData.set("_id", editData.id);
    try {
      setLoading(true);
      const data = await addDeptBudget(user.school, user._id, formData);
      console.log(data);
      if (data.err) {
        setLoading(false);
        return toast.error(data.err);
      }
      setLoading(false);
      toast.success("Budget Added Successfully");
      setEditData({
        department: "",
        session: "",
        used: "",
        status: "",
        allocated: "",
      });
      setEditing(false);
      setChecked(!checked);
    } catch (err) {
      console.log(err);
      toast.error("Error fetching staff");
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
    setAllocationData({
      ...allocationData,
      session: defaultSession._id,
    });
  };
  const columns = [
    {
      title: "Department",
      dataIndex: "dept",
      align: "left",
      sorter: (a, b) => a.dept > b.dept,
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
        return record.dept.toLowerCase().includes(value.toLowerCase());
      },
    },
    {
      title: "Session",
      dataIndex: "session",
      align: "left",
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
      title: "Allocated Amount",
      dataIndex: "allocated",
      align: "left",
      sorter: (a, b) => a.allocated > b.allocated,
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
        return record.allocated.toLowerCase().includes(value.toLowerCase());
      },
    },
    {
      title: "Used Amount",
      dataIndex: "used",
      align: "left",
      sorter: (a, b) => a.used > b.used,
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
        return record.used.toLowerCase().includes(value.toLowerCase());
      },
    },
    {
      title: "Status",
      dataIndex: "status",
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
  const getBudgetHandler = async () => {
    try {
      setLoading(true);
      const data = await getDeptBudget(user.school, user._id);
      console.log(data);
      if (data.err) {
        setLoading(false);
        return toast.error(data.err);
      }
      let data1 = [];
      for (let i = 0; i < data.length; i++) {
        data1.push({
          key: i,
          dept: data[i].department.name,
          session: data[i].session && data[i].session.name,
          allocated: data[i].allocated,
          used: data[i].used,
          status:data[i].allocated > data[i].used ? "Under Budget" : "Over Budget",
          action: (
            <>
              <Button
                className="btn-sm pull-right"
                color="primary"
                type="button"
                onClick={() => {
                  setEditing(true);
                  setEditData({
                    id: data[i]._id,
                    department: data[i].department._id,

                    session: data[i].session._id,
                    allocated: data[i].allocated,
                  });
                }}
                key={"edit" + 1}
              >
                <i className="fas fa-user-edit" />
              </Button>
              <Button
                className="btn-sm pull-right"
                color="danger"
                type="button"
                key={"delete" + 1}
              >
                <Popconfirm
                  title="Sure to delete?"
                  onConfirm={() => deleteBudgetHandler(data[i]._id)}
                >
                  <i className="fas fa-trash" />
                </Popconfirm>
              </Button>
            </>
          ),
        });
      }
      setTableData(data1);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      toast.error("Error getting staff budget");
      console.log(err);
    }
  };
  const deleteBudgetHandler = async (id) => {
    const formData = new FormData();
    formData.set("budget_id", id);
    try {
      setLoading(true);
      const data = await deleteDeptBudget(user.school, user._id, formData);
      console.log(data);
      if (data.err) {
        setLoading(false);
        return toast.error(data.err);
      }
      setLoading(false);
      setChecked(!checked);
      toast.success("Budget Deleted Successfully");
    } catch (err) {
      console.log(err);
      toast.error("Error in Deleting Budget");
      setLoading(false);
    }
  };

  return (
    <>
      <SimpleHeader
        name="Department Budget Allocations"
        parentName="Accounts Management"
      />
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
      ></LoadingScreen>
      <Container fluid className="mt--6">
        <Card>
          <CardHeader>
            <h2> Department Budget Allocations</h2>
          </CardHeader>
          <CardBody>
            <form onSubmit={handleSubmit}>
              <Row>
                <Col>
                  <label
                    className="form-control-label"
                    htmlFor="example4cols2Input"
                  >
                    Department
                  </label>
                  <Input
                    id="example4cols2Input"
                    type="select"
                    onChange={handleChange("department")}
                    required
                    value={allocationData.department}
                  >
                    <option value="" selected>
                      Select Department
                    </option>
                    {allDepartments?.map((dept, index) => (
                      <option key={index} value={dept._id}>
                        {dept.name}
                      </option>
                    ))}
                  </Input>
                </Col>

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
                    value={allocationData.session}
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
                  <label
                    className="form-control-label"
                    htmlFor="example4cols2Input"
                  >
                    Allocated
                  </label>
                  <Input
                    id="example4cols2Input"
                    type="number"
                    onChange={handleChange("allocated")}
                    required
                    value={allocationData.allocated}
                    placeholder="Enter Allocated Amount"
                  />
                </Col>
              
                <Col style={{display:"flex",alignItems:"center",justifyContent:"center"}}  >
                  <Button color="primary" type="submit" style={{marginTop:"2rem"}} >
                    Add
                  </Button>
                </Col>
              </Row>
            </form>
          </CardBody>
        </Card>
      </Container>
      <Container className="mt--0 shadow-lg table-responsive" fluid>
        <Card className="mb-4">
          <CardHeader>Department Budget List</CardHeader>
          <CardBody>
            <AntTable
              columns={columns}
              data={tableData}
              pagination={true}
              exportFileName="staffBudget"
            />
          </CardBody>
        </Card>
      </Container>
      <Modal
        className="modal-dialog-centered"
        isOpen={editing}
        toggle={() => setEditing(false)}
        size="lg"
      >
        <div className="modal-header">
          <h2 className="modal-title" id="modal-title-default">
            Edit Department Budget
          </h2>
          <button
            aria-label="Close"
            className="close"
            data-dismiss="modal"
            type="button"
            onClick={() => setEditing(false)}
          >
            <span aria-hidden={true}>??</span>
          </button>
        </div>
        <ModalBody>
          <form onSubmit={handleEditSubmit}>
            <Row>
              <Col>
                <label
                  className="form-control-label"
                  htmlFor="example4cols2Input"
                >
                  Department
                </label>
                <Input
                  id="example4cols2Input"
                  type="select"
                  onChange={handleEditChange("department")}
                  required
                  value={editData.department}
                >
                  <option value="" selected>
                    Select Department
                  </option>
                  {allDepartments?.map((dept, index) => (
                    <option key={index} value={dept._id}>
                      {dept.name}
                    </option>
                  ))}
                </Input>
              </Col>

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
                  onChange={handleEditChange("session")}
                  value={editData.session}
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
                <label
                  className="form-control-label"
                  htmlFor="example4cols2Input"
                >
                  Allocated
                </label>
                <Input
                  id="example4cols2Input"
                  type="number"
                  onChange={handleEditChange("allocated")}
                  required
                  value={editData.allocated}
                  placeholder="Enter Allocated Amount"
                />
              </Col>
            </Row>
            <Row className="mt-2">
              <Col style={{display:"flex",justifyContent:"center"}} >
                <Button color="primary" type="submit">
                  Update
                </Button>
              </Col>
            </Row>
          </form>
        </ModalBody>
      </Modal>
    </>
  );
};

export default DeptBudgetMaster;
