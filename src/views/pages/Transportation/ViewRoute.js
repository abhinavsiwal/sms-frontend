import React, { useState, useEffect, useRef } from "react";

import {
  Container,
  Card,
  CardBody,
  Input,
  Button,
  CardHeader,
  Modal,
  ModalBody,
  Row,
  Col,
  Label,
  Table,
  Form,
} from "reactstrap";

//React-Select
import Select from "react-select";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
// core components
import SimpleHeader from "components/Headers/SimpleHeader.js";
import AntTable from "../tables/AntTable";

//Ant Table
import { DeleteRowOutlined, SearchOutlined } from "@ant-design/icons";
import { Popconfirm, Tag } from "antd";

//Loader
import Loader from "components/Loader/Loader";

import { isAuthenticated } from "api/auth";
import {
  routeAdd,
  routesAll,
  deleteRoute,
  editRoute,
  editStop,
} from "api/transportation";
import { useReactToPrint } from "react-to-print";

import { allStaffs } from "api/staff";
// import moment Library
import moment from "moment";
import { toast, ToastContainer } from "react-toastify";

function ViewRoute() {
  const [startDate, setStartDate] = React.useState(new Date());
  const startDuration = moment(startDate).format("LT");
  // console.log("start", startDuration);
  const [endDate, setEndDate] = React.useState(new Date());
  const endDuration = moment(endDate).format("LT");
  // console.log("end", endDuration);

  const [startTimePickup, setStartTimePickup] = React.useState(new Date());
  const startTime = moment(startTimePickup).format("LT");
  const [endTimePickup, setEndTimePickup] = React.useState(new Date());
  const endTime = moment(endTimePickup).format("LT");
  const [viewRoute, setViewRoute] = React.useState([]);
  const [modalState, setModalState] = React.useState(false);
  const [modalSupport, setModalSupport] = React.useState({});
  const [loading, setLoading] = React.useState(false);
  const [allRoutes, setAllRoutes] = useState([]);
  const [checked, setChecked] = useState(false);
  const [editing, setEditing] = React.useState(false);
  const [formData] = React.useState(new FormData());
  const { user } = isAuthenticated();
  const [roleOptions, setRoleOptions] = useState([]);
  const [permissions1, setPermissions1] = useState([]);
  const [editStopModal, seteditStopModal] = useState(false);
  const [addStops, setAddStops] = useState([]);
  const [disableButton, setDisableButton] = useState(true);
  const [editingRouteData, setEditingRouteData] = React.useState({
    route_name: "",
    id: "",
    bus_no: "",
  });
  const [editLoading, setEditLoading] = useState(false);
  const [stopLoading, setStopLoading] = useState(false);
  const [staff, setStaff] = useState([]);
  const [placeName, setPlaceName] = useState("");
  // console.log("route", route);
  // const [loading, setLoading] = useState(second)
  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  const openModal = (support) => {
    setModalSupport(support);

    setModalState(true);
  };

  let permissions = [];
  useEffect(() => {
    // console.log(user);
    if (user.permissions["Transportation management"]) {
      permissions = user.permissions["Transportation management"];
      setPermissions1(permissions);
      // console.log(permissions);
    }
  }, [checked]);

  const handleSubjectChange = (e) => {
    var value = [];
    for (var i = 0, l = e.length; i < l; i++) {
      value.push(e[i].value);
    }
    // console.log(value);
    setStaff(value);
  };

  const handleChange = (name) => (event) => {
    formData.set(name, event.target.value);
    setEditingRouteData({ ...editingRouteData, [name]: event.target.value });
  };

  const columns = [
    {
      title: "S No.",
      dataIndex: "s_no",
      align:"left",
    },
    {
      title: "Route Name",
      dataIndex: "route_name",
      align:"left",
      sorter: (a, b) => a.route_name > b.route_name,
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
        return record.route_name.toLowerCase().includes(value.toLowerCase());
      },
    },
    {
      title: "Bus No.",
      dataIndex: "bus_no",
      align:"left",
      sorter: (a, b) => a.bus_no > b.bus_no,
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
        return record.bus_no.toLowerCase().includes(value.toLowerCase());
      },
    },

    {
      title: "Start Time",
      dataIndex: "start_time",
      align:"left",
      sorter: (a, b) => a.start_time > b.start_time,
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
        return record.start_time.toLowerCase().includes(value.toLowerCase());
      },
    },

    {
      title: "End Time",
      dataIndex: "end_time",
      align:"left",
      sorter: (a, b) => a.end_time > b.end_time,
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
        return record.end_time.toLowerCase().includes(value.toLowerCase());
      },
    },
    {
      title: "Staff Members",
      dataIndex: "staff_members",
      align:"left",
      sorter: (a, b) => a.staff_members > b.staff_members,
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
        return record.staff_members.toLowerCase().includes(value.toLowerCase());
      },
      render: (staffs) => staffs.map((staff) => staff.firstname).join(),
    },

    {
      title: "Action",
      key: "action",
      dataIndex: "action",
      align:"left",
      fixed: "right",
    },
  ];

  React.useEffect(() => {
    fetchRoutes();
    getAllStaffs();
  }, [checked]);

  const getAllStaffs = async () => {
    const { data } = await allStaffs(user.school, user._id);
    // console.log(data);
    let options = [];
    for (let i = 0; i < data.length; i++) {
      options.push({ value: data[i]._id, label: data[i].firstname });
    }
    // console.log(options);
    setRoleOptions(options);
  };

  const fetchRoutes = async () => {
    setLoading(true);
    let res = await routesAll(user._id, user.school);
    // console.log(res);
    const data = [];

    for (let i = 0; i < res.length; i++) {
      data.push({
        key: i,
        s_no: i + 1,
        route_name: res[i].name,
        bus_no: res[i].bus_number,
        staff_members: res[i].staff && res[i].staff,
        start_time: res[i].start,
        end_time: res[i].end,
        action: (
          <>
            <h5 key={i + 1} className="mb-0">
              <span>{res[i].startTime}</span>
              {permissions && permissions.includes("edit") && (
                <Button
                  className="btn-sm pull-right"
                  color="primary"
                  type="button"
                  key={"edit" + i + 1}
                  onClick={() => {
                    setEditData(res[i]);
                  }}
                >
                  <i className="fas fa-user-edit" />
                </Button>
              )}

              {permissions && permissions.includes("delete") && (
                <Button
                  className="btn-sm pull-right"
                  color="danger"
                  type="button"
                  key={"delete" + i + 1}
                >
                  <Popconfirm
                    title="Sure to delete?"
                    onConfirm={() => handleDelete(res[i]._id)}
                  >
                    <i className="fas fa-trash" />
                  </Popconfirm>
                </Button>
              )}
              <Button
                className="btn-sm pull-right"
                color="primary"
                type="button"
                key={"view" + i + 1}
                onClick={() => {
                  openModal(res[i]);
                }}
              >
                View More
              </Button>
            </h5>
          </>
        ),
      });
    }
    setViewRoute(data);
    setLoading(false);
  };

  const setEditData = (editingData) => {
    setEditing(true);

    // console.log("clicked");
    // console.log(editingData);

    let staff = [];
    for (let i = 0; i < editingData.staff.length; i++) {
      staff.push({
        value: editingData.staff[i]._id,
        label: editingData.staff[i].firstname,
      });
    }

    setEditingRouteData({
      ...editingRouteData,
      route_name: editingData.name,
      bus_no: editingData.bus_number,
      id: editingData._id,
      staff,
    });
  };

  const handleDelete = async (routeId) => {
    try {
      setLoading(true);
      const data = await deleteRoute(user._id, routeId);
      // console.log(data);
      setChecked(!checked);
      setLoading(false);
    } catch (err) {
      // console.log(err);
      setLoading(false);
    }
  };
  const editRouteHandler = async () => {
    // console.log(editingRouteData);
    // console.log(staff);
    const formData = new FormData();
    formData.set("bus_number", editingRouteData.bus_no);
    formData.set("name", editingRouteData.route_name);
    formData.set("end", endDuration);
    formData.set("start", startDuration);
    formData.set("staff", JSON.stringify(staff));
    formData.set("school", user.school);
    // formData.set("",)

    try {
      setEditLoading(true);
      const data = await editRoute(user._id, editingRouteData.id, formData);
      // console.log(data);
      setChecked(!checked);
      setEditLoading(false);
      setEditing(false);
    } catch (err) {
      console.log(err);
      setEditLoading(false);
    }
  };

  const editStopHandler = async () => {
    console.log(modalSupport);

    const formData = new FormData();
    formData.set("stops", JSON.stringify(addStops));
    formData.set("school", user.school);
    formData.set("id", modalSupport._id);
    try {
      setStopLoading(true);
      const data = await editStop(user._id, modalSupport._id, formData);
      console.log(data);
      if (data.err) {
        setStopLoading(false);
        toast.error(data.err);
        return;
      }
      setChecked(!checked);
      setModalState(false);
      setStopLoading(false);
      toast.success("Stop deleted successfully");
    } catch (err) {
      console.log(err);
      toast.error("Something went wrong");
      setStopLoading(false);
    }
  };

  const editStopData = async (route) => {
    seteditStopModal(true);
    console.log(route);
    setAddStops(route.stops);
  };

  const addStop = () => {
    setAddStops([
      ...addStops,
      { stopName: placeName, pickupTime: startTime, dropTime: endTime },
    ]);
    setDisableButton(true);
    setPlaceName("");
  };
  const deleteStopHandler = (name) => {
    let stops = addStops.filter((stop) => stop.stopName !== name);
    setAddStops(stops);
  };

  const placeBlurHandler = () => {
    console.log("here");
    if (placeName.length > 0) {
      setDisableButton(false);
    } else {
      setDisableButton(true);
    }
  };

  const filterPassedTime = (time) => {
    const currentDate = new Date(startDate);
    const selectedDate = new Date(time);

    return currentDate.getTime() < selectedDate.getTime();
  };

  const filterPassedPickupTime = (time) => {
    const currentDate = new Date(startTimePickup);
    const selectedDate = new Date(time);

    return currentDate.getTime() < selectedDate.getTime();
  };

  return (
    <>
      <ToastContainer
        position="bottom-right"
        autoClose={1000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
      <SimpleHeader name="Transport" parentName="View Route" />
      <Modal
        className="modal-dialog-centered"
        isOpen={editStopModal}
        toggle={() => seteditStopModal(false)}
        size="lg" 
      >
        <div className="modal-header">
          <h6 className="modal-title" id="modal-title-default">
          Edit Stops
          </h6>
          <button
            aria-label="Close"
            className="close"
            data-dismiss="modal"
            type="button"
            onClick={() => seteditStopModal(false)}
          >
            <span aria-hidden={true}>×</span>
          </button>
        </div>
        {stopLoading ? (
          <Loader />
        ) : (
          <ModalBody>
            <>
              <Container>
                <Row>
                  <Col>
                    {" "}
                    <Label
                      className="form-control-label"
                      htmlFor="example4cols2Input"
                    >
                      Stop Name
                    </Label>
                    <Input
                      id="example4cols2Input"
                      placeholder="Stop Name"
                      type="text"
                      onChange={(e) => setPlaceName(e.target.value)}
                      required
                      value={placeName}
                      onBlur={placeBlurHandler}
                    />
                  </Col>
                  <Col>
                    <Label
                      className="form-control-label"
                      htmlFor="example4cols2Input"
                    >
                      Pickup Time
                    </Label>
                    <DatePicker
                      id="exampleFormControlSelect3"
                      className="Period-Time"
                      selected={startTimePickup}
                      onChange={(date) => setStartTimePickup(date)}
                      showTimeSelect
                      showTimeSelectOnly
                      timeIntervals={15}
                      timeCaption="Time"
                      dateFormat="h:mm aa"
                      required
                    />
                  </Col>
                  <Col>
                    <Label
                      className="form-control-label"
                      htmlFor="example-date-input"
                    >
                      Drop Time
                    </Label>
                    <DatePicker
                      id="exampleFormControlSelect3"
                      className="Period-Time"
                      selected={endTimePickup}
                      onChange={(date) => setEndTimePickup(date)}
                      showTimeSelect
                      showTimeSelectOnly
                      timeIntervals={15}
                      timeCaption="Time"
                      dateFormat="h:mm aa"
                      required
                    />
                  </Col>
                </Row>
                <Row>
                  <Col className="mt-4">
                    <Button
                      color="primary"
                      onClick={addStop}
                      disabled={disableButton}
                    >
                      Add
                    </Button>
                  </Col>
                </Row>
              </Container>
              <Table bordered responsive>
                <thead>
                  <tr>
                    <th>S No.</th>
                    <th>Place Name</th>
                    <th>pickup Time</th>
                    <th>DropTime</th>
                    <th>Action</th>
                  </tr>
                </thead>
                {addStops !== null ? (
                  <>
                    {addStops.map((stops, index) => {
                      return (
                        <tbody key={index}>
                          <tr>
                            <td>{index + 1}</td>
                            <td>{stops.stopName}</td>
                            <td>{stops.pickupTime}</td>
                            <td>{stops.dropTime}</td>
                            <Button
                              className="btn-sm pull-right"
                              color="danger"
                              type="button"
                            >
                              <Popconfirm
                                title="Sure to delete?"
                                onConfirm={() =>
                                  deleteStopHandler(stops.stopName)
                                }
                              >
                                <i className="fas fa-trash" />
                              </Popconfirm>
                            </Button>
                          </tr>
                        </tbody>
                      );
                    })}
                  </>
                ) : (
                  <h3>No Data</h3>
                )}
              </Table>
            </>
            <Button color="primary" onClick={editStopHandler}>
              Submit
            </Button>
          </ModalBody>
        )}
      </Modal>

      <Container className="mt--6 shadow-lg" fluid>
        <Card>
          <CardHeader>
            <h3>View Route</h3>
            <Button
              color="primary"
              className="mb-2"
              onClick={handlePrint}
              style={{ float: "right" }}
            >
              Print
            </Button>
          </CardHeader>
          <CardBody>
          
            {!loading && viewRoute ? (
              <div ref={componentRef} style={{ overflowX: "auto" }}>
                <AntTable
                  columns={columns}
                  data={viewRoute}
                  pagination={true}
                  exportFileName="StudentDetails"
                />
              </div>
            ) : (
              <Loader />
            )}
          </CardBody> 
        </Card>
        <Modal
          // style={{ height: "50vh" }}
          isOpen={editing}
          toggle={() => setEditing(false)}
          size="lg"
          scrollable
        >
          <div className="modal-header">
            <h2 className="modal-title" id="modal-title-default">
              Edit Route
            </h2>
            <button
              aria-label="Close"
              className="close"
              data-dismiss="modal"
              type="button"
              onClick={() => setEditing(false)}
            >
              <span aria-hidden={true}>×</span>
            </button>
          </div>
          <ModalBody>
            {editLoading ? (
              <Loader />
            ) : (
              <Container>
                <Form>
                  <Row>
                    <Col>
                      {" "}
                      <Label
                        className="form-control-label"
                        htmlFor="example4cols2Input"
                      >
                        Route Name
                      </Label>
                      <Input
                        id="example4cols2Input"
                        placeholder="Class"
                        type="text"
                        onChange={handleChange("route_name")}
                        value={editingRouteData.route_name}
                        required
                      />
                    </Col>
                    <Col>
                      <Label
                        className="form-control-label"
                        htmlFor="xample-date-input"
                      >
                        Select Staff Member
                      </Label>
                      <Select
                        isMulti
                        name="colors"
                        options={roleOptions}
                        onChange={handleSubjectChange}
                        className="basic-multi-select"
                        classNamePrefix="select"
                        required
                        defaultValue={editingRouteData.staff}
                      />
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <Label
                        className="form-control-label"
                        htmlFor="example4cols2Input"
                      >
                        Bus No.
                      </Label>
                      <Input
                        id="example4cols2Input"
                        placeholder="bus_no"
                        type="text"
                        onChange={handleChange("bus_no")}
                        value={editingRouteData.bus_no}
                        required
                      />
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <Label
                        className="form-control-label"
                        htmlFor="xample-date-input"
                      >
                        From
                      </Label>
                      <DatePicker
                        id="exampleFormControlSelect3"
                        className="Period-Time"
                        selected={startDate}
                        onChange={(date) => setStartDate(date)}
                        showTimeSelect
                        showTimeSelectOnly
                        timeIntervals={15}
                        timeCaption="Time"
                        dateFormat="h:mm aa"
                        required
                      />
                    </Col>
                    <Col>
                      <Label
                        className="form-control-label"
                        htmlFor="example-date-input"
                      >
                        To
                      </Label>
                      <DatePicker
                        id="exampleFormControlSelect3"
                        className="Period-Time"
                        selected={endDate}
                        onChange={(date) => setEndDate(date)}
                        showTimeSelect
                        showTimeSelectOnly
                        timeIntervals={15}
                        timeCaption="Time"
                        dateFormat="h:mm aa"
                        required
                        filterTime={filterPassedTime}
                      />
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <Button
                        className="primary mt-5"
                        color="primary"
                        onClick={editRouteHandler}
                      >
                        Save Changes
                      </Button>
                    </Col>
                  </Row>
                </Form>
              </Container>
            )}
          </ModalBody>
        </Modal>
        <Modal
          className="modal-dialog-centered"
          isOpen={modalState}
          toggle={() => setModalState(false)}
          size="lg"
        >
          <div className="modal-header">
            <h6 className="modal-title" id="modal-title-default">
              Stop Details
            </h6>
            <button
              aria-label="Close"
              className="close"
              data-dismiss="modal"
              type="button"
              onClick={() => setModalState(false)}
            >
              <span aria-hidden={true}>×</span>
            </button>
          </div>
          {stopLoading ? (
            <Loader />
          ) : (
            <ModalBody>
              <Row
                style={{
                  display: "flex",
                  alignItems: "flex-end",
                  width: "100%",
                }}
              >
                <Col md="12">
                  <Button
                    color="primary"
                    onClick={() => {
                      editStopData(modalSupport);
                    }}
                    style={{ float: "right",marginBottom:'1rem' }}
                  >
                    Edit
                  </Button>
                </Col>
              </Row>
              <Table bordered responsive>
                <thead>
                  <tr>
                    <th>S No.</th>
                    <th>Place Name</th>
                    <th>pickup Time</th>
                    <th>DropTime</th>
                  </tr>
                </thead>
                {modalSupport.stops ? (
                  <>
                    {modalSupport.stops.map((stop, index) => {
                      return (
                        <tbody>
                          <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{stop.stopName}</td>
                            <td>{stop.pickupTime}</td>
                            <td>{stop.dropTime}</td>
                         
                          </tr>
                        </tbody>
                      );
                    })}
                  </>
                ) : (
                  <h3>No Data</h3>
                )}
              </Table>
            </ModalBody>
          )}
        </Modal>
      </Container>
    </>
  );
}

export default ViewRoute;
