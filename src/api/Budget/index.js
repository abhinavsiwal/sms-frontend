import { sendRequest } from "../api";

export const addStaffBudget = async(schoolId,userId,formData)=>{
    try {
        const { data } = await sendRequest(
          `${process.env.REACT_APP_API_URL}/api/school/budget/update_budget/${schoolId}/${userId}`,
          formData,
          "PUT"
        );
        // console.log(data);
        return data;
      } catch (err) {
        console.log(err);
        throw new err();
      }
}