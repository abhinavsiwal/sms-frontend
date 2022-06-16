export const addCalender = (userId, token, data) => {
  const url = `${process.env.REACT_APP_API_URL}/api/school/event/create/${userId}`;
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

export const getCalender = (userId, schoolId, token) => {
  const url = `${process.env.REACT_APP_API_URL}/api/school/event/all/${schoolId}/${userId}`;
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

export const updateEvent = (userId, eventId, token, data) => {
  const url = `${process.env.REACT_APP_API_URL}/api/school/event/edit/${eventId}/${userId}`;
  return fetch(url, {
    method: "PUT",
    headers: { Authorization: "Bearer " + token, Accept: "application/json" },
    body: data,
  })
    .then((data) => {
      // console.log("data", data);
      return data.json();
    })
    .catch((error) => {
      throw error;
    });
};

export const deleteEvents = (eventId, userId, token) => {
  const url = `${process.env.REACT_APP_API_URL}/api/school/event/delete/${eventId}/${userId}`;
  return fetch(url, {
    method: "DELETE",
    headers: { Authorization: "Bearer " + token, Accept: "application/json" },
  })
    .then((data) => {
      // console.log("data", data);
      return data.json();
    })
    .catch((error) => {
      throw error;
    });
};
