import React, { useEffect, useState, useRef } from "react";
import { isAuthenticated } from "api/auth";
import { allStaffs } from "api/staff";
// import { useReactToPrint } from "react-to-print";
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
import { Table } from "ant-table-extensions";
import SimpleHeader from "components/Headers/SimpleHeader.js";
import { SearchOutlined } from "@ant-design/icons";
import AntTable from "../tables/AntTable";
import { Link } from "react-router-dom";

import ReactPaginate from "react-paginate";
import { deleteStaff } from "api/staff";
import Loader from "components/Loader/Loader";
import { toast, ToastContainer } from "react-toastify";
import { Popconfirm } from "antd";
import UpdateStaff from "./UpdateStaff";
import { useSelector, useDispatch } from "react-redux";
import { setStaffEditing } from "store/reducers/staff";
import PermissionsGate from "routeGuard/PermissionGate";
import { SCOPES } from "routeGuard/permission-maps";
import { fetchingStaffFailed } from "constants/errors";
import { deleteStaffError } from "constants/errors";
import { deleteStaffSuccess } from "constants/success";
import Staffdetails from "./Staffdetails";
import { useReactToPrint } from "react-to-print";

const AllStaffs = () => {
  const dispatch = useDispatch();
  const { user, token } = isAuthenticated();
  // 0 -> List, 1-> Grid
  const [editing, setEditing] = useState(false);
  const [view, setView] = useState(0);
  const [staffList, setStaffList] = useState([]);
  const [page, setPage] = useState(0);
  // Pagination
  const [currentItems, setCurrentItems] = useState(null);
  const [pageCount, setPageCount] = useState(0);
  const [itemOffset, setItemOffset] = useState(0);
  const itemsPerPage = 9;
  const [checked, setChecked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [component, setComponent] = useState(false);
  const [stafId, setStaffId] = useState("");
  const [viewModal, setViewModal] = useState(false);
  const [studentDetails, setSudentDetails] = useState({});
  const [permissions, setPermissions] = useState([]);
  const handlePageClick = (event) => {
    const newOffset = (event.selected * itemsPerPage) % staffList.length;
    setItemOffset(newOffset);
  };

  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  const { staffEditing } = useSelector((state) => state.staffReducer);
  const userDetails = useSelector((state) => state.authReducer);
  // console.log(staffEditing);
  let permission1 = [];
  useEffect(() => {
    // console.log(user);
    if (user.permissions["Staff Management"]) {
      permission1 = user.permissions["Staff Management"];
      setPermissions(permission1);
      // console.log(permissions);
    }
  }, [staffEditing, checked]);

  const handleStaffDetails = (data) => {
    // console.log("id", id);
    setStaffId(data);
    setComponent(true);
  };

  useEffect(() => {
    fetchStaffs();
  }, [itemOffset, itemsPerPage, checked, staffEditing]);
  function getFormattedDate(date1) {
    let date = new Date(date1);
    var year = date.getFullYear();

    var month = (1 + date.getMonth()).toString();
    month = month.length > 1 ? month : "0" + month;

    var day = date.getDate().toString();
    day = day.length > 1 ? day : "0" + day;

    return day + "/" + month + "/" + year;
  }
  const fetchStaffs = async () => {
    const endOffset = itemOffset + itemsPerPage;
    // console.log(userDetails.userDetails);
    const payload = { school: userDetails.userDetails.school };

    try {
      const { data } = await allStaffs(
        userDetails.userDetails.school,
        userDetails.userDetails._id
      );
      console.log(data);
      const data1 = [];
      for (let i = 0; i < data.length; i++) {
        data1.push({
          key: i,
          sid: data[i].SID,
          first_name: data[i].firstname,
          last_name: data[i].lastname,
          email: data[i].email,
          phone: data[i].phone,
          gender: data[i].gender,
          assign_role: data[i].assign_role && data[i].assign_role.name,
          job: data[i].job,
          job_description: data[i].job_description,
          department: data[i].department.name,
          joining_date: getFormattedDate(data[i].joining_date),
          action: (
            <h5 key={i + 1} className="mb-0">
              {permission1 && permission1.includes("edit") && (
                <Button
                  className="btn-sm pull-right"
                  color="primary"
                  type="button"
                  key={"edit" + i + 1}
                  onClick={() => updateStaff(data[i])}
                >
                  <i className="fas fa-user-edit" />
                </Button>
              )}
              {permission1 && permission1.includes("delete") && (
                <Button
                  className="btn-sm pull-right"
                  color="danger"
                  type="button"
                  key={"delete" + i + 1}
                >
                  <Popconfirm
                    title="Sure to delete?"
                    onConfirm={() => deleteStaffHandler(data[i]._id)}
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
                onClick={() => handleStaffDetails(data[i])}
              >
                <i className="fas fa-user" />
              </Button>
            </h5>
          ),
        });
      }
      setStaffList(data1);
      setLoading(true);
      setCurrentItems(data.slice(itemOffset, endOffset));
      setPageCount(Math.ceil(data.length / itemsPerPage));
    } catch (err) {
      console.log(err);
      toast.error(fetchingStaffFailed);
      setLoading(true);
    }
  };

  const deleteStaffHandler = async (staffId) => {
    try {
      const data = await deleteStaff(staffId, user._id);
      // console.log(data);
      if (checked === false) {
        setChecked(true);
      } else {
        setChecked(false);
      }
      toast.success(deleteStaffSuccess);
    } catch (err) {
      console.log(err);
      toast.error(deleteStaffError);
    }
  };

  const [editingData, setEditingData] = useState({});

  const updateStaff = async (staffDetails) => {
    // setEditing(true);
    dispatch(setStaffEditing(true));
    // console.log(staffDetails);
    setEditingData(staffDetails);
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
      title: "Department",
      dataIndex: "department",
      sorter: (a, b) => a.department > b.department,
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
        return record.department.toLowerCase().includes(value.toLowerCase());
      },
    },
    {
      title: "Job",
      dataIndex: "job",
      sorter: (a, b) => a.job > b.job,
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
        return record.job.toLowerCase().includes(value.toLowerCase());
      },
    },
    {
      title: "Job Description",
      dataIndex: "job_description",
      sorter: (a, b) => a.job_description > b.job_description,
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
        return record.job.toLowerCase().includes(value.toLowerCase());
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
      title: "Role",
      dataIndex: "assign_role",
      sorter: (a, b) => a.assign_role > b.assign_role,
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
        return record.assign_role.toLowerCase().includes(value.toLowerCase());
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

  console.log(currentItems);

  return (
    <React.Fragment>
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
        <Staffdetails data={stafId} backHandle={backHandler} />
      ) : (
        <>
          {!staffEditing ? (
            <>
              <SimpleHeader name="All Staffs" parentName="Staff Management" />
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
                        style={{ float: "right" }}
                      >
                        Print
                      </Button>
                    )}
                  </CardHeader>
                  <CardBody>
                    {!loading ? (
                      <Loader />
                    ) : (
                      <>
                        {view === 0 ? (
                          <>
                            {permissions && permissions.includes("export") ? (
                              <div
                                ref={componentRef}
                                style={{ overflowX: "auto" }}
                              >
                                <AntTable
                                  columns={columns}
                                  data={staffList}
                                  pagination={true}
                                  exportFileName="StaffDetails"
                                />
                              </div>
                            ) : (
                              <div style={{ overflowX: "auto" }}>
                                <Table
                                  style={{ whiteSpace: "pre" }}
                                  columns={columns}
                                  dataSource={staffList}
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
                                />
                              </div>
                            )}
                          </>
                        ) : (
                          <>
                            <Container className="" fluid>
                              <Row className="card-wrapper">
                                {currentItems !== null && (
                                  <>
                                    {currentItems.map((staff, index) => (
                                      <Col md="4" key={index}>
                                        <Card>
                                          <CardHeader align="right">
                                            <UncontrolledDropdown>
                                              <DropdownToggle
                                                className="btn-icon-only text-light"
                                                color=""
                                                role="button"
                                                size="sm"
                                              >
                                                <i className="fas fa-ellipsis-v" />
                                              </DropdownToggle>
                                              <DropdownMenu
                                                className="dropdown-menu-arrow"
                                                right
                                              >
                                                <DropdownItem
                                                  href="#pablo"
                                                  onClick={(e) =>
                                                    e.preventDefault()
                                                  }
                                                >
                                                  Edit
                                                </DropdownItem>
                                                <DropdownItem
                                                  href="#pablo"
                                                  onClick={(e) =>
                                                    e.preventDefault()
                                                  }
                                                >
                                                  Delete
                                                </DropdownItem>
                                              </DropdownMenu>
                                            </UncontrolledDropdown>
                                          </CardHeader>
                                          {staff.photo && (
                                            <div  >
                                              <CardImg
                                                alt="..."
                                                src={staff.tempPhoto}
                                                top
                                                className="p-4"
                                                style={{height:"13rem"}}
                                              />
                                            </div>
                                          )}

                                          <CardBody className="mt-0" style={{height:"22rem"}} >
                                            <Row>
                                              <Col align="center">
                                                <h4 className="mt-3 mb-1">
                                                  SID
                                                </h4>
                                                <span className="text-md">
                                                  {staff.SID}
                                                </span>
                                              </Col>
                                            </Row>
                                            <Row>
                                              <Col align="center">
                                                <h4 className="mt-3 mb-1">
                                                  First Name
                                                </h4>
                                                <span className="text-md">
                                                  {staff.firstname}
                                                </span>
                                              </Col>
                                              <Col align="center">
                                                <h4 className="mt-3 mb-1">
                                                  Last Name
                                                </h4>
                                                <span className="text-md">
                                                  {staff.lastname}
                                                </span>
                                              </Col>
                                            </Row>
                                            <Row>
                                              <Col align="center">
                                                <h4 className="mt-3 mb-1">
                                                  Assign Role
                                                </h4>
                                                <span className="text-md">
                                                  {staff.assign_role &&
                                                    staff.assign_role.name}
                                                </span>
                                              </Col>
                                              <Col align="center">
                                                <h4 className="mt-3 mb-1">
                                                  Department
                                                </h4>
                                                <span className="text-md">
                                                  {staff.department.name}
                                                </span>
                                              </Col>
                                            </Row>
                                            <Row>
                                              <Col align="center">
                                                <Button
                                                  className="mt-3"
                                                  onClick={() =>
                                                    handleStaffDetails(staff)
                                                  }
                                                >
                                                  Read More
                                                </Button>
                                              </Col>
                                            </Row>
                                          </CardBody>
                                        </Card>
                                      </Col>
                                    ))}
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
                        <h4 className="mt-3 mb-1">Role</h4>
                        <span className="text-md">
                          {studentDetails.assign_role &&
                            studentDetails.assign_role.name}
                        </span>
                      </Col>
                      <Col align="center">
                        <h4 className="mt-3 mb-1">Job</h4>
                        <span className="text-md">{studentDetails.job}</span>
                      </Col>
                      <Col align="center">
                        <h4 className="mt-3 mb-1">Sallary</h4>
                        <span className="text-md">{studentDetails.salary}</span>
                      </Col>
                    </Row>

                    <Row></Row>
                  </ModalBody>
                </Modal>
              </Container>
            </>
          ) : (
            <UpdateStaff staffDetails={editingData} />
          )}
        </>
      )}
    </React.Fragment>
  );
};

export default AllStaffs;
