import React, { ChangeEvent } from 'react'
import { IoChevronDown, IoSearch } from 'react-icons/io5'

type Props = {
    setName: React.Dispatch<React.SetStateAction<string>>;
    setSubject: React.Dispatch<React.SetStateAction<string>>;
    setDay: React.Dispatch<React.SetStateAction<Date | undefined>>;
    setHours: React.Dispatch<React.SetStateAction<Date | undefined>>;
}

const SearchBar = (props: Props) => {
    
    const setName = props.setName, setSubject = props.setSubject, setDay = props.setDay, setHours = props.setHours

    const updateName = (event: ChangeEvent) => {
        let target = event.target as HTMLInputElement
        setName(target.value)
    }

    /*
    const updateSubject = (event: ChangeEvent) => {
        let target = event.target as HTMLInputElement
        setSubject(target.value)
    }
    
    const updateDay = (event: ChangeEvent) => {
        let target = event.target as HTMLInputElement
        setDay(target.value)
    }
    
    const updateHours = (event: ChangeEvent) => {
        let target = event.target as HTMLInputElement
        setHours(target.value)
    }
    */

    return (
        <div className='flex'>
            <div className='my-2 gap-2 grid grid-cols-3 sm:grid-cols-5'>
                <div className='bg-gray-400 rounded-sm px-2 py-1 flex gap-2 items-center col-span-3 sm:col-span-2'>
                    <IoSearch className='min-w-[1rem]' />
                    <input
                        className='placeholder-black text-sm bg-transparent truncate w-full'
                        placeholder='Search Tutors'
                        onChange={updateName}
                    >
                    </input>
                </div>
                <button className='bg-gray-400 rounded-sm px-2 py-1 flex items-center justify-center gap-2'>
                    <span className='text-sm truncate'>Subject</span>
                    <IoChevronDown className='min-w-[1rem]' />
                </button>
                <button className='bg-gray-400 rounded-sm px-2 py-1 flex items-center justify-center gap-2'>
                    <span className='text-sm truncate'>Day</span>
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