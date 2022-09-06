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
import { allSessions } from "api/session";
import SimpleHeader from "components/Headers/SimpleHeader";
import LoadingScreen from "react-loading-screen";
import { isAuthenticated } from "api/auth";
import { toast, ToastContainer } from "react-toastify";

import { getStaffByDepartment, allStaffs } from "api/staff";
import { getDepartment } from "api/department";
import { addUsedBudget } from "api/Budget";
const BudgetUsesDetails = () => {
  const [loading, setLoading] = useState(false);
  const { user, token } = isAuthenticated();
  const [sessions, setSessions] = useState("");
  const [budgetData, setBudgetData] = useState({
    shortDescription: "",
    amount: "",
    staff: "",
    department: "",
    session: "",
    longDescription: "",
    usedBy: "",
    confirmBy: "",
    type: "",
    reimburse: "",
    reimburseType: "",
    advance: "",
    usedAmount: "",
    paidAmount: 0,
    amountCollected: 0,
  });
  const [allStaff, setAllStaff] = useState([]);
  const [showBillType, setShowBillType] = useState(false);
  const [allDepartments, setAllDepartments] = useState([]);
  const [filterStaff, setFilterStaff] = useState([]);
  const [checked, setChecked] = useState(false);
  const [underBudget, setUnderBudget] = useState(true);
  const [image, setImage] = useState();
  const [imagePreview, setImagePreview] = useState();
  const [showReimburseType, setShowReimburseType] = useState(false);
  const imageChangeHandler = (e) => {
    // setImage(e.target.files[0]);
    // console.log(e.target);
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.readyState === 2) {
        setImagePreview(reader.result);
        setImage(reader.result);
      }
    };
    reader.readAsDataURL(e.target.files[0]);
  };

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
    getAllStaffs();
    getSession();
  }, [checked]);
  const getAllStaffs = async () => {
    try {
      setLoading(true);
      const { data } = await allStaffs(user.school, user._id);
      console.log(data);
      //   let canteenStaff = data.find((staff) => staff.assign_role === "library");
      setAllStaff(data);
      setLoading(false);
    } catch (err) {
      console.log(err);
      toast.error("Fetching Staffs Failed");
      setLoading(false);
    }
  };
  const handleChange = (name) => async (event) => {
    setBudgetData({ ...budgetData, [name]: event.target.value });

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

  const usedAmountBlur = () => {
    console.log("advance", budgetData.advance);
    console.log("usedAmount", budgetData.usedAmount);
    if (Number(budgetData.usedAmount) > Number(budgetData.advance)) {
      setUnderBudget(false);
      let leftAmount = budgetData.usedAmount - budgetData.advance;
      setBudgetData({
        ...budgetData,
        paidAmount: 0,
        amountCollected: leftAmount,
      });
    } else {
      setUnderBudget(true);
      let leftAmount = budgetData.advance - budgetData.usedAmount;
      setBudgetData({
        ...budgetData,
        amountCollected: 0,
        paidAmount: leftAmount,
      });
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
    formData.set("department", budgetData.department);
    formData.set("staff", budgetData.staff);
    formData.set("session", budgetData.session);
    formData.set("event_name", budgetData.shortDescription);
    formData.set("description", budgetData.longDescription);
    formData.set("used_by", budgetData.usedBy);
    formData.set("confirm_by", budgetData.confirmBy);
    formData.set("bill_type", budgetData.type);
    formData.set("used_amount", budgetData.usedAmount);
    formData.set("advance", budgetData.advance);
    formData.set("amount_paid", budgetData.paidAmount);
    formData.set("amount_collected", budgetData.amountCollected);
    if (budgetData.type === "yes") {
      {
        image && formData.set("bill", image);
      }
    }
    formData.set("reimburse", budgetData.reimburse);

    try {
      setLoading(true);
      const data = await addUsedBudget(user.school, user._id, formData);
      console.log(data);
      if (data.err) {
        setLoading(false);
        return toast.error(data.err);
      }
      toast.success("Used Budget Created");
      setLoading(false);
      setBudgetData({
        ...budgetData,
        shortDescription: "",
        longDescription: "",
        usedBy: "",
        confirmBy: "",
        type: "",
        usedAmount: "",
        advance: "",
        paidAmount: "",
        amountCollected: "",
        department: "",
        staff: "",
        session: "",
        reimburse: "",
      });
    } catch (err) {
      console.log(err);
      toast.error("Error creating budget");
      setLoading(false);
    }
  };
  useEffect(() => {
    if(sessions.length!==0){
      defaultSession1();
    }
  }, [sessions]);

  const defaultSession1 = async () => {
    const defaultSession = await sessions.find(
      (session) => session.status === "current"
    );
    setBudgetData({
      ...budgetData,
      session: defaultSession._id,
    });
   
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
            <form onSubmit={handleSubmit}>
              <Row>
                <Col>
                  <label
                    className="form-control-label"
                    htmlFor="example4cols2Input"
                  >
                    Event Name
                  </label>
                  <Input
                    id="example4cols2Input"
                    type="text"
                    onChange={handleChange("shortDescription")}
                    required
                    placeholder="Event Name"
                    value={budgetData.shortDescription}
                  />
                </Col>
                {/* <Col>
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
                    disabled
                    value={budgetData.amount}
                    placeholder="Enter Amount"
                  />
                </Col> */}
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
                    value={budgetData.session}
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
              <Row className="mt-2">
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
                    onChange={handleChange("longDescription")}
                    required
                    placeholder="Enter Description"
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
                    type="select"
                    onChange={handleChange("usedBy")}
                    required
                    value={budgetData.usedBy}
                  >
                    <option value="" selected>
                      Select Staff
                    </option>
                    {allStaff?.map((staff, index) => {
                      return (
                        <option key={index} value={staff._id}>
                          {staff.firstname + " " + staff.lastname}
                        </option>
                      );
                    })}
                  </Input>
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
                    type="select"
                    onChange={handleChange("confirmBy")}
                    required
                    placeholder="Enter Confirm By"
                    value={budgetData.confirmBy}
                  >
                    <option value="" selected>
                      Select Staff
                    </option>
                    {allStaff?.map((staff, index) => {
                      return (
                        <option key={index} value={staff._id}>
                          {staff.firstname + " " + staff.lastname}
                        </option>
                      );
                    })}
                  </Input>
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
                      onChange={imageChangeHandler}
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
                {/* {showReimburseType && (
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
                )} */}
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
                    Used Amount
                  </label>
                  <Input
                    id="example4cols2Input"
                    type="number"
                    onChange={handleChange("usedAmount")}
                    required
                    value={budgetData.usedAmount}
                    placeholder="Enter Used Amount"
                    onBlur={usedAmountBlur}
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
                    disabled
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
                    disabled
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
