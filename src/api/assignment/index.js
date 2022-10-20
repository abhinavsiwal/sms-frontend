import { sendRequestWithJson } from "api/api";
import { sendRequest } from "api/api";

export const updateAssignment = async (schoolId, userId, formData) => {
  try {
    const { data } = await sendRequestWithJson(
      `${process.env.REACT_APP_API_URL}/api/school/assignment/create_assignment/${schoolId}/${userId}`,
      formData,
      "PUT"
    );
    // console.log(data);
    return data;
  } catch (err) {
    console.log(err);
    throw new err();
  }
};

export const getAssignment = async (schoolId, userId, formData) => {
  try {
    const { data } = await sendRequestWithJson(
      `${process.env.REACT_APP_API_URL}/api/school/assignment/list/${schoolId}/${userId}`,
      formData,
      "POST"
    );
    // console.log(data);
    return data;
  } catch (err) {
    console.log(err);
    throw new err();
  }
};

export const deleteAssignment = async(schoolId, userId, formData) => {
  try {
    const { data } = await sendRequestWithJson(
      `${process.env.REACT_APP_API_URL}/api/school/assignment/delete_assignment/${schoolId}/${userId}`,
      formData,
      "DELETE"
    );
    // console.log(data);
    return data;
  } catch (err) {
    console.log(err);
    throw new err();
  }
}

export const assignmentDetailsById = async(schoolId, userId, formData) => {
  try {
    const { data } = await sendRequestWithJson(
      `${process.env.REACT_APP_API_URL}/api/school/assignment/assignment_details_by_id/${schoolId}/${userId}`,
      formData,
      "POST"
    );
    // console.log(data);
    return data;
  } catch (err) {
    console.log(err);
    throw new err();
  }
}