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
    <footer id="footer" className="bg-dark text-white py-10 w-full mt-20">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {/* Column 1 - Logo and Contact Info */}
        <div className="flex flex-col gap-2">
          <h2 className="text-4xl font-bold mb-4">
            <span className="text-main">SpareLK</span>
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
            <FaFacebookF className="w-5 h-5 cursor-pointer hover:text-main" />
            <FaTwitter className="w-5 h-5 cursor-pointer hover:text-main" />
            <FaGoogle className="w-5 h-5 cursor-pointer hover:text-main" />
            <FaInstagram className="w-5 h-5 cursor-pointer hover:text-main" />
            <FaPinterest className="w-5 h-5 cursor-pointer hover:text-main" />
          </div>
        </div>

        {/* Column 2 - Information */}
        <div>
          <h3 className="font-semibold mb-4">INFORMATION</h3>
          <ul className="space-y-2 text-sm text-gray-400">
            <li><a href="/login" className="hover:text-white">Log in</a></li>
            <li><a href="/feed" className="hover:text-white">Entries feed</a></li>
            <li><a href="/comments" className="hover:text-white">Comments feed</a></li>
            <li><a href="https://wordpress.org" target="_blank" rel="noreferrer" className="hover:text-white">WordPress.org</a></li>
          </ul>
        </div>

        {/* Column 3 - Why Buy From Us */}
        <div>
          <h3 className="font-semibold mb-4">WHY BUY FROM US</h3>
          <div className="space-y-3 text-sm text-gray-400">
            <p>We offer trusted auto part listings from verified sellers across Sri Lanka.</p>
            <p>Compare parts, search by category or vehicle model, and buy with confidence.</p>
            <p>Every transaction is secure and supported by our dedicated customer service.</p>
            <p>Join SpareLK to simplify your spare part buying and selling experience.</p>
          </div>
        </div>
      </div>

      {/* Divider & Bottom Section */}
      <div className="mt-10 border-t border-gray-700 pt-6 text-center text-sm text-gray-500">
        <p>&copy; {new Date().getFullYear()} SpareLK. All rights reserved.</p>
        <div className="mt-3 flex justify-center space-x-4 flex-wrap text-xs">
          <a href="/privacy" className="hover:text-white">Privacy Policy</a>
          <span>|</span>
          <a href="/terms" className="hover:text-white">Terms & Conditions</a>
          <span>|</span>
          <a href="/contact" className="hover:text-white">Contact Us</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
