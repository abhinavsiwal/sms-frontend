export const createPenalty = (userId, token, data) => {
  console.log("Start API");
  const url = `${process.env.REACT_APP_API_URL}/api/school/penalty/create/${userId}`;
  return fetch(url, {
    method: "POST",
    headers: { Authorization: "Bearer " + token, Accept: "application/json" },
    body: data,
  })
    .then((data) => {
      console.log(data);
      return data.json();
    })
    .catch((error) => {
      throw error;
    });
};

export const deletePenalty = (PenaltyId, userId, token) => {
  const url = `${process.env.REACT_APP_API_URL}/api/school/penalty/delete/${PenaltyId}/${userId}`;
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

export const updatePenalty = (PenaltyId, userId, token, data) => {
  const url = `${process.env.REACT_APP_API_URL}/api/school/penalty/edit/${PenaltyId}/${userId}`;
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

export const getFeesPenalty = (schoolId, userId, token, data) => {
  console.log(data);
  const url = `${process.env.REACT_APP_API_URL}/api/school/penalty/custome/get/${schoolId}/${userId}`;
  return fetch(url, {
    method: "POST",
    headers: {
      Authorization: "Bearer " + token,
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: data,
  })
    .then((data) => {
      return data.json();
    })
    .catch((error) => {
      console.log(error);
      throw error;
    });
};
export const getFeesObject = (schoolId, userId, token, data) => {
  console.log(data);
  const url = `${process.env.REACT_APP_API_URL}/api/school/fees/object/all/get/${schoolId}/${userId}`;
  return fetch(url, {
    method: "POST",
    headers: {
      Authorization: "Bearer " + token,
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: data,
  })
    .then((data) => {
      return data.json();
    })
    .catch((error) => {
      console.log(error);
      throw error;
    });
};
