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
import { useSelector } from "react-redux";
import { SearchOutlined } from "@ant-design/icons";

import { Table } from "ant-table-extensions";

import SimpleHeader from "components/Headers/SimpleHeader";
import LoadingScreen from "react-loading-screen";

import { isAuthenticated } from "api/auth";

import { toast, ToastContainer } from "react-toastify";
import { createFees } from "api/FeesManagement";
import { allSessions } from "api/session";
import { allClass } from "api/class";
import { getFeesCustome } from "api/FeesManagement";
import { deleteFees } from "api/FeesManagement";
import { updateFees } from "api/FeesManagement";

const CollectionMaster = () => {
  const [sessions, setSessions] = useState("");
  const { classes } = useSelector((state) => state.classReducer);
  const [classs, setClasss] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const [section, setSection] = useState("");
  const [sessionID, setSessionID] = useState("");
  const [classID, setClassID] = useState("");
  const [fees_type, setFees_type] = useState("");
  const [showLoad, setShowLoad] = useState(false);
  const [type, setType] = useState(0);
  const [feesNumber, setFeesNumber] = useState([]);

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

  const handleSection = (e) => {
    e.preventDefault();
    if (e.target.value === "") {
    } else {
      setType(0);
      setSection(e.target.value);
    }
  };

  const handleClass = (e) => {
    e.preventDefault();
    if (e.target.value === "") {
      setSelectedClass("");
    } else {
      let data = JSON.parse(e.target.value);
      let selectedClass2 = classes.find(
        (item) => item._id.toString() === data._id.toString()
      );
      console.log(selectedClass2);
      setType(0);
      setClassID(JSON.parse(e.target.value));
      setSelectedClass(selectedClass2);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setShowLoad(true);
    const { user, token } = isAuthenticated();
    if (classID === "" && sessionID === "" && section === "") {
      setShowLoad(false);
      toast.error("Please Select Data First");
    } else {
      setType(1);
      setShowLoad(false);

      //   let temp = {
      //     class: classID._id,
      //     session: sessionID._id,
      //     fees_type: fees_type,
      //   };
      //   var searchAPI = await getFeesCustome(
      //     user.school,
      //     user._id,
      //     token,
      //     JSON.stringify(temp)
      //   );
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
      key: "SID",
      title: "SID",
      dataIndex: "SID",
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
        return record.SID.toLowerCase().includes(value.toLowerCase());
      },
      sorter: (record1, record2) => {
        return record1.SID > record2.SID;
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
      key: "paid",
      title: "Paid",
      dataIndex: "paid",
      sorter: (record1, record2) => {
        return record1.paid > record2.paid;
      },
    },
    {
      key: "due",
      title: "Due",
      dataIndex: "due",
      sorter: (record1, record2) => {
        return record1.due > record2.due;
      },
    },
    {
      key: "penalty",
      title: "Penalty",
      dataIndex: "penalty",
      sorter: (record1, record2) => {
        return record1.penalty > record2.penalty;
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
      key: "action",
      title: "Action",
      dataIndex: "action",
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
            <h2>View Fees</h2>
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
                    Select Section
                  </label>
                  <Input
                    className="form-control"
                    id="exampleFormControlSelect3"
                    type="select"
                    onChange={handleSection}
                    required
                  >
                    <option value="" selected>
                      Select Section
                    </option>
                    {selectedClass !== "" &&
                      selectedClass.section &&
                      selectedClass.section.map((section) => {
                        // console.log(section.name);
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
              <h2>View Student Fees</h2>
            </CardHeader>
            <form>
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
                  />
                </div>
                <br />
              </CardBody>
            </form>
          </Card>
        </Container>
      )}
    </>
  );
};

export default CollectionMaster;
