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
import Loader from "components/Loader/Loader";
import { isAuthenticated } from "api/auth";
import { toast, ToastContainer } from "react-toastify";
import { getStaffByDepartment, allStaffs } from "api/staff";
import { getDepartment } from "api/department";
import { getAllBooks, returnBook } from "../../../api/libraryManagement";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./style.css";
const StaffReturn = () => {
  const { user, token } = isAuthenticated();
  const [loading, setLoading] = useState(false);
  const [returnData, setReturnData] = useState({
    department: "",
    staff: "",
    bookName: "",
    bookId: "",
    collectionDate: "",
    collectedBy: "",
  });
  const [returnDate, setReturnDate] = useState(new Date());
  const [allDepartments, setAllDepartments] = useState([]);
  const [allStaff, setAllStaff] = useState([]);
  const [filterStaff, setFilterStaff] = useState([]);
  const [checked, setChecked] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState({});
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
  }, [checked]);
  const handleChange = (name) => async (event) => {
    setReturnData({ ...returnData, [name]: event.target.value });
    console.log(name, event.target.value);

    if (name === "department") {
      if (event.target.value === "") {
        return;
      }
      filterStaffHandler(event.target.value);
    }
    if (name === "staff") {
      if (event.target.value === "") {
        return;
      }
      let selectedStaff1 = filterStaff.find(
        (staff) => staff._id === event.target.value
      );
      console.log(selectedStaff1);
      setSelectedStaff(selectedStaff1);
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
      setFilterStaff(data);

      setLoading(false);
    } catch (err) {
      console.log(err);
      toast.error("Error fetching staff");
      setLoading(false);
    }
  };

  const returnHandler = async (e) => {
    console.log(returnData);
    let bookId = returnData.bookName.slice(0, 8);
    console.log(bookId);
    let bookName = returnData.bookName.slice(9, 33);
    let allocationId = returnData.bookName.slice(34, 59);

    //   "027084ed-6269d0ab66c8f238188e8c91-626a7e94d594341358930860"
    console.log(bookName);
    console.log(allocationId);

    e.preventDefault();
    const formData = new FormData();
    formData.set("status", "Return");
    formData.set("book", bookName);
    formData.set("bookID", bookId);
    formData.set("staff", returnData.staff);
    formData.set("school", user.school);
    formData.set("returned", true);
    formData.set("collectedBy", returnData.collectedBy);
    formData.set("collectionDate", returnDate);
    formData.set("allocationId", allocationId);
    formData.set("department", returnData.department);
    try {
      setLoading(true);
      const data = await returnBook(user._id, formData);
      console.log(data);
      if (data.err) {
        setLoading(false);
        return toast.error(data.err);
      }
      setLoading(false);
      toast.success("Book Returned Successfully");
      setReturnData({
        department: "",
        staff: "",
        bookName: "",
        bookId: "",
        collectionDate: "",
        collectedBy: "",
      });
    } catch (err) {
      console.log(err);
      toast.error("Book Return Failed");
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
      {loading ? (
        <Loader />
      ) : (
        <Form className="mt-3" onSubmit={returnHandler}>
          <Row>
            <Col md="6">
              <Label
                className="form-control-label"
                htmlFor="example4cols2Input"
              >
                Department
              </Label>
              <Input
                id="example4cols2Input"
                placeholder="Canteen Name"
                type="select"
                name="department"
                onChange={handleChange("department")}
                value={returnData.department}
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
              <Label
                className="form-control-label"
                htmlFor="example4cols2Input"
              >
                Staff
              </Label>
              <Input
                id="example4cols2Input"
                placeholder="Student Name"
                type="select"
                name="staff"
                onChange={handleChange("staff")}
                value={returnData.staff}
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
              <Label
                className="form-control-label"
                htmlFor="example4cols2Input"
              >
                Issued Book
              </Label>
              <Input
                id="exampleFormControlSelect3"
                type="select"
                required
                value={returnData.bookName}
                onChange={handleChange("bookName")}
                name="section"
              >
                <option value="">Select Book</option>
                {selectedStaff.issuedBooks &&
                  selectedStaff.issuedBooks.map((book) => {
                    console.log(book);
                    return (
                      <option
                        value={
                          book.bookID + "-" + book.book._id + "-" + book._id
                        }
                        key={book._id}
                      >
                        {book.book.name} - {book.bookID}
                      </option>
                    );
                  })}
              </Input>
            </Col>
            <Col md="6">
              <Label
                className="form-control-label"
                htmlFor="example-date-input"
              >
                Collection Date
              </Label>
              <DatePicker
                id="exampleFormControlSelect3"
                dateFormat="dd/MM/yyyy"
                placeholderText="dd/mm/yyyy"
                selected={returnDate}
                onChange={(date) => setReturnDate(date)}
                howMonthDropdown
                showYearDropdown
                dropdownMode="select"
                className="datePicker"
                required
                minDate={new Date()}
              />
            </Col>
          </Row>
          <Row>
            <Col md="6">
              <Label
                className="form-control-label"
                htmlFor="example4cols2Input"
              >
                Collected By
              </Label>
              <Input
                id="example4cols2Input"
                placeholder="Student Name"
                type="select"
                name="allocatedBy"
                onChange={handleChange("collectedBy")}
                value={returnData.collectedBy}
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
                Return Book
              </Button>
            </Col>
          </Row>
        </Form>
      )}
    </>
  );
};

export default StaffReturn;
