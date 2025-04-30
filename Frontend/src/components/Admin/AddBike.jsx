import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import Header from '../Header/Header';

function AddBike() {
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(null);
    const [selectedFuelType, setSelectedFuelType] = useState("petrol")
    const [transmissionType, setTransmissionType] = useState("automatic")
    const [error, setError] = useState("")
    const [showError, setShowError] = useState(false)
    const navigate = useNavigate()

    const [formData, setFormData] = useState({
        bikeCompanyName: "",
        bikeModelName: "",
        bikeName: "",
        bikeModelYear: "",
        kilometerDriven: "",
        fuelCapacity: "",
        bikeAverage: "",
        bikePrice: "",
        topSpeed: "",
        chargingTime: "",
        kerbWeight: "",
        displacement: "",
        fuelType: selectedFuelType,
        bikeType: transmissionType,
    })

    const handleFuelType = (e) => {
        const fuelTypeValue = e.target.value
        setSelectedFuelType(fuelTypeValue)
        setFormData({ ...formData, fuelType: fuelTypeValue })
    }

    const handleTransmissionType = (e) => {
        const transimissonTypeValue = e.target.value
        setTransmissionType(transimissonTypeValue)
        setFormData({ ...formData, bikeType: transimissonTypeValue })
    }
    
    const handleFormDataChange = (e) => {
        setFormData({ ...formData, [e.target.name] : e.target.value });
    };
    
    const fileInputRef = useRef(null);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file)
            setPreview(URL.createObjectURL(file))
        }
    }

    const handleImageUploadCancel = () => {
        setImage(null)
        setPreview(null)
    }

    const handleDivClick = () => {
        fileInputRef.current.click()
    }


    const handleAddBike = async () => {
        try {

            const data = new FormData()

            Object.keys(formData).forEach((key) => {
                data.append(key, formData[key])
            })

            if (image) {
                data.append("bikeImage", image)
            }

            const response = await axios.post(`${import.meta.env.VITE_API_URL}/bikes/admin/addBike`, data,
                {
                    headers: { "Content-Type": "multipart/form-data" },
                }
            )

            if (response.status === 201) {
                navigate("/admin", {
                    state: {
                        bikeAddedSuccess: "Bike Added Successfully"
                    }
                })
            }
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

    useEffect(() => {
        if (error) {
            setShowError(true);

            setTimeout(() => {
                setShowError(false)
                setError("")
            }, 5000);
        }
    }, [error]);


    return (
        <div>
            <Header/>
            {
                <div className={`fixed bg-red-300 font-medium text-red-600 px-4 py-2 w-full text-center ${showError ? '-translate-y-0' : '-translate-y-full'} transition-transform duration-300`}>
                    {error}
                </div>
            }
        <div className="flex flex-col lg:flex-row md:items-center lg:items-start space-y-4 p-2 md:py-10 w-full gap-x-6 ">
            {/* {true &&
                <div className="fixed text-center top-20 md:top-30 left-1/2 transform -translate-x-1/2 w-[90%] md:w-[50%] lg:w-[40%] bg-red-300 text-red-600 px-4 py-2 rounded-md">
                    {error} Darshan Ladhani
                </div>
            } */}
            <div className='w-full md:w-9/10 lg:w-4/10 h-auto border-2 border-gray-200 rounded-md flex flex-col gap-y-4 p-2 md:p-4'>
                {
                    preview ? <img src={preview} alt="" className='w-full h-72 md:h-96 object-contain' /> :
                        <div>
                            <div className='bg-gray-400 w-full h-72 md:h-96 flex justify-center items-center text-white px-4 py-2 cursor-pointer' onClick={handleDivClick}>
                                <i className="fa-solid fa-arrow-up-from-bracket text-5xl md:text-7xl"></i>
                            </div>
                            <input type="file" name="bikeImage" id="bikeImage" className='hidden' ref={fileInputRef} onChange={handleImageChange} accept="image/*" />
                        </div>
                }
                <div className='flex gap-x-4'>
                    <button onClick={handleImageUploadCancel}
                        className="bg-black font-medium focus:outline-nonec cursor-pointer w-1/2 mx-auto text-white px-4 py-2 rounded"
                    >
                        Cancel
                    </button>
                </div>
            </div>
            <div className='w-full md:w-9/10 lg:w-6/10 border-2 border-gray-200 rounded-md'>
                <div className='p-4 lg:p-10 flex flex-col gap-y-4 md:gap-y-6'>
                    <div className='flex  flex-col gap-y-4 md:flex-row md:gap-x-4 md:justify-center'>
                        <div className='flex flex-col gap-y-2 w-full md:w-1/2'>
                            <label htmlFor="bikeName" className='font-medium'>Bike Name<sup className='text-red-500'>*</sup> </label>
                            <input type="text" placeholder="Ex. Activa" onChange={handleFormDataChange} className="border-2 focus:outline-none focus:bg-none border-gray-300 rounded-md py-1.5 px-3" name="bikeName" id="bikeName" required />
                        </div>
                        <div className='flex flex-col gap-y-2 w-full md:w-1/2'>
                            <label htmlFor="bikeCompanyName" className='font-medium'>Company Name<sup className='text-red-500'>*</sup> </label>
                            <input type="text" placeholder="Ex. Honda" onChange={handleFormDataChange} className="border-2 focus:outline-none focus:bg-none border-gray-300 rounded-md py-1.5 px-3" name="bikeCompanyName" id="bikeCompanyName" required />
                        </div>
                    </div>
                    <div className='flex flex-col gap-y-4 md:flex-row gap-x-4 md:justify-center'>
                        <div className='flex flex-col gap-y-2 w-full md:w-1/2'>
                            <label htmlFor="bikeModelName" className='font-medium'>Model Name</label>
                            <input type="text" placeholder="Ex. 5G" onChange={handleFormDataChange} className="border-2 focus:outline-none focus:bg-none border-gray-300 rounded-md py-1.5 px-3" name="bikeModelName" id="bikeModelName" />
                        </div>
                        <div className='flex flex-col gap-y-2 w-full md:w-1/2'>
                            <label htmlFor="bikeModelYear" className='font-medium'>Model Year<sup className='text-red-500'>*</sup></label>
                            <input type="number" placeholder="Ex. 2022" onChange={handleFormDataChange} className="border-2 focus:outline-none focus:bg-none border-gray-300 rounded-md py-1.5 px-3" name="bikeModelYear" id="bikeModelYear" required />
                        </div>
                    </div>
                    <div className='flex flex-col gap-y-4 md:flex-row gap-x-4 md:justify-center'>
                        <div className='flex flex-col gap-y-2 w-full md:w-1/2'>
                            <label htmlFor="bikePrice" className='font-medium'>Price (24 Hour Rate)<sup className='text-red-500'>*</sup></label>
                            <input type="number" placeholder="Ex. 599 Rs" onChange={handleFormDataChange} className="border-2 focus:outline-none focus:bg-none border-gray-300 rounded-md py-1.5 px-3" name="bikePrice" id="bikePrice" required />
                        </div>
                        <div className='flex flex-col gap-y-2 w-full md:w-1/2'>
                            <label htmlFor="kilometerDriven" className='font-medium'>Kilometers Covered<sup className='text-red-500'>*</sup></label>
                            <input type="number" placeholder="Ex. 10000 Kms" onChange={handleFormDataChange} className="border-2 focus:outline-none focus:bg-none border-gray-300 rounded-md py-1.5 px-3" name="kilometerDriven" id="kilometerDriven" />
                        </div>
                    </div>
                    <div className='flex flex-col gap-y-4 md:flex-row gap-x-4 md:justify-center'>
                        <div className='flex flex-col gap-y-2 w-full md:w-1/2'>
                            <label htmlFor="topSpeed" className='font-medium'>Top Speed<sup className='text-red-500'>*</sup></label>
                            <input type="number" placeholder="Ex. 100 kmph" onChange={handleFormDataChange} className="border-2 focus:outline-none focus:bg-none border-gray-300 rounded-md py-1.5 px-3" name="topSpeed" id="topSpeed" />
                        </div>
                        <div className='flex flex-col gap-y-2 w-full md:w-1/2'>
                            <label htmlFor="kerbWeight" className='font-medium'>Kerb Weight<sup className='text-red-500'>*</sup></label>
                            <input type="number" placeholder="Ex. 110 Kg" onChange={handleFormDataChange} className="border-2 focus:outline-none focus:bg-none border-gray-300 rounded-md py-1.5 px-3" name="kerbWeight" id="kerbWeight" />
                        </div>
                    </div>
                    <div className='flex flex-col gap-y-4 md:flex-row gap-x-4 md:justify-center'>
                        <div className='flex flex-col gap-y-2 w-full md:w-1/2'>
                            <label htmlFor="fuelType" className='font-medium'>Transimisson Type</label>
                            <select
                                className='cursor-pointer border-2 focus:outline-none border-gray-200 rounded-md px-3 py-1.5'
                                value={transmissionType}
                                onChange={handleTransmissionType}
                            >
                                <option value="automatic">Automatic</option>
                                <option value="manual">Manual</option>
                            </select>
                        </div>
                        <div className='flex flex-col gap-y-2 w-full md:w-1/2'>
                            <label htmlFor="fuelType" className='font-medium'>Fuel Type</label>
                            <select
                                className='cursor-pointer border-2 focus:outline-none border-gray-200 rounded-md px-3 py-1.5'
                                value={selectedFuelType}
                                onChange={handleFuelType}
                            >
                                <option value="petrol">Petrol</option>
                                <option value="electric">Electric</option>
                            </select>
                        </div>
                    </div>
                    {selectedFuelType && selectedFuelType === "petrol" ?
                        <div className='flex flex-col gap-y-4'>
                            <div className='flex flex-col gap-y-4 md:flex-row md:gap-x-4 md:justify-center'>
                                <div className='flex flex-col gap-y-2 w-full md:w-1/2'>
                                    <label htmlFor="bikeAverage" className='font-medium'>Average<sup className='text-red-500'>*</sup></label>
                                    <input type="number" placeholder="Ex. 50 kmpl" onChange={handleFormDataChange} className="border-2 focus:outline-none focus:bg-none border-gray-300 rounded-md py-1.5 px-3" name="bikeAverage" id="bikeAverage" />
                                </div>
                                <div className='flex flex-col gap-y-2 w-full md:w-1/2'>
                                    <label htmlFor="fuelCapacity" className='font-medium'>Fuel Capacity<sup className='text-red-500'>*</sup></label>
                                    <input type="number" placeholder="Ex. 5 Litre" onChange={handleFormDataChange} className="border-2 focus:outline-none focus:bg-none border-gray-300 rounded-md py-1.5 px-3" name="fuelCapacity" id="fuelCapacity" />
                                </div>
                            </div>
                            <div className='flex flex-col gap-y-4 md:flex-row md:gap-x-4 md:justify-center'>
                                <div className='flex flex-col gap-y-2 w-full md:w-1/2'>
                                    <label htmlFor="displacement" className='font-medium'>Displacement<sup className='text-red-500'>*</sup></label>
                                    <input type="number" placeholder="Ex. 109 cc" onChange={handleFormDataChange} className="border-2 focus:outline-none focus:bg-none border-gray-300 rounded-md py-1.5 px-3" name="displacement" id="displacement" />
                                </div>
                                <button className='w-full md:w-1/2 h-1/2 md:self-end rounded-md cursor-pointer px-3 py-1.5 bg-black text-white font-medium' onClick={handleAddBike}>Add Bike</button>
                            </div>
                        </div>
                        :
                        <div className='flex flex-col gap-y-4 md:flex-row gap-x-4'>
                            <div className='flex flex-col gap-y-2 w-full md:w-1/2'>
                                <label htmlFor="chargingTime" className='font-medium'>Charging Time<sup>*</sup></label>
                                <input type="number" placeholder="Ex. 4.5 Hours" onChange={handleFormDataChange} className="border-2 focus:outline-none focus:bg-none border-gray-300 rounded-md py-1.5 px-3" name="chargingTime" id="chargingTime" />
                            </div>
                            <button className='w-full md:w-1/2 h-1/2 md:self-end rounded-md cursor-pointer px-3 py-1.5 bg-black text-white font-medium' onClick={handleAddBike}>Add Bike</button>
                        </div>
                    }
                </div>
            </div>
        </div>
        </div>
    )
}

export default AddBike