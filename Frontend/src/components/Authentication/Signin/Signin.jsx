import axios from "axios";
import React, { useContext } from "react";
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import { X } from "lucide-react";
import UserContext from "../../../contexts/user/user.context.js";

function Signin() {
  const navigate = useNavigate()
  const location = useLocation()
  const { setUser } = useContext(UserContext);

  const [formData, setFormData] = useState({
    userContactNumber: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [showError, setShowError] = useState(false)
  const [navigateMessage , setNavigateMessage] = useState("")
  const [showNavigateMessage , setShowNavigateMessage] = useState(false)

  useEffect(() => {
    if (error) {
      setShowError(true);
      setTimeout(() => {
        setShowError(false)
        setError("")
      }, 5000);
    }
  }, [error]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    if (location.state?.SessionExpired) {
      setError(location.state.SessionExpired)
      setShowError(true)

      navigate(location.pathname, { replace: true });

      setTimeout(() => {
        setShowError(false)
        setError("")
      }, 5000);

    } else if (location.state?.LogIn) {
      
      setError(location.state.LogIn)
      setShowError(true)

      navigate(location.pathname, { replace: true });

      setTimeout(() => {
        setShowError(false)
        setError("")
      }, 5000);
    }
  }, [])


  const handleSubmit = async (e) => {
    e.preventDefault();

    setFormData({
      userContactNumber: "",
      password: "",
    })

    setError("")

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/users/login`,
        formData
      );
      if (response.status === 200) {
        setUser(response.data.data)
        navigate("/", {
          state: {
            successMessage: "User log in successfully",
          }
        })
      }
    } catch (error) {
      if (error.response || error.message.data.message) {
        setError(error.response.data.message)
      } else {
        setError("Something went wrong. Please try again")
      }
    }
  };

  return (
    <div className="relative md:py-4 md:px-10 min-h-screen bg-gray-100 flex flex-col justify-center items-center">
      <div className="bg-white shadow-2xl rounded-md flex w-9/10 md:w-7/10 justify-between">
        <img className="hidden w-[48%]  rounded-tl-md rounded-bl-md xl:block" src="src\assets\manBike2.jpg" alt="" />
        <form onSubmit={handleSubmit} className="relative w-full xl:w-1/2 py-5 flex flex-col justify-center gap-y-4">
          <Link to={"/"}>
            <button className="bg-black cursor-pointer px-2 py-1 flex gap-x-2 justify-center items-center text-white absolute rounded-tr-md top-0 right-0 hover:bg-black/90 transition-colors duration-300"><i className="fa-solid fa-arrow-left"></i> Home</button>
          </Link>
          <div className="relative text-center px-4 flex flex-col mt-4 items-center">
            <h3 className="text-gray-400 md:text-xl">Welcome back your next adventure on two wheels awaits!</h3>
          </div>


          <div className="flex flex-col gap-y-3 px-6 md:px-8 xl:px-12">
            <div className="flex flex-col gap-y-1">
              <label htmlFor="userContactNumber">Contact Number <sup>*</sup></label>
              <input type="tel" value={formData.userContactNumber} onChange={handleChange} placeholder="0000000000" className="border-2 focus:outline-none border-gray-300 rounded-md py-1.5 px-3" name="userContactNumber" id="userContactNumber" required />
            </div>
            <div className="flex flex-col gap-y-1">
              <label htmlFor="password">Password <sup>*</sup></label>
              <input type="password" value={formData.password} onChange={handleChange} placeholder="Ex. XXXXXXX" className="border-2 focus:outline-none border-gray-300 rounded-md py-1.5 px-3" name="password" id="password" required />
            </div>
            <div className="flex flex-col gap-y-3 mt-3">
              <button type="submit" className="bg-black cursor-pointer text-white px-4 py-2 font-semibold rounded-md hover:bg-black/90 transition-colors duration-300">Login</button>
              {showError &&
              <p className="text-sm md:text-base text-center text-red-600">
                {error || "Something went wrong"}
              </p>
              }
              <p className="text-center">Don't have an account ?
                <Link to={"/signup"}>
                  <span className="underline ml-1 hover:text-slate-900/70 transition-colors duration-200">Signup</span>
                </Link>
              </p>
            </div>
          </div>
        </form>

      </div>
    </div>
  );
}

export default Signin