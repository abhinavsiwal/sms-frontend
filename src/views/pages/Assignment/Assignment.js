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
} from "reactstrap";
import AntTable from "../tables/AntTable";
import { Popconfirm } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { Table } from "ant-table-extensions";
import { allSessions } from "api/session";
import SimpleHeader from "components/Headers/SimpleHeader";
import LoadingScreen from "react-loading-screen";
import { isAuthenticated } from "api/auth";
import { toast, ToastContainer } from "react-toastify";
import { filterStudent } from "api/student";
import { allClass } from "api/class";

const Assignment = () => {
  const [loading, setLoading] = useState(false);
  const { user, token } = isAuthenticated();
  const [sessions, setSessions] = useState([]);
  const [classList, setClassList] = useState([]);
  const [assignmentData, setAssignmentData] = useState({
    class: "",
    section: "",
    subject: "",
    title: "",
    assignmentDate: "",
    submissionDate: "",
    marks: "",
    file: "",
    assignmentFor: "",
  });
  const [checked, setChecked] = useState(false);
  const [selectedClass, setSelectedClass] = useState({});
  const [students, setStudents] = useState([]);
  const [individualStudents, setIndividualStudents] = useState([]);
  const [selectedSection, setSelectedSection] = useState(undefined);
  const [view, setView] = useState(false);
  const [tableData, setTableData] = useState([]);
  const getAllClasses = async () => {
    try {
      setLoading(true);
      const classess = await allClass(user._id, user.school, token);
      console.log("classes", classess);
      if (classess.err) {
        setLoading(false);
        return toast.error(classess.err);
      }
      setClassList(classess);
      setLoading(false);
      // toast.success(fetchingClassSuccess)
      setLoading(false);
    } catch (err) {
      toast.error("Fetching Classes Failed");
    }
  };

  useEffect(() => {
    getAllClasses();
  }, [checked]);

  const filterStudentHandler = async (id) => {
    console.log(assignmentData);
    const formData = {
      section: id,
      class: assignmentData.class,
    };
    try {
      setLoading(true);
      const data = await filterStudent(user.school, user._id, formData);
      console.log(data);
      setStudents(data);
      setLoading(false);
    } catch (err) {
      console.log(err);
      toast.error("Fetching Students Failed");
      setLoading(false);
    }
  };
  const handleChange = (name) => async (event) => {
    setAssignmentData({ ...assignmentData, [name]: event.target.value });
    console.log(name, event.target.value);
    if (name === "class") {
      let selectedClass = classList.find(
        (item) => item._id.toString() === event.target.value.toString()
      );
      // console.log(selectedClass);
      setSelectedClass(selectedClass);
    }
    if (name === "section") {
      filterStudentHandler(event.target.value);
      let selectedSection1 = selectedClass.section.find(
        (item) => item._id.toString() === event.target.value.toString()
      );
      setSelectedSection(selectedSection1);
    }
  };
  const handleStudents = (event) => {
    console.log(event.target.value);
    let updatedStudents = [...individualStudents];
    if (event.target.checked) {
      updatedStudents = [...individualStudents, event.target.value];
    } else {
      updatedStudents.splice(individualStudents.indexOf(event.target.value), 1);
    }
    setIndividualStudents(individualStudents);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(assignmentData);
    console.log(individualStudents);
  };

  const columns = [
    {
      title: "Sr No",
      dataIndex: "sr",
      align: "left",
      sorter: (a, b) => a.sr > b.sr,
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
        return record.sr.toLowerCase().includes(value.toLowerCase());
      },
    },
    {
      title: "Assignment Name",
      dataIndex: "name",
      align: "left",
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
      title: "Class & Section",
      dataIndex: "class",
      align: "left",
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
      title: "Active",
      dataIndex: "active",
      align: "left",
      sorter: (a, b) => a.active > b.active,
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
        return record.active.toLowerCase().includes(value.toLowerCase());
      },
    },
    {
      title: "Action",
      key: "action",
      dataIndex: "action",
      fixed: "right",
      align: "left",
    },
    {
      title: "Submitted Assignment",
      key: "action",
      dataIndex: "viewAssignment",
      fixed: "right",
      align: "left",
    },
  ];
  const getAllAssignments = async () => {
    const tableData1 = [
      {
        sr: 1,
        name: "Assignment 1",
        class: "Class 1",
        active: "Yes",
        action: (
          <>
            <Button
              className="btn-sm pull-right"
              color="danger"
              type="button"
              key={"delete" + 1}
            >
              <Popconfirm
                title="Sure to delete?"
                //   onConfirm={() => deleteBudgetHandler(data[i]._id)}
              >
                Remove
              </Popconfirm>
            </Button>
          </>
        ),
        viewAssignment: (
          <>
            <Button
              className="btn-sm pull-right"
              color="primary"
              type="button"
              key={"edit" + 1}
              onClick={() => {
                setView(true);
              }}
            >
              View
            </Button>
          </>
        ),
      },
    ];
    setTableData(tableData1);
  };
  useEffect(() => {
    getAllAssignments();
  }, []);
  return (
    <>
      <SimpleHeader name="Assignment" parentName="Assignment Management" />
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
      <Container className="mt--6">
        <Card>
          <CardHeader>
            <h2>Budget Uses Details</h2>
          </CardHeader>
          <CardBody>
            <form onSubmit={handleSubmit}>
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
                    placeholder="Canteen Name"
                    type="select"
                    name="class"
                    onChange={handleChange("class")}
                    value={assignmentData.class}
                    required
                  >
                    <option value="" disabled>
                      Select Class
                    </option>
                    {classList &&
                      classList.map((classs) => (
                        <option key={classs._id} value={classs._id}>
                          {classs.name}
                        </option>
                      ))}
                  </Input>
                </Col>

                <Col>
                  <label
                    className="form-control-label"
                    htmlFor="exampleFormControlSelect3"
                  >
                    Section
                  </label>
                  <Input
                    id="exampleFormControlSelect3"
                    type="select"
                    required
                    value={assignmentData.section}
                    onChange={handleChange("section")}
                    name="section"
                  >
                    <option value="" disabled>
                      Select Section
                    </option>
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
              </Row>
              <Row className="mt-4">
                <Col>
                  <div className="custom-control custom-checkbox mb-3">
                    <input
                      className="custom-control-input"
                      id="allStudents"
                      type="checkbox"
                      onChange={() =>
                        setAssignmentData({
                          ...assignmentData,
                          assignmentFor: "allStudents",
                        })
                      }
                      //   value={penalty._id}
                      checked={assignmentData.assignmentFor === "allStudents"}
                    />
                    <label
                      className="custom-control-label"
                      htmlFor="allStudents"
                    >
                      All Students
                    </label>
                  </div>
                </Col>
                <Col>
                  <div className="custom-control custom-checkbox mb-3">
                    <Input
                      className="custom-control-input"
                      id="individual"
                      type="checkbox"
                      onChange={() =>
                        setAssignmentData({
                          ...assignmentData,
                          assignmentFor: "individual",
                        })
                      }
                      checked={assignmentData.assignmentFor === "individual"}
                      //   onChange={handleFees}
                      //   value={penalty._id}
                    />
                    <label
                      className="custom-control-label"
                      htmlFor="individual"
                    >
                      Individual Students
                    </label>
                  </div>
                </Col>
              </Row>

              {assignmentData.assignmentFor === "individual" && (
                <Row>
                  {students &&
                    students.map((student, index) => {
                      return (
                        <Col key={index} md={3}>
                          <div className="custom-control custom-checkbox mb-3">
                            <Input
                              className="custom-control-input"
                              id={`customCheck${index}`}
                              type="checkbox"
                              onChange={handleStudents}
                              value={student._id}
                            />
                            <label
                              className="custom-control-label"
                              htmlFor={`customCheck${index}`}
                            >
                              {student.firstname + " " + student.lastname}
                            </label>
                          </div>
                        </Col>
                      );
                    })}
                </Row>
              )}
              <Row>
                <Col>
                  <label
                    className="form-control-label"
                    htmlFor="exampleFormControlSelect3"
                  >
                    Subject
                  </label>
                  <Input
                    id="example4cols3Input"
                    type="select"
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Subject</option>
                    {selectedSection &&
                      selectedSection.subject.map((subject) => {
                        return (
                          <option key={subject._id} value={subject._id}>
                            {subject.name}
                          </option>
                        );
                      })}
                  </Input>
                </Col>
                <Col>
                  <label
                    className="form-control-label"
                    htmlFor="example4cols2Input"
                  >
                    Title
                  </label>
                  <Input
                    id="example4cols2Input"
                    type="text"
                    onChange={handleChange("title")}
                    required
                    value={assignmentData.title}
                    placeholder="Enter Title"
                  />
                </Col>
                <Col>
                  <label
                    className="form-control-label"
                    htmlFor="example4cols2Input"
                  >
                    Assignment Date
                  </label>
                  <Input
                    id="example4cols2Input"
                    type="date"
                    onChange={handleChange("assignmentDate")}
                    required
                    value={assignmentData.assignmentDate}
                    placeholder="Enter Title"
                  />
                </Col>
              </Row>
              <Row>
                <Col>
                  <label
                    className="form-control-label"
                    htmlFor="example4cols2Input"
                  >
                    Submission Date
                  </label>
                  <Input
                    id="example4cols2Input"
                    type="date"
                    onChange={handleChange("submissionDate")}
                    required
                    value={assignmentData.submissionDate}
                    // placeholder="Enter Title"
                  />
                </Col>
                <Col>
                  <label
                    className="form-control-label"
                    htmlFor="example4cols2Input"
                  >
                    Marks
                  </label>
                  <Input
                    id="example4cols2Input"
                    type="number"
                    min="0"
                    onChange={handleChange("marks")}
                    required
                    value={assignmentData.marks}
                    placeholder="Enter Marks"
                  />
                </Col>
                <Col>
                  <label
                    className="form-control-label"
                    htmlFor="example4cols2Input"
                  >
                    Upload File
                  </label>
                  <Input
                    id="example4cols2Input"
                    type="file"
                    // onChange={handleChange("file")}
                    required
                    // value={assignmentData.marks}
                    placeholder="Upload File"
                  />
                </Col>
              </Row>
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
                  <Button color="danger">Cancel</Button>
                </Col>
              </Row>
            </form>
          </CardBody>
        </Card>
      </Container>
      <Container>
        <Card>
          <CardHeader>
            {" "}
            <h2>View Assignments</h2>
          </CardHeader>
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
    </>
  );
};

export default Assignment;
