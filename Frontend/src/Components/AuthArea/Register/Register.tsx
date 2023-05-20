import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import UserModel from "../../../Models/UserModel";
import authService from "../../../Services/AuthService";
import notifyService from "../../../Services/NotifyService";
import "./Register.scss";

function Register(): JSX.Element {

    // Use form state to hold registration information
    const { register, handleSubmit } = useForm<UserModel>();

    // Use navigate to redirect user after registration
    const navigate = useNavigate();

    // Handle send form to server
    async function sendForm(user: UserModel) {
        try {
            await authService.register(user);
            notifyService.success("Welcome!");
            navigate("/home");
        }
        catch(err: any) {
            notifyService.error(err);
        }
    }
    return (
        <div className="Register">
			 <form onSubmit={handleSubmit(sendForm)}>
                <div className="form-header">
                    <h3>Register</h3>
                </div>
                <div className="form-body">
                    <label>First name</label>
                    <input {...register("firstName")} type="text" minLength={2} maxLength={30} required></input>

                    <label>Last name</label>
                    <input {...register("lastName")} type="text" minLength={2} maxLength={50} required></input>

                    <label>Email address</label>
                    <input {...register("email")} type="email" pattern="^[\w.]+@[\w.]+\.[\w.]+$" placeholder="e.g example@gmail.com" required></input>

                    <label>password</label>
                    <input {...register("password")} type="password" minLength={4} required></input>

                    <button type="submit"> Submit</button>

                </div>
            </form>
        </div>
    );
}

export default Register;
