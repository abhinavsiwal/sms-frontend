import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  Form,
  Label,
  Input,
  Button,
  CardHeader,
  Modal,
  ModalBody,
} from "reactstrap";
import Loader from "components/Loader/Loader";
import "react-datepicker/dist/react-datepicker.css";
import { isAuthenticated } from "api/auth";
import "./style.css";
import SimpleHeader from "components/Headers/SimpleHeader.js";
import { toast, ToastContainer } from "react-toastify";
import AntTable from "../tables/AntTable";
import {
  addBuilding,
  getAllBuildingsList,
  addBuildingFloor,
  getBuildingFloors,
  editBuilding,
  editFloor,
  deleteBuilding,
  deleteFloor,
} from "../../../api/hostelManagement";
import { Popconfirm } from "antd";
import { SearchOutlined } from "@ant-design/icons";
const AddBuilding = () => {
  const [buildingName, setBuildingName] = useState("");
  const [buildingAbv, setBuildingAbv] = useState("");
  const { user } = isAuthenticated();
  const [addLoading, setAddLoading] = useState(false);
  const [allBuildings, setAllBuildings] = useState([]);
  const [shelfName, setShelfName] = useState("");
  const [shelfAbv, setShelfAbv] = useState("");
  const [buildingId, setBuildingSelectionId] = useState("");
  const [noOfFloors, setNoOfFloors] = useState(1);
  const [noOfRooms, setNoOfRooms] = useState(1);
  const [sharingType, setSharingType] = useState("single");
  const [floorAbbr, setFloorAbbr] = useState("");
  const [checked, setChecked] = useState(false);
  const [selectedBuildingId, setSelectedBuildingId] = useState("empty");
  const [isData, setIsData] = useState(false);
  const [allFloors, setallFloors] = useState([]);
  const [selectedFloors, setSelectedFloors] = useState([]);
  const [buildingEditing, setBuildingEditing] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [buildingEditName, setBuildingEditName] = useState("");
  const [buildingEditAbbv, setBuildingEditAbbv] = useState("");
  const [floorEditing, setFloorEditing] = useState(false);
  const [floorEditNoFloors, setFloorEditNoFloors] = useState("");
  const [floorEditAbbv, setFloorEditAbbv] = useState("");
  const [floorEditfloorsRoom, setFloorEditFloorsRoom] = useState("");
  const [floorEditsharingType, setFloorEditSharingType] = useState("");
  const [floorEditId, setFloorEditId] = useState("");
  const [loading, setLoading] = useState(false);
  const columns = [
    {
      title: "S No.",
      dataIndex: "s_no",
      align: "left",
    },
    {
      title: "No. of Floors",
      align: "left",
      dataIndex: "noOfFloors",
      sorter: (a, b) => a.noOfFloors > b.noOfFloors,
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
        return record.noOfFloors.toLowerCase().includes(value.toLowerCase());
      },
    },
    {
      title: "Abbreviation ",
      dataIndex: "abv",
      align: "left",
      sorter: (a, b) => a.abv > b.abv,
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
        return record.abv.toLowerCase().includes(value.toLowerCase());
      },
    },
    {
      title: "Rooms per Floor ",
      dataIndex: "roomsPerFloor",
      align: "left",
      sorter: (a, b) => a.roomsPerFloor > b.roomsPerFloor,
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
        return record.roomsPerFloor.toLowerCase().includes(value.toLowerCase());
      },
    },
    {
      title: "Sharing Type",
      dataIndex: "sharingType",
      align: "left",
      sorter: (a, b) => a.sharingType > b.sharingType,
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
        return record.sharingType.toLowerCase().includes(value.toLowerCase());
      },
    },
    {
      title: "Action",
      align: "left",
      key: "action",
      dataIndex: "action",
      fixed: "right",
    },
  ];

  useEffect(() => {
    getAllBuildingsData();
    getFloorsHandler();
  }, [checked]);
  const getAllBuildingsData = async () => {
    try {
      const data = await getAllBuildingsList(user.school, user._id);
      console.log("data", data);
      setAllBuildings(data);
    } catch (err) {
      console.log(err);
      toast.error("Error in getting Sections");
    }
  };
  const addBuildingHandler = async (e) => {
    e.preventDefault();
    let formData = new FormData();
    formData.set("name", buildingName);
    formData.set("abbreviation", buildingAbv);
    formData.set("school", user.school);
    try {
      setAddLoading(true);
      const data = await addBuilding(user._id, formData);
      console.log(data);
      if (data.err) {
        toast.error(data.err);
        setAddLoading(false);
        return;
      }
      toast.success("Building Added Successfully");
      setBuildingName("");
      setBuildingAbv("");
      setChecked(!checked);
      setAddLoading(false);
    } catch (err) {
      console.log(err);
      setAddLoading(false);
      toast.error("Problem in adding building. Please try again.");
    }
  };
  const getFloorsHandler = async () => {
    try {
      setAddLoading(true);
      const data = await getBuildingFloors(user.school, user._id);
      console.log(data);
      setallFloors(data);
      setAddLoading(false);
    } catch (err) {
      console.log(err);
      setAddLoading(false);
      toast.error("Error in getting Sections");
    }
  };
  const addFloorHandler = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.set("building", buildingId);
    formData.set("no_of_floors", noOfFloors);
    formData.set("rooms_per_floor", noOfRooms);
    formData.set("sharing_type", sharingType);
    formData.set("abbreviation", floorAbbr);
    formData.set("school", user.school);
    try {
      setAddLoading(true);
      console.log(user._id, formData);
      const data = await addBuildingFloor(user._id, formData);
      if (data.err) {
        toast.error(data.err);
        setAddLoading(false);
        return;
      }
      toast.success("Shelf Added Successfully");
      setChecked(!checked);
      setShelfName("");
      setShelfAbv("");
      setBuildingSelectionId("");
      setAddLoading(false);
    } catch (err) {
      console.log(err);
      setAddLoading(false);
      toast.error("Shelf Added Failed");
    }
  };

  const editBuildingHandler = async () => {
    let building = allBuildings.find(
      (building) => building._id === selectedBuildingId
    );
    console.log(building);
    setBuildingEditName(building.name);
    setBuildingEditAbbv(building.abbreviation);
    setBuildingEditing(true);
  };

  const editBuildingSubmit = async () => {
    const formData = new FormData();
    formData.set("name", buildingEditName);
    formData.set("abbreviation", buildingEditAbbv);
    formData.set("building_id", selectedBuildingId);
    try {
      setEditLoading(true);
      const data = await editBuilding(user._id, formData);
      console.log(data);
      toast.success("Building editied successfully");
      setEditLoading(false);
      setBuildingEditing(false);
      setChecked(!checked);
    } catch (err) {
      console.log(err);
      setEditLoading(false);
      toast.error("Error in editing building");
    }
  };
  const editFloorSubmit = async () => {
    const formData = new FormData();
    formData.set("no_of_floors", floorEditNoFloors);
    formData.set("abbreviation", floorEditAbbv);
    formData.set("sharing_type", floorEditsharingType);
    formData.set("floor_id", floorEditId);
    formData.set("rooms_per_floor", floorEditfloorsRoom);
    formData.set("building", selectedBuildingId);
    try {
      setEditLoading(true);
      const data = await editFloor(user._id, formData);
      console.log(data);
      if(data.err){
        setEditLoading(false);
        return toast.error(data.err)
      }
      toast.success("Building editied successfully");
      setEditLoading(false);
      setFloorEditing(false);
      setChecked(!checked);
      setSelectedBuildingId("empty");
    } catch (err) {
      console.log(err);
      setEditLoading(false);
      toast.error("Error in editing building");
    }
  };

  const deleteBuildingHandler = async () => {
    const formData = new FormData();
    formData.set("id", selectedBuildingId);
    try {
      setLoading(false);
      const data = await deleteBuilding(user._id, formData);
      console.log(data);
      if(data.err){
        setLoading(false);
        return toast.error(data.err)
      }
      toast.success("Building Deleted Successfully");
      setLoading(false);
      setSelectedBuildingId("empty");
      setChecked(!checked);
    } catch (err) {
      console.log(err);
      toast.error("Delete Building Failed");
      setLoading(false);
    }
  };
  const deleteFloorHandler = async (id) => {
    console.log(id);
    const formData = new FormData();
    formData.set("floor_id", id);
    formData.set("building_id", selectedBuildingId);
    try {
      setLoading(false);
      const data = await deleteFloor(user._id, formData);
      console.log(data);
      if(data.err){
        setLoading(false);
        return toast.error(data.err)
      }
      toast.success("Floor Deleted Successfully");
      setLoading(false);
      setSelectedBuildingId("empty");
      setChecked(!checked);
    } catch (err) {
      console.log(err);
      toast.error("Delete Floor Failed");
      setLoading(false);
    }
  };

  const tableData = async () => {
    if (selectedBuildingId === undefined) {
      return;
    }
    if (selectedBuildingId === "empty") {
      // console.log("empty");
      setIsData(false);
      // setShowDeleteButton(false);
      return;
    }
    let selectedBuilding = await allFloors.filter(
      (floor) => floor.building._id === selectedBuildingId
    );
    console.log(selectedBuilding);
    const data = [];
    if (selectedBuilding.length === 0) {
      setIsData(false);
      return;
    }
    setIsData(true);
    for (let i = 0; i < selectedBuilding.length; i++) {
      data.push({
        key: i,
        s_no: i + 1,
        noOfFloors: selectedBuilding[i].no_of_floors,
        abv: selectedBuilding[i].abbreviation,
        roomsPerFloor: selectedBuilding[i].rooms_per_floor,
        sharingType: selectedBuilding[i].sharing_type,
        action: (
          <h5 key={1} className="mb-0">
            {/* {permission1 && permission1.includes("edit") && ( */}
            <Button
              className="btn-sm pull-right"
              color="primary"
              type="button"
              key={"edit" + 1}
              onClick={() => {
                setFloorEditing(true);
                setFloorEditAbbv(selectedBuilding[i].abbreviation);
                setFloorEditFloorsRoom(selectedBuilding[i].rooms_per_floor);
                setFloorEditNoFloors(selectedBuilding[i].no_of_floors);
                setFloorEditSharingType(selectedBuilding[i].sharing_type);
                setFloorEditId(selectedBuilding[i]._id);
              }}
            >
              <i className="fas fa-user-edit" />
            </Button>
            {/* )} */}
            {/* {permission1 && permission1.includes("delete") && ( */}
            <Button
              className="btn-sm pull-right"
              color="danger"
              type="button"
              key={"delete" + 1}
            >
              <Popconfirm
                title="Sure to delete?"
                onConfirm={() => deleteFloorHandler(selectedBuilding[i]._id)}
              >
                <i className="fas fa-trash" />
              </Popconfirm>
            </Button>
            {/* )} */}
          </h5>
        ),
      });
    }
    setSelectedFloors(data);
  };
  useEffect(() => {
    if (selectedBuildingId) {
      tableData();
    }
  }, [selectedBuildingId, checked]);

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
      <SimpleHeader name="Library" parentName="Add Shelf" />
      <Container className="mt--6" fluid>
        {addLoading ? (
          <Loader />
        ) : (
          <>
            <Row>
              <Col lg="4">
                <div className="card-wrapper">
                  <Card>
                    <CardHeader>
                      <h3>Add Hostel Building</h3>
                    </CardHeader>
                    <CardBody>
                      <Form className="mb-4" onSubmit={addBuildingHandler}>
                        <Row>
                          <Col>
                            <Label
                              className="form-control-label"
                              htmlFor="example4cols2Input"
                            >
                              Building Name
                            </Label>
                            <Input
                              id="example4cols2Input"
                              placeholder="Building Name"
                              type="text"
                              onChange={(e) => setBuildingName(e.target.value)}
                              value={buildingName}
                              required
                            />
                          </Col>
                        </Row>
                        <Row>
                          <Col>
                            <Label
                              className="form-control-label"
                              htmlFor="example4cols2Input"
                            >
                              Building Abbreviation
                            </Label>
                            <Input
                              id="example4cols2Input"
                              placeholder="Building Abbreviation"
                              type="text"
                              onChange={(e) => setBuildingAbv(e.target.value)}
                              value={buildingAbv}
                              required
                            />
                          </Col>
                        </Row>
                        <Row className="mt-4">
                          <Col
                            style={{
                              display: "flex",
                              justifyContent: "center",
                              width: "100%",
                            }}
                          >
                            <Button color="primary" type="submit">
                              Add Building
                            </Button>
                          </Col>
                        </Row>
                      </Form>
                    </CardBody>
                  </Card>
                </div>
              </Col>
              <Col lg="8">
                <div className="card-wrapper">
                  <Card>
                    <CardHeader>
                      <h3>Add Floor</h3>
                    </CardHeader>
                    <CardBody>
                      <Form className="mb-4" onSubmit={addFloorHandler}>
                        <Row
                          md="4"
                          className="d-flex justify-content-center mb-4"
                        >
                          <Col md="12">
                            <Label
                              className="form-control-label"
                              htmlFor="example4cols2Input"
                            >
                              Building Name
                            </Label>
                            <Input
                              id="exampleFormControlSelect3"
                              type="select"
                              onChange={(e) =>
                                setBuildingSelectionId(e.target.value)
                              }
                              value={buildingId}
                              required
                            >
                              <option value="" selected>
                                Select Building Name
                              </option>
                              {allBuildings &&
                                allBuildings.map((section) => {
                                  return (
                                    <option
                                      key={section._id}
                                      value={section._id}
                                      selected
                                    >
                                      {section.name}
                                    </option>
                                  );
                                })}
                            </Input>
                          </Col>
                          <Col md="12">
                            <Label
                              className="form-control-label"
                              htmlFor="exampleFormControlSelect3"
                            >
                              No of floors
                            </Label>
                            <Input
                              id="example4cols2Input"
                              placeholder="Enter Number of floors"
                              type="number"
                              onChange={(e) => setNoOfFloors(e.target.value)}
                              value={noOfFloors}
                              required
                            />
                          </Col>
                          <Col md="12">
                            <Label
                              className="form-control-label"
                              htmlFor="example4cols2Input"
                            >
                              No of rooms per floor
                            </Label>
                            <Input
                              id="example4cols2Input"
                              placeholder="Name"
                              type="number"
                              onChange={(e) => setNoOfRooms(e.target.value)}
                              value={noOfRooms}
                              required
                            />
                          </Col>
                          <Col md="12">
                            <Label
                              className="form-control-label"
                              htmlFor="exampleFormControlSelect3"
                            >
                              Sharing Type
                            </Label>
                            <Input
                              id="exampleFormControlSelect3"
                              type="select"
                              onChange={(e) => setSharingType(e.target.value)}
                              value={sharingType}
                              required
                            >
                              <option value="single" selected>
                                Single
                              </option>
                              <option value="double">Double</option>
                              <option value="triple">Triple</option>
                            </Input>
                          </Col>
                          <Col md="12">
                            <Label
                              className="form-control-label"
                              htmlFor="example4cols2Input"
                            >
                              Floor Abbreviation
                            </Label>
                            <Input
                              id="example4cols2Input"
                              placeholder="Name"
                              type="text"
                              onChange={(e) => setFloorAbbr(e.target.value)}
                              value={floorAbbr}
                              required
                            />
                          </Col>
                          <Col
                            style={{
                              display: "flex",
                              justifyContent: "center",
                              width: "100%",
                              marginTop: "2rem",
                            }}
                            md="12"
                          >
                            <Button color="primary" type="submit">
                              Add Floor
                            </Button>
                          </Col>
                        </Row>
                      </Form>
                    </CardBody>
                  </Card>
                </div>
              </Col>
            </Row>
            <Container
              className="mt--6 shadow-lg"
              fluid
              style={{ marginTop: "4rem" }}
            >
              <Card>
                <CardHeader>
                  <h3>View Building</h3>
                  <Row
                    style={{
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <Col>
                      <Input
                        id="exampleFormControlSelect3"
                        type="select"
                        onChange={(e) => setSelectedBuildingId(e.target.value)}
                        value={selectedBuildingId}
                        required
                        style={{ maxWidth: "10rem" }}
                      >
                        <option value="empty">Select Building</option>
                        {allBuildings &&
                          allBuildings.map((building) => {
                            return (
                              <option key={building._id} value={building._id}>
                                {building.name}
                              </option>
                            );
                          })}
                      </Input>
                    </Col>
                    {isData && (
                      <Col>
                        <Button color="warning" onClick={deleteBuildingHandler}>
                          Delete Building
                        </Button>
                        <Button color="success" onClick={editBuildingHandler}>
                          Edit Building
                        </Button>
                      </Col>
                    )}
                  </Row>
                </CardHeader>
                {loading ? (
                  <Loader />
                ) : (
                  <CardBody>
                    {isData ? (
                      <>
                        <h3>View Floors</h3>
                        <AntTable
                          columns={columns}
                          data={selectedFloors}
                          pagination={true}
                          exportFileName="StudentDetails"
                        />
                      </>
                    ) : (
                      <h3>No Floors Found</h3>
                    )}
                  </CardBody>
                )}
              </Card>
            </Container>
          </>
        )}
      </Container>
      <Modal
        className="modal-dialog-centered"
        isOpen={buildingEditing}
        toggle={() => setBuildingEditing(false)}
        size="sm"
      >
        <div className="modal-header">
          <h2 className="modal-title" id="modal-title-default">
            Edit Building
          </h2>
          <button
            aria-label="Close"
            className="close"
            data-dismiss="modal"
            type="button"
            onClick={() => setBuildingEditing(false)}
          >
            <span aria-hidden={true}>×</span>
          </button>
        </div>
        {editLoading ? (
          <Loader />
        ) : (
          <ModalBody>
            <Form className="mb-4" onSubmit={editBuildingSubmit}>
              <Row>
                <Col>
                  <Label
                    className="form-control-label"
                    htmlFor="example4cols2Input"
                  >
                    Building Name
                  </Label>
                  <Input
                    id="example4cols2Input"
                    placeholder="Name"
                    type="text"
                    onChange={(e) => setBuildingEditName(e.target.value)}
                    value={buildingEditName}
                    required
                  />
                </Col>
              </Row>
              <Row>
                <Col>
                  <Label
                    className="form-control-label"
                    htmlFor="example4cols2Input"
                  >
                    Building Abbreviation
                  </Label>
                  <Input
                    id="example4cols2Input"
                    placeholder="Name"
                    type="text"
                    onChange={(e) => setBuildingEditAbbv(e.target.value)}
                    value={buildingEditAbbv}
                    required
                  />
                </Col>
              </Row>
              <Row className="mt-4 float-right">
                <Col>
                  <Button color="primary" type="submit">
                    Save Changes
                  </Button>
                </Col>
              </Row>
            </Form>
          </ModalBody>
        )}
      </Modal>
      <Modal
        className="modal-dialog-centered"
        isOpen={floorEditing}
        toggle={() => setFloorEditing(false)}
        size="md"
      >
        <div className="modal-header">
          <h2 className="modal-title" id="modal-title-default">
            Edit Floor
          </h2>
          <button
            aria-label="Close"
            className="close"
            data-dismiss="modal"
            type="button"
            onClick={() => setFloorEditing(false)}
          >
            <span aria-hidden={true}>×</span>
          </button>
        </div>
        {editLoading ? (
          <Loader />
        ) : (
          <ModalBody>
            <Form className="mb-4" onSubmit={editFloorSubmit}>
              <Row>
                <Col>
                  <Label
                    className="form-control-label"
                    htmlFor="example4cols2Input"
                  >
                    No. of Floors
                  </Label>
                  <Input
                    id="example4cols2Input"
                    placeholder="Name"
                    type="number"
                    onChange={(e) => setFloorEditNoFloors(e.target.value)}
                    value={floorEditNoFloors}
                    required
                  />
                </Col>

                <Col>
                  <Label
                    className="form-control-label"
                    htmlFor="example4cols2Input"
                  >
                    Floor Abbreviation
                  </Label>
                  <Input
                    id="example4cols2Input"
                    placeholder="Name"
                    type="text"
                    onChange={(e) => setFloorEditAbbv(e.target.value)}
                    value={floorEditAbbv}
                    required
                  />
                </Col>
              </Row>
              <Row>
                <Col>
                  <Label
                    className="form-control-label"
                    htmlFor="example4cols2Input"
                  >
                    Rooms per Floor
                  </Label>
                  <Input
                    id="example4cols2Input"
                    placeholder="Name"
                    type="number"
                    onChange={(e) => setFloorEditFloorsRoom(e.target.value)}
                    value={floorEditfloorsRoom}
                    required
                  />
                </Col>
                <Col>
                  <Label
                    className="form-control-label"
                    htmlFor="exampleFormControlSelect3"
                  >
                    Sharing Type
                  </Label>
                  <Input
                    id="exampleFormControlSelect3"
                    type="select"
                    onChange={(e) => setFloorEditSharingType(e.target.value)}
                    value={floorEditsharingType}
                    required
                  >
                    <option value="single">Single</option>
                    <option value="double">Double</option>
                    <option value="triple">Triple</option>
                  </Input>
                </Col>
              </Row>
              <Row className="mt-4 float-right">
                <Col>
                  <Button color="primary" type="submit">
                    Save Changes
                  </Button>
                </Col>
              </Row>
            </Form>
          </ModalBody>
        )}
      </Modal>
    </>
  );
};
export default AddBuilding;
