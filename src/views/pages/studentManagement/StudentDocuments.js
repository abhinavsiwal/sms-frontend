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
import { Popconfirm } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { allSessions } from "api/session";
import { Table } from "ant-table-extensions";

import SimpleHeader from "components/Headers/SimpleHeader";
import LoadingScreen from "react-loading-screen";
import { isAuthenticated } from "api/auth";
import { toast, ToastContainer } from "react-toastify";

import { allStudents, filterStudent } from "api/student";
import { allClass } from "api/class";

const StudentDocuments = () => {
  const [loading, setLoading] = useState(false);
  const { user, token } = isAuthenticated();

  const [checked, setChecked] = useState(false);
  const [classList, setClassList] = useState([]);
  const [selectedClassId, setSelectedClassId] = useState("");
  const [selectedClass, setSelectedClass] = useState({});
  const [section, setSection] = useState("");
  const [student, setStudent] = useState("");
  const [students, setStudents] = useState([]);
  const [inputFields, setInputFields] = useState([
    {
      name: "",
      date: "",
      uploadBy: "",
      document: "",
      documentPreview: "",
      description: "",
    },
  ]);

  const handleChange = async (index, event) => {
    const values = [...inputFields];
    values[index][event.target.name] = event.target.value;

    if (event.target.name === "document") {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.readyState === 2) {
          values[index]["documentPreview"] = reader.result;
          values[index]["document"] = reader.result;
        }
      };
      reader.readAsDataURL(event.target.files[0]);
    }
  };

  const handleAddFields = () => {
    setInputFields([
      ...inputFields,
      {
        name: "",
        date: "",
        uploadBy: "",
        document: "",
        documentPreview: "",
        description: "",
      },
    ]);
  };
  const handleRemoveFields = (index) => {
    const values = [...inputFields];
    values.splice(index, 1);
    setInputFields(values);
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
  }, []);
  const filterStudentHandler = async (clas, section) => {
    const formData = {
      section: section,
      class: clas,
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
  const handleSubmit = async () => {
    console.log(inputFields);
  };

  useEffect(() => {
    if (selectedClassId !== "") {
      const selectedClass1 = classList.find(
        (clas) => clas._id === selectedClassId
      );
      setSelectedClass(selectedClass1);
    }
  }, [selectedClassId]);

  useEffect(() => {
    if (section !== "") {
      filterStudentHandler(selectedClassId, section);
    }
  }, [section]);

  return (
    <>
      <SimpleHeader
        name="Staff Budget Allocations"
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
            <h2>Staff Budget Allocations</h2>
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
                  onChange={(e) => setSelectedClassId(e.target.value)}
                  required
                  value={selectedClassId}
                >
                  <option value="" selected disabled>
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
                  htmlFor="exampleFormControlSelect3"
                >
                  Section
                </label>
                <Input
                  id="exampleFormControlSelect3"
                  type="select"
                  required
                  value={section}
                  onChange={(e) => setSection(e.target.value)}
                  name="section"
                >
                  <option value="">Select Section</option>
                  {selectedClass.section &&
                    selectedClass.section.map((section) => {
                      // console.log(section.name);
                      return (
                        <option value={section._id} key={section._id} selected>
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
                Student
              </label>
              <Input
                id="example4cols2Input"
                placeholder="Student Name"
                type="select"
                name="class"
                onChange={(e) => setStudent(e.target.value)}
                value={student}
                required
              >
                <option value="">Select Student</option>
                {students &&
                  students.map((student) => (
                    <option key={student._id} value={student._id}>
                      {student.firstname} {student.lastname}
                    </option>
                  ))}
              </Input>
            </Col>
            </Row>
          </CardHeader>
          <CardBody>
            <h3>Add Documents</h3>
            {inputFields?.map((field, index) => {
              return (
                <>
                  <Row key={index} className="mt-4">
                    <Col>
                      <label
                        className="form-control-label"
                        htmlFor="example4cols2Input"
                      >
                        Document Name
                      </label>
                      <Input
                        id="exampleFormControlTextarea1"
                        type="text"
                        required
                        onChange={(e) => handleChange(index, e)}
                        value={field.name}
                        name="name"
                      />
                    </Col>

                    <Col>
                      <label
                        className="form-control-label"
                        htmlFor="example4cols2Input"
                      >
                        Upload Date
                      </label>
                      <Input
                        id="exampleFormControlTextarea1"
                        type="date"
                        required
                        onChange={(e) => handleChange(index, e)}
                        value={field.date}
                        name="date"
                      />
                    </Col>
                    <Col>
                      <label
                        className="form-control-label"
                        htmlFor="example4cols2Input"
                      >
                        Upload By
                      </label>
                      <Input
                        id="exampleFormControlTextarea1"
                        type="text"
                        required
                        onChange={(e) => handleChange(index, e)}
                        value={field.date}
                        name="uploadBy"
                      />
                    </Col>
                  </Row>
                  <Row className="mt-4">
                    <Col>
                      <label
                        className="form-control-label"
                        htmlFor="example4cols2Input"
                      >
                        Document
                      </label>
                      <Input
                        id="exampleFormControlTextarea1"
                        type="file"
                        required
                        onChange={(e) => handleChange(index, e)}
                        name="document"
                      />
                    </Col>
                    <Col sm={2}>
                      <img
                        src={field.documentPreview}
                        alt=""
                        style={{ width: "100px", height: "100px" }}
                      />
                    </Col>
                    <Col>
                      <label
                        className="form-control-label"
                        htmlFor="example4cols2Input"
                      >
                        Document
                      </label>
                      <Input
                        id="exampleFormControlTextarea1"
                        type="textarea"
                        required
                        onChange={(e) => handleChange(index, e)}
                        value={field.description}
                        name="description"
                      />
                    </Col>
                  </Row>
                  <Row className="mt-4">
                    <Col>
                      <Button color="primary" onClick={handleAddFields}>
                        Add
                      </Button>

                      <Button
                        color="danger"
                        onClick={() => handleRemoveFields(index)}
                      >
                        Remove
                      </Button>
                    </Col>
                  </Row>
                </>
              );
            })}
            <Row className="mt-4">
              <Col>
                <Button color="primary" onClick={handleSubmit}>
                  Submit
                </Button>
              </Col>
            </Row>
          </CardBody>
        </Card>
      </Container>
    </>
  );
};

export default StudentDocuments;
