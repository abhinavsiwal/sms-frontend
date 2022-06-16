import { sendRequest } from "api/api";

export const schoolProfile = async (schoolId, userId) => {
  try {
    const data = await sendRequest(
      `${process.env.REACT_APP_API_URL}/api/school/doc/details/view/${schoolId}/${userId}`
    );
    return data;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const editProfile = async (schoolId, userId,formData) => {
  try {
    const data = await sendRequest(
      `${process.env.REACT_APP_API_URL}/api/school/doc/details/edit/${schoolId}/${userId}`,
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

export const adminProfileEdit = async (userId, formData) => {
  try {
    const {data} = await sendRequest(
      `${process.env.REACT_APP_API_URL}/api/school/admin/detail/edit/${userId}`,
      formData,
      "PUT"
    );
    // console.log(data);
    return data;
  } catch (err) {
    console.log(err);
    throw err;
  }
}

export const getAdminProfile = async(userId) => {
  try {
    const {data} = await sendRequest(
      `${process.env.REACT_APP_API_URL}/api/school/admin/details/get/${userId}`
    );
    // console.log(data);
    return data;
  } catch (err) {
    console.log(err);
    throw err;
  }
}