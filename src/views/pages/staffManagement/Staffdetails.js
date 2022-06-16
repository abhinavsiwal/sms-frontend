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
  // console.log(data);
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
      <SimpleHeader name="Staff Profile" parentName="Staff Management" />
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
                      <h4 className="mt-3 mb-1">Department</h4>
                      <span className="text-md">
                        {data.department && data.department.name}
                      </span>
                    </Col>
                  </Row>
                  <Row>
                    <Col align="center">
                      <h4 className="mt-3 mb-1">Job</h4>
                      <span className="text-md">{data.job}</span>
                    </Col>
                    <Col align="center">
                      <h4 className="mt-3 mb-1">Phone</h4>
                      <span className="text-md">+91 {data.phone}</span>
                    </Col>
                  </Row>
                  <Row>
                    <Col align="center">
                      <h4 className="mt-3 mb-1">Present Address</h4>
                      <span className="text-md">{data.present_address}</span>
                    </Col>
                    <Col align="center">
                      <h4 className="mt-3 mb-1">Permanent Address</h4>
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
                                  <small>
                                    {data.joining_date && getFormattedDate(data.joining_date)}
                                  </small>
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
                                    Phone no
                                  </h5>
                                  <small>{data.phone}</small>
                                </div>
                              </div>
                            </ListGroupItem>
                          </Col>
                          <Col md="4">
                            <ListGroupItem className="checklist-entry flex-column align-items-start py-4 px-4">
                              <div className="checklist-item checklist-item-success">
                                <div className="checklist-info">
                                  <h5 className="checklist-title mb-0">
                                    Alternate Phone no
                                  </h5>
                                  <small>{data.alternate_phone}</small>
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
                                    Email
                                  </h5>
                                  <small>{data.email}</small>
                                </div>
                              </div>
                            </ListGroupItem>
                          </Col>
                          <Col>
                            <ListGroupItem className="checklist-entry flex-column align-items-start py-4 px-4">
                              <div className="checklist-item checklist-item-info">
                                <div className="checklist-info">
                                  <h5 className="checklist-title mb-0">
                                    Salary
                                  </h5>
                                  <small>{data.salary}</small>
                                </div>
                              </div>
                            </ListGroupItem>
                          </Col>
                          <Col>
                            <ListGroupItem className="checklist-entry flex-column align-items-start py-4 px-4">
                              <div className="checklist-item checklist-item-success">
                                <div className="checklist-info">
                                  <h5 className="checklist-title mb-0">Job</h5>
                                  <small>{data.job}</small>
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
                      <ListGroup flush>
                        <Row>
                          <Col>
                            <ListGroupItem className="checklist-entry flex-column align-items-start py-4 px-4">
                              <div className="checklist-item checklist-item-success">
                                <div className="checklist-info">
                                  <h5 className="checklist-title mb-0">
                                    Contact Person Country
                                  </h5>
                                  <small>{data.contact_person_country}</small>
                                </div>
                              </div>
                            </ListGroupItem>
                          </Col>
                          <Col>
                            <ListGroupItem className="checklist-entry flex-column align-items-start py-4 px-4">
                              <div className="checklist-item checklist-item-info">
                                <div className="checklist-info">
                                  <h5 className="checklist-title mb-0">
                                    Contact Person State
                                  </h5>
                                  <small>{data.contact_person_state}</small>
                                </div>
                              </div>
                            </ListGroupItem>
                          </Col>
                          <Col>
                            <ListGroupItem className="checklist-entry flex-column align-items-start py-4 px-4">
                              <div className="checklist-item checklist-item-info">
                                <div className="checklist-info">
                                  <h5 className="checklist-title mb-0">
                                    Contact Person City
                                  </h5>
                                  <small>+91 {data.contact_person_city}</small>
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
                                    Contact Person Name
                                  </h5>
                                  <small>{data.contact_person_name}</small>
                                </div>
                              </div>
                            </ListGroupItem>
                          </Col>
                          <Col>
                            <ListGroupItem className="checklist-entry flex-column align-items-start py-4 px-4">
                              <div className="checklist-item checklist-item-info">
                                <div className="checklist-info">
                                  <h5 className="checklist-title mb-0">
                                    Contact Person Phone
                                  </h5>
                                  <small>{data.contact_person_phone}</small>
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
                    
                      </ListGroup>
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
