import React ,{useState}from 'react'
import SimpleHeader from "components/Headers/SimpleHeader.js";
import Loader from "components/Loader/Loader";
import { SearchOutlined } from "@ant-design/icons";

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
  import { Table } from "ant-table-extensions";
  import { CSVLink } from "react-csv";
  import { isAuthenticated } from "api/auth";
import { useEffect } from 'react';
import axios from 'axios';
function StudentAttendanceReports() {

  const { user, token } = isAuthenticated();
  const [reportList,setReportList] = useState([])
  const [loading, setLoading] = useState(false);
  const [classes,setClasses] = useState([])
  const [sessions,setSessions] = useState([])
  const [clas,setClas] = useState("")
  const [sec,setSec] = useState("")
  const [session,setSession] = useState("")
  const [selectClass,setSelectClass] = useState({})

  const formData = new FormData()


    const getReports = () =>{
      formData.append('month','10')
      formData.append('year','2022')
      setLoading(false)
      var config = {
        method: 'post',
        url: `${process.env.REACT_APP_API_URL}/api/reports/student_attandance/${user.school}/${user._id}`,
        headers: { 
          'Authorization': 'Bearer ' + token,
          'Content-Type' : 'multipart/form-data'
        },
        data:formData
      };
      axios(config)
      .then(function (response) {
        console.log(response.data);
      }).catch((error) =>{
        console.log(error)
      })
    }

    const getAllClasses = () =>{
      var config = {
        method: 'get',
        url: `${process.env.REACT_APP_API_URL}/api/school/class/all/${user.school}/${user._id}`,
        headers: { 
          'Authorization': 'Bearer ' + token
        }
      };
      
      axios(config)
      .then(function (response) {
        setClasses(response.data);
      })
    }

    const getAllSessions = () =>{
      var config = {
        method: 'get',
        url: `${process.env.REACT_APP_API_URL}/api/school/session/all/${user.school}/${user._id}`,
        headers: { 
          'Authorization': 'Bearer ' + token
        }
      };
      
      axios(config)
      .then(function (response) {
        setSessions(response.data);
      })
    }

    const classHandler = (e) =>{
      setClas(e.target.value)
      var section = classes.find((item) => e.target.value.toString() === item._id.toString())
      setSelectClass(section)
    }

    const sectionHandler = (e) =>{
      setSec(e.target.value)
    }
    const sessionHandler = (e) =>{
      setSession(e.target.value)
    }
   
    useEffect(() =>{
        getReports()
        getAllClasses()
        getAllSessions()
    },[])

    const columns = [
        {
          title: "Sr No.",
          dataIndex: "sno",
          align: "left",
        },
        {
          title: "NAME",
          dataIndex: "name",
          align: "left",
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
            title: "1",
            dataIndex: "1",
            align: "left",
        },
        {
            title: "2",
            dataIndex: "2",
            align: "left",
        },
        {
            title: "3",
            dataIndex: "3",
            align: "left",
        },
        {
            title: "4",
            dataIndex: "4",
            align: "left",
        },
        {
            title: "5",
            dataIndex: "5",
            align: "left",
        },
        {
            title: "6",
            dataIndex: "6",
            align: "left",
        },
        {
            title: "7",
            dataIndex: "7",
            align: "left",
        },
        {
            title: "8",
            dataIndex: "8",
            align: "left",
        },
        {
            title: "9",
            dataIndex: "9",
            align: "left",
        },
        {
            title: "10",
            dataIndex: "10",
            align: "left",
        },
        {
            title: "11",
            dataIndex: "11",
            align: "left",
        },
        {
            title: "12",
            dataIndex: "12",
            align: "left",
        },
        {
            title: "13",
            dataIndex: "13",
            align: "left",
        },
        {
            title: "14",
            dataIndex: "14",
            align: "left",
        },
        {
            title: "15",
            dataIndex: "15",
            align: "left",
        },
        {
            title: "16",
            dataIndex: "16",
            align: "left",
        },
        {
            title: "17",
            dataIndex: "17",
            align: "left",
        },
        {
            title: "18",
            dataIndex: "18",
            align: "left",
        },
        {
            title: "19",
            dataIndex: "19",
            align: "left",
        },
        {
            title: "20",
            dataIndex: "20",
            align: "left",
        },
        {
            title: "21",
            dataIndex: "21",
            align: "left",
        },
        {
            title: "22",
            dataIndex: "22",
            align: "left",
        },
        {
            title: "23",
            dataIndex: "23",
            align: "left",
        },
        {
            title: "24",
            dataIndex: "24",
            align: "left",
        },
        {
            title: "25",
            dataIndex: "25",
            align: "left",
        },
        {
            title: "26",
            dataIndex: "26",
            align: "left",
        },
        {
            title: "27",
            dataIndex: "27",
            align: "left",
        },
        {
            title: "28",
            dataIndex: "28",
            align: "left",
        },
        {
            title: "29",
            dataIndex: "29",
            align: "left",
        },
        {
            title: "30",
            dataIndex: "30",
            align: "left",
        },
        {
            title: "Total Days",
            dataIndex: "tdays",
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
            title: "Full Day Present",
            dataIndex: "fdayp",
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
            title: "Half Day Present",
            dataIndex: "hdayp",
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
            title: "Total Present",
            dataIndex: "tp",
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
            title: "Holidays (H)",
            dataIndex: "h",
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
            title: "Sundays (S)",
            dataIndex: "sunday",
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
            title: "Total Present+Holidays+Sundays",
            dataIndex: "totalpresent",
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
            title: "Total Absent",
            dataIndex: "totalabsent",
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

      ];
  return (
    <>
    <SimpleHeader name="Student Attendance" parentName="Reports" />   
        <Container className="mt--6 shadow-lg" fluid>
            <Card>
              <CardBody>
                <Row>
                <Col md="3">
                    <Input
                      id="exampleFormControlSelect3"
                      type="select"
                      value={clas}
                      onChange={classHandler}
                      required
                    >
                        <option value="" disabled selected>
                            Select Class
                          </option>
                          {
                            classes && classes.map((item,index) =>(
                              <option key={index} value={item._id}  >
                                {item.name}
                              </option>
                            ))
                          }
                    </Input>
                  </Col>
                  <Col md="3">
                    <Input
                      id="exampleFormControlSelect3"
                      type="select"
                      value={sec}
                      onChange={sectionHandler}
                      required
                    >
                      <option value="" disabled selected>
                            Select Section
                          </option>
                          {
                            selectClass.section && selectClass.section.map((item,index) =>(
                              <option key={index} value={item._id}>
                                {item.name}
                              </option>
                            ))
                          }
                    </Input>
                  </Col>
                  <Col md="3">
                    <Input
                      id="exampleFormControlSelect3"
                      type="select"
                      value={session}
                      onChange={sessionHandler}
                      required
                    >
                       <option value="" disabled selected>
                                Select Session
                            </option>
                            {
                            sessions && sessions.map((item,index) =>(
                              <option key={index} value={item._id}  >
                                {item.name}
                              </option>
                            ))
                          }
                    </Input>
                  </Col>
                  <Col md="3" className='d-flex justify-content-end align-items-center'>
                    <Button color="primary">
                      <SearchOutlined />
                      &nbsp;
                      Search
                    </Button>
                  </Col>
                </Row>
                <Row className='mt-4'>
                    <Col md="12">
                      <Button color='primary'>
                        Export To CSV
                      </Button>
                  </Col>
                </Row>
                <Row className='mt-4'>
                    <Col md="12">
                        <Row className='d-flex justify-content-center'>
                            <Col style={{border:"1px solid black",margin:"0" }} className='d-flex justify-content-center align-items-center'  md='2'><h4 style={{margin:"0.3rem 0" }}>Abbreviations</h4></Col>
                            <Col style={{border:"1px solid black"}} className='d-flex justify-content-center align-items-center' md='2'><h4 style={{margin:"0.3rem 0" }}>P - Full Day</h4></Col>
                            <Col style={{border:"1px solid black"}} className='d-flex justify-content-center align-items-center' md='2'><h4 style={{margin:"0.3rem 0" }}>H - Holiday</h4></Col>
                            <Col style={{border:"1px solid black"}} className='d-flex justify-content-center align-items-center' md='2'><h4 style={{margin:"0.3rem 0" }}>L - Leave</h4></Col>
                            <Col style={{border:"1px solid black"}} className='d-flex justify-content-center align-items-center' md='2'><h4 style={{margin:"0.3rem 0" }}>HD - Half Day</h4></Col>
                            <Col style={{border:"1px solid black"}} className='d-flex justify-content-center align-items-center' md='2'><h4 style={{margin:"0.3rem 0" }}>S - Sunday</h4></Col>                        
                        </Row>
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
                        dataSource={reportList}
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
              </CardBody>
            </Card>
        </Container>
    </>
  )
}

export default StudentAttendanceReports