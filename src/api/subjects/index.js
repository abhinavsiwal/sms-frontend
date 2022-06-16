export const allSubjects = (userId, schoolID, token) => {
  const url = `${process.env.REACT_APP_API_URL}/api/school/subject/all/${schoolID}/${userId}`;
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

export const addSubject = (userId, token, data = {}) => {
  const url = `${process.env.REACT_APP_API_URL}/api/school/subject/create/${userId}`;
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

export const updateSubject = (subjectId, userId, token, data) => {
  const url = `${process.env.REACT_APP_API_URL}/api/school/subject/edit/${subjectId}/${userId}`;
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

export const deleteSubject = (subjectId, userId, token) => {
  const url = `${process.env.REACT_APP_API_URL}/api/school/subject/delete/${subjectId}/${userId}`;
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
