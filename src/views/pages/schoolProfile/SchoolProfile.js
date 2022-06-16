// reactstrap components
import React, { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Container,
  Row,
  Col,
  Button,
  CardImg,
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
  ListGroupItem,
  ListGroup,
  ModalFooter,
  Modal,
  ModalBody,
  Form,
  Label,
  Input,
  FormFeedback,
} from "reactstrap";
// core components

import Loader from "components/Loader/Loader";
import SimpleHeader from "components/Headers/SimpleHeader.js";
import { schoolProfile, editProfile } from "api/school";
import { FaEdit } from "react-icons/fa";
import { isAuthenticated } from "api/auth";
import { toast, ToastContainer } from "react-toastify";
import { fetchingSchoolProfileError } from "constants/errors";
import { updateSchoolError } from "constants/errors";
import { updateSchoolSuccess } from "constants/success";

function SchoolProfile() {
  // 1 -> Details 2 -> Contact
  const [activeTab, setActiveTab] = useState("1");
  const [schoolDetails, setSchoolDetails] = useState({});
  const [editing, setEditing] = useState(false);
  const { user } = isAuthenticated();
  const [formData] = useState(new FormData());
  const [checked, setChecked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [phoneError, setPhoneError] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [altPhoneError, setAltPhoneError] = useState(false);
  const [pincodeError, setPincodeError] = useState(false);
  const [disableButton, setDisableButton] = useState(false);
  const [editSchoolProfile, setEditSchoolProfile] = useState({
    school_name: "",
    abbreviation: "",
    school_address: "",
    pin_code: "",
    country: "",
    city: "",
    state: "",
    school_email: "",
    primary_contact_no: "",
    telephone: "",
    fax_no: "",
    affiliate_board: "",
    image:""
  });
  const [imagesPreview, setImagesPreview] = useState();
  const handleFileChange = (name) => (event) => {
    // formData.set(name, event.target.files[0]);
    // console.log(event.target.files[0]);
    setEditSchoolProfile({...editSchoolProfile, image: event.target.files[0]});
    // setImage(event.target.files[0]);
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.readyState === 2) {
        setImagesPreview(reader.result);
      }
    };
    reader.readAsDataURL(event.target.files[0]);
  };
  const phoneBlurHandler = () => {
    console.log("here");

    let regex = /^[5-9]{2}[0-9]{8}$/;
    if (regex.test(editSchoolProfile.primary_contact_no)) {
      setPhoneError(false);
      setDisableButton(false);
    } else {
      setPhoneError(true);
      setDisableButton(true);
    }
  };
  const altPhoneBlurHandler = () => {
    let regex = /^[5-9]{2}[0-9]{8}$/;
    if (regex.test(editSchoolProfile.telephone)) {
      setAltPhoneError(false);
      setDisableButton(false);
    } else {
      setAltPhoneError(true);
      setDisableButton(true);
    }
  };
  const emailBlurHandler = () => {
    let regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (regex.test(editSchoolProfile.school_email)) {
      setEmailError(false);
      setDisableButton(false);
    } else {
      setEmailError(true);
      setDisableButton(true);
    }
  };
  const pincodeBlurHandler = () => {
    let regex = /^[1-9][0-9]{5}$/;
    if (editSchoolProfile.pin_code.length === 6) {
      setPincodeError(false);
      setDisableButton(false);
    } else {
      setPincodeError(true);
      setDisableButton(true);
    }
  };

  const [permissions, setPermissions] = useState([]);
  const [editLoading, setEditLoading] = useState(false);
  useEffect(() => {
    // console.log(user);
    if (user.permissions["School Profile Module"]) {
      let permission1 = user.permissions["School Profile Module"];
      setPermissions(permission1);
      // console.log(permissions);
    }
  }, []);

  useEffect(() => {
    getSchoolDetails();
  }, [checked]);

  const getSchoolDetails = async () => {
    try {
      setLoading(true);
      const { data } = await schoolProfile(user.school, user._id);
      // console.log(user);
      if(data.err){
        toast.error(data.err);
        setLoading(false);
        return;
      }
      console.log(data);
      setSchoolDetails(data);
      setEditSchoolProfile({
        ...editSchoolProfile,
        school_name: data.schoolname,
        abbreviation: data.abbreviation,
        school_address: data.address,
        pin_code: data.pincode,
        country: data.country,
        city: data.city,
        state: data.state,
        school_email: data.email,
        primary_contact_no: data.phone,
        telephone: data.telephone,
        fax_no: "",
        affiliate_board: data.affiliate_board,
      });
      setImagesPreview(data.photo)
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
      toast.error(fetchingSchoolProfileError);
    }
  };

  const handleChange = (name) => (event) => {
    // formData.set(name, event.target.value);
    setEditSchoolProfile({ ...editSchoolProfile, [name]: event.target.value });
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    // console.log(editSchoolProfile);

    formData.set("schoolname", editSchoolProfile.school_name);
    formData.set("abbreviation", editSchoolProfile.abbreviation);
    formData.set("address", editSchoolProfile.school_address);
    formData.set("affiliate_board", editSchoolProfile.affiliate_board);
    formData.set("city", editSchoolProfile.city);
    formData.set("country", editSchoolProfile.country);
    formData.set("email", editSchoolProfile.school_email);
    formData.set("phone", editSchoolProfile.primary_contact_no);
    formData.set("pincode", editSchoolProfile.pin_code);
    formData.set("state", editSchoolProfile.state);
    formData.set("telephone", editSchoolProfile.telephone);
    
    formData.set("photo", editSchoolProfile.image);

    try {
      setEditLoading(true);
      const data = await editProfile(user.school, user._id, formData);
      // console.log(data);
      if(data.err){
        toast.error(data.err);
        setEditLoading(false);
        return;
      }
      setEditing(false);
      setChecked(!checked);
      setEditLoading(false);
      toast.success(updateSchoolSuccess);
    } catch (err) {
      console.log(err);
      setEditLoading(false);
      toast.error(updateSchoolError);
    }
  };

  return (
    <>
      <SimpleHeader name="School Profile" />
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
      <Modal
        isOpen={editing}
        toggle={() => setEditing(false)}
        size="lg"
        scrollable
      >
        <div className="modal-header">
          <h2 className="modal-title" id="modal-title-default">
        Edit School Details
          </h2>
          <button
            aria-label="Close"
            className="close"
            data-dismiss="modal"
            type="button"
            onClick={() => setEditing(false)}
          >
            <span aria-hidden={true}>×</span>
          </button>
        </div>
        {editLoading ? (
          <Loader />
        ) : (
          <ModalBody>
            <Form onSubmit={handleEdit}>
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
                          onChange={handleFileChange("image")}
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
                   
                  </Row>
              <Row>
                <Col>
                  <Label
                    className="form-control-label"
                    htmlFor="example4cols2Input"
                  >
                    School Name
                  </Label>
                  <Input
                    id="example4cols2Input"
                    placeholder="Class"
                    type="text"
                    onChange={handleChange("school_name")}
                    value={editSchoolProfile.school_name}
                    required
                  />
                </Col>
                <Col>
                  <Label
                    className="form-control-label"
                    htmlFor="example4cols2Input"
                  >
                    Abbreviation
                  </Label>
                  <Input
                    id="example4cols2Input"
                    placeholder="Class"
                    type="text"
                    onChange={handleChange("abbreviation")}
                    value={editSchoolProfile.abbreviation}
                    required
                  />
                </Col>
              </Row>
              <Row>
                <Col>
                  <Label
                    className="form-control-label"
                    htmlFor="example4cols2Input"
                  >
                    Affiliated Board
                  </Label>
                  <Input
                    id="example4cols2Input"
                    placeholder="Class"
                    type="text"
                    onChange={handleChange("affiliate_board")}
                    value={editSchoolProfile.affiliate_board}
                    required
                  />
                </Col>
                <Col>
                  <Label
                    className="form-control-label"
                    htmlFor="example4cols2Input"
                  >
                    School Address
                  </Label>
                  <Input
                    id="example4cols2Input"
                    placeholder="Class"
                    type="text"
                    onChange={handleChange("school_address")}
                    value={editSchoolProfile.school_address}
                    required
                  />
                </Col>
              </Row>
              <Row>
                <Col>
                  <Label
                    className="form-control-label"
                    htmlFor="example4cols2Input"
                  >
                    Pin Code
                  </Label>
                  <Input
                    id="example4cols2Input"
                    placeholder="Class"
                    type="number"
                    onChange={handleChange("pin_code")}
                    value={editSchoolProfile.pin_code}
                    required
                    pattern="[1-9]{1}[0-9]{5}"
                    onBlur={pincodeBlurHandler}
                    invalid={pincodeError}
                  />
                  {pincodeError && (
                    <FormFeedback>Please Enter a valid Pincode</FormFeedback>
                  )}
                </Col>
                <Col>
                  <Label
                    className="form-control-label"
                    htmlFor="example4cols2Input"
                  >
                    Country
                  </Label>
                  <Input
                    id="example4cols2Input"
                    placeholder="Country"
                    type="text"
                    onChange={handleChange("country")}
                    value={editSchoolProfile.country}
                    required
                  />
                </Col>
              </Row>
              <Row>
                <Col>
                  <Label
                    className="form-control-label"
                    htmlFor="example4cols2Input"
                  >
                    State
                  </Label>
                  <Input
                    id="example4cols2Input"
                    placeholder="Class"
                    type="text"
                    onChange={handleChange("state")}
                    value={editSchoolProfile.state}
                    required
                  />
                </Col>
                <Col>
                  <Label
                    className="form-control-label"
                    htmlFor="example4cols2Input"
                  >
                    City
                  </Label>
                  <Input
                    id="example4cols2Input"
                    placeholder="Class"
                    type="text"
                    onChange={handleChange("city")}
                    value={editSchoolProfile.city}
                    required
                  />
                </Col>
              </Row>
              <Row>
                <Col>
                  <Label
                    className="form-control-label"
                    htmlFor="example4cols2Input"
                  >
                    School Email
                  </Label>
                  <Input
                    id="example4cols2Input"
                    pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$"
                    placeholder="Email"
                    type="email"
                    onChange={handleChange("school_email")}
                    value={editSchoolProfile.school_email}
                    required
                    onBlur={emailBlurHandler}
                    invalid={emailError}
                  />
                  {emailError && (
                    <FormFeedback>Please Enter a valid Email</FormFeedback>
                  )}
                </Col>
                <Col>
                  <Label
                    className="form-control-label"
                    htmlFor="example4cols2Input"
                  >
                    Primary Contact No
                  </Label>
                  <Input
                    id="example4cols2Input"
                    pattern="[1-9]{1}[0-9]{9}"
                    placeholder="Primary Contact No"
                    type="number"
                    onChange={handleChange("primary_contact_no")}
                    value={editSchoolProfile.primary_contact_no}
                    required
                    invalid={phoneError}
                    onBlur={phoneBlurHandler}
                  />
                  {phoneError && (
                    <FormFeedback>Please Enter a valid phone no</FormFeedback>
                  )}
                </Col>
              </Row>
              <Row>
                <Col md="6">
                  <Label
                    className="form-control-label"
                    htmlFor="example4cols2Input"
                  >
                    Telephone
                  </Label>
                  <Input
                    id="example4cols2Input"
                    placeholder="Class"
                    type="number"
                    pattern="[1-9]{1}[0-9]{9}"
                    onChange={handleChange("telephone")}
                    value={editSchoolProfile.telephone}
                    required
                    onBlur={altPhoneBlurHandler}
                    invalid={altPhoneError}
                  />
                  {altPhoneError && (
                    <FormFeedback>Please Enter a valid phone no</FormFeedback>
                  )}
                </Col>
              </Row>
              <Button
                color="success"
                type="submit"
                className="mt-2 mb-2"
                style={{ float: "right" }}
                disabled={disableButton}
              >
                Save changes
              </Button>
            </Form>
          </ModalBody>
        )}
      </Modal>
      <Container className="mt--6" fluid>
        {loading ? (
          <Loader />
        ) : (
          <Row>
            <Col lg="4">
              <div className="card-wrapper">
                <Card>
                  <Col align="center">
                    <CardImg
                      alt="..."
                      src={schoolDetails.photo && schoolDetails.photo}
                      top
                      className="p-4"
                      style={{ width: "80%", height: "100%" }}
                    />
                  </Col>
                  <CardBody className="mt-0">
                    <Row>
                      <Col align="center">
                        <h4 className="mt-0 mb-1">School Name</h4>
                        <span className="text-md">
                          {schoolDetails.schoolname}
                        </span>
                      </Col>
                    </Row>
                    <Row>
                      <Col align="center">
                        <h4 className="mt-3 mb-1">Abbreviation</h4>
                        <span className="text-md">
                          {schoolDetails.abbreviation}
                        </span>
                      </Col>
                    </Row>
                    <Row>
                      <Col align="center">
                        <h4 className="mt-3 mb-1">Affiliated Board</h4>
                        <span className="text-md">
                          {schoolDetails.affiliate_board}
                        </span>
                      </Col>
                    </Row>
                    <Row>
                      <Col align="center">
                        <h4 className="mt-3 mb-1">Website</h4>
                        <span className="text-md">
                          {schoolDetails.website}
                        </span>
                      </Col>
                    </Row>
                  </CardBody>
                </Card>
              </div>
            </Col>
            <Col>
              <div className="card-wrapper">
                <Card>
                  <CardHeader>
                    <Row>
                      <Col md="10">
                        <Nav pills style={{ cursor: "pointer" }}>
                          <NavItem>
                            <NavLink
                              className={activeTab === "1" ? "active" : ""}
                              onClick={() => setActiveTab("1")}
                            >
                              Details
                            </NavLink>
                          </NavItem>
                          <NavItem>
                            <NavLink
                              className={activeTab === "2" ? "active" : ""}
                              onClick={() => setActiveTab("2")}
                            >
                              Contact
                            </NavLink>
                          </NavItem>
                        </Nav>
                      </Col>
                      {permissions && permissions.includes("edit") && (
                        <Col className="text-right">
                          <Button
                            className="btn-icon"
                            color="primary"
                            type="button"
                            onClick={() => setEditing(true)}
                          >
                            <span className="btn-inner--icon">
                              <FaEdit />
                            </span>
                          </Button>
                        </Col>
                      )}
                    </Row>
                  </CardHeader>
                  <CardBody>
                    <TabContent activeTab={activeTab}>
                      <TabPane tabId="1">
                        <ListGroup flush>
                          <Row>
                            <Col>
                              <ListGroupItem className="checklist-entry flex-column align-items-start py-4 px-4">
                                <div className="checklist-item checklist-item-info">
                                  <div className="checklist-info">
                                    <h5 className="checklist-title mb-0">
                                      School Address
                                    </h5>
                                    <small>{schoolDetails.address}</small>
                                  </div>
                                </div>
                              </ListGroupItem>
                            </Col>
                            <Col md="4">
                              <ListGroupItem className="checklist-entry flex-column align-items-start py-4 px-4">
                                <div className="checklist-item checklist-item-success">
                                  <div className="checklist-info">
                                    <h5 className="checklist-title mb-0">
                                      Pin Code
                                    </h5>
                                    <small>{schoolDetails.pincode}</small>
                                  </div>
                                </div>
                              </ListGroupItem>
                            </Col>
                          </Row>
                          <Row className="mt-4">
                            <Col>
                              <ListGroupItem className="checklist-entry flex-column align-items-start py-4 px-4">
                                <div className="checklist-item checklist-item-success">
                                  <div className="checklist-info">
                                    <h5 className="checklist-title mb-0">
                                      Country
                                    </h5>
                                    <small>{schoolDetails.country}</small>
                                  </div>
                                </div>
                              </ListGroupItem>
                            </Col>
                            <Col>
                              <ListGroupItem className="checklist-entry flex-column align-items-start py-4 px-4">
                                <div className="checklist-item checklist-item-info">
                                  <div className="checklist-info">
                                    <h5 className="checklist-title mb-0">
                                      City
                                    </h5>
                                    <small>{schoolDetails.city}</small>
                                  </div>
                                </div>
                              </ListGroupItem>
                            </Col>
                            <Col>
                              <ListGroupItem className="checklist-entry flex-column align-items-start py-4 px-4">
                                <div className="checklist-item checklist-item-success">
                                  <div className="checklist-info">
                                    <h5 className="checklist-title mb-0">
                                      State
                                    </h5>
                                    <small>{schoolDetails.state}</small>
                                  </div>
                                </div>
                              </ListGroupItem>
                            </Col>
                          </Row>
                        </ListGroup>
                      </TabPane>
                      <TabPane tabId="2">
                        <ListGroup flush>
                          <Row>
                            <Col>
                              <ListGroupItem className="checklist-entry flex-column align-items-start py-4 px-4">
                                <div className="checklist-item checklist-item-success">
                                  <div className="checklist-info">
                                    <h5 className="checklist-title mb-0">
                                      School Email
                                    </h5>
                                    <small>{schoolDetails.email}</small>
                                  </div>
                                </div>
                              </ListGroupItem>
                            </Col>
                            <Col>
                              <ListGroupItem className="checklist-entry flex-column align-items-start py-4 px-4">
                                <div className="checklist-item checklist-item-info">
                                  <div className="checklist-info">
                                    <h5 className="checklist-title mb-0">
                                      Primary Contact Number
                                    </h5>
                                    <small>+91 {schoolDetails.phone}</small>
                                  </div>
                                </div>
                              </ListGroupItem>
                            </Col>
                          </Row>
                          <Row className="mt-4">
                            <Col>
                              <ListGroupItem className="checklist-entry flex-column align-items-start py-4 px-4">
                                <div className="checklist-item checklist-item-success">
                                  <div className="checklist-info">
                                    <h5 className="checklist-title mb-0">
                                      Telephone
                                    </h5>
                                    <small>{schoolDetails.telephone}</small>
                                  </div>
                                </div>
                              </ListGroupItem>
                            </Col>
                            <Col>
                              <ListGroupItem className="checklist-entry flex-column align-items-start py-4 px-4">
                                <div className="checklist-item checklist-item-info">
                                  <div className="checklist-info">
                                    <h5 className="checklist-title mb-0">
                                      Fax No.
                                    </h5>
                                    <small>+91 123456789</small>
                                  </div>
                                </div>
                              </ListGroupItem>
                            </Col>
                          </Row>
                        </ListGroup>
                      </TabPane>
                    </TabContent>
                  </CardBody>
                </Card>
              </div>
            </Col>
          </Row>
        )}
      </Container>
    </>
  );
}

export default SchoolProfile;
