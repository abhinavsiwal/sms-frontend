import {sendRequest} from '../api'

export const allSections = (userId, schoolID, token) => {
  const url = `${process.env.REACT_APP_API_URL}/api/school/section/all/${schoolID}/${userId}`;
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

export const addSection = (userId, token, data) => {
  const url = `${process.env.REACT_APP_API_URL}/api/school/section/create/${userId}`;
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

export const addClassToSection = (userId, classId, token, data) => {
  const url = `${process.env.REACT_APP_API_URL}/api/school/class/section/edit/${classId}/${userId}`;

  return fetch(url, {
    method: 'PUT',
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

export const deleteSection=async(userId,sectionId)=>{
  const url = `${process.env.REACT_APP_API_URL}/api/school/section/delete/${sectionId}/${userId}`;
try {
  const {data } = await sendRequest(url,{},"DELETE");
  // console.log(data);
  return data;
} catch (err) {
  console.log(err);
  throw err;
}
}


export const editSection=async(userId,sectionId,formData)=>{
  const url = `${process.env.REACT_APP_API_URL}/api/school/section/edit/${sectionId}/${userId}`;
  try {
    const {data } = await sendRequest(url,formData,"PUT");
    // console.log(data);
    return data;
  } catch (err) {
    console.log(err);
    throw err;
  }
}