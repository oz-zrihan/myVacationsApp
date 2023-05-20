import { Navigate, Route, Routes } from "react-router-dom";
import { useEffect, useState } from "react";
import { authStore } from "../../../Redux/AuthState";
// Services
import authService from "../../../Services/AuthService";
// Components
import Login from "../../AuthArea/Login/Login";
import Register from "../../AuthArea/Register/Register";
import MainVacations from "../../UserArea/VacationsArea/MainVacations/MainVacations";
import PageNotFound from "../PageNotFound/PageNotFound";
import UserInfo from "../../UserArea/UserInfoArea/UserInfo/UserInfo";
import EditUser from "../../UserArea/UserInfoArea/EditUser/EditUser";
import AdminMainVacations from "../../AdminArea/AdminVacations/AdminMainVacations/AdminMainVacations";
import AddVacation from "../../AdminArea/AdminVacations/AddVacation/AddVacation";
import AdminReports from "../../AdminArea/AdminReportsArea/AdminReports/AdminReports";
import EditHeader from "../../AdminArea/EditHeader/EditHeader";

function Routing(): JSX.Element {
  // Token state -> hold user token on site load
  const [token, setToken] = useState<string>("");

  // Is Logged in state -> to hold if user is logged in
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  // Is Admin state -> to hold if user is admin
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  // Get user From redux
  useEffect(() => {
    const unsubscribe = authStore.subscribe(() => {
      setToken(authStore.getState().token);
      setIsLoggedIn(authService.verifyLoggedIn());
      setIsAdmin(authService.isAdmin());
    });

    // Set initial values
    setToken(authStore.getState().token);
    setIsLoggedIn(authService.verifyLoggedIn());
    setIsAdmin(authService.isAdmin());

    // Unsubscribe from store when component unmounts
    return unsubscribe;
  }, []);

  return (
    <Routes>
      <Route
        path="/"
        element={
          isLoggedIn ? (
            isAdmin ? (
              <Navigate to="/admin-vacations" replace />
            ) : (
              <Navigate to="/vacations" />
            )
          ) : (
            <Login />
          )
        }
      />

      {/* ======== Auth Routes ======== */}
      <Route
        path="/login"
        element={
          isLoggedIn ? (
            isAdmin ? (
              <Navigate to="/admin-vacations" replace />
            ) : (
              <Navigate to="/vacations" />
            )
          ) : (
            <Login />
          )
        }
      />
      <Route
        path="/register"
        element={
          isLoggedIn ? (
            isAdmin ? (
              <Navigate to="/admin-vacations" replace />
            ) : (
              <Navigate to="/vacations" />
            )
          ) : (
            <Register />
          )
        }
      />

      {/* ======== User Routes ======== */}
      <Route
        path="/vacations"
        element={
          isLoggedIn ? (
            isAdmin ? (
              <Navigate to="/admin-vacations" replace />
            ) : (
              <MainVacations />
            )
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
      <Route path="/user-info" element={<UserInfo />} />
      <Route path="/edit-user" element={<EditUser />} />

      {/* ======== Admin Routes ======== */}
      <Route
        path="/admin-vacations"
        element={
          isLoggedIn && isAdmin ? (
            <AdminMainVacations />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
      <Route
        path="/add-vacation"
        element={
          isLoggedIn && isAdmin ? (
            <AddVacation />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
      <Route
        path="/admin-reports"
        element={
          isLoggedIn && isAdmin ? (
            <AdminReports />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
      <Route
        path="/edit-header"
        element={
          isLoggedIn && isAdmin ? (
            <EditHeader />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />

      {/* ======== 404 Routes ======== */}
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
}

export default Routing;
