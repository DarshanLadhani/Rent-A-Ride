import React from 'react'
import AccordionItem from '../Accordion/Accordion.jsx';

function GeneralQuestions() {
    const generalQuestions = [
        {
            title: 'Is fuel included in tariff ?',
            content: 'All prices are exclusive of fuel. We provide minimal amount of fuel to get the vehicle to the nearest fuel station. In case there is excess fuel in the vehicle at the time of return, Gobikes is not liable for any refunds for the same.',
        },
        {
            title: 'How can I book a bike without seeing it physically ?',
            content: 'We offer a 100% money back guarantee. Pay a commitment advance to reserve the bike. Reach location and test drive your bike. If there is any issue in the vehicle, raise a ticket and you shall be refunded 100% of the amount you have paid us. No questions asked in case there is a mechanical fault in the Vehicle.',
        },
        {
            title: 'How does Rent-A-Ride handle security deposits ?',
            content: 'Security Deposits with Gobikes are kept secure and are 100% refundable to the rider after he/she has completed their bike trip and has returned the bike.',
        },
        {
            title: 'What should I do if the bike breaks down ? ',
            content: 'We make sure that the bike we give to our Riders is of the best quality. However, some circumstances are beyond our control in such cases of bike troubles, it is best to call the Dealer and he will assist you at once by either fixing the problem or providing you with a replacement bike.',
        },
    ];
    return (
        <div className='w-full md:w-8/10 lg:w-6/10 mx-auto p-5'>
            <h1 className='text-xl lg:text-2xl xl:text-3xl  text-center leading-normal font-semibold mb-4'>Explore Common Questions</h1>
            {generalQuestions.map((item, index) => (
                <AccordionItem key={index} title={item.title} content={item.content} />
            ))}
        </div>
    )
}

export default GeneralQuestions