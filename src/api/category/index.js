import { sendRequest } from "api/api";

export const addCategory = async (userId, formData) => {
  try {
    const { data } = await sendRequest(
      `${process.env.REACT_APP_API_URL}/api/school/category/create/${userId}`,
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

export const getAllCategories = async (userId, schoolId) => {
  try {
    const { data } = await sendRequest(
      `${process.env.REACT_APP_API_URL}/api/school/category/all/${schoolId}/${userId}`
    );
    return data;
  } catch (err) {
    console.log(err);
    throw new err();
  }
};

export const deleteCategory = async (userId, categoryId) => {
  try {
    const { data } = await sendRequest(
      `${process.env.REACT_APP_API_URL}/api/school/category/delete/${categoryId}/${userId}`,
      {},
      "DELETE"
    );
    return data;
  } catch (err) {
    console.log(err);
    throw new err();
  }
};

export const updateCategory = async (userId, formData) => {
  try {
    const { data } = await sendRequest(
      `${process.env.REACT_APP_API_URL}/api/school/category/edit/${userId}`,
      formData,
      "PUT"
    );
    return data;
  } catch (err) {
    console.log(err);
    throw new err();
  }
};
