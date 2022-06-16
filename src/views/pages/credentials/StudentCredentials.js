import React, { useEffect, useState } from "react";

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
  Modal,
  ModalFooter,
  ModalBody,
  CardHeader,
  Table,
} from "reactstrap";
import PasswordField from "./PasswordField";
import Loader from "components/Loader/Loader";
import { allStudents, filterStudent } from "api/student";
import SimpleHeader from "components/Headers/SimpleHeader.js";
import { isAuthenticated } from "api/auth";
import { toast, ToastContainer } from "react-toastify";
import { allSessions } from "api/session";
import {
  allStudentCredentials,
  studentPasswordEdit,
  parentPasswordEdit,
} from "api/credentials";

import { SearchOutlined } from "@ant-design/icons";
import AntTable from "../tables/AntTable";
import ReactPaginate from "react-paginate";
import { useReactToPrint } from "react-to-print";

import { allClass } from "api/class";

const StudentCredentials = () => {
  const { user, token } = isAuthenticated();
  const [classList, setClassList] = useState([]);

  const [students, setStudents] = useState([]);
  const [selectedClass, setSelectedClass] = useState({});
  const [loading, setLoading] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [viewLoading, setViewLoading] = useState(false);
  const [searchData, setSearchData] = useState({
    class: "",
    section: "",
  });
  const [selectEdit, setSelectEdit] = useState("");
  const [view, setView] = useState(0);
  const [editing, setEditing] = useState(false);
  const [credentials, setCredentials] = useState([]);
  const [editStudentSID, setEditStudentSID] = useState("");
  const [editStudentPassword, setEditStudentPassword] = useState("");
  const [editParentSID, setEditParentSID] = useState("");
  const [editParentPassword, setEditParentPassword] = useState("");
  const [viewCredentials, setViewCredentials] = useState(false);

  const [showStudentPassword, setShowStudentPassword] = useState(false);

  useEffect(() => {
    getAllClasses();
  }, []);

  const getAllClasses = async () => {
    try {
      setLoading(true);
      const classess = await allClass(user._id, user.school, token);
      // console.log("classes", classess);
      if (classess.err) {
        setLoading(false);
        return toast.error(classess.err);
      }
      setClassList(classess);
      // setLoading(true);
      // toast.success(fetchingClassSuccess)
      setLoading(false);
    } catch (err) {
      toast.error("Fetching Classes Failed");
    }
  };

  const columns = [
    {
      title: "Student SID",
      dataIndex: "sid",
      sorter: (a, b) => a.sid > b.sid,
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
        return record.sid.toLowerCase().includes(value.toLowerCase());
      },
    },
    {
      title: " Student Password",
      dataIndex: "password",
      sorter: (a, b) => a.password > b.password,
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
        return record.password.toLowerCase().includes(value.toLowerCase());
      },
      render: (value) => (
       <PasswordField value={value} />
      ),
    },

    {
      title: "Parent SID",
      dataIndex: "parentId",
      sorter: (a, b) => a.parentId > b.parentId,
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
        return record.parentId.toLowerCase().includes(value.toLowerCase());
      },
    },
    {
      title: "Parent Password",
      dataIndex: "parentPassword",
      sorter: (a, b) => a.parentPassword > b.parentPassword,
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
        return record.parentPassword
          .toLowerCase()
          .includes(value.toLowerCase());
      },
      render: (value) => (
        <PasswordField value={value} />
       ),
    },
    {
      title: "Action",
      key: "action",
      dataIndex: "action",
      fixed: "right",
    },
  ];

  useEffect(() => {
    if (selectEdit === "") {
      setView(0);
    } else if (selectEdit === "student") {
      setView(1);
    } else if (selectEdit === "parent") {
      setView(2);
    }
  }, [selectEdit]);

  // let formData = new FormData();
  const handleChange = (name) => (event) => {
    console.log(name, event.target.value);

    setSearchData({ ...searchData, [name]: event.target.value });
    // console.log(name);
    if (name === "class") {
      // console.log("@@@@@@@@=>", event.target.value);

      let selectedClass = classList.find(
        (item) => item._id.toString() === event.target.value.toString()
      );
      // console.log(selectedClass);
      setSelectedClass(selectedClass);
    }
  };

  const searchHandler = async () => {
    const formData = {
      section: searchData.section,
      class: searchData.class,
    };

    try {
      // setViewLoading(true);
      setLoading(true);
      const data = await filterStudent(user.school, user._id, formData);
      console.log(data);
      let tableData = [];
      for (let i = 0; i < data.length; i++) {
        tableData.push({
          key: i,
          sid: data[i].SID,
          password: data[i].temp,
          parentId: data[i].parent_SID,
          parentPassword: data[i].parent_temp,
          action: (
            <h5 key={i + 1} className="mb-0">
              <Button
                className="btn-sm pull-right"
                color="primary"
                type="button"
                onClick={() => {
                  setEditing(true);
                  setEditStudentPassword(data[i].temp);
                  setEditStudentSID(data[i].SID);
                  setEditParentSID(data[i].parent_SID);
                  setEditParentPassword(data[i].parent_temp);
                }}
                key={"edit" + i + 1}
              >
                <i className="fas fa-user-edit" />
              </Button>
              <Button
                className="btn-sm pull-right"
                color="success"
                type="button"
                key={"email" + i + 1}
              >
                Send Email
              </Button>
            </h5>
          ),
        });
      }
      setCredentials(tableData);
      setViewCredentials(true);
      // setViewLoading(false);
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
      // setViewLoading(false);
      toast.error("Fetching Student Credentials Failed");
    }
  };

  const handleEdit = async () => {
    if (selectEdit === "") {
      return;
    } else if (selectEdit === "student") {
      const formData = new FormData();
      formData.set("SID", editStudentSID);
      formData.set("password", editStudentPassword);
      try {
        setEditLoading(true);
        const data = await studentPasswordEdit(user._id, formData);
        console.log(data);
        searchHandler();
        toast.success("Student Password Updated");
        setEditLoading(false);
        setEditing(false);
      } catch (err) {
        setEditLoading(false);
        console.log(err);
        toast.error("Student Password Update Failed");
        setEditing(false);
      }
    } else if (selectEdit === "parent") {
      const formData = new FormData();
      formData.set("SID", editParentSID);
      formData.set("password", editParentPassword);
      try {
        setEditLoading(true);
        const data = await parentPasswordEdit(user._id, formData);
        console.log(data);
        searchHandler();
        toast.success("Parent Password Updated");
        setEditLoading(false);
        setEditing(false);
      } catch (err) {
        setEditLoading(false);
        console.log(err);
        toast.error("Parent Password Update Failed");
        setEditing(false);
      }
    }
  };

  return (
    <>
      <SimpleHeader name="Add Student" parentName="Student Management" />
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

      <Container className="mt--6 shadow-lg" fluid>
        {loading ? (
          <Loader />
        ) : (
          <Card>
            <CardBody>
              <Row className="d-flex justify-content-center mb-4">
                <Col md="6">
                  <Label
                    className="form-control-label"
                    htmlFor="xample-date-input"
                  >
                    Select Class
                  </Label>
                  <Input
                    className="form-control-sm"
                    id="exampleFormControlSelect3"
                    type="select"
                    onChange={handleChange("class")}
                    value={searchData.class}
                    required
                  >
                    <option value="">Select Class</option>
                    {classList &&
                      classList.map((clas, index) => {
                        // setselectedClassIndex(index)
                        // console.log(clas);
                        return (
                          <option value={clas._id} key={index}>
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
                    className="form-control-sm"
                    id="exampleFormControlSelect3"
                    type="select"
                    onChange={handleChange("section")}
                    value={searchData.section}
                    required
                  >
                    <option value="">Select Section</option>
                    {selectedClass.section &&
                      selectedClass.section.map((section) => {
                        // console.log(section.name);
                        return (
                          <option
                            value={section._id}
                            key={section._id}
                            selected
                          >
                            {section.name}
                          </option>
                        );
                      })}
                  </Input>
                </Col>

                <Col className="mt-4">
                  <Button color="primary" onClick={searchHandler}>
                    Search
                  </Button>
                </Col>
              </Row>
            </CardBody>
          </Card>
        )}
      </Container>
      <Container className="mt--0 shadow-lg table-responsive" fluid>
        {viewCredentials &&
          (viewLoading ? (
            <Loader />
          ) : (
            <Card className="mb-4">
              <CardHeader></CardHeader>
              <CardBody>
                <AntTable
                  columns={columns}
                  data={credentials}
                  pagination={true}
                  exportFileName="credentials"
                />
              </CardBody>
            </Card>
          ))}
      </Container>
      <Modal
        className="modal-dialog-centered"
        isOpen={editing}
        toggle={() => setEditing(false)}
        size="lg"
      >
        <div className="modal-header">
          <h2 className="modal-title" id="modal-title-default">
            Edit
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
          <>
            <ModalBody>
              <Row className="mb-2">
                <Col>
                  {/* <label className="form-control-label">Select Person</label> */}
                  <Input
                    id="form-class-name"
                    value={selectEdit}
                    onChange={(e) => setSelectEdit(e.target.value)}
                    placeholder="Class Name"
                    type="select"
                  >
                    <option value="">Select</option>
                    <option value="student">Student</option>
                    <option value="parent">Parent</option>
                  </Input>
                </Col>
              </Row>
              {view === 1 && (
                <Row>
                  <Col>
                    <label className="form-control-label">
                      Student Password
                    </label>
                    <Input
                      id="form-abbreviation-name"
                      value={editStudentPassword}
                      onChange={(e) => setEditStudentPassword(e.target.value)}
                      placeholder="Student Password"
                      type="text"
                    />
                  </Col>
                </Row>
              )}
              {view === 2 && (
                <Row>
                  <Col>
                    <label className="form-control-label">
                      Parent Password
                    </label>
                    <Input
                      id="form-abbreviation-name"
                      value={editParentPassword}
                      onChange={(e) => setEditParentPassword(e.target.value)}
                      placeholder="Parent Password"
                      type="text"
                    />
                  </Col>
                </Row>
              )}
            </ModalBody>
            <ModalFooter>
              {view !== 0 && (
                <Button color="success" type="button" onClick={handleEdit}>
                  Save Password
                </Button>
              )}
            </ModalFooter>
          </>
        )}
      </Modal>
    </>
  );
};

export default StudentCredentials;
