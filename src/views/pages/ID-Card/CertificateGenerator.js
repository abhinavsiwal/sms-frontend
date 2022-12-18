import React, { useEffect, useState, useRef } from 'react'
import SimpleHeader from "components/Headers/SimpleHeader.js";
import {schoolProfile} from "api/school"
import { PrinterOutlined } from "@ant-design/icons";
import { isAuthenticated } from "api/auth";
import { ToastContainer, toast } from "react-toastify";
import "./style.css"
import { CKEditor } from '@ckeditor/ckeditor5-react';
import UploadAdapter from '../../../shared/upload-adapter';
import ReactHtmlParser from "react-html-parser"
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { useReactToPrint } from "react-to-print";

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


function CertificateGenerator() {
  const [content,setContent] = useState(`This is to certify that <strong>Mr./Ms./Mrs.</strong> _ _ _ _ _ _ _ _ _ _ _ _ has successfully secured _ _ _ _ _ _ position  
      in _ _ _ _ _ _ _ _ competition .`)
  const componentRef = useRef();

  const [color1,setColor1] = useState("#ffffff")
  const [watermark,setWatermark] = useState("N")
  const { user ,token} = isAuthenticated();
  const [checked,setChecked] = useState(false) 
  const [logo,setLogo] = useState("")
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
  const watermarkHandler = (e) =>{
    if(e.target.checked){
      setChecked(e.target.checked)
      setWatermark("Y")
    }else{
      setWatermark("N")
      setChecked(e.target.checked)
    }
  }

  useEffect(() =>{
    fetchData()
  },[])

  function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  }
  const handlePrint = useReactToPrint({
    content: () => componentRef.current, 
  });

  const setDataFromCKEditor = (e,editor) =>{
    setContent(editor.getData())

  }
  return (
    
    <>
        <SimpleHeader name="Generate Certificate" parentName="Document Store" />   
            <Container className="mt--6 shadow-lg" fluid>
                <Card>
                  <CardBody>
                    <Row>
                      <Col md="12" className='d-flex justify-content-between align-items-center' >
                        <h1>Generate Certificate</h1>
                        <Button onClick={handlePrint} color="primary">
                            <PrinterOutlined />
                            &nbsp;  
                            Print
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
                      <Col md="4" className='d-flex align-items-center'>
                        <input onChange={watermarkHandler} checked={checked ? true : false} type='checkbox' />
                        &nbsp;
                        &nbsp;
                        <Label style={{
                          margin:"0",
                          fontWeight:"700",
                          color:"#000"
                        }}>
                            WaterMark
                        </Label>
                      </Col>
                    </Row>
                    <Row className='mt-4'>
                        <Col md='12'>
                        <div ref={componentRef} className='certificate__wrapper' style={{
                                backgroundImage: `linear-gradient(rgba(${hexToRgb(color1).r},${hexToRgb(color1).g},${hexToRgb(color1).b},70%) 100%, #fff 100%)`,
                                backgroundPosition:"center",
                                backgroundRepeat:"no-repeat",
                                backgroundSize:"contain",
                                backgroundOrigin:"center"
                            }}> 
                                <div className='outline__one'>
                                    <div className='outline__two' style={{
                                      backgroundImage: checked ? `linear-gradient(rgba(${hexToRgb(color1).r},${hexToRgb(color1).g},${hexToRgb(color1).b},70%) 100%, #fff 100%), url(${logo})` : null,
                                      backgroundPosition:"center",
                                      backgroundRepeat:"no-repeat",
                                      backgroundSize:"contain",
                                      backgroundOrigin:"center"
                                    }}>
                                        <div className='schoolName'>
                                            <img className='logo_certificate' src={logo} alt='logo'/>
                                            <h1>{dataSchool.schoolname}</h1>
                                        </div>
                                        <div className='certificate'>
                                            <h2>CERTIFICATE OF PARTICIPATION</h2>
                                        </div>
                                        <div className='content'>
                                          <p className='add__content' style={{
                                              fontSize: '2rem',
                                              textAlign: 'center',
                                              padding: '1rem',
                                              fontStyle: 'italic',
                                              marginBottom: '0'
                                          }}>
                                            {ReactHtmlParser(content)}
                                          </p>
                                        </div>
                                        <div className='date__signature'>
                                          <div>
                                            <span>
                                              <strong style={{fontSize:'1.1rem'}}>DATE : _ _ _ _ _ _</strong>
                                            </span>
                                          </div>
                                          <div>
                                            <strong style={{fontSize:'1.1rem'}}>SIGNATURE : _ _ _ _ _ _</strong>
                                          </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Col>
                    </Row>
                    <Row className='mt-4'>
                      <Col md='12'>
                      <CKEditor
                          editor={ ClassicEditor }
                          data = {content}
                          onChange={(e,editor) =>{
                            setDataFromCKEditor(e,editor)
                          }}
                      />
                      </Col>
                    </Row>
                    </CardBody>
                </Card>
            </Container>
    </>
  )
}

export default CertificateGenerator