import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/store";
import Login from "./Login";
import Register from "./Register";
import { userActions } from "../../reducers/userSlice";
import { cartActions } from "../../reducers/cartSlice";
import { api } from "../../api/api";
import { FiLoader } from "react-icons/fi";
import { Route, Routes, Navigate } from "react-router-dom";
import UserVerify from "./UserVerify";
import Logo from "../Logo";

type Props = {
  children: React.ReactNode;
};

export default function AuthProvider({ children }: Props) {
  const [loading, setLoading] = useState(true);
  const { isUserAuthed } = useSelector((root: RootState) => root.user);
  const dispatch = useDispatch();

  useEffect(() => {
    // Set background color when auth pages are shown
    if (!isUserAuthed) {
      document.body.style.backgroundColor = "rgb(243, 244, 246)"; // gray-100 equivalent
    }

    // Reset background color when component unmounts or user is authenticated
    return () => {
      if (!isUserAuthed) {
        document.body.style.backgroundColor = "";
      }
    };
  }, [isUserAuthed]);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") as string);
    const cart = JSON.parse(localStorage.getItem("cart") as string);
    if (user) {
      api
        .post("user/refresh")
        .then((response) => {
          if (response.status === 200) {
            dispatch(userActions.login(user));
            dispatch(
              cartActions.setData({ userId: user._id, cartId: cart._id })
            );
          }
          setTimeout(() => setLoading(false), 500);
        })
        .catch((error) => {
          console.error(error);
          localStorage.removeItem("user");
          location.reload();
        });
      return;
    }

    setTimeout(() => setLoading(false), 500);
  }, []);

  const AuthLayout = ({ children }: { children: React.ReactNode }) => {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center">
        <div className="mb-6">
          <Logo variant="dark" size="large" showText={true} />
        </div>
        {children}
      </div>
    );
  };

  return loading ? (
    <div className="flex fixed top-0 left-0 items-center bg-black justify-center w-screen h-screen text-gray-500">
      <FiLoader className="w-10 h-10 animate-spin" />
    </div>
  ) : isUserAuthed ? (
    <div className="w-screen flex flex-col items-center flex-grow">
      {children}
    </div>
  ) : (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route
        path="/login"
        element={
          <AuthLayout>
            <Login />
          </AuthLayout>
        }
      />
      <Route
        path="/register"
        element={
          <AuthLayout>
            <Register />
          </AuthLayout>
        }
      />
      <Route path="/user-verify/:code" element={<UserVerify />} />
    </Routes>
  );
}
