import React, { useEffect, ChangeEvent, MouseEventHandler } from 'react'
import Link from 'next/link'
import { IoChevronBack, IoChevronDown, IoSearch, IoReload } from 'react-icons/io5'
import { subject } from '@prisma/client'

type Props = {
    setName: React.Dispatch<React.SetStateAction<string>>;
    setSubject: React.Dispatch<React.SetStateAction<string>>;
    setDay: React.Dispatch<React.SetStateAction<Date | undefined>>;
    setHours: React.Dispatch<React.SetStateAction<Date | undefined>>;
    subject: string
    day: Date | undefined
    hours: Date | undefined
}

const SearchBar = (props: Props) => {
    const [isLoading, setLoading] = React.useState<boolean>(true)
    const [subjects, setSubjects] = React.useState<subject[]>([])
    const [subjectDisplay, setSubjectDisplay] = React.useState<boolean>(false)
    const [filtersApplied, setFiltersApplied] = React.useState<boolean>(false)
    const setName = props.setName, setSubject = props.setSubject, setDay = props.setDay, setHours = props.setHours
    const subject = props.subject, day = props.day, hours = props.hours
    let nameInput = React.createRef<HTMLInputElement>()

    const fetchSubjects = async () => {
        await fetch('api/subject', {method: 'GET'})
        .then((resp) => resp.json())
        .then((json) => {
            // read json as tutor array
            const result = json as subject[]
            
            // Check if tutor data is not undefined
            if(result) {
                // Update data state
                setSubjects(result)

                // No longer loading
                setLoading(false)
            }
        })
        .catch((error) => {
            setSubjects([])
            setLoading(false)
            console.error('error loading subject data')
            return
        })
    }

    const updateName = (event: React.ChangeEvent<HTMLElement>) => {
        let target = event.target as HTMLInputElement
        setName(target.value)
    }

    const updateSubject = (event: React.MouseEvent<HTMLElement>) => {
        toggleSubjectDisplay()
        let target = event.target as HTMLButtonElement
        //console.log("Subject Key:", target.getAttribute('key-subjectid'))
        let id = target.getAttribute('key-subjectid')
        if(id) {
            // parse id string to int
            let id_num = parseInt(id)
            for(let i = 0; i < subjects.length; i++) {
                if(subjects[i].subjectID == id_num) {
                    setSubject(subjects[i].name)
                    return
                }
            }
        }
        else {
            console.error('error updating subject')
            return
        }
        console.error('Could not find subject ID', id)
    }

    /*
    const updateDay = (event: ChangeEvent) => {
        let target = event.target as HTMLInputElement
        setDay(target.value)
    }
    
    const updateHours = (event: ChangeEvent) => {
        let target = event.target as HTMLInputElement
        setHours(target.value)
    }
    */

    const resetSearch = () => {
        // Reset name, clear text input
        setName("")
        if(nameInput.current)
            nameInput.current.value = ""
        
        // Reset everything else
        setSubject("")
    }

    const toggleSubjectDisplay = () => {
        setSubjectDisplay(!subjectDisplay)
    }

    useEffect(() => {
        fetchSubjects()
    }, [])

    useEffect(() => {
        setFiltersApplied((nameInput.current && nameInput.current.value != '') || subject != '')
    }, [nameInput, subject, day, hours])

    if(isLoading) {
        return <></>
    }
    else {
        return (
            <div className='flex'>
                <div className='my-2 gap-2 grid grid-cols-3 sm:grid-cols-5 items-start'>
                    <div className='bg-gray-400 rounded-sm px-2 py-1 flex gap-2 items-center col-span-3 sm:col-span-2'>
                        <IoSearch className='min-w-[1rem]' />
                        <input
                            className='placeholder-black text-sm bg-transparent truncate w-full'
                            placeholder='Search Tutors'
                            onChange={updateName}
                            ref={nameInput}
                        >
                        </input>
                    </div>
                    <div className='rounded-sm gap-2'>
                        <button className='bg-gray-400 flex items-center justify-between w-full h-full px-2 py-1' onClick={toggleSubjectDisplay}>
                            <span className='text-sm truncate items-center'>{subject != "" && subject || ('Subject')}</span>
                            {!subjectDisplay && (
                                <IoChevronDown className='min-w-[1rem]' />
                            ) || (<IoChevronBack className='min-w-[1rem]' />)}
                        </button>
                        {subjectDisplay && (
                        <ul className='w-full'>
                            {subjects.map(subject => (
                                <li key={subject.subjectID} className='text-center mt-1 bg-secondary border-white border-2 hover:border-black transition-colors'><button key={subject.subjectID} key-subjectid={subject.subjectID} onClick={updateSubject} className='w-full h-full'>{subject.name}</button></li>
                            ))}
                        </ul>)}
                    </div>
                    <button className='bg-gray-400 rounded-sm px-2 py-1 flex items-center justify-between gap-2'>
                        <span className='text-sm truncate'>Day</span>
                        <IoChevronDown className='min-w-[1rem]' />
                    </button>
                    <button className='bg-gray-400 rounded-sm px-2 py-1 flex items-center justify-between gap-2'>
                        <span className='text-sm truncate'>Hours</span>
                        <IoChevronDown className='min-w-[1rem]' />
                    </button>
                </div>
                {filtersApplied && <div className='mt-8 sm:mt-[0.8rem] md:mt-[0.85rem] ml-4 items-start'>
                    <IoReload onClick={resetSearch} className='text-base text-red-500 font-bold opacity-50 hover:opacity-100 hover:scale-125 transition-all' cursor={'pointer'}/>
                </div>}
            </div>
        )
    }
}

export default SearchBar