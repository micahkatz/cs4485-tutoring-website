import React from 'react'
import { IoChevronDown, IoSearch } from 'react-icons/io5'

type Props = {}

const SearchBar = (props: Props) => {
    return (
        <div className='flex'>
            <div className='my-2 gap-2 grid grid-cols-3 sm:grid-cols-5'>
                <div className='bg-gray-400 rounded-sm px-2 py-1 flex gap-2 items-center col-span-3 sm:col-span-2'>
                    <IoSearch className='min-w-[1rem]' />
                    <input
                        className='placeholder-black text-sm bg-transparent truncate w-full'
                        placeholder='Search Tutors'
                    >
                    </input>
                </div>
                <button className='bg-gray-400 rounded-sm px-2 py-1 flex items-center justify-center gap-2'>
                    <span className='text-sm truncate'>Subject</span>
                    <IoChevronDown className='min-w-[1rem]' />
                </button>
                <button className='bg-gray-400 rounded-sm px-2 py-1 flex items-center justify-center gap-2'>
                    <span className='text-sm truncate'>Days</span>
                    <IoChevronDown className='min-w-[1rem]' />
                </button>
                <button className='bg-gray-400 rounded-sm px-2 py-1 flex items-center justify-center gap-2'>
                    <span className='text-sm truncate'>Hours</span>
                    <IoChevronDown className='min-w-[1rem]' />
                </button>
            </div>
        </div>
    )
}

export default SearchBar