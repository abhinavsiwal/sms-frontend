import React from "react";
import { useState, useEffect } from "react";
// nodejs library that concatenates classes
import { Redirect, useHistory } from "react-router-dom";
import classnames from "classnames";
import "./styles.css";
// reactstrap components
import {
  Alert,
  Button,
  Card,
  CardBody,
  FormGroup,
  Form,
  Input,
  InputGroupAddon,
  InputGroupText,
  InputGroup,
  Row,
  Col,
  CardTitle,
  Label,
} from "reactstrap";
import { adminLogin, staffLogin, studentLogin } from "api/login";
import validator from "validator";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../../../store/reducers/auth";
import {
  setToken,
  setExpiry,
  setUserDetails,
  setError,
} from "../../../store/reducers/auth";
import { ToastContainer, toast } from "react-toastify";
import { loginSuccess } from "constants/success";
import { loginError } from "constants/errors";
// // core components
// import AuthHeader from "components/Headers/AuthHeader.js";

function Login() {
  const dispatch = useDispatch();
  const history = useHistory();
  const [errormsg, setErrormsg] = useState("");
  const [redirect, setRedirect] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [focusedEmail, setfocusedEmail] = useState(false);
  const [focusedPassword, setfocusedPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { loading, error, token } = useSelector((state) => state.authReducer);

  useEffect(() => {
    if (!localStorage.getItem("persist:root")) {
      console.log("here");
      dispatch(setToken(""));
      dispatch(setExpiry(""));
      dispatch(setUserDetails({}));
      setError("");
      return;
    }

    if (token) {
      // console.log(token);
      // console.log("Login");
      toast.success(loginSuccess);
      dispatch(setError(""));
      // console.log("logged in");
      setRedirect(true);
    }
  }, [token]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(setError(""));
    }
  }, [error]);

  useEffect(() => {
    return () => {
      dispatch(setError(""));
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    // console.log(username, password);
    await dispatch(login({ username, password }));
    setIsLoading(false);
  };

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
      {redirect ? <Redirect to="/admin/dashboard" /> : null}
      <div className="login-container">
        <Row className="login-page-container">
          <Col className="login-pic-container">
            <div className="pic-card">
              <img
                className="login-picture"
                src={require("../../../assets/img/theme/login-pic.jpg").default}
                alt=""
              />
            </div>
          </Col>
          <Col lg="5" md="7" className="login-form-container">
            <Card
              className="border-0 mb-0 login-card "
              style={{ color: "black" }}
            >
              <CardTitle className="d-flex justify-content-center h1">
                Log In
              </CardTitle>
              <CardBody className="">
                <Form role="form" onSubmit={handleSubmit}>
                  <label
                    className="form-control-label"
                    htmlFor="example4cols2Input"
                  >
                    Email
                  </label>
                  <FormGroup
                    className={classnames("mb-3", {
                      focused: focusedEmail,
                    })}
                  >
                    <InputGroup className="input-group-merge input-group-alternative">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="ni ni-email-83" />
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input
                        placeholder="Email or Username"
                        type="text"
                        onFocus={() => setfocusedEmail(true)}
                        onBlur={() => setfocusedEmail(true)}
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        style={{ color: "black !important" }}
                      />
                    </InputGroup>
                  </FormGroup>
                  <label
                    className="form-control-label"
                    htmlFor="example4cols2Input"
                  >
                    Password
                  </label> 
                  <FormGroup
                    className={classnames("mb-3", {
                      focused: focusedPassword,
                    })}
                  >
                    <InputGroup className="input-group-merge input-group-alternative">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="ni ni-lock-circle-open" />
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input
                        placeholder="Password"
                        type={showPassword ? "text" : "password"}
                        onFocus={() => setfocusedPassword(true)}
                        onBlur={() => setfocusedPassword(true)}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                      <InputGroupAddon addonType="append">
                        {showPassword ? (
                          <InputGroupText
                            style={{ cursor: "pointer" }}
                            onClick={() => setShowPassword(false)}
                          >
                            <i className="fa fa-eye-slash" />
                          </InputGroupText>
                        ) : (
                          <InputGroupText
                            style={{ cursor: "pointer" }}
                            onClick={() => setShowPassword(true)}
                          >
                            <i className="fa fa-eye" />
                          </InputGroupText>
                        )}
                      </InputGroupAddon>
                    </InputGroup>
                  </FormGroup>
                  {errormsg ? <Alert color="danger">{errormsg}</Alert> : null}
                  <div className="custom-control custom-control-alternative custom-checkbox">
                    <input
                      className="custom-control-input"
                      id=" customCheckLogin"
                      type="checkbox"
                    />
                    <label
                      className="custom-control-label"
                      htmlFor=" customCheckLogin"
                    >
                      <span className="h4">Remember me</span>
                    </label>
                  </div>
                  <div className="text-center">
                    <Button
                      className="my-4"
                      color="info"
                      type="submit"
                      style={{ padding: "0.5rem 3.5rem", borderRadius: "10px" }}
                    >
                      {isLoading ? (
                        <React.Fragment>
                          <span
                            className="spinner-border spinner-border-sm"
                            role="status"
                            aria-hidden="true"
                          ></span>
                          {/* <span className="visually-hidden">Loading...</span> */}
                        </React.Fragment>
                      ) : (
                        <React.Fragment>
                          <i className="ci-user me-2 ms-n1"></i>
                          Login
                        </React.Fragment>
                      )}
                    </Button>
                  </div>
                </Form>
              </CardBody>
            </Card>
            <Row>
              {/* <Col
                style={{
                  display: "flex",
                  justifyContent: "center",
                  width: "100%",
                }}
              >
                <a
                  className="text-light"
                  href="#pablo"
                  onClick={(e) => e.preventDefault()}
                >
                  <small style={{ color: "white" }}>Forgot password?</small>
                </a>
              </Col> */}
              {/* <Col className="text-right" xs="6">
                <a
                  className="text-light"
                  href="#pablo"
                  onClick={(e) => e.preventDefault()}
                >
                  <small>Create new account</small>
                </a>
              </Col> */}
            </Row>
          </Col>
        </Row>
      </div>
    </>
  );
}

export default Login;
