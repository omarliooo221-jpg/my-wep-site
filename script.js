/* =====================================================
   ELZALAT STORE
   MAIN WEBSITE
   PRODUCTS + PRODUCT DETAILS + REAL CART + SEARCH
   + PRODUCT CATEGORIES + PRODUCT SORTING
   + CHECKOUT + ORDERS
===================================================== */


/* =====================================================
   GLOBAL PRODUCT STATE
===================================================== */

let allProducts = [];

let allCategories = [];

let currentSearchTerm = "";

let currentCategoryId = "all";

let currentSort = "newest";

const CART_STORAGE_KEY = "elzalat_store_cart";


/* =====================================================
   CART STORAGE
===================================================== */

function getCart() {

    try {

        const savedCart =
            localStorage.getItem(
                CART_STORAGE_KEY
            );

        if (!savedCart) {
            return [];
        }

        const cart =
            JSON.parse(savedCart);

        if (!Array.isArray(cart)) {
            return [];
        }

        return cart;

    } catch (error) {

        console.error(
            "Error reading cart:",
            error
        );

        return [];

    }

}


function saveCart(cart) {

    try {

        localStorage.setItem(
            CART_STORAGE_KEY,
            JSON.stringify(cart)
        );

    } catch (error) {

        console.error(
            "Error saving cart:",
            error
        );

    }

}


/* =====================================================
   LOAD PRODUCTS
===================================================== */

async function loadProducts() {

    const {
        data,
        error
    } = await supabaseClient
        .from("Products")
        .select("*")
        .order(
            "created_at",
            {
                ascending: false
            }
        );


    if (error) {

        console.error(
            "Error loading products:",
            error
        );

        allProducts = [];

        renderFilteredProducts();

        return;

    }


    console.log(
        "Products:",
        data
    );


    allProducts =
        Array.isArray(data)
            ? data
            : [];


    renderFilteredProducts();

    updateCartUI();

}


/* =====================================================
   LOAD CATEGORIES
===================================================== */

async function loadCategories() {

    const {
        data,
        error
    } = await supabaseClient
        .from("Categories")
        .select("*")
        .order(
            "created_at",
            {
                ascending: true
            }
        );


    if (error) {

        console.error(
            "Error loading categories:",
            error
        );

        allCategories = [];

        renderCategoryButtons();

        return;

    }


    console.log(
        "Categories:",
        data
    );


    allCategories =
        Array.isArray(data)
            ? data
            : [];


    renderCategoryButtons();

}


/* =====================================================
   RENDER CATEGORY BUTTONS
===================================================== */

function renderCategoryButtons() {

    const categoriesContainer =
        document.querySelector(
            "#product-categories"
        );


    if (!categoriesContainer) {
        return;
    }


    categoriesContainer.innerHTML = "";


    const allButton =
        document.createElement("button");


    allButton.type =
        "button";


    allButton.className =
        "category-filter";


    allButton.dataset.category =
        "all";


    allButton.textContent =
        "All";


    if (
        currentCategoryId ===
        "all"
    ) {

        allButton.classList.add(
            "active"
        );

    }


    categoriesContainer.appendChild(
        allButton
    );


    allCategories.forEach(
        function (category) {

            const button =
                document.createElement("button");


            button.type =
                "button";


            button.className =
                "category-filter";


            button.dataset.category =
                category.id;


            button.textContent =
                category.name;


            if (
                String(currentCategoryId) ===
                String(category.id)
            ) {

                button.classList.add(
                    "active"
                );

            }


            categoriesContainer.appendChild(
                button
            );

        }
    );

}


/* =====================================================
   PRODUCT SORTING UI
===================================================== */

function createProductSortUI() {

    const productsSection =
        document.querySelector(
            ".products"
        );


    const productsGrid =
        document.querySelector(
            ".product-grid"
        );


    if (
        !productsSection ||
        !productsGrid
    ) {

        return;

    }


    if (
        document.querySelector(
            "#product-sort"
        )
    ) {

        return;

    }


    const sortArea =
        document.createElement("div");


    sortArea.className =
        "product-sort-area";


    sortArea.innerHTML = `

        <label
            for="product-sort"
            class="product-sort-label"
        >
            SORT BY
        </label>

        <select
            id="product-sort"
            class="product-sort-select"
            aria-label="Sort products"
        >

            <option value="newest">
                Newest
            </option>

            <option value="price-low">
                Price: Low to High
            </option>

            <option value="price-high">
                Price: High to Low
            </option>

            <option value="name-az">
                Name: A to Z
            </option>

        </select>

    `;


    productsGrid.parentNode.insertBefore(
        sortArea,
        productsGrid
    );

}


/* =====================================================
   SORT PRODUCTS
===================================================== */

function sortProducts(products) {

    const sortedProducts =
        [...products];


    sortedProducts.sort(
        function (a, b) {

            if (
                currentSort ===
                "price-low"
            ) {

                return (
                    Number(a.price || 0) -
                    Number(b.price || 0)
                );

            }


            if (
                currentSort ===
                "price-high"
            ) {

                return (
                    Number(b.price || 0) -
                    Number(a.price || 0)
                );

            }


            if (
                currentSort ===
                "name-az"
            ) {

                return String(
                    a.name || ""
                ).localeCompare(
                    String(
                        b.name || ""
                    ),
                    "en",
                    {
                        sensitivity: "base"
                    }
                );

            }


            /* -------------------------------------
               DEFAULT: NEWEST
            ------------------------------------- */

            const dateA =
                new Date(
                    a.created_at || 0
                ).getTime();


            const dateB =
                new Date(
                    b.created_at || 0
                ).getTime();


            return dateB - dateA;

        }
    );


    return sortedProducts;

}


/* =====================================================
   FILTER PRODUCTS
===================================================== */

function getFilteredProducts() {

    let filteredProducts =
        [...allProducts];


    /* -----------------------------------------
       CATEGORY FILTER
    ----------------------------------------- */

    if (
        currentCategoryId !==
        "all"
    ) {

        filteredProducts =
            filteredProducts.filter(
                function (product) {

                    return String(
                        product.category_id || ""
                    ) === String(
                        currentCategoryId
                    );

                }
            );

    }


    /* -----------------------------------------
       SEARCH FILTER
    ----------------------------------------- */

    if (currentSearchTerm) {

        filteredProducts =
            filteredProducts.filter(
                function (product) {

                    const productName =
                        String(
                            product.name || ""
                        ).toLowerCase();


                    const productDescription =
                        String(
                            product.description || ""
                        ).toLowerCase();


                    return (
                        productName.includes(
                            currentSearchTerm
                        ) ||

                        productDescription.includes(
                            currentSearchTerm
                        )
                    );

                }
            );

    }


    /* -----------------------------------------
       SORT
    ----------------------------------------- */

    filteredProducts =
        sortProducts(
            filteredProducts
        );


    return filteredProducts;

}


/* =====================================================
   RENDER FILTERED PRODUCTS
===================================================== */

function renderFilteredProducts() {

    const filteredProducts =
        getFilteredProducts();


    renderProducts(
        filteredProducts
    );


    updateSearchResultsInfo(
        filteredProducts.length,
        Boolean(currentSearchTerm)
    );

}


/* =====================================================
   RENDER PRODUCTS
===================================================== */

function renderProducts(products) {

    const productsContainer =
        document.querySelector(
            ".product-grid"
        );


    if (!productsContainer) {

        console.error(
            "Product container not found"
        );

        return;

    }


    productsContainer.innerHTML = "";


    if (
        !products ||
        products.length === 0
    ) {

        let emptyMessage =
            "No products available yet.";


        if (currentSearchTerm) {

            emptyMessage =
                "No products found.";

        } else if (
            currentCategoryId !==
            "all"
        ) {

            emptyMessage =
                "No products in this category.";

        }


        productsContainer.innerHTML = `

            <div class="empty-products">

                <p>
                    ${emptyMessage}
                </p>

            </div>

        `;

        return;

    }


    products.forEach(
        function (product) {

            const productCard =
                document.createElement("div");


            productCard.className =
                "product";


            productCard.dataset.productId =
                product.id;


            productCard.innerHTML = `

                <div
                    class="product-image product-details-trigger"
                    data-product-id="${escapeHtml(product.id)}"
                    role="button"
                    tabindex="0"
                    aria-label="View ${escapeHtml(product.name)}"
                >

                    <img
                        src="${escapeHtml(product.image_url || "")}"
                        alt="${escapeHtml(product.name)}"
                    >

                    <div class="product-view-overlay">
                        VIEW DETAILS
                    </div>

                </div>

                <h3>
                    ${escapeHtml(product.name)}
                </h3>

                <p>
                    ${escapeHtml(
                        formatPrice(product.price)
                    )} EGP
                </p>

                <div class="product-actions">

                    <button
                        class="product-view-btn"
                        type="button"
                        data-product-id="${escapeHtml(product.id)}"
                    >
                        VIEW DETAILS
                    </button>

                    <button
                        class="product-cart-btn"
                        type="button"
                        data-product-id="${escapeHtml(product.id)}"
                    >
                        ADD TO CART
                    </button>

                </div>

            `;


            productsContainer.appendChild(
                productCard
            );

        }
    );

}


/* =====================================================
   CATEGORY FILTER
===================================================== */

function filterByCategory(categoryId) {

    currentCategoryId =
        categoryId || "all";


    const categoryButtons =
        document.querySelectorAll(
            ".category-filter"
        );


    categoryButtons.forEach(
        function (button) {

            const buttonCategory =
                button.dataset.category;


            button.classList.toggle(
                "active",
                String(buttonCategory) ===
                String(currentCategoryId)
            );

        }
    );


    renderFilteredProducts();

}


/* =====================================================
   SEARCH PRODUCTS
===================================================== */

function searchProducts(searchTerm) {

    currentSearchTerm =
        String(searchTerm || "")
            .trim()
            .toLowerCase();


    renderFilteredProducts();

}


/* =====================================================
   SEARCH RESULTS INFO
===================================================== */

function updateSearchResultsInfo(
    resultCount,
    isSearching
) {

    const info =
        document.querySelector(
            "#search-results-info"
        );


    if (!info) {
        return;
    }


    if (!isSearching) {

        info.textContent = "";

        return;

    }


    if (resultCount === 0) {

        info.textContent =
            "No products found.";

        return;

    }


    info.textContent =
        `${resultCount} product${
            resultCount === 1 ? "" : "s"
        } found`;

}


/* =====================================================
   PRICE FORMAT
===================================================== */

function formatPrice(price) {

    const number =
        Number(price);

    if (Number.isNaN(number)) {
        return "0";
    }

    return number.toLocaleString(
        "en-EG",
        {
            maximumFractionDigits: 2
        }
    );

}


/* =====================================================
   FIND PRODUCT
===================================================== */

function findProduct(productId) {

    return allProducts.find(
        function (product) {

            return String(product.id) ===
                String(productId);

        }
    );

}


/* =====================================================
   ADD TO CART
===================================================== */

function addToCart(productId) {

    const product =
        findProduct(productId);


    if (!product) {

        console.error(
            "Product not found:",
            productId
        );

        return;

    }


    const cart =
        getCart();


    const existingItem =
        cart.find(
            function (item) {

                return String(item.id) ===
                    String(product.id);

            }
        );


    if (existingItem) {

        existingItem.quantity += 1;

    } else {

        cart.push({

            id: product.id,

            name: product.name,

            price: Number(product.price) || 0,

            image_url: product.image_url || "",

            quantity: 1

        });

    }


    saveCart(cart);

    updateCartUI();

    showCartMessage(
        `${product.name} added to cart`
    );

}


/* =====================================================
   REMOVE FROM CART
===================================================== */

function removeFromCart(productId) {

    let cart =
        getCart();


    cart =
        cart.filter(
            function (item) {

                return String(item.id) !==
                    String(productId);

            }
        );


    saveCart(cart);

    updateCartUI();

    renderCart();

}


/* =====================================================
   INCREASE QUANTITY
===================================================== */

function increaseCartQuantity(productId) {

    const cart =
        getCart();


    const item =
        cart.find(
            function (cartItem) {

                return String(cartItem.id) ===
                    String(productId);

            }
        );


    if (!item) {
        return;
    }


    item.quantity += 1;


    saveCart(cart);

    updateCartUI();

    renderCart();

}


/* =====================================================
   DECREASE QUANTITY
===================================================== */

function decreaseCartQuantity(productId) {

    const cart =
        getCart();


    const item =
        cart.find(
            function (cartItem) {

                return String(cartItem.id) ===
                    String(productId);

            }
        );


    if (!item) {
        return;
    }


    if (item.quantity > 1) {

        item.quantity -= 1;

    } else {

        removeFromCart(productId);

        return;

    }


    saveCart(cart);

    updateCartUI();

    renderCart();

}


/* =====================================================
   CART COUNT
===================================================== */

function getCartCount() {

    const cart =
        getCart();


    return cart.reduce(
        function (total, item) {

            return total +
                Number(item.quantity || 0);

        },
        0
    );

}


/* =====================================================
   CART TOTAL
===================================================== */

function getCartTotal() {

    const cart =
        getCart();


    return cart.reduce(
        function (total, item) {

            return total +
                (
                    Number(item.price) *
                    Number(item.quantity)
                );

        },
        0
    );

}


/* =====================================================
   UPDATE CART BUTTON
===================================================== */

function updateCartUI() {

    const cartButtons =
        document.querySelectorAll(
            ".cart"
        );


    const count =
        getCartCount();


    cartButtons.forEach(
        function (button) {

            button.textContent =
                `Cart (${count})`;

        }
    );

}


/* =====================================================
   CART MESSAGE
===================================================== */

function showCartMessage(message) {

    let messageElement =
        document.querySelector(
            ".cart-toast"
        );


    if (!messageElement) {

        messageElement =
            document.createElement("div");

        messageElement.className =
            "cart-toast";

        document.body.appendChild(
            messageElement
        );

    }


    messageElement.textContent =
        message;


    messageElement.classList.add(
        "show"
    );


    clearTimeout(
        window.cartToastTimer
    );


    window.cartToastTimer =
        setTimeout(
            function () {

                messageElement.classList.remove(
                    "show"
                );

            },
            2200
        );

}


/* =====================================================
   PRODUCT DETAILS MODAL
===================================================== */

function openProductDetails(productId) {

    const product =
        findProduct(productId);


    if (!product) {
        return;
    }


    const existingModal =
        document.querySelector(
            ".product-modal"
        );


    if (existingModal) {

        existingModal.remove();

    }


    const relatedProducts =
        allProducts.filter(
            function (item) {

                return String(item.id) !==
                    String(product.id);

            }
        ).slice(0, 3);


    const modal =
        document.createElement("div");


    modal.className =
        "product-modal";


    modal.innerHTML = `

        <div
            class="product-modal-backdrop"
            data-close-product-modal="true"
        ></div>

        <div
            class="product-modal-content"
            role="dialog"
            aria-modal="true"
            aria-label="${escapeHtml(product.name)}"
        >

            <button
                class="modal-close"
                type="button"
                aria-label="Close"
                data-close-product-modal="true"
            >
                ×
            </button>


            <div class="product-detail-grid">

                <div class="product-detail-image">

                    <img
                        src="${escapeHtml(product.image_url || "")}"
                        alt="${escapeHtml(product.name)}"
                    >

                </div>


                <div class="product-detail-info">

                    <p class="product-detail-label">
                        PRODUCT DETAILS
                    </p>

                    <h2>
                        ${escapeHtml(product.name)}
                    </h2>

                    <p class="product-detail-price">
                        ${escapeHtml(
                            formatPrice(product.price)
                        )} EGP
                    </p>

                    <div class="product-detail-description">

                        ${
                            product.description
                                ? escapeHtml(
                                    product.description
                                )
                                : "Premium product designed with quality and confidence in mind."
                        }

                    </div>


                    <button
                        class="detail-add-cart"
                        type="button"
                        data-add-detail-cart="${escapeHtml(product.id)}"
                    >
                        ADD TO CART
                    </button>

                </div>

            </div>


            ${
                relatedProducts.length > 0
                    ? `

                        <div class="related-products">

                            <div class="related-title">

                                <p>
                                    YOU MAY ALSO LIKE
                                </p>

                                <h3>
                                    Related Products
                                </h3>

                            </div>


                            <div class="related-grid">

                                ${relatedProducts.map(
                                    function (related) {

                                        return `

                                            <div
                                                class="related-card"
                                                data-related-product="${escapeHtml(related.id)}"
                                            >

                                                <div class="related-image">

                                                    <img
                                                        src="${escapeHtml(related.image_url || "")}"
                                                        alt="${escapeHtml(related.name)}"
                                                    >

                                                </div>

                                                <h4>
                                                    ${escapeHtml(related.name)}
                                                </h4>

                                                <p>
                                                    ${escapeHtml(
                                                        formatPrice(
                                                            related.price
                                                        )
                                                    )} EGP
                                                </p>

                                            </div>

                                        `;

                                    }
                                ).join("")}

                            </div>

                        </div>

                    `
                    : ""
            }

        </div>

    `;


    document.body.appendChild(
        modal
    );


    document.body.classList.add(
        "modal-open"
    );


    requestAnimationFrame(
        function () {

            modal.classList.add(
                "show"
            );

        }
    );

}


/* =====================================================
   CLOSE PRODUCT MODAL
===================================================== */

function closeProductModal() {

    const modal =
        document.querySelector(
            ".product-modal"
        );


    if (!modal) {
        return;
    }


    modal.classList.remove(
        "show"
    );


    setTimeout(
        function () {

            modal.remove();

            document.body.classList.remove(
                "modal-open"
            );

        },
        250
    );

}


/* =====================================================
   CART MODAL
===================================================== */

function openCart() {

    const existingCart =
        document.querySelector(
            ".cart-modal"
        );


    if (existingCart) {

        renderCart();

        existingCart.classList.add(
            "show"
        );

        document.body.classList.add(
            "modal-open"
        );

        return;

    }


    const modal =
        document.createElement("div");


    modal.className =
        "cart-modal";


    modal.innerHTML = `

        <div
            class="cart-modal-backdrop"
            data-close-cart="true"
        ></div>


        <aside
            class="cart-panel"
            role="dialog"
            aria-modal="true"
            aria-label="Shopping Cart"
        >

            <div class="cart-header">

                <div>

                    <p>
                        YOUR BAG
                    </p>

                    <h2>
                        Shopping Cart
                    </h2>

                </div>


                <button
                    class="modal-close cart-close"
                    type="button"
                    aria-label="Close cart"
                    data-close-cart="true"
                >
                    ×
                </button>

            </div>


            <div class="cart-items"></div>


            <div class="cart-footer">

                <div class="cart-total-row">

                    <span>
                        Subtotal
                    </span>

                    <strong class="cart-subtotal">
                        0 EGP
                    </strong>

                </div>


                <div class="cart-total-row cart-total-main">

                    <span>
                        Total
                    </span>

                    <strong class="cart-total">
                        0 EGP
                    </strong>

                </div>


                <button
                    class="checkout-placeholder"
                    type="button"
                >
                    CHECKOUT
                </button>


                <p class="checkout-note">
                    Complete your order securely.
                </p>

            </div>

        </aside>

    `;


    document.body.appendChild(
        modal
    );


    document.body.classList.add(
        "modal-open"
    );


    requestAnimationFrame(
        function () {

            modal.classList.add(
                "show"
            );

        }
    );


    renderCart();

}


/* =====================================================
   CLOSE CART
===================================================== */

function closeCart() {

    const modal =
        document.querySelector(
            ".cart-modal"
        );


    if (!modal) {
        return;
    }


    modal.classList.remove(
        "show"
    );


    setTimeout(
        function () {

            modal.remove();

            document.body.classList.remove(
                "modal-open"
            );

        },
        250
    );

}


/* =====================================================
   RENDER CART
===================================================== */

function renderCart() {

    const itemsContainer =
        document.querySelector(
            ".cart-items"
        );


    if (!itemsContainer) {
        return;
    }


    const cart =
        getCart();


    const subtotal =
        getCartTotal();


    const subtotalElement =
        document.querySelector(
            ".cart-subtotal"
        );


    const totalElement =
        document.querySelector(
            ".cart-total"
        );


    if (subtotalElement) {

        subtotalElement.textContent =
            `${formatPrice(subtotal)} EGP`;

    }


    if (totalElement) {

        totalElement.textContent =
            `${formatPrice(subtotal)} EGP`;

    }


    if (cart.length === 0) {

        itemsContainer.innerHTML = `

            <div class="empty-cart">

                <div class="empty-cart-icon">
                    🛒
                </div>

                <h3>
                    Your cart is empty
                </h3>

                <p>
                    Add something you love and it will appear here.
                </p>

                <button
                    class="empty-cart-shop"
                    type="button"
                    data-close-cart="true"
                >
                    CONTINUE SHOPPING
                </button>

            </div>

        `;

        return;

    }


    itemsContainer.innerHTML =
        cart.map(
            function (item) {

                const itemTotal =
                    Number(item.price) *
                    Number(item.quantity);


                return `

                    <div
                        class="cart-item"
                        data-cart-item="${escapeHtml(item.id)}"
                    >

                        <div class="cart-item-image">

                            <img
                                src="${escapeHtml(item.image_url || "")}"
                                alt="${escapeHtml(item.name)}"
                            >

                        </div>


                        <div class="cart-item-info">

                            <h3>
                                ${escapeHtml(item.name)}
                            </h3>

                            <p>
                                ${escapeHtml(
                                    formatPrice(item.price)
                                )} EGP
                            </p>


                            <div class="cart-item-bottom">

                                <div class="quantity-controls">

                                    <button
                                        type="button"
                                        data-decrease="${escapeHtml(item.id)}"
                                        aria-label="Decrease quantity"
                                    >
                                        −
                                    </button>

                                    <span>
                                        ${item.quantity}
                                    </span>

                                    <button
                                        type="button"
                                        data-increase="${escapeHtml(item.id)}"
                                        aria-label="Increase quantity"
                                    >
                                        +
                                    </button>

                                </div>


                                <strong>
                                    ${escapeHtml(
                                        formatPrice(itemTotal)
                                    )} EGP
                                </strong>

                            </div>


                            <button
                                class="remove-cart-item"
                                type="button"
                                data-remove="${escapeHtml(item.id)}"
                            >
                                Remove
                            </button>

                        </div>

                    </div>

                `;

            }
        ).join("");

}


/* =====================================================
   CHECKOUT
===================================================== */

function openCheckout() {

    const cart =
        getCart();


    if (cart.length === 0) {

        showCartMessage(
            "Your cart is empty."
        );

        return;

    }


    const checkoutModal =
        document.querySelector(
            "#checkout-modal"
        );


    if (!checkoutModal) {

        console.error(
            "Checkout modal not found."
        );

        return;

    }


    renderCheckout();


    const cartModal =
        document.querySelector(
            ".cart-modal"
        );


    if (cartModal) {

        cartModal.classList.remove(
            "show"
        );

        setTimeout(
            function () {

                cartModal.remove();

            },
            250
        );

    }


    checkoutModal.classList.add(
        "show"
    );


    checkoutModal.setAttribute(
        "aria-hidden",
        "false"
    );


    document.body.classList.add(
        "modal-open"
    );

}


function closeCheckout() {

    const checkoutModal =
        document.querySelector(
            "#checkout-modal"
        );


    if (!checkoutModal) {
        return;
    }


    checkoutModal.classList.remove(
        "show"
    );


    checkoutModal.setAttribute(
        "aria-hidden",
        "true"
    );


    setTimeout(
        function () {

            const cartModal =
                document.querySelector(
                    ".cart-modal"
                );


            if (!cartModal) {

                document.body.classList.remove(
                    "modal-open"
                );

            }

        },
        250
    );

}


function renderCheckout() {

    const cart =
        getCart();


    const itemsContainer =
        document.querySelector(
            "#checkout-items"
        );


    const totalElement =
        document.querySelector(
            "#checkout-total"
        );


    if (!itemsContainer) {
        return;
    }


    const total =
        getCartTotal();


    if (totalElement) {

        totalElement.textContent =
            `${formatPrice(total)} EGP`;

    }


    if (cart.length === 0) {

        itemsContainer.innerHTML = `

            <div class="checkout-empty">

                <p>
                    Your cart is empty.
                </p>

            </div>

        `;

        return;

    }


    itemsContainer.innerHTML =
        cart.map(
            function (item) {

                const itemTotal =
                    Number(item.price) *
                    Number(item.quantity);


                return `

                    <div
                        class="checkout-item"
                        data-checkout-item="${escapeHtml(item.id)}"
                    >

                        <div class="checkout-item-image">

                            <img
                                src="${escapeHtml(item.image_url || "")}"
                                alt="${escapeHtml(item.name)}"
                            >

                        </div>


                        <div class="checkout-item-info">

                            <h4>
                                ${escapeHtml(item.name)}
                            </h4>

                            <p>
                                ${item.quantity} ×
                                ${escapeHtml(
                                    formatPrice(item.price)
                                )} EGP
                            </p>

                        </div>


                        <strong>
                            ${escapeHtml(
                                formatPrice(itemTotal)
                            )} EGP
                        </strong>

                    </div>

                `;

            }
        ).join("");

}


/* =====================================================
   SAVE ORDER
===================================================== */

async function handleCheckoutSubmit(event) {

    event.preventDefault();


    const form =
        event.target;


    const cart =
        getCart();


    if (cart.length === 0) {

        showCartMessage(
            "Your cart is empty."
        );

        return;

    }


    const submitButton =
        document.querySelector(
            "#place-order-btn"
        );


    if (submitButton) {

        submitButton.disabled = true;

        submitButton.textContent =
            "PLACING ORDER...";

    }


    try {

        const formData =
            new FormData(form);


        const customerName =
            String(
                formData.get("customer_name") || ""
            ).trim();


        const customerPhone =
            String(
                formData.get("customer_phone") || ""
            ).trim();


        const customerEmail =
            String(
                formData.get("customer_email") || ""
            ).trim();


        const customerAddress =
            String(
                formData.get("customer_address") || ""
            ).trim();


        const notes =
            String(
                formData.get("notes") || ""
            ).trim();


        if (
            !customerName ||
            !customerPhone ||
            !customerAddress
        ) {

            showCartMessage(
                "Please complete all required fields."
            );

            return;

        }


        const subtotal =
            getCartTotal();


        const total =
            subtotal;


        /* -----------------------------------------
           GENERATE ORDER ID LOCALLY
        ----------------------------------------- */

        const orderId =
            crypto.randomUUID();


        /* -----------------------------------------
           CREATE ORDER
        ----------------------------------------- */

        const {
            error: orderError
        } = await supabaseClient
            .from("Orders")
            .insert([
                {
                    id:
                        orderId,

                    customer_name:
                        customerName,

                    customer_phone:
                        customerPhone,

                    customer_email:
                        customerEmail || null,

                    customer_address:
                        customerAddress,

                    notes:
                        notes || null,

                    subtotal:
                        subtotal,

                    total:
                        total,

                    status:
                        "pending"
                }
            ]);


        if (orderError) {

            console.error(
                "Error creating order:",
                orderError
            );

            throw new Error(
                "We could not create your order."
            );

        }


        /* -----------------------------------------
           CREATE ORDER ITEMS
        ----------------------------------------- */

        const orderItems =
            cart.map(
                function (item) {

                    return {

                        order_id:
                            orderId,

                        product_id:
                            item.id,

                        product_name:
                            item.name,

                        price:
                            Number(item.price) || 0,

                        quantity:
                            Number(item.quantity) || 1

                    };

                }
            );


        const {
            error: itemsError
        } = await supabaseClient
            .from("OrderItems")
            .insert(
                orderItems
            );


        if (itemsError) {

            console.error(
                "Error creating order items:",
                itemsError
            );

            throw new Error(
                "The order was created, but its products could not be saved."
            );

        }


        /* -----------------------------------------
           ORDER SUCCESS
        ----------------------------------------- */

        saveCart([]);

        updateCartUI();

        form.reset();

        renderCheckout();

        closeCheckout();

        showCartMessage(
            `Order placed successfully! #${String(orderId).slice(0, 8)}`
        );

        console.log(
            "Order created successfully:",
            orderId
        );


    } catch (error) {

        console.error(
            "Checkout error:",
            error
        );


        showCartMessage(
            error.message ||
            "Something went wrong. Please try again."
        );


    } finally {

        if (submitButton) {

            submitButton.disabled = false;

            submitButton.textContent =
                "PLACE ORDER";

        }

    }

}


/* =====================================================
   LOAD STORE SETTINGS
===================================================== */

async function loadStoreSettings() {

    const {
        data,
        error
    } =
        await supabaseClient
            .from("StoreSettings")
            .select("*")
            .limit(1)
            .single();


    if (error) {

        console.error(
            "Error loading store settings:",
            error
        );

        return;

    }


    console.log(
        "Store settings:",
        data
    );


    /* -----------------------------------------
       STORE LOGO
    ----------------------------------------- */

    const storeLogo =
        document.querySelector(
            "#store-logo"
        );


    if (
        storeLogo &&
        data.logo_url
    ) {

        storeLogo.src =
            data.logo_url;

        storeLogo.alt =
            data.store_name ||
            "Store Logo";

    }


    /* -----------------------------------------
       STORE NAME
    ----------------------------------------- */

    const storeNameElements =
        document.querySelectorAll(
            ".store-name"
        );


    storeNameElements.forEach(
        function (element) {

            if (data.store_name) {

                element.textContent =
                    data.store_name;

            }

        }
    );


    /* -----------------------------------------
       STORE DESCRIPTION
    ----------------------------------------- */

    const storeDescription =
        document.querySelectorAll(
            ".store-description"
        );


    storeDescription.forEach(
        function (element) {

            if (data.store_description) {

                element.textContent =
                    data.store_description;

            }

        }
    );


    /* -----------------------------------------
       CONTACT LINKS
    ----------------------------------------- */

    const phoneLink =
        document.querySelector(
            "#contact-phone-link"
        );

    if (phoneLink && data.phone) {
        phoneLink.href =
            "tel:" + String(data.phone).replace(/[^0-9+]/g, "");
    }

    const emailLink =
        document.querySelector(
            "#contact-email-link"
        );

    if (emailLink && data.email) {
        emailLink.href =
            "mailto:" + String(data.email).trim();
    }


    /* -----------------------------------------
       PHONE
    ----------------------------------------- */

    const storePhone =
        document.querySelector(
            ".store-phone"
        );


    if (
        storePhone &&
        data.phone
    ) {

        storePhone.textContent =
            data.phone;

    }


    /* -----------------------------------------
       EMAIL
    ----------------------------------------- */

    const storeEmail =
        document.querySelector(
            ".store-email"
        );


    if (
        storeEmail &&
        data.email
    ) {

        storeEmail.textContent =
            data.email;

    }


    /* -----------------------------------------
       ADDRESS
    ----------------------------------------- */

    const storeAddress =
        document.querySelector(
            ".store-address"
        );


    if (
        storeAddress &&
        data.address
    ) {

        storeAddress.textContent =
            data.address;

    }


    /* -----------------------------------------
       OWNER NAME
    ----------------------------------------- */

    const ownerName =
        document.querySelector(
            ".owner-name"
        );


    if (
        ownerName &&
        data.owner_name
    ) {

        ownerName.textContent =
            data.owner_name;

    }


    /* -----------------------------------------
       CONTENT EDITOR SITE CONTENT
    ----------------------------------------- */

    applySiteContent(data.site_content);


    /* -----------------------------------------
       OWNER BIO
    ----------------------------------------- */

    const ownerBio =
        document.querySelector(
            ".owner-bio"
        );


    if (
        ownerBio &&
        data.owner_bio
    ) {

        ownerBio.textContent =
            data.owner_bio;

    }

}


/* =====================================================
   APPLY CONTENT EDITOR CONTENT
===================================================== */

function applySiteContent(siteContent) {

    if (!siteContent || typeof siteContent !== "object") {
        return;
    }

    const hero = siteContent.hero || {};
    const why = siteContent.why || {};
    const about = siteContent.about || {};
    const brand = siteContent.brand_statement || {};

    const heroEyebrow = document.querySelector(".hero .small-title");
    const heroTitle = document.querySelector(".hero h1");
    const heroDescription = document.querySelector(".hero .description");
    const heroButton = document.querySelector(".hero .shop-btn");

    if (hero.eyebrow && heroEyebrow) {
        heroEyebrow.textContent = hero.eyebrow;
    }

    if (hero.title && heroTitle) {
        const titleLines = String(hero.title)
            .split(/\r?\n/)
            .map(function (line) {
                return line.trim();
            })
            .filter(Boolean);

        if (titleLines.length > 1) {
            heroTitle.innerHTML =
                escapeHtml(titleLines[0]) +
                "<br><span>" +
                escapeHtml(titleLines.slice(1).join(" ")) +
                "</span>";
        } else {
            heroTitle.textContent = titleLines[0] || "";
        }
    }

    if (hero.description && heroDescription) {
        heroDescription.textContent = hero.description;
    }

    if (hero.primary_button && heroButton) {
        heroButton.textContent = hero.primary_button;
    }

    const whyEyebrow = document.querySelector(".why-eyebrow");
    const whyTitle = document.querySelector(".why-title");

    if (why.eyebrow && whyEyebrow) {
        whyEyebrow.textContent = why.eyebrow;
    }

    if (why.title && whyTitle) {
        whyTitle.textContent = why.title;
    }

    for (let index = 1; index <= 4; index += 1) {
        const titleElement = document.querySelector(
            `.why-feature-${index}-title`
        );
        const descriptionElement = document.querySelector(
            `.why-feature-${index}-description`
        );

        const titleKey = `feature_${index}_title`;
        const descriptionKey = `feature_${index}_description`;

        if (why[titleKey] && titleElement) {
            titleElement.textContent = why[titleKey];
        }

        if (why[descriptionKey] && descriptionElement) {
            descriptionElement.textContent = why[descriptionKey];
        }
    }

    const aboutEyebrow = document.querySelector("#about > p:first-child");
    const aboutTitle = document.querySelector("#about > h2");
    const aboutDescription = document.querySelector(
        "#about .store-description"
    );

    if (about.eyebrow && aboutEyebrow) {
        aboutEyebrow.textContent = about.eyebrow;
    }

    if (about.title && aboutTitle) {
        aboutTitle.innerHTML = escapeHtml(about.title)
            .replace(/\r?\n/g, "<br>");
    }

    if (about.description && aboutDescription) {
        aboutDescription.textContent = about.description;
    }

    const brandEyebrow = document.querySelector(
        ".brand-statement-eyebrow"
    );
    const brandTitle = document.querySelector(
        ".brand-statement-title"
    );
    const brandDescription = document.querySelector(
        ".brand-statement-description"
    );

    if (brand.eyebrow && brandEyebrow) {
        brandEyebrow.textContent = brand.eyebrow;
    }

    if (brand.title && brandTitle) {
        brandTitle.innerHTML = escapeHtml(brand.title)
            .replace(/\r?\n/g, "<br>");
    }

    if (brand.description && brandDescription) {
        brandDescription.textContent = brand.description;
    }

}


/* =====================================================
   ESCAPE HTML
===================================================== */

function escapeHtml(value) {

    return String(value || "")
        .replace(
            /&/g,
            "&amp;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        )
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /'/g,
            "&#039;"
        );

}


/* =====================================================
   LOAD THEME SETTINGS
===================================================== */

async function loadThemeSettings() {

    const {
        data,
        error
    } =
        await supabaseClient
            .from("ThemeSettings")
            .select("*")
            .limit(1)
            .single();


    if (error) {

        console.error(
            "Error loading theme settings:",
            error
        );

        return;

    }


    const body =
        document.querySelector(
            "#store-body"
        );


    if (!body) {

        console.error(
            "Store body not found"
        );

        return;

    }


    body.style.setProperty(
        "--theme-accent",
        data.accent_color
    );


    body.style.setProperty(
        "--theme-background",
        data.background_color
    );


    body.style.setProperty(
        "--theme-text",
        data.text_color
    );

}


/* =====================================================
   SEARCH EVENTS
===================================================== */

document.addEventListener(
    "input",
    function (event) {

        if (
            event.target.id !==
            "product-search"
        ) {

            return;

        }


        searchProducts(
            event.target.value
        );


        const clearButton =
            document.querySelector(
                "#clear-search"
            );


        if (clearButton) {

            clearButton.classList.toggle(
                "show",
                Boolean(
                    event.target.value.trim()
                )
            );

        }

    }
);


/* =====================================================
   SORT EVENTS
===================================================== */

document.addEventListener(
    "change",
    function (event) {

        if (
            event.target.id !==
            "product-sort"
        ) {

            return;

        }


        currentSort =
            event.target.value ||
            "newest";


        renderFilteredProducts();

    }
);


/* =====================================================
   CHECKOUT FORM EVENTS
===================================================== */

document.addEventListener(
    "submit",
    function (event) {

        if (
            event.target.id !==
            "checkout-form"
        ) {

            return;

        }


        handleCheckoutSubmit(
            event
        );

    }
);


/* =====================================================
   GLOBAL CLICK HANDLER
===================================================== */

document.addEventListener(
    "click",
    function (event) {


        /* -----------------------------------------
           CART BUTTON
        ----------------------------------------- */

        const cartButton =
            event.target.closest(
                ".cart"
            );


        if (cartButton) {

            openCart();

            return;

        }


        /* -----------------------------------------
           CATEGORY FILTER
        ----------------------------------------- */

        const categoryButton =
            event.target.closest(
                ".category-filter"
            );


        if (categoryButton) {

            filterByCategory(
                categoryButton.dataset.category
            );

            return;

        }


        /* -----------------------------------------
           CLEAR SEARCH
        ----------------------------------------- */

        const clearButton =
            event.target.closest(
                "#clear-search"
            );


        if (clearButton) {

            const searchInput =
                document.querySelector(
                    "#product-search"
                );


            if (!searchInput) {
                return;
            }


            searchInput.value = "";

            searchProducts("");

            clearButton.classList.remove(
                "show"
            );

            searchInput.focus();

            return;

        }


        /* -----------------------------------------
           PRODUCT DETAILS
        ----------------------------------------- */

        const detailsTrigger =
            event.target.closest(
                ".product-details-trigger"
            );


        const detailsButton =
            event.target.closest(
                ".product-view-btn"
            );


        if (
            detailsTrigger ||
            detailsButton
        ) {

            const trigger =
                detailsTrigger ||
                detailsButton;


            const productId =
                trigger.dataset.productId;


            openProductDetails(
                productId
            );


            return;

        }


        /* -----------------------------------------
           ADD PRODUCT TO CART
        ----------------------------------------- */

        const addProductButton =
            event.target.closest(
                ".product-cart-btn"
            );


        if (addProductButton) {

            const productId =
                addProductButton.dataset.productId;


            addToCart(
                productId
            );


            return;

        }


        /* -----------------------------------------
           CLOSE PRODUCT MODAL
        ----------------------------------------- */

        if (
            event.target.closest(
                "[data-close-product-modal='true']"
            )
        ) {

            closeProductModal();

            return;

        }


        /* -----------------------------------------
           ADD FROM PRODUCT DETAILS
        ----------------------------------------- */

        const detailAddButton =
            event.target.closest(
                "[data-add-detail-cart]"
            );


        if (detailAddButton) {

            const productId =
                detailAddButton.dataset.addDetailCart;


            addToCart(
                productId
            );


            return;

        }


        /* -----------------------------------------
           RELATED PRODUCT
        ----------------------------------------- */

        const relatedProduct =
            event.target.closest(
                "[data-related-product]"
            );


        if (relatedProduct) {

            const productId =
                relatedProduct.dataset.relatedProduct;


            openProductDetails(
                productId
            );


            return;

        }


        /* -----------------------------------------
           CLOSE CART
        ----------------------------------------- */

        if (
            event.target.closest(
                "[data-close-cart='true']"
            )
        ) {

            closeCart();

            return;

        }


        /* -----------------------------------------
           INCREASE CART
        ----------------------------------------- */

        const increaseButton =
            event.target.closest(
                "[data-increase]"
            );


        if (increaseButton) {

            increaseCartQuantity(
                increaseButton.dataset.increase
            );

            return;

        }


        /* -----------------------------------------
           DECREASE CART
        ----------------------------------------- */

        const decreaseButton =
            event.target.closest(
                "[data-decrease]"
            );


        if (decreaseButton) {

            decreaseCartQuantity(
                decreaseButton.dataset.decrease
            );

            return;

        }


        /* -----------------------------------------
           REMOVE CART ITEM
        ----------------------------------------- */

        const removeButton =
            event.target.closest(
                "[data-remove]"
            );


        if (removeButton) {

            removeFromCart(
                removeButton.dataset.remove
            );

            return;

        }


        /* -----------------------------------------
           OPEN CHECKOUT
        ----------------------------------------- */

        const checkoutButton =
            event.target.closest(
                ".checkout-placeholder"
            );


        if (checkoutButton) {

            openCheckout();

            return;

        }


        /* -----------------------------------------
           CLOSE CHECKOUT
        ----------------------------------------- */

        if (
            event.target.closest(
                "[data-close-checkout='true']"
            )
        ) {

            closeCheckout();

            return;

        }

    }
);


/* =====================================================
   KEYBOARD SUPPORT
===================================================== */

document.addEventListener(
    "keydown",
    function (event) {

        if (
            event.key === "Escape"
        ) {

            closeProductModal();

            closeCart();

            closeCheckout();

        }

    }
);


/* =====================================================
   START
===================================================== */

createProductSortUI();

loadThemeSettings();

loadCategories();

loadProducts();

loadStoreSettings();

updateCartUI();