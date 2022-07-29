import React, { useEffect, useState, useRef } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  Form,
  Input,
  Button,
  Modal,
  ModalFooter,
  ModalBody,
  CardHeader,
} from "reactstrap";
import SimpleHeader from "components/Headers/SimpleHeader";
import { isAuthenticated } from "api/auth";
import { ToastContainer, toast } from "react-toastify";
import { Popconfirm } from "antd";
import LoadingScreen from "react-loading-screen";

const GradingMaster = () => {
  const [loading, setLoading] = useState(false);
  const { user, token } = isAuthenticated();
  const [checked, setChecked] = useState(false);
  const [inputFields, setInputFields] = useState([
    {
      min: "",
      max: "",
      grade: "",
      description: "",
    },
  ]);

  const handleChange = async (index, event) => {
    const values = [...inputFields];
    values[index][event.target.name] = event.target.value;
    setInputFields(values);
  };
  const handleAddFields = () => {
    setInputFields([
      ...inputFields,
      { min: "", max: "", grade: "", description: "" },
    ]);
  };
  const handleRemoveFields = (index) => {
    const values = [...inputFields];
    values.splice(index, 1);
    setInputFields(values);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(inputFields);
  };

  return (
    <>
      <SimpleHeader
        name="Grade Master"
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
      <Container className="mt--6">
        <Card>
          <CardHeader>
            <h2>Add Students</h2>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <table className="fees_table">
              <thead style={{ backgroundColor: "#c0c0c0" }}>
                <th style={{ backgroundColor: "#c0c0c0" }}>Min</th>
                <th style={{ backgroundColor: "#c0c0c0" }}>Max</th>
                <th style={{ backgroundColor: "#c0c0c0" }}>Grade</th>
                <th style={{ backgroundColor: "#c0c0c0" }}>Description</th>
                <th style={{ backgroundColor: "#c0c0c0" }}>Add</th>
                <th style={{ backgroundColor: "#c0c0c0" }}>Remove</th>
              </thead>
              <tbody>
                {inputFields?.map((inputfield, index) => {
                  return (
                    <tr key={index}>
                      <td>
                        <Input
                          id="exampleFormControlTextarea1"
                          type="number"
                          required
                          onChange={(e) => handleChange(index, e)}
                          value={inputfield.min}
                          name="min"
                          placeholder="Enter minimum marks"
                        />
                      </td>
                      <td>
                        <Input
                          id="exampleFormControlTextarea1"
                          type="number"
                          required
                          onChange={(e) => handleChange(index, e)}
                          value={inputfield.max}
                          name="max"
                          placeholder="Enter maximum marks"
                        />
                      </td>
                      <td>
                        <Input
                          id="exampleFormControlTextarea1"
                          type="text"
                          required
                          onChange={(e) => handleChange(index, e)}
                          value={inputfield.grade}
                          name="grade"
                          placeholder="Enter grade"
                        />
                      </td>
                      <td>
                        <Input
                          id="exampleFormControlTextarea1"
                          type="text"
                          required
                          onChange={(e) => handleChange(index, e)}
                          value={inputfield.description}
                          name="description"
                          placeholder="Enter description"
                        />
                      </td>
                      <td>
                        <Button
                          color="primary"
                          size="md"
                          style={{ fontSize: "1.2rem", padding: "0.2rem 1rem" }}
                          onClick={handleAddFields}
                        >
                          +
                        </Button>
                      </td>
                      <td>
                        <Button
                          color="danger"
                          onClick={() => handleRemoveFields(index)}
                          size="md"
                          style={{ fontSize: "1.2rem", padding: "0.2rem 1rem" }}
                        >
                          -
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <Row className="mt-4 my-4 mx-4 float-right">
              <Col>
                <Button color="primary" type="submit">
                  Submit
                </Button>
              </Col>
            </Row>
          </form>
        </Card>
      </Container>
    </>
  );
};

export default GradingMaster;
