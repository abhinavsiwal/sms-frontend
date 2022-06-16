import { sendRequestWithJson, sendRequest } from "api/api";

export const addLibrarySection = async (userId, formData) => {
  try {
    const { data } = await sendRequest(
      `${process.env.REACT_APP_API_URL}/api/school/librarysection/create/${userId}`,
      formData,
      "POST"
    );
    console.log(data);
    return data;
  } catch (err) {
    console.log(err);
    return err;
  }
};

export const getAllLibrarySection = async (schoolId, userId) => {
  try {
    const { data } = await sendRequest(
      `${process.env.REACT_APP_API_URL}/api/school/librarysection/all/${schoolId}/${userId}`,
      {},
      "GET"
    );
    console.log(data);
    return data;
  } catch (err) {
    console.log(err);
    throw new err();
  }
};

export const addLibraryShelf = async (userId, formData) => {
  try {
    const { data } = await sendRequest(
      `${process.env.REACT_APP_API_URL}/api/school/libraryshelf/create/${userId}`,
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

export const editLibrarySection = async (sectionId, userId, formData) => {
  try {
    const { data } = await sendRequest(
      `${process.env.REACT_APP_API_URL}/api/school/librarysection/edit/${sectionId}/${userId}`,
      formData,
      "PUT"
    );
    console.log(data);
    return data;
  } catch (err) {
    console.log(err);
    throw new err();
  }
};

export const getAllLibraryShelf = async (schoolId, userId) => {
  try {
    const { data } = await sendRequest(
      `${process.env.REACT_APP_API_URL}/api/school/libraryshelf/all/${schoolId}/${userId}`,
      {},
      "GET"
    );
    console.log(data);
    return data;
  } catch (err) {
    console.log(err);
    throw new err();
  }
};

export const deleteLibrarySection = async (userId, sectionId) => {
  try {
    const { data } = await sendRequest(
      `${process.env.REACT_APP_API_URL}/api/school/librarysection/delete/${sectionId}/${userId}`,
      {},
      "DELETE"
    );
    console.log(data);
    return data;
  } catch (err) {
    console.log(err);
    return new err();
  }
};

export const deleteLibraryShelf = async (userId, shelfId) => {
  try {
    const { data } = await sendRequest(
      `${process.env.REACT_APP_API_URL}/api/school/libraryshelf/delete/${shelfId}/${userId}`,
      {},
      "DELETE"
    );
    console.log(data);
    return data;
  } catch (err) {
    console.log(err);
    return new err();
  }
};

export const editLibraryShelf = async (userId, shelfId, formData) => {
  try {
    const { data } = await sendRequest(
      `${process.env.REACT_APP_API_URL}/api/school/libraryshelf/edit/${shelfId}/${userId}`,
      formData,
      "PUT"
    );
    console.log(data);
    return data;
  } catch (err) {
    console.log(err);
    return new err();
  }
};

export const addBook = async (userId, formData) => {
  try {
    const { data } = await sendRequest(
      `${process.env.REACT_APP_API_URL}/api/school/books/create/${userId}`,
      formData,
      "POST"
    );
    console.log(data);
    return data;
  } catch (err) {
    console.log(err);
    return new err();
  }
};

export const getAllBooks = async (schoolId, userId) => {
  try {
    const { data } = await sendRequest(
      `${process.env.REACT_APP_API_URL}/api/school/books/all/${schoolId}/${userId}`,
      {},
      "GET"
    );
    console.log(data);
    return data;
  } catch (err) {
    console.log(err);
    throw new err();
  }
};

export const deleteBook = async (userId, bookId) => {
  try {
    const { data } = await sendRequest(
      `${process.env.REACT_APP_API_URL}/api/school/books/delete/${bookId}/${userId}`,
      {},
      "DELETE"
    );
    console.log(data);
    return data;
  } catch (err) {
    console.log(err);
    throw new err();
  }
};

export const editBook = async (userId, bookId, formData) => {
  try {
    const { data } = await sendRequest(
      `${process.env.REACT_APP_API_URL}/api/school/books/edit/${bookId}/${userId}`,
      formData,
      "PUT"
    );
    console.log(data);
    return data;
  } catch (err) {
    console.log(err);
    throw new err();
  }
};

export const allocateBook = async (userId, formData) => {
  try {
    const { data } = await sendRequest(
      `${process.env.REACT_APP_API_URL}/api/school/libraryhistory/create/${userId}`,
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

export const returnBook = async (userId, formData) => {
  try {
    const { data } = await sendRequest(
      `${process.env.REACT_APP_API_URL}/api/school/libraryhistory/create/${userId}`,
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

export const getAllHistory = async (schoolId, userId) => {
  try {
    const { data } = await sendRequest(
      `${process.env.REACT_APP_API_URL}/api/school/libraryhistory/all/${schoolId}/${userId}`,
      {},
      "GET"
    );
    console.log(data);
    return data;
  } catch (err) {
    console.log(err);
    throw new err();
  }
};

export const getHistoryByType = async (schoolId, userId) => {
  try {
    const { data } = await sendRequest(
      `${process.env.REACT_APP_API_URL}/api/school/libraryhistory/get/type/${schoolId}/${userId}`,
      {},
      "GET"
    );
    console.log(data);
    return data;
  } catch (err) {
    console.log(err);
    throw new err();
  }
};
