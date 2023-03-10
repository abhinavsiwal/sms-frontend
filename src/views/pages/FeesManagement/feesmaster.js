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

import { Table } from "ant-table-extensions";

import SimpleHeader from "components/Headers/SimpleHeader";
import LoadingScreen from "react-loading-screen";

import { isAuthenticated } from "api/auth";

import "./fees_style.css";
import { toast, ToastContainer } from "react-toastify";
import { allSessions } from "api/session";
import { allClass } from "api/class";
import { getFees, updateFees } from "api/Fees";
const FeesMaster1 = () => {
  const [sessions, setSessions] = useState("");
  const [classs, setClasss] = useState("");
  const [sessionID, setSessionID] = useState("");
  const [classID, setClassID] = useState("");
  const [fees_type, setFees_type] = useState("");
  const [showLoad, setShowLoad] = useState(false);
  const [type, setType] = useState(0);
  const [feesNumber, setFeesNumber] = useState([]);
  const [feesData, setFeesData] = useState([]);
  const [viewFeesData, setViewFeesData] = useState("");
  const [viewOneTime, setViewOneTime] = useState("");
  const [viewReccuring, setViewReccuring] = useState("");
  const [checked, setChecked] = useState(false);
  const [ignored, forceUpdate] = useReducer((x) => x + 1, 0);
  const { user, token } = isAuthenticated();

  useEffect(() => {
    getSession();
    getAllClasses();
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
      setSessionID(e.target.value);
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
  useEffect(() => {
    if (sessions.length !== 0) {
      defaultSession1();
    }
  }, [sessions]);

  const defaultSession1 = async () => {
    const defaultSession = await sessions.find(
      (session) => session.status === "current"
    );
    setSessionID(defaultSession._id);
  };

  const handleType = (e) => {
    e.preventDefault();
    if (e.target.value === "") {
    } else {
      setType(0);
      setFees_type(e.target.value);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setShowLoad(true);
    if (classID === "" && sessionID === "" && fees_type === "") {
      setShowLoad(false);

      toast.error("Please Select Data First");
    } else {
      const formData = new FormData();
      formData.set("class", classID);
      formData.set("fees_type", fees_type);
      formData.set("session", sessionID);

      try {
        const data = await getFees(user.school, user._id, formData);
        console.log(data);

        if (data.err === "Fees data not available.") {
          if (fees_type === "one_time") {
            setFeesNumber([]);
            setType(1);
          } else {
            setFeesNumber([
              {
                name: "Hostel",
              },
              {
                name: "Transportation",
              },
            ]);
            let temp = feesData;
            temp[0] = { ...feesData[0], name: "Hostel" };
            temp[1] = { ...feesData[1], name: "Transportation" };
            setFeesData(temp);
            setType(2);
          }
          setShowLoad(false);
          return;
        }

        if (data.err) {
          setShowLoad(false);
          toast.error(data.err);
          return;
        }

        setViewFeesData(data);
        var temp_data = data.map((data, index) => {
          return {
            name: data["name"],
            total: data["total_amount"],
            start_date:
              data["start_date"] && getFormattedDate(data["start_date"]),
            end_date: data["end_date"] && getFormattedDate(data["end_date"]),
            key: index,
          };
        });
        setViewOneTime(temp_data);
        setFeesNumber(data);
        setType(3);

        setShowLoad(false);
      } catch (err) {
        setShowLoad(false);
        toast.error("Something Went Wrong!");
      }
    }
  };

  const handleAddFees = (e) => {
    e.preventDefault();
    console.log("clicked");
    let temp = feesNumber;
    temp.push({ option: "" });
    console.log(temp);
    setFeesNumber(temp);
    forceUpdate();
  };
  const handleName = (name, index) => (e) => {
    let temp = feesData;
    temp[index] = { ...feesData[index], name: e.target.value };
    setFeesData(temp);
    console.log(feesData);
  };

  const handleChange = (name, index) => (e) => {
    let temp = feesData;
    temp[index] = { ...feesData[index], [name]: e.target.value };
    setFeesData(temp);
    console.log(feesData);
  };

  const handleDate = (name, index) => (e) => {
    if (e.target.value === "") {
      let temp = feesData;
      temp[index] = { ...feesData[index], [name]: "" };
      setFeesData(temp);
    } else {
      let temp = feesData;
      temp[index] = { ...feesData[index], [name]: e.target.value };
      setFeesData(temp);
    }
  };

  const handleSubmitFees = async (e) => {
    e.preventDefault();
    console.log(feesData);
    const formData = new FormData();
    formData.set("class", classID);
    formData.set("fees_type", fees_type);
    formData.set("session", sessionID);
    formData.set("fees_details", JSON.stringify(feesData));

    try {
      setShowLoad(true);
      const data = await updateFees(user.school, user._id, formData);
      console.log(data);
      if (data.err) {
        setShowLoad(false);
        toast.error(data.err);
        return;
      }
      setShowLoad(false);
      toast.success("Fees Added Successfully");
    } catch (err) {
      setShowLoad(false);
      console.log(err);
      toast.error("Something Went Wrong!");
    }
  };
  const column = [
    {
      key: "name",
      title: "Name",
      dataIndex: "name",
      align: "left",
    },
    {
      key: "total",
      align: "left",
      title: "Total",
      dataIndex: "total",
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
        return record.total.toLowerCase().includes(value.toLowerCase());
      },
      sorter: (record1, record2) => {
        return record1.total > record2.total;
      },
    },
    {
      key: "start_date",
      title: "Start Date",
      dataIndex: "start_date",
      align: "left",
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
        return record.start_date.toLowerCase().includes(value.toLowerCase());
      },
      sorter: (record1, record2) => {
        return record1.start_date > record2.start_date;
      },
    },
    {
      key: "end_date",
      title: "End Date",
      dataIndex: "end_date",
      align: "left",
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
        return record.end_date.toLowerCase().includes(value.toLowerCase());
      },
      sorter: (record1, record2) => {
        return record1.end_date > record2.end_date;
      },
    },
  ];
  const handleEditSelect = (e) => {
    e.preventDefault();
    setShowLoad(true);
    setType(4);
    setShowLoad(false);
  };

  const handleNameEdit = (name, index) => (e) => {
    let temp = feesNumber;
    temp[index] = { ...feesNumber[index], name: e.target.value };
    setFeesNumber(temp);
    forceUpdate();

    console.log(feesNumber);
  };

  const handleChangeEdit = (name, index) => (e) => {
    let temp = feesNumber;
    temp[index] = { ...feesNumber[index], [name]: e.target.value };
    setFeesNumber(temp);
    forceUpdate();

    console.log(feesNumber);
  };

  const handleDateEdit = (name, index) => (e) => {
    if (e.target.value === "") {
      let temp = feesNumber;
      temp[index] = { ...feesNumber[index], [name]: "" };
      setFeesNumber(temp);
      forceUpdate();
    } else {
      let temp = feesNumber;
      temp[index] = { ...feesNumber[index], [name]: e.target.value };
      setFeesNumber(temp);
      forceUpdate();
    }
  };

  const handleDeleteEdit = (index) => (e) => {
    let temp = feesNumber;
    temp.splice(index, 1);
    setFeesNumber(temp);
    forceUpdate();
  };

  const handleSubmitFeesEdit = async (e) => {
    e.preventDefault();
    console.log(feesNumber);
    const formData = new FormData();
    formData.set("class", classID);
    formData.set("fees_type", fees_type);
    formData.set("session", sessionID);
    formData.set("fees_details", JSON.stringify(feesNumber));

    try {
      setShowLoad(true);
      const data = await updateFees(user.school, user._id, formData);
      console.log(data);
      if (data.err) {
        setShowLoad(false);
        toast.error(data.err);
        return;
      }

      toast.success("Fees Updated Successfully!");
      setShowLoad(false);
      window.location.reload();
    } catch (err) {
      setShowLoad(false);
      console.log(err);
      toast.error("Something Went Wrong!");
    }
  };

  const formatDate1 = (date) => {
    console.log(date);
    let yourDate = new Date(date);
    return yourDate.toISOString().split("T")[0];
  };

  function getFormattedDate(date1) {
    let date = new Date(date1);
    var year = date.getFullYear();

    var month = (1 + date.getMonth()).toString();
    month = month.length > 1 ? month : "0" + month;

    var day = date.getDate().toString();
    day = day.length > 1 ? day : "0" + day;

    return day + "/" + month + "/" + year;
  }

  const deleteEntireFeesHandler = async () => {};

  return (
    <>
      <SimpleHeader name="Fees" parentName="Fees Management" />
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
            <h2>Fees</h2>
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
                    htmlFor="exampleFormControlSelect3"
                  >
                    Select Type
                  </label>
                  <Input
                    id="example4cols3Input"
                    type="select"
                    onChange={handleType}
                    required
                  >
                    <option value="" disabled selected>
                      Select Type
                    </option>
                    <option value="one_time">OneTime Fees</option>
                    <option value="reoccuring">Recurring Fees</option>
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
                    value={sessionID}
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
              <Row>
                <Col>
                  <h2>Set OneTime Fees</h2>
                </Col>
              </Row>

              <Button size="sm" color="primary" onClick={handleAddFees}>
                Add Fees
              </Button>
            </CardHeader>
            <CardBody>
              <form>
                <div className="table_div_fees">
                  <table className="fees_table">
                    <thead>
                      <th>Name</th>
                      <th>Start Date</th>
                      <th>End Date</th>
                      <th>Total Amount</th>
                    </thead>
                    <tbody>
                      {feesNumber &&
                        feesNumber.map((data, index) => {
                          return (
                            <tr>
                              <td>
                                <Input
                                  id="exampleFormControlTextarea1"
                                  type="text"
                                  placeholder="Name"
                                  required
                                  onChange={handleName("name", index)}
                                />
                              </td>
                              <td>
                                <Input
                                  id="exampleFormControlTextarea1"
                                  type="date"
                                  required
                                  onChange={handleDate("start_date", index)}
                                />
                              </td>
                              <td>
                                <Input
                                  id="exampleFormControlTextarea1"
                                  type="date"
                                  required
                                  onChange={handleDate("end_date", index)}
                                />
                              </td>
                              <td>
                                <Input
                                  id="exampleFormControlTextarea1"
                                  type="number"
                                  required
                                  placeholder="Total Amount"
                                  onChange={handleChange("total_amount", index)}
                                />
                              </td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </table>
                </div>
                <br />
                {feesNumber.length > 0 && (
                  <Row className="left_button">
                    <Col>
                      <Button
                        type="submit"
                        color="primary"
                        onClick={handleSubmitFees}
                      >
                        Submit
                      </Button>
                    </Col>
                  </Row>
                )}
              </form>
            </CardBody>
          </Card>
        </Container>
      )}
      {type === 2 && (
        <Container fluid>
          <Card>
            <CardHeader>
              <h2>Set Recurring Fees</h2>
              <Button size="sm" color="primary" onClick={handleAddFees}>
                Add Fees
              </Button>{" "}
            </CardHeader>
            <CardBody>
              <form>
                <div className="table_div_fees">
                  <table className="fees_table">
                    <thead>
                      <th>Name</th>
                      <th>Start Date</th>
                      <th>End Date</th>
                      <th>Total Amount</th>
                    </thead>
                    <tbody>
                      {feesNumber &&
                        feesNumber.map((data, index) => {
                          return (
                            <tr>
                              <td>
                                <Input
                                  id="exampleFormControlTextarea1"
                                  type="text"
                                  placeholder="Name"
                                  required
                                  value={data["name"]}
                                  onChange={handleName("name", index)}
                                />
                              </td>
                              <td>
                                <Input
                                  id="exampleFormControlTextarea1"
                                  type="date"
                                  required
                                  value={
                                    data["start_date"] &&
                                    formatDate1(data["start_date"])
                                  }
                                  onChange={handleDate("start_date", index)}
                                />
                              </td>
                              <td>
                                <Input
                                  id="exampleFormControlTextarea1"
                                  type="date"
                                  required
                                  value={
                                    data["end_date"] &&
                                    formatDate1(data["end_date"])
                                  }
                                  onChange={handleDate("end_date", index)}
                                />
                              </td>
                              <td>
                                <Input
                                  id="exampleFormControlTextarea1"
                                  type="number"
                                  required
                                  placeholder="Total Amount"
                                  value={data["total_amount"]}
                                  onChange={handleChange("total_amount", index)}
                                />
                              </td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </table>
                </div>
                {feesNumber.length > 0 && (
                  <Row className="left_button">
                    <Col>
                      <Button
                        type="submit"
                        color="primary"
                        onClick={handleSubmitFees}
                      >
                        Submit
                      </Button>
                    </Col>
                  </Row>
                )}
              </form>
            </CardBody>
          </Card>
        </Container>
      )}
      {type === 3 && (
        <Container fluid>
          <Card>
            <CardHeader>
              <Row>
                <Col>
                  <h2>View Fees</h2>
                </Col>
                <Col>
                  <Button onClick={handleEditSelect} color="primary">
                    Edit Fees
                  </Button>
                </Col>
                {/* <Col>
                  <Button color="danger">
                    <Popconfirm
                      title="Are You Sure to Delete?"
                      // onConfirm={handleDeleteSelect}
                    >
                      Delete Entire Fees
                    </Popconfirm>
                  </Button>
                </Col> */}
              </Row>
            </CardHeader>
            <CardBody>
              <form>
                <div className="table_div_fees">
                  <Table
                    style={{ whiteSpace: "pre" }}
                    loading={showLoad}
                    exportableProps={{
                      fileName: " Fees",
                      showColumnPicker: true,
                    }}
                    pagination={{
                      pageSizeOptions: ["5", "10", "30", "60", "100", "1000"],
                      showSizeChanger: true,
                    }}
                    columns={column}
                    dataSource={viewOneTime}
                  />
                </div>
              </form>
            </CardBody>
          </Card>
        </Container>
      )}
      {type === 4 && (
        <Container fluid>
          <Card>
            <CardHeader>
              <h2>Edit Fees</h2>
              <Button onClick={handleAddFees} size="sm" color="primary">
                Add Fees
              </Button>
            </CardHeader>
            <CardBody>
              <form onSubmit={handleSubmitFeesEdit}>
                <div className="table_div_fees">
                  <table className="fees_table">
                    <thead>
                      <th>#</th>
                      <th>Name</th>
                      <th>Start Date</th>
                      <th>End Date</th>
                      <th>Total Amount</th>
                    </thead>
                    <tbody>
                      {feesNumber &&
                        feesNumber.map((data, index) => {
                          return (
                            <tr>
                              <td>
                                <Button
                                  onClick={handleDeleteEdit(index)}
                                  color="danger"
                                >
                                  Delete
                                </Button>
                              </td>
                              <td>
                                <Input
                                  id="exampleFormControlTextarea1"
                                  type="text"
                                  placeholder="Name"
                                  required
                                  value={data["name"]}
                                  onChange={handleNameEdit("name", index)}
                                />
                              </td>
                              <td>
                                <Input
                                  id="exampleFormControlTextarea1"
                                  type="date"
                                  required
                                  value={
                                    data["start_date"] &&
                                    formatDate1(data["start_date"])
                                  }
                                  onChange={handleDateEdit("start_date", index)}
                                />
                              </td>
                              <td>
                                <Input
                                  id="exampleFormControlTextarea1"
                                  type="date"
                                  required
                                  value={
                                    data["end_date"] &&
                                    formatDate1(data["end_date"])
                                  }
                                  onChange={handleDateEdit("end_date", index)}
                                />
                              </td>
                              <td>
                                <Input
                                  id="exampleFormControlTextarea1"
                                  type="number"
                                  required
                                  placeholder="Total Amount"
                                  value={data["total_amount"]}
                                  onChange={handleChangeEdit(
                                    "total_amount",
                                    index
                                  )}
                                />
                              </td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </table>
                </div>
                <br />
                {feesNumber.length > 0 && (
                  <Row className="left_button">
                    <Col>
                      <Button type="submit" color="primary">
                        Submit
                      </Button>
                    </Col>
                  </Row>
                )}
              </form>
            </CardBody>
          </Card>
        </Container>
      )}
    </>
  );
};

export default FeesMaster1;
