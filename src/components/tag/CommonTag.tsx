import React from 'react'

type Props = {
    name: string
}

const CommonTag = (props: Props) => {
    const { name } = props
    return (
        <div className='rounded-full bg-purple-400 px-2 w-fit h-fit'>
            <span className='text-sm'>
                {name}
            </span>
        </div>
    )
}

export default CommonTag