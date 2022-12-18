import React ,{useState,useEffect}from 'react'
import SimpleHeader from "components/Headers/SimpleHeader.js";
import Loader from "components/Loader/Loader";
import { SearchOutlined } from "@ant-design/icons";
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
  import { isAuthenticated } from "api/auth";

function SummaryReport() {
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
            title: "CLASS FEE",
            dataIndex: "class_fee",
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
          title: "TOTAL FEE DUE",
          dataIndex: "total_fee_due",
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
            title: "FEE RECEIVED",
            dataIndex: "fee_received",
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
            title: "Outstanding Summary",
            dataIndex: "outstanding_summary",
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
          let currentSession = response.data.find((item) => (item.status === "current"))
          setSession(currentSession._id)
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

      const getReports = () =>{
        setLoading(true)
        formData.append('session',session)
        var config = {
          method: 'post',
          url: `${process.env.REACT_APP_API_URL}/api/reports/summary_report/${user.school}/${user._id}`,
          headers: { 
            'Authorization': 'Bearer ' + token,
            'Content-Type' : 'multipart/form-data'
          },
          data:formData
        };
        axios(config)
        .then(function (response) {
            console.log(response.data)
            const data = [];
            for (let i = 0; i < response.data.length; i++) {
              let outStanding = parseInt(response.data[i].total) - parseInt(response.data[i].fee_received)
              data.push({
                key: i+1,
                class: response.data[i].name,
                section: "N/A",
                total_fee_due: "Rs. " + response.data[i].fee_due,
                fee_received : "Rs " + response.data[i].fee_received,
                class_fee: "Rs " + response.data[i].total,
                outstanding_summary : "Rs " + outStanding
              });
            }
            setReportList(data)
            setLoading(false)
        }).catch((error) =>{
          console.log(error)
        })
      }

      useEffect(() =>{
        setLoading(true)
        if(sessions.length === 0){
          getAllSessions()
          getAllClasses()
        }
      },[])

      useEffect(() =>{
        if(session !== ""){
          getReports()
        }
      },[session])

      const csvHandler = () =>{
        const csvData = [
          ...reportList
        ]
  
        const headers = [
          { label: "Sr No.", key: "key" },
          { label: "Class", key: "class" },
          { label: "Section", key: "section" },
          { label: "Class Fee", key: "class_fee" },
          { label: "Total Fee Due", key: "total_fee_due" },
          { label: "Fee Received", key: "fee_received" },
          { label: "Outstanding Summary", key: "outstanding_summary" },
        ];
  
        return {
          data: csvData,
          headers: headers,
          filename: 'Summary_Report.csv'
        };
      }

  return (
    <>
    <SimpleHeader name="Summary Reports" parentName="Reports" />   
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

export default SummaryReport