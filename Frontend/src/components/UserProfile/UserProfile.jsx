import React, { useEffect, useLayoutEffect, useState } from 'react'
import UserContext from '../../contexts/user/user.context'
import { useContext } from 'react'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

function UserProfile() {
  const { user, setUser } = useContext(UserContext)
  const [bookings, setBookings] = useState(null);
  const [isLoading, setIsLoading] = useState(true)
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
  const [isConfirmBookingOpen, setConfirmBookingOpen] = useState(true);
  const [isPendingBookingOpen, setPendingBookingOpen] = useState(false);
  const [isCancelledBookingOpen, setCancelledBookingOpen] = useState(false);

  const dateOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }

  const timeOptions = {
    hour: 'numeric',
    minute: 'numeric'
  }


  useEffect(() => {
    async function getBookings() {
      const Bookings = await axios.get(`${import.meta.env.VITE_API_URL}/users/getBookings`)

      if (Bookings.data.data !== null) {
        setBookings(Bookings.data.data)
      }


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

  console.log("Bookings : ", bookings)


  return (
    <div>
      <div className='  p-2  flex flex-col md:flex-row w-full gap-y-5 md:gap-x-3 justify-center items-start'>
        <div className='border-2 p-2 rounded-md border-gray-200 w-full md:w-3/10  xl:w-1/4 flex flex-col gap-y-5 md:flex-col md:gap-y-3'>
          <div className='w-full'>
            <div className='p-2 md:p-0 lg:p-5 flex justify-center'>
              <img src="src\assets\15.jpg " className='w-40 h-40 lg:w-50 lg:h-50 object-contain rounded-full' alt="" />
            </div>
            <div className='text-xl md:mt-1 lg:mt-0 text-center font-medium'>{user?.firstName + " " + user?.lastName}</div>
          </div>
          <div className='py-2 w-full'>
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
          isDashBoardOpen && (bookings === null ?
            <div className='border-2 py-4 px-6 rounded-md border-gray-200 w-full md:w-7/10 lg:w-7/10'>
              <div className='w-full py-4 lg:p-12 flex flex-col items-center gap-y-6'>
                <i className="fa-regular fa-file-excel text-7xl md:text-8xl text-gray-600"></i>
                <p className='text-center text-sm md:text-lg xl:text-lg'>{"Hey " + user?.firstName + " ready for your first ride? Explore our bikes now!"}</p>
                <Link to={"/"}>
                  <button className='w-full bg-black text-white px-3 py-1.5 md:px-4 md:py-2 rounded-md cursor-pointer font-medium hover:bg-black/90 transition-colors duration-300'>Book a ride</button>
                </Link>
              </div>
            </div>
            :
            <div className=' border-2 rounded-md border-gray-200 w-full md:w-7/10   flex flex-col'>
              <h1 className='text-lg lg:text-xl p-4 md:text-3xl text-center md:text-start font-medium sticky left-0 xl:static'>My Bookings</h1>
              <ul className='flex gap-x-4 px-4 py-2 text-sm justify-center md:justify-start sticky top-0 border-b'>
                <li onClick={() => {
                  setConfirmBookingOpen(true)
                  setPendingBookingOpen(false)
                  setCancelledBookingOpen(false)
                }} className={`cursor-pointer rounded-md flex gap-x-3 items-center  px-4 py-2 ${isConfirmBookingOpen ? 'bg-black text-white' : 'text-black'}`}>Confirm</li>
                <li onClick={() => {
                  setConfirmBookingOpen(false)
                  setPendingBookingOpen(true)
                  setCancelledBookingOpen(false)
                }} className={`cursor-pointer rounded-md flex gap-x-3 items-center  px-4 py-2 ${isPendingBookingOpen ? 'bg-black text-white' : 'text-black'}`}>Pending</li>
                <li onClick={() => {
                  setConfirmBookingOpen(false)
                  setPendingBookingOpen(false)
                  setCancelledBookingOpen(true)
                }} className={`cursor-pointer rounded-md flex gap-x-3 items-center  px-4 py-2 ${isCancelledBookingOpen ? 'bg-black text-white' : 'text-black'}`}>Cancelled</li>
              </ul>
              {
                isConfirmBookingOpen &&
                (
                  <div className='py-2 px-2 md:px-4 h-[500px] md:h-[600px] overflow-y-auto flex flex-col gap-y-4 text-[10px] sm:text-sm xl:text-base'>
                    {bookings?.confirmBookings.length === 0 ?
                      <div>No Orders</div>
                      :
                      bookings.confirmBookings.map((booking) => (
                        <div key={booking._id} className='bg-gray-100 border-gray-400 rounded-xs border-2'>
                          <div className='border-b flex flex-col gap-y-0.5 md:gap-y-1 border-b-gray-900/50 px-1 pt-1 sm:px-2 sm:pt-2 md:px-4'>
                            <div className='flex justify-between gap-x-2'>
                              <div className='w-1/4 flex justify-center '>
                                <img src={booking.bikeImage} alt={booking.bikeName} className='h-16 sm:h-18 md:h-20 lg:h-22 xl:h-24' />
                              </div>
                              <div className='flex flex-col gap-y-1 sm:gap-y-2 items-center justify-center w-3/4'>
                                <div className='flex justify-center  items-center gap-x-2'>
                                  <h3 className='text-sm sm:text-base md:text-lg xl:text-xl font-medium text-center'>{booking.bikeCompanyName + " " + booking.bikeName + " " + booking.bikeModelName}</h3>
                                  <button className='text-sm sm:text-base md:text-lg xl:text-xl'><i className="fa-solid fa-circle-chevron-right"></i></button>
                                </div>
                                <div className='flex items-center w-full  justify-evenly'>
                                  <p>Booking ID : #127896</p>
                                  <p>Total Amount : {booking.totalAmount}</p>
                                </div>
                              </div>
                            </div>
                            <div className='flex justify-between w-full items-center'>
                              <p className='flex flex-row  gap-x-1 items-center justify-center  p-1 w-fit'>
                                <span>
                                  {new Date(booking.pickupDateTime).toLocaleDateString('en-US')}
                                </span>
                                <span>
                                  {new Date(booking.pickupDateTime).toLocaleTimeString('en-US', timeOptions)}
                                </span>
                              </p>
                              
                              <p className='flex gap-x-1'>
                                <p>
                                  <span>
                                    {booking.totalDays} Day , 23 Hour
                                  </span>
                                  {booking.remainingHours > 0 && <span>, {bookBikeDetails?.remainingHours} Hours</span>}
                                </p>
                              </p>
                              <p className='flex flex-row gap-x-1 items-center p-1 w-fit'>
                                <span>
                                  {new Date(booking.pickupDateTime).toLocaleDateString('en-US')}
                                </span>
                                <span>
                                  {new Date(booking.pickupDateTime).toLocaleTimeString('en-US', timeOptions)}
                                </span>
                              </p>
                            </div>
                          </div>
                          <div className='flex flex-col gap-y-1 py-1 px-2'>
                            <p className='text-center'>Pickup & Dropoff At</p>
                            <p className='w-full text-center'>{booking.store} , Yagnik Road , street no 8</p>
                          </div>
                        </div>

                      ))
                    }
                  </div>
                )
              }
              {
                isPendingBookingOpen &&
                (
                  <div className='py-2 px-2 md:px-4 h-[500px] md:h-[600px] flex flex-col gap-y-4 text-[10px] sm:text-sm xl:text-base'>
                    {bookings?.pendingBookings.length === 0 ?
                      <div>No Orders</div>
                      :
                      bookings.pendingBookings.map((booking) => (
                        <div key={booking._id} className='bg-gray-100 border-gray-400 rounded-xs border-2'>
                          <div className='border-b flex flex-col gap-y-0.5 md:gap-y-1 border-b-gray-900/50 px-1 pt-1 sm:px-2 sm:pt-2 md:px-4'>
                            <div className='flex justify-between gap-x-2'>
                              <div className='w-1/4 flex justify-center '>
                                <img src={booking.bikeImage} alt={booking.bikeName} className='h-16 sm:h-18 md:h-20 lg:h-22 xl:h-24' />
                              </div>
                              <div className='flex flex-col gap-y-1 sm:gap-y-2 items-center justify-center w-3/4'>
                                <div className='flex justify-center  items-center gap-x-2'>
                                  <h3 className='text-sm sm:text-base md:text-lg xl:text-xl font-medium text-center'>{booking.bikeCompanyName + " " + booking.bikeName + " " + booking.bikeModelName}</h3>
                                  <button className='text-sm sm:text-base md:text-lg xl:text-xl'><i class="fa-solid fa-circle-chevron-right"></i></button>
                                </div>
                                <div className='flex items-center w-full  justify-evenly'>
                                  <p>Booking ID : #127896</p>
                                  <p>Total Amount : {booking.totalAmount}</p>
                                </div>
                              </div>
                            </div>
                            <div className='flex justify-between w-full items-center'>
                              <p className='flex flex-row  gap-x-1 items-center justify-center  p-1 w-fit'>
                                <span>
                                  {new Date(booking.pickupDateTime).toLocaleDateString('en-US')}
                                </span>
                                <span>
                                  {new Date(booking.pickupDateTime).toLocaleTimeString('en-US', timeOptions)}
                                </span>
                              </p>
                              
                              <p className='flex gap-x-1'>
                                <p>
                                  <span>
                                    {booking.totalDays} Day , 23 Hour
                                  </span>
                                  {booking.remainingHours > 0 && <span>, {bookBikeDetails?.remainingHours} Hours</span>}
                                </p>
                              </p>
                              <p className='flex flex-row gap-x-1 items-center p-1 w-fit'>
                                <span>
                                  {new Date(booking.pickupDateTime).toLocaleDateString('en-US')}
                                </span>
                                <span>
                                  {new Date(booking.pickupDateTime).toLocaleTimeString('en-US', timeOptions)}
                                </span>
                              </p>
                            </div>
                          </div>
                          <div className='flex flex-col gap-y-1 py-1 px-2'>
                            <p className='text-center'>Pickup & Dropoff At</p>
                            <p className='w-full text-center'>{booking.store} , Yagnik Road , street no 8</p>
                          </div>
                        </div>

                      ))
                    }
                  </div>
                )
              }


            </div>

          )
        }

        {
          isMyProfile &&
          <div className='border-2 py-4 px-6 rounded-md border-gray-200 w-full md:w-9/10 lg:w-7/10'>
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