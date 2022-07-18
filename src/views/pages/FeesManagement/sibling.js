import "./fees_style.css";
import React, { useEffect, useState } from "react";
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
import { filterStudent } from "api/student";
import { allClass } from "api/class";
import LoadingScreen from "react-loading-screen";
import { allSessions } from "api/session";

const SiblingMaster = () => {
  const [loading, setLoading] = useState(false);
  const { user, token } = isAuthenticated();
  const [checked, setChecked] = useState(false);
  const [classList, setClassList] = useState([]);
  const [sessions, setSessions] = useState("");
  const [twoModal, setTwoModal] = useState(false);
  const [threeModal, setThreeModal] = useState(false);
  const [fourModal, setFourModal] = useState(false);
  const [fiveModal, setFiveModal] = useState(false);

  const getSession = async () => {
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
  const getAllClasses = async () => {
    try {
      setLoading(true);
      const classess = await allClass(user._id, user.school, token);
      console.log("classes", classess);
      if (classess.err) {
        setLoading(false);
        return toast.error(classess.err);
      }
      setClassList(classess);
      setLoading(false);
      // toast.success(fetchingClassSuccess)
      setLoading(false);
    } catch (err) {
      toast.error("Fetching Classes Failed");
    }
  };

  useEffect(() => {
    getAllClasses();
    getSession();
  }, [checked]);

  return (
    <>
      <SimpleHeader name="Sibling Master" parentName="Fees Management" />
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
            <h2>Add Sibling</h2>
          </CardHeader>
          <CardBody>
            <div className="table_div_fees">
              <table className="fees_table">
                <thead>
                  <th>SNo</th>
                  <th>Sibling Discount Name</th>
                  <th>Session</th>
                  <th>Add</th>
                </thead>
                <tbody>
                  <tr>
                    <td>1</td>
                    <td>2 Sibling</td>
                    <td>
                      <select
                        required
                        className="form-control"
                        // onChange={handleSession}
                      >
                        <option value="">Select Session</option>
                        {sessions &&
                          sessions.map((data) => {
                            return (
                              <option key={data._id} value={data._id}>
                                {data.name}
                              </option>
                            );
                          })}
                      </select>
                    </td>
                    <td>
                      <button className="btn btn-primary" onClick={()=>{
                        setTwoModal(true)
                      }} >Add</button>
                    </td>
                  </tr>
                  <tr>
                    <td>2</td>
                    <td>3 Sibling</td>
                    <td>
                      <select
                        required
                        className="form-control"
                        // onChange={handleSession}
                      >
                        <option value="">Select Session</option>
                        {sessions &&
                          sessions.map((data) => {
                            return (
                              <option key={data._id} value={data._id}>
                                {data.name}
                              </option>
                            );
                          })}
                      </select>
                    </td>
                    <td>
                      <button className="btn btn-primary">Add</button>
                    </td>
                  </tr>
                  <tr>
                    <td>3</td>
                    <td>4 Sibling</td>
                    <td>
                      <select
                        required
                        className="form-control"
                        // onChange={handleSession}
                      >
                        <option value="">Select Session</option>
                        {sessions &&
                          sessions.map((data) => {
                            return (
                              <option key={data._id} value={data._id}>
                                {data.name}
                              </option>
                            );
                          })}
                      </select>
                    </td>
                    <td>
                      <button className="btn btn-primary">Add</button>
                    </td>
                  </tr>
                  <tr>
                    <td>4</td>
                    <td>5 Sibling</td>
                    <td>
                      <select
                        required
                        className="form-control"
                        // onChange={handleSession}
                      >
                        <option value="">Select Session</option>
                        {sessions &&
                          sessions.map((data) => {
                            return (
                              <option key={data._id} value={data._id}>
                                {data.name}
                              </option>
                            );
                          })}
                      </select>
                    </td>
                    <td>
                      <button className="btn btn-primary">Add</button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardBody>
        </Card>
      </Container>
      <Modal
        className="modal-dialog-centered"
        isOpen={twoModal}
        toggle={() => setTwoModal(false)}
        size="lg"
      >
        <ModalBody>
          <div className="table_div_fees">
            <table className="fees_table">
              <thead>
                <th>SNo</th> 
                <th>Class</th>
                <th>Section</th>
                <th>Name</th>
                <th>Rate/Amount</th>
                <th>Type</th>
              </thead>
            </table>
          </div>
        </ModalBody>
      </Modal>
    </>
  );
};

export default SiblingMaster;
