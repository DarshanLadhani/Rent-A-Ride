import React from "react";
import { useState } from "react";

function About() {
  const [startDate, setStartDate] = useState(new Date());

  return (
    <div className="p-10 flex flex-col gap-y-4">
      <h1 className="w-full p-2 text-center text-2xl md:text-3xl lg:text-4xl font-semibold">
        About Us
      </h1>
      <p className="w-full lg:p-2 xl:px-4 xl:py-2 text-lg md:text-xl text-justify">
        At <b>Rent-A-Ride</b> we believe that every journey should be effortless
        and enjoyable. Our mission is to provide a hassle-free bike rental
        experience that caters to commuters, weekend explorers, and adventure
        seekers alike. We offer a wide selection of bikes—from urban commuters
        to rugged mountain bikes—all maintained to the highest standards. With
        transparent pricing, a seamless booking process, and flexible rental
        options, our platform is designed to put you on the road quickly and
        safely. Our commitment to quality and customer service means that
        whether you're exploring your city or planning an exciting ride, you'll
        have the perfect bike ready for you. Join us and discover a smarter,
        more sustainable way to travel!
      </p>
    </div>
  );
}

export default About;
