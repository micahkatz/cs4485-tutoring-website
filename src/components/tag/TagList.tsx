import React from 'react'
import CommonTag from './CommonTag'
import { subject } from '@prisma/client'

type ClassType = React.HTMLAttributes<HTMLDivElement>['className']
interface Props {
    className?: ClassType;
    tags: subject[]
}

const TagList = (props: Props) => {
    const tags: subject[] = props.tags

    return (
        <div className={`flex flex-wrap gap-2 ${props.className || ''}`}>
            {tags.map(tag => (
                <CommonTag key={tag.subjectID} name={tag.name}/>
            ))}
        </div>
    )
}

export default TagList