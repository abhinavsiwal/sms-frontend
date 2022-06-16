import React, { useEffect, useState } from "react";
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
  CardHeader,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
} from "reactstrap";
import SimpleHeader from "components/Headers/SimpleHeader";
import { isAuthenticated } from "api/auth";
import { ToastContainer, toast } from "react-toastify";
import {
  allSubjects,
  addSubject,
  updateSubject,
  deleteSubject,
} from "api/subjects";
import AntTable from "../tables/AntTable";
import { SearchOutlined } from "@ant-design/icons";
import { Popconfirm } from "antd";
import Loader from "components/Loader/Loader";

//React-select
import Select from "react-select";

import { allSessions } from "api/session";
import { useReactToPrint } from "react-to-print";
const AddSubject = () => {
  const [subjectList, setSubjectList] = useState([]);
  const [subjectList1, setSubjectList1] = useState([]);
  const [reload, setReload] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editSubjectName, setEditSubjectName] = useState("");
  const [subjectId, setSubjectId] = useState("");
  const [checked, setChecked] = useState(false);
  const [sessions, setSessions] = useState([]);
  const [type, setType] = useState("");
  const [inputFields, setInputFields] = useState([{ subjectName: "" }]);
  const [editInputFields, setEditInputFields] = useState([]);
  const { user, token } = isAuthenticated();
  const [groupName, setGroupName] = useState("");
  const [file, setFile] = useState();
  const [view, setView] = useState(0);
  const [addLoading, setAddLoading] = useState(false);
  const [permissions, setPermissions] = useState([]);
  const fileReader = new FileReader();
  const [groupEditing, setGroupEditing] = useState(false);
  const [editGroupName, setEditGroupName] = useState("");
  const [editGroupId, setEditGroupId] = useState("");
  const [editGroupSubjects, setEditGroupSubjects] = useState([]);
  const [disabled, setDisabled] = useState(true);

  const handleOnChange = (e) => {
    setFile(e.target.files[0]);
  };

  const componentRef = React.useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  let permission1 = [];
  useEffect(() => {
    if (user.permissions["Class, section and subject master"]) {
      permission1 = user.permissions["Class, section and subject master"];
      setPermissions(permission1);
    }
  }, [checked, reload]);

  useEffect(() => {
    getAllClasses();
    getSession();
  }, [reload, checked]);

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

  const [subjectData, setSubjectData] = useState({
    type: "",
    name: "",
    session: "",
  });

  //Delete Subject
  const handleDelete = async (subjectId) => {
    // console.log("delete");
    const { user, token } = isAuthenticated();
    try {
      setLoading(true);
      await deleteSubject(subjectId, user._id, token);
      setChecked(!checked);
      setLoading(false);
    } catch (err) {
      toast.error("Something Went Wrong!");
      setLoading(false);
    }
  };

  const rowHandler = (id, name) => {
    // console.log(id);
    setEditing(true);
    setEditSubjectName(name);
    setSubjectId(id);
  };

  const handleChangeSubject = (index, event) => {
    // console.log(index, event.target.value);
    const values = [...inputFields];
    values[index][event.target.name] = event.target.value;
    setInputFields(values);
  };
  const handleChangeEditSubject = (index, event) => {
    console.log(index, event.target.value);
    const values = [...editInputFields];
    values[index][event.target.name] = event.target.value;
    setEditInputFields(values);
  };
  //Edit Subject
  const handleEdit = async () => {
    try {
      formData.set("name", editSubjectName);
      setLoading(true);
      const updatedSubject = await updateSubject(
        subjectId,
        user._id,
        token,
        formData
      );
      // console.log("updateSubject", updatedSubject);
      if (updatedSubject.err) {
        setLoading(false);
        return toast.error(updatedSubject.err);
      } else {
        setEditing(false);
        setChecked(!checked);
        setLoading(false);
      }
    } catch (err) {
      toast.error(err);
      setLoading(false);
    }
  };

  const handleEditGroupSubmit = async () => {
    const formData = new FormData();
    formData.set("name", editGroupName);
    let list = [];
    for (const key in editInputFields) {
      // console.log(inputFields[key].subjectName);
      list.push(editInputFields[key].subjectName);
    }
    console.log(list);

    formData.set("list", JSON.stringify(list));

    try {
      setLoading(true);
      const updatedSubject = await updateSubject(
        editGroupId,
        user._id,
        token,
        formData
      );
      // console.log("updateSubject", updatedSubject);
      if (updatedSubject.err) {
        setLoading(false);
        return toast.error(updatedSubject.err);
      } else {
        setGroupEditing(false);
        setChecked(!checked);
        setLoading(false);
      }
    } catch (err) {
      toast.error(err);
      setLoading(false);
    }
  };

  const [formData] = useState(new FormData());
  const handleChange = (name) => (event) => {
    formData.set(name, event.target.value);
    setSubjectData({ ...subjectData, [name]: event.target.value });
  };

  const handleFormChange = async (e) => {
    e.preventDefault();
    // console.log(inputFields);

    const { user, token } = isAuthenticated();
    formData.set("school", user.school);
    if (subjectData.name.length > 0) {
      formData.set("name", subjectData.name);
    } else {
      formData.set("name", groupName);
      let list = [];
      for (const key in inputFields) {
        // console.log(inputFields[key].subjectName);
        list.push(inputFields[key].subjectName);
      }
      console.log(list);
      formData.set("list", JSON.stringify(list));
    }

    try {
      setLoading(true);
      setAddLoading(true);
      const subject = await addSubject(user._id, token, formData);
      if (subject.err) {
        setLoading(false);
        setAddLoading(false);
        return toast.error(subject.err);
      }
      setSubjectData({
        type: "",
        name: "",
        session: "",
      });
      setChecked(!checked);
      setAddLoading(false);
      setLoading(false);
      setInputFields([{ subjectName: "" }]);
      setGroupName("");
      toast.success("Subject added successfully");
      setReload(true);
    } catch (err) {
      toast.error("Something Went Wrong");
      setAddLoading(false);
      setLoading(false);
    }
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

  const columns = [
    {
      title: "Subject",
      dataIndex: "name",
      key: "subjects",
      align: "left",
      // width: "90%",
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
      align: "left",
      dataIndex: "action",
      fixed: "right",
    },
  ];

  const columns1 = [
    {
      title: "Group Name",
      dataIndex: "groupName",
      key: "groupName",
      align: "left",
      // width: "90%",
      sorter: (a, b) => a.groupName > b.groupName,
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
        return record.groupName.toLowerCase().includes(value.toLowerCase());
      },
    },
    {
      title: "Subjects",
      dataIndex: "subjects",
      key: "subjects",
      align: "left",
      // width: "90%",
      sorter: (a, b) => a.subjects > b.subjects,
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
      render: (subjects) => (
        <>
          {subjects.map((subject) => {
            let subject1 = JSON.stringify(subject);

            return <p>{subject1}</p>;
          })}
        </>
      ),
    },
    {
      title: "Action",
      key: "action",
      align: "left",
      dataIndex: "action",
      fixed: "right",
    },
  ];

  const getAllClasses = () => {
    setLoading(true);
    allSubjects(user._id, user.school, token)
      .then((res) => {
        console.log(res);
        setLoading(true);
        // console.log("res", res);
        let data = [];
        let data1 = [];

        for (let i = 0; i < res.length; i++) {
          if (res[i].list.length > 0) {
            // console.log("here");
            data1.push({
              key: i,
              groupName: res[i].name,
              subjects: res[i].list,
              action: (
                <h5 key={i + 1} className="mb-0">
                  {permission1 && permission1.includes("edit") && (
                    <Button
                      className="btn-sm pull-right"
                      color="primary"
                      type="button"
                      key={"edit" + i + 1}
                      onClick={() => groupRowHandler(res[i])}
                    >
                      <i className="fas fa-user-edit" />
                    </Button>
                  )}
                  {permission1 && permission1.includes("delete") && (
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
                  )}
                </h5>
              ),
            });
          } else {
            data.push({
              key: i,
              name: res[i].name,
              action: (
                <h5 key={i + 1} className="mb-0">
                  {permission1 && permission1.includes("edit") && (
                    <Button
                      className="btn-sm pull-right"
                      color="primary"
                      type="button"
                      key={"edit" + i + 1}
                      onClick={() => rowHandler(res[i]._id, res[i].name)}
                    >
                      <i className="fas fa-user-edit" />
                    </Button>
                  )}
                  {permission1 && permission1.includes("delete") && (
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
                  )}
                </h5>
              ),
            });
          }
        }
        setSubjectList(data);
        setSubjectList1(data1);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };

  const groupRowHandler = (data) => {
    console.log(data);
    setGroupEditing(true);
    setEditGroupName(data.name);
    setEditGroupId(data._id);
    let subjects = data.list;
    let subjects1 = [];
    for (let i = 0; i < subjects.length; i++) {
      subjects1.push({ subjectName: subjects[i] });
    }
    setEditInputFields(subjects1);
  };

  const handleAddFields = () => {
    setInputFields([...inputFields, { subjectName: "" }]);
  };
  const handleEditAddFields = () => {
    setEditInputFields([...editInputFields, { subjectName: "" }]);
  };
  const handleRemoveFields = (index) => {
    const values = [...inputFields];
    values.splice(index, 1);
    setInputFields(values);
  };
  const handleEditRemoveFields = (index) => {
    const values = [...editInputFields];
    values.splice(index, 1);
    setEditInputFields(values);
  };

  return (
    <>
      <SimpleHeader name="Add Subject" parentName="Class Management" />
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
          <Col lg="4">
            {addLoading ? (
              <Loader />
            ) : (
              permissions &&
              permissions.includes("add") && (
                <div className="card-wrapper">
                  <Card>
                    <Row>
                      <Col className="d-flex justify-content-center mt-2 ml-4">
                        <form>
                          <input
                            type={"file"}
                            id={"csvFileInput"}
                            accept={".csv"}
                            onChange={handleOnChange}
                          />

                          <Button
                            onClick={(e) => {
                              handleOnSubmit(e);
                            }}
                            color="primary"
                            className="mt-2"
                          >
                            IMPORT CSV
                          </Button>
                        </form>
                      </Col>
                    </Row>
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
                              onChange={handleChange("session")}
                            >
                              <option>Select Session</option>
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
                              Select type
                            </label>
                            <Input
                              id="exampleFormControlSelect3"
                              type="select"
                              // onChange={(e) => setType(e.target.value)}
                              onChange={handleChange("type")}
                              value={subjectData.type}
                              required
                            >
                              <option value="" disabled selected>
                                Select type
                              </option>
                              <option>Single</option>
                              <option>Group</option>
                            </Input>
                          </Col>
                        </Row>
                        {subjectData.type === "Single" && (
                          <>
                            <Row>
                              <Col>
                                <label
                                  className="form-control-label"
                                  htmlFor="example4cols2Input"
                                >
                                  Subject
                                </label>
                                <Input
                                  id="example4cols2Input"
                                  placeholder="Subject"
                                  type="text"
                                  onChange={handleChange("name")}
                                  value={subjectData.name}
                                  required
                                />
                              </Col>
                            </Row>
                          </>
                        )}
                        {subjectData.type === "Group" && (
                          <>
                            <Row>
                              <Col>
                                <label
                                  className="form-control-label"
                                  htmlFor="example4cols2Input"
                                >
                                  Group Name
                                </label>
                                <Input
                                  id="example4cols2Input"
                                  placeholder="Group Name"
                                  type="text"
                                  onChange={(e) => setGroupName(e.target.value)}
                                  value={groupName}
                                  required
                                />
                              </Col>
                            </Row>
                            <Row>
                              <Col>
                                <label
                                  className="form-control-label"
                                  htmlFor="example4cols2Input"
                                >
                                  Subject
                                </label>
                                {inputFields.map((inputField, index) => {
                                  return (
                                    <div key={index}>
                                      <InputGroup className="mb-2">
                                        <Input
                                          name="subjectName"
                                          id="example4cols2Input"
                                          placeholder="Subject"
                                          type="text"
                                          value={inputField.subjectName}
                                          onChange={(event) =>
                                            handleChangeSubject(index, event)
                                          }
                                        />
                                        <InputGroupAddon addonType="append">
                                          <InputGroupText
                                            style={{
                                              cursor: "pointer",
                                              backgroundColor: "red",
                                            }}
                                            onClick={() =>
                                              handleRemoveFields(index)
                                            }
                                          >
                                            <i
                                              className="ni ni-fat-remove"
                                              style={{
                                                color: "white",
                                                fontSize: "1.3rem",
                                              }}
                                            />
                                          </InputGroupText>
                                        </InputGroupAddon>
                                      </InputGroup>
                                    </div>
                                  );
                                })}
                                <Button
                                  color="primary"
                                  style={{
                                    height: "1rem",
                                    width: "4rem",
                                    fontSize: "0.5rem",
                                    display: "flex",
                                    alignItems: "center",
                                    marginTop: "0.7rem",
                                    marginBottom: "0.7rem",
                                  }}
                                  onClick={handleAddFields}
                                >
                                  Add
                                </Button>
                              </Col>
                            </Row>
                          </>
                        )}
                        <Row className="mt-4">
                          <Col
                            style={{
                              display: "flex",
                              justifyContent: "center",
                            }}
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
              )
            )}
          </Col>
          <Col>
            <div className="card-wrapper">
              <Card>
                <CardHeader>
                  <div>
                    <Button
                      color={`${view === 0 ? "warning" : "primary"}`}
                      type="button"
                      onClick={() => {
                        setView(0);
                      }}
                    >
                      Single
                    </Button>{" "}
                    <Button
                      color={`${view === 1 ? "warning" : "primary"}`}
                      type="button"
                      onClick={() => {
                        setView(1);
                      }}
                    >
                      Group
                    </Button>
                  </div>
                </CardHeader>
                <CardBody>
                  <Button
                    color="primary"
                    className="mb-2"
                    onClick={handlePrint}
                    style={{ float: "right" }}
                  >
                    Print
                  </Button>
                  {loading ? (
                    <Loader />
                  ) : (
                    <>
                      {view === 0 ? (
                        <>
                          <div ref={componentRef}>
                            <AntTable
                              columns={columns}
                              data={subjectList}
                              pagination={true}
                              exportFileName="SubjectDetails"
                            />
                          </div>
                        </>
                      ) : (
                        <>
                          <div ref={componentRef}>
                            <AntTable
                              columns={columns1}
                              data={subjectList1}
                              pagination={true}
                              exportFileName="SubjectDetails"
                            />
                          </div>
                        </>
                      )}
                    </>
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
          <ModalBody>
            <Row>
              <Col>
                <label className="form-control-label">Subject Name</label>
                <Input
                  id="form-class-name"
                  value={editSubjectName}
                  onChange={(e) => setEditSubjectName(e.target.value)}
                  placeholder="Subject Name"
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
        <Modal
          className="modal-dialog-centered"
          isOpen={groupEditing}
          toggle={() => setGroupEditing(false)}
          size="lg"
        >
          <div className="modal-header">
            <h2 className="modal-title" id="modal-title-default">
              Edit Subject
            </h2>
            <button
              aria-label="Close"
              className="close"
              data-dismiss="modal"
              type="button"
              onClick={() => setGroupEditing(false)}
            >
              <span aria-hidden={true}>×</span>
            </button>
          </div>
          <ModalBody>
            <Row>
              <Col>
                <label className="form-control-label">Group Name</label>
                <Input
                  id="form-class-name"
                  value={editGroupName}
                  onChange={(e) => setEditGroupName(e.target.value)}
                  placeholder="Subject Name"
                  type="text"
                />
              </Col>
            </Row>
            <Row>
              <Col>
                <label
                  className="form-control-label"
                  htmlFor="example4cols2Input"
                >
                  Subject
                </label>
                {editInputFields.map((inputField, index) => {
                  return (
                    <div key={index}>
                      <InputGroup className="mb-2">
                        <Input
                          name="subjectName"
                          id="example4cols2Input"
                          placeholder="Subject"
                          type="text"
                          value={inputField.subjectName}
                          onChange={(event) =>
                            handleChangeEditSubject(index, event)
                          }
                        />
                        <InputGroupAddon addonType="append">
                          <InputGroupText
                            style={{
                              cursor: "pointer",
                              backgroundColor: "red",
                            }}
                            onClick={() => handleEditRemoveFields(index)}
                          >
                            <i
                              className="ni ni-fat-remove"
                              style={{
                                color: "white",
                                fontSize: "1.3rem",
                              }}
                            />
                          </InputGroupText>
                        </InputGroupAddon>
                      </InputGroup>
                    </div>
                  );
                })}
                <Button
                  color="primary"
                  style={{
                    height: "1rem",
                    width: "4rem",
                    fontSize: "0.5rem",
                    display: "flex",
                    alignItems: "center",
                    marginTop: "0.7rem",
                    marginBottom: "0.7rem",
                  }}
                  onClick={handleEditAddFields}
                >
                  Add
                </Button>
              </Col>
            </Row>
          </ModalBody>
          <ModalFooter>
            <Button
              color="success"
              type="button"
              onClick={handleEditGroupSubmit}
            >
              Save changes
            </Button>
          </ModalFooter>
        </Modal>
      </Container>
    </>
  );
};

export default AddSubject;
