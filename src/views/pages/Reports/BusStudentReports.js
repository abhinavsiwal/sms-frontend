import React ,{useState,useEffect}from 'react'
import SimpleHeader from "components/Headers/SimpleHeader.js";
import Loader from "components/Loader/Loader";
import { SearchOutlined } from "@ant-design/icons";
  import { isAuthenticated } from "api/auth";
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
  import { Table } from "ant-table-extensions";
  import { CSVLink } from "react-csv";

function BusStudentReports() {
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


    const columns = [
      {
        title: "Sr No.",
        dataIndex: "key",
        align: "left",
      },
        {
          title: "Student ID",
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
      ];
   
      const getReports = () =>{
        setLoading(true)
        var config = {
          method: 'post',
          url: `${process.env.REACT_APP_API_URL}/api/reports/bus_report/${user.school}/${user._id}`,
          headers: { 
            'Authorization': 'Bearer ' + token
          }
        };
        
        axios(config)
        .then(function (response) {
          console.log(response.data)
          const data = [];
          for (let i = 0; i < response.data.length; i++) {
            data.push({
              key: i+1,
              sid: response.data[i].student.SID,
              name: response.data[i].student.firstname +" " + response.data[i].student.lastname,
              class :  response.data[i].class.name,
              section : response.data[i].section.name
            });
          }
          setReportList(data)
          setLoading(false)
        })
        .catch(function (error) {
          console.log(error);
        });
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


      const csvHandler = () =>{
        const csvData = [
          ...reportList
        ]
  
        const headers = [
          { label: "Sr No.", key: "key" },
          { label: "Student ID", key: "sid" },
          { label: "Name", key: "name" },
          { label: "Class", key: "class" },
          { label: "Section", key: "section" },
        ];
  
        return {
          data: csvData,
          headers: headers,
          filename: 'Bus_Student_Report.csv'
        };
      }

      const searchHHandler = () =>{
        formData.append("section",sec)
        formData.append("class",clas)
        formData.append("session",session)
        setLoading(true)
        var config = {
          method: 'post',
          url: `${process.env.REACT_APP_API_URL}/api/reports/bus_report/${user.school}/${user._id}`,
          headers: { 
            'Authorization': 'Bearer ' + token,
            'Content-Type' : 'multipart/form-data'
          },
          data : formData
        };
        axios(config)
        .then(function (response) {
          const data = [];
          for (let i = 0; i < response.data.length; i++) {
            data.push({
              key: i+1,
              sid: response.data[i].student.SID,
              name: response.data[i].student.firstname +" " + response.data[i].student.lastname,
              class :  response.data[i].class.name,
              section : response.data[i].section.name
            });
          }
          setReportList(data)
          setLoading(false)
        })
  
  
      }

  return (
    <>
    <SimpleHeader name="Bus Student Reports" parentName="Reports" />   
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
                    <Button color="primary" onClick={searchHHandler}>
                      <SearchOutlined />
                      &nbsp;
                      Search
                    </Button>
                  </Col>
                </Row>
                <Row className='mt-4'>
                    <Col md="12">
                        <Button color='primary' onClick={csvHandler}>
                          <CSVLink {...csvHandler()} style={{color:"white"}}>Export to CSV</CSVLink>
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

export default BusStudentReports