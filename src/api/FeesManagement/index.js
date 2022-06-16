export const createFees = (userId, token, data) => {
  console.log("Start API");
  const url = `${process.env.REACT_APP_API_URL}/api/school/fees/create/${userId}`;
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

export const deleteFees = (FeesId, userId, token) => {
  const url = `${process.env.REACT_APP_API_URL}/api/school/fees/delete/${FeesId}/${userId}`;
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

export const updateFees = (feesId, userId, token, data) => {
  const url = `${process.env.REACT_APP_API_URL}/api/school/fees/fees/${feesId}/${userId}`;
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

export const getFeesCustome = (schoolId, userId, token, data) => {
  console.log(data);
  const url = `${process.env.REACT_APP_API_URL}/api/school/fees/custome/get/${schoolId}/${userId}`;
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
