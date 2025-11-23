const { Chapa } = require('chapa');

class ChapaService {
  constructor() {
    this.chapa = new Chapa(process.env.CHAPA_SECRET_KEY);
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

      const response = await this.chapa.initialize({
        amount,
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
      });

      return {
        success: true,
        data: response.data,
        checkoutUrl: response.data.checkout_url
      };
    } catch (error) {
      console.error('Chapa payment initialization error:', error);
      throw new Error(error.message || 'Failed to initialize Chapa payment');
    }
  }

  /**
   * Verify a payment
   * @param {string} txRef - Transaction reference
   * @returns {Promise<Object>} Payment verification response
   */
  async verifyPayment(txRef) {
    try {
      const response = await this.chapa.verify(txRef);
      
      return {
        success: response.status === 'success',
        data: response.data,
        status: response.data.status,
        amount: response.data.amount,
        currency: response.data.currency,
        email: response.data.email,
        txRef: response.data.tx_ref
      };
    } catch (error) {
      console.error('Chapa payment verification error:', error);
      throw new Error(error.message || 'Failed to verify Chapa payment');
    }
  }

  /**
   * Get list of supported banks for bank transfer
   * @returns {Promise<Array>} List of banks
   */
  async getBanks() {
    try {
      const response = await this.chapa.getBanks();
      return response.data;
    } catch (error) {
      console.error('Error fetching banks:', error);
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

      const response = await this.chapa.createSubaccount({
        business_name: businessName,
        account_name: accountName,
        account_number: accountNumber,
        bank_code: bankCode,
        split_type: splitType,
        split_value: splitValue
      });

      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Chapa subaccount creation error:', error);
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
