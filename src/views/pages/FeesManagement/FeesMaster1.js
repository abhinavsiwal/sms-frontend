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

import { Table } from "ant-table-extensions";

import SimpleHeader from "components/Headers/SimpleHeader";
import LoadingScreen from "react-loading-screen";

import { isAuthenticated } from "api/auth";

import "./fees_style.css";
import { toast, ToastContainer } from "react-toastify";
import { allSessions } from "api/session";
import { allClass } from "api/class";

const FeesMaster1 = () => {
    const [sessions, setSessions] = useState("");
    const [classs, setClasss] = useState("");
    const [sessionID, setSessionID] = useState("");
    const [classID, setClassID] = useState("");
    const [fees_type, setFees_type] = useState("");
    const [showLoad, setShowLoad] = useState(false);
    const [type, setType] = useState(0);
    const [feesNumber, setFeesNumber] = useState([]);
    const [feesData, setFeesData] = useState([]);
    const [viewFeesData, setViewFeesData] = useState("");
    const [viewOneTime, setViewOneTime] = useState("");
    const [viewReccuring, setViewReccuring] = useState("");
    const [checked, setChecked] = useState(false);

    const { user, token } = isAuthenticated();

    useEffect(() => {
      
    getSession();
    getAllClasses();
    
    }, [])
    

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
          const classs = await allClass(user._id, user.school, token);
          if (classs.err) {
            return toast.error(classs.err);
          } else {
            setClasss(classs);
            return;
          }
        } catch (err) {
          toast.error("Something Went Wrong!");
        }
      };
      const handleSession = (e) => {
        e.preventDefault();
        if (e.target.value === "") {
        } else {
          setType(0);
          setSessionID(JSON.parse(e.target.value));
        }
      };
    
      const handleClass = (e) => {
        e.preventDefault();
        if (e.target.value === "") {
        } else {
          setType(0);
          setClassID(JSON.parse(e.target.value));
        }
      };
    
      const handleType = (e) => {
        e.preventDefault();
        if (e.target.value === "") {
        } else {
          setType(0);
          setFees_type(e.target.value);
        }
      };
    

  return <>
    <SimpleHeader name="Fees" parentName="Fees Management" />
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
        loading={showLoad}
        bgColor="#f1f1f1"
        spinnerColor="#9ee5f8"
        textColor="#676767"
        text="Please Wait..."
      ></LoadingScreen>
      <Container fluid className="mt--6" > 
        <Card>
        <CardHeader>
            <h2>Fees</h2>
          </CardHeader>
        </Card>
       </Container>
  </>
};

export default FeesMaster1;
