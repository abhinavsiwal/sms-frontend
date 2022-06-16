import { sendRequest } from "api/api";
import { sendRequestWithJson } from "api/api";

export const addStudent = (userId, token, data = {}) => {
  const url = `${process.env.REACT_APP_API_URL}/api/school/student/create/${userId}`;
  return fetch(url, {
    method: "POST",
    headers: { Authorization: "Bearer " + token, Accept: "application/json" },
    body: data,
  })
    .then((data) => {
      // console.log("stu", data);
      return data.json();
    })
    .catch((error) => {
      throw error;
    });
};

export const allStudents = (schoolId, userId, token, data = {}) => {
  const url = `${process.env.REACT_APP_API_URL}/api/school/student/all/${schoolId}/${userId}`;
  return fetch(url, {
    method: "GET",
    headers: {
      Authorization: "Bearer " + token,
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  })
    .then((data) => {
      return data.json();
    })
    .catch((error) => {
      throw error;
    });
};

export const deleteStudent = async (studentId, id) => {
  try {
    const data = await sendRequestWithJson(
      `${process.env.REACT_APP_API_URL}/api/school/student/delete/${studentId}/${id}`,
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

export const updateStudent = async (studentId, id, formData) => {
  try {
    const data = await sendRequest(
      `${process.env.REACT_APP_API_URL}/api/school/student/edit/${studentId}/${id}`,
      formData,
      "PUT"
    );

    // console.log(data);
    return data;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const isAuthenticateStudent = (userId, token, data) => {
  // console.log(data);
  const url = `${process.env.REACT_APP_API_URL}/api/school/student/parent/check/${userId}`;
  return fetch(url, {
    method: "POST",
    headers: {
      Authorization: "Bearer " + token,
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ type: data.type, email: data.email }),
  })
    .then((data) => {
      return data.json();
    })
    .catch((error) => {
      throw error;
    });
};


export const filterStudent=async(schoolId,userId,formData)=>{
  try {
    const {data} = await sendRequestWithJson(
      `${process.env.REACT_APP_API_URL}/api/school/student/custom/all/${schoolId}/${userId}`,
      JSON.stringify(formData),
      "POST"
    );
    // console.log(data);
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  } 
}