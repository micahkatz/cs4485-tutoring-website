import React from 'react'
import { IoBookmarkOutline, IoBookmark } from 'react-icons/io5'

type Props = {}

const TutorCard = (props: Props) => {
    return (
        <div className='border-secondary border-2 rounded-sm p-2 m-2 w-auto h-auto hover:bg-primary'>
            {/*<div className='bg-layer01 w-40 h-40' />*/}
            <img src='fakeperson.webp' className='w-44 h-44'/>
            <p className='text-lg w-44 max-w-1 text-primary'>Jane Doe</p>
            <p className='text-sm w-44 max-w-1 text-primary'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Facere delectus, voluptates... {/*, iste in laboriosam tempora iure praesentium nemo dolor id accusamus totam aperiam dicta a provident accusantium obcaecati sapiente cumque.*/}</p>
            <div className='w-44 max-w-1 h-auto flex'>
                <div className='flex w-36 h-auto max-h-1 flex-wrap'>
                    <span className='bg-purple-500 w-auto h-6 text-sm p-0.5 mt-2 mr-2'>MATH</span>
                    <span className='bg-purple-500 w-auto h-6 text-sm p-0.5 mt-2 mr-2'>BIOLOGY</span>
                </div>
                <button>
                    <IoBookmarkOutline size='2rem' className='mt-1.5' />
                </button>
            </div>
        </div>
    )
}

export default TutorCard