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
  Modal,
  ModalBody,
  ModalFooter,
} from "reactstrap";
import { SearchOutlined } from "@ant-design/icons";
import Loader from "components/Loader/Loader";
import { ToastContainer, toast } from "react-toastify";
// core components
import { isAuthenticated } from "api/auth";
import SimpleHeader from "components/Headers/SimpleHeader.js";
import { Popconfirm } from "antd";
import { Table } from "ant-table-extensions";
import { createProduct } from "api/product";
import {
  addCategory,
  getAllCategories,
  deleteCategory,
  updateCategory,
} from "api/category";
function Addproduct() {
  //Value for image
  const [categoryLoading, setCategoryLoading] = useState(false);
  const [addCategoryLoading, setAddCategoryLoading] = useState(false);
  const [editCategoryLoading, setEditCategoryLoading] = useState(false);
  const [addProductLoading, setAddProductLoading] = useState(false);
  const [categoryName, setCategoryName] = useState("");
  const [categoryAbbv, setCategoryAbbv] = useState("");
  const [allCategories, setAllCategories] = useState([]);
  const [checked, setChecked] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editName, setEditName] = useState("");
  const [editAbbv, setEditAbbv] = useState("");
  const [editId, setEditId] = useState("");
  const [categoriesData, setCategoriesData] = useState([]);
  const [imagesPreview, setImagesPreview] = useState();
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
    publish:"",
  });
  const handleFileChange = (name) => (event) => {
    // formData.set(name, event.target.files[0]);
    // setAddMenu({ ...addMenu, [name]: event.target.files[0].name });
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.readyState === 2) {
        setImagesPreview(reader.result);
      }
    };
    reader.readAsDataURL(event.target.files[0]);
  };

  const handleChange = (name) => (event) => {
    setAddProduct({ ...addProduct, [name]: event.target.value });
  };

  const { user } = isAuthenticated();

  const columns = [
    {
      title: "Category Name",
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
      title: "Category Abbreviation",
      dataIndex: "abbreviation",
      width: "50%",
      align: "left",
      sorter: (a, b) => a.abbreviation > b.abbreviation,
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
      title: "Action",
      key: "action",
      align: "left",
      dataIndex: "action",
      fixed: "right",
    },
  ];

  useEffect(() => {
    getAllCategoriesHandler();
  }, [checked]);

  const getAllCategoriesHandler = async () => {
    try {
      setCategoryLoading(true);
      const data = await getAllCategories(user._id, user.school);
      console.log(data);
      if (data.err) {
        toast.error(data.err);
        setCategoryLoading(false);
        return;
      }
      setCategoriesData(data);
      let tableData = [];

      for (let i = 0; i < data.length; i++) {
        await tableData.push({
          key: i,
          name: data[i].name,
          abbreviation: data[i].abbreviation,
          action: (
            <h5 key={i + 1} className="mb-0">
              {/* {permission1 && permission1.includes("edit".trim()) && ( */}
              <Button
                className="btn-sm pull-right"
                color="primary"
                type="button"
                key={"edit" + i + 1}
                onClick={() => {
                  setEditing(true);
                  setEditName(data[i].name);
                  setEditAbbv(data[i].abbreviation);
                  setEditId(data[i]._id);
                }}
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
                  onConfirm={() => deleteCategoryHandler(data[i]._id)}
                >
                  <i className="fas fa-trash" />
                </Popconfirm>
              </Button>
              {/* )} */}
            </h5>
          ),
        });
      }

      setAllCategories(tableData);
      setCategoryLoading(false);
    } catch (err) {
      console.log(err);
      toast.error("Get Category Failed");
    }
  };

  const deleteCategoryHandler = async (categoryId) => {
    try {
      setCategoryLoading(true);
      const data = await deleteCategory(user._id, categoryId);
      console.log(data);
      if (data.err) {
        toast.error(data.err);
        setCategoryLoading(false);
        return;
      }
      toast.success("Category Deleted Successfully");
      setCategoryLoading(false);
      setChecked(!checked);
    } catch (err) {
      console.log(err);
      toast.error("Delete Category Failed");
      setCategoryLoading(false);
    }
  };

  const editCategoryHandler = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.set("name", editName);
    formData.set("abbreviation", editAbbv);
    formData.set("id", editId);
    try {
      setEditCategoryLoading(true);
      const data = await updateCategory(user._id, formData);
      console.log(data);
      if (data.err) {
        toast.error(data.err);
        setEditCategoryLoading(false);
        return;
      }
      setEditCategoryLoading(false);
      setEditing(false);
      setChecked(!checked);
      toast.success("Category Edited Successfully");
    } catch (err) {
      console.log(err);
      toast.error("Edit Category Failed");
      setEditCategoryLoading(false);
    }
  };

  const addCategoryHandler = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.set("name", categoryName);
    formData.set("abbreviation", categoryAbbv);
    formData.set("school", user.school);

    try {
      setAddCategoryLoading(true);
      const data = await addCategory(user._id, formData);
      console.log(data);
      if (data.err) {
        toast.error(data.err);
        setAddCategoryLoading(false);
        return;
      }
      toast.success("Category added successfully");
      setCategoryName("");
      setCategoryAbbv("");
      setAddCategoryLoading(false);
      setChecked(!checked);
    } catch (err) {
      console.log(err);
      toast.error("Add Category Failed");
      setAddCategoryLoading(false);
    }
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

  const addProductHandler = async (e) => {
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
try {
  setAddProductLoading(true);
  const data = await createProduct(user._id, formData);
  console.log(data);
  if (data.err) {
    toast.error(data.err);
    setAddProductLoading(false);
    return;
  }
  toast.success("Product added successfully");
  setAddProductLoading(false);
  setAddProduct({
    name: "",
    category: "",
    description: "",
    sellingPrice: "",
    offerPrice: "",
    discountType: "",
    discountValue: "",
    quantity: "",
    publish:"",

  })
} catch (err) {
  console.log(err);
  toast.error("Add Product Failed");
  setAddProductLoading(false);
}

  };

  return (
    <>
      <SimpleHeader name="Ecomme" parentName="Add Product" />
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
      <Container className="mt-6 mb-6" fluid>
        <Row>
          <Col lg="4">
            {addCategoryLoading ? (
              <Loader />
            ) : (
              <div className="card-wrapper">
                <Card>
                  <CardHeader>
                    <h3>Add Category</h3>
                  </CardHeader>
                  <CardBody>
                    <Form className="mb-4" onSubmit={addCategoryHandler}>
                      <Row>
                        <Col>
                          <label
                            className="form-control-label"
                            htmlFor="example4cols2Input"
                          >
                            Category
                          </label>
                          <Input
                            id="example4cols2Input"
                            placeholder="Category"
                            type="text"
                            onChange={(e) => setCategoryName(e.target.value)}
                            value={categoryName}
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
                            Category Abbreviation
                          </label>
                          <Input
                            id="example4cols2Input"
                            placeholder="Category Abbreviation"
                            type="text"
                            onChange={(e) => setCategoryAbbv(e.target.value)}
                            value={categoryAbbv}
                            required
                          />
                        </Col>
                      </Row>
                      <Row className="mt-4">
                        <Col
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            width: "100%",
                          }}
                        >
                          <Button color="primary" type="submit">
                            Submit
                          </Button>
                        </Col>
                      </Row>
                    </Form>
                  </CardBody>
                </Card>
              </div>
            )}
          </Col>
          <Col>
            <div className="card-wrapper">
              <Card>
                {categoryLoading ? (
                  <Loader />
                ) : (
                  <CardBody>
                    <Table
                      style={{ whiteSpace: "pre" }}
                      columns={columns}
                      dataSource={allCategories}
                      pagination={{
                        pageSizeOptions: ["5", "10", "30", "60", "100", "1000"],
                        showSizeChanger: true,
                      }}
                    />
                  </CardBody>
                )}
              </Card>
            </div>
          </Col>
        </Row>
      </Container>
      <Container className="mt--6" fluid>
        {addProductLoading ? (<Loader />):(
  <Row>
  <Col lg="12">
    <div className="card-wrapper">
      <Card>
        <CardHeader>
          <h3>Add Product</h3>
        </CardHeader>
        <Form className="mb-4" onSubmit={addProductHandler} >
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
            <Col md="3" >
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
      </Card>
    </div>
  </Col>
</Row>
        )}
      
        <Modal
          className="modal-dialog-centered"
          isOpen={editing}
          toggle={() => setEditing(false)}
          size="lg"
        >
          <div className="modal-header">
            <h2 className="modal-title" id="modal-title-default">
              Edit Category
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
          <ModalBody>
            <Row>
              <Col>
                <label className="form-control-label">Class Name</label>
                <Input
                  id="form-class-name"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  placeholder="Category Name"
                  type="text"
                />
              </Col>
            </Row>
            <Row>
              <Col>
                <label className="form-control-label">Abbreviation</label>
                <Input
                  id="form-abbreviation-name"
                  value={editAbbv}
                  onChange={(e) => setEditAbbv(e.target.value)}
                  placeholder="Abbreviation"
                  type="text"
                />
              </Col>
            </Row>
          </ModalBody>
          <ModalFooter>
            <Button color="success" type="button" onClick={editCategoryHandler}>
              Save changes
            </Button>
          </ModalFooter>
        </Modal>
      </Container>
    </>
  );
}

export default Addproduct;
