import React, { useState, useEffect } from "react";
import {
  Card,
  CardBody,
  Button,
  Container,
  NavLink,
  Row,
  Col,
  Form,
  FormGroup,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
} from "reactstrap";
// nodejs library that concatenates classes
import classnames from "classnames";
// core components
import SimpleHeader from "components/Headers/SimpleHeader.js";
import { isAuthenticated } from "api/auth";
import "./Styles.css";
import Loader from "components/Loader/Loader";
import { toast } from "react-toastify";
// import Loader from "components/Loader/Loader";
import {
  canteenAdd,
  allCanteens,
  canteenDelete,
} from "../../../api/canteen/index";

function ViewAllCanteen() {
  const [viewCanteen, setViewCanteen] = React.useState([]);
  const [allCanteen, setAllCanteen] = useState([]);
  const [loading, setLoading] = React.useState(false);
  const [selectedCanteenId, setSelectedCanteenId] = useState();
  const [checked, setChecked] = useState(false);
  const [selectedCanteen, setSelectedCanteen] = useState({});
  const { user, token } = isAuthenticated();
  const [searchText, setSearchText] = useState("");
  const [canteenData, setCanteenData] = useState([]);
  const [count, setCount] = React.useState(0);
  // console.log("count", count);

  // const handleChange = (e, steps) => {
  //   setCount(steps);
  // };

  React.useEffect(() => {
    fetchStaff();
  }, [checked]);
  const fetchStaff = async () => {
    setLoading(true);
    const res = await allCanteens(user._id, user.school); // Call your function here
    console.log(res);
    await setAllCanteen(res);
    await setCanteenData(res);

    await setSelectedCanteenId(res[0]._id);
    setLoading(false);
  };

  const selectedStaff = (canteenId) => {
    // console.log(canteenId);
    setCheck(true);

    const canteen = allCanteen.find((canteen) => canteen._id === canteenId);
    // console.log(canteen);
    setSelectedCanteen(canteen);
  };

  const openSearch = () => {
    document.body.classList.add("g-navbar-search-showing");
    setTimeout(function () {
      document.body.classList.remove("g-navbar-search-showing");
      document.body.classList.add("g-navbar-search-show");
    }, 150);
    setTimeout(function () {
      document.body.classList.add("g-navbar-search-shown");
    }, 300);
  };
  // function that on mobile devices makes the search close
  const closeSearch = () => {
    document.body.classList.remove("g-navbar-search-shown");
    setTimeout(function () {
      document.body.classList.remove("g-navbar-search-show");
      document.body.classList.add("g-navbar-search-hiding");
    }, 150);
    setTimeout(function () {
      document.body.classList.remove("g-navbar-search-hiding");
      document.body.classList.add("g-navbar-search-hidden");
    }, 300);
    setTimeout(function () {
      document.body.classList.remove("g-navbar-search-hidden");
    }, 500);
  };

  useEffect(() => {
    if (searchText === "") {
      setCanteenData(allCanteen);
      return;
    }
    const filteredData = allCanteen.filter((canteen) => {
      if (searchText === "") {
        return canteen;
      } else {
        return canteen.name.toLowerCase().includes(searchText);
      }
    });

    setCanteenData(filteredData);

    return () => {
      setCanteenData(allCanteen);
    };
  }, [searchText]);

  let inputHandler = (e) => {
    //convert input text to lower case
    var lowerCase = e.target.value.toLowerCase();
    setSearchText(lowerCase);
  };

  const [check, setCheck] = React.useState(false);
  return (
    <>
      <SimpleHeader name="Canteen" parentName="View All Canteen" />

      <div className="container-fluid search-container">
        <Form
          className={classnames(
            "navbar-search form-inline mr-sm-3 navbar-search-light"
          )}
        >
          <FormGroup className="mb-0">
            <InputGroup
              className="input-group-alternative input-group-merge"
              onChange={(e) => setSearchText(e.target.value.toLowerCase())}
            >
              <InputGroupAddon addonType="prepend">
                <InputGroupText>
                  <i className="fas fa-search" />
                </InputGroupText>
              </InputGroupAddon>
              <Input placeholder="Search" type="text" />
            </InputGroup>
          </FormGroup>
          <button
            aria-label="Close"
            className="close"
            type="button"
            onClick={closeSearch}
          >
            <span aria-hidden={true}>×</span>
          </button>
        </Form>
      </div>

      {loading ? (
        <Loader />
      ) : (
        <>
          {check === false && (
            <div className="mt--6s items">
              {canteenData ? (
                canteenData.map((canteen) => {
                  return (
                    <NavLink
                      key={canteen._id}
                      fluid
                      onClick={() => selectedStaff(canteen._id)}
                    >
                      <Card className="h-80 w-80">
                        <CardBody>
                          <Row>
                            <Col align="center">
                              <h4 className="mt-3 mb-1">Name</h4>
                              <span className="text-md">{canteen.name}</span>
                            </Col>
                          </Row>
                          <Row>
                            <Col align="center">
                              <h4 className="mt-3 mb-1">Staff</h4>
                              {canteen.staff?.map((staff) => (
                                <span className="text-md">
                                  {staff.firstname + " " + staff.lastname}
                                </span>
                              ))}
                            </Col>
                          </Row>
                        </CardBody>
                      </Card>
                    </NavLink>
                  );
                })
              ) : (
                <>
                  {allCanteen.map((canteen) => {
                    return (
                      <NavLink
                        key={canteen._id}
                        fluid
                        onClick={() => selectedStaff(canteen._id)}
                      >
                        <Card className="h-100 w-100">
                          <CardBody>
                            <p className="d-flex justify-content-around">
                              {canteen.name}
                            </p>
                          </CardBody>
                        </Card>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            fontSize: "1.2rem",
                          }}
                        >
                          {canteen.name}
                        </div>
                      </NavLink>
                    );
                  })}
                </>
              )}
            </div>
          )}
          {check && (
            <>
              <Card className="mt--6">
                <Row style={{ marginLeft: "2rem" }}>
                  <Col className="mt--3 ">
                    <Button
                      className="float-left mb-2"
                      color="dark"
                      onClick={() => setCheck(false)}
                    >
                      <i className="ni ni-bold-left"></i>
                    </Button>
                  </Col>
                </Row>
                <CardBody>
                  <img
                    className="Header-Image"
                    src="https://images.unsplash.com/photo-1606787366850-de6330128bfc?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxleHBsb3JlLWZlZWR8N3x8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=60"
                  />
                  <div className="Canteen-Name">
                    <h1>{selectedCanteen.name}</h1>
                  </div>

                  <div>
                    {selectedCanteen.menu.length === 0 ? (
                      <h3>No items found</h3>
                    ) : (
                      <Row>
                        {selectedCanteen.menu.map((item) => {
                          if (item.publish.toString() === "Yes") {
                            return (
                              <Col md={4}>
                                <Card>
                                  <CardBody>
                                    <Row>
                                      <Col md={6}>
                                        <h2 align="center" >{item.item}</h2>
                                        <img
                                          className="imgs"
                                          src={item?.tempPhoto}
                                          height="140"
                                          width="140"
                                        />
                                      </Col>
                                      <Col md={6} style={{borderLeft:"2px solid black"}} >
                                      <Row>
                                          <Col align="center">
                                            <h4 className="mt-3 mb-1">Price</h4>
                                            <span className="text-md">
                                              {item.price}
                                            </span>
                                          </Col>
                                        </Row>
                                        <Row>
                                          <Col align="center">
                                            <h4 className="mt-3 mb-1">From</h4>
                                            <span className="text-md">
                                              {item.start_time}
                                            </span>
                                          </Col>
                                          <Col align="center">
                                            <h4 className="mt-3 mb-1">To</h4>
                                            <span className="text-md">
                                              {item.end_time}
                                            </span>
                                          </Col>
                                        </Row>
                                     
                                      </Col>
                                    </Row>
                                  </CardBody>
                                </Card>
                              </Col>
                            );
                          }
                        })}
                      </Row>
                    )}
                  </div>
                </CardBody>
              </Card>
            </>
          )}
        </>
      )}
    </>
  );
}

export default ViewAllCanteen;
