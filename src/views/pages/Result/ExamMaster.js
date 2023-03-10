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
} from "reactstrap";
import { Popconfirm } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import AntTable from "../tables/AntTable";
import SimpleHeader from "components/Headers/SimpleHeader";
import LoadingScreen from "react-loading-screen";
import { isAuthenticated } from "api/auth";
import { toast, ToastContainer } from "react-toastify";
import { allClass } from "api/class";
import { allSessions } from "api/session";
import { updateExam } from "../../../api/result";

const ExamMaster = () => {
  const [loading, setLoading] = useState(false);
  const [sessions, setSessions] = useState("");
  const { user, token } = isAuthenticated();
  const [classList, setClassList] = useState([]);
  const [checked, setChecked] = useState(false);
  const [showTable, setShowTable] = useState(false);
  const [inputFields, setInputFields] = useState([]);
  const [clas, setClas] = useState("");
  const [selectedClass, setSelectedClass] = useState({});
  const [section, setSection] = useState("");
  const [selectedSection, setSelectedSection] = useState({});
  const [session, setSession] = useState("");
  const [name, setName] = useState("");
  const [fields, setFields] = useState([]);
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
    if (sessions.length !== 0) {
      defaultSession1();
    }
  }, [sessions]);

  const defaultSession1 = async () => {
    const defaultSession = await sessions.find(
      (session) => session.status === "current"
    );
    setSession(defaultSession._id);
  };

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
    getSession();
  }, [checked]);

  useEffect(() => {
    if (clas === "") {
      setShowTable(false);
      return;
    }
    const selectedClass1 = classList.find((item) => item._id === clas);
    console.log(selectedClass1);
    setSelectedClass(selectedClass1);
  }, [clas]);

  useEffect(() => {
    if (section === "") {
      return;
    }
    const selectedSection1 = selectedClass.section.find(
      (item) => item._id === section
    );
    console.log(selectedSection1);
    setSelectedSection(selectedSection1);
  }, [section]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(inputFields);
    let customFields = [];
    inputFields.map((field) => {
      let bool =
        field.hasOwnProperty("passing_marks") &&
        field.hasOwnProperty("full_marks");
      if (field.hasOwnProperty("subject") && bool) {
        customFields.push(field);
      }
    });

    console.log(customFields);
    const filtered = customFields.filter(
      (v, i, a) =>
        a.findIndex((v2) => JSON.stringify(v2) === JSON.stringify(v)) === i
    );
    console.log(filtered);

    const formData = new FormData();
    formData.set("exam_data", JSON.stringify(filtered));
    formData.set("class", clas);
    formData.set("section", section);
    formData.set("session", session);
    formData.set("name", name);

    try {
      setLoading(true);
      const data = await updateExam(user._id, user.school, formData);
      console.log(data);
      if (data.err) {
        setLoading(false);
        return toast.error(data.err);
      }
      toast.success("Exam Updated Successfully");
      setLoading(false);
      setClas("");
      setSection("");
      setSession("");
      setName("");
      setInputFields([]);
      setShowTable(false);
    } catch (err) {
      console.log(err);

      setLoading(false);
      toast.error("Exam Data Not Updated");
    }
  };
  const handleChange = (name) => async (event) => {
    console.log(name, event.target.value);
    console.log(event.target.id);

    let obj = {
      subject: event.target.id,
      [name]: event.target.value,
    };

    setFields([...fields, obj]);
    fields.map((field) => {
      console.log(field);
      let bool =
        field.hasOwnProperty("passing_marks") ||
        field.hasOwnProperty("full_marks");
      console.log(bool);
      if (field.subject === event.target.id && bool) {
        field[name] = event.target.value;
        console.log(field);
        console.log(true);
        setInputFields([...inputFields, field]);
        return;
      }
    });
    console.log(inputFields);
  };

  return (
    <>
      <SimpleHeader name="Exam Master" parentName="Result Management" />
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
            <h2>Exam Master</h2>
          </CardHeader>
          <CardBody>
            <form>
              <Row>
                <Col>
                  <label
                    className="form-control-label"
                    htmlFor="exampleFormControlSelect3"
                  >
                    Exam Name
                  </label>
                  <Input
                    placeholder="Exam Name"
                    id="exampleFormControlTextarea1"
                    type="text"
                    required
                    onChange={(e) => setName(e.target.value)}
                    value={name}
                    name="name"
                  />
                </Col>
                <Col>
                  <label
                    className="form-control-label"
                    htmlFor="exampleFormControlSelect3"
                  >
                    Class
                  </label>
                  <Input
                    id="exampleFormControlTextarea1"
                    type="select"
                    required
                    onChange={(e) => setClas(e.target.value)}
                    value={clas}
                    name="class"
                  >
                    <option value="" disabled>
                      Select Class
                    </option>
                    {classList?.map((classs) => {
                      return (
                        <option value={classs._id} key={classs._id}>
                          {classs.name}
                        </option>
                      );
                    })}
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
                    id="exampleFormControlTextarea1"
                    type="select"
                    onChange={(e) => {
                      setSection(e.target.value);
                      setShowTable(true);
                    }}
                    value={section}
                    name="section"
                  >
                    <option value="" selected>
                      Select Section
                    </option>
                    {selectedClass?.section?.map((section) => {
                      return (
                        <option value={section._id} key={section._id}>
                          {section.name}
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
                    Select Session
                  </label>

                  <select
                    required
                    className="form-control"
                    onChange={(e) => setSession(e.target.value)}
                    value={session}
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
            </form>
          </CardBody>
        </Card>
      </Container>
      <Container className="mt--0 shadow-lg table-responsive" fluid>
        {showTable && (
          <Card>
            <CardHeader>
              <h2>Marks Distribution</h2>
            </CardHeader>
            <CardBody>
              <form onSubmit={handleSubmit}>
                <div className="table_div_fees">
                  <table className="fees_table">
                    <thead style={{ backgroundColor: "#c0c0c0" }}>
                      <tr>
                        <th style={{ backgroundColor: "#c0c0c0" }}>SNo.</th>
                        <th style={{ backgroundColor: "#c0c0c0" }}>Subjects</th>
                        <th style={{ backgroundColor: "#c0c0c0" }}>
                          Full Marks
                        </th>
                        <th style={{ backgroundColor: "#c0c0c0" }}>
                          Passing Marks
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedSection?.subject?.map((subject, index) => {
                        return (
                          <>
                            {subject.type === "Group" && (
                              <>
                                <tr key={index}>
                                  <td>{index + 1}</td>

                                  <td style={{ fontWeight: "600" }}>
                                    {subject.name}
                                  </td>
                                  <td>
                                    <Input
                                      id={subject.name}
                                      type="number"
                                      required
                                      min={0}
                                      onChange={handleChange("full_marks")}
                                      // value={inputfield.min}
                                      name="full_marks"
                                      placeholder="Enter full marks"
                                    />
                                  </td>
                                  <td>
                                    <Input
                                      id={subject.name}
                                      type="number"
                                      required
                                      min={0}
                                      onChange={handleChange("passing_marks")}
                                      // value={inputfield.min}
                                      name="passing_marks"
                                      placeholder="Enter passing marks"
                                    />
                                  </td>
                                </tr>
                                {subject.list.map((sub, index) => {
                                  return (
                                    <tr>
                                      <td></td>
                                      <td style={{ marginLeft: "4px" }}>
                                        {sub}
                                      </td>
                                      <td>
                                        <Input
                                          id={sub}
                                          type="number"
                                          required
                                          min={0}
                                          onChange={handleChange("full_marks")}
                                          // value={inputfield.min}
                                          name="full_marks"
                                          placeholder="Enter full marks"
                                        />
                                      </td>
                                      <td>
                                        <Input
                                          id={sub}
                                          type="number"
                                          required
                                          min={0}
                                          onChange={handleChange(
                                            "passing_marks"
                                          )}
                                          // value={inputfield.min}
                                          name="passing_marks"
                                          placeholder="Enter passing marks"
                                        />
                                      </td>
                                    </tr>
                                  );
                                })}
                              </>
                            )}
                            {subject.type === "Single" && (
                              <tr>
                                <td>{index + 1}</td>
                                <td>{subject.name}</td>
                                <td>
                                  <Input
                                    id={subject.name}
                                    type="number"
                                    required
                                    min={0}
                                    onChange={handleChange("full_marks")}
                                    // value={inputfield.min}
                                    name="full_marks"
                                    placeholder="Enter full marks"
                                  />
                                </td>
                                <td>
                                  <Input
                                    id={subject.name}
                                    type="number"
                                    required
                                    min={0}
                                    onChange={handleChange("passing_marks")}
                                    // value={inputfield.min}
                                    name="passing_marks"
                                    placeholder="Enter passing marks"
                                  />
                                </td>
                              </tr>
                            )}
                          </>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
                <Row className="mt-4 float-right">
                  <Col>
                    <Button color="primary" type="submit">
                      Submit
                    </Button>
                  </Col>
                </Row>
              </form>
            </CardBody>
          </Card>
        )}
      </Container>
    </>
  );
};

export default ExamMaster;
