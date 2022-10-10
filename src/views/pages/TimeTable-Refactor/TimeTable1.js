import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  Form,
  Label,
  Input,
  Button,
  CardHeader,
  Table,
  Modal,
  ModalBody,
} from "reactstrap";
import SimpleHeader from "components/Headers/SimpleHeader.js";
import DataTable from "react-data-table-component";
import TimePicker from "rc-time-picker";
import "rc-time-picker/assets/index.css";
import moment from "moment";
import { allClass } from "api/class";
import { isAuthenticated } from "api/auth";
import { ToastContainer, toast } from "react-toastify";
import { allSessions } from "api/session";
import { allStaffs } from "api/staff";
import { allSubjects } from "api/subjects";
import { Popconfirm } from "antd";
import LoadingScreen from "react-loading-screen";

const TimeTable1 = () => {
  let timeFormat = "HH:mm";
  let timeFormat2 = "HH:mm A";
  const [classes, setClasses] = useState([]);
  const [sessions, setSessions] = React.useState([]);
  const [classId, setClassId] = useState("");
  const [classSectionId, setclassSectionId] = useState("");
  const [loading, setLoading] = useState(false);
  const [schedules, setSchedules] = useState(null);
  const [newSchedule, setNewSchedule] = useState({
    fromTime: moment().format(timeFormat),
    toTime: moment().format(timeFormat),
    errMessage: "",
  });

  const [showBreak, setShowBreak] = useState(false);
  const [teachers, setTeachers] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [admin, setAdmin] = useState(false);
  const [show, setShow] = useState(false);

  const WorkingDaysList = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let usedSlots = [];
  
  return <div>TimeTable1</div>;
};

export default TimeTable1;
