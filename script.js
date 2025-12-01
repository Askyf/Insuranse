/**
 * Alpha Insurance Website
 * Main JavaScript File
 * Version: 1.0.0
 */

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('Alpha Insurance Website Loaded');
    
    // Initialize all modules
    initNavigation();
    initProducts();
    initFAQ();
    initContactForm();
    initScrollEffects();
    initAnimations();
});

// ============================================
// NAVIGATION MODULE
// ============================================
function initNavigation() {
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    const navbar = document.querySelector('.navbar');
    
    if (!navToggle || !navMenu) return;
    
    // Toggle mobile menu
    navToggle.addEventListener('click', function() {
        navMenu.classList.toggle('active');
        const icon = navToggle.querySelector('i');
        icon.classList.toggle('fa-bars');
        icon.classList.toggle('fa-times');
        
        // Toggle body scroll when menu is open
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    });
    
    // Close menu when clicking on a link
    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
            const icon = navToggle.querySelector('i');
            icon.classList.add('fa-bars');
            icon.classList.remove('fa-times');
        });
    });
    
    // Add scroll effect to navbar
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
    
    // Add active class to current section in navigation
    window.addEventListener('scroll', highlightCurrentSection);
}

// ============================================
// PRODUCTS MODULE
// ============================================
function initProducts() {
    const productsContainer = document.getElementById('productsContainer');
    if (!productsContainer) return;
    
    // Display loading state
    productsContainer.innerHTML = `
        <div class="loading-products">
            <i class="fas fa-spinner fa-spin"></i>
            <p>Φόρτωση προϊόντων...</p>
        </div>
    `;
    
    // Fetch products from JSON file
    fetchProducts()
        .then(products => {
            displayProducts(products);
            setupFiltering(products);
            setupCategoryCards();
        })
        .catch(error => {
            console.error('Error loading products:', error);
            showProductsError();
        });
}

async function fetchProducts() {
    try {
        const response = await fetch('products.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data.products;
    } catch (error) {
        console.error('Failed to fetch products:', error);
        throw error;
    }
}

function displayProducts(products, filter = 'all') {
    const productsContainer = document.getElementById('productsContainer');
    
    // Filter products if needed
    const filteredProducts = filter === 'all' 
        ? products 
        : products.filter(product => product.category === filter);
    
    // Check if there are products
    if (filteredProducts.length === 0) {
        productsContainer.innerHTML = `
            <div class="no-products">
                <i class="fas fa-search fa-3x"></i>
                <h3>Δεν βρέθηκαν προϊόντα</h3>
                <p>Δοκιμάστε διαφορετική κατηγορία.</p>
            </div>
        `;
        return;
    }
    
    // Create product cards HTML
    const productsHTML = filteredProducts.map(product => `
        <div class="product-card" data-category="${product.category}">
            <div class="product-header">
                <i class="${product.icon}"></i>
                <h3>${product.name}</h3>
            </div>
            <div class="product-body">
                <div class="price">${product.price}</div>
                <p class="description">${product.description}</p>
                <ul class="features">
                    ${product.features.map(feature => `
                        <li><i class="fas fa-check"></i> ${feature}</li>
                    `).join('')}
                </ul>
                <button class="btn-primary request-quote" 
                        data-product="${product.name}"
                        data-category="${product.category}">
                    <i class="fas fa-file-alt"></i> Ζήτησε Προσφορά
                </button>
            </div>
        </div>
    `).join('');
    
    productsContainer.innerHTML = productsHTML;
    
    // Add event listeners to quote buttons
    setupQuoteButtons();
}

function setupFiltering(products) {
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Get filter value
            const filter = this.dataset.filter;
            
            // Display filtered products
            displayProducts(products, filter);
            
            // Animate category cards
            animateCategoryCards(filter);
            
            // Update URL hash
            history.pushState(null, '', `#products-${filter}`);
        });
    });
}

function setupCategoryCards() {
    const categoryCards = document.querySelectorAll('.category-card');
    
    categoryCards.forEach(card => {
        card.addEventListener('click', function() {
            const category = this.dataset.category;
            
            // Find and click the corresponding filter button
            const filterButton = document.querySelector(`.filter-btn[data-filter="${category}"]`);
            if (filterButton) {
                filterButton.click();
                
                // Scroll to products section smoothly
                const productsSection = document.getElementById('products');
                if (productsSection) {
                    productsSection.scrollIntoView({ 
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });
}

function animateCategoryCards(filter) {
    const categoryCards = document.querySelectorAll('.category-card');
    
    categoryCards.forEach(card => {
        const cardCategory = card.dataset.category;
        
        if (filter === 'all' || cardCategory === filter) {
            card.style.opacity = '1';
            card.style.transform = 'scale(1)';
        } else {
            card.style.opacity = '0.5';
            card.style.transform = 'scale(0.95)';
        }
    });
}

function setupQuoteButtons() {
    document.querySelectorAll('.request-quote').forEach(button => {
        button.addEventListener('click', function() {
            const productName = this.dataset.product;
            const category = this.dataset.category;
            
            // Pre-fill contact form
            prefillContactForm(productName, category);
            
            // Scroll to contact form
            const contactSection = document.getElementById('contact');
            if (contactSection) {
                contactSection.scrollIntoView({ 
                    behavior: 'smooth',
                    block: 'start'
                });
            }
            
            // Show notification
            showNotification(`Επιλέξατε: ${productName}`, 'info');
        });
    });
}

function showProductsError() {
    const productsContainer = document.getElementById('productsContainer');
    if (!productsContainer) return;
    
    productsContainer.innerHTML = `
        <div class="error-message">
            <i class="fas fa-exclamation-triangle fa-3x"></i>
            <h3>Σφάλμα Φόρτωσης</h3>
            <p>Δεν ήταν δυνατή η φόρτωση των προϊόντων. Παρακαλώ δοκιμάστε ξανά αργότερα.</p>
            <button class="btn-secondary" onclick="window.location.reload()">
                <i class="fas fa-redo"></i> Ανανέωση Σελίδας
            </button>
        </div>
    `;
}

// ============================================
// FAQ MODULE
// ============================================
function initFAQ() {
    const faqQuestions = document.querySelectorAll('.faq-question');
    
    faqQuestions.forEach(question => {
        question.addEventListener('click', function() {
            const faqItem = this.parentElement;
            const isActive = faqItem.classList.contains('active');
            
            // Close all FAQ items
            document.querySelectorAll('.faq-item').forEach(item => {
                item.classList.remove('active');
            });
            
            // Open clicked item if it wasn't active
            if (!isActive) {
                faqItem.classList.add('active');
            }
        });
    });
}

// ============================================
// CONTACT FORM MODULE
// ============================================
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    if (!contactForm) return;
    
    contactForm.addEventListener('submit', handleFormSubmit);
    
    // Add input validation
    setupFormValidation();
}

function handleFormSubmit(e) {
    e.preventDefault();
    
    const form = e.target;
    const formData = getFormData(form);
    
    // Validate form
    if (!validateForm(formData)) {
        return;
    }
    
    // Show loading state
    const submitButton = form.querySelector('button[type="submit"]');
    const originalText = submitButton.innerHTML;
    submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Αποστολή...';
    submitButton.disabled = true;
    
    // Simulate API call (in a real app, this would be a fetch request)
    setTimeout(() => {
        // Show success message
        showFormMessage('Το μήνυμά σας στάλθηκε επιτυχώς! Θα επικοινωνήσουμε μαζί σας σύντομα.', 'success');
        
        // Reset form
        form.reset();
        
        // Reset button
        submitButton.innerHTML = originalText;
        submitButton.disabled = false;
        
        // Send data to server (simulated)
        console.log('Form data submitted:', formData);
        
        // Show notification
        showNotification('Το μήνυμά σας στάλθηκε!', 'success');
        
    }, 2000);
}

function getFormData(form) {
    return {
        name: form.querySelector('#name').value.trim(),
        email: form.querySelector('#email').value.trim(),
        phone: form.querySelector('#phone').value.trim(),
        productInterest: form.querySelector('#productInterest').value,
        message: form.querySelector('#message').value.trim(),
        consent: form.querySelector('#consent').checked,
        timestamp: new Date().toISOString()
    };
}

function validateForm(formData) {
    const messageDiv = document.getElementById('formMessage');
    
    // Reset previous messages
    messageDiv.className = 'form-message';
    messageDiv.textContent = '';
    
    // Check required fields
    if (!formData.name || !formData.email) {
        showFormMessage('Παρακαλώ συμπληρώστε τα υποχρεωτικά πεδία (*)', 'error');
        return false;
    }
    
    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
        showFormMessage('Παρακαλώ εισάγετε ένα έγκυρο email', 'error');
        return false;
    }
    
    // Validate phone (optional but must be valid if provided)
    if (formData.phone && !/^[\d\s\-\+\(\)]{8,}$/.test(formData.phone)) {
        showFormMessage('Παρακαλώ εισάγετε ένα έγκυρο τηλέφωνο', 'error');
        return false;
    }
    
    // Check consent
    if (!formData.consent) {
        showFormMessage('Πρέπει να συναινέσετε στην επεξεργασία των δεδομένων σας', 'error');
        return false;
    }
    
    return true;
}

function setupFormValidation() {
    const emailInput = document.getElementById('email');
    const phoneInput = document.getElementById('phone');
    
    if (emailInput) {
        emailInput.addEventListener('blur', function() {
            const email = this.value.trim();
            if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                this.style.borderColor = 'var(--accent-red)';
            } else {
                this.style.borderColor = '';
            }
        });
    }
    
    if (phoneInput) {
        phoneInput.addEventListener('input', function() {
            // Format phone number as user types
            this.value = this.value.replace(/[^\d\+]/g, '');
        });
    }
}

function showFormMessage(message, type) {
    const messageDiv = document.getElementById('formMessage');
    messageDiv.textContent = message;
    messageDiv.className = `form-message ${type}`;
    messageDiv.style.display = 'block';
    
    // Auto-hide success messages
    if (type === 'success') {
        setTimeout(() => {
            messageDiv.style.display = 'none';
        }, 5000);
    }
}

function prefillContactForm(productName, category) {
    const productSelect = document.getElementById('productInterest');
    if (!productSelect) return;
    
    // Map product names to values
    const productMap = {
        'Ολοκληρωμένη Ασφάλεια Υγείας': 'health',
        'Οικογενειακή Ασφάλεια Υγείας': 'health',
        'Αστική Ευθύνη Οχήματος': 'car',
        'Πλήρης Κάλυψη Αυτοκινήτου': 'car',
        'Ασφάλεια Κατοικίας': 'home',
        'Ασφάλεια Ζωής': 'life'
    };
    
    if (productMap[productName]) {
        productSelect.value = productMap[productName];
    } else if (category) {
        productSelect.value = category;
    }
    
    // Focus on name field
    const nameInput = document.getElementById('name');
    if (nameInput) {
        setTimeout(() => nameInput.focus(), 300);
    }
}

// ============================================
// SCROLL EFFECTS MODULE
// ============================================
function initScrollEffects() {
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            if (href === '#') return;
            
            const targetElement = document.querySelector(href);
            if (targetElement) {
                e.preventDefault();
                
                const offset = 80;
                const targetPosition = targetElement.offsetTop - offset;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Highlight current section in navigation
    window.addEventListener('scroll', highlightCurrentSection);
}

function highlightCurrentSection() {
    const sections = document.querySelectorAll('section[id]');
    const scrollPosition = window.scrollY + 100;
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        const sectionId = section.getAttribute('id');
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            // Update active link in navigation
            document.querySelectorAll('.nav-menu a').forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}

// ============================================
// ANIMATIONS MODULE
// ============================================
function initAnimations() {
    // Intersection Observer for fade-in animations
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    document.querySelectorAll('.category-card, .product-card, .contact-item').forEach(el => {
        observer.observe(el);
    });
    
    // Add animation classes
    document.querySelectorAll('.category-card, .product-card').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    });
    
    // Add animation class when element is in view
    const animateInClass = 'animate-in';
    const animateElements = document.querySelectorAll('.category-card, .product-card');
    
    const animationObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add(animateInClass);
                animationObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    
    animateElements.forEach(el => animationObserver.observe(el));
    
    // Add CSS for animations
    const style = document.createElement('style');
    style.textContent = `
        .animate-in {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
        
        @keyframes float {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-10px); }
        }
        
        .floating {
            animation: float 3s ease-in-out infinite;
        }
    `;
    document.head.appendChild(style);
    
    // Add floating animation to some elements
    document.querySelectorAll('.category-card img').forEach(img => {
        img.classList.add('floating');
    });
}

// ============================================
// UTILITY FUNCTIONS
// ============================================
function showNotification(message, type = 'info') {
    // Remove existing notification
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    
    // Set icon based on type
    let icon = 'info-circle';
    if (type === 'success') icon = 'check-circle';
    if (type === 'error') icon = 'exclamation-circle';
    if (type === 'warning') icon = 'exclamation-triangle';
    
    notification.innerHTML = `
        <i class="fas fa-${icon}"></i>
        <span>${message}</span>
        <button class="notification-close"><i class="fas fa-times"></i></button>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: var(--white);
        color: var(--neutral-black);
        padding: 15px 20px;
        border-radius: var(--radius-md);
        box-shadow: var(--shadow-lg);
        display: flex;
        align-items: center;
        gap: 10px;
        z-index: 9999;
        animation: slideIn 0.3s ease;
        border-left: 4px solid ${getNotificationColor(type)};
        max-width: 350px;
    `;
    
    // Add close button event
    notification.querySelector('.notification-close').addEventListener('click', () => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    });
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
    
    document.body.appendChild(notification);
    
    // Add animation keyframes
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @keyframes slideOut {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
}

function getNotificationColor(type) {
    const colors = {
        'info': '#3b82f6',
        'success': '#10b981',
        'error': '#dc2626',
        'warning': '#f59e0b'
    };
    return colors[type] || colors.info;
}

// ============================================
// ERROR HANDLING
// ============================================
window.addEventListener('error', function(e) {
    console.error('Global error:', e.error);
    showNotification('Παρουσιάστηκε σφάλμα. Παρακαλώ ανανεώστε τη σελίδα.', 'error');
});

// ============================================
// PERFORMANCE OPTIMIZATIONS
// ============================================
// Debounce function for scroll events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Throttle function for resize events
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Optimize scroll event listeners
window.addEventListener('scroll', throttle(highlightCurrentSection, 100));

// ============================================
// EXPORT FUNCTIONS FOR GLOBAL USE
// ============================================
window.InsuranceApp = {
    refreshProducts: function() {
        initProducts();
        showNotification('Τα προϊόντα ανανεώθηκαν', 'success');
    },
    
    scrollToSection: function(sectionId) {
        const section = document.getElementById(sectionId);
        if (section) {
            section.scrollIntoView({ behavior: 'smooth' });
        }
    },
    
    showContactForm: function(productName = '') {
        if (productName) {
            prefillContactForm(productName);
        }
        const contactSection = document.getElementById('contact');
        if (contactSection) {
            contactSection.scrollIntoView({ behavior: 'smooth' });
        }
    }
};

console.log('Insurance App Initialized');