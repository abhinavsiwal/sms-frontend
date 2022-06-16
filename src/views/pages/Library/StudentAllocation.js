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
import { allStudents, filterStudent } from "api/student";
import { getAllBooks, allocateBook } from "../../../api/libraryManagement";
import { allStaffs } from "api/staff";
//css
import moment from "moment";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./style.css";
import { toast, ToastContainer } from "react-toastify";
import { allClass } from "api/class";
const StudentAllocation = () => {
  const { user, token } = isAuthenticated();
  const [allocationDate, setAllocationDate] = useState(new Date());
  const [allocationData, setAllocationData] = useState({
    class: "",
    section: "",
    student: "",
    bookName: "",
    bookId: "",
    allocationDate: "",
    allocatedBy: "",
    duration: "",
    allocationType: "",
    rent: "",
  });
  const [loading, setLoading] = useState(false);
  const [classList, setClassList] = useState([]);
  const [selectedClass, setSelectedClass] = useState({});
  const [studentLoading, setStudentLoading] = useState(false);
  const [students, setStudents] = useState([]);
  const [allBooks, setAllBooks] = useState([]);
  const [selectedBook, setSelectedBook] = useState({});
  const [allStaff, setAllStaff] = useState([]);
  const [checked, setChecked] = useState(false);
  const [typeView, setTypeView] = useState(0);
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
  const getAllBooksHandler = async () => {
    try {
      setLoading(true);
      const data = await getAllBooks(user.school, user._id);
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
    getAllClasses();
    getAllBooksHandler();
    getAllStaffs();
  }, [checked]);

  const handleChange = (name) => async (event) => {
    setAllocationData({ ...allocationData, [name]: event.target.value });
    console.log(name, event.target.value);
    if (name === "class") {
      // console.log("@@@@@@@@=>", event.target.value);
      // setSelectedClassId(event.target.value);
      let selectedClass = classList.find(
        (item) => item._id.toString() === event.target.value.toString()
      );
      // console.log(selectedClass);
      setSelectedClass(selectedClass);
    }
    if (name === "section") {
      filterStudentHandler(event.target.value);
    }
    if (name === "bookName") {
      let selectedBook = allBooks.find(
        (item) => item._id.toString() === event.target.value.toString()
      );
      console.log(selectedBook);
      setSelectedBook(selectedBook);
    }
    if (name === "allocationType") {
      if (event.target.value === "Read Here") {
        setTypeView(1);
      } else if (event.target.value === "Rent") {
        setTypeView(2);
      }
    }
  };

  const filterStudentHandler = async (id) => {
    console.log(allocationData);
    const formData = {
      section: id,
      class: allocationData.class,
    };
    try {
      setLoading(true);
      const data = await filterStudent(user.school, user._id, formData);
      console.log(data);
      setStudents(data);
      setLoading(false);
    } catch (err) {
      console.log(err);
      toast.error("Fetching Students Failed");
      setLoading(false);
    }
  };

  const allocateBookHandler = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.set("book", allocationData.bookName);
    formData.set("bookID", allocationData.bookId);
    formData.set("student", allocationData.student);
    formData.set("allocationDate", allocationDate);
    formData.set("duration", allocationData.duration);
    formData.set("school", user.school);
    formData.set("class", allocationData.class);
    formData.set("section", allocationData.section);
    formData.set("status", "Allocated");
    formData.set("allocatedBy", allocationData.allocatedBy);
    formData.set("allocationType", allocationData.allocationType);
    if (typeView === 2) {
      formData.set("rent", allocationData.rent);
    }
    try {
      setLoading(true);
      const data = await allocateBook(user._id, formData);
      console.log(data);
      if (data.err) {
        setLoading(false);
        return toast.error(data.err);
      }
      setChecked(!checked);

      toast.success("Book Allocated Successfully");
      setAllocationData({
        class: "",
        section: "",
        student: "",
        bookName: "",
        bookId: "",
        allocationDate: "",
        allocatedBy: "",
        duration: "",
        allocationType: "",
      });
      setLoading(false);
    } catch (err) {
      console.log(err);
      toast.error("Allocation Failed");
      setLoading(false);
    }
  };

  const filterDateHandler = (time) => {
    const currentDate = new Date();
    const selectedDate = new Date(time);

    return currentDate <= selectedDate;
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
        <Form className="mt-3" onSubmit={allocateBookHandler}>
          <Row>
            <Col md="6">
              <Label
                className="form-control-label"
                htmlFor="example4cols2Input"
              >
                Class
              </Label>
              <Input
                id="example4cols2Input"
                placeholder="Canteen Name"
                type="select"
                name="class"
                onChange={handleChange("class")}
                value={allocationData.class}
                required
              >
                <option value="">Select Class</option>
                {classList &&
                  classList.map((classs) => (
                    <option key={classs._id} value={classs._id}>
                      {classs.name}
                    </option>
                  ))}
              </Input>
            </Col>

            <Col md="6">
              <label
                className="form-control-label"
                htmlFor="exampleFormControlSelect3"
              >
                Section
              </label>
              <Input
                id="exampleFormControlSelect3"
                type="select"
                required
                value={allocationData.section}
                onChange={handleChange("section")}
                name="section"
              >
                <option value="">Select Section</option>
                {selectedClass.section &&
                  selectedClass.section.map((section) => {
                    // console.log(section.name);
                    return (
                      <option value={section._id} key={section._id} selected>
                        {section.name}
                      </option>
                    );
                  })}
              </Input>
            </Col>
          </Row>
          <Row>
            <Col md="6">
              <Label
                className="form-control-label"
                htmlFor="example4cols2Input"
              >
                Student
              </Label>
              <Input
                id="example4cols2Input"
                placeholder="Student Name"
                type="select"
                name="class"
                onChange={handleChange("student")}
                value={allocationData.student}
                required
              >
                <option value="">Select Student</option>
                {students &&
                  students.map((student) => (
                    <option key={student._id} value={student._id}>
                      {student.firstname} {student.lastname}
                    </option>
                  ))}
              </Input>
            </Col>
            <Col md="6">
              <Label
                className="form-control-label"
                htmlFor="example4cols2Input"
              >
                Book Name
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
                <option value="">Select Book</option>
                {allBooks &&
                  allBooks.map((book) => (
                    <option key={book._id} value={book._id}>
                      {book.name}
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
                Book Id
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
                <option value="">Select Book Id</option>
                {selectedBook.bookID &&
                  selectedBook.bookID.map((id) => (
                    <option key={id} value={id}>
                      {id}
                    </option>
                  ))}
              </Input>
            </Col>
            <Col md="6">
              <Label
                className="form-control-label"
                htmlFor="example-date-input"
              >
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
          </Row>
          <Row>
            <Col md="6">
              <Label
                className="form-control-label"
                htmlFor="example-date-input"
              >
                Duration
              </Label>
              <Input
                id="example-date-input"
                type="number"
                placeholder="Duration"
                onChange={handleChange("duration")}
                value={allocationData.duration}
                required
              />
            </Col>
            <Col md="6">
              <Label
                className="form-control-label"
                htmlFor="example4cols2Input"
              >
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
          <Row>
            <Col md="6">
              <Label
                className="form-control-label"
                htmlFor="example-date-input"
              >
                Allocation Type
              </Label>
              <Input
                id="example-date-input"
                type="select"
                onChange={handleChange("allocationType")}
                value={allocationData.allocationType}
                required
              >
                <option value="">Select Type</option>
                <option value="Read Here">Read Here</option>
                <option value="Rent">Rent</option>
              </Input>
            </Col>
            {typeView === 2 && (
              <Col md="6">
                <Label
                  className="form-control-label"
                  htmlFor="example-date-input"
                >
                  Rent
                </Label>
                <Input
                  id="example-date-input"
                  type="number"
                  placeholder="Rent"
                  onChange={handleChange("rent")}
                  value={allocationData.rent}
                  required
                />
              </Col>
            )}
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
                Allocate Book
              </Button>
            </Col>
          </Row>
        </Form>
      )}
    </>
  );
};

export default StudentAllocation;
