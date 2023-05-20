import "./EditUser.scss";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
// Models
import UserModel from "../../../../Models/UserModel";
// Services
import usersService from "../../../../Services/UsersService";

function EditUser(): JSX.Element {
  // Use navigate to redirect user after editing
  const navigate = useNavigate();

  // Get state from NavLink
  const location = useLocation();

  // Extract user from location
  const user = location.state?.userProps;

  // Use Form hook
  const { register, handleSubmit, setValue } = useForm<UserModel>();

  // Set user information inside inputs
  useEffect(() => {
    setValue("userId", user.userId);
    setValue("firstName", user.firstName);
    setValue("lastName", user.lastName);
    setValue("email", user.email);
  }, []);
  // Send edited user to server
  async function send(user: UserModel) {
    try {
      await usersService.editUser(user);
      alert("success");
      navigate("/user-info");
    } catch (err: any) {
      alert(err);
    }
  }

  // ============================= HTML =============================
  return (
    <div className="EditUser">
      <h2>Edit your information</h2>

      <form onSubmit={handleSubmit(send)}>
        <input type="hidden" {...register("userId")} />

        <label>First Name:</label>
        <input type="string" {...register("firstName")} min={2} max={30} />

        <label>Last Name:</label>
        <input type="string" {...register("lastName")} min={2} max={50} />

        <label>Email:</label>
        <input type="email" {...register("email")} min={3} max={50} />

        <label>password:</label>
        <input
          type="password"
          {...register("password")}
          min={3}
          max={256}
          placeholder="* * * * * * * *"
        />

        <button>Send</button>
      </form>
    </div>
  );
}

export default EditUser;
