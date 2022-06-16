import { sendRequest } from "api/api";

export const createProduct = async (userId, formData) => {
  try {
    const { data } = await sendRequest(
      `${process.env.REACT_APP_API_URL}/api/school/product/create/${userId}`,
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

export const getAllProducts = async (userId, schoolId) => {
  try {
    const { data } = await sendRequest(
      `${process.env.REACT_APP_API_URL}/api/school/product/all/${schoolId}/${userId}`
    );
    return data;
  } catch (err) {
    console.log(err);
    throw new err();
  }
};

export const deleteProduct = async (userId, productId) => {
  try {
    const { data } = await sendRequest(
      `${process.env.REACT_APP_API_URL}/api/school/product/delete/${productId}/${userId}`,
      {},
      "DELETE"
    );
    return data;
  } catch (err) {
    console.log(err);
    throw new err();
  }
};

export const updateProduct = async (userId, formData) => {
  try {
    const { data } = await sendRequest(
      `${process.env.REACT_APP_API_URL}/api/school/product/edit/${userId}`,
      formData,
      "PUT"
    );
    return data;
  } catch (err) {
    console.log(err);
    throw new err();
  }
};
