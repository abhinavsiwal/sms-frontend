/*!

=========================================================
* Argon Dashboard PRO React - v1.2.1
=========================================================

* Product Page: https://www.creative-tim.com/product/argon-dashboard-pro-react
* Copyright 2021 Creative Tim (https://www.creative-tim.com)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
// reactstrap components
import React, { useState } from 'react';
import { Card, CardHeader, CardBody, Container, Row, Col, Button, CardImg, Nav, NavItem, NavLink, TabContent, TabPane } from 'reactstrap';
// core components
import SimpleHeader from 'components/Headers/SimpleHeader.js';

import { FaEdit } from 'react-icons/fa';
import { isAuthenticated } from "api/auth";
function StudentProfile() {
  // 1 -> Details, 2 -> Documents, 3 -> Attendance
  const [activeTab, setActiveTab] = useState('1');
  const { user} = isAuthenticated();
  // console.log(user);
  return (
    <>
      <SimpleHeader name="Student Profile" />
      <Container className="mt--6" fluid>
        <Row>
          <Col lg="4">
            <div className="card-wrapper">
              <Card>
                <CardImg
                  alt="..."
                  src="https://colorlib.com/polygon/kiaalap/img/profile/1.jpg"
                  top
                  className="p-4"
                />
                <CardBody>
                  <Row>
                    <Col align="center">
                      <h4 className="mt-3 mb-1">Name</h4>
                      <span className="text-md">{user.firstname+" "+user.lastname}</span>
                    </Col>
                    {/* <Col align="center">
                      <h4 className="mt-3 mb-1">Class</h4>
                      <span className="text-md">Not Available</span>
                    </Col> */}
                  </Row>
                  <Row>
                    {/* <Col align="center">
                      <h4 className="mt-3 mb-1">Section</h4>
                      <span className="text-md">Not Available</span>
                    </Col> */}
                    <Col align="center">
                      <h4 className="mt-3 mb-1">Phone</h4>
                      <span className="text-md">{user.phone}</span>
                    </Col>
                  </Row>
                  <Row>
                    <Col align="center">
                      <h4 className="mt-3 mb-1">Address</h4>
                      <span className="text-md">Not Available</span>
                    </Col>
                    <Col align="center">
                      <h4 className="mt-3 mb-1">Email</h4>
                      <span className="text-md">{user.email}</span>
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
                      </Nav>
                    </Col>
                    <Col className="text-right">
                      <Button
                        className="btn-icon"
                        color="primary"
                        type="button"
                      >
                        <span className="btn-inner--icon">
                          <FaEdit />
                        </span>
                      </Button>
                    </Col>
                  </Row>
                </CardHeader>
                <CardBody>
                  <Row className="ml-2">
                    <TabContent activeTab={activeTab}>
                      <TabPane tabId="1">Details</TabPane>
                      <TabPane tabId="2">Documents</TabPane>
                      <TabPane tabId="3">Attendance</TabPane>
                    </TabContent>
                  </Row>
                </CardBody>
              </Card>
            </div>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default StudentProfile;
