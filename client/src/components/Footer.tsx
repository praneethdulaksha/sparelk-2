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
    <footer id="footer" className="bg-dark text-white py-10 w-screen mt-20">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-4 gap-8">
        {/* Left Column - Logo and Contact Info */}
        <div className="flex flex-col gap-2">
          <h2 className="text-5xl font-bold mb-4">
            <span className="text-yellow-500">SpareLK</span>
          </h2>
          <p className="text-sm">
            <FiMapPin className="inline mr-2" />
            Chromium Co., 25 Silicon Road, London D04 89GR
          </p>
          <p className="text-sm">
            <FiPhone className="inline mr-2" />
            +27 34 66 2455-198 <br /> Mon-Fri 8:00 to 19:00
          </p>
          <p className="text-sm">
            <FiMail className="inline mr-2" />
            example@example.com
          </p>
          <div className="flex space-x-4 mt-4">
            <FaFacebookF className="w-6 h-6 cursor-pointer hover:text-yellow-500" />
            <FaTwitter className="w-6 h-6 cursor-pointer hover:text-yellow-500" />
            <FaGoogle className="w-6 h-6 cursor-pointer hover:text-yellow-500" />
            <FaInstagram className="w-6 h-6 cursor-pointer hover:text-yellow-500" />
            <FaPinterest className="w-6 h-6 cursor-pointer hover:text-yellow-500" />
          </div>
        </div>

        {/* Column 2 - Information */}
        <div>
          <h3 className="font-semibold mb-4">INFORMATION</h3>
          <ul className="space-y-2 text-sm text-gray-400">
            <li>Log in</li>
            <li>Entries feed</li>
            <li>Comments feed</li>
            <li>WordPress.org</li>
          </ul>
        </div>

        {/* Column 3 - Why Buy From Us */}
        <div>
          <h3 className="font-semibold mb-4">WHY BUY FROM US</h3>
          <ul className="space-y-2 text-sm text-gray-400">
            <li>About Us</li>
            <li>Blog</li>
            <li>Compare</li>
            <li>Contacts</li>
            <li>Gallery</li>
            <li>Shop</li>
            <li>Test</li>
            <li>Typography</li>
            <li>Wishlist</li>
          </ul>
        </div>

        {/* Column 4 - Newsletter */}
        <div>
          <h3 className="font-semibold mb-4">
            SUBSCRIBE AND GET 5% OFF DISCOUNT
          </h3>
          <p className="text-sm text-gray-400 mb-4">
            Subscribe to our Newsletter and get bonuses for the next purchase
          </p>
          <div className="flex items-center border border-gray-500 rounded-lg">
            <input
              type="email"
              placeholder="Enter Your E-Mail Here"
              className="flex-1 px-4 py-2 bg-dark text-sm text-gray-300 outline-none rounded-l-md"
            />
            <button className="bg-yellow-500 px-4 py-2 rounded-r-md">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-black"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M10 2a8 8 0 018 8v2h-3v-2a5 5 0 10-10 0v2H2v-2a8 8 0 018-8z" />
                <path d="M6 12h8a2 2 0 002-2v-1h-2v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-1H4v1a2 2 0 002 2z" />
              </svg>
            </button>
          </div>
          <div className="mt-6">
            <p className="font-semibold mb-2">WE ACCEPT:</p>
            <div className="flex space-x-4">
              <img
                src="/path/to/maestro-logo.png"
                alt="Maestro"
                className="w-10 h-6"
              />
              <img
                src="/path/to/mastercard-logo.png"
                alt="MasterCard"
                className="w-10 h-6"
              />
              <img
                src="/path/to/paypal-logo.png"
                alt="PayPal"
                className="w-10 h-6"
              />
              <img
                src="/path/to/visa-logo.png"
                alt="Visa"
                className="w-10 h-6"
              />
            </div>
          </div>
        </div>
      </div>
      <p className="text-gray-500 text-sm text-center mt-10">
        Copyright © 2025 SpareLK Spare Parts.
      </p>
    </footer>
  );
};

export default Footer;
