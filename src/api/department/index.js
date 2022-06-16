import { sendRequest } from "api/api";

export const addDepartment = (userId, token, data) => {
  const url = `${process.env.REACT_APP_API_URL}/api/department/create/${userId}`;
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

export const updateDepartment = (departmentId, userId, token, data) => {
  const url = `${process.env.REACT_APP_API_URL}/api/department/edit/${departmentId}/${userId}`;
  return fetch(url, {
    method: "PUT",
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

export const getDepartment = (schoolId, userId, token) => {
  const url = `${process.env.REACT_APP_API_URL}/api/department/all/${schoolId}/${userId}`;
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

export const deleteDepartment = (departmentId, userId, token) => {
  const url = `${process.env.REACT_APP_API_URL}/api/department/delete/${departmentId}/${userId}`;
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
};

export const departmentHead=(departmentId,userId,token,formData)=>{
  const url = `${process.env.REACT_APP_API_URL}/api/department/edit/${departmentId}/${userId}`;
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


export const getNonHeads=async(schoolId,adminId)=>{
  try {
    const {data} = await sendRequest(
      `${process.env.REACT_APP_API_URL}/api/school/staff/head/${schoolId}/${adminId}`
    );
    // console.log(data,"$$$$$$$$");
    return data;
  } catch (err) {
    console.log(err);
    throw err;
  }
}