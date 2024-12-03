import { parsePhoneNumber } from 'libphonenumber-js';

/**
 * Validates a phone number using libphonenumber-js
 * @param {string} phoneNumber - The phone number to validate
 * @param {string} countryCode - ISO country code (e.g., 'IN', 'US')
 * @returns {Object} Validation result
 */
export const validateMobileNumber = (phoneNumber, countryCode = 'IN') => {
  try {
    if (!phoneNumber) {
      return {
        isValid: false,
        error: 'Phone number is required'
      };
    }

    // If number doesn't start with +, add country code
    const fullNumber = phoneNumber.startsWith('+') 
      ? phoneNumber 
      : `+${phoneNumber}`;

    // Parse and validate the phone number
    const parsedNumber = parsePhoneNumber(fullNumber, countryCode);

    if (!parsedNumber || !parsedNumber.isValid()) {
      return {
        isValid: false,
        error: `Please enter a valid phone number for ${countryCode}`
      };
    }

    // Get the formatted number for backend
    const formattedNumber = parsedNumber.format('E.164'); // Returns number in +919876543210 format

    return {
      isValid: true,
      error: null,
      formattedNumber
    };
  // eslint-disable-next-line no-unused-vars
  } catch (error) {
    return {
      isValid: false,
      error: 'Invalid phone number format'
    };
  }
};

/**
 * Form validation function
 * @param {string} mobile - Phone number to validate
 * @param {string} countryCode - Country code
 * @returns {Object} Validation errors
 */
export const validateForm = (mobile, countryCode) => {
  const errors = {};
  
  const validation = validateMobileNumber(mobile, countryCode);
  
  if (!validation.isValid) {
    errors.mobileNumber = validation.error;
  }

  return {
    errors,
    formattedNumber: validation.formattedNumber
  };
};