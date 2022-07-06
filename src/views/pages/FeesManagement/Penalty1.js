
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
import { SearchOutlined } from "@ant-design/icons";
import { Popconfirm } from "antd";
import SimpleHeader from "components/Headers/SimpleHeader";
import LoadingScreen from "react-loading-screen";
import { Table } from "ant-table-extensions";
import { isAuthenticated } from "api/auth";

import "./fees_style.css";

import { toast, ToastContainer } from "react-toastify";


const PenaltyMaster1 = () => {
  return (
    <h1>penalty1</h1>
  )
}

export default PenaltyMaster1