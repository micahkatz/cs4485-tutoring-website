import React from 'react'

type Props = {
    name: string
}

const CommonTag = (props: Props) => {
    const { name } = props
    return (
        <div className='rounded-sm bg-purple-400 px-2 py-1 w-fit'>
            <span className='text-sm'>
                {name}
            </span>
        </div>
    )
}

export default CommonTag