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
import { Table } from "ant-table-extensions";

import SimpleHeader from "components/Headers/SimpleHeader";
import LoadingScreen from "react-loading-screen";
import { isAuthenticated } from "api/auth";
import { toast, ToastContainer } from "react-toastify";
import { allSessions } from "api/session";
import { getStaffByDepartment, allStaffs } from "api/staff";
import { getDepartment } from "api/department";
const BudgetUsesDetails = () => {
  const [loading, setLoading] = useState(false);
  const { user, token } = isAuthenticated();
  const [budgetData, setBudgetData] = useState({
    shortDescription: "",
    amount: "",
    staff: "",
    department: "",
    longDescription: "",
    usedBy: "",
    confirmBy: "",
    type: "",
    bill: "",
    reimburse: "",
    reimburseType: "",
    advance: "",
    usedBy: "",
    usedAmount: "",
    paidAmount: "",
    amountCollected: "",
  });
  const [showBillType, setShowBillType] = useState(false);
  const [allDepartments, setAllDepartments] = useState([]);
  const [filterStaff, setFilterStaff] = useState([]);
  const [checked, setChecked] = useState(false);
  const [showReimburseType, setShowReimburseType] = useState(false);
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

  const handleChange = (name) => async (event) => {
    setBudgetData({ ...budgetData, [name]: event.target.value });
    console.log(name, event.target.value);
    if (name === "department") {
      filterStaffHandler(event.target.value);
    }
    if (name === "type") {
      if (event.target.value === "yes") {
        setShowBillType(true);
      } else {
        setShowBillType(false);
      }
    }
    if (name === "reimburse") {
      console.log("here");
      if (event.target.value === "yes") {
        setShowReimburseType(true);
      } else {
        setShowReimburseType(false);
      }
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

  return (
    <>
      <SimpleHeader
        name="Budget Uses Details"
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

      <Container className="mt--6" fluid>
        <Card>
          <CardHeader>
            <h2>Budget Uses Details</h2>
          </CardHeader>
          <CardBody>
            <form>
              <Row>
                <Col>
                  <label
                    className="form-control-label"
                    htmlFor="example4cols2Input"
                  >
                    Short Description
                  </label>
                  <Input
                    id="example4cols2Input"
                    type="textarea"
                    onChange={handleChange("shortDescription")}
                    required
                    value={budgetData.shortDescription}
                  />
                </Col>
                <Col>
                  <label
                    className="form-control-label"
                    htmlFor="example4cols2Input"
                  >
                    Amount
                  </label>
                  <Input
                    id="example4cols2Input"
                    type="number"
                    onChange={handleChange("amount")}
                    required
                    value={budgetData.amount}
                  />
                </Col>
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
                    value={budgetData.department}
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
                    value={budgetData.staff}
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
              </Row>
              <Row className="mt-2">
                <Col>
                  <label
                    className="form-control-label"
                    htmlFor="example4cols2Input"
                  >
                    Long Description
                  </label>
                  <Input
                    id="example4cols2Input"
                    type="textarea"
                    onChange={handleChange("longDescription")}
                    required
                    value={budgetData.longDescription}
                  />
                </Col>
                <Col>
                  <label
                    className="form-control-label"
                    htmlFor="example4cols2Input"
                  >
                    Used By
                  </label>
                  <Input
                    id="example4cols2Input"
                    type="text"
                    onChange={handleChange("usedBy")}
                    required
                    value={budgetData.usedBy}
                  />
                </Col>
                <Col>
                  <label
                    className="form-control-label"
                    htmlFor="example4cols2Input"
                  >
                    Update and Confirm By
                  </label>
                  <Input
                    id="example4cols2Input"
                    type="number"
                    onChange={handleChange("confirmBy")}
                    required
                    value={budgetData.confirmBy}
                  />
                </Col>
              </Row>
              <Row className="mt-2">
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
                    value={budgetData.type}
                  >
                    <option value="" selected>
                      Bill Type
                    </option>
                    <option value="yes" selected>
                      Yes
                    </option>
                    <option value="no" selected>
                      No
                    </option>
                  </Input>
                </Col>
                {showBillType && (
                  <Col>
                    <label
                      className="form-control-label"
                      htmlFor="example4cols2Input"
                    >
                      Bill
                    </label>
                    <Input
                      id="example4cols2Input"
                      type="file"
                      // onChange={handleChange("type")}
                      required
                      // value={budgetData.type}
                    />
                  </Col>
                )}
                <Col>
                  <label
                    className="form-control-label"
                    htmlFor="example4cols2Input"
                  >
                    Reimburse
                  </label>
                  <Input
                    id="example4cols2Input"
                    type="select"
                    onChange={handleChange("reimburse")}
                    required
                    value={budgetData.reimburse}
                  >
                    <option value="" selected>
                      Reimburse
                    </option>
                    <option value="yes" selected>
                      Yes
                    </option>
                    <option value="no" selected>
                      No
                    </option>
                  </Input>
                </Col>
                {showReimburseType && (
                  <Col>
                    <label
                      className="form-control-label"
                      htmlFor="example4cols2Input"
                    >
                      Reimburse Type
                    </label>
                    <Input
                      id="example4cols2Input"
                      type="select"
                      onChange={handleChange("reimburseType")}
                      required
                      value={budgetData.reimburseType}
                    >
                      <option value="" selected>
                        Reimburse Type
                      </option>
                      <option value="cash" selected>
                        Cash
                      </option>
                      <option value="salary" selected>
                        Salary
                      </option>
                    </Input>
                  </Col>
                )}
              </Row>
              <Row className="mt-2">
              <Col>
                  <label
                    className="form-control-label"
                    htmlFor="example4cols2Input"
                  >
                    Advance
                  </label>
                  <Input
                    id="example4cols2Input"
                    type="number"
                    onChange={handleChange("advance")}
                    required
                    value={budgetData.advance}
                    placeholder="Enter Advance Amount"
                  />
                </Col>
              <Col>
                  <label
                    className="form-control-label"
                    htmlFor="example4cols2Input"
                  >
                    Allocation use by
                  </label>
                  <Input
                    id="example4cols2Input"
                    type="text"
                    onChange={handleChange("usedBy")}
                    required
                    value={budgetData.usedBy}
                    placeholder="Enter Allocation use by"
                  />
                </Col>
              <Col>
                  <label
                    className="form-control-label"
                    htmlFor="example4cols2Input"
                  >
                    Used Amount
                  </label>
                  <Input
                    id="example4cols2Input"
                    type="number"
                    onChange={handleChange("usedAmount")}
                    required
                    value={budgetData.usedAmount}
                    placeholder="Enter Used Amount"
/>
                </Col>
              <Col>
                  <label
                    className="form-control-label"
                    htmlFor="example4cols2Input"
                  >
                    Amount to be Paid
                  </label>
                  <Input
                    id="example4cols2Input"
                    type="number"
                    onChange={handleChange("paidAmount")}
                    required
                    value={budgetData.paidAmount}
                    placeholder="Enter Amount to be Paid"
                  />
                </Col>
              <Col>
                  <label
                    className="form-control-label"
                    htmlFor="example4cols2Input"
                  >
                    Amount Collected
                  </label>
                  <Input
                    id="example4cols2Input"
                    type="number"
                    onChange={handleChange("amountCollected")}
                    required
                    value={budgetData.amountCollected}
                    placeholder="Enter Amount Collected"
                  />
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

export default BudgetUsesDetails;
