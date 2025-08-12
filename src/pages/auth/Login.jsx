import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useLoginMutation } from "../../features/auth/authSlide";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router";
import { FaRegEyeSlash } from "react-icons/fa";
import { PiEye } from "react-icons/pi";
import { useState } from "react";
import { FaGithub } from "react-icons/fa6";
import { FaGoogle } from "react-icons/fa";
import { useLoginWithGoogle } from "../../components/social-auth/GoogleAuthComponent";
import { useLoginWithGitHub } from "../../components/social-auth/GithubAuthComponent";

export default function Login() {
  const [login, { isLoading, isSuccess }] = useLoginMutation();
  const [isShowPassword, setIsShowPassword] = useState(false);
  const navigate = useNavigate();

  console.log(isLoading);

  const shcema = z.object({
    email: z.string().nonempty("email is required").email(),
    password: z.string().nonempty("password is required"),
  });

  const { googleLogin, googleLogout } = useLoginWithGoogle();
  const { gitHubLogin, gitHubLogout } = useLoginWithGitHub();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: zodResolver(shcema),
  });

  const onSubmit = async (data) => {
    try {
      let result = await login(data).unwrap();

      if (result != undefined) {
        navigate("/");
      }
    } catch (errors) {
      toast.error(errors?.data?.message);
      console.log("ERROR: ", errors?.data?.message);
    } finally {
      reset();
    }
  };

  return (
    <section className="bg-teal-600 w-full min-h-screen flex items-center justify-center">
      <div className="flex flex-col md:flex-row gap-8 md:gap-16 p-8">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white p-8 rounded-2xl shadow-xl w-full md:w-96"
        >
          <div className="flex flex-col gap-5">
            <h1 className="text-3xl text-center font-bold text-teal-600">
              Login
            </h1>
            {/* Email Input */}
            <div className="flex flex-col">
              <input
                {...register("email")}
                className="px-4 py-3 border border-slate-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                placeholder="email"
                type="text"
              />
              {errors.email && (
                <span className="text-red-600 mt-2 text-sm">
                  {errors.email.message}
                </span>
              )}
            </div>
            {/* Password Input */}
            <div className="flex flex-col relative">
              <div
                onClick={() => setIsShowPassword(!isShowPassword)}
                className="absolute top-1/2 right-4 -translate-y-1/2 cursor-pointer text-gray-500 hover:text-teal-600"
              >
                {isShowPassword ? <PiEye /> : <FaRegEyeSlash />}
              </div>
              <input
                {...register("password")}
                className="px-4 py-3 border border-slate-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                type={isShowPassword ? "text" : "password"}
                placeholder="Password"
              />
              {errors.password && (
                <span className="text-red-600 mt-2 text-sm">
                  {errors.password.message}
                </span>
              )}
            </div>
            <button
              type="submit"
              className="bg-teal-600 hover:bg-teal-700 px-5 py-3 rounded-xl text-white font-semibold transition-colors duration-200"
            >
              {isLoading ? "Loading..." : "Login"}
            </button>
          </div>
        </form>
        {/* Test Buttons Section */}
        <div className="flex flex-col justify-center items-center p-8 bg-white rounded-2xl shadow-xl w-full md:w-64">
          <p className="text-center text-gray-700 font-semibold mb-4">
            Test Social Logins
          </p>
          <div className="flex gap-8 justify-center mb-6">
            <button
              onClick={googleLogin}
              className="text-teal-600 hover:text-teal-800 text-4xl transition-colors duration-200"
            >
              <FaGoogle />
            </button>
            <button
              onClick={gitHubLogin}
              className="text-teal-600 hover:text-teal-800 text-4xl transition-colors duration-200"
            >
              <FaGithub />
            </button>
          </div>
          <p className="text-center text-gray-700 font-semibold mb-4">
            Test Social Logouts
          </p>
          <div className="flex gap-8 justify-center">
            <button
              onClick={gitHubLogout} // Assuming this button is for Google logout
              className="text-teal-600 hover:text-teal-800 text-4xl transition-colors duration-200"
            >
              <FaGoogle />
            </button>
            <button
              onClick={gitHubLogout}
              className="text-teal-600 hover:text-teal-800 text-4xl transition-colors duration-200"
            >
              <FaGithub />
            </button>
          </div>
        </div>
      </div>
      <ToastContainer />
    </section>
  );
}
