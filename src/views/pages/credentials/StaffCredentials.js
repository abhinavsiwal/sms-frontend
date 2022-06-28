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
  staffPasswordEdit,
  
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
  const [editStaffSID, setEditStaffSID] = useState("");
  const [editStaffPassword, setEditStaffPassword] = useState("");

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
      title: "Action",
      key: "action",
      dataIndex: "action",
      fixed: "right",
    },
  ];
  const searchHandler = async () => {
    const formData = {
      departmentId: selectedDepartment,
    };
    try {
      setViewLoading(true);
      const data = await getStaffByDepartment(user.school, user._id, formData);
      console.log(data);
      if (data.err) {
        setViewLoading(false);
        toast.error(data.err);
        return;
      }
      let tableData = [];
      for (let i = 0; i < data.length; i++) {
        tableData.push({
          key: i,
          sid: data[i].SID,
          password: data[i].temp,

          action: (
            <h5 key={i + 1} className="mb-0">
              <Button
                className="btn-sm pull-right"
                color="primary"
                type="button"
                onClick={() => {
                  setEditing(true);
                  setEditStaffPassword(data[i].temp);
                  setEditStaffSID(data[i].SID);
                }}
                key={"edit" + i + 1}
              >
                <i className="fas fa-user-edit" />
              </Button>
              <Button
                className="btn-sm pull-right"
                color="success"
                type="button"
                key={"email" + i + 1}
              >
                Send Email
              </Button>
            </h5>
          ),
        });
      }
      setStaffs(tableData);
      setViewCredentials(true);
      setViewLoading(false);
    } catch (err) {
      console.log(err);
      setViewLoading(false);
      toast.err("Error in getting Staff");
    }
    try {
    } catch (error) {}
  };
  const handleEdit = async()=>{
    const formData = new FormData();
    formData.set("SID", editStaffSID);
    formData.set("password", editStaffPassword);
    try {
      setEditLoading(true);
      const data = await staffPasswordEdit(user._id, formData);
      console.log(data);
      searchHandler();
      toast.success("Staff Password Updated");
      setEditLoading(false);
      setEditing(false);
    } catch (err) {
      setEditLoading(false);
      console.log(err);
      toast.error("Staff Password Update Failed");
      setEditing(false);
    }
  }
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
                  <Button color="primary" onClick={searchHandler}>
                    Search
                  </Button>
                </Col>
              </Row>
            </CardBody>
          </Card>
        )}
      </Container>
      <Container className="mt--0 shadow-lg table-responsive" fluid>
        {viewCredentials &&
          (viewLoading ? (
            <Loader />
          ) : (
            <Card className="mb-4">
              <CardHeader></CardHeader>
              <CardBody>
                <AntTable
                  columns={columns}
                  data={staffs}
                  pagination={true}
                  exportFileName="credentials"
                />
              </CardBody>
            </Card>
          ))}
      </Container>
      <Modal
        className="modal-dialog-centered"
        isOpen={editing}
        toggle={() => setEditing(false)}
        size="sm"
      >
        <div className="modal-header">
          <h2 className="modal-title" id="modal-title-default">
            Change Password
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
        {editLoading ? (
          <Loader />
        ) : (
          <>
            <ModalBody>
              <Row>
                <Col>
                  <label className="form-control-label">Password</label>
                  <Input
                    id="form-abbreviation-name"
                    value={editStaffPassword}
                    onChange={(e) => setEditStaffPassword(e.target.value)}
                    placeholder="Password"
                    type="text"
                  />
                </Col>
              </Row>
            </ModalBody>
            <ModalFooter>
              
                <Button color="success" type="button" onClick={handleEdit} > 
                  Save Password
                </Button>
             
            </ModalFooter>
          </>
        )}
      </Modal>
    </>
  );
};

export default StaffCredentials;
