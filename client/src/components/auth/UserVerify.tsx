import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { api } from "../../api/api";
import Button from "../Button";

export default function UserVerify() {
  const { code } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [verified, setVerified] = useState(false);

  useEffect(() => {
    // Set background color when component mounts
    document.body.style.backgroundColor = "rgb(243, 244, 246)"; // gray-100 equivalent

    // Reset background color when component unmounts
    return () => {
      document.body.style.backgroundColor = "";
    };
  }, []);

  const verifyEmail = async () => {
    setLoading(true);
    try {
      await api.put(`user/verify-email/${code}`);
      setVerified(true);
      toast.success("Email verified successfully!", {
        position: "top-center",
        duration: 3000,
      });
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err: any) {
      console.error(err.response);
      toast.error("Verification failed", {
        position: "top-center",
        description: "Failed to verify your email. Please try again later.",
        duration: 5000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-screen flex flex-col justify-center items-center">
      <Link to="/" className="text-gray-700 text-6xl font-semibold mb-20">
        SpareLK
      </Link>
      <div className="bg-white p-6 rounded-lg shadow-md text-center w-96">
        <h2 className="text-2xl font-semibold mb-4">Email Verification</h2>
        <p className="text-gray-600 mb-6">
          Click the button below to verify your email address.
        </p>
        <Button
          onClick={verifyEmail}
          disabled={loading || verified}
          className={`px-6 py-2 font-semibold transition ${
            verified
              ? "bg-green-500 cursor-not-allowed"
              : "bg-orange-500 hover:bg-orange-600 text-white"
          }`}
        >
          {verified ? "Verified" : loading ? "Verifying..." : "Verify Email"}
        </Button>
        <div className="mt-4">
          <Link
            to="/login"
            className="text-orange-500 hover:text-orange-700 text-sm"
          >
            Return to login
          </Link>
        </div>
      </div>
    </div>
  );
}
