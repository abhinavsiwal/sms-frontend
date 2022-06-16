export const allSessions = (userId, schoolID, token) => {
    const url = `${process.env.REACT_APP_API_URL}/api/school/session/all/${schoolID}/${userId}`;
    return fetch(url, {
      method: 'GET',
      headers: { Authorization: 'Bearer ' + token, Accept: 'application/json' },
    })
      .then((data) => {
        return data.json();
      })
      .catch((error) => {
        throw error;
      });
  };
  
  export const addSession = (userId, token, data) => {
    const url = `${process.env.REACT_APP_API_URL}/api/school/session/create/${userId}`;
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


  export const deleteSession=async(sessionId,userId,token)=>{
    const url = `${process.env.REACT_APP_API_URL}/api/school/session/delete/${sessionId}/${userId}`;

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
  }

  export const editSession=async(sessionId,userId,token,formData)=>{
    const url = `${process.env.REACT_APP_API_URL}/api/school/session/edit/${sessionId}/${userId}`;
  
    return fetch(url, {
      method: "PUT",
      headers: { Authorization: "Bearer " + token, Accept: "application/json" },
      body: formData,
    })
      .then((data) => {
        // console.log("data", data);
        return data.json();
      })
      .catch((error) => {
        throw error;
      });
  }