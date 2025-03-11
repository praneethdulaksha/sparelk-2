import React from 'react'
import ItemCard from '../ItemCard'

export default function ItemsList({ items }: { items: any[] }) {
    return (
        <div className='grid grid-cols-4 place-items-center gap-8'>
            {
                items.length > 0 ?
                    <>
                        {
                            items.map((n, i) => (
                                <ItemCard
                                    key={i}
                                    itm={n}>
                                </ItemCard>
                            ))
                        }
                    </>
                    : <span>No available products</span>
            }
        </div>
    )
}
