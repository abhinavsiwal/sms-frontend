import React, { useEffect, useState } from 'react'
import SimpleHeader from "components/Headers/SimpleHeader.js";
import "./style.css"
import {schoolProfile} from "api/school"
import { isAuthenticated } from "api/auth";
import { ToastContainer, toast } from "react-toastify";

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
import axios from 'axios';

function SetIdCard() {
  const [color1,setColor1] = useState("#ffffff")
  const [color2,setColor2] = useState("#ffffff")
  const { user ,token} = isAuthenticated();
  const [logo,setLogo] = useState("")
  const [watermark,setWatermark] = useState("N")
  const [checked,setChecked] = useState(false) 
  const myData = new FormData()
  
  const [data,setData] = useState({
    address:"",
    schoolname:"",
    phone:""
  })

  const [dataSchool,setDataSchool] = useState({
    address:"",
    schoolname:"",
    phone:""
  })

  const fetchData = async () =>{
    const res = await schoolProfile(
      user.school,
      user._id
    );
    setDataSchool({
      address: res.data.address,
      schoolname: res.data.schoolname,
      phone : res.data.phone
    })
    setLogo(res.data.photo)
  }

  const getIdCardData = () =>{
    const url = `${process.env.REACT_APP_API_URL}/api/school/id_card/get_id_card/${user.school}/${user._id}`
    const config = {
      headers:{
        'Authorization': 'Bearer ' + token,
        "Content-Type" : "multipart/form-data"
      }
    }

    axios.post(url,{},config)
    .then((res) =>{
      console.log(res.data)
      setData({
        address: res.data.address,
        schoolname: res.data.name,
        phone : res.data.contact_no
      })
      if(res.data.watermark === 'Y'){
        setChecked(true)
      }else{
        setChecked(false)
      }
      setColor1(res.data.color_1)
      setColor2(res.data.color_2)
      
    }).catch((err) =>{
      console.log(err.message)
    })
  }
  
  useEffect(() =>{
    fetchData()
    getIdCardData()
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

  const watermarkHandler = (e) =>{
    if(e.target.checked){
      setChecked(e.target.checked)
      setWatermark("Y")
    }else{
      setWatermark("N")
      setChecked(e.target.checked)
    }
  }

  const saveHandler = () =>{

    myData.append("name",data.schoolname || dataSchool.schoolname)
    myData.append("address",data.address || dataSchool.address)
    myData.append("contact_no",data.phone || dataSchool.phone)
    myData.append("color_1",color1)
    myData.append("color_2",color2)
    myData.append("school",user.school)
    myData.append("watermark",watermark)


    const url = `${process.env.REACT_APP_API_URL}/api/school/id_card/update_id_card/${user.school}/${user._id}`
    const config = {
      headers:{
        'Authorization': 'Bearer ' + token,
      }
    }

    axios.post(url,myData,config)
    .then((res) =>{
      console.log(res.data)
      toast.success("ID card set Successfully");
      getIdCardData()
    }).catch((err) =>{
      console.log(err.message)
    })
  }

  function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  }
  
  return (
    <>
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
          <SimpleHeader name="Set Id Card" parentName="Document Store" />   
            <Container className="mt--6 shadow-lg" fluid>
                <Card>
                  <CardBody>
                    <Row>
                      <Col md="12" className='d-flex justify-content-between align-items-center' >
                        <h1>Identity Card</h1>
                        <Button onClick={saveHandler} color="primary">
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
                        <input onChange={watermarkHandler} checked={checked ? true : false} type='checkbox' />
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
                          value={data.schoolname || dataSchool.schoolname}
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
                          value={data.address || dataSchool.address}
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
                          value={data.phone || dataSchool.phone}
                          required
                        />
                      </Col>
                    </Row>
                    <Row className='d-flex justify-content-center mt-5'>
                      <Col md='12'>
                        <Row className='d-flex justify-content-center mt-5'>
                          <Col md='12'>
                            <div className='id__card__wrapper' style={{
                                backgroundImage:`linear-gradient(rgba(${hexToRgb(color1).r},${hexToRgb(color1).g},${hexToRgb(color1).b},70%) 46%, ${color2} 80%)`,
                                backgroundPosition:"center",
                                backgroundRepeat:"no-repeat",
                                backgroundSize:"contain",
                                backgroundOrigin:"center"
                            }}> 
                                <header className='identityCard__header d-flex'>
                                  <img className='logo' src='https://smsproject-bucket.s3.amazonaws.com/tRIAUgyQ4gES0b3IXYYM.png?AWSAccessKeyId=AKIA4C5LUTOBOVJHFUHQ&Expires=1671459793&Signature=a91hUmUnKkF%2FgObF6wpjiG%2FmsWM%3D' alt='logo'/>
                                  <div className='d-flex flex-column text-center ml-3'>
                                    <div>YOUR SCHOOL NAME HERE</div>
                                    <div>Identity Card</div>
                                  </div>
                                </header>
                                <div className="identityCard__profile" style={{
                                      backgroundImage: checked ? `linear-gradient(rgba(${hexToRgb(color1).r},${hexToRgb(color1).g},${hexToRgb(color1).b},70%) 46%, ${color2} 100%), url(${logo})`: null,
                                      backgroundPosition:"center",
                                      backgroundRepeat:"no-repeat",
                                      backgroundSize:"contain",
                                      backgroundOrigin:"center"
                                  }}>
                                  <div className='id__card'>
                                    <div className="identityCard__visual">
                                    <img  src='https://smsproject-bucket.s3.amazonaws.com/47BLwqISuhw39dZ8NDAl.png?AWSAccessKeyId=AKIA4C5LUTOBOVJHFUHQ&Expires=1671459588&Signature=URb2Q%2FLYvq%2BXnxpts0hINVElPOU%3D' alt='logo'/>
                                    </div>
                                  </div>
                                  <ul className="identityCard__list list-unstyled">
                                    <li><strong>Name :</strong> <span>John Doe</span></li>
                                    <li><strong>Class :</strong> <span>Class-A</span></li>
                                    <li><strong>Section :</strong> <span>Section A</span></li>
                                    <li><strong>Roll No. :</strong> <span>123456</span></li>
                                    <li><strong>Gender :</strong> <span>Male</span></li>
                                    <li><strong>Date of birth :</strong> <span>25/03/2017</span></li>
                                    <li><strong>Contact No. :</strong> <span>+91 9612963449</span></li>
                                    <li><strong>Blood Group :</strong> <span>O+</span></li>
                                  </ul>
                                </div>
                                <footer className="identityCard__footer">
                                  <div className="filled">
                                    <span>
                                      S. Hengcham, Bethesda Mun, K. Mongjang Road, B.P.O - Koite Churachandpur, Manipur - XXXXXX - +91 XXXXX-XXXXX
                                    </span>
                                  </div>
                                </footer>
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