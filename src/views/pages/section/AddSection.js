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
import SimpleHeader from "components/Headers/SimpleHeader";
import { useReducer, useSelector } from "react";
import { isAuthenticated } from "api/auth";
import { allClass } from "api/class";
import {
  allSections,
  addSection,
  addClassToSection,
  deleteSection,
  editSection,
} from "api/sections";
import { allSubjects } from "api/subjects";
import { ToastContainer, toast } from "react-toastify";
import Select from "react-select";
import AntTable from "../tables/AntTable";
import { SearchOutlined } from "@ant-design/icons";
import Loader from "components/Loader/Loader";

import { allSessions } from "api/session";
import { useReactToPrint } from "react-to-print";
import { Popconfirm } from "antd";

import {
  fetchingClassError,
  fetchingSectionError,
  fetchingSubjectError,
  addSectionError,
  deleteSectionError,
} from "constants/errors";
import { deleteSectionSuccess, addSectionSuccess } from "constants/success";

import FixRequiredSelect from "../../../components/FixRequiredSelect";
import BaseSelect from "react-select";
import { useDispatch } from "react-redux";
import { setClass } from "store/reducers/class";

const AddSection = () => {
  const [sectionList, setSectionList] = useState([]);
  // console.log("sectionList", sectionList);
  const [classList, setClassList] = useState([]);
  const [roleOptions, setRoleOptions] = useState([]);
  const [reload, setReload] = useState(false);
  const [loading, setLoading] = useState(false);
  const [checked, setChecked] = useState(false);
  const [sessions, setSessions] = useState([]);
  const { user, token } = isAuthenticated();
  const [tableClassSelectId, setTableClassSelectId] = useState("empty");
  const [file, setFile] = useState();
  const [editing, setEditing] = useState(false);
  const fileReader = new FileReader();
  const [clas, setClas] = useState("");
  const dispatch = useDispatch();
  const [editingSectionName, setEditingSectionName] = useState("");
  const [editingAbbv, setEditingAbbv] = useState("");
  const [editingClassId, setEditingClassId] = useState("");
  const [editingSectionId, setEditingSectionId] = useState("");
  const [editingSubjectList, setEditingSubjectList] = useState([]);
  const [initialSubject, setInitialSubject] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [addLoading, setAddLoading] = useState(false);
  const [classId, seClassId] = useState("");
  const [isData, setisData] = useState(false);
  useEffect(() => {
    if (user.permissions["Class, section and subject master"]) {
      let permissions1 = user.permissions["Class, section and subject master"];
      // console.log(permissions);
      setPermissions(permissions1);
    }
  }, [checked, tableClassSelectId]);

  useEffect(() => {
    getSession();
  }, []);

  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });
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

  const columns = [
    {
      title: "Section",
      dataIndex: "name",
      align: "left",
      width: 150,
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
      title: "Section Abbreviation",
      dataIndex: "abbreviation",
      align: "left",
      width: 150,
      sorter: (a, b) => a.abbreviation > b.abbreviation,
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
        return record.abbreviation.toLowerCase().includes(value.toLowerCase());
      },
    },
    {
      title: "Subject",
      dataIndex: "subject",
      align: "left",
      width: 150,
      sorter: (a, b) => a.subject > b.subject,
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
        return record.subject.toLowerCase().includes(value.toLowerCase());
      },
      render: (subject) => subject.map((sub) => sub.name).join(),
    },
    {
      title: "Class Teacher",
      dataIndex: "class_teacher",
      align: "left",
      width: 150,
      sorter: (a, b) => a.class_teacher > b.class_teacher,
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
        return record.class_teacher.toLowerCase().includes(value.toLowerCase());
      },
    },
    {
      title: "Action",
      key: "action",
      dataIndex: "action",
      align: "left",
      fixed: "right",
    },
  ];

  useEffect(() => {
    getAllClasses();
    getAllSections();
  }, [checked]);

  const getAllSections = () => {
    // All Sections
    allSections(user._id, user.school, token)
      .then((res) => {
        // console.log("section", res);
      })
      .catch((err) => {
        // console.log(err);
        toast.error(fetchingSectionError);
      });
  };

  const getAllClasses = async () => {
    try {
      let res = await allClass(user._id, user.school, token);
      await setClassList(res);
      console.log(res);
      dispatch(setClass(res));
      // setLoading(true);
    } catch (err) {
      console.log(err);
      toast.error(fetchingClassError);
    }

    // All Subjects
    allSubjects(user._id, user.school, token)
      .then((res) => {
        // console.log("sub", res);
        const options = [];
        for (let i = 0; i < res.length; i++) {
          options.push({
            // value: res[0].list[i],
            // label: res[0].list[i],
            value: res[i]._id,
            label: res[i].name,
          });
        }
        setRoleOptions(options);
      })
      .catch((err) => {
        console.log(err);
        toast.error(fetchingSubjectError);
      });
  };

  useEffect(() => {
    if (tableClassSelectId) {
      tableData();
    }
  }, [tableClassSelectId, checked]);

  const tableData = async () => {
    // console.log(tableClassSelectId);
    // console.log(classList);
    if (tableClassSelectId === "empty") {
      setisData(false);
      return;
    }

    let selectedClass = await classList.find(
      (clas) => clas._id === tableClassSelectId
    );
    // console.log(selectedClass);
    let data = [];
    if (selectedClass.section.length === 0) {
      setisData(false);
      return;
    }
    setisData(true);
    for (let i = 0; i < selectedClass.section.length; i++) {
      data.push({
        key: i,
        s_no: [i + 1],
        name: selectedClass.section[i].name,
        abbreviation: selectedClass.section[i].abbreviation,
        subject: selectedClass.section[i].subject,
        class_teacher:
          selectedClass.section[i].classTeacher &&
          selectedClass.section[i].classTeacher.firstname,
        action: (
          <h5 key={i + 1} className="mb-0">
            {permissions && permissions.includes("edit".trim()) && (
              <Button
                className="btn-sm pull-right"
                color="primary"
                type="button"
                key={"edit" + i + 1}
                onClick={() => editData(selectedClass.section[i])}
              >
                <i className="fas fa-user-edit" />
              </Button>
            )}
            {permissions && permissions.includes("delete".trim()) && (
              <Button
                className="btn-sm pull-right"
                color="danger"
                type="button"
                key={"delete" + i + 1}
              >
                <Popconfirm
                  title="Sure to delete?"
                  onConfirm={() =>
                    deleteSectionHandler(selectedClass.section[i]._id)
                  }
                >
                  <i className="fas fa-trash" />
                </Popconfirm>
              </Button>
            )}
          </h5>
        ),
      });
    }
    setSectionList(data);
  };

  const editData = (section) => {
    setEditing(true);
    console.log(section);

    setEditingSectionName(section.name);
    setEditingAbbv(section.abbreviation);
    setEditingSectionId(section._id);
    setEditingClassId(section.class);
    let data = [];
    for (let i = 0; i < section.subject.length; i++) {
      data.push({
        label: section.subject[i].name,
        value: section.subject[i]._id,
      });
    }
    setInitialSubject(data);
  };

  const deleteSectionHandler = async (sectionId) => {
    try {
      setLoading(true);
      const data = await deleteSection(user._id, sectionId);
      // console.log(data);

      toast.success("Section deleted successfully");
      setReload(!reload);
      setLoading(false);
    } catch (err) {
      // console.log(err);
      toast.error(deleteSectionError);
      setLoading(false);
    }
  };

  const [formData] = useState(new FormData());
  const [sectionData] = useState(new FormData());

  const handleChange = (name) => (event) => {
    formData.set(name, event.target.value);
  };

  //Final Submit
  const handleFormChange = async (e) => {
    e.preventDefault();
    const { user, token } = isAuthenticated();
    formData.set("school", user.school);
    formData.set("class", clas);
    console.log(clas);
    try {
      setAddLoading(true);
      const resp = await addSection(user._id, token, formData);
      console.log(resp);
      sectionData.set("school", user.school);
      sectionData.set("section", resp._id);
      sectionData.set("id", clas);
      const data = await addClassToSection(
        user._id,
        resp.class,
        token,
        sectionData
      );
      console.log(data);
      setReload(!reload);
      if (resp.err) {
        setAddLoading(false);
        return toast.error(resp.err);
      } else {
        toast.success(addSectionSuccess);
        setChecked(!checked);
        setAddLoading(false);
        setClas("");
      }
    } catch (err) {
      toast.error(addSectionError);
      setAddLoading(false);
    }
  };

  const handleSubjectChange = (e) => {
    var value = [];
    for (var i = 0, l = e.length; i < l; i++) {
      value.push(e[i].value);
    }
    // console.log(value);
    formData.set("subject", JSON.stringify(value));
  };
  const handleEditingSubjectChange = (e) => {
    var value = [];
    for (var i = 0, l = e.length; i < l; i++) {
      value.push(e[i].value);
    }
    // console.log(value);
    setEditingSubjectList(value);
  };
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

  const handleEditSubmit = async () => {
    const formData = new FormData();
    formData.set("school", user.school);
    formData.set("name", editingSectionName);
    formData.set("abbreviation", editingAbbv);
    formData.set("subject", JSON.stringify(editingSubjectList));
    formData.set("class", editingClassId);

    try {
      setLoading(true);
      const data = await editSection(user._id, editingSectionId, formData);
      // console.log(data);
      setChecked(!checked);
      setEditing(false);
      setLoading(false);
      toast.success("Section edited successfully");
      setTableClassSelectId("empty");
    } catch (err) {
      console.log(err);
      toast.error("Edit Section Failed");
      setLoading(false);
    }
  };

  return (
    <>
      <SimpleHeader name="Add Section" parentName="Class Management" />
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
          <Col md="12">
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
                            className="mt-3"
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
                              Class
                            </label>
                            <Input
                              id="example4cols2Input"
                              type="select"
                              onChange={(e) => setClas(e.target.value)}
                              required
                              value={clas}
                            >
                              <option value="" disabled selected>
                                Select Class
                              </option>
                              {classList?.map((clas, index) => (
                                <option key={index} value={clas._id}>
                                  {clas.name}
                                </option>
                              ))}
                            </Input>
                          </Col>

                          <Col>
                            <label
                              className="form-control-label"
                              htmlFor="example4cols2Input"
                            >
                              Section
                            </label>
                            <Input
                              id="example4cols2Input"
                              placeholder="Section"
                              type="text"
                              onChange={handleChange("name")}
                              required
                            />
                          </Col>
                        </Row>

                        <Row className="mt-4">
                          <Col>
                            <label
                              className="form-control-label"
                              htmlFor="example4cols2Input"
                            >
                              Section Abbreviation
                            </label>
                            <Input
                              id="example4cols2Input"
                              placeholder="Section Abbreviation"
                              type="text"
                              onChange={handleChange("abbreviation")}
                              required
                            />
                          </Col>

                          <Col>
                            <label
                              className="form-control-label"
                              htmlFor="example4cols2Input"
                            >
                              Subject
                            </label>
                            <Select
                              isMulti
                              name="colors"
                              options={roleOptions}
                              onChange={handleSubjectChange}
                              className="basic-multi-select"
                              classNamePrefix="select"
                              required
                            />
                          </Col>
                        </Row>
                        <Row className="mt-4 float-right">
                          <Col>
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
                <CardBody>
                  <Row>
                    <Col className="sm-4 mb-3">
                      <label
                        className="form-control-label"
                        htmlFor="example4cols2Input"
                      >
                        Class
                      </label>
                      <Input
                        id="example4cols2Input"
                        type="select"
                        onChange={(e) => setTableClassSelectId(e.target.value)}
                        required
                        value={tableClassSelectId}
                      >
                        <option value="empty">Select Class</option>
                        {classList?.map((clas, index) => (
                          <option key={index} value={clas._id}>
                            {clas.name}
                          </option>
                        ))}
                      </Input>
                    </Col>
                  </Row>
                  <Button
                    color="primary"
                    className="mb-2"
                    onClick={handlePrint}
                    style={{ float: "right" }}
                  >
                    Print
                  </Button>
                  {!loading && sectionList ? (
                    isData ? (
                      <AntTable
                        columns={columns}
                        data={sectionList}
                        pagination={true}
                        exportFileName="SectionDetails"
                      />
                    ) : (
                      <h3 style={{ width: "100%" }}>No section found</h3>
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
              Edit Form
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
                <label className="form-control-label">Section Name</label>
                <Input
                  id="form-class-name"
                  value={editingSectionName}
                  onChange={(e) => setEditingSectionName(e.target.value)}
                  placeholder="Section Name"
                  type="text"
                />
              </Col>
            </Row>
            <Row>
              <Col>
                <label className="form-control-label">
                  Section Abbreviation
                </label>
                <Input
                  id="form-class-name"
                  value={editingAbbv}
                  onChange={(e) => setEditingAbbv(e.target.value)}
                  placeholder="Section Abbreviation"
                  type="text"
                />
              </Col>
            </Row>

            <Row className="mt-4">
              <Col>
                <label
                  className="form-control-label"
                  htmlFor="example4cols2Input"
                >
                  Subject
                </label>
                <Select
                  isMulti
                  name="colors"
                  options={roleOptions}
                  onChange={handleEditingSubjectChange}
                  className="basic-multi-select"
                  classNamePrefix="select"
                  required
                  defaultValue={initialSubject}
                />
              </Col>
            </Row>
          </ModalBody>
          <ModalFooter>
            <Button color="success" type="button" onClick={handleEditSubmit}>
              Save changes
            </Button>
          </ModalFooter>
        </Modal>
      </Container>
    </>
  );
};

export default AddSection;
