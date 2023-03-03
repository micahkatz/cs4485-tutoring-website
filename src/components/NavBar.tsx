import React from 'react'

type Props = {}

const NavBar = (props: Props) => {
    return (
        <nav className='w-full flex justify-between items-center h-16'>
            <img src="/logo.svg" alt="logo" className="h-full"/>
            <div className="w-full flex justify-between items-center p-4">
                <span className="font-bold pl-10">Tutor.io</span>
                <div className='flex gap-4 items-center'>
                    <span>Home</span>
                    <span>My Appointments</span>
                    <div className='w-10 h-10 rounded-full border-black border-2 flex items-center justify-center' >
                        <span>MK</span>
                    </div>
                </div>
            </div>
        </nav>
    )
}

export default NavBar