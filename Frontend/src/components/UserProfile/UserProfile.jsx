import React, { useEffect, useState } from 'react'
import UserContext from '../../contexts/user/user.context'
import { useContext } from 'react'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

function UserProfile() {
  const { user, setUser } = useContext(UserContext)
  const [bookings, setBookings] = useState(null);
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    firstName: user?.firstName,
    lastName: user?.lastName,
    email: user?.email,
    userContactNumber: user?.userContactNumber,
    password: "",
  });

  const [responseMessage, setResponseMessage] = useState("")
  const [showResponseMessage, setShowResponseMessage] = useState(false)

  const [isDashBoardOpen, setDashBoardOpen] = useState(true);
  const [isMyProfile, setMyProfile] = useState(false);


  useEffect(() => {
    async function getBookings() {
      const Bookings = await axios.get(`${import.meta.env.VITE_API_URL}/users/getBookings`)
      setBookings(Bookings.data.data)
      console.log(Bookings)
    }
    

    getBookings()
  }, [])

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        userContactNumber: user.userContactNumber,
        password: "",
      });
    }
  }, [user]);

  useEffect(() => {
    setTimeout(() => {
      setShowResponseMessage(false);
    }, 5000);
  }, [responseMessage])

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.patch(
        `${import.meta.env.VITE_API_URL}/users/updateaccountdetails`,
        formData
      );

      if (response.status === 200 && response.statusText === "OK") {
        setResponseMessage(response.data.message)
        setShowResponseMessage(true)
      }

    } catch (error) {
      if (error.response || error.message.data.message) {
        setResponseMessage(error.response.data.message)
        setShowResponseMessage(true)
      } else {
        setResponseMessage("Something went wrong. Please try again")
        setShowResponseMessage(true)
      }
    }
  };

  const handleLogout = async () => {

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/users/logout`)

      if (response.status === 200 && response.statusText === "OK") {
        setUser(null)
        navigate("/", {
          state: {
            logoutMessage: "User Logout Successfully",
          }
        })
      }

    } catch (error) {

      if (error.response || error.message.data.message) {
        setResponseMessage(error.response.data.message)
        setShowResponseMessage(true)
      } else {
        setResponseMessage("Something went wrong. Please try again")
        setShowResponseMessage(true)
      }
    }
  }


  return (
    <div>
      <div className='bg-slate-950 flex justify-between items-center p-2 md:px-8 lg:px-12 xl:px-20 w-full'>
        <div>
          <img src="src/assets/11.png" className="w-25 md:w-30 md:h-35 lg:w-40 lg:h-45 object-contain" />
        </div>
        <h1 className='text-2xl md:text-3xl lg:text-5xl text-white'>My Dashboard</h1>
        <div>
          <img src="src/assets/13.png" className=" hidden md:block md:w-45 md:h-35 lg:w-50 lg:h-40 xl:w-70 xl:h-50 object-contain" alt="Logo" />
        </div>
      </div>
      <div className='p-4 md:p-10 lg:p-10 flex flex-col lg:flex-row w-full gap-y-5 md:gap-x-5 justify-center items-center lg:items-start'>
        <div className='border-2 p-2 rounded-md border-gray-200 w-full md:w-9/10 md:mx-auto md:items-center lg:mx-0 lg:w-4/10 xl:w-1/4 h-full flex flex-col gap-y-5 md:flex-row lg:flex-col lg:gap-y-3'>
          <div className='md:w-1/2 lg:w-full'>
            <div className='p-2 md:p-0 lg:p-5 flex justify-center'>
              <img src="src\assets\15.jpg " className='w-40 h-40 lg:w-50 lg:h-50 object-contain rounded-full' alt="" />
            </div>
            <div className='text-xl md:mt-1 lg:mt-0 text-center font-medium'>{user?.firstName + " " + user?.lastName}</div>
          </div>
          <div className='py-2 md:w-1/2 lg:w-full'>
            <ul className='flex flex-col gap-y-3 px-5 md:px-0'>
              <li onClick={() => {
                setDashBoardOpen(true)
                setMyProfile(false)
              }} className={`cursor-pointer rounded-md flex gap-x-3 items-center  px-4 py-2 text-lg font-medium ${isDashBoardOpen ? 'bg-black text-white' : 'text-black'}`}><i className="fa-solid fa-house"></i>Dashboard</li>
              <li onClick={() => {
                setDashBoardOpen(false)
                setMyProfile(true)
              }} className={`cursor-pointer rounded-md flex gap-x-3 items-center  px-4 py-2 text-lg font-medium ${isMyProfile ? 'bg-black text-white' : 'text-black'}`}><i className="fa-solid fa-user"></i>My Profile</li>
              <li onClick={handleLogout} className='cursor-pointer rounded-md flex gap-x-3 items-center px-4 py-2 text-lg font-medium'><i className="fa-solid fa-arrow-right-to-bracket"></i>Logout</li>
            </ul>
          </div>
        </div>
        {
          isDashBoardOpen && (bookings?.length === 0 ? 
              <div className='border-2 py-4 px-6 rounded-md border-gray-200 w-full md:w-9/10 lg:w-6/10'>
                  <div className='w-full py-4 lg:p-12 flex flex-col items-center gap-y-6'>
                    <i className="fa-regular fa-file-excel text-7xl md:text-8xl text-gray-600"></i>
                    <p className='text-center text-sm md:text-lg xl:text-lg'>{"Hey " + user?.firstName + " ready for your first ride? Explore our bikes now!"}</p>
                    <Link to={"/"}>
                      <button className='w-full bg-black text-white px-3 py-1.5 md:px-4 md:py-2 rounded-md cursor-pointer font-medium hover:bg-black/90 transition-colors duration-300'>Book a ride</button> 
                    </Link>
                  </div>
              </div>
              : 
              <div className='border-2 py-4 px-6 rounded-md border-gray-200 w-full md:w-9/10 lg:w-fit overflow-x-scroll md:overflow-x-auto'>
                <h1 className='text-xl md:text-3xl text-center md:text-start font-medium sticky left-0 xl:static'>My Recent Bookings</h1>
                <table className="table-fixed border-separate border-spacing-y-3 md:border-spacing-y-4 text-gray-700 text-sm">
                  <thead>
                    <tr>
                      <th className="p-2 md:px-5 md:py-2 text-center whitespace-nowrap">Vehicle</th>
                      <th className="p-2 md:px-5 md:py-2 text-center whitespace-nowrap">Pickup Location</th>
                      <th className="p-2 md:px-5 md:py-2 text-center whitespace-nowrap">Pickup Date</th>
                      <th className="p-2 md:px-5 md:py-2 text-center whitespace-nowrap">Dropoff Date</th>
                      <th className="p-2 md:px-5 md:py-2 text-center whitespace-nowrap">Payment</th>
                      <th className="p-2 md:px-5 md:py-2 text-center whitespace-nowrap">Booking</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings?.map((booking) => (
                      <tr key={booking._id}>
                        <td className="p-2 md:px-4 md:py-2 whitespace-nowrap text-center">
                          {booking.bikeCompanyName + " " + booking.bikeName + " " + booking.bikeModelName}
                        </td>
                        <td className="p-2 md:px-4 md:py-2 whitespace-nowrap text-center">{booking.store}</td>
                        <td className="p-2 md:px-4 md:py-2 whitespace-nowrap text-center">
                          {new Date(booking.pickupDateTime).toLocaleDateString()}
                        </td>
                        <td className="p-2 md:px-4 md:py-2 whitespace-nowrap text-center">
                          {new Date(booking.dropoffDateTime).toLocaleDateString()}
                        </td>
                        <td className="p-2 md:px-4 md:py-2 whitespace-nowrap text-center">
                          <i className="fa-solid fa-indian-rupee-sign mr-1"></i>{booking.totalAmount}
                        </td>
                        <td className={`${booking.bookingStatus === "Confirm" ? 'bg-green-400' : 'bg-red-400'} text-white rounded-full text-center p-2 md:px-4 md:py-2 whitespace-nowrap`}>
                          {booking.bookingStatus}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
          )
        }

        {
          isMyProfile &&
          <div className='border-2 py-4 px-6 rounded-md border-gray-200 w-full md:w-9/10 lg:w-3/5'>
            <form>
              <div className="flex flex-col gap-y-4 md:gap-y-8">
                <div className='flex flex-col gap-y-4 md:flex-row md:justify-center md:gap-x-4 lg:gap-x-6'>
                  <div className="flex flex-col gap-y-2 w-full md:w-1/2">
                    <label htmlFor="firstName">First Name</label>
                    <input type="text" value={formData.firstName} onChange={handleChange} placeholder="Ex. Darshan" className="border-2 focus:outline-none focus:bg-none border-gray-300 rounded-md py-1.5 px-3" name="firstName" id="firstName" required />
                  </div>
                  <div className="flex flex-col gap-y-2 w-full md:w-1/2">
                    <label htmlFor="lastName">Last Name</label>
                    <input type="text" value={formData.lastName} onChange={handleChange} placeholder="Ex. Ladhani" className="border-2 focus:outline-none border-gray-300 rounded-md py-1.5 px-3" name="lastName" id="lastName" />
                  </div>
                </div>
                <div className='flex flex-col gap-y-4 md:flex-row md:justify-center md:gap-x-4 lg:gap-x-6'>
                  <div className="flex flex-col gap-y-2 w-full md:w-1/2">
                    <label htmlFor="lastName">Email</label>
                    <input type="email" value={formData.email} onChange={handleChange} placeholder="Ex. Darshan@gmail.com" className="border-2 focus:outline-none border-gray-300 rounded-md py-1.5 px-3" name="email" id="email" required />
                  </div>
                  <div className="flex flex-col gap-y-2 w-full md:w-1/2">
                    <label htmlFor="userContactNumber" className='flex gap-x-2 items-center'>Contact Number<span className='text-sm text-green-600 flex items-center gap-x-1'><i className="fa-solid fa-circle-check"></i>Verified</span></label>
                    <input type="tel" readOnly value={formData.userContactNumber} onChange={handleChange} placeholder="0000000000" className="border-2 focus:outline-none border-gray-300 rounded-md py-1.5 px-3" name="userContactNumber" id="userContactNumber" required />
                  </div>
                </div>
                <div className='w-full flex-col gap-y-2 flex lg:flex-row md:gap-x-4 lg:gap-x-6 items-center justify-start'>
                  <button type="submit" onClick={handleSubmit} className="bg-black w-2/4 md:w-4/10 lg:w-4/10 xl:w-1/4 cursor-pointer text-white px-2 md:px-4 lg:px-6 py-2 font-semibold rounded-md">Update Profile</button>
                  <div
                    className={`text-red-600 transition-opacity duration-300  w-full md:w-3/5 text-center xl:text-lg
                    ${showResponseMessage ? "opacity-100" : "opacity-0"}`}>
                    {responseMessage}
                  </div>
                </div>
              </div>
            </form>

          </div>
        }


      </div>
    </div>
  )
}

export default UserProfile