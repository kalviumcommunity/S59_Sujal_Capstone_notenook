import { useState, useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import axios from "axios";

import UserInfo from "../../components/UserProfileComponents/UserInfo";
import UpdatePasswordForm from "../../components/UserProfileComponents/UpdatePasswordForm";
import UpdateUserForm from "../../components/UserProfileComponents/UpdateUserInfoForm";

import "../../css/UserProfile.css";

function UserProfile() {
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await axios.get(
          import.meta.env.VITE_REACT_APP_USER_DETAIL_ENDPOINT
        );

        setUserInfo(response.data.user);
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };

    fetchUserDetails();
  }, []);

  return (
    <div className="userProfilePage">
      <UserInfo userInfo={userInfo} />
      <Routes>
        <Route
          path="edit"
          element={
            <UpdateForms userInfo={userInfo} setUserInfo={setUserInfo} />
          }
        ></Route>
      </Routes>
    </div>
  );
}

function UpdateForms({ userInfo, setUserInfo }) {
  return (
    <div className="updateForms">
      <UpdateUserForm userInfo={userInfo} setUserInfo={setUserInfo} />
      <UpdatePasswordForm />
    </div>
  );
}

export default UserProfile;
