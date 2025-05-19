/**
 * Footer Component
 *
 * Displays the site footer containing company information, navigation links,
 * categories, newsletter subscription, and social media links.
 * Implements responsive design and loading states.
 *
 * @module Components/Footer
 */
import { useState, useEffect } from "react";
import {
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  MapPin,
  Phone,
  Mail,
} from "lucide-react";
import { Link } from "react-router-dom";
import Logo from "./Logo";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorMessage } from "@/components/ui/error-message";

/**
 * Footer component
 * Site-wide footer with company information, navigation, and contact details
 *
 * @returns {JSX.Element} Footer component with appropriate loading states
 */
export default function Footer() {
  // State for managing loading and error conditions
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Load footer configuration data on component mount
   * Currently simulated, but could fetch from an API in the future
   */
  useEffect(() => {
    // This could be replaced with real data fetching logic if footer data comes from an API
    const loadFooterData = async () => {
      setLoading(true);
      try {
        // Simulate API call for footer configuration
        await new Promise((resolve) => setTimeout(resolve, 0));
        setLoading(false);
      } catch (err) {
        console.error("Error loading footer data:", err);
        setError("Failed to load footer information");
        setLoading(false);
      }
    };

    loadFooterData();
  }, []);

  /**
   * Render loading skeleton when data is being fetched
   */
  if (loading) {
    return (
      <footer className="bg-slate-900 text-slate-300 w-full">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Company Info Skeleton */}
            <div>
              <Skeleton className="h-10 w-32 mb-4" />
              <Skeleton className="h-4 w-full mb-5" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-4/5" />
                <Skeleton className="h-4 w-3/5" />
                <Skeleton className="h-4 w-4/5" />
              </div>
            </div>

            {/* Quick Links Skeleton */}
            <div>
              <Skeleton className="h-6 w-32 mb-4" />
              <div className="space-y-2">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <Skeleton key={i} className="h-4 w-24" />
                ))}
              </div>
            </div>

            {/* Categories Skeleton */}
            <div>
              <Skeleton className="h-6 w-40 mb-4" />
              <div className="space-y-2">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <Skeleton key={i} className="h-4 w-36" />
                ))}
              </div>
            </div>

            {/* Newsletter Skeleton */}
            <div>
              <Skeleton className="h-6 w-32 mb-4" />
              <Skeleton className="h-4 w-full mb-4" />
              <Skeleton className="h-10 w-full mb-6" />
              <div className="flex space-x-4">
                {[1, 2, 3, 4].map((i) => (
                  <Skeleton key={i} className="h-5 w-5" />
                ))}
              </div>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
            <Skeleton className="h-4 w-48" />
            <div className="flex gap-4">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-4 w-24" />
              ))}
            </div>
          </div>
        </div>
      </footer>
    );
  }

  /**
   * Render error message if data loading failed
   */
  if (error) {
    return (
      <footer className="bg-slate-900 text-slate-300 w-full">
        <div className="container mx-auto px-4 py-6">
          <ErrorMessage message={error} />
        </div>
      </footer>
    );
  }

  // Main footer content
  return (
    <footer id="footer" className="bg-slate-900 text-slate-300 w-full">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info Section */}
          <div>
            <div className="mb-4">
              <Logo variant="light" size="medium" />
            </div>
            <p className="mb-5 text-sm">
              Your trusted marketplace for quality auto parts. Buy and sell with
              confidence.
            </p>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="h-4 w-4 text-orange-500" />
                <span>12/B, Lake Road, Colombo 1, Sri Lanka</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Phone className="h-4 w-4 text-orange-500" />
                <span>+94 770 673892</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Mail className="h-4 w-4 text-orange-500" />
                <span>mailto@sparelk.com</span>
              </div>
            </div>
          </div>
          {/* Quick Links Section */}
          <div>
            <h3 className="text-white font-bold text-base mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  to="/"
                  className="hover:text-orange-500 transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/shop"
                  className="hover:text-orange-500 transition-colors"
                >
                  Shop
                </Link>
              </li>
              <li>
                <Link
                  to="/profile/seller-form"
                  className="hover:text-orange-500 transition-colors"
                >
                  Sell Parts
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="hover:text-orange-500 transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="hover:text-orange-500 transition-colors"
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  to="/blog"
                  className="hover:text-orange-500 transition-colors"
                >
                  Blog
                </Link>
              </li>
            </ul>
          </div>
          {/* Categories Section */}
          <div>
            <h3 className="text-white font-bold text-base mb-4">
              Top Categories
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  to="/shop?category=engine"
                  className="hover:text-orange-500 transition-colors"
                >
                  Engine Parts
                </Link>
              </li>
              <li>
                <Link
                  to="/shop?category=body"
                  className="hover:text-orange-500 transition-colors"
                >
                  Body Parts
                </Link>
              </li>
              <li>
                <Link
                  to="/shop?category=lighting"
                  className="hover:text-orange-500 transition-colors"
                >
                  Lighting & Indicators
                </Link>
              </li>
              <li>
                <Link
                  to="/shop?category=brake"
                  className="hover:text-orange-500 transition-colors"
                >
                  Brake Systems
                </Link>
              </li>
              <li>
                <Link
                  to="/shop?category=wheels"
                  className="hover:text-orange-500 transition-colors"
                >
                  Wheels & Tires
                </Link>
              </li>
              <li>
                <Link
                  to="/shop?category=electrical"
                  className="hover:text-orange-500 transition-colors"
                >
                  Electrical Components
                </Link>
              </li>
            </ul>
          </div>
          {/* Newsletter */}
          <div>
            <h3 className="text-white font-bold text-base mb-4">Newsletter</h3>
            <p className="text-sm mb-4">
              Subscribe to receive updates on new products and special
              promotions
            </p>
            <div className="flex">
              <input
                type="email"
                placeholder="Your email"
                className="flex-1 rounded-l-md border-0 bg-slate-800 px-3 py-2 text-sm placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-orange-500"
              />
              <button className="rounded-r-md bg-orange-500 px-3 py-2 text-sm font-medium text-white hover:bg-orange-600 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-orange-500">
                Subscribe
              </button>
            </div>
            <div className="mt-6 flex space-x-4">
              <Link
                to="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-400 hover:text-orange-500"
              >
                <Facebook className="h-5 w-5" />
                <span className="sr-only">Facebook</span>
              </Link>
              <Link
                to="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-400 hover:text-orange-500"
              >
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </Link>
              <Link
                to="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-400 hover:text-orange-500"
              >
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </Link>
              <Link
                to="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-400 hover:text-orange-500"
              >
                <Youtube className="h-5 w-5" />
                <span className="sr-only">YouTube</span>
              </Link>
            </div>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm">
            © {new Date().getFullYear()} SpareLK. All rights reserved.
          </p>
          <div className="flex gap-4 text-sm">
            <Link
              to="/privacy"
              className="hover:text-orange-500 transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              to="/terms"
              className="hover:text-orange-500 transition-colors"
            >
              Terms & Conditions
            </Link>
            <Link
              to="/sitemap"
              className="hover:text-orange-500 transition-colors"
            >
              Sitemap
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
