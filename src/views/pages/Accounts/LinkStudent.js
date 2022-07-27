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
  CardHeader,
} from "reactstrap";
import SimpleHeader from "components/Headers/SimpleHeader";
import { isAuthenticated } from "api/auth";
import { ToastContainer, toast } from "react-toastify";
import { Popconfirm } from "antd";
import { filterStudent } from "api/student";
import { allClass } from "api/class";
import LoadingScreen from "react-loading-screen";
import "./style.css";
import { linkStudent } from "api/Budget";
const LinkStudent = () => {
  const [loading, setLoading] = useState(false);
  const { user, token } = isAuthenticated();
  const [checked, setChecked] = useState(false);
  const [allStaff, setAllStaff] = useState([]);
  const [classList, setClassList] = useState([]);
  const [inputFields, setInputFields] = useState([
    {
      class: "",
      section: "",
      student: "",
      one_time: "",
      recurring: "",
      selectedClass: {},
      studentList: [],
    },
  ]);

  const handleChange = async (index, event) => {
    const values = [...inputFields];

    values[index][event.target.name] = event.target.value;
    if (event.target.name === "class") {
      let selectedClass = classList.find(
        (item) => item._id.toString() === event.target.value.toString()
      );
      console.log(selectedClass);
      values[index]["selectedClass"] = selectedClass;
    }
    if (event.target.name === "section") {
      const students = await filterStudentHandler(
        event.target.value,
        values[index]["class"]
      );
      console.log(students);
      values[index]["studentList"] = students;
    }
    console.log(values);
    setInputFields(values);
  };

  const filterStudentHandler = async (section, classs) => {
    const formData = {
      section: section,
      class: classs,
    };

    try {
      setLoading(true);
      const data = await filterStudent(user.school, user._id, formData);
      console.log(data);
      setLoading(false);
      return data;
    } catch (err) {
      console.log(err);
      toast.error("Fetching Students Failed");
      setLoading(false);
    }
  };

  const handleAddFields = () => {
    setInputFields([
      ...inputFields,
      { class: "", section: "", student: "", feesList: "" },
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
  }, [checked]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.set("link_data", JSON.stringify(inputFields));
    console.log(inputFields);
    try {
      setLoading(true);
      const data = await linkStudent(user.school, user._id, formData);
      console.log(data);
      if (data.err) {
        setLoading(false);
        return toast.error(data.err);
      }
      setLoading(false);
      toast.success("Linked Successfully");
      setInputFields([
        {
          class: "",
          section: "",
          student: "",
          one_time: "",
          recurring: "",
          selectedClass: {},
          studentList: [],
        },
      ]);
    } catch (err) {
      console.log(err);
      toast.error("Link Failed");
      setLoading(false);
    }
  };

  return (
    <>
      <SimpleHeader
        name="Link Student With Salary"
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
      <Container className="mt--6">
        <Card>
          <CardHeader>
            <h2>Add Students</h2>
          </CardHeader>
          <CardBody>
            <form onSubmit={handleSubmit}>
              <div className="table_div_fees">
                <table className="fees_table">
                  <thead style={{ backgroundColor: "#c0c0c0" }}>
                    <th style={{ backgroundColor: "#c0c0c0" }}>Class</th>
                    <th style={{ backgroundColor: "#c0c0c0" }}>Section</th>
                    <th style={{ backgroundColor: "#c0c0c0" }}>Student</th>
                    <th style={{ backgroundColor: "#c0c0c0" }}>One Time</th>
                    <th style={{ backgroundColor: "#c0c0c0" }}>Recurring</th>
                    <th style={{ backgroundColor: "#c0c0c0" }}>Add</th>
                    <th style={{ backgroundColor: "#c0c0c0" }}>Remove</th>
                  </thead>
                  <tbody>
                    {inputFields?.map((inputfield, index) => {
                      return (
                        <tr key={index}>
                          <td>
                            <Input
                              id="exampleFormControlTextarea1"
                              type="select"
                              required
                              onChange={(e) => handleChange(index, e)}
                              value={inputfield.class}
                              name="class"
                            >
                              <option value="">Select Class</option>
                              {classList?.map((classs) => {
                                return (
                                  <option value={classs._id} key={classs._id}>
                                    {classs.name}
                                  </option>
                                );
                              })}
                            </Input>
                          </td>
                          <td>
                            <Input
                              id="exampleFormControlTextarea1"
                              type="select"
                              required
                              onChange={(e) => handleChange(index, e)}
                              value={inputfield.section}
                              name="section"
                            >
                              <option value="" selected>
                                Select Section
                              </option>
                              {inputfield.selectedClass?.section?.map(
                                (section) => {
                                  return (
                                    <option
                                      value={section._id}
                                      key={section._id}
                                    >
                                      {section.name}
                                    </option>
                                  );
                                }
                              )}
                            </Input>
                          </td>
                          <td>
                            <Input
                              id="exampleFormControlTextarea1"
                              type="select"
                              required
                              onChange={(e) => handleChange(index, e)}
                              value={inputfield.student}
                              name="student"
                            >
                              <option value="" selected>
                                Select Student
                              </option>
                              {inputfield.studentList?.map((student) => {
                           
                                return (
                                  <option value={student._id} key={student._id}>
                                    {student.firstname + " " + student.lastname}
                                  </option>
                                );
                              })}
                            </Input>
                          </td>
                          <td>
                            <Input
                              id="exampleFormControlTextarea1"
                              type="select"
                              required
                              onChange={(e) => handleChange(index, e)}
                              value={inputfield.one_time}
                              name="one_time"
                            >
                              <option value="" selected disabled>
                                Select One Time
                              </option>
                              <option value="Y" selected>
                                Yes
                              </option>
                              <option value="N" selected>
                                No
                              </option>
                            </Input>
                          </td>
                          <td>
                            <Input
                              id="exampleFormControlTextarea1"
                              type="select"
                              required
                              onChange={(e) => handleChange(index, e)}
                              value={inputfield.recurring}
                              name="recurring"
                            >
                              <option value="" selected disabled>
                                Select Recurring
                              </option>
                              <option value="Y" selected>
                                Yes
                              </option>
                              <option value="N" selected>
                                No
                              </option>
                            </Input>
                          </td>

                          <td>
                            <Button color="primary" onClick={handleAddFields}>
                              Add
                            </Button>
                          </td>
                          <td>
                            <Button
                              color="danger"
                              onClick={() => handleRemoveFields(index)}
                            >
                              Remove
                            </Button>
                          </td>
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
      </Container>
    </>
  );
};

export default LinkStudent;
