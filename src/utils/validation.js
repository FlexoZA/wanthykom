// Password validation rules
export const passwordRules = {
    minLength: 8,
    requiresNumber: true,
    requiresSpecial: true,
    requiresUppercase: true,
  }
  
  // Email validation pattern
  export const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  
  // Validation functions
  export const validatePassword = (password) => {
    if (!password) return ''
    const errors = []
  
    if (password.length < passwordRules.minLength) {
      errors.push(`Password must be at least ${passwordRules.minLength} characters`)
    }
    if (passwordRules.requiresNumber && !/\d/.test(password)) {
      errors.push('Password must contain at least one number')
    }
    if (passwordRules.requiresSpecial && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push('Password must contain at least one special character')
    }
    if (passwordRules.requiresUppercase && !/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter')
    }
  
    return errors.length ? errors.join('. ') : ''
  }
  
  export const validateEmail = (email) => {
    if (!email) return ''
    return emailPattern.test(email) ? '' : 'Please enter a valid email address'
  }
  