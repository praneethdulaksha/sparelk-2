
type Props = {
    setLogin: any;
    setTermOpen: any;
}

export default function TermsAndConditions({ setLogin, setTermOpen }: Props) {
    return (
        <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-lg">
            <h1 className="text-3xl font-semibold mb-4 text-center">Terms & Conditions</h1>
            <div className="text-gray-700 text-sm space-y-4">
                <p>
                    Welcome to Spare.lk, Before using our platform, please read these terms and conditions carefully.
                </p>
                <h5 className="font-medium">1. User Responsibilities</h5>
                <p>
                    - Users must provide accurate information during registration.<br />
                    - Any misuse of the platform may result in account suspension.
                </p>
                <h5 className="font-medium">2. Product Listings</h5>
                <p>
                    - Sellers must ensure product details are correct and not misleading.<br />
                    - Counterfeit or illegal products are strictly prohibited.
                </p>
                <h5 className="font-medium">3. Payments & Transactions</h5>
                <p>
                    - All transactions should be made through the official platform payment system.<br />
                    - Refunds and disputes will be handled as per our refund policy.
                </p>
                <h5 className="font-medium">4. Liability</h5>
                <p>
                    - Spare.lk is not responsible for third-party issues related to transactions or product quality.<br />
                    - Users are encouraged to review sellers and buyers before transactions.
                </p>
                <h5 className="font-medium">5. Privacy Policy</h5>
                <p>
                    - We value user privacy and do not share personal data without consent.<br />
                    - Refer to our full Privacy Policy for more details.
                </p>
                <p className="text-sm text-gray-500">By using Spare.lk, you agree to these terms and conditions.</p>
            </div>
            <div className="flex justify-center mt-6">
                <button 
                onClick={() => {
                    setTermOpen(false);
                    setLogin(true);
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                    Accept & Continue
                </button>
            </div>
        </div>
    );
};
