import { sendRequest } from "api/api";

export const allStudentCredentials = async (schoolId, userId) => {
  const url = `${process.env.REACT_APP_API_URL}/api/school/student/all/${schoolId}/${userId}`;
  try {
    const { data } = await sendRequest(url, {}, "GET");
    console.log(data);
    return data;
  } catch (err) {
    console.log(err);
    throw new err();
  }
};

export const studentPasswordEdit = async (userId, formData) => {
  const url = `${process.env.REACT_APP_API_URL}/api/school/student/password/${userId}`;
  try {
    const { data } = await sendRequest(url, formData, "PUT");
    console.log(data);
    return data;
  } catch (err) {
    console.log(err);
    throw new err();
  }
};

export const parentPasswordEdit = async (userId, formData) => {
  const url = `${process.env.REACT_APP_API_URL}/api/school/parent/password/${userId}`;
  try {
    const { data } = await sendRequest(url, formData, "PUT");
    console.log(data);
    return data;
  } catch (err) {
    console.log(err);
    throw new err();
  }
};
