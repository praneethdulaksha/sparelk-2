import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { RootState } from '../../store/store';
import { api } from '../../api/api';
import { userActions } from '../../reducers/userSlice';

export default function SellerForm() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const user = useSelector((state: RootState) => state.user.user);

    if (!user) return <></>

    const [formData, setFormData] = useState({
        name: user.store ? user.store.name : '',
        address: user.store ? user.store.address : user.address ? `${user.address.no}, ${user.address.street}, ${user.address.city}` : '',
        email: user.store ? user.store.email : user.email,
        phone: user.store ? user.store.phone : '',
        image: null
    });
    const [imagePreview, setImagePreview] = useState<any>(user.store ? 'http://localhost:3000/images/' + user.store.image : null);
    const [validations, setValidations] = useState({ name: true, address: true, image: true, email: true, phone: true })

    const handleChange = (e: any) => {
        if (e.target.type === 'file') {
            setFormData({
                ...formData,
                [e.target.name]: e.target.files[0],
            });

            const reader = new FileReader();
            reader.onload = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(e.target.files[0]);
        } else {
            const { name, value } = e.target;
            setFormData({
                ...formData,
                [name]: value,
            });
            checkValidations(name, value);
        }
    };

    const handleSubmit = () => {
        const fData = new FormData();
        fData.append('name', formData.name);
        fData.append('address', formData.address);
        fData.append('email', formData.email);
        fData.append('phone', formData.phone);
        fData.append('image', formData.image as any);
        fData.append('userId', user._id as string);

        user.store ? updateStore(fData) : createStore(fData);
    };

    function createStore(form: any) {
        api.post('store', form)
            .then(d => {
                dispatch(userActions.setStore(d.data.data))
                Swal.fire({
                    position: "top-end",
                    icon: "success",
                    title: "Store Successfully Created, Now you can sell items",
                    showConfirmButton: true,
                    confirmButtonText: "Sell Item",
                    timer: 3000
                }).then(result => {
                    if (result.isConfirmed) {
                        navigate('/profile/add-item/new');
                    }
                })
            })
            .catch(e => console.log(e));
    }

    function updateStore(form: any) {
        api.put('store/' + user?.store._id, form)
            .then(d => {
                dispatch(userActions.setStore(d.data.data))
                Swal.fire({
                    position: "top-end",
                    icon: "success",
                    title: "Store Profile Successfully Updated",
                    showConfirmButton: false,
                    timer: 1500
                })
            })
            .catch(er => console.log(er));
    }

    function removeStore() {
        Swal.fire({
            title: "Are you sure?",
            text: "Store and Items will be removed!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, Remove Store!"
        }).then((result) => {
            if (result.isConfirmed) {
                api.delete('store/' + user?.store._id).then(() => {
                    dispatch(userActions.setStore(null));
                }).catch(er => console.log(er));

                Swal.fire({
                    title: "Removed!",
                    text: "Store items has been removed",
                    icon: "success"
                });
            }
        });
    }

    const checkValidations = (field: string, value: string) => {
        console.log(field, value);
        if (field === 'name') {
            !/^[^0-9]*[a-zA-Z]{2,}[^0-9]*$/.test(value)
                ? setValidations({ ...validations, name: false }) : setValidations({ ...validations, name: true });
        } else if (field === 'address') {
            !/^[^0-9]*[a-zA-Z]{2,}[^0-9]*$/.test(value) ?
                setValidations({ ...validations, address: false }) : setValidations({ ...validations, address: true });
        } else if (field === 'image') {
            !value ?
                setValidations({ ...validations, image: false }) : setValidations({ ...validations, image: true });
        } else if (field === 'email') {
            !/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(value) ?
                setValidations({ ...validations, email: false }) : setValidations({ ...validations, email: true });
        } else if (field === 'phone') {
            !/^\+?[0-9]{1,3}-?[0-9]{3,14}$/.test(value) ?
                setValidations({ ...validations, phone: false }) : setValidations({ ...validations, phone: true });
        }
    }

    return (
        <>
            <h2 className="text-2xl md:text-3xl lg:text-4xl underline font-semibold mb-4 text-center">{user.store ? 'Update Store Profile' : 'Create Store'}</h2>
            <div className="max-w-lg py-3 px-5">
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <div className='my-2 w-full aspect-store-image bg-cover bg-center border' style={{ backgroundImage: `url(${imagePreview})` }}></div>
                        <label htmlFor="image" className="block text-gray-700 font-semibold">Store Cover Image [3:1]</label>
                        <input
                            type="file"
                            id="image"
                            name="image"
                            accept="image/*"
                            onChange={handleChange}
                            className={`border border-gray-300 rounded px-3 py-2 w-full ${validations.image ? 'bg-green-100' : 'bg-red-100'}`}
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="name" className="block text-gray-700 font-semibold">store Name</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className={`border border-gray-300 rounded px-3 py-2 w-full ${validations.name ? 'bg-green-100' : 'bg-red-100'}`}
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="address" className="block text-gray-700 font-semibold">Store Address</label>
                        <input
                            type="text"
                            id="address"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            className={`border border-gray-300 rounded px-3 py-2 w-full ${validations.address ? 'bg-green-100' : 'bg-red-100'}`}
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="email" className="block text-gray-700 font-semibold">Store Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className={`border border-gray-300 rounded px-3 py-2 w-full ${validations.email ? 'bg-green-100' : 'bg-red-100'}`}
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="phone" className="block text-gray-700 font-semibold">Store Contact No.</label>
                        <input
                            type="text"
                            id="phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            className={`border border-gray-300 rounded px-3 py-2 w-full ${validations.phone ? 'bg-green-100' : 'bg-red-100'}`}
                            required
                        />
                    </div>
                    <button
                        type="button"
                        onClick={handleSubmit}
                        className="bg-green-500 text-white font-semibold mt-5 py-1 px-4 rounded hover:bg-green-600 duration-100 focus:outline-none focus:bg-green-600 text-lg md:text-xl"
                    >
                        {user.store ? 'Update' : 'Create Store'}
                    </button>
                    {
                        user.store && (
                            <button
                                type="button"
                                className="bg-red-500 text-white font-semibold ml-5 py-1 px-4 rounded hover:bg-red-600 duration-100 focus:outline-none focus:bg-red-600 text-lg md:text-xl"
                                onClick={removeStore}
                            >
                                Remove Store
                            </button>
                        )
                    }
                </form>
            </div>
        </>

    );
}
