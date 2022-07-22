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
import SimpleHeader from "components/Headers/SimpleHeader.js";
import { SearchOutlined } from "@ant-design/icons";
import AntTable from "../tables/AntTable";
import { Popconfirm } from "antd";
import { toast, ToastContainer } from "react-toastify";
import LoadingScreen from "react-loading-screen";
import { PDFDownloadLink } from "@react-pdf/renderer";
import SalarySlip from "./SalarySlip";

const PaySalary = () => {
  const { user } = isAuthenticated();
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [checked, setChecked] = useState(false);
  const [tableData, setTableData] = useState([]);

  const columns = [
    {
      title: "SNo",
      dataIndex: "SNo",
      key: "SNo",
      align: "left",
    },
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
      title: "Month",
      dataIndex: "month",
      align: "left",
      sorter: (a, b) => a.month > b.month,
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
        return record.month.toLowerCase().includes(value.toLowerCase());
      },
    },
    {
      title: "Total Amount",
      dataIndex: "amount",
      align: "left",
      sorter: (a, b) => a.amouont > b.amount,
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
        return record.month.toLowerCase().includes(value.toLowerCase());
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
      title: "Salary Slip",
      key: "action",
      dataIndex: "action",
      fixed: "right",
      align: "left",
    },
  ];

  useEffect(() => {
    getSalaryHandler();
  }, [checked]);

  const getSalaryHandler = async () => {
    let data = [];
    data.push({
      SNo: 1,
      name: "John Doe",
      department: "IT",
      month: "January",
      amount: "30000",
      status: "Due",
      action: (
        // <Button
        //   className="btn-sm pull-right"
        //   color="primary"
        //   type="button"
        //   key={"edit" + 1}
        //   onClick={slipGenerator}
        // >
        //   {/* <i className="fas fa-user-edit" /> */}
        //   Reshare
        // </Button>
        <PDFDownloadLink document={<SalarySlip />} fileName="SalarySlip.pdf">
          {({ blob, url, loading, error }) =>
            loading ? (
              "Loading document..."
            ) : (
              <Button
                className="btn-sm pull-right"
                color="primary"
                type="button"
                key={"edit" + 1}
              >
                Reshare
              </Button>
            )
          }
        </PDFDownloadLink>
      ),
    });
    setTableData(data);
  };

  return (
    <>
      <SimpleHeader
        name="Salary Advance Approver"
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
              <h2>Pay Sallary</h2>
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
    </>
  );
};

export default PaySalary;
