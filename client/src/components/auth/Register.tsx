import Button from '../Button'
import { motion } from 'framer-motion';
import Input from './Input';
import { useState } from 'react';

type Props = {
    setIsLogin: (arg: boolean) => void;
}

export default function Register({ setIsLogin }: Props) {

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = () => {
        setIsLogin(true);
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
            <form className="space-y-6">
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
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                >
                    <Button
                        onClick={handleSubmit}
                        className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-medium py-2 px-4 rounded-md shadow-lg focus:outline-none focus:ring focus:ring-yellow-300"
                    >
                        Register
                    </Button>
                </motion.div>
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
