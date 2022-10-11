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
  ModalFooter,
} from "reactstrap";
import { Popconfirm } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { allSessions } from "api/session";
import { Table } from "ant-table-extensions";
import AntTable from "../tables/AntTable";

import SimpleHeader from "components/Headers/SimpleHeader";
import LoadingScreen from "react-loading-screen";
import { isAuthenticated } from "api/auth";

import { allClass } from "api/class";
import { toast, ToastContainer } from "react-toastify";

import { allStudents, filterStudent } from "api/student";

const Hostel = () => {
  const { user, token } = isAuthenticated();
  const [checked, setChecked] = useState(false);
  const [searchData, setSearchData] = useState({
    class: "",
    section: "",
  });
  const [loading, setLoading] = useState(false);
  const [classList, setClassList] = useState([]);
  const [selectedClass, setSelectedClass] = useState({});
  const [students, setStudents] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [showTable, setShowTable] = useState(false);
  useEffect(() => {
    getAllClasses();
  }, [checked]);

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

  const handleChange = (name) => async (event) => {
    setSearchData({ ...searchData, [name]: event.target.value });
    console.log(name, event.target.value);
    if (name === "class") {
      let selectedClass = classList.find(
        (item) => item._id.toString() === event.target.value.toString()
      );
      // console.log(selectedClass);
      setSelectedClass(selectedClass);
    }
    if (name === "section") {
      filterStudentHandler(event.target.value);
    }
  };
  const filterStudentHandler = async (id) => {
    const formData = {
      section: id,
      class: searchData.class,
    };
    try {
      setLoading(true);
      const data = await filterStudent(user.school, user._id, formData);
      console.log(data);
      setStudents(data);
      let table = [];
      for (let i = 0; i < data.length; i++) {
        table.push({
          student: data[i].firstname + " " + data[i].lastname,
          total: data[i].total || null,
          from: (
            <>
              <Input type="date" key={i + 1} />
            </>
          ),
          to: (
            <>
              <Input type="date" key={i + 1} />
            </>
          ),
          amount: data[i].amount || null,
          paid: data[i].paid || null,
          action: (
            <>
              <div
                style={{
                  display: "flex",
                  width: "100%",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Input type="checkbox" key={i + 1} />
              </div>
            </>
          ),
        });
      }
      setTableData(table);
      setShowTable(true);
      setLoading(false);
    } catch (err) {
      console.log(err);
      toast.error("Fetching Students Failed");
      setLoading(false);
    }
  };

  const columns = [
    {
      title: "Students",
      dataIndex: "student",
      align: "left",
      sorter: (a, b) => a.student > b.student,
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm }) => {
        return (
          <>
            <Input
              autoFocus
              placeholder="Type text here"
              value={selectedKeys[0]}
              onChange={(e) => {
                setSelectedKeys(e.target.value ? [e.target.value] : []);
                confirm({ closeDropdown: false });
              }}
              onBlur={() => {
                confirm();
              }}
            ></Input>
          </>
        );
      },
      filterIcon: () => {
        return <SearchOutlined />;
      },
      onFilter: (value, record) => {
        return record.student.toLowerCase().includes(value.toLowerCase());
      },
    },
    {
      title: "Total",
      dataIndex: "total",
      align: "left",
      sorter: (a, b) => a.total > b.total,
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm }) => {
        return (
          <>
            <Input
              autoFocus
              placeholder="Type text here"
              value={selectedKeys[0]}
              onChange={(e) => {
                setSelectedKeys(e.target.value ? [e.target.value] : []);
                confirm({ closeDropdown: false });
              }}
              onBlur={() => {
                confirm();
              }}
            ></Input>
          </>
        );
      },
      filterIcon: () => {
        return <SearchOutlined />;
      },
      onFilter: (value, record) => {
        return record.total.toLowerCase().includes(value.toLowerCase());
      },
    },
    {
      title: "From Date",
      dataIndex: "from",
      align: "left",
      key: "fromDate",
    },
    {
      title: "To Date",
      dataIndex: "to",
      align: "left",
      key: "toDate",
    },
    {
      title: "Amount",
      dataIndex: "amount",
      align: "left",
      sorter: (a, b) => a.amount > b.amount,
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm }) => {
        return (
          <>
            <Input
              autoFocus
              placeholder="Type text here"
              value={selectedKeys[0]}
              onChange={(e) => {
                setSelectedKeys(e.target.value ? [e.target.value] : []);
                confirm({ closeDropdown: false });
              }}
              onBlur={() => {
                confirm();
              }}
            ></Input>
          </>
        );
      },
      filterIcon: () => {
        return <SearchOutlined />;
      },
      onFilter: (value, record) => {
        return record.amount.toLowerCase().includes(value.toLowerCase());
      },
    },
    {
      title: "Paid",
      dataIndex: "paid",
      align: "left",
      sorter: (a, b) => a.paid > b.paid,
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm }) => {
        return (
          <>
            <Input
              autoFocus
              placeholder="Type text here"
              value={selectedKeys[0]}
              onChange={(e) => {
                setSelectedKeys(e.target.value ? [e.target.value] : []);
                confirm({ closeDropdown: false });
              }}
              onBlur={() => {
                confirm();
              }}
            ></Input>
          </>
        );
      },
      filterIcon: () => {
        return <SearchOutlined />;
      },
      onFilter: (value, record) => {
        return record.paid.toLowerCase().includes(value.toLowerCase());
      },
    },
    {
      title: "Avail",
      key: "action",
      dataIndex: "action",
      fixed: "right",
      align: "left",
    },
  ];

  return (
    <>
      <SimpleHeader name="Avail Hostel Fees" parentName="Fees Management" />
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
            <h2>Avail Hostel Fees</h2>
          </CardHeader>
          <CardBody>
            <form>
              <Row>
                <Col>
                  <label
                    className="form-control-label"
                    htmlFor="example4cols2Input"
                  >
                    Class
                  </label>
                  <Input
                    id="example4cols2Input"
                    placeholder="Canteen Name"
                    type="select"
                    name="class"
                    onChange={handleChange("class")}
                    value={searchData.class}
                    required
                  >
                    <option value="">Select Class</option>
                    {classList &&
                      classList.map((classs) => (
                        <option key={classs._id} value={classs._id}>
                          {classs.name}
                        </option>
                      ))}
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
                    id="exampleFormControlSelect3"
                    type="select"
                    required
                    value={searchData.section}
                    onChange={handleChange("section")}
                    name="section"
                  >
                    <option value="">Select Section</option>
                    {selectedClass.section &&
                      selectedClass.section.map((section) => {
                        // console.log(section.name);
                        return (
                          <option
                            value={section._id}
                            key={section._id}
                            selected
                          >
                            {section.name}
                          </option>
                        );
                      })}
                  </Input>
                </Col>
              </Row>
            </form>
          </CardBody>
        </Card>
      </Container>
      {showTable && (
        <Container className="mt--0 shadow-lg table-responsive" fluid>
          <Card className="mb-4">
            <CardHeader>Department Budget List</CardHeader>
            <CardBody>
              <AntTable
                columns={columns}
                data={tableData}
                pagination={true}
                exportFileName="staffBudget"
              />
            </CardBody>
          </Card>
        </Container>
      )}
    </>
  );
};

export default Hostel;
