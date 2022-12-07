import AbstractComponent from '../../../abstract/abstract.component';
import DataTable from 'react-data-table-component';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { isAuthenticated } from "api/auth";
import Loader from 'components/Loader/Loader';
import { Table } from "ant-table-extensions";
import { SearchOutlined } from "@ant-design/icons";

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
} from "reactstrap";

export default class QuestionPaperList extends AbstractComponent {
    constructor() {
        super();
        this.state = {
            questionPaperList: [],
            isListLoading: false,
            formatDate : (changeDate) =>{
              const date = new Date(changeDate);
              const yyyy = date.getFullYear();
              let mm = date.getMonth() + 1;
              let dd = date.getDate();
              if (dd < 10) dd = '0' + dd;
              if (mm < 10) mm = '0' + mm;
              const formattedDate = dd + '-' + mm + '-' + yyyy;
              return formattedDate
            }
        }
    }
   


    componentDidMount() {
        this.setState({ isListLoading: true });
        let data = new FormData()
        data.append('class' , '628a19cf64f724cdfad91da4')
        var config = {
          method: 'post',
          url: `${process.env.REACT_APP_API_URL}/api/grades/get_question/${isAuthenticated().user.school}/${isAuthenticated().user._id}`,
          headers: { 
            'Authorization': 'Bearer ' + isAuthenticated().token,
            'Content-Type' : 'multipart/form-data'
          },
          data : data
        };
        console.log(config)
        axios(config)
        .then((response) =>{
            this.setState({ isListLoading: false });
            const data = [];
            for (let i = 0; i < response.data.length; i++) {
              data.push({
                key: i+1,
                total_marks : response.data[i].total_marks,
                questions : response.data[i].questions,
                exam_date : this.state.formatDate(response.data[i].exam_date),
                exam_paper_set : response.data[i].exam_paper_set,
                subject : response.data[i].subject,
                class: response.data[i].class.name
              });
            }
            this.setState({questionPaperList: data})
            console.log(response)
        }).catch((error) =>{
          this.setState({ isListLoading: false });
            console.log(error)
        })
    }

    getColumnList() {
      const columns = [
        {
          title: "Sr No.",
          dataIndex: "key",
          align: "left",
        },
        {
          title: "Subject",
          dataIndex: "subject",
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
          title: "Exam Paper Set",
          dataIndex: "exam_paper_set",
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
          title: "Exam Date",
          dataIndex: "exam_date",
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
            title: "Questions",
            dataIndex: "questions",
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
            title: "Total MArks",
            dataIndex: "total_marks",
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
        ];

        return columns
    }

    render() {
      return (
        <div className="page">
          {/* Start Page title and tab */}
          <div className="section-body">
            <div className="container-fluid">
              <div className="d-flex justify-content-between align-items-center ">
                <div className="header-action">
                  <ol className="breadcrumb page-breadcrumb align-items-center mt-4">
                    <li className="breadcrumb-item active" aria-current="page">List View</li>
                    <li className="breadcrumb-item active text-dark" aria-current="page">Question Paper</li>
                  </ol>
                </div>
              </div>
            </div>
          </div>
          <div className="section-body mt-4">
            <div className="container-fluid">
              {
                  this.state.isListLoading ? <Loader />

                  :

                  <div style={{ overflowX: "auto" }}
                    >
                      <Table
                        columns={this.getColumnList()}
                        dataSource={this.state.questionPaperList}
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

            </div>
          </div>
        </div>
      );
    }
}