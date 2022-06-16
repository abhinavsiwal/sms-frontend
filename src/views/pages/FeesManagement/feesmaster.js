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
import { createFees } from "api/FeesManagement";
import { allSessions } from "api/session";
import { allClass } from "api/class";
import { getFeesCustome } from "api/FeesManagement";
import { deleteFees } from "api/FeesManagement";
import { updateFees } from "api/FeesManagement";

const FeesMaster = () => {
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
    const { user, token } = isAuthenticated();
    if (classID === "" && sessionID === "" && fees_type === "") {
      setShowLoad(false);

      toast.error("Please Select Data First");
    } else {
      let temp = {
        class: classID._id,
        session: sessionID._id,
        fees_type: fees_type,
      };
      var searchAPI = await getFeesCustome(
        user.school,
        user._id,
        token,
        JSON.stringify(temp)
      );
      if (searchAPI && searchAPI.fees) {
        if (searchAPI.fees_type === "OneTime") {
          setViewFeesData(searchAPI);
          var temp_data = searchAPI.fees.map((data, index) => {
            return {
              name: data["name"],
              total: data["total"],
              start_date: data["start_date"],
              end_date: data["end_date"],
              option: data["option"],
            };
          });
          setViewOneTime(temp_data);
          setFeesNumber(searchAPI.fees);
          setType(3);
        } else {
          setViewFeesData(searchAPI);
          var temp_data = searchAPI.fees.map((data, index) => {
            return {
              name: data["name"],
              total: data["total"],
              start_date: data["start_date"],
              end_date: data["end_date"],
            };
          });
          setViewReccuring(temp_data);
          setFeesNumber(searchAPI.fees);
          setType(4);
        }
        setShowLoad(false);
      } else {
        if (fees_type === "OneTime") {
          setFeesNumber([]);
          setType(1);
        } else {
          setFeesNumber([]);
          setType(2);
        }
        setShowLoad(false);
      }
    }
  };

  const handleAddFees = (e) => {
    e.preventDefault();
    let temp = feesNumber;
    temp.push({ option: "" });
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

  const handleSubmitFees = async (e) => {
    setShowLoad(true);
    e.preventDefault();
    let formdata = new FormData();
    const { user, token } = isAuthenticated();
    formdata.set("class", classID._id);
    formdata.set("school", user.school);
    formdata.set("fees", JSON.stringify(feesData));
    formdata.set("session", sessionID._id);
    formdata.set("fees_type", fees_type);
    try {
      var createFeesAPI = await createFees(user._id, token, formdata);
      console.log(createFeesAPI);
      if (createFeesAPI && createFeesAPI.err) {
        setShowLoad(false);
        toast.error(createFeesAPI.err);
      } else {
        setShowLoad(false);
        toast.success("OneTime Fees Added Successfully");
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
    formdata.set("fees", JSON.stringify(feesNumber));
    try {
      var editFeesAPI = await updateFees(
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
        toast.success("OneTime Fees Updated Successfully");
        setTimeout(() => {
          window.location.reload(1);
        }, 1000);
      }
    } catch (error) {
      toast.error("Something Went Wrong!");
    }
  };

  const handleEditOneTimeSelect = (e) => {
    e.preventDefault();
    setShowLoad(true);
    setType(5);
    setShowLoad(false);
  };
  const handleEditRecurringSelect = (e) => {
    e.preventDefault();
    setShowLoad(true);
    setType(6);
    setShowLoad(false);
  };

  const handleDeleteSelect = async (e) => {
    e.preventDefault();
    setShowLoad(true);
    const { user, token } = isAuthenticated();
    try {
      var deleteAPI = await deleteFees(viewFeesData._id, user._id, token);
      if (deleteAPI && deleteAPI.err) {
        setShowLoad(false);
        toast.error(deleteAPI.err);
      } else {
        setShowLoad(false);
        toast.success("Fees Delete Successfully");
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
      key: "total",
      title: "Total",
      dataIndex: "total",
      sorter: (record1, record2) => {
        return record1.total > record2.total;
      },
    },
    {
      key: "option",
      title: "Option",
      dataIndex: "option",
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
        return record.option.toLowerCase().includes(value.toLowerCase());
      },
      sorter: (record1, record2) => {
        return record1.option > record2.option;
      },
    },
    {
      key: "start_date",
      title: "Start Date",
      dataIndex: "start_date",
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
  const Reccuringcolumn = [
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
      key: "total",
      title: "Total",
      dataIndex: "total",
      sorter: (record1, record2) => {
        return record1.total > record2.total;
      },
    },
    {
      key: "start_date",
      title: "Start Date",
      dataIndex: "start_date",
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
                    <option value="OneTime">OneTime Fees</option>
                    <option value="Recurring">Recurring Fees</option>
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
              <h2>Set OneTime Fees</h2>
              <p>Class : {classID.name}</p>
              <p>Session : {sessionID.name}</p>

              <Button onClick={handleAddFees} size="sm" color="primary">
                Add Fees
              </Button>
            </CardHeader>
            <form onSubmit={handleSubmitFees}>
              <CardBody>
                <div className="table_div_fees">
                  <table className="fees_table">
                    <thead>
                      <th>Name</th>
                      <th>Start Date</th>
                      <th>End Date</th>
                      <th>Total Amount</th>
                      <th>Option</th>
                    </thead>
                    <tbody>
                      {feesNumber.map((data, index) => {
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
                                onChange={handleChange("total", index)}
                              />
                            </td>
                            <td>
                              <select
                                required
                                className="form-control"
                                onChange={handleChange("option", index)}
                              >
                                <option value="">Select Session</option>
                                <option value="default">Default</option>
                                <option value="new">New</option>
                              </select>
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
              </CardBody>
            </form>
          </Card>
        </Container>
      )}
      {type === 2 && (
        <Container fluid>
          <Card>
            <CardHeader>
              <h2>Set Recurring Fees</h2>
              <p>Class : {classID.name}</p>
              <p>Session : {sessionID.name}</p>
              <Button onClick={handleAddFees} size="sm" color="primary">
                Add Fees
              </Button>
            </CardHeader>
            <form onSubmit={handleSubmitFees}>
              <CardBody>
                <div className="table_div_fees">
                  <table className="fees_table">
                    <thead>
                      <th>Name</th>
                      <th>Start Date</th>
                      <th>End Date</th>
                      <th>Total Amount</th>
                    </thead>
                    <tbody>
                      {feesNumber.map((data, index) => {
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
                                onChange={handleChange("total", index)}
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
              </CardBody>
            </form>
          </Card>
        </Container>
      )}
      {type === 3 && (
        <Container fluid>
          <Card>
            <CardHeader>
              <h2>View OneTime Fees</h2>
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
              <Button
                onClick={handleEditOneTimeSelect}
                size="sm"
                color="primary"
              >
                Edit Fees
              </Button>
              <Button size="sm" color="danger">
                <Popconfirm
                  title="Are You Sure to Delete?"
                  onConfirm={handleDeleteSelect}
                >
                  Delete Entire Fees
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
                    dataSource={viewOneTime}
                  />
                  {/* <table className="fees_table">
                    <thead>
                      <th>Name</th>
                      <th>Start Date</th>
                      <th>End Date</th>
                      <th>Total Amount</th>
                      <th>Option</th>
                    </thead>
                    <tbody>
                      {feesNumber.map((data, index) => {
                        return (
                          <tr>
                            <td>{data["name"]}</td>
                            <td>{data["start_date"]}</td>
                            <td>{data["end_date"]}</td>
                            <td>{data["total"]}</td>
                            <td>{data["option"]}</td>
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
      {type === 4 && (
        <Container fluid>
          <Card>
            <CardHeader>
              <h2>View Recurring Fees</h2>
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
              <Button
                onClick={handleEditRecurringSelect}
                size="sm"
                color="primary"
              >
                Edit Fees
              </Button>
              <Button size="sm" color="danger">
                <Popconfirm
                  title="Are You Sure to Delete?"
                  onConfirm={handleDeleteSelect}
                >
                  Delete Entire Fees
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
                    columns={Reccuringcolumn}
                    dataSource={viewReccuring}
                  />
                  {/* <table className="fees_table">
                    <thead>
                      <th>Name</th>
                      <th>Start Date</th>
                      <th>End Date</th>
                      <th>Total Amount</th>
                    </thead>
                    <tbody>
                      {feesNumber.map((data, index) => {
                        return (
                          <tr>
                            <td>{data["name"]}</td>
                            <td>{data["start_date"]}</td>
                            <td>{data["end_date"]}</td>
                            <td>{data["total"]}</td>
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
      {type === 5 && (
        <Container fluid>
          <Card>
            <CardHeader>
              <h2>Edit OneTime Fees</h2>
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

              <Button onClick={handleAddFees} size="sm" color="primary">
                Add Fees
              </Button>
            </CardHeader>
            <form onSubmit={handleSubmitFeesEdit}>
              <CardBody>
                <div className="table_div_fees">
                  <table className="fees_table">
                    <thead>
                      <th>#</th>
                      <th>Name</th>
                      <th>Start Date</th>
                      <th>End Date</th>
                      <th>Total Amount</th>
                      <th>Option</th>
                    </thead>
                    <tbody>
                      {feesNumber.map((data, index) => {
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
                                value={data["start_date"]}
                                onChange={handleDateEdit("start_date", index)}
                              />
                            </td>
                            <td>
                              <Input
                                id="exampleFormControlTextarea1"
                                type="date"
                                required
                                value={data["end_date"]}
                                onChange={handleDateEdit("end_date", index)}
                              />
                            </td>
                            <td>
                              <Input
                                id="exampleFormControlTextarea1"
                                type="number"
                                required
                                placeholder="Total Amount"
                                value={data["total"]}
                                onChange={handleChangeEdit("total", index)}
                              />
                            </td>
                            <td>
                              <select
                                required
                                className="form-control"
                                value={data["option"]}
                                onChange={handleChangeEdit("option", index)}
                              >
                                <option value="" disabled>
                                  Select Session
                                </option>
                                <option value="default">Default</option>
                                <option value="new">New</option>
                              </select>
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
              </CardBody>
            </form>
          </Card>
        </Container>
      )}
      {type === 6 && (
        <Container fluid>
          <Card>
            <CardHeader>
              <h2>Edit Recurring Fees</h2>
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

              <Button onClick={handleAddFees} size="sm" color="primary">
                Add Fees
              </Button>
            </CardHeader>
            <form onSubmit={handleSubmitFeesEdit}>
              <CardBody>
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
                      {feesNumber.map((data, index) => {
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
                                value={data["start_date"]}
                                onChange={handleDateEdit("start_date", index)}
                              />
                            </td>
                            <td>
                              <Input
                                id="exampleFormControlTextarea1"
                                type="date"
                                required
                                value={data["end_date"]}
                                onChange={handleDateEdit("end_date", index)}
                              />
                            </td>
                            <td>
                              <Input
                                id="exampleFormControlTextarea1"
                                type="number"
                                required
                                placeholder="Total Amount"
                                value={data["total"]}
                                onChange={handleChangeEdit("total", index)}
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
              </CardBody>
            </form>
          </Card>
        </Container>
      )}
    </>
  );
};

export default FeesMaster;
