
import { sendRequest } from "api/api";

export const addClass = (userId, token, data = {}) => {

  const url = `${process.env.REACT_APP_API_URL}/api/school/class/create/${userId}`;
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

export const allClass = (userId, schoolID, token) => {
  const url = `${process.env.REACT_APP_API_URL}/api/school/class/all/${schoolID}/${userId}`;
  return fetch(url, {
    method: "GET",
    headers: { Authorization: "Bearer " + token, Accept: "application/json" },
  })
    .then((data) => {
      return data.json();
    })
    .catch((error) => {
      throw error;
    });
};

export const updateClass=async(classId,userId,token,formData)=>{
  const url = `${process.env.REACT_APP_API_URL}/api/school/class/edit/${classId}/${userId}`;
  return fetch(url, {
    method: "PUT",
    headers: { Authorization: "Bearer " + token, Accept: "application/json" },
    body: formData,
  })
    .then((data) => {
      return data.json();
    })
    .catch((error) => {
      throw error;
    });
};

export const deleteClass=async(classId,userId,token)=>{
  const url = `${process.env.REACT_APP_API_URL}/api/school/class/delete/${classId}/${userId}`;
  return fetch(url, {
    method: "DELETE",
    headers: { Authorization: "Bearer " + token, Accept: "application/json" },
  })
    .then((data) => {
      return data.json();
    })
    .catch((error) => {
      throw error;
    });
}


export const assignClassTeacher=async(sectionId,userId,token,formData)=>{
  const url = `${process.env.REACT_APP_API_URL}/api/school/section/edit/${sectionId}/${userId}`;
 return fetch(url, {
    method: "PUT",
    headers: { Authorization: "Bearer " + token, Accept: "application/json" },
    body: formData,
  })
    .then((data) => {
      // console.log("data", data);
      return data.json();
    })
    .catch((error) => {
      throw error;
    });
}

export const nonClassTeachers = async(schoolId,adminId)=>{
  try {
    const {data} = await sendRequest(
      `${process.env.REACT_APP_API_URL}/api/school/staff/classTeacher/${schoolId}/${adminId}`
    );
    // console.log(data,"$$$$$$$$");
    return data;
  } catch (err) {
    console.log(err);
    throw err;
  }
}