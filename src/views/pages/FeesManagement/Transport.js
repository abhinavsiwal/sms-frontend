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

import { Table } from "ant-table-extensions";
import AntTable from "../tables/AntTable";

import SimpleHeader from "components/Headers/SimpleHeader";
import LoadingScreen from "react-loading-screen";
import { isAuthenticated } from "api/auth";

import { allClass } from "api/class";
import { toast, ToastContainer } from "react-toastify";
import { getAvailFees, updateAvailFees } from "api/Fees";
import { allStudents, filterStudent } from "api/student";
import { allSessions } from "api/session";

const Hostel = () => {
  const { user, token } = isAuthenticated();
  const [checked, setChecked] = useState(false);
  const [searchData, setSearchData] = useState({
    class: "",
    section: "",
    session: "",
  });
  const [section, setSection] = useState("");
  const [loading, setLoading] = useState(false);
  const [classList, setClassList] = useState([]);
  const [selectedClass, setSelectedClass] = useState({});
  const [students, setStudents] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [showTable, setShowTable] = useState(false);
  const [sessions, setSessions] = useState([]);
  const [sessionStartDate, setSessionStartDate] = useState("");
  const [sessionEndDate, setSessionEndDate] = useState("");
  const [feesData, setFeesData] = useState([]);
  useEffect(() => {
    getAllClasses();
    getSession();
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

  function isEmpty(obj) {
    return Object.keys(obj).length === 0;
  }

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
  let availData = [];

  const filterStudentHandler = async (id) => {
    const formData = new FormData();
    setSection(id)
    formData.set("section", id);
    formData.set("class", searchData.class);
    formData.set("session", searchData.session);
    formData.set("type", "transport");

    try {
      setLoading(true);
      const data = await getAvailFees(user.school, user._id, formData);
      console.log(data);
      if(data.err){
        setLoading(false);
        setTableData([])
        return toast.error(data.err)
      }
      setStudents(data);
      let table = [];
      for (let i = 0; i < data.length; i++) {
        table.push({
          student: data[i].firstname + " " + data[i].lastname,
          total: (
            <>
              <Input
                type="number"
                placeholder="Total"
                defaultValue={data[i]?.avail_fees?.total}
                onChange={(e) => handleFeesChange("total", i, e)}
              />
            </>
          ),
          from: (
            <>
              <Input
                type="date"
                key={i + 1}
                defaultValue={
                  !isEmpty(data[i].avail_fees)
                    ? new Date(data[i].avail_fees.from_date).toLocaleDateString(
                        "en-CA"
                      )
                    : sessionStartDate
                }
                onChange={(e) => handleFeesChange("from_date", i, e)}
              />
            </>
          ),
          to: (
            <>
              <Input
                type="date"
                key={i + 1}
                defaultValue={
                  !isEmpty(data[i].avail_fees)
                    ? new Date(data[i].avail_fees.to_date).toLocaleDateString(
                        "en-CA"
                      )
                    : sessionEndDate
                }
                onChange={(e) => handleFeesChange("to_date", i, e)}
              />
            </>
          ),
          amount: (
            <>
              <Input
                type="number"
                placeholder="Amount"
                defaultValue={data[i]?.avail_fees?.total}
                onChange={(e) => handleFeesChange("amount", i, e)}
              />
            </>
          ),
          paid: data[i].avail_fees.paid || 0,
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
                <Input
                  type="checkbox"
                  key={i + 1}
                  defaultChecked={data[i].avail_fees.avail === "Y"}
                  id={`customCheck${i + 1}`}
                  onChange={(e) => handleFeesChange("avail", i, e)}
                  value={data[i]._id}
                />
              </div>
            </>
          ),
        });
      }
      data.forEach((student, index) => {
        availData.push({
          student: student._id,
          class: searchData.class,
          section: id,
          school: user.school,
          session: searchData.session,
          type: "transport",
          amount:  !isEmpty(student.avail_fees)? student.avail_fees.amount : 0,
          avail:  !isEmpty(student.avail_fees)? student.avail_fees.avail : "N",
          from_date: !isEmpty(student.avail_fees)
            ? new Date(student.avail_fees.from_date).toLocaleDateString("en-CA")
            : sessionStartDate,
          to_date: !isEmpty(student.avail_fees)
            ? new Date(student.avail_fees.to_date).toLocaleDateString("en-CA")
            : sessionEndDate,
          total:  !isEmpty(student.avail_fees)? student.avail_fees.total : 0,
        });
      });
      console.log(availData);
      setFeesData(availData);
      console.log(searchData);
      console.log(section);
      setTableData(table);
      setShowTable(true);
      setLoading(false);
    } catch (err) {
      console.log(err);
      toast.error("Fetching Students Failed");
      setLoading(false);
    }
  };
  //Getting Session data
  const getSession = async () => {
    const { user, token } = isAuthenticated();
    try {
      const session = await allSessions(user._id, user.school, token);
      if (session.err) {
        return toast.error(session.err);
      } else {
        setSessions(session);
      }
    } catch (err) {
      toast.error("Something Went Wrong!");
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
  useEffect(() => {
    if (sessions.length !== 0) {
      defaultSession1();
    }
  }, [sessions]);

  const defaultSession1 = async () => {
    const defaultSession = await sessions.find(
      (session) => session.status === "current"
    );
    console.log(defaultSession);
    setSearchData({
      ...searchData,
      session: defaultSession._id,
    });
    setSessionStartDate(
      new Date(defaultSession.start_date).toLocaleDateString("en-CA")
    );
    setSessionEndDate(
      new Date(defaultSession.end_date).toLocaleDateString("en-CA")
    );
    // setSelectedSessionId(defaultSession._id)
  };

  // const handleFeesChange = (name,id) => async (event) => {
  //   console.log(name,event.target.value,event.target.checked,id);
  //   let obj = {
  //     class: searchData.class,
  //     section: searchData.section,
  //     session: searchData.session,
  //     student: id,
  //     avail:"N",
  //     type:"hostel",
  //     school:user.school,
  //   }
  //   if(name==="total"){
  //     obj.total = event.target.value;
  //   } else if (name==="from_date"){
  //     obj.from_date = event.target.value;
  //   } else if (name==="to_date"){
  //     obj.to_date = event.target.value;
  //   } else if (name==="amount"){
  //     obj.amount = event.target.value;
  //   } else if (name==="avail"){
  //     if(event.target.checked){
  //       obj.avail = "Y";
  //     }else {
  //       obj.avail = "N";
  //     }
  //   }

  // }

  const handleFeesChange = (name, index, event) => {
    const values = [...availData];
    console.log(feesData);
    console.log(values);

    values[index][name] = event.target.value;
    if (name === "avail") {
      if (event.target.checked) {
        values[index][name] = "Y";
      } else {
        values[index][name] = "N";
      }
    }
    setFeesData(values);
  };

  const handleFeesSubmit = async () => {
    console.log(feesData);

    const filtered = feesData.filter((item) => item.avail === "Y");
    console.log(filtered);

    const formData = new FormData();
    formData.append("avail_data", JSON.stringify(filtered));
    formData.append("type", "hostel");

    try {
      setLoading(true);
      const data = await updateAvailFees(user.school, user._id, formData);
      console.log(data);
      if (data.err) {
        toast.error(data.err);
        return setLoading(false);
      }
      toast.success("Fees Updated Successfully");
      setLoading(false);
      setChecked(!checked);
    } catch (err) {
      console.log(err);
    }
  };

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
                    Session
                  </label>

                  <select
                    className="form-control"
                    onChange={handleChange("session")}
                    value={searchData.session}
                  >
                    <option>Select Session</option>
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
                showPagination={false}
                exportFileName="staffBudget"
              />
              <Row>
                <Col style={{ display: "flex", justifyContent: "center" }}>
                  <Button onClick={handleFeesSubmit} color="primary">
                    Submit
                  </Button>
                </Col>
              </Row>
            </CardBody>
          </Card>
        </Container>
      )}
    </>
  );
};

export default Hostel;
