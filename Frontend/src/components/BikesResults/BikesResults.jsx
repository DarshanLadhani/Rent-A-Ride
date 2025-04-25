import React, { useContext, useEffect, useState } from 'react'
import BikeContext from '../../contexts/bike/bike.context.js'
import UserContext from '../../contexts/user/user.context.js';
import { useSearchParams } from 'react-router-dom'
import axios from 'axios';
import DatePicker from "react-datepicker";
import Header from '../Header/Header.jsx';
import { useNavigate } from 'react-router-dom';
import ScrollToTop from '../Scroll/ScrollToTop.js';

function BikesResults() {
  const [searchParams] = useSearchParams();
  const pickupDateParam = searchParams.get('pickupDate');
  const dropoffDateParam = searchParams.get('dropoffDate');
  const { bikes, setBikes } = useContext(BikeContext)
  const { user } = useContext(UserContext);
  const navigate = useNavigate()

  const [error, setError] = useState("");
  const [errorMessage, setErrorMessage] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [filtersLength , setFiltersLength] = useState(0);
  
  const [filters, setFilters] = useState({
    automatic: false,
    manual: false,
    electric: false,
    petrol: false,
    honda: false,
    tvs: false,
    ola: false,
    bajaj: false,
    ather: false,
    revolt: false,
  })

  const pickupDateFromParam = pickupDateParam ? new Date(pickupDateParam) : new Date().getTime() + 60 * 60 * 1000;
  const [pickupDate, setPickupDate] = useState(new Date(pickupDateFromParam));
  const dropoffDateFromParam = dropoffDateParam ? new Date(dropoffDateParam) : pickupDate.getTime() + 24 * 60 * 60 * 1000;
  const [dropoffDate, setDropoffDate] = useState(new Date(dropoffDateFromParam));

  const pickupMinTime = new Date(pickupDate);
  pickupMinTime.setHours(9, 0, 0);
  const pickupMaxTime = new Date(pickupDate);
  pickupMaxTime.setHours(19, 0, 0);

  const dropoffMinTime = new Date(dropoffDate);
  dropoffMinTime.setHours(9, 0, 0);
  const dropoffMaxTime = new Date(dropoffDate);
  dropoffMaxTime.setHours(19, 0, 0);

  const handlePickupChange = (date) => {
    setPickupDate(date);
    setDropoffDate(new Date(date.getTime() + 24 * 60 * 60 * 1000));
  };


  const handleFilters = (key, checked) => {
    setFilters((prevFilters) => ({
      ...prevFilters, [key]: checked,
    }))
  }

  const handleRentNow = async (e) => {
    e.preventDefault();

    if (!user) {
      navigate("/signin" , {state : {
      SessionExpired : "Your session is expired. Please Login 1"}})
      return;
    }

    if (error) {
      setError("")
    }

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/bikes/search`, { pickupDate, dropoffDate })

      if (response.status === 200) {
        setBikes(null)
        setTimeout(() => {
          setBikes(response.data.data.bikes)
        }, 1000);
      }
    } catch (error) {
      if (error?.response.data) {
        if (error.response.data.error.statusCode === 401) {
          navigate("/signin" , {state : {
          SessionExpired : "Your session is expired. Please Login"}})
          return;
        }

        if (error.response || error.response.data.message) {
          console.log("Error From Handle Rent Now : " , error)
          setError(error.response.data.message)
          setErrorMessage(true)
        }

      } else {
        setError("Something went wrong. Please try again")
      }
    }
  }

  useEffect(() => {
      if (error) {
        setTimeout(() => {
          setErrorMessage(false);
        }, 5000);
      }
    }, [error])


  useEffect(() => {

    const queryParams = {}
    Object.keys(filters).forEach((key) => {
      if (filters[key]) {
        queryParams[key] = true
      }
    } , []);

    setFiltersLength(Object.keys(queryParams).length)

    async function fetchBikes() {
      try {
        const response = await axios.post(`${import.meta.env.VITE_API_URL}/bikes/search`, { pickupDate, dropoffDate }, { params: queryParams })
        if (response.status === 200) {
          setBikes(response.data.data.bikes)
        }
      } catch (error) {
        if (error?.response) {
          if (error.response.data.error?.statusCode === 401) {
            navigate("/signin", {
              state: { SessionExpired: "Your session is expired. Please Login" },
            });
            return;
          }

          if (error.response || error.response.data.message) {
            console.log("Error From Handle Rent Now : " , error)
            setError(error.response.data.message)
            setErrorMessage(true)
          }
        } else {
          setError("Something went wrong. Please try again")
        }
      }
    }

    fetchBikes()

  }, [filters])

  console.log("Filters" , filters)

  const handleBookBike = (bikeId) => {
    navigate("/bikes/book" , {
      state : {bikeId , dates : {pickupDate , dropoffDate}}
    })
  }


  return (
    <div>
      <ScrollToTop/>
      <Header />
      <div className='bg-slate-900  py-10'>
        <h1 className='text-xl md:text-3xl lg:text-4xl font-medium w-full text-center text-white'>Rent A Bike Rent Your Freedom</h1>
      </div>
      
      <div className="bg-white max-h-fit  relative -translate-y-8 z-10 w-9/10 md:w-7/10 lg:w-4/5 mx-auto rounded-lg shadow-2xl">
        <div className="rounded-lg w-full p-5 flex-col flex lg:flex-row gap-y-4 lg:gap-x-4 text-black ">
          {/* Pick-Up Date Picker */}
          <div className="flex flex-col gap-y-2 w-full lg:w-[40%]">
            <label htmlFor="pickup" className="font-semibold text-base  lg:text-lg flex items-center gap-x-2">
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
              onFocus={(e) => e.target.readOnly = true}
              className="w-full border-2 rounded-md text-base  lg:text-lg p-2 cursor-pointer hover:border-gray-500 transition-colors duration-300 focus:outline-none focus:border-gray-500"
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
              onFocus={(e) => e.target.readOnly = true}
              className="w-full border-2 rounded-md text-base  lg:text-lg p-2 cursor-pointer hover:border-gray-500 transition-colors duration-300 focus:outline-none focus:border-gray-500"
              required
            />
          </div>
          {/* Submit Button */}
          <button
              onClick={handleRentNow}
              className="relative lg:w-[20%] self-center lg:self-end bg-black text-white font-semibold rounded-md text-base lg:text-lg px-6 py-2 lg:px-2 cursor-pointer hover:bg-black/90 transition-colors duration-300"
            >
              Rent Now
            </button>
        </div>
        <div
          className={`text-red-600 w-full text-center flex justify-center items-center text-xs md:text-sm lg:text-base pb-2
          ${errorMessage ? "block" : "hidden"}`} 
        >
          {error}
        </div>
      </div>

      <div className="p-2 w-full mx-auto xl:p-5 flex justify-center mb-15 md:items-start md:justify-start md:gap-x-5">
        <button
          onClick={() => setFiltersOpen(prev => !prev)}
          className="fixed bottom-2 left-1/2 transform -translate-x-1/2 z-50 bg-black flex md:hidden items-center gap-x-2 text-lg text-white rounded-lg px-3 py-1.5" 
        >
          <i className={`${filtersOpen ? 'fa-solid fa-xmark' : 'fa-solid fa-sliders'}`}></i>
          <span>{`${filtersOpen ? 'Close' : `Filters ${filtersLength === 0 ? '' : `(${filtersLength})`}`}`}</span>
        </button>
        <div className={`overflow-y-auto flex items-end rounded-lg  fixed bottom-0 left-0 right-0 w-full transition-all md:block md:static md:transition-none md:translate-y-0 md:max-w-fit 
                        ${filtersOpen ? "translate-y-0  z-20 h-full  duration-500 ease-linear md:transition-none bg-black/50" : " translate-y-full duration-200 ease-linear"}`}>
          <div className='bg-white flex flex-col px-2  items-start w-full rounded-lg border md:border-2 md:border-gray-200 xl:px-2'>
            <h1 className='py-2 text-lg md:text-xl lg:text-2xl font-medium px-4'>Filters</h1>
            <div className='border-b-2 border-gray-200 w-full'>
              <h1 className='py-2 px-4 xl:text-lg mb-1'>Transimisson Type</h1>
              <div className='px-4'>
                <div className='flex items-center gap-x-2 mb-1'>
                  <input type="checkbox" name="automatic" id="automatic" checked={filters.automatic} onChange={(e) => { handleFilters('automatic', e.target.checked) }} className='cursor-pointer h-4 w-4 accent-black' />
                  <label htmlFor="automatic">Automatic</label>
                </div>
                <div className='flex items-center gap-x-2 mb-2'>
                  <input type="checkbox" name="manual" id="manual" checked={filters.manual} onChange={(e) => { handleFilters('manual', e.target.checked) }} className='cursor-pointer h-4 w-4 accent-black' />
                  <label htmlFor="manual">Manual</label>
                </div>
              </div>
            </div>
            <div className='border-b-2 border-gray-200 w-full'>
              <h1 className='py-2 px-4 lg:text-lg mb-1'>Fuel Type</h1>
              <div className='px-4'>
                <div className='flex items-center gap-x-2 mb-1'>
                  <input type="checkbox" name="petrol" id="petrol" checked={filters.petrol} onChange={(e) => { handleFilters('petrol', e.target.checked) }} className='cursor-pointer h-4 w-4 accent-black' />
                  <label htmlFor="petrol">Petrol</label>
                </div>
                <div className='flex items-center gap-x-2 mb-2'>
                  <input type="checkbox" name="electric" id="electric" checked={filters.electric} onChange={(e) => { handleFilters('electric', e.target.checked) }} className='cursor-pointer h-4 w-4 accent-black' />
                  <label htmlFor="electric">Electric</label>
                </div>
              </div>
            </div>
            <div>
              <h1 className='py-2 px-4 lg:text-lg mb-1'>Brands</h1>
              <div className='px-4'>
                <div className='flex items-center gap-x-2 mb-1'>
                  <input type="checkbox" name="honda" id="honda" checked={filters.honda} onChange={(e) => { handleFilters('honda', e.target.checked) }} className='cursor-pointer h-4 w-4 accent-black' />
                  <label htmlFor="honda">Honda</label>
                </div>
                <div className='flex items-center gap-x-2 mb-2'>
                  <input type="checkbox" name="tvs" id="tvs" checked={filters.tvs} onChange={(e) => { handleFilters('tvs', e.target.checked) }} className='cursor-pointer h-4 w-4 accent-black' />
                  <label htmlFor="tvs">TVS</label>
                </div>
                <div className='flex items-center gap-x-2 mb-2'>
                  <input type="checkbox" name="ola" id="ola" checked={filters.ola} onChange={(e) => { handleFilters('ola', e.target.checked) }} className='cursor-pointer h-4 w-4 accent-black' />
                  <label htmlFor="ola">OLA</label>
                </div>
                <div className='flex items-center gap-x-2 mb-2'>
                  <input type="checkbox" name="bajaj" id="bajaj" checked={filters.bajaj} onChange={(e) => { handleFilters('bajaj', e.target.checked) }} className='cursor-pointer h-4 w-4 accent-black' />
                  <label htmlFor="bajaj">Bajaj</label>
                </div>
                <div className='flex items-center gap-x-2 mb-2'>
                  <input type="checkbox" name="ather" id="ather" checked={filters.ather} onChange={(e) => { handleFilters('ather', e.target.checked) }} className='cursor-pointer h-4 w-4 accent-black' />
                  <label htmlFor="ather">Ather</label>
                </div>
                <div className='flex items-center gap-x-2 mb-2'>
                  <input type="checkbox" name="revolt" id="revolt" checked={filters.revolt} onChange={(e) => { handleFilters('revolt', e.target.checked) }} className='cursor-pointer h-4 w-4 accent-black' />
                  <label htmlFor="revolt">Revolt</label>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-2 w-8/10 md:max-w-full">
          {bikes && bikes.map((bike) => (
            <div key={bike._id} className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
              {/* Bike Information */}
              <div className="p-4">
                <h2 className="text-lg font-medium mb-1">
                  {bike.bikeCompanyName} {bike.bikeName} {bike.bikeModelName && bike.bikeModelName}
                </h2>
                <p className="text-gray-600">
                  {bike.bikeModelYear} 
                </p>
              </div>
              {/* Bike Image */}
              <div className="w-full flex justify-center mx-auto  h-44 overflow-hidden">
                <img
                  src={bike.bikeImage}
                  alt={bike.bikeName}
                  className="object-contain"
                />
              </div>
              <div>
                <div className="mt-3 py-2 px-4 flex gap-x-6 justify-center text-gray-500 lg:text-lg">
                  <div className='flex gap-x-2 items-center justify-center'>
                    <i className="fa-solid fa-gears"></i>
                    <p>{bike.bikeType}</p>
                  </div>
                  <div className='flex gap-x-2 items-center justify-center'>
                    <i className="fa-solid fa-gas-pump"></i>
                    <p>{bike.fuelType}</p>
                  </div>
                </div>
              </div>
              <div>
                <div className='mt-3 flex gap-x-6 justify-between py-2 px-4'>
                  <div className='flex gap-x-1 items-center justify-center'>
                    <i className="fa-solid fa-indian-rupee-sign text-xl"></i>
                    <p className='text-lg lg:text-2xl font-medium text-black'>{bike.bikePrice}/<span className='text-gray-500 text-sm lg:text-base'>Day</span></p>
                  </div>
                  <div className='flex gap-x-2 items-center justify-center'>
                    <button className='bg-black cursor-pointer text-white rounded-md px-3 py-1.5 xl:px-4 xl:py-2 font-medium hover:bg-black/90 transition-colors duration-300' onClick={() => handleBookBike(bike._id)}>RENT</button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default BikesResults