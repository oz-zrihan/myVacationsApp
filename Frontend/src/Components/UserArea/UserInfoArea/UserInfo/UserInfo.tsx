import "./UserInfo.scss";
import { useLocation } from "react-router-dom";
import { NavLink } from "react-router-dom";
// Components
import FollowedVacation from "../FollowedVacation/FollowedVacation";

function UserInfo(): JSX.Element {
  // Get state from NavLink
  const location = useLocation();

  // Extract user from location
  const user = location.state?.userProp;
  console.log(user);
  

  // ============================= HTML =============================
  return (
    <>
      <div className="UserInfo">
        <h1>
          {user?.firstName} {user?.lastName}
        </h1>
        <p>{user.email}</p>
        <NavLink to={"/edit-user"} state={{ userProps: user }}>
          <button className="gold-btn"> Edit user</button>
        </NavLink>
        <NavLink to={"/"}>
          <button className="blue-btn"> Back to vacations</button>
        </NavLink>
        {user?.roleId === 2 && <FollowedVacation user={user} /> }
        
      </div>
    </>
  );
}

export default UserInfo;
