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
  ModalHeader,
  ModalBody,
  ModalFooter,
  Form,
} from "reactstrap";
import { Popconfirm } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { Table } from "ant-table-extensions";
import AntTable from "../tables/AntTable";

import SimpleHeader from "components/Headers/SimpleHeader";
import LoadingScreen from "react-loading-screen";

import { toast, ToastContainer } from "react-toastify";
import { isAuthenticated } from "api/auth";

const ViewAssignments = ({setView}) => {
  const [loading, setLoading] = useState(false);
  const { user, token } = isAuthenticated();
  const [checked, setChecked] = useState(false);
  const [tableData, setTableData] = useState([]);

  const columns = [
    {
      title: "Sr No",
      dataIndex: "sr",
      align: "left",
      sorter: (a, b) => a.sr > b.sr,
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
        return record.sr.toLowerCase().includes(value.toLowerCase());
      },
    },
    {
      title: "Student's Name",
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
      title: "Submitted On",
      dataIndex: "submitted",
      align: "left",
      sorter: (a, b) => a.submitted > b.submitted,
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
        return record.submitted.toLowerCase().includes(value.toLowerCase());
      },
    },
    {
      title: "Action",
      key: "action",
      dataIndex: "action",
      fixed: "right",
      align: "left",
    },
    {
      title: "Marks",
      key: "marks",
      dataIndex: "marks",
      fixed: "right",
      align: "left",
    },
    {
      title: "Remark",
      key: "remark",
      dataIndex: "remark",
      fixed: "right",
      align: "left",
    },
    {
      title: "Submit",
      key: "submit",
      dataIndex: "submit",
      fixed: "right",
      align: "left",
    },
  ];
  const getAllAssignments = () => {
    let tableData = [
      {
        sr: 1,
        name: "John Doe",
        submitted: "12/12/2020",
        action: <Button color="primary">View</Button>,
        marks: <Input type="number" placeholder="Enter Marks" />,
        remark: <Input type="text" placeholder="Enter Remark" />,
        submit: <Button color="success">Submit</Button>,
      },
    ];
    setTableData(tableData);
  };
  useEffect(() => {
    getAllAssignments();
  }, [checked]);
  return (
    <>
      <SimpleHeader
        name="Students Assignment"
        parentName="Assignment Management"
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
      />
      <Container className="mt--6" >
        <Row style={{ marginLeft: "2rem" }}>
          <Col className="mt--3 ">
            <Button
              className="float-left mb-2"
              color="dark"
              onClick={() => setView(false)}
            >
              <i className="ni ni-bold-left"></i>
            </Button>
          </Col>
        </Row>
        <Card>
          <CardHeader>
            {" "}
            <h2>View Assignments</h2>
          </CardHeader>
          <CardBody>
            <AntTable
              columns={columns}
              data={tableData}
              pagination={true}
              exportFileName="staffBudget"
            />
          </CardBody>
        </Card>
      </Container>
    </>
  );
};

export default ViewAssignments;
