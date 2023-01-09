import AbstractComponent from '../../../abstract/abstract.component';
import DataTable from 'react-data-table-component';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { isAuthenticated } from "api/auth";
import Loader from 'components/Loader/Loader';
import { Table } from "ant-table-extensions";
import { SearchOutlined } from "@ant-design/icons";
import { Popconfirm } from "antd";
import { ToastContainer, toast } from "react-toastify";
import SimpleHeader from "components/Headers/SimpleHeader.js";


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

    deleteQuestionPaper = (id) =>{
      var data = new FormData();
      data.append('_id', id);
      var config = {
        method: 'delete',
        url: `${process.env.REACT_APP_API_URL}/api/grades/delete_question_paper/${isAuthenticated().user.school}/${isAuthenticated().user._id}`,
        headers: { 
            'Authorization': 'Bearer '+ isAuthenticated().token, 
            'Content-Type' : 'multipart/form-data'
        },
        data : data
      };
      axios(config)
      .then((response) => {
          console.log(response.data)
          this.getAllQuestions()
          toast.success("Question Paper deleted Successfully");
      })

    }

    upDateQuestion = (id) =>{
      this.props.history.push("question-builder/"+id)  
    }

    getAllQuestions = () =>{
      var config = {
        method: 'post',
        url: `${process.env.REACT_APP_API_URL}/api/grades/get_question/${isAuthenticated().user.school}/${isAuthenticated().user._id}`,
        headers: { 
          'Authorization': 'Bearer ' + isAuthenticated().token,
        },
      };
      console.log(config)
      axios(config)
      .then((response) =>{
        console.log(response.data)
          this.setState({ isListLoading: false });
          const data = [];
          for (let i = 0; i < response.data.length; i++) {
            data.push({
              key: i+1,
              total_marks : response.data[i].total_marks,
              exam_date : this.state.formatDate(response.data[i].exam_date),
              exam_paper_set : response.data[i].exam_paper_set,
              subject : response.data[i].subject,
              class: response.data[i].class.name,
              question_count: response.data[i].question_count,
              action:(
                <h5 key={i + 1} className="mb-0">
                <Button
                  color="primary"
                  className="btn-sm pull-right"
                  key={"edit" + i + 1}
                  onClick={() => this.upDateQuestion(response.data[i]._id)}
                >
                  <i className="fas fa-user-edit" />
                </Button>
                <Button
                  className="btn-sm pull-right"
                  color="danger"
                  type="button"
                  key={"delete" + i + 1}
                >
                  <Popconfirm
                    title="Sure to delete?"
                    onConfirm={() => this.deleteQuestionPaper(response.data[i]._id)}
                  >
                    <i className="fas fa-trash" />
                  </Popconfirm>
                </Button>
                {/* <Button
                  className="btn-sm pull-right"
                  color="success"
                  type="button"
                  key={"view" + i + 1}
                >
                  <i className="fas fa-eye" />
                </Button> */}
              </h5>
              )
            });
          }
          this.setState({questionPaperList: data})
          console.log(response)
      }).catch((error) =>{
        this.setState({ isListLoading: false });
          console.log(error)
      })
    }
   
    componentDidMount() {
        this.setState({ isListLoading: true });
        this.getAllQuestions()
    }

    getColumnList() {
      const columns = [
        {
          title: "Sr No.",
          dataIndex: "key",
          align: "left",
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
            title: "QUESTION COUNT",
            dataIndex: "question_count",
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
            title: "Action",
            align:"center",
            key: "action",
            dataIndex: "action",
            fixed: "right",
          },
        ];

        return columns
    }

    render() {
      return (
        <>
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
          <SimpleHeader name="Question List" parentName="Question" />   
          <Container className="mt--6 shadow-lg" fluid>
            <Card>
              <CardBody>
                <div className="page">
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
              </CardBody>
            </Card>
          </Container>
        </>
      );
    }
}
