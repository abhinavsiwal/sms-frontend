import React, { useEffect, useState, useRef } from "react";
import { isAuthenticated } from "api/auth";
import {
  Card,
  CardHeader,
  CardBody,
  Input,
  Container,
  Row,
  Col,
  Button,
  Label,
  CardImg,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Modal,
  Form,
  ModalBody,
} from "reactstrap";
import { Table } from "ant-table-extensions";
import SimpleHeader from "components/Headers/SimpleHeader.js";
import { SearchOutlined } from "@ant-design/icons";
import AntTable from "../tables/AntTable";
import { Link } from "react-router-dom";

import ReactPaginate from "react-paginate";
import { deleteStaff } from "api/staff";
import Loader from "components/Loader/Loader";
import { toast, ToastContainer } from "react-toastify";
import { Popconfirm } from "antd";

import { useSelector, useDispatch } from "react-redux";
import { setStaffEditing } from "store/reducers/staff";
import PermissionsGate from "routeGuard/PermissionGate";
import { SCOPES } from "routeGuard/permission-maps";
import { fetchingStaffFailed } from "constants/errors";
import { deleteStaffError } from "constants/errors";
import { deleteStaffSuccess } from "constants/success";
import { getAllProducts, deleteProduct,updateProduct } from "api/product";

import { useReactToPrint } from "react-to-print";
import { getAllCategories } from "api/category";
const AllProducts = () => {
  const { user } = isAuthenticated();
  const [view, setView] = useState(0);
  const [productList, setProductList] = useState([]);
  const [page, setPage] = useState(0);
  const [checked, setChecked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [categoriesData, setCategoriesData] = useState([]);
  const [addProduct, setAddProduct] = useState({
    name: "",
    description: "",
    category: "",
    quantity: "",
    sellingPrice: "",
    discountType: "",
    discountValue: "",
    offerPrice: "",
    image: "",
    publish: "",
    id: "",
  });
  const columns = [
    {
      title: "S NO.",
      dataIndex: "sno",
      align: "left",
    },
    {
      title: "Product Name",
      dataIndex: "name",
      width: "40%",
      align: "left",
      sorter: (a, b) => a.name > b.name,
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
        return record.name.toLowerCase().includes(value.toLowerCase());
      },
    },
    {
      title: "description",
      dataIndex: "description",
      width: "50%",
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
        return record.abbreviation.toLowerCase().includes(value.toLowerCase());
      },
    },
    {
      title: "Category",
      dataIndex: "category",
      width: "40%",
      align: "left",
      sorter: (a, b) => a.category > b.category,
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
        return record.category.toLowerCase().includes(value.toLowerCase());
      },
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      width: "40%",
      align: "left",
      sorter: (a, b) => a.name > b.name,
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
        return record.name.toLowerCase().includes(value.toLowerCase());
      },
    },
    {
      title: "Selling Price",
      dataIndex: "sellingPrice",
      width: "40%",
      align: "left",
      sorter: (a, b) => a.sellingPrice > b.sellingPrice,
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
        return record.sellingPrice.toLowerCase().includes(value.toLowerCase());
      },
    },
    {
      title: "Discount Type",
      dataIndex: "discountType",
      width: "40%",
      align: "left",
      sorter: (a, b) => a.name > b.name,
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
        return record.name.toLowerCase().includes(value.toLowerCase());
      },
    },
    {
      title: "Discount Value",
      dataIndex: "discountValue",
      width: "40%",
      align: "left",
      sorter: (a, b) => a.name > b.name,
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
        return record.name.toLowerCase().includes(value.toLowerCase());
      },
    },
    {
      title: "Offer Price",
      dataIndex: "offerPrice",
      width: "40%",
      align: "left",
      sorter: (a, b) => a.name > b.name,
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
        return record.name.toLowerCase().includes(value.toLowerCase());
      },
    },
    {
      title: "Publish",
      dataIndex: "publish",
      width: "40%",
      align: "left",
      sorter: (a, b) => a.publish > b.publish,
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
        return record.publish.toLowerCase().includes(value.toLowerCase());
      },
    },

    {
      title: "Action",
      key: "action",
      align: "left",
      dataIndex: "action",
      fixed: "right",
    },
  ];

  useEffect(() => {
    getAllProductsHandler();
    getAllCategoriesHandler();
  }, [checked]);

  const getAllCategoriesHandler = async () => {
    try {
      const data = await getAllCategories(user._id, user.school);
      console.log(data);
      if (data.err) {
        toast.error(data.err);

        return;
      }
      setCategoriesData(data);
    } catch (err) {
      console.log(err);
      toast.error("Get Category Failed");
    }
  };

  const handleChange = (name) => (event) => {
    setAddProduct({ ...addProduct, [name]: event.target.value });
  };

  const getAllProductsHandler = async () => {
    try {
      setLoading(true);
      const data = await getAllProducts(user._id, user.school);
      console.log(data);
      if (data.err) {
        setLoading(false);
        toast.error(data.err);
        return;
      }

      let tableData = [];
      for (let i = 0; i < data.length; i++) {
        tableData.push({
          key: i,
          sno: i + 1,
          name: data[i].name,
          sellingPrice: data[i].sellingPrice,
          discountType: data[i].discountType,
          discountValue: data[i].discountValue,
          offerPrice: data[i].offerPrice,
          publish: data[i].publish,
          description: data[i].description,
          category: data[i].category,
          quantity: data[i].quantity,
          action: (
            <h5 key={i + 1} className="mb-0">
              {/* {permission1 && permission1.includes("edit".trim()) && ( */}
              <Button
                className="btn-sm pull-right"
                color="primary"
                type="button"
                key={"edit" + i + 1}
                onClick={() => editHandler(data[i])}
              >
                <i className="fas fa-user-edit" />
              </Button>
              {/* )} */}

              {/* {permission1 && permission1.includes("delete".trim()) && ( */}
              <Button
                className="btn-sm pull-right"
                color="danger"
                type="button"
                key={"delete" + i + 1}
              >
                <Popconfirm
                  title="Sure to delete?"
                  onConfirm={() => deleteProductHandler(data[i]._id)}
                >
                  <i className="fas fa-trash" />
                </Popconfirm>
              </Button>
              {/* )} */}
            </h5>
          ),
        });
      }
      setProductList(tableData);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      toast.error("Getting products failed");
    }
  };
  const editHandler = (data) => {
    setEditing(true);
    setAddProduct({
      id: data._id,
      name: data.name,
      sellingPrice: data.sellingPrice,
      discountType: data.discountType,
      discountValue: data.discountValue,
      offerPrice: data.offerPrice,
      publish: data.publish,
      description: data.description,
      category: data.category,
      quantity: data.quantity,
    });
  };
  const discountHandler = () => {
    if (addProduct.discountType === "Flat Rate") {
      console.log("Flat Rate");
      let price = addProduct.sellingPrice - addProduct.discountValue;
      setAddProduct({ ...addProduct, offerPrice: price });
    } else if (addProduct.discountType === "Percentage") {
      console.log("Percentage");
      let price =
        addProduct.sellingPrice -
        (addProduct.sellingPrice * (addProduct.discountValue / 100)).toFixed(0);
      setAddProduct({ ...addProduct, offerPrice: price });
    }
  };

  const deleteProductHandler = async (productId) => {
    try {
      setLoading(true);
      const data = await deleteProduct(user._id, productId);
      console.log(data);
      if (data.err) {
        setLoading(false);
        toast.error(data.err);
        return;
      }
      toast.success("Product deleted successfully");
      setChecked(!checked);
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
      toast.error("Deleting product failed");
    }
  };
  const editProductSubmitHandler =async (e)=>{
    e.preventDefault();
    const formData = new FormData();
    formData.set("name", addProduct.name); 
    formData.set("category", addProduct.category);
    formData.set("description", addProduct.description);
    formData.set("sellingPrice", addProduct.sellingPrice);
    formData.set("offerPrice", addProduct.offerPrice);
    formData.set("discountType", addProduct.discountType);
    formData.set("discountValue", addProduct.discountValue);
    formData.set("school", user.school);
    formData.set("quantity", addProduct.quantity);
    formData.set("publish", addProduct.publish);
    formData.set("id", addProduct.id);

    try {
        setEditLoading(true);
        const data =await updateProduct(user._id, formData);
        console.log(data);
        if(data.err){
            setEditLoading(false);
            toast.error(data.err);
            return;
        }
        toast.success("Product edited successfully");
        setChecked(!checked);
        setEditLoading(false);
        setEditing(false);
    } catch (err) {
        console.log(err);
        setEditLoading(false);
        toast.error("Editing product failed");
    }

  }
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

      <SimpleHeader name="All Products" parentName="Ecommerce" />
      <Container className="mt--6" fluid>
        <Card className="mb-4">
          <CardHeader className="buttons-head">
            <div>
              <Button
                color={`${view === 0 ? "warning" : "primary"}`}
                type="button"
                onClick={() => {
                  setView(0);
                }}
              >
                List View
              </Button>{" "}
              <Button
                color={`${view === 1 ? "warning" : "primary"}`}
                type="button"
                onClick={() => {
                  setView(1);
                }}
              >
                Grid View
              </Button>
            </div>
            {/* {permissions && permissions.includes("export") && ( */}
            <Button
              color="primary"
              className="mb-2"
              //   onClick={handlePrint}
              style={{ float: "right" }}
            >
              Print
            </Button>
            {/* // )} */}
          </CardHeader>
          <CardBody>
            {loading ? (
              <Loader />
            ) : (
              <>
                {view === 0 && (
                  <div
                    //   ref={componentRef}
                    style={{ overflowX: "auto" }}
                  >
                    <AntTable
                      columns={columns}
                      data={productList}
                      pagination={true}
                      exportFileName="StaffDetails"
                    />
                  </div>
                )}
                {view === 1 && (
                  <>
                    <Container className="" fluid>
                      <Row className="card-wrapper">
                        {productList.map((product, index) => {
                          return (
                            <Col md="4" key={index}>
                              <Card>
                                {product.photo && (
                                  <div style={{ height: "10rem" }}>
                                    <CardImg
                                      alt="..."
                                      src={product.tempPhoto}
                                      top
                                      className="p-4"
                                    />
                                  </div>
                                )}
                                <CardBody
                                  className="mt-0"
                                  style={{ height: "22rem" }}
                                >
                                  <Row>
                                    <Col align="center">
                                      <h4 className="mt-3 mb-1">
                                        Product Name
                                      </h4>
                                      <span className="text-md">
                                        {product.name}
                                      </span>
                                    </Col>
                                    <Col align="center">
                                      <h4 className="mt-3 mb-1">Category</h4>
                                      <span className="text-md">
                                        {product.category}
                                      </span>
                                    </Col>
                                    <Col align="center">
                                      <h4 className="mt-3 mb-1">Description</h4>
                                      <span className="text-md">
                                        {product.description}
                                      </span>
                                    </Col>
                                    <Col align="center">
                                      <h4 className="mt-3 mb-1">Quantity</h4>
                                      <span className="text-md">
                                        {product.quantity}
                                      </span>
                                    </Col>
                                    <Col align="center">
                                      <h4 className="mt-3 mb-1">
                                        Selling Price
                                      </h4>
                                      <span className="text-md">
                                        {product.sellingPrice}
                                      </span>
                                    </Col>
                                    <Col align="center">
                                      <h4 className="mt-3 mb-1">
                                        Discount Type
                                      </h4>
                                      <span className="text-md">
                                        {product.discountType}
                                      </span>
                                    </Col>
                                    <Col align="center">
                                      <h4 className="mt-3 mb-1">
                                        Discount Value
                                      </h4>
                                      <span className="text-md">
                                        {product.discountValue}
                                      </span>
                                    </Col>
                                    <Col align="center">
                                      <h4 className="mt-3 mb-1">Offer Price</h4>
                                      <span className="text-md">
                                        {product.offerPrice}
                                      </span>
                                    </Col>
                                  </Row>
                                </CardBody>
                              </Card>
                            </Col>
                          );
                        })}
                      </Row>
                    </Container>
                  </>
                )}
              </>
            )}
          </CardBody>
        </Card>
        <Modal
          className="modal-dialog-centered"
          isOpen={editing}
          toggle={() => setEditing(false)}
          size="lg"
        >
          <div className="modal-header">
            <h2 className="modal-title" id="modal-title-default">
              Edit Menu Item
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
            <Form className="mb-4" onSubmit={editProductSubmitHandler} >
              <CardBody>
                <Row md="4" className="d-flex justify-content-center mb-4">
                  <Col md="6">
                    <label
                      className="form-control-label"
                      htmlFor="example3cols2Input"
                    >
                      Product Image
                    </label>
                    <div className="custom-file">
                      <input
                        className="custom-file-input"
                        id="customFileLang"
                        lang="en"
                        type="file"
                        // onChange={handleFileChange("image")}
                        accept="image/*"
                      />
                      <label
                        className="custom-file-label"
                        htmlFor="customFileLang"
                      >
                        Select file
                      </label>
                    </div>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <Label
                      className="form-control-label"
                      htmlFor="example4cols2Input"
                    >
                      Product Name
                    </Label>
                    <Input
                      id="example4cols2Input"
                      placeholder="Name"
                      type="text"
                      onChange={handleChange("name")}
                      value={addProduct.name}
                      required
                    />
                  </Col>
                  <Col>
                    <Label
                      className="form-control-label"
                      htmlFor="exampleFormControlSelect3"
                    >
                      Product Description
                    </Label>
                    <Input
                      id="exampleFormControlSelect3"
                      type="textarea"
                      onChange={handleChange("description")}
                      value={addProduct.description}
                      required
                      placeholder="Description"
                    />
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <Label
                      className="form-control-label"
                      htmlFor="exampleFormControlSelect3"
                    >
                      Category
                    </Label>
                    <Input
                      id="exampleFormControlSelect3"
                      type="select"
                      onChange={handleChange("category")}
                      value={addProduct.category}
                      required
                    >
                      <option>Select Category</option>
                      {categoriesData &&
                        categoriesData.map((category) => {
                          return (
                            <option key={category._id} value={category._id}>
                              {category.name}
                            </option>
                          );
                        })}
                    </Input>
                  </Col>
                  <Col>
                    <Label
                      className="form-control-label"
                      htmlFor="exampleFormControlSelect3"
                    >
                      Quantity
                    </Label>
                    <Input
                      id="exampleFormControlSelect3"
                      type="number"
                      onChange={handleChange("quantity")}
                      value={addProduct.quantity}
                      required
                      placeholder="Quantity"
                    />
                  </Col>
                </Row>
                <Row className="mt-4">
                  <Col>
                    <Label
                      className="form-control-label"
                      htmlFor="exampleFormControlSelect3"
                    >
                      Selling Price
                    </Label>
                    <Input
                      id="exampleFormControlSelect3"
                      type="number"
                      onChange={handleChange("sellingPrice")}
                      value={addProduct.sellingPrice}
                      required
                      placeholder="Selling Price"
                      onBlur={discountHandler}
                    />
                  </Col>
                  <Col>
                    <Label
                      className="form-control-label"
                      htmlFor="example4cols2Input"
                    >
                      Discount Type
                    </Label>
                    <Input
                      id="example4cols2Input"
                      placeholder="Class"
                      type="select"
                      onChange={handleChange("discountType")}
                      value={addProduct.discountType}
                      required
                      onBlur={discountHandler}
                    >
                      <option value="">Select Type</option>
                      <option value="Flat Rate">Flat Rate</option>
                      <option value="Percentage">Percentage</option>
                    </Input>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <Label
                      className="form-control-label"
                      htmlFor="exampleFormControlSelect3"
                    >
                      Discount Value
                    </Label>
                    <Input
                      id="exampleFormControlSelect3"
                      type="number"
                      onChange={handleChange("discountValue")}
                      value={addProduct.discountValue}
                      required
                      onBlur={discountHandler}
                      placeholder="Discount Value"
                    />
                  </Col>
                  <Col>
                    <Label
                      className="form-control-label"
                      htmlFor="exampleFormControlSelect3"
                    >
                      Offer Price
                    </Label>
                    <Input
                      id="exampleFormControlSelect3"
                      type="number"
                      onChange={handleChange("offerPrice")}
                      value={addProduct.offerPrice}
                      required
                      disabled
                      placeholder="Offer Price"
                    />
                  </Col>
                </Row>
                <Row className="mt-4">
                  <Col md="3">
                    <Label
                      className="form-control-label"
                      htmlFor="example4cols2Input"
                    >
                      Publish
                    </Label>
                    <Input
                      id="example4cols2Input"
                      placeholder="Class"
                      type="select"
                      onChange={handleChange("publish")}
                      value={addProduct.publish}
                      required
                    >
                      <option value="">Publish</option>
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </Input>
                  </Col>
                </Row>
                <Row className="mt-4 float-right">
                  <Col>
                    <Button color="primary" type="submit">
                      Add Product
                    </Button>
                  </Col>
                </Row>
              </CardBody>
            </Form>
          )}
        </Modal>
      </Container>
    </>
  );
};

export default AllProducts;
