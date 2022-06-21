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
} from "reactstrap";
import Loader from "components/Loader/Loader";
import "react-datepicker/dist/react-datepicker.css";
import { isAuthenticated } from "api/auth";
import "./style.css";
import SimpleHeader from "components/Headers/SimpleHeader.js";
import { toast, ToastContainer } from "react-toastify";
import {
  addBuilding,
  getAllBuildingsList,
  addBuildingFloor,
} from "../../../api/hostelManagement";
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
  const columns = [
    {
      title: "S No.",
      dataIndex: "s_no",
      align: "left",
    },
    {
      title: "Building Name",
      align: "left",
      dataIndex: "shelf_name",
      sorter: (a, b) => a.shelf_name > b.shelf_name,
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
        return record.shelf_name.toLowerCase().includes(value.toLowerCase());
      },
    },
    {
      title: "Shelf Abbreviation ",
      dataIndex: "shelf_abv",
      align: "left",
      sorter: (a, b) => a.shelf_abv > b.shelf_abv,
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
        return record.shelf_abv.toLowerCase().includes(value.toLowerCase());
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
  const columns1 = [
    {
      title: "S No.",
      dataIndex: "s_no",
      align: "left",
    },
    {
      title: "Section Name",
      dataIndex: "section_name",
      align: "left",
      sorter: (a, b) => a.section_name > b.section_name,
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
        return record.section_name.toLowerCase().includes(value.toLowerCase());
      },
    },
    {
      title: "Abbreviation",
      dataIndex: "abbreviation",
      align: "left",
      sorter: (a, b) => a.abbreviation > b.abbreviation,
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
        return record.abbreviation.toLowerCase().includes(value.toLowerCase());
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
          </>
        )}
      </Container>
    </>
  );
};
export default AddBuilding;
