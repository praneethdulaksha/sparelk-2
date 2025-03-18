import Button from '../Button'
import { motion } from 'framer-motion';
import Input from './Input';
import { useState } from 'react';
import { api } from '../../api/api';
import Swal from 'sweetalert2';
import { TStore } from '../../types';

type Props = {
    setIsLogin: (arg: boolean) => void;
}

export default function Register({ setIsLogin }: Props) {

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [store, setStore] = useState<any>({
        name: '', address: '', phone: '', image: ''
    });
    const [isSeller, setSeller] = useState(false);

    const handleSubmit = async () => {
        try {
            const names = name.split(' ');
            const firstName = names[0];
            const lastName = names.length > 1 ? names[1] : '';
            const res = await api.post('user/register', { firstName, lastName, email, password })
            if (isSeller) {
                const { name, address, phone, image } = store;
                // validations 
                const fData = new FormData();
                fData.append('name', name);
                fData.append('address', address);
                fData.append('email', email);
                fData.append('phone', phone);
                fData.append('image', image as any);
                fData.append('userId', res.data.data.user._id);

                await api.post('store', fData);
                // if (status !== 201) throw new Error("Creating store failed");
            }
            if (res.status === 201) {
                Swal.fire({
                    position: "top-end",
                    icon: "success",
                    title: "Registration Successful",
                    showConfirmButton: false,
                    timer: 1500
                })
                setTimeout(() => { }, 500)
                setIsLogin(true);
            }
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.5 }}
            className=" bg-white shadow-2xl rounded-xl p-8"
        >
            <motion.h2
                initial={{ opacity: 0, y: -30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-3xl font-bold text-center text-gray-800"
            >
                Register
            </motion.h2>
            <motion.p
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-center text-gray-500 mb-8"
            >
                Create your account to get started.
            </motion.p>
            <form className="flex gap-5">
                <div className='w-[350px] space-y-5'>
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 }}
                    >
                        <Input
                            htmlFor='name'
                            label="Your Name"
                            type="text"
                            placeholder="Enter tour name"
                            value={name}
                            setValue={setName}
                        />
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 }}
                    >
                        <Input
                            htmlFor='email'
                            label="Email Address"
                            type="email"
                            placeholder="example@domain.com"
                            value={email}
                            setValue={setEmail}
                        />
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.6 }}
                    >
                        <Input
                            htmlFor='password'
                            label="Password"
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            setValue={setPassword}
                        />
                    </motion.div>
                    {/* checkbox for is seller register */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.7 }}
                    >
                        <label className="inline-flex items-center cursor-pointer">
                            <input type="checkbox" className="form-checkbox h-4 w-4 text-indigo-600" checked={isSeller} onChange={() => setSeller(!isSeller)} />
                            <span className="ml-2 text-gray-700">I am a seller</span>
                        </label>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7 }}
                    >
                        {
                            !isSeller && <Button
                                onClick={handleSubmit}
                                className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-medium py-2 px-4 rounded-md shadow-lg focus:outline-none focus:ring focus:ring-yellow-300"
                            >
                                Register as Buyer
                            </Button>
                        }
                    </motion.div>
                </div>
                {
                    isSeller &&
                    <div className='w-[400px] space-y-5'>
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.4 }}
                        >
                            <label
                                htmlFor='storeImage'
                                className="block text-sm font-medium text-gray-700"
                            >
                                Store Image
                            </label>
                            <input
                                required={true}
                                type='file'
                                id='storeImage'
                                accept="image/*"
                                onChange={(e: any) => setStore({ ...store, image: e.target.files[0] })}
                                className="mt-1 block w-full p-3 rounded-md bg-gray-200 shadow-sm focus:border-yellow-500 focus:ring focus:ring-yellow-200"
                            />
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.4 }}
                        >
                            <Input
                                htmlFor='storeName'
                                label="Store Name"
                                type="text"
                                placeholder="Example Store"
                                value={store.name}
                                setValue={(v: string) => setStore({ ...store, name: v })}
                            />
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.5 }}
                        >
                            <Input
                                htmlFor='address'
                                label="Store Address"
                                type="text"
                                placeholder="Enter store address"
                                value={store.address}
                                setValue={(v: string) => setStore({ ...store, address: v })}
                            />
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.6 }}
                        >
                            <Input
                                htmlFor='phone'
                                label="Contact No"
                                type="text"
                                placeholder="Enter contact number"
                                value={store.phone}
                                setValue={(v: string) => setStore({ ...store, phone: v })}
                            />
                        </motion.div>
                        <Button
                            onClick={handleSubmit}
                            className="w-full bg-yellow-500 hover:bg-yellow-600 text-black py-2 px-4 rounded-md shadow-lg focus:outline-none focus:ring focus:ring-yellow-300"
                        >
                            Register as Seller
                        </Button>
                    </div>
                }
            </form>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="mt-6 text-center"
            >
                <p className="text-sm text-gray-600">
                    {"Already have an account?" + " "}
                    <button
                        onClick={() => setIsLogin(true)}
                        className="text-yellow-500 text-sm font-medium hover:underline focus:outline-none"
                    >
                        Login
                    </button>
                </p>
            </motion.div>
        </motion.div>
    )
}
