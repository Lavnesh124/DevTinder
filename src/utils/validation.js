const validator = require('validator');

const validateSignupData = (req) => {
    const { firstname,lastname, email, password } = req.body;
    if (!firstname || !lastname ) {
        return { valid: false, message: 'Firstname, lastname are required' };
    }
    else if(validator.isEmail(email)===false){
        return { valid: false, message: 'Invalid email format' };
    }
     else if(validator.isStrongPassword(password)===false){
        return { valid: false, message: 'Password must be at least 8 characters long and include uppercase letters, lowercase letters, numbers, and symbols' };
    }       
    // Additional validation can be added here (e.g., email format, password strength)
    return { valid: true };
};

module.exports = {
    validateSignupData,
};