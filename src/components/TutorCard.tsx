import React from 'react'
import { IoBookmarkOutline, IoBookmark } from 'react-icons/io5'
import TagList from './tag/TagList'
import Link from 'next/link'

type Props = {}

const TutorCard = (props: Props) => {
    return (
        <Link
            className='border-secondary border-2 rounded-md p-2 m-2 w-auto h-auto hover:scale-105 transition-all'
            href='/tutor/123'
        >
            {/*<div className='bg-layer01 w-40 h-40' />*/}
            <img src='fakeperson.webp' className='w-full object-cover aspect-square' />
            <p className='text-lg w-full text-primary'>Jane Doe</p>
            <p className='text-sm w-full text-primary text-left line-clamp-2 md:line-clamp-3'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Facere delectus, voluptates iste in laboriosam tempora iure praesentium nemo dolor id accusamus totam aperiam dicta a provident accusantium obcaecati sapiente cumque.</p>
            <div className='w-full flex mt-2 gap-2 justify-between'>
                <TagList />
                <button>
                    <IoBookmarkOutline size='2rem' className='' />
                </button>
            </div>
        </Link>
    )
}

export default TutorCard