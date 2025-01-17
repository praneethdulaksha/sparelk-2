import React, { useState } from "react"
import { motion } from 'framer-motion';
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import Login from "./Login";
import Register from "./Register";

type Props = {
    children: React.ReactNode;
}

export default function AuthProvider({ children }: Props) {

    const [isLogin, setIsLogin] = useState(true);
    const { isUserAuthed } = useSelector((root: RootState) => root.user)

    if (isUserAuthed) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -50 }}
                className="w-screen flex flex-col items-center"
            >
                {children}
            </motion.div>
        );
    }

    return (
        <div className="min-h-screen w-screen flex flex-col gap-12 items-center justify-center bg-gradient-to-r from-yellow-200 to-main">
            <h1 className="text-gray-700 text-6xl font-semibold -mt-20">SpareLK</h1>
            {
                isLogin
                    ? <Login setIsLogin={setIsLogin} />
                    : <Register setIsLogin={setIsLogin} />
            }
        </div>
    )
}
