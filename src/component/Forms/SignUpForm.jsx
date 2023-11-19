import { useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import authService from "../../appWrite/auth";
import { login as authLogin } from "../../store/authSlice";
import Logo from "../Header/Logo";
import Input from "../reusableComps/Input";
import Button from "../reusableComps/Button";

function SignUpForm() {
  const dispatch = useDispatch();
  let navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");
  const { register, handleSubmit } = useForm();

  const onSignUp = async (data) => {
    setErrorMessage("");
    try {
      const session = await authService.createAccount(data);
      if (session) {
        const userData = await authService.getCurrentUser();
        if (userData) {
          dispatch(authLogin(userData));
        }
        navigate("/");
      }
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  return (
    <div className="flex items-center justify-center">
      <div
        className={`mx-auto w-full max-w-lg bg-gray-100 rounded-xl p-10 border border-black/10`}
      >
        <div className="mb-2 flex justify-center">
          <span className="inline-block w-full max-w-[100px]">
            <Logo width="100%" />
          </span>
        </div>
        <h2 className="text-center text-2xl font-bold leading-tight">
          Sign up to create account
        </h2>
        <p className="mt-2 text-center text-base text-black/60">
          Already have an account?&nbsp;
          <Link
            to="/login"
            className="font-medium text-primary transition-all duration-200 hover:underline"
          >
            Sign In
          </Link>
        </p>
        {errorMessage && (
          <p className="text-red-600 mt-8 text-center">{errorMessage}</p>
        )}
        <form onSubmit={handleSubmit(onSignUp)}>
          <div className="space-y-5">
            <Input
              label="Full Name :"
              placeholder="Enter your Full Name"
              type="text"
              {...register("name", { required: true })}
            />
            <Input
              label="Email :"
              placeholder="Enter your email Id"
              type="email"
              {...register("email", {
                required: true,
                validate: {
                  matchPatern: (value) =>
                    /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value) ||
                    "Email address must be a valid address",
                },
              })}
            />
            <Input
              label="Password: "
              type="password"
              placeholder="Enter your password"
              {...register("password", {
                required: true,
                validate: {
                  matchPatern: (value) =>
                    /((?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W]).{8,})/.test(
                      value
                    ) ||
                    "Password must be a valid password conatains [a-z, A-Z, 0-9, special character, min 8 chars]",
                },
              })}
            />
            <Button type="submit" className="w-full">
              Sign Up
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SignUpForm;
