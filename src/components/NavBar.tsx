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
                    <Link className='text-primary' href='/appointments'>My Appointments</Link>
                    <Link href='/signup' className='w-10 h-10 rounded-full bg-placeholder flex items-center justify-center' >
                        {/* <span className='text-primary'>MK</span> */}
                    </Link>
                    {/* <Link href='/account' className='w-10 h-10 rounded-full border-black bg-placeholder border-2 flex items-center justify-center' >
                        {/* <span className='text-primary'>MK</span> */}
                    {/* </Link> */}
                </div>
            </div>
        </nav >
    )
}

export default NavBar