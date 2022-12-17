import React, { useEffect, useState } from "react";
import { isAuthenticated } from "api/auth";
import {
  Card,
  CardHeader,
  CardBody,
  Input,
  Container,
  Row,
  Col,
  Button,
  CardImg,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Modal,
  ModalBody,
  ModalHeader,
  FormGroup,
} from "reactstrap";
import LoadingScreen from "react-loading-screen";
import SimpleHeader from "components/Headers/SimpleHeader.js";
import { SearchOutlined } from "@ant-design/icons";
import AntTable from "../tables/AntTable";
import Loader from "components/Loader/Loader";
import { Popconfirm } from "antd";
import { toast, ToastContainer } from "react-toastify";
import {
  getCouponList,
  getPendingFees,
  updatePendingFees,
  getPendingFeesByStudent,
  payFees,
} from "api/Fees";
const PendingFees = () => {
  const { user } = isAuthenticated();
  const [loading, setLoading] = useState(false);
  const [checked, setChecked] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [view, setView] = useState(0);
  const [payTableData, setPayTableData] = useState([]);
  const [modal, setModal] = useState(false);
  const [coupons, setCoupons] = useState([]);
  const [selectedCoupon, setSelectedCoupon] = useState(null);
  const [selectedFees, setSelectedFees] = useState(null);
  const [amount, setAmount] = useState("");
  const [payData, setPayData] = useState({
    type: "",
    date: "",
    pay_to: "",
    cheque_number: "",
    bank_name: "",
    account_number: "",
    transaction_date: "",
    pay_by: "",
    transaction_id: "",
  });

  const handlePayFees = async (e) => {
    e.preventDefault();
    console.log(payData);

    const formData = new FormData();
    formData.set("type", payData.type);
    formData.set("transaction_date", payData.date);
    formData.set("pay_to", payData.pay_to);
    formData.set("cheque_number", payData.cheque_number);
    formData.set("bank_name", payData.bank_name);
    formData.set("account_number", payData.account_number);
    formData.set("pay_by", payData.pay_by);
    formData.set("transaction_id", payData.transaction_id);
    formData.set("total_amount", selectedFees.total_amount);
    formData.set("discount_amount",selectedCoupon? amount:null);
    formData.set("coupon_id", selectedCoupon ?selectedCoupon._id:null);
    formData.set("student", selectedFees?.student._id);
    formData.set("school", user.school);
    formData.set("collected_by", user._id);
    formData.set("month",JSON.stringify([payTableData[0].month]));

    try {
      setLoading(true);
      const data = await payFees(user.school, user._id, formData);
      if (data.err) {
        setLoading(false);
        return toast.error(data.err);
      }
      toast.success("Fees Paid Successfully");
      setPayData({
        type: "",
        date: "",
        pay_to: "",
        cheque_number: "",
        bank_name: "",
        account_number: "",
        transaction_date: "",
        pay_by: "",
        transaction_id: "",
      });
      setLoading(false);
      setView(0);
      setChecked(!checked);
    } catch (err) {
      console.log(err);
      setLoading(false);
      toast.error("Something went wrong");
    }
  };

  const columns = [
    {
      title: "SID",
      dataIndex: "sid",
      align: "left",
      sorter: (a, b) => a.sid > b.sid,
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
        return record.sid.toLowerCase().includes(value.toLowerCase());
      },
    },
    {
      title: "Student Name",
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
      title: "Class",
      dataIndex: "class",
      align: "left",
      sorter: (a, b) => a.class > b.class,
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
        return record.class.toLowerCase().includes(value.toLowerCase());
      },
    },
    {
      title: "Section",
      dataIndex: "section",
      align: "left",
      sorter: (a, b) => a.section > b.section,
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
        return record.section.toLowerCase().includes(value.toLowerCase());
      },
    },
    {
      title: "Roll No",
      dataIndex: "roll",
      align: "left",
      sorter: (a, b) => a.roll > b.roll,
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
        return record.roll.toLowerCase().includes(value.toLowerCase());
      },
    },
    {
      title: "Total Due",
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
      title: "Contact No",
      dataIndex: "contact",
      align: "left",
      sorter: (a, b) => a.contact > b.contact,
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
        return record.contact.toLowerCase().includes(value.toLowerCase());
      },
    },
    {
      title: "Action",
      key: "action",
      dataIndex: "action",
      fixed: "right",
    },
  ];

  const getPendingFeesHandler = async () => {
    try {
      setLoading(true);
      const data = await getPendingFees(user.school, user._id, null);
      if (data.err) {
        setLoading(false);
        toast.error(data.err);
        return;
      }

      const table = [];
      data.forEach((fees) => {
        table.push({
          sid: fees?.student.SID,
          name: fees?.student?.firstname + " " + fees?.student?.lastname,
          class: fees?.student?.class?.name,
          section: fees?.student?.section?.name,
          roll: fees?.student?.roll_number,
          total: fees?.total_amount,
          contact: fees?.student?.phone,
          action: (
            <>
              <Button
                color="primary"
                onClick={() => {
                  setView(1);
                  setAmount(fees.total_amount);
                  getFeesByStudent(fees?.student._id);
                  setSelectedFees(fees);
                }}
              >
                Pay
              </Button>
            </>
          ),
        });
      });
      setTableData(table);
      setLoading(false);
    } catch (error) {}
  };
  const getFeesByStudent = async (id) => {
    const formData = new FormData();
    formData.set("student", id);
    try {
      setLoading(true);
      const data = await getPendingFeesByStudent(
        user.school,
        user._id,
        formData
      );
      console.log(data);
      if (data.err) {
        setLoading(false);
        toast.error(data.err);
        return;
      }
      const table = [];
      data.forEach((fees, index) => {
        table.push({
          sno: index + 1,
          particular: fees?.fees_sub_id?.name,
          amount: fees.amount,
          penalty: fees.penalty,
          total: fees.total_amount,
          month: fees.month,
        });
      });
      setPayTableData(table);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error);
      toast.error("Something went wrong");
    }
  };
  const payColumns = [
    {
      title: "SNo",
      dataIndex: "sno",
      align: "left",
      sorter: (a, b) => a.sno > b.sno,
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
        return record.sno.toLowerCase().includes(value.toLowerCase());
      },
    },
    {
      title: "Particular",
      dataIndex: "particular",
      align: "left",
      sorter: (a, b) => a.particular > b.particular,
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
        return record.particular.toLowerCase().includes(value.toLowerCase());
      },
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
      title: "Penalty",
      dataIndex: "penalty",
      align: "left",
      sorter: (a, b) => a.penalty > b.penalty,
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
        return record.penalty.toLowerCase().includes(value.toLowerCase());
      },
    },
    {
      title: "Total Amount",
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
      title: "Due Date",
      dataIndex: "due",
      align: "left",
      sorter: (a, b) => a.due > b.due,
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
        return record.due.toLowerCase().includes(value.toLowerCase());
      },
    },
  ];

  const couponColumns = [
    {
      title: "SNo",
      dataIndex: "sno",
      align: "left",
      sorter: (a, b) => a.sno > b.sno,
    },
    {
      title: "Name",
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
      title: "Description",
      dataIndex: "desc",
      align: "left",
      sorter: (a, b) => a.desc > b.desc,
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
        return record.desc.toLowerCase().includes(value.toLowerCase());
      },
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
      title: "Action",
      key: "action",
      dataIndex: "action",
      fixed: "right",
    },
  ];
  // console.log(amount);
  const handleCheckChange = (value) => {
    setSelectedCoupon(JSON.parse(value));
  };

  useEffect(() => {
    let finalAmount = selectedFees?.total_amount - selectedCoupon?.amount;
    setAmount(finalAmount);
  }, [selectedCoupon]);

  const getCoupons = async () => {
    try {
      setLoading(true);
      const data = await getCouponList(user.school, user._id, user.token);
      console.log(data);
      if (data.error) {
        setLoading(false);
        return toast.error(data.error);
      }
      setLoading(false);
      let tableData = [];
      data.forEach((element, index) => {
        tableData.push({
          key: index,
          sno: index + 1,
          name: element.name,
          desc: element.description,
          amount: element.amount,
          action: (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Input
                type="radio"
                name="coupon"
                id={element._id}
                // checked={selectedCoupon === element}
                onChange={() => handleCheckChange(JSON.stringify(element))}
              />
            </div>
          ),
        });
      });
      console.log(tableData);
      setCoupons(tableData);
    } catch (err) {
      console.log(err);
      setLoading(false);
      toast.error("Something went wrong");
    }
  };

  const getPayData = async () => {
    const data = [
      {
        sno: "1",
        particular: "Admission Fee",
        amount: "10000",
        due: "10/10/2021",
      },
    ];
    setPayTableData(data);
  };

  useEffect(() => {
    getPendingFeesHandler();
    getPayData();
    getCoupons();
  }, [checked]);

  const handleChange = (name) => (event) => {
    setPayData({ ...payData, [name]: event.target.value });
  };

  return (
    <>
      <SimpleHeader name="Pending Fees" parentName="Fees Management" />
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
      {view === 0 ? (
        <Container className="mt--6" fluid>
          <div className="card-wrapper">
            <Card className="mb-4">
              <CardHeader>
                <h2>Pending Fees</h2>
              </CardHeader>
              <CardBody>
                <AntTable
                  columns={columns}
                  data={tableData}
                  pagination={true}
                  exportFileName="Pending Fees"
                />
              </CardBody>
            </Card>
          </div>
        </Container>
      ) : (
        <>
          <Container className="mt--6" fluid>
            <div className="card-wrapper">
              <Card className="mb-4">
                <CardHeader>
                  <Row className="align-items-center">
                    <Col className="mt--3 " sm={1}>
                      <Button
                        className="float-left mb-2"
                        color="primary"
                        onClick={() => setView(0)}
                      >
                        <i className="ni ni-bold-left"></i>
                      </Button>
                    </Col>
                    <Col>
                      <h2>Pay Fees</h2>
                    </Col>
                  </Row>
                </CardHeader>
                <Row>
                  <Col
                    style={{
                      display: "flex",
                      justifyContent: "flex-end",
                      margin: "2rem",
                      marginBottom: "-3rem",
                    }}
                  >
                    <Button
                      color="success"
                      size="small"
                      onClick={() => setModal(true)}
                    >
                      Apply Coupon
                    </Button>
                  </Col>
                </Row>
                <CardBody>
                  <AntTable
                    columns={payColumns}
                    data={payTableData}
                    pagination={true}
                    exportFileName="Pay Fees"
                  />
                </CardBody>
              </Card>
            </div>
          </Container>
          <Container className="mt-6" fluid>
            <div className="card-wrapper">
              <Card className="mb-4">
                <CardHeader>
                  <h2>Pay Fees</h2>
                </CardHeader>
                <CardBody>
                  <Row className="mb-4">
                    <Col>
                      <label
                        className="form-control-label"
                        htmlFor="example3cols3Input"
                      >
                        Type
                      </label>
                      <Input
                        onChange={handleChange("type")}
                        value={payData.type}
                        id="exampleFormControlSelect1"
                        type="select"
                        required
                      >
                        <option>Select Type</option>
                        <option value="Cash">Cash</option>
                        <option value="Cheque">Cheque</option>
                        <option value="NEFT">NEFT</option>
                        <option value="NET Banking">NET Banking</option>
                        <option value="Payment gateway">Payment gateway</option>
                      </Input>
                    </Col>
                  </Row>
                  {payData.type && payData.type === "Cash" && (
                    <>
                      <form onSubmit={handlePayFees}>
                        <Row>
                          <Col>
                            <label
                              className="form-control-label"
                              htmlFor="example3cols3Input"
                            >
                              Total Amount
                            </label>
                            <Input
                              onChange={handleChange("total_amount")}
                              id="example3cols1Input"
                              placeholder="Amount"
                              disabled
                              required
                              type="number"
                              value={amount}
                            />
                          </Col>
                          <Col>
                            <label
                              className="form-control-label"
                              htmlFor="example3cols3Input"
                            >
                              Date
                            </label>
                            <Input
                              onChange={handleChange("date")}
                              value={payData.date}
                              id="example3cols1Input"
                              placeholder="Amount"
                              required
                              type="date"
                            />
                          </Col>
                          <Col>
                            <label
                              className="form-control-label"
                              htmlFor="example3cols3Input"
                            >
                              Collected By
                            </label>
                            <Input
                              onChange={handleChange("collected_by")}
                              value={payData.collected_by}
                              id="example3cols1Input"
                              placeholder="Vaibhav Pathak"
                              disabled
                              required
                              type="text"
                            />
                          </Col>
                        </Row>
                        <Row>
                          <Col>
                            <Button
                              className="btn btn-primary btn-md float-right mt-3"
                              color="primary"
                              size="md"
                              type="submit"
                            >
                              Submit
                            </Button>
                          </Col>
                        </Row>
                      </form>
                    </>
                  )}
                  {payData.type && payData.type === "Cheque" && (
                    <>
                      <form onSubmit={handlePayFees}>
                        <Row>
                          <Col>
                            <label
                              className="form-control-label"
                              htmlFor="example3cols3Input"
                            >
                              Cheque Number
                            </label>
                            <Input
                              onChange={handleChange("cheque_number")}
                              value={payData.cheque_number}
                              id="example3cols1Input"
                              required
                              placeholder="e.g 3243432423"
                              type="text"
                            />
                          </Col>
                        </Row>
                        <Row>
                          <Col>
                            <label
                              className="form-control-label"
                              htmlFor="example3cols3Input"
                            >
                              Bank Name
                            </label>
                            <Input
                              onChange={handleChange("bank_name")}
                              value={payData.bank_name}
                              id="example3cols1Input"
                              required
                              placeholder="e.g SBI"
                              type="text"
                            />
                          </Col>
                          <Col>
                            <label
                              className="form-control-label"
                              htmlFor="example3cols3Input"
                            >
                              Account Number
                            </label>
                            <Input
                              onChange={handleChange("account_number")}
                              value={payData.account_number}
                              id="example3cols1Input"
                              placeholder="Number"
                              required
                              type="number"
                            />
                          </Col>

                          <Col>
                            <label
                              className="form-control-label"
                              htmlFor="example3cols3Input"
                            >
                              Total Amount
                            </label>
                            <Input
                              onChange={handleChange("total_amount")}
                              value={amount}
                              id="example3cols1Input"
                              placeholder="Amount"
                              required
                              disabled
                              type="number"
                            />
                          </Col>
                        </Row>
                        <Row>
                          <Col>
                            <label
                              className="form-control-label"
                              htmlFor="example3cols3Input"
                            >
                              Transaction Date
                            </label>
                            <Input
                              onChange={handleChange("transaction_date")}
                              value={payData.transaction_date}
                              id="example3cols1Input"
                              required
                              type="date"
                            />
                          </Col>
                          <Col>
                            <label
                              className="form-control-label"
                              htmlFor="example3cols3Input"
                            >
                              Pay To
                            </label>
                            <Input
                              onChange={handleChange("pay_to")}
                              value={payData.pay_to}
                              id="example3cols1Input"
                              placeholder="Vaibhav Pathak"
                              required
                              type="text"
                            />
                          </Col>
                          <Col>
                            <label
                              className="form-control-label"
                              htmlFor="example3cols3Input"
                            >
                              Pay By
                            </label>
                            <Input
                              onChange={handleChange("pay_by")}
                              value={payData.pay_by}
                              id="example3cols1Input"
                              placeholder="Abhinav"
                              required
                              type="text"
                            />
                          </Col>
                        </Row>
                        <Row>
                          <Col>
                            <Button
                              className="btn btn-primary btn-md mt-3 float-right"
                              color="primary"
                              size="md"
                              type="submit"
                            >
                              Submit
                            </Button>
                          </Col>
                        </Row>
                      </form>
                    </>
                  )}
                  {payData.type &&
                    (payData.type === "NEFT" ||
                      payData.type === "NET Banking") && (
                      <>
                        <form onSubmit={handlePayFees}>
                          <Row>
                            <Col>
                              <label
                                className="form-control-label"
                                htmlFor="example3cols3Input"
                              >
                                Transaction ID
                              </label>
                              <Input
                                onChange={handleChange("transaction_id")}
                                value={payData.transaction_id}
                                id="example3cols1Input"
                                required
                                placeholder="ID"
                                type="text"
                              />
                            </Col>
                          </Row>
                          <Row>
                            <Col>
                              <label
                                className="form-control-label"
                                htmlFor="example3cols3Input"
                              >
                                Bank Name
                              </label>
                              <Input
                                onChange={handleChange("bank_name")}
                                value={payData.bank_name}
                                id="example3cols1Input"
                                required
                                placeholder="e.g SBI"
                                type="text"
                              />
                            </Col>
                            <Col>
                              <label
                                className="form-control-label"
                                htmlFor="example3cols3Input"
                              >
                                Account Number
                              </label>
                              <Input
                                onChange={handleChange("account_number")}
                                value={payData.account_number}
                                id="example3cols1Input"
                                placeholder="Number"
                                required
                                type="number"
                              />
                            </Col>

                            <Col>
                              <label
                                className="form-control-label"
                                htmlFor="example3cols3Input"
                              >
                                Total Amount
                              </label>
                              <Input
                                onChange={handleChange("total_amount")}
                                value={amount}
                                id="example3cols1Input"
                                placeholder="Amount"
                                required
                                disabled
                                type="number"
                              />
                            </Col>
                          </Row>
                          <Row>
                            <Col>
                              <label
                                className="form-control-label"
                                htmlFor="example3cols3Input"
                              >
                                Transaction Date
                              </label>
                              <Input
                                onChange={handleChange("transaction_date")}
                                value={payData.transaction_date}
                                id="example3cols1Input"
                                required
                                type="date"
                              />
                            </Col>
                            <Col>
                              <label
                                className="form-control-label"
                                htmlFor="example3cols3Input"
                              >
                                Pay To
                              </label>
                              <Input
                                onChange={handleChange("pay_to")}
                                id="example3cols1Input"
                                value={payData.pay_to}
                                placeholder="Vaiabhav Pathak"
                                required
                                type="text"
                              />
                            </Col>
                            <Col>
                              <label
                                className="form-control-label"
                                htmlFor="example3cols3Input"
                              >
                                Pay By
                              </label>
                              <Input
                                onChange={handleChange("pay_by")}
                                id="example3cols1Input"
                                placeholder="e.g Sanjay Suthar"
                                value={payData.pay_by}
                                required
                                type="text"
                              />
                            </Col>
                          </Row>
                          <Row>
                            <Col>
                              <Button
                                className="btn btn-primary btn-md mt-3 float-right"
                                color="primary"
                                size="md"
                                type="submit"
                              >
                                Submit
                              </Button>
                            </Col>
                          </Row>
                        </form>
                      </>
                    )}
                  {payData.type && payData.type === "Payment gateway" && (
                    <>
                      <form onSubmit={handlePayFees}>
                        <Row>
                          <Col>
                            <label
                              className="form-control-label"
                              htmlFor="example3cols3Input"
                            >
                              Transaction ID
                            </label>
                            <Input
                              onChange={handleChange("transaction_id")}
                              id="example3cols1Input"
                              value={payData.transaction_id}
                              required
                              placeholder="ID"
                              type="text"
                            />
                          </Col>
                        </Row>
                        <Row>
                          <Col>
                            <label
                              className="form-control-label"
                              htmlFor="example3cols3Input"
                            >
                              Total Amount
                            </label>
                            <Input
                              onChange={handleChange("total_amount")}
                              value={amount}
                              id="example3cols1Input"
                              placeholder="Amount"
                              required
                              disabled
                              type="number"
                            />
                          </Col>
                          <Col>
                            <label
                              className="form-control-label"
                              htmlFor="example3cols3Input"
                            >
                              Transaction Date
                            </label>
                            <Input
                              value={payData.transaction_date}
                              onChange={handleChange("transaction_date")}
                              id="example3cols1Input"
                              required
                              type="date"
                            />
                          </Col>
                        </Row>
                        <Row>
                          <Col>
                            <label
                              className="form-control-label"
                              htmlFor="example3cols3Input"
                            >
                              Pay To
                            </label>
                            <Input
                              value={payData.pay_to}
                              onChange={handleChange("pay_to")}
                              id="example3cols1Input"
                              placeholder="Vaiabhav Pathak"
                              required
                              type="text"
                            />
                          </Col>
                          <Col>
                            <label
                              className="form-control-label"
                              htmlFor="example3cols3Input"
                            >
                              Pay By
                            </label>
                            <Input
                              onChange={handleChange("pay_by")}
                              value={payData.pay_by}
                              id="example3cols1Input"
                              placeholder="Abhinav Siwal"
                              required
                              type="text"
                            />
                          </Col>
                        </Row>
                        <Row>
                          <Col>
                            <Button
                              className="btn btn-primary btn-md mt-3 float-right"
                              color="primary"
                              size="md"
                              type="submit"
                            >
                              Submit
                            </Button>
                          </Col>
                        </Row>
                      </form>
                    </>
                  )}
                </CardBody>
              </Card>
            </div>
          </Container>
        </>
      )}
      <Modal
        className="modal-dialog-centered"
        isOpen={modal}
        toggle={() => setModal(false)}
        size="lg"
      >
        <div className="modal-header">
          <h2 className="modal-title" id="modal-title-default">
            Apply Coupon
          </h2>
          <button
            aria-label="Close"
            className="close"
            data-dismiss="modal"
            type="button"
            onClick={() => setModal(false)}
          >
            <span aria-hidden={true}>×</span>
          </button>
        </div>
        <ModalBody>
          <AntTable
            columns={couponColumns}
            data={coupons}
            pagination={true}
            exportFileName="Pending Fees"
          />
        </ModalBody>
      </Modal>
    </>
  );
};

export default PendingFees;
