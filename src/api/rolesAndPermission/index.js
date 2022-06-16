import { sendRequest } from "api/api";

export const getAllRoles = async (userId, schoolId) => {
  try {
    const {data} = await sendRequest(
      `${process.env.REACT_APP_API_URL}/api/school/role/all/${schoolId}/${userId}`
    );
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const addRole = async (userId, formData) => {
  try {
    const data = await sendRequest(
      `${process.env.REACT_APP_API_URL}/api/school/role/create/${userId}`,
      formData,
      "POST"
    );
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const updateRole = async (userId, roleId, formData) => {
  try {
    const {data} = await sendRequest(
      `${process.env.REACT_APP_API_URL}/api/school/role/edit/${roleId}/${userId}`,
      formData,
      "PUT"
    );
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const deleteRole = async (userId, roleId) => {
  try {
    const {data} = await sendRequest(
      `${process.env.REACT_APP_API_URL}/api/school/role/delete/${roleId}/${userId}`,{},
      "DELETE"
    );
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
