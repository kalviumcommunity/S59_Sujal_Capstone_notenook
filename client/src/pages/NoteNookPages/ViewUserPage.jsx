import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import extractTokenFromCookie from "../../Functions/ExtractTokenFromCookie";
import ViewUserInfo from "../../components/UserProfileComponents/ViewuserInfo";
import ViewUserProfileContent from "../../components/UserProfileComponents/ViewUserProfileContent";

function ViewUserPage() {
  const [userInfo, setUserInfo] = useState(null);

  const { userId } = useParams();

  useEffect(() => {
    const fetchUserData = async () => {
      const token = extractTokenFromCookie();
      if (!token) {
        return;
      }
      try {
        const response = await axios.get(
          `${
            import.meta.env.VITE_REACT_APP_GET_USER_DETAIL_ENDPOINT
          }/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setUserInfo(response.data.user);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [userId]);

  return (
    <div>
      <ViewUserInfo userInfo={userInfo} setUserInfo={setUserInfo} />
      <ViewUserProfileContent userInfo={userInfo} />
    </div>
  );
}

export default ViewUserPage;
