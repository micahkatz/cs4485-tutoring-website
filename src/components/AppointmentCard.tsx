import React from 'react'
import { IoBookmarkOutline, IoBookmark } from 'react-icons/io5'
import CommonTag from './tag/CommonTag'
import Link from 'next/link'

type Props = {}



const AppointmentCard = (props: Props) => {
    return (
        <div className='w-full h-auto border-secondary border-2 rounded-md mt-6 mb-4 hover:scale-105 hover:cursor-pointer transition-all'>
            <div className='flex m-2'>
                <img src='fakeperson.webp' className='w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 object-cover aspect-square mr-2 border-primary border-2 rounded-md' />
                <div className='flex flex-col w-full'>
                    <span className='text-sm sm:text-base md:text-xl font-bold truncate max-w-[90%]'>Appointment with Jane Doe</span>
                    <span className='text-xs sm:text-sm md:text-base'>Date: March 15, 2023</span>
                    <span className='text-xs sm:text-sm md:text-base'>1:00 PM - 2:00 PM</span>
                </div>
                <div className='w-auto justify-items-end'>
                    <CommonTag name='Math'/>
                </div>
            </div>
        </div>
    )
}

export default AppointmentCard  