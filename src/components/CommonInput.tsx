import React, { InputHTMLAttributes } from 'react'
interface Props extends React.InputHTMLAttributes<HTMLTextAreaElement | HTMLInputElement> {
    outerClass?: string;
    innerClass?: string;
    type?: 'TextArea' | 'Input'
}

const CommonInput = (props: Props) => {
    const { innerClass, outerClass, type, ...leftoverProps } = props
    return (
        <div className={`flex flex-col ${props.outerClass}`}>
            <span className='text-sm'>{props.placeholder}</span>
            {
                type === 'TextArea' ? (
                    <textarea
                        placeholder='First Name'
                        aria-multiline='true'
                        {...leftoverProps}
                        className={`border-primary border-2 px-2 py-1 rounded-md mb-2 ${props.innerClass}`}
                    />
                ) : (
                    <input
                        placeholder='First Name'
                        {...leftoverProps}
                        className={`border-primary border-2 px-2 py-1 rounded-md mb-2 ${props.innerClass}`}
                    />
                )
            }
        </div>
    )
}

export default CommonInput