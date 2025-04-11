import React, { useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import GeneralQuestions from "../GeneralQuestions/GeneralQuestions.jsx";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
import UserContext from "../../contexts/user/user.context.js";

function Home() {
  const location = useLocation();
  const [successMessage, setSuccessMessage] = useState("");
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [error, setError] = useState("");
  const [errorMessage, setErrorMessage] = useState(false);
  const { user } = useContext(UserContext);

  const [pickupDate, setPickupDate] = useState(new Date(new Date().getTime() + 60 * 60 * 1000));
  const [dropoffDate, setDropoffDate] = useState(
    new Date(pickupDate.getTime() + 24 * 60 * 60 * 1000)
  );

  const handlePickupChange = (date) => {
    setPickupDate(date);
    setDropoffDate(new Date(date.getTime() + (24 * 60 * 60 * 1000)));
  };

  const pickupMinTime = new Date(pickupDate);
  pickupMinTime.setHours(9, 0, 0);
  const pickupMaxTime = new Date(pickupDate);
  pickupMaxTime.setHours(19, 0, 0);

  const dropoffMinTime = new Date(dropoffDate);
  dropoffMinTime.setHours(9, 0, 0);
  const dropoffMaxTime = new Date(dropoffDate);
  dropoffMaxTime.setHours(19, 0, 0);

  const navigate = useNavigate();


  useEffect(() => {
    if (location.state?.successMessage) {
      setSuccessMessage(location.state.successMessage);
      setShowSuccessMessage(true);
      navigate(location.pathname, { replace: true });

      setTimeout(() => {
        handleSetShowSuccessMessage();
      }, 2000);
    }

    if (location.state?.logoutMessage) {
      setSuccessMessage(location.state.logoutMessage);
      setShowSuccessMessage(true);
      navigate(location.pathname, { replace: true });

      setTimeout(() => {
        handleSetShowSuccessMessage();
      }, 2000);
    }

    if (location.state?.bookingSuccess) {
      setSuccessMessage(location.state.bookingSuccess);
      setShowSuccessMessage(true);
      navigate(location.pathname, { replace: true });

      setTimeout(() => {
        handleSetShowSuccessMessage();
      }, 7000);
    }
  }, [location]);

  useEffect(() => {
    if (error) {
      setTimeout(() => {
        setErrorMessage(false);
      }, 5000);
    }
  }, [error])

  const handleSetShowSuccessMessage = () => {
    setShowSuccessMessage(false);
    setTimeout(() => {
      setSuccessMessage("");
    }, 200);
  };

  const handleRentNow = async (e) => {
    e.preventDefault();

    if (!user) {
      navigate("/signin", {
        state: {
          LogIn: "Your must be log in to rent a bike"
        }
      })
      return;
    }

    try {

      if (error) {
        setError("")
      }

      const response = await axios.post(`${import.meta.env.VITE_API_URL}/bikes/search`, { pickupDate, dropoffDate })

      if (response.status === 200) {
        const pickupISO = pickupDate.toISOString();
        const dropoffISO = dropoffDate.toISOString();
        console.log("Response : " , response.data.data)
        navigate(`/bikes?pickupDate=${encodeURIComponent(pickupISO)}&dropoffDate=${encodeURIComponent(dropoffISO)}`)
      }
    } catch (error) {

      console.log(error)

      if (error?.response) {
        if (error.response.data.error.statusCode === 401) {
          navigate("/signin", {
            state: {
              SessionExpired: "Your session is expired. Please Login"
            }
          })
          return;
        }

        if (error.response || error.response.data.message) {
          setError(error.response.data.message)
          setErrorMessage(true)
        }
      } else {
        setError("Something went wrong. Please try again")
      }
    }
  }


  return (
    <main>
      {/* Hero Image */}
      <div className="relative flex flex-col-reverse lg:flex-row justify-center lg:gap-x-2 bg-black pt-10 pb-20 lg:px-25 lg:py-20 text-white">
        <div className="w-full lg:w-[50%] p-2 lg:p-0 flex flex-col justify-center gap-y-3">
          <h1 className="text-3xl md:text-4xl font-bold py-2 w-full text-center ">
            Explore the City on Two Wheels
          </h1>
          <h3 className="text-lg md:text-xl text-gray-400 w-full text-center">
            Affordable and convenient bike rentals at your fingertips.
          </h3>
          <div className="w-full flex justify-center gap-x-4 md:gap-x-0">
            {/* <Link to={"/bikes"}>
              <button
                type="submit"
                className="bg-white text-black font-semibold rounded-md text-base lg:text-lg px-6 py-2 lg:px-8 focus:outline-none cursor-pointer"
              >
                Search
              </button>
            </Link> */}

            {!user && (
              <Link to={"/signup"}>
                <button className="bg-white text-black font-semibold rounded-md py-2 px-4 flex items-center gap-x-2 focus:outline-none md:hidden">
                  Get Started <i className="fa-solid fa-arrow-right"></i>
                </button>
              </Link>
            )}
          </div>
        </div>
        <div className="md:w-8/10 md:mx-auto lg:w-1/2 flex  justify-center items-center">
          <img
            src="src\assets\HomeBikesImage1.png"
            alt="Image not found"
          />
        </div>

        <div
          className={`absolute min-w-full md:py-1 lg:py-2  ${showSuccessMessage  ? '-translate-y-0 -top-0' : '-translate-y-full -top-1'} transform transition-all duration-500 ease-linear`}
        >
          <div className="w-full md:w-1/2 bg-white md:mx-auto text-black px-4 py-1 lg:py-2 align text-center text-sm md:rounded-md md:text-base xl:text-lg">
            {successMessage}
          </div>
        </div>


      </div>


      {/* Floating Bike Searching Form */}
      <div className="bg-white relative flex-col w-9/10 md:w-7/10 lg:w-4/5 mx-auto flex -translate-y-18 items-center rounded-lg shadow-2xl">
        <div className="rounded-lg w-full p-5 flex-col flex lg:flex-row lg:items-start gap-y-4 lg:gap-x-4 text-black ">
          {/* Pick-Up Date Picker */}
          <div className="flex flex-col gap-y-2 w-full lg:w-[40%]">
            <label htmlFor="pickup" className="font-semibold text-bas  lg:text-lg flex items-center gap-x-2">
              <i className='fa-regular fa-calendar'></i>Pick-Up
            </label>
            <DatePicker
              name="pickup"
              toggleCalendarOnIconClick
              id="pickup"
              selected={pickupDate}
              onChange={handlePickupChange}
              showTimeSelect
              dateFormat="MMMM d, yyyy h:00 aa"
              closeOnScroll
              timeFormat="HH:00 aa"
              timeIntervals={60}
              minTime={pickupMinTime}
              maxTime={pickupMaxTime}
              className="w-full border-2 rounded-md text-base  lg:text-lg p-2 cursor-pointer hover:border-gray-500 transition-colors duration-300 focus:outline-none focus:border-gray-500"
              onFocus={(e) => e.target.readOnly = true}
              required
            />
          </div>
          {/* Drop-Off Date Picker */}
          <div className="flex flex-col gap-y-2 w-full lg:w-[40%]">
            <label htmlFor="dropoff" className="font-semibold text-base  lg:text-lg flex items-center gap-x-2">
              <i className='fa-regular fa-calendar'></i>Drop-Off
            </label>
            <DatePicker
              name="dropoff"
              id="dropoff"
              toggleCalendarOnIconClick
              selected={dropoffDate}
              onChange={setDropoffDate}
              showTimeSelect
              dateFormat="MMMM d, yyyy h:00 aa"
              closeOnScroll
              timeFormat="HH:00 aa"
              timeIntervals={60}
              minTime={dropoffMinTime}
              maxTime={dropoffMaxTime}
              className="w-full border-2 rounded-md text-base  lg:text-lg p-2 cursor-pointer hover:border-gray-500 transition-colors duration-300 focus:border-gray-500 focus:outline-none"
              onFocus={(e) => e.target.readOnly = true}
              required
            />
          </div>
          {/* Submit Button */}
          <button
            onClick={handleRentNow}
            className="relative lg:w-[20%] self-center lg:self-end bg-black text-white font-semibold rounded-md text-base lg:text-lg px-6 py-2 lg:px-2 cursor-pointer hover:bg-black/90 transition-colors duration-300"
          >
            Search
          </button>
        </div>
        <div
          className={`text-red-600 w-full  text-center flex justify-center items-center text-xs md:text-sm lg:text-base pb-2
          ${errorMessage ? "block" : "hidden"}`}
        >
          {error}
        </div>
      </div>

      {/* Rent Bike */}
      <div className="flex flex-col items-center lg:flex-row w-full mb-20 lg:mb-40">
        <div className="w-8/10 md:w-7/10 lg:w-4/10 flex items-center ">
          <img
            src="src\assets\BikeRentImage.jpg"
            alt="Image not found"
            className="object-cover w-[100%]"
          />
        </div>
        <div className="w-[80%] md:w-7/10 lg:w-[60%] flex flex-col justify-center items-center lg:items-start gap-y-3 lg:gap-y-4 py-5 lg:px-10">
          <h1 className="text-3xl lg:text-4xl font-semibold text-center lg:text-left">
            Rent A bike
          </h1>
          <p className="text-justify">
            Booking a bike through our system is simple, fast, and hassle-free.
            With a user-friendly interface, you can easily browse available
            bikes, select your desired pickup and drop-off locations, and
            confirm your booking in minutes. Our platform ensures transparent
            pricing and flexible rental options tailored to your needs. Whether
            it's a quick commute or a weekend adventure, we've got you covered!
          </p>
          {/* <Link to={"/bikes"}>
            <button
              type="submit"
              className=" bg-black text-white font-semibold rounded-md text-base lg:text-lg px-6 py-2 lg:px-8 focus:outline-none hover:bg-black/90 transition-colors duration-300 cursor-pointer"
            >
              Search
            </button>
          </Link> */}
        </div>
      </div>

      {/* Why Chooose Us ? */}
      <div className="mb-30 p-4 lg:p-10 flex flex-col gap-y-8 lg:gap-y-0 bg-gray-50">
        <h1 className="w-full text-center lg:p-2 text-3xl lg:text-4xl font-semibold">
          Why Rent With Us ?
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4 lg:p-10 text-center">
          <div className="p-1 flex flex-col gap-y-2">
            <i className="fa-solid fa-motorcycle text-3xl lg:text-4xl"></i>
            <h3 className="font-semibold lg:text-lg">
              Wide Selection of Bikes
            </h3>
            <p className="text-center text-sm lg:text-center lg:text-base">
              Looking for a particular brand or location? We have probably got
              it.
            </p>
          </div>
          <div className="p-1 flex flex-col gap-y-2">
            <i className="fa-solid fa-money-bill text-3xl lg:text-4xl"></i>
            <h3 className="font-semibold lg:text-lg">Affordable Pricing</h3>
            <p className="text-center text-sm lg:text-center lg:text-base">
              Enjoy clear and budget-friendly pricing with no hidden fees.
            </p>
          </div>
          <div className="p-1 flex flex-col gap-y-2">
            <i className="fa-solid fa-circle-check text-3xl lg:text-4xl"></i>
            <h3 className="font-semibold lg:text-lg">
              Seamless Booking Process
            </h3>
            <p className="text-center text-sm lg:text-center lg:text-base">
              Book a bike quickly and easily on our user-friendly platform.
            </p>
          </div>
          <div className="p-1 flex flex-col gap-y-2">
            <i className="fa-solid fa-screwdriver-wrench text-3xl lg:text-4xl"></i>
            <h3 className="font-semibold lg:text-lg">Well-Maintained Bikes</h3>
            <p className="text-center text-sm lg:text-center lg:text-base">
              Ride with confidence our bikes are regularly serviced for safety.
            </p>
          </div>
          <div className="p-1 flex flex-col gap-y-2">
            <i className="fa-solid fa-headset text-3xl lg:text-4xl"></i>
            <h3 className="font-semibold lg:text-lg">24*7 At Service</h3>
            <p className="text-center text-sm lg:text-center lg:text-base">
              Get assistance anytime with our dedicated support team.
            </p>
          </div>
          <div className="p-1 flex flex-col gap-y-2">
            <i className="fa-solid fa-map-location-dot text-3xl lg:text-4xl"></i>
            <h3 className="font-semibold lg:text-lg">Easy Transfers</h3>
            <p className="text-center text-sm lg:text-center lg:text-base">
              Convenient locations for hassle-free bike pickup and return.
            </p>
          </div>
        </div>
      </div>

      {/* Steps for bike renting */}
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-between mb-20 lg:mb-30">
        <div className="text-center flex flex-col gap-y-2 lg:gap-y-4">
          <h3 className="text-3xl xl:text-4xl leading-normal font-semibold">
            How to book your ride?
          </h3>
          <p className="text-sm md:text-base lg:text-lg">
            Book your dream ride in just four simple steps
          </p>
        </div>

        <div className="mt-10 md:mt-20">
          <ul className="md:grid md:grid-cols-4  md:col-gap-10 md:row-gap-10 bg-gray-50">
            <li className="p-2 md:p-5 lg:pb-10 text-center relative">
              <div className=" flex flex-col items-center">
                <div className="md:absolute md:top-0 md:-translate-y-1/2">
                  <div className="flex items-center justify-center w-20 h-20 rounded-full bg-black text-white border-4 border-white text-2xl font-semibold">
                    <i className="fa-solid fa-magnifying-glass"></i>
                  </div>
                </div>
                <div className="mt-2 md:mt-14 lg:mt-8">
                  <h4 className="lg:text-lg font-semibold text-gray-900">
                    Select Your Bike
                  </h4>
                  <p className="mt-2 text-sm lg:text-base text-gray-500">
                    Choose from a variety of bikes that suit your needs.
                  </p>
                </div>
              </div>
            </li>
            <li className="p-2 md:p-5  lg:pb-10 text-center relative">
              <div className=" flex flex-col items-center">
                <div className="md:absolute md:top-0 md:-translate-y-1/2">
                  <div className="flex items-center justify-center h-20 w-20 rounded-full bg-black text-white border-4 border-white text-2xl font-semibold">
                    <i className="fa-regular fa-calendar-check"></i>
                  </div>
                </div>
                <div className="mt-2 md:mt-14 lg:mt-8">
                  <h4 className="lg:text-lg font-semibold text-gray-900">
                    Date & Duration
                  </h4>
                  <p className="mt-2 text-sm lg:text-base text-gray-500">
                  Choose your rental period: hourly, daily, or extended.
                  </p>
                </div>
              </div>
            </li>
            <li className="p-2 md:p-5  lg:pb-10 text-center relative">
              <div className=" flex flex-col items-center">
                <div className="md:absolute md:top-0 md:-translate-y-1/2">
                  <div className="flex items-center justify-center h-20 w-20 rounded-full bg-black text-white border-4 border-white text-2xl font-semibold">
                    <i className="fa-solid fa-wallet"></i>
                  </div>
                </div>
                <div className="mt-2  md:mt-14 lg:mt-8">
                  <h4 className="lg:text-lg font-semibold text-gray-900">
                    Make Payment
                  </h4>
                  <p className="mt-2 text-sm lg:text-base text-gray-500">
                    Complete your booking securely with easy payment options.
                  </p>
                </div>
              </div>
            </li>
            <li className="p-2 md:p-5  lg:pb-10 text-center relative">
              <div className=" flex flex-col items-center">
                <div className="md:absolute md:top-0 md:-translate-y-1/2">
                  <div className="flex items-center justify-center h-20 w-20 rounded-full bg-black text-white border-4 border-white text-2xl font-semibold">
                    <i className="fa-solid fa-person-biking"></i>
                  </div>
                </div>
                <div className="mt-2 md:mt-14 lg:mt-8">
                  <h4 className="lg:text-lg font-semibold text-gray-900">
                    Pickup & Ride
                  </h4>
                  <p className="mt-2 text-sm lg:text-base text-gray-500">
                    Collect your bike from the location and enjoy your ride!
                  </p>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>

      {/* General Question */}
      <GeneralQuestions />
    </main>
  );
}

export default Home;
