import { useEffect, useState } from "react";
import { RootState } from "../../store/store";
import { useDispatch, useSelector } from "react-redux";
import { cartActions } from "../../reducers/cartSlice";
import { api } from "../../api/api";
import Swal from "sweetalert2";
import { FiLayout, FiMinus, FiPenTool, FiPlus } from "react-icons/fi";

type Props = {
    cartItem: any,
    setTotal: (tot: number) => void
}

export default function CartItem() {
    // const [cItem, setCItem] = useState(cartItem);
    // const [item, setItem] = useState(cartItem);
    // const [discountPrice, setDiscountPrice] = useState(0);
    // const cartId = useSelector((state: RootState) => state.cart.cartId);
    // const dispatch = useDispatch();

    // useEffect(() => {
    //     getItem(cartItem);
    // }, [])

    // function updateQty(qty: number) {
    //     setCItem({ ...cItem, qty: qty });
    //     dispatch(cartActions.updateCartItem({ ...cItem, qty: qty }))
    // }

    // function getItem(cartItem: any) {
    //     api.get('item/' + cartItem.itemId).then(result => {
    //         setItem(result.data.data);
    //         let price = result.data.data.price
    //         let discount = price * ((100 - result.data.data.discount) / 100);
    //         setDiscountPrice(discount);
    //         let qty = cartItem.qty
    //         result.data.data.isActive && setTotal(discount * qty)
    //         !result.data.data.isActive && dispatch(cartActions.removeFromCart(cartItem.itemId))
    //     }).catch(err => console.log(err));
    // }

    // function removeItem(itemId: string) {
    //     Swal.fire({
    //         text: "Are you sure you want to remove this item from cart?",
    //         icon: "warning",
    //         showCancelButton: true,
    //         confirmButtonColor: "#3085d6",
    //         cancelButtonColor: "#d33",
    //         confirmButtonText: "Yes, Remove it!"
    //     }).then((result) => {
    //         if (result.isConfirmed) {
    //             api.delete(`cart/${cartId}/${itemId}`).then((result) => {
    //                 dispatch(cartActions.removeFromCart(cartItem.itemId));
    //             }).catch(err => console.log(err));

    //             Swal.fire({
    //                 title: "Item Removed",
    //                 icon: "success"
    //             });
    //         }
    //     });
    // }

    return (
        <div className="flex gap-3 w-full border-t border-gray-500 py-5">
      <img
        src="tires-category.png"
        alt="shirt"
        className="aspect-square h-32 rounded-xl"
      />
      <div className="flex-grow relative">
        <div className="flex items-center gap-4">
          <h5 className=" text-gray-800">Spare Part 001</h5>
          <FiPlus className="border rounded-full text-3xl text-gray-600" />
          2
          <FiMinus className="border rounded-full text-3xl text-gray-600" />
          <div className="flex-grow"></div>
          <span className="border-2 rounded-lg border-gray-600 py-1 px-3">
            $28
          </span>
        </div>

        <div className="flex mt-2">
          <span className=" flex items-center gap-2 pr-4 text-gray-600">
            <FiPenTool /> Category
          </span>
          <span className="border-l border-gray-600  flex items-center gap-2 px-4 text-gray-600">
            <FiLayout /> 2XL
          </span>
        </div>

        <button
          type="button"
          className="text-base text-red-500 font-bold absolute right-0 bottom-0 hover:text-red-700 duration-100"
        >
          Remove
        </button>
      </div>
    </div>
    )
}