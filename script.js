document.addEventListener('DOMContentLoaded', function () {
    const navLinks = document.querySelectorAll('nav a');
    const cartCountElement = document.getElementById('cart-count');
    const cartButton = document.getElementById('cart-button');
    const cartSummary = document.getElementById('cart-summary');
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    const clearCartButton = document.getElementById('clear-cart');
    const addButtons = document.querySelectorAll('.product-card button');

    if (navLinks.length) {
        navLinks.forEach(link => {
            if (link.href === window.location.href || link.href === window.location.pathname) {
                link.classList.add('active');
            }
        });
    }

    let cart = loadCart();
    updateCartDisplay();

    if (cartButton) {
        cartButton.addEventListener('click', () => {
            if (cartSummary) {
                cartSummary.classList.toggle('d-none');
            }
        });
    }

    if (clearCartButton) {
        clearCartButton.addEventListener('click', () => {
            cart = [];
            saveCart();
            updateCartDisplay();
            renderCartItems();
        });
    }

    addButtons.forEach(button => {
        button.addEventListener('click', () => {
            const card = button.closest('.product-card');
            if (!card) return;

            const product = {
                id: card.dataset.id,
                name: card.dataset.name,
                price: Number(card.dataset.price),
            };

            addToCart(product);
        });
    });

    function loadCart() {
        const storedCart = localStorage.getItem('marcostechCart');
        return storedCart ? JSON.parse(storedCart) : [];
    }

    function saveCart() {
        localStorage.setItem('marcostechCart', JSON.stringify(cart));
    }

    function addToCart(product) {
        const existing = cart.find(item => item.id === product.id);
        if (existing) {
            existing.quantity += 1;
        } else {
            cart.push({ ...product, quantity: 1 });
        }
        saveCart();
        updateCartDisplay();
        renderCartItems();
    }

    function updateCartDisplay() {
        const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);
        const totalAmount = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

        if (cartCountElement) {
            cartCountElement.textContent = totalQuantity;
        }
        if (cartTotal) {
            cartTotal.textContent = totalAmount.toFixed(2);
        }
        if (cartSummary && !cartSummary.classList.contains('d-none')) {
            renderCartItems();
        }
    }

    function renderCartItems() {
        if (!cartItemsContainer) return;
        cartItemsContainer.innerHTML = '';

        if (!cart.length) {
            cartItemsContainer.innerHTML = '<p>Your cart is empty.</p>';
            return;
        }

        cart.forEach(item => {
            const row = document.createElement('div');
            row.className = 'cart-item';
            row.innerHTML = `
                <div>
                    <strong>${item.name}</strong>
                    <p>${item.quantity} × $${item.price.toFixed(2)}</p>
                </div>
                <div>$${(item.price * item.quantity).toFixed(2)}</div>
            `;
            cartItemsContainer.appendChild(row);
        });
    }
});
