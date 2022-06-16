import React, { useEffect, useState, useReducer } from "react";

import {
  Container,
  Card,
  Input,
  CardHeader,
  CardBody,
  Row,
  Col,
  Button,
  Modal,
  ModalBody,
  ModalFooter,
} from "reactstrap";
import { SearchOutlined } from "@ant-design/icons";
import { Popconfirm } from "antd";
import SimpleHeader from "components/Headers/SimpleHeader";
import LoadingScreen from "react-loading-screen";
import { Table } from "ant-table-extensions";
import { isAuthenticated } from "api/auth";

import "./fees_style.css";

import { toast, ToastContainer } from "react-toastify";
import { createFees } from "api/FeesManagement";
import { allSessions } from "api/session";
import { allClass } from "api/class";
import { getFeesCustome } from "api/FeesManagement";
import { deleteFees } from "api/FeesManagement";
import { updateFees } from "api/FeesManagement";
import {
  createPenalty,
  deletePenalty,
  getFeesObject,
  getFeesPenalty,
  updatePenalty,
} from "../../../api/FeesManagement/penalty";

const SiblingMaster = () => {
  const [sessions, setSessions] = useState("");
  const [sessionID, setSessionID] = useState("");
  const [showLoad, setShowLoad] = useState(false);
  const [model, setModel] = useState(false);
  const [type, setType] = useState(0);
  const [formdataAdd, setFormdataAdd] = useState(new FormData());
  const [viewDataOnly, setViewDataOnly] = useState("");
  const [rateModel, setRateModel] = useState(false);

  const [ignored, forceUpdate] = useReducer((x) => x + 1, 0);

  useEffect(async () => {
    setShowLoad(true);
    await getAllSiblingDiscount();
    await getSession();
    setShowLoad(false);
  }, []);

  const getAllSiblingDiscount = () => {};

  const handleModelOpen = (e) => {
    e.preventDefault();
    setFormdataAdd(new FormData());
    setModel(true);
  };

  const handleChange = (name) => (event) => {
    event.preventDefault();
  };

  const handleChangeRate = (name) => (event) => {
    event.preventDefault();
  };

  const handleSubmitModel = (e) => {
    e.preventDefault();
  };
  const handleSubmitRate = (e) => {
    e.preventDefault();
  };

  const getSession = async () => {
    const { user, token } = isAuthenticated();
    try {
      const session = await allSessions(user._id, user.school, token);
      if (session.err) {
        return toast.error(session.err);
      } else {
        setSessions(session);
        return;
      }
    } catch (err) {
      toast.error("Something Went Wrong!");
    }
  };

  const column = [
    {
      key: "index",
      title: "#",
      dataIndex: "index",
      sorter: (record1, record2) => {
        return record1.index > record2.index;
      },
    },
    {
      key: "sibling_name",
      title: "Sibling Discount Name",
      dataIndex: "sibling_name",
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm }) => {
        return (
          <>
            <Row>
              <Col>
                <Input
                  autoFocus
                  id="search_bar_table"
                  placeholder="Type text here"
                  value={selectedKeys[0]}
                  onChange={(e) => {
                    setSelectedKeys(e.target.value ? [e.target.value] : []);
                    confirm({ closeDropdown: false });
                  }}
                  onBlur={() => {
                    confirm();
                  }}
                />
              </Col>
            </Row>
          </>
        );
      },
      filterIcon: () => {
        return <SearchOutlined />;
      },
      onFilter: (value, record) => {
        return record.sibling_name.toLowerCase().includes(value.toLowerCase());
      },
      sorter: (record1, record2) => {
        return record1.sibling_name > record2.sibling_name;
      },
    },
    {
      key: "session",
      title: "Session",
      dataIndex: "session",
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm }) => {
        return (
          <>
            <Row>
              <Col>
                <Input
                  autoFocus
                  id="search_bar_table"
                  placeholder="Type text here"
                  value={selectedKeys[0]}
                  onChange={(e) => {
                    setSelectedKeys(e.target.value ? [e.target.value] : []);
                    confirm({ closeDropdown: false });
                  }}
                  onBlur={() => {
                    confirm();
                  }}
                />
              </Col>
            </Row>
          </>
        );
      },
      filterIcon: () => {
        return <SearchOutlined />;
      },
      onFilter: (value, record) => {
        return record.session.toLowerCase().includes(value.toLowerCase());
      },
      sorter: (record1, record2) => {
        return record1.session > record2.session;
      },
    },
    {
      key: "action",
      title: "Action",
      dataIndex: "action",
    },
  ];
  const addSibling = [
    {
      key: "index",
      title: "#",
      dataIndex: "index",
      sorter: (record1, record2) => {
        return record1.index > record2.index;
      },
    },
    {
      key: "name",
      title: "Name",
      dataIndex: "name",
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm }) => {
        return (
          <>
            <Row>
              <Col>
                <Input
                  autoFocus
                  id="search_bar_table"
                  placeholder="Type text here"
                  value={selectedKeys[0]}
                  onChange={(e) => {
                    setSelectedKeys(e.target.value ? [e.target.value] : []);
                    confirm({ closeDropdown: false });
                  }}
                  onBlur={() => {
                    confirm();
                  }}
                />
              </Col>
            </Row>
          </>
        );
      },
      filterIcon: () => {
        return <SearchOutlined />;
      },
      onFilter: (value, record) => {
        return record.name.toLowerCase().includes(value.toLowerCase());
      },
      sorter: (record1, record2) => {
        return record1.name > record2.name;
      },
    },
    {
      key: "action",
      title: "Action",
      dataIndex: "action",
    },
  ];

  const handleRateAmount = (e) => {
    e.preventDefault();
    setRateModel(true);
  };

  return (
    <>
      <SimpleHeader name="Sibling" parentName="Fees Management" />
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
      <LoadingScreen
        loading={showLoad}
        bgColor="#f1f1f1"
        spinnerColor="#9ee5f8"
        textColor="#676767"
        text="Please Wait..."
      ></LoadingScreen>
      <Container fluid className="mt--6">
        <Card>
          <CardHeader>
            <h2>Sibling Discount</h2>
            <Button onClick={handleModelOpen}>Add Sibling</Button>
          </CardHeader>
          <CardBody>
            <div className="table_div_fees">
              <Table
                style={{ whiteSpace: "pre" }}
                loading={showLoad}
                exportableProps={{
                  fileName: "Sibling Fees",
                  showColumnPicker: true,
                }}
                pagination={{
                  pageSizeOptions: ["5", "10", "30", "60", "100", "1000"],
                  showSizeChanger: true,
                }}
                columns={column}
                dataSource={viewDataOnly}
              />
            </div>
          </CardBody>
        </Card>
      </Container>
      <Container fluid>
        <Card>
          <CardHeader>
            <Row>
              <Col md={6}>
                <p>Name : 2 Sibling</p>
                <p>Session : Selected Session</p>
              </Col>
              <Col md={3}>
                <select
                  required
                  className="form-control"
                  onChange={handleChange("session")}
                >
                  <option value="">Selection Box</option>
                  <option value="">Higer</option>
                  <option value="">Lower</option>
                  <option value="">Both</option>
                </select>
              </Col>
              <Col md={3}>
                <Button onClick={handleRateAmount}>Rate / Amount</Button>
              </Col>
            </Row>
          </CardHeader>
          <CardBody>
            <div className="table_div_fees">
              <Table
                style={{ whiteSpace: "pre" }}
                loading={showLoad}
                exportableProps={{
                  fileName: "Sibling Fees",
                  showColumnPicker: true,
                }}
                pagination={{
                  pageSizeOptions: ["5", "10", "30", "60", "100", "1000"],
                  showSizeChanger: true,
                }}
                columns={addSibling}
                dataSource={viewDataOnly}
              />
            </div>
          </CardBody>
        </Card>
      </Container>
      <Modal
        className="modal-dialog-centered"
        isOpen={model}
        toggle={() => setModel(false)}
        size="sm"
      >
        <div className="modal-header">
          <h2 className="modal-title" id="modal-title-default">
            Add Sibling Discount
          </h2>
          <button
            aria-label="Close"
            className="close"
            data-dismiss="modal"
            type="button"
            onClick={() => setModel(false)}
          >
            <span aria-hidden={true}>×</span>
          </button>
        </div>
        <form onSubmit={handleSubmitModel}>
          <ModalBody>
            <Row>
              <Col>
                <label className="form-control-label">Number Of Sibling</label>
                <Input
                  id="form-department-name"
                  onChange={handleChange("number_sibling")}
                  placeholder="Sibling Count"
                  type="Number"
                  required
                />
              </Col>
            </Row>
            <Row>
              <Col>
                <label className="form-control-label">Session</label>
                <select
                  required
                  className="form-control"
                  onChange={handleChange("session")}
                >
                  <option value="">Select Session</option>
                  {sessions &&
                    sessions.map((data) => {
                      return (
                        <option key={data._id} value={JSON.stringify(data)}>
                          {data.name}
                        </option>
                      );
                    })}
                </select>
              </Col>
            </Row>
            <Row>
              <Col>
                <label className="form-control-label">Name</label>
                <Input
                  id="form-department-name"
                  onChange={handleChange("name")}
                  placeholder="Name"
                  type="text"
                  required
                />
              </Col>
            </Row>
          </ModalBody>
          <ModalFooter>
            <Button color="success" type="submit">
              Create
            </Button>
          </ModalFooter>
        </form>
      </Modal>
      <Modal
        className="modal-dialog-centered"
        isOpen={rateModel}
        toggle={() => setRateModel(false)}
        size="sm"
      >
        <div className="modal-header">
          <h2 className="modal-title" id="modal-title-default">
            Add Rate
          </h2>
          <button
            aria-label="Close"
            className="close"
            data-dismiss="modal"
            type="button"
            onClick={() => setRateModel(false)}
          >
            <span aria-hidden={true}>×</span>
          </button>
        </div>
        <form onSubmit={handleSubmitRate}>
          <ModalBody>
            <Row>
              <Col>
                <label className="form-control-label">Rate / Amount</label>
                <Input
                  id="form-department-name"
                  onChange={handleChangeRate("amount")}
                  placeholder="Rate / Amount"
                  type="Number"
                  required
                />
              </Col>
            </Row>
            <Row>
              <Col>
                <label className="form-control-label">Type</label>
                <select
                  required
                  className="form-control"
                  onChange={handleChangeRate("session")}
                >
                  <option value="">Select Amount Type</option>
                  <option value="percentage">% Percentage</option>
                  <option value="flat">Flat</option>
                </select>
              </Col>
            </Row>
          </ModalBody>
          <ModalFooter>
            <Button color="success" type="submit">
              Submit
            </Button>
          </ModalFooter>
        </form>
      </Modal>
    </>
  );
};

export default SiblingMaster;
