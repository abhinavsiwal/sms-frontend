import { sendRequest,sendRequestWithJson } from "../api";

// export const addStaffAttendance=async(userId,formData)=>{
//     try {
//         const { data } = await sendRequest(
//         `${process.env.REACT_APP_API_URL}/api/school/staffAttendance/create/${userId}`,
//         formData,
//         "POST"
//         );
//         console.log(data);
//         return data;
//     } catch (error) {
//         console.log(error);
//         throw error;
//     }
// }

// export const searchStaffAttendance= async(schoolId,userId,formData)=>{
//     console.log(formData);
//     try {
//         const { data } = await sendRequestWithJson(
//         `${process.env.REACT_APP_API_URL}/api/school/staffAttendance/custom/all/${schoolId}/${userId}`,
//         formData,
//         "POST"
//         );
//         console.log(data);
//         return data;
//     } catch (error) {
//         console.log(error);
//         throw error;
//     }
// }

// export const updateAttendance = async (id, schoolId, body) => {
//     try {
//       const { data } = await sendRequest(
//         `${process.env.REACT_APP_API_URL}/api/school/staffAttendance/date/edit/${schoolId}/${id}`,
//         body,
//         "PUT"
//       );
//       // console.log(data);
//       return data;
//     } catch (error) {
//       console.log(error);
//       throw error;
//     }
//   };
  
export const getStaffAttendance = async (userId, schoolId, formData) => {
  try {
      const { data } = await sendRequestWithJson(
      `${process.env.REACT_APP_API_URL}/api/school/attendance/get_staff_attandance/${schoolId}/${userId}`,
      formData,
      "POST"
      );
      return data;
  } catch (error) {
      console.log(error);
      throw error;
  }
}


export const updateStaffAttendance = async (userId, schoolId, formData) => {
  try {
    const { data } = await sendRequestWithJson(
    `${process.env.REACT_APP_API_URL}/api/school/attendance/update_staff_attandance/${schoolId}/${userId}`,
    formData,
    "POST"
    );
    return data;
} catch (error) {
    console.log(error);
    throw error;
}
}
