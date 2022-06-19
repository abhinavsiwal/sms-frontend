import React, { useEffect, useState } from "react";

import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  Form,
  Label,
  Input,
  Button,
  Modal,
  ModalFooter,
  ModalBody,
  CardHeader,
  Table,
} from "reactstrap";
import PasswordField from "./PasswordField";
import Loader from "components/Loader/Loader";
import { allStudents, filterStudent } from "api/student";
import SimpleHeader from "components/Headers/SimpleHeader.js";
import { isAuthenticated } from "api/auth";
import { toast, ToastContainer } from "react-toastify";
import { allSessions } from "api/session";
import {
  allStudentCredentials,
  studentPasswordEdit,
  parentPasswordEdit,
} from "api/credentials";
import { getStaffByDepartment } from "api/staff";
import { SearchOutlined } from "@ant-design/icons";
import AntTable from "../tables/AntTable";
import ReactPaginate from "react-paginate";
import { useReactToPrint } from "react-to-print";
import { getDepartment } from "api/department";
import { allClass } from "api/class";
const StaffCredentials = () => {
  const { user, token } = isAuthenticated();
  const [departmentList, setDepartmentList] = useState([]);

  const [staffs, setStaffs] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState({});
  const [loading, setLoading] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [viewLoading, setViewLoading] = useState(false);
  const [searchData, setSearchData] = useState({
    class: "",
    section: "",
  });
  const [selectEdit, setSelectEdit] = useState("");
  const [view, setView] = useState(0);
  const [editing, setEditing] = useState(false);
  const [credentials, setCredentials] = useState([]);
  const [editStudentSID, setEditStudentSID] = useState("");
  const [editStudentPassword, setEditStudentPassword] = useState("");
  const [editParentSID, setEditParentSID] = useState("");
  const [editParentPassword, setEditParentPassword] = useState("");
  const [viewCredentials, setViewCredentials] = useState(false);

  useEffect(() => {
    getAllDepartments();
  }, []);

  const getAllDepartments = async () => {
    try {
      setLoading(true);
      const data = await getDepartment(user.school, user._id, token);
      console.log(data);
      if (data.err) {
        setLoading(false);
        return toast.error(data.err);
      }
      setDepartmentList(data);
      setLoading(false);
    } catch (err) {
      toast.error("Fetching Departments Failed");
      setLoading(false);
    }
  };
  const columns = [
    {
      title: "Staff SID",
      dataIndex: "sid",
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
      title: " Staff Password",
      dataIndex: "password",
      sorter: (a, b) => a.password > b.password,
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
        return record.password.toLowerCase().includes(value.toLowerCase());
      },
      render: (value) => <PasswordField value={value} />,
    },

    {
      title: "Parent SID",
      dataIndex: "parentId",
      sorter: (a, b) => a.parentId > b.parentId,
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
        return record.parentId.toLowerCase().includes(value.toLowerCase());
      },
    },
    {
      title: "Parent Password",
      dataIndex: "parentPassword",
      sorter: (a, b) => a.parentPassword > b.parentPassword,
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
        return record.parentPassword
          .toLowerCase()
          .includes(value.toLowerCase());
      },
      render: (value) => <PasswordField value={value} />,
    },
    {
      title: "Action",
      key: "action",
      dataIndex: "action",
      fixed: "right",
    },
  ];
  const searchHandler = async () => {
    const formData = {
      department: selectedDepartment,
    };

    try {
    } catch (error) {}
  };

  return (
    <>
      <SimpleHeader name="Add Student" parentName="Student Management" />
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
      <Container className="mt--6 shadow-lg" fluid>
        {loading ? (
          <Loader />
        ) : (
          <Card>
            <CardBody>
              <Row className="d-flex justify-content-center mb-4">
                <Col md="6">
                  <Label
                    className="form-control-label"
                    htmlFor="xample-date-input"
                  >
                    Select Deparment
                  </Label>
                  <Input
                    className="form-control-sm"
                    id="exampleFormControlSelect3"
                    type="select"
                    onChange={(e) => setSelectedDepartment(e.target.value)}
                    value={selectedDepartment}
                    required
                  >
                    <option value="">Select Deparment</option>
                    {departmentList &&
                      departmentList.map((clas, index) => {
                        // setselectedClassIndex(index)
                        // console.log(clas);
                        return (
                          <option value={clas._id} key={index}>
                            {clas.name}
                          </option>
                        );
                      })}
                  </Input>
                </Col>

                <Col className="mt-4">
                  <Button
                    color="primary"
                    //    onClick={searchHandler}
                  >
                    Search
                  </Button>
                </Col>
              </Row>
            </CardBody>
          </Card>
        )}
      </Container>
    </>
  );
};

export default StaffCredentials;
