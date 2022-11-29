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
import ReactPaginate from "react-paginate";
import { Table } from "ant-table-extensions";
import SimpleHeader from "components/Headers/SimpleHeader";
import LoadingScreen from "react-loading-screen";
import { isAuthenticated } from "api/auth";
import { toast, ToastContainer } from "react-toastify";
import { allClass } from "api/class";
import { filterStudent } from "api/student";
import { updateMarks, getExams } from "api/result";

const MarksMaster = () => {
  const [loading, setLoading] = useState(false);
  const [examId, setExamId] = useState("");
  const { user, token } = isAuthenticated();
  const [checked, setChecked] = useState(false);
  const [clas, setClas] = useState("");
  const [selectedClass, setSelectedClass] = useState({});
  const [section, setSection] = useState("");
  const [classList, setClassList] = useState([]);
  const [selectedSection, setSelectedSection] = useState(undefined);
  const [showTable, setShowTable] = useState(false);
  const [students, setStudents] = useState([]);
  const [resultData, setResultData] = useState([]);
  const [result, setResult] = useState([]);
  const [allExams, setAllExams] = useState([]);
  // const [examId, setexamId] = useState(second)
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

  useEffect(() => {
    if (clas === "") {
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
    getExamsHandler(selectedSection1._id);
    filterStudentHandler(selectedSection1);
    setSelectedSection(selectedSection1);
  }, [section]);

  const filterStudentHandler = async (id) => {
    const formData = {
      section: id,
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (examId === "") {
      return toast.error("Please select Exam first");
    }

    setShowTable(true);
    console.log(resultData);
    let customFields = [];
    resultData.map((rs) => {
      if (
        rs.hasOwnProperty("marks") &&
        rs.hasOwnProperty("present") &&
        rs.hasOwnProperty("subject") &&
        rs.hasOwnProperty("student")
      ) {
        customFields.push(rs);
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
    formData.set("exam_id", examId);

    try {
      setLoading(true);
      const data = await updateMarks(user._id, user.school, formData);
      console.log(data);
      if (data.err) {
        setLoading(false);
        return toast.error(data.err);
      }
      toast.success("Marks Updated Successfully");
      setLoading(false);
      setExamId("");
      setClas("");
      setSection("");
      setShowTable(false);
    } catch (err) {
      console.log(err);
    }
  };

  const getExamsHandler = async (sect) => {
    const formData = new FormData();
    formData.set("class", clas);
    formData.set("section", sect);
    try {
      setLoading(true);
      const data = await getExams(user._id, user.school, formData);
      console.log(data);
      if (data.err) {
        setLoading(false);
        return toast.error(data.err);
      }
      setAllExams(data);
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  const handleChange = (name, student) => async (event) => {
    console.log(name, event.target.value);
    console.log(event.target.id);

    let obj = {
      present: "Y",
      subject: event.target.id,
      student: student,
    };
    if (name === "marks") {
      obj.marks = event.target.value;
    } else if (name === "present") {
      obj.present = event.target.value;
    }
    console.log(obj);
    setResult([...result, obj]);
    result.map((rs) => {
      console.log(rs);
      if (
        rs.hasOwnProperty("marks") &&
        rs.hasOwnProperty("present") &&
        rs.hasOwnProperty("subject") &&
        rs.hasOwnProperty("student")
      ) {
        if (rs.subject === event.target.id) {
          if (name === "marks") {
            rs.marks = event.target.value;
          } else if (name === "present") {
            rs.present = event.target.value;
          }
        }

        console.log(rs);
        setResultData([...resultData, rs]);
        return;
      }
    });
    console.log(resultData);
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
            <h2>Search Class</h2>
          </CardHeader>
          <CardBody>
            <Form>
              <Row>
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
                    htmlFor="exampleFormControlSelect3"
                  >
                    Exam
                  </label>
                  <Input
                    id="exampleFormControlTextarea1"
                    type="select"
                    required
                    onChange={(e) => setExamId(e.target.value)}
                    value={examId}
                    name="examId"
                  >
                    <option value="" disabled>
                      Select Exam
                    </option>
                    {allExams?.map((exam) => {
                      return <option value={exam._id}>{exam.name}</option>;
                    })}
                  </Input>
                </Col>
              </Row>
            </Form>
          </CardBody>
        </Card>
      </Container>
      <Container className="mt--0 shadow-lg table-responsive" fluid>
        {showTable && (
          <Card>
            <CardHeader>
              <h2>Marks Distribution</h2>
            </CardHeader>
            <CardBody style={{ overflow: "scroll" }}>
              <form onSubmit={handleSubmit}>
                <div className="table_div_fees" style={{ overflow: "scroll" }}>
                  <table className="fees_table" style={{ overflow: "scroll" }}>
                    <thead style={{ backgroundColor: "#c0c0c0" }}>
                      <tr>
                        <th
                          style={{ backgroundColor: "#c0c0c0", width: "4rem" }}
                        >
                          Roll No.
                        </th>
                        <th
                          style={{ backgroundColor: "#c0c0c0", width: "12rem" }}
                        >
                          Name
                        </th>
                        {selectedSection?.subject.map((subject, index) => {
                          return (
                            <React.Fragment key={index}>
                              <>
                                {subject.type === "Group" && (
                                  <>
                                    <th
                                      style={{
                                        backgroundColor: "#c0c0c0",
                                        fontWeight: "900",
                                        width: "9rem",
                                      }}
                                    >
                                      {subject.name + "(Group)"}
                                    </th>
                                    <th style={{ backgroundColor: "#c0c0c0" }}>
                                      Attendance
                                    </th>
                                    {subject.list.map((sub, index) => {
                                      return (
                                        <React.Fragment key={index}>
                                          <th
                                            style={{
                                              backgroundColor: "#c0c0c0",
                                              width: "9rem",
                                            }}
                                          >
                                            {sub}
                                          </th>
                                          <th
                                            style={{
                                              backgroundColor: "#c0c0c0",
                                              width: "6rem",
                                            }}
                                          >
                                            Attendance
                                          </th>
                                        </React.Fragment>
                                      );
                                    })}
                                  </>
                                )}
                                {subject.type === "Single" && (
                                  <React.Fragment key={index}>
                                    <th
                                      style={{
                                        backgroundColor: "#c0c0c0",
                                        width: "9rem",
                                      }}
                                    >
                                      {subject.name}
                                    </th>
                                    <th
                                      style={{
                                        backgroundColor: "#c0c0c0",
                                        width: "6rem",
                                      }}
                                    >
                                      Attendance
                                    </th>
                                  </React.Fragment>
                                )}
                              </>
                            </React.Fragment>
                          );
                        })}
                      </tr>
                    </thead>
                    <tbody>
                      {students?.map((student, index) => {
                        return (
                          <tr key={index}>
                            <th>{student.roll_number}</th>
                            <th>
                              {student.firstname + " " + student.lastname}
                            </th>
                            {selectedSection?.subject.map((subject, index) => {
                              return (
                                <React.Fragment key={index}>
                                  {subject.type === "Group" && (
                                    <>
                                      <td>
                                        <Input
                                          id={subject.name}
                                          type="number"
                                          required
                                          onChange={handleChange(
                                            "marks",
                                            student._id
                                          )}
                                          // value={inputfield.min}
                                          name="marks"
                                          placeholder="Enter Marks"
                                          min={0}
                                        />
                                      </td>
                                      <td
                                        style={{
                                          width: "9rem",
                                          display: "flex",
                                          justifyContent: "center",
                                          alignItems: "center",
                                        }}
                                      >
                                        {/* <Input
                                          id={subject.name}
                                          type="select"
                                          required
                                          onChange={handleChange(
                                            "present",
                                            student._id
                                          )}
                                          // value={inputfield.min}
                                          name="present"
                                          // placeholder="Enter Marks"
                                        >
                                          <option value="" disabled>
                                            Select Attendance
                                          </option>
                                          <option value="Y">Present</option>
                                          <option value="N">Absent</option>
                                        </Input> */}
                                        {/* <Input id={subject.name} type="checkbox" onChange={handleChange("present",student._id)} name="present" /> */}
                                      </td>
                                      {subject.list.map((sub, index) => {
                                        return (
                                          <>
                                            <td>
                                              <Input
                                                id={sub}
                                                type="number"
                                                required
                                                onChange={handleChange(
                                                  "marks",
                                                  student._id
                                                )}
                                                // value={inputfield.min}
                                                name="marks"
                                                placeholder="Enter Marks"
                                              />
                                            </td>
                                            <td
                                              style={{
                                                width: "",
                                                display: "flex",
                                                justifyContent: "center",
                                                alignItems: "flex-start",
                                                marginTop: "0.8rem",
                                              }}
                                            >
                                              <Input
                                                id={subject.name}
                                                type="checkbox"
                                                onChange={handleChange(
                                                  "present",
                                                  student._id
                                                )}
                                                name="present"
                                                style={{position:"inherit"}}
                                              />
                                            </td>
                                          </>
                                        );
                                      })}
                                    </>
                                  )}
                                  {subject.type === "Single" && (
                                    <>
                                      <td>
                                        <Input
                                          id={subject.name}
                                          type="number"
                                          required
                                          onChange={handleChange(
                                            "marks",
                                            student._id
                                          )}
                                          // value={inputfield.min}
                                          name="marks"
                                          placeholder="Enter Marks"
                                          min={0}
                                        />
                                      </td>
                                      <td
                                              style={{
                                                width: "",
                                                display: "flex",
                                                justifyContent: "center",
                                                alignItems: "flex-start",
                                                marginTop: "0.8rem",
                                              }}
                                            >
                                              <Input
                                                id={subject.name}
                                                type="checkbox"
                                                onChange={handleChange(
                                                  "present",
                                                  student._id
                                                )}
                                                name="present"
                                                style={{position:"inherit"}}
                                              />
                                            </td>
                                    </>
                                  )}
                                </React.Fragment>
                              );
                            })}
                          </tr>
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

export default MarksMaster;
