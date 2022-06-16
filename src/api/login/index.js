import { sendRequestWithJson } from "api/api";
import axios from "axios";
export const signIn = async (username, password) => {
  const url = `${process.env.REACT_APP_API_URL}/api/school/signin`;
  try {
    const { data } = await axios.post(url, { SID: username, password });
    // console.log(data);
    return data;
  } catch (err) {
    console.log(err);
  }
};
