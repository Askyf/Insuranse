// Main JavaScript for Insurance Website
document.addEventListener('DOMContentLoaded', function() {
    console.log('Alpha Insurance Website Loaded');
    
    // Initialize all modules
    initNavigation();
    initProducts();
    initFAQ();
    initContactForm();
    initNewsletterForm();
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
// PRODUCTS MODULE - FIXED VERSION
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
    
    // Load products directly (no fetch)
    setTimeout(() => {
        try {
            const products = getProductsData();
            displayProducts(products);
            setupFiltering(products);
            setupCategoryCards();
        } catch (error) {
            console.error('Error loading products:', error);
            showProductsError();
        }
    }, 500); // Small delay for better UX
}

function getProductsData() {
    // Direct inline products data - no external file needed
    return [
        {
            "id": 1,
            "name": "Ολοκληρωμένη Ασφάλεια Υγείας",
            "category": "health",
            "icon": "fas fa-heartbeat",
            "price": "€45/μήνα",
            "description": "Πλήρης κάλυψη για ιατρικές εξετάσεις, νοσηλεία και φαρμακευτική περίθαλψη για άτομα έως 65 ετών.",
            "features": [
                "Κάλυψη σε ιδιωτικά νοσοκομεία",
                "Συμμετοχή 20% στα φάρμακα",
                "Ετήσια προληπτική εξέταση",
                "24/7 τηλεϊατρική συμβουλευτική",
                "Οδοντιατρική κάλυψη έως €500/έτος",
                "Κάλυψη για χειρουργικές επεμβάσεις"
            ]
        },
        {
            "id": 2,
            "name": "Αστική Ευθύνη Οχήματος",
            "category": "car",
            "icon": "fas fa-car",
            "price": "€180/έτος",
            "description": "Υποχρεωτική ασφάλση αυτοκινήτου με έξτρα πακέτα προστασίας και οδική βοήθεια.",
            "features": [
                "Προστασία έως €1.000.000",
                "Κάλυψη για πυρκαγιά και κλοπή",
                "Δωρεάν παροχή αντικαταστατικού",
                "Οδική βοήθεια σε όλη την Ελλάδα",
                "Κάλυψη για τρίτα πρόσωπα",
                "Γρήγορη διεκπεραίωση απαιτήσεων"
            ]
        },
        {
            "id": 3,
            "name": "Ασφάλεια Κατοικίας",
            "category": "home",
            "icon": "fas fa-home",
            "price": "€120/έτος",
            "description": "Προστασία σπιτιού και περιουσίας από φυσικές καταστροφές, κλοπές και ατυχήματα.",
            "features": [
                "Κάλυψη για πυρκαγιά και σεισμό",
                "Ασφάλεια κλοπής περιουσίας",
                "Προστασία ηλεκτρικών συσκευών",
                "Άμεση αποζημίωση σε 7 ημέρες",
                "Κάλυψη για φυσικές βλάβες",
                "Συμβουλευτική για ασφάλεια σπιτιού"
            ]
        },
        {
            "id": 4,
            "name": "Ασφάλεια Ζωής",
            "category": "life",
            "icon": "fas fa-user-shield",
            "price": "€30/μήνα",
            "description": "Ασφάλεια που προστατεύει την οικογένειά σου και διασφαλίζει το μέλλον της με ευέλικτες επιλογές.",
            "features": [
                "Κάλυψη έως €200.000",
                "Επιπλέον κάλυψη για ατύχημα",
                "Ευέλικτη διάρκεια πολιτικής",
                "Δυνατότητα επένδυσης",
                "Φορολογικά οφέλη",
                "Κάλυψη για κρίσιμες ασθένειες"
            ]
        },
        {
            "id": 5,
            "name": "Οικογενειακή Ασφάλεια Υγείας",
            "category": "health",
            "icon": "fas fa-users",
            "price": "€75/μήνα",
            "description": "Ειδικό πακέτο για ολόκληρη την οικογένεια (2 γονείς + 2 παιδιά) με έκπτωση έως 30%.",
            "features": [
                "Κάλυψη για 2 γονείς + 2 παιδιά",
                "Δωρεάν παιδιατρικές επισκέψεις",
                "Οδοντιατρική κάλυψη",
                "Ψυχολογική υποστήριξη",
                "Κάλυψη για οφθαλμολογικές εξετάσεις",
                "24ωρη ιατρική υποστήριξη"
            ]
        },
        {
            "id": 6,
            "name": "Πλήρης Κάλυψη Αυτοκινήτου",
            "category": "car",
            "icon": "fas fa-car-crash",
            "price": "€350/έτος",
            "description": "Επέκταση της υποχρεωτικής ασφάλισης με πλήρη κάλυψη ζημιών και παγκόσμια προστασία.",
            "features": [
                "Πλήρης κάλυψη ζημιών",
                "Κάλυψη για καιρικά φαινόμενα",
                "Παγκόσμια κάλυψη",
                "Προσωπική ασφάλεια οδηγού",
                "Κάλυψη για βανδαλισμό",
                "VIP οδική βοήθεια"
            ]
        }
    ];
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
            <button class="btn-secondary" onclick="location.reload()">
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
// NEWSLETTER FORM MODULE
// ============================================
function initNewsletterForm() {
    const newsletterForm = document.getElementById('newsletterForm');
    if (!newsletterForm) return;
    
    newsletterForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = this.querySelector('input[type="email"]').value.trim();
        
        if (!email) {
            showNotification('Παρακαλώ εισάγετε ένα email', 'error');
            return;
        }
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showNotification('Παρακαλώ εισάγετε ένα έγκυρο email', 'error');
            return;
        }
        
        // Show loading
        const button = this.querySelector('button');
        const originalHTML = button.innerHTML;
        button.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
        button.disabled = true;
        
        // Simulate subscription
        setTimeout(() => {
            button.innerHTML = originalHTML;
            button.disabled = false;
            this.reset();
            showNotification('Εγγραφήκατε επιτυχώς στο newsletter!', 'success');
        }, 1500);
    });
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
    if ('IntersectionObserver' in window) {
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
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            observer.observe(el);
        });
    }
    
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
    
    // Add floating animation to category icons
    document.querySelectorAll('.category-card i').forEach(icon => {
        icon.classList.add('floating');
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
    
    // Add animation keyframes if not already added
    if (!document.querySelector('#notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
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
// GLOBAL FUNCTIONS
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

console.log('Insurance App Initialized - Fixed Version');