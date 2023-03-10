import React ,{useState,useEffect}from 'react'
import SimpleHeader from "components/Headers/SimpleHeader.js";
import Loader from "components/Loader/Loader";
import { SearchOutlined } from "@ant-design/icons";
import { Line, Bar } from "react-chartjs-2";
import { Chart } from "chart.js";
import axios from 'axios';
import { isAuthenticated } from "api/auth";
import classnames from "classnames";

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
  } from "variables/charts.js";

function AdminDashboard() {
    const { user, token } = isAuthenticated();
    const [loading, setLoading] = useState(false);
    const [reportData,setReportData] = useState({})
    const [leave,setLeave] = useState([])
    const [notice,setNotice] = useState([])
    const [birthDay,setBirthDay] = useState([])
    const [exam,setExam] = useState([])
    const [holiday,setHoliday] = useState([])
    const [expense_graph,setExpense_graph] = useState([])
    const [yearly_graph,setYearly_graph] = useState([])
    const [weekly_graph,setWeekly_graph] = useState([])
    const [yearly_weekly_graph_label,setYearly_weekly_graph_label] = useState([])

    const [activeNav, setActiveNav] = React.useState(1);

    const toggleNavs = (e, index) => {
        e.preventDefault();
        setActiveNav(index);
      };

  
      if (window.Chart) {
        parseOptions(Chart, chartOptions());
      }

    const getData = () =>{
        setLoading(true)
        var config = {
          method: 'post',
          url: `http://localhost:8000/api/reports/dashboard/6288e6d464f724cdfad91d4b/6288e6d264f724cdfad91d47`,
          headers: { 
            'Authorization': 'Bearer ' + token
          }
        };
        
        axios(config)
        .then(function (response) {
          console.log(response.data)
          setReportData(response.data)
          setLeave([...response.data.student_leave,...response.data.staff_leave])
          setBirthDay([...response.data.today_birthday])
          setExam([...response.data.exam_list])
          setHoliday([...response.data.holiday_list])
          setNotice([...response.data.notice_board])

          let expense_graph = {
            labels: [...response.data.expense_graph.map((ele) => (ele.x_value))],
            datasets: [{
              data: [...response.data.expense_graph.map((ele) => (ele.total_amount))],
            }],
            options:{
                tooltips:{
                    enabled:true,
                }
            }
          };
          setYearly_weekly_graph_label([...response.data.yearly_income_graph.map((ele) => (ele.x_value))])
          setWeekly_graph([...response.data.income_week_graph.map((ele) => (ele.total_amount))])
          setYearly_graph([...response.data.yearly_income_graph.map((ele) => (ele.total_amount))])
          setExpense_graph(expense_graph)
          setLoading(false)
        })
        .catch(function (error) {
          console.log(error);
        });
    }

    useEffect(() => {
      getData()
    }, [])

    console.log("week",weekly_graph)
    console.log("year",yearly_graph)
    
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

  return (
    <>
    <SimpleHeader name="Admin Dashboard" parentName="Dashboard" />   
        <Container className="mt--6 shadow-lg bg-transparent" fluid>
            <Card className='bg-transparent'>
                <CardBody>
                    <Row>
                        <Col md='3'>
                            <Card style={{background:'linear-gradient(87deg, #f5365c 0, #d8d8d8 100%)'}} >
                                <CardBody>
                                    <Row>
                                        <Col>
                                            <h5 class="text-uppercase mb-0 card-title" style={{color:"white"}}> Student</h5>
                                            <span class="h2 font-weight-bold mb-0">{reportData.student_count}</span>
                                        </Col>
                                        <div className="col-auto col">
                                            <div class="icon icon-shape bg-gradient-red text-white rounded-circle shadow">
                                            <i class="ni ni-hat-3"></i>
                                            </div>
                                        </div>
                                    </Row>
                                </CardBody>
                            </Card>
                        </Col>
                        <Col md='3'>
                            <Card style={{background:'linear-gradient(87deg, #f5365c 0, #9cc2e5 100%)'}} >
                                <CardBody>
                                    <Row>
                                        <Col>
                                            <h5 class="text-uppercase mb-0 card-title" style={{color:"#fff"}}>Employees</h5>
                                            <span class="h2 font-weight-bold mb-0">{reportData.staff_count}</span>
                                        </Col>
                                        <div className="col-auto col">
                                            <div class="icon icon-shape bg-gradient-orange text-white rounded-circle shadow">
                                            <i class="ni ni-hat-3"></i>
                                            </div>
                                        </div>
                                    </Row>
                                </CardBody>
                            </Card>
                        </Col>
                        <Col md='3'>
                            <Card style={{background:'linear-gradient(87deg, #f5365c 0, #f4b083 100%)'}} >
                                <CardBody>
                                    <Row>
                                        <Col>
                                            <h5 class="text-uppercase mb-0 card-title" style={{color:"white"}}>Expenses</h5>
                                            <span class="h2 font-weight-bold mb-0">{reportData.budget_used}</span>
                                        </Col>
                                        <div className="col-auto col">
                                            <div class="icon icon-shape bg-gradient-green text-white rounded-circle shadow">
                                            <i class="ni ni-chart-bar-32"></i>
                                            </div>
                                        </div>
                                    </Row>
                                </CardBody>
                            </Card>
                        </Col>
                        <Col md='3'>
                            <Card style={{background:'linear-gradient(87deg, #f5365c 0, #a8d08d 100%)'}} >
                                <CardBody>
                                    <Row>
                                        <Col>
                                            <h5 class="text-uppercase mb-0 card-title" style={{color:"white"}}>Revenue</h5>
                                            <span class="h2 font-weight-bold mb-0">{reportData.revenue}</span>
                                        </Col>
                                        <div className="col-auto col">
                                            <div class="icon icon-shape bg-gradient-primary text-white rounded-circle shadow">
                                            <i class="ni ni-credit-card"></i>
                                            </div>
                                        </div>
                                    </Row>
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
                                    data={ {
                                        labels: [...yearly_weekly_graph_label],
                                        datasets: [{
                                          data: activeNav === 1 ? [...yearly_graph] : [...weekly_graph],
                                        }],
                                        options:{
                                            tooltips:{
                                                enabled:true,
                                            },
                                        }
                                      }}
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
                                        data={expense_graph}
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
                                    birthDay.length === 0 ? 
                                    <h3 style={{paddingLeft:"1.5rem"}}>No data Found</h3>
                                    :
                                    birthDay.map((item) => (
                                                <ListGroupItem className="checklist-entry flex-column align-items-start py-4 px-4">
                                                    <div className="checklist-item checklist-item-success">
                                                        <div className="checklist-info">
                                                            <h5 className="checklist-title mb-0">
                                                                <strong>{`${item.firstname} ${item.lastname}`}</strong>
                                                            </h5>
                                                            <small>{formatDate(item.date_of_birth)}</small>
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
                                    <h2>Holidays {new Date().toLocaleString('default', { month: 'long' })}</h2>
                                </CardHeader>
                                <CardBody style={{padding:"0",height:'315px',overflowY:'auto'}}>
                                {
                                    holiday.length === 0 ? 
                                    <h3 style={{paddingLeft:"1.5rem"}}>No data Found</h3>
                                    :
                                    holiday.map((item) => (
                                                <ListGroupItem className="checklist-entry flex-column align-items-start py-4 px-4">
                                                    <div className="checklist-item checklist-item-success">
                                                        <div className="checklist-info">
                                                            <h5 className="checklist-title mb-0">
                                                                <strong>{item.name}</strong>
                                                            </h5>
                                                            <div>
                                                                <small> from {formatDate(item.event_from)}</small> - 
                                                                <small> to {formatDate(item.event_to)}</small>
                                                            </div>
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
                                    <h2>Examinations</h2>
                                </CardHeader>
                                <CardBody style={{padding:"0",height:'315px',overflowY:'auto'}}>
                                {
                                    exam.length === 0 ? 
                                    <h3 style={{paddingLeft:"1.5rem"}}>No data Found</h3>
                                    :
                                    exam.map((item) => (
                                                <ListGroupItem className="checklist-entry flex-column align-items-start py-4 px-4">
                                                    <div className="checklist-item checklist-item-success">
                                                        <div className="checklist-info">
                                                            <h5 className="checklist-title mb-0">
                                                                <strong>{item.name}</strong>
                                                            </h5>
                                                            {/* <small>{item.class.name}</small> */}
                                                        </div>
                                                    </div>
                                                </ListGroupItem>
                                        ))
                                }
                                 
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
                                            <div style={{display:"grid",gridTemplateColumns:'1fr 1fr'}}>
                                                {
                                                    notice.map((item) => (
                                                            <ListGroupItem style={{width:'100%'}} className="checklist-entry flex-column align-items-start py-4 px-4">
                                                                <div className="checklist-item checklist-item-success">
                                                                    <div className="checklist-info">
                                                                        <h5 className="checklist-title mb-0">
                                                                            <strong>{item.name}</strong>
                                                                        </h5>
                                                                        <div>
                                                                            <small>{item.description}</small>
                                                                        </div>
                                                                        <div>
                                                                            <small> from {formatDate(item.event_from)}</small> - 
                                                                            <small> to {formatDate(item.event_to)}</small>
                                                                        </div>
                                                                        <div>
                                                                            <small>{item.event_type}</small>
                                                                        </div>
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