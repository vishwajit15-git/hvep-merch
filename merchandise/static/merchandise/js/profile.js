/**
 * Him Village Prahari - Profile Page JavaScript
 * Handles profile interactions, form validation, and logout functionality
 */

document.addEventListener('DOMContentLoaded', () => {
    console.log('Profile page loaded');
    initializeProfilePage();
});

// Initialize all profile page functionality
function initializeProfilePage() {
    setupMenuNavigation();
    setupFormValidation();
    setupAutoSaveIndicator();
    animateStatsOnScroll();
}

// Menu Navigation
function setupMenuNavigation() {
    const menuItems = document.querySelectorAll('.menu li:not(.logout)');
    
    menuItems.forEach(item => {
        item.addEventListener('click', function() {
            // Remove active class from all items
            menuItems.forEach(i => i.classList.remove('active'));
            // Add active class to clicked item
            this.classList.add('active');
            
            // You can add navigation logic here
            const menuText = this.textContent.trim();
            console.log(`Navigating to: ${menuText}`);
            
            // Example: Show different sections based on menu item
            // This can be expanded based on your needs
        });
    });
}

// Logout Modal Functions
function confirmLogout() {
    const modal = document.getElementById('logoutModal');
    modal.classList.add('active');
    
    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden';
}

function closeLogoutModal() {
    const modal = document.getElementById('logoutModal');
    modal.classList.remove('active');
    
    // Restore body scroll
    document.body.style.overflow = 'auto';
}

// Close modal when clicking outside
document.addEventListener('click', function(event) {
    const modal = document.getElementById('logoutModal');
    if (event.target === modal) {
        closeLogoutModal();
    }
});

// Close modal with Escape key
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closeLogoutModal();
    }
});

// Form Validation
function setupFormValidation() {
    const form = document.querySelector('.profile-form');
    if (!form) return;
    
    const inputs = form.querySelectorAll('input:not([disabled]), select');
    
    inputs.forEach(input => {
        // Real-time validation on blur
        input.addEventListener('blur', function() {
            validateField(this);
        });
        
        // Remove error styling on focus
        input.addEventListener('focus', function() {
            this.classList.remove('error');
            removeFieldError(this);
        });
    });
    
    // Form submit validation
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        let isValid = true;
        inputs.forEach(input => {
            if (!validateField(input)) {
                isValid = false;
            }
        });
        
        if (isValid) {
            showSaveLoading();
            // Submit the form
            this.submit();
        } else {
            showNotification('Please correct the errors before saving', 'error');
        }
    });
}

// Validate individual field
function validateField(field) {
    const value = field.value.trim();
    const fieldName = field.name;
    
    // Skip disabled fields
    if (field.disabled) return true;
    
    // Check required fields
    if (field.required && !value) {
        showFieldError(field, 'This field is required');
        return false;
    }
    
    // Specific validation based on field type
    switch(fieldName) {
        case 'full_name':
            if (value && value.length < 2) {
                showFieldError(field, 'Name must be at least 2 characters');
                return false;
            }
            if (value && !/^[a-zA-Z\s]+$/.test(value)) {
                showFieldError(field, 'Name can only contain letters');
                return false;
            }
            break;
            
        case 'mobile':
            if (value && !/^[\d\s\+\-\(\)]+$/.test(value)) {
                showFieldError(field, 'Please enter a valid mobile number');
                return false;
            }
            break;
            
        case 'postal_code':
            if (value && !/^\d{6}$/.test(value)) {
                showFieldError(field, 'Please enter a valid 6-digit PIN code');
                return false;
            }
            break;
    }
    
    // If validation passes
    field.classList.remove('error');
    removeFieldError(field);
    return true;
}

// Show field error
function showFieldError(field, message) {
    field.classList.add('error');
    
    // Remove existing error message
    removeFieldError(field);
    
    // Create and append error message
    const errorDiv = document.createElement('div');
    errorDiv.className = 'field-error';
    errorDiv.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${message}`;
    
    field.parentElement.appendChild(errorDiv);
}

// Remove field error
function removeFieldError(field) {
    const existingError = field.parentElement.querySelector('.field-error');
    if (existingError) {
        existingError.remove();
    }
}

// Show save loading state
function showSaveLoading() {
    const saveBtn = document.querySelector('.save-btn');
    if (!saveBtn) return;
    
    saveBtn.disabled = true;
    saveBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...';
}

// Show notification
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
        <span>${message}</span>
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => notification.classList.add('show'), 100);
    
    // Remove after 4 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 4000);
}

// Auto-save indicator
function setupAutoSaveIndicator() {
    const form = document.querySelector('.profile-form');
    if (!form) return;
    
    const inputs = form.querySelectorAll('input:not([disabled]), select');
    let saveTimeout;
    
    inputs.forEach(input => {
        input.addEventListener('input', function() {
            clearTimeout(saveTimeout);
            
            // Show "unsaved changes" indicator
            showUnsavedIndicator();
            
            // Optional: Auto-save after 2 seconds of inactivity
            // saveTimeout = setTimeout(() => {
            //     console.log('Auto-saving...');
            //     // Implement auto-save logic here
            // }, 2000);
        });
    });
}

function showUnsavedIndicator() {
    const saveBtn = document.querySelector('.save-btn');
    if (!saveBtn || saveBtn.classList.contains('unsaved')) return;
    
    saveBtn.classList.add('unsaved');
    const originalText = saveBtn.innerHTML;
    saveBtn.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Unsaved Changes';
    
    // Reset after form submit or after timeout
    setTimeout(() => {
        if (saveBtn.classList.contains('unsaved')) {
            saveBtn.classList.remove('unsaved');
            saveBtn.innerHTML = originalText;
        }
    }, 5000);
}

// Animate stats on scroll
function animateStatsOnScroll() {
    const statCards = document.querySelectorAll('.stat-card');
    if (!statCards.length) return;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.animation = 'slideIn 0.5s ease forwards';
                }, index * 100);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    
    statCards.forEach(card => {
        card.style.opacity = '0';
        observer.observe(card);
    });
}

// Mobile number formatting
function formatMobileNumber(input) {
    let value = input.value.replace(/\D/g, '');
    
    // Format as: +91 XXXXX XXXXX
    if (value.length > 10) {
        value = value.slice(0, 10);
    }
    
    if (value.length > 5) {
        value = value.slice(0, 5) + ' ' + value.slice(5);
    }
    
    input.value = value;
}

// Add mobile formatting to mobile input
const mobileInput = document.querySelector('input[name="mobile"]');
if (mobileInput) {
    mobileInput.addEventListener('input', function() {
        // Allow only numbers, spaces, +, -, ()
        this.value = this.value.replace(/[^\d\s\+\-\(\)]/g, '');
    });
}

// PIN code formatting
const pinInput = document.querySelector('input[name="postal_code"]');
if (pinInput) {
    pinInput.addEventListener('input', function() {
        // Allow only numbers and limit to 6 digits
        this.value = this.value.replace(/\D/g, '').slice(0, 6);
    });
}

// Smooth scroll to top when page loads
window.addEventListener('load', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// Handle browser back button
window.addEventListener('popstate', () => {
    const modal = document.getElementById('logoutModal');
    if (modal && modal.classList.contains('active')) {
        closeLogoutModal();
    }
});

// Export functions for use in HTML
window.confirmLogout = confirmLogout;
window.closeLogoutModal = closeLogoutModal;