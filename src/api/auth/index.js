import CryptoJS from "crypto-js";

export const isAuthenticated = () => {

  if (!localStorage.getItem("persist:root")) {
    // console.log("here");
    
    return false;
  }

  let encryptedToken = JSON.parse(
    JSON.parse(localStorage.getItem("persist:root")).authReducer
  ).token;


  let encryption = CryptoJS.AES.decrypt(encryptedToken,process.env.REACT_APP_CRYPTO_SECRET);
  let token = encryption.toString(CryptoJS.enc.Utf8);

  let user = JSON.parse(JSON.parse(localStorage.getItem("persist:root")).authReducer).userDetails;

  if (typeof window == 'undefined') {
    return false;
  }
  if (token) {
    return {token,user};
  } else {
    return false;
  }
};