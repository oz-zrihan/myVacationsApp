import "./AuthMenu.scss";
import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
// Models
import UserModel from "../../../Models/UserModel";
// Services
import { authStore } from "../../../Redux/AuthState";
import authService from "../../../Services/AuthService";
import notifyService from "../../../Services/NotifyService";
// Icons
import { BiUserCircle } from "react-icons/bi";

function AuthMenu(): JSX.Element {
  const navigate = useNavigate();

  // User state
  const [user, setUser] = useState<UserModel>();

  // Get user From redux
  useEffect(() => {
    setUser(authStore.getState().user);
    const unsubscribe = authStore.subscribe(() => {
      setUser(authStore.getState().user);
    });
    return () => unsubscribe();
  }, []);

  // Log out
  function logout(): void {
    authService.logout();
    notifyService.success("Bye Bye...");
    navigate("/login");
  }

  // ============================= HTML =============================
  return (
    <div className={user ? "AuthMenu" : ""}>
      {user && (
        <>
          <NavLink to="/user-info" state={{ userProp: user }}>
            {" "}
            <BiUserCircle /> {user.firstName} {user.lastName}{" "}
          </NavLink>
          <span>|</span>
          <NavLink to="/login" onClick={logout}>
            Logout
          </NavLink>
        </>
      )}
    </div>
  );
}

export default AuthMenu;
