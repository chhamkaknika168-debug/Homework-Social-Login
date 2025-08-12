import { useState } from "react";
import { useForm } from "react-hook-form";
import { FaRegEyeSlash } from "react-icons/fa";
import { PiEye } from "react-icons/pi";
import { file, z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useUploadFileMutation } from "../../features/file/fileSlice";
import { useRegisterMutation } from "../../features/auth/authSlide";
import { useNavigate } from "react-router";
const schema = z.object({
  name: z.string().nonempty("name is required"),
  email: z.string().nonempty("email is required").email("invalid email"),
  password: z
    .string()
    .nonempty("password is required")
    .min(4, "Must be greater than 4"),
});

export default function Register2() {
  const [uploadFile] = useUploadFileMutation();
  const [isShowPassword, setIsShowPassword] = useState(false);
  const [image, setImage] = useState(null); // use to store meta data
  const [preview, setPreview] = useState(null);
  const [registerUser] = useRegisterMutation();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "kim",
      email: "kim@gmail.com",
      password: "1234",
      avatar: "",
    },
  });

  // handle preview images
  const handleImagePreview = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImage(file);
    setPreview(URL.createObjectURL(file));
  };
  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append("file", image);
    const res = await uploadFile(formData).unwrap();
    console.log(res);
    const submitData = {
      ...data,
      avatar: res.location,
    };
    console.log(submitData);
    const checkRegister = await registerUser(submitData).unwrap();
    if (checkRegister != undefined) {
      navigate("/login");
    }
  };
  return (
    <div className="bg-teal-500 h-[100vh]">
      <br />
      <form
        className=" w-1/2 mx-auto  bg-gray-100 rounded-2xl p-4"
        onSubmit={handleSubmit(onSubmit)}
      >
        <h1 className="text-3xl font-bold m-4 text-center text-teal-600">
          Register
        </h1>
        {preview != null && (
          <div class="flex items-center justify-center w-full">
            <label
              for="dropzone-file"
              class="justify-center w-40 rounded-full h-40 border-gray-300  cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
            >
              <img
                class=" w-40 rounded-full h-40 object-cover "
                src={preview}
              />
              <input
                onChange={(e) => handleImagePreview(e)}
                id="dropzone-file"
                type="file"
                class=" opacity-0"
                accept="image/jpeg,image/png,image/webp,image/jpg"
              />
            </label>
          </div>
        )}

        {preview == null && (
          <div class="flex items-center justify-center w-full">
            <label
              for="dropzone-file"
              class="flex flex-col items-center justify-center w-40 rounded-full h-40 border-2 border-gray-300 border-dashed  cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
            >
              <div class="flex flex-col items-center justify-center pt-5 pb-6">
                <svg
                  class="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 20 16"
                >
                  <path
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                  />
                </svg>
                <p class="mb-2 text-sm text-gray-500 dark:text-gray-400">
                  Upload here
                </p>
              </div>
              <input
                {...register("avatar")}
                onChange={(e) => handleImagePreview(e)}
                id="dropzone-file"
                type="file"
                class="hidden"
                accept="image/jpeg,image/png,image/webp,image/jpg"
              />
            </label>
          </div>
        )}

        <div class="mb-5">
          <label
            for="email"
            class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Your email
          </label>

          <input
            {...register("email")}
            type="text"
            id="email"
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Enter email"
          />
          {errors.email && (
            <span className="text-red-600 mt-2">{errors.email.message}</span>
          )}
        </div>
        <div class="mb-5">
          <label
            for="text"
            class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Your name
          </label>
          <input
            {...register("name")}
            type="text"
            id="name"
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Enter name"
          />
          {errors.name && (
            <span className="text-red-600 mt-2">{errors.name.message}</span>
          )}
        </div>
        <div className="flex flex-col relative">
          <label
            for="text"
            class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Your password
          </label>
          <div
            onClick={() => setIsShowPassword(!isShowPassword)}
            className="absolute top-11 right-4"
          >
            {isShowPassword ? <PiEye /> : <FaRegEyeSlash />}
          </div>
          <input
            {...register("password")}
            className="px-2.5 py-2.5 border border-slate-400 rounded-xl"
            type={isShowPassword ? "text" : "password"}
            placeholder="Password"
          />
          {errors.password && (
            <span className="text-red-600 mt-2">{errors.password.message}</span>
          )}
        </div>

        <input
          className="bg-teal-600 p-2 rounded-3xl  px-5 text-white flex  mx-auto mt-10"
          type="submit"
          value="Register"
        />
      </form>
    </div>
  );
}
