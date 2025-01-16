import React from 'react'

type Props = {
    children: React.ReactNode;
    className?: string;
}

export default function Section(props: Props) {
    return (
        <div className={'container max-w-7xl flex flex-col items-center ' + props.className}>
            {props.children}
        </div>
    )
}
