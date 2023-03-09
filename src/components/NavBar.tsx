import React from 'react'
import Link from 'next/link'
type Props = {}

const NavBar = (props: Props) => {
    return (
        <nav className='w-full flex justify-between items-center h-16'>
            <img src="/logo.svg" alt="logo" className="h-full" />
            <div className="w-full flex justify-between items-center p-4">
                <Link className="text-primary font-bold pl-10" href='/'>Tutor.io</Link>
                <div className='flex gap-4 items-center'>
                    <Link className='text-primary' href='/'>Home</Link>
                    <span className='text-primary'>My Appointments</span>
                    <Link href='/account' className='w-10 h-10 rounded-full border-black border-2 flex items-center justify-center' >
                        <span className='text-primary'>MK</span>
                    </Link>
                </div>
            </div>
        </nav>
    )
}

export default NavBar