import { sendRequestWithJson, sendRequest } from "api/api";

export const createTimeTable = (userId, token, data) => {
  const url = `${process.env.REACT_APP_API_URL}/api/school/timetable/create/${userId}`;
  return fetch(url, {
    method: "POST",
    headers: { Authorization: "Bearer " + token, Accept: "application/json" },
    body: data,
  })
    .then((data) => {
      return data.json();
    })
    .catch((error) => {
      throw error;
    });
};

export const getTimeTable = (schoolId, userId, token) => {
  const url = `${process.env.REACT_APP_API_URL}/api/school/timetable/all/${schoolId}/${userId}`;
  return fetch(url, {
    method: "GET",
    headers: { Authorization: "Bearer " + token, Accept: "application/json" },
  })
    .then((data) => {
      return data.json();
    })
    .catch((error) => {
      throw error;
    });
};

export const deleteTimeTable = (timeTableId, userId, token) => {
  const url = `${process.env.REACT_APP_API_URL}/api/school/timetable/delete/${timeTableId}/${userId}`;
  return fetch(url, {
    method: "DELETE",
    headers: { Authorization: "Bearer " + token, Accept: "application/json" },
  })
    .then((data) => {
      return data.json();
    })
    .catch((error) => {
      throw error;
    });
};

export const updateTimeTable = (timeTableId, userId, token, data) => {
  const url = `${process.env.REACT_APP_API_URL}/api/school/timetable/edit/${timeTableId}/${userId}`;
  return fetch(url, {
    method: "PUT",
    headers: { Authorization: "Bearer " + token, Accept: "application/json" },
    body: data,
  })
    .then((data) => {
      return data.json();
    })
    .catch((error) => {
      throw error;
    });
};

export const getSingleTimeTable = (schoolId, userId, token, data) => {
  // console.log(data);
  const url = `${process.env.REACT_APP_API_URL}/api/school/timetable/custom/all/${schoolId}/${userId}`;
  return fetch(url, {
    method: "POST",
    headers: {
      Authorization: "Bearer " + token,
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ class: data.class, section: data.section }),
  })
    .then((data) => {
      return data.json();
    })
    .catch((error) => {
      console.log(error);
      throw error;
    });
};
//REfactored Api

export const getTimeTableForClass = async (schoolId, userId, formData) => {
  console.log(formData);
  try {
    const { data } = await sendRequest(
      `${process.env.REACT_APP_API_URL}/api/school/timetable/time_table_list/${schoolId}/${userId}`,
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
export const updatePeriod = async (schoolId, userId, formData) => {
  try {
    const { data } = await sendRequest(
      `${process.env.REACT_APP_API_URL}/api/school/timetable/update_period/${schoolId}/${userId}`,
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

export const getAllPeriods = async (schoolId,userId,formData)=>{
  try {
    const { data } = await sendRequest(
      `${process.env.REACT_APP_API_URL}/api/school/timetable/period_master_list/${schoolId}/${userId}`,
      formData,
      "POST"
    );
    console.log(data);
    return data;
  } catch (err) {
    console.log(err);
    throw new err();
  }
}

export const updateTimetable = async (schoolId, userId, formData) => {
  try {
    const { data } = await sendRequest(
      `${process.env.REACT_APP_API_URL}/api/school/timetable/update_time_table/${schoolId}/${userId}`,
      formData,
      "POST"
    );
    console.log(data);
    return data;
  } catch (err) {
    console.log(err);
    throw new err();
  }
}