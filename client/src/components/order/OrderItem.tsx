import { useEffect, useState } from "react";
import { api } from "../../api/api";
import { Package } from "lucide-react";

export default function OrderItem({ oItem, setTotal, setOrderItemTotal }: any) {
  const [orderItem] = useState(oItem);
  const [item, setItem] = useState(oItem);
  const [reqSend, setReqSend] = useState(false);

  useEffect(() => {
    if (!reqSend) {
      console.log(oItem);
      getItem(oItem);
      setReqSend(true);
    }
  }, []);

  function getItem(cartItem: any) {
    api
      .get("item/" + cartItem.itemId)
      .then((result) => {
        setItem(result.data.data);
        let itm = result.data.data;
        let price = itm.price * ((100 - itm.discount) / 100) * oItem.qty;
        setOrderItemTotal(itm._id, price);
        setTotal((prevTot: any) => prevTot + price);
      })
      .catch((err) => console.log(err));
  }

  return (
    <div className="flex gap-4 py-4">
      <div className="w-16 h-16 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
        <img
          src={`http://localhost:3000/images/${item.image}`}
          alt={item.name}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="flex-1">
        <h4 className="font-medium text-sm">{item.name}</h4>
        <p className="text-xs text-gray-500">{item.category}</p>
        <div className="flex items-center mt-1">
          <p className="text-xs flex items-center">
            <Package className="h-3 w-3 mr-1" />
            Qty: {orderItem.qty}
          </p>
        </div>
      </div>
      <div className="text-right">
        {item.discount > 0 && (
          <p className="text-xs text-gray-500 line-through">
            Rs. {parseFloat(item.price + "").toLocaleString()}
          </p>
        )}
        <p className="font-medium">
          Rs.{" "}
          {parseFloat(
            (item.price * ((100 - item.discount) / 100)).toFixed(2)
          ).toLocaleString()}
        </p>
        {item.discount > 0 && (
          <p className="text-xs text-green-600">-{item.discount}%</p>
        )}
      </div>
    </div>
  );
}
