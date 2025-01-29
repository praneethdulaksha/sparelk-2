import { useEffect, useState } from "react";
import { RootState } from "../../store/store";
import { useDispatch, useSelector } from "react-redux";
import { cartActions } from "../../reducers/cartSlice";
import { api } from "../../api/api";
import Swal from "sweetalert2";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMinus, faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";

type Props = {
    cartItem: any,
    setTotal: (tot: number) => void
}

export default function CartItem({ cartItem, setTotal }: Props) {
    const [cItem, setCItem] = useState(cartItem);
    const [item, setItem] = useState(cartItem);
    const [discountPrice, setDiscountPrice] = useState(0);
    const cartId = useSelector((state: RootState) => state.cart.cartId);
    const dispatch = useDispatch();

    useEffect(() => {
        getItem(cartItem);
    }, [])

    function updateQty(qty: number) {
        setCItem({ ...cItem, qty: qty });
        dispatch(cartActions.updateCartItem({ ...cItem, qty: qty }))
    }

    function getItem(cartItem: any) {
        api.get('item/' + cartItem.itemId).then(result => {
            setItem(result.data.data);
            let price = result.data.data.price
            let discount = price * ((100 - result.data.data.discount) / 100);
            setDiscountPrice(discount);
            let qty = cartItem.qty
            result.data.data.isActive && setTotal(discount * qty)
            !result.data.data.isActive && dispatch(cartActions.removeFromCart(cartItem.itemId))
        }).catch(err => console.log(err));
    }

    function removeItem(itemId: string) {
        Swal.fire({
            text: "Are you sure you want to remove this item from cart?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, Remove it!"
        }).then((result) => {
            if (result.isConfirmed) {
                api.delete(`cart/${cartId}/${itemId}`).then((result) => {
                    dispatch(cartActions.removeFromCart(cartItem.itemId));
                }).catch(err => console.log(err));

                Swal.fire({
                    title: "Item Removed",
                    icon: "success"
                });
            }
        });
    }

    return item?.isActive && (
        <div className='flex h-24 md:h-32 lg:h-40 rounded-2xl items-center bg-pane-color overflow-hidden gap-3 lg:pr-3'>
            <div className='aspect-square h-full bg-cover bg-center' style={{ backgroundImage: `url(http://localhost:3000/images/${item.image})` }}></div>

            <div className='flex flex-grow flex-col justify-between py-3 h-full'>
                <h6 className='text-sm md:text-base lg:text-lg'>{item.name}</h6>
                <h6 className='text-zinc-500 text-sm md:text-base lg:text-lg'>Only {item.stock} item(s) left</h6>
            </div>

            <button onClick={() => {
                // Ask again
                // Remove item from cart
                removeItem(cItem.itemId);
                setTotal(-discountPrice * cItem.qty)
            }}><FontAwesomeIcon icon={faTrash} className='text-base md:text-lg lg:text-2xl w-10 lg:w-20 text-zinc-500' /></button>

            <div className='relative flex flex-col w-24 lg:w-40 h-full mr-3 lg:mr-5'>
                <label className="my-3 text-base md:text-lg lg:text-2xl text-price-color">Rs.{parseFloat(item.price * ((100 - item.discount) / 100) + "").toFixed(2)}</label>
                <h6 className='line-through -mt-3 hidden md:inline-block'>Rs.{item.price}</h6>
                <h6 className='hidden lg:inline-block'>-{item.discount}%</h6>

                <div className='absolute bottom-3 flex items-center mt-8'>
                    <button disabled={cItem.qty == 1 ? true : false}><FontAwesomeIcon icon={faMinus} className='p-1 bg-zinc-300 rounded-full aspect-square text-base'
                        onClick={() => {
                            // update item count in items list
                            updateQty(cItem.qty > 1 ? cItem.qty - 1 : 1);
                            setTotal(-discountPrice)
                        }
                        }
                    /></button>
                    <h5 className='px-5 mb-1 text-price-color'>{cItem.qty}</h5>
                    <button disabled={cItem.qty == item.stock ? true : false}><FontAwesomeIcon icon={faPlus} className='p-1 bg-zinc-300 rounded-full aspect-square text-base'
                        onClick={() => {
                            // update item count in items list
                            updateQty(cItem.qty < item.stock ? cItem.qty + 1 : item.stock)
                            setTotal(discountPrice)
                        }}
                    /></button>
                </div>
            </div>

        </div>
    )
}