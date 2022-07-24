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
const CouponMaster = () => {
  const [loading, setLoading] = useState(false);
  const { user, token } = isAuthenticated();
  const [fees, setFees] = useState([]);
  const [tableData, setTableData] = useState([]);
  useEffect(() => {
    handleSearch();
    getCouponsHandler();
  }, []);

  const handleSearch = async () => {
    const formData = new FormData();
    formData.set("class", "628a1a0864f724cdfad91dbd");
    formData.set("session", "628a18e764f724cdfad91d85");
    try {
      setLoading(true);
      const data = await getFeesTypeList(user.school, user._id, formData);
      console.log(data);
      if (data.err) {
        setLoading(false);
        return toast.error(data.err);
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
    let data = [
      {
        name: "Coupon 1",
        description: " Coupon 1",
        from: "2020-01-01",
        to: "2020-01-01",
        status: "One Time",
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
      },
    ];
    setTableData(data);
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
            <form>
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
                    <option value="one_time" disabled>
                      One Time
                    </option>
                    <option value="recurring" disabled>
                      Recurring
                    </option>
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
                                // onChange={handleFees}
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
