import Button from "../Button";
import { motion } from "framer-motion";
import Input from "./Input";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { userActions } from "../../reducers/userSlice";
import { api } from "../../api/api";
import { cartActions } from "../../reducers/cartSlice";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "sonner";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (!email || !password) {
      return;
    }

    try {
      navigate("/");
      const response = await api.post("user/login", {
        email: email,
        password: password,
      });

      if (response.status === 200) {
        const user = response.data.user;
        if (response.data.store) user.store = response.data.store;
        dispatch(userActions.login(user));
        dispatch(
          cartActions.setData({
            userId: user._id,
            cartId: response.data.cart._id,
          })
        );
        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("cart", JSON.stringify(response.data.cart));

        toast.success("Login Successful!", {
          position: "top-center",
          duration: 2000,
        });
      }
    } catch (err: any) {
      if (err.response.data.err === "User not verified") {
        toast.warning("Email not verified!", {
          position: "top-center",
          duration: 3000,
        });
        return;
      }
      toast.error("Invalid Login Credentials!", {
        position: "top-center",
        duration: 2000,
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-md mx-auto bg-white border border-gray-200 shadow-md rounded-lg p-6"
    >
      <motion.h2
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-2xl font-semibold text-center text-gray-800 mb-2"
      >
        Login
      </motion.h2>
      <motion.p
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-center text-gray-600 mb-6"
      >
        Welcome back! Please login to your account.
      </motion.p>
      <form className="space-y-5">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Input
            htmlFor="email"
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
            htmlFor="password"
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
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            Login
          </Button>
        </motion.div>
      </form>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="mt-5 text-center"
      >
        <p className="text-sm text-gray-600">
          {"Don't have an account?" + " "}
          <Link
            to="/register"
            className="text-orange-500 font-medium text-sm bg-transparent hover:text-orange-700 focus:outline-none"
          >
            Register
          </Link>
        </p>
      </motion.div>
    </motion.div>
  );
}
