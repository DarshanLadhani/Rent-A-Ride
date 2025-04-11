import axios from "axios";
import React, { useContext } from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { X } from "lucide-react";
import UserContext from "../../../contexts/user/user.context.js";

function Signup() {
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    userContactNumber: "",
  });

  const [error, setError] = useState("")
  const [showError, setShowError] = useState(false)

  useEffect(() => {
    if (error) {
      setShowError(true);

      setTimeout(() => {
        handleCloseError()
      }, 5000);
    }
  }, [error]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCloseError = () => {
    setShowError(false);
    setTimeout(() => {
      setError("")
    }, 300);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      userContactNumber: "",
    })

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/users/register`,
        formData
      );
      if (response.status === 201 && response.statusText === "Created") {
        setUser(response.data.data)
        navigate("/", {
          state: {
            successMessage: "Registration successful! Welcome aboard.",
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
      <div className="bg-white shadow-2xl rounded-md flex w-9/10 md:w-7/10">
        <img className="hidden w-1/2 rounded-tl-md rounded-bl-md xl:block" src="src\assets\manBike2.jpg" alt="" />
        <form onSubmit={handleSubmit} className="relative w-full xl:w-1/2 py-5 flex flex-col justify-center gap-y-4">
          <Link to={"/"}>
            <button className="bg-black cursor-pointer px-2 py-1 flex gap-x-2 justify-center items-center text-white absolute rounded-tr-md top-0 right-0 hover:bg-black/90 transition-colors duration-300"><i class="fa-solid fa-arrow-left"></i> Home</button>
          </Link>
          <div className="relative flex flex-col mt-4 items-center">
            <h3 className="text-gray-400 md:text-lg">We'de love to have you on board</h3>
          </div>

          <div className="flex flex-col gap-y-3 px-6 md:px-8 xl:px-12">
            <div className="flex flex-col gap-y-1">
              <label htmlFor="firstName">First Name <sup>*</sup></label>
              <input type="text" value={formData.firstName} onChange={handleChange} placeholder="Ex. Darshan" className="border-2 focus:outline-none focus:bg-none border-gray-300 rounded-md py-1.5 px-3" name="firstName" id="firstName" required />
            </div>
            <div className="flex flex-col gap-y-1">
              <label htmlFor="lastName">Last Name</label>
              <input type="text" value={formData.lastName} onChange={handleChange} placeholder="Ex. Ladhani" className="border-2 focus:outline-none border-gray-300 rounded-md py-1.5 px-3" name="lastName" id="lastName" required />
            </div>
            <div className="flex flex-col gap-y-1">
              <label htmlFor="lastName">Email <sup>*</sup></label>
              <input type="email" value={formData.email} onChange={handleChange} placeholder="Ex. Darshan@gmail.com" className="border-2 focus:outline-none border-gray-300 rounded-md py-1.5 px-3" name="email" id="email" required />
            </div>
            <div className="flex flex-col gap-y-1">
              <label htmlFor="password">Password <sup>*</sup></label>
              <input type="password" value={formData.password} onChange={handleChange} placeholder="Ex. XXXXXXX" className="border-2 focus:outline-none border-gray-300 rounded-md py-1.5 px-3" name="password" id="password" required />
            </div>
            <div className="flex flex-col gap-y-1">
              <label htmlFor="userContactNumber">Contact Number <sup>*</sup></label>
              <input type="tel" value={formData.userContactNumber} onChange={handleChange} placeholder="0000000000" className="border-2 focus:outline-none border-gray-300 rounded-md py-1.5 px-3" name="userContactNumber" id="userContactNumber" required />
            </div>
            <div className="flex flex-col gap-y-3 mt-3">
              <button type="submit" className="bg-black cursor-pointer text-white px-4 py-2 font-semibold rounded-md hover:bg-black/90 transition-colors duration-300">Sign Up</button>
              {showError &&
              <p className="text-xs md:text-base text-center text-red-600">
                {error || "Something went wrong"}
              </p>
              }
              <p className="text-center">Already Have an account ?
                <Link to={"/signin"}>
                  <span className="underline ml-1 hover:text-slate-900/70 transition-colors duration-200">Signin</span>
                </Link>
              </p>
            </div>
          </div>
        </form>

      </div>
      {/* {showError && (
        <div className="fixed top-5 left-1/2 transform -translate-x-1/2 w-[90%] md:w-[50%] lg:w-[40%] bg-red-200 text-red-600 px-4 py-2 rounded-md flex justify-between items-center shadow-lg transition-all duration-300 ease-in-out">
          <p className="text-sm md:text-base w-[85%] text-center">
            {error || "Something went wrong while registering the user"}
          </p>
          <button className="text-red-600 cursor-pointer" onClick={handleCloseError}>
            <X size={24} />
          </button>
        </div>
      )} */}

    </div>
  );
}

export default Signup;
