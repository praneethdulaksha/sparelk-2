/**
 * Navbar Component
 *
 * Primary navigation component for the application with responsive design for desktop and mobile.
 * Includes user menu, search functionality, and context-aware navigation options.
 *
 * @module Components/Navbar
 */
import {
  faBoxOpen,
  faClipboardList,
  faLeftLong,
  faPlus,
  faStore,
  faTriangleExclamation,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { useState, useEffect } from "react";
import {
  FiUser,
  FiShoppingCart,
  FiChevronDown,
  FiHome,
  FiGrid,
  FiLogOut,
  FiSearch,
  FiMenu,
  FiX,
  FiMail,
} from "react-icons/fi";
import { Search } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { RootState } from "../store/store";
import { userActions } from "../reducers/userSlice";
import Li from "./Li";
import { EUserRole } from "../types";
import { Button } from "@/components/ui/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import LogoutDialog from "./LogoutDialog";
import Logo from "./Logo";
import { X, AlertTriangle } from "lucide-react";

/**
 * Main Navbar component
 * Handles application navigation, search functionality, and user menu
 *
 * @returns {JSX.Element} Navbar component or null if no user is logged in
 */
const Navbar = () => {
  // State for menus, search, and screen size
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user } = useSelector((state: RootState) => state.user);
  const { cartItems } = useSelector((state: RootState) => state.cart);

  // Check URL for search keyword when on shop page
  const searchParams = new URLSearchParams(window.location.search);
  const initialKeyword =
    window.location.pathname === "/shop"
      ? searchParams.get("keyword") || ""
      : "";

  const [keyword, setKeyword] = useState(initialKeyword);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [isLogoutDialogOpen, setLogoutDialogOpen] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  /**
   * Handle window resize events
   * Adjusts UI based on screen size and closes mobile menu on larger screens
   */
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  /**
   * Add global click handler to close menu when clicking outside
   * Uses a setTimeout to avoid immediate closure on the same click that opens it
   */
  useEffect(() => {
    const handleGlobalClick = (e: MouseEvent) => {
      // Don't close the menu if the click is on a link
      if ((e.target as Element).closest("#nav-link")) {
        return;
      }

      if (isMenuOpen) {
        setIsMenuOpen(false);
      }
    };

    // Only add listener when the menu is open
    if (isMenuOpen) {
      // Use setTimeout to delay adding the listener until after the current click is processed
      setTimeout(() => {
        document.addEventListener("click", handleGlobalClick);
      }, 0);
    }

    return () => {
      document.removeEventListener("click", handleGlobalClick);
    };
  }, [isMenuOpen]);

  /**
   * Opens the logout confirmation dialog
   */
  const logoutAlert = () => {
    setLogoutDialogOpen(true);
  };

  /**
   * Handles search form submission
   * Navigates to shop with search parameters and forces refresh with timestamp
   *
   * @param {React.FormEvent} e - Form submit event
   */
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (keyword.trim()) {
      // Navigate to shop with search query parameter to persist across page loads
      const encodedKeyword = encodeURIComponent(keyword.trim());

      // Add timestamp to force URL change even if search term is the same
      const timestamp = Date.now();
      const searchUrl = `/shop?keyword=${encodedKeyword}&t=${timestamp}`;

      navigate(searchUrl, { replace: true });
      setIsMobileMenuOpen(false);
    }
  };

  /**
   * Clears search input and navigates to shop without parameters
   */
  const handleClearSearch = () => {
    // Clear search input and navigate to shop without search parameters
    setKeyword("");
    navigate("/shop", { replace: true });
  };

  // Return null if no user is logged in
  return user ? (
    <>
      {/* Logout confirmation dialog */}
      <LogoutDialog
        isOpen={isLogoutDialogOpen}
        onClose={() => setLogoutDialogOpen(false)}
      />

      {/* Nav Bar Header */}
      <header className="w-full border-b bg-background">
        {/* Top bar with promotions and secondary links */}
        <div className="border-b bg-slate-900 text-white">
          <div className="container mx-auto px-4 md:px-6 lg:px-16 xl:px-28 py-2">
            <div className="flex items-center justify-between text-sm">
              <p className="font-medium">
                Free shipping on orders over Rs. 30,000
              </p>
              <div className="hidden md:flex items-center gap-4">
                <Link
                  to="#"
                  className="hover:text-orange-400 transition-colors duration-200"
                >
                  Track Order
                </Link>
                <span>|</span>
                <Link
                  to="#"
                  className="hover:text-orange-400 transition-colors duration-200"
                >
                  Help Center
                </Link>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Desktop and Tablet Navbar */}
      <nav className="bg-white h-16 hidden md:flex items-center gap-4 lg:gap-8 px-4 md:px-6 lg:px-16 xl:px-28 py-2 w-full max-w-screen z-30 transition-all duration-300 shadow-sm">
        <div className="flex items-center space-x-4">
          <Logo variant="dark" size="medium" />
        </div>

        {/* Center links - responsive spacing */}
        {user.role == EUserRole.BUYER && (
          <div className="flex items-center gap-x-1 md:gap-x-0 lg:gap-x-2 text-light text-sm transition-all duration-300">
            <Button variant="ghost" asChild className="px-2 md:px-3 lg:px-4">
              <Link to="/" className="font-semibold text-slate-800">
                Home
              </Link>
            </Button>
            <Button variant="ghost" asChild className="px-2 md:px-3 lg:px-4">
              <Link to="/shop" className="font-semibold text-slate-800">
                Shop
              </Link>
            </Button>
            <Button variant="ghost" asChild className="px-2 md:px-3 lg:px-4">
              <a href="#footer" className="font-semibold text-slate-800">
                Contacts
              </a>
            </Button>
          </div>
        )}

        {/* Search bar - responsive width */}
        {user.role !== EUserRole.SELLER ? (
          <form
            className="flex items-center flex-grow md:mx-4 lg:mx-10 transition-all duration-300"
            onSubmit={handleSearchSubmit}
          >
            <div className="flex w-full items-center border border-slate-300 rounded-full overflow-hidden focus-within:border-orange-500 focus-within:border-[1.5px] transition-colors ease-in-out duration-200">
              <div className="flex-grow flex items-center pl-4 pr-2 py-2">
                <Search className="h-5 w-5 text-gray-500" />
                <input
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleSearchSubmit(e);
                    }
                  }}
                  type="text"
                  placeholder="Search by part number, name, or vehicle..."
                  className="flex-grow outline-none ml-2 text-sm focus:outline-none focus:ring-0"
                />
                {keyword && (
                  <button
                    type="button"
                    onClick={handleClearSearch}
                    className="text-gray-400 hover:text-gray-600 mr-2"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
              <button className="bg-orange-500 hover:bg-orange-400 text-sm text-white font-bold tracking-wide px-4 md:px-6 lg:px-8 py-2.5 transition-all duration-200">
                Search
              </button>
            </div>
          </form>
        ) : (
          <div className="flex-grow" />
        )}

        {/* Right section - cart and user dropdown */}
        <div className="flex items-center">
          {user.role == EUserRole.BUYER && (
            <Link to="cart" className="relative border-slate-300 mr-1">
              <FiShoppingCart className="text-slate-600 h-6 w-6 hover:text-light cursor-pointer hover:scale-105 hover:rotate-6 duration-75" />
              {cartItems.length > 0 && (
                <div className="size-5 bg-amber-600 border-2 text-sm text-white flex items-center justify-center border-orange-400 rounded-full absolute -top-2 right-2">
                  {cartItems.length}
                </div>
              )}
            </Link>
          )}
          <span className="h-8 border-l border-gray-300 ml-5 mr-3"></span>

          {/* User dropdown menu */}
          <div
            onClick={(e) => {
              e.stopPropagation();
              setIsMenuOpen(!isMenuOpen);
            }}
            className="flex items-center gap-2 cursor-pointer relative"
          >
            <Button asChild variant="ghost" className="hidden sm:flex">
              <div>
                <FiUser className="text-slate-600 h-6 w-6 hover:text-light cursor-pointer" />
                <span className="text-slate-600 text-sm ml-2 hidden md:inline">
                  Welcome, <span className="font-bold">{user.firstName}</span>
                </span>
                <FiChevronDown
                  className={`transition duration-200 ease-in-out ml-1 ${
                    isMenuOpen ? "rotate-0" : "-rotate-90"
                  }`}
                />
              </div>
            </Button>

            {/* User dropdown menu items */}
            <div
              onClick={(e) => e.stopPropagation()}
              className={`absolute bg-card text-slate-800 shadow-lg w-64 p-2 rounded-md top-[120%] right-0 ring-1 ring-black/5 transform transition-all duration-200 ease-in-out origin-top-right ${
                isMenuOpen
                  ? "opacity-100 scale-100 translate-y-0"
                  : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
              }`}
            >
              {/* Render different menu items based on user role */}
              {user.role === EUserRole.SELLER ? (
                <>
                  <Li to="/" icon={faUser} onClick={() => setIsMenuOpen(false)}>
                    My Profile
                  </Li>
                  <Li
                    to="/seller-form"
                    icon={faStore}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    My Store
                  </Li>
                  <Li
                    to="/manage-items"
                    icon={faClipboardList}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Manage Items
                  </Li>
                  <Li
                    to="/add-item/new"
                    icon={faPlus}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Add a Item
                  </Li>
                </>
              ) : user.role === EUserRole.BUYER ? (
                <>
                  <Li
                    to="/profile"
                    icon={faUser}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    My Profile
                  </Li>
                  <Li
                    to="/profile/my-orders"
                    icon={faBoxOpen}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Orders
                  </Li>
                  <Li
                    to="/profile/seller-form"
                    icon={faStore}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {user.store ? "Store Profile" : "Become a Seller"}
                  </Li>
                  <Li
                    to="/warning-signs"
                    icon={faTriangleExclamation}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Vehicle Warning Signs
                  </Li>
                </>
              ) : null}

              <Li
                to="/"
                icon={faLeftLong}
                onClick={() => {
                  setIsMenuOpen(false);
                  logoutAlert();
                }}
              >
                Log Out
              </Li>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Navbar - Top */}
      <nav className="md:hidden bg-white shadow-sm flex items-center justify-between px-4 py-3 w-full z-40">
        <Logo variant="dark" size="small" />

        <div className="flex items-center gap-3">
          {user.role == EUserRole.BUYER && (
            <Link to="cart" className="relative">
              <FiShoppingCart className="text-slate-600 h-6 w-6" />
              {cartItems.length > 0 && (
                <div className="size-5 bg-amber-600 border-2 text-sm text-white flex items-center justify-center border-orange-400 rounded-full absolute -top-2 right-2">
                  {cartItems.length}
                </div>
              )}
            </Link>
          )}

          {/* Mobile menu toggle button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-1"
          >
            {isMobileMenuOpen ? (
              <FiX className="text-slate-600 h-6 w-6" />
            ) : (
              <FiMenu className="text-slate-600 h-6 w-6" />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div
        className={`md:hidden fixed inset-0 bg-black/50 z-30 transition-opacity duration-300 ${
          isMobileMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsMobileMenuOpen(false)}
      />

      {/* Mobile Menu Panel */}
      <div
        className={`md:hidden fixed top-[56px] right-0 bottom-[56px] w-3/4 bg-white shadow-lg z-40 transform transition-transform duration-300 ease-in-out overflow-auto ${
          isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* User Info */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="bg-slate-100 rounded-full p-2">
              <FiUser className="text-slate-600 h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-medium">Welcome,</p>
              <p className="font-bold text-slate-800">{user.firstName}</p>
            </div>
          </div>
        </div>

        {/* Mobile Search */}
        {user.role !== EUserRole.SELLER && (
          <form
            className="p-4 border-b border-gray-200"
            onSubmit={handleSearchSubmit}
          >
            <div className="flex w-full items-center border border-slate-300 rounded-full overflow-hidden focus-within:border-orange-500 transition-colors duration-200">
              <div className="flex-grow flex items-center pl-3 pr-2 py-2">
                <FiSearch className="h-4 w-4 text-gray-500" />
                <input
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  type="text"
                  placeholder="Search products..."
                  className="flex-grow outline-none ml-2 text-sm focus:outline-none focus:ring-0"
                />
                {keyword && (
                  <button
                    type="button"
                    onClick={handleClearSearch}
                    className="text-gray-400 hover:text-gray-600 mr-1"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
              <button className="bg-orange-400 hover:bg-orange-500 text-sm text-white font-bold px-4 py-2">
                Search
              </button>
            </div>
          </form>
        )}

        {/* Mobile Navigation Links */}
        <div className="p-4">
          <ul className="space-y-2">
            <li>
              <Link
                to="/"
                className="flex items-center gap-3 p-2 rounded-md hover:bg-slate-100"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <FiHome className="text-slate-600 h-5 w-5" />
                <span className="font-medium">Home</span>
              </Link>
            </li>
            {user.role === EUserRole.BUYER && (
              <>
                <li>
                  <Link
                    to="/shop"
                    className="flex items-center gap-3 p-2 rounded-md hover:bg-slate-100"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <FiGrid className="text-slate-600 h-5 w-5" />
                    <span className="font-medium">Shop</span>
                  </Link>
                </li>
                <li>
                  <a
                    href="#footer"
                    className="flex items-center gap-3 p-2 rounded-md hover:bg-slate-100"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <FiMail className="text-slate-600 h-5 w-5" />
                    <span className="font-medium">Contacts</span>
                  </a>
                </li>
                <li>
                  <Link
                    to="/cart"
                    className="flex items-center gap-3 p-2 rounded-md hover:bg-slate-100"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <FiShoppingCart className="text-slate-600 h-5 w-5" />
                    <span className="font-medium">Cart</span>
                    {cartItems.length > 0 && (
                      <span className="bg-amber-600 text-white text-xs px-2 py-1 rounded-full">
                        {cartItems.length}
                      </span>
                    )}
                  </Link>
                </li>
              </>
            )}
            <li>
              <Link
                to="/warning-signs"
                className="flex items-center gap-3 p-2 rounded-md hover:bg-slate-100"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <AlertTriangle className="text-slate-600 h-5 w-5" />
                <span className="font-medium">Warning Signs</span>
              </Link>
            </li>
            <li>
              <Link
                to="/profile"
                className="flex items-center gap-3 p-2 rounded-md hover:bg-slate-100"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <FiUser className="text-slate-600 h-5 w-5" />
                <span className="font-medium">Profile</span>
              </Link>
            </li>
            {/* Additional links based on role */}
            {/* ... Rest of the mobile navigation links ... */}
          </ul>
        </div>
      </div>

      {/* Mobile Bottom Navbar */}
      <nav className="md:hidden fixed bottom-0 w-full bg-white border-t border-gray-200 z-40 flex justify-around items-center py-2 shadow-md">
        <Link
          to="/"
          className="flex flex-col items-center text-xs text-slate-600"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <FiHome className="text-lg mb-0.5" />
          <span>Home</span>
        </Link>

        {user.role === EUserRole.BUYER && (
          <>
            <Link
              to="/shop"
              className="flex flex-col items-center text-xs text-slate-600"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <FiGrid className="text-lg mb-0.5" />
              <span>Shop</span>
            </Link>

            <a
              href="#footer"
              className="flex flex-col items-center text-xs text-slate-600"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <FiMail className="text-lg mb-0.5" />
              <span>Contacts</span>
            </a>

            <Link
              to="/cart"
              className="flex flex-col items-center text-xs text-slate-600 relative"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <FiShoppingCart className="text-lg mb-0.5" />
              <span>Cart</span>
              {cartItems.length > 0 && (
                <div className="absolute top-0 right-1 -translate-y-1 translate-x-2 bg-orange-500 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">
                  {cartItems.length}
                </div>
              )}
            </Link>
          </>
        )}

        <Link
          to="/warning-signs"
          className="flex flex-col items-center text-xs text-slate-600"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <AlertTriangle className="text-lg mb-0.5" />
          <span>Warnings</span>
        </Link>

        <Link
          to="/profile"
          className="flex flex-col items-center text-xs text-slate-600"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <FiUser className="text-lg mb-0.5" />
          <span>Profile</span>
        </Link>
      </nav>
    </>
  ) : null;
};

export default Navbar;
