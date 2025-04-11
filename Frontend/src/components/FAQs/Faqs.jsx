import React from "react";
import AccordionItem from "../Accordion/Accordion.jsx";

const FAQs = () => {
  const booking = [
    {
      title: 'Is fuel included in tariff ?',
      content: 'All prices are exclusive of fuel. We provide minimal amount of fuel to get the vehicle to the nearest fuel station. In case there is excess fuel in the vehicle at the time of return, Gobikes is not liable for any refunds for the same.',
    },
    {
      title: 'How can I book a bike without seeing it physically ?',
      content: 'We offer a 100% money back guarantee. Pay a commitment advance to reserve the bike. Reach location and test drive your bike. If there is any issue in the vehicle, raise a ticket and you shall be refunded 100% of the amount you have paid us. No questions asked in case there is a mechanical fault in the Vehicle.',
    },
    {
      title: 'What if I return the bike late ? ',
      content: 'If you drop the bike off way past the due time, a penalty will be charged. Returning the bike past the due date causes inconvenience to our dealer and other customers who might have scheduled a booking for the bike. You may call the dealer for an extension before the end of your trip if you think you are going to be late.',
    },
    {
      title: 'Will I be getting a complimentary helmet ?',
      content: 'We provide one complimentary helmet with each bike booked. A second helmet can also be provided but it is chargeable at INR 50 per day.',
    },
  ];

  const bookingCancellation = [
    {
      title: 'Can I cancel my booking ? If yes then how ?',
      content: 'Yes. You can cancel your booking by going to the Bookings sections in the Profile tab.',
    },
  ]

  const safetyAndTips = [
    {
      title: 'What happens if I meet with an accident ? ',
      content: 'We treat accidents and injuries during bike rides very seriously. If you are in such a situation, you should first try to get any immediate in person help possible. Followed by this call the vendor immediately to inform him of the mishap. We advise you to inform us of the incident as soon as possible as well.',
    },
    {
      title: 'What should I do if the bike breaks down ? ',
      content: 'We make sure that the bike we give to our Riders is of the best quality. However, some circumstances are beyond our control in such cases of bike troubles, it is best to call the Dealer and he will assist you at once by either fixing the problem or providing you with a replacement bike.',
    },
  ]

  const securityDeposit = [
    {
      title : 'How does Rent-A-Ride handle security deposits ?',
      content : 'Security Deposits with Gobikes are kept secure and are 100% refundable to the rider after he/she has completed their bike trip and has returned the bike.',
    },
  ]

  const damages = [
    {
      title : 'What should I do in case of a puncture ?',
      content : 'In case of a tyre puncture, find the nearest bike mechanic and get the puncture fixed. As puncture of tyres are unpredictable and depend upon various factors like terrain, style of riding, etc. it does not qualify as a responsibility of the Dealer.'
    }
  ]
  return (
  <div className="flex items-start p-5 lg:p-10">
    <div className="hidden border-2 p-4 border-gray-200 rounded-sm w-fit lg:block">
      <h1 className="text-xl w-full px-4 mb-2">FAQs Section</h1>
      <ul className="w-full">
        <li className="text-lg px-4 py-2">Bookings</li>
        <li className="text-lg px-4 py-2">Bookings Cancellation</li>
        <li className="text-lg px-4 py-2">Safety and Tips</li>
        <li className="text-lg px-4 py-2">Security Deposit</li>
        <li className="text-lg px-4 py-2">Accident or Damage</li>
      </ul>
    </div>
    <div className="w-full lg:w-6/10 mx-auto flex flex-col gap-y-6">
      <div>
        <h1 className="w-full text-center text-base lg:text-left lg:text-xl mb-2">Booking</h1>
        {booking.map((item, index) => (
          <AccordionItem key={index} title={item.title} content={item.content} />
        ))}
      </div>
      <div>
        <h1 className="w-full text-center text-base lg:text-left lg:text-xl mb-2">Booking Cancellation</h1>
        {bookingCancellation.map((item, index) => (
          <AccordionItem key={index} title={item.title} content={item.content} />
        ))}
      </div>
      <div>
        <h1 className="w-full text-center text-base lg:text-left lg:text-xl mb-2">Safety and Tips</h1>
        {safetyAndTips.map((item, index) => (
          <AccordionItem key={index} title={item.title} content={item.content} />
        ))}
      </div>
      <div>
        <h1 className="w-full text-center text-base lg:text-left lg:text-xl mb-2">Security Deposit</h1>
        {securityDeposit.map((item, index) => (
          <AccordionItem key={index} title={item.title} content={item.content} />
        ))}
      </div>
      <div>
        <h1 className="w-full text-center text-base lg:text-left lg:text-xl mb-2">Damages</h1>
        {damages.map((item, index) => (
          <AccordionItem key={index} title={item.title} content={item.content} />
        ))}
      </div>
    </div>
  </div>

  );
};

export default FAQs;
