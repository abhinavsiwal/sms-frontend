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
import S3FileUpload from "react-s3";

import SimpleHeader from "components/Headers/SimpleHeader";
import LoadingScreen from "react-loading-screen";
import { isAuthenticated } from "api/auth";
import { toast, ToastContainer } from "react-toastify";
import {
  getStaffByDepartment,
  allStaffs,
  uploadStaffDocuments,
  getStaffDocuments,
} from "api/staff";
import { getDepartment } from "api/department";
import { uploadFile } from "api/upload";
const StaffDocuments = () => {
  const [loading, setLoading] = useState(false);
  const { user, token } = isAuthenticated();
  const [allStaff, setAllStaff] = useState([]);
  const [allDepartments, setAllDepartments] = useState([]);
  const [filterStaff, setFilterStaff] = useState([]);
  const [checked, setChecked] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [staff, setStaff] = useState("");
  const getAllStaffs = async () => {
    try {
      setLoading(true);
      const { data } = await allStaffs(user.school, user._id);
      console.log(data);
      //   let canteenStaff = data.find((staff) => staff.assign_role === "library");
      setAllStaff(data);
      setLoading(false);
    } catch (err) {
      console.log(err);
      toast.error("Fetching Staffs Failed");
      setLoading(false);
    }
  };
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
    console.log(event.target.name, event.target.value);
    const values = [...inputFields];
    values[index][event.target.name] = event.target.value;

    if (event.target.name === "document") {
      values[index]["document"] = event.target.files[0];
    }
    setInputFields(values);
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
  const getStaffDocumentsHandler = async () => {
    const formData = new FormData();
    formData.set("staff", staff);
    formData.set("department", selectedDepartment);
    formData.set("role", "STA");
    try {
      setLoading(true);
      const data = await getStaffDocuments(user.school, user._id, formData);
      console.log(data);
      if (data.err) {
        setLoading(false);
        return toast.error(data.err);
      }
      let fields = [];
      data.forEach((field) => {
        fields.push({
          name: field.doc.name,
          description: field.doc.description,
          document: field.doc.documents[0],
          documentPreview: field.document_url[0],
        });
      });
      setInputFields(fields);
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
      toast.error("Error fetching staff documents");
    }
  };

  useEffect(() => {
    if (staff === "") {
      return;
    }
    getStaffDocumentsHandler();
  }, [staff,checked]);

  useEffect(() => {
    getAllDepartment();
    getAllStaffs();
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
    let documentData = [];
    for (const field of inputFields) {
      console.log(field);
      if (field.documentPreview !== "") {
        console.log("preview");
        documentData.push({
          name: field.name,
          description: field.description,
          documents: field.document,
          upload_date: new Date().toISOString().split("T")[0],
          upload_by: user._id,
        });
      } else {
        console.log("image");
        const formData = new FormData();
        formData.set("file", field.document);
        try {
          setLoading(true);
          const data = await uploadFile(formData);
          console.log(data);
          if (data.err) {
            setLoading(false);
            return toast.error(data.err);
          }
          documentData.push({
            name: field.name,
            description: field.description,
            documents: data.data[0],
            upload_date: new Date().toISOString().split("T")[0],
            upload_by: user._id,
          });

          setLoading(false);
        } catch (err) {
          console.log(err);
          setLoading(false);
          toast.error("Error uploading file");
        }
      }
    }
    console.log(documentData);
    const formData1 = new FormData();
    formData1.set("document_data", JSON.stringify(documentData));
    formData1.set("staff", staff);
    formData1.set("department", selectedDepartment);
    formData1.set("role", "STA");

    try {
      setLoading(true);
      const data = await uploadStaffDocuments(user.school, user._id, formData1);
      console.log(data);
      if (data.err) {
        setLoading(false);
        return toast.error(data.err);
      }
      toast.success("Documents Uploaded Successfully");
      setChecked(!checked);
      // setInputFields({
      //   name: "",
      //   date: "",
      //   uploadBy: "",
      //   document: "",
      //   documentPreview: "",
      //   description: "",
      // });
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
      toast.error("Error uploading documents");
    }
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
            <h2>Staff Documents Upload</h2>
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
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <h2>Add Documents</h2>
              <Button
                color="primary"
                size="sm"
                onClick={handleAddFields}
                style={{ padding: "0.2rem 0.9rem" }}
              >
                Add Documents
              </Button>
            </div>
            {inputFields?.map((field, index) => {
              return (
                <>
                  <Row key={index}>
                    <Col md={3}>
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
                        placeholder="Document Name"
                      />
                    </Col>
                    <Col md={4}>
                      <label
                        className="form-control-label"
                        htmlFor="example4cols2Input"
                      >
                        Description
                      </label>
                      <Input
                        id="exampleFormControlTextarea1"
                        type="textarea"
                        required
                        onChange={(e) => handleChange(index, e)}
                        value={field.description}
                        name="description"
                        placeholder="description"
                      />
                    </Col>
                    {field.documentPreview === "" ? (
                      <>
                        <Col md={3}>
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
                      </>
                    ) : (
                      <>
                        <Col md={3}>
                          <img
                            src={field.documentPreview}
                            alt=""
                            height={100}
                            width={150}
                          />
                        </Col>
                      </>
                    )}

                    {/* <Col>
                      <label
                        className="form-control-label"
                        htmlFor="example4cols2Input"
                      >
                        Upload By
                      </label>
                      <Input
                        id="exampleFormControlTextarea1"
                        type="select"
                        required
                        onChange={(e) => handleChange(index, e)}
                        value={field.uploadBy}
                        name="uploadBy"
                      >
                        <option value="" selected>
                          Select Staff
                        </option>
                        {allStaff?.map((staff, index) => {
                          return (
                            <option key={index} value={staff._id}>
                              {staff.firstname + " " + staff.lastname}
                            </option>
                          );
                        })}
                      </Input>
                    </Col> */}
                    <Col style={{ marginTop: "2rem", float: "right" }} md={2}>
                      <Button
                        color="danger"
                        onClick={() => handleRemoveFields(index)}
                        style={{ padding: "0.1rem 0.7rem" }}
                      >
                        <span style={{ fontSize: "1.4rem" }}>-</span>
                      </Button>
                      <Button
                        color="primary"
                        onClick={handleAddFields}
                        style={{ padding: "0.1rem 0.7rem" }}
                      >
                        <span style={{ fontSize: "1.4rem" }}>+</span>
                      </Button>
                    </Col>
                  </Row>
                  <Row className="mt-4"></Row>
                  {/* <hr style={{ marginTop: "1rem 0" }} /> */}
                </>
              );
            })}
            <Row
              className="mt-2 float-center"
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: "100%",
              }}
            >
              <Col
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  width: "100%",
                }}
              >
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
