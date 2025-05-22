// Variables globales
let cart = [];
let currentCategory = null;

// Cargar productos al inicio
document.addEventListener('DOMContentLoaded', () => {
    // Inicializar el carrito desde localStorage
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCartUI();
    }
    
    // Eventos de los botones de explorar
    const exploreBtns = document.querySelectorAll('.explore-btn');
    exploreBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            currentCategory = btn.getAttribute('data-category');
            loadProductsByCategory(currentCategory);
        });
    });
    
    // Evento del buscador
    const searchInput = document.getElementById('search-input');
    searchInput.addEventListener('input', filterProducts);
    
    // Eventos del carrusel
    const prevBtn = document.querySelector('.carousel-prev');
    const nextBtn = document.querySelector('.carousel-next');
    const carouselContainer = document.querySelector('.carousel-container');
    let currentSlide = 0;
    
    prevBtn.addEventListener('click', () => {
        currentSlide = (currentSlide - 1 + 3) % 3;
        updateCarousel();
    });
    
    nextBtn.addEventListener('click', () => {
        currentSlide = (currentSlide + 1) % 3;
        updateCarousel();
    });
    
    function updateCarousel() {
        carouselContainer.style.transform = `translateX(-${currentSlide * 100}%)`;
    }
    
    // Evento para abrir el carrito
    const cartButton = document.getElementById('cart-button');
    const cartModal = document.getElementById('cart-modal');
    const closeModal = document.querySelector('.close-modal');
    
    cartButton.addEventListener('click', () => {
        cartModal.style.display = 'block';
        updateCartUI();
    });
    
    closeModal.addEventListener('click', () => {
        cartModal.style.display = 'none';
    });
    
    window.addEventListener('click', (e) => {
        if (e.target === cartModal) {
            cartModal.style.display = 'none';
        }
    });
    
    // Evento del botón de pagar
    const payButton = document.getElementById('pay-button');
    payButton.addEventListener('click', showPaymentOptions);
    
    // Evento del formulario de contacto
    const contactForm = document.getElementById('contact-form');
    contactForm.addEventListener('submit', handleContactForm);
});

// Función para cargar productos por categoría
function loadProductsByCategory(category) {
    const productsGrid = document.getElementById('products-grid');
    productsGrid.innerHTML = '';
    
    let products = {
        'cafe': [
            { id: 1, name: 'Café Encanto', price: 350, image: 'products/cafe-encanto.jpg', },
            { id: 2, name: 'cafeTAL', price: 420, image: 'products/cafe-tal.jpg' },
            { id: 3, name: 'Toledano', price: 480, image: 'products/toledano.jpg' },
            { id: 4, name: 'La Sierra', price: 500, image: 'products/la-sierra.jpg' },
            { id: 5, name: 'Olimpo', price: 450, image: 'products/olimpo.jpg' }

        ],
        'chocolate': [
            { id: 6, name: 'Cremosito', price: 400, image: 'products/cremosito.jpg' },
            { id: 7, name: 'Cacoa', price: 480, image: 'products/cacoa.jpg' },
            { id: 8, name: 'Chispita', price: 520, image: 'products/chispita.jpg' },
            { id: 9, name: 'Encantado', price: 580, image: 'products/encantado.jpg' },
            { id: 10, name: 'De la Tierrita', price: 650, image: 'products/delatierrita.jpg' }
        ],
        'miel': [
            { id: 11, name: 'Oro', price: 250, image: 'products/ miel-oro.jpg' },
            { id: 12, name: 'Criolla', price: 320, image: 'products/miel-criolla.jpg' },
            { id: 13, name: 'El Campo', price: 380, image: 'products/elcampo.jpg' },
            { id: 14, name: 'Vida', price: 400, image: 'products/miel-vida.jpg' },
            { id: 15, name: 'La Obrera', price: 420, image: 'products/laobrera.jpg' }
        ]
    };
    
    // Mostrar productos de la categoría seleccionada
    products[category].forEach(product => {
        const productCard = createProductCard(product);
        productsGrid.appendChild(productCard);
    });
}

// Crear tarjeta de producto
function createProductCard(product) {
    const productCard = document.createElement('div');
    productCard.className = 'product-card';
    
    productCard.innerHTML = `
        <img src="${product.image}" alt="${product.name}">
        <div class="product-info">
            <h3>${product.name}</h3>
            <p class="price">$${product.price}/kg</p>
            <div class="quantity-selector">
                <button class="decrease-qty" data-id="${product.id}">-</button>
                <span class="quantity" data-id="${product.id}">1</span>
                <button class="increase-qty" data-id="${product.id}">+</button>
            </div>
            <button class="add-to-cart" data-id="${product.id}">Añadir al carrito</button>
        </div>
    `;
    
    // Agregar eventos a los botones de cantidad y añadir al carrito
    const decreaseBtn = productCard.querySelector('.decrease-qty');
    const increaseBtn = productCard.querySelector('.increase-qty');
    const addBtn = productCard.querySelector('.add-to-cart');
    
    decreaseBtn.addEventListener('click', () => {
        const quantity = parseInt(productCard.querySelector('.quantity').textContent);
        if (quantity > 1) {
            productCard.querySelector('.quantity').textContent = quantity - 1;
        }
    });
    
    increaseBtn.addEventListener('click', () => {
        const quantity = parseInt(productCard.querySelector('.quantity').textContent);
        productCard.querySelector('.quantity').textContent = quantity + 1;
    });
    
    addBtn.addEventListener('click', () => {
        const quantity = parseInt(productCard.querySelector('.quantity').textContent);
        addToCart(product, quantity);
    });
    
    return productCard;
}

// Filtrar productos por búsqueda
function filterProducts() {
    const searchTerm = document.getElementById('search-input').value.toLowerCase();
    const productCards = document.querySelectorAll('.product-card');
    
    productCards.forEach(card => {
        const productName = card.querySelector('h3').textContent.toLowerCase();
        if (productName.includes(searchTerm)) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

// Añadir producto al carrito
function addToCart(product, quantity) {
    // Verificar si el producto ya está en el carrito
    const existingIndex = cart.findIndex(item => item.id === product.id);
    
    if (existingIndex !== -1) {
        // Actualizar la cantidad
        cart[existingIndex].quantity += quantity;
    } else {
        // Agregar nuevo producto
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            quantity: quantity,
            image: product.image
        });
    }
    
    // Guardar en localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Actualizar la UI del carrito
    updateCartUI();
    
    // Mostrar notificación
    showNotification(`${quantity} ${product.name} ${quantity > 1 ? 'añadidos' : 'añadido'} al carrito`);
}

// Actualizar la UI del carrito
function updateCartUI() {
    const cartItems = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total-amount');
    const cartCount = document.querySelector('.cart-count');
    
    // Actualizar contador del carrito
    let totalItems = 0;
    cart.forEach(item => {
        totalItems += item.quantity;
    });
    cartCount.textContent = totalItems;
    
    // Mostrar productos en el carrito
    if (cart.length === 0) {
        cartItems.innerHTML = `
            <div class="empty-cart">
                <p>El carrito está vacío</p>
            </div>
        `;
    } else {
        cartItems.innerHTML = '';
        let totalAmount = 0;
        
        cart.forEach(item => {
            const subtotal = item.price * item.quantity;
            totalAmount += subtotal;
            
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            cartItem.innerHTML = `
                <div class="cart-item-info">
                    <h4>${item.name}</h4>
                    <p>$${item.price} x ${item.quantity} = $${subtotal}</p>
                </div>
                <div class="cart-item-quantity">
                    <button class="decrease-cart-qty" data-id="${item.id}">-</button>
                    <span class="cart-quantity">${item.quantity}</span>
                    <button class="increase-cart-qty" data-id="${item.id}">+</button>
                </div>
            `;
            
            // Agregar eventos a los botones del carrito
            const decreaseBtn = cartItem.querySelector('.decrease-cart-qty');
            const increaseBtn = cartItem.querySelector('.increase-cart-qty');
            
            decreaseBtn.addEventListener('click', () => {
                updateCartQuantity(item.id, -1);
            });
            
            increaseBtn.addEventListener('click', () => {
                updateCartQuantity(item.id, 1);
            });
            
            cartItems.appendChild(cartItem);
        });
        
        cartTotal.textContent = totalAmount;
    }
}

// Actualizar cantidad en el carrito
function updateCartQuantity(productId, change) {
    const productIndex = cart.findIndex(item => item.id === productId);
    
    if (productIndex !== -1) {
        cart[productIndex].quantity += change;
        
        if (cart[productIndex].quantity <= 0) {
            cart.splice(productIndex, 1);
        }
        
        // Guardar en localStorage
        localStorage.setItem('cart', JSON.stringify(cart));
        
        // Actualizar la UI del carrito
        updateCartUI();
    }
}

// Mostrar opciones de pago
function showPaymentOptions() {
    if (cart.length === 0) {
        alert('Tu carrito está vacío. Por favor, agrega productos antes de pagar.');
        return;
    }
    
    const paymentOptions = `
        <div class="payment-options">
            <h3>Opciones de pago</h3>
            <div class="payment-method">
                <input type="radio" id="tarjeta" name="payment-method" value="tarjeta" checked>
                <label for="tarjeta">Tarjeta de crédito/débito</label>
            </div>
            <div class="payment-method">
                <input type="radio" id="transferencia" name="payment-method" value="transferencia">
                <label for="transferencia">Transferencia bancaria</label>
            </div>
            <div class="payment-method">
                <input type="radio" id="mercadopago" name="payment-method" value="mercadopago">
                <label for="mercadopago">Mercado Pago</label>
            </div>
            <button class="confirm-payment">Confirmar Pago</button>
        </div>
    `;
    
    document.querySelector('.cart-total').insertAdjacentHTML('beforebegin', paymentOptions);
    
    const confirmPaymentBtn = document.querySelector('.confirm-payment');
    confirmPaymentBtn.addEventListener('click', () => {
        alert('¡Gracias por tu compra! Recibirás un correo con los detalles de tu pedido.');
        cart = [];
        localStorage.removeItem('cart');
        updateCartUI();
        document.getElementById('cart-modal').style.display = 'none';
    });
}

// Manejar el formulario de contacto
function handleContactForm(e) {
    e.preventDefault();
    
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const message = document.getElementById('message').value;
    
    // Validación básica
    if (!name || !email || !message) {
        alert('Por favor, completa los campos obligatorios.');
        return;
    }
    
    // Simular envío de formulario
    alert(`¡Gracias ${name}! Tu mensaje ha sido enviado. Nos pondremos en contacto contigo a la brevedad.`);
    contactForm.reset();
}

// Mostrar notificación
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Estilos para la notificación (podría ir en CSS pero se incluye aquí por simplicidad)
const style = document.createElement('style');
style.textContent = `
    .notification {
        position: fixed;
        top: 20px;
        right: 20px;
        background-color: var(--chocolate);
        color: white;
        padding: 15px 20px;
        border-radius: 5px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        transform: translateX(120%);
        transition: transform 0.3s;
        z-index: 1000;
    }
    
    .notification.show {
        transform: translateX(0);
    }
    
    .payment-options {
        background-color: #f9f9f9;
        padding: 1rem;
        border-radius: 5px;
        margin-bottom: 1rem;
    }
    
    .payment-method {
        margin: 0.5rem 0;
    }
    
    .confirm-payment {
        background-color: var(--cafe-oscuro);
        color: white;
        border: none;
        padding: 8px 15px;
        border-radius: 5px;
        margin-top: 1rem;
        cursor: pointer;
    }
`;
document.head.appendChild(style);

document.addEventListener('DOMContentLoaded', () => {
    const hamburgerMenu = document.querySelector('.hamburger-menu');
    const navigation = document.querySelector('.navigation');
    const navLinks = document.querySelectorAll('.nav-links a');

    // Alternar el menú cuando se haga click en el botón de hamburguesa
    hamburgerMenu.addEventListener('click', () => {
        hamburgerMenu.classList.toggle('active');
        navigation.classList.toggle('active');
    });

    // Cerrar el menú cuando se haga click en un enlace de navegación
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburgerMenu.classList.remove('active');
            navigation.classList.remove('active');
        });
    });

    // Opcional: Cerrar menú al hacer click fuera
    document.addEventListener('click', (e) => {
        if (!hamburgerMenu.contains(e.target) && 
            !navigation.contains(e.target)) {
            hamburgerMenu.classList.remove('active');
            navigation.classList.remove('active');
        }
    });
});