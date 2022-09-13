import { sendRequest } from "./api";
export const uploadFile = async (formData) => {
  try {
    const {data} = await sendRequest(
      `${process.env.REACT_APP_API_URL}/api/school/upload_file`,
      formData,
      "POST"
    );
    return data;
  } catch (err) {
    console.log(err);
    throw err;
  }
};
