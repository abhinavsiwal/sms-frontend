import React, { useEffect, useState, useRef } from "react";
import { isAuthenticated } from "api/auth";
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
import LoadingScreen from "react-loading-screen";
import SimpleHeader from "components/Headers/SimpleHeader.js";
import { SearchOutlined } from "@ant-design/icons";
import AntTable from "../tables/AntTable";
import Loader from "components/Loader/Loader";
import { Popconfirm } from "antd";
import { toast, ToastContainer } from "react-toastify";

const SalaryAdvanceApprover = () => {
  const { user } = isAuthenticated();
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editStatus, setEditStatus] = useState("");
  const [editSalaryId, setEditSalaryId] = useState("");
  const [tableData, setTableData] = useState(false);
  const [checked, setChecked] = useState(false);

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      align: "left",
      sorter: (a, b) => a.name > b.name,
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
        return record.name.toLowerCase().includes(value.toLowerCase());
      },
    },
    {
      title: "Department",
      dataIndex: "department",
      align: "left",
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
      title: "Salary",
      dataIndex: "salary",
      align: "left",
      sorter: (a, b) => a.salary > b.salary,
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
        return record.salary.toLowerCase().includes(value.toLowerCase());
      },
    },
    {
      title: "Requested Amount",
      dataIndex: "amount",
      align: "left",
      sorter: (a, b) => a.amount > b.amount,
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
        return record.amount.toLowerCase().includes(value.toLowerCase());
      },
    },
    {
      title: "Status",
      dataIndex: "status",
      align: "left",
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
      title: "Action",
      key: "action",
      dataIndex: "action",
      fixed: "right",
      align: "left",
    },
  ];

useEffect(() => {
  
getSalaryHandler();
  
}, [checked])


  const getSalaryHandler = async () => {
    let data = [];
    data.push({
      name: "John Doe",
      department: "IT",
      salary: "100000",
      amount: "30000",
      status: "Pending",
      action: (
        <Button
          className="btn-sm pull-right"
          color="primary"
          type="button"
          key={"edit" + 1}
          onClick={() => {
            setEditing(true);
            // setEditSalaryId(leave._id);
          }}
        >
          <i className="fas fa-user-edit" />
        </Button>
      ),
    });
    setTableData(data);
  };

  return (
    <>
      <SimpleHeader
        name="Department Budget Allocations"
        parentName="Accounts Management"
      />
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
        loading={loading}
        bgColor="#f1f1f1"
        spinnerColor="#9ee5f8"
        textColor="#676767"
        text="Please Wait..."
      ></LoadingScreen>
      <Container className="mt--6" fluid>
        <div className="card-wrapper">
          <Card className="mb-4">
            <CardHeader>
              <h2>Approve Advance Sallary</h2>
            </CardHeader>
            <CardBody>
              <AntTable
                columns={columns}
                data={tableData}
                pagination={true}
                exportFileName="Salary Request"
              />
            </CardBody>
          </Card>
        </div>
      </Container>
      <Modal
          className="modal-dialog-centered"
          isOpen={editing}
          toggle={() => setEditing(false)}
          size="sm"
        >
          <div className="modal-header">
          <h2 className="modal-title" id="modal-title-default">
              Edit Status
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
            <Row>
              <Col>
              <label className="form-control-label">Status</label>
              <Input
                    id="form-class-name"
                    // value={editStatus}
                    // onChange={(e) => setEditStatus(e.target.value)}
                    placeholder="Class Name"
                    type="select"
                  >
                    <option value="">Select Status</option>
                    <option value="Awaiting">Awaiting</option>
                    <option value="Approved">Approved</option>
                    <option value="Declined">Declined</option>
                    <option value="Cancelled">Cancelled</option>
                  </Input>
              </Col>
            </Row>
            <Row>
                <Col>
                  <Button
                    color="primary"
                    type="button"
                    className="mt-2 float-right"
                    // onClick={handleEdit}
                  >
                    Save changes
                  </Button>
                </Col>
              </Row>
          </ModalBody>
        </Modal>
    </>
  );
};

export default SalaryAdvanceApprover;
