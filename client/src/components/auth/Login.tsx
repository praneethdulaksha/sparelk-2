import Button from '../Button'
import { motion } from 'framer-motion';
import Input from './Input';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { userActions } from '../../reducers/userSlice';
import { api } from '../../api/api';
import { cartActions } from '../../reducers/cartSlice';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

type Props = {
    setIsLogin: (arg: boolean) => void;
}

export default function Login({ setIsLogin }: Props) {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleSubmit = async () => {
        if (!email || !password) {
            return;
        }

        try {
            navigate('/');
            const response = await api.post('user/login', { email: email, password: password });

            if (response.status === 200) {
                const user = response.data.user;
                if (response.data.store) user.store = response.data.store;
                dispatch(userActions.login(user));
                dispatch(cartActions.setData({ userId: user._id, cartId: response.data.cart._id }))
                setIsLogin(true);
                localStorage.setItem('user', JSON.stringify(user));
                localStorage.setItem('cart', JSON.stringify(response.data.cart));

                Swal.fire({
                    position: "top-end",
                    icon: "success",
                    title: "Login Successful!",
                    showConfirmButton: false,
                    timer: 1000
                });
            }
        } catch (err: any) {
            if(err.response.data.err === 'User not verified'){
                Swal.fire({
                    icon: "warning",
                    title: "Email not verified!",
                });
                return;
            }
            Swal.fire({
                position: "top-end",
                icon: "error",
                title: "Invalid Login Credentials!",
                showConfirmButton: false,
                timer: 1000
            });
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-md bg-white shadow-2xl rounded-xl p-8"
        >
            <motion.h2
                initial={{ opacity: 0, y: -30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-3xl font-bold text-center text-gray-800"
            >
                Login
            </motion.h2>
            <motion.p
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-center text-gray-500 mb-8"
            >
                Welcome back! Please login to your account.
            </motion.p>
            <form className="space-y-6">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
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
                    transition={{ delay: 0.5 }}
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
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                >
                    <Button
                        onClick={handleSubmit}
                        className="w-full bg-main hover:bg-main/80 text-white font-medium py-2 px-4 rounded-md shadow-lg focus:outline-none focus:ring focus:ring-yellow-300"
                    >
                        Login
                    </Button>
                </motion.div>
            </form>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="mt-6 text-center"
            >
                <p className="text-sm text-gray-600">
                    {"Don't have an account?" + " "}
                    <button
                        onClick={() => setIsLogin(false)}
                        className="text-main text-sm font-medium hover:underline focus:outline-none"
                    >
                        Register
                    </button>
                </p>
            </motion.div>
        </motion.div>
    )
}
