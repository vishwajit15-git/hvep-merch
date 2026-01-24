/**
 * Him Village Prahari - Sign In Page JavaScript
 * Handles password visibility toggle and form validation
 */

// Password Toggle Functionality
function togglePassword() {
    const passwordField = document.getElementById('password');
    const toggleIcon = document.querySelector('.show-password i');
    
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

// Form Validation
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[0-9]{10}$/;
    return emailRegex.test(email) || phoneRegex.test(email);
}

function validatePassword(password) {
    return password.length >= 6;
}

// Form Submit Handler
document.addEventListener('DOMContentLoaded', function() {
    const signinForm = document.getElementById('signinForm');
    
    if (signinForm) {
        signinForm.addEventListener('submit', function(e) {
            const email = document.getElementById('email').value.trim();
            const password = document.getElementById('password').value;
            
            // Client-side validation
            if (!validateEmail(email)) {
                e.preventDefault();
                showError('Please enter a valid email address or 10-digit mobile number.');
                return false;
            }
            
            if (!validatePassword(password)) {
                e.preventDefault();
                showError('Password must be at least 6 characters long.');
                return false;
            }
            
            // If validation passes, form will submit normally
            // Add loading state to button
            const submitBtn = signinForm.querySelector('.submit-btn');
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Signing In...';
            submitBtn.disabled = true;
        });
    }
    
    // Add input validation on blur
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    
    if (emailInput) {
        emailInput.addEventListener('blur', function() {
            if (this.value.trim() && !validateEmail(this.value.trim())) {
                this.style.borderColor = '#e74c3c';
                showInputError(this, 'Please enter a valid email or phone number');
            } else {
                this.style.borderColor = '#c5e8d4';
                hideInputError(this);
            }
        });
        
        emailInput.addEventListener('focus', function() {
            this.style.borderColor = '#4f8a5b';
            hideInputError(this);
        });
    }
    
    if (passwordInput) {
        passwordInput.addEventListener('blur', function() {
            if (this.value && !validatePassword(this.value)) {
                this.style.borderColor = '#e74c3c';
                showInputError(this, 'Password must be at least 6 characters');
            } else {
                this.style.borderColor = '#c5e8d4';
                hideInputError(this);
            }
        });
        
        passwordInput.addEventListener('focus', function() {
            this.style.borderColor = '#4f8a5b';
            hideInputError(this);
        });
    }
});

// Error Display Functions
function showError(message) {
    // Remove any existing error messages
    const existingError = document.querySelector('.signin-error-message');
    if (existingError) {
        existingError.remove();
    }
    
    // Create and insert error message
    const errorDiv = document.createElement('div');
    errorDiv.className = 'signin-error-message';
    errorDiv.innerHTML = `
        <i class="fas fa-exclamation-circle"></i>
        <span>${message}</span>
    `;
    
    const signinContainer = document.querySelector('.signin-container');
    const form = document.getElementById('signinForm');
    signinContainer.insertBefore(errorDiv, form);
    
    // Add error styles if not already present
    if (!document.getElementById('error-styles')) {
        const style = document.createElement('style');
        style.id = 'error-styles';
        style.textContent = `
            .signin-error-message {
                background: #fee;
                border: 1px solid #e74c3c;
                color: #c0392b;
                padding: 12px 15px;
                border-radius: 6px;
                margin-bottom: 20px;
                font-size: 14px;
                display: flex;
                align-items: center;
                animation: slideDown 0.3s ease;
            }
            
            .signin-error-message i {
                margin-right: 10px;
                font-size: 16px;
            }
            
            @keyframes slideDown {
                from {
                    opacity: 0;
                    transform: translateY(-10px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
            
            .input-error-message {
                color: #e74c3c;
                font-size: 12px;
                margin-top: 5px;
                display: block;
            }
        `;
        document.head.appendChild(style);
    }
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        errorDiv.style.animation = 'slideUp 0.3s ease';
        setTimeout(() => errorDiv.remove(), 300);
    }, 5000);
}

function showInputError(input, message) {
    hideInputError(input);
    const errorSpan = document.createElement('span');
    errorSpan.className = 'input-error-message';
    errorSpan.textContent = message;
    input.parentElement.appendChild(errorSpan);
}

function hideInputError(input) {
    const errorSpan = input.parentElement.querySelector('.input-error-message');
    if (errorSpan) {
        errorSpan.remove();
    }
}

// Handle "Keep me signed in" checkbox
document.addEventListener('DOMContentLoaded', function() {
    const keepSignedInCheckbox = document.getElementById('keepSignedIn');
    
    if (keepSignedInCheckbox) {
        // Load saved preference
        const savedPreference = localStorage.getItem('keepSignedIn');
        if (savedPreference === 'true') {
            keepSignedInCheckbox.checked = true;
        }
        
        // Save preference when changed
        keepSignedInCheckbox.addEventListener('change', function() {
            localStorage.setItem('keepSignedIn', this.checked);
        });
    }
});

// Smooth scroll to top on page load
window.addEventListener('load', function() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// Add animation styles
const animationStyles = document.createElement('style');
animationStyles.textContent = `
    @keyframes slideUp {
        from {
            opacity: 1;
            transform: translateY(0);
        }
        to {
            opacity: 0;
            transform: translateY(-10px);
        }
    }
`;
document.head.appendChild(animationStyles);