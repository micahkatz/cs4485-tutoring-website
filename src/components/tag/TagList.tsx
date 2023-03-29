import React from 'react'
import CommonTag from './CommonTag'

type ClassType = React.HTMLAttributes<HTMLDivElement>['className']
interface Props {
    className?: ClassType;
    tags: string[]
}

const TagList = (props: Props) => {
    const tags: string[] = props.tags

    return (
        <div className={`flex flex-wrap gap-2 ${props.className || ''}`}>
            {tags.map(tag => (
                <CommonTag name={tag}/>
            ))}
        </div>
    )
}

export default TagList