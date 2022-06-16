import React from "react";
import { isAuthenticated } from "api/auth";
import StaffProfile from "./StaffProfile";
import StudentProfile from "./StudentProfile";
import AdminProfile from "./AdminProfile";
import { FaAmericanSignLanguageInterpreting } from "react-icons/fa";
const Profile = () => {
  const { user } = isAuthenticated();
  // console.log(user);

  if (user.user === "schoolAdmin") {
    return <AdminProfile />;
  } else if (user.user === "staff") {
    return <StaffProfile />;
  } else if (user.user === "student") {
    return <StudentProfile />;
  }
};

export default Profile;
