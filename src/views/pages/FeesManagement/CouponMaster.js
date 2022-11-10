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
import AntTable from "../tables/AntTable";
import { Popconfirm } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { Table } from "ant-table-extensions";
import { allSessions } from "api/session";
import SimpleHeader from "components/Headers/SimpleHeader";
import LoadingScreen from "react-loading-screen";
import { isAuthenticated } from "api/auth";
import { toast, ToastContainer } from "react-toastify";
import { getFeesTypeList } from "api/Fees";
import { allClass } from "api/class";
import { updateCoupon } from "api/Fees";
import { getCouponList } from "api/Fees";

const CouponMaster = () => {
  const [loading, setLoading] = useState(false);
  const { user, token } = isAuthenticated();
  const [sessions, setSessions] = useState("");
  const [classList, setClassList] = useState([]);
  const [fees, setFees] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [checked, setChecked] = useState(false);
  const [session, setSession] = useState("");
  const [clas, setClas] = useState("");
  useEffect(() => {
    handleSearch();
    getCouponsHandler();
  }, [checked]);
  const getSession = async () => {
    try {
      setLoading(true);
      const session = await allSessions(user._id, user.school, token);
      if (session.err) {
        setLoading(false);
        return toast.error(session.err);
      } else {
        setSessions(session);
        setLoading(false);
        return;
      }
    } catch (err) {
      setLoading(false);
      toast.error("Something Went Wrong!");
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
    setSession(defaultSession._id);
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
  }, []);

  useEffect(() => {
    if (clas !== "") {
      handleSearch();
    }
  }, [clas]);

  const handleSearch = async () => {
    const formData = new FormData();
    formData.set("class", clas);
    formData.set("session", session);
    try {
      setLoading(true);
      const data = await getFeesTypeList(user.school, user._id, formData);
      console.log(data);
      if (data.err) {
        setLoading(false);
        // return toast.error(data.err);
        return;
      }
      setFees(data);

      setLoading(false);
    } catch (err) {
      setLoading(false);
      console.log(err);
      toast.error("Getting Fees Type List Failed!");
    }
  };

  const [couponData, setCouponData] = useState({
    couponName: "",
    amount: "",
    description: "",
    applicableFrom: "",
    applicableTo: "",
    type: "",
    applicableOnFees: [],
  });

  const handleChange = (name) => async (event) => {
    setCouponData({ ...couponData, [name]: event.target.value });
  };

  const columns = [
    {
      title: "Coupon Name",
      dataIndex: "name",
      align: "left",
      sorter: (a, b) => a.name > b.name,
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
        return record.name.toLowerCase().includes(value.toLowerCase());
      },
    },
    {
      title: "Desciption",
      dataIndex: "description",
      align: "left",
      sorter: (a, b) => a.description > b.description,
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
        return record.description.toLowerCase().includes(value.toLowerCase());
      },
    },
    {
      title: "From",
      dataIndex: "from",
      align: "left",
      sorter: (a, b) => a.from > b.from,
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
        return record.from.toLowerCase().includes(value.toLowerCase());
      },
    },
    {
      title: "To",
      dataIndex: "to",
      align: "left",
      sorter: (a, b) => a.to > b.to,
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
        return record.to.toLowerCase().includes(value.toLowerCase());
      },
    },
    {
      title: "Status",
      dataIndex: "status",
      align: "left",
      sorter: (a, b) => a.status > b.status,
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
        return record.status.toLowerCase().includes(value.toLowerCase());
      },
    },
    {
      title: "Action",
      key: "action",
      dataIndex: "action",
      fixed: "right",
      align: "left",
    },
  ];

  const getCouponsHandler = async () => {
    try {
      setLoading(true);
      const data = getCouponList(user.school, user._id, {});
      console.log(data);
      if (data.err) {
        setLoading(false);
        return toast.error(data.err);
      }
      setLoading(false);
      let table = [];
      data.forEach((coupon, index) => {
        table.push({
          name: coupon.name,
          description: coupon.description,
          from: coupon.applicable_from,
          to: coupon.applicable_to,
          status: null,
          action: (
            <>
              <Button
                className="btn-sm pull-right"
                color="primary"
                type="button"
                onClick={() => {
                  // setEditing(true);
                  // setSalaryData({ ...salaryData, total: 10000 });
                }}
                key={"edit" + 1}
              >
                <i className="fas fa-user-edit" />
              </Button>
              <Button
                className="btn-sm pull-right"
                color="danger"
                type="button"
                key={"delete" + 1}
              >
                <Popconfirm
                  title="Sure to delete?"
                  // onConfirm={() => deleteCanteenHandler()}
                >
                  <i className="fas fa-trash" />
                </Popconfirm>
              </Button>
            </>
          ),
        });
      });
      setTableData(table);
    } catch (err) {
      console.log(err);
      toast.error("Something went wrong.");
      setLoading(false);
    }

 
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    console.log(couponData);
    const formData = new FormData();
    formData.append("name", couponData.couponName);
    formData.append("description", couponData.description);
    formData.append("applicable_from", couponData.applicableFrom);
    formData.append("applicable_to", couponData.applicableTo);
    formData.append("amount", couponData.amount);
    formData.append(
      "fees_applicable",
      JSON.stringify(couponData.applicableOnFees)
    );

    try {
      setLoading(true);
      const data = await updateCoupon(user.school, user._id, formData);
      console.log(data);
      if (data.err) {
        toast.error(data.err);
        return setLoading(false);
      }
      toast.success("Coupon Updated Successfully");
      setLoading(false);
      setCouponData({
        couponName: "",
        description: "",
        applicableFrom: "",
        applicableTo: "",
        amount: "",
        feesApplicable: [],
      });
      setClas("");
      setChecked(!checked);
    } catch (err) {
      console.log(err);
      setLoading(false);
      toast.error("Something went wrong");
    }
  };

  const handleFees = (event) => {
    console.log(event.target.value);
    let updatedFees = [...couponData.applicableOnFees];
    if (event.target.checked) {
      updatedFees = [...couponData.applicableOnFees, event.target.value];
    } else {
      updatedFees.splice(
        couponData.applicableOnFees.indexOf(event.target.value),
        1
      );
    }
    setCouponData({ ...couponData, applicableOnFees: updatedFees });
  };

  return (
    <>
      <SimpleHeader name="Coupon Master" parentName="Accounts Management" />
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
      <Container className="mt--6" fluid>
        <Card>
          <CardHeader>
            <h2>Coupon Master</h2>
          </CardHeader>

          <CardBody>
            <form onSubmit={submitHandler}>
              <Row>
                <Col>
                  <label
                    className="form-control-label"
                    htmlFor="example4cols2Input"
                  >
                    Coupon Name
                  </label>
                  <Input
                    id="example4cols2Input"
                    type="text"
                    onChange={handleChange("couponName")}
                    required
                    placeholder="Coupon Name"
                    value={couponData.couponName}
                  />
                </Col>
                <Col>
                  <label
                    className="form-control-label"
                    htmlFor="example4cols2Input"
                  >
                    Coupon Amount
                  </label>
                  <Input
                    id="example4cols2Input"
                    type="number"
                    onChange={handleChange("amount")}
                    required
                    placeholder="Amount"
                    value={couponData.amount}
                  />
                </Col>
                <Col>
                  <label
                    className="form-control-label"
                    htmlFor="example4cols2Input"
                  >
                    Description
                  </label>
                  <Input
                    id="example4cols2Input"
                    type="textarea"
                    onChange={handleChange("description")}
                    required
                    placeholder="Description"
                    value={couponData.description}
                  />
                </Col>
              </Row>
              <Row>
                <Col>
                  <label
                    className="form-control-label"
                    htmlFor="example4cols2Input"
                  >
                    Applicable From
                  </label>
                  <Input
                    id="example4cols2Input"
                    type="date"
                    onChange={handleChange("applicableFrom")}
                    required
                    placeholder="Applicable From"
                    value={couponData.applicableFrom}
                  />
                </Col>
                <Col>
                  <label
                    className="form-control-label"
                    htmlFor="example4cols2Input"
                  >
                    Applicable To
                  </label>
                  <Input
                    id="example4cols2Input"
                    type="date"
                    onChange={handleChange("applicableTo")}
                    required
                    placeholder="Applicable To"
                    value={couponData.applicableTo}
                  />
                </Col>
                <Col>
                  <label
                    className="form-control-label"
                    htmlFor="example4cols2Input"
                  >
                    Type
                  </label>
                  <Input
                    id="example4cols2Input"
                    type="select"
                    onChange={handleChange("type")}
                    required
                    placeholder="Applicable To"
                    value={couponData.type}
                  >
                    <option value="" disabled>
                      Select Type
                    </option>
                    <option value="one_time">One Time</option>
                    <option value="recurring">Recurring</option>
                  </Input>
                </Col>
              </Row>
              <Row>
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
                    onChange={(e) => setSession(e.target.value)}
                    value={session}
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
                <Col>
                  <label
                    className="form-control-label"
                    htmlFor="exampleFormControlSelect3"
                  >
                    Class
                  </label>
                  <Input
                    id="exampleFormControlTextarea1"
                    type="select"
                    required
                    onChange={(e) => setClas(e.target.value)}
                    value={clas}
                    name="class"
                  >
                    <option value="" disabled>
                      Select Class
                    </option>
                    {classList?.map((classs) => {
                      return (
                        <option value={classs._id} key={classs._id}>
                          {classs.name}
                        </option>
                      );
                    })}
                  </Input>
                </Col>
              </Row>
              <Row>
                <Col>
                  <label
                    className="form-control-label"
                    htmlFor="example4cols2Input"
                  >
                    Select Fees
                  </label>
                  <Row>
                    {fees &&
                      fees.map((penalty, index) => {
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
                </Col>
              </Row>

              <Row className="mt-4 float-right">
                <Col>
                  <Button color="primary" type="submit">
                    Submit
                  </Button>
                </Col>
              </Row>
            </form>
          </CardBody>
        </Card>
      </Container>
      <Container className="mt--0 shadow-lg table-responsive" fluid>
        <Card className="mb-4">
          <CardHeader>Coupons</CardHeader>
          <CardBody>
            <AntTable
              columns={columns}
              data={tableData}
              pagination={true}
              exportFileName="coupons"
            />
          </CardBody>
        </Card>
      </Container>
    </>
  );
};

export default CouponMaster;
