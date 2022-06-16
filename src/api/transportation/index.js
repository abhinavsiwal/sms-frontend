import { sendRequest } from "../api";

export const routeAdd = async (userId, formData) => {
  const url = `${process.env.REACT_APP_API_URL}/api/school/transportation/create/${userId}`;
  try {
    const { data } = await sendRequest(url, formData, "POST");
    // console.log(data);
    return data;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const routesAll = async (userId, schoolId) => {
  const url = `${process.env.REACT_APP_API_URL}/api/school/transportation/all/${schoolId}/${userId}`;

  try {
    const { data } = await sendRequest(url);
    // console.log(data);
    return data;
  } catch (err) {
    console.log(err);
    throw new err();
  }
};

export const deleteRoute = async (userId, routeId) => {
  const url = `${process.env.REACT_APP_API_URL}/api/school/transportation/delete/${routeId}/${userId}`;

  try {
    const { data } = await sendRequest(url, {}, "DELETE");
    // console.log(data);
    return data;
  } catch (err) {
    console.log(err);
    throw new err();
  }
};

export const editRoute = async (userId, routeId, formData) => {
  const url = `${process.env.REACT_APP_API_URL}/api/school/transportation/edit/${routeId}/${userId}`;
  try {
    const { data } = await sendRequest(url, formData, "PUT");
    // console.log(data);
    return data;
  } catch (err) {
    console.log(err);
    throw new err();
  }
};

export const editStop = async (userId, routeId, formData) => {
  try {
    const { data } = await sendRequest(
      `${process.env.REACT_APP_API_URL}/api/school/transportation/route/stop/${routeId}/${userId}`,
      formData,
      "POST"
    );
    console.log(data);
    return data;
  } catch (err) {
    console.log(err);
    throw new err();
  }
};
