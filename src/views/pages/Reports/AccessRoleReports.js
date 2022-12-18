import React ,{useState}from 'react'
import SimpleHeader from "components/Headers/SimpleHeader.js";
import Loader from "components/Loader/Loader";
import { SearchOutlined } from "@ant-design/icons";
import { CSVLink } from "react-csv";
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
  import { useEffect } from 'react';
  import axios from 'axios';
function AccessRoleReports() {
    const [loading, setLoading] = useState(false);
    const [reportList,setReportList] = useState([])

    const { user, token } = isAuthenticated();
    
    const getReports = () =>{
      setLoading(true)
      var config = {
        method: 'post',
        url: `${process.env.REACT_APP_API_URL}/api/reports/staff_report/${user.school}/${user._id}`,
        headers: { 
          'Authorization': 'Bearer ' + token
        }
      };
      
      axios(config)
      .then(function (response) {
        console.log(response.data)
        const data = [];
        for (let i = 0; i < response.data.length; i++) {
          let arr = Object.keys(response.data[i].assign_role?.permissions !==undefined && response.data[i].assign_role?.permissions)
          let moduleName = arr.length !== 0 ?  arr.join(", ") : "Module Name Not Found"
          let accessType = "" 
          var access_arr = []
          if(arr.length !== 0 ){
            for(let k = 0 ; k<arr.length ; k++){
              access_arr.push(response.data[i].assign_role.permissions[arr[k]].join(","))
            }
            console.log(i,access_arr)
            accessType  = access_arr.join(" / ")
          }else{
            accessType = "Access Type Not Found"
          }

          data.push({
            key: i+1,
            sid: response.data[i].SID,
            name:`${response.data[i].firstname} ${response.data[i].lastname}`,
            department:response.data[i].department.name,
            module_name:moduleName,
            access_type : accessType
          });
        }
        setReportList(data)
        setLoading(false)
      })
      .catch(function (error) {
        console.log(error);
      });
    }

    useEffect(() =>{
      getReports()
    },[])


    const csvHandler = () =>{
      const csvData = [
        ...reportList
      ]

      const headers = [
        { label: "Sr No.", key: "key" },
        { label: "Student ID", key: "sid" },
        { label: "Name", key: "name" },
        { label: "Department", key: "department" },
        { label: "Access Type", key: "access_type" },
        { label: "Module Name", key: "module_name" },
      ];

      return {
        data: csvData,
        headers: headers,
        filename: 'Access_Role_Report.csv'
      };
    }

    const columns = [
      {
        title: "Sr No.",
        dataIndex: "key",
        align: "left",
      },
        {
          title: "STAFF ID",
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
          title: "MODULE NAME",
          dataIndex: "module_name",
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
            title: "ACCESS TYPE",
            dataIndex: "access_type",
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
    <SimpleHeader name="Access Role Reports" parentName="Reports" />   
        <Container className="mt--6 shadow-lg" fluid>
            <Card>
              <CardBody>
                <Row>
                    {/* <Col md="3">
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
                    </Col> */}
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

export default AccessRoleReports