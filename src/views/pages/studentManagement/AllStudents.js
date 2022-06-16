import React, { useEffect, useState, useRef } from "react";
import { isAuthenticated } from "api/auth";
import { allStudents, deleteStudent } from "api/student";
import StudentDetails from "./StudentDetails";
import {
  Card,
  CardHeader,
  CardBody,
  Input,
  Container,
  Row,
  Col,
  Button,
  CardImg,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Modal,
  ModalBody,
} from "reactstrap";
// core components
import SimpleHeader from "components/Headers/SimpleHeader.js";
import { SearchOutlined } from "@ant-design/icons";
import AntTable from "../tables/AntTable";
import { Link } from "react-router-dom";
import Loader from "components/Loader/Loader";
import { Popconfirm } from "antd";
import { toast, ToastContainer } from "react-toastify";
import ReactPaginate from "react-paginate";
import { useHistory } from "react-router";
import UpdateStudent from "./UpdateStudent";
import { useSelector, useDispatch } from "react-redux";
import { useReactToPrint } from "react-to-print";
import PermissionsGate from "routeGuard/PermissionGate";

import { setStudentEditing } from "store/reducers/student";
import { SCOPES } from "routeGuard/permission-maps";
import { Table } from "ant-table-extensions";

const AllStudents = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const { studentEditing } = useSelector((state) => state.studentReducer);
  const [loading, setLoading] = useState(false);
  // 0 -> List, 1-> Grid
  const [view, setView] = useState(0);
  const [studentList, setStudentList] = useState([]);
  const [checked, setChecked] = useState(false);
  const [component, setComponent] = useState(false);
  // Pagination
  const [currentItems, setCurrentItems] = useState(null);
  // console.log("currentItems", currentItems);
  const [pageCount, setPageCount] = useState(0);
  const [itemOffset, setItemOffset] = useState(0);
  const [editing, setEditing] = useState(false);
  const [editingData, setEditingData] = useState({});
  const itemsPerPage = 9;
  const { user, token } = isAuthenticated();
  const handlePageClick = (event) => {
    const newOffset = (event.selected * itemsPerPage) % studentList.length;
    setItemOffset(newOffset);
  };
  const [permissions, setPermissions] = useState([]);
  const [viewModal, setViewModal] = useState(false);
  const [studentDetails, setSudentDetails] = useState({});
  const componentRef = useRef();
  const [allStudentsData, setAllStudentsData] = useState([]);
  const [studentData, setStudentData] = useState({});
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });
  let permission1 = [];
  useEffect(() => {
    const { user } = isAuthenticated();
    if (user.permissions["Student Management"]) {
      permission1 = user.permissions["Student Management"];
      setPermissions(permission1);
      // console.log(permissions);
    }
  }, [checked]);
  useEffect(() => {
    fetchStudents();
  }, [itemOffset, itemsPerPage, checked]);

  const handleStaffDetails = (data) => {
    // console.log("id", id);
    setStudentData(data);
    setComponent(true);
  };

  useEffect(() => {
    dispatch(setStudentEditing(false));
  }, []);
  function getFormattedDate(date1) {
    let date = new Date(date1);
    var year = date.getFullYear();

    var month = (1 + date.getMonth()).toString();
    month = month.length > 1 ? month : "0" + month;

    var day = date.getDate().toString();
    day = day.length > 1 ? day : "0" + day;

    return day + "/" + month + "/" + year;
  }

  const fetchStudents = async () => {
    const endOffset = itemOffset + itemsPerPage;
    const payload = { school: user.school };
    const res = await allStudents(
      user.school,
      user._id,
      token,
      JSON.stringify(payload)
    );
    // console.log("res", res);
    setAllStudentsData(res)
    if (res.err) {
      return toast.error(res.err);
    } else {
      const data = [];
      for (let i = 0; i < res.length; i++) {
        data.push({
          key: i,
          sid: res[i].SID,
          first_name: res[i].firstname,
          last_name: res[i].lastname,
          email: res[i].email,
          tempPhoto: res[i].tempPhoto,
          phone: res[i].phone,
          gender: res[i].gender,
          dob: getFormattedDate(res[i].date_of_birth),
          class: res[i].class && res[i].class.name,
          section: res[i].section && res[i].section.name,
          roll: res[i].roll_number,
          joining_date: getFormattedDate(res[i].joining_date),
          action: (
            <h5 key={i + 1} className="mb-0">
              {/* <Link to={`/admin/update-student/${res[i]._id}`}> */}
              {permission1 && permission1.includes("edit") && (
                <Button
                  className="btn-sm pull-right"
                  color="primary"
                  type="button"
                  key={"edit" + i + 1}
                  onClick={() => {
                    updateStudentHandler(res[i]);
                  }}
                >
                  <i className="fas fa-user-edit" />
                </Button>
              )}
              {/* </Link> */}
              {permission1 && permission1.includes("delete") && (
                <Button
                  className="btn-sm pull-right"
                  color="danger"
                  type="button"
                  key={"delete" + i + 1}
                >
                  <Popconfirm
                    title="Sure to delete?"
                    onConfirm={() => deleteStudentHandler(res[i]._id)}
                  >
                    <i className="fas fa-trash" />
                  </Popconfirm>
                </Button>
              )}
              <Button
                className="btn-sm pull-right"
                color="success"
                type="button"
                key={"view" + i + 1}
                onClick={() => handleStaffDetails(res[i])}
              >
                <i className="fas fa-user" />
              </Button>
            </h5>
          ),
        });
      }
      setStudentList(data);
      setCurrentItems(data.slice(itemOffset, endOffset));
      setPageCount(Math.ceil(data.length / itemsPerPage));
      setLoading(true);
    }
  };

  const deleteStudentHandler = async (studentId) => {
    const { user } = isAuthenticated();
    try {
      const data = await deleteStudent(studentId, user._id);
      // console.log(data);
      if (checked === false) {
        setChecked(true);
      } else {
        setChecked(false);
      }
    } catch (err) {
      toast.error("Something went wrong");
    }
  };

  const updateStudentHandler = (studentData) => {
    // console.log("Update Student");
    // console.log(studentData);
    dispatch(setStudentEditing(true));
    setEditing(true);
    setEditingData(studentData);
    // return <UpdateStudent studentDetails={studentData} />;
  };

  const columns = [
    {
      title: "SID",
      dataIndex: "sid",
      sorter: (a, b) => a.sid > b.sid,
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
        return record.sid.toLowerCase().includes(value.toLowerCase());
      },
    },
    {
      title: "First Name",
      dataIndex: "first_name",
      sorter: (a, b) => a.first_name > b.first_name,
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
        return record.first_name.toLowerCase().includes(value.toLowerCase());
      },
    },
    {
      title: "Last Name",
      dataIndex: "last_name",
      sorter: (a, b) => a.last_name > b.last_name,
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
        return record.last_name.toLowerCase().includes(value.toLowerCase());
      },
    },
    {
      title: "Gender",
      dataIndex: "gender",
      sorter: (a, b) => a.gender > b.gender,
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
        return record.gender.toLowerCase().includes(value.toLowerCase());
      },
    },
    {
      title: "DOB",
      dataIndex: "dob",
      sorter: (a, b) => a.dob > b.dob,
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
        return record.dob.toLowerCase().includes(value.toLowerCase());
      },
    },
    {
      title: "Class",
      dataIndex: "class",
      sorter: (a, b) => a.class > b.class,
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
        return record.class.toLowerCase().includes(value.toLowerCase());
      },
    },
    {
      title: "Section",
      dataIndex: "section",
      sorter: (a, b) => a.section > b.section,
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
        return record.section.toLowerCase().includes(value.toLowerCase());
      },
    },
    {
      title: "Roll",
      dataIndex: "roll",
      sorter: (a, b) => a.roll > b.roll,
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
        return record.roll.toLowerCase().includes(value.toLowerCase());
      },
    },
    {
      title: "Email",
      dataIndex: "email",
      sorter: (a, b) => a.email > b.email,
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
        return record.email.toLowerCase().includes(value.toLowerCase());
      },
    },
    {
      title: "Phone",
      dataIndex: "phone",
      sorter: (a, b) => a.phone > b.phone,
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
        return record.phone.toLowerCase().includes(value.toLowerCase());
      },
    },

    {
      title: "Joining Date",
      dataIndex: "joining_date",
      sorter: (a, b) => a.joining_date > b.joining_date,
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
        return record.joining_date.toLowerCase().includes(value.toLowerCase());
      },
    },
    {
      title: "Action",
      key: "action",
      dataIndex: "action",
      fixed: "right",
    },
  ];

  const backHandler = () => {
    setComponent(false);
  };

  return (
    <>
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
      {component ? (
        <StudentDetails data={studentData} backHandle={backHandler} />
      ) : (
        <>
          {!editing ? (
            <>
              <SimpleHeader name="All Students" />
              <Container className="mt--6" fluid>
                <Card className="mb-4">
                  <CardHeader className="buttons-head">
                    <div>
                      <Button
                        color={`${view === 0 ? "warning" : "primary"}`}
                        type="button"
                        onClick={() => {
                          setView(0);
                        }}
                      >
                        List View
                      </Button>{" "}
                      <Button
                        color={`${view === 1 ? "warning" : "primary"}`}
                        type="button"
                        onClick={() => {
                          setView(1);
                        }}
                      >
                        Grid View
                      </Button>
                    </div>
                    {permissions && permissions.includes("export") && (
                      <Button
                        color="primary"
                        className="mb-2"
                        onClick={handlePrint}
                      >
                        Print
                      </Button>
                    )}
                  </CardHeader>
                  <CardBody>
                    {view === 0 ? (
                      <>
                        {loading && studentList ? (
                          permissions && permissions.includes("export") ? (
                            <div
                              ref={componentRef}
                              style={{ overflowX: "auto" }}
                            >
                              <AntTable
                                columns={columns}
                                data={studentList}
                                pagination={true}
                                exportFileName="StudentDetails"
                              />
                            </div>
                          ) : (
                            <div
                              ref={componentRef}
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
                                // exportFileName="StudentDetails"
                              />
                            </div>
                          )
                        ) : (
                          <Loader />
                        )}
                      </>
                    ) : (
                      <>
                        <Container className="" fluid>
                          <Row className="card-wrapper">
                            {allStudentsData && (
                              <>
                                {allStudentsData.map((student, index) => {
                                  console.log(student);
                                  return (
                                    <Col md="4" key={index}>
                                      <Card>
                                      
                                        {student.tempPhoto && (
                                          <CardImg
                                            alt="..."
                                            src={student.tempPhoto}
                                            top
                                            className="p-4"
                                            style={{ height: "13rem" }}
                                          />
                                        )}
                                        <CardBody className="mt-0">
                                          <Row>
                                            <Col align="center">
                                              <h4 className="mt-3 mb-1">SID</h4>
                                              <span className="text-md">
                                                {student.SID}
                                              </span>
                                            </Col>
                                          </Row>
                                          <Row>
                                            <Col align="center">
                                              <h4 className="mt-3 mb-1">
                                                First Name
                                              </h4>
                                              <span className="text-md">
                                                {student.firstname}
                                              </span>
                                            </Col>
                                            <Col align="center">
                                              <h4 className="mt-3 mb-1">
                                                Last Name
                                              </h4>
                                              <span className="text-md">
                                                {student.lastname}
                                              </span>
                                            </Col>
                                          </Row>
                                          <Row>
                                            <Col align="center">
                                              <h4 className="mt-3 mb-1">
                                                Class
                                              </h4>
                                              <span className="text-md">
                                                {student.class.name}
                                              </span>
                                            </Col>
                                            <Col align="center">
                                              <h4 className="mt-3 mb-1">
                                                Section
                                              </h4>
                                              <span className="text-md">
                                                {student.section.name}
                                              </span>
                                            </Col>
                                            <Col align="center">
                                              <h4 className="mt-3 mb-1">
                                                Roll
                                              </h4>
                                              <span className="text-md">
                                                {student.roll_number}
                                              </span>
                                            </Col>
                                          </Row>
                                          <Row>
                                            <Col align="center">
                                              <Button
                                                className="mt-3"
                                                onClick={() =>
                                                  handleStaffDetails(student)
                                                }
                                              >
                                                Read More
                                              </Button>
                                            </Col>
                                          </Row>
                                        </CardBody>
                                      </Card>
                                    </Col>
                                  );
                                })}
                              </>
                            )}
                          </Row>
                        </Container>
                        <Row>
                          <Col className="d-flex justify-content-around mt-4">
                            <ReactPaginate
                              nextLabel=">"
                              onPageChange={handlePageClick}
                              pageRangeDisplayed={3}
                              marginPagesDisplayed={2}
                              pageCount={pageCount}
                              previousLabel="<"
                              pageClassName="page-item"
                              pageLinkClassName="page-link"
                              previousClassName="page-item"
                              previousLinkClassName="page-link"
                              nextClassName="page-item"
                              nextLinkClassName="page-link"
                              breakLabel="..."
                              breakClassName="page-item"
                              breakLinkClassName="page-link"
                              containerClassName="pagination"
                              activeClassName="active"
                              renderOnZeroPageCount={null}
                            />
                          </Col>
                        </Row>
                      </>
                    )}
                  </CardBody>
                </Card>
                <Modal
                  className="modal-dialog-centered"
                  isOpen={viewModal}
                  toggle={() => setViewModal(false)}
                >
                  <div className="modal-header">
                    <h6 className="modal-title" id="modal-title-default">
                      Support Details
                    </h6>
                    <button
                      aria-label="Close"
                      className="close"
                      data-dismiss="modal"
                      type="button"
                      onClick={() => setViewModal(false)}
                    >
                      <span aria-hidden={true}>×</span>
                    </button>
                  </div>
                  <ModalBody>
                    <Row>
                      <Col align="center">
                        <h4 className="mt-3 mb-1">SID</h4>
                        <span className="text-md">{studentDetails.SID}</span>
                      </Col>
                      <Col align="center">
                        <h4 className="mt-3 mb-1">First Name</h4>
                        <span className="text-md">
                          {studentDetails.firstname}
                        </span>
                      </Col>
                      <Col align="center">
                        <h4 className="mt-3 mb-1">Last Name</h4>
                        <span className="text-md">
                          {studentDetails.lastname}
                        </span>
                      </Col>
                    </Row>
                    <Row>
                      <Col align="center">
                        <h4 className="mt-3 mb-1">Email</h4>
                        <span className="text-md">{studentDetails.email}</span>
                      </Col>
                      <Col align="center">
                        <h4 className="mt-3 mb-1">Phone</h4>
                        <span className="text-md">{studentDetails.phone}</span>
                      </Col>
                      <Col align="center">
                        <h4 className="mt-3 mb-1">Gender</h4>
                        <span className="text-md">{studentDetails.gender}</span>
                      </Col>
                    </Row>
                    <Row>
                      <Col align="center">
                        <h4 className="mt-3 mb-1">Roll No.</h4>
                        <span className="text-md">
                          {studentDetails.roll_number}
                        </span>
                      </Col>
                      <Col align="center">
                        <h4 className="mt-3 mb-1">Aadhar Number</h4>
                        <span className="text-md">
                          {studentDetails.aadhar_number}
                        </span>
                      </Col>
                      <Col align="center">
                        <h4 className="mt-3 mb-1">Caste</h4>
                        <span className="text-md">{studentDetails.caste}</span>
                      </Col>
                    </Row>

                    <Row></Row>
                  </ModalBody>
                </Modal>
              </Container>
            </>
          ) : (
            <UpdateStudent studentDetails={editingData} />
          )}
        </>
      )}
    </>
  );
};

export default AllStudents;
