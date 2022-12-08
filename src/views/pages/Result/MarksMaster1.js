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
import { updateMarks, getExams, studentMarksList } from "api/result";

const MarksMaster1 = () => {
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
  const [examList, setExamList] = useState([]);

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

  useEffect(() => {
    if (examId === "") {
      return;
    }
    getMarksHandler();
  }, [examId]);

  const getMarksHandler = async () => {
  const formData = new FormData();
    formData.set("exam_id", examId);
    try {
      setLoading(true);
      const data = await studentMarksList(user._id, user.school, formData);
      console.log(data);
      if (data.err) {
        toast.error(data.err);
        return setLoading(false);
      }
      setResult(data);
      setLoading(false);
    } catch (err) {
      console.log(err);
      toast.error("Fetching Students Failed");
      setLoading(false);
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
        toast.error(data.err);
        return setLoading(false);
      }
      setExamList(data);
      setLoading(false);
    } catch (err) {
      console.log(err);
      toast.error("Fetching Exams Failed");
      setLoading(false);
    }
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
            <h2>Search Exam</h2>
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
                    {examList.map((exam) => {
                      return (
                        <option value={exam._id} key={exam._id}>
                          {exam.name}
                        </option>
                      );
                    })}
                    <option value="6324f3308332c411dc022484">Test</option>
                  </Input>
                </Col>
              </Row>
            </Form>
          </CardBody>
        </Card>
      </Container>
    </>
  );
};

export default MarksMaster1;
