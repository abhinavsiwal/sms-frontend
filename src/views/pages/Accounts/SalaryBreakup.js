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
} from "reactstrap";
import { Popconfirm } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import AntTable from "../tables/AntTable";
import ReactPaginate from "react-paginate";
import { Table } from "ant-table-extensions";
import SimpleHeader from "components/Headers/SimpleHeader";
import LoadingScreen from "react-loading-screen";
import { isAuthenticated } from "api/auth";
import { toast, ToastContainer } from "react-toastify";
import { getDepartment } from "api/department";
import { salaryBreakupList } from "api/Budget";
import { updateSalaryBreakup } from "api/Budget";
const SalaryBreakup = () => {
  const [loading, setLoading] = useState(false);
  const { user, token } = isAuthenticated();
  const [checked, setChecked] = useState(false);
  const [allDepartments, setAllDepartments] = useState([]);
  const [showTable, setShowTable] = useState(true);
  const [tableData, setTableData] = useState([]);
  const [editing, setEditing] = useState(false);
  const [salaryList, setSalaryList] = useState([]);

  const [salaryData, setSalaryData] = useState({
    total: "",
    basic: "",
    lta: "",
    hra: "",
    tax: "",
    others: "",
    totalAmount: "",
    staff: "",
    department: "",
  });
  const [total, setTotal] = useState(0);
  const [disableButton, setDisableButton] = useState(false);
  const getAllDepartment = async () => {
    try {
      setLoading(true);
      const dept = await getDepartment(user.school, user._id, token);
      if (dept.err) {
        return toast.error(dept.err);
      }
      console.log(dept);
      setAllDepartments(dept);
      setLoading(false);
    } catch (err) {
      console.log(err);
      // toast.error("Error fetching departments");
      setLoading(false);
    }
  };
  useEffect(() => {
    getAllDepartment();
  }, [checked]);

  const columns = [
    {
      title: "SNo",
      dataIndex: "sno",
      align: "left",
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
      title: "Department",
      dataIndex: "dept",
      align: "left",
      sorter: (a, b) => a.dept > b.dept,
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
        return record.dept.toLowerCase().includes(value.toLowerCase());
      },
    },
    {
      title: "Salary",
      dataIndex: "salary",
      align: "left",
      sorter: (a, b) => a.salary > b.salary,
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
        return record.salary.toLowerCase().includes(value.toLowerCase());
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

  const getSalaryHandler = async () => {
    const formData = new FormData();
    try {
      setLoading(true);
      const data = await salaryBreakupList(user.school, user._id, formData);
      console.log(data);
      if (data.err) {
        setLoading(false);
        return toast.error(data.err);
      }

      let tableData = [];
      data.forEach((element, index) => {
        tableData.push({
          sno: index + 1,
          name: element.staff.firstname + " " + element.staff.lastname,
          sid: element.staff.email,
          dept: element.department.name,
          salary: element.staff.salary,
          action: (
            <>
              <Button
                className="btn-sm pull-right"
                color="primary"
                type="button"
                onClick={() => {
                  setEditing(true);

                  setSalaryData({
                    ...salaryData,
                    total: element.staff.salary,
                    basic: element.basic_salary,
                    lta: element.lta,
                    hra: element.hra,
                    tax: element.professional_tax,
                    others: element.other,
                    totalAmount: element.staff.salary,
                    staffId: element.staff._id,
                    department: element.department._id,
                  });
                }}
                key={"edit" + 1}
              >
                <i className="fas fa-user-edit" />
              </Button>
              {/* <Button
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
            </Button> */}
            </>
          ),
        });
      });
      setTableData(tableData);
      setShowTable(true);
      setLoading(false);
    } catch (err) {
      console.log(err);
      toast.error("Error fetching Salary List");
      setLoading(false);
    }
  };
  useEffect(() => {
    getSalaryHandler();
  }, [checked]);
  const handleSearch = async (e) => {
    e.preventDefault();

    let data = [
      {
        sno: 1,
        name: "Rajesh",
        sid: "SID-1",
        dept: "CSE",
        salary: 10000,
        action: (
          <>
            <Button
              className="btn-sm pull-right"
              color="primary"
              type="button"
              onClick={() => {
                setEditing(true);
                setSalaryData({ ...salaryData, total: 10000 });
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
    setShowTable(true);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    let total =
      Number(salaryData.basic) +
      Number(salaryData.lta) +
      Number(salaryData.hra) -
      (Number(salaryData.tax) + Number(salaryData.others));
    setSalaryData({ ...salaryData, totalAmount: total });
    console.log(total,salaryData.total);
    if (total > salaryData.total) {
      toast.error("Total cannot be greater than Salary.");
      return;
    }
    const formData = new FormData();
    formData.append("basic_salary", salaryData.basic);
    formData.append("hra", salaryData.hra);
    formData.append("lta", salaryData.lta);
    formData.append("professional_tax", salaryData.tax);
    formData.append("other", salaryData.others);
    formData.append("total_amount", total);
    formData.set("staff", salaryData.staffId);
    formData.set("department", salaryData.department);
    try {
      setLoading(true);
      const data = await updateSalaryBreakup(user.school, user._id, formData);
      console.log(data);
      if (data.err) {
        setLoading(false);
        return toast.error(data.err);
      }
      toast.success("Salary Breakup Updated Successfully");
      setLoading(false);
      setEditing(false);
      setChecked(!checked);
      setSalaryData({
        ...salaryData,
        total: "",
        basic: "",
        lta: "",
        hra: "",
        tax: "",
        others: "",
        totalAmount: "",
        staff: "",
        department: "",
      });
    } catch (err) {
      console.log(err);
      toast.error("Error updating Salary Breakup");
      setLoading(false);
    }
  };
  const handleChange = (name) => async (event) => {
    setSalaryData({ ...salaryData, [name]: event.target.value });
  };

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
        loading={loading}
        bgColor="#f1f1f1"
        spinnerColor="#9ee5f8"
        textColor="#676767"
        text="Please Wait..."
      ></LoadingScreen>
      <Container fluid className="mt--6">
        <Card>
          <CardHeader>
            <h2>Search Staffs</h2>
          </CardHeader>
          <CardBody>
            <Form onSubmit={handleSearch}>
              <Row fluid>
                <Col>
                  <label
                    className="form-control-label"
                    htmlFor="exampleFormControlSelect3"
                  >
                    Select Department
                  </label>
                  <Input id="example4cols3Input" type="select">
                    <option value="" disabled selected>
                      Select Department
                    </option>
                    {allDepartments?.map((dept, index) => {
                      return (
                        <option key={index} value={dept._id}>
                          {dept.name}
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
                    Staff SID
                  </label>
                  <Input
                    id="example4cols3Input"
                    type="text"
                    placeholder="Enter SID"
                  />
                </Col>
                <Col>
                  <label
                    className="form-control-label"
                    htmlFor="exampleFormControlSelect3"
                  >
                    Staff Name
                  </label>
                  <Input
                    id="example4cols3Input"
                    type="text"
                    placeholder="Enter Name"
                  />
                </Col>
              </Row>
              <Row className="mt-4 float-right">
                <Col>
                  <Button color="primary" type="submit">
                    Search
                  </Button>
                </Col>
              </Row>
            </Form>
          </CardBody>
        </Card>
      </Container>
      <Container className="mt--0 shadow-lg table-responsive" fluid>
        {showTable && (
          <Card className="mb-4">
            <CardHeader>Staff Details</CardHeader>
            <CardBody>
              <AntTable
                columns={columns}
                data={tableData}
                pagination={true}
                exportFileName="credentials"
              />
            </CardBody>
          </Card>
        )}
      </Container>
      <Modal
        className="modal-dialog-centered"
        isOpen={editing}
        toggle={() => setEditing(false)}
        size="md"
      >
        <div className="modal-header">
          <h2 className="modal-title" id="modal-title-default">
            Salary Breakup
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
          <form onSubmit={handleSubmit}>
            <Row>
              <Col>
                <label className="form-control-label">Total Sallary</label>
                <Input
                  id="form-abbreviation-name"
                  value={salaryData.total}
                  onChange={handleChange("total")}
                  placeholder="Total Sallary"
                  type="number"
                  required
                />
              </Col>

              <Col>
                <label className="form-control-label">Basic Sallary</label>
                <Input
                  id="form-abbreviation-name"
                  value={salaryData.basic}
                  onChange={handleChange("basic")}
                  placeholder="Basic Sallary"
                  type="number"
                  required
                />
              </Col>
            </Row>
            <Row>
              <Col>
                <label className="form-control-label">LTA</label>
                <Input
                  id="form-abbreviation-name"
                  value={salaryData.lta}
                  onChange={handleChange("lta")}
                  placeholder="LTA"
                  type="number"
                  required
                />
              </Col>

              <Col>
                <label className="form-control-label">HRA</label>
                <Input
                  id="form-abbreviation-name"
                  value={salaryData.hra}
                  onChange={handleChange("hra")}
                  placeholder="HRA"
                  type="number"
                  required
                />
              </Col>
            </Row>
            <Row>
              <Col>
                <label className="form-control-label">Professional Tax</label>
                <Input
                  id="form-abbreviation-name"
                  value={salaryData.tax}
                  onChange={handleChange("tax")}
                  placeholder="Professional Tax"
                  type="number"
                  required
                />
              </Col>

              <Col>
                <label className="form-control-label">Others</label>
                <Input
                  id="form-abbreviation-name"
                  value={salaryData.others}
                  onChange={handleChange("others")}
                  placeholder="Others"
                  type="number"
                  required
                />
              </Col>
            </Row>
            <Row>
              <Col>
                <label className="form-control-label">Total Amount</label>
                <Input
                  id="form-abbreviation-name"
                  value={total}
                  placeholder="Others"
                  type="number"
                  required
                  disabled
                />
              </Col>
            </Row>
            <Row>
              <Col>
                <Button
                  color="primary"
                  type="submit"
                  className="mt-2 float-right"
                >
                  Update Sallary
                </Button>
              </Col>
            </Row>
          </form>
        </ModalBody>
      </Modal>
    </>
  );
};

export default SalaryBreakup;
