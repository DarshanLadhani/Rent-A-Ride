import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { load } from "@cashfreepayments/cashfree-js";

function BookBike() {
  const location = useLocation()
  const [bikeId, setBikeId] = useState(null);
  const [pickupAndDropoffDates, setPickupAndDropoffDates] = useState(null)
  const [bookBikeDetails, setBookBikeDetails] = useState(null)
  const [error, setError] = useState("");
  const [errorMessage, setErrorMessage] = useState(false);
  const navigate = useNavigate()

  const [orderId, setOrderId] = useState("");

  useEffect(() => {
    if (location.state) {
      localStorage.setItem('bookBikeState', JSON.stringify(location.state))
      setBikeId(location.state.bikeId)
      setPickupAndDropoffDates(location.state.dates)
    } else {
      const storedState = localStorage.getItem('bookBikeState');
      if (storedState) {
        const stateData = JSON.parse(storedState);
        setBikeId(stateData.bikeId);
        setPickupAndDropoffDates(stateData.dates);
      }
    }
  }, [location])

  useEffect(() => {
    if (!bikeId || !pickupAndDropoffDates) return;

    async function fetchBikes() {
      try {
        const response = await axios.post(`${import.meta.env.VITE_API_URL}/bikes/search/${bikeId}`, pickupAndDropoffDates)
        if (response.statusText === "OK") {
          setBookBikeDetails(response.data.data)
        }


      } catch (error) {
        console.log("Error : ", error)
      }
    }

    fetchBikes()
  }, [bikeId, pickupAndDropoffDates])


  useEffect(() => {
    setTimeout(() => {
      setErrorMessage(false);
    }, 5000);
  }, [error])


  const handleBookNow = async (e) => {
    e.preventDefault();

    try {

      const response = await axios.post(`${import.meta.env.VITE_API_URL}/booking/bookBike/${bikeId}`, { pickupDateTime: pickupAndDropoffDates.pickupDate, dropoffDateTime: pickupAndDropoffDates.dropoffDate, totalAmount: bookBikeDetails?.totalAmount , totalDays : bookBikeDetails?.totalDays , remainingHours : bookBikeDetails?.remainingHours })

      console.log("Bookings Response : " , response)

      if (response.statusText === "OK") {

        const cashfree = await load({ mode: "sandbox" });

        const paymentResponse = await axios.post(`${import.meta.env.VITE_API_URL}/payment/makePayment/${response.data.data.booking._id}`)

        console.log("Payment Response : " , paymentResponse.data.order_id)

        if (paymentResponse?.data) {
          const newOrderId = paymentResponse.data.order_id;
          setOrderId(newOrderId);

          let checkoutOptions = {
            paymentSessionId: paymentResponse.data.payment_session_id,
            redirectTarget: "_modal",
          }

          const paymentSuccess = await cashfree.checkout(checkoutOptions)

          const checkPaymentSuccess = await axios.post(`${import.meta.env.VITE_API_URL}/payment/verify`, { orderId: newOrderId, bikeId })
          console.log(checkPaymentSuccess)
          if (checkPaymentSuccess.data.status === 'success') {
            navigate("/", {
              state: {
                bookingSuccess: `Your wheels are waiting! Pickup at ${response.data.data.booking.store}`,
              }
            })
          } else if (checkPaymentSuccess.data.status === 'ACTIVE') {
            const pickupISO = pickupAndDropoffDates.pickupDate.toISOString();
            const dropoffISO = pickupAndDropoffDates.dropoffDate.toISOString();
            navigate(`/bikes?pickupDate=${encodeURIComponent(pickupISO)}&dropoffDate=${encodeURIComponent(dropoffISO)}`)
          }

        }

      }

    } catch (error) {
      console.log(error)
      if (error?.response) {
        if (error.response.data.error?.statusCode === 401) {
          navigate("/signin", {
            state: { SessionExpired: "Your session is expired. Please Login" },
          });
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
    <div className='relative'>
      <div
        className={`bg-red-400 w-8/10 md:w-6/10 flex justify-center items-center text-black px-4 py-2 text-sm rounded-md md:text-lg lg:text-xl lg:w-4/10 mx-auto absolute top-10 left-1/2 -translate-x-1/2   my-2 transition-opacity duration-300
        ${errorMessage ? "opacity-100" : "opacity-0"}`}
      >
        {error}
      </div>
      <div className='w-full xl:w-8/10 flex-col md:flex-row md:gap-x-5 xl:flex-row xl:p-10 p-5 mx-auto flex gap-y-7 xl:gap-y-0 xl:gap-x-7'>
        <div className='w-full xl:w-6/10 border-2 border-gray-200  rounded-md flex flex-col gap-y-2 xl:p-5'>
          <div className='rounded-md flex flex-col gap-y-6 p-4 items-center xl:p-10'>
            <img src={bookBikeDetails?.bike?.bikeImage} alt="Bike Image not Found" />
            <h3 className='text-lg xl:text-xl font-medium'>{bookBikeDetails?.bike?.bikeCompanyName} {bookBikeDetails?.bike?.bikeName} {bookBikeDetails?.bike?.bikeModelName && bookBikeDetails?.bike?.bikeModelName}</h3>
          </div>
          <div className='flex flex-col items-center gap-y-2 md:gap-y-4 justify-center xl:gap-x-6 p-2 '>
            <h3 className='text-lg xl:text-xl font-medium'>Specifications</h3>
            <div className='grid grid-cols-2 p-2 gap-y-5 gap-x-10 xl:p-5 xl:gap-y-10 xl:gap-x-20 text-sm lg:text-base'>
              <div className='flex flex-col xl:flex-row items-center gap-x-2 gap-y-2 xl:gap-y-0 '>
                <i className="fa-solid fa-route p-4 text-xl bg-black text-white rounded-full"></i>
                <div className='flex flex-col items-center xl:items-start'>
                  <span>Kms Driven</span>
                  <span>{bookBikeDetails?.bike?.kilometerDriven}</span>
                </div>
              </div>
              <div className='flex flex-col xl:flex-row items-center gap-x-2 gap-y-2 xl:gap-y-0 '>
                <i className="fa-solid fa-clock-rotate-left p-4 text-xl bg-black text-white rounded-full"></i>
                <div className='flex flex-col items-center xl:items-start'>
                  <span>Top Speed</span>
                  <span>{bookBikeDetails?.bike?.topSpeed} Kmph</span>
                </div>
              </div>
              <div className='flex flex-col xl:flex-row items-center gap-x-2 gap-y-2 xl:gap-y-0'>
                <i className="fa-solid fa-weight-hanging p-4 text-xl bg-black text-white rounded-full"></i>
                <div className='flex flex-col items-center xl:items-start'>
                  <span>Kerb Weight</span>
                  <span>{bookBikeDetails?.bike?.kerbWeight} Kg</span>
                </div>
              </div>
              <div className='flex flex-col xl:flex-row items-center gap-x-2 gap-y-2 xl:gap-y-0 '>
                <i className="fa-solid fa-gas-pump p-4 text-xl bg-black text-white rounded-full"></i>
                {
                  bookBikeDetails?.bike?.fuelType === "petrol" ?
                    <div className='flex flex-col items-center xl:items-start'>
                      <span>Fuel Capacity</span>
                      <span>{bookBikeDetails?.bike?.fuelCapacity} L</span>
                    </div>
                    :
                    <div className='flex flex-col items-center xl:items-start'>
                      <span>Charging Time</span>
                      <span>{bookBikeDetails?.bike?.chargingTime} hrs</span>
                    </div>
                }
              </div>
              {bookBikeDetails?.bike?.fuelType === "petrol" &&
                <div className='flex flex-col xl:flex-row items-center gap-y-2 gap-x-2 xl:gap-y-0 '>
                  <i className="fa-solid fa-tachometer-alt p-4 text-xl bg-black text-white rounded-full"></i>
                  <div className='flex flex-col items-center xl:items-start'>
                    <span>Average</span>
                    <span>{bookBikeDetails?.bike?.bikeAverage} Kmpl</span>
                  </div>
                </div>
              }
              {bookBikeDetails?.bike?.fuelType === "petrol" &&
                <div className='flex flex-col xl:flex-row items-center gap-y-2 gap-x-2 xl:gap-y-0 '>
                  <i className="fa-solid fa-gear p-4 text-xl bg-black text-white rounded-full"></i>
                  <div className='flex flex-col items-center xl:items-start'>
                    <span>Displacement</span>
                    <span>{bookBikeDetails?.bike?.displacement} cc</span>
                  </div>
                </div>
              }
            </div>
          </div>
        </div>
        <div className='w-full xl:w-4/10 flex flex-col gap-y-4 text-sm md:text-base'>
          <div className='p-4 md:p-3 lg:p-5 border-2 border-gray-200 rounded-md flex flex-col gap-y-3 xl:gap-y-6'>
            <div className='flex flex-col gap-y-2'>
              <h3 className='flex items-center gap-x-2'><i className='fa-regular fa-calendar'></i>Pick-Up</h3>
              <div className='flex items-center gap-x-4 text-gray-600'>
                <div className='bg-white border border-gray-200 rounded-sm px-6 py-3'>{bookBikeDetails?.selectedDateTime?.pickupDate[0]}</div>
                <div className='bg-white border border-gray-200 rounded-sm px-6 py-3'>{bookBikeDetails?.selectedDateTime?.pickupDate[1]}</div>
              </div>
            </div>
            <div className='flex flex-col gap-y-2'>
              <h3 className='flex items-center gap-x-2'><i className='fa-regular fa-calendar'></i>Drop-Off</h3>
              <div className='flex items-center gap-x-4 text-gray-600'>
                <div className='bg-white border border-gray-200 rounded-sm px-6 py-3'>{bookBikeDetails?.selectedDateTime?.dropoffDate[0]}</div>
                <div className='bg-white border border-gray-200 rounded-sm px-6 py-3'>{bookBikeDetails?.selectedDateTime?.dropoffDate[1]}</div>
              </div>
            </div>
            <div className='border-t border-gray-400  flex flex-col gap-y-4'>
              <h3 className='mt-2'>Rental Summary</h3>
              <div className='flex flex-col gap-y-2'>
                <p className='w-full flex justify-between'>
                  <span>24-hour rate</span>
                  <span>
                    <i className="fa-solid fa-indian-rupee-sign mr-1"></i>
                    {bookBikeDetails?.bike.bikePrice}
                  </span>
                </p>
                <div className='w-full flex justify-between'>
                  <span>Booking Duration</span>
                  <div>
                    <span>
                      {bookBikeDetails?.totalDays} Day
                    </span>
                    {bookBikeDetails?.remainingHours > 0 && <span>, {bookBikeDetails?.remainingHours} Hours</span>}
                  </div>
                </div>
                <p className='w-full flex justify-between'>
                  <span>Total</span>
                  <span>
                    <i className="fa-solid fa-indian-rupee-sign mr-1"></i>
                    {bookBikeDetails?.totalAmount}
                  </span>
                </p>
              </div>
              <button onClick={(e) => handleBookNow(e)} className='bg-black text-white px-4 py-2 rounded-sm cursor-pointer hover:bg-black/90 transition-colors duration-300'>Book Now</button>
            </div>
          </div>
          <div className='border-2 rounded-md border-gray-200 p-4'>
            <h3 className='mb-2 font-medium'>Terms & Conditions</h3>
            <ul className='text-sm lg:text-base'>
              <li className='mb-2 text-justify'><b>Document : </b>Bring original DL & Aadhaar photo at pickup.</li>
              <li className='mb-2 text-justify'><b>Mandatory DL : </b>Bike won’t be provided without the original DL.</li>
              <li className='mb-2 text-justify'><b>Fuel Charges : </b>Not included in rent or security deposit.</li>
              <li className='mb-2 text-justify'><b>Damage : </b>Customer pays repair costs for any damage.</li>
              <li className='mb-2 text-justify'><b>For E-bikes : </b>Full charged vehicle is provided , charger will be provided if booked for more than a day</li>
            </ul>
          </div>
        </div>
      </div>
      <div className='w-full xl:w-8/10 mx-auto p-5 xl:p-10'>
        <div className="w-full">
          <h2 className='text-2xl xl:text-3xl font-medium text-center'>Things To Remember</h2>
          <div className="mt-5 md:mt-15">
            <ul className="md:grid md:grid-cols-4 md:col-gap-10 md:row-gap-10">
              <li className=" bg-gray-50 p-2 md:p-5 lg:pb-10 text-center relative">
                <div className="flex flex-col items-center">
                  <div className="md:absolute md:top-0 md:-translate-y-1/2">
                    <div className="flex items-center justify-center w-20 h-20 rounded-full bg-black text-white border-4 border-white text-2xl font-semibold">
                      <i className="fas fa-shield-alt"></i>
                    </div>
                  </div>
                  <div className="mt-2 md:mt-14 lg:mt-8">
                    <h4 className="lg:text-lg font-semibold text-gray-900">
                      Security Deposit
                    </h4>
                    <p className="mt-2 text-lg xl:text-xl text-gray-500">
                      <i className="fa-solid fa-indian-rupee-sign"></i> 1500
                    </p>
                  </div>
                </div>
              </li>
              <li className=" bg-gray-50 p-2 md:p-5  lg:pb-10 text-center relative">
                <div className=" flex flex-col items-center">
                  <div className="md:absolute md:top-0 md:-translate-y-1/2">
                    <div className="flex items-center justify-center h-20 w-20 rounded-full bg-black text-white border-4 border-white text-2xl font-semibold">
                      <i className="fa-solid fa-business-time"></i>
                    </div>
                  </div>
                  <div className="mt-2 md:mt-14 lg:mt-8">
                    <h4 className="lg:text-lg font-semibold text-gray-900">
                      Pickup Timings
                    </h4>
                    <p className="mt-2 text-lg xl:text-xl text-gray-500">
                      9 AM to 7 PM
                    </p>
                  </div>
                </div>
              </li>
              <li className=" bg-gray-50 p-2 md:p-5  lg:pb-10 text-center relative">
                <div className=" flex flex-col items-center">
                  <div className="md:absolute md:top-0 md:-translate-y-1/2">
                    <div className="flex items-center justify-center h-20 w-20 rounded-full bg-black text-white border-4 border-white text-2xl font-semibold">
                      <i className="fa-solid fa-circle-exclamation"></i>
                    </div>
                  </div>
                  <div className="mt-2  md:mt-14 lg:mt-8">
                    <h4 className="lg:text-lg font-semibold text-gray-900">
                      Late Penalty
                    </h4>
                    <p className="mt-2 text-lg xl:text-xl text-gray-500">
                      <i className="fa-solid fa-indian-rupee-sign"></i> 50 Per Hour
                    </p>
                  </div>
                </div>
              </li>
              <li className=" bg-gray-50 p-2 md:p-5  lg:pb-10 text-center relative">
                <div className=" flex flex-col items-center">
                  <div className="md:absolute md:top-0 md:-translate-y-1/2">
                    <div className="flex items-center justify-center h-20 w-20 rounded-full bg-black text-white border-4 border-white text-2xl font-semibold">
                      <i className="fa-solid fa-road"></i>
                    </div>
                  </div>
                  <div className="mt-2 md:mt-14 lg:mt-8">
                    <h4 className="lg:text-lg font-semibold text-gray-900">
                      Distance Limit
                    </h4>
                    <p className="mt-2 text-lg xl:text-xl text-gray-500">
                      100 Kms
                    </p>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

    </div>
  )
}

export default BookBike