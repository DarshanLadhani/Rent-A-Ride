import { React } from "react"
import { useState, useEffect } from "react"
import axios from "axios"
function App() {
  // Example using fetch

  const [bikes, setBikes] = useState([])

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());;
    console.log(data)
    axios.post('http://localhost:3000/api/v1/users/login', data , {withCredentials : true})
      .then(response => {
        console.log("Response : " , response.data)
      })
      .catch(error => {
        console.log(error)
      })
  }

  const fetchBikes = () => {
    axios.get('http://localhost:3000/api/v1/bikes/admin/getAllBikes' , {withCredentials : true})
      .then(response => {
        console.log("Response : " , response.data.data)
        setBikes(response.data.data)
      })
      .catch(error => {
        console.log(error)
      })
  }


  return (
    <>
      <form onSubmit={handleSubmit} method="post">
        <input type="number" name="userContactNumber" id="userContactNumber" className="bg-gray-400 m-10 border-2 outline-none" />
        <input type="password" name="password" id="password" className="bg-gray-400 m-10 border-2 outline-none" />
        <button className="bg-white">Submit</button>
      </form>

      <button onClick={fetchBikes} className="bg-white">Get bikes</button>

      <div>
        {
          bikes.map(bike => {
            return (
              <div key={bike._id}>
                <h1>{bike.bikeName}</h1>
                <h1>{bike.bikePrice}</h1>
              </div>
            )
          })
        }
      </div>
    </>
  )
}

export default App
