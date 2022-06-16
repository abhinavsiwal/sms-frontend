import React, { useState, useEffect, useRef } from "react";
import {
  Container,
  // CardHeader,
  // Table,
  Button,
  Modal,
  Card,
  ModalFooter,
  ModalBody,
  Row,
  Col,
  Input,
  Form,
  CardBody,
} from "reactstrap";
import { Table } from "ant-table-extensions";
// import { FaEdit } from "react-icons/fa";
import SimpleHeader from "components/Headers/SimpleHeader.js";
import "./style.css";
import { toast, ToastContainer } from "react-toastify";
import { isAuthenticated } from "api/auth";
import { Popconfirm } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import AntTable from "../tables/AntTable";
import Loader from "components/Loader/Loader";
import {
  getAllLibrarySection,
  getAllLibraryShelf,
  addBook,
  getAllBooks,
  deleteBook,
  editBook,
} from "../../../api/libraryManagement";
const AddBooks = () => {
  const { user, token } = isAuthenticated();
  const [addLoading, setAddLoading] = useState(false);
  const [allSection, setAllSection] = useState([]);
  const [selectedSection, setSelectedSection] = useState({});
  const [selectedEditSection, setSelectedEditSection] = useState({});
  const [allShelf, setAllShelf] = useState([]);
  const [loading, setLoading] = useState(false);
  const [bookName, setBookName] = useState("");
  const [bookSection, setBookSection] = useState("");
  const [bookQty, setBookQty] = useState("");
  const [bookAuthor, setBookAuthor] = useState("");
  const [editBookAuthor, setEditBookAuthor] = useState("");
  const [bookShelf, setBookShelf] = useState("");
  const [editBookName, setEditBookName] = useState("");
  const [editBookSection, setEditBookSection] = useState("");
  const [editBookShelf, setEditBookShelf] = useState("");
  const [editBookId, setEditBookId] = useState("");
  const [editing, setEditing] = useState(false);
  const [allBooks, setAllBooks] = useState([]);
  const [checked, setChecked] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  useEffect(() => {
    getAllSection();
    getAllShelf();
  }, []);
  useEffect(() => {
    getAllBooksHandler();
  }, [checked]);

  const columns = [
    {
      title: "S No.",
      dataIndex: "s_no",
      align:"left",
    },
  
    {
      title: "Book Name",
      dataIndex: "book_name",
      align:"left",
      sorter: (a, b) => a.book_name > b.book_name,
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
        return record.book_name.toLowerCase().includes(value.toLowerCase());
      },
    },
    {
      title: "Book Author",
      align:"left",
      dataIndex: "book_author",
      sorter: (a, b) => a.book_author > b.book_author,
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
        return record.book_author.toLowerCase().includes(value.toLowerCase());
      },
    },
    {
      align:"left",
        title: "Quantity",
        dataIndex: "book_quantity",
        sorter: (a, b) => a.book_quantity > b.book_quantity,
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
          return record.book_quantity.toLowerCase().includes(value.toLowerCase());
        },
      },
    {
      title: "Section Name",
      dataIndex: "section_name",
      sorter: (a, b) => a.section_name > b.section_name,
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
        return record.section_name.toLowerCase().includes(value.toLowerCase());
      },
    },
    {
      title: "Shelf Name",
      align:"left",
      dataIndex: "shelf_name",
      sorter: (a, b) => a.shelf_name > b.shelf_name,
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
        return record.shelf_name.toLowerCase().includes(value.toLowerCase());
      },
    },
    {
      title: "Action",
      key: "action",
      dataIndex: "action",
      fixed: "right",
      align:"left",
    },
  ];

  const getAllSection = async () => {
    try {
      const data = await getAllLibrarySection(user.school, user._id);
      console.log(data);
      setAllSection(data);
    } catch (err) {
      console.log(err);
      toast.error("Error in getting Sections");
    }
  };

  const getAllShelf = async () => {
    try {
      setLoading(true);
      const data = await getAllLibraryShelf(user.school, user._id);
      console.log(data);
      setAllShelf(data);
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  const getAllBooksHandler = async () => {
    try {
      const data = await getAllBooks(user.school, user._id);
      console.log(data);

      let tableData = [];
      for (let i = 0; i < data.length; i++) {
        tableData.push({
          key: i,
          s_no: i + 1,
          book_name: data[i].name,
          book_quantity: data[i].quantity,
          book_author: data[i].author,
          section_name: data[i].section.name,
          shelf_name: data[i].shelf.name,
          action: (
            <h5 key={i + 1} className="mb-0">
              <Button
                className="btn-sm pull-right"
                color="primary"
                type="button"
                key={"edit" + i + 1}
                onClick={() => {
                  setEditing(true);
                  setEditBookName(data[i].name);
                  setEditBookSection(data[i].section._id);
                  setEditBookShelf(data[i].shelf._id);
                  setEditBookId(data[i]._id);
                  setEditBookAuthor(data[i].author);
                }}
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
                  onConfirm={() => deleteBookHandler(data[i]._id)}
                >
                  <i className="fas fa-trash" />
                </Popconfirm>
              </Button>
            </h5>
          ),
        });
      }
      setAllBooks(tableData);
    } catch (err) {
      console.log(err);
    }
  };

  const editBookHandler = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.set("name", editBookName);
    formData.set("section", editBookSection);
    formData.set("shelf", editBookShelf);
    formData.set("author", editBookAuthor);
    try {
      setLoading(true);
      setEditLoading(true);
      const data = await editBook(user._id, editBookId, formData);
      console.log(data);
      if (data.err) {
        toast.error(data.err);
        setLoading(false);
        setEditLoading(false);
        return;
      }
      setEditing(false);
      setLoading(false);
      setEditLoading(false);
      getAllBooksHandler();
      toast.success("Book Edited Successfully");
    } catch (err) {
      console.log(err);
      setLoading(false);
      setEditLoading(false);
      toast.error("Error in Editing Book");
    }
  };

  const deleteBookHandler = async (bookId) => {
    try {
      setLoading(true);
      const data = await deleteBook(user._id, bookId);
      if (data.err) {
        toast.error(data.err);
        setLoading(false);
        return;
      }
      toast.success("Book Deleted");
      setChecked(!checked);
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
      toast.error("Error in deleting book");
    }
  };

  useEffect(() => {
    if (bookSection === "") {
      return;
    }

    let selectedSection1 = allSection.find(
      (section) => section._id === bookSection
    );
 
    setSelectedSection(selectedSection1);
  }, [bookSection]);

  useEffect(() => {
    if (editBookSection === "") {
      return;
    }

    let selectedSection1 = allSection.find(
      (section) => section._id === editBookSection
    );
    setSelectedEditSection(selectedSection1);
  }, [editBookSection, editing]);

  const addBookHandler = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.set("name", bookName);
    formData.set("section", bookSection);
    formData.set("shelf", bookShelf);
    formData.set("school", user.school);
    formData.set("quantity", bookQty);
    formData.set("author", bookAuthor);
    try {
      setAddLoading(true);
      const data = await addBook(user._id, formData);
      console.log(data);
      if (data.err) {
        toast.error(data.err);
        setAddLoading(false);
        return;
      }
      setAddLoading(false);
      toast.success("Book Added Successfully");
      setChecked(!checked);
      setBookName("");
      setBookQty("");
      setBookSection("");
      setBookShelf("");
      setBookAuthor("")
    } catch (err) {
      console.log(err);
      toast.error("Error in adding book");
      setAddLoading(false);
    }
  };

  return (
    <>
      <SimpleHeader name="Add Books" parentName="Library Management" />
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
      <Container className="mt--6" fluid>
        <Row>
          {addLoading ? (
            <Loader />
          ) : (
            <>
              <Col lg="4">
                <div className="card-wrapper">
                  <Card>
                    <CardBody>
                      <Form className="mb-4" onSubmit={addBookHandler}>
                        <Row>
                          <Col>
                            <label
                              className="form-control-label"
                              htmlFor="example4cols2Input"
                            >
                              Book Name
                            </label>
                            <Input
                              id="example4cols2Input"
                              placeholder="Book Name"
                              type="text"
                              onChange={(e) => setBookName(e.target.value)}
                              value={bookName}
                              required
                            />
                          </Col>
                        </Row>
                        <Row>
                          <Col>
                            <label
                              className="form-control-label"
                              htmlFor="example4cols2Input"
                            >
                              Book Author
                            </label>
                            <Input
                              id="example4cols2Input"
                              placeholder="Book Author"
                              type="text"
                              onChange={(e) => setBookAuthor(e.target.value)}
                              value={bookAuthor}
                            
                            />
                          </Col>
                        </Row>
                        <Row>
                          <Col>
                            <label
                              className="form-control-label"
                              htmlFor="example4cols2Input"
                            >
                              Quantity
                            </label>
                            <Input
                              id="example4cols2Input"
                              placeholder="Book Quantity"
                              type="number"
                              onChange={(e) => setBookQty(e.target.value)}
                              value={bookQty}
                              required
                            />
                          </Col>
                        </Row>
                        <Row>
                          <Col>
                            <label
                              className="form-control-label"
                              htmlFor="example4cols2Input"
                            >
                              Section
                            </label>
                            <Input
                              id="example4cols2Input"
                              placeholder="Book Section"
                              type="select"
                              onChange={(e) => setBookSection(e.target.value)}
                              value={bookSection}
                              required
                            >
                              <option value=""> Select Section</option>
                              {allSection &&
                                allSection.map((section, index) => {
                                  return (
                                    <option key={index} value={section._id}>
                                      {section.name}
                                    </option>
                                  );
                                })}
                            </Input>
                          </Col>
                        </Row>
                        <Row>
                          <Col>
                            <label
                              className="form-control-label"
                              htmlFor="example4cols2Input"
                            >
                              Shelf
                            </label>
                            <Input
                              id="example4cols2Input"
                              placeholder="Book Shelf"
                              type="select"
                              onChange={(e) => setBookShelf(e.target.value)}
                              value={bookShelf}
                              required
                            >
                              <option value="">Select Shelf</option>
                              {selectedSection.shelf &&
                                selectedSection.shelf.map((shelf) => {
                             
                                  return (
                                    <option key={shelf._id} value={shelf._id}>
                                      {shelf.name}
                                    </option>
                                  );
                                })}
                            </Input>
                          </Col>
                        </Row>

                        <Row className="mt-4 float-right">
                          <Col>
                            <Button
                              color="primary"
                              type="submit"
                              style={{
                                display: "flex",
                                justifyContent: "center",
                              }}
                            >
                              Submit
                            </Button>
                          </Col>
                        </Row>
                      </Form>
                    </CardBody>
                  </Card>
                </div>
              </Col>
              <Col>
                <div className="card-wrapper">
                  <Card>
                    <CardBody>
                      {loading ? (
                        <Loader />
                      ) : (
                        <AntTable
                          columns={columns}
                          data={allBooks}
                          pagination={true}
                          exportFileName="BookDetails"
                        />
                      )}
                    </CardBody>
                  </Card>
                </div>
              </Col>
            </>
          )}
        </Row>
        <Modal
          className="modal-dialog-centered"
          isOpen={editing}
          toggle={() => setEditing(false)}
          size="lg"
        >
          <div className="modal-header">
            <h2 className="modal-title" id="modal-title-default">
              Edit Book
            </h2>
            <button
              aria-label="Close"
              className="close"
              data-dismiss="modal"
              type="button"
              onClick={() => setEditing(false)}
            >
              <span aria-hidden={true}>×</span>
            </button>
          </div>
          {editLoading ? (
            <Loader />
          ) : (
            <ModalBody>
              <Form className="mb-4" onSubmit={editBookHandler}>
                <Row>
                  <Col>
                    <label
                      className="form-control-label"
                      htmlFor="example4cols2Input"
                    >
                      Book Name
                    </label>
                    <Input
                      id="example4cols2Input"
                      placeholder="Name"
                      type="text"
                      onChange={(e) => setEditBookName(e.target.value)}
                      value={editBookName}
                      required
                    />
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <label
                      className="form-control-label"
                      htmlFor="example4cols2Input"
                    >
                      Book Author
                    </label>
                    <Input
                      id="example4cols2Input"
                      placeholder="Name"
                      type="text"
                      onChange={(e) => setEditBookAuthor(e.target.value)}
                      value={editBookAuthor}
        
                    />
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <label
                      className="form-control-label"
                      htmlFor="example4cols2Input"
                    >
                      Section
                    </label>
                    <Input
                      id="example4cols2Input"
                      placeholder="Book Section"
                      type="select"
                      onChange={(e) => setEditBookSection(e.target.value)}
                      value={editBookSection}
                      required
                    >
                      <option value=""> Select Section</option>
                      {allSection &&
                        allSection.map((section, index) => {
                          return (
                            <option key={index} value={section._id}>
                              {section.name}
                            </option>
                          );
                        })}
                    </Input>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <label
                      className="form-control-label"
                      htmlFor="example4cols2Input"
                    >
                      Shelf
                    </label>
                    <Input
                      id="example4cols2Input"
                      placeholder="Book Shelf"
                      type="select"
                      onChange={(e) => setEditBookShelf(e.target.value)}
                      value={editBookShelf}
                      required
                    >
                      <option value="">Select Shelf</option>
                      {selectedEditSection.shelf &&
                        selectedEditSection.shelf.map((shelf) => {
                          //   console.log(shelf);
                          return (
                            <option key={shelf._id} value={shelf._id}>
                              {shelf.name}
                            </option>
                          );
                        })}
                    </Input>
                  </Col>
                </Row>
                <Row className="mt-4 float-right">
                  <Col>
                    <Button color="primary" type="submit">
                      Save Changes
                    </Button>
                  </Col>
                </Row>
              </Form>
            </ModalBody>
          )}
        </Modal>
      </Container>
    </>
  );
};

export default AddBooks;
