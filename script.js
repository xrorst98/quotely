function toggleMenu() {
    const menuContent = document.querySelector('.menu-content');
    menuContent.classList.toggle('show');
}
document.addEventListener('click', (e) => {
    const menuContent = document.querySelector('.menu-content');
    const menuBtn = document.querySelector('.menu-btn');
    if (!menuBtn.contains(e.target) && !menuContent.contains(e.target)) {
        menuContent.classList.remove('show');
    }
});

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            document.querySelector('.menu-content').classList.remove('show');
        }
    });
});
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
document.querySelectorAll('.stat-card, .category-card, .product-card').forEach(el => {
    observer.observe(el);
});
let products = [];
fetch('products.json')
    .then(response => response.json())
    .then(data => { products = data; });

function displayProduct(product) {
    const container = document.getElementById('search-results');
    if (!product) {
        container.innerHTML = '<p>No product found.</p>';
        return;
    }
    const hasDetails = product.name || product.price || product.website || product.url;
    if (!hasDetails && product.image) {
        container.innerHTML = `
            <div class="product-search-card">
                <img src="${product.image}" alt="Product Image" class="product-search-image">
                <div class="product-search-info">
                    <p>No details available for this product.</p>
                </div>
            </div>
        `;
        return;
    }
    const priceHistoryMap = {
        'sony headphones': [350, 340, 330, 320, 310, 305, 299, 4350],
        'apple watch': [850, 860, 870, 880, 890, 895, 899, 49999],
        'macbook air m2': [102000, 95000, 90000, 88000, 85000, 83000, 81999],
    };
    const key = (product.name || '').toLowerCase();
    let priceHistory = priceHistoryMap[key] || [];
    const currentPrice = parseFloat(product.price);
    if (currentPrice && !priceHistory.includes(currentPrice)) {
        priceHistory = [...priceHistory, currentPrice];
    }
    if ((!priceHistory || priceHistory.length === 0 || isNaN(currentPrice)) && !isNaN(currentPrice)) {
        priceHistory = [currentPrice];
    }
    let avgPrice = 'N/A', maxPrice = 'N/A';
    if (priceHistory.length > 0 && !isNaN(currentPrice)) {
        const sum = priceHistory.reduce((a, b) => a + b, 0);
        avgPrice = Math.round(sum / priceHistory.length);
        maxPrice = Math.max(...priceHistory);
    }

    container.innerHTML = `
        <div class="product-search-card">
            <img src="${product.image || ''}" alt="${product.name || ''}" class="product-search-image">
            <div class="product-search-info">
                <h3>${product.name || 'N/A'}</h3>
                <p><strong>Current Price:</strong> ₹${product.price || 'N/A'}</p>
                <p><strong>Average Price:</strong> ₹${avgPrice}</p>
                <p><strong>Highest Price:</strong> ₹${maxPrice}</p>
                <p><strong>Website:</strong> ${product.website || 'N/A'}</p>
                <a href="${product.url || '#'}" target="_blank">${product.url ? 'View Product' : 'No Link'}</a>
            </div>
        </div>
    `;
}

const searchBtn = document.querySelector('.search-btn');
const searchInput = document.querySelector('.search-input');
if (searchBtn && searchInput) {
    searchBtn.addEventListener('click', () => {
        const query = searchInput.value.trim().toLowerCase();
        if (!query) return;
        const product = products.find(
            p => p.name && p.name.toLowerCase().includes(query)
        );
        displayProduct(product);
    });
    searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            searchBtn.click();
        }
    });
}

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
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}
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
const styleSheet = document.createElement('style');
styleSheet.textContent = notificationStyles;
document.head.appendChild(styleSheet);

document.querySelectorAll('.category-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-10px)';
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0)';
    });
});
document.querySelectorAll('.track-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        const productName = btn.closest('.product-card').querySelector('h3').textContent;
        showNotification(`Now tracking price for ${productName}`, 'success');
    });
});

document.addEventListener('DOMContentLoaded', () => {

    document.querySelectorAll('.animate-text').forEach((el, index) => {
        el.style.animationDelay = `${index * 0.2}s`;
    });

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
  
        canvas.height = 60;
    });
});


const contactForm = document.getElementById('contactForm');

contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const submitBtn = contactForm.querySelector('.submit-btn');
    const originalBtnText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    
    try {
        const formData = new FormData(contactForm);
        const response = await fetch(contactForm.action, {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'application/json'
            }
        });
        if (response.ok) {
            showNotification('Your message has been sent successfully! We\'ll get back to you soon.', 'success');
            contactForm.reset();
        } else {
            showNotification('Failed to send message. Please try again later.', 'error');
        }
    } catch (error) {
        showNotification('Failed to send message. Please try again later.', 'error');
    } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnText;
    }
});

const errorNotificationStyle = `
    .notification.error {
        border-left: 4px solid #f44336;
    }

    .notification.error i {
        color: #f44336;
    }
`;

styleSheet.textContent += errorNotificationStyle;

function renderProductList() {
    const productList = document.getElementById('productList');
    if (!productList) return;
    if (!products.length) {
        productList.innerHTML = '<p>No products available.</p>';
        return;
    }
    let table = `<table class="product-list-table"><thead><tr><th>Name</th><th>Price</th><th>Website</th><th>URL</th><th>Image</th><th>Actions</th></tr></thead><tbody>`;
    products.forEach((p, idx) => {
        table += `<tr>
            <td><input type="text" value="${p.name}" data-idx="${idx}" class="edit-name" style="width:120px"></td>
            <td><input type="number" value="${p.price}" data-idx="${idx}" class="edit-price" style="width:80px"></td>
            <td><input type="text" value="${p.website}" data-idx="${idx}" class="edit-website" style="width:90px"></td>
            <td><input type="text" value="${p.url}" data-idx="${idx}" class="edit-url" style="width:160px"></td>
            <td><input type="text" value="${p.image}" data-idx="${idx}" class="edit-image" style="width:110px"></td>
            <td>
                <button class="product-action-btn edit" data-idx="${idx}">Save</button>
                <button class="product-action-btn delete" data-idx="${idx}">Delete</button>
            </td>
        </tr>`;
    });
    table += '</tbody></table>';
    productList.innerHTML = table;

    document.querySelectorAll('.product-action-btn.edit').forEach(btn => {
        btn.addEventListener('click', function() {
            const idx = this.getAttribute('data-idx');
            products[idx].name = document.querySelector(`.edit-name[data-idx='${idx}']`).value;
            products[idx].price = document.querySelector(`.edit-price[data-idx='${idx}']`).value;
            products[idx].website = document.querySelector(`.edit-website[data-idx='${idx}']`).value;
            products[idx].url = document.querySelector(`.edit-url[data-idx='${idx}']`).value;
            products[idx].image = document.querySelector(`.edit-image[data-idx='${idx}']`).value;
            renderProductList();
            showNotification('Product updated!', 'success');
        });
    });
    document.querySelectorAll('.product-action-btn.delete').forEach(btn => {
        btn.addEventListener('click', function() {
            const idx = this.getAttribute('data-idx');
            products.splice(idx, 1);
            renderProductList();
            showNotification('Product deleted!', 'success');
        });
    });
}

document.addEventListener('DOMContentLoaded', function() {
    
    setTimeout(renderProductList, 500);
    
    const addProductForm = document.getElementById('addProductForm');
    if (addProductForm) {
        addProductForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const newProduct = {
                name: document.getElementById('productName').value,
                price: document.getElementById('productPrice').value,
                website: document.getElementById('productWebsite').value,
                url: document.getElementById('productUrl').value,
                image: document.getElementById('productImage').value
            };
            products.push(newProduct);
            renderProductList();
            showNotification('Product added!', 'success');
            addProductForm.reset();
        });
    }
}); 
