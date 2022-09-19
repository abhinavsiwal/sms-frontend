import { sendRequestWithJson } from "./api";

export const getStudentAttendance = async (userId, schoolId, formData) => {
    try {
        const { data } = await sendRequestWithJson(
        `${process.env.REACT_APP_API_URL}/api/school/attendance/get_student_attendance/${schoolId}/${userId}`,
        formData,
        "POST"
        );
        return data;
    } catch (error) {
        console.log(error);
        throw error;
    }
}