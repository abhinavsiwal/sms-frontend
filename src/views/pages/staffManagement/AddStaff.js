import React, { useEffect, useState } from "react";
import Camera from "react-html5-camera-photo";
import Pincode from "react-pincode";
//import reactstrap
import {
  Card,
  CardHeader,
  CardBody,
  Label,
  FormGroup,
  Input,
  Container,
  Row,
  Col,
  Button,
  Form,
  FormFeedback,
} from "reactstrap";
import Loader from "components/Loader/Loader";
import TextArea from "antd/lib/input/TextArea";
import DatePicker from "react-datepicker";
import axios from "axios";

// core components
import SimpleHeader from "components/Headers/SimpleHeader.js";

import { Stepper, Step } from "react-form-stepper";

import Select from "react-select";
import { Country, State, City } from "country-state-city";

//import CSS file here
import "./style.css";

import { ToastContainer, toast } from "react-toastify";

// import { isAuthenticated } from "api/auth";
import { addStaff } from "api/staff";
import { isAuthenticated } from "api/auth";
import { getDepartment } from "api/department";
import { allSubjects } from "api/subjects";
import { getAllRoles } from "api/rolesAndPermission";
import { addStudentError } from "constants/errors";
import { fetchingSubjectError } from "constants/errors";
import { fetchingDepartmentError } from "constants/errors";
import { allSessions } from "api/session";

import FixRequiredSelect from "../../../components/FixRequiredSelect";
import BaseSelect from "react-select";

import { useHistory } from "react-router-dom";
import {
  CountryDropdown,
  RegionDropdown,
  CountryRegionData,
} from "react-country-region-selector";

function AddStaff() {
  const [step, setStep] = useState(0);
  const { user } = isAuthenticated();
  const [loading, setloading] = useState(false);
  const [staffData, setStaffData] = useState({
    photo: "",
    firstname: "",
    lastname: "",
    email: "",
    phone: "",
    session: "",
    alternate_phone: "",
    date_of_birth: "",
    gender: "",
    birth_place: "",
    caste: "",
    religion: "",
    mother_tongue: "",
    session: "",
    bloodgroup: "",
    joining_date: "",
    present_address: "",
    permanent_address: "",
    state: "",
    city: "",
    country: "",
    pincode: "",
    contact_person_name: "",
    contact_person_relation: "",
    contact_person_phone: "",
    contact_person_address: "",
    contact_person_state: "",
    contact_person_city: "",
    contact_person_country: "",
    contact_person_pincode: "",
    assign_role: "",
    assign_role_name: "",
    job: "",
    salary: "",
    qualification: "",
    department: "",
    subject: "",
    job_description: "",
  });
  const history = useHistory();
  const [allRoles, setAllRoles] = useState([]);
  // console.log("staff", staffData);
  const [sessions, setSessions] = useState([]);
  const [selectSessionId, setSelectSessionId] = useState("");
  const [formData] = useState(new FormData());
  const [departments, setDeparments] = useState([]);
  const [a, setA] = useState([]);
  const [file, setFile] = useState();
  const fileReader = new FileReader();
  const [country, setCountry] = useState("India");
  const [contactCountry, setContactCountry] = useState("India");
  const [state, setState] = useState("");
  const [contactState, setContactState] = useState("");
  const [city, setCity] = useState("");
  const [contactCity, setContactCity] = useState("");
  const [phoneError, setPhoneError] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [altPhoneError, setAltPhoneError] = useState(false);
  const [pincodeError, setPincodeError] = useState(false);
  const [subjectData, setSubjectData] = useState();
  const [contactPhoneError, setContactPhoneError] = useState(false);
  const [camera, setCamera] = useState(false);
  const [pincode, setPincode] = useState("");
  const [contactPincode, setContactPincode] = useState("");
  const [contactPincodeError, setContactPincodeError] = useState(false);
  const [image, setImage] = useState();
  const [capturePhoto, setCapturePhoto] = useState(false);
  const [dateOfJoining, setDateOfJoining] = useState();
  const [dateOfBirth, setDateOfBirth] = useState();
  const [imagesPreview, setImagesPreview] = useState();

  useEffect(() => {
    getAllRolesHandler();
    getSession();
  }, []);

  const getAllRolesHandler = async () => {
    // console.log(user);
    try {
      const data = await getAllRoles(user._id, user.school);
      // console.log(data);
      setAllRoles(data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleChange = (name) => (event) => {
    formData.set(name, event.target.value);
    setStaffData({ ...staffData, [name]: event.target.value });
  };
  const handleChange2 = (name) => (event) => {
    var data = JSON.parse(event.target.value);
    formData.set(name, data._id);
    setStaffData({
      ...staffData,
      [name]: data._id,
      assign_role_name: data.name,
    });
  };

  const handleFileChange = (name) => (event) => {
    formData.set(name, event.target.files[0]);
    // console.log(event.target.files[0]);
    setStaffData({ ...staffData, [name]: event.target.files[0] });
    setImage(event.target.files[0]);
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.readyState === 2) {
        setImagesPreview(reader.result);
      }
    };
    reader.readAsDataURL(event.target.files[0]);
  };

  //react-select
  const handleSubjectChange = (e) => {
    var value = [];
    // console.log("val", value);
    for (var i = 0, l = e.length; i < l; i++) {
      value.push(e[i].value);
    }
    // formData.set("subject", JSON.stringify(value));
    setSubjectData(value);
  };

  // handle Country state city data change
  const handleCSCChange = (name) => (event) => {
    if (name === "country") {
      setCscd({ ...cscd, country: event, state: null, city: null });
    } else if (name === "state") {
      setCscd({ ...cscd, state: event, city: null });
    } else {
      setCscd({ ...cscd, city: event });
    }
    setStaffData({ ...staffData, [name]: event.name });
    formData.set(name, event.name);
    setStaffData({ ...staffData, [name]: event.name });
  };

  // handle contact person Country state city data change
  const handlecpCSCChange = (name) => (event) => {
    if (name === "contact_person_country") {
      setcpCscd({
        ...cpcscd,
        contact_person_country: event,
        contact_person_state: null,
        contact_person_city: null,
      });
    } else if (name === "contact_person_state") {
      setcpCscd({
        ...cpcscd,
        contact_person_state: event,
        contact_person_city: null,
      });
    } else {
      setcpCscd({ ...cpcscd, contact_person_city: event });
    }
    setStaffData({ ...staffData, [name]: event.name });
    formData.set(name, event.name);
    setStaffData({ ...staffData, [name]: event.name });
  };

  // Stepper next step change
  const handleFormChange = (e) => {
    e.preventDefault();
    setStep((step) => {
      return step + 1;
    });
    window.scrollTo(0, 0);
  };

  //Submiting Form Data
  const handleSubmitForm = async (e) => {
    e.preventDefault();
    const { user, token } = isAuthenticated();
    formData.set("school", user.school);
    formData.set("country", country);
    formData.set("state", state);
    formData.set("contact_person_country", contactCountry);
    formData.set("contact_person_state", contactState);
    formData.set("date_of_birth", dateOfBirth);
    formData.set("joining_date", dateOfJoining);

    if (subjectData) {
      formData.set("subject", JSON.stringify(subjectData));
    }
    formData.set("city", city);
    formData.set("contact_person_city", contactCity);
    formData.set("pincode", pincode);
    formData.set("contact_person_pincode", contactPincode);
    try {
      setloading(true);
      const resp = await addStaff(user._id, token, formData);
      if (resp.err) {
        setloading(false);
        return toast.error(resp.err);
      } else {
        toast.success("Staff Added successfully");
        history.push("/admin/all-staffs");
      }
      setloading(false);
    } catch (err) {
      toast.error(addStudentError);
      setloading(false);
    }
  };

  // Country state city data
  const [cscd, setCscd] = useState({
    country: "",
    state: "",
    city: "",
  });

  // contact person country state city data
  const [cpcscd, setcpCscd] = useState({
    contact_person_country: "",
    contact_person_state: "",
    contact_person_city: "",
  });

  const countries = Country.getAllCountries();

  const updatedCountries = countries.map((country) => ({
    label: country.name,
    value: country.isoCode,
    ...country,
  }));
  const updatedStates = (countryId) =>
    State.getStatesOfCountry(countryId).map((state) => ({
      label: state.name,
      value: state.isoCode,
      ...state,
    }));
  const updatedCities = (countryId, stateId) =>
    City.getCitiesOfState(countryId, stateId).map((city) => ({
      label: city.name,
      value: city.stateCode,
      ...city,
    }));

  useEffect(() => {}, [cscd, cpcscd]);

  //Get Subject data
  useEffect(async () => {
    if (step === 3) {
      await Departments();
      const { user, token } = isAuthenticated();
      try {
        const Subjects = await allSubjects(user._id, user.school, token);
        // console.log("sub", Subjects);
        var list = [];
        // console.log("subject", Subjects);
        Subjects.map(async (sub) => {
          list.push({
            value: sub._id,
            label: sub.name,
          });
        });
        if (Subjects.err) {
          return toast.error(fetchingSubjectError);
        }
        setA(list);
      } catch (err) {
        toast.error("Something Went Wrong!");
      }
    }
  }, [step]);

  //Get deparment data
  async function Departments() {
    const { user, token } = isAuthenticated();
    try {
      const dept = await getDepartment(user.school, user._id, token);
      if (dept.err) {
        return toast.error(dept.err);
      }
      // console.log("dept", dept);
      setDeparments(dept);
    } catch (err) {
      toast.error(fetchingDepartmentError);
      console.log(err);
    }
  }

  //Getting Session data
  const getSession = async () => {
    const { user, token } = isAuthenticated();
    try {
      const session = await allSessions(user._id, user.school, token);
      if (session.err) {
        return toast.error(session.err);
      } else {
        setSessions(session);
      }
    } catch (err) {
      toast.error("Something Went Wrong!");
    }
  };

  const handleOnChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleOnSubmit = (e) => {
    e.preventDefault();

    if (file) {
      fileReader.onload = function (event) {
        const csvOutput = event.target.result;
      };

      fileReader.readAsText(file);
    }
  };

  // const Select = (props) => (
  //   <FixRequiredSelect
  //     {...props}
  //     SelectComponent={BaseSelect}
  //     options={props.options}
  //   />
  // );

  const cancelHandler = () => {
    setStaffData({
      photo: "",
      firstname: "",
      lastname: "",
      email: "",
      phone: "",
      session: "",
      alternate_phone: "",
      date_of_birth: "",
      gender: "",
      birth_place: "",
      caste: "",
      religion: "",
      mother_tongue: "",
      session: "",
      bloodgroup: "",
      joining_date: "",
      present_address: "",
      permanent_address: "",
      state: "",
      city: "",
      country: "",
      pincode: "",
      contact_person_name: "",
      contact_person_relation: "",
      contact_person_phone: "",
      contact_person_address: "",
      contact_person_state: "",
      contact_person_city: "",
      contact_person_country: "",
      contact_person_pincode: "",
      assign_role: "",
      assign_role_name: "",
      job: "",
      salary: "",
      qualification: "",
      department: "",
      subject: "",
      job_description: "",
    });
    setStep(0);
  };

  const phoneBlurHandler = () => {
    console.log("here");
    console.log(staffData.phone);
    let regex = /^[5-9]{2}[0-9]{8}$/;
    if (regex.test(staffData.phone)) {
      setPhoneError(false);
    } else {
      setPhoneError(true);
    }
  };
  const altPhoneBlurHandler = () => {
    let regex = /^[5-9]{2}[0-9]{8}$/;
    if (regex.test(staffData.alternate_phone)) {
      setAltPhoneError(false);
    } else {
      setAltPhoneError(true);
    }
  };
  const emailBlurHandler = () => {
    let regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (regex.test(staffData.email)) {
      setEmailError(false);
    } else {
      setEmailError(true);
    }
  };
  const handlecamera = (data) => {
    setCapturePhoto(true);
    formData.set("capture", data);
    setCamera(false);
  };
  const pincodeBlurHandler = () => {
    let regex = /^[1-9][0-9]{5}$/;
    if (pincode.length===6) {
      console.log("herre");
      setPincodeError(false);
    } else {
      console.log("herrsadasdadse");
      setPincodeError(true);
    }
  };
  const contactPincodeBlurHandler = () => {
    let regex = /^[1-9][0-9]{5}$/;
    if (regex.test(contactPincode)) {
      setContactPincodeError(false);
    } else {
      setContactPincodeError(true);
    }
  };
  const pincodeChangeHandler = async (e) => {
    setPincode(e.target.value);
    if (e.target.value.length === 6) {
      try {
        const { data } = await axios.get(
          `https://api.postalpincode.in/pincode/${e.target.value}`
        );
        console.log(data);
        setState(data[0].PostOffice[0].State);
        setCity(data[0].PostOffice[0].District);
      } catch (err) {
        console.log(err);
        toast.error("Failed to fetch pin code.");
      }
    }
  }; 
  const contactPincodeChangeHandler = async (e) => {
    setContactPincode(e.target.value);
    if (e.target.value.length === 6) {
      try {
        const { data } = await axios.get(
          `https://api.postalpincode.in/pincode/${e.target.value}`
        );
        console.log(data);
        setContactState(data[0].PostOffice[0].State);
        setContactCity(data[0].PostOffice[0].District);
      } catch (err) {
        console.log(err);
        toast.error("Failed to fetch pin code.");
      }
    }
  };

  return (
    <>
      <SimpleHeader name="Add Staff" parentName="Staff Management" />
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
        {!loading ? (
          <Card className="mb-4 bg-transparent">
            <CardHeader className="Step_Header">
              <Row>
                <Col className="d-flex justify-content-center">
                  <form>
                    <input
                      type={"file"}
                      id={"csvFileInput"}
                      accept={".csv"}
                      onChange={handleOnChange}
                    />

                    <Button
                      onClick={(e) => {
                        handleOnSubmit(e);
                      }}
                      color="primary"
                    >
                      IMPORT CSV
                    </Button>
                  </form>
                </Col>
              </Row>
              <Row className="d-flex justify-content-center">
                <Col md="10">
                  <Stepper
                    activeStep={step}
                    styleConfig={{
                      activeBgColor: "#e56813",
                      completedBgColor: "#1cdc23",
                      size: "3em",
                    }}
                  >
                    <Step label="Staff Member Details" />
                    <Step label="Residential Details" />
                    <Step label="Contact Details" />
                    <Step label="Occupational Details" />
                  </Stepper>
                </Col>
              </Row>
            </CardHeader>
            {step === 0 && (
              <Form onSubmit={handleFormChange} className="mb-4">
                <CardBody>
                 
                  <Row md="4" className="d-flex mb-4">
                    <Col>
                      <img
                        src={imagesPreview && imagesPreview}
                        alt="Preview"
                        className="mt-3 me-2"
                        width="80"
                        height="80"
                      />
                    </Col>
                    <Col md="6" style={{ zIndex: "1" }}>
                      <label
                        className="form-control-label"
                        htmlFor="example3cols2Input"
                      >
                        Upload Image
                      </label>
                      <div className="custom-file">
                        <input
                          className="custom-file-input"
                          id="customFileLang"
                          lang="en"
                          type="file"
                          onChange={handleFileChange("photo")}
                          accept="image/*"
                          // value={staffData.photo.name}
                        />
                        <label
                          className="custom-file-label"
                          htmlFor="customFileLang"
                        >
                          Select file
                        </label>
                      </div>
                    </Col>
                    <Col>
                      <label
                        className="form-control-label"
                        htmlFor="example3cols2Input"
                      >
                        Capture Now
                      </label>
                      <div className="custom-file">
                        <Button
                          color="primary"
                          className="custom-file-input"
                          type="button"
                          key={"edit" + 1}
                          id="capture_div"
                          onClick={() => setCamera(true)}
                        >
                          <i className="fas fa-camera" />
                        </Button>
                      </div>
                    </Col>
                  </Row>
                  {camera && (
                    <Camera
                      className="camera_div"
                      onTakePhoto={(dataUri) => {
                        handlecamera(dataUri);
                      }}
                    />
                  )}
                  <Row>
                    <Col>
                      <label
                        className="form-control-label"
                        htmlFor="example4cols2Input"
                      >
                        Session
                      </label>

                      <select
                        className="form-control"
                        required
                        onChange={handleChange("session")}
                        value={staffData.session}
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
                  <br />
                  <Row>
                    <Col md="4">
                      <Label
                        className="form-control-label"
                        htmlFor="example-date-input"
                      >
                        Date of Joining
                      </Label>
                      {/* <Input
                        id="example-date-input"
                        type="date"
                        onChange={handleChange("joining_date")}
                        value={staffData.joining_date}
                        required
                      /> */}
                      <DatePicker
                        dateFormat="dd/MM/yyyy"
                        placeholderText="dd/mm/yyyy"
                        onChange={(date) => setDateOfJoining(date)}
                        //  value={dateOfBirth}
                        selected={dateOfJoining}
                        required
                        className="datePicker"
                        showMonthDropdown
                        showYearDropdown
                        dropdownMode="select"
                      />
                    </Col>
                    <Col md="4">
                      <label
                        className="form-control-label"
                        htmlFor="example4cols2Input"
                      >
                        First Name
                      </label>
                      <Input
                        id="example4cols2Input"
                        placeholder="First Name"
                        type="text"
                        onChange={handleChange("firstname")}
                        value={staffData.firstname}
                        required
                      />
                    </Col>
                    <Col md="4">
                      <label
                        className="form-control-label"
                        htmlFor="example4cols3Input"
                      >
                        Last Name
                      </label>
                      <Input
                        id="example4cols3Input"
                        placeholder="Last Name"
                        type="text"
                        onChange={handleChange("lastname")}
                        value={staffData.lastname}
                        required
                      />
                    </Col>
                  </Row>
                  <br />
                  <Row>
                    <Col md="4">
                      <Label
                        cl
                        ssName="form-control-label"
                        htmlFor="example-date-input"
                      >
                        DOB
                      </Label>
                      <DatePicker
                        dateFormat="dd/MM/yyyy"
                        placeholderText="dd/mm/yyyy"
                        onChange={(date) => setDateOfBirth(date)}
                        //  value={dateOfBirth}
                        selected={dateOfBirth}
                        required
                        className="datePicker"
                        peekNextMonth
                        showMonthDropdown
                        showYearDropdown
                        dropdownMode="select"
                        // style={{width: "100%"}}
                      />
                      {/* <Input
                        id="example-date-input"
                        type="date"
                        onChange={handleChange("date_of_birth")}
                        value={staffData.date_of_birth}
                        required
                      /> */}
                    </Col>
                    <Col md="4">
                      <label
                        className="form-control-label"
                        htmlFor="exampleFormControlSelect3"
                      >
                        Gender
                      </label>
                      <Input
                        id="exampleFormControlSelect3"
                        type="select"
                        onChange={handleChange("gender")}
                        value={staffData.gender}
                        required
                      >
                        <option value="" disabled selected>
                          Gender
                        </option>
                        <option>Male</option>
                        <option>Female</option>
                      </Input>
                    </Col>
                    <Col md="4">
                      <label
                        className="form-control-label"
                        htmlFor="example4cols2Input"
                      >
                        Email
                      </label>
                      <Input
                        id="example4cols2Input"
                        placeholder="Email"
                        onChange={handleChange("email")}
                        value={staffData.email}
                        type="email"
                        required
                        pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$"
                        onBlur={emailBlurHandler}
                        invalid={emailError}
                      />
                      {emailError && (
                        <FormFeedback>Please Enter a valid Email</FormFeedback>
                      )}
                    </Col>
                  </Row>
                  <Row className="mt-4">
                    <Col md="4">
                      <label
                        className="form-control-label"
                        htmlFor="example4cols2Input"
                      >
                        Contact Number
                      </label>
                      <Input
                        id="example4cols2Input"
                        placeholder="Contact Number"
                        type="number"
                        onChange={handleChange("phone")}
                        pattern="[1-9]{1}[0-9]{9}"
                        value={staffData.phone}
                        required
                        // valid={!phoneError}
                        invalid={phoneError}
                        onBlur={phoneBlurHandler}
                      />
                      {phoneError && (
                        <FormFeedback>
                          Please Enter a valid phone no
                        </FormFeedback>
                      )}
                    </Col>
                    <Col md="4">
                      <label
                        className="form-control-label"
                        htmlFor="example4cols2Input"
                      >
                        Alternate Contact Number
                      </label>
                      <Input
                        id="example4cols2Input"
                        placeholder="Alternate Contact Number"
                        onChange={handleChange("alternate_phone")}
                        value={staffData.alternate_phone}
                        type="number"
                        pattern="[1-9]{1}[0-9]{9}"
                        required
                        onBlur={altPhoneBlurHandler}
                        invalid={altPhoneError}
                      />
                      {altPhoneError && (
                        <FormFeedback>
                          Please Enter a valid phone no
                        </FormFeedback>
                      )}
                    </Col>
                    <Col md="4">
                      <label
                        className="form-control-label"
                        htmlFor="exampleFormControlSelect3"
                      >
                        Blood Group
                      </label>
                      <Input
                        id="exampleFormControlSelect3"
                        type="select"
                        onChange={handleChange("bloodgroup")}
                        value={staffData.bloodgroup}
                        required
                      >
                        <option value="" disabled selected>
                          Blood Group
                        </option>
                        <option>A+</option>
                        <option>A-</option>
                        <option>B+</option>
                        <option>B-</option>
                        <option>O+</option>
                        <option>O-</option>
                        <option>AB+</option>
                        <option>AB-</option>
                      </Input>
                    </Col>
                  </Row>
                  <Row className="mt-4">
                    <Col md="3">
                      <label
                        className="form-control-label"
                        htmlFor="example4cols2Input"
                      >
                        Birth Place
                      </label>
                      <Input
                        id="example4cols2Input"
                        placeholder="Birth Place"
                        onChange={handleChange("birth_place")}
                        value={staffData.birth_place}
                        type="text"
                        required
                      />
                    </Col>
                    <Col md="3">
                      <label
                        className="form-control-label"
                        htmlFor="example4cols2Input"
                      >
                        Caste
                      </label>
                      <Input
                        id="example4cols2Input"
                        placeholder="Caste"
                        type="text"
                        onChange={handleChange("caste")}
                        value={staffData.caste}
                        required
                      />
                    </Col>
                    <Col md="3">
                      <label
                        className="form-control-label"
                        htmlFor="example4cols2Input"
                      >
                        Religion
                      </label>
                      <Input
                        id="example4cols2Input"
                        placeholder="Religion"
                        type="text"
                        onChange={handleChange("religion")}
                        value={staffData.religion}
                        required
                      />
                    </Col>
                    <Col md="3">
                      <label
                        className="form-control-label"
                        htmlFor="example4cols2Input"
                      >
                        Mother Tongue
                      </label>
                      <Input
                        id="example4cols2Input"
                        placeholder="Mother Tongue"
                        type="text"
                        onChange={handleChange("mother_tongue")}
                        value={staffData.mother_tongue}
                        required
                      />
                    </Col>
                  </Row>
                  <Row className="mt-4 float-right mr-4">
                    <Button color="danger" onClick={cancelHandler}>
                      Cancel
                    </Button>
                    <Button color="primary" type="submit">
                      Next
                    </Button>
                  </Row>
                </CardBody>
              </Form>
            )}
            {step === 1 && (
              <Form onSubmit={handleFormChange} className="mb-4">
                <CardBody>
                  <Row className="mb-4">
                    <Col>
                      <label
                        className="form-control-label"
                        htmlFor="example4cols2Input"
                      >
                        Present Address
                      </label>
                      <Input
                        id="example4cols2Input"
                        placeholder="Present Address"
                        type="text"
                        onChange={handleChange("present_address")}
                        value={staffData.present_address}
                        required
                      />
                    </Col>
                  </Row>
                  <Row className="mb-4">
                    <Col>
                      <label
                        className="form-control-label"
                        htmlFor="example4cols2Input"
                      >
                        Permanent Address
                      </label>
                      <Input
                        id="example4cols2Input"
                        placeholder="Permanent Address"
                        onChange={handleChange("permanent_address")}
                        value={staffData.permanent_address}
                        type="text"
                        required
                      />
                    </Col>
                  </Row>
                  <Row className="mt-4">
                    <Col md="3">
                      <label
                        className="form-control-label"
                        htmlFor="example4cols2Input"
                      >
                        Pin Code
                      </label>
                      <Input
                        id="example4cols2Input"
                        placeholder="Pin Code"
                        onChange={(e) => pincodeChangeHandler(e)}
                        value={pincode}
                        type="number"
                        required
                        onBlur={pincodeBlurHandler}
                      />
                      {pincodeError && (
                        <FormFeedback>
                          Please Enter a valid Pincode
                        </FormFeedback>
                      )}
                    </Col>
                    <Col md="3">
                      <label
                        className="form-control-label"
                        htmlFor="exampleFormControlSelect3"
                      >
                        Country
                      </label>
                      <Input
                        id="example4cols1Input"
                        placeholder="Country"
                        type="text"
                        onChange={(e) => setCountry(e.target.value)}
                        value={country}
                        required
                        disabled
                      />
                    </Col>
                    <Col md="3">
                      <label
                        className="form-control-label"
                        htmlFor="exampleFormControlSelect3"
                      >
                        State
                      </label>
                      <Input
                        id="example4cols1Input"
                        placeholder="Name"
                        type="text"
                        onChange={(e) => setState(e.target.value)}
                        value={state}
                        required
                        disabled
                      />
                    </Col>
                    <Col md="3">
                      <label
                        className="form-control-label"
                        htmlFor="exampleFormControlSelect3"
                      >
                        City
                      </label>
                      <Input
                        id="example4cols2Input"
                        placeholder="City"
                        type="text"
                        onChange={(e) => setCity(e.target.value)}
                        value={city}
                        required
                        disabled
                      />
                    </Col>
                  </Row>
                  <Row className="mt-4 d-flex justify-content-between">
                    <Button
                      className="ml-4"
                      color="primary"
                      type="button"
                      onClick={() => {
                        setStep((step) => {
                          return step - 1;
                        });
                        window.scrollTo(0, 0);
                      }}
                    >
                      Previous
                    </Button>
                    <div>
                      <Button color="danger" onClick={cancelHandler}>
                        Cancel
                      </Button>
                      <Button className="mr-4" color="primary" type="submit">
                        Next
                      </Button>
                    </div>
                  </Row>
                </CardBody>
              </Form>
            )}
            {step === 2 && (
              <Form onSubmit={handleFormChange} className="mb-4">
                <CardBody>
                  <Row>
                    <Col md="4">
                      <label
                        className="form-control-label"
                        htmlFor="example4cols1Input"
                      >
                        Contact Person Name
                      </label>
                      <Input
                        id="example4cols1Input"
                        placeholder="Name"
                        type="text"
                        onChange={handleChange("contact_person_name")}
                        value={staffData.contact_person_name}
                        required
                      />
                    </Col>
                    <Col md="4">
                      <label
                        className="form-control-label"
                        htmlFor="example4cols2Input"
                      >
                        Relation
                      </label>
                      <Input
                        id="example4cols2Input"
                        placeholder="Relation"
                        type="text"
                        onChange={handleChange("contact_person_relation")}
                        value={staffData.contact_person_relation}
                        required
                      />
                    </Col>
                    <Col md="4">
                      <label
                        className="form-control-label"
                        htmlFor="example4cols2Input"
                      >
                        Contact Number
                      </label>
                      <Input
                        id="example4cols3Input"
                        placeholder="Contact Number"
                        onChange={handleChange("contact_person_phone")}
                        value={staffData.contact_person_phone}
                        type="number"
                        pattern="[1-9]{1}[0-9]{9}"
                        required
                      />
                    </Col>
                  </Row>
                  <Row>
                    <Col md="8">
                      <label
                        className="form-control-label"
                        htmlFor="example4cols2Input"
                      >
                        Address
                      </label>
                      <Input
                        id="example4cols2Input"
                        placeholder="Address"
                        type="text"
                        onChange={handleChange("contact_person_address")}
                        value={staffData.contact_person_address}
                        required
                      />
                    </Col>
                    <Col md="4">
                      <label
                        className="form-control-label"
                        htmlFor="example4cols2Input"
                      >
                        Pin Number
                      </label>
                      <Input
                        id="example4cols2Input"
                        placeholder="Pin Number"
                        type="number"
                        onChange={(e) => contactPincodeChangeHandler(e)}
                        value={contactPincode}
                        required
                        onBlur={contactPincodeBlurHandler}
                      />
                      {contactPincodeError && (
                        <FormFeedback>
                          Please Enter a valid Pincode
                        </FormFeedback>
                      )}
                    </Col>
                  </Row>
                  <Row className="mt-4">
                    {/* Change variable here */}
                    <Col md="4">
                      <label
                        className="form-control-label"
                        htmlFor="exampleFormControlSelect3"
                      >
                        Country
                      </label>
                      <Input
                        id="example4cols1Input"
                        placeholder="Country"
                        type="text"
                        onChange={(e) => setContactCountry(e.target.value)}
                        value={contactCountry}
                        required
                        disabled
                      />
                    </Col>
                    <Col md="4">
                      <label
                        className="form-control-label"
                        htmlFor="exampleFormControlSelect3"
                      >
                        State
                      </label>
                      <Input
                        id="example4cols1Input"
                        placeholder="Name"
                        type="text"
                        onChange={(e) => setContactState(e.target.value)}
                        value={contactState}
                        required
                        disabled
                      />
                    </Col>
                    <Col md="4">
                      <label
                        className="form-control-label"
                        htmlFor="exampleFormControlSelect3"
                      >
                        City
                      </label>
                      <Input
                        id="example4cols2Input"
                        placeholder="City"
                        type="text"
                        onChange={(e) => setContactCity(e.target.value)}
                        value={contactCity}
                        disabled
                        required
                      />
                    </Col>
                  </Row>
                  <Row className="mt-4 d-flex justify-content-between">
                    <Button
                      className="ml-4"
                      color="primary"
                      type="button"
                      onClick={() => {
                        setStep((step) => {
                          return step - 1;
                        });
                        window.scrollTo(0, 0);
                      }}
                    >
                      Previous
                    </Button>
                    <div>
                      <Button color="danger" onClick={cancelHandler}>
                        Cancel
                      </Button>
                      <Button className="mr-4" color="primary" type="submit">
                        Next
                      </Button>
                    </div>
                  </Row>
                </CardBody>
              </Form>
            )}
            {step === 3 && (
              <Form onSubmit={handleSubmitForm} className="mb-4">
                <CardBody>
                  <Row>
                    <Col md="12">
                      <label
                        className="form-control-label"
                        htmlFor="example4cols2Input"
                      >
                        Department
                      </label>
                      <Input
                        id="exampleFormControlSelect3"
                        type="select"
                        onChange={handleChange("department")}
                        value={staffData.department}
                        required
                      >
                        <option value="" disabled selected>
                          Department
                        </option>
                        {departments.map((departments) => (
                          <option value={departments._id}>
                            {departments.name}
                          </option>
                        ))}
                      </Input>
                    </Col>
                  </Row>
                  {staffData.department && (
                    <Row className="mt-2 mb-2">
                      <Col md="6">
                        <>
                          <label
                            className="form-control-label"
                            htmlFor="example4cols2Input"
                          >
                            Role
                          </label>
                          <Input
                            id="exampleFormControlSelect3"
                            type="select"
                            onChange={handleChange2("assign_role")}
                            value={staffData.assign_role}
                            required
                          >
                            {staffData.assign_role_name !== "" ? (
                              <>
                                <option
                                  value={staffData.assign_role_name}
                                  selected
                                >
                                  {staffData.assign_role_name}
                                </option>
                                <hr />
                              </>
                            ) : (
                              <option value="" disabled selected>
                                Select Role
                              </option>
                            )}
                            {allRoles &&
                              allRoles.map((role) => {
                                return (
                                  <option
                                    key={role._id}
                                    value={JSON.stringify(role)}
                                  >
                                    {role.name}
                                  </option>
                                );
                              })}
                          </Input>
                        </>
                      </Col>

                      <Col md="6">
                        <label
                          className="form-control-label"
                          htmlFor="example4cols2Input"
                        >
                          Salary
                        </label>
                        <Input
                          id="example4cols2Input"
                          placeholder="Salary"
                          type="number"
                          onChange={handleChange("salary")}
                          value={staffData.salary}
                          required
                        />
                      </Col>
                    </Row>
                  )}
                  {staffData.assign_role_name === "Teacher" ? (
                    <Row>
                      <Col md="6">
                        <label
                          className="form-control-label"
                          htmlFor="example4cols2Input"
                        >
                          Subject
                        </label>

                        <Select
                          isMulti
                          name="colors"
                          options={a}
                          onChange={handleSubjectChange}
                          className="basic-multi-select"
                          classNamePrefix="select"
                          required
                          // value={subjectData}
                        />
                      </Col>
                      <Col md="6">
                        <label
                          className="form-control-label"
                          htmlFor="example4cols2Input"
                        >
                          Highest Qualification
                        </label>
                        <Input
                          id="example4cols2Input"
                          placeholder="Highest Qualification"
                          onChange={handleChange("qualification")}
                          value={staffData.qualification}
                          type="text"
                          required
                        />
                      </Col>
                    </Row>
                  ) : null}
                  {staffData.assign_role_name !== "" &&
                    staffData.assign_role_name !== "Teacher" && (
                      <Row>
                        <Col md="12">
                          <FormGroup>
                            <label
                              className="form-control-label"
                              htmlFor="example4cols3Input"
                            >
                              Job Name
                            </label>
                            <Input
                              id="example4cols3Input"
                              placeholder="Job Name"
                              type="text"
                              onChange={handleChange("job")}
                              value={staffData.job}
                              required
                            />
                          </FormGroup>
                        </Col>
                        <Col md="12">
                          <FormGroup>
                            <label
                              className="form-control-label"
                              htmlFor="example4cols3Input"
                            >
                              Job Description
                            </label>
                            <TextArea
                              id="example4cols3Input"
                              placeholder="Job Description"
                              type="text"
                              onChange={handleChange("job_description")}
                              value={staffData.job_description}
                              required
                            />
                          </FormGroup>
                        </Col>
                      </Row>
                    )}
                  <Row className="mt-4 d-flex justify-content-between">
                    <Button
                      className="ml-4"
                      color="primary"
                      type="button"
                      onClick={() => {
                        setStep((step) => {
                          return step - 1;
                        });
                        window.scrollTo(0, 0);
                      }}
                    >
                      Previous
                    </Button>
                    <div>
                      <Button color="danger" onClick={cancelHandler}>
                        Cancel
                      </Button>
                      {staffData.department && staffData.assign_role_name && (
                        <Button className="mr-4" color="success" type="submit">
                          Submit
                        </Button>
                      )}
                    </div>
                  </Row>
                </CardBody>
              </Form>
            )}
          </Card>
        ) : (
          <Loader />
        )}
      </Container>
    </>
  );
}

export default AddStaff;
