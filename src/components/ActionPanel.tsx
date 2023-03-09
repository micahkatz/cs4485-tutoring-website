import React from 'react'
import { IoCalendarClearOutline, IoCalendarClear, IoCalendarOutline, IoCalendar, IoBookmarksOutline, IoBookmarks, IoPersonOutline, IoPerson } from 'react-icons/io5'

type Props = {}

const ActionPanel = (props: Props) => {
    return (
        <div className='bg-blue-200 h-60 w-full'>
            <div className="flex justify-center w-auto h-full">
                <div className="grid grid-cols-4 align-middle">
                    <div className="h-48 m-auto ml-8 mr-8 align-top text-center font-bold space-y-1 max-w-1">
                        <span className="text-sm">Next Appointment</span>
                        <IoCalendarClearOutline fontSize="7rem" className="m-auto"/>
                        <p className="text-base">Feb. 17</p>
                        <p className="text-sm">1pm • John Doe</p>
                    </div>
                    <div className="h-48 m-auto ml-8 mr-8 align-top text-center font-bold space-y-1 max-w-1">
                        <span className="text-sm">My Appointment</span>
                        <IoCalendarOutline size='7rem' className="m-auto"/>
                        <p className="text-base">1 Scheduled</p>
                    </div>
                    <div className="h-48 m-auto ml-8 mr-8 align-top text-center font-bold space-y-1 max-w-1">
                        <span className="text-sm">My Bookmarks</span>
                        <IoBookmarksOutline size='7rem' className="m-auto"/>
                        <p className="text-base">0 Saved</p>
                    </div>
                    <div className="h-48 m-auto ml-8 mr-8 align-top text-center font-bold space-y-1 max-w-1">
                        <span className="text-sm">My Profile</span>
                        <IoPersonOutline size='7rem' className="m-auto"/>
                        <p className="text-base">Micah Katz</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ActionPanel