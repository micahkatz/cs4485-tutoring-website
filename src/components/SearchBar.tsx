import React from 'react'
import { IoChevronDown, IoSearch } from 'react-icons/io5'

type Props = {}

const SearchBar = (props: Props) => {
    return (
        <div className='my-2 gap-2 flex'>
            <div className='bg-gray-400 rounded-sm px-2 py-1 flex gap-2 items-center'>
                <IoSearch />
                <input
                    className='placeholder-black text-sm bg-transparent'
                    placeholder='Search Tutors'
                >
                </input>
            </div>
            <button className='bg-gray-400 rounded-sm px-2 py-1 flex items-center justify-center gap-2'>
                <span className='text-sm'>Subject</span>
                <IoChevronDown />
            </button>
            <button className='bg-gray-400 rounded-sm px-2 py-1 flex items-center justify-center gap-2'>
                <span className='text-sm'>Days</span>
                <IoChevronDown />
            </button>
            <button className='bg-gray-400 rounded-sm px-2 py-1 flex items-center justify-center gap-2'>
                <span className='text-sm'>Hours</span>
                <IoChevronDown />
            </button>
        </div>
    )
}

export default SearchBar