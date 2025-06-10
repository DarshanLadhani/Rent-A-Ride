import React from 'react'
import { Link } from 'react-router-dom';

export default function Footer() {
    return (
        <footer className='bg-black mt-4 text-white'>
            <div className='flex-col flex gap-y-4 md:flex-row md:gap-x-20 mx-auto py-5 md:py-10'>
                <div className='w-full flex flex-col gap-y-2 md:gap-y-4'>
                    <Link to="/" className='flex items-center px-2 justify-center'>
                        <h1 className='font-semibold text-2xl md:text-3xl'>Rent-A-Ride</h1>
                    </Link>
                    <p className='flex justify-center font-normal text-lg md:text-xl px-2 text-gray-400'>"Bike. Click. Go."</p>
                    <div className='hidden md:flex items-start  gap-x-6 text-2xl md:text-3xl p-2 mt-2 md:mt-4 justify-center'>
                        <i className="fa-brands fa-whatsapp cursor-pointer"></i>
                        <i className="fa-brands fa-instagram cursor-pointer"></i>
                        <i className="fa-brands fa-linkedin cursor-pointer"></i>
                        <i className="fa-brands fa-github cursor-pointer"></i>
                        <i className="fa-solid fa-envelope cursor-pointer"></i>
                    </div>
                </div>
                <div className='w-full flex justify-between md:justify-center md:items-center'>
                    <div className='flex flex-col items-start md:hidden text-xl gap-y-0'>
                        <i className="fa-brands fa-whatsapp  bg-white text-black w-full px-4 py-2 border-b rounded-tr-md"></i>
                        <i className="fa-brands fa-instagram  bg-white text-black py-2 px-4 w-full border-b"></i>
                        <i className="fa-brands fa-linkedin-in  bg-white text-black py-2 px-4 w-full border-b"></i>
                        <i className="fa-brands fa-github  bg-white text-black py-2 px-4 w-full border-b"></i>
                        <i className="fa-regular fa-envelope  bg-white text-black py-2 px-4 w-full border-b rounded-br-md"></i>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-2 items-start py-6 px-2 text-sm md:text-base md:py-0 md:w-full md:items-start md:text-left">
                        <div className='flex flex-col w-fit px-1'>
                            <h2 className="mb-4 font-medium uppercase">Resources</h2>
                            <ul className="font-normal">
                                <li className="mb-4">
                                    <Link to="/" className="hover:underline">
                                        Home
                                    </Link>
                                </li>
                                <li className='mb-4'>
                                    <Link to="/about" className="hover:underline">
                                        About Us
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/faqs" className="hover:underline">
                                        FAQs
                                    </Link>
                                </li>
                            </ul>
                        </div>
                        <div className='flex flex-col w-full px-1'>
                            <h2 className="mb-4 font-medium uppercase">Legal</h2>
                            <ul className="font-normal">
                                <li className="mb-4">
                                    <Link to="#" className="hover:underline">
                                        Privacy Policy
                                    </Link>
                                </li>
                                <li>
                                    <Link to="#" className="hover:underline">
                                        Terms &amp; Conditions
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
            <div className='py-3 text-sm md:text-base text-center lg:text-lg'>
                <p>&copy; 2025 Rent-A-Ride. All rights reserved.</p>
            </div>
        </footer>
    )
}
