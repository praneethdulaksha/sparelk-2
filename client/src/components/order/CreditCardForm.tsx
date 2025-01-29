import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { api } from "../../api/api";
import { userActions } from "../../reducers/userSlice";

export default function CreditCardForm({ currentCard, setCreditCardForm }: any) {
    const [creditCard, setNewCreditCard] = useState(currentCard);
    const [saveCard, setSaveCard] = useState(true);

    const dispatch = useDispatch();

    const user = useSelector((state: RootState) => state.user.user);

    function saveCreditCard() {
        let updatedUser = { ...user, cart: null, store: null }
        delete updatedUser.cart;
        delete updatedUser.store;
        // let updateCreditCard = {expiration: `${creditCard.expiryMonth}/${creditCard.expiryYear}`, number: creditCard.cardNumber, cvv: creditCard.cvv}
        // updatedUser = {...updatedUser, creditCard: creditCard}

        api.put('user/' + user?._id, { ...updatedUser, creditCard: creditCard }).then(result => {
            console.log(result.data.data);
            dispatch(userActions.setUser(result.data.data));
        }).catch(err => console.log(err));
    }

    return (
        <div className='fixed flex items-center justify-center w-full h-full backdrop-blur-lg top-0 left-0'>
            <div className='w-96 flex flex-col bg-white border border-gray-300 rounded-2xl p-6'>
                <h3 className='self-center text-2xl font-semibold mb-4'>Card Details</h3>

                <label className='mb-2 text-gray-600'>Card Number</label>
                <input
                    type='text'
                    className='border border-gray-300 rounded-full p-2 mb-4'
                    value={creditCard?.number}
                    onChange={(e) => setNewCreditCard({ ...creditCard, number: e.target.value })}
                />

                <div className='flex gap-4'>
                    <div>
                        <label className='mb-2 text-gray-600'>Expiry Month</label>
                        <input
                            type='number'
                            className='border border-gray-300 rounded-full p-2 w-20'
                            value={creditCard?.expiryMonth}
                            onChange={(e) => setNewCreditCard({ ...creditCard, expiryMonth: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className='mb-2 text-gray-600'>Expiry Year</label>
                        <input
                            type='number'
                            className='border border-gray-300 rounded-full p-2 w-20'
                            value={creditCard?.expiryYear}
                            onChange={(e) => setNewCreditCard({ ...creditCard, expiryYear: e.target.value })}
                        />
                    </div>
                </div>

                <label className='mb-2 text-gray-600'>CVV</label>
                <input
                    type='number'
                    className='border border-gray-300 rounded-full p-2 mb-4'
                    value={creditCard?.cvv}
                    onChange={(e) => setNewCreditCard({ ...creditCard, cvv: e.target.value })}
                />

                <div className='flex items-center mb-4'>
                    <input
                        type='checkbox'
                        className='mr-2'
                        checked={saveCard}
                        onChange={() => {
                            //Save card data
                            setSaveCard(!saveCard);
                        }}
                    />
                    <label className='text-gray-600'>Save card details to account.</label>
                </div>

                <div className='flex justify-end gap-4'>
                    <button
                        className='bg-gray-300 text-gray-700 rounded-full px-6 py-2 hover:bg-gray-400 focus:outline-none focus:ring focus:border-blue-300'
                        onClick={() => setCreditCardForm(false)}
                    >
                        Cancel
                    </button>
                    <button
                        className='bg-blue-500 text-white rounded-full px-6 py-2 hover:bg-blue-600 focus:outline-none focus:ring focus:border-blue-300'
                        onClick={() => {
                            saveCard && saveCreditCard();
                            dispatch(userActions.setCreditCard(creditCard));
                            setCreditCardForm(false);
                        }}
                    >
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
}