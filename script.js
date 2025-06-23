// Menu Toggle Functionality
function toggleMenu() {
    const menuContent = document.querySelector('.menu-content');
    menuContent.classList.toggle('show');
}

// Close menu when clicking outside
document.addEventListener('click', (e) => {
    const menuContent = document.querySelector('.menu-content');
    const menuBtn = document.querySelector('.menu-btn');
    if (!menuBtn.contains(e.target) && !menuContent.contains(e.target)) {
        menuContent.classList.remove('show');
    }
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            // Close menu after clicking a link
            document.querySelector('.menu-content').classList.remove('show');
        }
    });
});

// Animate numbers in stats
function animateValue(element, start, end, duration) {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        const value = Math.floor(progress * (end - start) + start);
        element.textContent = value.toLocaleString() + '+';
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate');
            if (entry.target.classList.contains('stat-card')) {
                const counter = entry.target.querySelector('.counter');
                const value = parseInt(counter.textContent);
                animateValue(counter, 0, value, 2000);
            }
        }
    });
}, observerOptions);

// Observe elements for animation
document.querySelectorAll('.stat-card, .category-card, .product-card').forEach(el => {
    observer.observe(el);
});

// Search functionality
const searchInput = document.querySelector('.search-input');
const searchBtn = document.querySelector('.search-btn');

searchBtn.addEventListener('click', () => {
    const searchTerm = searchInput.value.trim();
    if (searchTerm) {
        // Add loading state
        searchBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Searching...';
        searchBtn.disabled = true;

        // Simulate search (replace with actual search functionality)
        setTimeout(() => {
            searchBtn.innerHTML = '<i class="fas fa-search"></i> Track Price';
            searchBtn.disabled = false;
            showNotification('Search completed for: ' + searchTerm);
        }, 1500);
    }
});

// Notification System
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-info-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Trigger slide-in animation
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    // Auto-dismiss after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Add notification styles
const notificationStyles = `
    .notification {
        position: fixed;
        top: 20px;
        right: -400px;
        background: white;
        padding: 15px 25px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 1000;
        transition: transform 0.3s ease-in-out;
        max-width: 350px;
    }

    .notification.show {
        transform: translateX(-420px);
    }

    .notification-content {
        display: flex;
        align-items: center;
        gap: 12px;
    }

    .notification i {
        font-size: 20px;
    }

    .notification.success {
        border-left: 4px solid #4CAF50;
    }

    .notification.success i {
        color: #4CAF50;
    }

    .notification.info {
        border-left: 4px solid #2196F3;
    }

    .notification.info i {
        color: #2196F3;
    }

    .notification span {
        color: #333;
        font-size: 14px;
        line-height: 1.4;
    }
`;

// Add styles to document
const styleSheet = document.createElement('style');
styleSheet.textContent = notificationStyles;
document.head.appendChild(styleSheet);

// Example usage:
// showNotification('Product price has been updated!', 'success');
// showNotification('New deals available in your area', 'info');

// Category card hover effects
document.querySelectorAll('.category-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-10px)';
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0)';
    });
});

// Track button functionality
document.querySelectorAll('.track-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        const productName = btn.closest('.product-card').querySelector('h3').textContent;
        showNotification(`Now tracking price for ${productName}`, 'success');
    });
});

// Initialize animations when page loads
document.addEventListener('DOMContentLoaded', () => {
    // Add initial animation classes
    document.querySelectorAll('.animate-text').forEach((el, index) => {
        el.style.animationDelay = `${index * 0.2}s`;
    });

    // Price chart data for each product (sample data)
    const priceData = [
        {
            labels: ['Day 1', 'Day 5', 'Day 10', 'Day 15', 'Day 20', 'Day 25', 'Day 30'],
            data: [350, 340, 330, 320, 310, 305, 299]
        },
        {
            labels: ['Day 1', 'Day 5', 'Day 10', 'Day 15', 'Day 20', 'Day 25', 'Day 30'],
            data: [850, 860, 870, 880, 890, 895, 899]
        },
        {
            labels: ['Day 1', 'Day 5', 'Day 10', 'Day 15', 'Day 20', 'Day 25', 'Day 30'],
            data: [102000, 95000, 90000, 88000, 85000, 83000, 81999]
        }
    ];

    // Render a chart in each .price-chart canvas
    document.querySelectorAll('.price-chart canvas').forEach((canvas, idx) => {
        const ctx = canvas.getContext('2d');
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: priceData[idx].labels,
                datasets: [{
                    label: 'Price',
                    data: priceData[idx].data,
                    borderColor: '#2e7d32',
                    backgroundColor: 'rgba(46, 125, 50, 0.1)',
                    fill: true,
                    tension: 0.4,
                    pointRadius: 2
                }]
            },
            options: {
                plugins: { legend: { display: false } },
                scales: {
                    x: { display: false },
                    y: { display: false }
                },
                elements: { line: { borderWidth: 2 } },
                responsive: true,
                maintainAspectRatio: false
            }
        });
        // Set canvas height for better appearance
        canvas.height = 60;
    });
});

// Contact Form Handling
const contactForm = document.getElementById('contactForm');

contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const submitBtn = contactForm.querySelector('.submit-btn');
    const originalBtnText = submitBtn.innerHTML;
    
    // Disable button and show loading state
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    
    try {
        // Simulate form submission
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Show success message
        showNotification('Your message has been sent successfully! We\'ll get back to you soon.', 'success');
        
        // Reset form
        contactForm.reset();
    } catch (error) {
        // Show error message
        showNotification('Failed to send message. Please try again later.', 'error');
    } finally {
        // Reset button state
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnText;
    }
});

// Add error notification style
const errorNotificationStyle = `
    .notification.error {
        border-left: 4px solid #f44336;
    }

    .notification.error i {
        color: #f44336;
    }
`;

// Add error notification style to existing styles
styleSheet.textContent += errorNotificationStyle; 