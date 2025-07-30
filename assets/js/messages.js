// Messages Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Ensure page starts at the top
    window.scrollTo(0, 0);
    
    // Clear old reaction data to use updated HTML values
    localStorage.removeItem('birthdayReactions');
    
    // Initialize page transitions
    initializePageTransitions();
    
    initializeDropdown();
    initializeReactions();
    initializeMessageForm();
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
        
        // Add both click and touchstart events
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

// Initialize reaction buttons
function initializeReactions() {
    const reactionBtns = document.querySelectorAll('.reaction-btn');
    
    reactionBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const reaction = this.dataset.reaction;
            const countSpan = this.querySelector('span');
            let currentCount = parseInt(countSpan.textContent);
            
            if (this.classList.contains('active')) {
                // Remove reaction
                this.classList.remove('active');
                countSpan.textContent = Math.max(0, currentCount - 1);
            } else {
                // Add reaction
                this.classList.add('active');
                countSpan.textContent = currentCount + 1;
                
                // Add animation
                const icon = this.querySelector('i');
                icon.style.animation = 'heartBeat 0.3s ease';
                setTimeout(() => {
                    icon.style.animation = '';
                }, 300);
            }
            
            // Save reaction state to localStorage
            saveReactionState();
        });
    });
    
    // Load saved reaction states
    loadReactionStates();
}

// Save reaction states to localStorage
function saveReactionState() {
    const reactions = {};
    const messageCards = document.querySelectorAll('.message-card');
    
    messageCards.forEach((card, cardIndex) => {
        const reactionBtns = card.querySelectorAll('.reaction-btn');
        reactions[cardIndex] = {};
        
        reactionBtns.forEach(btn => {
            const reaction = btn.dataset.reaction;
            const count = parseInt(btn.querySelector('span').textContent);
            const isActive = btn.classList.contains('active');
            
            reactions[cardIndex][reaction] = {
                count: count,
                active: isActive
            };
        });
    });
    
    localStorage.setItem('birthdayReactions', JSON.stringify(reactions));
}

// Load reaction states from localStorage
function loadReactionStates() {
    const savedReactions = localStorage.getItem('birthdayReactions');
    if (!savedReactions) return;
    
    try {
        const reactions = JSON.parse(savedReactions);
        const messageCards = document.querySelectorAll('.message-card');
        
        messageCards.forEach((card, cardIndex) => {
            if (reactions[cardIndex]) {
                const reactionBtns = card.querySelectorAll('.reaction-btn');
                
                reactionBtns.forEach(btn => {
                    const reaction = btn.dataset.reaction;
                    if (reactions[cardIndex][reaction]) {
                        const { count, active } = reactions[cardIndex][reaction];
                        // Only restore active state, keep HTML count values
                        if (active) {
                            btn.classList.add('active');
                        }
                    }
                });
            }
        });
    } catch (error) {
        console.error('Error loading reaction states:', error);
    }
}

// Initialize message form
function initializeMessageForm() {
    const form = document.getElementById('messageForm');
    const nameInput = document.getElementById('senderName');
    const relationshipSelect = document.getElementById('relationship');
    const messageTextarea = document.getElementById('message');
    
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = {
                name: nameInput.value.trim(),
                relationship: relationshipSelect.value,
                message: messageTextarea.value.trim()
            };
            
            if (validateForm(formData)) {
                addNewMessage(formData);
                form.reset();
                showSuccessMessage('Your birthday message has been added!');
            }
        });
    }
    
    // Add character counter for message textarea
    if (messageTextarea) {
        const charCounter = document.createElement('div');
        charCounter.className = 'char-counter';
        charCounter.style.cssText = `
            font-size: 12px;
            color: #8e8e8e;
            text-align: right;
            margin-top: 4px;
        `;
        messageTextarea.parentNode.appendChild(charCounter);
        
        messageTextarea.addEventListener('input', function() {
            const remaining = 500 - this.value.length;
            charCounter.textContent = `${this.value.length}/500 characters`;
            charCounter.style.color = remaining < 50 ? '#ed4956' : '#8e8e8e';
        });
        
        // Initial count
        charCounter.textContent = '0/500 characters';
    }
}

// Validate form data
function validateForm(data) {
    if (!data.name) {
        showErrorMessage('Please enter your name');
        return false;
    }
    
    if (!data.relationship) {
        showErrorMessage('Please select your relationship');
        return false;
    }
    
    if (!data.message) {
        showErrorMessage('Please write a birthday message');
        return false;
    }
    
    if (data.message.length > 500) {
        showErrorMessage('Message is too long (max 500 characters)');
        return false;
    }
    
    return true;
}

// Add new message to the page
function addNewMessage(data) {
    const messagesContainer = document.querySelector('.messages-container');
    const newMessageCard = document.createElement('div');
    newMessageCard.className = 'message-card';
    
    // Get appropriate icon based on relationship
    const getIcon = (relationship) => {
        switch (relationship.toLowerCase()) {
            case 'family': return 'fas fa-users';
            case 'friends': return 'fas fa-user-friends';
            case 'colleague': return 'fas fa-briefcase';
            default: return 'fas fa-user';
        }
    };
    
    newMessageCard.innerHTML = `
        <div class="message-header">
            <div class="avatar">
                <i class="${getIcon(data.relationship)}"></i>
            </div>
            <div class="sender-info">
                <h3>${escapeHtml(data.name)}</h3>
                <span class="relationship">${escapeHtml(data.relationship)}</span>
            </div>
            <div class="message-date">Just now</div>
        </div>
        <div class="message-content">
            <p>${escapeHtml(data.message)}</p>
        </div>
        <div class="message-footer">
            <button class="reaction-btn" data-reaction="heart"><i class="fas fa-heart"></i> <span>0</span></button>
            <button class="reaction-btn" data-reaction="smile"><i class="fas fa-smile"></i> <span>0</span></button>
            <button class="reaction-btn" data-reaction="cake"><i class="fas fa-birthday-cake"></i> <span>0</span></button>
        </div>
    `;
    
    // Add animation
    newMessageCard.style.opacity = '0';
    newMessageCard.style.transform = 'translateY(20px)';
    
    // Insert at the beginning of messages container
    messagesContainer.insertBefore(newMessageCard, messagesContainer.firstChild);
    
    // Trigger animation
    setTimeout(() => {
        newMessageCard.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        newMessageCard.style.opacity = '1';
        newMessageCard.style.transform = 'translateY(0)';
    }, 100);
    
    // Add event listeners to new reaction buttons
    const newReactionBtns = newMessageCard.querySelectorAll('.reaction-btn');
    newReactionBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const reaction = this.dataset.reaction;
            const countSpan = this.querySelector('span');
            let currentCount = parseInt(countSpan.textContent);
            
            if (this.classList.contains('active')) {
                this.classList.remove('active');
                countSpan.textContent = Math.max(0, currentCount - 1);
            } else {
                this.classList.add('active');
                countSpan.textContent = currentCount + 1;
                
                const icon = this.querySelector('i');
                icon.style.animation = 'heartBeat 0.3s ease';
                setTimeout(() => {
                    icon.style.animation = '';
                }, 300);
            }
            
            saveReactionState();
        });
    });
    
    // Save the new message to localStorage
    saveMessage(data);
}

// Save message to localStorage
function saveMessage(data) {
    const savedMessages = JSON.parse(localStorage.getItem('birthdayMessages') || '[]');
    savedMessages.unshift({
        ...data,
        timestamp: new Date().toISOString(),
        id: Date.now()
    });
    localStorage.setItem('birthdayMessages', JSON.stringify(savedMessages));
}

// Load saved messages on page load
function loadSavedMessages() {
    const savedMessages = JSON.parse(localStorage.getItem('birthdayMessages') || '[]');
    savedMessages.forEach(message => {
        addNewMessage(message);
    });
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Show success message
function showSuccessMessage(message) {
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.innerHTML = `<i class="fas fa-check-circle"></i> ${message}`;
    
    document.body.appendChild(successDiv);
    
    setTimeout(() => {
        successDiv.style.animation = 'slideOut 0.3s ease forwards';
        setTimeout(() => {
            if (document.body.contains(successDiv)) {
                document.body.removeChild(successDiv);
            }
        }, 300);
    }, 3000);
}

// Show error message
function showErrorMessage(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'success-message';
    errorDiv.style.background = 'linear-gradient(135deg, #ed4956 0%, #d63447 100%)';
    errorDiv.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${message}`;
    
    document.body.appendChild(errorDiv);
    
    setTimeout(() => {
        errorDiv.style.animation = 'slideOut 0.3s ease forwards';
        setTimeout(() => {
            if (document.body.contains(errorDiv)) {
                document.body.removeChild(errorDiv);
            }
        }, 300);
    }, 3000);
}

// Add slideOut animation
const style = document.createElement('style');
style.textContent = `
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

// Filter messages by relationship (for future enhancement)
function filterMessages(relationship) {
    const messageCards = document.querySelectorAll('.message-card');
    
    messageCards.forEach(card => {
        const cardRelationship = card.querySelector('.relationship').textContent.toLowerCase();
        
        if (relationship === 'all' || cardRelationship === relationship.toLowerCase()) {
            card.style.display = 'block';
            card.style.animation = 'fadeInUp 0.6s ease forwards';
        } else {
            card.style.display = 'none';
        }
    });
}

// Search messages (for future enhancement)
function searchMessages(query) {
    const messageCards = document.querySelectorAll('.message-card');
    const searchTerm = query.toLowerCase();
    
    messageCards.forEach(card => {
        const senderName = card.querySelector('.sender-info h3').textContent.toLowerCase();
        const messageText = card.querySelector('.message-content p').textContent.toLowerCase();
        
        if (senderName.includes(searchTerm) || messageText.includes(searchTerm)) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}
