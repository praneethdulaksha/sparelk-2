import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPenToSquare } from '@fortawesome/free-regular-svg-icons'
import { useState } from 'react'
import { faEye, faEyeSlash, faTrash } from '@fortawesome/free-solid-svg-icons'
import { useDispatch, useSelector } from 'react-redux'
import Swal from 'sweetalert2'
import { RootState } from '../../store/store'
import { api } from '../../api/api'
import { userActions } from '../../reducers/userSlice'
import { TAddress, TCreditCard, TUser } from '../../types'

export default function MyProfile() {
    const dispatch = useDispatch();

    const user = useSelector((state: RootState) => state.user.user);

    if (!user) return <></>

    const [tempUser, setTempUser] = useState<TUser>(user)
    const [validations, setValidations] = useState({ firstName: true, lastName: true, email: true, password: true })
    const [isPasswordVisible, setPasswordVisible] = useState(false);
    const [isAddressFormOpened, setAddressFormOpened] = useState(false);
    const [isCreditCardFormOpened, setCreditCardFormOpened] = useState(false);

    function saveUser() {
        if (validations.firstName && validations.lastName && validations.email && validations.password) {
            api.put('user/' + user?._id, tempUser).then(response => {
                dispatch(userActions.updateUser(tempUser));
                updateUserSuccesAlert();
            }).catch(err => console.log(err));
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Please fill in all fields'
            })
        }
    }

    const updateUserSuccesAlert = () => {
        Swal.fire({
            position: "top-end",
            icon: "success",
            title: "User Profile Updated",
            showConfirmButton: false,
            timer: 1500
        });
    }

    function removeCreditCard() {
        console.log('removeCreditCard');
        setCreditCard(null);
    }

    function setAddress(address: TAddress | null) {
        setTempUser({ ...tempUser, address: address });
    }

    function setCreditCard(creditCard: TCreditCard | null) {
        setTempUser({ ...tempUser, creditCard: creditCard });
    }

    const checkValidations = (field: string, text: string) => {
        if (field === 'firstName') {
            !/^[^0-9]*[a-zA-Z]{2,}[^0-9]*$/.test(text)
                ? setValidations({ ...validations, firstName: false }) : setValidations({ ...validations, firstName: true })
        } else if (field === 'lastName') {
            !/^[^0-9]*[a-zA-Z]{2,}[^0-9]*$/.test(text)
                ? setValidations({ ...validations, lastName: false }) : setValidations({ ...validations, lastName: true })
        } else if (field === 'email') {
            !/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(text)
                ? setValidations({ ...validations, email: false }) : setValidations({ ...validations, email: true })
        } else if (field === 'password') {
            !/^.{6,}$/.test(text)
                ? setValidations({ ...validations, password: false }) : setValidations({ ...validations, password: true })
        }
    }


    return (
        <div className='p-3'>

            <div>
                <div className='flex items-center justify-between'>
                    <h3 className=' text-3xl md:text-4xl'>Personal Details</h3>
                </div>
                <div className='flex flex-col md:ml-14 mt-1 gap-5 text-zinc-700 w-full sm:w-80 mb-10' >
                    <div className='flex flex-col'>
                        <label className='text-zinc-500'>First Name</label>
                        <input type='text' className={`border ${validations.firstName ? 'bg-green-100' : 'bg-red-100'} rounded-md h-10 p-3`} value={tempUser.firstName}
                            onChange={e => {
                                setTempUser({ ...tempUser, firstName: e.target.value })
                                checkValidations('firstName', e.target.value);
                            }} />
                    </div>
                    <div className='flex flex-col'>
                        <label className='text-zinc-500'>Last Name</label>
                        <input type='text' className={`border ${validations.lastName ? 'bg-green-100' : 'bg-red-100'} rounded-md h-10 p-3`} value={tempUser.lastName}
                            onChange={e => {
                                setTempUser({ ...tempUser, lastName: e.target.value })
                                checkValidations('lastName', e.target.value);
                            }} />
                    </div>
                    <div className='flex flex-col'>
                        <label className='text-zinc-500'>Email</label>
                        <input type='email' className={`border ${validations.email ? 'bg-green-100' : 'bg-red-100'} rounded-md h-10 p-3`} value={tempUser.email}
                            onChange={e => {
                                setTempUser({ ...tempUser, email: e.target.value })
                                checkValidations('email', e.target.value);
                            }} />
                    </div>
                    <div className='flex flex-col relative'>
                        <label className='text-zinc-500'>Password (Minimum 6 characters)</label>
                        <input type={isPasswordVisible ? 'text' : 'password'} className={`border ${validations.password ? 'bg-green-100' : 'bg-red-100'} rounded-md h-10 p-3`} value={tempUser.password}
                            onChange={e => {
                                setTempUser({ ...tempUser, password: e.target.value })
                                checkValidations('password', e.target.value);
                            }} />
                        <FontAwesomeIcon className='absolute right-2 top-9' icon={isPasswordVisible ? faEye : faEyeSlash} onClick={() => setPasswordVisible(!isPasswordVisible)} />
                    </div>
                </div>

                <h3 className=' text-3xl md:text-4xl'>Delivery Address</h3>
                <div className='min-w-80 h-fit py-3 mt-2 mb-10 bg-green-100 rounded-lg md:mx-14 flex items-center justify-between pl-5 text-gray-600'>
                    {
                        tempUser.address ?
                            <h4 className='text-lg'>{`${tempUser.address.no}, ${tempUser.address.street}, ${tempUser.address.city}`}</h4>
                            : <h4>Add Address</h4>
                    }
                    <FontAwesomeIcon className='mr-6 text-2xl' icon={faPenToSquare} onClick={() => setAddressFormOpened(!isAddressFormOpened)} />
                    {
                        isAddressFormOpened && <AddressForm currentAdd={tempUser.address} setAddress={setAddress} setAddressForm={setAddressFormOpened} />
                    }
                </div>

                <h3 className=' text-3xl md:text-4xl'>Payment Info</h3>
                <div className='h-fit py-3 mt-2 mb-10 bg-green-100 rounded-lg md:mx-14 flex items-center justify-between pl-5 text-gray-600'>
                    <h4 className='text-lg'>{tempUser.creditCard ? `Credit Card : **** **** **** ${tempUser.creditCard.number.substring(12)}` : 'Add Credit Card'}</h4>
                    <div>
                        <FontAwesomeIcon className='mr-6 text-2xl' icon={faPenToSquare} onClick={() => setCreditCardFormOpened(!isCreditCardFormOpened)} />
                        {tempUser.creditCard && <FontAwesomeIcon className='mr-6 text-2xl' icon={faTrash} onClick={() => removeCreditCard()} />}
                    </div>
                    {
                        isCreditCardFormOpened && <CreditCardForm currentCard={tempUser.creditCard} setCreditCard={setCreditCard} setCreditCardForm={setCreditCardFormOpened} />
                    }
                </div>

                <div className='flex justify-end'>
                    <button className='w-fit bg-green-400 rounded-md ml-5 px-4'
                        onClick={() => saveUser()}
                    >Update</button>
                    <button className='w-fit bg-red-400 rounded-md ml-5 px-4'
                        onClick={() => {
                            setTempUser(user)
                            setValidations({ firstName: true, lastName: true, email: true, password: true });
                        }}
                    >Cancel</button>
                </div>
            </div>
        </div>
    )
}

function AddressForm({ setAddress, currentAdd, setAddressForm }: any) {
    const [address, setNewAddress] = useState(currentAdd);
    const [validations, setValidations] = useState({ no: true, street: true, city: true });

    const checkValidations = (field: string, text: string) => {
        if (field === 'no') {
            !text ? setValidations({ ...validations, no: false }) : setValidations({ ...validations, no: true });
        } else if (field === 'street') {
            !text ? setValidations({ ...validations, street: false }) : setValidations({ ...validations, street: true });
        } else if (field === 'city') {
            !text ? setValidations({ ...validations, city: false }) : setValidations({ ...validations, city: true });
        }
    }

    return (
        <div className={`fixed flex items-center justify-center w-full h-full backdrop-blur-lg top-0 left-0`}>
            <div className='w-96 flex flex-col bg-white border border-gray-300 rounded-2xl p-6'>
                <h3 className='self-center text-2xl font-semibold mb-4'>Address Form</h3>

                <label className='mb-2 text-gray-600'>House/Flat No.</label>
                <input
                    type='text'
                    className={`border border-gray-300 rounded-lg p-2 mb-4 ${validations.no ? 'bg-green-100' : 'bg-red-100'}`}
                    value={address?.no}
                    onChange={(e) => {
                        setNewAddress({ ...address, no: e.target.value })
                        checkValidations('no', e.target.value);
                    }}
                />

                <label className='mb-2 text-gray-600'>Street</label>
                <input
                    type='text'
                    className={`border border-gray-300 rounded-lg p-2 mb-4 ${validations.street ? 'bg-green-100' : 'bg-red-100'}`}
                    value={address?.street}
                    onChange={(e) => {
                        setNewAddress({ ...address, street: e.target.value })
                        checkValidations('street', e.target.value);
                    }}
                />

                <label className='mb-2 text-gray-600'>City</label>
                <input
                    type='text'
                    className={`border border-gray-300 rounded-lg p-2 mb-4 ${validations.city ? 'bg-green-100' : 'bg-red-100'}`}
                    value={address?.city}
                    onChange={(e) => {
                        setNewAddress({ ...address, city: e.target.value })
                        checkValidations('city', e.target.value);
                    }}
                />

                <div className='flex justify-end gap-4'>
                    <button className='bg-gray-200 text-gray-700 rounded-lg px-6 py-2 hover:bg-gray-300 focus:outline-none focus:ring focus:border-blue-300'
                        onClick={() => { setAddressForm(false) }}>
                        Cancel
                    </button>
                    <button
                        className='bg-blue-400 text-gray-700 rounded-lg px-6 py-2 hover:bg-blue-500 focus:outline-none focus:ring focus:border-blue-300'
                        onClick={() => {
                            if (validations.no && validations.street && validations.city) {
                                setAddressForm(false)
                                setAddress(address)
                            } else {
                                Swal.fire({
                                    icon: 'error',
                                    title: 'Please fill all the fields'
                                })
                            }
                        }}
                    >
                        Ok
                    </button>
                </div>
            </div>
        </div>
    );
}


function CreditCardForm({ setCreditCard, currentCard, setCreditCardForm }: any) {
    const [creditCard, setNewCreditCard] = useState(currentCard);
    const [validations, setValidations] = useState({ number: true, month: true, year: true, cvv: true });

    const checkValidations = (field: string, text: string) => {
        if (field === 'number') {
            !/^\d{16}$/.test(text) ? setValidations({ ...validations, number: false }) : setValidations({ ...validations, number: true });
        } else if (field === 'month') {
            !/^(0[1-9]|1[0-2])$/.test(text) ? setValidations({ ...validations, month: false }) : setValidations({ ...validations, month: true });
        } else if (field === 'year') {
            (parseInt(text) < 24) ? setValidations({ ...validations, year: false }) : setValidations({ ...validations, year: true });
        } else if (field === 'cvv') {
            !/^\d{3}$/.test(text) ? setValidations({ ...validations, cvv: false }) : setValidations({ ...validations, cvv: true });
        }
    }

    return (
        <div className='fixed flex items-center justify-center w-full h-full backdrop-blur-lg top-0 left-0'>
            <div className='w-96 flex flex-col bg-white border border-gray-300 rounded-2xl p-6'>
                <h3 className='self-center text-2xl font-semibold mb-4'>Card Details</h3>

                <label className='mb-2 text-gray-600'>Card Number</label>
                <input
                    type='text' placeholder='XXXXXXXXXXXXXXXX'
                    className={`border border-gray-300 rounded-lg p-2 mb-4 ${validations.number ? 'bg-green-100' : 'bg-red-100'}`}
                    value={creditCard?.number}
                    onChange={(e) => {
                        setNewCreditCard({ ...creditCard, number: e.target.value })
                        checkValidations('number', e.target.value);
                    }}
                />

                <div className='flex gap-4 mb-4'>
                    <div className='flex flex-col gap-2'>
                        <label className='text-gray-600'>Expiry Month</label>
                        <input
                            type='number' placeholder='MM'
                            className={`w-16 border border-gray-300 rounded-lg p-2 ${validations.month ? 'bg-green-100' : 'bg-red-100'}`}
                            value={creditCard?.expiryMonth}
                            onChange={(e) => {
                                setNewCreditCard({ ...creditCard, expiryMonth: e.target.value })
                                checkValidations('month', e.target.value);
                            }}
                        />
                    </div>

                    <div className='flex flex-col gap-2'>
                        <label className='text-gray-600'>Expiry Year</label>
                        <input
                            type='number' placeholder='YY'
                            className={`w-16 border border-gray-300 rounded-lg p-2 ${validations.year ? 'bg-green-100' : 'bg-red-100'}`}
                            value={creditCard?.expiryYear}
                            onChange={(e) => {
                                setNewCreditCard({ ...creditCard, expiryYear: e.target.value })
                                checkValidations('year', e.target.value);
                            }}
                        />
                    </div>
                </div>

                <label className='mb-2 text-gray-600'>CVV</label>
                <input
                    type='number' placeholder='CVV'
                    className={`border border-gray-300 rounded-lg p-2 mb-4 ${validations.cvv ? 'bg-green-100' : 'bg-red-100'}`}
                    value={creditCard?.cvv}
                    onChange={(e) => {
                        setNewCreditCard({ ...creditCard, cvv: e.target.value })
                        checkValidations('cvv', e.target.value);
                    }}
                />

                <div className='flex justify-end gap-4'>
                    <button className='bg-gray-200 text-gray-700 rounded-lg px-6 py-2 hover:bg-gray-300 focus:outline-none focus:ring focus:border-blue-300'
                        onClick={() => { setCreditCardForm(false) }}>
                        Cancel
                    </button>
                    <button
                        className='bg-blue-400 text-gray-700 rounded-lg px-6 py-2 hover:bg-blue-500 focus:outline-none focus:ring focus:border-blue-300'
                        onClick={() => {
                            if (validations.number && validations.month && validations.year && validations.cvv) {
                                setCreditCardForm(false);
                                setCreditCard(creditCard);
                            } else {
                                Swal.fire({
                                    icon: 'error',
                                    title: 'Please fill all the fields'
                                })
                            }
                        }}
                    >
                        Ok
                    </button>
                </div>
            </div>
        </div>
    );
}