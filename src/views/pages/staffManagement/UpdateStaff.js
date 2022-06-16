import React, { useEffect, useState } from "react";
import axios from "axios";
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
import SimpleHeader from "components/Headers/SimpleHeader.js";
import { setStaffEditing } from "store/reducers/staff";
import { Stepper, Step } from "react-form-stepper";
import { useSelector, useDispatch } from "react-redux";
import Select from "react-select";
import { Country, State, City } from "country-state-city";
import { updateStaffError } from "constants/errors";
import { updateStaffSuccess } from "constants/success";
import "./style.css";
import Loader from "components/Loader/Loader";
import { ToastContainer, toast } from "react-toastify";
import DatePicker from "react-datepicker";
import {
  CountryDropdown,
  RegionDropdown,
  CountryRegionData,
} from "react-country-region-selector";

import { updateStaff } from "api/staff";
import { isAuthenticated } from "api/auth";
import { getDepartment } from "api/department";
import { allSubjects } from "api/subjects";
import { getAllRoles } from "api/rolesAndPermission";
import { addStudentError } from "constants/errors";
import { fetchingSubjectError } from "constants/errors";
import { fetchingDepartmentError } from "constants/errors";
import { allSessions } from "api/session";
import Staffdetails from "./Staffdetails";

function UpdateStaff({ staffDetails }) {
  const [step, setStep] = useState(0);
  const dispatch = useDispatch();
  const [staffData, setStaffData] = useState({
    _id: staffDetails._id,
    image: staffDetails.image,
    firstname: staffDetails.firstname,
    lastname: staffDetails.lastname,
    email: staffDetails.email,
    phone: staffDetails.phone,
    alternate_phone: staffDetails.alternate_phone,
    date_of_birth: staffDetails.date_of_birth,
    gender: staffDetails.gender,
    birth_place: staffDetails.birth_place,
    caste: staffDetails.caste,
    religion: staffDetails.religion,
    mother_tongue: staffDetails.mother_tongue,
    bloodgroup: staffDetails.bloodgroup,
    joining_date: staffDetails.joining_date,
    present_address: staffDetails.present_address,
    permanent_address: staffDetails.permanent_address,
    state: staffDetails.state,
    city: staffDetails.city,
    country: staffDetails.country,
    pincode: staffDetails.pincode,
    contact_person_name: staffDetails.contact_person_name,
    contact_person_relation: staffDetails.contact_person_relation,
    contact_person_phone: staffDetails.contact_person_phone,
    contact_person_address: staffDetails.contact_person_address,
    contact_person_state: staffDetails.contact_person_state,
    contact_person_city: staffDetails.contact_person_city,
    contact_person_country: staffDetails.contact_person_country,
    contact_person_pincode: staffDetails.contact_person_pincode,
    assign_role: staffDetails.assign_role,
    job: staffDetails.job,
    salary: staffDetails.salary,
    qualification: staffDetails.qualification,
    department: staffDetails.department._id,
    subject: staffDetails.subject,
    session: staffDetails.session._id,
    job_description: staffDetails.job_description,
    tempPhoto:staffDetails.tempPhoto
  });
  const [subjectData, setSubjectData] = useState();
  const [sessions, setSessions] = useState([]);
  const [country, setCountry] = useState(staffDetails.country);
  const [contactCountry, setContactCountry] = useState(
    staffDetails.contact_person_country
  );
  const [state, setState] = useState(staffDetails.state);
  const [contactState, setContactState] = useState(
    staffDetails.contact_person_state
  );
  const [city, setCity] = useState(staffDetails.city);
  const [contactCity, setContactCity] = useState(
    staffDetails.contact_person_city
  );
  const [phoneError, setPhoneError] = useState(false);
  const [altPhoneError, setAltPhoneError] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [contactPhoneError, setContactPhoneError] = useState(false);
  const [pincode, setPincode] = useState(staffDetails.pincode);
  const [pincodeError, setPincodeError] = useState(false);
  const [contactPincode, setContactPincode] = useState(
    staffDetails.contact_person_pincode
  );
  const [imagesPreview, setImagesPreview] = useState(staffDetails.tempPhoto);
  const [contactPincodeError, setContactPincodeError] = useState(false);
  const { user, token } = isAuthenticated();
  // console.log("staff", staffData);
  const [formData] = useState(new FormData());
  const [loading, setLoading] = useState(false);
  const [departments, setDeparments] = useState([]);
  const [dateOfJoining, setDateOfJoining] = useState(
    new Date(staffData.joining_date)
  );
  const [dateOfBirth, setDateOfBirth] = useState(
    new Date(staffData.date_of_birth)
  );
  useEffect(() => {
    let subjects = [];
    for (let i = 0; i < staffData.subject.length; i++) {
      subjects.push({
        value: staffData.subject[i]._id,
        label: staffData.subject[i].name,
      });
    }
    setSubjectData(subjects);
  }, []);

  // const [subject, setSubject] = useState([]);
  // console.log("sub", subject);
  const [a, setA] = useState([]);
  const [assignRole, setAssignRole] = useState(staffData.assign_role);
  const [assignRoleId, setAssignRoleId] = useState(staffData.assign_role._id);
  const roleChangeHandler = (value) => {
    setAssignRoleId(value);
    console.log(value);
    let role = allRoles.find((role) => role._id === value);
    setAssignRole(role);
    console.log(role);
  };
  // console.log("a", a);

  const [allRoles, setAllRoles] = useState([]);
  useEffect(() => {
    getAllRolesHandler();
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

  const handleFileChange = (name) => (event) => {
    formData.set(name, event.target.files[0]);
    setStaffData({ ...staffData, [name]: event.target.files[0].name });
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.readyState === 2) {
        setImagesPreview(reader.result);
      }
    };
    reader.readAsDataURL(event.target.files[0]);

  };

  const handleSubjectChange = (e) => {
    var value = [];
    // console.log("val", value);
    for (var i = 0, l = e.length; i < l; i++) {
      value.push(e[i].value);
    }

    formData.set("subject", JSON.stringify(value));
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

  const handleSubmitForm = async (e) => {
    e.preventDefault();
    const { user, token } = isAuthenticated();
    formData.set("school", user.school);
    formData.set("country", country);
    formData.set("state", state);
    formData.set("contact_person_country", contactCountry);
    formData.set("contact_person_state", contactState);
    formData.set("city", city);
    formData.set("contact_person_city", contactCity);
    formData.set("pincode", pincode);
    formData.set("contact_person_pincode", contactPincode);
    formData.set("assign_role", assignRoleId);
    formData.set("date_of_birth", dateOfBirth);
    formData.set("joining_date", dateOfJoining);

    try {
      setLoading(true);
      const resp = await updateStaff(staffData._id, user._id, formData);
      // console.log(resp);
      if (resp.err) {
        setLoading(false);
        return toast.error(resp.err);
      }
      toast.success(updateStaffSuccess);
      dispatch(setStaffEditing(false));
      setLoading(false);
    } catch (err) {
      setLoading(false);
      toast.error(updateStaffError);
    }
  };

  // Country state city data
  const [cscd, setCscd] = useState({
    country: staffData.country,
    state: staffData.state,
    city: staffData.city,
  });

  // contact person country state city data
  const [cpcscd, setcpCscd] = useState({
    contact_person_country: staffData.contact_person_country,
    contact_person_state: staffData.contact_person_state,
    contact_person_city: staffData.contact_person_city,
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

  console.log(staffData);
  useEffect(() => {}, [cscd, cpcscd]);
  //Getting Session data
  useEffect(() => {
    getSession();
  }, []);

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
  useEffect(async () => {
    await Departments();
    // await Subjects();
    const { user, token } = isAuthenticated();
    try {
      const Subjects = await allSubjects(user._id, user.school, token);
      console.log(Subjects);
      var list = [];
      // console.log("subject", Subjects);
      Subjects.map(async (sub) => {
        list.push({
          value: sub._id,
          label: sub.name,
        });
      });
      setA(list);
      // console.log("list", list);
    } catch (err) {
      toast.error("Something Went Wrong!");
    }
  }, [step]);
  const handleChange2 = (name) => (event) => {
    var data = JSON.parse(event.target.value);
    formData.set(name, data._id);
    setStaffData({
      ...staffData,
      [name]: data._id,
      assign_role_name: data.name,
    });
  };
  async function Departments() {
    const { user, token } = isAuthenticated();
    try {
      const dept = await getDepartment(user.school, user._id, token);
      // console.log("dept", dept);
      setDeparments(dept);
    } catch (err) {
      toast.error("Something Went Wrong!");
    }
  }

  // async function Subjects() {
  //   const { user, token } = isAuthenticated();
  //   try {
  //     const Subjects = await allSubjects(user._id, user.school, token);
  //     console.log("subject", Subjects);
  //     setSubject(Subjects[0].list);
  //   } catch (err) {
  //     toast.error("Something Went Wrong!");
  //   }
  // }
  const cancelHandler = () => {
    window.location.reload();
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

  const pincodeBlurHandler = () => {
    let regex = /^[1-9][0-9]{5}$/;
    if (regex.test(pincode)) {
      setPincodeError(false);
    } else {
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
        {loading ? (
          <Loader />
        ) : (
          <Card className="mb-4 bg-transparent">
            <CardHeader>
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
                  <Row md="4" className="d-flex justify-content-center mb-4">
                    <Col md="8">
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
                          // required
                          onChange={handleFileChange("photo")}
                          accept="image/*"
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
                      <img
                        src={imagesPreview}
                        placeholder={staffData.firstname}
                        style={{ height: "100px", width: "100px" }}
                      />
                    </Col>
                  </Row> 
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
                      <DatePicker
                        dateFormat="dd/MM/yyyy"
                        placeholderText="dd/mm/yyyy"
                        onChange={(date) => setDateOfJoining(date)}
                        //  value={dateOfBirth}
                        selected={dateOfJoining}
                        required
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
                        value={staffData.phone}
                        required
                        pattern="[1-9]{1}[0-9]{9}"
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
                    <Button onClick={cancelHandler} color="danger">
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
                        onChange={pincodeChangeHandler}
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
                        htmlFor="example4cols3Input"
                      >
                        Contact Number
                      </label>
                      <Input
                        id="example4cols3Input"
                        placeholder="Contact Number"
                        onChange={handleChange("contact_person_phone")}
                        value={staffData.contact_person_phone}
                        type="number"
                        required
                        pattern="[1-9]{1}[0-9]{9}"
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
                      <Button onClick={cancelHandler} color="danger">
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
                            onChange={(e) => roleChangeHandler(e.target.value)}
                            value={assignRoleId}
                            required
                          >
                            {allRoles &&
                              allRoles.map((role) => {
                                return (
                                  <option key={role._id} value={role._id}>
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
                  {assignRole && assignRole.name === "Teacher" ? (
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
                          defaultValue={subjectData}
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
                  {assignRole.name !== "" && assignRole.name !== "Teacher" && (
                    <Row>
                      <Col md="12">
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
                      </Col>
                      <Col md="12">
                        <label
                          className="form-control-label"
                          htmlFor="example4cols3Input"
                        >
                          Job Description
                        </label>
                        <Input
                          id="example4cols3Input"
                          placeholder="Job Description"
                          type="textarea"
                          onChange={handleChange("job_description")}
                          value={staffData.job_description}
                          required
                        />
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
                      <Button onClick={cancelHandler} color="danger">
                        Cancel
                      </Button>
                      <Button className="mr-4" color="success" type="submit">
                        Submit
                      </Button>
                    </div>
                  </Row>
                </CardBody>
              </Form>
            )}
          </Card>
        )}
      </Container>
    </>
  );
}

export default UpdateStaff;
