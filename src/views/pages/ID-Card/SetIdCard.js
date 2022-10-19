import React, { useEffect, useState } from 'react'
import SimpleHeader from "components/Headers/SimpleHeader.js";
import { SearchOutlined,PrinterOutlined } from "@ant-design/icons";
import "./style.css"
import {schoolProfile} from "api/school"
import { isAuthenticated } from "api/auth";

import {
  Card,
  CardHeader,
  CardBody,
  Input,
  Container,
  Row,
  Col,
  Label,
  Button,
  CardImg,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Modal,
  ModalBody,
} from "reactstrap";
import IDCard from './IDCard';

function SetIdCard() {
  const [color1,setColor1] = useState("#ffffff")
  const [color2,setColor2] = useState("#ffffff")
  const { user } = isAuthenticated();
  const [logo,setLogo] = useState("")
  const [checked,setChecked] = useState(false) 
  const [data,setData] = useState({
    address:"",
    schoolname:"",
    phone:""
  })
  const fetchData = async () =>{
    const res = await schoolProfile(
      user.school,
      user._id
    );
    console.log(res.data)
    setData({
      address: res.data.address,
      schoolname: res.data.schoolname,
      phone : res.data.phone
    })
    setLogo(res.data.photo)
  }
  
  useEffect(() =>{
    fetchData()
  },[])

  const contactHandler = (e) =>{
    setData({
      ...data,
      phone:e.target.value
    })
  }
  const nameHandler = (e) =>{
    setData({
      ...data,
      schoolname:e.target.value
    })
  }
  const addressHandler = (e) =>{
    setData({
      ...data,
      address:e.target.value
    })
  }
  return (
    <>
          <SimpleHeader name="Set Id Card" parentName="Document Store" />   
            <Container className="mt--6 shadow-lg" fluid>
                <Card>
                  <CardBody>
                    <Row>
                      <Col md="12" className='d-flex justify-content-between align-items-center' >
                        <h1>Identity Card</h1>
                        <Button color="primary">
                          Save
                        </Button>
                      </Col>
                    </Row>
                    <Row className='mt-4'>
                      <Col md="4">
                        <Row>
                          <Col md="8">
                            <Input
                              id="example4cols2Input"
                              placeholder="Student Name"
                              type="text"
                              value={color1}
                              required
                            />
                          </Col>
                          <Col md="4">
                            <Input
                              id="example4cols2Input"
                              placeholder="Primary Color"
                              type="color"
                              onChange={(e) => (setColor1(e.target.value))}
                              value={color1}
                              required
                            />
                          </Col>
                        </Row>
                      </Col>
                      <Col md="4">
                        <Row>
                            <Col md="8">
                              <Input
                                id="example4cols2Input"
                                placeholder="Student Name"
                                type="text"
                                value={color2}
                                required
                              />
                            </Col>
                            <Col md="4">
                              <Input
                                id="example4cols2Input"
                                placeholder="Secondary Color"
                                type="color"
                                onChange={(e) => (setColor2(e.target.value))}
                                value={color2}
                                required
                              />
                            </Col>
                          </Row>
                      </Col>
                      <Col md="4" className='d-flex align-items-center'>
                        <input onChange={(e) => setChecked(e.target.checked)} type='checkbox' />
                        &nbsp;
                        &nbsp;
                        <Label style={{
                          margin:"0",
                          fontWeight:"700",
                          color:"#000"
                        }}>
                          Apply WaterMark
                        </Label>
                      </Col>
                    </Row>
                    <Row className='mt-4'>
                      <Col md='4'>
                        <Label>School Name</Label>
                      </Col>
                      <Col md='8'>
                        <Input
                          id="example4cols2Input"
                          placeholder="School Name"
                          type="text"
                          onChange={nameHandler}
                          value={data.schoolname}
                          required
                        />
                      </Col>
                    </Row>
                    <Row className='mt-3'>
                      <Col md='4'>
                        <Label>School Address</Label>
                      </Col>
                      <Col md='8'>
                        <Input
                          id="example4cols2Input"
                          placeholder="School Address"
                          type="text"
                          onChange={addressHandler}
                          value={data.address}
                          required
                        />
                      </Col>
                    </Row>
                    <Row className='mt-3'>
                      <Col md='4'>
                        <Label>School Contact</Label>
                      </Col>
                      <Col md='8'>
                        <Input
                          id="example4cols2Input"
                          placeholder="School Contact"
                          type="text"
                          onChange={contactHandler}
                          value={data.phone}
                          required
                        />
                      </Col>
                    </Row>
                    <Row className='d-flex justify-content-center mt-5'>
                      <Col md='6'>
                        <Row>
                          <Col md='12'>
                            <div className='id__card__wrapper' style={{
                                backgroundImage: checked ? `url(${logo})` : `linear-gradient(${color1} 46%, ${color2} 100%)`,
                                backgroundPosition:"center",
                                backgroundRepeat:"no-repeat",
                                backgroundSize:"cover"
                            }}> 
                              <IDCard />
                            </div>
                          </Col>
                        </Row>
                      </Col>
                    </Row>
                  </CardBody>
                </Card>
            </Container>
    </>
  )
}

export default SetIdCard