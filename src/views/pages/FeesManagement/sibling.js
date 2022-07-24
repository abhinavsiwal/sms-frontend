import "./fees_style.css";
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
} from "reactstrap";
import SimpleHeader from "components/Headers/SimpleHeader";
import { isAuthenticated } from "api/auth";
import { ToastContainer, toast } from "react-toastify";
import { Popconfirm } from "antd";
import { filterStudent } from "api/student";
import { allClass } from "api/class";
import LoadingScreen from "react-loading-screen";
import { allSessions } from "api/session";

const SiblingMaster = () => {
  const [loading, setLoading] = useState(false);
  const { user, token } = isAuthenticated();
  const [checked, setChecked] = useState(false);
  const [classList, setClassList] = useState([]);
  const [sessions, setSessions] = useState("");
  const [twoModal, setTwoModal] = useState(false);
  const [threeModal, setThreeModal] = useState(false);
  const [fourModal, setFourModal] = useState(false);
  const [fiveModal, setFiveModal] = useState(false);

  const [twoSiblingData, setTwoSiblingData] = useState({
    firstClass: "",
    selectedFirstClass: {},
    firstSection: "",
    firstStudentList: [],
    firstName: "",
    firstRate: "",
    firstType: "",
    secondClass: "",
    selectedSecondClass: {},
    secondSection: "",
    secondStudentList: [],
    secondName: "",
    secondRate: "",
    secondType: "",
  });
  const [threeSiblingData, setThreeSiblingData] = useState({
    firstClass: "",
    selectedFirstClass: {},
    firstSection: "",
    firstStudentList: [],
    firstName: "",
    firstRate: "",
    firstType: "",
    secondClass: "",
    selectedSecondClass: {},
    secondSection: "",
    secondStudentList: [],
    secondName: "",

    secondRate: "",
    secondType: "",
    thirdClass: "",
    selectedThirdClass: {},
    thirdSection: "",
    thirdStudentList: [],
    thirdName: "",
    thirdRate: "",
    thirdType: "",
  });
  const [fourSiblingData, setFourSiblingData] = useState({
    firstClass: "",
    selectedFirstClass: {},
    firstSection: "",
    firstStudentList: [],
    firstName: "",
    firstRate: "",
    firstType: "",
    secondClass: "",
    selectedSecondClass: {},
    secondSection: "",
    secondStudentList: [],
    secondName: "",
    secondRate: "",
    secondType: "",
    thirdClass: "",
    selectedThirdClass: {},
    thirdSection: "",
    thirdStudentList: [],
    thirdName: "",
    thirdRate: "",
    thirdType: "",
    fourClass: "",
    selectedFourClass: {},
    fourSection: "",
    fourStudentList: [],
    fourName: "",
    fourRate: "",
    fourType: "",
  });
  const [fiveSiblingData, setFiveSiblingData] = useState({
    firstClass: "",
    selectedFirstClass: {},
    firstSection: "",
    firstStudentList: [],
    firstName: "",
    firstRate: "",
    firstType: "",
    secondClass: "",
    selectedSecondClass: {},
    secondSection: "",
    secondStudentList: [],
    secondName: "",
    secondRate: "",
    secondType: "",
    thirdClass: "",
    selectedThirdClass: {},
    thirdSection: "",
    thirdStudentList: [],
    thirdName: "",
    thirdRate: "",
    thirdType: "",
    fourClass: "",
    selectedFourClass: {},
    fourSection: "",
    fourStudentList: [],
    fourName: "",
    fourRate: "",
    fourType: "",
    fiveClass: "",
    selectedFiveClass: {},
    fiveSection: "",
    fiveStudentList: [],
    fiveName: "",
    fiveRate: "",
    fiveType: "",
  });

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

  const getSession = async () => {
    try {
      const session = await allSessions(user._id, user.school, token);
      if (session.err) {
        return toast.error(session.err);
      } else {
        setSessions(session);
        return;
      }
    } catch (err) {
      toast.error("Something Went Wrong!");
    }
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
  const handleTwoChange = (name) => async (event) => {
    setTwoSiblingData({ ...twoSiblingData, [name]: event.target.value });
    console.log(name, event.target.value);
    if (name === "firstClass") {
      let selctedClass = classList.find(
        (clas) => clas._id === event.target.value
      );
      setTwoSiblingData({
        ...twoSiblingData,
        selectedFirstClass: selctedClass,
      });
    }
    if (name === "firstSection") {
      const students = await filterStudentHandler(
        event.target.value,
        twoSiblingData.firstClass
      );
      setTwoSiblingData({ ...twoSiblingData, firstStudentList: students });
    }
    if (name === "secondClass") {
      let selctedClass = classList.find(
        (clas) => clas._id === event.target.value
      );
      setTwoSiblingData({
        ...twoSiblingData,
        selectedSecondClass: selctedClass,
      });
    }
    if (name === "secondSection") {
      const students = await filterStudentHandler(
        event.target.value,
        twoSiblingData.secondClass
      );
      setTwoSiblingData({ ...twoSiblingData, secondStudentList: students });
    }
  };
  const handleThreeChange = (name) => async (event) => {
    setThreeSiblingData({ ...threeSiblingData, [name]: event.target.value });
  };
  const handleFourChange = (name) => async (event) => {
    setFourSiblingData({ ...fourSiblingData, [name]: event.target.value });
  };
  const handleFiveChange = (name) => async (event) => {
    setFiveSiblingData({ ...fiveSiblingData, [name]: event.target.value });
  };
  return (
    <>
      <SimpleHeader name="Sibling Master" parentName="Fees Management" />
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
            <h2>Add Sibling</h2>
          </CardHeader>
          <CardBody>
            <div className="table_div_fees">
              <table className="fees_table">
                <thead>
                  <th>SNo</th>
                  <th>Sibling Discount Name</th>
                  <th>Session</th>
                  <th>Add</th>
                </thead>
                <tbody>
                  <tr>
                    <td>1</td>
                    <td>2 Sibling</td>
                    <td>
                      <select
                        required
                        className="form-control"
                        // onChange={handleSession}
                      >
                        <option value="">Select Session</option>
                        {sessions &&
                          sessions.map((data) => {
                            console.log(data);
                            return (
                              <option key={data._id} value={data._id}>
                                {data.name}
                              </option>
                            );
                          })}
                      </select>
                    </td>
                    <td>
                      <button
                        className="btn btn-primary"
                        onClick={() => {
                          setTwoModal(true);
                        }}
                      >
                        Add
                      </button>
                    </td>
                  </tr>
                  <tr>
                    <td>2</td>
                    <td>3 Sibling</td>
                    <td>
                      <select
                        required
                        className="form-control"
                        // onChange={handleSession}
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
                    </td>
                    <td>
                      <button
                        className="btn btn-primary"
                        onClick={() => {
                          setThreeModal(true);
                        }}
                      >
                        Add
                      </button>
                    </td>
                  </tr>
                  <tr>
                    <td>3</td>
                    <td>4 Sibling</td>
                    <td>
                      <select
                        required
                        className="form-control"
                        // onChange={handleSession}
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
                    </td>
                    <td>
                      <button
                        className="btn btn-primary"
                        onClick={() => {
                          setFourModal(true);
                        }}
                      >
                        Add
                      </button>
                    </td>
                  </tr>
                  <tr>
                    <td>4</td>
                    <td>5 Sibling</td>
                    <td>
                      <select
                        required
                        className="form-control"
                        // onChange={handleSession}
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
                    </td>
                    <td>
                      <button
                        className="btn btn-primary"
                        onClick={() => {
                          setFiveModal(true);
                        }}
                      >
                        Add
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardBody>
        </Card>
      </Container>
      <Modal
        className="modal-dialog-centered"
        isOpen={twoModal}
        toggle={() => setTwoModal(false)}
        size="lg"
      >
        <ModalBody>
          <div className="table_div_fees">
            <table className="fees_table">
              <thead>
                <th  >SNo</th>
                <th>Class</th>
                <th>Section</th>
                <th>Name</th>
                <th>Rate/Amount</th>
                <th>Type</th>
              </thead>
              <tr>
                <td>1</td>
                <td>
                  <Input
                    id="exampleFormControlTextarea1"
                    type="select"
                    required
                    onChange={handleTwoChange("firstClass")}
                    value={twoSiblingData.firstClass}
                    name="firstClass"
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
                    onChange={handleTwoChange("firstSection")}
                    value={twoSiblingData.firstSection}
                    name="firstSection"
                  >
                    <option value="" selected>
                      Select Section
                    </option>
                    {twoSiblingData.selectedFirstClass?.section?.map(
                      (section) => {
                        return (
                          <option value={section._id} key={section._id}>
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
                    onChange={handleTwoChange("firstName")}
                    value={twoSiblingData.firstName}
                    name="firstName"
                  >
                    <option value="" selected>
                      Select Student
                    </option>
                    {twoSiblingData.firstStudentList?.map((student) => {
                      console.log(student);
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
                    type="number"
                    required
                    onChange={handleTwoChange("firstRate")}
                    value={twoSiblingData.firstRate}
                    name="firstRate"
                  />
                </td>
                <td>
                  <Input
                    id="exampleFormControlTextarea1"
                    type="select"
                    required
                    onChange={handleTwoChange("firstType")}
                    value={twoSiblingData.firstType}
                    name="firstType"
                  >
                    <option value="" selected>
                      Select Student
                    </option>
                    <option value="percentage">Percentage</option>
                    <option value="flat_rate">Flat Rate</option>
                  </Input>
                </td>
              </tr>
            </table>
          </div>
        </ModalBody>
      </Modal>
      <Modal
        className="modal-dialog-centered"
        isOpen={threeModal}
        toggle={() => setThreeModal(false)}
        size="lg"
      >
        <ModalBody>
          <div className="table_div_fees">
            <table className="fees_table">
              <thead>
                <th>SNo</th>
                <th>Class</th>
                <th>Section</th>
                <th>Name</th>
                <th>Rate/Amount</th>
                <th>Type</th>
              </thead>
            </table>
          </div>
        </ModalBody>
      </Modal>
      <Modal
        className="modal-dialog-centered"
        isOpen={fourModal}
        toggle={() => setFourModal(false)}
        size="lg"
      >
        <ModalBody>
          <div className="table_div_fees">
            <table className="fees_table">
              <thead>
                <th>SNo</th>
                <th>Class</th>
                <th>Section</th>
                <th>Name</th>
                <th>Rate/Amount</th>
                <th>Type</th>
              </thead>
            </table>
          </div>
        </ModalBody>
      </Modal>
      <Modal
        className="modal-dialog-centered"
        isOpen={fiveModal}
        toggle={() => setFiveModal(false)}
        size="lg"
      >
        <ModalBody>
          <div className="table_div_fees">
            <table className="fees_table">
              <thead>
                <th>SNo</th>
                <th>Class</th>
                <th>Section</th>
                <th>Name</th>
                <th>Rate/Amount</th>
                <th>Type</th>
              </thead>
            </table>
          </div>
        </ModalBody>
      </Modal>
    </>
  );
};

export default SiblingMaster;
