  export const deleteClassfees = (ClassfeesId, userId, token) => {
    const url = `${process.env.REACT_APP_API_URL}/api/school/classfees/delete/${ClassfeesId}/${userId}`;
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
  
  export const getFeesClassfees = (schoolId, userId, token, data) => {
    console.log(data);
    const url = `${process.env.REACT_APP_API_URL}/api/school/classfees/custome/get/${schoolId}/${userId}`;
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