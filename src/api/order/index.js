import { sendRequest, sendRequestWithJson } from "api/api";

export const createOrder = async (userId, formData) => {
  try {
    const { data } = await sendRequestWithJson(
      `${process.env.REACT_APP_API_URL}/api/school/order/create/${userId}`,
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
