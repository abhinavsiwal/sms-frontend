import React ,{useState}from 'react'
import SimpleHeader from "components/Headers/SimpleHeader.js";
import Loader from "components/Loader/Loader";
import { SearchOutlined } from "@ant-design/icons";
import { CSVLink } from "react-csv";
import {
    Card,
    CardHeader,
    CardBody,
    Input,
    Container,
    Row,
    Col,
    Label,
    Button,
    CardImg,
    UncontrolledDropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem,
    Modal,
    ModalBody,
    ModalHeader,
    ModalFooter,
    Form,
  } from "reactstrap";
  import { Table } from "ant-table-extensions";
  import { isAuthenticated } from "api/auth";
import { useEffect } from 'react';
import axios from 'axios';

function StudentReports() {
    const { user, token } = isAuthenticated();
    const [reportList,setReportList] = useState([])
    const [loading, setLoading] = useState(false);
    const [classes,setClasses] = useState([])
    const [sessions,setSessions] = useState([])
    const [clas,setClas] = useState("")
    const [sec,setSec] = useState("")
    const [session,setSession] = useState("")
    const [selectClass,setSelectClass] = useState({})

    const formData = new FormData()

    const formatDate = (changeDate) =>{
      const date = new Date(changeDate);
      const yyyy = date.getFullYear();
      let mm = date.getMonth() + 1;
      let dd = date.getDate();
      if (dd < 10) dd = '0' + dd;
      if (mm < 10) mm = '0' + mm;
      const formattedDate = dd + '-' + mm + '-' + yyyy;
      return formattedDate
    }

    const getReports = () =>{
      setLoading(true)
      var config = {
        method: 'post',
        url: `${process.env.REACT_APP_API_URL}/api/reports/student_report/${user.school}/${user._id}`,
        headers: { 
          'Authorization': 'Bearer ' + token
        }
      };
      
      axios(config)
      .then(function (response) {
        const data = [];
        for (let i = 0; i < response.data.length; i++) {
          data.push({
            key: i+1,
            sid: response.data[i].SID,
            name: response.data[i].firstname + " " + response.data[i].lastname,
            class: response.data[i].class && response.data[i].class.name,
            section: response.data[i].section && response.data[i].section.name,
            gender: response.data[i].gender,
            rno: response.data[i].roll_number,
            joining_date: formatDate(response.data[i].joining_date),
            date_of_birth: formatDate(response.data[i].date_of_birth),
            aadhar_number: response.data[i].aadhar_number,
            birth_place: response.data[i].birth_place,
            caste: response.data[i].caste,
            religion: response.data[i].religion,
            blood_group: response.data[i].bloodgroup,
            permanent_address: response.data[i].permanent_address,
            pincode: response.data[i].pincode,
            state:response.data[i].state,
            city: response.data[i].city,
            present_address: response.data[i].present_address,
            nationality: response.data[i].nationality,
            mother_tongue: response.data[i].mother_tongue,
            guardian_phone: response.data[i].guardian_phone,
            father_name: response.data[i].father_name,
            father_phone: response.data[i].father_phone,
            mother_name: response.data[i].mother_name,
            mother_phone:response.data[i].mother_phone
          });
        }
        setReportList(data)
        setLoading(false)
      })
      .catch(function (error) {
        console.log(error);
      });
    }

    const getAllClasses = () =>{
      var config = {
        method: 'get',
        url: `${process.env.REACT_APP_API_URL}/api/school/class/all/${user.school}/${user._id}`,
        headers: { 
          'Authorization': 'Bearer ' + token
        }
      };
      
      axios(config)
      .then(function (response) {
        setClasses(response.data);
      })
    }

    const getAllSessions = () =>{
      var config = {
        method: 'get',
        url: `${process.env.REACT_APP_API_URL}/api/school/session/all/${user.school}/${user._id}`,
        headers: { 
          'Authorization': 'Bearer ' + token
        }
      };
      
      axios(config)
      .then(function (response) {
        setSessions(response.data);
      })
    }

    useEffect(() =>{
      getReports()
      getAllClasses()
      getAllSessions()
    },[])
    
    const classHandler = (e) =>{
      setClas(e.target.value)
      var section = classes.find((item) => e.target.value.toString() === item._id.toString())
      setSelectClass(section)
    }

    const sectionHandler = (e) =>{
      setSec(e.target.value)
    }
    const sessionHandler = (e) =>{
      setSession(e.target.value)
    }
    const searchHHandler = () =>{
      formData.append("section",sec)
      formData.append("class",clas)
      formData.append("session",session)
      setLoading(true)
      var config = {
        method: 'post',
        url: `${process.env.REACT_APP_API_URL}/api/reports/student_report/${user.school}/${user._id}`,
        headers: { 
          'Authorization': 'Bearer ' + token,
          'Content-Type' : 'multipart/form-data'
        },
        data : formData
      };
      axios(config)
      .then(function (response) {
        const data = [];
        for (let i = 0; i < response.data.length; i++) {
          data.push({
            key: i+1,
            sid: response.data[i].SID,
            name: response.data[i].firstname + " " + response.data[i].lastname,
            class: response.data[i].class && response.data[i].class.name,
            section: response.data[i].section && response.data[i].section.name,
            gender: response.data[i].gender,
            rno: response.data[i].roll_number,
            joining_date: formatDate(response.data[i].joining_date),
            date_of_birth: formatDate(response.data[i].date_of_birth),
            aadhar_number: response.data[i].aadhar_number,
            birth_place: response.data[i].birth_place,
            caste: response.data[i].caste,
            religion: response.data[i].religion,
            blood_group: response.data[i].bloodgroup,
            permanent_address: response.data[i].permanent_address,
            pincode: response.data[i].pincode,
            state:response.data[i].state,
            city: response.data[i].city,
            present_address: response.data[i].present_address,
            nationality: response.data[i].nationality,
            mother_tongue: response.data[i].mother_tongue,
            guardian_phone: response.data[i].guardian_phone,
            father_name: response.data[i].father_name,
            father_phone: response.data[i].father_phone,
            mother_name: response.data[i].mother_name,
            mother_phone:response.data[i].mother_phone
          });
        }
        setReportList(data)
        setLoading(false)
      })


    }
    const csvHandler = () =>{
      const csvData = [
        ...reportList
      ]

      const headers = [
        { label: "Sr No.", key: "key" },
        { label: "Student ID", key: "sid" },
        { label: "Name", key: "name" },
        { label: "Class", key: "class" },
        { label: "Section", key: "section" },
        { label: "Gender", key: "gender" },
        { label: "Roll No.", key: "rno" },
        { label: "Enrolment Date", key: "joining_date" },
        { label: "Date of Birth", key: "date_of_birth" },
        { label: "Aadhar No.", key: "aadhar_number" },
        { label: "Birth Place", key: "birth_place" },
        { label: "Caste", key: "caste" },
        { label: "Religion", key: "religion" },
        { label: "Blood Group", key: "blood_group" },
        { label: "Permanent Address", key: "permanent_address" },
        { label: "Pincode", key: "pincode" },
        { label: "State", key: "state" },
        { label: "City", key: "city" },
        { label: "Present Address", key: "present_address" },
        { label: "Nationality", key: "nationality" },
        { label: "Mother Tongue", key: "mother_tongue" },
        { label: "Father Name", key: "father_name" },
        { label: "Father Phone", key: "father_phone" },
        { label: "Mother Name", key: "mother_name" },
        { label: "Mother Phone", key: "mother_phone" },
        { label: "Guardian Phone", key: "guardian_phone" },
      ];

      return {
        data: csvData,
        headers: headers,
        filename: 'Student_Report.csv'
      };
    }

    const columns = [
        {
          title: "Sr No.",
          dataIndex: "key",
          align: "left",
        },
        {
          title: "Student ID",
          dataIndex: "sid",
          align: "left",
          sorter: (a, b) => a.description > b.description,
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
            return record.description.toLowerCase().includes(value.toLowerCase());
          },
        },
        {
          title: "NAME",
          dataIndex: "name",
          align: "left",
          sorter: (a, b) => a.from > b.from,
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
            return record.from.toLowerCase().includes(value.toLowerCase());
          },
        },
        {
          title: "ClASS",
          dataIndex: "class",
          align: "left",
          sorter: (a, b) => a.to > b.to,
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
            return record.to.toLowerCase().includes(value.toLowerCase());
          },
        },
        {
          title: "SECTION",
          dataIndex: "section",
          align: "left",
          sorter: (a, b) => a.to > b.to,
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
            return record.to.toLowerCase().includes(value.toLowerCase());
          },
        },
        {
          title: "GENDER",
          dataIndex: "gender",
          align: "left",
          sorter: (a, b) => a.to > b.to,
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
            return record.to.toLowerCase().includes(value.toLowerCase());
          },
        },
        {
            title: "ROLL NO",
            dataIndex: "rno",
            align: "left",
            sorter: (a, b) => a.to > b.to,
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
              return record.to.toLowerCase().includes(value.toLowerCase());
            },
        },
        {
          title: "ENROLLMENT DATE",
          dataIndex: "joining_date",
          align: "left",
          sorter: (a, b) => a.to > b.to,
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
            return record.to.toLowerCase().includes(value.toLowerCase());
          },
        },
        {
          title: "DATE OF BIRTH",
          dataIndex: "date_of_birth",
          align: "left",
          sorter: (a, b) => a.to > b.to,
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
            return record.to.toLowerCase().includes(value.toLowerCase());
          },
        },
        {
          title: "AADHAR NO",
          dataIndex: "aadhar_number",
          align: "left",
          sorter: (a, b) => a.to > b.to,
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
            return record.to.toLowerCase().includes(value.toLowerCase());
          },
        },
        {
          title: "BIRTH PLACE",
          dataIndex: "birth_place",
          align: "left",
          sorter: (a, b) => a.to > b.to,
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
            return record.to.toLowerCase().includes(value.toLowerCase());
          },
        },
        {
          title: "CASTE",
          dataIndex: "caste",
          align: "left",
          sorter: (a, b) => a.to > b.to,
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
            return record.to.toLowerCase().includes(value.toLowerCase());
          },
        },
        {
          title: "RELIGION",
          dataIndex: "religion",
          align: "left",
          sorter: (a, b) => a.to > b.to,
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
            return record.to.toLowerCase().includes(value.toLowerCase());
          },
        },
        {
          title: "BLOOD GROUP",
          dataIndex: "blood_group",
          align: "left",
          sorter: (a, b) => a.to > b.to,
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
            return record.to.toLowerCase().includes(value.toLowerCase());
          },
        },
        {
          title: "PERMANENT ADDRESS",
          dataIndex: "permanent_address",
          align: "left",
          sorter: (a, b) => a.to > b.to,
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
            return record.to.toLowerCase().includes(value.toLowerCase());
          },
        },
        {
          title: "PIN CODE",
          dataIndex: "pincode",
          align: "left",
          sorter: (a, b) => a.to > b.to,
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
            return record.to.toLowerCase().includes(value.toLowerCase());
          },
        },
        {
          title: "STATE",
          dataIndex: "state",
          align: "left",
          sorter: (a, b) => a.to > b.to,
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
            return record.to.toLowerCase().includes(value.toLowerCase());
          },
        },
        {
          title: "CITY",
          dataIndex: "city",
          align: "left",
          sorter: (a, b) => a.to > b.to,
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
            return record.to.toLowerCase().includes(value.toLowerCase());
          },
        },
        {
          title: "PRESENT ADDRESS",
          dataIndex: "present_address",
          align: "left",
          sorter: (a, b) => a.to > b.to,
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
            return record.to.toLowerCase().includes(value.toLowerCase());
          },
        },
        {
          title: "NATIONALITY",
          dataIndex: "nationality",
          align: "left",
          sorter: (a, b) => a.to > b.to,
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
            return record.to.toLowerCase().includes(value.toLowerCase());
          },
        },
        {
          title: "MOTHER TONGUE",
          dataIndex: "mother_tongue",
          align: "left",
          sorter: (a, b) => a.to > b.to,
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
            return record.to.toLowerCase().includes(value.toLowerCase());
          },
        },
        {
          title: "FATHER's NAME",
          dataIndex: "father_name",
          align: "left",
          sorter: (a, b) => a.to > b.to,
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
            return record.to.toLowerCase().includes(value.toLowerCase());
          },
        },
        {
          title: "FATHER's PHONE",
          dataIndex: "father_phone",
          align: "left",
          sorter: (a, b) => a.to > b.to,
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
            return record.to.toLowerCase().includes(value.toLowerCase());
          },
        },
        {
          title: "MOTHER's NAME",
          dataIndex: "mother_name",
          align: "left",
          sorter: (a, b) => a.to > b.to,
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
            return record.to.toLowerCase().includes(value.toLowerCase());
          },
        },
        {
          title: "MOTHER's PHONE",
          dataIndex: "mother_phone",
          align: "left",
          sorter: (a, b) => a.to > b.to,
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
            return record.to.toLowerCase().includes(value.toLowerCase());
          },
        },
        {
          title: "GUARDIAN's PHONE",
          dataIndex: "guardian_phone",
          align: "left",
          sorter: (a, b) => a.to > b.to,
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
            return record.to.toLowerCase().includes(value.toLowerCase());
          },
        },
      ];
    return (
    <>
        <SimpleHeader name="Student Reports" parentName="Reports" />   
            <Container className="mt--6 shadow-lg" fluid>
                <Card>
                  <CardBody>
                    <Row>
                      <Col md="3">
                        <Input
                          id="exampleFormControlSelect3"
                          type="select"
                          value={clas}
                          onChange={classHandler}
                          required
                        >
                          <option value="" disabled selected>
                            Select Class
                          </option>
                          {
                            classes && classes.map((item,index) =>(
                              <option key={index} value={item._id}  >
                                {item.name}
                              </option>
                            ))
                          }
                        </Input>
                      </Col>
                      <Col md="3">
                        <Input
                          id="exampleFormControlSelect3"
                          type="select"
                          value={sec}
                          onChange={sectionHandler}
                          required
                        >
                          <option value="" disabled selected>
                            Select Section
                          </option>
                          {
                            selectClass.section && selectClass.section.map((item,index) =>(
                              <option key={index} value={item._id}>
                                {item.name}
                              </option>
                            ))
                          }
                        </Input>
                      </Col>
                      <Col md="3">
                        <Input
                          id="exampleFormControlSelect3"
                          type="select"
                          value={session}
                          onChange={sessionHandler}
                          required
                        >
                            <option value="" disabled selected>
                                Select Session
                            </option>
                            {
                            sessions && sessions.map((item,index) =>(
                              <option key={index} value={item._id}  >
                                {item.name}
                              </option>
                            ))
                          }

                        </Input>
                      </Col>
                      <Col md="3" className='d-flex justify-content-end align-items-center'>
                        <Button color="primary" onClick={searchHHandler}>
                          <SearchOutlined />
                          &nbsp;
                          Search
                        </Button>
                      </Col>
                    </Row>
                    <Row className='mt-4'>
                        <Col md="12">
                          <Button color='primary' onClick={csvHandler}>
                            <CSVLink {...csvHandler()} style={{color:"white"}}>Export to CSV</CSVLink>
                          </Button>
                        </Col>
                    </Row>
                    <Row className='mt-4'>
                      <Col md='12'>
                      {
                        loading ?  <Loader /> : 
                        <div
                          style={{ overflowX: "auto" }}
                        >
                          <Table
                            columns={columns}
                            dataSource={reportList}
                            pagination={{
                            pageSizeOptions: [
                                "5",
                                "10",
                                "30",
                                "60",
                                "100",
                                "1000",
                              ],
                              showSizeChanger: true,
                            }}
                            scroll={{x:true}}
                            style={{ whiteSpace: "pre" }}
                            exportFileName="details"
                          />
                        </div>
                      }
                      </Col>
                    </Row> 
                  </CardBody>
                </Card>
            </Container>
    </>
  )
}

export default StudentReports