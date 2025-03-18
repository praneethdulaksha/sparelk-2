import React, { useState } from "react"
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
            <div className="w-screen flex-grow flex flex-col items-center">
                {children}
            </div>
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
