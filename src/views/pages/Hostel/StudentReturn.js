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
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./style.css";
import { allStudents, filterStudent } from "api/student";
import Loader from "components/Loader/Loader";
import { isAuthenticated } from "api/auth";
import { getAllBooks, returnBook } from "../../../api/libraryManagement";
import { allStaffs } from "api/staff";
import "./style.css";
import { toast, ToastContainer } from "react-toastify";
import { allClass } from "api/class";
import {
  getAllBuildingsList,
  getAllRooms,
  vacantRoom,
  allocatedRoomList,
} from "api/hostelManagement";
const StudentReturn = () => {
  const { user, token } = isAuthenticated();
  const [returnData, setReturnData] = useState({
    class: "",
    section: "",
    student: "",
    bookName: "",
    bookId: "",
    collectionDate: "",
    collectedBy: "",
    building: "",
  });
  const [loading, setLoading] = useState(false);
  const [returnDate, setReturnDate] = useState(new Date());
  const [classList, setClassList] = useState([]);
  const [selectedClass, setSelectedClass] = useState({});
  const [studentLoading, setStudentLoading] = useState(false);
  const [students, setStudents] = useState([]);
  const [allStaff, setAllStaff] = useState([]);
  const [allBooks, setAllBooks] = useState([]);
  const [selectedBook, setSelectedBook] = useState({});
  const [selectedStudent, setSelectedStudent] = useState({});
  const [allocattedRooms, setAllocattedRooms] = useState([]);
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
    getAllBuildingHandler();
    getAllStaffs();
  }, []);
  const handleChange = (name) => async (event) => {
    setReturnData({ ...returnData, [name]: event.target.value });
    console.log(name, event.target.value);
    if (name === "class") {
      // console.log("@@@@@@@@=>", event.target.value);
      // setSelectedClassId(event.target.value);
      if (event.target.value === "") {
        return;
      }
      let selectedClass = classList.find(
        (item) => item._id.toString() === event.target.value.toString()
      );
      // console.log(selectedClass);
      setSelectedClass(selectedClass);
    }
    if (name === "section") {
      filterStudentHandler(event.target.value);
    }
    if (name === "student") {
      console.log("student");
      if (event.target.value === "") {
        return;
      }
      let selectedStudent1 = students.find(
        (item) => item._id.toString() === event.target.value.toString()
        );
        console.log(selectedStudent1);
        setSelectedStudent(selectedStudent1);
        allocatedRoomsHandler(selectedStudent1);
    }
  };

  const allocatedRoomsHandler = async (student) => {
    const formData = new FormData();
    formData.set("building", returnData.building);
    formData.set("class", returnData.class);
    formData.set("section", returnData.section);
    formData.set("student", student._id);
    formData.set("role", student.SID.slice(3, 6));

    try {
      setLoading(true);
      const data = await allocatedRoomList(user._id,user.school,formData);
      console.log(data);
      setAllocattedRooms(data);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      console.log(err);
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

  const filterStudentHandler = async (id) => {
    const formData = {
      section: id,
      class: returnData.class,
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
    formData.set("building",returnData.building );
    formData.set("class", returnData.class);
    formData.set("section", returnData.section);
    formData.set("student", returnData.student);
    formData.set("school", user.school);
    formData.set("room_number",returnData.bookName)
    formData.set("vacantBy", returnData.collectedBy);
    formData.set("vacantDate", returnDate);
    
    try {
      setLoading(true);
      const data = await vacantRoom(user._id,user.school, formData);
      console.log(data);
      if (data.err) {
        setLoading(false);
        return toast.error(data.err);
      }
      setLoading(false);
      toast.success("Room vacant Successfully");
      setReturnData({
        class: "",
        section: "",
        student: "",
        bookName: "",
        bookId: "",
        collectionDate: "",
        collectedBy: "",
      });
    } catch (err) {
      console.log(err);
      toast.error("Room Vacant Failed");
      setLoading(false);
    }
  };

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <Form className="mt-3 " onSubmit={returnHandler}>
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
                value={returnData.class}
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
                value={returnData.section}
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
                Building
              </Label>
              <Input
                id="exampleFormControlSelect3"
                type="select"
                required
                value={returnData.building}
                onChange={handleChange("building")}
                name="building"
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
                value={returnData.student}
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
                Allocated Rooms
              </Label>
              <Input
                id="exampleFormControlSelect3"
                type="select"
                required
                value={returnData.bookName}
                onChange={handleChange("bookName")}
                name="section"
              >
                <option value="">Select Room</option>
                {allocattedRooms &&
                  allocattedRooms.map((book) => {
                    // console.log(book);
                    return (
                      <option
                        value={
                          book.room_number
                        }
                        key={book._id}
                      >
                        {book.room_number}
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
               Vacant Room
              </Button>
            </Col>
          </Row>
        </Form>
      )}
    </>
  );
};

export default StudentReturn;
