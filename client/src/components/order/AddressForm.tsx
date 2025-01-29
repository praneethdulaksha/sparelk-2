import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { api } from "../../api/api";
import { userActions } from "../../reducers/userSlice";

export default function AddressForm({ isAddressFormOpened, currentAdd, setAddressForm }: any) {
    const [address, setNewAddress] = useState(currentAdd);
    const dispatch = useDispatch();

    const user = useSelector((state: RootState) => state.user.user);

    function saveAddress() {
        let updatedUser = { ...user, cart: null, store: null };
        delete updatedUser.cart;
        delete updatedUser.store;
        api.put('user/' + user?._id, { ...updatedUser, address: address }).then(response => {
            console.log('address saved')
        }).catch(err => console.log(err));
    }

    return (
        <div className={`fixed ${isAddressFormOpened ? 'flex' : 'hidden'} items-center justify-center w-full h-full backdrop-blur-lg top-0 left-0`}>
            <div className='w-96 flex flex-col bg-white border border-gray-300 rounded-2xl p-6'>
                <h3 className='self-center text-2xl font-semibold mb-4'>Address Form</h3>

                <label className='mb-2 text-gray-600'>House/Flat No.</label>
                <input
                    type='text'
                    className='border border-gray-300 rounded-lg p-2 mb-4'
                    value={address?.no}
                    onChange={(e) => setNewAddress({ ...address, no: e.target.value })}
                />

                <label className='mb-2 text-gray-600'>Street</label>
                <input
                    type='text'
                    className='border border-gray-300 rounded-lg p-2 mb-4'
                    value={address?.street}
                    onChange={(e) => setNewAddress({ ...address, street: e.target.value })}
                />

                <label className='mb-2 text-gray-600'>City</label>
                <input
                    type='text'
                    className='border border-gray-300 rounded-lg p-2 mb-6'
                    value={address?.city}
                    onChange={(e) => setNewAddress({ ...address, city: e.target.value })}
                />

                <div className='flex justify-end gap-4'>
                    <button
                        className='bg-gray-300 text-gray-700 rounded-lg px-6 py-2 hover:bg-gray-400 focus:outline-none focus:ring focus:border-blue-300'
                        onClick={() => setAddressForm(false)}
                    >
                        Cancel
                    </button>
                    <button
                        className='bg-blue-500 text-white rounded-lg px-6 py-2 hover:bg-blue-600 focus:outline-none focus:ring focus:border-blue-300'
                        onClick={() => {
                            console.log(address);
                            dispatch(userActions.setAddress(address));
                            saveAddress();
                            setAddressForm(false);
                        }}
                    >
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
}