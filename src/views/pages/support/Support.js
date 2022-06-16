import React, { useState, useEffect, useRef } from "react";
import {
  Button,
  Form,
  Card,
  CardBody,
  Container,
  Row,
  Col,
  Input,
  Modal,
  ModalBody,
} from "reactstrap";
// core components
import SimpleHeader from "components/Headers/SimpleHeader.js";
import { support } from "api/support";
import { isAuthenticated } from "api/auth";
import { ToastContainer, toast } from "react-toastify";
import { SearchOutlined } from "@ant-design/icons";
import AntTable from "../tables/AntTable";
import { allSupports } from "api/support";
import Loader from "components/Loader/Loader";
import { fetchingSupportError } from "constants/errors";
import { addSupportError } from "constants/errors";
import { addSupportSuccess } from "constants/success";
import { useReactToPrint } from "react-to-print";
function Support() {
  const [checked, setChecked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [supportData, setSupportData] = useState({
    priority: "",
    root_caused: "",
    description: "",
  });
  const [addLoading, setAddLoading] = useState(false);
  const { user, token } = isAuthenticated();
  const [supportList, setSupportList] = useState([]);
  const [modalState, setModalState] = useState(false);
  const [modalSupport, setModalSupport] = useState({});
  const openModal = (support) => {
    setModalSupport(support);
    setModalState(true);
  };
  const [file, setFile] = useState();

  const fileReader = new FileReader();

  const handleOnChange = (e) => {
    setFile(e.target.files[0]);
  };

  let permissions = [];
  useEffect(() => {
    // console.log(user);
    if (user.permissions["Support"]) {
      permissions = user.permissions["Support"];
      // console.log(permissions);
    }
  }, [checked]);

  const handleOnSubmit = (e) => {
    e.preventDefault();

    if (file) {
      fileReader.onload = function (event) {
        const csvOutput = event.target.result;
      };

      fileReader.readAsText(file);
    }
  };
  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  useEffect(() => {
    const getAllSupports = async () => {
      setLoading(true);
      allSupports(user._id, user.school, token)
        .then((res) => {
          const data = [];
          for (let i = 0; i < res.length; i++) {
            data.push({
              key: i,
              sid: res[i].SID,
              status: res[i].status,
              root_caused: res[i].root_caused,
              action: (
                <h5 key={i + 1} className="mb-0">
                  {/* {permissions && permissions.includes("edit") && ( */}
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
                  {/* )} */}
                </h5>
              ),
            });
          }
          setSupportList(data);
          setLoading(false);
        })
        .catch((err) => {
          console.log(err);
          toast.error(fetchingSupportError);
          setLoading(false);
        });
    };
    getAllSupports();
  }, [checked]);

  const columns = [
    {
      title: "SID",
      dataIndex: "sid",
      width: "30%",
      align:"left",
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
      title: "Status",
      dataIndex: "status",
      width: "30%",
      align:"left",
      sorter: (a, b) => a.status > b.status,
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
        return record.status.toLowerCase().includes(value.toLowerCase());
      },
    },
    {
      title: "Root Caused",
      dataIndex: "root_caused",
      align:"left",
      width: "30%",
      sorter: (a, b) => a.root_caused > b.root_caused,
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
        return record.root_caused.toLowerCase().includes(value.toLowerCase());
      },
    },
    {
      title: "Action",
      align:"left",
      key: "action",
      dataIndex: "action",
      fixed: "right",
    },
  ];

  const [formData] = useState(new FormData());
  const handleChange = (name) => (event) => {
    // formData.set(name, event.target.value);
    setSupportData({ ...supportData, [name]: event.target.value });
  };

  const handleFormChange = async (e) => {
    e.preventDefault();
    const { user, token } = isAuthenticated();
    formData.set("school", user.school);
    // console.log(supportData);
    formData.set("priority", supportData.priority);
    formData.set("root_caused", supportData.root_caused);
    formData.set("description", supportData.description);
    setSupportData({
      priority: "",
      root_caused: "",
      description: "",
    });
    try {
      setAddLoading(true);
      const resp = await support(user._id, token, formData);
      // console.log(resp);

      if (resp.err) {
        setAddLoading(false);
        return toast.error(resp.err);
      }

      setAddLoading(false);
      setChecked(!checked);

      toast.success(addSupportSuccess);
    } catch (err) {
      setAddLoading(false);
      toast.error(addSupportError);
    }
  };
  return (
    <>
      <SimpleHeader name="Support" />
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
      <Container className="mt--6" fluid>
        <Row>
          {/* {permissions && permissions.includes("add".trim()) && ( */}
          <Col lg="4">
            <div className="card-wrapper">
              <Card>
                <Row>
                  <Col className="d-flex justify-content-center mt-2  ml-4">
                    <form>
                      <input
                        type={"file"}
                        id={"csvFileInput"}
                        accept={".csv"}
                        onChange={handleOnChange}
                      />

                      <Button
                        onClick={(e) => {
                          handleOnSubmit(e);
                        }}
                        color="primary"
                        className="mt-2"
                      >
                        IMPORT CSV
                      </Button>
                    </form>
                  </Col>
                </Row>
                <Form className="mb-4" onSubmit={handleFormChange} >
                  {addLoading ? (
                    <Loader />
                  ) : (
                    <CardBody className="ml-4 mr-4">
                      <Row>
                        <label
                          className="form-control-label"
                          htmlFor="exampleFormControlSelect1"
                        >
                          Priority
                        </label>
                        <Input
                          id="exampleFormControlSelect1"
                          type="select"
                          onChange={handleChange("priority")}
                          value={supportData.priority}
                          required
                        >
                          <option value="" >Select Priority</option>
                          <option value="P1">P1 - Critical</option>
                          <option value="P2">P2 - Medium</option>
                          <option value="P3">P3 - Normal</option>
                        </Input>
                      </Row>
                      <Row className="mt-4">
                        <label
                          className="form-control-label"
                          htmlFor="example4cols2Input"
                        >
                          Root Caused
                        </label>
                        <Input
                          id="example4cols2Input"
                          placeholder="Root Caused"
                          type="text"
                          onChange={handleChange("root_caused")}
                          value={supportData.root_caused}
                          required
                        />
                      </Row>
                      <Row className="mt-4">
                        <label
                          className="form-control-label"
                          htmlFor="exampleFormControlTextarea1"
                        >
                          Description
                        </label>
                        <Input
                          id="exampleFormControlTextarea1"
                          rows="5"
                          type="textarea"
                          onChange={handleChange("description")}
                          value={supportData.description}
                          required
                        />
                      </Row>
                      <Row className="mt-4">
                        <Col
                          style={{ display: "flex", justifyContent: "center" }}
                        >
                          <Button color="primary" >
                            Submit
                          </Button>
                        </Col>
                      </Row>
                    </CardBody>
                  )}
                </Form>
              </Card>
            </div>
          </Col>
          {/* )} */}
          <Col>
            <div className="card-wrapper">
              <Card>
                <CardBody>
                  <Button
                    color="primary"
                    className="mb-2"
                    onClick={handlePrint}
                    style={{ float: "right" }}
                  >
                    Print
                  </Button>
                  {!loading && supportList ? (
                    <div ref={componentRef}>
                      <AntTable
                        columns={columns}
                        data={supportList}
                        pagination={true}
                        exportFileName="SupportDetails"
                      />
                    </div>
                  ) : (
                    <Loader />
                  )}
                </CardBody>
              </Card>
            </div>
          </Col>
        </Row>
      </Container>
      <Modal
        className="modal-dialog-centered"
        isOpen={modalState}
        toggle={() => setModalState(false)}
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
            onClick={() => setModalState(false)}
          >
            <span aria-hidden={true}>×</span>
          </button>
        </div>
        <ModalBody>
          <Row>
            <Col align="center">
              <h4 className="mt-3 mb-1">SID</h4>
              <span className="text-md">{modalSupport.SID}</span>
            </Col>
            <Col align="center">
              <h4 className="mt-3 mb-1">Status</h4>
              <span className="text-md">{modalSupport.status}</span>
            </Col>
          </Row>
          <Row>
            <Col align="center">
              <h4 className="mt-3 mb-1">Priority</h4>
              <span className="text-md">{modalSupport.priority}</span>
            </Col>
            <Col align="center">
              <h4 className="mt-3 mb-1">Root Caused</h4>
              <span className="text-md">{modalSupport.root_caused}</span>
            </Col>
          </Row>
          <Row>
            <Col align="center">
              <h4 className="mt-3 mb-1">Description</h4>
              <span className="text-md">{modalSupport.description}</span>
            </Col>
          </Row>
        </ModalBody>
      </Modal>
    </>
  );
}

export default Support;
