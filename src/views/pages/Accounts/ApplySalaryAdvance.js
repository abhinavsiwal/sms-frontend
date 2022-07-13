import React, { useEffect, useState, useRef } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  CardHeader,
  CardBody,
  Form,
  Input,
  Button,
  Modal,
  ModalFooter,
  ModalBody,
} from "reactstrap";
import SimpleHeader from "components/Headers/SimpleHeader";

import { isAuthenticated } from "api/auth";
import { ToastContainer, toast } from "react-toastify";
import LoadingScreen from "react-loading-screen";

const ApplySalaryAdvance = () => {
  const [loading, setLoading] = useState(false);
  const { user, token } = isAuthenticated();
  const [checked, setChecked] = useState(false);
  const [amount, setAmount] = useState("");
  const [percentage, setPercentage] = useState(0);

const amountBlur = ()=>{
    if(amount>user.Data.salary){
        return toast.error("Amount cannot be greater than salary");
    }
    let total = Number(user.Data.salary);
    console.log(total);
    let req = Number(amount);
    console.log(req);
    let per = (100*req)/total;
    console.log(per);
    setPercentage(per);
}

  console.log(user);
  return (
    <>
      <SimpleHeader
        name="Apply Salary Advance"
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
        <Card>
          <CardHeader>
            <Row>
              <Col>
                <h4> Name : {user.firstname + " " + user.lastname}</h4>
              </Col>
              <Col>
                <h4> SID : {user.SID}</h4>
              </Col>
              <Col>
                <h4>Email : {user.email}</h4>
              </Col>
            </Row>
          </CardHeader>
          <CardBody>
            <form>
              <Row>
                <Col>
                  <label
                    className="form-control-label"
                    htmlFor="example4cols2Input"
                  >
                    Total Salary
                  </label>
                  <Input
                    id="example4cols2Input"
                    type="number"
                    disabled
                    required
                    value={user.Data.salary}
                  />
                </Col>
                <Col>
                  <label
                    className="form-control-label"
                    htmlFor="example4cols2Input"
                  >
                    Amount
                  </label>
                  <Input
                    id="example4cols2Input"
                    type="number"
                    required
                    placeholder="Enter Amount"
                    value={amount}
                    onBlur={amountBlur}
                    onChange={(e) => setAmount(e.target.value)}
                  />
                </Col>
                <Col>
                  <label
                    className="form-control-label"
                    htmlFor="example4cols2Input"
                  >
                    Percentage
                  </label>
                  <Input
                    id="example4cols2Input"
                    type="number"
                    required
                    disabled
                    value={percentage}
                  />
                </Col>
              </Row>
              <Row className="mt-4 float-right">
                <Col>
                  <Button color="primary" type="submit">
                    Add
                  </Button>
                </Col>
              </Row>
            </form>
          </CardBody>
        </Card>
      </Container>
    </>
  );
};

export default ApplySalaryAdvance;
