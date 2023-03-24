import React from 'react'
import { IoCalendarClearOutline, IoCalendarClear, IoCalendarOutline, IoCalendar, IoBookmarksOutline, IoBookmarks, IoPersonOutline, IoPerson } from 'react-icons/io5'

type Props = {}

const ActionPanel = (props: Props) => {
    return (
        <div className='bg-secondary w-full h-auto'>
            <div className="flex justify-center w-auto h-full">
                <div className="grid grid-cols-2 sm:grid-cols-4 align-middle">
                    <div className="h-full m-auto mx-8 my-4 m align-top text-center font-bold space-y-1 max-w-1">
                        <span className="text-xs md:text-sm line-clamp-1">Next Appointment</span>
                        <IoCalendarClearOutline fontSize="7rem" className="h-auto max-h-[75%] sm:max-h-[100%] max-w-[75%] sm:max-w-[100%] m-auto"/>
                        <p className="text-sm md:text-base line-clamp-1">Feb. 17</p>
                        <p className="text-xs md:text-sm line-clamp-1">1pm • John Doe</p>
                    </div>
                    <div className="h-full m-auto mx-8 my-4 align-top text-center font-bold space-y-1 max-w-1">
                        <span className="text-xs md:text-sm line-clamp-1">My Appointment</span>
                        <IoCalendarOutline size='7rem' className="h-auto max-h-[75%] sm:max-h-[100%] max-w-[75%] sm:max-w-[100%] m-auto"/>
                        <p className="text-sm md:text-base line-clamp-1">1 Scheduled</p>
                    </div>
                    <div className="h-full m-auto mx-8 my-4 align-top text-center font-bold space-y-1 max-w-1">
                        <span className="text-xs md:text-sm line-clamp-1">My Bookmarks</span>
                        <IoBookmarksOutline size='7rem' className="h-auto max-h-[75%] sm:max-h-[100%] max-w-[75%] sm:max-w-[100%] m-auto"/>
                        <p className="text-sm md:text-base line-clamp-1">0 Saved</p>
                    </div>
                    <div className="h-full m-auto mx-8 my-4 align-top text-center font-bold space-y-1 max-w-1">
                        <span className="text-xs md:text-sm line-clamp-1">My Profile</span>
                        <IoPersonOutline size='7rem' className="h-auto max-h-[75%] sm:max-h-[100%] max-w-[75%] sm:max-w-[100%] m-auto"/>
                        <p className="text-sm md:text-base line-clamp-1">Micah Katz</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ActionPanel