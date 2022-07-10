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
import { Popconfirm } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { allSessions } from "api/session";
import { Table } from "ant-table-extensions";

import SimpleHeader from "components/Headers/SimpleHeader";
import LoadingScreen from "react-loading-screen";

import { isAuthenticated } from "api/auth";
import { toast, ToastContainer } from "react-toastify";
import { getStaffByDepartment, allStaffs } from "api/staff";
import { getDepartment } from "api/department";
import { addStaffBudget } from "api/Budget";

const BudgetMaster = () => {
  const [loading, setLoading] = useState(false);
  const { user, token } = isAuthenticated();
  const [sessions, setSessions] = useState("");
  const [allocationData, setAllocationData] = useState({
    department: "",
    staff: "",
    session: "",
    used: "",
    status: "",
    allocated: "",
  });

  const [allDepartments, setAllDepartments] = useState([]);
  const [allStaff, setAllStaff] = useState([]);
  const [filterStaff, setFilterStaff] = useState([]);
  const [checked, setChecked] = useState(false);

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
  const getSession = async () => {
    try {
      setLoading(true);
      const session = await allSessions(user._id, user.school, token);
      if (session.err) {
        setLoading(false);
        return toast.error(session.err);
      } else {
        setSessions(session);
        return;
      }
      setLoading(false);
    } catch (err) {
      setLoading(false);
      toast.error("Something Went Wrong!");
    }
  };

  useEffect(() => {
    getAllDepartment();
    getSession();
  }, [checked]);

  const handleChange = (name) => async (event) => {
    setAllocationData({ ...allocationData, [name]: event.target.value });
    if (name === "department") {
      filterStaffHandler(event.target.value);
    }
  };
  const filterStaffHandler = async (id) => {
    const formData = {
      departmentId: id,
    };
    try {
      setLoading(true);
      const data = await getStaffByDepartment(user.school, user._id, formData);
      console.log(data);
      if (data.err) {
        setLoading(false);
        return toast.error(data.err);
      }
      setFilterStaff(data);

      setLoading(false);
    } catch (err) {
      console.log(err);
      toast.error("Error fetching staff");
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.set("staff", allocationData.staff);
    formData.set("session", allocationData.session);
    formData.set("allocated", allocationData.allocated);
    try {
      setLoading(true);
      const data = await addStaffBudget(user.school, user._id, formData);
      console.log(data);
      if (data.err) {
        setLoading(false);
        return toast.error(data.err);
      }
      setLoading(false);
      toast.success("Budget Added Successfully");
    } catch (err) {
      console.log(err);
      toast.error("Error fetching staff");
      setLoading(false);
    }
  };

  return (
    <>
      <SimpleHeader
        name="Staff Budget Allocations"
        parentName="Accounts Management"
      />
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
            <h2>Staff Budget Allocations</h2>
          </CardHeader>
          <CardBody>
            <form onSubmit={handleSubmit}>
              <Row>
                <Col>
                  <label
                    className="form-control-label"
                    htmlFor="example4cols2Input"
                  >
                    Department
                  </label>
                  <Input
                    id="example4cols2Input"
                    type="select"
                    onChange={handleChange("department")}
                    required
                    value={allocationData.department}
                  >
                    <option value="" selected>
                      Select Department
                    </option>
                    {allDepartments?.map((dept, index) => (
                      <option key={index} value={dept._id}>
                        {dept.name}
                      </option>
                    ))}
                  </Input>
                </Col>
                <Col>
                  <label
                    className="form-control-label"
                    htmlFor="example4cols2Input"
                  >
                    Staff
                  </label>
                  <Input
                    id="example4cols2Input"
                    type="select"
                    onChange={handleChange("staff")}
                    required
                    value={allocationData.staff}
                  >
                    <option value="" selected>
                      Select Staff
                    </option>
                    {filterStaff?.map((staff, index) => (
                      <option key={index} value={staff._id}>
                        {staff.firstname + " " + staff.lastname}
                      </option>
                    ))}
                  </Input>
                </Col>
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
                    onChange={handleChange("session")}
                    value={allocationData.session}
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
              </Row>
              <Row>
                <Col>
                  <label
                    className="form-control-label"
                    htmlFor="example4cols2Input"
                  >
                    Allocated
                  </label>
                  <Input
                    id="example4cols2Input"
                    type="number"
                    onChange={handleChange("allocated")}
                    required
                    value={allocationData.allocated}
                    placeholder="Enter Allocated Amount"
                  />
                </Col>
                <Col>
                  <label
                    className="form-control-label"
                    htmlFor="example4cols2Input"
                  >
                    Used
                  </label>
                  <Input
                    id="example4cols2Input"
                    type="number"
                    onChange={handleChange("used")}
                    // required
                    placeholder="Enter Used Amount"
                    value={allocationData.used}
                  />
                </Col>
                <Col>
                  <label
                    className="form-control-label"
                    htmlFor="example4cols2Input"
                  >
                    Status
                  </label>
                  <Input
                    id="example4cols2Input"
                    type="select"
                    onChange={handleChange("status")}
                    // required
                    value={allocationData.status}
                  >
                    <option value="Yes" selected>
                      Yes
                    </option>
                    <option value="No" selected>
                      No
                    </option>
                  </Input>
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
    </>
  );
};

export default BudgetMaster;
