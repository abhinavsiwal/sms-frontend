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
const Promotion = () => {
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
      title: "Class",
      dataIndex: "class",
      align: "left",
      sorter: (a, b) => a.class > b.class,
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
        return record.class.toLowerCase().includes(value.toLowerCase());
      },
    },
    {
      title: "Gender",
      dataIndex: "gender",
      align: "left",
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
      title: "Parent/Guardian",
      dataIndex: "parent",
      align: "left",
      sorter: (a, b) => a.parent > b.parent,
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
        return record.parent.toLowerCase().includes(value.toLowerCase());
      },
    },
    {
      title: "Phone",
      dataIndex: "phone",
      align: "left",
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
      title: "Action",
      key: "action",
      dataIndex: "action",
      fixed: "right",
      align: "left",
    },
  ];

  const getPromotionHandler = () => {
    const data = [
      {
        SNo: 1,
        name: "John Doe",
        class: "JSS 1",
        gender: "Male",
        parent: "Abhinav",
        phone: "8979787856",
        action: (
          <>
            <Button color="primary" >Promote</Button>
          </>
        ),
      },
    ];
    setTableData(data);
  };

  useEffect(() => {
    
    getPromotionHandler()
  }, []);
  return  <>
  <SimpleHeader
    name="Promote Students"
    parentName="Result Management"
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
          <h2>Promotions</h2>
        </CardHeader>
        <CardBody>
          <AntTable
            columns={columns}
            data={tableData}
            pagination={true}
            exportFileName="Promotions"
          />
        </CardBody>
      </Card>
    </div>
  </Container>
</>
};

export default Promotion;
