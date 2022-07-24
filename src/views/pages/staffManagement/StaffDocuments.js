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
  Form,
} from "reactstrap";
import { Popconfirm } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { allSessions } from "api/session";
import { Table } from "ant-table-extensions";

import SimpleHeader from "components/Headers/SimpleHeader";
import LoadingScreen from "react-loading-screen";
import { isAuthenticated } from "api/auth";
import { toast, ToastContainer } from "react-toastify";
import { getStaffByDepartment, allStaffs } from "api/staff";
import { getDepartment } from "api/department";

const StaffDocuments = () => {
  const [loading, setLoading] = useState(false);
  const { user, token } = isAuthenticated();

  const [allDepartments, setAllDepartments] = useState([]);
  const [filterStaff, setFilterStaff] = useState([]);
  const [checked, setChecked] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [staff, setStaff] = useState("");

  const [inputFields, setInputFields] = useState([
    {
      name: "",
      date: "",
      uploadBy: "",
      document: "",
      documentPreview: "",
      description: "",
    },
  ]);

  const handleChange = async (index, event) => {
    const values = [...inputFields];
    values[index][event.target.name] = event.target.value;

    if (event.target.name === "document") {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.readyState === 2) {
          values[index]["documentPreview"] = reader.result;
          values[index]["document"] = reader.result;
        }
      };
      reader.readAsDataURL(event.target.files[0]);
    }
  };

  const handleAddFields = () => {
    setInputFields([
      ...inputFields,
      {
        name: "",
        date: "",
        uploadBy: "",
        document: "",
        documentPreview: "",
        description: "",
      },
    ]);
  };
  const handleRemoveFields = (index) => {
    const values = [...inputFields];
    values.splice(index, 1);
    setInputFields(values);
  };

  const getAllDepartment = async () => {
    try {
      setLoading(true);
      const dept = await getDepartment(user.school, user._id, token);
      if (dept.err) {
        return toast.error(dept.err);
      }
      console.log(dept);
      setAllDepartments(dept);
      setLoading(false);
    } catch (err) {
      console.log(err);
      // toast.error("Error fetching departments");
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllDepartment();
  }, []);
  useEffect(() => {
    if (selectedDepartment !== "") {
      filterStaffHandler(selectedDepartment);
    }
  }, [selectedDepartment]);

  const filterStaffHandler = async (id) => {
    const formData = {
      departmentId: id,
    };
    try {
      setLoading(true);
      const data = await getStaffByDepartment(user.school, user._id, formData);
      console.log(data);
      if (data.err) {
        setLoading(false);
        return toast.error(data.err);
      }
      setFilterStaff(data);

      setLoading(false);
    } catch (err) {
      console.log(err);
      toast.error("Error fetching staff");
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    console.log(inputFields);
  };

  return (
    <>
      <SimpleHeader
        name="Staff Budget Allocations"
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
      <Container fluid className="mt--6">
        <Card>
          <CardHeader>
            <h2>Staff Budget Allocations</h2>
            <Row>
              <Col>
                <label
                  className="form-control-label"
                  htmlFor="example4cols2Input"
                >
                  Department
                </label>
                <Input
                  id="example4cols2Input"
                  type="select"
                  onChange={(e) => setSelectedDepartment(e.target.value)}
                  required
                  value={selectedDepartment}
                >
                  <option value="" selected>
                    Select Department
                  </option>
                  {allDepartments?.map((dept, index) => (
                    <option key={index} value={dept._id}>
                      {dept.name}
                    </option>
                  ))}
                </Input>
              </Col>
              <Col>
                <label
                  className="form-control-label"
                  htmlFor="example4cols2Input"
                >
                  Staff
                </label>
                <Input
                  id="example4cols2Input"
                  type="select"
                  onChange={(e) => setStaff(e.target.value)}
                  required
                  value={staff}
                >
                  <option value="" selected>
                    Select Staff
                  </option>
                  {filterStaff?.map((staff, index) => (
                    <option key={index} value={staff._id}>
                      {staff.firstname + " " + staff.lastname}
                    </option>
                  ))}
                </Input>
              </Col>
            </Row>
          </CardHeader>
          <CardBody>
            <h3>Add Documents</h3>
            {inputFields?.map((field, index) => {
              return (
                <>
                  <Row key={index}>
                    <Col>
                      <label
                        className="form-control-label"
                        htmlFor="example4cols2Input"
                      >
                        Document Name
                      </label>
                      <Input
                        id="exampleFormControlTextarea1"
                        type="text"
                        required
                        onChange={(e) => handleChange(index, e)}
                        value={field.name}
                        name="name"
                      />
                    </Col>

                    <Col>
                      <label
                        className="form-control-label"
                        htmlFor="example4cols2Input"
                      >
                        Upload Date
                      </label>
                      <Input
                        id="exampleFormControlTextarea1"
                        type="date"
                        required
                        onChange={(e) => handleChange(index, e)}
                        value={field.date}
                        name="date"
                      />
                    </Col>
                    <Col>
                      <label
                        className="form-control-label"
                        htmlFor="example4cols2Input"
                      >
                        Upload By
                      </label>
                      <Input
                        id="exampleFormControlTextarea1"
                        type="text"
                        required
                        onChange={(e) => handleChange(index, e)}
                        value={field.date}
                        name="uploadBy"
                      />
                    </Col>
                  </Row>
                  <Row className="mt-4">
                    <Col>
                      <label
                        className="form-control-label"
                        htmlFor="example4cols2Input"
                      >
                        Document
                      </label>
                      <Input
                        id="exampleFormControlTextarea1"
                        type="file"
                        required
                        onChange={(e) => handleChange(index, e)}
                        name="document"
                      />
                    </Col>
                    <Col sm={2}>
                      <img
                        src={field.documentPreview}
                        alt=""
                        style={{ width: "100px", height: "100px" }}
                      />
                    </Col>
                    <Col>
                      <label
                        className="form-control-label"
                        htmlFor="example4cols2Input"
                      >
                        Document
                      </label>
                      <Input
                        id="exampleFormControlTextarea1"
                        type="textarea"
                        required
                        onChange={(e) => handleChange(index, e)}
                        value={field.description}
                        name="description"
                      />
                    </Col>
                  </Row>
                  <Row className="mt-4" >
                    <Col >
                      <Button color="primary" onClick={handleAddFields}>
                        Add
                      </Button>
                   
                      <Button
                        color="danger"
                        onClick={() => handleRemoveFields(index)}
                      >
                        Remove
                      </Button>
                    </Col>
                  </Row>
                </>
              );
            })}
            <Row className="mt-4">
              <Col>
                <Button color="primary" onClick={handleSubmit}>
                  Submit
                </Button>
              </Col>
            </Row>
          </CardBody>
        </Card>
      </Container>
    </>
  );
};

export default StaffDocuments;
