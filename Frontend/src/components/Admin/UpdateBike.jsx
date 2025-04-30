import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { useSearchParams } from 'react-router-dom'
import { useRef } from 'react';

function UpdateBike() {
    const location = useLocation();
    const [searchParams] = useSearchParams();
    const bikeId = searchParams.get("bikeId");
    const [error, setError] = useState("")
    const [showError, setShowError] = useState(false)
    const [successMessage, setsuccessMessage] = useState("")
    const [showSucessMessage, setShowSuccessMessage] = useState(false)
    const [imageFile, setImageFile] = useState(null);
    const [image, setImage] = useState(null);
    


    const [formData, setFormData] = useState({
        kilometerDriven: "",
        bikeAverage: "",
        bikePrice: "",
        topSpeed: "",
        chargingTime: "",
    })

    useEffect(() => {
        setTimeout(() => {
            setShowSuccessMessage(false)
            setsuccessMessage("")
        }, 5000);
    }, [successMessage])

    useEffect(() => {

        async function fetchBikeDetails() {
            try {
                const response = await axios.get(`${import.meta.env.VITE_API_URL}/bikes/admin/getBike/${bikeId}`)

                setFormData(response.data.data)
                setImageFile(response.data.data.bikeImage)
            } catch (error) {
                console.log(error.response.data.message)
                if (error.response || error.response.data.message) {
                    setError(error.response.data.message)
                    setShowError(true)
                } else {
                    setError("Something went wrong. Please try again")
                }
            }
        }

        fetchBikeDetails()
    }, [location])


    useEffect(() => {
        if (error) {
            setShowError(true);

            setTimeout(() => {
                setShowError(false)
                setError("")
            }, 5000);
        }
    }, [error]);


    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file)
            setImageFile(URL.createObjectURL(file))
        }
    }

    const handleImageUpload = () => {
        fileInputRef.current.click()
    }

    const fileInputRef = useRef(null);

    const handleFormDataChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleUpdateBikeData = async () => {
        try {

            const response = await axios.patch(`${import.meta.env.VITE_API_URL}/bikes/admin/updateBikeDetails/${bikeId}`, formData)

            if (response.status === 200) {
                setsuccessMessage(response.data.message)
                setShowSuccessMessage(true)
            }


        } catch (error) {
            if (error.response || error.response.data.message) {
                setError(error.response.data.message)
                setShowError(true)
            } else {
                setError("Something went wrong. Please try again")
            }
        }
    }

    const handleUpdateBikeImage = async () => {
        try {

            const data = new FormData();

            if (image) {
                data.append("bikeImage", image)
            } else {
                setError("Please change the image");
                setShowError(true)
                return;
            }

            const response = await axios.patch(`${import.meta.env.VITE_API_URL}/bikes/admin/updateBikeImage/${bikeId}`, data,
                {
                    headers: { "Content-Type": "multipart/form-data" },
                }
            )

            if (response.status === 200) {
                setsuccessMessage(response.data.message)
                setShowSuccessMessage(true)
            }

        } catch (error) {
            if (error.response || error.response.data.message) {
                setError(error.response.data.message)
                setShowError(true)
            } else {
                setError("Something went wrong. Please try again")
            }
        }
    }

    return (
        <div className="flex flex-col lg:flex-row md:items-center lg:items-start space-y-4 p-2 md:py-10 w-full gap-x-6 ">
            {showError &&
                <div className="fixed text-center top-20 md:top-30 left-1/2 transform -translate-x-1/2 w-[90%] md:w-[50%] lg:w-[40%] bg-red-300 text-red-600 px-4 py-2 rounded-md">
                    {error}
                </div>
            }
            {showSucessMessage &&
                <div className="fixed text-center shadow-xl border-2 top-20 md:top-30 left-1/2 transform -translate-x-1/2 w-[90%] md:w-[50%] lg:w-[40%] bg-white text-black px-4 py-2 rounded-md">
                    {successMessage}
                </div>
            }
            <div className='w-full md:w-9/10 lg:w-4/10 h-auto border-2 border-gray-200 rounded-md flex flex-col gap-y-4 p-2 md:p-4'>

                <img src={imageFile} alt="" className='w-full h-72 md:h-96 object-contain' />
                <input type="file" name="bikeImage" id="bikeImage" className='hidden' ref={fileInputRef} onChange={handleImageChange} accept="image/*" />
                <div className='flex gap-x-4'>
                    <button onClick={handleImageUpload}
                        className="bg-black font-medium focus:outline-nonec cursor-pointer w-1/2 mx-auto text-white px-4 py-2 rounded"
                    >
                        Change
                    </button>
                    <button onClick={handleUpdateBikeImage}
                        className="bg-black font-medium focus:outline-nonec cursor-pointer w-1/2 mx-auto text-white px-4 py-2 rounded"
                    >
                        Update
                    </button>

                </div>
            </div>
            <div className='w-full md:w-9/10 lg:w-6/10 border-2 border-gray-200 rounded-md'>
                <div className='p-4 lg:p-10 flex flex-col gap-y-4 md:gap-y-6'>
                    <div className='flex flex-col gap-y-4 md:flex-row gap-x-4 md:justify-center'>
                        <div className='flex flex-col gap-y-2 w-full md:w-1/2'>
                            <label htmlFor="bikePrice" className='font-medium'>Price (24 Hour Rate)</label>
                            <input type="number" value={formData?.bikePrice} onChange={handleFormDataChange} className="border-2 focus:outline-none focus:bg-none border-gray-300 rounded-md py-1.5 px-3" name="bikePrice" id="bikePrice" />
                        </div>
                        <div className='flex flex-col gap-y-2 w-full md:w-1/2'>
                            <label htmlFor="kilometerDriven" className='font-medium'>Kilometers Covered</label>
                            <input type="number" value={formData?.kilometerDriven} onChange={handleFormDataChange} className="border-2 focus:outline-none focus:bg-none border-gray-300 rounded-md py-1.5 px-3" name="kilometerDriven" id="kilometerDriven" />
                        </div>
                    </div>
                    <div className='flex flex-col gap-y-4 md:flex-row gap-x-4 md:justify-center'>
                        <div className='flex flex-col gap-y-2 w-full md:w-1/2'>
                            <label htmlFor="topSpeed" className='font-medium'>Top Speed</label>
                            <input type="number" value={formData?.topSpeed} className="border-2 focus:outline-none focus:bg-none border-gray-300 rounded-md py-1.5 px-3" name="topSpeed" id="topSpeed" readOnly />
                        </div>
                        {formData && formData.fuelType === "petrol" ?
                            <div className='flex flex-col gap-y-2 w-full md:w-1/2'>
                                <label htmlFor="bikeAverage" className='font-medium'>Average</label>
                                <input type="number" value={formData?.bikeAverage} onChange={handleFormDataChange} className="border-2 focus:outline-none focus:bg-none border-gray-300 rounded-md py-1.5 px-3" name="bikeAverage" id="bikeAverage" />
                            </div>
                            :
                            <div className='flex flex-col gap-y-2 w-full md:w-1/2'>
                                <label htmlFor="chargingTime" className='font-medium'>Charging Time</label>
                                <input type="number" value={formData?.chargingTime} onChange={handleFormDataChange} className="border-2 focus:outline-none focus:bg-none border-gray-300 rounded-md py-1.5 px-3" name="chargingTime" id="chargingTime" />
                            </div>
                        }
                    </div>
                    <div className='flex flex-row w-full justify-center'>
                        <button className='w-4/10 rounded-md cursor-pointer px-4 py-2 bg-black text-white font-medium' onClick={handleUpdateBikeData}>Update</button>
                    </div>

                </div>
            </div>
        </div>
    )
}

export default UpdateBike