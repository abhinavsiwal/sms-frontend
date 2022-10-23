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
import { SearchOutlined } from "@ant-design/icons";
import { Popconfirm } from "antd";
import SimpleHeader from "components/Headers/SimpleHeader";
import LoadingScreen from "react-loading-screen";
import { Table } from "ant-table-extensions";
import { isAuthenticated } from "api/auth";

import "./fees_style.css";
import { toast, ToastContainer } from "react-toastify";
import { allSessions } from "api/session";
import { allClass } from "api/class";
import { getFeesTypeList } from "api/Fees";
import { updatePenalty } from "api/Fees";

const PenaltyMaster = () => {
  const [sessions, setSessions] = useState("");
  const [classs, setClasss] = useState("");
  const [sessionID, setSessionID] = useState("");
  const [classID, setClassID] = useState("");
  const [showLoad, setShowLoad] = useState(false);
  const [type, setType] = useState(0);
  const [feesNumber, setFeesNumber] = useState([]);
  const [feesData, setFeesData] = useState([]);
  const [viewFeesData, setViewFeesData] = useState(false);
  const [penaltydata, setPenaltydata] = useState("");
  const [viewDataOnly, setViewDataOnly] = useState("");
  const { user, token } = isAuthenticated();
  const [feesType, setFeesType] = useState("");
  const [ignored, forceUpdate] = useReducer((x) => x + 1, 0);
  const [selectedFees, setSelectedFees] = useState({});
  const [viewPenalty, setViewPenalty] = useState(false);
  const [penaltyCharges, setPenaltyCharges] = useState("");
  const [penaltyType, setPenaltyType] = useState("");
  const [applicableDate, setApplicableDate] = useState("");
  const [fees, setFees] = useState([]);
  useEffect(async () => {
    setShowLoad(true);
    getAllClasses();
    getSession();
    setShowLoad(false);
  }, []);

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
      const classs = await allClass(user._id, user.school, token);
      if (classs.err) {
        return toast.error(classs.err);
      } else {
        setClasss(classs);
        return;
      }
    } catch (err) {
      toast.error("Something Went Wrong!");
    }
  };

  const handleSession = (e) => {
    e.preventDefault();
    if (e.target.value === "") {
    } else {
      setType(0);

      setSessionID(JSON.parse(e.target.value));
    }
  };

  const handleClass = (e) => {
    e.preventDefault();
    if (e.target.value === "") {
    } else {
      setType(0);

      setClassID(e.target.value);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.set("class", classID);
    formData.set("session", sessionID._id);
    try {
      setShowLoad(true);
      const data = await getFeesTypeList(user.school, user._id, formData);
      console.log(data);
      if (data.err) {
        setShowLoad(false);
        return toast.error(data.err);
      }
      setPenaltydata(data);
      setViewFeesData(true);
      setShowLoad(false);
    } catch (err) {
      setShowLoad(false);
      console.log(err);
      toast.error("Getting Fees Type List Failed!");
    }
  };

  useEffect(() => {
    if (feesType === "") {
      setViewPenalty(false);
      return;
    }
    const selectedFees1 = penaltydata.find((item) => item._id === feesType);
    setSelectedFees(selectedFees1);
    console.log(selectedFees1);
    setViewPenalty(true);
  }, [feesType]);

  const submitFees = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.set("sub_fees_management_id", selectedFees.fees_management_id);
    formData.set(
      "sub_fees_management_id",
      JSON.stringify(fees)
    );
    formData.set("penalty_charges", penaltyCharges);
    formData.set("applicable_date", applicableDate);
    formData.set("penalty_rate", penaltyType);

    try {
      setShowLoad(true);
      const data = await updatePenalty(user.school, user._id, formData);
      console.log(data);
      if (data.err) {
        setShowLoad(false);
        return toast.error(data.err);
      }
      setShowLoad(false);
      toast.success("Penalty Updated Successfully!");
      setViewPenalty(false);
      setViewFeesData(false)
    } catch (err) {
      console.log(err);
      toast.error("Updating Penalty Failed!");
      setShowLoad(false);
    }
  };

  const handleFees = (event) => {
    console.log(event.target.value);
    let updatedFees=[...fees];
    if (event.target.checked) {
      updatedFees=[...fees, event.target.value];
    } else {
      updatedFees.splice(fees.indexOf(event.target.value), 1);
    }
    setFees(updatedFees);
  };

  return (
    <>
      <SimpleHeader name="Penalty" parentName="Penalty Management" />
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
        loading={showLoad}
        bgColor="#f1f1f1"
        spinnerColor="#9ee5f8"
        textColor="#676767"
        text="Please Wait..."
      ></LoadingScreen>
      <Container fluid className="mt--6">
        <Card>
          <CardHeader>
            <h2>Penalty Master</h2>
          </CardHeader>
          <CardBody>
            <Form onSubmit={handleSearch}>
              <Row className="feesMainRow" fluid>
                <Col>
                  <label
                    className="form-control-label"
                    htmlFor="exampleFormControlSelect3"
                  >
                    Select Class
                  </label>
                  <Input
                    id="example4cols3Input"
                    type="select"
                    onChange={handleClass}
                    required
                  >
                    <option value="" disabled selected>
                      Select Class
                    </option>
                    {classs &&
                      classs !== "" &&
                      classs.map((clas) => {
                        return (
                          <option key={clas._id} value={clas._id}>
                            {clas.name}
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
                    onChange={handleSession}
                  >
                    <option value="">Select Session</option>
                    {sessions &&
                      sessions.map((data) => {
                        return (
                          <option key={data._id} value={JSON.stringify(data)}>
                            {data.name}
                          </option>
                        );
                      })}
                  </select>
                </Col>
              </Row>
              <br />
              <Row className="left_button">
                <Col>
                  <Button color="primary" type="submit">
                    Next
                  </Button>
                </Col>
              </Row>
            </Form>
          </CardBody>
        </Card>
      </Container>
      {viewFeesData && (
        <Card>
          <CardHeader>
            <h2>Select Fees Type</h2>
          </CardHeader>
          <CardBody>
            <form onSubmit={submitFees} >
              <Row>
                {penaltydata &&
                  penaltydata.map((penalty, index) => {
                    return (
                      <Col key={index} md={4}>
                        <div className="custom-control custom-checkbox mb-3">
                          <Input
                            className="custom-control-input"
                            id={`customCheck${index}`}
                            type="checkbox"
                            onChange={handleFees}
                            value={penalty._id}
                          />
                          <label
                            className="custom-control-label"
                            htmlFor={`customCheck${index}`}
                          >
                            {penalty.name}
                          </label>
                        </div>
                      </Col>
                    );
                  })}
              </Row>
            
              <Row className=" feesMainRow " fluid>
                <Col>
                  <label
                    className="form-control-label"
                    htmlFor="exampleFormControlSelect3"
                  >
                    Penalty Charges
                  </label>
                  <Input
                    id="example4cols3Input"
                    type="number"
                    required
                    value={penaltyCharges}
                    placeholder="Enter Penalty Charges"
                    onChange={(e) => setPenaltyCharges(e.target.value)}
                  />
                </Col>
                <Col>
                  <label
                    className="form-control-label"
                    htmlFor="exampleFormControlSelect3"
                  >
                    Penalty Type
                  </label>
                  <Input
                    id="example4cols3Input"
                    type="select"
                    value={penaltyType}
                    required
                    onChange={(e) => setPenaltyType(e.target.value)}
                  >
                    <option value="" disabled selected>
                      Select Penalty Type
                    </option>
                    <option value="flat_rate">Flat Rate</option>
                    <option value="percentage">Percentage</option>
                  </Input>
                </Col>
                <Col>
                  <label
                    className="form-control-label"
                    htmlFor="exampleFormControlSelect3"
                  >
                    Applicable Date
                  </label>
                  <Input
                    id="example4cols3Input"
                    type="date"
                    required
                    value={applicableDate}
                    onChange={(e) => setApplicableDate(e.target.value)}
                  />
                </Col>
              </Row>
              <br />
              <Row className="left_button">
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
    </>
  );
};

export default PenaltyMaster;
