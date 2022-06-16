import React, { useState, useEffect, useRef } from "react";
import {
  Container,
  // CardHeader,
  // Table,
  Button,
  Modal,
  Card,
  ModalFooter,
  ModalBody,
  Row,
  Col,
  Input,
  Form,
  CardBody,
} from "reactstrap";
import { Table } from "ant-table-extensions";
// import { FaEdit } from "react-icons/fa";
import SimpleHeader from "components/Headers/SimpleHeader.js";
import "./styles.css";
import { toast, ToastContainer } from "react-toastify";
import { isAuthenticated } from "api/auth";
import {
  addDepartment,
  getDepartment,
  updateDepartment,
  deleteDepartment,
  getNonHeads,
} from "api/department";
import Select from "react-select";
import { Popconfirm } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import AntTable from "../tables/AntTable";
import Loader from "components/Loader/Loader";
import { fetchingDepartmentError } from "constants/errors";
import { deleteDepartmentError, fetchingStaffFailed } from "constants/errors";
import { updateDepartmentError } from "constants/errors";
import {
  updateDepartmentSuccess,
  deleteDepartmentSuccess,
} from "constants/success";
import { allSessions } from "api/session";
import { useReactToPrint } from "react-to-print";
import { allStaffs } from "api/staff";

const DepartmentList = () => {
  const { user, token } = isAuthenticated();
  const [editing, setEditing] = useState(false);
  // const [isActive, setIsActive] = useState(false);
  const [data, setData] = useState([]);
  // console.log("setData", data);
  const [classList, setClassList] = useState([]);
  const [editDepartmentName, setEditDepartmentName] = useState("");
  // const [editDepartmentModule, setEditDepartmentModule] = useState([]);
  const [deparmentId, setDepartmentId] = useState("");
  const [formData] = useState(new FormData());
  const [name, setName] = useState("");
  const [checked, setChecked] = useState(false);
  const [sessionID, setSessionID] = useState("");
  const [loading, setLoading] = useState(false);
  const [sessions, setSessions] = useState([]);
  const [selectSessionId, setSelectSessionId] = useState("");
  const [primaryHeadId, setPrimaryHeadId] = useState("");
  const [secondaryHeadId, setSecondaryHeadId] = useState("");
  // console.log("id", deparmentId);
  const [addLoading, setAddLoading] = useState(false);
  const [permissions, setPermissions] = useState([]);
  const [staff, setStaff] = useState([]);

  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  useEffect(() => {
    // console.log(user);
    if (user.permissions["Staff Management"]) {
      let permission1 = user.permissions["Staff Management"];
      // console.log(permission1);
      setPermissions(permission1);
    }
  }, [checked]);

  useEffect(() => {
    getAllStaff();
    getSession();
    // getDepartmentsData();
  }, []);
  useEffect(() => {
    getDepartmentsData();
  }, [checked]);

  const getAllStaff = async () => {
    try {
      const data = await getNonHeads(user.school, user._id);
      // console.log(data, "@@@@@@@@");
      setStaff(data);
    } catch (err) {
      toast.error(fetchingStaffFailed);
    }
  };

  useEffect(() => {
    //Datasource of antTable
    const myData = [
      { value: "ocean", label: "Ocean" },
      { value: "science", label: "Blue" },
      { value: "purple", label: "Purple" },
    ];
    setData(myData);
  }, [checked]);

  //Columns of antTable
  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      width: "30%",
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
      title: "Action",
      key: "action",
      align:"left",
      dataIndex: "action",
      width: "10%",
      fixed: "right",
    },
  ];

  //Getting Session data
  const getSession = async () => {
    const { user, token } = isAuthenticated();
    try {
      const session = await allSessions(user._id, user.school, token);
      // console.log(session);
      if (session.err) {
        return toast.error(session.err);
      } else {
        setSessions(session);
      }
    } catch (err) {
      console.log(err);
      // toast.error("Something Went Wrong!");
    }
  };

  //Getting Department Data
  function getDepartmentsData() {
    setLoading(true);
    getDepartment(user.school, user._id, token)
      .then((res) => {
        // console.log("allClass", res);
        const data = [];
        for (let i = 0; i < res.length; i++) {
          data.push({
            key: i,
            name: res[i].name,
            module: res[i].module,
            action: (
              <h5 key={i + 1} className="mb-0">
                {/* {permissions && permissions.includes("edit") && ( */}
                <Button
                  className="btn-sm pull-right"
                  color="primary"
                  type="button"
                  onClick={() =>
                    rowHandler(res[i]._id, res[i].name, res[i].module)
                  }
                  key={"edit" + i + 1}
                >
                  <i className="fas fa-user-edit" />
                </Button>
                {/* )} */}
                {/* {permissions && permissions.includes("delete") && ( */}
                <Button
                  className="btn-sm pull-right"
                  color="danger"
                  type="button"
                  key={"delete" + i + 1}
                >
                  <Popconfirm
                    title="Sure to delete?"
                    onConfirm={() => handleDelete(res[i]._id)}
                  >
                    <i className="fas fa-trash" />
                  </Popconfirm>
                </Button>
                {/* )} */}
              </h5>
            ),
          });
        }
        setClassList(data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        toast.error(fetchingDepartmentError);
        setLoading(false);
      });
  }

  //Getting values from fetch
  function rowHandler(id, name, module) {
    // e.stopPropagation();
    setEditing(true);
    setEditDepartmentName(name);
    // setEditDepartmentModule(module);
    setDepartmentId(id);
  }

  //Delete Department
  async function handleDelete(deparmentId) {
    const { user, token } = isAuthenticated();
    try {
      setLoading(true);
      await deleteDepartment(deparmentId, user._id, token);
      setLoading(false);
      setChecked(!checked);
      toast.success(deleteDepartmentSuccess);
    } catch (err) {
      toast.error(deleteDepartmentError);
      setLoading(false);
    }
  }

  // Getting value up Edit Department
  const handleChangeEdit = (value) => {
    var b = [];
    value.map((items) => {
      b.push([items.value, items.label]);
    });
    // console.log("b", b);
    formData.set("module", JSON.stringify(b));
  };

  //Edit Department
  async function handleEdit() {
    try {
      const { user, token } = isAuthenticated();
      formData.set("name", editDepartmentName);
      // formData.set("module", JSON.stringify(editDepartmentModule));
      setLoading(true);
      const updateDepartments = await updateDepartment(
        deparmentId,
        user._id,
        token,
        formData
      );
      // console.log("updateDepartments", updateDepartments);
      setEditing(false);
      setChecked(!checked);
      setLoading(false);
      toast.success(updateDepartmentSuccess);
    } catch (err) {
      setLoading(false);
      toast.error(updateDepartmentError);
    }
  }

  //Getting value of Department
  const handleChange = (value) => {
    var a = [];
    value.map((items) => {
      a.push([items.value, items.label]);
    });
    // console.log("a", a);
    // formData.set("module", JSON.stringify(a));
  };

  //Create department
  const handleFormChange = async (e) => {
    e.preventDefault();
    // console.log("here");
    // const role = [primaryHeadId, secondaryHeadId];
    const { user, token } = isAuthenticated();
    try {
      formData.set("school", user.school);
      formData.set("name", name);
      formData.set("session", sessionID);
      // formData.set("role", JSON.stringify(role));
      // formData.set("module", JSON.stringify(data));
      setAddLoading(true);
      const createDepartment = await addDepartment(user._id, token, formData);
      if (createDepartment.err) {
        setAddLoading(false);
        return toast.error(createDepartment.err);
      }
      setAddLoading(false);
      setChecked(!checked);
      setName("");
      setSessionID("");
      setPrimaryHeadId("");
      setSecondaryHeadId("");
      setSelectSessionId("");
      toast.success("Deparment Added Successfully");
    } catch (err) {
      setAddLoading(false);
      toast.error("Something Went Wrong!");
    }
  };

  return (
    <>
      <SimpleHeader name="Department List" parentName="Department Management" />
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
            permissions &&
            permissions.includes("add") && (
              <Col lg="3">
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

                            <select
                              className="form-control"
                              required
                              onChange={(e) => setSessionID(e.target.value)}
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
                        <br />
                        <Row>
                          <Col>
                            <label
                              className="form-control-label"
                              htmlFor="example4cols2Input"
                            >
                              Department Name
                            </label>
                            <Input
                              id="example4cols2Input"
                              placeholder="Department Name"
                              type="text"
                              onChange={(e) => setName(e.target.value)}
                              required
                            />
                          </Col>
                        </Row>
                        <Row className="mt-4 float-right">
                          <Col>
                            <Button
                              color="primary"
                              type="submit"
                              style={{
                                display: "flex",
                                justifyContent: "center",
                              }}
                            >
                              Submit
                            </Button>
                          </Col>
                        </Row>
                      </CardBody>
                    </Form>
                  </Card>
                </div>
              </Col>
            )
          )}

          <Col>
            <div className="card-wrapper">
              <Card>
                <CardBody>
                  {!loading && classList ? (
                    permissions && permissions.includes("export") ? (
                      <>
                        <Button
                          color="primary"
                          className="mb-2"
                          onClick={handlePrint}
                          style={{ float: "right" }}
                        >
                          Print
                        </Button>
                        <div ref={componentRef}>
                          <AntTable
                            columns={columns}
                            data={classList}
                            pagination={true}
                            exportFileName="ClassDetails"
                          />
                        </div>
                      </>
                    ) : (
                      <Table
                        style={{ whiteSpace: "pre" }}
                        columns={columns}
                        dataSource={classList}
                        pagination={true}
                      />
                    )
                  ) : (
                    <Loader />
                  )}
                </CardBody>
              </Card>
            </div>
          </Col>
        </Row>

        {/* editDepartment */}
        <Modal
          isOpen={editing}
          toggle={() => setEditing(false)}
          size="lg"
          style={{ height: "50vh" }}
          scrollable
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
          <ModalBody>
            <Row>
              <Col>
                <label className="form-control-label">Department Name</label>
                <Input
                  id="form-department-name"
                  value={editDepartmentName}
                  onChange={(e) => setEditDepartmentName(e.target.value)}
                  placeholder="School Address"
                  type="text"
                />
              </Col>
            </Row>
          </ModalBody>
          <ModalFooter>
            <Button color="success" type="button" onClick={handleEdit}>
              Save changes
            </Button>
          </ModalFooter>
        </Modal>
      </Container>
    </>
  );
};

export default DepartmentList;
