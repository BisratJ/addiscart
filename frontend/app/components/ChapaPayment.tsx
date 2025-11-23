'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, CreditCard, Smartphone, Building2, AlertCircle } from 'lucide-react';

interface ChapaPaymentProps {
  amount: number;
  cartId: string;
  userEmail: string;
  userPhone?: string;
  onSuccess?: (orderId: string) => void;
  onError?: (error: string) => void;
}

export default function ChapaPayment({
  amount,
  cartId,
  userEmail,
  userPhone = '',
  onSuccess,
  onError
}: ChapaPaymentProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('chapa_card');
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: userEmail,
    phoneNumber: userPhone
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const initializePayment = async () => {
    // Validation
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.phoneNumber) {
      setError('Please fill in all required fields');
      return;
    }

    if (amount <= 0) {
      setError('Invalid payment amount');
      return;
    }

    setError(null);

    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/chapa/initialize`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          amount,
          currency: 'ETB',
          ...formData,
          cartId,
          customization: {
            title: 'Addiscart Payment',
            description: `Payment for order - ETB ${amount}`,
          }
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to initialize payment');
      }

      if (data.success && data.checkoutUrl) {
        // Redirect to Chapa checkout page
        window.location.href = data.checkoutUrl;
      } else {
        throw new Error('No checkout URL received');
      }
    } catch (error: any) {
      console.error('Payment initialization error:', error);
      const errorMessage = error.message || 'Failed to initialize payment';
      setError(errorMessage);
      onError?.(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Pay with Chapa</h2>

      {/* Error Alert */}
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start">
          <AlertCircle className="h-5 w-5 text-red-600 mr-2 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {/* Payment Method Selection */}
      <div className="mb-6">
        <label className="text-base font-semibold mb-3 block">Select Payment Method</label>
        <div className="space-y-3">
          <div 
            onClick={() => setPaymentMethod('chapa_card')}
            className={`flex items-center space-x-3 p-3 border-2 rounded-lg cursor-pointer hover:bg-gray-50 transition ${
              paymentMethod === 'chapa_card' ? 'border-green-600 bg-green-50' : 'border-gray-200'
            }`}
          >
            <input
              type="radio"
              checked={paymentMethod === 'chapa_card'}
              onChange={() => setPaymentMethod('chapa_card')}
              className="h-4 w-4 text-green-600"
            />
            <div className="flex items-center flex-1">
              <CreditCard className="mr-3 h-5 w-5 text-blue-600" />
              <div>
                <div className="font-medium">Credit/Debit Card</div>
                <div className="text-sm text-gray-500">Visa, Mastercard, Amex</div>
              </div>
            </div>
          </div>

          <div 
            onClick={() => setPaymentMethod('chapa_mobile')}
            className={`flex items-center space-x-3 p-3 border-2 rounded-lg cursor-pointer hover:bg-gray-50 transition ${
              paymentMethod === 'chapa_mobile' ? 'border-green-600 bg-green-50' : 'border-gray-200'
            }`}
          >
            <input
              type="radio"
              checked={paymentMethod === 'chapa_mobile'}
              onChange={() => setPaymentMethod('chapa_mobile')}
              className="h-4 w-4 text-green-600"
            />
            <div className="flex items-center flex-1">
              <Smartphone className="mr-3 h-5 w-5 text-green-600" />
              <div>
                <div className="font-medium">Mobile Money</div>
                <div className="text-sm text-gray-500">M-Pesa, Telebirr, etc.</div>
              </div>
            </div>
          </div>

          <div 
            onClick={() => setPaymentMethod('chapa_bank')}
            className={`flex items-center space-x-3 p-3 border-2 rounded-lg cursor-pointer hover:bg-gray-50 transition ${
              paymentMethod === 'chapa_bank' ? 'border-green-600 bg-green-50' : 'border-gray-200'
            }`}
          >
            <input
              type="radio"
              checked={paymentMethod === 'chapa_bank'}
              onChange={() => setPaymentMethod('chapa_bank')}
              className="h-4 w-4 text-green-600"
            />
            <div className="flex items-center flex-1">
              <Building2 className="mr-3 h-5 w-5 text-purple-600" />
              <div>
                <div className="font-medium">Bank Transfer</div>
                <div className="text-sm text-gray-500">Direct bank transfer</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Details Form */}
      <div className="space-y-4 mb-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">First Name *</label>
            <input
              id="firstName"
              name="firstName"
              type="text"
              value={formData.firstName}
              onChange={handleInputChange}
              placeholder="John"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
            />
          </div>
          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">Last Name *</label>
            <input
              id="lastName"
              name="lastName"
              type="text"
              value={formData.lastName}
              onChange={handleInputChange}
              placeholder="Doe"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
            />
          </div>
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
          <input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="john.doe@example.com"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
          />
        </div>

        <div>
          <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
          <input
            id="phoneNumber"
            name="phoneNumber"
            type="tel"
            value={formData.phoneNumber}
            onChange={handleInputChange}
            placeholder="+251912345678"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
          />
          <p className="text-xs text-gray-500 mt-1">
            Include country code (e.g., +251 for Ethiopia)
          </p>
        </div>
      </div>

      {/* Amount Display */}
      <div className="bg-gray-50 p-4 rounded-lg mb-6">
        <div className="flex justify-between items-center">
          <span className="text-lg font-semibold">Total Amount:</span>
          <span className="text-2xl font-bold text-green-600">
            ETB {amount.toFixed(2)}
          </span>
        </div>
      </div>

      {/* Pay Button */}
      <button
        onClick={initializePayment}
        disabled={loading}
        className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white py-4 px-6 rounded-md text-lg font-semibold flex items-center justify-center transition"
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Processing...
          </>
        ) : (
          <>
            Pay ETB {amount.toFixed(2)}
          </>
        )}
      </button>

      {/* Security Notice */}
      <div className="mt-4 text-center text-sm text-gray-500">
        <p>🔒 Secured by Chapa - Your payment information is encrypted</p>
      </div>
    </div>
  );
}
