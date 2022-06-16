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
  addLibrarySection,
  getAllLibrarySection,
  addLibraryShelf,
  getAllLibraryShelf,
  deleteLibrarySection,
  deleteLibraryShelf,
  editLibraryShelf,
  editLibrarySection,
} from "../../../api/libraryManagement";
import { Popconfirm } from "antd";
import { SearchOutlined } from "@ant-design/icons";
const AddShelf = () => {
  const [sectionName, setSectionName] = useState("");
  const [sectionAbv, setSectionAbv] = useState("");
  const { user } = isAuthenticated();
  const [addLoading, setAddLoading] = useState(false);
  const [allSection, setAllSection] = useState([]);
  const [shelfName, setShelfName] = useState("");
  const [shelfAbv, setShelfAbv] = useState("");
  const [sectionId, setSectionId] = useState("");
  const [checked, setChecked] = useState(false);
  const [viewShelf, setViewShelf] = useState([]);
  const [isData, setisData] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedSectionId, setSelectedSectionId] = useState("empty");
  const [allShelf, setAllShelf] = useState([]);
  const [editing, setEditing] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [editShelfName, setEditShelfName] = useState("");
  const [editShelfAbv, setEditShelfAbv] = useState("");
  const [editShelfId, setEditShelfId] = useState("");
  const [sectionEditing, setSectionEditing] = useState(false);
  const [sectionEditName, setSectionEditName] = useState("");
  const [sectionEditAbbv, setSectionEditAbbv] = useState("");
  const [sectionData, setSectionData] = useState([]);
  const [editSectionLoading, setEditSectionLoading] = useState(false);
  const columns = [
    {
      title: "S No.",
      dataIndex: "s_no",
      align: "left",
    },
    {
      title: "Shelf Name",
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
    getAllSection();
    getAllShelf();
  }, [checked]);

  const getAllSection = async () => {
    try {
      const data = await getAllLibrarySection(user.school, user._id);
      console.log(data);
      setAllSection(data);
    } catch (err) {
      console.log(err);
      toast.error("Error in getting Sections");
    }
  };

  const addSectionHandler = async (e) => {
    e.preventDefault();
    let formData = new FormData();
    formData.set("name", sectionName);
    formData.set("abbreviation", sectionAbv);
    formData.set("school", user.school);
    try {
      setAddLoading(true);
      const data = await addLibrarySection(user._id, formData);
      console.log(data);
      if (data.err) {
        toast.error(data.err);
        setAddLoading(false);
        return;
      }
      toast.success("Section Added Successfully");
      setSectionName("");
      setSectionAbv("");
      setChecked(!checked);
      setAddLoading(false);
    } catch (err) {
      console.log(err);
      setAddLoading(false);
      toast.error("Section Added Failed");
    }
  };

  const getAllShelf = async () => {
    try {
      setLoading(true);
      const data = await getAllLibraryShelf(user.school, user._id);
      console.log(data);
      setAllShelf(data);
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  const addShelfHandler = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.set("name", shelfName);
    formData.set("abbreviation", shelfAbv);
    formData.set("section", sectionId);
    formData.set("school", user.school);

    try {
      setAddLoading(true);
      const data = await addLibraryShelf(user._id, formData);
      console.log(data);
      if (data.err) {
        toast.error(data.err);
        setAddLoading(false);
        return;
      }
      toast.success("Shelf Added Successfully");
      setChecked(!checked);
      setShelfName("");
      setShelfAbv("");
      setSectionId("");
      setAddLoading(false);
    } catch (err) {
      console.log(err);
      setAddLoading(false);
      toast.error("Shelf Added Failed");
    }
  };

  const editSectionHandler = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.set("name", sectionEditName);
    formData.set("abbreviation", sectionEditAbbv);
    // formData.set("school", user.school);

    try {
      setEditSectionLoading(true);
      const data = await editLibrarySection(
        selectedSectionId,
        user._id,
        formData
      );
      console.log(data);
      if (data.err) {
        toast.error(data.err);
        setEditSectionLoading(false);
        return;
      }
      toast.success("Section Updated Successfully");
      setSelectedSectionId("empty");
      setChecked(!checked);
      setSectionEditing(false);
      setEditSectionLoading(false);
    } catch (err) {
      setEditSectionLoading(false);
      console.log(err);
      toast.error("Section Update Failed");
    }
  };

  const tableData = async () => {
    if (selectedSectionId === undefined) {
      return;
    }
    if (selectedSectionId === "empty") {
      // console.log("empty");
      setisData(false);
      // setShowDeleteButton(false);
      return;
    }
    let selectedSection = await allSection.find(
      (section) => section._id === selectedSectionId
    );

    let sectionData = [];
    sectionData.push({
      key: 1,
      s_no: 1,
      section_name: selectedSection.name,
      abbreviation: selectedSection.abbreviation,
      action: (
        <h5 key={1} className="mb-0">
          {/* {permission1 && permission1.includes("edit") && ( */}
          <Button
            className="btn-sm pull-right"
            color="primary"
            type="button"
            key={"edit" + 1}
            onClick={() => {
              setSectionEditing(true);
              setSectionEditName(selectedSection.name);
              setSectionEditAbbv(selectedSection.abbreviation);
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
              onConfirm={() => deleteSectionHandler()}
            >
              <i className="fas fa-trash" />
            </Popconfirm>
          </Button>
          {/* )} */}
        </h5>
      ),
    });
    setSectionData(sectionData);
    const data = [];
    if (selectedSection.shelf.length === 0) {
      setisData(false);
      // setShowDeleteButton(true);
      return;
    }
    setisData(true);
    // setShowDeleteButton(true);
    for (let i = 0; i < selectedSection.shelf.length; i++) {
      data.push({
        key: i,
        s_no: [i + 1],
        shelf_name: selectedSection.shelf[i].name,
        shelf_abv: selectedSection.shelf[i].abbreviation,
        action: (
          <h5 key={i + 1} className="mb-0">
            <Button
              className="btn-sm pull-right"
              color="primary"
              type="button"
              key={"edit" + i + 1}
              onClick={() => {
                setEditing(true);
                setEditShelfName(selectedSection.shelf[i].name);
                setEditShelfAbv(selectedSection.shelf[i].abbreviation);
                setEditShelfId(selectedSection.shelf[i]._id);
              }}
            >
              <i className="fas fa-user-edit" />
            </Button>
            <Button
              className="btn-sm pull-right"
              color="danger"
              type="button"
              key={"delete" + i + 1}
            >
              <Popconfirm
                title="Sure to delete?"
                onConfirm={() =>
                  deleteShelfHandler(selectedSection.shelf[i]._id)
                }
              >
                <i className="fas fa-trash" />
              </Popconfirm>
            </Button>
          </h5>
        ),
      });
    }
    setViewShelf(data);
    setLoading(false);
  };

  const deleteShelfHandler = async (shelfId) => {
    try {
      setLoading(true);
      const data = await deleteLibraryShelf(user._id, shelfId);
      console.log(data);
      if (data.err) {
        toast.error(data.err);
        setLoading(false);
        return;
      }
      toast.success("Shelf Deleted Successfully");
      setChecked(!checked);
      setSelectedSectionId("empty");
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
      toast.error("Shelf Deleted Failed");
    }
  };

  const editShelfHandler = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.set("name", editShelfName);
    formData.set("abbreviation", editShelfAbv);
    formData.set("section", selectedSectionId);
    formData.set("school", user.school);
    try {
      setLoading(true);
      setEditLoading(true);
      const data = await editLibraryShelf(user._id, editShelfId, formData);
      console.log(data);
      if (data.err) {
        toast.error(data.err);
        setLoading(false);
        setEditLoading(false);
        return;
      }
      toast.success("Shelf Edited Successfully");
      setChecked(!checked);
      setSelectedSectionId("empty");
      setEditing(false);
      setLoading(false);
      setEditLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
      setEditLoading(false);
      toast.error("Shelf Edited Failed");
    }
  };

  useEffect(() => {
    if (selectedSectionId) {
      tableData();
    }
  }, [selectedSectionId]);

  const deleteSectionHandler = async () => {
    try {
      setLoading(true);
      const data = await deleteLibrarySection(user._id, selectedSectionId);
      console.log(data);
      if (data.err) {
        toast.error(data.err);
        setLoading(false);
        return;
      }
      setChecked(!checked);
      setSelectedSectionId("empty");
      toast.success("Section Deleted Successfully");
      setChecked(!checked);
    } catch (err) {
      console.log(err);
      toast.error("Section Delete Failed");
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
                      <h3>Add Library Section</h3>
                    </CardHeader>
                    <CardBody>
                      <Form className="mb-4" onSubmit={addSectionHandler}>
                        <Row>
                          <Col>
                            <Label
                              className="form-control-label"
                              htmlFor="example4cols2Input"
                            >
                              Section Name
                            </Label>
                            <Input
                              id="example4cols2Input"
                              placeholder="Section Name"
                              type="text"
                              onChange={(e) => setSectionName(e.target.value)}
                              value={sectionName}
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
                              Section Abbreviation
                            </Label>
                            <Input
                              id="example4cols2Input"
                              placeholder="Section Name"
                              type="text"
                              onChange={(e) => setSectionAbv(e.target.value)}
                              value={sectionAbv}
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
                              Add Section
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
                      <h3>Add Shelf</h3>
                    </CardHeader>
                    <CardBody>
                      <Form className="mb-4" onSubmit={addShelfHandler}>
                        <Row
                          md="4"
                          className="d-flex justify-content-center mb-4"
                        >
                          <Col md="12">
                            <Label
                              className="form-control-label"
                              htmlFor="example4cols2Input"
                            >
                              Shelf Name
                            </Label>
                            <Input
                              id="example4cols2Input"
                              placeholder="Name"
                              type="text"
                              onChange={(e) => setShelfName(e.target.value)}
                              value={shelfName}
                              required
                            />
                          </Col>
                          <Col md="12">
                            <Label
                              className="form-control-label"
                              htmlFor="exampleFormControlSelect3"
                            >
                              Section
                            </Label>
                            <Input
                              id="exampleFormControlSelect3"
                              type="select"
                              onChange={(e) => setSectionId(e.target.value)}
                              value={sectionId}
                              required
                            >
                              <option value="" selected>
                                Select Section
                              </option>
                              {allSection &&
                                allSection.map((section) => {
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
                              htmlFor="example4cols2Input"
                            >
                              Shelf Abbreviation
                            </Label>
                            <Input
                              id="example4cols2Input"
                              placeholder="Name"
                              type="text"
                              onChange={(e) => setShelfAbv(e.target.value)}
                              value={shelfAbv}
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
                              Add Shelf
                            </Button>
                          </Col>
                        </Row>
                      </Form>
                    </CardBody>
                  </Card>
                </div>
              </Col>
            </Row>
            <Row>
              <Col>
                <Container className="mt--6 shadow-lg" fluid>
                  <Card>
                    <CardHeader>
                      <h3>View Section</h3>
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
                            onChange={(e) =>
                              setSelectedSectionId(e.target.value)
                            }
                            value={selectedSectionId}
                            required
                            style={{ maxWidth: "10rem" }}
                          >
                            <option value="empty">Select Section</option>
                            {allSection.map((section) => {
                              return (
                                <option key={section._id} value={section._id}>
                                  {section.name}
                                </option>
                              );
                            })}
                          </Input>
                        </Col>
                      </Row>
                      <Row>
                        <Col>
                          {selectedSectionId !== "empty" && (
                            <AntTable
                              columns={columns1}
                              data={sectionData}
                              exportFileName="SectionDetails"
                            />
                          )}
                        </Col>
                      </Row>
                    </CardHeader>
                    <CardBody>
                      {!loading && viewShelf ? (
                        isData ? (
                          <>
                            <h3>View Shelf</h3>

                            <AntTable
                              columns={columns}
                              data={viewShelf}
                              pagination={true}
                              exportFileName="StudentDetails"
                            />
                          </>
                        ) : (
                          <h3>No Shelf Found</h3>
                        )
                      ) : (
                        <Loader />
                      )}
                    </CardBody>
                  </Card>
                </Container>
              </Col>
            </Row>
          </>
        )}
        <Modal
          className="modal-dialog-centered"
          isOpen={sectionEditing}
          toggle={() => setSectionEditing(false)}
          size="lg"
        >
          <div className="modal-header">
            <h2 className="modal-title" id="modal-title-default">
              Edit Section
            </h2>
            <button
              aria-label="Close"
              className="close"
              data-dismiss="modal"
              type="button"
              onClick={() => setSectionEditing(false)}
            >
              <span aria-hidden={true}>×</span>
            </button>
          </div>
          {editSectionLoading ? (
            <Loader />
          ) : (
            <ModalBody>
              <Form className="mb-4" onSubmit={editSectionHandler}>
                <Row>
                  <Col>
                    <Label
                      className="form-control-label"
                      htmlFor="example4cols2Input"
                    >
                      Section Name
                    </Label>
                    <Input
                      id="example4cols2Input"
                      placeholder="Name"
                      type="text"
                      onChange={(e) => setSectionEditName(e.target.value)}
                      value={sectionEditName}
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
                      Section Abbreviation
                    </Label>
                    <Input
                      id="example4cols2Input"
                      placeholder="Name"
                      type="text"
                      onChange={(e) => setSectionEditAbbv(e.target.value)}
                      value={sectionEditAbbv}
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
          isOpen={editing}
          toggle={() => setEditing(false)}
          size="lg"
        >
          <div className="modal-header">
            <h2 className="modal-title" id="modal-title-default">
              Edit Shelf
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
          {editLoading ? (
            <Loader />
          ) : (
            <ModalBody>
              <Form className="mb-4" onSubmit={editShelfHandler}>
                <Row>
                  <Col>
                    <Label
                      className="form-control-label"
                      htmlFor="example4cols2Input"
                    >
                      Shelf Name
                    </Label>
                    <Input
                      id="example4cols2Input"
                      placeholder="Name"
                      type="text"
                      onChange={(e) => setEditShelfName(e.target.value)}
                      value={editShelfName}
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
                      Shelf Abbreviation
                    </Label>
                    <Input
                      id="example4cols2Input"
                      placeholder="Name"
                      type="text"
                      onChange={(e) => setEditShelfAbv(e.target.value)}
                      value={editShelfAbv}
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
      </Container>
    </>
  );
};

export default AddShelf;
