import React, { useState, useEffect } from "react";
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
  CardHeader,
} from "reactstrap";
import "./style.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Loader from "components/Loader/Loader";
import { isAuthenticated } from "api/auth";
import { toast, ToastContainer } from "react-toastify";
import { getStaffByDepartment, allStaffs } from "api/staff";
import { getDepartment } from "api/department";
import {
  getAllBuildingsList,
  getAllRooms,
  allocateRoom,
  hostelStaffList,
} from "api/hostelManagement";
import { getAllBooks, allocateBook } from "../../../api/libraryManagement";
const StaffAllocation = ({ setLoading }) => {
  const { user, token } = isAuthenticated();
  const [allocationDate, setAllocationDate] = useState(new Date());

  const [allocationData, setAllocationData] = useState({
    department: "",
    staff: "",
    bookName: "",
    bookId: "",
    allocationDate: new Date(),
    allocatedBy: "",
    duration: "",
    allocationType: "",
    rent: "",
  });

  const [allDepartments, setAllDepartments] = useState([]);
  const [allStaff, setAllStaff] = useState([]);
  const [filterStaff, setFilterStaff] = useState([]);
  const [checked, setChecked] = useState(false);
  const [selectedBook, setSelectedBook] = useState([]);
  const [allBooks, setAllBooks] = useState([]);
  const [typeView, setTypeView] = useState(0);
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
  const getAllBuildingHandler = async () => {
    try {
      setLoading(true);
      const data = await getAllBuildingsList(user.school, user._id);
      console.log(data);
      setAllBooks(data);
      setLoading(false);
    } catch (err) {
      console.log(err);
      toast.error("Fetching Books Failed");
      setLoading(false);
    }
  };
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
  useEffect(() => {
    getAllDepartment();
    getAllStaffs();
    getAllBuildingHandler();
  }, [checked]);

  const getAllRoomsHandler = async (buildingId) => {
    console.log(buildingId);
    const formData = new FormData();
    formData.set("building_id", buildingId);
    try {
      setLoading(true);
      const data = await getAllRooms(user._id, user.school, formData);
      console.log(data);
      setSelectedBook(data);
      setLoading(false);
    } catch (err) {
      console.log(err);
      toast.error("Fetching Students Failed");
      setLoading(false);
    }
  };
  const handleChange = (name) => async (event) => {
    setAllocationData({ ...allocationData, [name]: event.target.value });
    console.log(name, event.target.value);

    if (name === "department") {
      filterStaffHandler(event.target.value);
    }
    if (name === "bookName") {
      getAllRoomsHandler(event.target.value);
    }
    if (name === "allocationType") {
      if (event.target.value === "Read Here") {
        setTypeView(1);
      } else if (event.target.value === "Rent") {
        setTypeView(2);
      }
    }
  };
  const filterStaffHandler = async (id) => {
    const formData = new FormData();
    formData.set("department_id", id);
    try {
      setLoading(true);
      const data = await hostelStaffList(user._id, user.school, formData);
      console.log(data);
      setFilterStaff(data);

      setLoading(false);
    } catch (err) {
      console.log(err);
      toast.error("Error fetching staff");
      setLoading(false);
    }
  };

  const allocateBookHandler = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.set("building", allocationData.bookName);
    formData.set("room_number", allocationData.bookId);
    formData.set("staff", allocationData.staff);
    formData.set("allocationDate", allocationDate);
    formData.set("duration", allocationData.duration);
    formData.set("school", user.school);
    formData.set("department", allocationData.department);
    formData.set("allocatedBy", allocationData.allocatedBy);
    formData.set("status", "Allocated");
    formData.set("allocatedBy", allocationData.allocatedBy);
    if (typeView === 2) {
      formData.set("rent", allocationData.rent);
    }
    try {
      setLoading(true);
      const data = await allocateRoom(user._id, user.school, formData);
      console.log(data);
      if (data.err) {
        setLoading(false);
        return toast.error(data.err);
      }
      setChecked(!checked);

      toast.success("Room Allocated Successfully");
      setAllocationData({
        department: "",
        staff: "",
        bookName: "",
        bookId: "",
        allocationDate: "",
        allocatedBy: "",
        duration: "",
      });
      setLoading(false);
    } catch (err) {
      console.log(err);
      toast.error("Allocation Failed");
      setLoading(false);
    }
  };

  return (
    <>
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        draggable
        pauseOnHover
        theme="colored"
      />
      <Form className="mt-3" onSubmit={allocateBookHandler}>
        <Row>
          <Col md="6">
            <Label className="form-control-label" htmlFor="example4cols2Input">
              Department
            </Label>
            <Input
              id="example4cols2Input"
              placeholder="Canteen Name"
              type="select"
              name="department"
              onChange={handleChange("department")}
              value={allocationData.department}
              required
            >
              <option value="">Select Department</option>
              {allDepartments &&
                allDepartments.map((dept) => (
                  <option key={dept._id} value={dept._id}>
                    {dept.name}
                  </option>
                ))}
            </Input>
          </Col>
          <Col md="6">
            <Label className="form-control-label" htmlFor="example4cols2Input">
              Staff
            </Label>
            <Input
              id="example4cols2Input"
              placeholder="Student Name"
              type="select"
              name="staff"
              onChange={handleChange("staff")}
              value={allocationData.staff}
              required
            >
              <option value="">Select Staff</option>
              {filterStaff &&
                filterStaff.map((staff) => (
                  <option key={staff._id} value={staff._id}>
                    {staff.firstname} {staff.lastname}
                  </option>
                ))}
            </Input>
          </Col>
        </Row>
        <Row>
          <Col md="6">
            <Label className="form-control-label" htmlFor="example4cols2Input">
              Building Name
            </Label>
            <Input
              id="example4cols2Input"
              placeholder="Student Name"
              type="select"
              name="bookName"
              onChange={handleChange("bookName")}
              value={allocationData.bookName}
              required
            >
              <option value="">Select Building</option>
              {allBooks &&
                allBooks.map((book) => (
                  <option key={book._id} value={book._id}>
                    {book.name}
                  </option>
                ))}
            </Input>
          </Col>
          <Col md="6">
            <Label className="form-control-label" htmlFor="example4cols2Input">
              Room No
            </Label>
            <Input
              id="example4cols2Input"
              placeholder="Student Name"
              type="select"
              name="bookId"
              onChange={handleChange("bookId")}
              value={allocationData.bookId}
              required
            >
              <option value="">Select Room No</option>
              {selectedBook &&
                selectedBook.map((id) => (
                  <option key={id} value={id}>
                    {id}
                  </option>
                ))}
            </Input>
          </Col>
        </Row>
        <Row>
          <Col md="6">
            <Label className="form-control-label" htmlFor="example-date-input">
              Allocation Date
            </Label>
            <DatePicker
              id="exampleFormControlSelect3"
              dateFormat="dd/MM/yyyy"
              placeholderText="dd/mm/yyyy"
              selected={allocationDate}
              onChange={(date) => setAllocationDate(date)}
              howMonthDropdown
              showYearDropdown
              dropdownMode="select"
              className="datePicker"
              required
              minDate={new Date()}
            />
          </Col>

          <Col md="6">
            <Label className="form-control-label" htmlFor="example4cols2Input">
              Allocated By
            </Label>
            <Input
              id="example4cols2Input"
              placeholder="Student Name"
              type="select"
              name="allocatedBy"
              onChange={handleChange("allocatedBy")}
              value={allocationData.allocatedBy}
              required
            >
              <option value="">Select Staff</option>
              {allStaff &&
                allStaff.map((staff) => (
                  <option key={staff._id} value={staff._id}>
                    {staff.firstname} {staff.lastname}
                  </option>
                ))}
            </Input>
          </Col>
        </Row>

        <Row className="mt-4">
          <Col
            style={{
              display: "flex",
              justifyContent: "center",
              width: "100%",
            }}
          >
            <Button color="primary" type="submit">
              Allocate Room
            </Button>
          </Col>
        </Row>
      </Form>
    </>
  );
};

export default StaffAllocation;
