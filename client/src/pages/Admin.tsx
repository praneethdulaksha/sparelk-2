/**
 * Admin Page Component
 *
 * Provides an administrative interface for managing users and their verification status.
 * Currently displays a list of unverified users and allows admin to approve them.
 *
 * @module Pages/Admin
 */
import { useState, useEffect } from "react";
import Button from "../components/Button";

/**
 * Interface for user data in the admin panel
 * @interface AdminUser
 */
interface AdminUser {
  /** Unique identifier for the user */
  _id: string;
  /** User's first name */
  firstName: string;
  /** User's email address */
  email: string;
  /** Whether the user has been verified */
  verified: boolean;
  /** Whether the user is verified after admin approval */
  isVerified?: boolean;
}

/**
 * Admin page component
 * Administrative interface for user management and verification
 *
 * @returns {JSX.Element} Admin panel component
 */
function Admin() {
  // State for user data
  const [users, setUsers] = useState<AdminUser[]>([]);

  /**
   * Load user data on component mount
   * Currently uses mock data, should be replaced with actual API call
   */
  useEffect(() => {
    // Fetch unverified users (Replace with actual API call)
    setUsers([
      {
        _id: "1",
        firstName: "John Doe",
        email: "john@example.com",
        verified: false,
      },
      {
        _id: "2",
        firstName: "Jane Smith",
        email: "jane@example.com",
        verified: false,
      },
    ]);
  }, []);

  /**
   * Handles user verification
   * Updates user status when admin approves verification
   *
   * @param {string} userId - ID of the user to verify
   */
  const handleVerify = (userId: string) => {
    // Update user verification status (Replace with actual API call)
    setUsers(
      users.map((user) =>
        user._id === userId ? { ...user, isVerified: true } : user
      )
    );
  };

  return (
    <div className="max-w-4xl mx-auto p-6 flex-grow bg-white rounded-lg w-full ">
      <h1 className="text-2xl font-semibold mb-4 text-center">
        Admin Panel - User Verification
      </h1>

      {/* User Verification Table */}
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Name</th>
            <th className="border p-2">Email</th>
            <th className="border p-2">Status</th>
            <th className="border p-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id} className="text-center border">
              <td className="border p-2">{user.firstName}</td>
              <td className="border p-2">{user.email}</td>
              <td className="border p-2">
                {user.verified ? "Verified" : "Pending"}
              </td>
              <td className="border p-2">
                {!user.verified && (
                  <Button
                    onClick={() => handleVerify(user._id)}
                    className="px-4 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Verify
                  </Button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Admin;
