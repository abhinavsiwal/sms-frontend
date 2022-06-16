import { sendRequestWithJson } from "api/api";
import { sendRequest } from "api/api";

export const addStaff = (userId, token, data = {}) => {
  const url = `${process.env.REACT_APP_API_URL}/api/school/staff/create/${userId}`;
  return fetch(url, {
    method: "POST",
    headers: { Authorization: "Bearer " + token, Accept: "application/json" },
    body: data,
  })
    .then((data) => {
      return data.json();
    })
    .catch((error) => {
      throw error;
    });
};

export const allStaffs = async (schoolId, adminId) => {
  try {
    const data = await sendRequestWithJson(
      `${process.env.REACT_APP_API_URL}/api/school/staff/all/${schoolId}/${adminId}`
    );
    // console.log(data,"$$$$$$$$");
    return data;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const addAttendance = () => {
  const url = `https://jsonplaceholder.typicode.com/todos/1`;
  return fetch(url, {
    method: "GET",
    headers: { Accept: "application/json", "Content-Type": "application/json" },
  })
    .then((data) => data.json())
    .then((data) => {
      // console.log("data", data);
      return data;
    })
    .catch((error) => {
      throw error;
    });
};

export const deleteStaff = async (staffId, id) => {
  // console.log(staffId,id);
  try {
    const data = await sendRequestWithJson(
      `${process.env.REACT_APP_API_URL}/api/school/staff/delete/${staffId}/${id}`,
      {},
      "DELETE"
    );
    // console.log(data);
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const updateStaff = async (staffId, id, formData) => {
  try {
    const { data } = await sendRequestWithJson(
      `${process.env.REACT_APP_API_URL}/api/school/staff/edit/${staffId}/${id}`,
      formData,
      "PUT"
    );
    // console.log(data);
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
export const updateStaff1 = async (staffId, id, formData) => {
  try {
    const { data } = await sendRequest(
      `${process.env.REACT_APP_API_URL}/api/school/staff/edit/${staffId}/${id}`,
      formData,
      "PUT"
    );
    // console.log(data);
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const getStaffByDepartment = async (schoolId, userId, formData) => {
  try {
    const { data } = await sendRequestWithJson(
      `${process.env.REACT_APP_API_URL}/api/school/staff/department/${schoolId}/${userId}`,
      formData,
      "POST"
    );
    console.log(data);
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const getStaffById = async (sId) => {
  try {
    const { data } = await sendRequest(
      `${process.env.REACT_APP_API_URL}/api/school/staff/search/${sId}`,
      {},
      "GET"
    );
    console.log(data);
    return data;
  } catch (err) {
    console.log(err);
  }
};
