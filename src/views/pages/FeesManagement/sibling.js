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
import { updateSiblingMaster } from "api/Fees";
import { updateSiblingStudents } from "api/Fees";

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

  const [twoSession, setTwoSession] = useState("");
  const [threeSession, setThreeSession] = useState("");
  const [fourSession, setFourSession] = useState("");
  const [fiveSession, setFiveSession] = useState("");
  const [masterId, setMasterId] = useState("");

  const filterStudentHandler = async (section, classs) => {
    const formData = {
      section: section,
      class: classs,
    };

    try {
      setLoading(true);
      const data = await filterStudent(user.school, user._id, formData);
      console.log(data);
      if (data.err) {
        toast.error(data.err);
        setLoading(false);
        return [];
      }
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
    console.log(fiveSiblingData);
  }, [fiveSiblingData]);

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
        firstClass: event.target.value,
      });
    }
    if (name === "firstSection") {
      const students = await filterStudentHandler(
        event.target.value,
        twoSiblingData.firstClass
      );
      setTwoSiblingData({
        ...twoSiblingData,
        firstStudentList: students,
        firstSection: event.target.value,
      });
    }
    if (name === "secondClass") {
      let selctedClass = classList.find(
        (clas) => clas._id === event.target.value
      );
      setTwoSiblingData({
        ...twoSiblingData,
        selectedSecondClass: selctedClass,
        secondClass: event.target.value,
      });
    }
    if (name === "secondSection") {
      const students = await filterStudentHandler(
        event.target.value,
        twoSiblingData.secondClass
      );
      setTwoSiblingData({
        ...twoSiblingData,
        secondStudentList: students,
        secondSection: event.target.value,
      });
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
        firstClass: event.target.value,
      });
    }
    if (name === "firstSection") {
      const students = await filterStudentHandler(
        event.target.value,
        threeSiblingData.firstClass
      );
      setThreeSiblingData({
        ...threeSiblingData,
        firstStudentList: students,
        firstSection: event.target.value,
      });
    }
    if (name === "secondClass") {
      let selctedClass = classList.find(
        (clas) => clas._id === event.target.value
      );
      setThreeSiblingData({
        ...threeSiblingData,
        selectedSecondClass: selctedClass,
        secondClass: event.target.value,
      });
    }
    if (name === "secondSection") {
      const students = await filterStudentHandler(
        event.target.value,
        threeSiblingData.secondClass
      );
      setThreeSiblingData({
        ...threeSiblingData,
        secondStudentList: students,
        secondSection: event.target.value,
      });
    }
    if (name === "thirdClass") {
      let selctedClass = classList.find(
        (clas) => clas._id === event.target.value
      );
      setThreeSiblingData({
        ...threeSiblingData,
        selectedThirdClass: selctedClass,
        thirdClass: event.target.value,
      });
    }
    if (name === "thirdSection") {
      const students = await filterStudentHandler(
        event.target.value,
        threeSiblingData.thirdClass
      );
      setThreeSiblingData({
        ...threeSiblingData,
        thirdStudentList: students,
        thirdSection: event.target.value,
      });
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
        firstClass: event.target.value,
      });
    }
    if (name === "firstSection") {
      const students = await filterStudentHandler(
        event.target.value,
        fourSiblingData.firstClass
      );
      setFourSiblingData({
        ...fourSiblingData,
        firstStudentList: students,
        firstSection: event.target.value,
      });
    }
    if (name === "secondClass") {
      let selctedClass = classList.find(
        (clas) => clas._id === event.target.value
      );
      setFourSiblingData({
        ...fourSiblingData,
        selectedSecondClass: selctedClass,
        secondClass: event.target.value,
      });
    }
    if (name === "secondSection") {
      const students = await filterStudentHandler(
        event.target.value,
        fourSiblingData.secondClass
      );
      setFourSiblingData({
        ...fourSiblingData,
        secondStudentList: students,
        secondSection: event.target.value,
      });
    }
    if (name === "thirdClass") {
      let selctedClass = classList.find(
        (clas) => clas._id === event.target.value
      );
      setFourSiblingData({
        ...fourSiblingData,
        selectedThirdClass: selctedClass,
        thirdClass: event.target.value,
      });
    }
    if (name === "thirdSection") {
      const students = await filterStudentHandler(
        event.target.value,
        fourSiblingData.thirdClass
      );
      setFourSiblingData({
        ...fourSiblingData,
        thirdStudentList: students,
        thirdSection: event.target.value,
      });
    }
    if (name === "fourClass") {
      let selctedClass = classList.find(
        (clas) => clas._id === event.target.value
      );
      setFourSiblingData({
        ...fourSiblingData,
        selectedFourClass: selctedClass,
        fourClass: event.target.value,
      });
    }
    if (name === "fourSection") {
      const students = await filterStudentHandler(
        event.target.value,
        fourSiblingData.fourClass
      );
      setFourSiblingData({
        ...fourSiblingData,
        fourStudentList: students,
        fourSection: event.target.value,
      });
    }
  };
  const handleFiveChange = (name) => async (event) => {
    setFiveSiblingData({ ...fiveSiblingData, [name]: event.target.value });
    console.log(name, event.target.value);
    if (name === "firstClass") {
      let selctedClass = classList.find(
        (clas) => clas._id === event.target.value
      );
      setFiveSiblingData({
        ...fiveSiblingData,
        selectedFirstClass: selctedClass,
        firstClass: event.target.value,
      });
    }
    if (name === "firstSection") {
      const students = await filterStudentHandler(
        event.target.value,
        fiveSiblingData.firstClass
      );
      setFiveSiblingData({
        ...fiveSiblingData,
        firstStudentList: students,
        firstSection: event.target.value,
      });
    }
    if (name === "secondClass") {
      let selctedClass = classList.find(
        (clas) => clas._id === event.target.value
      );
      setFiveSiblingData({
        ...fiveSiblingData,
        selectedSecondClass: selctedClass,
        secondClass: event.target.value,
      });
    }
    if (name === "secondSection") {
      const students = await filterStudentHandler(
        event.target.value,
        fiveSiblingData.secondClass
      );
      setFiveSiblingData({
        ...fiveSiblingData,
        secondStudentList: students,
        secondSection: event.target.value,
      });
    }
    if (name === "thirdClass") {
      let selctedClass = classList.find(
        (clas) => clas._id === event.target.value
      );
      setFiveSiblingData({
        ...fiveSiblingData,
        selectedThirdClass: selctedClass,
        thirdClass: event.target.value,
      });
    }
    if (name === "thirdSection") {
      const students = await filterStudentHandler(
        event.target.value,
        fiveSiblingData.thirdClass
      );
      setFiveSiblingData({
        ...fiveSiblingData,
        thirdStudentList: students,
        thirdSection: event.target.value,
      });
    }
    if (name === "fourClass") {
      let selctedClass = classList.find(
        (clas) => clas._id === event.target.value
      );
      setFiveSiblingData({
        ...fiveSiblingData,
        selectedFourClass: selctedClass,
        fourClass: event.target.value,
      });
    }
    if (name === "fourSection") {
      const students = await filterStudentHandler(
        event.target.value,
        fiveSiblingData.fourClass
      );
      setFiveSiblingData({
        ...fiveSiblingData,
        fourStudentList: students,
        fourSection: event.target.value,
      });
    }
    if (name === "fiveClass") {
      let selctedClass = classList.find(
        (clas) => clas._id === event.target.value
      );
      setFiveSiblingData({
        ...fiveSiblingData,
        selectedFiveClass: selctedClass,
        fiveClass: event.target.value,
      });
    }
    if (name === "fiveSection") {
      const students = await filterStudentHandler(
        event.target.value,
        fiveSiblingData.fiveClass
      );
      setFiveSiblingData({
        ...fiveSiblingData,
        fiveStudentList: students,
        fiveSection: event.target.value,
      });
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
    setTwoSession(defaultSession._id);
    setThreeSession(defaultSession._id);
    setFourSession(defaultSession._id);
    setFiveSession(defaultSession._id);
  };

  const updateSiblingMasterHandler = async (type) => {
    const formData = new FormData();
    if (type === 2) {
      formData.set("name", "2 Sibling");
      formData.set("no_of_students", type);
      formData.set("session", twoSession);
    } else if (type === 3) {
      formData.set("name", "3 Sibling");
      formData.set("no_of_students", type);
      formData.set("session", threeSession);
    } else if (type === 4) {
      formData.set("name", "4 Sibling");
      formData.set("no_of_students", type);
      formData.set("session", fourSession);
    } else if (type === 5) {
      formData.set("name", "5 Sibling");
      formData.set("no_of_students", type);
      formData.set("session", fiveSession);
    }

    try {
      setLoading(true);
      const data = await updateSiblingMaster(user.school, user._id, formData);
      console.log(data);
      if (data.err) {
        setLoading(false);
        return toast.error(data.err);
      }
      setLoading(false);
      setMasterId(data._id);
      toast.success("Sibling Master Updated Successfully");
    } catch (err) {
      setLoading(false);
      toast.error(err);
    }
  };

  const updateSiblingStudentsHandler = (type) => async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.set("sibling_id", masterId);
    if (type === 2) {
      console.log(twoSiblingData);

      let siblingData = [
        {
          class: twoSiblingData.firstClass,
          section: twoSiblingData.firstSection,
          student: twoSiblingData.firstName,
          rate: twoSiblingData.firstRate,
          type: twoSiblingData.firstType,
        },
        {
          class: twoSiblingData.secondClass,
          section: twoSiblingData.secondSection,
          student: twoSiblingData.secondName,
          rate: twoSiblingData.secondRate,
          type: twoSiblingData.secondType,
        },
      ];

      formData.set("data", JSON.stringify(siblingData));
    } else if (type === 3) {
      console.log(threeSiblingData);
      let siblingData = [
        {
          class: threeSiblingData.firstClass,
          section: threeSiblingData.firstSection,
          student: threeSiblingData.firstName,
          rate: threeSiblingData.firstRate,
          type: threeSiblingData.firstType,
        },
        {
          class: threeSiblingData.secondClass,
          section: threeSiblingData.secondSection,
          student: threeSiblingData.secondName,
          rate: threeSiblingData.secondRate,
          type: threeSiblingData.secondType,
        },
        {
          class: threeSiblingData.thirdClass,
          section: threeSiblingData.thirdSection,
          student: threeSiblingData.thirdName,
          rate: threeSiblingData.thirdRate,
          type: threeSiblingData.thirdType,
        },
      ];
      formData.set("data", JSON.stringify(siblingData));
    } else if (type === 4) {
      console.log(fourSiblingData);
      let siblingData = [
        {
          class: fourSiblingData.firstClass,
          section: fourSiblingData.firstSection,
          student: fourSiblingData.firstName,
          rate: fourSiblingData.firstRate,
          type: fourSiblingData.firstType,
        },
        {
          class: fourSiblingData.secondClass,
          section: fourSiblingData.secondSection,
          student: fourSiblingData.secondName,
          rate: fourSiblingData.secondRate,
          type: fourSiblingData.secondType,
        },
        {
          class: fourSiblingData.thirdClass,
          section: fourSiblingData.thirdSection,
          student: fourSiblingData.thirdName,
          rate: fourSiblingData.thirdRate,
          type: fourSiblingData.thirdType,
        },
        {
          class: fourSiblingData.fourClass,
          section: fourSiblingData.fourSection,
          student: fourSiblingData.fourName,
          rate: fourSiblingData.fourRate,
          type: fourSiblingData.fourType,
        },
      ];
      formData.set("data", JSON.stringify(siblingData));
    } else if (type === 5) {
      console.log(fiveSiblingData);
      let siblingData = [
        {
          class: fiveSiblingData.firstClass,
          section: fiveSiblingData.firstSection,
          student: fiveSiblingData.firstName,
          rate: fiveSiblingData.firstRate,
          type: fiveSiblingData.firstType,

        },
        {
          class: fiveSiblingData.secondClass,
          section: fiveSiblingData.secondSection,
          student: fiveSiblingData.secondName,
          rate: fiveSiblingData.secondRate,
          type: fiveSiblingData.secondType,
        },
        {
          class: fiveSiblingData.thirdClass,
          section: fiveSiblingData.thirdSection,
          student: fiveSiblingData.thirdName,
          rate: fiveSiblingData.thirdRate,
          type: fiveSiblingData.thirdType,
        },
        {
          class: fiveSiblingData.fourClass,
          section: fiveSiblingData.fourSection,
          student: fiveSiblingData.fourName,
          rate: fiveSiblingData.fourRate,
          type: fiveSiblingData.fourType,

        },
        {
          class: fiveSiblingData.fiveClass,
          section: fiveSiblingData.fiveSection,
          student: fiveSiblingData.fiveName,
          rate: fiveSiblingData.fiveRate,
          type: fiveSiblingData.fiveType,
        }
      ]
      formData.set("data", JSON.stringify(siblingData));
    }

    try {
      setLoading(true);
      const data = await updateSiblingStudents(user.school, user._id, formData);
      console.log(data);
      if (data.err) {
        setLoading(false);
        return toast.error(data.err);
      }
      setLoading(false);
      toast.success("Sibling Students Updated Successfully");
      setTwoModal(false);
      setThreeModal(false);
      setFourModal(false);
      setFiveModal(false);
    } catch (err) {
      console.log(err);

      setLoading(false);
      toast.error("Something went wrong");
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
                  {/* Two Sibling */}
                  <tr>
                    <td>1</td>
                    <td>2 Sibling</td>
                    <td>
                      <select
                        required
                        className="form-control"
                        value={twoSession}
                        onChange={(e) => setTwoSession(e.target.value)}
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
                          updateSiblingMasterHandler(2);
                          setTwoModal(true);
                        }}
                      >
                        Add
                      </button>
                    </td>
                  </tr>
                  {/* Three Sibling */}
                  <tr>
                    <td>2</td>
                    <td>3 Sibling</td>
                    <td>
                      <select
                        required
                        className="form-control"
                        onChange={(e) => setThreeSession(e.target.value)}
                        value={threeSession}
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
                          updateSiblingMasterHandler(3);
                          setThreeModal(true);
                        }}
                      >
                        Add
                      </button>
                    </td>
                  </tr>
                  {/* Four Sibling */}
                  <tr>
                    <td>3</td>
                    <td>4 Sibling</td>
                    <td>
                      <select
                        required
                        className="form-control"
                        onChange={(e) => setFourSession(e.target.value)}
                        value={fourSession}
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
                          updateSiblingMasterHandler(4);
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
                        onChange={(e) => setFiveSession(e.target.value)}
                        value={fiveSession}
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
                          updateSiblingMasterHandler(5);
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
      {/* Two Sibling Modal */}
      <Modal
        className="modal-dialog-centered"
        isOpen={twoModal}
        toggle={() => setTwoModal(false)}
        size="xl"
      >
        <ModalBody>
          <div className="table_div_fees">
            <form onSubmit={updateSiblingStudentsHandler(2)}>
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
                      <option value="P">Percentage</option>
                      <option value="F">Flat Rate</option>
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
                      name="secondName"
                    >
                      <option value="" selected>
                        Select Student
                      </option>
                      {twoSiblingData.secondStudentList?.map((student) => {
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
                      name="secondRate"
                    />
                  </td>
                  <td>
                    <Input
                      id="exampleFormControlTextarea1"
                      type="select"
                      required
                      onChange={handleTwoChange("secondType")}
                      value={twoSiblingData.secondType}
                      name="secondType"
                    >
                      <option value="" selected>
                        Select Student
                      </option>
                      <option value="P">Percentage</option>
                      <option value="F">Flat Rate</option>
                    </Input>
                  </td>
                </tr>
              </table>
              <Row>
                <Col
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    margin: "1rem",
                  }}
                >
                  <Button color="primary" type="submit">
                    Submit
                  </Button>
                </Col>
              </Row>
            </form>
          </div>
        </ModalBody>
      </Modal>
      {/* Three Sibling Modal */}
      <Modal
        className="modal-dialog-centered"
        isOpen={threeModal}
        toggle={() => setThreeModal(false)}
        size="xl"
      >
        <ModalBody>
          <div className="table_div_fees">
            <form onSubmit={updateSiblingStudentsHandler(3)}>
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
                        Select Type
                      </option>
                      <option value="P">Percentage</option>
                      <option value="F">Flat Rate</option>
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
                      name="secondSection"
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
                      {threeSiblingData.secondStudentList?.map((student) => {
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
                      name="secondRate"
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
                        Select Type
                      </option>
                      <option value="P">Percentage</option>
                      <option value="F">Flat Rate</option>
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
                      onChange={handleThreeChange("thirdClass")}
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
                      onChange={handleThreeChange("thirdSection")}
                      value={threeSiblingData.thirdSection}
                      name="firstSection"
                    >
                      <option value="" selected>
                        Select Section
                      </option>
                      {threeSiblingData.selectedThirdClass?.section?.map(
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
                      onChange={handleThreeChange("thirdName")}
                      value={threeSiblingData.thirdName}
                      name="thirdName"
                    >
                      <option value="" selected>
                        Select Student
                      </option>
                      {threeSiblingData.thirdStudentList?.map((student) => {
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
                      onChange={handleThreeChange("thirdRate")}
                      value={threeSiblingData.thirdRate}
                      name="firstRate"
                    />
                  </td>
                  <td>
                    <Input
                      id="exampleFormControlTextarea1"
                      type="select"
                      required
                      onChange={handleThreeChange("thirdType")}
                      value={threeSiblingData.thirdType}
                      name="firstType"
                    >
                      <option value="" selected>
                        Select Student
                      </option>
                      <option value="P">Percentage</option>
                      <option value="F">Flat Rate</option>
                    </Input>
                  </td>
                </tr>
              </table>
              <Row>
                <Col
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    margin: "1rem",
                  }}
                >
                  <Button color="primary" type="submit">
                    Submit
                  </Button>
                </Col>
              </Row>
            </form>
          </div>
        </ModalBody>
      </Modal>
      {/* Four Sibling Modal */}
      <Modal
        className="modal-dialog-centered"
        isOpen={fourModal}
        toggle={() => setFourModal(false)}
        size="xl"
      >
        <ModalBody>
          <div className="table_div_fees">
            <form onSubmit={updateSiblingStudentsHandler(4)}>
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
                        Select Type
                      </option>
                      <option value="P">Percentage</option>
                      <option value="F">Flat Rate</option>
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
                      {fourSiblingData.secondStudentList?.map((student) => {
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
                        Select Type
                      </option>
                      <option value="P">Percentage</option>
                      <option value="F">Flat Rate</option>
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
                      onChange={handleFourChange("thirdClass")}
                      value={fourSiblingData.thirdClass}
                      name="thirdClass"
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
                      onChange={handleFourChange("thirdSection")}
                      value={fourSiblingData.thirdSection}
                      // name="secondSection"
                    >
                      <option value="" selected>
                        Select Section
                      </option>
                      {fourSiblingData.selectedThirdClass?.section?.map(
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
                      onChange={handleFourChange("thirdName")}
                      value={fourSiblingData.thirdName}
                      name="firstName"
                    >
                      <option value="" selected>
                        Select Student
                      </option>
                      {fourSiblingData.thirdStudentList?.map((student) => {
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
                      onChange={handleFourChange("thirdRate")}
                      value={fourSiblingData.thirdRate}
                      // name="firstRate"
                    />
                  </td>
                  <td>
                    <Input
                      id="exampleFormControlTextarea1"
                      type="select"
                      required
                      onChange={handleFourChange("thirdType")}
                      value={fourSiblingData.ThirdType}
                      // name="firstType"
                    >
                      <option value="" selected>
                        Select Type
                      </option>
                      <option value="P">Percentage</option>
                      <option value="F">Flat Rate</option>
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
                      onChange={handleFourChange("fourClass")}
                      value={fourSiblingData.fourClass}
                      // name="firstClass"
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
                      onChange={handleFourChange("fourSection")}
                      value={fourSiblingData.fourSection}
                      name="firstSection"
                    >
                      <option value="" selected>
                        Select Section
                      </option>
                      {fourSiblingData.selectedFourClass?.section?.map(
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
                      onChange={handleFourChange("fourName")}
                      value={fourSiblingData.fourName}
                      // name="firstName"
                    >
                      <option value="" selected>
                        Select Student
                      </option>
                      {fourSiblingData.fourStudentList?.map((student) => {
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
                      onChange={handleFourChange("fourRate")}
                      value={fourSiblingData.fourRate}
                      // name="firstRate"
                    />
                  </td>
                  <td>
                    <Input
                      id="exampleFormControlTextarea1"
                      type="select"
                      required
                      onChange={handleFourChange("fourType")}
                      value={fourSiblingData.fourType}
                      // name="firstType"
                    >
                      <option value="" selected>
                        Select Type
                      </option>
                      <option value="P">Percentage</option>
                      <option value="F">Flat Rate</option>
                    </Input>
                  </td>
                </tr>
              </table>
              <Row>
                <Col
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    margin: "1rem",
                  }}
                >
                  <Button color="primary" type="submit">
                    Submit
                  </Button>
                </Col>
              </Row>
            </form>
          </div>
        </ModalBody>
      </Modal>
      {/* Five Sibling Modal */}
      <Modal
        className="modal-dialog-centered"
        isOpen={fiveModal}
        toggle={() => setFiveModal(false)}
        size="xl"
      >
        <ModalBody>
          <div className="table_div_fees">
            <form onSubmit={updateSiblingStudentsHandler(5)}>
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
                        onChange={handleFiveChange("firstClass")}
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
                          Select Type
                        </option>
                        <option value="P">Percentage</option>
                        <option value="F">Flat Rate</option>
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
                        // name="firstName"
                      >
                        <option value="" selected>
                          Select Student
                        </option>
                        {fiveSiblingData.secondStudentList?.map((student) => {
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
                          Select Type
                        </option>
                        <option value="P">Percentage</option>
                        <option value="F">Flat Rate</option>
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
                        onChange={handleFiveChange("thirdClass")}
                        value={fiveSiblingData.thirdClass}
                        // name="firstClass"
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
                        onChange={handleFiveChange("thirdSection")}
                        value={fiveSiblingData.thirdSection}
                        // name="firstSection"
                      >
                        <option value="" selected>
                          Select Section
                        </option>
                        {fiveSiblingData.selectedThirdClass?.section?.map(
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
                        onChange={handleFiveChange("thirdName")}
                        value={fiveSiblingData.thirdName}
                        // name="firstName"
                      >
                        <option value="" selected>
                          Select Student
                        </option>
                        {fiveSiblingData.thirdStudentList?.map((student) => {
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
                        onChange={handleFiveChange("thirdRate")}
                        value={fiveSiblingData.thirdRate}
                        // name="firstRate"
                      />
                    </td>
                    <td>
                      <Input
                        id="exampleFormControlTextarea1"
                        type="select"
                        required
                        onChange={handleFiveChange("thirdType")}
                        value={fiveSiblingData.thirdType}
                        // name="firstType"
                      >
                        <option value="" selected>
                          Select Type
                        </option>
                        <option value="P">Percentage</option>
                        <option value="F">Flat Rate</option>
                      </Input>
                    </td>
                  </tr>
                  {/* Four */}
                  <tr>
                    <td>4</td>
                    <td>
                      <Input
                        id="exampleFormControlTextarea1"
                        type="select"
                        required
                        onChange={handleFiveChange("fourClass")}
                        value={fiveSiblingData.fourClass}
                        // name="firstClass"
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
                        onChange={handleFiveChange("fourSection")}
                        value={fiveSiblingData.fourSection}
                        name="firstSection"
                      >
                        <option value="" selected>
                          Select Section
                        </option>
                        {fiveSiblingData.selectedFourClass?.section?.map(
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
                        onChange={handleFiveChange("fourName")}
                        value={fiveSiblingData.fourName}
                        // name="firstName"
                      >
                        <option value="" selected>
                          Select Student
                        </option>
                        {fiveSiblingData.fourStudentList?.map((student) => {
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
                        onChange={handleFiveChange("fourRate")}
                        value={fiveSiblingData.fourRate}
                        name="firstRate"
                      />
                    </td>
                    <td>
                      <Input
                        id="exampleFormControlTextarea1"
                        type="select"
                        required
                        onChange={handleFiveChange("fourType")}
                        value={fiveSiblingData.fourType}
                        name="firstType"
                      >
                        <option value="" selected>
                          Select Type
                        </option>
                        <option value="P">Percentage</option>
                        <option value="F">Flat Rate</option>
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
                        onChange={handleFiveChange("fiveClass")}
                        value={fiveSiblingData.fiveClass}
                        // name="firstClass"
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
                        onChange={handleFiveChange("fiveSection")}
                        value={fiveSiblingData.fiveSection}
                        // name="firstSection"
                      >
                        <option value="" selected>
                          Select Section
                        </option>
                        {fiveSiblingData.selectedFiveClass?.section?.map(
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
                        onChange={handleFiveChange("fiveName")}
                        value={fiveSiblingData.fiveName}
                        // name="firstName"
                      >
                        <option value="" selected>
                          Select Student
                        </option>
                        {fiveSiblingData.fiveStudentList?.map((student) => {
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
                        onChange={handleFiveChange("fiveRate")}
                        value={fiveSiblingData.fiveRate}
                        name="firstRate"
                      />
                    </td>
                    <td>
                      <Input
                        id="exampleFormControlTextarea1"
                        type="select"
                        required
                        onChange={handleFiveChange("fiveType")}
                        value={fiveSiblingData.fiveType}
                        name="firstType"
                      >
                        <option value="" selected>
                          Select Type
                        </option>
                        <option value="P">Percentage</option>
                        <option value="F">Flat Rate</option>
                      </Input>
                    </td>
                  </tr>
                </table>
              </table>
              <Row>
                <Col
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    margin: "1rem",
                  }}
                >
                  <Button color="primary" type="submit">
                    Submit
                  </Button>
                </Col>
              </Row>
            </form>
          </div>
        </ModalBody>
      </Modal>
    </>
  );
};

export default SiblingMaster;
