export const support = (userId, token, data = {}) => {
  const url = `${process.env.REACT_APP_API_URL}/api/school/support/create/${userId}`;
  return fetch(url, {
    method: 'POST',
    headers: { Authorization: 'Bearer ' + token, Accept: 'application/json' },
    body: data,
  })
    .then((data) => {
      return data.json();
    })
    .catch((error) => {
      throw error;
    });
};

export const allSupports = (userId, schoolID, token) => {
  const url = `${process.env.REACT_APP_API_URL}/api/school/support/details/all/${schoolID}/${userId}`;
  return fetch(url, {
    method: 'GET',
    headers: { Authorization: 'Bearer ' + token, Accept: 'application/json', 'Content-Type': 'application/json' },
  })
    .then((data) => {
      return data.json();
    })
    .catch((error) => {
      throw error;
    });
};
