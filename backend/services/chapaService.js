const axios = require('axios');

class ChapaService {
  constructor() {
    this.baseURL = 'https://api.chapa.co/v1';
    this.secretKey = process.env.CHAPA_SECRET_KEY;
  }

  getHeaders() {
    return {
      'Authorization': `Bearer ${this.secretKey}`,
      'Content-Type': 'application/json'
    };
  }

  /**
   * Initialize a payment
   * @param {Object} paymentData - Payment details
   * @returns {Promise<Object>} Payment initialization response
   */
  async initializePayment(paymentData) {
    try {
      const {
        amount,
        currency = 'ETB',
        email,
        firstName,
        lastName,
        phoneNumber,
        txRef,
        callbackUrl,
        returnUrl,
        customization = {}
      } = paymentData;

      const payload = {
        amount: amount.toString(),
        currency,
        email,
        first_name: firstName,
        last_name: lastName,
        phone_number: phoneNumber,
        tx_ref: txRef,
        callback_url: callbackUrl,
        return_url: returnUrl,
        customization: {
          title: customization.title || 'Addiscart Payment',
          description: customization.description || 'Payment for grocery order',
          logo: customization.logo
        }
      };

      const response = await axios.post(
        `${this.baseURL}/transaction/initialize`,
        payload,
        { headers: this.getHeaders() }
      );

      return {
        success: true,
        data: response.data.data,
        checkoutUrl: response.data.data.checkout_url
      };
    } catch (error) {
      console.error('Chapa payment initialization error:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || error.message || 'Failed to initialize Chapa payment');
    }
  }

  /**
   * Verify a payment
   * @param {string} txRef - Transaction reference
   * @returns {Promise<Object>} Payment verification response
   */
  async verifyPayment(txRef) {
    try {
      const response = await axios.get(
        `${this.baseURL}/transaction/verify/${txRef}`,
        { headers: this.getHeaders() }
      );

      const data = response.data.data;
      
      return {
        success: data.status === 'success',
        data: data,
        status: data.status,
        amount: data.amount,
        currency: data.currency,
        email: data.email,
        txRef: data.tx_ref
      };
    } catch (error) {
      console.error('Chapa payment verification error:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || error.message || 'Failed to verify Chapa payment');
    }
  }

  /**
   * Get list of supported banks for bank transfer
   * @returns {Promise<Array>} List of banks
   */
  async getBanks() {
    try {
      const response = await axios.get(
        `${this.baseURL}/banks`,
        { headers: this.getHeaders() }
      );
      return response.data.data;
    } catch (error) {
      console.error('Error fetching banks:', error.response?.data || error.message);
      throw new Error('Failed to fetch banks');
    }
  }

  /**
   * Create a subaccount for split payments
   * @param {Object} subaccountData - Subaccount details
   * @returns {Promise<Object>} Subaccount creation response
   */
  async createSubaccount(subaccountData) {
    try {
      const {
        businessName,
        accountName,
        accountNumber,
        bankCode,
        splitType = 'percentage',
        splitValue
      } = subaccountData;

      const payload = {
        business_name: businessName,
        account_name: accountName,
        account_number: accountNumber,
        bank_code: bankCode,
        split_type: splitType,
        split_value: splitValue
      };

      const response = await axios.post(
        `${this.baseURL}/subaccount`,
        payload,
        { headers: this.getHeaders() }
      );

      return {
        success: true,
        data: response.data.data
      };
    } catch (error) {
      console.error('Chapa subaccount creation error:', error.response?.data || error.message);
      throw new Error('Failed to create subaccount');
    }
  }

  /**
   * Generate unique transaction reference
   * @returns {string} Unique transaction reference
   */
  generateTxRef() {
    return `ADDISCART-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}

module.exports = new ChapaService();
