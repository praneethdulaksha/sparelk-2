import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import { api } from '../../api/api';
import Button from '../Button';

export default function UserVerify() {
    const { code } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [verified, setVerified] = useState(false);

    const verifyEmail = async () => {
        setLoading(true);
        try {
            await api.put(`user/verify-email/${code}`);
            setVerified(true);
            Swal.fire({
                position: "top-end",
                icon: "success",
                title: "Email Verification Successed",
                showConfirmButton: false,
                timer: 1500
            })
            navigate('/');
        } catch (err: any) {
            console.error(err.response);
            Swal.fire({
                icon: 'error',
                title: 'Verification Failed',
                text: 'Failed to verify your email. Please try again later.',
            });
        }finally{
            setLoading(false);
        }
    };

    return (
        <div className="h-screen w-screen flex flex-col justify-center items-center bg-gradient-to-r from-yellow-200 to-main">
            <Link to='/' className="text-gray-700 text-6xl font-semibold mb-20">SpareLK</Link>
            <div className="bg-white p-6 rounded-lg shadow-md text-center w-96">
                <h2 className="text-2xl font-semibold mb-4">Email Verification</h2>
                <p className="text-gray-600 mb-6">
                    Click the button below to verify your email address.
                </p>
                <Button
                    onClick={verifyEmail}
                    disabled={loading || verified}
                    className={`px-6 py-2  font-semibold transition ${verified ? 'bg-green-500 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
                >
                    {verified ? 'Verified' : loading ? 'Verifying...' : 'Verify Email'}
                </Button>
            </div>
        </div>
    );
}
