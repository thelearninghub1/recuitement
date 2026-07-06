// /src/pages/PayNow.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  ArrowLeft, 
  Lock, 
  Shield, 
  CreditCard,
  CheckCircle,
  Building,
  Loader,
  Check,
  AlertCircle,
  Phone ,
  Smartphone,
  QrCode
} from "lucide-react";

const PayNow = () => {
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("credit_card");
  const [cardDetails, setCardDetails] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardholderName: ""
  });
  const [errors, setErrors] = useState({});

  // Static order summary data
  const orderSummary = {
    plan: "Growing School",
    billingCycle: "Annual",
    amount: "22,500 SAR",
    vat: "3,375 SAR",
    total: "25,875 SAR",
    subtotal: 22500,
    vatAmount: 3375,
    totalAmount: 25875
  };

  const handleCardInputChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;

    // Format card number with spaces
    if (name === "cardNumber") {
      formattedValue = value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim();
    }
    
    // Format expiry date
    if (name === "expiryDate") {
      formattedValue = value.replace(/\D/g, '');
      if (formattedValue.length >= 2) {
        formattedValue = formattedValue.slice(0, 2) + '/' + formattedValue.slice(2, 4);
      }
    }

    setCardDetails({
      ...cardDetails,
      [name]: formattedValue
    });

    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (paymentMethod === "credit_card") {
      if (!cardDetails.cardNumber.replace(/\s/g, '').match(/^\d{16}$/)) {
        newErrors.cardNumber = 'Valid card number required';
      }
      
      if (!cardDetails.expiryDate.match(/^\d{2}\/\d{2}$/)) {
        newErrors.expiryDate = 'Valid expiry date required (MM/YY)';
      }
      
      if (!cardDetails.cvv.match(/^\d{3,4}$/)) {
        newErrors.cvv = 'Valid CVV required';
      }
      
      if (!cardDetails.cardholderName.trim()) {
        newErrors.cardholderName = 'Cardholder name required';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePaymentComplete = () => {
    if (validateForm()) {
      setIsProcessing(true);
      
      // Simulate payment processing
      setTimeout(() => {
        // Generate receipt data
        const receiptData = {
          orderId: `ORD-${Date.now().toString().slice(-8)}`,
          transactionId: `TXN-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
          date: new Date().toLocaleString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          }),
          amount: orderSummary.total
        };
        
        // Save receipt data for ThankYou page
        localStorage.setItem('receiptData', JSON.stringify(receiptData));
        navigate('/thank-you');
      }, 2000);
    }
  };

  return (
    <div className="font-[Parkinsans] mt-30 min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-8 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/billing-details')}
            className="flex items-center gap-2 text-[#0077BB] hover:text-[#005588] font-medium mb-4 transition-colors"
          >
            <ArrowLeft size={20} />
            Back to Billing
          </button>
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                Complete Payment
              </h1>
              <p className="text-gray-600 mt-2">
                Securely complete your membership purchase
              </p>
            </div>
            
            <div className="flex items-center gap-3 px-4 py-2 bg-white rounded-xl border border-gray-200 shadow-sm">
              <Lock className="text-green-600" size={20} />
              <span className="text-sm font-medium text-gray-700">SSL Secured</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column: Payment Form */}
          <div className="space-y-6">
            {/* Payment Method Selection */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Payment Method</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <button
                  onClick={() => setPaymentMethod("credit_card")}
                  className={`p-4 rounded-xl border-2 transition-all flex items-center justify-center gap-3 ${
                    paymentMethod === "credit_card" 
                    ? 'border-[#0077BB] bg-blue-50' 
                    : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <CreditCard size={24} />
                  <span className="font-medium">Credit Card</span>
                </button>
                
                <button
                  onClick={() => setPaymentMethod("apple_pay")}
                  className={`p-4 rounded-xl border-2 transition-all flex items-center justify-center gap-3 ${
                    paymentMethod === "apple_pay" 
                    ? 'border-[#0077BB] bg-blue-50' 
                    : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <Smartphone size={24} />
                  <span className="font-medium">Apple Pay</span>
                </button>
              </div>

              {/* Credit Card Form */}
              {paymentMethod === "credit_card" && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Card Number *
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        name="cardNumber"
                        value={cardDetails.cardNumber}
                        onChange={handleCardInputChange}
                        placeholder="1234 5678 9012 3456"
                        maxLength="19"
                        className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent pl-12 ${
                          errors.cardNumber ? 'border-red-300' : 'border-gray-300'
                        }`}
                      />
                      <CreditCard className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    </div>
                    {errors.cardNumber && (
                      <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle size={14} />
                        {errors.cardNumber}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Expiry Date *
                      </label>
                      <input
                        type="text"
                        name="expiryDate"
                        value={cardDetails.expiryDate}
                        onChange={handleCardInputChange}
                        placeholder="MM/YY"
                        maxLength="5"
                        className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          errors.expiryDate ? 'border-red-300' : 'border-gray-300'
                        }`}
                      />
                      {errors.expiryDate && (
                        <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                          <AlertCircle size={14} />
                          {errors.expiryDate}
                        </p>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        CVV *
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          name="cvv"
                          value={cardDetails.cvv}
                          onChange={handleCardInputChange}
                          placeholder="123"
                          maxLength="4"
                          className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                            errors.cvv ? 'border-red-300' : 'border-gray-300'
                          }`}
                        />
                        <Lock className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                      </div>
                      {errors.cvv && (
                        <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                          <AlertCircle size={14} />
                          {errors.cvv}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Cardholder Name *
                    </label>
                    <input
                      type="text"
                      name="cardholderName"
                      value={cardDetails.cardholderName}
                      onChange={handleCardInputChange}
                      placeholder="Name on card"
                      className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.cardholderName ? 'border-red-300' : 'border-gray-300'
                      }`}
                    />
                    {errors.cardholderName && (
                      <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle size={14} />
                        {errors.cardholderName}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Apple Pay/Mada Pay Display */}
              {paymentMethod === "apple_pay" && (
                <div className="text-center py-8">
                  <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-8 border border-gray-200">
                    <QrCode className="w-20 h-20 text-gray-400 mx-auto mb-4" />
                    <h3 className="font-bold text-gray-900 mb-2">Apple Pay / Mada Pay</h3>
                    <p className="text-gray-600 mb-4">
                      You'll be redirected to your payment app to complete the transaction
                    </p>
                    <button className="px-6 py-3 bg-black text-white rounded-xl font-medium hover:bg-gray-800 transition-colors">
                      Pay with Apple Pay
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Payment Button */}
            <motion.button
              whileHover={{ scale: isProcessing ? 1 : 1.02 }}
              whileTap={{ scale: isProcessing ? 1 : 0.98 }}
              onClick={handlePaymentComplete}
              disabled={isProcessing}
              className={`w-full py-4 bg-gradient-to-r from-[#0077BB] to-[#00AEEF] text-white font-bold rounded-xl hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-3 shadow-md ${
                isProcessing ? 'opacity-80 cursor-not-allowed' : ''
              }`}
            >
              {isProcessing ? (
                <>
                  <Loader className="animate-spin" size={20} />
                  Processing Payment...
                </>
              ) : (
                <>
                  <Lock size={20} />
                  Complete Payment - {orderSummary.total}
                </>
              )}
            </motion.button>

            {/* Security Info */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200">
              <div className="flex items-center gap-3 mb-4">
                <Shield className="text-green-600" size={24} />
                <h3 className="font-bold text-gray-900">Payment Security</h3>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <CheckCircle className="text-green-500" size={16} />
                  <span className="text-sm text-gray-700">256-bit SSL encryption</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="text-green-500" size={16} />
                  <span className="text-sm text-gray-700">PCI DSS Level 1 compliant</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="text-green-500" size={16} />
                  <span className="text-sm text-gray-700">No card data stored</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="text-green-500" size={16} />
                  <span className="text-sm text-gray-700">Real-time fraud detection</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Order Summary & Info */}
          <div className="space-y-6">
            {/* Order Summary */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>
              
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-r from-[#00AEEF] to-[#F6B400] flex items-center justify-center`}>
                    <Building className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">{orderSummary.plan}</h3>
                    <p className="text-sm text-gray-600">Annual Membership</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Plan Amount:</span>
                    <span className="font-medium">{orderSummary.amount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">VAT (15%):</span>
                    <span className="text-gray-600">{orderSummary.vat}</span>
                  </div>
                  <div className="border-t pt-3">
                    <div className="flex justify-between font-bold text-lg">
                      <span>Total Amount:</span>
                      <span className="text-green-600">{orderSummary.total}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <h4 className="font-bold text-gray-900 mb-2">What's Included:</h4>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2 text-sm text-gray-600">
                      <Check className="text-green-500" size={16} />
                      14-day free trial
                    </li>
                    <li className="flex items-center gap-2 text-sm text-gray-600">
                      <Check className="text-green-500" size={16} />
                      No setup fees
                    </li>
                    <li className="flex items-center gap-2 text-sm text-gray-600">
                      <Check className="text-green-500" size={16} />
                      Cancel anytime
                    </li>
                    <li className="flex items-center gap-2 text-sm text-gray-600">
                      <Check className="text-green-500" size={16} />
                      Dedicated support
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Accepted Cards */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
              <h3 className="font-bold text-gray-900 mb-4">Accepted Payment Methods</h3>
              <div className="flex flex-wrap gap-3">
                <div className="p-3 border border-gray-200 rounded-lg">
                  <div className="w-10 h-6 bg-gradient-to-r from-red-500 to-yellow-500 rounded"></div>
                  <span className="text-xs text-gray-600 mt-1">Visa</span>
                </div>
                <div className="p-3 border border-gray-200 rounded-lg">
                  <div className="w-10 h-6 bg-gradient-to-r from-blue-500 to-orange-500 rounded"></div>
                  <span className="text-xs text-gray-600 mt-1">Mastercard</span>
                </div>
                <div className="p-3 border border-gray-200 rounded-lg">
                  <div className="w-10 h-6 bg-green-500 rounded"></div>
                  <span className="text-xs text-gray-600 mt-1">Mada</span>
                </div>
                <div className="p-3 border border-gray-200 rounded-lg">
                  <div className="w-10 h-6 bg-black rounded"></div>
                  <span className="text-xs text-gray-600 mt-1">Apple Pay</span>
                </div>
              </div>
            </div>

            {/* Need Help Card */}
            <div className="bg-gradient-to-r from-blue-900 to-indigo-800 text-white rounded-2xl p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white/10 rounded-xl">
                  <Phone size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-1">Need Assistance?</h3>
                  <p className="text-blue-100 text-sm mb-3">
                    Our support team is available 24/7 to help with your payment.
                  </p>
                  <div className="space-y-2">
                    <a href="tel:+966123456789" className="text-sm hover:underline block">
                      📞 +966 503 865 055
                    </a>
                    <a href="mailto:info@theteachingpath.com" className="text-sm hover:underline block">
                      ✉️ info@theteachingpath.com
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PayNow;