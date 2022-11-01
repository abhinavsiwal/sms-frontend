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

import { assignmentSubmitStudents } from "api/assignment";
import { updateAssignmentMarks } from "api/assignment";

const ViewAssignments = ({ setView, assignment }) => {
  const [loading, setLoading] = useState(false);
  const { user, token } = isAuthenticated();
  const [checked, setChecked] = useState(false);
  const [inputFields, setInputFields] = useState({
    student_assignment_id: "",
    marks: "",
    remarks: "",
  });
  const [tableData, setTableData] = useState([]);
  // console.log(assignment);
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

  const getDetailsHandler = async () => {
    const formData = {
      assignment_id: assignment._id,
    };
    try {
      setLoading(true);
      const { data } = await assignmentSubmitStudents(
        user.school,
        user._id,
        formData
      );
      console.log(data);
      if (data.err) {
        toast.error(data.err);
        setLoading(false);
        return;
      }
      let tableData = [];

      data?.forEach((list, index) => {
        tableData.push({
          sr: index + 1,
          name: list.student.firstname + " " + list.student.lastname,
          submitted: formatDate(list.createdAt),
          action: (
            <>
              <a href={list.document_url} target="_blank">
                <Button color="primary">View</Button>
              </a>
            </>
          ),
          marks: (
            <Input
              type="number"
              placeholder="Enter Marks"
              onChange={handleChange("marks", list._id)}
              defaultValue={list.marks}
            />
          ),
          remark: (
            <Input
              type="text"
              placeholder="Enter Remark"
              onChange={handleChange("remarks", list._id)}
              defaultValue={list.remarks}
            />
          ),
          submit: (
            <Button color="success" onClick={handleSubmit}>
              Submit
            </Button>
          ),
        });
      });

      setTableData(tableData);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
      toast.error("Something went wrong");
    }
  };

  const formatDate = (date) => {
    var d = date ? new Date(date) : new Date(),
      month = "" + (d.getMonth() + 1),
      day = "" + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;

    return [year, month, day].join("/");
  };

  const handleChange = (name, assignmentId) => async (event) => {
    console.log(name, assignmentId);
    console.log(event.target.value);
    let temp = {};
    if (
      inputFields.student_assignment_id !== "" &&
      assignmentId !== inputFields.student_assignment_id
    ) {
      console.log("hre");
      setInputFields({});
      temp = {};
    }
    temp.student_assignment_id = assignmentId;
    if (name === "marks") {
      temp.marks = event.target.value;
    } else if (name === "remarks") {
      temp.remarks = event.target.value;
    }
    console.log(temp);
    let merged = Object.assign(inputFields, temp);
    console.log(merged);
    setInputFields(merged);
  };

  const handleSubmit = async () => {
    console.log(inputFields);
    try {
      setLoading(true);
      const data = await updateAssignmentMarks(
        user.school,
        user._id,
        inputFields
      );
      console.log(data);
      if (data.err) {
        toast.error(data.err);
        setLoading(false);
        return;
      }
      toast.success("Marks Submitted Successfully");
      setLoading(false);
      setChecked(!checked);
    } catch (err) {
      console.log(err);
      setLoading(false);
      toast.error("Something went wrong");
    }
  };

  useEffect(() => {
    getDetailsHandler();
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
      <Container className="mt--6">
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
