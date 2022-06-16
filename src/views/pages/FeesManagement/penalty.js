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
import { createFees } from "api/FeesManagement";
import { allSessions } from "api/session";
import { allClass } from "api/class";
import { getFeesCustome } from "api/FeesManagement";
import { deleteFees } from "api/FeesManagement";
import { updateFees } from "api/FeesManagement";
import {
  createPenalty,
  deletePenalty,
  getFeesObject,
  getFeesPenalty,
  updatePenalty,
} from "../../../api/FeesManagement/penalty";

const PenaltyMaster = () => {
  const [sessions, setSessions] = useState("");
  const [classs, setClasss] = useState("");
  const [sessionID, setSessionID] = useState("");
  const [classID, setClassID] = useState("");
  const [showLoad, setShowLoad] = useState(false);
  const [type, setType] = useState(0);
  const [feesNumber, setFeesNumber] = useState([]);
  const [feesData, setFeesData] = useState([]);
  const [viewFeesData, setViewFeesData] = useState("");
  const [penaltydata, setPenaltydata] = useState("");
  const [viewDataOnly, setViewDataOnly] = useState("");

  const [ignored, forceUpdate] = useReducer((x) => x + 1, 0);

  useEffect(async () => {
    setShowLoad(true);
    await getAllClasses();
    await getSession();
    setShowLoad(false);
  }, []);

  const getSession = async () => {
    const { user, token } = isAuthenticated();
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
    const { user, token } = isAuthenticated();
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

      setClassID(JSON.parse(e.target.value));
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setShowLoad(true);
    const { user, token } = isAuthenticated();
    if (classID === "" && sessionID === "") {
      setShowLoad(false);
      toast.error("Please Select Data First");
    } else {
      let temp = {
        class: classID._id,
        session: sessionID._id,
      };
      var searchAPI = await getFeesObject(
        user.school,
        user._id,
        token,
        JSON.stringify(temp)
      );
      console.log(searchAPI);
      if (searchAPI && searchAPI.length > 0) {
        var searchAPI2 = await getFeesPenalty(
          user.school,
          user._id,
          token,
          JSON.stringify(temp)
        );
        setPenaltydata(searchAPI);
        if (searchAPI2 && searchAPI2.penalty) {
          setType(2);
          setViewFeesData(searchAPI2);
          var temp_data = searchAPI2.penalty.map((data, index) => {
            return {
              name: data["name"],
              amount: data["amount"],
              penalty_type: data["penalty_type"],
            };
          });
          setViewDataOnly(temp_data);
          setFeesNumber(searchAPI2.penalty);
          setShowLoad(false);
        } else {
          setType(1);
          setViewFeesData(searchAPI);
          setFeesNumber(searchAPI);
          setShowLoad(false);
        }
      } else {
        toast.error("Class Fees is not added please add that first");
        setShowLoad(false);
      }
    }
  };

  const handleChange = (name, data, index) => (e) => {
    let temp = feesData;
    temp[index] = { ...feesData[index], name: data, [name]: e.target.value };
    setFeesData(temp);
    console.log(feesData);
  };

  const handleDate = (name, data, index) => (e) => {
    if (e.target.value === "") {
      let temp = feesData;
      temp[index] = { ...feesData[index], name: data, [name]: "" };
      setFeesData(temp);
    } else {
      let temp = feesData;
      temp[index] = { ...feesData[index], name: data, [name]: e.target.value };
      setFeesData(temp);
    }
  };

  const handleChangeEdit = (name, data, index) => (e) => {
    let temp = feesNumber;
    temp[index] = { ...feesNumber[index], name: data, [name]: e.target.value };
    setFeesNumber(temp);
    forceUpdate();
    console.log(feesNumber);
  };

  const handleDateEdit = (name, data, index) => (e) => {
    if (e.target.value === "") {
      let temp = feesNumber;
      temp[index] = { ...feesNumber[index], name: data, [name]: "" };
      setFeesNumber(temp);
      forceUpdate();
    } else {
      let temp = feesNumber;
      temp[index] = {
        ...feesNumber[index],
        name: data,
        [name]: e.target.value,
      };
      setFeesNumber(temp);
      forceUpdate();
    }
  };

  const handleSubmitFees = async (e) => {
    setShowLoad(true);
    e.preventDefault();
    let formdata = new FormData();
    const { user, token } = isAuthenticated();
    formdata.set("class", classID._id);
    formdata.set("school", user.school);
    formdata.set("penalty", JSON.stringify(feesData));
    formdata.set("session", sessionID._id);
    try {
      var createFeesAPI = await createPenalty(user._id, token, formdata);
      console.log(createFeesAPI);
      if (createFeesAPI && createFeesAPI.err) {
        setShowLoad(false);
        toast.error(createFeesAPI.err);
      } else {
        setShowLoad(false);
        toast.success("Penalty Added Successfully");
        setTimeout(() => {
          window.location.reload(1);
        }, 1000);
      }
    } catch (error) {
      toast.error("Something Went Wrong!");
    }
  };
  const handleSubmitFeesEdit = async (e) => {
    setShowLoad(true);
    e.preventDefault();
    let formdata = new FormData();
    const { user, token } = isAuthenticated();
    formdata.set("penalty", JSON.stringify(feesNumber));
    try {
      var editFeesAPI = await updatePenalty(
        viewFeesData._id,
        user._id,
        token,
        formdata
      );
      console.log(editFeesAPI);
      if (editFeesAPI && editFeesAPI.err) {
        setShowLoad(false);
        toast.error(editFeesAPI.err);
      } else {
        setShowLoad(false);
        toast.success("Penalty Updated Successfully");
        setTimeout(() => {
          window.location.reload(1);
        }, 1000);
      }
    } catch (error) {
      toast.error("Something Went Wrong!");
    }
  };

  const handleEditSelect = (e) => {
    e.preventDefault();
    setShowLoad(true);
    setType(3);
    setShowLoad(false);
  };

  const handleDeleteSelect = async (e) => {
    e.preventDefault();
    setShowLoad(true);
    const { user, token } = isAuthenticated();
    try {
      var deleteAPI = await deletePenalty(viewFeesData._id, user._id, token);
      if (deleteAPI && deleteAPI.err) {
        setShowLoad(false);
        toast.error(deleteAPI.err);
      } else {
        setShowLoad(false);
        toast.success("Penalty Delete Successfully");
        setTimeout(() => {
          window.location.reload(1);
        }, 1000);
      }
    } catch (error) {
      setShowLoad(false);
    }
  };

  const column = [
    {
      key: "name",
      title: "Name",
      dataIndex: "name",
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm }) => {
        return (
          <>
            <Row>
              <Col>
                <Input
                  autoFocus
                  id="search_bar_table"
                  placeholder="Type text here"
                  value={selectedKeys[0]}
                  onChange={(e) => {
                    setSelectedKeys(e.target.value ? [e.target.value] : []);
                    confirm({ closeDropdown: false });
                  }}
                  onBlur={() => {
                    confirm();
                  }}
                />
              </Col>
            </Row>
          </>
        );
      },
      filterIcon: () => {
        return <SearchOutlined />;
      },
      onFilter: (value, record) => {
        return record.name.toLowerCase().includes(value.toLowerCase());
      },
      sorter: (record1, record2) => {
        return record1.name > record2.name;
      },
    },
    {
      key: "amount",
      title: "Amount",
      dataIndex: "amount",
      sorter: (record1, record2) => {
        return record1.amount > record2.amount;
      },
    },
    {
      key: "penalty_type",
      title: "Penalty Type",
      dataIndex: "penalty_type",
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm }) => {
        return (
          <>
            <Row>
              <Col>
                <Input
                  autoFocus
                  id="search_bar_table"
                  placeholder="Type text here"
                  value={selectedKeys[0]}
                  onChange={(e) => {
                    setSelectedKeys(e.target.value ? [e.target.value] : []);
                    confirm({ closeDropdown: false });
                  }}
                  onBlur={() => {
                    confirm();
                  }}
                />
              </Col>
            </Row>
          </>
        );
      },
      filterIcon: () => {
        return <SearchOutlined />;
      },
      onFilter: (value, record) => {
        return record.penalty_type.toLowerCase().includes(value.toLowerCase());
      },
      sorter: (record1, record2) => {
        return record1.penalty_type > record2.penalty_type;
      },
    },
  ];

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
            <h2>Penalty</h2>
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
                          <option key={clas._id} value={JSON.stringify(clas)}>
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
      {type === 1 && (
        <Container fluid>
          <Card>
            <CardHeader>
              <h2>Set Penalty Fees</h2>
              <p>Class : {classID.name}</p>
              <p>Session : {sessionID.name}</p>
            </CardHeader>
            <form onSubmit={handleSubmitFees}>
              <CardBody>
                <div className="table_div_fees">
                  <table className="fees_table">
                    <thead>
                      <th>Name</th>
                      <th>Amount</th>
                      <th>Penalty Type</th>
                    </thead>
                    <tbody>
                      {feesNumber.map((data, index) => {
                        return (
                          <tr>
                            <td>{data}</td>
                            <td>
                              <Input
                                id="exampleFormControlTextarea1"
                                type="number"
                                required
                                placeholder="Amount"
                                onChange={handleChange("amount", data, index)}
                              />
                            </td>
                            <td>
                              <select
                                required
                                className="form-control"
                                onChange={handleChange(
                                  "penalty_type",
                                  data,
                                  index
                                )}
                              >
                                <option value="" selected disabled>
                                  Select Penalty Type
                                </option>
                                <option value="flat">Flat</option>
                                <option value="percentage">% Percentage</option>
                              </select>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
                <br />
                <Row className="left_button">
                  <Col>
                    <Button type="submit" color="primary">
                      Submit
                    </Button>
                  </Col>
                </Row>
              </CardBody>
            </form>
          </Card>
        </Container>
      )}
      {type === 2 && (
        <Container fluid>
          <Card>
            <CardHeader>
              <h2>View Penalty Fees</h2>
              <p>
                Class :{" "}
                {viewFeesData && viewFeesData.class && viewFeesData.class.name}
              </p>
              <p>
                Session :{" "}
                {viewFeesData &&
                  viewFeesData.session &&
                  viewFeesData.session.name}
              </p>
              <Button onClick={handleEditSelect} size="sm" color="primary">
                Edit Penalty
              </Button>
              <Button size="sm" color="danger">
                <Popconfirm
                  title="Are You Sure to Delete?"
                  onConfirm={handleDeleteSelect}
                >
                  Delete Entire Penalty
                </Popconfirm>
              </Button>
            </CardHeader>
            <form onSubmit={handleSubmitFees}>
              <CardBody>
                <div className="table_div_fees">
                  <Table
                    style={{ whiteSpace: "pre" }}
                    loading={showLoad}
                    exportableProps={{
                      fileName: "Penalty Fees",
                      showColumnPicker: true,
                    }}
                    pagination={{
                      pageSizeOptions: ["5", "10", "30", "60", "100", "1000"],
                      showSizeChanger: true,
                    }}
                    columns={column}
                    dataSource={viewDataOnly}
                  />
                  {/* <table className="fees_table">
                    <thead>
                      <th>Name</th>
                      <th>Amount</th>
                      <th>Penalty Type</th>
                    </thead>
                    <tbody>
                      {feesNumber.map((data, index) => {
                        return (
                          <tr>
                            <td>{data["name"]}</td>
                            <td>{data["amount"]}</td>
                            <td>{data["penalty_type"]}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table> */}
                </div>
                <br />
              </CardBody>
            </form>
          </Card>
        </Container>
      )}
      {type === 3 && (
        <Container fluid>
          <Card>
            <CardHeader>
              <h2>Edit Penalty Fees</h2>
              <p>
                Class :{" "}
                {viewFeesData && viewFeesData.class && viewFeesData.class.name}
              </p>
              <p>
                Session :{" "}
                {viewFeesData &&
                  viewFeesData.session &&
                  viewFeesData.session.name}
              </p>
            </CardHeader>
            <form onSubmit={handleSubmitFeesEdit}>
              <CardBody>
                <div className="table_div_fees">
                  <table className="fees_table">
                    <thead>
                      <th>Name</th>
                      <th>Amount</th>
                      <th>Penalty Type</th>
                    </thead>
                    <tbody>
                      {penaltydata.map((data, index) => {
                        return (
                          <tr>
                            <td>{data}</td>
                            <td>
                              <Input
                                id="exampleFormControlTextarea1"
                                type="number"
                                required
                                placeholder="Amount"
                                value={
                                  feesNumber[index] &&
                                  feesNumber[index]["amount"]
                                }
                                onChange={handleChangeEdit(
                                  "amount",
                                  data,
                                  index
                                )}
                              />
                            </td>
                            <td>
                              <select
                                required
                                className="form-control"
                                value={
                                  feesNumber[index] &&
                                  feesNumber[index]["penalty_type"]
                                }
                                onChange={handleChangeEdit(
                                  "penalty_type",
                                  data,
                                  index
                                )}
                              >
                                <option value="">Select Penalty Type</option>
                                <option value="flat">Flat</option>
                                <option value="percentage">% Percentage</option>
                              </select>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
                <br />
                <Row className="left_button">
                  <Col>
                    <Button type="submit" color="primary">
                      Submit
                    </Button>
                  </Col>
                </Row>
              </CardBody>
            </form>
          </Card>
        </Container>
      )}
    </>
  );
};

export default PenaltyMaster;
