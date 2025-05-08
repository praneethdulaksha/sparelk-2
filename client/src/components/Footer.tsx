import { FiMapPin, FiPhone, FiMail } from "react-icons/fi";
import {
  FaFacebookF,
  FaTwitter,
  FaGoogle,
  FaInstagram,
  FaPinterest,
} from "react-icons/fa";

const Footer = () => {
  return (
    <footer id="footer" className="bg-main text-light pt-16 pb-5 w-full">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {/* Column 1 - Logo and Contact Info */}
        <div className="flex flex-col gap-2">
          <h2 className="text-4xl font-bold mb-4">
            <span className="text-light">SpareLK</span>
          </h2>
          <p className="text-sm flex items-start">
            <FiMapPin className="inline mr-2 mt-1" />
            12/B, Lake Road, Colombo 1, Sri Lanka
          </p>
          <p className="text-sm flex items-start">
            <FiPhone className="inline mr-2 mt-1" />
            +94770673892 <br />
            Mon-Fri 8:00 to 19:00
          </p>
          <p className="text-sm flex items-start">
            <FiMail className="inline mr-2 mt-1" />
            mailto@sparelk.com
          </p>
          <div className="flex space-x-4 mt-4">
            <FaFacebookF className="w-5 h-5 cursor-pointer hover:scale-105" />
            <FaTwitter className="w-5 h-5 cursor-pointer hover:scale-105" />
            <FaGoogle className="w-5 h-5 cursor-pointer hover:scale-105" />
            <FaInstagram className="w-5 h-5 cursor-pointer hover:scale-105" />
            <FaPinterest className="w-5 h-5 cursor-pointer hover:scale-105" />
          </div>
        </div>

        {/* Column 2 - Information */}
        <div>
          <h3 className="font-semibold mb-4">INFORMATION</h3>
          <ul className="space-y-2 text-sm text-gray-800">
            <li><a href="/#" className="hover:text-white">Home</a></li>
            <li><a href="/shop" className="hover:text-white">Shop</a></li>
            <li><a href="/profile" className="hover:text-white">Profile</a></li>
            <li><a href="/profile/my-orders" className="hover:text-white">My Orders</a></li>
            <li><a href="/profile/seller-form" className="hover:text-white">Be a Seller</a></li>
          </ul>
        </div>

        {/* Column 3 - About Us */}
        <div>
          <h3 className="font-semibold mb-4">ABOUT US</h3>
          <p>
            SpareLK is your trusted partner for quality spare parts in Sri Lanka, committed to reliability, affordability, and exceptional customer service across all vehicle types.
          </p>
        </div>
      </div>

      {/* Divider & Bottom Section */}
      <div className="mt-10 border-t border-gray-700 pt-6 text-center text-sm text-gray-800">
        <p>&copy; {new Date().getFullYear()} SpareLK. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
