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
      setLoading(false);
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
    if (name === "firstClass") {
      let selctedClass = classList.find(
        (clas) => clas._id === event.target.value
      );
      setThreeSiblingData({
        ...threeSiblingData,
        selectedFirstClass: selctedClass,
      });
    }
    if (name === "firstSection") {
      const students = await filterStudentHandler(
        event.target.value,
        threeSiblingData.firstClass
      );
      setThreeSiblingData({ ...threeSiblingData, firstStudentList: students });
    }
    if (name === "secondClass") {
      let selctedClass = classList.find(
        (clas) => clas._id === event.target.value
      );
      setThreeSiblingData({
        ...threeSiblingData,
        selectedSecondClass: selctedClass,
      });
    }
    if (name === "secondSection") {
      const students = await filterStudentHandler(
        event.target.value,
        threeSiblingData.secondClass
      );
      setThreeSiblingData({ ...threeSiblingData, secondStudentList: students });
    }
    if (name === "thirdClass") {
      let selctedClass = classList.find(
        (clas) => clas._id === event.target.value
      );
      setThreeSiblingData({
        ...threeSiblingData,
        selectedThirdClass: selctedClass,
      });
    }
    if (name === "thirdSection") {
      const students = await filterStudentHandler(
        event.target.value,
        threeSiblingData.thirdClass
      );
      setThreeSiblingData({ ...threeSiblingData, thirdStudentList: students });
    }
  };
  const handleFourChange = (name) => async (event) => {
    setFourSiblingData({ ...fourSiblingData, [name]: event.target.value });
    if (name === "firstClass") {
      let selctedClass = classList.find(
        (clas) => clas._id === event.target.value
      );
      setFourSiblingData({
        ...fourSiblingData,
        selectedFirstClass: selctedClass,
      });
    }
    if (name === "firstSection") {
      const students = await filterStudentHandler(
        event.target.value,
        fourSiblingData.firstClass
      );
      setFourSiblingData({ ...fourSiblingData, firstStudentList: students });
    }
    if (name === "secondClass") {
      let selctedClass = classList.find(
        (clas) => clas._id === event.target.value
      );
      setFourSiblingData({
        ...fourSiblingData,
        selectedSecondClass: selctedClass,
      });
    }
    if (name === "secondSection") {
      const students = await filterStudentHandler(
        event.target.value,
        fourSiblingData.secondClass
      );
      setFourSiblingData({ ...fourSiblingData, secondStudentList: students });
    }
    if (name === "thirdClass") {
      let selctedClass = classList.find(
        (clas) => clas._id === event.target.value
      );
      setFourSiblingData({
        ...fourSiblingData,
        selectedThirdClass: selctedClass,
      });
    }
    if (name === "thirdSection") {
      const students = await filterStudentHandler(
        event.target.value,
        fourSiblingData.thirdClass
      );
      setFourSiblingData({ ...fourSiblingData, thirdStudentList: students });
    }
    if (name === "fourClass") {
      let selctedClass = classList.find(
        (clas) => clas._id === event.target.value
      );
      setFourSiblingData({
        ...fourSiblingData,
        selectedFourClass: selctedClass,
      });
    }
    if (name === "fourSection") {
      const students = await filterStudentHandler(
        event.target.value,
        fourSiblingData.fourClass
      );
      setFourSiblingData({ ...fourSiblingData, fourStudentList: students });
    }
  };
  const handleFiveChange = (name) => async (event) => {
    setFiveSiblingData({ ...fiveSiblingData, [name]: event.target.value });
    if (name === "firstClass") {
      let selctedClass = classList.find(
        (clas) => clas._id === event.target.value
      );
      setFiveSiblingData({
        ...fiveSiblingData,
        selectedFirstClass: selctedClass,
      });
    }
    if (name === "firstSection") {
      const students = await filterStudentHandler(
        event.target.value,
        fiveSiblingData.firstClass
      );
      setFiveSiblingData({ ...fiveSiblingData, firstStudentList: students });
    }
    if (name === "secondClass") {
      let selctedClass = classList.find(
        (clas) => clas._id === event.target.value
      );
      setFiveSiblingData({
        ...fiveSiblingData,
        selectedSecondClass: selctedClass,
      });
    }
    if (name === "secondSection") {
      const students = await filterStudentHandler(
        event.target.value,
        fiveSiblingData.secondClass
      );
      setFiveSiblingData({ ...fiveSiblingData, secondStudentList: students });
    }
    if (name === "thirdClass") {
      let selctedClass = classList.find(
        (clas) => clas._id === event.target.value
      );
      setFiveSiblingData({
        ...fiveSiblingData,
        selectedThirdClass: selctedClass,
      });
    }
    if (name === "thirdSection") {
      const students = await filterStudentHandler(
        event.target.value,
        fiveSiblingData.thirdClass
      );
      setFiveSiblingData({ ...fiveSiblingData, thirdStudentList: students });
    }
    if (name === "fiveClass") {
      let selctedClass = classList.find(
        (clas) => clas._id === event.target.value
      );
      setFiveSiblingData({
        ...fiveSiblingData,
        selectedFiveClass: selctedClass,
      });
    }
    if (name === "fiveSection") {
      const students = await filterStudentHandler(
        event.target.value,
        fiveSiblingData.fourClass
      );
      setFiveSiblingData({ ...fiveSiblingData, fourStudentList: students });
    }
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
        size="xl"
      >
        <ModalBody>
          <div className="table_div_fees">
            <table className="fees_table">
              <thead>
                <th style={{ width: "40px" }}>SNo</th>
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
              <tr>
                <td>2</td>
                <td>
                  <Input
                    id="exampleFormControlTextarea1"
                    type="select"
                    required
                    onChange={handleTwoChange("secondClass")}
                    value={twoSiblingData.secondClass}
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
                    onChange={handleTwoChange("secondSection")}
                    value={twoSiblingData.secondSection}
                    name="firstSection"
                  >
                    <option value="" selected>
                      Select Section
                    </option>
                    {twoSiblingData.selectedSecondClass?.section?.map(
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
                    onChange={handleTwoChange("secondName")}
                    value={twoSiblingData.secondName}
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
                    onChange={handleTwoChange("secondRate")}
                    value={twoSiblingData.secondRate}
                    name="firstRate"
                  />
                </td>
                <td>
                  <Input
                    id="exampleFormControlTextarea1"
                    type="select"
                    required
                    onChange={handleTwoChange("secondType")}
                    value={twoSiblingData.secondType}
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
        size="xl"
      >
        <ModalBody>
          <div className="table_div_fees">
            <table className="fees_table">
              <thead>
                <th style={{ width: "40px" }}>SNo</th>
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
                    onChange={handleThreeChange("firstClass")}
                    value={threeSiblingData.firstClass}
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
                    onChange={handleThreeChange("firstSection")}
                    value={threeSiblingData.firstSection}
                    name="firstSection"
                  >
                    <option value="" selected>
                      Select Section
                    </option>
                    {threeSiblingData.selectedFirstClass?.section?.map(
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
                    onChange={handleThreeChange("firstName")}
                    value={threeSiblingData.firstName}
                    name="firstName"
                  >
                    <option value="" selected>
                      Select Student
                    </option>
                    {threeSiblingData.firstStudentList?.map((student) => {
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
                    onChange={handleThreeChange("firstRate")}
                    value={threeSiblingData.firstRate}
                    name="firstRate"
                  />
                </td>
                <td>
                  <Input
                    id="exampleFormControlTextarea1"
                    type="select"
                    required
                    onChange={handleThreeChange("firstType")}
                    value={threeSiblingData.firstType}
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
              <tr>
                <td>2</td>
                <td>
                  <Input
                    id="exampleFormControlTextarea1"
                    type="select"
                    required
                    onChange={handleThreeChange("secondClass")}
                    value={threeSiblingData.secondClass}
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
                    onChange={handleThreeChange("secondSection")}
                    value={threeSiblingData.secondSection}
                    name="firstSection"
                  >
                    <option value="" selected>
                      Select Section
                    </option>
                    {threeSiblingData.selectedSecondClass?.section?.map(
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
                    onChange={handleThreeChange("secondName")}
                    value={threeSiblingData.secondName}
                    name="firstName"
                  >
                    <option value="" selected>
                      Select Student
                    </option>
                    {threeSiblingData.firstStudentList?.map((student) => {
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
                    onChange={handleThreeChange("secondRate")}
                    value={threeSiblingData.secondRate}
                    name="firstRate"
                  />
                </td>
                <td>
                  <Input
                    id="exampleFormControlTextarea1"
                    type="select"
                    required
                    onChange={handleThreeChange("secondType")}
                    value={threeSiblingData.secondType}
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
              <tr>
                <td>2</td>
                <td>
                  <Input
                    id="exampleFormControlTextarea1"
                    type="select"
                    required
                    onChange={handleThreeChange("secondClass")}
                    value={threeSiblingData.thirdClass}
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
                    onChange={handleThreeChange("secondSection")}
                    value={threeSiblingData.secondSection}
                    name="firstSection"
                  >
                    <option value="" selected>
                      Select Section
                    </option>
                    {threeSiblingData.selectedSecondClass?.section?.map(
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
                    onChange={handleThreeChange("secondName")}
                    value={threeSiblingData.secondName}
                    name="firstName"
                  >
                    <option value="" selected>
                      Select Student
                    </option>
                    {threeSiblingData.firstStudentList?.map((student) => {
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
                    onChange={handleThreeChange("secondRate")}
                    value={threeSiblingData.secondRate}
                    name="firstRate"
                  />
                </td>
                <td>
                  <Input
                    id="exampleFormControlTextarea1"
                    type="select"
                    required
                    onChange={handleThreeChange("secondType")}
                    value={threeSiblingData.secondType}
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
        isOpen={fourModal}
        toggle={() => setFourModal(false)}
        size="xl"
      >
        <ModalBody>
          <div className="table_div_fees">
            <table className="fees_table">
              <thead>
                <th style={{ width: "40px" }}>SNo</th>
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
                    onChange={handleFourChange("firstClass")}
                    value={fourSiblingData.firstClass}
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
                    onChange={handleFourChange("firstSection")}
                    value={fourSiblingData.firstSection}
                    name="firstSection"
                  >
                    <option value="" selected>
                      Select Section
                    </option>
                    {fourSiblingData.selectedFirstClass?.section?.map(
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
                    onChange={handleFourChange("firstName")}
                    value={fourSiblingData.firstName}
                    name="firstName"
                  >
                    <option value="" selected>
                      Select Student
                    </option>
                    {fourSiblingData.firstStudentList?.map((student) => {
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
                    onChange={handleFourChange("firstRate")}
                    value={fourSiblingData.firstRate}
                    name="firstRate"
                  />
                </td>
                <td>
                  <Input
                    id="exampleFormControlTextarea1"
                    type="select"
                    required
                    onChange={handleFourChange("firstType")}
                    value={fourSiblingData.firstType}
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
              <tr>
                <td>2</td>
                <td>
                  <Input
                    id="exampleFormControlTextarea1"
                    type="select"
                    required
                    onChange={handleFourChange("secondClass")}
                    value={fourSiblingData.secondClass}
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
                    onChange={handleFourChange("secondSection")}
                    value={fourSiblingData.secondSection}
                    name="firstSection"
                  >
                    <option value="" selected>
                      Select Section
                    </option>
                    {fourSiblingData.selectedSecondClass?.section?.map(
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
                    onChange={handleFourChange("secondName")}
                    value={fourSiblingData.secondName}
                    name="firstName"
                  >
                    <option value="" selected>
                      Select Student
                    </option>
                    {fourSiblingData.firstStudentList?.map((student) => {
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
                    onChange={handleFourChange("secondRate")}
                    value={fourSiblingData.secondRate}
                    name="firstRate"
                  />
                </td>
                <td>
                  <Input
                    id="exampleFormControlTextarea1"
                    type="select"
                    required
                    onChange={handleFourChange("secondType")}
                    value={fourSiblingData.secondType}
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
              <tr>
                <td>3</td>
                <td>
                  <Input
                    id="exampleFormControlTextarea1"
                    type="select"
                    required
                    onChange={handleFourChange("secondClass")}
                    value={fourSiblingData.thirdClass}
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
                    onChange={handleFourChange("secondSection")}
                    value={fourSiblingData.secondSection}
                    name="firstSection"
                  >
                    <option value="" selected>
                      Select Section
                    </option>
                    {fourSiblingData.selectedSecondClass?.section?.map(
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
                    onChange={handleFourChange("secondName")}
                    value={fourSiblingData.secondName}
                    name="firstName"
                  >
                    <option value="" selected>
                      Select Student
                    </option>
                    {fourSiblingData.firstStudentList?.map((student) => {
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
                    onChange={handleFourChange("secondRate")}
                    value={fourSiblingData.secondRate}
                    name="firstRate"
                  />
                </td>
                <td>
                  <Input
                    id="exampleFormControlTextarea1"
                    type="select"
                    required
                    onChange={handleFourChange("secondType")}
                    value={fourSiblingData.secondType}
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
              <tr>
                <td>4</td>
                <td>
                  <Input
                    id="exampleFormControlTextarea1"
                    type="select"
                    required
                    onChange={handleFourChange("secondClass")}
                    value={fourSiblingData.thirdClass}
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
                    onChange={handleFourChange("secondSection")}
                    value={fourSiblingData.secondSection}
                    name="firstSection"
                  >
                    <option value="" selected>
                      Select Section
                    </option>
                    {fourSiblingData.selectedSecondClass?.section?.map(
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
                    onChange={handleFourChange("secondName")}
                    value={fourSiblingData.secondName}
                    name="firstName"
                  >
                    <option value="" selected>
                      Select Student
                    </option>
                    {fourSiblingData.firstStudentList?.map((student) => {
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
                    onChange={handleFourChange("secondRate")}
                    value={fourSiblingData.secondRate}
                    name="firstRate"
                  />
                </td>
                <td>
                  <Input
                    id="exampleFormControlTextarea1"
                    type="select"
                    required
                    onChange={handleFourChange("secondType")}
                    value={fourSiblingData.secondType}
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
        isOpen={fiveModal}
        toggle={() => setFiveModal(false)}
        size="xl"
      >
        <ModalBody>
          <div className="table_div_fees">
          <table className="fees_table">
          <table className="fees_table">
              <thead>
                <th style={{ width: "40px" }}>SNo</th>
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
                    onChange={handleFourChange("firstClass")}
                    value={fiveSiblingData.firstClass}
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
                    onChange={handleFiveChange("firstSection")}
                    value={fiveSiblingData.firstSection}
                    name="firstSection"
                  >
                    <option value="" selected>
                      Select Section
                    </option>
                    {fiveSiblingData.selectedFirstClass?.section?.map(
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
                    onChange={handleFiveChange("firstName")}
                    value={fiveSiblingData.firstName}
                    name="firstName"
                  >
                    <option value="" selected>
                      Select Student
                    </option>
                    {fiveSiblingData.firstStudentList?.map((student) => {
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
                    onChange={handleFiveChange("firstRate")}
                    value={fiveSiblingData.firstRate}
                    name="firstRate"
                  />
                </td>
                <td>
                  <Input
                    id="exampleFormControlTextarea1"
                    type="select"
                    required
                    onChange={handleFiveChange("firstType")}
                    value={fiveSiblingData.firstType}
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
              <tr>
                <td>2</td>
                <td>
                  <Input
                    id="exampleFormControlTextarea1"
                    type="select"
                    required
                    onChange={handleFiveChange("secondClass")}
                    value={fiveSiblingData.secondClass}
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
                    onChange={handleFiveChange("secondSection")}
                    value={fiveSiblingData.secondSection}
                    name="firstSection"
                  >
                    <option value="" selected>
                      Select Section
                    </option>
                    {fiveSiblingData.selectedSecondClass?.section?.map(
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
                    onChange={handleFiveChange("secondName")}
                    value={fiveSiblingData.secondName}
                    name="firstName"
                  >
                    <option value="" selected>
                      Select Student
                    </option>
                    {fiveSiblingData.firstStudentList?.map((student) => {
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
                    onChange={handleFiveChange("secondRate")}
                    value={fiveSiblingData.secondRate}
                    name="firstRate"
                  />
                </td>
                <td>
                  <Input
                    id="exampleFormControlTextarea1"
                    type="select"
                    required
                    onChange={handleFiveChange("secondType")}
                    value={fiveSiblingData.secondType}
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
              <tr>
                <td>3</td>
                <td>
                  <Input
                    id="exampleFormControlTextarea1"
                    type="select"
                    required
                    onChange={handleFiveChange("secondClass")}
                    value={fiveSiblingData.thirdClass}
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
                    onChange={handleFiveChange("secondSection")}
                    value={fiveSiblingData.secondSection}
                    name="firstSection"
                  >
                    <option value="" selected>
                      Select Section
                    </option>
                    {fiveSiblingData.selectedSecondClass?.section?.map(
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
                    onChange={handleFiveChange("secondName")}
                    value={fiveSiblingData.secondName}
                    name="firstName"
                  >
                    <option value="" selected>
                      Select Student
                    </option>
                    {fiveSiblingData.firstStudentList?.map((student) => {
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
                    onChange={handleFiveChange("secondRate")}
                    value={fiveSiblingData.secondRate}
                    name="firstRate"
                  />
                </td>
                <td>
                  <Input
                    id="exampleFormControlTextarea1"
                    type="select"
                    required
                    onChange={handleFiveChange("secondType")}
                    value={fiveSiblingData.secondType}
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
              <tr>
                <td>4</td>
                <td>
                  <Input
                    id="exampleFormControlTextarea1"
                    type="select"
                    required
                    onChange={handleFiveChange("secondClass")}
                    value={fiveSiblingData.thirdClass}
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
                    onChange={handleFiveChange("secondSection")}
                    value={fiveSiblingData.secondSection}
                    name="firstSection"
                  >
                    <option value="" selected>
                      Select Section
                    </option>
                    {fiveSiblingData.selectedSecondClass?.section?.map(
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
                    onChange={handleFiveChange("secondName")}
                    value={fiveSiblingData.secondName}
                    name="firstName"
                  >
                    <option value="" selected>
                      Select Student
                    </option>
                    {fiveSiblingData.firstStudentList?.map((student) => {
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
                    onChange={handleFiveChange("secondRate")}
                    value={fiveSiblingData.secondRate}
                    name="firstRate"
                  />
                </td>
                <td>
                  <Input
                    id="exampleFormControlTextarea1"
                    type="select"
                    required
                    onChange={handleFiveChange("secondType")}
                    value={fiveSiblingData.secondType}
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
              <tr>
                <td>5</td>
                <td>
                  <Input
                    id="exampleFormControlTextarea1"
                    type="select"
                    required
                    onChange={handleFourChange("secondClass")}
                    value={fiveSiblingData.thirdClass}
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
                    onChange={handleFourChange("secondSection")}
                    value={fiveSiblingData.secondSection}
                    name="firstSection"
                  >
                    <option value="" selected>
                      Select Section
                    </option>
                    {fiveSiblingData.selectedSecondClass?.section?.map(
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
                    onChange={handleFourChange("secondName")}
                    value={fiveSiblingData.secondName}
                    name="firstName"
                  >
                    <option value="" selected>
                      Select Student
                    </option>
                    {fiveSiblingData.firstStudentList?.map((student) => {
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
                    onChange={handleFourChange("secondRate")}
                    value={fiveSiblingData.secondRate}
                    name="firstRate"
                  />
                </td>
                <td>
                  <Input
                    id="exampleFormControlTextarea1"
                    type="select"
                    required
                    onChange={handleFourChange("secondType")}
                    value={fiveSiblingData.secondType}
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
            </table>
          </div>
        </ModalBody>
      </Modal>
    </>
  );
};

export default SiblingMaster;
