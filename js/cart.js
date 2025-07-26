// A simple "in-memory" database of products. In a real app, this would be fetched from an API.
let allProducts = [];

// The shopping cart, an array of { id, quantity } objects.
let cart = [];

// Function to load the cart from localStorage
function loadCartFromStorage() {
    const storedCart = localStorage.getItem('shoppingCart');
    if (storedCart) {
        cart = JSON.parse(storedCart);
    }
}

// Function to save the cart to localStorage
function saveCartToStorage() {
    localStorage.setItem('shoppingCart', JSON.stringify(cart));
}

// Function to add a product to the cart
function addToCart(productId) {
    const productIdNum = parseInt(productId, 10);
    const existingItem = cart.find(item => item.id === productIdNum);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ id: productIdNum, quantity: 1 });
    }
    saveCartToStorage();
}

// Function to update the quantity of a cart item
function updateQuantity(productId, quantity) {
    const productIdNum = parseInt(productId, 10);
    const quantityNum = parseInt(quantity, 10);
    const itemInCart = cart.find(item => item.id === productIdNum);

    if (itemInCart) {
        if (quantityNum > 0) {
            itemInCart.quantity = quantityNum;
        } else {
            // Remove the item if quantity is 0 or less
            cart = cart.filter(item => item.id !== productIdNum);
        }
    }
    saveCartToStorage();
}

// Function to get the total number of items in the cart
function getCartCount() {
    return cart.reduce((total, item) => total + item.quantity, 0);
}

// Function to get the full cart details (with product info)
function getCartDetails() {
    return cart.map(item => {
        const product = allProducts.find(p => p.id === item.id);
        return {
            ...product,
            quantity: item.quantity
        };
    }).filter(item => item.id); // Filter out any potential mismatches
}

// Function to calculate the total price of the cart
function getCartTotal() {
    return getCartDetails().reduce((total, item) => total + (item.price * item.quantity), 0);
}

// Function to clear the cart
function clearCart() {
    cart = [];
    saveCartToStorage();
}