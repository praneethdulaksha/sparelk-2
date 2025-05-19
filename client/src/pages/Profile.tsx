/**
 * Profile Page Component
 *
 * Acts as a wrapper/container for various profile-related content.
 * Handles authentication checks and redirects unauthorized users.
 * Renders different profile sections through React Router's Outlet.
 *
 * @module Pages/Profile
 */
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate, Outlet } from "react-router-dom";
import { RootState } from "../store/store";
import { userActions } from "../reducers/userSlice";
import { ErrorMessage } from "@/components/ui/error-message";
import { Button } from "@/components/ui/button";
import { RefreshCcw } from "lucide-react";

/**
 * Profile page component
 * Container for all profile-related content with authentication check
 *
 * @returns {JSX.Element | null} Profile container or nothing if user is not authenticated
 */
export default function Profile() {
  // Get authentication state from Redux store
  const { user, isUserAuthed } = useSelector((state: RootState) => state.user);

  // State for loading and error handling
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  /**
   * Authentication check on component mount and when auth state changes
   * Redirects to homepage if not authenticated, storing current page for redirect back after login
   */
  useEffect(() => {
    // Check authentication without simulated delay
    if (!isUserAuthed) {
      dispatch(userActions.setPreviosPage(location.pathname));
      navigate("/");
    }
  }, [isUserAuthed]);

  /**
   * Render error state if something goes wrong
   */
  if (error) {
    return (
      <div className="w-screen min-h-screen bg-gray-50 py-12 px-4 sm:px-6 md:px-8">
        <div className="max-w-md mx-auto">
          <ErrorMessage message={error} />
          <div className="mt-4 flex justify-center">
            <Button
              onClick={() => window.location.reload()}
              className="bg-orange-500 hover:bg-orange-600 text-white"
            >
              <RefreshCcw className="h-4 w-4 mr-2" />
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  /**
   * Render the appropriate profile content through Outlet
   * Outlet allows child routes to render their content here
   */
  return isUserAuthed && user ? <Outlet /> : null;
}
