// Memories Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Ensure page starts at the top
    window.scrollTo(0, 0);
    
    // Initialize page transitions
    initializePageTransitions();
    
    initializeDropdown();
    initializeGallery();
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

// Gallery functionality
function initializeGallery() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    const modal = document.getElementById('imageModal');
    const modalImg = document.getElementById('modalImage');
    const modalCaption = document.getElementById('modalCaption');
    const closeBtn = document.querySelector('.close');
    
    // Add click event to each gallery item
    galleryItems.forEach(item => {
        item.addEventListener('click', function() {
            const img = this.querySelector('img');
            const caption = this.querySelector('.overlay-content');
            
            modal.style.display = 'block';
            modalImg.src = img.src;
            modalImg.alt = img.alt;
            
            if (caption) {
                const title = caption.querySelector('h3').textContent;
                const description = caption.querySelector('p').textContent;
                modalCaption.innerHTML = `<strong>${title}</strong><br>${description}`;
            }
        });
        
        // Add keyboard navigation
        item.setAttribute('tabindex', '0');
        item.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
    });
    
    // Close modal functionality
    if (closeBtn) {
        closeBtn.addEventListener('click', function() {
            modal.style.display = 'none';
        });
    }
    
    // Close modal when clicking outside the image
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });
    }
    
    // Close modal with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.style.display === 'block') {
            modal.style.display = 'none';
        }
    });
    
    // Add lazy loading for images
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.classList.add('loaded');
                observer.unobserve(img);
            }
        });
    });
    
    const images = document.querySelectorAll('.gallery-item img');
    images.forEach(img => {
        imageObserver.observe(img);
    });
}