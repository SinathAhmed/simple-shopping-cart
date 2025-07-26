// DOM Elements
const productList = document.getElementById('product-list');
const cartCountElement = document.getElementById('cart-count');
const cartModal = document.getElementById('cart-modal');
const closeModalButton = document.querySelector('.close-button');
const cartIcon = document.getElementById('cart-icon');
const cartItemsContainer = document.getElementById('cart-items-container');
const cartTotalElement = document.getElementById('cart-total');
const clearCartBtn = document.getElementById('clear-cart-btn');
const checkoutBtn = document.getElementById('checkout-btn');

// --- UI UPDATE FUNCTIONS ---

// Function to display products on the page
function displayProducts() {
    productList.innerHTML = allProducts.map(product => `
        <div class="product-card">
            <img src="${product.image}" alt="${product.name}">
            <div class="product-info">
                <h3>${product.name}</h3>
                <p>${product.description}</p>
                <div class="product-price">$${product.price.toFixed(2)}</div>
                <button class="add-to-cart-btn" data-id="${product.id}">Add to Cart</button>
            </div>
        </div>
    `).join('');
}

// Function to update the cart count bubble
function updateCartIconCount() {
    cartCountElement.textContent = getCartCount();
}

// Function to display items in the cart modal
function displayCartItems() {
    const cartItems = getCartDetails();
    cartItemsContainer.innerHTML = ''; // Clear previous items

    if (cartItems.length === 0) {
        cartItemsContainer.innerHTML = '<p>Your cart is currently empty.</p>';
        return;
    }

    cartItems.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.classList.add('cart-item');
        itemElement.innerHTML = `
            <img src="${item.image}" alt="${item.name}">
            <div class="cart-item-info">
                <h4>${item.name}</h4>
                <p>$${item.price.toFixed(2)}</p>
            </div>
            <div class="cart-item-quantity">
                <input type="number" value="${item.quantity}" min="1" data-id="${item.id}">
            </div>
            <button class="remove-item-btn" data-id="${item.id}">&times;</button>
        `;
        cartItemsContainer.appendChild(itemElement);
    });
}

// Function to update the total price in the cart
function updateCartTotal() {
    cartTotalElement.textContent = getCartTotal().toFixed(2);
}

// --- MODAL FUNCTIONS ---

function openCartModal() {
    displayCartItems();
    updateCartTotal();
    cartModal.style.display = 'block';
}

function closeCartModal() {
    cartModal.style.display = 'none';
}

// --- INITIALIZATION and EVENT LISTENERS ---

// Fetches products from JSON and initializes the app
async function initializeApp() {
    try {
        const response = await fetch('data/products.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        allProducts = await response.json();
        
        loadCartFromStorage();
        displayProducts();
        updateCartIconCount();
    } catch (error) {
        console.error("Could not fetch products:", error);
        productList.innerHTML = '<p>Sorry, we couldn\'t load our products. Please try again later.</p>';
    }
}

// Event Listeners
document.addEventListener('DOMContentLoaded', initializeApp);

// Listener for adding products to the cart
productList.addEventListener('click', (e) => {
    if (e.target.classList.contains('add-to-cart-btn')) {
        const productId = e.target.getAttribute('data-id');
        addToCart(productId);
        updateCartIconCount();
    }
});

// Listeners for cart modal
cartIcon.addEventListener('click', openCartModal);
closeModalButton.addEventListener('click', closeCartModal);
window.addEventListener('click', (e) => {
    if (e.target === cartModal) {
        closeCartModal();
    }
});

// Listener for actions within the cart (quantity change, remove item)
cartItemsContainer.addEventListener('change', (e) => {
    if (e.target.matches('input[type="number"]')) {
        const productId = e.target.getAttribute('data-id');
        const quantity = parseInt(e.target.value, 10);
        
        // Basic error handling for quantity
        if (quantity < 0) {
            alert("Quantity cannot be negative!");
            e.target.value = 1; // Reset to 1
            return;
        }

        updateQuantity(productId, quantity);
        // Refresh the view
        displayCartItems();
        updateCartTotal();
        updateCartIconCount();
    }
});

cartItemsContainer.addEventListener('click', (e) => {
    if (e.target.classList.contains('remove-item-btn')) {
        const productId = e.target.getAttribute('data-id');
        // Setting quantity to 0 effectively removes it
        updateQuantity(productId, 0); 
        // Refresh the view
        displayCartItems();
        updateCartTotal();
        updateCartIconCount();
    }
});

// Listener for clearing the cart
clearCartBtn.addEventListener('click', () => {
    if (confirm("Are you sure you want to clear the entire cart?")) {
        clearCart();
        displayCartItems();
        updateCartTotal();
        updateCartIconCount();
    }
});

// Listener for checkout
checkoutBtn.addEventListener('click', () => {
    if(getCartCount() === 0) {
        alert("Your cart is empty!");
        return;
    }
    alert(`Thank you for your purchase! Your total is $${getCartTotal().toFixed(2)}.`);
    clearCart();
    closeCartModal();
    updateCartIconCount();
});