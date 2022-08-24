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

const MarksMaster = () => {
  const [loading, setLoading] = useState(false);
  const { user, token } = isAuthenticated();
  const [checked, setChecked] = useState(false);
  const [clas, setClas] = useState("");
  const [selectedClass, setSelectedClass] = useState({});
  const [section, setSection] = useState("");
  const [classList, setClassList] = useState([]);
  const [selectedSection, setSelectedSection] = useState(undefined);
  const [showTable, setShowTable] = useState(false);
  const [students, setStudents] = useState([]);
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

  const handleSearch = async (e) => {
    e.preventDefault();
    setShowTable(true);
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
            <CardBody>
              <form>
                <div className="table_div_fees">
                  <table className="fees_table">
                    <thead style={{ backgroundColor: "#c0c0c0" }}>
                      <tr>
                        <th style={{ backgroundColor: "#c0c0c0" }}>Roll No.</th>
                        <th style={{ backgroundColor: "#c0c0c0" }}>Name</th>
                        { selectedSection?.subject.map((subject, index) => {
                          return (
                            <React.Fragment key={index}>
                              <th style={{ backgroundColor: "#c0c0c0" }}>
                                {subject.name}
                              </th>
                              <th style={{ backgroundColor: "#c0c0c0" }}>
                                Attendance
                              </th>
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
                                  <td>
                                    <Input
                                      id="exampleFormControlTextarea1"
                                      type="number"
                                      required
                                      // onChange={(e) => handleChange(index, e)}
                                      // value={inputfield.min}
                                      name="full"
                                      placeholder="Enter Marks"
                                    />
                                  </td>
                                  <td>
                                    <Input
                                      id="exampleFormControlTextarea1"
                                      type="select"
                                      required
                                      // onChange={(e) => handleChange(index, e)}
                                      // value={inputfield.min}
                                      name="full"
                                      placeholder="Enter Marks"
                                    >
                                        <option value="" disabled>Select Attendance</option>
                                        <option value="present">Present</option>
                                        <option value="absent">Absent</option>
                                    </Input>
                                  </td>
                                
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
