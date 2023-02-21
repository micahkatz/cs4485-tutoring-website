import React from 'react'

type Props = {}

const NavBar = (props: Props) => {
    return (
        <nav className='w-full bg-slate-400 flex justify-between items-center p-4'>
            <span>Tutor.io</span>
            <div className='flex gap-4 items-center'>
                <span>Home</span>
                <span>My Appointments</span>
                <div className='w-10 h-10 rounded-full border-black border-2 flex items-center justify-center' >
                    <span>MK</span>
                </div>
            </div>
        </nav>
    )
}

export default NavBar