import "../../css/UserProfile.css";
import UserInfo from "../../components/UserProfileComponents/UserInfo";
import UpdatePasswordForm from "../../components/UserProfileComponents/UpdatePasswordForm";
import UpdateUserForm from "../../components/UserProfileComponents/UpdateUserInfoForm";
import { Link, Route, Routes } from "react-router-dom";
function UserProfile() {
  return (
    <div className="userProfilePage">
      <UserInfo />
      <Routes>
        <Route path="edit" element={<UpdateForms />}></Route>
      </Routes>
    </div>
  );
}

function UpdateForms() {
  return (
    <div className="updateForms">
      <UpdateUserForm />
      <UpdatePasswordForm />
    </div>
  );
}

export default UserProfile;
