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
import S3FileUpload from "react-s3";
import SimpleHeader from "components/Headers/SimpleHeader";
import LoadingScreen from "react-loading-screen";
import { isAuthenticated } from "api/auth";
import { toast, ToastContainer } from "react-toastify";
import { allStaffs } from "api/staff";
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
  const [allStaff, setAllStaff] = useState([]);
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
      values[index]["document"] = event.target.files[0];
    }
    setInputFields(values);
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
  const getAllStaffs = async () => {
    try {
      setLoading(true);
      const { data } = await allStaffs(user.school, user._id);
      console.log(data);
      //   let canteenStaff = data.find((staff) => staff.assign_role === "library");
      setAllStaff(data);
      setLoading(false);
    } catch (err) {
      console.log(err);
      toast.error("Fetching Staffs Failed");
      setLoading(false);
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
    const config = {
      bucketName: process.env.REACT_APP_Bucket,
     
      region: "eu-east-1",
      accessKeyId: process.env.REACT_APP_accessKeyID,
      secretAccessKey: process.env.REACT_APP_secretAccessID,
      
    };
   
    for (let i = 0; i < inputFields.length; i++) {
    
      S3FileUpload.uploadFile(inputFields[i].document, config)
        .then((data) => {
          console.log(data);
          inputFields[i].documents = data.location;

        })
        .catch((err) => console.error(err));
    }
    console.log(inputFields);
  };
  useEffect(() => {
    getAllStaffs();
  }, []);
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
            <h2>Students Documents Upload</h2>
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
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <h2>Add Documents</h2>
              <Button
                color="primary"
                size="sm"
                onClick={handleAddFields}
                style={{ padding: "0.2rem 0.9rem" }}
              >
                +
              </Button>
            </div>
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
                        placeholder="Document Name"
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
                        type="select"
                        required
                        onChange={(e) => handleChange(index, e)}
                        value={field.uploadBy}
                        name="uploadBy"
                      >
                        <option value="" selected>
                          Select Staff
                        </option>
                        {allStaff?.map((staff, index) => {
                          return (
                            <option key={index} value={staff._id}>
                              {staff.firstname + " " + staff.lastname}
                            </option>
                          );
                        })}
                      </Input>
                    </Col>
                    <Col style={{ marginTop: "2rem", float: "right" }}>
                      <Button
                        color="danger"
                        onClick={() => handleRemoveFields(index)}
                      >
                        -
                      </Button>
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
                        placeholder="Description"
                      />
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
