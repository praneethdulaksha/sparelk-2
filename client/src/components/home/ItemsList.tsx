import ItemCard from "../ItemCard";
import { motion } from "framer-motion";

export default function ItemsList({
  items,
  className,
}: {
  items: any[];
  className?: string;
}) {
  return (
    <div
      className={
        "grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full " +
        className
      }
    >
      {items.length > 0 ? (
        <>
          {items.map((n, i) => (
            <motion.div
              key={n._id}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * (i + 1) }}
              className="h-full"
            >
              <ItemCard itm={n}></ItemCard>
            </motion.div>
          ))}
        </>
      ) : (
        <div className="col-span-4 text-gray-600 px-5 py-3 text-center">
          No available products
        </div>
      )}
    </div>
  );
}
