import React from 'react'

type Props = {}

const ActionPanel = (props: Props) => {
    return (
        <div className='bg-blue-200 h-60 relative'>
            <div className="action-panel-layout">
                <div className="action-panel-button">
                    <span className="text-sm">Next Appointment</span>
                    <img src="next_appointment.svg" className="action-panel-image"/>
                    <p className="text-base">Feb. 17</p>
                    <p className="text-sm">1pm • John Doe</p>
                </div>
                <div className="action-panel-button">
                    <span className="text-sm">My Appointment</span>
                    <img src="my_appointments.svg" className="action-panel-image"/>
                    <p className="text-base">1 Scheduled</p>
                </div>
                <div className="action-panel-button">
                    <span className="text-sm">My Bookmarks</span>
                    <img src="my_bookmarks.png" className="action-panel-image"/>
                    <p className="text-base">1 Saved</p>
                </div>
                <div className="action-panel-button">
                    <span className="text-sm">My Profile</span>
                    <img src="my_profile.png" className="action-panel-image"/>
                    <p className="text-base">Micah Katz</p>
                </div>
            </div>
        </div>
    )
}

export default ActionPanel