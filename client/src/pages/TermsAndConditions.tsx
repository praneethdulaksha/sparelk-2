import { useNavigate } from "react-router-dom";

type Props = {
  setTermOpen: (value: boolean) => void;
  setLogin?: (value: boolean) => void; // Make setLogin optional for backward compatibility
};

export default function TermsAndConditions({ setLogin, setTermOpen }: Props) {
  const navigate = useNavigate();

  const handleContinue = () => {
    setTermOpen(false);
    // Use the navigate function if setLogin is not provided or is a function we can call
    if (typeof setLogin === "function") {
      setLogin(true);
    } else {
      navigate("/login");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-3xl font-semibold mb-4 text-center">
        Terms & Conditions
      </h1>
      <div className="text-gray-700 text-sm space-y-4">
        <p>
          Welcome to Spare.lk, Before using our platform, please read these
          terms and conditions carefully.
        </p>
        <h5 className="font-medium">1. User Responsibilities</h5>
        <p>
          - Users must provide accurate information during registration.
          <br />- Any misuse of the platform may result in account suspension.
        </p>
        <h5 className="font-medium">2. Product Listings</h5>
        <p>
          - Sellers must ensure product details are correct and not misleading.
          <br />- Counterfeit or illegal products are strictly prohibited.
        </p>
        <h5 className="font-medium">3. Payments & Transactions</h5>
        <p>
          - All transactions should be made through the official platform
          payment system.
          <br />- Refunds and disputes will be handled as per our refund policy.
        </p>
        <h5 className="font-medium">4. Liability</h5>
        <p>
          - Spare.lk is not responsible for third-party issues related to
          transactions or product quality.
          <br />- Users are encouraged to review sellers and buyers before
          transactions.
        </p>
        <h5 className="font-medium">5. Privacy Policy</h5>
        <p>
          - We value user privacy and do not share personal data without
          consent.
          <br />- Refer to our full Privacy Policy for more details.
        </p>
        <p className="text-sm text-gray-500">
          By using Spare.lk, you agree to these terms and conditions.
        </p>
      </div>
      <div className="flex justify-center mt-6">
        <button
          onClick={handleContinue}
          className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 text-base"
        >
          Accept & Continue
        </button>
      </div>
    </div>
  );
}
