const axios = require('axios');

/**
 * Chapa Payment Service
 * Official API Documentation: https://developer.chapa.co
 */
class ChapaService {
  constructor() {
    this.baseURL = process.env.CHAPA_BASE_URL || 'https://api.chapa.co/v1';
    this.secretKey = process.env.CHAPA_SECRET_KEY;
    
    if (!this.secretKey) {
      console.warn('CHAPA_SECRET_KEY not set in environment variables');
    }
  }

  /**
   * Get authorization headers for Chapa API
   * @returns {Object} Headers object
   */
  getHeaders() {
    return {
      'Authorization': `Bearer ${this.secretKey}`,
      'Content-Type': 'application/json'
    };
  }

  /**
   * Initialize a payment transaction
   * Official Docs: https://developer.chapa.co/docs/accept-payments
   * 
   * @param {Object} paymentData - Payment information
   * @param {number} paymentData.amount - Amount to charge
   * @param {string} paymentData.currency - Currency code (ETB, USD, etc.)
   * @param {string} paymentData.email - Customer email
   * @param {string} paymentData.first_name - Customer first name
   * @param {string} paymentData.last_name - Customer last name
   * @param {string} paymentData.tx_ref - Unique transaction reference
   * @param {string} paymentData.callback_url - URL to redirect after payment
   * @param {string} paymentData.return_url - URL for customer to return
   * @param {Object} paymentData.customization - Optional customization
   * @returns {Promise<Object>} Payment initialization response
   */
  async initializePayment(paymentData) {
    try {
      const response = await axios.post(
        `${this.baseURL}/transaction/initialize`,
        paymentData,
        { headers: this.getHeaders() }
      );

      return {
        success: true,
        message: response.data.message,
        data: response.data.data,
        checkoutUrl: response.data.data.checkout_url
      };
    } catch (error) {
      console.error('Chapa payment initialization error:', error.response?.data || error.message);
      throw new Error(
        error.response?.data?.message || 
        'Failed to initialize payment with Chapa'
      );
    }
  }

  /**
   * Verify a payment transaction
   * Official Docs: https://developer.chapa.co/docs/verify-payments
   * 
   * @param {string} tx_ref - Transaction reference to verify
   * @returns {Promise<Object>} Verification response
   */
  async verifyPayment(tx_ref) {
    try {
      const response = await axios.get(
        `${this.baseURL}/transaction/verify/${tx_ref}`,
        { headers: this.getHeaders() }
      );

      const data = response.data.data;
      
      return {
        success: data.status === 'success',
        message: response.data.message,
        status: data.status,
        amount: data.amount,
        currency: data.currency,
        email: data.email,
        first_name: data.first_name,
        last_name: data.last_name,
        tx_ref: data.tx_ref,
        charge: data.charge,
        created_at: data.created_at,
        data: data
      };
    } catch (error) {
      console.error('Chapa payment verification error:', error.response?.data || error.message);
      throw new Error(
        error.response?.data?.message || 
        'Failed to verify payment with Chapa'
      );
    }
  }

  /**
   * Get list of supported banks
   * Official Docs: https://developer.chapa.co/docs/banks
   * 
   * @returns {Promise<Array>} List of banks
   */
  async getBanks() {
    try {
      const response = await axios.get(
        `${this.baseURL}/banks`,
        { headers: this.getHeaders() }
      );

      return {
        success: true,
        banks: response.data.data
      };
    } catch (error) {
      console.error('Error fetching banks:', error.response?.data || error.message);
      throw new Error('Failed to fetch supported banks');
    }
  }

  /**
   * Generate unique transaction reference
   * Format: ADDISCART-{timestamp}-{random}
   * 
   * @returns {string} Unique transaction reference
   */
  generateTxRef() {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 11);
    return `ADDISCART-${timestamp}-${random}`;
  }
}

// Export singleton instance
module.exports = new ChapaService();
