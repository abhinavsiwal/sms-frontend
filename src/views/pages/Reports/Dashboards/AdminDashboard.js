import React ,{useState,useEffect}from 'react'
import SimpleHeader from "components/Headers/SimpleHeader.js";
import Loader from "components/Loader/Loader";
import { SearchOutlined } from "@ant-design/icons";
import { Line, Bar } from "react-chartjs-2";
import { Chart } from "chart.js";
import classnames from "classnames";
import axios from 'axios';
import { isAuthenticated } from "api/auth";

import {
    Card,
    CardHeader,
    CardBody,
    Input,
    Container,
    Row,
    Col,
    NavItem,
    NavLink,
    Nav,
    ListGroupItem,
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
  import {
    chartOptions,
    parseOptions,
    chartExample1,
    chartExample2,
  } from "variables/charts.js";

function AdminDashboard() {
  const { user, token } = isAuthenticated();
    const [loading, setLoading] = useState(false);
    const [activeNav, setActiveNav] = React.useState(1);
    const [reportData,setReportData] = useState({})
    const [leave,setLeave] = useState([])
    const [chartExample1Data, setChartExample1Data] = React.useState("data1");
    const toggleNavs = (e, index) => {
      e.preventDefault();
      setActiveNav(index);
      setChartExample1Data(chartExample1Data === "data1" ? "data2" : "data1");
    };
    if (window.Chart) {
      parseOptions(Chart, chartOptions());
    }


    const getData = () =>{
        setLoading(true)
        var config = {
          method: 'post',
          url: `${process.env.REACT_APP_API_URL}/api/reports/dashboard/${user.school}/${user._id}`,
          headers: { 
            'Authorization': 'Bearer ' + token
          }
        };
        
        axios(config)
        .then(function (response) {
          console.log(response.data)
          setReportData(response.data)
          setLeave([...response.data.student_leave,...response.data.staff_leave])
          setLoading(false)
        })
        .catch(function (error) {
          console.log(error);
        });
    }

    useEffect(() => {
      getData()
    }, [])
    


    const columns = [
        {
          title: "Sr No.",
          dataIndex: "sno",
          align: "left",
        },
        {
          title: "Section",
          dataIndex: "section",
          align: "left",
        },
        {
          title: "Class Teacher",
          dataIndex: "classteacher",
          align: "left",
        },
        {
          title: "Score",
          dataIndex: "score",
          align: "left",
        },
        {
            title: "Total",
            dataIndex: "total",
            align: "left",
          },
          {
            title: "Pass",
            dataIndex: "pass",
            align: "left",
          },
          {
            title: "Failed",
            dataIndex: "failed",
            align: "left",
          },
      ];
  return (
    <>
    <SimpleHeader name="Admin Dashboard" parentName="Dashboard" />   
        <Container className="mt--6 shadow-lg bg-transparent" fluid>
            <Card className='bg-transparent'>
                <CardBody>
                    <Row>
                        <Col md='3'>
                            <Card style={{background:'#d8d8d8'}}>
                                <CardBody className='d-flex justify-content-center align-items-center flex-column'>
                                    <h2 style={{margin:"0"}}>{reportData.student_count}</h2>
                                    <h3>Students</h3>
                                </CardBody>
                            </Card>
                        </Col>
                        <Col md='3'>
                            <Card style={{background:'#9cc2e5'}}>
                                <CardBody className='d-flex justify-content-center align-items-center flex-column'>
                                    <h2 style={{margin:"0"}}>{reportData.staff_count}</h2>
                                    <h3>Employees</h3>
                                </CardBody>
                            </Card>
                        </Col>
                        <Col md='3'>
                            <Card style={{background:'#f4b083'}}>
                                <CardBody className='d-flex justify-content-center align-items-center flex-column'>
                                    <h2 style={{margin:"0"}}>{reportData.budget_used}</h2>
                                    <h3>Expenses</h3>
                                </CardBody>
                            </Card>
                        </Col>
                        <Col md='3'>
                            <Card style={{background:'#a8d08d'}}>
                                <CardBody className='d-flex justify-content-center align-items-center flex-column'>
                                    <h2 style={{margin:"0"}}>{reportData.revenue}</h2>
                                    <h3>Revenue</h3>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                    <Row className='mt-4' style={{padding:'0.5rem 1rem'}}>
                        <Col style={{border:"2px solid black",backgroundColor:"#00b0f0"}} md='8'>
                            <h2 className='text-center'>Income</h2>
                        </Col>
                        <Col style={{border:"2px solid black",backgroundColor:"#00b0f0"}} md='4'>
                            <h2 className='text-center'>Expenses</h2>
                        </Col>
                    </Row>
                    <Row>
                        <Col xl="8">
                            <Card className="bg-default">
                            <CardHeader className="bg-transparent">
                                <Row className="align-items-center">
                                <div className="col">
                                    <h6 className="text-light text-uppercase ls-1 mb-1">
                                    Overview
                                    </h6>
                                    <h5 className="h3 text-white mb-0">Sales value</h5>
                                </div>
                                <div className="col">
                                    <Nav className="justify-content-end" pills>
                                    <NavItem className="mr-2 mr-md-0">
                                        <NavLink
                                        className={classnames("py-2 px-3", {
                                            active: activeNav === 1,
                                        })}
                                        href="#pablo"
                                        onClick={(e) => toggleNavs(e, 1)}
                                        >
                                        <span className="d-none d-md-block">Month</span>
                                        <span className="d-md-none">M</span>
                                        </NavLink>
                                    </NavItem>
                                    <NavItem>
                                        <NavLink
                                        className={classnames("py-2 px-3", {
                                            active: activeNav === 2,
                                        })}
                                        data-toggle="tab"
                                        href="#pablo"
                                        onClick={(e) => toggleNavs(e, 2)}
                                        >
                                        <span className="d-none d-md-block">Week</span>
                                        <span className="d-md-none">W</span>
                                        </NavLink>
                                    </NavItem>
                                    </Nav>
                                </div>
                                </Row>
                            </CardHeader>
                            <CardBody>
                                <div className="chart">
                                <Line
                                    data={chartExample1[chartExample1Data]}
                                    options={chartExample1.options}
                                    id="chart-sales-dark"
                                    className="chart-canvas"
                                />
                                </div>
                            </CardBody>
                            </Card>
                        </Col>
                        <Col xl="4">
                            <Card>
                            <CardHeader className="bg-transparent">
                                <Row className="align-items-center">
                                <div className="col">
                                    <h6 className="text-uppercase text-muted ls-1 mb-1">
                                    Performance
                                    </h6>
                                    <h5 className="h3 mb-0">Total orders</h5>
                                </div>
                                </Row>
                            </CardHeader>
                            <CardBody>
                                <div className="chart">
                                <Bar
                                    data={chartExample2.data}
                                    options={chartExample2.options}
                                    className="chart-canvas"
                                    id="chart-bars"
                                />
                                </div>
                            </CardBody>
                            </Card>
                        </Col>
                    </Row>
                    <Row className='mt-4'>
                        <Col style={{border:"2px solid black",backgroundColor:"#00b0f0"}} md='6'>
                            <h3 style={{textAlign:"center"}}>TOP FIVE PERMORMING CLASSES</h3>
                        </Col>
                        <Col style={{border:"2px solid black",backgroundColor:"#00b0f0"}} md='3'>
                            <h3 style={{textAlign:"center"}}>PENDING FEES</h3>
                        </Col>
                        <Col style={{border:"2px solid black",backgroundColor:"#00b0f0"}} md='3'>
                            <h3 style={{textAlign:"center"}}>COLLECTED FEES</h3>
                        </Col>
                    </Row>
                    <Row>
                        <Col md='6'>
                        {
                            loading ?  <Loader /> : 
                            <div
                            style={{ overflowX: "auto" }}
                            >
                            <Table
                                columns={columns}
                                // dataSource={studentList}
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
                        <Col md='3' style={{padding:"0"}}>
                            <table style={{width:"100%",border:"2px solid black"}}>
                                <tbody>
                                    <tr style={{border:"1px solid black"}}>
                                        <td style={{textAlign:"start",border:"1px solid black"}}>One time</td>
                                        <td style={{textAlign:"start",border:"1px solid black"}}>{reportData?.pending_fees?.one_time_fees}</td>
                                    </tr>
                                    <tr style={{border:"1px solid black"}}>
                                        <td style={{textAlign:"start",border:"1px solid black"}}>Tuition Fee</td>
                                        <td style={{textAlign:"start",border:"1px solid black"}}>{reportData?.pending_fees?.tution_fees}</td>
                                    </tr>
                                    <tr style={{border:"1px solid black"}}>
                                        <td style={{textAlign:"start",border:"1px solid black"}}>Transport Fee</td>
                                        <td style={{textAlign:"start",border:"1px solid black"}}>{reportData?.pending_fees?.transport_fees}</td>
                                    </tr>
                                    <tr style={{border:"1px solid black"}}>
                                        <td style={{textAlign:"start",border:"1px solid black"}}>Hostel Fee</td>
                                        <td style={{textAlign:"start",border:"1px solid black"}}>{reportData?.pending_fees?.hostel_fees}</td>
                                    </tr>
                                    <tr style={{border:"1px solid black"}}>
                                        <td style={{textAlign:"start",border:"2px solid black"}}><strong>Total Pending</strong></td>
                                        <td style={{textAlign:"start",border:"2px solid black"}}><strong>{
                                                   reportData?.pending_fees?.one_time_fees +
                                                   reportData?.pending_fees?.tution_fees +
                                                   reportData?.pending_fees?.transport_fees +
                                                   reportData?.pending_fees?.hostel_fees
                                            }</strong></td>
                                    </tr>
                                </tbody>
                            </table>
                        </Col>
                        <Col md='3' style={{padding:"0"}}>
                            <table style={{width:"100%",border:"2px solid black"}}>
                                <tbody>
                                    <tr style={{border:"1px solid black"}}>
                                        <td style={{textAlign:"start",border:"1px solid black"}}>One time</td>
                                        <td style={{textAlign:"start",border:"1px solid black"}}>{reportData?.collected_fees?.one_time_fees}</td>
                                    </tr>
                                    <tr style={{border:"1px solid black"}}>
                                        <td style={{textAlign:"start",border:"1px solid black"}}>Tuition Fee</td>
                                        <td style={{textAlign:"start",border:"1px solid black"}}>{reportData?.collected_fees?.tution_fees}</td>
                                    </tr>
                                    <tr style={{border:"1px solid black"}}>
                                        <td style={{textAlign:"start",border:"1px solid black"}}>Transport Fee</td>
                                        <td style={{textAlign:"start",border:"1px solid black"}}>{reportData?.collected_fees?.transport_fees}</td>
                                    </tr>
                                    <tr style={{border:"1px solid black"}}>
                                        <td style={{textAlign:"start",border:"1px solid black"}}>Hostel Fee</td>
                                        <td style={{textAlign:"start",border:"1px solid black"}}>{reportData?.collected_fees?.hostel_fees}</td>
                                    </tr>
                                    <tr style={{border:"1px solid black"}}>
                                        <td style={{textAlign:"start",border:"2px solid black"}}><strong>Total Pending</strong></td>
                                        <td style={{textAlign:"start",border:"2px solid black"}}><strong>{
                                            reportData?.collected_fees?.one_time_fees +
                                            reportData?.collected_fees?.tution_fees +
                                            reportData?.collected_fees?.transport_fees +
                                            reportData?.collected_fees?.hostel_fees
                                            }</strong></td>
                                    </tr>
                                </tbody>
                            </table>
                        </Col>
                    </Row>
                    <Row className='mt-4'>
                        <Col md='3'>
                            <Card>
                                <CardHeader>
                                    <h2>On Leave Today</h2>
                                </CardHeader>
                                <CardBody style={{padding:"0",height:'315px',overflowY:'auto'}}>
                                {
                                    leave.length === 0 ? 
                                    <h3 style={{paddingLeft:"1.5rem"}}>No data Found</h3>
                                    :
                                    leave.map((item) => (
                                                <ListGroupItem className="checklist-entry flex-column align-items-start py-4 px-4">
                                                    <div className="checklist-item checklist-item-info">
                                                        <div className="checklist-info">
                                                            <h5 className="checklist-title mb-0">
                                                                <strong>Santosh Kumar</strong>
                                                            </h5>
                                                            <small>Teaching Staff</small>
                                                        </div>
                                                    </div>
                                                </ListGroupItem>
                                        ))
                                }
                                </CardBody>
                            </Card>
                        </Col>
                        <Col md='3'>
                            <Card>
                                <CardHeader>
                                    <h2>Today's Birth Day</h2>
                                </CardHeader>
                                <CardBody style={{padding:"0",height:'315px',overflowY:'auto'}}>
                                {
                                    reportData?.today_birthday?.length === 0 ? 
                                    <h3 style={{paddingLeft:"1.5rem"}}>No data Found</h3>
                                    :
                                    leave.map((item) => (
                                                <ListGroupItem className="checklist-entry flex-column align-items-start py-4 px-4">
                                                    <div className="checklist-item checklist-item-success">
                                                        <div className="checklist-info">
                                                            <h5 className="checklist-title mb-0">
                                                                <strong>Santosh Kumar</strong>
                                                            </h5>
                                                            <small>Teaching Staff</small>
                                                        </div>
                                                    </div>
                                                </ListGroupItem>
                                        ))
                                }
                                 
                                </CardBody>
                            </Card>
                        </Col>
                        <Col md='3'>
                            <Card>
                                <CardHeader>
                                    <h2>Holidays August</h2>
                                </CardHeader>
                                <CardBody style={{padding:"0",height:'315px',overflowY:'auto'}}>
                                <ListGroupItem className="checklist-entry flex-column align-items-start py-4 px-4">
                                        <div className="checklist-item checklist-item-info">
                                            <div className="checklist-info">
                                                <h5 className="checklist-title mb-0">
                                                    <strong>Independent Day </strong>
                                                </h5>
                                                <small>15 August</small>
                                            </div>
                                        </div>
                                    </ListGroupItem>
                                    <ListGroupItem className="checklist-entry flex-column align-items-start py-4 px-4">
                                        <div className="checklist-item checklist-item-success">
                                        <div className="checklist-info">
                                            <h5 className="checklist-title mb-0">
                                                <strong>Ganesh Festival</strong>
                                            </h5>
                                            <small>31 August</small>
                                        </div>
                                        </div>
                                    </ListGroupItem>
                                    <ListGroupItem className="checklist-entry flex-column align-items-start py-4 px-4">
                                        <div className="checklist-item checklist-item-danger">
                                        <div className="checklist-info">
                                            <h5 className="checklist-title mb-0">
                                                <strong></strong>
                                            </h5>
                                            <small></small>
                                        </div>
                                        </div>
                                    </ListGroupItem>
                                </CardBody>
                            </Card>
                        </Col>
                        <Col md='3'>
                            <Card>
                                <CardHeader>
                                    <h2>Examinations</h2>
                                </CardHeader>
                                <CardBody style={{padding:"0",height:'315px',overflowY:'auto'}}>
                                    <ListGroupItem className="checklist-entry flex-column align-items-start py-4 px-4">
                                        <div className="checklist-item checklist-item-info">
                                            <div className="checklist-info">
                                                <h5 className="checklist-title mb-0">
                                                    <strong>First Terminal Exam</strong>
                                                </h5>
                                                <small>(08.03.2022-16.03.2022)</small>
                                            </div>
                                        </div>
                                    </ListGroupItem>
                                    <ListGroupItem className="checklist-entry flex-column align-items-start py-4 px-4">
                                        <div className="checklist-item checklist-item-success">
                                        <div className="checklist-info">
                                            <h5 className="checklist-title mb-0">
                                                <strong>Mid Term Exam</strong>
                                            </h5>
                                            <small>(01.06.2022-10.06.2022)</small>
                                        </div>
                                        </div>
                                    </ListGroupItem>
                                    <ListGroupItem className="checklist-entry flex-column align-items-start py-4 px-4">
                                        <div className="checklist-item checklist-item-danger">
                                        <div className="checklist-info">
                                            <h5 className="checklist-title mb-0">
                                                <strong>Second Terminal Exam</strong>
                                            </h5>
                                            <small>(19.09.2022-28.09.2022)</small>
                                        </div>
                                        </div>
                                    </ListGroupItem>
                                    <ListGroupItem className="checklist-entry flex-column align-items-start py-4 px-4">
                                        <div className="checklist-item checklist-item-danger">
                                        <div className="checklist-info">
                                            <h5 className="checklist-title mb-0">
                                                <strong>Final Exam</strong>
                                            </h5>
                                            <small>(01.12.2022-16.12.2022)</small>
                                        </div>
                                        </div>
                                    </ListGroupItem>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                    <Row className='mt-4'>
                        <Col md='3'>
                            <Card>
                                <CardHeader style={{height:'90px'}}>
                                    <h3>Pending One Time Payment</h3>
                                </CardHeader>
                                <CardBody style={{padding:"0"}}>
                                    <ListGroupItem className="checklist-entry flex-column align-items-start py-4 px-4">
                                        <div className="checklist-item checklist-item-info">
                                        <div className="checklist-info">
                                            <h5 className="checklist-title mb-0">
                                                <strong>Rs. 79000</strong>
                                            </h5>
                                        </div>
                                        </div>
                                    </ListGroupItem>
                                    <ListGroupItem className="checklist-entry flex-column align-items-start py-4 px-4">
                                        <div className="checklist-item checklist-item-danger">
                                        <div className="checklist-info">
                                            <h5 className="checklist-title mb-0">
                                                <strong>9</strong>
                                            </h5>
                                            <small>My Pending Tasks</small>
                                        </div>
                                        </div>
                                    </ListGroupItem>
                                </CardBody>
                            </Card>
                        </Col>
                        <Col md='3'>
                            <Card>
                                <CardHeader style={{height:'90px'}}>
                                    <h3>Pending Tution Fee</h3>
                                </CardHeader>
                                <CardBody  style={{padding:"0"}}>
                                <ListGroupItem className="checklist-entry flex-column align-items-start py-4 px-4">
                                        <div className="checklist-item checklist-item-info">
                                        <div className="checklist-info">
                                            <h5 className="checklist-title mb-0">
                                                <strong>Rs. 175000</strong>
                                            </h5>
                                        </div>
                                        </div>
                                    </ListGroupItem>
                                    <ListGroupItem className="checklist-entry flex-column align-items-start py-4 px-4">
                                        <div className="checklist-item checklist-item-danger">
                                        <div className="checklist-info">
                                            <h5 className="checklist-title mb-0">
                                                <strong>160</strong>
                                            </h5>
                                            <small>No of Hostel Students</small>
                                        </div>
                                        </div>
                                    </ListGroupItem>
                                </CardBody>
                            </Card>
                        </Col>
                        <Col md='3'>
                            <Card>
                                <CardHeader style={{height:'90px'}}>
                                    <h3>Pending Hostel/Boarding Fee</h3>
                                </CardHeader>
                                <CardBody  style={{padding:"0"}}>
                                <ListGroupItem className="checklist-entry flex-column align-items-start py-4 px-4">
                                        <div className="checklist-item checklist-item-info">
                                        <div className="checklist-info">
                                            <h5 className="checklist-title mb-0">
                                                <strong>Rs. 25000</strong>
                                            </h5>
                                        </div>
                                        </div>
                                    </ListGroupItem>
                                    <ListGroupItem className="checklist-entry flex-column align-items-start py-4 px-4">
                                        <div className="checklist-item checklist-item-danger">
                                        <div className="checklist-info">
                                            <h5 className="checklist-title mb-0">
                                                <strong>260</strong>
                                            </h5>
                                            <small>No of Bus Students</small>
                                        </div>
                                        </div>
                                    </ListGroupItem>
                                </CardBody>
                            </Card>
                        </Col>
                        <Col md='3'>
                            <Card>
                                <CardHeader style={{height:'90px'}}>
                                    <h3>Pending Transportation Fee</h3>
                                </CardHeader>
                                <CardBody  style={{padding:"0"}}>
                                <ListGroupItem className="checklist-entry flex-column align-items-start py-4 px-4">
                                        <div className="checklist-item checklist-item-info">
                                        <div className="checklist-info">
                                            <h5 className="checklist-title mb-0">
                                                <strong>Rs. 25000</strong>
                                            </h5>
                                        </div>
                                        </div>
                                    </ListGroupItem>
                                    <ListGroupItem className="checklist-entry flex-column align-items-start py-4 px-4">
                                        <div className="checklist-item checklist-item-danger">
                                        <div className="checklist-info">
                                            <h5 className="checklist-title mb-0">
                                                <strong></strong>
                                            </h5>
                                            <small></small>
                                        </div>
                                        </div>
                                    </ListGroupItem>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                    <Row className='mt-4 d-flex justify-content-center'>
                        <Col md='12'>
                            <Card style={{background:'linear-gradient(87deg, #f5365c 0, #f56036 100%)'}}>
                                <CardHeader  style={{background:'transparent',border:'1px solid white'}}>
                                    <h2 style={{textAlign:"center",color:"white"}}>Notice Board</h2>
                                </CardHeader>
                                <CardBody>
                                 

                                            {
                                            reportData?.notice_board?.length === 0 ? 
                                            <div style={{display:"grid",gridTemplateColumns:'1fr'}}>
                                            <h3 style={{textAlign:"center",color:"white"}}>No data Found</h3>
                                            </div>
                                            :
                                            <div style={{display:"grid",gridTemplateColumns:'1fr 1fr 1fr 1fr'}}>
                                                {
                                                    leave.map((item) => (
                                                            <ListGroupItem className="checklist-entry flex-column align-items-start py-4 px-4">
                                                                <div className="checklist-item checklist-item-success">
                                                                    <div className="checklist-info">
                                                                        <h5 className="checklist-title mb-0">
                                                                            <strong>Santosh Kumar</strong>
                                                                        </h5>
                                                                        <small>Teaching Staff</small>
                                                                    </div>
                                                                </div>
                                                            </ListGroupItem>
                                                    ))
                                                }
                                            </div>
                                        }
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                </CardBody>
            </Card>
        </Container>
    </>
  )
}

export default AdminDashboard