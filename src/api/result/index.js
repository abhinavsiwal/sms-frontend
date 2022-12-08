import { sendRequest } from "api/api";

export const updateGrades = async (userId, schoolId, formData) => {
  try {
    const { data } = await sendRequest(
      `${process.env.REACT_APP_API_URL}/api/grades/update_grades/${schoolId}/${userId}`,
      formData,
      "PUT"
    );
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const getGrades = async (userId, schoolId) => {
  try {
    const { data } = await sendRequest(
      `${process.env.REACT_APP_API_URL}/api/grades/get_grades/${schoolId}/${userId}`
    );
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const updateExam = async (userId, schoolId, formData) => {
  try {
    const { data } = await sendRequest(
      `${process.env.REACT_APP_API_URL}/api/grades/update_exam/${schoolId}/${userId}`,
      formData,
      "PUT"
    );
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const updateMarks = async (userId, schoolId, formData) => {
  try {
    const { data } = await sendRequest(
      `${process.env.REACT_APP_API_URL}/api/grades/update_marks/${schoolId}/${userId}`,
      formData,
      "PUT"
    );
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const getExams = async (userId, schoolId, formData) => {
  try {
    const { data } = await sendRequest(
      `${process.env.REACT_APP_API_URL}/api/grades/exam_list/${schoolId}/${userId}`,
      formData,
      "POST"
    );
    return data;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const studentMarksList = async (userId, schoolId, formData) => {
  try {
    const { data } = await sendRequest(
      `${process.env.REACT_APP_API_URL}/api/grades/get_marks/${schoolId}/${userId}`,
      formData,
      "POST"
    );
    return data;
  } catch (err) {
    console.log(err);
    throw err;
  }
}