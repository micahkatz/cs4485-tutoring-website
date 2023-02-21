import React from 'react'

type Props = {}

const TutorCard = (props: Props) => {
    return (
        <div className='border-secondary border-2 rounded-sm p-2'>
            <div className='bg-layer01 h-40 w-40' />
            <p className='text-lg'>John Doe</p>
            <p className='text-sm'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Facere delectus, voluptates, iste in laboriosam tempora iure praesentium nemo dolor id accusamus totam aperiam dicta a provident accusantium obcaecati sapiente cumque.</p>
        </div>
    )
}

export default TutorCard