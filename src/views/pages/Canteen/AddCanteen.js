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
} from "reactstrap";
import Loader from "components/Loader/Loader";
//React Datepicker
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { isAuthenticated } from "api/auth";
//css
import "./Styles.css";

// core components
import SimpleHeader from "components/Headers/SimpleHeader.js";
import TextArea from "antd/lib/input/TextArea";

// import moment Library
import moment from "moment";
import { allStaffs } from "api/staff";
//React-Select
import Select from "react-select";
import { useHistory } from "react-router-dom";
import { canteenAdd, allCanteens, menuAdd } from "../../../api/canteen/index";
import { toast, ToastContainer } from "react-toastify";
import { fetchingStaffFailed } from "constants/errors";
import { fetchingCanteenError } from "constants/errors";
import { addCanteenError } from "constants/errors";

import FixRequiredSelect from "../../../components/FixRequiredSelect";
import BaseSelect from "react-select";

function AddCanteen() {
  const history = useHistory();
  const [startDate, setStartDate] = React.useState(new Date());
  const startDuration = moment(startDate).format("LT");
  // console.log("start", startDuration);
  const [endDate, setEndDate] = React.useState(new Date());
  const endDuration = moment(endDate).format("LT");
  const [allStaff, setAllStaff] = useState([]);
  const { user } = isAuthenticated();
  const [roleOptions, setRoleOptions] = useState([]);
  const [canteenName, setCanteenName] = useState("");
  const [allCanteen, setAllCanteen] = useState([]);
  const [checked, setChecked] = useState(false);
  const [file, setFile] = useState();
  const [imagesPreview, setImagesPreview] = useState();
  // import { useHistory } from "react-router-dom";

  const [canteenLoading, setCanteenLoading] = useState(false);
  const [menuLoading, setMenuLoading] = useState(false);

  const fileReader = new FileReader();

  const handleOnChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleOnSubmit = (e) => {
    e.preventDefault();

    if (file) {
      fileReader.onload = function (event) {
        const csvOutput = event.target.result;
      };

      fileReader.readAsText(file);
    }
  };

  let permissions = [];
  useEffect(() => {
    if (user.permissions["Canteen Management"]) {
      permissions = user.permissions["Canteen Management"];
      // console.log(permissions);
    }
  }, []);



  const getAllStaffs = async () => {
    try {
      const { data } = await allStaffs(user.school, user._id);
      console.log(data);
      let canteenStaff = data.filter((staff) => staff.assign_role.name === "Canteen");
      setAllStaff(canteenStaff);
      let options = [];
      for (let i = 0; i < canteenStaff.length; i++) {
        options.push({ value: data[i]._id, label: data[i].firstname });
      }
      // console.log(options);
      setRoleOptions(options);
    } catch (err) {
      console.log(err);
      toast.error(fetchingStaffFailed);
    }
  };

  const getAllCanteens = async () => {
    try {
      let data = await allCanteens(user._id, user.school);
      // console.log(data);
      setAllCanteen(data);
    } catch (err) {
      console.log(err);
      toast.error(fetchingCanteenError);
    }
  };

  useEffect(() => {
    getAllStaffs();
    // console.log(allStaff);
  }, []);

  // console.log(roleOptions);
  // console.log("end", endDuration);

  useEffect(() => {
    getAllCanteens();
  }, [checked]);

  const [addCanteen, setAddCanteen] = React.useState({
    canteenName: "",
  });
  // console.log("addCanteen", addCanteen);
  const [selectedCanteenId, setSelectedCanteenId] = useState("");
  // console.log(selectedCanteenId);
  const [addMenu, setAddMenu] = React.useState({
    image: "",
    items: "",
    description: "",
    price: "",
    publish: "",
    addCanteen: "",
  });
  // console.log("addMenu", addMenu);

  const addCanteenFormData = new FormData();

  //Values of Staff
  const handleStaffChange = (e) => {
    var value = [];
    for (var i = 0, l = e.length; i < l; i++) {
      value.push(e[i].value);
    }
    // console.log(value);
    addCanteenFormData.set("staff", JSON.stringify(value));
  };

  //Add Canteen
  const addCanteenHandler = async (e) => {
    e.preventDefault();
    addCanteenFormData.set("name", canteenName);
    addCanteenFormData.set("school", user.school);
    try {
      setCanteenLoading(true);
      const data = await canteenAdd(user._id, addCanteenFormData);
      // console.log(data);
      if (data.err) {
        setCanteenLoading(false);
        return toast.error(data.err);
      } else {
        setCanteenName("");
        toast.success("Canteen Added Successfully");
        setCanteenLoading(false);
        setChecked(!checked);
      }
    } catch (err) {
      setCanteenLoading(false);
      toast.error(addCanteenError);
    }
  };

  //values of addMenu
  const handleChangeMenu = (name) => (event) => {
    setAddMenu({ ...addMenu, [name]: event.target.value });
  };

  //Value for image
  const handleFileChange = (name) => (event) => {
    setAddMenu({ ...addMenu, [name]: event.target.files[0] });
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.readyState === 2) {
        setImagesPreview(reader.result);
      }
    };
    reader.readAsDataURL(event.target.files[0]);
  };

  //AddMenu
  const addMenuHandler = async (e) => {
    e.preventDefault();
    let formData = new FormData();
    formData.set("school", user.school);
    formData.set("item", addMenu.items);
    formData.set("image", addMenu.image);
    formData.set("description", addMenu.description);
    formData.set("start_time", startDuration);
    formData.set("end_time", endDuration);
    formData.set("price", addMenu.price);
    formData.set("publish", addMenu.publish);
    formData.set("canteen", selectedCanteenId);

    try {
      setMenuLoading(true);
      let data = await menuAdd(user._id, formData);
      if (data.err) {
        setMenuLoading(false);
        return toast.error(data.err);
      }
      toast.success("Menu Added Successfully");
      setMenuLoading(false);
      setAddMenu({
        image: "",
        items: "",
        addCanteen: "",
        description: "",
        price: "",
        publish: "",
      });
      history.push("/admin/view-canteen");
    } catch (err) {
      toast.error(addCanteenError);
      setMenuLoading(false);
    }
  };

  const Select = (props) => (
    <FixRequiredSelect
      {...props}
      SelectComponent={BaseSelect}
      options={props.options}
    />
  );

  const handleCanteen = (e) => {
    addMenu.addCanteen = e.target.value;
    setSelectedCanteenId(e.target.value);
  };

  const filterPassedTime = (time)=>{
    const currentDate = new Date(startDate);
    const selectedDate = new Date(time);

    return currentDate.getTime()<selectedDate.getTime();

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
      <SimpleHeader name="Canteen" parentName="Add Canteen" />
      <Container className="mt--6" fluid>
        <Row>
          <Col lg="4">
            {canteenLoading ? (
              <Loader />
            ) : (
              <div className="card-wrapper">
                <Card>
                  <CardHeader>
                    <h3>Add Canteen</h3>
                  </CardHeader>
                  <Row>
                    <Col className="d-flex justify-content-center mt-3 ml-4 ">
                      <form>
                        <input
                          type={"file"}
                          id={"csvFileInput"}
                          accept={".csv"}
                          onChange={handleOnChange}
                        />

                        <Button
                          onClick={(e) => {
                            handleOnSubmit(e);
                          }}
                          color="primary"
                          className="mt-2"
                        >
                          IMPORT CSV
                        </Button>
                      </form>
                    </Col>
                  </Row>
                  <Form className="mb-4" onSubmit={addCanteenHandler}>
                    <CardBody>
                      <Row>
                        <Col>
                          <Label
                            className="form-control-label"
                            htmlFor="example4cols2Input"
                          >
                            Canteen Name
                          </Label>
                          <Input
                            id="example4cols2Input"
                            placeholder="Canteen Name"
                            type="text"
                            onChange={(e) => setCanteenName(e.target.value)}
                            value={canteenName}
                            required
                          />
                        </Col>
                      </Row>
                      <Row className="mt-4">
                        <Col>
                          <Label
                            className="form-control-label"
                            htmlFor="xample-date-input"
                          >
                            Select Staff Member
                          </Label>
                          <Select
                            isMulti
                            name="colors"
                            options={roleOptions}
                            onChange={handleStaffChange}
                            className="basic-multi-select"
                            classNamePrefix="select"
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
                            Add
                          </Button>
                        </Col>
                      </Row>
                    </CardBody>
                  </Form>
                </Card>
              </div>
            )}
          </Col>

          <Col lg="8">
            {menuLoading ? (
              <Loader />
            ) : (
              <div className="card-wrapper">
                <Card>
                  <CardHeader>
                    <h3>Add Menu</h3>
                  </CardHeader>
                  <Form className="mb-4" onSubmit={addMenuHandler}>
                    <CardBody>
                      <Row
                        md="4"
                        className="d-flex justify-content-center mb-4"
                      >
                         <img
                        src={imagesPreview && imagesPreview}
                        alt="Preview"
                        className="mt-3 me-2"
                        width="80"
                        height="80"
                      />
                        <Col md="6">
                          <label
                            className="form-control-label"
                            htmlFor="example3cols2Input"
                          >
                            Upload Image
                          </label>
                          <div className="custom-file">
                            <input
                              className="custom-file-input"
                              id="customFileLang"
                              lang="en"
                              type="file"
                              onChange={handleFileChange("image")}
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
                        <Col md="6">
                          <Label
                            className="form-control-label"
                            htmlFor="example4cols2Input"
                          >
                            Items Name
                          </Label>
                          <Input
                            id="example4cols2Input"
                            placeholder="Name"
                            type="text"
                            onChange={handleChangeMenu("items")}
                            value={addMenu.items}
                            required
                          />
                        </Col>
                        <Col md="6">
                          <Label
                            className="form-control-label"
                            htmlFor="exampleFormControlSelect3"
                          >
                            Add Canteen
                          </Label>
                          <Input
                            id="exampleFormControlSelect3"
                            type="select"
                            onChange={handleCanteen}
                            value={addMenu.addCanteen}
                            required
                          >
                            <option value="" selected>
                              Select Canteen
                            </option>
                            {allCanteen.map((canteen) => {
                              return (
                                <option
                                  key={canteen._id}
                                  value={canteen._id}
                                  selected
                                >
                                  {canteen.name}
                                </option>
                              );
                            })}
                          </Input>
                        </Col>
                      </Row>
                      <Row className="mt-4">
                        <Col md="6">
                          <Label
                            className="form-control-label"
                            htmlFor="example4cols2Input"
                          >
                            Price
                          </Label>
                          <Input
                            id="example4cols2Input"
                            placeholder="Price"
                            type="Number"
                            onChange={handleChangeMenu("price")}
                            value={addMenu.price}
                            required
                          />
                        </Col>
                        <Col md="6">
                          <Label
                            className="form-control-label"
                            htmlFor="exampleFormControlSelect3"
                          >
                            Publish
                          </Label>
                          <Input
                            id="exampleFormControlSelect3"
                            type="select"
                            onChange={handleChangeMenu("publish")}
                            value={addMenu.publish}
                            required
                          >
                            <option value="" disabled selected>
                              Publish
                            </option>
                            <option>Yes</option>
                            <option>No</option>
                          </Input>
                        </Col>
                      </Row>
                      <Row className="mt-4">
                        <Col md="3">
                          <Label
                            className="form-control-label"
                            htmlFor="xample-date-input"
                          >
                            From
                          </Label>
                          <DatePicker
                            id="exampleFormControlSelect3"
                            className="Period-Time"
                            selected={startDate}
                            onChange={(date) => setStartDate(date)}
                            showTimeSelect
                            showTimeSelectOnly
                            timeIntervals={15}
                            timeCaption="Time"
                            dateFormat="h:mm aa"
                            required
                          />
                        </Col>
                        <Col md="3">
                          <Label
                            className="form-control-label"
                            htmlFor="example-date-input"
                          >
                            To
                          </Label>
                          <DatePicker
                            id="exampleFormControlSelect3"
                            className="Period-Time"
                            selected={endDate}
                            onChange={(date) => setEndDate(date)}
                            showTimeSelect
                            showTimeSelectOnly
                            timeIntervals={15}
                            timeCaption="Time"
                            dateFormat="h:mm aa"
                            required
                            filterTime={filterPassedTime}
                          />
                        </Col>
                        <Col md="6">
                          <Label
                            className="form-control-label"
                            htmlFor="example4cols2Input"
                          >
                            Description
                          </Label>
                          <TextArea
                            id="example4cols2Input"
                            placeholder="Description"
                            type="Number"
                            onChange={handleChangeMenu("description")}
                            required
                            value={addMenu.description}
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
                            Add Menu
                          </Button>
                        </Col>
                      </Row>
                    </CardBody>
                  </Form>
                </Card>
              </div>
            )}
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default AddCanteen;
