import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2';
import { faBoxOpen, faClipboardList, faLeftLong, faPlus, faStore, faUser } from '@fortawesome/free-solid-svg-icons';
import { useCookies } from 'react-cookie';
import { RootState } from '../store/store';
import { userActions } from '../reducers/userSlice';
import Li from '../components/Li';
import { EUserRole } from '../types';

export default function Profile() {
    const { user, isUserAuthed } = useSelector((state: RootState) => state.user);
    const [selected, setSelected] = useState('/profile');
    const { role } = user!;

    const location = useLocation();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const removeCookie = useCookies(['user'])[2]



    useEffect(() => {
        setSelected(location.pathname);
        console.log(location.pathname);
    }, [location.pathname])

    useEffect(() => {
        if (!isUserAuthed) {
            dispatch(userActions.setPreviosPage(location.pathname));
            navigate('/');
        }
    }, []);

    const logoutAlert = () => {
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, Logout!"
        }).then((result) => {
            if (result.isConfirmed) {
                removeCookie('user');
                setTimeout(() => {
                    dispatch(userActions.logout());
                    navigate('/');
                }, 300);
            }
        })
    }

    return isUserAuthed && user && (
        <main className="relative w-screen flex flex-grow pr-10 gap-3 min-h-svh">
            <div className='sticky top-0 w-80 bg-gray-200 items-start p-5 text-md text-zinc-500 hidden lg:block border-r-2 border-main/50'>
                <div className='sticky top-10 w-full h-fit flex flex-col gap-3 text-sm text-gray-700'>
                    {
                        role === EUserRole.SELLER ? <>
                            <Li currentPath={selected} to="/" icon={faUser}>My Profile</Li>
                            <Li currentPath={selected} to="/seller-form" icon={faStore}>My Store</Li>
                            <Li currentPath={selected} to="/manage-items" icon={faClipboardList}>Manage Items</Li>
                            <Li currentPath={selected} to="/add-item/new" icon={faPlus}>Add a Item</Li>
                        </>
                            : role === EUserRole.BUYER ? <>
                                <Li currentPath={selected} to="/profile" icon={faUser}>My Profile</Li>
                                <Li currentPath={selected} to="/profile/my-orders" icon={faBoxOpen}>Orders</Li>
                                <Li currentPath={selected} to="/profile/seller-form" icon={faStore}>Be a Seller</Li>
                            </>
                                : null
                    }
                    <Li
                        to='/'
                        icon={faLeftLong}
                        onClick={() => {
                            logoutAlert();
                        }}
                    >Log Out</Li>
                </div>
            </div>

            <div className='flex-grow bg-white rounded-lg'>
                <Outlet />
            </div>
        </main>
    )
}
