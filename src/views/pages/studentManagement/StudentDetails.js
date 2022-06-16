// reactstrap components
import React, { useState } from "react";
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
} from "reactstrap";
// core components
import SimpleHeader from "components/Headers/SimpleHeader.js";
import "./style.css";
import { FaEdit } from "react-icons/fa";

function Staffdetails({ data, backHandle }) {
  console.log(data);
  // 1 -> Details, 2 -> Documents, 3 -> Attendance
  const [activeTab, setActiveTab] = useState("1");
  function getFormattedDate(date1) {
    let date = new Date(date1);
    var year = date.getFullYear();
  
    var month = (1 + date.getMonth()).toString();
    month = month.length > 1 ? month : "0" + month;
  
    var day = date.getDate().toString();
    day = day.length > 1 ? day : "0" + day;
  
    return day + "/" + month + "/" + year;
  }
  return (
    <>
      <SimpleHeader name="Student Profile" parentName="Student Management" />
      <Container className="mt--6" fluid>
        <Row>
          <Col className="mt--3 ">
            <Button
              className="float-left mb-2"
              color="dark"
              onClick={backHandle}
            >
              <i className="ni ni-bold-left"></i>
            </Button>
          </Col>
        </Row>
        <Row>
          <Col lg="4">
            <div className="card-wrapper">
              <Card>
                <CardImg alt="..." src={data.tempPhoto} top className="p-4" />
                <CardBody>
                  <Row>
                    <Col align="center">
                      <h4 className="mt-3 mb-1">Name</h4>
                      <span className="text-md">
                        {data.firstname} {data.lastname}
                      </span>
                    </Col>

                    <Col align="center">
                      <h4 className="mt-3 mb-1">Class</h4>
                      <span className="text-md">
                        {data.class && data.class.name}
                      </span>
                    </Col>
                  </Row>
                  <Row>
                    <Col align="center">
                      <h4 className="mt-3 mb-1">Section</h4>
                      <span className="text-md">
                        {data.section && data.section.name}
                      </span>
                    </Col>
                    <Col align="center">
                      <h4 className="mt-3 mb-1">Roll No</h4>
                      <span className="text-md">{data.roll_number}</span>
                    </Col>
                  </Row>
                  <Row>
                    <Col align="center">
                      <h4 className="mt-3 mb-1">Address</h4>
                      <span className="text-md">{data.permanent_address}</span>
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
                            Documents
                          </NavLink>
                        </NavItem>
                        <NavItem>
                          <NavLink
                            className={activeTab === "3" ? "active" : ""}
                            onClick={() => setActiveTab("3")}
                          >
                            Attendance
                          </NavLink>
                        </NavItem>
                        <NavItem>
                          <NavLink
                            className={activeTab === "4" ? "active" : ""}
                            onClick={() => setActiveTab("4")}
                          >
                            Contact Person
                          </NavLink>
                        </NavItem>
                      </Nav>
                    </Col>
                    {/* <Col className="text-right">
                      <Button
                        className="btn-icon"
                        color="primary"
                        type="button"
                      >
                        <span className="btn-inner--icon">
                          <FaEdit />
                        </span>
                      </Button>
                    </Col> */}
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
                                    Joining Date
                                  </h5>
                                  <small>{data.joining_date && getFormattedDate(data.joining_date)}</small>
                                </div>
                              </div>
                            </ListGroupItem>
                          </Col>
                          <Col md="4">
                            <ListGroupItem className="checklist-entry flex-column align-items-start py-4 px-4">
                              <div className="checklist-item checklist-item-success">
                                <div className="checklist-info">
                                  <h5 className="checklist-title mb-0">
                                    Gender
                                  </h5>
                                  <small>{data.gender}</small>
                                </div>
                              </div>
                            </ListGroupItem>
                          </Col>
                        </Row>
                        <Row className="mt-4">
                          <Col md="4">
                            <ListGroupItem className="checklist-entry flex-column align-items-start py-4 px-4">
                              <div className="checklist-item checklist-item-success">
                                <div className="checklist-info">
                                  <h5 className="checklist-title mb-0">SID</h5>
                                  <small>{data.SID}</small>
                                </div>
                              </div>
                            </ListGroupItem>
                          </Col>
                          <Col md="4">
                            <ListGroupItem className="checklist-entry flex-column align-items-start py-4 px-4">
                              <div className="checklist-item checklist-item-success">
                                <div className="checklist-info">
                                  <h5 className="checklist-title mb-0">
                                    Aadhar Number
                                  </h5>
                                  <small>{data.aadhar_number}</small>
                                </div>
                              </div>
                            </ListGroupItem>
                          </Col>
                          <Col md="4">
                            <ListGroupItem className="checklist-entry flex-column align-items-start py-4 px-4">
                              <div className="checklist-item checklist-item-success">
                                <div className="checklist-info">
                                  <h5 className="checklist-title mb-0">
                                    Phone
                                  </h5>
                                  <small>{data.phone}</small>
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
                                  <small>{data.country}</small>
                                </div>
                              </div>
                            </ListGroupItem>
                          </Col>
                          <Col>
                            <ListGroupItem className="checklist-entry flex-column align-items-start py-4 px-4">
                              <div className="checklist-item checklist-item-info">
                                <div className="checklist-info">
                                  <h5 className="checklist-title mb-0">City</h5>
                                  <small>{data.city}</small>
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
                                  <small>{data.state}</small>
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
                                    Gender
                                  </h5>
                                  <small>{data.gender}</small>
                                </div>
                              </div>
                            </ListGroupItem>
                          </Col>
                          <Col>
                            <ListGroupItem className="checklist-entry flex-column align-items-start py-4 px-4">
                              <div className="checklist-item checklist-item-success">
                                <div className="checklist-info">
                                  <h5 className="checklist-title mb-0">
                                    Email
                                  </h5>
                                  <small>{data.email}</small>
                                </div>
                              </div>
                            </ListGroupItem>
                          </Col>
                        </Row>
                      </ListGroup>
                    </TabPane>
                    <TabPane tabId="2">
                      <ListGroup flush></ListGroup>
                    </TabPane>
                    <TabPane tabId="4">
                      {data.guardian_name ? (
                        <ListGroup flush>
                          <Row>
                            <Col>
                              <ListGroupItem className="checklist-entry flex-column align-items-start py-4 px-4">
                                <div className="checklist-item checklist-item-success">
                                  <div className="checklist-info">
                                    <h5 className="checklist-title mb-0">
                                      Guardian Name
                                    </h5>
                                    <small>{data.guardian_name}</small>
                                  </div>
                                </div>
                              </ListGroupItem>
                            </Col>
                            <Col>
                              <ListGroupItem className="checklist-entry flex-column align-items-start py-4 px-4">
                                <div className="checklist-item checklist-item-info">
                                  <div className="checklist-info">
                                    <h5 className="checklist-title mb-0">
                                      Guardian Phone
                                    </h5>
                                    <small>{data.guardian_phone}</small>
                                  </div>
                                </div>
                              </ListGroupItem>
                            </Col>
                            <Col>
                              <ListGroupItem className="checklist-entry flex-column align-items-start py-4 px-4">
                                <div className="checklist-item checklist-item-info">
                                  <div className="checklist-info">
                                    <h5 className="checklist-title mb-0">
                                      Guardian Email
                                    </h5>
                                    <small>{data.guardian_email}</small>
                                  </div>
                                </div>
                              </ListGroupItem>
                            </Col>
                          </Row>
                          <Row className="mt-4">
                            <Col>
                              <ListGroupItem className="checklist-entry flex-column align-items-start py-4 px-4">
                                <div className="checklist-item checklist-item-info">
                                  <div className="checklist-info">
                                    <h5 className="checklist-title mb-0">
                                      Guardian Address
                                    </h5>
                                    <small>{data.guardian_address}</small>
                                  </div>
                                </div>
                              </ListGroupItem>
                            </Col>

                            <Col>
                              <ListGroupItem className="checklist-entry flex-column align-items-start py-4 px-4">
                                <div className="checklist-item checklist-item-info">
                                  <div className="checklist-info">
                                    <h5 className="checklist-title mb-0">
                                      Contact Person Pincode
                                    </h5>
                                    <small>{data.contact_person_pincode}</small>
                                  </div>
                                </div>
                              </ListGroupItem>
                            </Col>
                          </Row>
                          <Row className="mt-4">
                            <Col>
                              <ListGroupItem className="checklist-entry flex-column align-items-start py-4 px-4">
                                <div className="checklist-item checklist-item-info">
                                  <div className="checklist-info">
                                    <h5 className="checklist-title mb-0">
                                      Contact Person Relation
                                    </h5>
                                    <small>
                                      {data.contact_person_relation}
                                    </small>
                                  </div>
                                </div>
                              </ListGroupItem>
                            </Col>
                            <Col>
                              <ListGroupItem className="checklist-entry flex-column align-items-start py-4 px-4">
                                <div className="checklist-item checklist-item-success">
                                  <div className="checklist-info">
                                    <h5 className="checklist-title mb-0">
                                      Contact Person Address
                                    </h5>
                                    <small>{data.contact_person_address}</small>
                                  </div>
                                </div>
                              </ListGroupItem>
                            </Col>
                          </Row>
                        </ListGroup>
                      ) : (
                        <ListGroup flush>
                          <Row>
                            <Col>
                              <ListGroupItem className="checklist-entry flex-column align-items-start py-4 px-4">
                                <div className="checklist-item checklist-item-success">
                                  <div className="checklist-info">
                                    <h5 className="checklist-title mb-0">
                                      Father's Name
                                    </h5>
                                    <small>{data.father_name+" "+ data.father_last_name}</small>
                                  </div>
                                </div>
                              </ListGroupItem>
                            </Col>
                            <Col>
                              <ListGroupItem className="checklist-entry flex-column align-items-start py-4 px-4">
                                <div className="checklist-item checklist-item-info">
                                  <div className="checklist-info">
                                    <h5 className="checklist-title mb-0">
                                      Mother's Name
                                    </h5>
                                    <small>{data.mother_name+" "+ data.mother_last_name}</small>
                                  </div>
                                </div>
                              </ListGroupItem>
                            </Col>
                            <Col>
                              <ListGroupItem className="checklist-entry flex-column align-items-start py-4 px-4">
                                <div className="checklist-item checklist-item-info">
                                  <div className="checklist-info">
                                    <h5 className="checklist-title mb-0">
                                      Parent Email
                                    </h5>
                                    <small>
                                      {data.parent_email}
                                    </small>
                                  </div>
                                </div>
                              </ListGroupItem>
                            </Col>
                          </Row>
                          <Row className="mt-4">
                            <Col>
                              <ListGroupItem className="checklist-entry flex-column align-items-start py-4 px-4">
                                <div className="checklist-item checklist-item-info">
                                  <div className="checklist-info">
                                    <h5 className="checklist-title mb-0">
                                      Father's Phone No.
                                    </h5>
                                    <small>{data.father_phone}</small>
                                  </div>
                                </div>
                              </ListGroupItem>
                            </Col>
                            <Col>
                              <ListGroupItem className="checklist-entry flex-column align-items-start py-4 px-4">
                                <div className="checklist-item checklist-item-info">
                                  <div className="checklist-info">
                                    <h5 className="checklist-title mb-0">
                                    Mother Phone
                                    </h5>
                                    <small>{data.mother_phone}</small>
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
                                      Parent Address
                                    </h5>
                                    <small>{data.parent_address}</small>
                                  </div>
                                </div>
                              </ListGroupItem>
                            </Col>
                          </Row>
                        </ListGroup>
                      )}
                    </TabPane>
                  </TabContent>
                </CardBody>
              </Card>
            </div>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default Staffdetails;
