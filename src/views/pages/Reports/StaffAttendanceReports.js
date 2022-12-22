import React ,{useEffect, useState}from 'react'
import SimpleHeader from "components/Headers/SimpleHeader.js";
import Loader from "components/Loader/Loader";
import { SearchOutlined } from "@ant-design/icons";
  import { CSVLink } from "react-csv";
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
  import { isAuthenticated } from "api/auth";

function StaffAttendanceReports() {
    const [loading, setLoading] = useState(false);
  const { user, token } = isAuthenticated();
  const [reportList,setReportList] = useState([])
  const [session,setSession] = useState("")
  const [sessions,setSessions] = useState([])
  const [departments,setDepartments] = useState([])
  const [allRoles,setAllRoles] = useState([])    
  const [dept,setDept] = useState("")
  const [role,setRole] = useState("")

  const getAllDepartments = () =>{
    var config = {
      method: 'get',
      url: `${process.env.REACT_APP_API_URL}/api/department/all/${user.school}/${user._id}`,
      headers: { 
        'Authorization': 'Bearer ' + token
      }
    };
    
    axios(config)
    .then(function (response) {
      console.log(response.data)
      setDepartments(response.data);
    })
  }

  const getAllRoles = () =>{
    var config = {
      method: 'get',
      url: `${process.env.REACT_APP_API_URL}/api/school/role/all/${user.school}/${user._id}`,
      headers: { 
        'Authorization': 'Bearer ' + token
      }
    };
    
    axios(config)
    .then(function (response) {
      setAllRoles(response.data);
    })
  }

  const roleHandler = (e) =>{
    setRole(e.target.value)
  }


  const departmentHandler = (e) =>{
    setDept(e.target.value)
  }

  useEffect(() =>{
    setLoading(true)
    if(sessions.length === 0){
      getAllSessions()
      getAllDepartments()
      getAllRoles()
    }
  },[])

    const formData = new FormData()
    const getDays = (year, month) => {
      return new Date(year, month, 0).getDate();
    }; 
    const columns = [
        {
          title: "Sr No.",
          dataIndex: "key",
          align: "left",
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
          title: "DEPARTMENT",
          dataIndex: "department",
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
          title: "JOB",
          dataIndex: "job",
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
        title: "JOB DESCRIPTION",
        dataIndex: "job_description",
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
        getDays(new Date().getFullYear(), new Date().getMonth() + 1) === 31 && {
          title: "31",
          dataIndex: "31",
          align: "left",
        },
        {
            title: "Total Days",
            dataIndex: "total_days",
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
            dataIndex: "full_day_present",
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
            dataIndex: "half_day_present",
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
            dataIndex: "holidays",
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
            dataIndex: "sundays",
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
            dataIndex: "total_present_holidays_sundays",
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
            dataIndex: "total_present",
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
            dataIndex: "total_absent",
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

      const getReports = () =>{
        setLoading(true)
        // formData.append('month',(new Date().getMonth() + 1).toString())
        formData.append('month','10')
        formData.append('year',(new Date().getFullYear()).toString())
        formData.append('session',session)
        var config = {
          method: 'post',
          url: `${process.env.REACT_APP_API_URL}/api/reports/staff_attandance/${user.school}/${user._id}`,
          headers: { 
            'Authorization': 'Bearer ' + token,
            'Content-Type' : 'multipart/form-data'
          },
          data:formData
        };
        axios(config)
        .then(function (response) {
          let data = [];
          var arr = Object.keys(response.data.output)
          for (let i = 0; i < arr.length; i++) {
            let obj = {}
            let totalPresent = response.data.total_days - response.data.output[arr[i]].total_absent

            for(let j = 0 ; j<response.data.total_days; j++){
              
              if(response.data.output[arr[i]].attandance[j] !== undefined){
                obj[new Date(response.data.output[arr[i]].attandance[j].date).getDate()] = response.data.output[arr[i]].attandance[j].attendance_status === "" ? ".." : response.data.output[arr[i]].attandance[j].attendance_status
              }
            }

            // for(let k= 0;k<response.data.total_days;k++){
            //   if(k+1 in obj){
            //     continue
            //   }else{
            //     obj[k+1] = ".."
            //   }
            // }
            data.push({
              key: i+1,
              sundays: response.data.total_sundays,
              holidays:response.data.total_holidays,
              total_days:response.data.total_days,
              total_absent:response.data.output[arr[i]].total_absent,
              total_present: totalPresent,
              half_day_present: response.data.output[arr[i]].half_day_present,
              full_day_present: response.data.output[arr[i]].full_day_present,
              total_present_holidays_sundays: response.data.total_sundays+ response.data.total_holidays + totalPresent,
              name: `${response.data.output[arr[i]].firstname} ${response.data.output[arr[i]].lastname}`,
              job_description: response.data.output[arr[i]].job_description,
              job: response.data.output[arr[i]].job,
              department:response.data.output[arr[i]].department && response.data.output[arr[i]].department.name,
              ...obj,
            });
          }
          setReportList(data)
          setLoading(false)
        }).catch((error) =>{
          console.log(error)
        })
      }

      useEffect(() =>{
        if(session !== ""){
          getReports()
        }
      },[session])

      const sessionHandler = (e) =>{
        setSession(e.target.value)
      }

      const csvHandler = () =>{
        const csvData = [
          ...reportList
        ]
       
  
        const headers = [
          { label: "Sr No.", key: "key" },
          { label: "Name", key: "name" },
          { label: "Department", key: "department" },
          { label: "Job", key: "class" },
          { label: "Job Description", key: "job_description" },
          { label: "1", key: "1" },
          { label: "2", key: "2" },
          { label: "3", key: "3" },
          { label: "4", key: "4" },
          { label: "5", key: "5" },
          { label: "6", key: "6" },
          { label: "7", key: "7" },
          { label: "8", key: "8" },
          { label: "9", key: "9" },
          { label: "10", key: "10" },
          { label: "11", key: "11" },
          { label: "12", key: "12" },
          { label: "13", key: "13" },
          { label: "14", key: "14" },
          { label: "15", key: "15" },
          { label: "16", key: "16" },
          { label: "17", key: "17" },
          { label: "18", key: "18" },
          { label: "19", key: "19" },
          { label: "20", key: "20" },
          { label: "21", key: "21" },
          { label: "22", key: "22" },
          { label: "23", key: "23" },
          { label: "24", key: "24" },
          { label: "25", key: "25" },
          { label: "26", key: "26" },
          { label: "27", key: "27" },
          { label: "28", key: "28" },
          { label: "29", key: "29" },
          { label: "30", key: "30" },
          getDays(new Date().getFullYear(), new Date().getMonth() + 1) === 31 && { label: "31", key: "31" },
          { label: "Total Days", key: "total_days" },
          { label: "Full Day", key: "full_day_present" },
          { label: "Half Day", key: "half_day_present" },
          { label: "Holiday", key: "holidays" },
          { label: "Sunday", key: "sundays" },
          { label: "Total Present Holidays Sundays", key: "total_present_holidays_sundays" },
          { label: "Total Present", key: "total_present" },
          { label: "Total Absent", key: "total_absent" },
        ];
  
        return {
          data: csvData,
          headers: headers,
          filename: 'Staff_Attendance_Report.csv'
        };
      }


      const searchHHandler = () =>{
        formData.append('month','10')
        formData.append('year',(new Date().getFullYear()).toString())
        formData.append("session",session)
        formData.append("department",dept)
        formData.append("assign_role",role)
        setLoading(true)
        var config = {
          method: 'post',
          url: `${process.env.REACT_APP_API_URL}/api/reports/staff_attandance/${user.school}/${user._id}`,
          headers: { 
            'Authorization': 'Bearer ' + token,
            'Content-Type' : 'multipart/form-data'
          },
          data : formData
        };
        axios(config)
        .then(function (response) {
          let data = [];
          var arr = Object.keys(response.data.output)
          for (let i = 0; i < arr.length; i++) {
            let obj = {}
            let totalPresent = response.data.total_days - response.data.output[arr[i]].total_absent

            for(let j = 0 ; j<response.data.total_days; j++){
              
              if(response.data.output[arr[i]].attandance[j] !== undefined){
                obj[new Date(response.data.output[arr[i]].attandance[j].date).getDate()] = response.data.output[arr[i]].attandance[j].attendance_status === "" ? ".." : response.data.output[arr[i]].attandance[j].attendance_status
              }
            }

            // for(let k= 0;k<response.data.total_days;k++){
            //   if(k+1 in obj){
            //     continue
            //   }else{
            //     obj[k+1] = ".."
            //   }
            // }
            data.push({
              key: i+1,
              sundays: response.data.total_sundays,
              holidays:response.data.total_holidays,
              total_days:response.data.total_days,
              total_absent:response.data.output[arr[i]].total_absent,
              total_present: totalPresent,
              half_day_present: response.data.output[arr[i]].half_day_present,
              full_day_present: response.data.output[arr[i]].full_day_present,
              total_present_holidays_sundays: response.data.total_sundays+ response.data.total_holidays + totalPresent,
              name: `${response.data.output[arr[i]].firstname} ${response.data.output[arr[i]].lastname}`,
              job_description: response.data.output[arr[i]].job_description,
              job: response.data.output[arr[i]].job,
              department:response.data.output[arr[i]].department && response.data.output[arr[i]].department.name,
              ...obj,
            });
          }
         
          setReportList(data)
          setLoading(false)
        })
  
  
      }


  return (
    <>
    <SimpleHeader name="Staff Attendance" parentName="Reports" />   
        <Container className="mt--6 shadow-lg" fluid>
            <Card>
              <CardBody>
                <Row>
                <Col md="3">
                    <Input
                      id="exampleFormControlSelect3"
                      type="select"
                      value={session}
                      required
                      onChange={sessionHandler}
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
                  <Col md="3">
                    <Input
                      id="exampleFormControlSelect3"
                      type="select"
                      value={dept}
                      onChange={departmentHandler}
                      required
                    >
                     <option value="" disabled selected>
                        Select Department
                      </option>
                      {
                            departments && departments.map((item,index) =>(
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
                      value={role}
                      onChange={roleHandler}
                      required
                    >
                      <option value="" disabled selected>
                        Select Role
                      </option>
                          {
                            allRoles && allRoles.map((item,index) =>(
                              <option key={index} value={item._id}>
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

export default StaffAttendanceReports