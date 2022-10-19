import React, { useState ,useEffect,useRef} from 'react'
import SimpleHeader from "components/Headers/SimpleHeader.js";
import { SearchOutlined } from "@ant-design/icons";
import { Table } from "ant-table-extensions";
import { allStudents, filterStudent } from "api/student";
import { isAuthenticated } from "api/auth";
import { PrinterOutlined } from "@ant-design/icons";
import Loader from "components/Loader/Loader";
import { useReactToPrint } from "react-to-print";
import IDCard from './IDCard';
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

  const componentRef = useRef();
  const [loading, setLoading] = useState(false);
  const [pageCount, setPageCount] = useState(0);
  const [studentList, setStudentList] = useState([]);
  const [currentItems, setCurrentItems] = useState(null);
  const itemsPerPage = 9;
  const [itemOffset, setItemOffset] = useState(0);
  const { user, token } = isAuthenticated();

  const fetchStudents = async () => {
    setLoading(true)
    const endOffset = itemOffset + itemsPerPage;
    const res = await allStudents(
      user.school,
      user._id,
      token,
    );
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
                // className="custom-control-input"
                id={`customCheck${i}`}
                type="checkbox"
                // onChange={handleFees}
              />
            </div>
          ),
          action: (
            <h5 key={i + 1} className="mb-0">
                <Button onClick={() => getIdCard(res[i].SID,user.school)} color="primary">
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
  useEffect(() => {
    fetchStudents();
  }, [itemOffset, itemsPerPage]);

  const handlePrint = useReactToPrint({
    content: () => componentRef.current, 
  });

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

  const getIdCard = async (stu_id,school_id) =>{
    
    setModal(!modal)
  }  
  const toggle = () => setModal(!modal);
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
                      <Col md="3">
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
                      <Col md="2">
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
                        <div ref={componentRef} className='id__card__wrapper' style={{
                              background: `linear-gradient(${'#fff'} 46%, ${'#fff'} 100%)`
                          }}> 
                            <IDCard />
                        </div>
                  </ModalBody>
                  <ModalFooter>
                    <Button color='primary' onClick={handlePrint}>
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