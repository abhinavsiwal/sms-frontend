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

const PendingFees = () => {
  const { user } = isAuthenticated();
  const [loading, setLoading] = useState(false);
  const [checked, setChecked] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [view, setView] = useState(0);
  const [payTableData, setPayTableData] = useState([]);
  const [modal, setModal] = useState(false);
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

  const getPendingHandler = async () => {
    const data = [
      {
        sid: "1",
        name: "John",
        class: "1",
        section: "A",
        roll: "1",
        total: "100",
        contact: "1234567890",
        action: (
          <>
            <Button color="primary" onClick={() => setView(1)}>
              Pay
            </Button>
          </>
        ),
      },
    ];
    setTableData(data);
  };
  useEffect(() => {
    getPendingHandler();
    getPayData();
  }, []);

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
                  <Row className="align-items-center" >
                    <Col className="mt--3 " sm={1} >
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
                            value={payData.total_amount}
                            id="example3cols1Input"
                            placeholder="Amount"
                            disabled
                            required
                            type="number"
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
                            className="btn btn-primary btn-lg float-right"
                            color="primary"
                            size="lg"
                            type="submit"
                          >
                            Submit
                          </Button>
                        </Col>
                      </Row>
                    </>
                  )}
                  {payData.type && payData.type === "Cheque" && (
                    <>
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
                            value={payData.total_amount}
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
                            className="btn btn-primary btn-lg float-right"
                            color="primary"
                            size="lg"
                            type="submit"
                          >
                            Submit
                          </Button>
                        </Col>
                      </Row>
                    </>
                  )}
                  {payData.type &&
                    (payData.type === "NEFT" ||
                      payData.type === "NET Banking") && (
                      <>
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
                              value={payData.total_amount}
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
                              className="btn btn-primary btn-lg float-right"
                              color="primary"
                              size="lg"
                              type="submit"
                            >
                              Submit
                            </Button>
                          </Col>
                        </Row>
                      </>
                    )}
                  {payData.type && payData.type === "Payment gateway" && (
                    <>
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
                            value={payData.total_amount}
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
                            className="btn btn-primary btn-lg float-right"
                            color="primary"
                            size="lg"
                            type="submit"
                          >
                            Submit
                          </Button>
                        </Col>
                      </Row>
                    </>
                  )}
                </CardBody>
              </Card>
            </div>
          </Container>
        </>
      )}
    </>
  );
};

export default PendingFees;
