/**
 * Him Village Prahari - Sign Up Page JavaScript
 * Handles form validation, password strength, and user registration
 */

// Password Toggle Functionality
function togglePassword(fieldId) {
    const passwordField = document.getElementById(fieldId);
    const toggleIcon = passwordField.parentElement.querySelector('.show-password i');
    
    if (passwordField.type === 'password') {
        passwordField.type = 'text';
        toggleIcon.classList.remove('fa-eye');
        toggleIcon.classList.add('fa-eye-slash');
    } else {
        passwordField.type = 'password';
        toggleIcon.classList.remove('fa-eye-slash');
        toggleIcon.classList.add('fa-eye');
    }
}

// Validation Functions
function validateName(name) {
    return name.trim().length >= 2 && /^[a-zA-Z\s]+$/.test(name);
}

function validateMobile(mobile) {
    // Remove any spaces or dashes
    const cleanMobile = mobile.replace(/[\s-]/g, '');
    return /^[0-9]{10}$/.test(cleanMobile);
}

function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function validatePassword(password) {
    return password.length >= 6;
}

function checkPasswordStrength(password) {
    let strength = 0;
    
    if (password.length >= 6) strength++;
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^a-zA-Z0-9]/.test(password)) strength++;
    
    if (strength <= 2) return 'weak';
    if (strength <= 3) return 'medium';
    return 'strong';
}

// Real-time Password Strength Indicator
function updatePasswordStrength() {
    const password = document.getElementById('password').value;
    const strengthBar = document.querySelector('.password-strength-bar');
    const strengthText = document.querySelector('.password-strength-text');
    
    if (!password) {
        if (strengthBar) {
            strengthBar.className = 'password-strength-bar';
            strengthBar.style.width = '0';
        }
        if (strengthText) strengthText.textContent = '';
        return;
    }
    
    const strength = checkPasswordStrength(password);
    
    if (strengthBar) {
        strengthBar.className = 'password-strength-bar strength-' + strength;
    }
    
    if (strengthText) {
        const strengthLabels = {
            'weak': 'Weak password',
            'medium': 'Medium strength',
            'strong': 'Strong password'
        };
        strengthText.textContent = strengthLabels[strength];
    }
}

// Add password strength meter to DOM
function addPasswordStrengthMeter() {
    const passwordGroup = document.getElementById('password').closest('.form-group');
    
    if (!passwordGroup.querySelector('.password-strength')) {
        const strengthMeter = document.createElement('div');
        strengthMeter.className = 'password-strength';
        strengthMeter.innerHTML = '<div class="password-strength-bar"></div>';
        
        const strengthText = document.createElement('small');
        strengthText.className = 'password-strength-text';
        
        const passwordHint = passwordGroup.querySelector('.password-hint');
        passwordHint.parentNode.insertBefore(strengthMeter, passwordHint.nextSibling);
        passwordHint.parentNode.insertBefore(strengthText, strengthMeter.nextSibling);
    }
}

// Show Field Error
function showFieldError(input, message) {
    hideFieldError(input);
    input.classList.add('input-error');
    input.classList.remove('input-success');
    
    const errorSpan = document.createElement('span');
    errorSpan.className = 'field-error-message';
    errorSpan.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${message}`;
    input.parentElement.appendChild(errorSpan);
}

// Show Field Success
function showFieldSuccess(input) {
    hideFieldError(input);
    input.classList.add('input-success');
    input.classList.remove('input-error');
}

// Hide Field Error
function hideFieldError(input) {
    input.classList.remove('input-error', 'input-success');
    const errorSpan = input.parentElement.querySelector('.field-error-message');
    if (errorSpan) {
        errorSpan.remove();
    }
}

// Show General Error Message
function showError(message) {
    const existingError = document.querySelector('.signup-error-message');
    if (existingError) {
        existingError.remove();
    }
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'signup-error-message';
    errorDiv.innerHTML = `
        <i class="fas fa-exclamation-triangle"></i>
        <span>${message}</span>
    `;
    
    const signupContainer = document.querySelector('.signup-container');
    const form = document.getElementById('signupForm');
    signupContainer.insertBefore(errorDiv, form);
    
    setTimeout(() => {
        errorDiv.style.animation = 'slideUp 0.3s ease';
        setTimeout(() => errorDiv.remove(), 300);
    }, 5000);
}

// Show Success Message
function showSuccess(message) {
    const existingSuccess = document.querySelector('.signup-success-message');
    if (existingSuccess) {
        existingSuccess.remove();
    }
    
    const successDiv = document.createElement('div');
    successDiv.className = 'signup-success-message';
    successDiv.innerHTML = `
        <i class="fas fa-check-circle"></i>
        <span>${message}</span>
    `;
    
    const signupContainer = document.querySelector('.signup-container');
    const form = document.getElementById('signupForm');
    signupContainer.insertBefore(successDiv, form);
}

// Form Validation on Submit
function validateForm() {
    let isValid = true;
    
    // Validate Name
    const nameInput = document.getElementById('fullname');
    const name = nameInput.value.trim();
    if (!validateName(name)) {
        showFieldError(nameInput, 'Please enter a valid name (letters only, at least 2 characters)');
        isValid = false;
    } else {
        showFieldSuccess(nameInput);
    }
    
    // Validate Mobile
    const mobileInput = document.getElementById('mobile');
    const mobile = mobileInput.value;
    if (!validateMobile(mobile)) {
        showFieldError(mobileInput, 'Please enter a valid 10-digit mobile number');
        isValid = false;
    } else {
        showFieldSuccess(mobileInput);
    }
    
    // Validate Email
    const emailInput = document.getElementById('email');
    const email = emailInput.value.trim();
    if (!validateEmail(email)) {
        showFieldError(emailInput, 'Please enter a valid email address');
        isValid = false;
    } else {
        showFieldSuccess(emailInput);
    }
    
    // Validate Password
    const passwordInput = document.getElementById('password');
    const password = passwordInput.value;
    if (!validatePassword(password)) {
        showFieldError(passwordInput, 'Password must be at least 6 characters long');
        isValid = false;
    } else {
        showFieldSuccess(passwordInput);
    }
    
    // Validate Password Confirmation
    const confirmPasswordInput = document.getElementById('confirmPassword');
    const confirmPassword = confirmPasswordInput.value;
    if (password !== confirmPassword) {
        showFieldError(confirmPasswordInput, 'Passwords do not match');
        isValid = false;
    } else if (confirmPassword) {
        showFieldSuccess(confirmPasswordInput);
    }
    
    return isValid;
}

// Initialize Form
document.addEventListener('DOMContentLoaded', function() {
    const signupForm = document.getElementById('signupForm');
    
    // Add password strength meter
    addPasswordStrengthMeter();
    
    // Form Submit Handler
    if (signupForm) {
        signupForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Validate form
            if (!validateForm()) {
                showError('Please correct the errors above and try again.');
                return false;
            }
            
            // If validation passes, show loading state
            const submitBtn = signupForm.querySelector('.submit-btn');
            submitBtn.classList.add('loading');
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creating account...';
            signupForm.submit();
        });
    }
    
    // Real-time Validation
    const fullnameInput = document.getElementById('fullname');
    if (fullnameInput) {
        fullnameInput.addEventListener('blur', function() {
            if (this.value.trim()) {
                if (!validateName(this.value.trim())) {
                    showFieldError(this, 'Please enter a valid name');
                } else {
                    showFieldSuccess(this);
                }
            }
        });
        
        fullnameInput.addEventListener('focus', function() {
            hideFieldError(this);
        });
    }
    
    const mobileInput = document.getElementById('mobile');
    if (mobileInput) {
        mobileInput.addEventListener('input', function() {
            // Only allow numbers
            this.value = this.value.replace(/[^0-9]/g, '');
        });
        
        mobileInput.addEventListener('blur', function() {
            if (this.value) {
                if (!validateMobile(this.value)) {
                    showFieldError(this, 'Enter a valid 10-digit number');
                } else {
                    showFieldSuccess(this);
                }
            }
        });
        
        mobileInput.addEventListener('focus', function() {
            hideFieldError(this);
        });
    }
    
    const emailInput = document.getElementById('email');
    if (emailInput) {
        emailInput.addEventListener('blur', function() {
            if (this.value.trim()) {
                if (!validateEmail(this.value.trim())) {
                    showFieldError(this, 'Please enter a valid email');
                } else {
                    showFieldSuccess(this);
                }
            }
        });
        
        emailInput.addEventListener('focus', function() {
            hideFieldError(this);
        });
    }
    
    const passwordInput = document.getElementById('password');
    if (passwordInput) {
        passwordInput.addEventListener('input', function() {
            updatePasswordStrength();
        });
        
        passwordInput.addEventListener('blur', function() {
            if (this.value) {
                if (!validatePassword(this.value)) {
                    showFieldError(this, 'Password must be at least 6 characters');
                } else {
                    showFieldSuccess(this);
                }
            }
        });
        
        passwordInput.addEventListener('focus', function() {
            hideFieldError(this);
        });
    }
    
    const confirmPasswordInput = document.getElementById('confirmPassword');
    if (confirmPasswordInput) {
        confirmPasswordInput.addEventListener('blur', function() {
            const password = document.getElementById('password').value;
            if (this.value) {
                if (this.value !== password) {
                    showFieldError(this, 'Passwords do not match');
                } else {
                    showFieldSuccess(this);
                }
            }
        });
        
        confirmPasswordInput.addEventListener('focus', function() {
            hideFieldError(this);
        });
    }
});

// Smooth scroll to top on page load
window.addEventListener('load', function() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});