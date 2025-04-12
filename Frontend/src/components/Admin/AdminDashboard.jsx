import React from 'react'
import Header from '../Header/Header'
import { useState, useEffect, useContext } from 'react';
import axios, { all } from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import UserContext from '../../contexts/user/user.context';

function AdminDashboard() {
    const [allBikes, setAllBikes] = useState(null)
    const [successMessage, setSuccessMessage] = useState("");
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);
    const [filtersLength, setFiltersLength] = useState(0);
    const { user } = useContext(UserContext);
    const navigate = useNavigate()
    const location = useLocation()

    const [filtersOpen, setFiltersOpen] = useState(false);

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

    const handleAddBike = () => {
        navigate("/admin/addBike")
    }

    useEffect(() => {
        if (location.state?.bikeAddedSuccess) {
            setSuccessMessage(location.state.bikeAddedSuccess);
            setShowSuccessMessage(true);
            navigate(location.pathname, { replace: true });

            setTimeout(() => {
                setShowSuccessMessage(false);
                setSuccessMessage("");
            }, 3000);
        }
    }, [location])

    const handleUpdateBikeDetails = (bikeId) => {
        navigate(`/admin/updateBike?bikeId=${bikeId}`, {
            state: bikeId
        })
    }

    useEffect(() => {
        setTimeout(() => {
            setSuccessMessage("")
            setShowSuccessMessage(false)
        }, 5000);
    }, [successMessage])

    const handleDeleteBike = async (bikeId) => {
        try {
            const response = await axios.delete(`${import.meta.env.VITE_API_URL}/bikes/admin/removeBike/${bikeId}`)

            if (response.status === 200) {
                setSuccessMessage(response.data.message)
                setShowSuccessMessage(true)
            }

        } catch (error) {
            console.log(error)
        }
    }


    useEffect(() => {
        const queryParams = {}
        Object.keys(filters).forEach((key) => {
            if (filters[key]) {
                queryParams[key] = true
            }
        }, []);

        
        setFiltersLength(Object.keys(queryParams).length)
        
        async function fetchBikes() {
            try {
                const response = await axios.get(`${import.meta.env.VITE_API_URL}/bikes/admin/getAllBikes`, { params: queryParams })
                
                if (response.status === 200) {
                    setAllBikes(response.data.data)
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
                        console.log(error)
                    }
                } else {
                    console.log(error)
                }
            }
        }
        
        fetchBikes()
        
    }, [filters])


    const handleFilters = (key, checked) => {
        setFilters((prevFilters) => ({
            ...prevFilters, [key]: checked,
        }))
    }


    return (
        <div>
            <Header />
            {user && user.role === "admin" ?
            <div>
                <div
                    className={`bg-white border w-8/10 md:w-fit text-center text-black px-2 lg:px-4 py-2 rounded-md md:text-lg mx-auto fixed left-1/2 top-20  md:top-30 shadow-2xl -translate-x-1/2 transition-opacity duration-300
        ${showSuccessMessage ? "opacity-100" : "opacity-0"}`}
                >
                    {successMessage}
                </div>
                <div className='w-full py-4 px-2 xl:px-5 mx-auto flex justify-between items-center'>
                    <h1 className='md:text-2xl font-medium'>Bikes in system</h1>

                    <button className='p-2.5 xl:px-4 bg-black text-white rounded-md cursor-pointer text-sm md:text-lg' onClick={handleAddBike}>Add Bike <i className="fa-solid fa-plus ml-1"></i></button>
                </div>

                <div className="p-2 mt-4 w-full mx-auto xl:p-5 flex justify-center mb-15 md:items-start md:justify-start md:gap-x-5">
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
                        {allBikes && allBikes.map((bike) => (
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
                                            <button className='bg-black cursor-pointer text-white rounded-md px-3 py-1.5 xl:px-4 xl:py-2 text-sm hover:bg-black/90 transition-colors duration-300' onClick={() => handleUpdateBikeDetails(bike._id)}><i className="fa-solid fa-pen"></i></button>
                                            <button className='bg-black cursor-pointer text-white rounded-md px-3 py-1.5 xl:px-4 xl:py-2 text-sm hover:bg-black/90 transition-colors duration-300' onClick={() => handleDeleteBike(bike._id)}><i className="fa-solid fa-trash"></i></button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            :
            <div className='fixed w-full h-full flex justify-center items-center'>
                <div className='flex flex-col gap-y-4 justify-center items-center'>
                    <i className='fa-solid fa-lock  text-8xl md:text-9xl text-gray-600'></i>
                    <p className='text-sm md:text-lg'>You don't have permission to access this page.</p>
                    <button className='bg-black text-white px-3 py-1.5 md:px-4 md:py-2 rounded-md flex items-center gap-x-2 cursor-pointer' ><i className="fa-solid fa-arrow-left"></i>Go to Home</button>
                </div>
            </div>

            }
        </div>
    )
}

export default AdminDashboard