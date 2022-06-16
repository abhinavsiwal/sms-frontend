import React, { useEffect, useState } from "react";
import Camera from "react-html5-camera-photo";
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
// core components
import DatePicker from "react-datepicker";
import SimpleHeader from "components/Headers/SimpleHeader.js";
import axios from "axios";
import Loader from "components/Loader/Loader";
import { addStudent, isAuthenticateStudent } from "api/student";

import { Stepper, Step } from "react-form-stepper";
import { ToastContainer, toast } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";

import Select from "react-select";
import { Country, State, City } from "country-state-city";

import "./style.css";
import { isAuthenticated } from "api/auth";

import { useSelector } from "react-redux";

import { allSessions } from "api/session";

import { useHistory } from "react-router-dom";
import { allClass } from "api/class";
import { setClass } from "store/reducers/class";
import {
  CountryDropdown,
  RegionDropdown,
  CountryRegionData,
} from "react-country-region-selector";
import { useDispatch } from "react-redux";
function AddStudent() {
  const dispatch = useDispatch();
  // Stepper form steps
  const [step, setStep] = useState(0);
  const { classes } = useSelector((state) => state.classReducer);
  const history = useHistory();
  const [sessions, setSessions] = useState([]);
  const [multivalues, setMultiValues] = useState("");
  const [connectFalse, setConnectFalse] = useState(false);

  const [studentData, setStudentData] = useState({
    photo: "",
    joining_date: "",
    firstname: "",
    lastname: "",
    date_of_birth: "",
    gender: "",
    aadhar_number: "",
    email: "",
    phone: "",
    alternate_phone: "",
    birth_place: "",
    caste: "",
    religion: "",
    bloodgroup: "",
    class: "",
    section: "",
    session: "",
    roll_number: "",
    previous_school: "",
    present_address: "",
    permanent_address: "",
    pincode: "",
    parent_address: "",
    parent_email: "",
    connected: null,
    connectedID: "",
    country: "",
    state: "",
    city: "",
    nationality: "",
    mother_tongue: "",
    contact_person_select: "",
    guardian_name: "",
    guardian_last_name: "",
    guardian_dob: "",
    guardian_email: "",
    guardian_address: "",
    guardian_blood_group: "",
    guardian_phone: "",
    // guardian_address: "",
    // guardian_permanent_address: "",
    guardian_pincode: "",
    guardian_nationality: "",
    guardian_mother_tongue: "",
    father_name: "",
    father_last_name: "",
    father_dob: "",
    father_blood_group: "",
    father_phone: "",
    // father_address: "",
    // father_permanent_address: "",
    father_pincode: "",
    father_nationality: "",
    father_mother_tongue: "",
    mother_name: "",
    mother_last_name: "",
    mother_dob: "",
    mother_blood_group: "",
    mother_phone: "",
    // mother_address: "",
    // mother_permanent_address: "",
    mother_pincode: "",
    mother_nationality: "",
    mother_mother_tongue: "",
  });
  const [loading, setLoading] = useState(false);

  const [country, setCountry] = useState("India");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  // console.log("studentData", studentData);
  const [selectedClass, setSelectedClass] = useState({});
  const [phoneError, setPhoneError] = useState(false);
  const [altPhoneError, setAltPhoneError] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [parentEmailError, setParentEmailError] = useState(false);
  const [guardianEmailError, setGuardianEmailError] = useState(false);
  const [guardianPhoneError, setGuardianPhoneError] = useState(false);
  const [guardianPincodeError, setGuardianPincodeError] = useState(false);
  const [motherPincodeError, setMotherPincodeError] = useState(false);
  const [fatherPincodeError, setFatherPincodeError] = useState(false);
  const [fatherPhoneError, setFatherPhoneError] = useState(false);
  const [motherPhoneError, setMotherPhoneError] = useState(false);
  const [aadharError, setAadharError] = useState(false);
  const [camera, setCamera] = useState(false);
  const [image, setImage] = useState();
  const [capturePhoto, setCapturePhoto] = useState(false);
  const [dateOfJoining, setDateOfJoining] = useState();
  const [dateOfBirth, setDateOfBirth] = useState();
  const [guardianDOB, setGuardianDOB] = useState();
  const [fatherDOB, setFatherDOB] = useState();
  const [motherDOB, setMotherDOB] = useState();
  const [pincode, setPincode] = useState("");
  const [pincodeError, setPincodeError] = useState(false);
  const { user, token } = isAuthenticated();
  const [imagesPreview, setImagesPreview] = useState();
  const [disableButton, setDisableButton] = useState(true);
  useEffect(() => {
    getAllClasses();
  }, []);

  const getAllClasses = async () => {
    try {
      const res = await allClass(user._id, user.school, token);

      // console.log("allClass", res);
      dispatch(setClass(res));

      // setClassList(data);
    } catch (err) {
      console.log(err);
      toast.error("Fetching Classes failed");
    }
  };

  const phoneBlurHandler = () => {
    console.log("here");
    // console.log(studentData.phone);
    let regex = /^[5-9]{2}[0-9]{8}$/;
    if (regex.test(studentData.phone)) {
      setPhoneError(false);
      setDisableButton(false);
    } else {
      setPhoneError(true);
      setDisableButton(true);
    }
  };
  const altPhoneBlurHandler = () => {
    let regex = /^[5-9]{2}[0-9]{8}$/;
    if (regex.test(studentData.alternate_phone)) {
      setAltPhoneError(false);
      setDisableButton(false);
    } else {
      setAltPhoneError(true);
      setDisableButton(true);
    }
  };
  const emailBlurHandler = () => {
    let regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (regex.test(studentData.email)) {
      setEmailError(false);
      setDisableButton(false);
    } else {
      setEmailError(true);
      setDisableButton(true);
    }
  };
  const parentEmailBlurHandler = async () => {
    let regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (regex.test(studentData.parent_email)) {
      setParentEmailError(false);
      setDisableButton(false);
    } else {
      setDisableButton(true);
      return setParentEmailError(true);
    }

    const data = {
      type: multivalues,
      email:
        multivalues === "parent"
          ? studentData.parent_email
          : studentData.guardian_email,
    };
    try {
      const authenticate = await isAuthenticateStudent(user._id, token, data);
      // console.log("auth", authenticate);
      if (authenticate.err) {
        toast.error(authenticate.err);
      }
      if (authenticate.status === false) {
        toast.success("Email verified");
      } else {
        setConnectFalse(true);
        studentData.connectedID = authenticate.id;
        toast.success("You Can Connect the Student ");
      }
    } catch (err) {
      toast.error(err);
    }
  };
  const guardianEmailBlurHandler = async () => {
    let regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (regex.test(studentData.guardian_email)) {
      setGuardianEmailError(false);
      setDisableButton(false);
    } else {
      setDisableButton(true);
      return setGuardianEmailError(true);
    }
    const data = {
      type: multivalues,
      email:
        multivalues === "parent"
          ? studentData.parent_email
          : studentData.guardian_email,
    };
    try {
      const authenticate = await isAuthenticateStudent(user._id, token, data);
      // console.log("auth", authenticate);
      if (authenticate.err) {
        toast.error(authenticate.err);
      }
      if (authenticate.status === false) {
        toast.success("Email verified");
      } else {
        setConnectFalse(true);
        studentData.connectedID = authenticate.id;
        toast.success("You Can Connect the Student ");
      }
    } catch (err) {
      toast.error(err);
    }
  };

  const guardianPhoneBlurHandler = () => {
    let regex = /^[5-9]{1}[0-9]{9}$/;
    if (regex.test(studentData.guardian_phone)) {
      setGuardianPhoneError(false);
      setDisableButton(false);
    } else {
      setDisableButton(true);
      setGuardianPhoneError(true);
    }
  };

  const fatherPhoneBlurHandler = () => {
    let regex = /^[5-9]{1}[0-9]{9}$/;
    if (regex.test(studentData.father_phone)) {
      setFatherPhoneError(false);
      setDisableButton(false);
    } else {
      setFatherPhoneError(true);
      setDisableButton(true);
    }
  };

  const motherPhoneBlurHandler = () => {
    let regex = /^[5-9]{2}[0-9]{8}$/;
    if (regex.test(studentData.mother_phone)) {
      setMotherPhoneError(false);
      setDisableButton(false);
    } else {
      setMotherPhoneError(true);
      setDisableButton(true);
    }
  };

  const aadharBlurHandler = () => {
    let regex = /^[0-9]{12}$/;
    if (regex.test(studentData.aadhar_number)) {
      setAadharError(false);
      setDisableButton(false);
    } else {
      setAadharError(true);
      setDisableButton(true);
    }
  };
  //Checking Parent or Gaurdian Email is Exist or Not
  const checkEmail = async () => {
    const data = {
      type: multivalues,
      email:
        multivalues === "parent"
          ? studentData.parent_email
          : studentData.guardian_email,
    };
    try {
      const authenticate = await isAuthenticateStudent(user._id, token, data);
      // console.log("auth", authenticate);
      if (authenticate.err) {
        toast.error(authenticate.err);
      }
      if (authenticate.status === false) {
        toast.sucess("Email verified");
      } else {
        setConnectFalse(true);
        studentData.connectedID = authenticate.id;
        toast.success("You Can Connect the Student ");
      }
    } catch (err) {
      toast.error(err);
    }
  };

  const [formData] = useState(new FormData());

  const [file, setFile] = useState();

  const fileReader = new FileReader();

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

  React.useEffect(() => {
    getSession();
  }, []);

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

  //Taking StudentData
  const handleChange = (name) => (event) => {
    formData.set(name, event.target.value);
    setStudentData({ ...studentData, [name]: event.target.value });
    // console.log(name);
    if (name === "class") {
      // console.log("@@@@@@@@=>", event.target.value);
      // setSelectedClassId(event.target.value);
      let selectedClass = classes.find(
        (item) => item._id.toString() === event.target.value.toString()
      );
      // console.log(selectedClass);
      setSelectedClass(selectedClass);
    }
  };

  //Taking Image Value
  const handleFileChange = (name) => (event) => {
    formData.set(name, event.target.files[0]);
    // console.log("aa", event.target.files[0]);
    setStudentData({ ...studentData, [name]: event.target.files[0] });
    setImage(event.target.files[0]);
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.readyState === 2) {
        setImagesPreview(reader.result);
      }
    };
    reader.readAsDataURL(event.target.files[0]);
  };

  //Delete Fields
  const handleDeleteFields = (name) => {
    setStudentData({ ...studentData, [name]: "" });
    formData.delete(name);
  };
  //Delete Fields Define
  const removeFields = (e) => {
    setMultiValues(e.value);
    if (e.value === "guardian") {
      // all parent fields must be deleted
      handleDeleteFields("father_name");
      handleDeleteFields("father_last_name");
      handleDeleteFields("father_dob");
      handleDeleteFields("father_blood_group");
      handleDeleteFields("father_phone");
      handleDeleteFields("father_address");
      handleDeleteFields("father_permanent_address");
      handleDeleteFields("father_pincode");
      handleDeleteFields("father_nationality");
      handleDeleteFields("father_mother_tongue");
      handleDeleteFields("mother_name");
      handleDeleteFields("mother_last_name");
      handleDeleteFields("mother_dob");
      handleDeleteFields("mother_blood_group");
      handleDeleteFields("mother_phone");
      handleDeleteFields("mother_address");
      handleDeleteFields("mother_permanent_address");
      handleDeleteFields("mother_pincode");
      handleDeleteFields("mother_nationality");
      handleDeleteFields("mother_mother_tongue");
    } else if (e.value === "parent") {
      // all guardian fields must be deleted
      handleDeleteFields("guardian_name");
      handleDeleteFields("guardian_last_name");
      handleDeleteFields("guardian_dob");
      handleDeleteFields("guardian_blood_group");
      handleDeleteFields("guardian_phone");
      handleDeleteFields("guardian_address");
      handleDeleteFields("guardian_permanent_address");
      handleDeleteFields("guardian_pincode");
      handleDeleteFields("guardian_nationality");
      handleDeleteFields("guardian_mother_tongue");
    }
    setStudentData({ ...studentData, contact_person_select: e });
  };

  // handling city state country change
  const handleCSCChange = (name) => (event) => {
    if (name === "country") {
      setCscd({ ...cscd, country: event, state: null, city: null });
    } else if (name === "state") {
      setCscd({ ...cscd, state: event, city: null });
    } else {
      setCscd({ ...cscd, city: event });
    }
    setStudentData({ ...studentData, [name]: event.name });
    formData.set(name, event.name);
    setStudentData({ ...studentData, [name]: event.name });
  };

  // Stepper next step change
  const handleFormChange = (e) => {
    e.preventDefault();
    setStep((step) => {
      return step + 1;
    });
    window.scrollTo(0, 0);
  };

  //Final Form Submit
  const handleSubmitForm = async (e) => {
    e.preventDefault();
    console.log(studentData);
    const { user, token } = isAuthenticated();
    formData.set("school", user.school);
    formData.set("country", country);
    formData.set("state", state);
    formData.set("pincode", pincode);
    formData.set("city", city);
    formData.set("date_of_birth", dateOfBirth);
    formData.set("joining_date", dateOfJoining);
    if (guardianDOB) {
      formData.set("guardian_dob", guardianDOB);
    } else if (fatherDOB) {
      formData.set("father_dob", fatherDOB);
      formData.set("mother_dob", motherDOB);
    }

    try {
      setLoading(true);

      const addStudents = await addStudent(user._id, token, formData);
      // console.log("addStudent", addStudents);
      if (addStudents.err) {
        setLoading(false);
        return toast.error(addStudents.err);
      } else {
        toast.success("Student added successfully");
        setLoading(false);
        
        history.push("/admin/all-students");
      }
    } catch (err) {
      setLoading(false);
      toast.error("Something Went Wrong");
    }
  };

  //React-Multiselect
  const contactPersonsSelect = [
    {
      label: "Guardian",
      value: "guardian",
    },
    {
      label: "Parent",
      value: "parent",
    },
  ];

  // Country state city data
  const [cscd, setCscd] = useState({
    country: "",
    state: "",
    city: "",
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

  const handlecamera = (data) => {
    setCapturePhoto(true);
    formData.set("capture", data);
    setCamera(false);
  };

  const cancelHandler = () => {
    setStep(0);
    setStudentData({
      photo: "",
      joining_date: "",
      firstname: "",
      lastname: "",
      date_of_birth: "",
      gender: "",
      aadhar_number: "",
      email: "",
      phone: "",
      alternate_phone: "",
      birth_place: "",
      caste: "",
      religion: "",
      bloodgroup: "",
      class: "",
      section: "",
      session: "",
      roll_number: "",
      previous_school: "",
      present_address: "",
      permanent_address: "",
      pincode: "",
      parent_address: "",
      parent_email: "",
      connected: null,
      connectedID: "",
      country: "",
      state: "",
      city: "",
      nationality: "",
      mother_tongue: "",
      contact_person_select: "",
      guardian_name: "",
      guardian_last_name: "",
      guardian_dob: "",
      guardian_email: "",
      guardian_address: "",
      guardian_blood_group: "",
      guardian_phone: "",
      // guardian_address: "",
      // guardian_permanent_address: "",
      guardian_pincode: "",
      guardian_nationality: "",
      guardian_mother_tongue: "",
      father_name: "",
      father_last_name: "",
      father_dob: "",
      father_blood_group: "",
      father_phone: "",
      // father_address: "",
      // father_permanent_address: "",
      father_pincode: "",
      father_nationality: "",
      father_mother_tongue: "",
      mother_name: "",
      mother_last_name: "",
      mother_dob: "",
      mother_blood_group: "",
      mother_phone: "",
      // mother_address: "",
      // mother_permanent_address: "",
      mother_pincode: "",
      mother_nationality: "",
      mother_mother_tongue: "",
    });
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

  const pincodeBlurHandler = () => {
    let regex = /^[1-9][0-9]{5}$/;
    if (pincode.length===6) {
      console.log("herre");
      setPincodeError(false);
      setDisableButton(false);
    } else {
      console.log("herrsadasdadse");
      setPincodeError(true);
      setDisableButton(true);
    }
  };
  const guardianPincodeBlurHandler = () => {
    let regex = /^[1-9][0-9]{5}$/;
    if (studentData.guardian_pincode.length===6) {
      console.log("herre");
      setGuardianPincodeError(false);
      setDisableButton(false);
    } else {
      console.log("herrsadasdadse");
      setGuardianPincodeError(true);
      setDisableButton(true);
    }
  };
  const fatherPincodeBlurHandler = () => {
    let regex = /^[1-9][0-9]{5}$/;
    if (studentData.father_pincode.length===6) {
      console.log("herre");
      setFatherPincodeError(false);
      setDisableButton(false);
    } else {
      console.log("herrsadasdadse");
      setFatherPincodeError(true);
      setDisableButton(true);
    }
  };
  const motherPincodeBlurHandler = () => {
    let regex = /^[1-9][0-9]{5}$/;
    if (studentData.mother_pincode.length===6) {
      console.log("herre");
      setMotherPincodeError(false);
      setDisableButton(false);
    } else {
      console.log("herrsadasdadse");
      setMotherPincodeError(true);
      setDisableButton(true);
    }
  };
  useEffect(() => {}, [cscd]);
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
          <Card className="mb-4 bg-transparent">
            <CardHeader className="Step_Header">
              <Row>
                <Col className="d-flex justify-content-center mt-2">
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
                    <Step label="Student Details" />
                    <Step label="Admission Details" />
                    <Step label="Address Details" />
                    <Step label="Contact Person Details" />
                  </Stepper>
                </Col>
              </Row>
            </CardHeader>
            {step === 0 && (
              <Form onSubmit={handleFormChange} className="mb-4">
                <CardBody>
                 
                  <Row md="4" className="d-flex justify-content-center mb-4">
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
                          accept="image/*"
                          onChange={handleFileChange("photo")}
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
                        value={studentData.session}
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
                      <DatePicker
                        dateFormat="dd/MM/yyyy"
                        placeholderText="dd/mm/yyyy"
                        onChange={(date) => setDateOfJoining(date)}
                        //  value={dateOfBirth}
                        selected={dateOfJoining}
                        required
                        showMonthDropdown
                        showYearDropdown
                        dropdownMode="select"
                        className="datePicker"
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
                        value={studentData.firstname}
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
                        value={studentData.lastname}
                        required
                      />
                    </Col>
                  </Row>
                  <br />
                  <Row>
                    <Col md="4">
                      <Label
                        className="form-control-label"
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
                        showMonthDropdown
                        showYearDropdown
                        dropdownMode="select"
                        // style={{width: "100%"}}
                      />
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
                        required
                        value={studentData.gender}
                      >
                        <option value="" disabled>
                          Select Gender
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
                        Aadhar Card Number
                      </label>
                      <Input
                        id="example4cols2Input"
                        placeholder="Aadhar Card Number"
                        type="number"
                        onChange={handleChange("aadhar_number")}
                        pattern="[0-9]{1,12}"
                        value={studentData.aadhar_number}
                        required
                        onBlur={aadharBlurHandler}
                        invalid={aadharError}
                      />
                      {aadharError && (
                        <FormFeedback>
                          Please Enter a valid Aadhar Card no
                        </FormFeedback>
                      )}
                    </Col>
                  </Row>
                  <Row className="mt-4">
                    <Col>
                      <label
                        className="form-control-label"
                        htmlFor="example4cols2Input"
                      >
                        Email
                      </label>
                      <Input
                        id="example4cols2Input"
                        placeholder="Email"
                        type="text"
                        onChange={handleChange("email")}
                        required
                        value={studentData.email}
                        pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$"
                        onBlur={emailBlurHandler}
                        invalid={emailError}
                      />
                      {emailError && (
                        <FormFeedback>Please Enter a valid Email</FormFeedback>
                      )}
                    </Col>
                    <Col>
                      <label
                        className="form-control-label"
                        htmlFor="example4cols2Input"
                      >
                        Phone Number
                      </label>
                      <Input
                        id="example4cols2Input"
                        placeholder="Phone Number"
                        type="number"
                        pattern="[1-9]{1}[0-9]{9}"
                        onChange={handleChange("phone")}
                        required
                        value={studentData.phone}
                        onBlur={phoneBlurHandler}
                        invalid={phoneError}
                      />
                      {phoneError && (
                        <FormFeedback>
                          Please Enter a valid Phone no
                        </FormFeedback>
                      )}
                    </Col>
                    <Col>
                      <label
                        className="form-control-label"
                        htmlFor="example4cols2Input"
                      >
                        Alternate Phone Number
                      </label>
                      <Input
                        id="example4cols2Input"
                        placeholder="Alternate Phone Number"
                        type="number"
                        pattern="[1-9]{1}[0-9]{9}"
                        onChange={handleChange("alternate_phone")}
                        required
                        value={studentData.alternate_phone}
                        onBlur={altPhoneBlurHandler}
                        invalid={altPhoneError}
                      />
                      {altPhoneError && (
                        <FormFeedback>Please Enter a valid Phone</FormFeedback>
                      )}
                    </Col>
                  </Row>
                  <Row className="mt-4">
                    <Col>
                      <label
                        className="form-control-label"
                        htmlFor="example4cols2Input"
                      >
                        Birth Place
                      </label>
                      <Input
                        id="example4cols2Input"
                        placeholder="Birth Place"
                        type="text"
                        onChange={handleChange("birth_place")}
                        required
                        value={studentData.birth_place}
                      />
                    </Col>
                    <Col>
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
                        required
                        value={studentData.caste}
                      />
                    </Col>
                    <Col>
                      <label
                        className="form-control-label"
                        htmlFor="exampleFormControlSelect3"
                      >
                        Religion
                      </label>
                      <Input
                        id="exampleFormControlSelect3"
                        type="text"
                        onChange={handleChange("religion")}
                        required
                        value={studentData.religion}
                        placeholder="Religion"
                      />
                    </Col>
                    <Col>
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
                        required
                        value={studentData.bloodgroup}
                      >
                        <option value="" disabled>
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
                  <Row className="mt-4 float-right mr-4">
                    <Button onClick={cancelHandler} color="danger">
                      Cancel
                    </Button>
                    <Button color="primary" type="submit" disabled={disableButton} >
                      Next
                    </Button>
                  </Row>
                </CardBody>
              </Form>
            )}
            {step === 1 && (
              <Form onSubmit={handleFormChange} className="mb-4">
                <CardBody>
                  <Row className="mt-4">
                    <Col>
                      <label
                        className="form-control-label"
                        htmlFor="exampleFormControlSelect3"
                      >
                        Select Class
                      </label>
                      <Input
                        id="exampleFormControlSelect3"
                        type="select"
                        required
                        onChange={handleChange("class")}
                        value={studentData.class}
                      >
                        <option value="">Select Class</option>
                        {classes &&
                          classes.map((clas, index) => {
                            // setselectedClassIndex(index)
                            return (
                              <option value={clas._id} key={index}>
                                {clas.name}
                              </option>
                            );
                          })}
                      </Input>
                    </Col>
                    <Col>
                      <label
                        className="form-control-label"
                        htmlFor="exampleFormControlSelect3"
                      >
                        Select Section
                      </label>
                      <Input
                        id="exampleFormControlSelect3"
                        type="select"
                        required
                        onChange={handleChange("section")}
                        value={studentData.section}
                      >
                        <option value="">Select Section</option>
                        {selectedClass.section &&
                          selectedClass.section.map((section) => {
                            // console.log(section.name);
                            return (
                              <option
                                value={section._id}
                                key={section._id}
                                selected
                              >
                                {section.name}
                              </option>
                            );
                          })}
                      </Input>
                    </Col>
                  </Row>
                  <Row className="mt-4">
                    <Col md="4">
                      <label
                        className="form-control-label"
                        htmlFor="example4cols2Input"
                      >
                        Roll Number
                      </label>
                      <Input
                        id="example4cols2Input"
                        placeholder="Roll Number"
                        type="number"
                        // onChange={() => {
                        //   setStudentData({ ...studentData, roll_number: "" });
                        // }}
                        onChange={handleChange("roll_number")}
                        required
                        value={studentData.roll_number}
                      />
                    </Col>
                    <Col>
                      <label
                        className="form-control-label"
                        htmlFor="example4cols2Input"
                      >
                        Previous School
                      </label>
                      <Input
                        id="example4cols2Input"
                        placeholder="Previous School"
                        type="text"
                        onChange={handleChange("previous_school")}
                        required
                        value={studentData.previous_school}
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
                      <Button onClick={cancelHandler} color="danger">
                        Cancel
                      </Button>
                      <Button className="mr-4" color="primary" type="submit"  disabled={disableButton}>
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
                    <Col>
                      <label
                        className="form-control-label"
                        htmlFor="example4cols3Input"
                      >
                        Present Address
                      </label>
                      <Input
                        id="example4cols3Input"
                        placeholder="Present Address"
                        type="text"
                        onChange={handleChange("present_address")}
                        required
                        value={studentData.present_address}
                      />
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <label
                        className="form-control-label"
                        htmlFor="example4cols3Input"
                      >
                        Permanent Address
                      </label>
                      <Input
                        id="example4cols3Input"
                        placeholder="Permanent Address"
                        type="text"
                        onChange={handleChange("permanent_address")}
                        required
                        value={studentData.permanent_address}
                      />
                    </Col>
                  </Row>
                  <Row className="mb-4">
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
                        invalid={pincodeError}
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
                  <Row>
                    <Col>
                      <label
                        className="form-control-label"
                        htmlFor="example4cols2Input"
                      >
                        Nationality
                      </label>
                      <Input
                        id="example4cols2Input"
                        placeholder="Nationality"
                        type="text"
                        onChange={handleChange("nationality")}
                        required
                        value={studentData.nationality}
                      />
                    </Col>
                    <Col>
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
                        required
                        value={studentData.mother_tongue}
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
                      <Button onClick={cancelHandler} color="danger">
                        Cancel
                      </Button>
                      <Button className="mr-4" color="primary" type="submit" disabled={disableButton} >
                        Next
                      </Button>
                    </div>
                  </Row>
                </CardBody>
              </Form>
            )}
            {step === 3 && (
              <>
                <CardBody>
                  <Row>
                    <Col align="center">
                      <div style={{ width: "300px" }}>
                        <label className="form-control-label">
                          Contact Person
                        </label>
                        <Select
                          defaultValue={studentData.contact_person_select}
                          options={contactPersonsSelect}
                          onChange={(e) => {
                            removeFields(e);
                          }}
                        />
                      </div>
                    </Col>
                  </Row>
                </CardBody>
                <Form onSubmit={handleSubmitForm} className="mb-4">
                  {studentData.contact_person_select.value === "parent" ? (
                    <>
                      <CardBody>
                        <Row>
                          <Col>
                            <label
                              className="form-control-label"
                              htmlFor="example4cols3Input"
                            >
                              Parent Address
                            </label>
                            <Input
                              id="example4cols3Input"
                              placeholder="Parent Address"
                              type="text"
                              onChange={handleChange("parent_address")}
                              required
                              value={studentData.parent_address}
                            />
                          </Col>
                        </Row>
                        <Row>
                          <Col>
                            <label
                              className="form-control-label"
                              htmlFor="example4cols3Input"
                            >
                              Parent Email
                            </label>
                            <Input
                              id="example4cols3Input"
                              placeholder="Parent Address"
                              type="email"
                              onChange={handleChange("parent_email")}
                              required
                              value={studentData.parent_email}
                              pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$"
                              invalid={parentEmailError}
                              onBlur={parentEmailBlurHandler}
                            />
                            {parentEmailError && (
                              <FormFeedback>
                                Please enter a valid email address.
                              </FormFeedback>
                            )}
                          </Col>
                        </Row>
                        {connectFalse && (
                          <Row>
                            <Col>
                              <FormGroup>
                                <label
                                  className="form-control-label"
                                  htmlFor="example4cols3Input"
                                >
                                  Connected
                                </label>
                                <Input
                                  id="exampleFormControlSelect3"
                                  type="select"
                                  onChange={handleChange("connected")}
                                  required
                                  value={studentData.connected}
                                >
                                  <option disabled value="">
                                    Connect
                                  </option>
                                  <option value={true}>Yes</option>
                                  <option value={false}>No</option>
                                </Input>
                              </FormGroup>
                            </Col>
                          </Row>
                        )}
                        {studentData.connected === "true" && (
                          <Row>
                            <Col>
                              <FormGroup>
                                <label
                                  className="form-control-label"
                                  htmlFor="example4cols3Input"
                                >
                                  Connection
                                </label>
                                <Input
                                  id="example4cols3Input"
                                  placeholder="connection"
                                  type="text"
                                  onChange={handleChange("connectedID")}
                                  required
                                  disabled
                                  value={studentData.connectedID}
                                />
                              </FormGroup>
                            </Col>
                          </Row>
                        )}

                        <Row className="mb-4">
                          <Col align="center">
                            <h2>Father Details</h2>
                          </Col>
                        </Row>
                        <Row>
                          <Col>
                            <FormGroup>
                              <label
                                className="form-control-label"
                                htmlFor="example4cols3Input"
                              >
                                First Name
                              </label>
                              <Input
                                id="example4cols3Input"
                                placeholder="First Name"
                                type="text"
                                onChange={handleChange("father_name")}
                                required
                                value={studentData.father_name}
                              />
                            </FormGroup>
                          </Col>
                          <Col>
                            <FormGroup>
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
                                onChange={handleChange("father_last_name")}
                                required
                                value={studentData.father_last_name}
                              />
                            </FormGroup>
                          </Col>
                        </Row>
                        <Row className="mb-4">
                          <Col>
                            <Label
                              className="form-control-label"
                              htmlFor="example-date-input"
                            >
                              DOB
                            </Label>
                            <DatePicker
                              dateFormat="dd/MM/yyyy"
                              placeholderText="dd/mm/yyyy"
                              onChange={(date) => setFatherDOB(date)}
                              //  value={dateOfBirth}
                              selected={fatherDOB}
                              required
                              showMonthDropdown
                              showYearDropdown
                              dropdownMode="select"
                              className="datePicker"
                            />
                          </Col>
                          <Col>
                            <label
                              className="form-control-label"
                              htmlFor="exampleFormControlSelect3"
                            >
                              Blood Group
                            </label>
                            <Input
                              id="exampleFormControlSelect3"
                              type="select"
                              onChange={handleChange("father_blood_group")}
                              required
                              value={studentData.father_blood_group}
                            >
                              <option value="" disabled>
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
                          <Col>
                            <label
                              className="form-control-label"
                              htmlFor="example4cols3Input"
                            >
                              Phone Number
                            </label>
                            <Input
                              id="example4cols3Input"
                              placeholder="Phone Number"
                              type="number"
                              pattern="[1-9]{1}[0-9]{9}"
                              onChange={handleChange("father_phone")}
                              required
                              value={studentData.father_phone}
                              onBlur={fatherPhoneBlurHandler}
                              invalid={fatherPhoneError}
                            />
                            {fatherPhoneError && (
                              <FormFeedback>
                                Please enter a valid phone no.
                              </FormFeedback>
                            )}
                          </Col>
                        </Row>
                        <Row className="mb-4">
                          <Col>
                            <label
                              className="form-control-label"
                              htmlFor="example4cols2Input"
                            >
                              Pin Code
                            </label>
                            <Input
                              id="example4cols2Input"
                              placeholder="Pin Code"
                              type="number"
                              onChange={handleChange("father_pincode")}
                              required
                              value={studentData.father_pincode}
                              onBlur={fatherPincodeBlurHandler}
                              invalid={fatherPincodeError}
                            />
                            {fatherPincodeError && (
                              <FormFeedback>
                                Please Enter a valid Pincode
                              </FormFeedback>
                            )}
                          </Col>
                          <Col>
                            <label
                              className="form-control-label"
                              htmlFor="example4cols2Input"
                            >
                              Nationality
                            </label>
                            <Input
                              id="example4cols2Input"
                              placeholder="Nationality"
                              type="text"
                              onChange={handleChange("father_nationality")}
                              required
                              value={studentData.father_nationality}
                            />
                          </Col>
                          <Col>
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
                              onChange={handleChange("father_mother_tongue")}
                              required
                              value={studentData.father_mother_tongue}
                            />
                          </Col>
                        </Row>
                      </CardBody>
                      <CardBody>
                        <Row className="mb-4">
                          <Col align="center">
                            <h2>Mother Details</h2>
                          </Col>
                        </Row>
                        <Row>
                          <Col>
                            <FormGroup>
                              <label
                                className="form-control-label"
                                htmlFor="example4cols3Input"
                              >
                                First Name
                              </label>
                              <Input
                                id="example4cols3Input"
                                placeholder="First Name"
                                type="text"
                                onChange={handleChange("mother_name")}
                                required
                                value={studentData.mother_name}
                              />
                            </FormGroup>
                          </Col>
                          <Col>
                            <FormGroup>
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
                                onChange={handleChange("mother_last_name")}
                                required
                                value={studentData.mother_last_name}
                              />
                            </FormGroup>
                          </Col>
                        </Row>
                        <Row className="mb-4">
                          <Col>
                            <Label
                              className="form-control-label"
                              htmlFor="example-date-input"
                            >
                              DOB
                            </Label>
                            <DatePicker
                              dateFormat="dd/MM/yyyy"
                              placeholderText="dd/mm/yyyy"
                              onChange={(date) => setMotherDOB(date)}
                              //  value={dateOfBirth}
                              selected={motherDOB}
                              required
                              className="datePicker"
                              showMonthDropdown
                              showYearDropdown
                              dropdownMode="select"
                            />
                          </Col>
                          <Col>
                            <label
                              className="form-control-label"
                              htmlFor="exampleFormControlSelect3"
                            >
                              Blood Group
                            </label>
                            <Input
                              id="exampleFormControlSelect3"
                              type="select"
                              onChange={handleChange("mother_blood_group")}
                              required
                              value={studentData.mother_blood_group}
                            >
                              <option value="" disabled>
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
                          <Col>
                            <label
                              className="form-control-label"
                              htmlFor="example4cols3Input"
                            >
                              Phone Number
                            </label>
                            <Input
                              id="example4cols3Input"
                              placeholder="Phone Number"
                              type="number"
                              pattern="[1-9]{1}[0-9]{9}"
                              onChange={handleChange("mother_phone")}
                              required
                              value={studentData.mother_phone}
                              onBlur={motherPhoneBlurHandler}
                              invalid={motherPhoneError}
                            />
                            {motherPhoneError && (
                              <FormFeedback>
                                Please enter a valid phone no.
                              </FormFeedback>
                            )}
                          </Col>
                        </Row>
                        <Row className="mb-4">
                          <Col>
                            <label
                              className="form-control-label"
                              htmlFor="example4cols2Input"
                            >
                              Pin Code
                            </label>
                            <Input
                              id="example4cols2Input"
                              placeholder="Pin Code"
                              type="number"
                              onChange={handleChange("mother_pincode")}
                              required
                              value={studentData.mother_pincode}
                              onBlur={motherPincodeBlurHandler}
                              invalid={motherPincodeError}
                            />
                            {motherPincodeError && (
                              <FormFeedback>
                                Please Enter a valid Pincode
                              </FormFeedback>
                            )}
                          </Col>
                          <Col>
                            <label
                              className="form-control-label"
                              htmlFor="example4cols2Input"
                            >
                              Nationality
                            </label>
                            <Input
                              id="example4cols2Input"
                              placeholder="Nationality"
                              type="text"
                              onChange={handleChange("mother_nationality")}
                              required
                              value={studentData.mother_nationality}
                            />
                          </Col>
                          <Col>
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
                              onChange={handleChange("mother_mother_tongue")}
                              required
                              value={studentData.mother_mother_tongue}
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
                          <Button
                            className="mr-4"
                            color="success"
                            type="submit"
                            disabled={disableButton}
                          >
                            Submit
                          </Button>
                        </Row>
                      </CardBody>
                    </>
                  ) : null}
                  {studentData.contact_person_select.value === "guardian" ? (
                    <>
                      <CardBody>
                        <Row>
                          <Col>
                            <label
                              className="form-control-label"
                              htmlFor="example4cols3Input"
                            >
                              Guardian Address
                            </label>
                            <Input
                              id="example4cols3Input"
                              placeholder="Guardian Address"
                              type="text"
                              onChange={handleChange("guardian_address")}
                              required
                              value={studentData.guardian_address}
                            />
                          </Col>
                        </Row>
                        <Row>
                          <Col>
                            <label
                              className="form-control-label"
                              htmlFor="example4cols3Input"
                            >
                              Guardian Email
                            </label>
                            <Input
                              id="example4cols3Input"
                              placeholder="Guardian Email"
                              type="text"
                              onChange={handleChange("guardian_email")}
                              required
                              pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$"
                              value={studentData.guardian_email}
                              onBlur={guardianEmailBlurHandler}
                              invalid={guardianEmailError}
                            />
                            {guardianEmailError && (
                              <FormFeedback>
                                Please enter a valid email address
                              </FormFeedback>
                            )}
                          </Col>
                        </Row>
                        {connectFalse && (
                          <Row>
                            <Col>
                              <FormGroup>
                                <label
                                  className="form-control-label"
                                  htmlFor="example4cols3Input"
                                >
                                  Connected
                                </label>
                                <Input
                                  id="exampleFormControlSelect3"
                                  type="select"
                                  onChange={handleChange("connected")}
                                  required
                                  value={studentData.connected}
                                >
                                  <option disabled value="">
                                    Connect
                                  </option>
                                  <option value={true}>Yes</option>
                                  <option value={false}>No</option>
                                </Input>
                              </FormGroup>
                            </Col>
                          </Row>
                        )}
                        {studentData.connected === "true" && (
                          <Row>
                            <Col>
                              <FormGroup>
                                <label
                                  className="form-control-label"
                                  htmlFor="example4cols3Input"
                                >
                                  Connection
                                </label>
                                <Input
                                  id="example4cols3Input"
                                  placeholder="connection"
                                  type="text"
                                  onChange={handleChange("connectedID")}
                                  required
                                  disabled
                                  value={studentData.connectedID}
                                />
                              </FormGroup>
                            </Col>
                          </Row>
                        )}

                        <Row className="mb-4">
                          <Col align="center">
                            <h2>Guardian Details</h2>
                          </Col>
                        </Row>
                        <Row>
                          <Col>
                            <FormGroup>
                              <label
                                className="form-control-label"
                                htmlFor="example4cols3Input"
                              >
                                First Name
                              </label>
                              <Input
                                id="example4cols3Input"
                                placeholder="First Name"
                                type="text"
                                onChange={handleChange("guardian_name")}
                                required
                                value={studentData.guardian_name}
                              />
                            </FormGroup>
                          </Col>
                          <Col>
                            <FormGroup>
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
                                onChange={handleChange("guardian_last_name")}
                                required
                                value={studentData.guardian_last_name}
                              />
                            </FormGroup>
                          </Col>
                        </Row>
                        <Row className="mb-4">
                          <Col>
                            <Label
                              className="form-control-label"
                              htmlFor="example-date-input"
                            >
                              DOB
                            </Label>
                            <DatePicker
                              dateFormat="dd/MM/yyyy"
                              placeholderText="dd/mm/yyyy"
                              onChange={(date) => setGuardianDOB(date)}
                              //  value={dateOfBirth}
                              selected={guardianDOB}
                              required
                              className="datePicker"
                              showMonthDropdown
                              showYearDropdown
                              dropdownMode="select"
                            />
                          </Col>
                          <Col>
                            <label
                              className="form-control-label"
                              htmlFor="exampleFormControlSelect3"
                            >
                              Blood Group
                            </label>
                            <Input
                              id="exampleFormControlSelect3"
                              type="select"
                              onChange={handleChange("guardian_blood_group")}
                              required
                              value={studentData.guardian_blood_group}
                            >
                              <option value="" disabled>
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
                          <Col>
                            <label
                              className="form-control-label"
                              htmlFor="example4cols3Input"
                            >
                              Phone Number
                            </label>
                            <Input
                              id="example4cols3Input"
                              placeholder="Phone Number"
                              type="number"
                              pattern="[1-9]{1}[0-9]{9}"
                              onChange={handleChange("guardian_phone")}
                              required
                              value={studentData.guardian_phone}
                              invalid={guardianPhoneError}
                              onBlur={guardianPhoneBlurHandler}
                            />
                            {guardianPhoneError && (
                              <FormFeedback>
                                Please enter a valid phone no.
                              </FormFeedback>
                            )}
                          </Col>
                        </Row>
                        <Row className="mb-4">
                          <Col>
                            <label
                              className="form-control-label"
                              htmlFor="example4cols2Input"
                            >
                              Pin Code
                            </label>
                            <Input
                              id="example4cols2Input"
                              placeholder="Pin Code"
                              type="number"
                              onChange={handleChange("guardian_pincode")}
                              required
                              value={studentData.guardian_pincode}
                              onBlur={guardianPincodeBlurHandler}
                              invalid={guardianPincodeError}
                            />
                            {guardianPincodeError && (
                              <FormFeedback>
                                Please Enter a valid Pincode
                              </FormFeedback>
                            )}
                          </Col>
                          <Col>
                            <label
                              className="form-control-label"
                              htmlFor="example4cols2Input"
                            >
                              Nationality
                            </label>
                            <Input
                              id="example4cols2Input"
                              placeholder="Nationality"
                              type="text"
                              onChange={handleChange("guardian_nationality")}
                              required
                              value={studentData.guardian_nationality}
                            />
                          </Col>
                          <Col>
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
                              onChange={handleChange("guardian_mother_tongue")}
                              required
                              value={studentData.guardian_mother_tongue}
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
                            <Button onClick={cancelHandler} color="danger">
                              Cancel
                            </Button>
                            <Button
                              className="mr-4"
                              color="success"
                              type="submit"
                              disabled={disableButton}
                            >
                              Submit
                            </Button>
                          </div>
                        </Row>
                      </CardBody>
                    </>
                  ) : null}
                </Form>
              </>
            )}
          </Card>
        )}
      </Container>
    </>
  );
}

export default AddStudent;
