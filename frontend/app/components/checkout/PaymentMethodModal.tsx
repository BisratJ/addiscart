'use client';

import { useState, useEffect } from 'react';
import { X, CreditCard, Lock } from 'lucide-react';

export interface PaymentMethod {
  id: string;
  type: 'card' | 'cash';
  cardNumber?: string;
  cardholderName?: string;
  expiryMonth?: string;
  expiryYear?: string;
  cvv?: string;
  brand?: 'Visa' | 'Mastercard' | 'Amex' | 'Discover';
  last4?: string;
  isDefault: boolean;
}

interface PaymentMethodModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (paymentMethod: PaymentMethod) => void;
  paymentMethod?: PaymentMethod | null;
  mode: 'add' | 'edit';
}

export default function PaymentMethodModal({ isOpen, onClose, onSave, paymentMethod, mode }: PaymentMethodModalProps) {
  const [formData, setFormData] = useState<Partial<PaymentMethod>>({
    type: 'card',
    cardNumber: '',
    cardholderName: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: '',
    isDefault: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (paymentMethod && mode === 'edit') {
      setFormData(paymentMethod);
    } else {
      setFormData({
        type: 'card',
        cardNumber: '',
        cardholderName: '',
        expiryMonth: '',
        expiryYear: '',
        cvv: '',
        isDefault: false,
      });
    }
  }, [paymentMethod, mode, isOpen]);

  const detectCardBrand = (number: string): 'Visa' | 'Mastercard' | 'Amex' | 'Discover' | undefined => {
    const cleaned = number.replace(/\s/g, '');
    if (/^4/.test(cleaned)) return 'Visa';
    if (/^5[1-5]/.test(cleaned)) return 'Mastercard';
    if (/^3[47]/.test(cleaned)) return 'Amex';
    if (/^6(?:011|5)/.test(cleaned)) return 'Discover';
    return undefined;
  };

  const formatCardNumber = (value: string) => {
    const cleaned = value.replace(/\s/g, '');
    const match = cleaned.match(/.{1,4}/g);
    return match ? match.join(' ') : cleaned;
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (formData.type === 'card') {
      if (!formData.cardholderName?.trim()) {
        newErrors.cardholderName = 'Cardholder name is required';
      }
      
      const cardNumber = formData.cardNumber?.replace(/\s/g, '') || '';
      if (!cardNumber) {
        newErrors.cardNumber = 'Card number is required';
      } else if (!/^\d{13,19}$/.test(cardNumber)) {
        newErrors.cardNumber = 'Invalid card number';
      }

      if (!formData.expiryMonth) {
        newErrors.expiryMonth = 'Expiry month is required';
      }

      if (!formData.expiryYear) {
        newErrors.expiryYear = 'Expiry year is required';
      } else {
        const currentYear = new Date().getFullYear();
        const currentMonth = new Date().getMonth() + 1;
        const expYear = parseInt(formData.expiryYear);
        const expMonth = parseInt(formData.expiryMonth || '0');

        if (expYear < currentYear || (expYear === currentYear && expMonth < currentMonth)) {
          newErrors.expiryYear = 'Card has expired';
        }
      }

      if (!formData.cvv) {
        newErrors.cvv = 'CVV is required';
      } else if (!/^\d{3,4}$/.test(formData.cvv)) {
        newErrors.cvv = 'Invalid CVV';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;

    const cardNumber = formData.cardNumber?.replace(/\s/g, '') || '';
    const last4 = cardNumber.slice(-4);
    const brand = detectCardBrand(cardNumber);

    const paymentMethodToSave: PaymentMethod = {
      id: paymentMethod?.id || `pm_${Date.now()}`,
      type: formData.type!,
      cardholderName: formData.cardholderName,
      expiryMonth: formData.expiryMonth,
      expiryYear: formData.expiryYear,
      brand,
      last4,
      isDefault: formData.isDefault || false,
    };

    onSave(paymentMethodToSave);
    onClose();
  };

  const handleChange = (field: keyof PaymentMethod, value: string | boolean) => {
    if (field === 'cardNumber' && typeof value === 'string') {
      const formatted = formatCardNumber(value.replace(/\D/g, '').slice(0, 19));
      setFormData(prev => ({ ...prev, [field]: formatted }));
    } else if (field === 'cvv' && typeof value === 'string') {
      setFormData(prev => ({ ...prev, [field]: value.replace(/\D/g, '').slice(0, 4) }));
    } else if (field === 'expiryMonth' && typeof value === 'string') {
      setFormData(prev => ({ ...prev, [field]: value.replace(/\D/g, '').slice(0, 2) }));
    } else if (field === 'expiryYear' && typeof value === 'string') {
      setFormData(prev => ({ ...prev, [field]: value.replace(/\D/g, '').slice(0, 4) }));
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
    
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-semibold flex items-center">
            <CreditCard className="mr-2 h-5 w-5 text-green-600" />
            {mode === 'add' ? 'Add Payment Method' : 'Edit Payment Method'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Security Notice */}
          <div className="bg-blue-50 border border-blue-200 rounded-md p-3 flex items-start">
            <Lock className="h-5 w-5 text-blue-600 mr-2 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-blue-800">
              Your payment information is encrypted and secure. We never store your full card details.
            </p>
          </div>

          {/* Payment Type Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Payment Type
            </label>
            <div className="flex gap-4">
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="paymentType"
                  value="card"
                  checked={formData.type === 'card'}
                  onChange={(e) => handleChange('type', e.target.value)}
                  className="h-4 w-4 text-green-600 focus:ring-green-500"
                />
                <span className="ml-2 text-sm text-gray-700">Credit/Debit Card</span>
              </label>
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="paymentType"
                  value="cash"
                  checked={formData.type === 'cash'}
                  onChange={(e) => handleChange('type', e.target.value)}
                  className="h-4 w-4 text-green-600 focus:ring-green-500"
                />
                <span className="ml-2 text-sm text-gray-700">Cash on Delivery</span>
              </label>
            </div>
          </div>

          {formData.type === 'card' && (
            <>
              {/* Cardholder Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cardholder Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.cardholderName || ''}
                  onChange={(e) => handleChange('cardholderName', e.target.value)}
                  placeholder="John Doe"
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${
                    errors.cardholderName ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.cardholderName && <p className="text-red-500 text-sm mt-1">{errors.cardholderName}</p>}
              </div>

              {/* Card Number */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Card Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.cardNumber || ''}
                  onChange={(e) => handleChange('cardNumber', e.target.value)}
                  placeholder="1234 5678 9012 3456"
                  maxLength={19}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${
                    errors.cardNumber ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.cardNumber && <p className="text-red-500 text-sm mt-1">{errors.cardNumber}</p>}
              </div>

              {/* Expiry and CVV */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Month <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.expiryMonth || ''}
                    onChange={(e) => handleChange('expiryMonth', e.target.value)}
                    placeholder="MM"
                    maxLength={2}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${
                      errors.expiryMonth ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.expiryMonth && <p className="text-red-500 text-xs mt-1">{errors.expiryMonth}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Year <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.expiryYear || ''}
                    onChange={(e) => handleChange('expiryYear', e.target.value)}
                    placeholder="YYYY"
                    maxLength={4}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${
                      errors.expiryYear ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.expiryYear && <p className="text-red-500 text-xs mt-1">{errors.expiryYear}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    CVV <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.cvv || ''}
                    onChange={(e) => handleChange('cvv', e.target.value)}
                    placeholder="123"
                    maxLength={4}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${
                      errors.cvv ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.cvv && <p className="text-red-500 text-xs mt-1">{errors.cvv}</p>}
                </div>
              </div>
            </>
          )}

          {formData.type === 'cash' && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
              <p className="text-sm text-yellow-800">
                You can pay with cash when your order is delivered. Please have the exact amount ready.
              </p>
            </div>
          )}

          {/* Default Payment Method Checkbox */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="isDefault"
              checked={formData.isDefault || false}
              onChange={(e) => handleChange('isDefault', e.target.checked)}
              className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
            />
            <label htmlFor="isDefault" className="ml-2 text-sm text-gray-700">
              Set as default payment method
            </label>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            >
              {mode === 'add' ? 'Add Payment Method' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
