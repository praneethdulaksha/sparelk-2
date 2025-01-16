import { FiTruck, FiRefreshCw, FiCreditCard, FiGift } from 'react-icons/fi';

const FeaturesSection = () => {
    return (
        <div className="w-screen bg-yellow-50 py-6">
            <div className="max-w-7xl mx-auto flex justify-around items-center space-x-6">
                {/* Feature Item */}
                <div className="flex items-center space-x-4">
                    <FiTruck className="text-yellow-500 w-8 h-8" />
                    <div>
                        <h5 className="text-black font-semibold">FREE DELIVERY</h5>
                        <p className="text-gray-600 text-sm">Worldwide from $75</p>
                    </div>
                </div>

                {/* Feature Item */}
                <div className="flex items-center space-x-4">
                    <FiRefreshCw className="text-yellow-500 w-8 h-8" />
                    <div>
                        <h5 className="text-black font-semibold">EASY RETURNS</h5>
                        <p className="text-gray-600 text-sm">365 days for free returns</p>
                    </div>
                </div>

                {/* Feature Item */}
                <div className="flex items-center space-x-4">
                    <FiCreditCard className="text-yellow-500 w-8 h-8" />
                    <div>
                        <h5 className="text-black font-semibold">COMFORT PAYMENTS</h5>
                        <p className="text-gray-600 text-sm">Credit Cards Available</p>
                    </div>
                </div>

                {/* Feature Item */}
                <div className="flex items-center space-x-4">
                    <FiGift className="text-yellow-500 w-8 h-8" />
                    <div>
                        <h5 className="text-black font-semibold">FREE GIFTS</h5>
                        <p className="text-gray-600 text-sm">Get gifts and discounts</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FeaturesSection;
