import { sendRequestWithJson, sendRequest } from "api/api";

export const getFees = async (schoolId, userId, formData) => {
  try {
    const { data } = await sendRequest(
      `${process.env.REACT_APP_API_URL}/api/school/fees_management/get_fees/${schoolId}/${userId}`,
      formData,
      "POST"
    );
    console.log(data);
    return data;
  } catch (err) {
    console.log(err);
    return err;
  }
};

export const updateFees = async (schoolId, userId, formData) => {
  try {
    const { data } = await sendRequest(
      `${process.env.REACT_APP_API_URL}/api/school/fees_management/update_fees/${schoolId}/${userId}`,
      formData,
      "POST"
    );
    console.log(data);
    return data;
  } catch (err) {
    console.log(err);
    return err;
  }
};

export const getFeesTypeList = async (schoolId, userId, formData) => {
  try {
    const { data } = await sendRequest(
      `${process.env.REACT_APP_API_URL}/api/school/fees_management/fees_type_list/${schoolId}/${userId}`,
      formData,
      "POST"
    );
    console.log(data);
    return data;
  } catch (err) {
    console.log(err);
    return err;
  }
};
export const updatePenalty = async (schoolId, userId, formData) => {
  try {
    const { data } = await sendRequest(
      `${process.env.REACT_APP_API_URL}/api/school/fees_management/update_penalty/${schoolId}/${userId}`,
      formData,
      "POST"
    );
    console.log(data);
    return data;
  } catch (err) {
    console.log(err);
    return err;
  }
};
