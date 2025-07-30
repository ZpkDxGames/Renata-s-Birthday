// Main JavaScript for Renata's Birthday Project

document.addEventListener('DOMContentLoaded', function() {
    
    // Ensure page starts at the top
    window.scrollTo(0, 0);
    
    // Initialize page transitions
    initializePageTransitions();
    
    // Initialize all interactive features
    initializeDropdown();
    initializePostInteractions();
    initializeAnimations();
    initializeTimeCounter();
    
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
    
    // Handle browser back/forward buttons
    window.addEventListener('pageshow', function(e) {
        // Ensure page is fully visible
        document.body.style.opacity = '1';
        document.body.style.transform = 'translateY(0)';
        const mainContent = document.querySelector('.main-content');
        if (mainContent) {
            mainContent.classList.add('loaded');
        }
        
        // Scroll to top to prevent positioning issues
        window.scrollTo(0, 0);
    });
}

// Dropdown menu functionality
function initializeDropdown() {
    const dropdown = document.querySelector('.dropdown');
    const dropdownBtn = document.querySelector('.dropdown-btn');
    const dropdownContent = document.querySelector('.dropdown-content');
    
    if (dropdown && dropdownBtn && dropdownContent) {
        // Handle both click and touch events
        const toggleDropdown = (e) => {
            e.stopPropagation();
            e.preventDefault();
            const isVisible = dropdownContent.style.display === 'block';
            dropdownContent.style.display = isVisible ? 'none' : 'block';
        };
        
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

// Post interaction functionality (like Instagram)
function initializePostInteractions() {
    const posts = document.querySelectorAll('.post');
    
    posts.forEach(post => {
        const likeBtn = post.querySelector('.action-btn');
        const likesElement = post.querySelector('.likes');
        
        if (likeBtn && likesElement) {
            let isLiked = false;
            
            const handleLike = (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                if (!isLiked) {
                    // Like the post
                    likeBtn.innerHTML = '<i class="fas fa-heart"></i>';
                    likeBtn.classList.add('liked');
                    likeBtn.style.color = '#ed4956';
                    
                    // Update likes text
                    likesElement.textContent = '❤️ Curtido por você e outros';
                    
                    // Add heart animation
                    likeBtn.style.animation = 'heartBeat 0.3s ease';
                    setTimeout(() => {
                        likeBtn.style.animation = '';
                    }, 300);
                    
                    // Haptic feedback for mobile (if supported)
                    if (navigator.vibrate) {
                        navigator.vibrate(50);
                    }
                    
                    isLiked = true;
                } else {
                    // Unlike the post
                    likeBtn.innerHTML = '<i class="far fa-heart"></i>';
                    likeBtn.classList.remove('liked');
                    likeBtn.style.color = '#262626';
                    
                    // Update likes text
                    likesElement.textContent = '❤️ Curtido por familiares e amigos';
                    
                    isLiked = false;
                }
            };
            
            likeBtn.addEventListener('click', handleLike);
            likeBtn.addEventListener('touchstart', handleLike, { passive: false });
        }
        
        // Add hover effects to action buttons (for desktop)
        const actionBtns = post.querySelectorAll('.action-btn, .bookmark-btn');
        actionBtns.forEach(btn => {
            // Only add hover effects on non-touch devices
            if (!('ontouchstart' in window)) {
                btn.addEventListener('mouseenter', function() {
                    this.style.opacity = '0.5';
                });
                
                btn.addEventListener('mouseleave', function() {
                    this.style.opacity = '1';
                });
            }
            
            // Add touch feedback for mobile
            btn.addEventListener('touchstart', function() {
                this.style.transform = 'scale(0.95)';
            }, { passive: true });
            
            btn.addEventListener('touchend', function() {
                this.style.transform = 'scale(1)';
            }, { passive: true });
        });
    });
}

// Animation and scroll effects - Modified to prevent initial scroll issues
function initializeAnimations() {
    // Smooth scroll effect for any internal links
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
    
    // Add intersection observer for post animations (delayed to prevent initial scroll issues)
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe all posts for animation (with delay to prevent initial positioning issues)
    setTimeout(() => {
        const posts = document.querySelectorAll('.post');
        posts.forEach((post, index) => {
            // Only animate posts that are not initially visible
            const rect = post.getBoundingClientRect();
            if (rect.top > window.innerHeight) {
                post.style.opacity = '0';
                post.style.transform = 'translateY(20px)';
                post.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                observer.observe(post);
            } else {
                // Posts initially visible should be shown immediately
                post.style.opacity = '1';
                post.style.transform = 'translateY(0)';
            }
        });
    }, 500);
}

// Animated time counter since July 30, 1987, synced to UTC-3
function initializeTimeCounter() {
    const birthDate = new Date(Date.UTC(1987, 6, 30, 3)); // July is month 6 (0-based), 3am UTC = midnight UTC-3
    const yearsElement = document.querySelector('.counter-years');
    const monthsElement = document.querySelector('.counter-months');
    const daysElement = document.querySelector('.counter-days');
    
    if (!yearsElement || !monthsElement || !daysElement) {
        return;
    }
    
    function calculateAge() {
        // Get current time in UTC-3
        const now = new Date();
        // Convert local time to UTC-3
        const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
        const utc3 = new Date(utc - (3 * 60 * 60 * 1000));
        
        let years = utc3.getFullYear() - birthDate.getUTCFullYear();
        let months = utc3.getMonth() - birthDate.getUTCMonth();
        let days = utc3.getDate() - birthDate.getUTCDate();
        
        // Adjust for negative days
        if (days < 0) {
            months--;
            const lastDayOfPrevMonth = new Date(utc3.getFullYear(), utc3.getMonth(), 0).getDate();
            days += lastDayOfPrevMonth;
        }
        
        // Adjust for negative months
        if (months < 0) {
            years--;
            months += 12;
        }
        
        return { years, months, days };
    }
    
    function animateNumber(element, target, duration = 2000) {
        const start = parseInt(element.textContent) || 0;
        const increment = (target - start) / (duration / 16);
        let current = start;
        
        const timer = setInterval(() => {
            current += increment;
            if ((increment > 0 && current >= target) || (increment < 0 && current <= target)) {
                element.textContent = target;
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(current);
            }
        }, 16);
    }
    
    function updateCounter() {
        const age = calculateAge();
        
        // Animate each number
        setTimeout(() => animateNumber(yearsElement, age.years, 2000), 500);
        setTimeout(() => animateNumber(monthsElement, age.months, 1500), 1000);
        setTimeout(() => animateNumber(daysElement, age.days, 1000), 1500);
    }
    
    // Start the counter animation
    updateCounter();
    
    // Update the counter every day at midnight (optional - for real-time updates)
    setInterval(() => {
        updateCounter();
    }, 24 * 60 * 60 * 1000); // Update once per day
}

// Add some fun birthday confetti effect (optional)
function createConfetti() {
    const colors = ['#ff6b9d', '#c44569', '#ffeaa7', '#74b9ff', '#6c5ce7'];
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
            width: 10px;
            height: 10px;
            background-color: ${colors[Math.floor(Math.random() * colors.length)]};
            top: -10px;
            left: ${Math.random() * 100}%;
            animation: confettiFall ${Math.random() * 3 + 2}s linear forwards;
            transform: rotate(${Math.random() * 360}deg);
        `;
        confettiContainer.appendChild(confetti);
    }
    
    // Add confetti animation CSS
    const style = document.createElement('style');
    style.textContent = `
        @keyframes confettiFall {
            to {
                transform: translateY(100vh) rotate(720deg);
                opacity: 0;
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

// Call confetti effect on special occasions (you can trigger this manually)
// createConfetti();

// Utility function to format dates
function formatDate(date) {
    const options = { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    };
    return new Date(date).toLocaleDateString('en-US', options);
}

// Function to add new posts dynamically (for future use)
function addNewPost(imageUrl, caption, location, timeAgo) {
    const feed = document.querySelector('.photo-feed');
    const newPost = document.createElement('article');
    newPost.className = 'post';
    
    newPost.innerHTML = `
        <div class="post-header">
            <img src="assets/images/profile-pic.webp" alt="Profile" class="post-profile-pic" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSIyMCIgY3k9IjIwIiByPSIyMCIgZmlsbD0iI2YwZjBmMCIvPjx0ZXh0IHg9IjIwIiB5PSIyNSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iIzk5OSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjEyIj5SPC90ZXh0Pjwvc3ZnPg=='">
            <div class="post-info">
                <h3 class="post-username">renata_memories</h3>
                <span class="post-location">📍 ${location}</span>
            </div>
            <button class="post-options">⋯</button>
        </div>
        <div class="post-image">
            <img src="${imageUrl}" alt="Memory">
        </div>
        <div class="post-actions">
            <div class="action-buttons">
                <button class="action-btn"><i class="far fa-heart"></i></button>
                <button class="action-btn"><i class="far fa-comment"></i></button>
                <button class="action-btn"><i class="far fa-paper-plane"></i></button>
            </div>
            <button class="bookmark-btn"><i class="far fa-bookmark"></i></button>
        </div>
        <div class="post-content">
            <div class="likes">❤️ Loved by family and friends</div>
            <div class="caption">
                <strong>renata_memories</strong> ${caption}
            </div>
            <div class="post-time">${timeAgo}</div>
        </div>
    `;
    
    feed.appendChild(newPost);
    
    // Re-initialize interactions for the new post
    initializePostInteractions();
}
