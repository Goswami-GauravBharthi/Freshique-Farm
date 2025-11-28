import { useMutation, useQueryClient } from "@tanstack/react-query";
import React from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import api, { LoginUser } from "../apis/api";
import toast from "react-hot-toast";
import { setUser } from "../store/authSlice";

export const Login = () => {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [role, setRole] = React.useState("consumer");

  const navigate = useNavigate();
  const dispatch = useDispatch();

  //    const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: LoginUser,
    onSuccess: async (data) => {
      if (data.success) {
        try {
          const { data: profileData } = await api.get("auth/profile");
          dispatch(setUser(profileData.user));

          // Ensure role is correctly fetched from profileData
         // Adjust based on your API response structure
          if (role === "farmer") {
            navigate("/farmer/dashboard/profile", { replace: false }); // Use replace to avoid history stack issues
            toast.success("Farmer Login Successfully");
          } else {
            navigate("/", { replace: true });
            toast.success("Login Successfully");
          }
        } catch (error) {
          console.error("Error fetching profile:", error);
          toast.error("Failed to fetch user profile");
          navigate("/login");
        }
      } else {
        toast.error(data.message);
      }
    },
    onError: (err) => {
      toast.error("Internal server error while login");
    },
  });

  const handleLogin = (e) => {
    e.preventDefault();

    if (password.length < 6) {
      toast.error("Password must be 6 character");
    }
    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }
    const formData = {
      email,
      password,
      role,
    };
    mutate(formData);
  };

  return (
    <div className="w-full flex items-center justify-around sm:py-5 mx-auto bg-green-50">
      <form
        onSubmit={handleLogin}
        className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md"
      >
        <h2 className="text-2xl font-bold text-green-700 text-center mb-6">
          Farming Foods Login
        </h2>

        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="email"
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 bg-green-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="Enter your email"
          />
        </div>
        <div className="mb-6">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="password"
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 bg-green-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="Enter your password"
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Role
          </label>
          <div className="flex space-x-4">
            <label className="flex items-center  cursor-pointer">
              <input
                type="radio"
                value="consumer"
                checked={role === "consumer"}
                onChange={() => setRole("consumer")}
                className="mr-2"
              />
              Consumer
            </label>
            <label className="flex items-center cursor-pointer">
              <input
                type="radio"
                value="farmer"
                checked={role === "farmer"}
                onChange={() => setRole("farmer")}
                className="mr-2"
              />
              Farmer
            </label>
          </div>
        </div>
        <button className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition duration-200 flex items-center justify-center gap-2">
          {isPending ? (
            <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            "Login"
          )}
        </button>
        <p className="text-center text-gray-600 text-sm mt-4">
          Don't have an account?{" "}
          <Link to="/signup" className="text-green-600 hover:underline">
            Sign up
          </Link>
        </p>
      </form>

      <div className="hidden lg:block w-1/2">
        <img
          src="logiin.png"
          alt="Farmer with produce"
          className="w-full object-fill rounded-2xl"
        />
      </div>
    </div>
  );
};
