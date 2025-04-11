import React, { useContext, useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import UserContext from '../../contexts/user/user.context.js';
import { useEffect } from 'react';
import axios from 'axios';

export default function Header() {
    const [isOpen, setIsOpen] = useState(false);
    const { user , setUser } = useContext(UserContext);

    useEffect(() => {
        async function fetchUserInfo() {
            try {
                const response = await axios.get(
                    `${import.meta.env.VITE_API_URL}/users/getuserinfo`, { withCredentials: true }
                );
                setUser(response.data.data)
            } catch (error) {
                if (error.response?.data.success === false) {
                    if (error.response.data.error.statusCode === 401) {
                        setUser(null)
                    }
                }
            }
        }
        fetchUserInfo()
    }, []);


    return (
        <header className='shadow sticky z-50 top-0'>
            <nav className='bg-black text-white p-3 lg:px-6 lg:py-4'>
                <div className='flex  justify-between items-center'>
                    <div className='w-full flex gap-x-4 items-center md:w-auto'>
                        <button
                            className=' text-white focus:outline-none md:hidden'
                            onClick={() => setIsOpen(!isOpen)}
                        >
                            {isOpen ? "" : <Menu size={30} />}
                        </button>

                        <Link to="/" className='lg:px-2'>
                            <h1 className='font-semibold text-lg md:text-xl xl:text-2xl'>Rent-A-Ride</h1>
                        </Link>
                    </div>

                    {/* Navigation For Mobiles */}
                    <div className='md:hidden'>
                        {user &&
                            <Link to={"/userprofile"}>
                                <div className='text-base flex items-center justify-center bg-white text-black rounded-full px-3 py-1.5'>
                                    <i className='fa-solid fa-user'></i>
                                </div>
                            </Link>
                        }
                    </div>

                    {/* Navigation for menu  */}
                    <div className='hidden md:flex'>
                        <ul className='flex justify-between items-center md:p-0 lg:px-4 lg:py-2'>
                            <li>
                                <NavLink to="/" className={({ isActive }) => `block px-4 py-2 lg:px-4 lg:py-2 text-lg lg:text-xl ${isActive ? "text-gray-400" : "text-white"} hover:text-gray-400  font-medium transition-colors duration-300`}>Home</NavLink>
                            </li>
                            <li>
                                <NavLink to="/about" className={({ isActive }) => `block px-4 py-2 lg:px-4 lg:py-2 text-lg lg:text-xl ${isActive ? "text-gray-400" : "text-white"} hover:text-gray-400  font-medium transition-colors duration-300`}>About</NavLink>
                            </li>
                            <li>
                                <NavLink to="/faqs" className={({ isActive }) => `block px-4 py-2 lg:px-4 lg:py-2 text-lg lg:text-xl ${isActive ? "text-gray-400" : "text-white"} hover:text-gray-400  font-medium transition-colors duration-300`}>FAQs</NavLink>
                            </li>
                            {user?.role === "admin" &&
                                <li>
                                    <NavLink to="/admin" className={({ isActive }) => `block px-4 py-2 lg:px-4 lg:py-2 text-lg lg:text-xl ${isActive ? "text-gray-400" : "text-white"} hover:text-gray-400  font-medium transition-colors duration-300`}>Admin</NavLink>
                                </li>
                            }
                        </ul>
                    </div>
                    {user ?
                        <Link to={"/userprofile"}>
                            <div className='hidden md:relative md:flex text-sm lg:text-base items-center gap-x-2 justify-center bg-white text-black py-2 px-4 rounded-md hover:transform hover:scale-105 transition-transform duration-300'>
                                <i className='fa-solid fa-user text-sm lg:text-lg'></i>
                                {user.firstName}
                            </div>
                        </Link>
                        :
                        <div className='hidden md:flex'>
                            <Link
                                to="/signin"
                                className="font-medium rounded-lg px-2 py-2 lg:px-4 lg:py-2 lg:text-lg mr-2 border-2 focus:outline-none hover:bg-white hover:text-black hover:transition-colors duration-300"
                            >
                                Sign In
                            </Link>
                            <Link
                                to="/signup"
                                className="font-medium rounded-lg px-2 py-2 lg:px-4 lg:py-2 lg:text-lg text-black bg-white focus:outline-none hover:bg-transparent hover:text-white transition-colors duration-300 hover:border-white border-2"
                            >
                                Sign Up
                            </Link>
                        </div>
                    }

                    {/* Navigation Menu For Mobile  */}
                        <div className={`bg-white text-black shadow-2xl transition-transform transform duration-500 ease-in-out absolute left-0 top-0 h-screen w-4/5 md:hidden
                                        ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                            <div>
                                <div className='flex justify-between p-4 border-gray-400'>
                                    <h1 className='text-2xl font-semibold'>Rent-A-Ride</h1>
                                    <button onClick={() => { setIsOpen(!isOpen) }}><X size={26} /></button>
                                </div>
                                <ul className='md:hidden flex flex-col gap-y-3'>
                                    <NavLink to="/" className="text-lg">
                                        <li className='w-full py-2 px-4' onClick={() => setIsOpen(!isOpen)}>
                                            <div className='flex items-center gap-x-4 border-b border-gray-400 pb-1'>
                                                <i className='fa-solid fa-house'></i>
                                                <span>Home</span>
                                            </div>
                                        </li>
                                    </NavLink>
                                    <NavLink to="/about" className="text-lg">
                                    <li className='w-full py-2 px-4' onClick={() => setIsOpen(!isOpen)}>
                                            <div className='flex items-center gap-x-4 border-b border-gray-400 pb-1'>
                                                <i className='fa-solid fa-info-circle'></i>
                                                <span>About</span>
                                            </div>
                                        </li>
                                    </NavLink>
                                    <NavLink to="/faqs" className="text-lg">
                                    <li className='w-full py-2 px-4' onClick={() => setIsOpen(!isOpen)}>
                                            <div className='flex items-center gap-x-4 border-b border-gray-400 pb-1'>
                                                <i className='fa-solid fa-circle-question'></i>
                                                <span>FAQs</span>
                                            </div>
                                        </li>
                                    </NavLink>
                                    {user?.role === "admin" &&
                                        <NavLink to="/admin" className="text-lg">
                                        <li className='w-full py-2 px-4' onClick={() => setIsOpen(!isOpen)}>
                                            <div className='flex items-center gap-x-4 border-b border-gray-400 pb-1'>
                                                <i className='fa-solid fa-user-tie'></i>
                                                <span>Admin</span>
                                            </div>
                                        </li>
                                        </NavLink>
                                    }
                                </ul>
                                {user ?
                                    <Link to={"/userprofile"}>
                                        <div className='m-2 w-fit rounded-full flex gap-x-2 items-center px-4 py-2 bg-black text-white' onClick={() => setIsOpen(!isOpen)}>
                                            <i className='fa-solid fa-user'></i> {user.firstName}
                                        </div>
                                    </Link> :
                                    <div className='mt-2 flex gap-x-4 p-4'>
                                        <Link to='/signin' className='border-black border-2 font-medium rounded-md px-4 py-2'>Sign In</Link>
                                        <Link to='/signup' className='bg-black text-white font-medium rounded-md px-4 py-2'>Sign Up</Link>
                                    </div>
                                }
                            </div>
                        </div>
                </div>
            </nav>
        </header>
    );
}

