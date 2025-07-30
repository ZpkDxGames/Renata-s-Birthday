// About Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Ensure page starts at the top
    window.scrollTo(0, 0);
    
    // Initialize page transitions
    initializePageTransitions();
    
    initializeDropdown();
    initializeScrollAnimations();
    initializeFeatureInteractions();
    initializeFunEffects();
});

// Page transition functionality - Modified to prevent scroll issues
function initializePageTransitions() {
    // Add page transition class to main content without initial animation
    const mainContent = document.querySelector('.main-content');
    if (mainContent) {
        mainContent.classList.add('page-transition');
        mainContent.classList.add('loaded');
    }
    
    // Handle smooth transitions for navigation links
    const navLinks = document.querySelectorAll('a[href]');
    navLinks.forEach(link => {
        // Skip external links and anchors - let them work normally
        if (link.href.startsWith('http') && !link.href.includes(window.location.hostname)) {
            return;
        }
        
        // For internal links, let browser handle navigation naturally
        // This ensures GitHub Pages routing works correctly
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Only prevent default for anchor links within the same page
            if (href.startsWith('#')) {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
            // Let all other links work normally without preventDefault
        });
    });
}

// Dropdown menu functionality
function initializeDropdown() {
    const dropdown = document.querySelector('.dropdown');
    const dropdownBtn = document.querySelector('.dropdown-btn');
    const dropdownContent = document.querySelector('.dropdown-content');
    
    if (dropdown && dropdownBtn && dropdownContent) {
        // Handle both click and touch events for mobile compatibility
        const toggleDropdown = (e) => {
            e.stopPropagation();
            e.preventDefault();
            const isVisible = dropdownContent.style.display === 'block';
            dropdownContent.style.display = isVisible ? 'none' : 'block';
        };
        
        // Add both click and touch events
        dropdownBtn.addEventListener('click', toggleDropdown);
        dropdownBtn.addEventListener('touchstart', toggleDropdown, { passive: false });
        
        // Close dropdown when clicking/touching outside
        const closeDropdown = (e) => {
            if (!dropdown.contains(e.target)) {
                dropdownContent.style.display = 'none';
            }
        };
        
        document.addEventListener('click', closeDropdown);
        document.addEventListener('touchstart', closeDropdown, { passive: true });
        
        // Close dropdown when clicking on a link
        const dropdownLinks = dropdownContent.querySelectorAll('a');
        dropdownLinks.forEach(link => {
            const closeLinkDropdown = () => {
                dropdownContent.style.display = 'none';
            };
            
            link.addEventListener('click', closeLinkDropdown);
            link.addEventListener('touchstart', closeLinkDropdown, { passive: true });
        });
        
        // Handle viewport changes (orientation change on mobile)
        window.addEventListener('orientationchange', () => {
            dropdownContent.style.display = 'none';
        });
    }
}

// Initialize scroll animations
function initializeScrollAnimations() {
    const sections = document.querySelectorAll('.content-section');
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                
                // Add special effect for personal message
                if (entry.target.classList.contains('personal-message')) {
                    setTimeout(() => {
                        entry.target.style.background = 'linear-gradient(135deg, #fff0f3 0%, #ffe6eb 100%)';
                    }, 500);
                }
            }
        });
    }, observerOptions);
    
    sections.forEach(section => {
        observer.observe(section);
    });
}

// Initialize feature interactions
function initializeFeatureInteractions() {
    const featureItems = document.querySelectorAll('.feature-item');
    const sectionIcons = document.querySelectorAll('.section-icon');
    
    // Feature item hover effects
    featureItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            const icon = this.querySelector('i');
            icon.style.transform = 'scale(1.2) rotate(10deg)';
            icon.style.color = '#c44569';
        });
        
        item.addEventListener('mouseleave', function() {
            const icon = this.querySelector('i');
            icon.style.transform = 'scale(1) rotate(0deg)';
            icon.style.color = '#ff6b9d';
        });
        
        // Add click effect
        item.addEventListener('click', function() {
            this.style.transform = 'scale(0.98)';
            setTimeout(() => {
                this.style.transform = 'translateY(-4px)';
            }, 150);
        });
    });
    
    // Section icon interactions
    sectionIcons.forEach(icon => {
        icon.addEventListener('click', function() {
            // Create ripple effect
            createRippleEffect(this);
        });
    });
}

// Create ripple effect
function createRippleEffect(element) {
    const ripple = document.createElement('div');
    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    
    ripple.style.cssText = `
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.3);
        width: ${size}px;
        height: ${size}px;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%) scale(0);
        animation: ripple 0.6s ease-out;
        pointer-events: none;
    `;
    
    element.style.position = 'relative';
    element.style.overflow = 'hidden';
    element.appendChild(ripple);
    
    setTimeout(() => {
        ripple.remove();
    }, 600);
    
    // Add ripple animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes ripple {
            to {
                transform: translate(-50%, -50%) scale(2);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
}

// Initialize fun effects
function initializeFunEffects() {
    // Add typing effect to personal message
    addTypingEffect();
    
    // Add confetti on birthday cake click
    addBirthdayCakeInteraction();
    
    // Add tech list hover effects
    addTechListEffects();
    
    // Add instruction steps animation
    addInstructionStepsAnimation();
}

// Add typing effect to personal message
function addTypingEffect() {
    const personalMessage = document.querySelector('.personal-message .message-content');
    if (!personalMessage) return;
    
    const originalText = personalMessage.innerHTML;
    const paragraphs = personalMessage.querySelectorAll('p');
    
    // Only apply to the first paragraph
    if (paragraphs.length > 0) {
        const firstP = paragraphs[0];
        const text = firstP.textContent;
        firstP.textContent = '';
        
        let i = 0;
        const typeWriter = () => {
            if (i < text.length) {
                firstP.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, 50);
            }
        };
        
        // Start typing when the section comes into view
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setTimeout(typeWriter, 1000);
                    observer.unobserve(entry.target);
                }
            });
        });
        
        observer.observe(personalMessage);
    }
}

// Add birthday cake interaction
function addBirthdayCakeInteraction() {
    const cakeIcons = document.querySelectorAll('.fa-birthday-cake');
    
    cakeIcons.forEach(cake => {
        cake.addEventListener('click', function(e) {
            e.preventDefault();
            createConfetti();
            this.style.animation = 'bounce 0.5s ease';
            setTimeout(() => {
                this.style.animation = '';
            }, 500);
        });
    });
}

// Create confetti effect
function createConfetti() {
    const colors = ['#ff6b9d', '#c44569', '#ffeaa7', '#74b9ff', '#6c5ce7', '#fd79a8'];
    const confettiContainer = document.createElement('div');
    confettiContainer.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 9999;
    `;
    document.body.appendChild(confettiContainer);
    
    for (let i = 0; i < 50; i++) {
        const confetti = document.createElement('div');
        confetti.style.cssText = `
            position: absolute;
            width: 8px;
            height: 8px;
            background-color: ${colors[Math.floor(Math.random() * colors.length)]};
            top: -10px;
            left: ${Math.random() * 100}%;
            animation: confettiFall ${Math.random() * 3 + 2}s linear forwards;
            transform: rotate(${Math.random() * 360}deg);
            border-radius: ${Math.random() > 0.5 ? '50%' : '0'};
        `;
        confettiContainer.appendChild(confetti);
    }
    
    // Add confetti animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes confettiFall {
            to {
                transform: translateY(100vh) rotate(720deg);
                opacity: 0;
            }
        }
        @keyframes bounce {
            0%, 20%, 60%, 100% {
                transform: translateY(0);
            }
            40% {
                transform: translateY(-20px);
            }
            80% {
                transform: translateY(-10px);
            }
        }
    `;
    document.head.appendChild(style);
    
    // Remove confetti after animation
    setTimeout(() => {
        confettiContainer.remove();
        style.remove();
    }, 5000);
}

// Add tech list effects
function addTechListEffects() {
    const techItems = document.querySelectorAll('.tech-list li');
    
    techItems.forEach((item, index) => {
        item.addEventListener('mouseenter', function() {
            this.style.background = 'linear-gradient(135deg, #fff5f7 0%, #ffe8ed 100%)';
            this.style.padding = '12px 16px';
            this.style.borderRadius = '8px';
            this.style.transform = 'translateX(10px)';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.background = 'transparent';
            this.style.padding = '8px 0';
            this.style.borderRadius = '0';
            this.style.transform = 'translateX(0)';
        });
        
        // Staggered animation on scroll
        item.style.opacity = '0';
        item.style.transform = 'translateX(-20px)';
        item.style.transition = 'all 0.3s ease';
        
        setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'translateX(0)';
        }, index * 100);
    });
}

// Add instruction steps animation
function addInstructionStepsAnimation() {
    const steps = document.querySelectorAll('.instruction-step');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const stepNumber = entry.target.querySelector('.step-number');
                const stepContent = entry.target.querySelector('.step-content');
                
                stepNumber.style.animation = 'pulse 0.6s ease';
                stepContent.style.animation = 'slideInRight 0.6s ease';
                
                observer.unobserve(entry.target);
            }
        });
    });
    
    steps.forEach(step => {
        observer.observe(step);
    });
    
    // Add animations
    const style = document.createElement('style');
    style.textContent = `
        @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.1); }
            100% { transform: scale(1); }
        }
        @keyframes slideInRight {
            from {
                opacity: 0;
                transform: translateX(30px);
            }
            to {
                opacity: 1;
                transform: translateX(0);
            }
        }
    `;
    document.head.appendChild(style);
}

// Add smooth scroll to anchor links
function initializeSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Add easter egg for developers
function addDeveloperEasterEgg() {
    let keySequence = [];
    const secretCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight'];
    
    document.addEventListener('keydown', function(e) {
        keySequence.push(e.key);
        
        if (keySequence.length > secretCode.length) {
            keySequence.shift();
        }
        
        if (JSON.stringify(keySequence) === JSON.stringify(secretCode)) {
            showDeveloperMessage();
            keySequence = [];
        }
    });
}

// Show developer message
function showDeveloperMessage() {
    const message = document.createElement('div');
    message.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: linear-gradient(135deg, #ff6b9d 0%, #c44569 100%);
        color: white;
        padding: 20px 30px;
        border-radius: 12px;
        font-size: 16px;
        font-weight: 600;
        z-index: 10000;
        box-shadow: 0 8px 24px rgba(0,0,0,0.3);
        animation: bounceIn 0.5s ease;
        text-align: center;
    `;
    
    message.innerHTML = `
        <h3>🎉 Developer Easter Egg Found! 🎉</h3>
        <p>You found the secret code! This website was made with ❤️ for Renata.</p>
        <p><small>Click to dismiss</small></p>
    `;
    
    document.body.appendChild(message);
    
    message.addEventListener('click', function() {
        this.style.animation = 'bounceOut 0.5s ease';
        setTimeout(() => {
            if (document.body.contains(this)) {
                document.body.removeChild(this);
            }
        }, 500);
    });
    
    // Add bounce animations
    const style = document.createElement('style');
    style.textContent = `
        @keyframes bounceIn {
            from { opacity: 0; transform: translate(-50%, -50%) scale(0.3); }
            50% { transform: translate(-50%, -50%) scale(1.05); }
            to { opacity: 1; transform: translate(-50%, -50%) scale(1); }
        }
        @keyframes bounceOut {
            from { opacity: 1; transform: translate(-50%, -50%) scale(1); }
            to { opacity: 0; transform: translate(-50%, -50%) scale(0.3); }
        }
    `;
    document.head.appendChild(style);
    
    setTimeout(() => {
        if (document.body.contains(message)) {
            message.click();
        }
    }, 5000);
}

// Initialize all features
initializeSmoothScroll();
addDeveloperEasterEgg();
