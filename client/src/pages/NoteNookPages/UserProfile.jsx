import { useState, useEffect, useContext } from "react";

import { Route, Routes } from "react-router-dom";
import axios from "axios";

import UserInfo from "../../components/UserProfileComponents/UserInfo";
import UpdatePasswordForm from "../../components/UserProfileComponents/UpdatePasswordForm";
import UpdateUserForm from "../../components/UserProfileComponents/UpdateUserInfoForm";
import extractTokenFromCookie from "../../Functions/ExtractTokenFromCookie";
import ProfileContent from "../../components/UserProfileComponents/ProfileContent";
import { UserContext } from "../../context/userContext";

import "../../css/UserProfile.css";

function UserProfile() {
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    const fetchUserDetails = async () => {
      const token = extractTokenFromCookie();
      if (!token) {
        throw new Error("Token not found");
      }
      try {
        const response = await axios.get(
          import.meta.env.VITE_REACT_APP_MYPROFILE_ENDPOINT,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log(response.data.user);

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
        <Route path="" element={<ProfileContent userInfo={userInfo} />}></Route>
      </Routes>
    </div>
  );
}

function UpdateForms({ userInfo, setUserInfo }) {
  const { user } = useContext(UserContext);
  console.log(user);
  return (
    <div className="updateForms">
      <UpdateUserForm userInfo={userInfo} setUserInfo={setUserInfo} />
      {!user.oauthId && <UpdatePasswordForm />}
    </div>
  );
}

export default UserProfile;
