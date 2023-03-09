import React from 'react'
import CommonTag from './CommonTag'

type ClassType = React.HTMLAttributes<HTMLDivElement>['className']
interface Props {
    className?: ClassType;
}

const TagList = (props: Props) => {
    return (
        <div className={`flex flex-wrap gap-2 ${props.className || ''}`}>
            <CommonTag
                name='Math'
            />
            <CommonTag
                name='Science'
            />
            <CommonTag
                name='Math'
            />
            {/* <CommonTag
                name='Science'
            /> */}
        </div>
    )
}

export default TagList