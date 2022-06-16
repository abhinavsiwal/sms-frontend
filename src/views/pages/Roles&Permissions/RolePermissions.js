import React, { useEffect, useState } from "react";
import Select from "react-select";
//ReactStrap Components
import {
  Card,
  CardHeader,
  CardBody,
  Container,
  Row,
  Col,
  Button,
  ListGroupItem,
  ListGroup,
  Input,
  Modal,
  ModalBody,
  ModalFooter,
  Table,
} from "reactstrap";
import Loader from "components/Loader/Loader";
import { Popconfirm, TimePicker } from "antd";
import "./RolePermissions.css";
import { isAuthenticated } from "api/auth";
// core components
import SimpleHeader from "components/Headers/SimpleHeader.js";
import { addRole, updateRole } from "api/rolesAndPermission";
import { getAllRoles } from "api/rolesAndPermission";
import { deleteRole } from "api/rolesAndPermission";
import { toast, ToastContainer } from "react-toastify";

function RolePermissions() {
  const [addRoleModal, setAddRoleModal] = React.useState(false);
  const [editRoleModal, setEditRoleModal] = useState(false);
  const [manageModal, setManageModal] = useState(false);
  const [modal2, setModal2] = React.useState(false);
  const [modal3, setModal3] = React.useState(false);
  const [role, setRole] = React.useState();
  const [editRole, setEditRole] = useState("");
  const [editRoleId, setEditRoleId] = useState("");
  const [permissionName, setPermissionName] = React.useState();
  const [applicationName, setApplicationName] = React.useState();
  const [mappingPermissions, setMappingPermissions] = useState({});
  const [mappingRoleName, setMappingRoleName] = useState("");
  const [mappingRoleId, setMappingRoleId] = useState("");
  const [mappingRoleMain, setMappingRoleMain] = useState("");
  const [roleName, setRoleName] = React.useState([
    "Super Admin",
    "Admin",
    "Field Engineers",
  ]);
  const [mappingLoading, setMappingLoading] = useState(false);
  const [addLoading, setAddLoading] = useState(false);
  const [allRoles, setAllRoles] = useState([]);
  const [checked, setChecked] = useState(false);
  // console.log(roleName);
  const { user } = isAuthenticated();
  const [Permissions, setPermissions] = React.useState([
    "Add",
    "View",
    "Edit",
    "Delete",
    "Export",
    "Import",
  ]);
  const [application, setApplication] = React.useState([
    "Pricing",
    "Owner",
    "Vendor",
    "Organization",
  ]);

  const [manageRolePermissions, setManageRolePermissions] = React.useState([
    "bshjb",
    "cnjdc",
    "jdnkjnc",
  ]);
  const [permissions2, setPermissions2] = useState([]);
  const roleOption = [
    {
      value: "add",
      label: "add",
    },
    {
      value: "view",
      label: "view",
    },
    {
      value: "edit",
      label: "edit",
    },
    {
      value: "delete",
      label: "delete",
    },
    {
      value: "export",
      label: "export",
    },

    {
      value: "import",
      label: "import",
    },
  ];

  useEffect(() => {
    getAllRolesHandler();
    // setMappingRoleName(allRoles[0].name)
  }, [reload, checked]);

  let permission1 = [];
  useEffect(() => {
    // console.log(user);
    if (user.permissions["Role and Permissions"]) {
      permission1 = user.permissions["Role and Permissions"];
      setPermissions2(permission1);
      // console.log(permission1);
    }
  }, [checked]);

  const [reload, setReload] = useState(1);
  const addRoleHandler = async () => {
    // console.log(role);
    const formData = new FormData();
    formData.set("name", role);
    formData.set("school", user.school);
    try {
      setAddLoading(false);
      const data = await addRole(user._id, formData);
      // console.log(data);
      setRole("");
      setAddRoleModal(false);
      setAddLoading(false);
      setChecked(!checked);
    } catch (err) {
      console.log(err);
      setAddLoading(false);
      toast.error("Add role failed.");
    }
  };

  const getAllRolesHandler = async () => {
    // console.log(user);
    try {
      setAddLoading(true);
      const data = await getAllRoles(user._id, user.school);
      // console.log(data);
      setAllRoles(data);
      setMappingRoleName(data[0].name);
      setMappingRoleId(data[0]._id);
      setAddLoading(false);
    } catch (err) {
      console.log(err);
      setAddLoading(false);
      toast.error("Getting Roles failed");
    }
  };

  const editRoleHandler = (role, roleId) => {
    setEditRoleModal(true);
    setEditRole(role);
    setEditRoleId(roleId);
  };

  const editRoleSubmit = async () => {
    try {
      const formData = new FormData();
      formData.set("name", editRole);
      setAddLoading(true);
      const data = await updateRole(user._id, editRoleId, formData);
      // console.log(data);
      setChecked(!checked);
      setEditRoleModal(false);
      setEditRole("");
      setEditRoleId("");
      setAddLoading(false);
    } catch (err) {
      setAddLoading(false);
      console.log(err);
      toast.error("Edit Failed");
    }
  };

  const deleteRoleHandler = async (roleId) => {
    try {
      setAddLoading(true);
      const data = await deleteRole(user._id, roleId);
      // console.log(data);
      setAddLoading(false);
      setChecked(!checked);
    } catch (err) {
      console.log(err);
      setAddLoading(false);
    }
  };

  const addPermissionName = () => {
    if (permissionName.length === 0) return;
    let arr = Permissions;
    arr.push(permissionName);
    setPermissions(arr);
    setPermissionName("");
    setModal3(false);
  };

  const addApplicationName = () => {
    if (applicationName.length === 0) return;
    let arr = application;
    arr.push(application);
    setApplication(arr);
    setApplicationName("");
    setModal2(false);
  };

  const managePermissonSubmit = async () => {
    // console.log(mappingRoleId);
    // console.log(mappingRoleMain);
    let selectedRole = allRoles.find((role) => role._id === mappingRoleId);
    // console.log(selectedRole.name);
    try {
      const formData = new FormData();
      // formData.set("permissions", JSON.stringify(mappingPermissions.obj));

      for (const key in mappingRoleMain.permissions) {
        var temp = mappingRoleMain.permissions[key];
        var permissionData = [];
        temp.map((per) => permissionData.push(per.value));
        mappingRoleMain.permissions[key] = permissionData;
      }
      // console.log(mappingRoleMain.permissions);
      formData.set("permissions", JSON.stringify(mappingRoleMain.permissions));
      setMappingLoading(true);
      const data = await updateRole(user._id, mappingRoleId, formData);
      if (data.err) {
        setMappingLoading(false);
        toast.error(data.err);
      } else {
        setChecked(!checked);
        setManageModal(false);
        setMappingPermissions([]);
        setMappingLoading(false);
        toast.success("Permission Added successfully");
        // window.location.reload(true)
        setMappingRoleMain("");
        // getAllRolesHandler();
      }
    } catch (err) {
      console.log(err);
      setMappingLoading(false);
      toast.error("Permission not Added ");
    }
  };

  const handleChangeRoleName = (e) => {
    if (e.target.key === "Enter") return;
    setRole(e.target.value);
  };

  const handleChangePermissionName = (e) => {
    if (e.target.key === "Enter") return;
    setPermissionName(e.target.value);
  };

  const handleChangeApplicationName = (e) => {
    if (e.target.key === "Enter") return;
    setApplicationName(e.target.value);
  };

  const handlePermissionChange = (name) => (value) => {
    // console.log(value);
    var data = mappingRoleMain;
    data.permissions[name] = value;
    setMappingRoleMain(data);
    if (reload === 1) {
      setReload(2);
    } else {
      setReload(1);
    }
    // setMappingPermissions({ ...mappingPermissions, ...obj });
  };

  const handleChangeRoleObject = async (e) => {
    if (e.target.value === "") {
      setMappingRoleMain("");
    } else {
      var data = JSON.parse(e.target.value);
      setMappingRoleId(data._id)
      if (data.permissions) {
        for (const key in data.permissions) {
          var temp = data.permissions[key];
          var permissionData = [];
          temp.map((per) => permissionData.push({ value: per, label: per }));
          data.permissions[key] = permissionData;
        }
        setMappingRoleMain(data);
        
      } else {
        data["permissions"] = {};
        setMappingRoleMain(data);
      }
    }
  };

  console.log(mappingRoleMain);

  return (
    <>
      <SimpleHeader name="Roles-Permissions" />
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
          {permissions2 && permissions2.includes("edit") && (
            <Col className="m-1">
              <Button
                color="primary"
                type="button"
                onClick={() => {
                  setManageModal(true);
                  setMappingRoleMain("");
                }}
              >
                Manage Role Permissions Mapping
              </Button>
            </Col>
          )}
        </Row>
        <Row className="d-flex justify-content-between">
          <Col lg="4">
            <Card>
              <CardHeader>
                <div className="d-flex justify-content-between Role-Permissions">
                  <p>Manage Roles</p>
                  {permissions2 && permissions2.includes("add") && (
                    <Button
                      color="primary"
                      type="button"
                      onClick={() => setAddRoleModal(true)}
                    >
                      Add Roles
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardBody>
                <Col className="d-flex justify-content-between Role-Permissions">
                  <p>Role Name</p>
                  <p>Actions</p>
                </Col>

                {addLoading ? (
                  <Loader />
                ) : (
                  <ListGroup className="m-1">
                    {allRoles.map((role) => {
                      return (
                        <>
                          <ListGroupItem>
                            <Col className="d-flex justify-content-between">
                              <div>{role.name}</div>
                              <div className="d-flex justify-content-between">
                                {permissions2 && permissions2.includes("edit") && (
                                  <Button
                                    className="btn-sm pull-right"
                                    color="primary"
                                    type="button"
                                    onClick={() =>
                                      editRoleHandler(role.name, role._id)
                                    }
                                  >
                                    <i className="fas fa-user-edit" />
                                  </Button>
                                )}
                                {permissions2 &&
                                  permissions2.includes("delete") && (
                                    <Button
                                      className="btn-sm pull-right"
                                      color="danger"
                                      type="button"
                                    >
                                      <Popconfirm
                                        title="Sure to delete?"
                                        onConfirm={() =>
                                          deleteRoleHandler(role._id)
                                        }
                                      >
                                        <i className="fas fa-trash" />
                                      </Popconfirm>
                                    </Button>
                                  )}
                              </div>
                            </Col>
                          </ListGroupItem>
                        </>
                      );
                    })}
                  </ListGroup>
                )}
              </CardBody>
            </Card>
          </Col>

          <Col lg="4">
            <Card>
              <CardHeader>
                <div className="d-flex justify-content-between Role-Permissions">
                  <p>Manage Permissions</p>
                 
                </div>
              </CardHeader>
              <CardBody>
                <Col className="d-flex justify-content-between Role-Permissions">
                  <p>Permissions Name</p>
                  <p>Actions</p>
                </Col>
                <Col md="6">
                  <Input
                    id="example4cols2Input"
                    placeholder="Permission Name"
                    type="text"
                    // onChange={handleChange("abbreviation")}
                    required
                  />
                </Col>
                <ListGroup className="m-1">
                  {Permissions.map((Permissions) => {
                    return (
                      <>
                        <ListGroupItem>
                          <Col className="d-flex justify-content-between">
                            <div>{Permissions}</div>
                    
                          </Col>
                        </ListGroupItem>
                      </>
                    );
                  })}
                </ListGroup>
              </CardBody>
            </Card>
          </Col>

          <Col lg="4">
            <Card>
              <CardHeader>
                <div className="d-flex justify-content-between Role-Permissions">
                  <p>Manage Applications</p>

                </div>
              </CardHeader>
              <CardBody>
                <Col className="d-flex justify-content-between Role-Permissions">
                  <p>Applications Name</p>
                  <p>Actions</p>
                </Col>
                <Col md="6">
                  <Input
                    id="example4cols2Input"
                    placeholder="Application Name"
                    type="text"
                    // onChange={handleChange("abbreviation")}
                    required
                  />
                </Col>
                <ListGroup id="mainApplicationDiv" className="m-1">
                  {user &&
                    user.module &&
                    user.module.map((application) => {
                      return (
                        <>
                          <ListGroupItem>
                            <Col className="d-flex justify-content-between">
                              <div>{application}</div>
                            
                            </Col>
                          </ListGroupItem>
                        </>
                      );
                    })}
                </ListGroup>
              </CardBody>
            </Card>
          </Col>
        </Row>
        {/* Edit role modal */}
        <Modal
          className="modal-dialog-centered"
          isOpen={editRoleModal}
          toggle={() => setEditRoleModal(false)}
          size="sm"
        >
          <div className="modal-header">
            <h2 className="modal-title" id="modal-title-default">
              Role Name
            </h2>
            <button
              aria-label="Close"
              className="close"
              data-dismiss="modal"
              type="button"
              onClick={() => setEditRoleModal(false)}
            >
              <span aria-hidden={true}>×</span>
            </button>
          </div>
          <ModalBody>
            <Row>
              <Col>
                <label className="form-control-label">Role Name</label>
                <Input
                  id="form-department-name"
                  onChange={(e) => setEditRole(e.target.value)}
                  value={editRole}
                  placeholder="Role Name"
                  type="text"
                  required
                />
              </Col>
            </Row>
          </ModalBody>
          <ModalFooter>
            <Button color="success" type="button" onClick={editRoleSubmit}>
              Edit Role
            </Button>
          </ModalFooter>
        </Modal>
        {/* Mangae role modal */}
        <Modal
          // className="modal-dialog-centered"
          isOpen={manageModal}
          toggle={() => setManageModal(false)}
          size="lg"
          // className="custom-modal-style"
          scrollable
        >
          <div className="modal-header">
            <h2 className="modal-title" id="modal-title-default">
              Role Permissions Mapping
            </h2>
            <Input
              id="example4cols2Input"
              type="select"
              // onChange={handleChange("class")}
              required
              onChange={handleChangeRoleObject}
            >
              <option selected value="">
                Select Role
              </option>
              {allRoles?.map((role, index) => (
                <option key={index} value={JSON.stringify(role)}>
                  {role.name}
                </option>
              ))}
            </Input>
            <button
              aria-label="Close"
              className="close"
              data-dismiss="modal"
              type="button"
              onClick={() => setManageModal(false)}
            >
              <span aria-hidden={true}>×</span>
            </button>
          </div>
          {mappingLoading ? (
            <Loader />
          ) : (
            mappingRoleMain &&
            mappingRoleMain !== "" && (
              <>
                <ModalBody>
                  <Table>
                    <tbody>
                      {user.module.map((module, index) => (
                        <tr key={index + 12}>
                          <td className="mt-4">{module}</td>
                          <td>
                            {mappingRoleMain.permissions &&
                            mappingRoleMain.permissions[module] ? (
                              <Select
                                isMulti
                                name="permissions"
                                options={roleOption}
                                value={mappingRoleMain.permissions[module]}
                                onChange={handlePermissionChange(module)}
                                className="basic-multi-select "
                                classNamePrefix="select"
                              />
                            ) : (
                              <Select
                                isMulti
                                name="permissions"
                                options={roleOption}
                                onChange={handlePermissionChange(module)}
                                className="basic-multi-select "
                                classNamePrefix="select"
                              />
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </ModalBody>
                <ModalFooter>
                  <Button
                    color="success"
                    type="button"
                    onClick={managePermissonSubmit}
                  >
                    Submit
                  </Button>
                </ModalFooter>
              </>
            )
          )}
        </Modal>
        {/* Add roles model */}
        <Modal
          className="modal-dialog-centered"
          isOpen={addRoleModal}
          toggle={() => setAddRoleModal(false)}
          size="sm"
        >
          <div className="modal-header">
            <h2 className="modal-title" id="modal-title-default">
              Role Name
            </h2>
            <button
              aria-label="Close"
              className="close"
              data-dismiss="modal"
              type="button"
              onClick={() => setAddRoleModal(false)}
            >
              <span aria-hidden={true}>×</span>
            </button>
          </div>
          <ModalBody>
            <Row>
              <Col>
                <label className="form-control-label">Role Name</label>
                <Input
                  id="form-department-name"
                  onChange={handleChangeRoleName}
                  placeholder="Role Name"
                  type="text"
                  required
                />
              </Col>
            </Row>
          </ModalBody>
          <ModalFooter>
            <Button color="success" type="button" onClick={addRoleHandler}>
              Add Role
            </Button>
          </ModalFooter>
        </Modal>

        <Modal
          className="modal-dialog-centered"
          isOpen={modal3}
          toggle={() => setModal3(false)}
          size="sm"
        >
          <div className="modal-header">
            <h2 className="modal-title" id="modal-title-default">
              {modal3 ? "Permission Name" : ""}
            </h2>
            <button
              aria-label="Close"
              className="close"
              data-dismiss="modal"
              type="button"
              onClick={() => setModal3(false)}
            >
              <span aria-hidden={true}>×</span>
            </button>
          </div>
          <ModalBody>
            <Row>
              <Col>
                <label className="form-control-label">Permission Name</label>
                <Input
                  id="form-department-name"
                  onChange={handleChangePermissionName}
                  placeholder="Permission Name"
                  type="text"
                />
              </Col>
            </Row>
          </ModalBody>
          <ModalFooter>
            <Button color="success" type="button" onClick={addPermissionName}>
              Add Permission
            </Button>
          </ModalFooter>
        </Modal>

        <Modal
          className="modal-dialog-centered"
          isOpen={modal2}
          toggle={() => setModal2(false)}
          size="sm"
        >
          <div className="modal-header">
            <h2 className="modal-title" id="modal-title-default">
              {modal2 ? "Application Name" : ""}
            </h2>
            <button
              aria-label="Close"
              className="close"
              data-dismiss="modal"
              type="button"
              onClick={() => setModal2(false)}
            >
              <span aria-hidden={true}>×</span>
            </button>
          </div>
          <ModalBody>
            <Row>
              <Col>
                <label className="form-control-label">Application Name</label>
                <Input
                  id="form-department-name"
                  onChange={handleChangeApplicationName}
                  placeholder="Application Name"
                  type="text"
                />
              </Col>
            </Row>
          </ModalBody>
          <ModalFooter>
            <Button color="success" type="button" onClick={addApplicationName}>
              Add Application
            </Button>
          </ModalFooter>
        </Modal>
      </Container>
    </>
  );
}

export default RolePermissions;
