import React, { useState ,useEffect,useRef} from 'react'
import SimpleHeader from "components/Headers/SimpleHeader.js";
import { SearchOutlined } from "@ant-design/icons";
import { Table } from "ant-table-extensions";
import { allStudents } from "api/student";
import { isAuthenticated } from "api/auth";
import { PrinterOutlined } from "@ant-design/icons";
import Loader from "components/Loader/Loader";
import { useReactToPrint } from "react-to-print";
import {schoolProfile} from "api/school"
import axios from 'axios';
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
  ModalHeader,
  ModalFooter,
} from "reactstrap";

function GenerateIdCard() {
  const [checked,setChecked] = useState(false) 
  const componentRef = useRef();
  const [loading, setLoading] = useState(false);
  const [loadingID, setLoadingID] = useState(false);
  const [pageCount, setPageCount] = useState(0);
  const [studentList, setStudentList] = useState([]);
  const [currentItems, setCurrentItems] = useState(null);
  const itemsPerPage = 9;
  const [itemOffset, setItemOffset] = useState(0);
  const { user, token } = isAuthenticated();
  const [color1,setColor1] = useState("#ffffff")
  const [color2,setColor2] = useState("#ffffff")
  const [stuData,setStuData] = useState({})
  const [logo,setLogo] = useState("")
  const [className,setClassName] = useState("")
  const [section,setSection] = useState("")
  const [phone,setPhone] = useState("")
  const [dob,setDob] = useState("")
  const [IDdataSchool,setIDDataSchool] = useState({
    address:"",
    schoolname:"",
    phone:""
  })
  const [dataSchool,setDataSchool] = useState({})


  const fetchStudents = async () => {
    setLoading(true)
    const endOffset = itemOffset + itemsPerPage;
    const res = await allStudents(
      user.school,
      user._id,
      token,
    );
    console.log(res)
    if (res.err) {
      return 
    } else {
      const data = [];
      for (let i = 0; i < res.length; i++) {
        data.push({
          key: i,
          profile: (
            <img style={{
              borderRadius: "50%",
              height:"50px",
              width:"50px"
            }} key={i + 1} src={res[i].tempPhoto} alt="profile"/>
          ),
          sid: res[i].SID,
          name: res[i].firstname + " " + res[i].lastname,
          class: res[i].class && res[i].class.name,
          section: res[i].section && res[i].section.name,
          select:(
            <div key={i + 1} style={{
              display:"flex",
              justifyContent:"center",
              alignItems:"center",
              width:"100%",
              height:"100%"
            }}>
              <Input
                type="checkbox"
                onChange={(e) => printChecked(e,res[i].SID,i+1)}
              />
            </div>
          ),
          action: (
            <h5 key={i + 1} className="mb-0">
                <Button onClick={() => getIdCard(res[i].SID)} color="primary">
                  Generate
                </Button>
            </h5>
          ),
        });
      }
      setStudentList(data);
      setCurrentItems(data.slice(itemOffset, endOffset));
      setPageCount(Math.ceil(data.length / itemsPerPage));
      setLoading(false);
    }
  };

  const printChecked = (e,id,pos) =>{
  }

  useEffect(() => {
    fetchStudents();
  }, [itemOffset, itemsPerPage]);

  const handlePrint = useReactToPrint({
    content: () => componentRef.current, 
  });

  // const genImg = async () =>{
  //   const element = componentRef.current;
  //   const canvas = await html2canvas(element);

  //   const data = canvas.toDataURL('image/jpg');
  //   const link = document.createElement('a');

  //   if (typeof link.download === 'string') {
  //     link.href = data;
  //     link.download = 'image.jpg';

  //     document.body.appendChild(link);
  //     link.click();
  //     document.body.removeChild(link);
  //   } else {
  //     window.open(data);
  //   }
  // }

  const handlePrintAndImg = () =>{
    handlePrint()
    // genImg()
  }

  const columns = [
    {
      title: "PROFILE",
      dataIndex: "profile",
      align: "left",
    },
    {
      title: "ID",
      dataIndex: "sid",
      align: "left",
      sorter: (a, b) => a.description > b.description,
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm }) => {
        return (
          <>
            <Input
              autoFocus
              placeholder="Type text here"
              value={selectedKeys[0]}
              onChange={(e) => {
                setSelectedKeys(e.target.value ? [e.target.value] : []);
                confirm({ closeDropdown: false });
              }}
              onBlur={() => {
                confirm();
              }}
            ></Input>
          </>
        );
      },
      filterIcon: () => {
        return <SearchOutlined />;
      },
      onFilter: (value, record) => {
        return record.description.toLowerCase().includes(value.toLowerCase());
      },
    },
    {
      title: "NAME",
      dataIndex: "name",
      align: "left",
      sorter: (a, b) => a.from > b.from,
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm }) => {
        return (
          <>
            <Input
              autoFocus
              placeholder="Type text here"
              value={selectedKeys[0]}
              onChange={(e) => {
                setSelectedKeys(e.target.value ? [e.target.value] : []);
                confirm({ closeDropdown: false });
              }}
              onBlur={() => {
                confirm();
              }}
            ></Input>
          </>
        );
      },
      filterIcon: () => {
        return <SearchOutlined />;
      },
      onFilter: (value, record) => {
        return record.from.toLowerCase().includes(value.toLowerCase());
      },
    },
    {
      title: "ClASS",
      dataIndex: "class",
      align: "left",
      sorter: (a, b) => a.to > b.to,
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm }) => {
        return (
          <>
            <Input
              autoFocus
              placeholder="Type text here"
              value={selectedKeys[0]}
              onChange={(e) => {
                setSelectedKeys(e.target.value ? [e.target.value] : []);
                confirm({ closeDropdown: false });
              }}
              onBlur={() => {
                confirm();
              }}
            ></Input>
          </>
        );
      },
      filterIcon: () => {
        return <SearchOutlined />;
      },
      onFilter: (value, record) => {
        return record.to.toLowerCase().includes(value.toLowerCase());
      },
    },
    {
      title: "SECTION",
      dataIndex: "section",
      align: "left",
      sorter: (a, b) => a.to > b.to,
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm }) => {
        return (
          <>
            <Input
              autoFocus
              placeholder="Type text here"
              value={selectedKeys[0]}
              onChange={(e) => {
                setSelectedKeys(e.target.value ? [e.target.value] : []);
                confirm({ closeDropdown: false });
              }}
              onBlur={() => {
                confirm();
              }}
            ></Input>
          </>
        );
      },
      filterIcon: () => {
        return <SearchOutlined />;
      },
      onFilter: (value, record) => {
        return record.to.toLowerCase().includes(value.toLowerCase());
      },
    },
    {
      title: "SELECT",
      dataIndex: "select",
      align: "center",
      key:"select"
    },

    {
      title: "Action",
      key: "action",
      dataIndex: "action",
      fixed: "right",
      align: "left",
    },
  ];

  const [modal, setModal] = useState(false);

  const getStudentData = async (id) =>{
    setLoadingID(true)
    var axios = require('axios');
    var data = JSON.stringify({
      "SID": id
    });

    var config = {
      method: 'post',
      url: `${process.env.REACT_APP_API_URL}/api/school/student/search/SID/${user._id}`,
      headers: { 
        'Authorization': 'Bearer ' + token, 
        'Content-Type': 'application/json'
      },
      data : data
    };

    axios(config)
    .then(function (response) {
      console.log(response.data[0])
      setStuData(response.data[0])
      setClassName(response.data[0].class.name)
      setPhone(response.data[0].phone)
      setSection(response.data[0].section.name)
      setDob(response.data[0].date_of_birth)
      setLoadingID(false)
    })
    .catch(function (error) {
      setLoadingID(false)
      console.log(error);
    });

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
      setColor1(res.data.color_1)
      setColor2(res.data.color_2)
      if(res.data.watermark === 'Y'){
        setChecked(true)
      }else{
        setChecked(false)
      }
      console.log(res.data)
      setIDDataSchool({
        address: res.data.address,
        schoolname: res.data.name,
        phone : res.data.contact_no,
      })
    }).catch((err) =>{
      console.log(err.message)
    })
  }

  const getSchoolData = async () =>{
    const res = await schoolProfile(
      user.school,
      user._id
    );
    setDataSchool({
      city:res.data.city,
      state:res.data.state,
      country:res.data.country,
      pincode:res.data.pincode
    })
    setLogo(res.data.photo)
  }

  const getIdCard = async (stu_id) =>{
    getSchoolData()
    getIdCardData()
    getStudentData(stu_id)
    setModal(!modal)
  }  
  const toggle = () => setModal(!modal);

  const formatDate = (changeDate) =>{
    const date = new Date(changeDate);
    const yyyy = date.getFullYear();
    let mm = date.getMonth() + 1;
    let dd = date.getDate();
    if (dd < 10) dd = '0' + dd;
    if (mm < 10) mm = '0' + mm;
    const formattedDate = dd + '-' + mm + '-' + yyyy;
    return formattedDate
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
           <SimpleHeader name="Generate Card" parentName="Document Store" />   
            <Container className="mt--6 shadow-lg" fluid>
                <Card>
                  <CardBody>
                  <Row>
                      <Col md="3">
                        <Input
                          id="example4cols2Input"
                          placeholder="Student Name"
                          type="number"
                          required
                        />
                      </Col>
                      <Col md="2">
                        <Input
                          id="example4cols2Input"
                          placeholder="Student ID"
                          type="number"
                          required
                        />
                      </Col>
                      <Col md="2">
                        <Input
                          id="exampleFormControlSelect3"
                          type="select"
                          value={""}
                          required
                        >
                          <option value="" disabled selected>
                            Select Class
                          </option>
                          <option>Class A</option>
                          <option>Class B</option>
                          <option>Class I</option>
                          <option>Class II</option>
                          <option>Class III</option>
                          <option>Class IV</option>
                          <option>Class V</option>
                          <option>Class VI</option>
                          <option>Class VII</option>
                          <option>Class VIII</option>
                          <option>Class IX</option>
                          <option>Class X</option>
                        </Input>
                      </Col>
                      <Col md="3">
                        <Input
                          id="exampleFormControlSelect3"
                          type="select"
                          value={""}
                          required
                        >
                          <option value="" disabled selected>
                            Select Section
                          </option>
                        </Input>
                      </Col>
                      <Col md="2" className='d-flex justify-content-end align-items-center'>
                        <Button color="primary">
                          <SearchOutlined />
                          &nbsp;
                          Search
                        </Button>
                      </Col>
                    </Row>
                    <Row className='mt-4'>
                      <Col md='12'>
                      {
                        loading ?  <Loader /> : 
                        <div
                          style={{ overflowX: "auto" }}
                        >
                          <Table
                            columns={columns}
                            dataSource={studentList}
                            pagination={{
                            pageSizeOptions: [
                                "5",
                                "10",
                                "30",
                                "60",
                                "100",
                                "1000",
                              ],
                              showSizeChanger: true,
                            }}
                            scroll={{x:true}}
                            style={{ whiteSpace: "pre" }}
                            exportFileName="details"
                          />
                        </div>
                      }
                      </Col>
                    </Row> 
                    <Row className='mt-4'>
                      <Col md='12' className='d-flex justify-content-center'>
                      <Button color="primary">
                        <PrinterOutlined />
                        &nbsp;
                        Print ALL
                      </Button>
                      </Col>
                    </Row>
                  </CardBody>
                </Card>
            </Container>
            <Row>
              <Col md='12'>    
                <Modal size="lg" style={{maxWidth: '700px', width: '100%'}} isOpen={modal}
                  toggle={toggle}
                  modalTransition={{ timeout: 500 }}>
                  <ModalHeader>Print ID Card</ModalHeader>
                  <ModalBody style={{padding:"2rem"}}>

                      {loadingID ?
                      <Loader />
                      :
                      <div ref={componentRef} className='id__card__wrapper' style={{
                        backgroundImage:`linear-gradient(rgba(${hexToRgb(color1).r},${hexToRgb(color1).g},${hexToRgb(color1).b},70%) 46%, ${color2} 80%)`,
                        backgroundPosition:"center",
                        backgroundRepeat:"no-repeat",
                        backgroundSize:"contain",
                        backgroundOrigin:"center"
                    }}> 
                          <header className='identityCard__header d-flex'>
                          <img className='logo' src={logo} alt='logo'/>
                          <div className='d-flex flex-column text-center ml-3'>
                            <div>{IDdataSchool.schoolname}</div>
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
                              <img src={stuData.tempPhoto} alt="profile_image" />
                            </div>
                          </div>
                          <ul className="identityCard__list list-unstyled">
                            <li><strong>Name :</strong> <span>{stuData.firstname + " " + stuData.lastname}</span></li>
                            <li><strong>Class :</strong> <span>Class-{className}</span></li>
                            <li><strong>Section :</strong> <span>Section-{section}</span></li>
                            <li><strong>Roll No. :</strong> <span>{stuData.roll_number}</span></li>
                            <li><strong>Gender :</strong> <span>{stuData.gender}</span></li>
                            <li><strong>Date of birth :</strong> <span>{formatDate(dob)}</span></li>
                            <li><strong>Contact No. :</strong> <span>+91 {phone}</span></li>
                            <li><strong>Blood Group :</strong> <span>{stuData.bloodgroup}</span></li>
                          </ul>
                        </div>
                        <footer className="identityCard__footer">
                          <div className="filled">
                            <span>
                              {IDdataSchool.address} - {dataSchool.city}, {dataSchool.state} - {dataSchool.pincode} - +91 {IDdataSchool.phone}
                            </span>
                          </div>
                        </footer>
                      </div> 
                      }
                  </ModalBody>
                  <ModalFooter className='d-flex justify-content-center'>
                    <Button color='primary' onClick={handlePrintAndImg}>
                      <PrinterOutlined />
                      &nbsp;
                      Print</Button>
                    <Button color='danger' onClick={toggle}>Cancel</Button>
                  </ModalFooter>
              </Modal>
              </Col>
            </Row>
    </>
  )
}

export default GenerateIdCard