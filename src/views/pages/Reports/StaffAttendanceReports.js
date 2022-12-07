import React ,{useEffect, useState}from 'react'
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
  import { isAuthenticated } from "api/auth";

function StaffAttendanceReports() {
    const [loading, setLoading] = useState(false);
  const { user, token } = isAuthenticated();
  const [reportList,setReportList] = useState([])

    const formData = new FormData()

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
          title: "Gender",
          dataIndex: "gender",
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


      const getReports = () =>{
        setLoading(true)
        formData.append('month','10')
        formData.append('year','2022')
        formData.append('session','628a18e764f724cdfad91d85')
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
          var data = [];
          var arr = Object.keys(response.data.output)
          for (let i = 0; i < arr.length; i++) {
            let obj = {}
            let totalPresent = response.data.total_days - response.data.output[arr[i]].total_absent

            for(let j = 0 ; j<response.data.total_days; j++){
              
              if(response.data.output[arr[i]].attandance[j] !== undefined){
                obj[new Date(response.data.output[arr[i]].attandance[j].date).getDate()] = response.data.output[arr[i]].attandance[j].attendance_status
              }
            }

            for(let k= 0;k<response.data.total_days;k++){
              if(k+1 in obj){
                continue
              }else{
                obj[k+1] = ".."
              }
            }
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
              gender:"",
              department:"",
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
        getReports()
      },[])

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
                      value={""}
                      required
                    >
                        <option value="" disabled selected>
                           Select Session
                        </option>
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
                        Select Department
                      </option>
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
                        Select Role
                      </option>
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

export default StaffAttendanceReports