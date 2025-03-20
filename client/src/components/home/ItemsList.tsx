import ItemCard from '../ItemCard'
import { motion } from 'framer-motion';

export default function ItemsList({ items, className }: { items: any[], className?: string }) {
    return (
        <div className={'grid grid-cols-4 place-items-center gap-8 ' + className}>
            {
                items.length > 0 ?
                    <>
                        {
                            items.map((n, i) => (
                                <motion.div
                                    key={n._id}
                                    initial={{ opacity: 0, y: 40 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.1 * (i + 1) }}
                                >
                                    <ItemCard
                                        itm={n}>
                                    </ItemCard>
                                </motion.div>

                            ))
                        }
                    </>
                    : <div className='col-span-4 text-gray-500 px-5 py-1 border rounded-md'>No available products</div>
            }
        </div>
    )
}
