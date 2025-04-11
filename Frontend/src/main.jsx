import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Layout from './components/Layout.jsx'
import Home from './components/Home/Home.jsx'
import About from './components/About/About.jsx'
import Faqs from './components/FAQs/Faqs.jsx'
import Signup from './components/Authentication/Signup/Signup.jsx'
import Signin from './components/Authentication/Signin/Signin.jsx'
import UserProfile from './components/UserProfile/UserProfile.jsx'
import BikesResults from './components/BikesResults/BikesResults.jsx'
import AdminDashboard from './components/Admin/AdminDashboard.jsx'
import BookBike from './components/BookBike/BookBike.jsx'
import UserContextProvider from './contexts/user/userContextProvider.jsx'
import BikeContextProvider from './contexts/bike/bikeContextProvider.jsx'
import axios from 'axios'
import AddBike from './components/Admin/AddBike.jsx'
import UpdateBike from './components/Admin/UpdateBike.jsx'

axios.defaults.withCredentials = true


const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />, // Layout is a component that wraps the children
    children: [
      {
        path: "/",
        element: <Home />
      },
      {
        path: "/about",
        element: <About />
      },
      {
        path: "/faqs",
        element: <Faqs />
      },
      {
        path: "/userprofile",
        element: <UserProfile />
      },
      {
        path: "/bikes/book",
        element: <BookBike />
      },
      {
        path: "/admin/updateBike",
        element: <UpdateBike />
      },
    ]
  },
  {
    path: "/signup",
    element: <Signup />
  },
  {
    path: "/signin",
    element: <Signin />
  },
  {
    path: "/bikes",
    element: <BikesResults />
  },
  {
    path: "/admin",
    element: <AdminDashboard />
  },
  {
    path: "/admin/addBike",
    element: <AddBike />
  },
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <UserContextProvider>
      <BikeContextProvider>
        <RouterProvider router={router} />
      </BikeContextProvider>
    </UserContextProvider>
  </StrictMode>,
)
