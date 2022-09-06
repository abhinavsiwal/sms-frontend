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
const TimeTable = () => {
  let timeFormat = "HH:mm";
  let timeFormat2 = "HH:mm A";
  const [classes, setClasses] = useState([]);
  const [sessions, setSessions] = React.useState([]);
  const [classId, setClassId] = useState("");

  const [classSectionId, setclassSectionId] = useState("");
  const [loading, setLoading] = useState(false);
  const [schedules, setSchedules] = useState(null);
  const [recess, setRecess] = useState({});
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
  const [timeTableData, setTimeTableData] = React.useState({
    class: null,
    section: null,
    session: null,
  });
  const [selectedClass, setSelectedClass] = useState({});
  useEffect(() => {

      const tableData = {
    schedules: [
      {
        id: 817,
        classId: 11,
        classSectionId: 11,
        subject: "Assembly",
        staffId: 0,
        staffName: "Monday",
        day: "Monday",
        periodId: 818,
        fromTime: "09:00",
        toTime: "09:15",
        action: null,
      },
      {
        id: 818,
        classId: 11,
        classSectionId: 11,
        subject: "Assembly",
        staffId: 1,
        staffName: null,
        day: "Tuesday",
        periodId: 819,
        fromTime: "09:00",
        toTime: "09:15",
        action: null,
      },
      {
        id: 819,
        classId: 11,
        classSectionId: 11,
        subject: "Assembly",
        staffId: 0,
        staffName: "Wednesday",
        day: "Wednesday",
        periodId: 820,
        fromTime: "09:00",
        toTime: "09:15",
        action: null,
      },
      {
        id: 820,
        classId: 11,
        classSectionId: 11,
        subject: "Assembly",
        staffId: 0,
        staffName: "Thursday",
        day: "Thursday",
        periodId: 821,
        fromTime: "09:00",
        toTime: "09:15",
        action: null,
      },
      {
        id: 821,
        classId: 11,
        classSectionId: 11,
        subject: "Assembly",
        staffId: 0,
        staffName: "Friday",
        day: "Friday",
        periodId: 822,
        fromTime: "09:00",
        toTime: "09:15",
        action: null,
      },
      {
        id: 822,
        classId: 11,
        classSectionId: 11,
        subject: "",
        staffId: 0,
        staffName: "Saturday",
        day: "Saturday",
        periodId: 823,
        fromTime: "09:00",
        toTime: "09:15",
        action: null,
      },
      {
        id: 871,
        classId: 11,
        classSectionId: 11,
        subject: "Biology",
        staffId: 2,
        staffName: null,
        day: "Monday",
        periodId: 872,
        fromTime: "09:20",
        toTime: "10:05",
        action: null,
      },
      {
        id: 872,
        classId: 11,
        classSectionId: 11,
        subject: "English I",
        staffId: 1,
        staffName: null,
        day: "Tuesday",
        periodId: 873,
        fromTime: "09:20",
        toTime: "10:05",
        action: null,
      },
      {
        id: 873,
        classId: 11,
        classSectionId: 11,
        subject: "Biology",
        staffId: 2,
        staffName: null,
        day: "Wednesday",
        periodId: 874,
        fromTime: "09:20",
        toTime: "10:05",
        action: null,
      },
      {
        id: 874,
        classId: 11,
        classSectionId: 11,
        subject: "Biology",
        staffId: 2,
        staffName: null,
        day: "Thursday",
        periodId: 875,
        fromTime: "09:20",
        toTime: "10:05",
        action: null,
      },
      {
        id: 875,
        classId: 11,
        classSectionId: 11,
        subject: "Geography",
        staffId: 17,
        staffName: null,
        day: "Friday",
        periodId: 876,
        fromTime: "09:20",
        toTime: "10:05",
        action: null,
      },
      {
        id: 876,
        classId: 11,
        classSectionId: 11,
        subject: "",
        staffId: 0,
        staffName: "Saturday",
        day: "Saturday",
        periodId: 877,
        fromTime: "09:20",
        toTime: "10:05",
        action: null,
      },
      {
        id: 877,
        classId: 11,
        classSectionId: 11,
        subject: "Maths-I",
        staffId: 3,
        staffName: null,
        day: "Monday",
        periodId: 878,
        fromTime: "10:05",
        toTime: "10:50",
        action: null,
      },
      {
        id: 878,
        classId: 11,
        classSectionId: 11,
        subject: "English II",
        staffId: 20,
        staffName: null,
        day: "Tuesday",
        periodId: 879,
        fromTime: "10:05",
        toTime: "10:50",
        action: null,
      },
      {
        id: 879,
        classId: 11,
        classSectionId: 11,
        subject: "Physics",
        staffId: 3,
        staffName: null,
        day: "Wednesday",
        periodId: 880,
        fromTime: "10:05",
        toTime: "10:50",
        action: null,
      },
      {
        id: 880,
        classId: 11,
        classSectionId: 11,
        subject: "Maths-I",
        staffId: 3,
        staffName: null,
        day: "Thursday",
        periodId: 881,
        fromTime: "10:05",
        toTime: "10:50",
        action: null,
      },
      {
        id: 881,
        classId: 11,
        classSectionId: 11,
        subject: "Physics",
        staffId: 3,
        staffName: null,
        day: "Friday",
        periodId: 882,
        fromTime: "10:05",
        toTime: "10:50",
        action: null,
      },
      {
        id: 882,
        classId: 11,
        classSectionId: 11,
        subject: "",
        staffId: 0,
        staffName: "Saturday",
        day: "Saturday",
        periodId: 883,
        fromTime: "10:05",
        toTime: "10:50",
        action: null,
      },
      {
        id: 883,
        classId: 11,
        classSectionId: 11,
        subject: "English II",
        staffId: 20,
        staffName: null,
        day: "Monday",
        periodId: 884,
        fromTime: "11:00",
        toTime: "11:45",
        action: null,
      },
      {
        id: 884,
        classId: 11,
        classSectionId: 11,
        subject: "Chemistry",
        staffId: 18,
        staffName: null,
        day: "Tuesday",
        periodId: 885,
        fromTime: "11:00",
        toTime: "11:45",
        action: null,
      },
      {
        id: 885,
        classId: 11,
        classSectionId: 11,
        subject: "English I",
        staffId: 1,
        staffName: null,
        day: "Wednesday",
        periodId: 886,
        fromTime: "11:00",
        toTime: "11:45",
        action: null,
      },
      {
        id: 886,
        classId: 11,
        classSectionId: 11,
        subject: "Home Science",
        staffId: 1,
        staffName: null,
        day: "Thursday",
        periodId: 887,
        fromTime: "11:00",
        toTime: "11:45",
        action: null,
      },
      {
        id: 887,
        classId: 11,
        classSectionId: 11,
        subject: "Chemistry",
        staffId: 11,
        staffName: null,
        day: "Friday",
        periodId: 888,
        fromTime: "11:00",
        toTime: "11:45",
        action: null,
      },
      {
        id: 888,
        classId: 11,
        classSectionId: 11,
        subject: "",
        staffId: 0,
        staffName: "Saturday",
        day: "Saturday",
        periodId: 889,
        fromTime: "11:00",
        toTime: "11:45",
        action: null,
      },
      {
        id: 889,
        classId: 11,
        classSectionId: 11,
        subject: "Home Science",
        staffId: 1,
        staffName: null,
        day: "Monday",
        periodId: 890,
        fromTime: "11:45",
        toTime: "12:30",
        action: null,
      },
      {
        id: 890,
        classId: 11,
        classSectionId: 11,
        subject: "Maths-II",
        staffId: 4,
        staffName: null,
        day: "Tuesday",
        periodId: 891,
        fromTime: "11:45",
        toTime: "12:30",
        action: null,
      },
      {
        id: 891,
        classId: 11,
        classSectionId: 11,
        subject: "Chemistry",
        staffId: 18,
        staffName: null,
        day: "Wednesday",
        periodId: 892,
        fromTime: "11:45",
        toTime: "12:30",
        action: null,
      },
      {
        id: 892,
        classId: 11,
        classSectionId: 11,
        subject: "History",
        staffId: 5,
        staffName: null,
        day: "Thursday",
        periodId: 893,
        fromTime: "11:45",
        toTime: "12:30",
        action: null,
      },
      {
        id: 893,
        classId: 11,
        classSectionId: 11,
        subject: "Maths-II",
        staffId: 4,
        staffName: null,
        day: "Friday",
        periodId: 894,
        fromTime: "11:45",
        toTime: "12:30",
        action: null,
      },
      {
        id: 894,
        classId: 11,
        classSectionId: 11,
        subject: "",
        staffId: 0,
        staffName: "Saturday",
        day: "Saturday",
        periodId: 895,
        fromTime: "11:45",
        toTime: "12:30",
        action: null,
      },
      {
        id: 895,
        classId: 11,
        classSectionId: 11,
        subject: "Maths-II",
        staffId: 4,
        staffName: null,
        day: "Monday",
        periodId: 896,
        fromTime: "12:45",
        toTime: "13:30",
        action: null,
      },
      {
        id: 896,
        classId: 11,
        classSectionId: 11,
        subject: "Physics",
        staffId: 3,
        staffName: null,
        day: "Tuesday",
        periodId: 897,
        fromTime: "12:45",
        toTime: "13:30",
        action: null,
      },
      {
        id: 897,
        classId: 11,
        classSectionId: 11,
        subject: "Geography",
        staffId: 17,
        staffName: null,
        day: "Wednesday",
        periodId: 898,
        fromTime: "12:45",
        toTime: "13:30",
        action: null,
      },
      {
        id: 898,
        classId: 11,
        classSectionId: 11,
        subject: "English II",
        staffId: 20,
        staffName: null,
        day: "Thursday",
        periodId: 899,
        fromTime: "12:45",
        toTime: "13:30",
        action: null,
      },
      {
        id: 899,
        classId: 11,
        classSectionId: 11,
        subject: "Maths-I",
        staffId: 3,
        staffName: null,
        day: "Friday",
        periodId: 900,
        fromTime: "12:45",
        toTime: "13:30",
        action: null,
      },
      {
        id: 900,
        classId: 11,
        classSectionId: 11,
        subject: "",
        staffId: 0,
        staffName: "Saturday",
        day: "Saturday",
        periodId: 901,
        fromTime: "12:45",
        toTime: "13:30",
        action: null,
      },
      {
        id: 901,
        classId: 11,
        classSectionId: 11,
        subject: "Chemistry",
        staffId: 18,
        staffName: null,
        day: "Monday",
        periodId: 902,
        fromTime: "13:30",
        toTime: "14:15",
        action: null,
      },
      {
        id: 902,
        classId: 11,
        classSectionId: 11,
        subject: "Geography",
        staffId: 17,
        staffName: null,
        day: "Tuesday",
        periodId: 903,
        fromTime: "13:30",
        toTime: "14:15",
        action: null,
      },
      {
        id: 903,
        classId: 11,
        classSectionId: 11,
        subject: "MIL(Thadou-Kuki)",
        staffId: 5,
        staffName: null,
        day: "Wednesday",
        periodId: 904,
        fromTime: "13:30",
        toTime: "14:15",
        action: null,
      },
      {
        id: 904,
        classId: 11,
        classSectionId: 11,
        subject: "Chemistry",
        staffId: 18,
        staffName: null,
        day: "Thursday",
        periodId: 905,
        fromTime: "13:30",
        toTime: "14:15",
        action: null,
      },
      {
        id: 905,
        classId: 11,
        classSectionId: 11,
        subject: "Assembly",
        staffId: 1,
        staffName: null,
        day: "Friday",
        periodId: 906,
        fromTime: "13:30",
        toTime: "14:15",
        action: null,
      },
      {
        id: 906,
        classId: 11,
        classSectionId: 11,
        subject: "",
        staffId: 0,
        staffName: "Saturday",
        day: "Saturday",
        periodId: 907,
        fromTime: "13:30",
        toTime: "14:15",
        action: null,
      },
    ],
    others: [
      {
        id: 7,
        fromTime: "12:30",
        toTime: "12:45",
        label: "Recess",
      },
    ],
    teachers: [
      {
        id: 1,
        name: "Kimboi Singson",
        subjects: ["English I", "Drawing"],
        occupied: [
          {
            fromTime: "13:30",
            toTime: "14:15",
            day: "Monday",
          },
          {
            fromTime: "13:30",
            toTime: "14:15",
            day: "Tuesday",
          },
          {
            fromTime: "11:45",
            toTime: "12:30",
            day: "Tuesday",
          },
          {
            fromTime: "11:00",
            toTime: "11:45",
            day: "Monday",
          },
          {
            fromTime: "11:45",
            toTime: "12:30",
            day: "Friday",
          },
          {
            fromTime: "09:20",
            toTime: "10:05",
            day: "Friday",
          },
          {
            fromTime: "11:45",
            toTime: "12:30",
            day: "Wednesday",
          },
          {
            fromTime: "12:45",
            toTime: "13:30",
            day: "Thursday",
          },
          {
            fromTime: "11:00",
            toTime: "11:45",
            day: "Tuesday",
          },
          {
            fromTime: "10:05",
            toTime: "10:50",
            day: "Wednesday",
          },
          {
            fromTime: "12:45",
            toTime: "13:30",
            day: "Monday",
          },
        ],
      },
      {
        id: 2,
        name: "Seiminthang Haokip",
        subjects: ["Biology", "Computer Science"],
        occupied: [
          {
            fromTime: "10:05",
            toTime: "10:50",
            day: "Monday",
          },
          {
            fromTime: "10:05",
            toTime: "10:50",
            day: "Wednesday",
          },
          {
            fromTime: "11:00",
            toTime: "11:45",
            day: "Thursday",
          },
          {
            fromTime: "11:00",
            toTime: "11:45",
            day: "Friday",
          },
          {
            fromTime: "11:45",
            toTime: "12:30",
            day: "Tuesday",
          },
          {
            fromTime: "13:30",
            toTime: "14:15",
            day: "Monday",
          },
          {
            fromTime: "10:05",
            toTime: "10:50",
            day: "Tuesday",
          },
          {
            fromTime: "12:45",
            toTime: "13:30",
            day: "Monday",
          },
          {
            fromTime: "13:30",
            toTime: "14:15",
            day: "Thursday",
          },
          {
            fromTime: "10:05",
            toTime: "10:50",
            day: "Thursday",
          },
          {
            fromTime: "11:00",
            toTime: "11:45",
            day: "Monday",
          },
          {
            fromTime: "13:30",
            toTime: "14:15",
            day: "Wednesday",
          },
          {
            fromTime: "10:05",
            toTime: "10:50",
            day: "Friday",
          },
          {
            fromTime: "11:45",
            toTime: "12:30",
            day: "Monday",
          },
          {
            fromTime: "12:45",
            toTime: "13:30",
            day: "Tuesday",
          },
          {
            fromTime: "12:45",
            toTime: "13:30",
            day: "Wednesday",
          },
          {
            fromTime: "11:45",
            toTime: "12:30",
            day: "Thursday",
          },
          {
            fromTime: "11:45",
            toTime: "12:30",
            day: "Friday",
          },
          {
            fromTime: "13:30",
            toTime: "14:15",
            day: "Tuesday",
          },
          {
            fromTime: "13:30",
            toTime: "14:15",
            day: "Friday",
          },
        ],
      },
      {
        id: 3,
        name: "Khupkhopao Haokip",
        subjects: ["Maths-I", "Physics"],
        occupied: [
          {
            fromTime: "09:00",
            toTime: "09:15",
            day: "Monday",
          },
          {
            fromTime: "09:00",
            toTime: "09:15",
            day: "Wednesday",
          },
          {
            fromTime: "09:20",
            toTime: "10:05",
            day: "Monday",
          },
          {
            fromTime: "09:20",
            toTime: "10:05",
            day: "Tuesday",
          },
          {
            fromTime: "09:20",
            toTime: "10:05",
            day: "Wednesday",
          },
          {
            fromTime: "09:20",
            toTime: "10:05",
            day: "Thursday",
          },
          {
            fromTime: "12:45",
            toTime: "13:30",
            day: "Wednesday",
          },
          {
            fromTime: "12:45",
            toTime: "13:30",
            day: "Thursday",
          },
          {
            fromTime: "13:30",
            toTime: "14:15",
            day: "Friday",
          },
          {
            fromTime: "10:05",
            toTime: "10:50",
            day: "Tuesday",
          },
          {
            fromTime: "11:45",
            toTime: "12:30",
            day: "Wednesday",
          },
          {
            fromTime: "11:45",
            toTime: "12:30",
            day: "Thursday",
          },
          {
            fromTime: "13:30",
            toTime: "14:15",
            day: "Wednesday",
          },
          {
            fromTime: "11:00",
            toTime: "11:45",
            day: "Tuesday",
          },
          {
            fromTime: "11:00",
            toTime: "11:45",
            day: "Thursday",
          },
          {
            fromTime: "11:45",
            toTime: "12:30",
            day: "Friday",
          },
          {
            fromTime: "13:30",
            toTime: "14:15",
            day: "Tuesday",
          },
          {
            fromTime: "11:00",
            toTime: "11:45",
            day: "Monday",
          },
          {
            fromTime: "11:00",
            toTime: "11:45",
            day: "Wednesday",
          },
          {
            fromTime: "11:00",
            toTime: "11:45",
            day: "Friday",
          },
        ],
      },
      {
        id: 4,
        name: "Ravi Singh",
        subjects: ["Maths-II", "Science"],
        occupied: [
          {
            fromTime: "09:20",
            toTime: "10:05",
            day: "Friday",
          },
          {
            fromTime: "11:00",
            toTime: "11:45",
            day: "Tuesday",
          },
          {
            fromTime: "11:45",
            toTime: "12:30",
            day: "Monday",
          },
          {
            fromTime: "12:45",
            toTime: "13:30",
            day: "Thursday",
          },
          {
            fromTime: "10:05",
            toTime: "10:50",
            day: "Wednesday",
          },
          {
            fromTime: "11:45",
            toTime: "12:30",
            day: "Thursday",
          },
          {
            fromTime: "12:45",
            toTime: "13:30",
            day: "Tuesday",
          },
          {
            fromTime: "13:30",
            toTime: "14:15",
            day: "Monday",
          },
          {
            fromTime: "09:20",
            toTime: "10:05",
            day: "Tuesday",
          },
          {
            fromTime: "10:05",
            toTime: "10:50",
            day: "Monday",
          },
          {
            fromTime: "10:05",
            toTime: "10:50",
            day: "Thursday",
          },
          {
            fromTime: "13:30",
            toTime: "14:15",
            day: "Tuesday",
          },
          {
            fromTime: "13:30",
            toTime: "14:15",
            day: "Wednesday",
          },
          {
            fromTime: "13:30",
            toTime: "14:15",
            day: "Thursday",
          },
        ],
      },
      {
        id: 5,
        name: "Haothang Lupheng",
        subjects: ["History", "MIL(Thadou-Kuki)"],
        occupied: [
          {
            fromTime: "12:45",
            toTime: "13:30",
            day: "Friday",
          },
          {
            fromTime: "10:05",
            toTime: "10:50",
            day: "Tuesday",
          },
          {
            fromTime: "11:45",
            toTime: "12:30",
            day: "Friday",
          },
          {
            fromTime: "09:20",
            toTime: "10:05",
            day: "Monday",
          },
          {
            fromTime: "09:20",
            toTime: "10:05",
            day: "Wednesday",
          },
          {
            fromTime: "09:20",
            toTime: "10:05",
            day: "Thursday",
          },
          {
            fromTime: "10:05",
            toTime: "10:50",
            day: "Friday",
          },
          {
            fromTime: "11:00",
            toTime: "11:45",
            day: "Monday",
          },
          {
            fromTime: "11:00",
            toTime: "11:45",
            day: "Thursday",
          },
          {
            fromTime: "12:45",
            toTime: "13:30",
            day: "Tuesday",
          },
          {
            fromTime: "12:45",
            toTime: "13:30",
            day: "Wednesday",
          },
        ],
      },
      {
        id: 8,
        name: "Kimneilam Haokip",
        subjects: ["Hindi", "General Knowledge"],
        occupied: [
          {
            fromTime: "12:45",
            toTime: "13:30",
            day: "Wednesday",
          },
          {
            fromTime: "13:30",
            toTime: "14:15",
            day: "Thursday",
          },
          {
            fromTime: "13:30",
            toTime: "14:15",
            day: "Friday",
          },
          {
            fromTime: "11:45",
            toTime: "12:30",
            day: "Monday",
          },
          {
            fromTime: "12:45",
            toTime: "13:30",
            day: "Friday",
          },
          {
            fromTime: "13:30",
            toTime: "14:15",
            day: "Wednesday",
          },
          {
            fromTime: "09:20",
            toTime: "10:05",
            day: "Monday",
          },
          {
            fromTime: "09:20",
            toTime: "10:05",
            day: "Tuesday",
          },
          {
            fromTime: "09:20",
            toTime: "10:05",
            day: "Wednesday",
          },
          {
            fromTime: "09:20",
            toTime: "10:05",
            day: "Thursday",
          },
          {
            fromTime: "09:20",
            toTime: "10:05",
            day: "Friday",
          },
          {
            fromTime: "13:30",
            toTime: "14:15",
            day: "Monday",
          },
          {
            fromTime: "11:45",
            toTime: "12:30",
            day: "Wednesday",
          },
          {
            fromTime: "10:05",
            toTime: "10:50",
            day: "Friday",
          },
          {
            fromTime: "11:00",
            toTime: "11:45",
            day: "Monday",
          },
          {
            fromTime: "11:00",
            toTime: "11:45",
            day: "Tuesday",
          },
          {
            fromTime: "12:45",
            toTime: "13:30",
            day: "Thursday",
          },
          {
            fromTime: "11:00",
            toTime: "11:45",
            day: "Wednesday",
          },
          {
            fromTime: "11:00",
            toTime: "11:45",
            day: "Thursday",
          },
          {
            fromTime: "11:00",
            toTime: "11:45",
            day: "Friday",
          },
          {
            fromTime: "11:45",
            toTime: "12:30",
            day: "Tuesday",
          },
          {
            fromTime: "12:45",
            toTime: "13:30",
            day: "Monday",
          },
          {
            fromTime: "10:05",
            toTime: "10:50",
            day: "Monday",
          },
          {
            fromTime: "10:05",
            toTime: "10:50",
            day: "Thursday",
          },
          {
            fromTime: "13:30",
            toTime: "14:15",
            day: "Tuesday",
          },
        ],
      },
      {
        id: 11,
        name: "S. Jamkhohao Haokip",
        subjects: [""],
        occupied: [],
      },
      {
        id: 14,
        name: "Kimlalmoi Gangte",
        subjects: ["Literacy Skills", "EVS"],
        occupied: [],
      },
      {
        id: 15,
        name: "Elina Tingneiboi Vaiphei",
        subjects: ["Numeracy Skills", "Story Time", "Rhymes", "Arts & Craft"],
        occupied: [],
      },
      {
        id: 16,
        name: "Phaneineng Haokip",
        subjects: [
          "Literacy Skills",
          "Numeracy Skills",
          "Social Skills",
          "Rhymes",
          "Coloring",
        ],
        occupied: [],
      },
      {
        id: 17,
        name: "Kuriakose Lamjalal Haokip",
        subjects: ["Maths", "Geography", "Civics"],
        occupied: [
          {
            fromTime: "13:30",
            toTime: "14:15",
            day: "Wednesday",
          },
          {
            fromTime: "13:30",
            toTime: "14:15",
            day: "Thursday",
          },
          {
            fromTime: "11:00",
            toTime: "11:45",
            day: "Monday",
          },
          {
            fromTime: "11:00",
            toTime: "11:45",
            day: "Friday",
          },
          {
            fromTime: "09:20",
            toTime: "10:05",
            day: "Tuesday",
          },
          {
            fromTime: "10:05",
            toTime: "10:50",
            day: "Monday",
          },
          {
            fromTime: "10:05",
            toTime: "10:50",
            day: "Thursday",
          },
          {
            fromTime: "11:00",
            toTime: "11:45",
            day: "Wednesday",
          },
          {
            fromTime: "09:20",
            toTime: "10:05",
            day: "Monday",
          },
          {
            fromTime: "09:20",
            toTime: "10:05",
            day: "Wednesday",
          },
          {
            fromTime: "13:30",
            toTime: "14:15",
            day: "Friday",
          },
          {
            fromTime: "11:45",
            toTime: "12:30",
            day: "Monday",
          },
          {
            fromTime: "11:45",
            toTime: "12:30",
            day: "Thursday",
          },
          {
            fromTime: "12:45",
            toTime: "13:30",
            day: "Tuesday",
          },
          {
            fromTime: "11:00",
            toTime: "11:45",
            day: "Tuesday",
          },
          {
            fromTime: "11:45",
            toTime: "12:30",
            day: "Friday",
          },
          {
            fromTime: "11:45",
            toTime: "12:30",
            day: "Wednesday",
          },
          {
            fromTime: "12:45",
            toTime: "13:30",
            day: "Monday",
          },
          {
            fromTime: "12:45",
            toTime: "13:30",
            day: "Friday",
          },
          {
            fromTime: "10:05",
            toTime: "10:50",
            day: "Tuesday",
          },
          {
            fromTime: "10:05",
            toTime: "10:50",
            day: "Wednesday",
          },
        ],
      },
      {
        id: 18,
        name: "M. Buonga Gangte",
        subjects: ["Chemistry", "Biology", "Home Science"],
        occupied: [
          {
            fromTime: "10:05",
            toTime: "10:50",
            day: "Thursday",
          },
          {
            fromTime: "11:00",
            toTime: "11:45",
            day: "Wednesday",
          },
          {
            fromTime: "11:45",
            toTime: "12:30",
            day: "Monday",
          },
          {
            fromTime: "10:05",
            toTime: "10:50",
            day: "Wednesday",
          },
          {
            fromTime: "10:05",
            toTime: "10:50",
            day: "Friday",
          },
          {
            fromTime: "12:45",
            toTime: "13:30",
            day: "Monday",
          },
          {
            fromTime: "12:45",
            toTime: "13:30",
            day: "Tuesday",
          },
          {
            fromTime: "12:45",
            toTime: "13:30",
            day: "Friday",
          },
          {
            fromTime: "09:20",
            toTime: "10:05",
            day: "Thursday",
          },
          {
            fromTime: "10:05",
            toTime: "10:50",
            day: "Monday",
          },
          {
            fromTime: "11:00",
            toTime: "11:45",
            day: "Friday",
          },
          {
            fromTime: "11:45",
            toTime: "12:30",
            day: "Tuesday",
          },
          {
            fromTime: "12:45",
            toTime: "13:30",
            day: "Wednesday",
          },
          {
            fromTime: "09:20",
            toTime: "10:05",
            day: "Wednesday",
          },
          {
            fromTime: "09:20",
            toTime: "10:05",
            day: "Friday",
          },
          {
            fromTime: "10:05",
            toTime: "10:50",
            day: "Tuesday",
          },
          {
            fromTime: "11:45",
            toTime: "12:30",
            day: "Thursday",
          },
          {
            fromTime: "12:45",
            toTime: "13:30",
            day: "Thursday",
          },
        ],
      },
      {
        id: 19,
        name: "Sarah Kimneo Simte",
        subjects: [""],
        occupied: [],
      },
      {
        id: 20,
        name: "H. S Benjamin Haokip",
        subjects: ["Civics", "English II"],
        occupied: [
          {
            fromTime: "12:45",
            toTime: "13:30",
            day: "Monday",
          },
          {
            fromTime: "12:45",
            toTime: "13:30",
            day: "Tuesday",
          },
          {
            fromTime: "10:05",
            toTime: "10:50",
            day: "Friday",
          },
          {
            fromTime: "11:45",
            toTime: "12:30",
            day: "Wednesday",
          },
          {
            fromTime: "11:45",
            toTime: "12:30",
            day: "Thursday",
          },
          {
            fromTime: "09:20",
            toTime: "10:05",
            day: "Friday",
          },
          {
            fromTime: "11:00",
            toTime: "11:45",
            day: "Tuesday",
          },
          {
            fromTime: "11:00",
            toTime: "11:45",
            day: "Thursday",
          },
          {
            fromTime: "13:30",
            toTime: "14:15",
            day: "Tuesday",
          },
          {
            fromTime: "09:20",
            toTime: "10:05",
            day: "Tuesday",
          },
          {
            fromTime: "10:05",
            toTime: "10:50",
            day: "Thursday",
          },
          {
            fromTime: "11:00",
            toTime: "11:45",
            day: "Wednesday",
          },
          {
            fromTime: "09:20",
            toTime: "10:05",
            day: "Monday",
          },
          {
            fromTime: "09:20",
            toTime: "10:05",
            day: "Thursday",
          },
          {
            fromTime: "11:45",
            toTime: "12:30",
            day: "Tuesday",
          },
          {
            fromTime: "12:45",
            toTime: "13:30",
            day: "Friday",
          },
          {
            fromTime: "13:30",
            toTime: "14:15",
            day: "Monday",
          },
        ],
      },
      {
        id: 21,
        name: "Lydia Haokip",
        subjects: ["", "Drawing", "English II", "Science"],
        occupied: [
          {
            fromTime: "10:05",
            toTime: "10:50",
            day: "Monday",
          },
          {
            fromTime: "10:05",
            toTime: "10:50",
            day: "Tuesday",
          },
          {
            fromTime: "10:05",
            toTime: "10:50",
            day: "Friday",
          },
          {
            fromTime: "11:00",
            toTime: "11:45",
            day: "Wednesday",
          },
          {
            fromTime: "11:00",
            toTime: "11:45",
            day: "Thursday",
          },
          {
            fromTime: "11:00",
            toTime: "11:45",
            day: "Friday",
          },
          {
            fromTime: "11:45",
            toTime: "12:30",
            day: "Friday",
          },
          {
            fromTime: "12:45",
            toTime: "13:30",
            day: "Wednesday",
          },
          {
            fromTime: "12:45",
            toTime: "13:30",
            day: "Thursday",
          },
          {
            fromTime: "13:30",
            toTime: "14:15",
            day: "Tuesday",
          },
          {
            fromTime: "13:30",
            toTime: "14:15",
            day: "Thursday",
          },
          {
            fromTime: "13:30",
            toTime: "14:15",
            day: "Friday",
          },
          {
            fromTime: "09:20",
            toTime: "10:05",
            day: "Monday",
          },
          {
            fromTime: "09:20",
            toTime: "10:05",
            day: "Tuesday",
          },
          {
            fromTime: "09:20",
            toTime: "10:05",
            day: "Wednesday",
          },
          {
            fromTime: "09:20",
            toTime: "10:05",
            day: "Thursday",
          },
          {
            fromTime: "09:20",
            toTime: "10:05",
            day: "Friday",
          },
          {
            fromTime: "10:05",
            toTime: "10:50",
            day: "Wednesday",
          },
          {
            fromTime: "11:45",
            toTime: "12:30",
            day: "Tuesday",
          },
          {
            fromTime: "11:45",
            toTime: "12:30",
            day: "Thursday",
          },
          {
            fromTime: "12:45",
            toTime: "13:30",
            day: "Friday",
          },
          {
            fromTime: "11:00",
            toTime: "11:45",
            day: "Monday",
          },
          {
            fromTime: "11:45",
            toTime: "12:30",
            day: "Monday",
          },
          {
            fromTime: "11:45",
            toTime: "12:30",
            day: "Wednesday",
          },
          {
            fromTime: "12:45",
            toTime: "13:30",
            day: "Tuesday",
          },
          {
            fromTime: "13:30",
            toTime: "14:15",
            day: "Monday",
          },
          {
            fromTime: "13:30",
            toTime: "14:15",
            day: "Wednesday",
          },
        ],
      },
      {
        id: 22,
        name: "Lhingjanei Haokip",
        subjects: ["Cursive", "English I", "Social Studies"],
        occupied: [
          {
            fromTime: "10:05",
            toTime: "10:50",
            day: "Wednesday",
          },
          {
            fromTime: "11:45",
            toTime: "12:30",
            day: "Tuesday",
          },
          {
            fromTime: "11:45",
            toTime: "12:30",
            day: "Wednesday",
          },
          {
            fromTime: "12:45",
            toTime: "13:30",
            day: "Monday",
          },
          {
            fromTime: "12:45",
            toTime: "13:30",
            day: "Friday",
          },
          {
            fromTime: "10:05",
            toTime: "10:50",
            day: "Monday",
          },
          {
            fromTime: "10:05",
            toTime: "10:50",
            day: "Tuesday",
          },
          {
            fromTime: "10:05",
            toTime: "10:50",
            day: "Thursday",
          },
          {
            fromTime: "11:00",
            toTime: "11:45",
            day: "Wednesday",
          },
          {
            fromTime: "11:00",
            toTime: "11:45",
            day: "Thursday",
          },
          {
            fromTime: "11:00",
            toTime: "11:45",
            day: "Friday",
          },
          {
            fromTime: "11:45",
            toTime: "12:30",
            day: "Monday",
          },
          {
            fromTime: "11:45",
            toTime: "12:30",
            day: "Friday",
          },
          {
            fromTime: "11:00",
            toTime: "11:45",
            day: "Tuesday",
          },
          {
            fromTime: "12:45",
            toTime: "13:30",
            day: "Wednesday",
          },
          {
            fromTime: "12:45",
            toTime: "13:30",
            day: "Thursday",
          },
          {
            fromTime: "09:20",
            toTime: "10:05",
            day: "Monday",
          },
          {
            fromTime: "09:20",
            toTime: "10:05",
            day: "Tuesday",
          },
          {
            fromTime: "09:20",
            toTime: "10:05",
            day: "Wednesday",
          },
          {
            fromTime: "09:20",
            toTime: "10:05",
            day: "Thursday",
          },
          {
            fromTime: "09:20",
            toTime: "10:05",
            day: "Friday",
          },
          {
            fromTime: "10:05",
            toTime: "10:50",
            day: "Friday",
          },
          {
            fromTime: "13:30",
            toTime: "14:15",
            day: "Thursday",
          },
          {
            fromTime: "13:30",
            toTime: "14:15",
            day: "Friday",
          },
          {
            fromTime: "13:30",
            toTime: "14:15",
            day: "Monday",
          },
          {
            fromTime: "13:30",
            toTime: "14:15",
            day: "Wednesday",
          },
        ],
      },
    ],
  };
    getClass();
    getSession();
    getSubjects();
    getSchedulesForClass(tableData);
    // getMappedSchedules();
  }, []);

  //Getting Class data
  const getClass = async () => {
    const { user, token } = isAuthenticated();
    try {
      const classes = await allClass(user._id, user.school, token);
      if (classes.err) {
        return toast.error(classes.err);
      } else {
        setClasses(classes);
      }
    } catch (err) {
      toast.error("Something Went Wrong!");
    }
  };
  //Getting Session data
  const getSession = async () => {
    const { user, token } = isAuthenticated();
    try {
      const session = await allSessions(user._id, user.school, token);
      if (session.err) {
        return toast.error(session.err);
      } else {
        setSessions(session);
      }
    } catch (err) {
      toast.error("Something Went Wrong!");
    }
  };
  //Getting Subject data
  const getSubjects = async () => {
    const { user, token } = isAuthenticated();
    try {
      const subject = await allSubjects(user._id, user.school, token);
      console.log("subject", subject);
      if (subject.err) {
        return toast.error(subject.err);
      } else {
        setSubjects(subject);
      }
    } catch (err) {
      toast.error("Something Went Wrong!");
    }
  };
  const handleChange = (name) => (event) => {
    // formData.set(name, event.target.value);
    setTimeTableData({ ...timeTableData, [name]: event.target.value });
    console.log(name);
    if (name === "class") {
      console.log("@@@@@@@@=>", event.target.value);
      // setSelectedClassId(event.target.value);
      let selectedClass = classes.find(
        (item) => item._id.toString() === event.target.value.toString()
      );
      console.log(selectedClass);
      setSelectedClass(selectedClass);
    }
    if(name==="section"){
        setAdmin(true);
        setShow(true);
    }
  };



  function isOverlapping(slot1, slot2) {
    return !(
      (slot1[0] <= slot2[0] && slot1[1] <= slot2[0]) ||
      (slot1[0] >= slot2[1] && slot1[1] >= slot2[1])
    );
  }

 async function getSchedulesForClass(tableData) {
    // if (!classId) {
    //   return;
    // }
    setLoading(true);
//api call here
    console.log(tableData.others);
    const other = tableData.others.length
      ? tableData.others[0]
      : {
          fromTime: moment().format(timeFormat),
          toTime: moment().format(timeFormat),
          label: "Recess",
        };
        console.log(tableData);
    setSchedules(tableData.schedules);
    setRecess(other);
    setTeachers(tableData.teachers);
    setLoading(false);
  }

  const getTimetableColumnList = (plainText = false) => {
    const columns = [
      {
        name: "Schedule",
        cell: (schedule) =>
          getMoment(schedule.fromTime).format(timeFormat2) +
          " - " +
          getMoment(schedule.toTime).format(timeFormat2),
      },
      ...WorkingDaysList.map((day) => {
        return {
          name: day,
          width: "200px",
          center: true,
          cell: (allSchedules) => {
            const schedule = allSchedules[day];
            if (typeof schedule === "string") {
              return <div className="text-success">{schedule}</div>;
            }
            if (!admin || plainText) {
              return (
                <div className="d-flex flex-column">
                  <div className="font-weight-bold">{schedule.subject}</div>
                  <div>
                    {teachers &&
                    teachers.filter(
                      (teacher) =>
                        Number(teacher.id) === Number(schedule.staffId)
                    )[0]
                      ? " - " +
                        teachers.filter(
                          (teacher) =>
                            Number(teacher.id) === Number(schedule.staffId)
                        )[0].name
                      : null}
                  </div>
                </div>
              );
            }
            return (
              <div className="d-flex flex-column">
                <select
                  className="custom-select"
                  value={schedule.subject}
                  onChange={(event) =>
                    handleInputChange(
                      event,
                      `schedules.${schedule.index}.subject`
                    )
                  }
                >
                  <option value="" disabled={true} selected={true}>
                    Subject
                  </option>
                  {subjects.map((subject) => {
                    if (subjects.indexOf(subject) === -1) {
                      return null;
                    }
                    return <option value={subject._id}>{subject.name}</option>;
                  })}
                </select>
                <select
                  className="custom-select"
                  value={schedule.staffId}
                  onChange={(event) =>
                    handleInputChange(
                      event,
                      `schedules.${schedule.index}.staffId`
                    )
                  }
                >
                  <option value="" selected="true">
                    Staff
                  </option>
                  {teachers
                    .filter((teacher) =>
                      teacher.subjects.includes(schedule.subject)
                    )
                    .map((teacher) => {
                      let available = true;
                      for (let timeFrame of teacher.occupied) {
                        if (
                          timeFrame.day === day &&
                          isOverlapping(
                            [timeFrame.fromTime, timeFrame.toTime],
                            [schedule.fromTime, schedule.toTime]
                          )
                        ) {
                          available = false;
                          break;
                        }
                      }
                      return (
                        <option value={teacher.id} disabled={!available}>
                          {teacher.name}
                          {available ? "" : " (Not Available)"}
                        </option>
                      );
                    })}
                </select>
              </div>
            );
          },
        };
      }),
    ];
    if (admin) {
      columns.push({
        name: "Action",
        cell: (schedule) => {
          if (typeof schedule[WorkingDaysList[0]] === "string") {
            return <></>;
          }
          return (
            <button
              type="button"
              className="btn btn-icon btn-sm"
              title="Delete"
              data-type="confirm"
              onClick={() =>
                deleteSchedule(schedule.fromTime, schedule.toTime)
              }
            >
              <i className="fa fa-trash-o text-danger"></i>
            </button>
          );
        },
      });
    }
    return columns;
  };

  function deleteSchedule(fromTime, toTime) {
    const schedules = [];
    for (let schedule of schedules) {
      if (schedule.fromTime === fromTime && schedule.toTime === toTime) {
        if (schedule.id) {
          schedule.action = "delete";
          schedules.push(schedule);
        }
      } else {
        schedules.push(schedule);
      }
    }
    setSchedules(schedules);
  }
  const getMappedSchedules = () => {
    const schedulesByTime = {};
    console.log(schedules);
    for (let schedule of schedules.map((schedule, index) => {
      return { ...schedule, index: index };
    })) {
      if (schedule.action === "delete") {
        continue;
      }
      const timeString = schedule.fromTime + " - " + schedule.toTime;
      if (!schedulesByTime[timeString]) {
        schedulesByTime[timeString] = {
          fromTime: schedule.fromTime,
          toTime: schedule.toTime,
        };
      }
      schedulesByTime[timeString][schedule.day] = schedule;
    }
    const recessTimeString = recess.fromTime + " - " + recess.toTime;
    schedulesByTime[recessTimeString] = {
      fromTime: recess.fromTime,
      toTime: recess.toTime,
    };
    WorkingDaysList.forEach((day) => {
      schedulesByTime[recessTimeString][day] = recess.label;
    });
    usedSlots = Object.keys(schedulesByTime).map((time) => time.split(" - "));
    return Object.values(schedulesByTime).sort((a, b) =>
      a.fromTime.localeCompare(b.fromTime)
    );
  };
  function handleInputChange(
    event,
    name,
    type = false,
    max = null,
    manualFocus = null
  ) {
    let originalValue;
    if (type === "date") {
      originalValue = event;
    } else {
      originalValue = event.target.value;
      if (
        type === "number" &&
        (isNaN(Number(originalValue)) || Number(originalValue) < 0)
      ) {
        return;
      }
      if (type === "number" && max != null && Number(originalValue) > max) {
        return;
      }
    }

    const attributes = name.split(".");
    if (attributes.length <= 1) {
      setNewSchedule({ [name]: originalValue });
      return;
    }
    const key = attributes[0];
    const value = newSchedule[key];
    let prevObj = value;
    for (let i = 1; i < attributes.length; i++) {
      if (i + 1 === attributes.length) {
        prevObj[attributes[i]] = type === "date" ? event : event.target.value;
      } else {
        prevObj = prevObj[attributes[i]];
      }
    }
    setNewSchedule({ [key]: value }, () => {
      if (manualFocus) {
        document.getElementById(event.target.id).focus();
      }
    });
  }
  function getMoment(time) {
    return moment(new Date().toDateString() + " " + time);
  }
  function addPeriod() {
    if (newSchedule.toTime < newSchedule.fromTime) {
      setNewSchedule({
        ...newSchedule,
        errMessage: "End time should be greater than start time.",
      });
      return;
    }
    if (
      isOverlapping(
        [newSchedule.fromTime, newSchedule.toTime],
        [recess.fromTime, recess.toTime]
      )
    ) {
      setNewSchedule({
        ...newSchedule,
        errMessage: "New Period is overlapping with recess.",
      });
      return;
    }
    for (let slot of usedSlots) {
      if (isOverlapping([newSchedule.fromTime, newSchedule.toTime], slot)) {
        setNewSchedule({
          ...newSchedule,
          errMessage: "New Period is overlapping with some period.",
        });
        return;
      }
    }
    const newSchedules = [];
    for (let day of WorkingDaysList) {
      newSchedules.push({
        fromTime:newSchedule.fromTime,
        toTime: newSchedule.toTime,
        day: day,
        classId: classId,
        classSectionId: classSectionId,
        subject: "",
        staffId: "",
      });
    }
    setSchedules([...schedules, ...newSchedule]);
  }

  const saveTimeTable = (e) => {
    e.preventDefault();
    console.log(schedules);
  };

  return (
    <>
      <SimpleHeader name="Class View" parentName="Time Table" />
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
      <Container className="mt--6 shadow-lg">
        <Card>
          <CardBody>
            <Row className="m-4">
              <Col md="6">
                <Label
                  className="form-control-label"
                  htmlFor="xample-date-input"
                >
                  Select Class
                </Label>
                <Input
                  id="example4cols3Input"
                  type="select"
                  onChange={handleChange("class")}
                  value={timeTableData.class}
                  required
                >
                  <option value="" disabled selected>
                    Select Class
                  </option>
                  {classes.map((clas) => {
                    return (
                      <option key={clas._id} value={clas._id}>
                        {clas.name}
                      </option>
                    );
                  })}
                </Input>
              </Col>
              <Col md="6">
                <Label
                  className="form-control-label"
                  htmlFor="xample-date-input"
                >
                  Select Section
                </Label>
                <Input
                  id="example4cols3Input"
                  type="select"
                  onChange={handleChange("section")}
                  value={timeTableData.section}
                  required
                  placeholder="Add Periods"
                >
                  <option value="">Select Section</option>
                  {selectedClass.section &&
                    selectedClass.section.map((section) => {
                      console.log(section.name);
                      return (
                        <option value={section._id} key={section._id} selected>
                          {section.name}
                        </option>
                      );
                    })}
                </Input>
              </Col>
            </Row>
          </CardBody>
        </Card>
      </Container>
      {show && (
        <Container>
          <Card>
            <CardHeader>
              <h2>Add Periods</h2>
            </CardHeader>
            <CardBody>
              <form className="col-12" onSubmit={saveTimeTable}>
                {admin ? (
                  <>
                    <div className="col-12 row">
                      <label className="font-weight-bold col-2">
                        <i className="fa fa-plus" />
                        &nbsp;Add Period
                      </label>
                      <div className="col-auto">
                        <TimePicker
                          value={getMoment(newSchedule.fromTime)}
                          use12Hours={true}
                          showSecond={false}
                          allowEmpty={false}
                          onChange={(event) => {
                           
                            setNewSchedule({
                              ...newSchedule,
                              errMessage: "",
                              fromTime: event.format(timeFormat),
                              toTime:
                                newSchedule.toTime.localeCompare(
                                  event.format(timeFormat)
                                ) > -1
                                  ? newSchedule.toTime
                                  : event.format(timeFormat),
                            });
                          }}
                        />
                      </div>
                      <div className="col-auto text-center">to</div>
                      <div className="col-auto">
                        <TimePicker
                          value={getMoment(newSchedule.toTime)}
                          use12Hours={true}
                          showSecond={false}
                          allowEmpty={false}
                          onChange={(event) => {
                           
                            setNewSchedule({
                              ...newSchedule,
                              errMessage: "",
                              toTime:
                                event
                                  .format(timeFormat)
                                  .localeCompare(newSchedule.fromTime) > -1
                                  ? event.format(timeFormat)
                                  : newSchedule.fromTime,
                            });
                          }}
                        />
                      </div>
                      <div className="col-auto">
                        <button
                          type="button"
                          className="btn btn-primary"
                          onClick={addPeriod}
                        >
                          <i className="fa fa-plus" />
                          &nbsp;Add Period
                        </button>
                      </div>
                      <div className="col-auto">
                        <button
                          type="button"
                          className="btn btn-primary"
                          onClick={() => {
                            setShowBreak(true);
                          }}
                        >
                          <i className="fa fa-plus" />
                          &nbsp;Create-Break
                        </button>
                      </div>
                      <div className="col-auto">
                        <button
                          type="button"
                          className="btn btn-primary"
                          onClick={addPeriod}
                        >
                          <i className="fa fa-plus" />
                          &nbsp;Online Class
                        </button>
                      </div>
                    </div>

                    <div className="col-10 offset-2 text-danger">
                      {newSchedule.errMessage}
                    </div>
                    {showBreak && (
                      <div className="col-12 row mt-2">
                        <label className="font-weight-bold col-2">
                          {recess.label}
                        </label>
                        <div className="col-auto">
                          <TimePicker
                            value={getMoment(recess.fromTime)}
                            use12Hours={true}
                            showSecond={false}
                            allowEmpty={false}
                            disabled={!admin}
                            onChange={(event) => {
                              handleInputChange(
                                {
                                  target: { value: event.format(timeFormat) },
                                },
                                "recess.fromTime"
                              );
                             
                              setRecess({
                                ...recess,
                                toTime:
                                  recess.toTime.localeCompare(
                                    event.format(timeFormat)
                                  ) > -1
                                    ? recess.toTime
                                    : event.format(timeFormat),
                              });
                            }}
                          />
                        </div>
                        <div className="col-auto text-center">to</div>
                        <div className="col-auto">
                          <TimePicker
                            value={getMoment(recess.toTime)}
                            use12Hours={true}
                            showSecond={false}
                            allowEmpty={false}
                            disabled={!admin}
                            onChange={(event) =>
                              handleInputChange(
                                {
                                  target: {
                                    value:
                                      event
                                        .format(timeFormat)
                                        .localeCompare(recess.fromTime) > -1
                                        ? event.format(timeFormat)
                                        : recess.fromTime,
                                  },
                                },
                                "recess.toTime"
                              )
                            }
                          />
                        </div>
                      </div>
                    )}
                  </>
                ) : null}
                 <div id="time-table-class-view">
                    <DataTable
                      columns={getTimetableColumnList()}
                      data={getMappedSchedules()}
                      persistTableHead={true}
                      progressPending={loading}
                      selectableRowsVisibleOnly={true}
                      pointerOnHover={true}
                    />
                  </div>
                  <div className="d-none">
                    <div id="time-table-printable">
                      <div className="h3 text-center">
                        {/* {className} - {sectionName} */}
                      </div>
                      <table class="table">
                        <thead>
                          <tr>
                            {getTimetableColumnList()
                              .slice(
                                0,
                                getTimetableColumnList().length - 1
                              )
                              .map((column) => {
                                return <th>{column.name}</th>;
                              })}
                          </tr>
                        </thead>
                        <tbody>
                          {getMappedSchedules().map((schedule) => {
                            return (
                              <tr>
                                {getTimetableColumnList(true)
                                  .slice(
                                    0,
                                    getTimetableColumnList().length - 1
                                  )
                                  .map((column) => {
                                    return <td>{column.cell(schedule)}</td>;
                                  })}
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
              </form>
            </CardBody>
          </Card>
        </Container>
      )}
    </>
  );
};

export default TimeTable;
