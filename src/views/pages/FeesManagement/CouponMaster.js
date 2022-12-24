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
  ModalBody,
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
import { getCouponList, deleteCoupon } from "api/Fees";
import moment from "moment";
const CouponMaster = () => {
  const [loading, setLoading] = useState(false);
  const { user, token } = isAuthenticated();
  const [sessions, setSessions] = useState("");
  const [classList, setClassList] = useState([]);
  const [fees, setFees] = useState([]);
  const [editFees, setEditFees] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [checked, setChecked] = useState(false);
  const [session, setSession] = useState("");
  const [clas, setClas] = useState("");
  const [editClas, setEditClas] = useState("");
  const [editing, setEditing] = useState(false);
  const [editData, setEditData] = useState({
    couponName: "",
    amount: "",
    description: "",
    applicableFrom: "",
    applicableTo: "",
    type: "",
    applicableOnFees: [],
    session: "",
  });

  const [permissions, setPermissions] = useState([]);
  let permission1 = [];
  useEffect(() => {
    if (user.permissions["Fees Management Module"]) {
      permission1 = user.permissions["Fees Management Module"];
      // console.log(permission1);
      setPermissions(permission1);
      // console.log(permissions);
    }
  }, [checked]);

  useEffect(() => {
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
    if (clas === "") {
      return;
    }
    handleSearch();
  }, [clas]);
  useEffect(() => {
    if (editClas === "") {
      return;
    }
    handleEditSearch();
  }, [editClas]);

  const handleEditSearch = async () => {
    const formData = new FormData();
    formData.set("class", editClas);
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
      setEditFees(data);

      setLoading(false);
    } catch (err) {
      setLoading(false);
      console.log(err);
      toast.error("Getting Fees Type List Failed!");
    }
  };

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
    id: "",
  });

  const handleEditChange = (name) => async (event) => {
    setEditData({ ...editData, [name]: event.target.value });
  };
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
      const data = await getCouponList(user.school, user._id, {});
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
          from: moment(coupon.applicable_from).format("DD/MM/YYYY"),
          to: moment(coupon.applicable_to).format("DD/MM/YYYY"),
          status: null,
          action: (
            <>
              {permission1 && permission1.includes("edit") && (
                <>
                  <Button
                    className="btn-sm pull-right"
                    color="primary"
                    type="button"
                    onClick={() => {
                      setEditing(true);
                      let applicable = [];
                      coupon.fees_applicable.forEach((fee) => {
                        applicable.push(fee._id);
                      });
                      setEditData({
                        id: coupon._id,
                        couponName: coupon.name,
                        amount: coupon.amount,
                        description: coupon.description,
                        applicableFrom: new Date(
                          coupon.applicable_from
                        ).toLocaleDateString("en-CA"),
                        applicableTo: new Date(
                          coupon.applicable_to
                        ).toLocaleDateString("en-CA"),
                        type: coupon.type,
                        applicableOnFees: applicable,
                      });
                    }}
                    key={"edit" + 1}
                  >
                    <i className="fas fa-user-edit" />
                  </Button>
                </>
              )}
              {permission1 && permission1.includes("delete") && (
                <Button
                  className="btn-sm pull-right"
                  color="danger"
                  type="button"
                  key={"delete" + 1}
                >
                  <Popconfirm
                    title="Sure to delete?"
                    onConfirm={() => deleteCouponHandler(coupon._id)}
                  >
                    <i className="fas fa-trash" />
                  </Popconfirm>
                </Button>
              )}
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

  const editSubmitHandler = async (e) => {
    e.preventDefault();
    console.log(editData);
    const formData = new FormData();
    formData.append("name", editData.couponName);
    formData.append("description", editData.description);
    formData.append("applicable_from", editData.applicableFrom);
    formData.append("applicable_to", editData.applicableTo);
    formData.append("amount", editData.amount);
    formData.append(
      "fees_applicable",
      JSON.stringify(editData.applicableOnFees)
    );
    formData.append("_id", editData.id);

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
      setEditData({
        couponName: "",
        description: "",
        applicableFrom: "",
        applicableTo: "",
        amount: "",
        feesApplicable: [],
      });
      setEditClas("");
      setChecked(!checked);

      setEditing(false);
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
  const handleEditFees = (event) => {
    console.log(event.target.value);
    let updatedFees = [...editData.applicableOnFees];
    if (event.target.checked) {
      updatedFees = [...editData.applicableOnFees, event.target.value];
    } else {
      updatedFees.splice(
        editData.applicableOnFees.indexOf(event.target.value),
        1
      );
    }
    setEditData({ ...editData, applicableOnFees: updatedFees });
  };

  const deleteCouponHandler = async (id) => {
    const formData = new FormData();
    formData.set("_id", id);
    try {
      setLoading(true);
      const data = await deleteCoupon(user.school, user._id, formData);
      console.log(data);
      if (data.err) {
        toast.error(data.err);
        return setLoading(false);
      }
      toast.success("Coupon Deleted Successfully");
      setLoading(false);
      setChecked(!checked);
    } catch (err) {
      console.log(err);
      setLoading(false);
      toast.error("Something went wrong");
    }
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
      {permissions && permissions.includes("add") && (
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
      )}

      <Container className="mt--0 shadow-lg table-responsive" fluid>
        <Card className="mb-4">
          <CardHeader>
            <h2>Coupons</h2>
          </CardHeader>
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
      <Modal
        className="modal-dialog-centered"
        isOpen={editing}
        toggle={() => setEditing(false)}
        size="lg"
      >
        <div className="modal-header">
          <h2 className="modal-title" id="modal-title-default">
            Edit Coupon
          </h2>
          <button
            aria-label="Close"
            className="close"
            data-dismiss="modal"
            type="button"
            onClick={() => setEditing(false)}
          >
            <span aria-hidden={true}>×</span>
          </button>
        </div>
        <ModalBody>
          <form onSubmit={editSubmitHandler}>
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
                  onChange={handleEditChange("couponName")}
                  required
                  placeholder="Coupon Name"
                  value={editData.couponName}
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
                  onChange={handleEditChange("amount")}
                  required
                  placeholder="Amount"
                  value={editData.amount}
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
                  onChange={handleEditChange("description")}
                  required
                  placeholder="Description"
                  value={editData.description}
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
                  onChange={handleEditChange("applicableFrom")}
                  required
                  placeholder="Applicable From"
                  value={editData.applicableFrom}
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
                  onChange={handleEditChange("applicableTo")}
                  required
                  placeholder="Applicable To"
                  value={editData.applicableTo}
                />
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
                  onChange={handleEditChange("session")}
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
                  onChange={(e) => setEditClas(e.target.value)}
                  value={editClas}
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
                  {editFees &&
                    editFees.map((penalty, index) => {
                      return (
                        <Col key={index} md={4}>
                          <div className="custom-control custom-checkbox mb-3">
                            <Input
                              className="custom-control-input"
                              id={`customCheck${index}`}
                              type="checkbox"
                              onChange={handleEditFees}
                              value={penalty._id}
                              // defaultChecked={penalty}
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

            <Row className="mt-4 mx-auto">
              <Col
                className="mx-auto "
                style={{ display: "flex", justifyContent: "center" }}
              >
                <Button color="primary" type="submit">
                  Submit
                </Button>
              </Col>
            </Row>
          </form>
        </ModalBody>
      </Modal>
    </>
  );
};

export default CouponMaster;
