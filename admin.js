/* =====================================================
   ELZALAT DIGITAL STUDIO
   ADMIN DASHBOARD
===================================================== */

const adminSupabase = window.supabaseClient;


/* =====================================================
   ELEMENTS
===================================================== */

const loginSection = document.getElementById("login-section");
const dashboardSection = document.getElementById("dashboard-section");

const loginBtn = document.getElementById("login-btn");
const logoutBtn = document.getElementById("logout-btn");

const loginEmail = document.getElementById("login-email");
const loginPassword = document.getElementById("login-password");
const loginMessage = document.getElementById("login-message");

const productForm = document.getElementById("product-form");
const productsList = document.getElementById("products-list");
const productsCount = document.getElementById("products-count");

const addProductSection = document.getElementById("add-product-section");
const showAddProductBtn = document.getElementById("show-add-product");
const closeAddProductBtn = document.getElementById("close-add-product");

const editImageSection = document.getElementById("edit-image-section");
const editImageInput = document.getElementById("edit-image-input");
const cancelImageChangeBtn = document.getElementById("cancel-image-change");

const settingsSection = document.getElementById("settings-section");


/* =====================================================
   CATEGORIES ELEMENTS
===================================================== */

const categoriesSection =
    document.getElementById("categories-section");

const categoryNameInput =
    document.getElementById("category-name");

const addCategoryBtn =
    document.getElementById("add-category-btn");

const categoriesList =
    document.getElementById("categories-list");

const categoryMessage =
    document.getElementById("category-message");


/* =====================================================
   ORDERS ELEMENTS
===================================================== */

const ordersSection =
    document.getElementById("orders-section");

const ordersNav =
    document.getElementById("orders-nav");

const ordersList =
    document.getElementById("orders-list");

const ordersCount =
    document.getElementById("orders-count");

const pendingOrdersCount =
    document.getElementById("pending-orders-count");

const ordersTotalSales =
    document.getElementById("orders-total-sales");

const refreshOrdersBtn =
    document.getElementById("refresh-orders-btn");

const ordersSearch =
    document.getElementById("orders-search");

const ordersStatusFilter =
    document.getElementById("orders-status-filter");


/* =====================================================
   PRODUCT CATEGORY
===================================================== */

const productCategory =
    document.getElementById("product-category");


/* =====================================================
   STORE SETTINGS
===================================================== */

const storeLogoInput =
    document.getElementById("store-logo-input");

const storeLogoPreview =
    document.getElementById("store-logo-preview");

const saveSettingsButton =
    document.getElementById("save-settings-btn");


/* =====================================================
   THEME
===================================================== */

const themeMode =
    document.getElementById("theme-mode");

const themeAccentColor =
    document.getElementById("theme-accent-color");

const themeAccentText =
    document.getElementById("theme-accent-text");

const themeBackgroundColor =
    document.getElementById("theme-background-color");

const themeBackgroundText =
    document.getElementById("theme-background-text");

const themeTextColor =
    document.getElementById("theme-text-color");

const themeTextText =
    document.getElementById("theme-text-text");

const saveThemeButton =
    document.getElementById("save-theme-btn");

const themeMessage =
    document.getElementById("theme-message");


/* =====================================================
   NAVIGATION
===================================================== */

const navItems =
    document.querySelectorAll(".nav-item");


/* =====================================================
   DASHBOARD NAVIGATION
===================================================== */

const dashboardNav =
    document.getElementById("dashboard-nav") ||
    Array.from(navItems).find(function (item) {
        return item.textContent
            .trim()
            .toLowerCase()
            .includes("dashboard");
    }) ||
    (navItems.length > 0 ? navItems[0] : null);


/* =====================================================
   PRODUCTS NAVIGATION
===================================================== */

const productsNav =
    document.getElementById("products-nav") ||
    Array.from(navItems).find(function (item) {
        return item.textContent
            .trim()
            .toLowerCase()
            .includes("products");
    }) ||
    (navItems.length > 1 ? navItems[1] : null);


/* =====================================================
   CATEGORIES NAVIGATION
===================================================== */

const categoriesNav =
    document.getElementById("categories-nav") ||
    Array.from(navItems).find(function (item) {
        return item.textContent
            .trim()
            .toLowerCase()
            .includes("categories");
    }) ||
    null;


/* =====================================================
   ORDERS NAVIGATION
===================================================== */

const ordersNavElement =
    ordersNav ||
    Array.from(navItems).find(function (item) {
        return item.textContent
            .trim()
            .toLowerCase()
            .includes("orders");
    }) ||
    null;


/* =====================================================
   SETTINGS NAVIGATION
===================================================== */

const settingsNav =
    document.getElementById("settings-nav") ||
    Array.from(navItems).find(function (item) {
        return item.textContent
            .trim()
            .toLowerCase()
            .includes("settings");
    }) ||
    null;


/* =====================================================
   SECTIONS
===================================================== */

const statsSection =
    document.querySelector(".stats");

const sectionHeaders =
    document.querySelectorAll(".section-header");

const productsHeader =
    sectionHeaders.length > 0
        ? sectionHeaders[0]
        : null;

const productsSection =
    document.querySelector(".products-section");


/* =====================================================
   STATE
===================================================== */

let currentProducts = [];
let currentCategories = [];
let currentOrders = [];
let currentEditingProduct = null;
let currentSession = null;

let contentEditorSection = null;
let contentEditorNav = null;


/* =====================================================
   SITE CONTENT EDITOR
===================================================== */

const CONTENT_DEFAULTS = {
    hero: {
        eyebrow: "",
        title: "",
        description: "",
        primary_button: ""
    },
    why: {
        eyebrow: "",
        title: "",
        feature_1_title: "",
        feature_1_description: "",
        feature_2_title: "",
        feature_2_description: "",
        feature_3_title: "",
        feature_3_description: "",
        feature_4_title: "",
        feature_4_description: ""
    },
    about: {
        eyebrow: "",
        title: "",
        description: ""
    },
    brand_statement: {
        eyebrow: "",
        title: "",
        description: ""
    }
};


/* =====================================================
   SUPABASE CHECK
===================================================== */

function hasSupabase() {
    return Boolean(
        adminSupabase &&
        adminSupabase.auth &&
        adminSupabase.from &&
        adminSupabase.storage
    );
}


/* =====================================================
   LOGIN STATE
===================================================== */

function isLoggedIn() {
    return currentSession !== null;
}


/* =====================================================
   ESCAPE HTML
===================================================== */

function escapeHtml(value) {
    if (value === null || value === undefined) {
        return "";
    }

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


/* =====================================================
   FORMAT ORDER DATE
===================================================== */

function formatOrderDate(value) {
    if (!value) {
        return "Unknown date";
    }

    try {
        const date = new Date(value);

        if (Number.isNaN(date.getTime())) {
            return String(value);
        }

        return date.toLocaleString();
    } catch (error) {
        return String(value);
    }
}


/* =====================================================
   FORMAT ORDER STATUS
===================================================== */

function formatOrderStatus(status) {
    const cleanStatus =
        String(status || "pending")
            .trim()
            .toLowerCase();

    if (cleanStatus === "completed") {
        return "Completed";
    }

    if (cleanStatus === "cancelled") {
        return "Cancelled";
    }

    if (cleanStatus === "processing") {
        return "Processing";
    }

    if (cleanStatus === "shipped") {
        return "Shipped";
    }

    return "Pending";
}


/* =====================================================
   ORDER STATUS CLASS
===================================================== */

function getOrderStatusClass(status) {
    const cleanStatus =
        String(status || "pending")
            .trim()
            .toLowerCase();

    if (cleanStatus === "completed") {
        return "completed";
    }

    if (cleanStatus === "cancelled") {
        return "cancelled";
    }

    if (cleanStatus === "processing") {
        return "processing";
    }

    if (cleanStatus === "shipped") {
        return "shipped";
    }

    return "pending";
}


/* =====================================================
   SITE CONTENT EDITOR HELPERS
===================================================== */

function mergeContentDefaults(saved) {
    const source = saved && typeof saved === "object" ? saved : {};
    return {
        hero: Object.assign({}, CONTENT_DEFAULTS.hero, source.hero || {}),
        why: Object.assign({}, CONTENT_DEFAULTS.why, source.why || {}),
        about: Object.assign({}, CONTENT_DEFAULTS.about, source.about || {}),
        brand_statement: Object.assign(
            {},
            CONTENT_DEFAULTS.brand_statement,
            source.brand_statement || {}
        )
    };
}


function createContentField(label, id, value, multiline) {
    const wrapper = document.createElement("div");
    wrapper.className = "content-editor-field";

    const labelElement = document.createElement("label");
    labelElement.setAttribute("for", id);
    labelElement.textContent = label;
    wrapper.appendChild(labelElement);

    const input = multiline
        ? document.createElement("textarea")
        : document.createElement("input");

    input.id = id;
    input.name = id;
    input.value = value || "";
    input.className = "content-editor-input";

    if (multiline) {
        input.rows = 4;
    }

    wrapper.appendChild(input);
    return wrapper;
}


function createContentEditor() {
    if (contentEditorSection || !dashboardSection) {
        return;
    }

    contentEditorSection = document.createElement("section");
    contentEditorSection.id = "site-content-section";
    contentEditorSection.style.display = "none";

    contentEditorSection.innerHTML = `
        <style>
            #site-content-section {
                margin: 24px 0 0;
                padding: 28px;
                border-radius: 24px;
                background: linear-gradient(145deg, rgba(255,255,255,.055), rgba(255,255,255,.018));
                border: 1px solid rgba(255,255,255,.10);
                box-shadow: 0 24px 70px rgba(0,0,0,.22);
            }

            .site-content-head {
                display:flex;
                align-items:flex-end;
                justify-content:space-between;
                gap:20px;
                margin-bottom:24px;
                flex-wrap:wrap;
            }

            .site-content-kicker {
                margin:0 0 7px;
                font-size:11px;
                letter-spacing:.18em;
                text-transform:uppercase;
                opacity:.58;
            }

            .site-content-title {
                margin:0;
                font-size:30px;
                line-height:1.1;
            }

            .site-content-subtitle {
                margin:9px 0 0;
                max-width:650px;
                opacity:.62;
                line-height:1.65;
            }

            .site-content-status {
                min-height:20px;
                font-size:12px;
                opacity:.72;
            }

            .content-editor-group {
                margin-top:18px;
                padding:22px;
                border-radius:20px;
                background:rgba(0,0,0,.16);
                border:1px solid rgba(255,255,255,.075);
            }

            .content-editor-group h3 {
                margin:0 0 17px;
                font-size:17px;
                letter-spacing:.01em;
            }

            .content-editor-grid {
                display:grid;
                grid-template-columns:repeat(2,minmax(0,1fr));
                gap:14px;
            }

            .content-editor-field {
                min-width:0;
            }

            .content-editor-field.full-width {
                grid-column:1 / -1;
            }

            .content-editor-label {
                display:block;
                margin:0 0 7px;
                font-size:11px;
                font-weight:700;
                letter-spacing:.08em;
                text-transform:uppercase;
                opacity:.58;
            }

            .content-editor-input {
                width:100%;
                box-sizing:border-box;
                border:1px solid rgba(255,255,255,.10);
                border-radius:13px;
                background:rgba(255,255,255,.045);
                color:inherit;
                padding:12px 13px;
                outline:none;
                font:inherit;
                line-height:1.5;
                transition:border-color .2s ease, background .2s ease, box-shadow .2s ease;
            }

            textarea.content-editor-input {
                min-height:104px;
                resize:vertical;
            }

            .content-editor-input:focus {
                border-color:rgba(201,162,39,.65);
                background:rgba(255,255,255,.065);
                box-shadow:0 0 0 3px rgba(201,162,39,.08);
            }

            .site-content-actions {
                display:flex;
                align-items:center;
                gap:14px;
                margin-top:22px;
                flex-wrap:wrap;
            }

            #save-site-content-btn {
                min-height:46px;
                padding:0 20px;
                border:0;
                border-radius:13px;
                cursor:pointer;
                font-weight:800;
                letter-spacing:.08em;
                background:linear-gradient(135deg,#d7b33d,#a98518);
                color:#080808;
                box-shadow:0 12px 28px rgba(0,0,0,.22);
            }

            #save-site-content-btn:disabled {
                opacity:.55;
                cursor:not-allowed;
            }

            @media (max-width: 760px) {
                #site-content-section { padding:18px; border-radius:19px; }
                .site-content-title { font-size:24px; }
                .content-editor-group { padding:16px; border-radius:17px; }
                .content-editor-grid { grid-template-columns:1fr; }
                .content-editor-field.full-width { grid-column:auto; }
            }
        </style>

        <div class="site-content-head">
            <div>
                <p class="site-content-kicker">SITE CONTENT</p>
                <h2 class="site-content-title">Content Editor</h2>
                <p class="site-content-subtitle">Edit the words shown on the storefront without touching the website code.</p>
            </div>
            <span class="site-content-status" id="site-content-message"></span>
        </div>

        <div class="content-editor-group" data-group="hero">
            <h3>Hero Section</h3>
            <div class="content-editor-grid"></div>
        </div>

        <div class="content-editor-group" data-group="why">
            <h3>Why Section</h3>
            <div class="content-editor-grid"></div>
        </div>

        <div class="content-editor-group" data-group="about">
            <h3>About Section</h3>
            <div class="content-editor-grid"></div>
        </div>

        <div class="content-editor-group" data-group="brand_statement">
            <h3>Brand Statement</h3>
            <div class="content-editor-grid"></div>
        </div>

        <div class="site-content-actions">
            <button type="button" id="save-site-content-btn">SAVE SITE CONTENT</button>
        </div>
    `;

    dashboardSection.appendChild(contentEditorSection);

    const definitions = {
        hero: [
            ["Eyebrow", "hero-eyebrow", false],
            ["Title", "hero-title", false],
            ["Description", "hero-description", true],
            ["Primary Button", "hero-primary-button", false]
        ],
        why: [
            ["Eyebrow", "why-eyebrow", false],
            ["Title", "why-title", false],
            ["Feature 1 Title", "why-feature-1-title", false],
            ["Feature 1 Description", "why-feature-1-description", true],
            ["Feature 2 Title", "why-feature-2-title", false],
            ["Feature 2 Description", "why-feature-2-description", true],
            ["Feature 3 Title", "why-feature-3-title", false],
            ["Feature 3 Description", "why-feature-3-description", true],
            ["Feature 4 Title", "why-feature-4-title", false],
            ["Feature 4 Description", "why-feature-4-description", true]
        ],
        about: [
            ["Eyebrow", "about-eyebrow", false],
            ["Title", "about-title", false],
            ["Description", "about-description", true]
        ],
        brand_statement: [
            ["Eyebrow", "brand-eyebrow", false],
            ["Title", "brand-title", false],
            ["Description", "brand-description", true]
        ]
    };

    Object.keys(definitions).forEach(function (groupName) {
        const group = contentEditorSection.querySelector(
            '[data-group="' + groupName + '"] .content-editor-grid'
        );

        definitions[groupName].forEach(function (item) {
            const field = createContentField(item[0], item[1], "", item[2]);
            if (item[2]) {
                field.classList.add("full-width");
            }
            group.appendChild(field);
        });
    });

    const saveButton = document.getElementById("save-site-content-btn");
    if (saveButton) {
        saveButton.addEventListener("click", saveSiteContent);
    }
}

function collectSiteContent() {
    return {
        hero: {
            eyebrow: document.getElementById("hero-eyebrow").value.trim(),
            title: document.getElementById("hero-title").value.trim(),
            description: document.getElementById("hero-description").value.trim(),
            primary_button: document.getElementById("hero-primary-button").value.trim()
        },
        why: {
            eyebrow: document.getElementById("why-eyebrow").value.trim(),
            title: document.getElementById("why-title").value.trim(),
            feature_1_title: document.getElementById("why-feature-1-title").value.trim(),
            feature_1_description: document.getElementById("why-feature-1-description").value.trim(),
            feature_2_title: document.getElementById("why-feature-2-title").value.trim(),
            feature_2_description: document.getElementById("why-feature-2-description").value.trim(),
            feature_3_title: document.getElementById("why-feature-3-title").value.trim(),
            feature_3_description: document.getElementById("why-feature-3-description").value.trim(),
            feature_4_title: document.getElementById("why-feature-4-title").value.trim(),
            feature_4_description: document.getElementById("why-feature-4-description").value.trim()
        },
        about: {
            eyebrow: document.getElementById("about-eyebrow").value.trim(),
            title: document.getElementById("about-title").value.trim(),
            description: document.getElementById("about-description").value.trim()
        },
        brand_statement: {
            eyebrow: document.getElementById("brand-eyebrow").value.trim(),
            title: document.getElementById("brand-title").value.trim(),
            description: document.getElementById("brand-description").value.trim()
        }
    };
}


function fillSiteContent(content) {
    const data = mergeContentDefaults(content);
    const fields = {
        "hero-eyebrow": data.hero.eyebrow,
        "hero-title": data.hero.title,
        "hero-description": data.hero.description,
        "hero-primary-button": data.hero.primary_button,
        "why-eyebrow": data.why.eyebrow,
        "why-title": data.why.title,
        "why-feature-1-title": data.why.feature_1_title,
        "why-feature-1-description": data.why.feature_1_description,
        "why-feature-2-title": data.why.feature_2_title,
        "why-feature-2-description": data.why.feature_2_description,
        "why-feature-3-title": data.why.feature_3_title,
        "why-feature-3-description": data.why.feature_3_description,
        "why-feature-4-title": data.why.feature_4_title,
        "why-feature-4-description": data.why.feature_4_description,
        "about-eyebrow": data.about.eyebrow,
        "about-title": data.about.title,
        "about-description": data.about.description,
        "brand-eyebrow": data.brand_statement.eyebrow,
        "brand-title": data.brand_statement.title,
        "brand-description": data.brand_statement.description
    };

    Object.keys(fields).forEach(function (id) {
        const element = document.getElementById(id);
        if (element) {
            element.value = fields[id] || "";
        }
    });
}


async function loadSiteContent() {
    if (!(await checkAuthentication())) {
        return;
    }

    try {
        const result = await adminSupabase
            .from("StoreSettings")
            .select("site_content")
            .limit(1)
            .single();

        if (result.error) {
            console.error("Error loading site content:", result.error);
            return;
        }

        fillSiteContent(result.data ? result.data.site_content : {});
    } catch (error) {
        console.error("Load site content exception:", error);
    }
}


async function saveSiteContent() {
    if (!(await checkAuthentication())) {
        return;
    }

    const message = document.getElementById("site-content-message");
    const button = document.getElementById("save-site-content-btn");

    if (message) {
        message.textContent = "Saving...";
    }

    if (button) {
        button.disabled = true;
    }

    try {
        const settingsResult = await adminSupabase
            .from("StoreSettings")
            .select("id")
            .limit(1)
            .single();

        if (settingsResult.error || !settingsResult.data) {
            throw new Error("Could not find store settings.");
        }

        const updateResult = await adminSupabase
            .from("StoreSettings")
            .update({
                site_content: collectSiteContent(),
                updated_at: new Date().toISOString()
            })
            .eq("id", settingsResult.data.id)
            .select("id")
            .single();

        if (updateResult.error || !updateResult.data) {
            throw new Error("Could not save site content.");
        }

        if (message) {
            message.textContent = "Site content saved successfully.";
        }
    } catch (error) {
        console.error("Save site content exception:", error);
        if (message) {
            message.textContent = error.message || "Error saving site content.";
        }
    } finally {
        if (button) {
            button.disabled = false;
        }
    }
}


function showSiteContentPage() {
    if (!isLoggedIn()) {
        updateAdminAccess(null);
        return;
    }

    createContentEditor();
    hideAllMainSections();

    if (contentEditorSection) {
        contentEditorSection.style.display = "block";
    }

    setActiveNav(contentEditorNav);
    loadSiteContent();
}


function createContentEditorNav() {
    if (contentEditorNav) {
        return;
    }

    if (!settingsNav || !settingsNav.parentElement) {
        return;
    }

    contentEditorNav = document.createElement("button");
    contentEditorNav.type = "button";
    contentEditorNav.className = "nav-item";
    contentEditorNav.id = "site-content-nav";
    contentEditorNav.textContent = "Content";
    contentEditorNav.style.cursor = "pointer";

    settingsNav.parentElement.appendChild(contentEditorNav);

    contentEditorNav.addEventListener("click", function () {
        showSiteContentPage();
    });
}


/* =====================================================
   HIDE ALL MAIN SECTIONS
===================================================== */

function hideAllMainSections() {
    if (statsSection) {
        statsSection.style.display = "none";
    }

    if (productsHeader) {
        productsHeader.style.display = "none";
    }

    if (addProductSection) {
        addProductSection.style.display = "none";
    }

    if (productsSection) {
        productsSection.style.display = "none";
    }

    if (editImageSection) {
        editImageSection.style.display = "none";
    }

    if (categoriesSection) {
        categoriesSection.style.display = "none";
    }

    if (settingsSection) {
        settingsSection.style.display = "none";
    }

    if (ordersSection) {
        ordersSection.style.display = "none";
    }

    if (contentEditorSection) {
        contentEditorSection.style.display = "none";
    }
}


/* =====================================================
   ACTIVE NAV
===================================================== */

function setActiveNav(button) {
    navItems.forEach(function (item) {
        item.classList.remove("active");
    });

    if (contentEditorNav) {
        contentEditorNav.classList.remove("active");
    }

    if (button) {
        button.classList.add("active");
    }
}


/* =====================================================
   UPDATE ADMIN ACCESS
===================================================== */

function updateAdminAccess(session) {
    currentSession = session || null;

    if (currentSession) {
        if (loginSection) {
            loginSection.style.display = "none";
        }

        if (dashboardSection) {
            dashboardSection.style.display = "block";
        }

        showDashboardPage();
    } else {
        if (loginSection) {
            loginSection.style.display = "block";
        }

        if (dashboardSection) {
            dashboardSection.style.display = "none";
        }

        hideAllMainSections();

        currentEditingProduct = null;

        if (editImageInput) {
            editImageInput.value = "";
        }

        setActiveNav(null);
    }
}


/* =====================================================
   CHECK AUTHENTICATION
===================================================== */

async function checkAuthentication() {
    if (!hasSupabase()) {
        updateAdminAccess(null);
        return false;
    }

    try {
        const result =
            await adminSupabase.auth.getSession();

        if (
            result.error ||
            !result.data ||
            !result.data.session
        ) {
            currentSession = null;
            updateAdminAccess(null);
            return false;
        }

        currentSession =
            result.data.session;

        return true;
    } catch (error) {
        console.error(
            "Authentication error:",
            error
        );

        currentSession = null;
        updateAdminAccess(null);

        return false;
    }
}




/* =====================================================
   SUPABASE CHECK
===================================================== */

function hasSupabase() {
    return Boolean(
        adminSupabase &&
        adminSupabase.auth &&
        adminSupabase.from &&
        adminSupabase.storage
    );
}


/* =====================================================
   LOGIN STATE
===================================================== */

function isLoggedIn() {
    return currentSession !== null;
}


/* =====================================================
   ESCAPE HTML
===================================================== */

function escapeHtml(value) {
    if (value === null || value === undefined) {
        return "";
    }

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


/* =====================================================
   FORMAT ORDER DATE
===================================================== */

function formatOrderDate(value) {
    if (!value) {
        return "Unknown date";
    }

    try {
        const date = new Date(value);

        if (Number.isNaN(date.getTime())) {
            return String(value);
        }

        return date.toLocaleString();
    } catch (error) {
        return String(value);
    }
}


/* =====================================================
   FORMAT ORDER STATUS
===================================================== */

function formatOrderStatus(status) {
    const cleanStatus =
        String(status || "pending")
            .trim()
            .toLowerCase();

    if (cleanStatus === "completed") {
        return "Completed";
    }

    if (cleanStatus === "cancelled") {
        return "Cancelled";
    }

    if (cleanStatus === "processing") {
        return "Processing";
    }

    if (cleanStatus === "shipped") {
        return "Shipped";
    }

    return "Pending";
}


/* =====================================================
   ORDER STATUS CLASS
===================================================== */

function getOrderStatusClass(status) {
    const cleanStatus =
        String(status || "pending")
            .trim()
            .toLowerCase();

    if (cleanStatus === "completed") {
        return "completed";
    }

    if (cleanStatus === "cancelled") {
        return "cancelled";
    }

    if (cleanStatus === "processing") {
        return "processing";
    }

    if (cleanStatus === "shipped") {
        return "shipped";
    }

    return "pending";
}


/* =====================================================
   HIDE ALL MAIN SECTIONS
===================================================== */

function hideAllMainSections() {
    if (statsSection) {
        statsSection.style.display = "none";
    }

    if (productsHeader) {
        productsHeader.style.display = "none";
    }

    if (addProductSection) {
        addProductSection.style.display = "none";
    }

    if (productsSection) {
        productsSection.style.display = "none";
    }

    if (editImageSection) {
        editImageSection.style.display = "none";
    }

    if (categoriesSection) {
        categoriesSection.style.display = "none";
    }

    if (settingsSection) {
        settingsSection.style.display = "none";
    }

    if (ordersSection) {
        ordersSection.style.display = "none";
    }

    if (contentEditorSection) {
        contentEditorSection.style.display = "none";
    }
}


/* =====================================================
   ACTIVE NAV
===================================================== */

function setActiveNav(button) {
    navItems.forEach(function (item) {
        item.classList.remove("active");
    });

    if (contentEditorNav) {
        contentEditorNav.classList.remove("active");
    }

    if (button) {
        button.classList.add("active");
    }
}


/* =====================================================
   UPDATE ADMIN ACCESS
===================================================== */

function updateAdminAccess(session) {
    currentSession = session || null;

    if (currentSession) {
        if (loginSection) {
            loginSection.style.display = "none";
        }

        if (dashboardSection) {
            dashboardSection.style.display = "block";
        }

        showDashboardPage();
    } else {
        if (loginSection) {
            loginSection.style.display = "block";
        }

        if (dashboardSection) {
            dashboardSection.style.display = "none";
        }

        hideAllMainSections();

        currentEditingProduct = null;

        if (editImageInput) {
            editImageInput.value = "";
        }

        setActiveNav(null);
    }
}


/* =====================================================
   CHECK AUTHENTICATION
===================================================== */

async function checkAuthentication() {
    if (!hasSupabase()) {
        updateAdminAccess(null);
        return false;
    }

    try {
        const result =
            await adminSupabase.auth.getSession();

        if (
            result.error ||
            !result.data ||
            !result.data.session
        ) {
            currentSession = null;
            updateAdminAccess(null);
            return false;
        }

        currentSession =
            result.data.session;

        return true;
    } catch (error) {
        console.error(
            "Authentication error:",
            error
        );

        currentSession = null;
        updateAdminAccess(null);

        return false;
    }
}


/* =====================================================
   DASHBOARD STATS
===================================================== */

async function loadDashboardStats() {
    if (!isLoggedIn() || !statsSection) {
        return;
    }

    statsSection.innerHTML = `
        <div class="stat-card">
            <span>Total Products</span>
            <strong id="dashboard-total-products">...</strong>
        </div>

        <div class="stat-card">
            <span>Total Orders</span>
            <strong id="dashboard-total-orders">...</strong>
        </div>

        <div class="stat-card">
            <span>Pending Orders</span>
            <strong id="dashboard-pending-orders">...</strong>
        </div>

        <div class="stat-card">
            <span>Completed Orders</span>
            <strong id="dashboard-completed-orders">...</strong>
        </div>

        <div class="stat-card">
            <span>Total Sales</span>
            <strong id="dashboard-total-sales">...</strong>
        </div>

        <div class="stat-card">
            <span>Store Status</span>
            <strong id="dashboard-store-status">Online</strong>
        </div>
    `;

    try {
        const productsResult =
            await adminSupabase
                .from("Products")
                .select("id", {
                    count: "exact",
                    head: true
                });

        if (productsResult.error) {
            console.error(
                "Dashboard products stats error:",
                productsResult.error
            );
        }

        const ordersResult =
            await adminSupabase
                .from("Orders")
                .select("status,total");

        if (ordersResult.error) {
            console.error(
                "Dashboard orders stats error:",
                ordersResult.error
            );
        }

        const productsCount =
            productsResult.error
                ? null
                : Number(productsResult.count) || 0;

        const orders =
            ordersResult.error || !Array.isArray(ordersResult.data)
                ? []
                : ordersResult.data;

        const totalOrders =
            orders.length;

        const pendingOrders =
            orders.filter(
                function (order) {
                    return (
                        String(order.status || "pending")
                            .trim()
                            .toLowerCase() ===
                        "pending"
                    );
                }
            ).length;

        const completedOrders =
            orders.filter(
                function (order) {
                    return (
                        String(order.status || "pending")
                            .trim()
                            .toLowerCase() ===
                        "completed"
                    );
                }
            ).length;

        const totalSales =
            orders.reduce(
                function (total, order) {
                    const status =
                        String(order.status || "pending")
                            .trim()
                            .toLowerCase();

                    if (status === "cancelled") {
                        return total;
                    }

                    return (
                        total +
                        (Number(order.total) || 0)
                    );
                },
                0
            );

        const totalProductsElement =
            document.getElementById(
                "dashboard-total-products"
            );

        const totalOrdersElement =
            document.getElementById(
                "dashboard-total-orders"
            );

        const pendingOrdersElement =
            document.getElementById(
                "dashboard-pending-orders"
            );

        const completedOrdersElement =
            document.getElementById(
                "dashboard-completed-orders"
            );

        const totalSalesElement =
            document.getElementById(
                "dashboard-total-sales"
            );

        if (totalProductsElement) {
            totalProductsElement.textContent =
                productsCount === null
                    ? "â€”"
                    : String(productsCount);
        }

        if (totalOrdersElement) {
            totalOrdersElement.textContent =
                String(totalOrders);
        }

        if (pendingOrdersElement) {
            pendingOrdersElement.textContent =
                String(pendingOrders);
        }

        if (completedOrdersElement) {
            completedOrdersElement.textContent =
                String(completedOrders);
        }

        if (totalSalesElement) {
            totalSalesElement.textContent =
                Number(totalSales).toLocaleString(
                    undefined,
                    {
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 2
                    }
                ) +
                " EGP";
        }
    } catch (error) {
        console.error(
            "Dashboard stats exception:",
            error
        );

        const statElements =
            statsSection.querySelectorAll(
                "strong"
            );

        statElements.forEach(
            function (element, index) {
                if (index < 5) {
                    element.textContent = "â€”";
                }
            }
        );
    }
}


/* =====================================================
   DASHBOARD PAGE
===================================================== */

function showDashboardPage() {
    if (!isLoggedIn()) {
        updateAdminAccess(null);
        return;
    }

    hideAllMainSections();

    if (statsSection) {
        statsSection.style.display = "grid";
    }

    setActiveNav(dashboardNav);

    loadDashboardStats();
}


/* =====================================================
   PRODUCTS PAGE
===================================================== */

async function showProductsPage() {
    if (!isLoggedIn()) {
        updateAdminAccess(null);
        return;
    }

    hideAllMainSections();

    if (productsHeader) {
        productsHeader.style.display = "flex";
    }

    if (productsSection) {
        productsSection.style.display = "block";
    }

    setActiveNav(productsNav);

    await loadCategories();
    await loadProductCategoryOptions();
    await loadProducts();
}


/* =====================================================
   CATEGORIES PAGE
===================================================== */

async function showCategoriesPage() {
    if (!isLoggedIn()) {
        updateAdminAccess(null);
        return;
    }

    hideAllMainSections();

    if (categoriesSection) {
        categoriesSection.style.display = "block";
    }

    setActiveNav(categoriesNav);

    await loadCategories();
}


/* =====================================================
   ORDERS PAGE
===================================================== */

async function showOrdersPage() {
    if (!isLoggedIn()) {
        updateAdminAccess(null);
        return;
    }

    hideAllMainSections();

    if (ordersSection) {
        ordersSection.style.display = "block";
    }

    setActiveNav(ordersNavElement);

    await loadOrders();
}


/* =====================================================
   SETTINGS PAGE
===================================================== */

async function showSettingsPage() {
    if (!isLoggedIn()) {
        updateAdminAccess(null);
        return;
    }

    hideAllMainSections();

    if (settingsSection) {
        settingsSection.style.display = "block";
    }

    setActiveNav(settingsNav);

    await loadStoreSettings();
    await loadThemeSettings();
}


/* =====================================================
   NAVIGATION EVENTS
===================================================== */

if (dashboardNav) {
    dashboardNav.addEventListener(
        "click",
        function () {
            if (!isLoggedIn()) {
                updateAdminAccess(null);
                return;
            }

            showDashboardPage();
        }
    );
}


if (productsNav) {
    productsNav.addEventListener(
        "click",
        function () {
            if (!isLoggedIn()) {
                updateAdminAccess(null);
                return;
            }

            showProductsPage();
        }
    );
}


if (categoriesNav) {
    categoriesNav.addEventListener(
        "click",
        function () {
            if (!isLoggedIn()) {
                updateAdminAccess(null);
                return;
            }

            showCategoriesPage();
        }
    );
}


if (ordersNavElement) {
    ordersNavElement.addEventListener(
        "click",
        function () {
            if (!isLoggedIn()) {
                updateAdminAccess(null);
                return;
            }

            showOrdersPage();
        }
    );
}


if (settingsNav) {
    settingsNav.addEventListener(
        "click",
        function () {
            if (!isLoggedIn()) {
                updateAdminAccess(null);
                return;
            }

            showSettingsPage();
        }
    );
}


/* =====================================================
   LOGIN
===================================================== */

async function loginAdmin() {
    if (!hasSupabase()) {
        if (loginMessage) {
            loginMessage.textContent =
                "Supabase is not connected.";
        }

        return;
    }

    const email =
        loginEmail
            ? loginEmail.value.trim()
            : "";

    const password =
        loginPassword
            ? loginPassword.value
            : "";

    if (!email || !password) {
        if (loginMessage) {
            loginMessage.textContent =
                "Please enter your email and password.";
        }

        return;
    }

    if (loginMessage) {
        loginMessage.textContent =
            "Logging in...";
    }

    try {
        const result =
            await adminSupabase.auth.signInWithPassword({
                email: email,
                password: password
            });

        if (result.error) {
            console.error(
                "Login error:",
                result.error
            );

            if (loginMessage) {
                loginMessage.textContent =
                    "Login failed. Please check your email and password.";
            }

            return;
        }

        currentSession =
            result.data
                ? result.data.session
                : null;

        if (!currentSession) {
            if (loginMessage) {
                loginMessage.textContent =
                    "Login completed, but no active session was found.";
            }

            return;
        }

        if (loginMessage) {
            loginMessage.textContent = "";
        }

        updateAdminAccess(currentSession);
    } catch (error) {
        console.error(
            "Login exception:",
            error
        );

        if (loginMessage) {
            loginMessage.textContent =
                "Login failed. Please try again.";
        }
    }
}


if (loginBtn) {
    loginBtn.addEventListener(
        "click",
        loginAdmin
    );
}


/* =====================================================
   LOGIN WITH ENTER
===================================================== */

if (loginPassword) {
    loginPassword.addEventListener(
        "keydown",
        function (event) {
            if (event.key === "Enter") {
                loginAdmin();
            }
        }
    );
}


/* =====================================================
   LOGOUT
===================================================== */

async function logoutAdmin() {
    if (hasSupabase()) {
        try {
            const result =
                await adminSupabase.auth.signOut();

            if (result.error) {
                console.error(
                    "Logout error:",
                    result.error
                );
            }
        } catch (error) {
            console.error(
                "Logout exception:",
                error
            );
        }
    }

    currentSession = null;
    currentEditingProduct = null;

    if (editImageInput) {
        editImageInput.value = "";
    }

    updateAdminAccess(null);
}


if (logoutBtn) {
    logoutBtn.addEventListener(
        "click",
        logoutAdmin
    );
}


/* =====================================================
   SESSION
===================================================== */

async function checkSession() {
    if (!hasSupabase()) {
        updateAdminAccess(null);
        return;
    }

    try {
        const result =
            await adminSupabase.auth.getSession();

        if (
            result.error ||
            !result.data
        ) {
            updateAdminAccess(null);
            return;
        }

        currentSession =
            result.data.session || null;

        updateAdminAccess(currentSession);
    } catch (error) {
        console.error(
            "Session error:",
            error
        );

        updateAdminAccess(null);
    }
}


/* =====================================================
   AUTH STATE LISTENER
===================================================== */

if (
    hasSupabase() &&
    typeof adminSupabase.auth.onAuthStateChange === "function"
) {
    adminSupabase.auth.onAuthStateChange(
        function (event, session) {
            currentSession =
                session || null;

            setTimeout(
                function () {
                    updateAdminAccess(
                        currentSession
                    );
                },
                0
            );
        }
    );
}


/* =====================================================
   LOAD CATEGORIES
===================================================== */

async function loadCategories() {
    if (!isLoggedIn()) {
        return;
    }

    try {
        const result =
            await adminSupabase
                .from("Categories")
                .select("*")
                .order(
                    "created_at",
                    {
                        ascending: true
                    }
                );

        if (result.error) {
            console.error(
                "Error loading categories:",
                result.error
            );

            if (categoriesList) {
                categoriesList.innerHTML =
                    "<p>Could not load categories.</p>";
            }

            return;
        }

        currentCategories =
            Array.isArray(result.data)
                ? result.data
                : [];

        if (!categoriesList) {
            return;
        }

        categoriesList.innerHTML = "";

        if (currentCategories.length === 0) {
            categoriesList.innerHTML =
                "<p>No categories found.</p>";

            return;
        }

        currentCategories.forEach(
            function (category) {
                const card =
                    document.createElement("div");

                card.className =
                    "product-card";

                card.innerHTML = `
                    <div class="product-card-info">
                        <h3>
                            ${escapeHtml(category.name)}
                        </h3>
                    </div>

                    <div class="product-card-actions">
                        <button
                            type="button"
                            class="delete-btn delete-category-btn"
                            data-id="${escapeHtml(category.id)}"
                        >
                            Delete
                        </button>
                    </div>
                `;

                categoriesList.appendChild(card);
            }
        );

        const deleteCategoryButtons =
            categoriesList.querySelectorAll(
                ".delete-category-btn"
            );

        deleteCategoryButtons.forEach(
            function (button) {
                button.addEventListener(
                    "click",
                    function () {
                        deleteCategory(
                            button.dataset.id
                        );
                    }
                );
            }
        );
    } catch (error) {
        console.error(
            "Load categories exception:",
            error
        );

        if (categoriesList) {
            categoriesList.innerHTML =
                "<p>Could not load categories.</p>";
        }
    }
}


/* =====================================================
   LOAD PRODUCT CATEGORY OPTIONS
===================================================== */

async function loadProductCategoryOptions() {
    if (!productCategory) {
        return;
    }

    productCategory.innerHTML = "";

    const defaultOption =
        document.createElement("option");

    defaultOption.value = "";
    defaultOption.textContent =
        "Select Category";

    productCategory.appendChild(
        defaultOption
    );

    currentCategories.forEach(
        function (category) {
            const option =
                document.createElement("option");

            option.value = category.id;
            option.textContent = category.name;

            productCategory.appendChild(option);
        }
    );
}


/* =====================================================
   ADD CATEGORY
===================================================== */

async function addCategory() {
    if (!(await checkAuthentication())) {
        return;
    }

    if (!categoryNameInput) {
        return;
    }

    const name =
        categoryNameInput.value.trim();

    if (!name) {
        if (categoryMessage) {
            categoryMessage.textContent =
                "Please enter a category name.";
        }

        return;
    }

    if (categoryMessage) {
        categoryMessage.textContent =
            "Adding category...";
    }

    try {
        const existingCategory =
            currentCategories.find(
                function (category) {
                    return (
                        String(category.name || "")
                            .trim()
                            .toLowerCase() ===
                        name.toLowerCase()
                    );
                }
            );

        if (existingCategory) {
            if (categoryMessage) {
                categoryMessage.textContent =
                    "This category already exists.";
            }

            return;
        }

        const result =
            await adminSupabase
                .from("Categories")
                .insert({
                    name: name
                })
                .select("*")
                .single();

        if (
            result.error ||
            !result.data
        ) {
            console.error(
                "Error adding category:",
                result.error
            );

            if (categoryMessage) {
                categoryMessage.textContent =
                    "Error adding category.";
            }

            return;
        }

        categoryNameInput.value = "";

        if (categoryMessage) {
            categoryMessage.textContent =
                "Category added successfully.";

            setTimeout(
                function () {
                    if (categoryMessage) {
                        categoryMessage.textContent =
                            "";
                    }
                },
                3000
            );
        }

        await loadCategories();
        await loadProductCategoryOptions();
    } catch (error) {
        console.error(
            "Add category exception:",
            error
        );

        if (categoryMessage) {
            categoryMessage.textContent =
                "Error adding category.";
        }
    }
}


if (addCategoryBtn) {
    addCategoryBtn.addEventListener(
        "click",
        addCategory
    );
}


/* =====================================================
   CATEGORY NAME ENTER
===================================================== */

if (categoryNameInput) {
    categoryNameInput.addEventListener(
        "keydown",
        function (event) {
            if (event.key === "Enter") {
                event.preventDefault();
                addCategory();
            }
        }
    );
}


/* =====================================================
   DELETE CATEGORY
===================================================== */

async function deleteCategory(categoryId) {
    if (!(await checkAuthentication())) {
        return;
    }

    const category =
        currentCategories.find(
            function (item) {
                return (
                    String(item.id) ===
                    String(categoryId)
                );
            }
        );

    if (!category) {
        alert(
            "Category not found."
        );

        return;
    }

    const confirmed =
        confirm(
            'Are you sure you want to delete the category "' +
            category.name +
            '"?'
        );

    if (!confirmed) {
        return;
    }

    try {
        const result =
            await adminSupabase
                .from("Categories")
                .delete()
                .eq(
                    "id",
                    categoryId
                )
                .select("id")
                .single();

        if (
            result.error ||
            !result.data
        ) {
            console.error(
                "Error deleting category:",
                result.error
            );

            alert(
                "Error deleting the category."
            );

            return;
        }

        alert(
            "Category deleted successfully."
        );

        await loadCategories();
        await loadProductCategoryOptions();
        await loadProducts();
    } catch (error) {
        console.error(
            "Delete category exception:",
            error
        );

        alert(
            "Error deleting the category."
        );
    }
}



/* =====================================================
   FEATURED PRODUCT FIELD
===================================================== */

function ensureFeaturedProductField() {
    if (!productForm) {
        return null;
    }

    let featuredElement =
        document.getElementById("product-featured");

    if (featuredElement) {
        return featuredElement;
    }

    const wrapper =
        document.createElement("div");

    wrapper.id = "product-featured-wrapper";
    wrapper.style.cssText =
        "margin-top:14px;padding:15px 16px;border:1px solid rgba(201,162,39,.22);" +
        "border-radius:14px;background:linear-gradient(135deg,rgba(201,162,39,.09),rgba(255,255,255,.025));";

    wrapper.innerHTML = `
        <label
            for="product-featured"
            style="display:flex;align-items:center;gap:11px;cursor:pointer;font-weight:700;"
        >
            <input
                type="checkbox"
                id="product-featured"
                name="featured"
                style="width:18px;height:18px;accent-color:#c9a227;cursor:pointer;"
            >
            <span>Featured Product</span>
        </label>
        <small
            style="display:block;margin:7px 0 0 29px;opacity:.62;line-height:1.45;"
        >
            Show this product in the Featured Products section on the storefront.
        </small>
    `;

    const submitButton =
        productForm.querySelector(
            'button[type="submit"], input[type="submit"]'
        );

    if (submitButton && submitButton.parentElement) {
        submitButton.parentElement.insertBefore(
            wrapper,
            submitButton
        );
    } else {
        productForm.appendChild(wrapper);
    }

    return document.getElementById("product-featured");
}

/* =====================================================
   ADD PRODUCT
===================================================== */

if (productForm) {
    productForm.addEventListener(
        "submit",
        async function (event) {
            event.preventDefault();

            if (!(await checkAuthentication())) {
                return;
            }

            const nameElement =
                document.getElementById(
                    "product-name"
                );

            const descriptionElement =
                document.getElementById(
                    "product-description"
                );

            const priceElement =
                document.getElementById(
                    "product-price"
                );

            const imageInput =
                document.getElementById(
                    "product-image"
                );

            const categoryElement =
                document.getElementById(
                    "product-category"
                );

            const featuredElement =
                ensureFeaturedProductField();

            if (
                !nameElement ||
                !descriptionElement ||
                !priceElement
            ) {
                alert(
                    "Product form is incomplete."
                );

                return;
            }

            const name =
                nameElement.value.trim();

            const description =
                descriptionElement.value.trim();

            const price =
                priceElement.value.trim();

            const categoryId =
                categoryElement
                    ? categoryElement.value || null
                    : null;

            const featured =
                featuredElement
                    ? Boolean(featuredElement.checked)
                    : false;

            const imageFile =
                imageInput &&
                imageInput.files &&
                imageInput.files.length
                    ? imageInput.files[0]
                    : null;

            if (
                !name ||
                !description ||
                !price
            ) {
                alert(
                    "Please fill in all required fields."
                );

                return;
            }

            const numericPrice =
                Number(price);

            if (
                !Number.isFinite(numericPrice) ||
                numericPrice < 0
            ) {
                alert(
                    "Please enter a valid price."
                );

                return;
            }

            let imageUrl = "";

            if (imageFile) {
                if (
                    !imageFile.type ||
                    !imageFile.type.startsWith(
                        "image/"
                    )
                ) {
                    alert(
                        "Please select a valid image file."
                    );

                    return;
                }

                const extension =
                    imageFile.name.includes(".")
                        ? imageFile.name
                            .split(".")
                            .pop()
                        : "jpg";

                const filePath =
                    Date.now() +
                    "-" +
                    Math.random()
                        .toString(36)
                        .substring(2) +
                    "." +
                    extension;

                try {
                    const uploadResult =
                        await adminSupabase.storage
                            .from("product-images")
                            .upload(
                                filePath,
                                imageFile
                            );

                    if (uploadResult.error) {
                        console.error(
                            "Image upload error:",
                            uploadResult.error
                        );

                        alert(
                            "Image upload failed."
                        );

                        return;
                    }

                    const urlResult =
                        adminSupabase.storage
                            .from("product-images")
                            .getPublicUrl(
                                filePath
                            );

                    imageUrl =
                        urlResult.data
                            ? urlResult.data.publicUrl
                            : "";
                } catch (error) {
                    console.error(
                        "Image upload exception:",
                        error
                    );

                    alert(
                        "Image upload failed."
                    );

                    return;
                }
            }

            try {
                const insertResult =
                    await adminSupabase
                        .from("Products")
                        .insert({
                            name: name,
                            description: description,
                            price: numericPrice,
                            image_url: imageUrl,
                            category_id: categoryId,
                            featured: featured
                        })
                        .select("id")
                        .single();

                if (
                    insertResult.error ||
                    !insertResult.data
                ) {
                    console.error(
                        "Product insert error:",
                        insertResult.error
                    );

                    alert(
                        "Error adding product."
                    );

                    return;
                }

                alert(
                    "Product added successfully."
                );

                productForm.reset();

                if (productCategory) {
                    productCategory.value = "";
                }

                if (featuredElement) {
                    featuredElement.checked = false;
                }

                if (addProductSection) {
                    addProductSection.style.display =
                        "none";
                }

                await loadProducts();
            } catch (error) {
                console.error(
                    "Add product exception:",
                    error
                );

                alert(
                    "Error adding product."
                );
            }
        }
    );
}


/* =====================================================
   SHOW ADD PRODUCT
===================================================== */

if (showAddProductBtn) {
    showAddProductBtn.addEventListener(
        "click",
        async function () {
            if (!(await checkAuthentication())) {
                return;
            }

            await loadCategories();
            await loadProductCategoryOptions();
            ensureFeaturedProductField();

            if (addProductSection) {
                addProductSection.style.display =
                    "block";
            }

            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        }
    );
}


/* =====================================================
   CLOSE ADD PRODUCT
===================================================== */

if (closeAddProductBtn) {
    closeAddProductBtn.addEventListener(
        "click",
        function () {
            if (addProductSection) {
                addProductSection.style.display =
                    "none";
            }
        }
    );
}


/* =====================================================
   LOAD PRODUCTS
===================================================== */

async function loadProducts() {
    if (!isLoggedIn()) {
        return;
    }

    if (!productsList) {
        return;
    }

    productsList.innerHTML =
        "<p>Loading products...</p>";

    try {
        const result =
            await adminSupabase
                .from("Products")
                .select("*")
                .order(
                    "created_at",
                    {
                        ascending: false
                    }
                );

        if (result.error) {
            console.error(
                "Error loading products:",
                result.error
            );

            productsList.innerHTML =
                "<p>Could not load products.</p>";

            return;
        }

        currentProducts =
            Array.isArray(result.data)
                ? result.data
                : [];

        if (productsCount) {
            productsCount.textContent =
                currentProducts.length;
        }

        productsList.innerHTML = "";

        if (currentProducts.length === 0) {
            productsList.innerHTML =
                "<p>No products found.</p>";

            return;
        }

        currentProducts.forEach(
            function (product) {
                const card =
                    document.createElement("div");

                card.className =
                    "product-card";

                const image =
                    product.image_url
                        ? `
                            <img
                                src="${escapeHtml(product.image_url)}"
                                alt="${escapeHtml(product.name)}"
                            >
                          `
                        : `
                            <div class="no-image">
                                No Image
                            </div>
                          `;

                const category =
                    currentCategories.find(
                        function (item) {
                            return (
                                String(item.id) ===
                                String(product.category_id)
                            );
                        }
                    );

                const categoryName =
                    category
                        ? category.name
                        : "No Category";

                card.innerHTML = `
                    <div class="product-card-image">
                        ${image}
                    </div>

                    <div class="product-card-info">

                        <h3>
                            ${escapeHtml(product.name)}
                        </h3>

                        <p>
                            ${escapeHtml(
                                product.description || ""
                            )}
                        </p>

                        <strong>
                            ${escapeHtml(
                                String(product.price ?? 0)
                            )} EGP
                        </strong>

                        <p>
                            <strong>Category:</strong>
                            ${escapeHtml(categoryName)}
                        </p>

                    </div>

                    <div class="product-card-actions">

                        <button
                            type="button"
                            class="secondary-btn edit-product-btn"
                            data-id="${escapeHtml(product.id)}"
                        >
                            Edit
                        </button>

                        <button
                            type="button"
                            class="delete-btn delete-product-btn"
                            data-id="${escapeHtml(product.id)}"
                        >
                            Delete
                        </button>

                    </div>
                `;

                productsList.appendChild(card);
            }
        );

        const editButtons =
            productsList.querySelectorAll(
                ".edit-product-btn"
            );

        editButtons.forEach(
            function (button) {
                button.addEventListener(
                    "click",
                    function () {
                        editProduct(
                            button.dataset.id
                        );
                    }
                );
            }
        );

        const deleteButtons =
            productsList.querySelectorAll(
                ".delete-product-btn"
            );

        deleteButtons.forEach(
            function (button) {
                button.addEventListener(
                    "click",
                    function () {
                        deleteProduct(
                            button.dataset.id
                        );
                    }
                );
            }
        );
    } catch (error) {
        console.error(
            "Load products exception:",
            error
        );

        productsList.innerHTML =
            "<p>Could not load products.</p>";
    }
}


/* =====================================================
   EDIT PRODUCT
===================================================== */

async function editProduct(productId) {
    if (!(await checkAuthentication())) {
        return;
    }

    const product =
        currentProducts.find(
            function (item) {
                return (
                    String(item.id) ===
                    String(productId)
                );
            }
        );

    if (!product) {
        alert(
            "Product not found."
        );

        return;
    }

    const newName =
        prompt(
            "Product name:",
            product.name || ""
        );

    if (newName === null) {
        return;
    }

    const newDescription =
        prompt(
            "Product description:",
            product.description || ""
        );

    if (newDescription === null) {
        return;
    }

    const newPrice =
        prompt(
            "Product price:",
            product.price ?? 0
        );

    if (newPrice === null) {
        return;
    }

    const currentCategory =
        currentCategories.find(
            function (category) {
                return (
                    String(category.id) ===
                    String(product.category_id)
                );
            }
        );

    const currentCategoryName =
        currentCategory
            ? currentCategory.name
            : "";

    const newCategory =
        prompt(
            "Product category name. Leave empty for no category:",
            currentCategoryName
        );

    if (newCategory === null) {
        return;
    }

    const newFeatured =
        confirm(
            product.featured
                ? "Keep this product as Featured?"
                : "Make this product Featured?"
        );

    const cleanName =
        newName.trim();

    const cleanDescription =
        newDescription.trim();

    const numericPrice =
        Number(newPrice);

    const cleanCategory =
        newCategory.trim();

    if (!cleanName) {
        alert(
            "Product name cannot be empty."
        );

        return;
    }

    if (
        !Number.isFinite(numericPrice) ||
        numericPrice < 0
    ) {
        alert(
            "Please enter a valid price."
        );

        return;
    }

    let categoryId = null;

    if (cleanCategory) {
        const selectedCategory =
            currentCategories.find(
                function (category) {
                    return (
                        String(
                            category.name || ""
                        )
                            .trim()
                            .toLowerCase() ===
                        cleanCategory.toLowerCase()
                    );
                }
            );

        if (!selectedCategory) {
            alert(
                "Category not found. Please enter an existing category name."
            );

            return;
        }

        categoryId =
            selectedCategory.id;
    }

    try {
        const result =
            await adminSupabase
                .from("Products")
                .update({
                    name: cleanName,
                    description: cleanDescription,
                    price: numericPrice,
                    category_id: categoryId,
                    featured: newFeatured
                })
                .eq(
                    "id",
                    productId
                )
                .select("id")
                .single();

        if (
            result.error ||
            !result.data
        ) {
            console.error(
                "Error editing product:",
                result.error
            );

            alert(
                "Error editing the product."
            );

            return;
        }

        alert(
            "Product information updated successfully."
        );

        await loadProducts();

        const changeImage =
            confirm(
                "Do you want to change the product image?"
            );

        if (changeImage) {
            currentEditingProduct = {
                id: productId
            };

            if (editImageSection) {
                editImageSection.style.display =
                    "flex";
            }

            if (editImageInput) {
                editImageInput.value = "";
            }

            if (editImageSection) {
                editImageSection.scrollIntoView({
                    behavior: "smooth",
                    block: "center"
                });
            }
        }
    } catch (error) {
        console.error(
            "Edit product exception:",
            error
        );

        alert(
            "Error editing the product."
        );
    }
}


/* =====================================================
   CHANGE PRODUCT IMAGE
===================================================== */

if (editImageInput) {
    editImageInput.addEventListener(
        "change",
        async function () {
            if (
                !currentEditingProduct ||
                !editImageInput.files ||
                !editImageInput.files.length
            ) {
                return;
            }

            if (!(await checkAuthentication())) {
                return;
            }

            const imageFile =
                editImageInput.files[0];

            if (
                !imageFile.type ||
                !imageFile.type.startsWith(
                    "image/"
                )
            ) {
                alert(
                    "Please select an image file."
                );

                editImageInput.value = "";

                return;
            }

            const extension =
                imageFile.name.includes(".")
                    ? imageFile.name
                        .split(".")
                        .pop()
                    : "jpg";

            const filePath =
                Date.now() +
                "-" +
                Math.random()
                    .toString(36)
                    .substring(2) +
                "." +
                extension;

            try {
                const uploadResult =
                    await adminSupabase.storage
                        .from("product-images")
                        .upload(
                            filePath,
                            imageFile
                        );

                if (uploadResult.error) {
                    console.error(
                        "Image upload error:",
                        uploadResult.error
                    );

                    alert(
                        "Image upload failed."
                    );

                    return;
                }

                const urlResult =
                    adminSupabase.storage
                        .from("product-images")
                        .getPublicUrl(
                            filePath
                        );

                const newImageUrl =
                    urlResult.data
                        ? urlResult.data.publicUrl
                        : "";

                if (!newImageUrl) {
                    alert(
                        "Could not create image URL."
                    );

                    return;
                }

                const updateResult =
                    await adminSupabase
                        .from("Products")
                        .update({
                            image_url:
                                newImageUrl
                        })
                        .eq(
                            "id",
                            currentEditingProduct.id
                        )
                        .select("id")
                        .single();

                if (
                    updateResult.error ||
                    !updateResult.data
                ) {
                    console.error(
                        "Error updating image:",
                        updateResult.error
                    );

                    alert(
                        "Error updating product image."
                    );

                    return;
                }

                alert(
                    "Product image updated successfully."
                );

                currentEditingProduct = null;
                editImageInput.value = "";

                if (editImageSection) {
                    editImageSection.style.display =
                        "none";
                }

                await loadProducts();
            } catch (error) {
                console.error(
                    "Change image exception:",
                    error
                );

                alert(
                    "Image update failed."
                );
            }
        }
    );
}


/* =====================================================
   CANCEL IMAGE CHANGE
===================================================== */

if (cancelImageChangeBtn) {
    cancelImageChangeBtn.addEventListener(
        "click",
        function () {
            currentEditingProduct = null;

            if (editImageInput) {
                editImageInput.value = "";
            }

            if (editImageSection) {
                editImageSection.style.display =
                    "none";
            }
        }
    );
}


/* =====================================================
   DELETE PRODUCT
===================================================== */

async function deleteProduct(productId) {
    if (!(await checkAuthentication())) {
        return;
    }

    const confirmed =
        confirm(
            "Are you sure you want to delete this product?"
        );

    if (!confirmed) {
        return;
    }

    try {
        const result =
            await adminSupabase
                .from("Products")
                .delete()
                .eq(
                    "id",
                    productId
                )
                .select("id")
                .single();

        if (
            result.error ||
            !result.data
        ) {
            console.error(
                "Error deleting product:",
                result.error
            );

            alert(
                "Error deleting the product."
            );

            return;
        }

        alert(
            "Product deleted successfully."
        );

        await loadProducts();
    } catch (error) {
        console.error(
            "Delete product exception:",
            error
        );

        alert(
            "Error deleting the product."
        );
    }
}


/* =====================================================
   UPDATE ORDER STATUS
===================================================== */

async function updateOrderStatus(
    orderId,
    newStatus
) {
    if (!(await checkAuthentication())) {
        return;
    }

    const cleanStatus =
        String(newStatus || "")
            .trim()
            .toLowerCase();

    const allowedStatuses = [
        "pending",
        "processing",
        "completed",
        "cancelled",
        "shipped"
    ];

    if (!allowedStatuses.includes(cleanStatus)) {
        alert("Invalid order status.");
        return;
    }

    try {
        const result =
            await adminSupabase
                .from("Orders")
                .update({
                    status: cleanStatus
                })
                .eq(
                    "id",
                    orderId
                )
                .select("id,status")
                .single();

        if (
            result.error ||
            !result.data
        ) {
            console.error(
                "Error updating order status:",
                result.error
            );

            alert(
                "Could not update the order status."
            );

            return;
        }

        const localOrder =
            currentOrders.find(
                function (order) {
                    return (
                        String(order.id) ===
                        String(orderId)
                    );
                }
            );

        if (localOrder) {
            localOrder.status =
                cleanStatus;
        }

        await loadOrders();
    } catch (error) {
        console.error(
            "Update order status exception:",
            error
        );

        alert(
            "Could not update the order status."
        );
    }
}


/* =====================================================
   ACCEPT ORDER
===================================================== */

async function acceptOrder(orderId) {
    const confirmed =
        confirm(
            "Accept this order and move it to Processing?"
        );

    if (!confirmed) {
        return;
    }

    await updateOrderStatus(
        orderId,
        "processing"
    );
}


/* =====================================================
   COMPLETE ORDER
===================================================== */

async function completeOrder(orderId) {
    const confirmed =
        confirm(
            "Mark this order as Completed?"
        );

    if (!confirmed) {
        return;
    }

    await updateOrderStatus(
        orderId,
        "completed"
    );
}


/* =====================================================
   REJECT ORDER
===================================================== */

async function rejectOrder(orderId) {
    const confirmed =
        confirm(
            "Reject this order and mark it as Cancelled?"
        );

    if (!confirmed) {
        return;
    }

    await updateOrderStatus(
        orderId,
        "cancelled"
    );
}


/* =====================================================
   CALCULATE ORDER STATS
===================================================== */

function updateOrderStats() {
    const totalOrders =
        currentOrders.length;

    const pendingOrders =
        currentOrders.filter(
            function (order) {
                return (
                    String(
                        order.status || "pending"
                    )
                        .trim()
                        .toLowerCase() ===
                    "pending"
                );
            }
        ).length;

    const totalSales =
        currentOrders.reduce(
            function (total, order) {
                const status =
                    String(
                        order.status || "pending"
                    )
                        .trim()
                        .toLowerCase();

                if (status === "cancelled") {
                    return total;
                }

                return (
                    total +
                    (Number(order.total) || 0)
                );
            },
            0
        );

    if (ordersCount) {
        ordersCount.textContent =
            String(totalOrders);
    }

    if (pendingOrdersCount) {
        pendingOrdersCount.textContent =
            String(pendingOrders);
    }

    if (ordersTotalSales) {
        ordersTotalSales.textContent =
            Number(totalSales).toLocaleString(
                undefined,
                {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 2
                }
            ) +
            " EGP";
    }
}


/* =====================================================
   GET FILTERED ORDERS
===================================================== */

function getFilteredOrders() {
    const search =
        ordersSearch
            ? ordersSearch.value
                .trim()
                .toLowerCase()
            : "";

    const statusFilter =
        ordersStatusFilter
            ? ordersStatusFilter.value
            : "all";

    return currentOrders.filter(
        function (order) {
            const orderId =
                String(order.id || "")
                    .toLowerCase();

            const customerName =
                String(order.customer_name || "")
                    .toLowerCase();

            const phone =
                String(order.customer_phone || "")
                    .toLowerCase();

            const customerEmail =
                String(order.customer_email || "")
                    .toLowerCase();

            const matchesSearch =
                !search ||
                orderId.includes(search) ||
                customerName.includes(search) ||
                phone.includes(search) ||
                customerEmail.includes(search);

            const orderStatus =
                String(
                    order.status || "pending"
                )
                    .trim()
                    .toLowerCase();

            const matchesStatus =
                statusFilter === "all" ||
                orderStatus === statusFilter;

            return (
                matchesSearch &&
                matchesStatus
            );
        }
    );
}


/* =====================================================
   RENDER ORDERS
===================================================== */

async function renderOrders() {
    if (!ordersList) {
        return;
    }

    const filteredOrders =
        getFilteredOrders();

    if (filteredOrders.length === 0) {
        ordersList.innerHTML = `
            <div
                style="
                    padding:40px 20px;
                    text-align:center;
                    opacity:0.75;
                "
            >
                <h3>No matching orders</h3>
                <p>
                    Try changing your search or status filter.
                </p>
            </div>
        `;

        return;
    }

    ordersList.innerHTML =
        "<p>Loading order details...</p>";

    const orderCards =
        await Promise.all(
            filteredOrders.map(
                async function (order) {
                    let orderItems = [];

                    try {
                        const itemsResult =
                            await adminSupabase
                                .from("OrderItems")
                                .select("*")
                                .eq(
                                    "order_id",
                                    order.id
                                )
                                .order(
                                    "created_at",
                                    {
                                        ascending: true
                                    }
                                );

                        if (
                            !itemsResult.error &&
                            Array.isArray(
                                itemsResult.data
                            )
                        ) {
                            orderItems =
                                itemsResult.data;
                        }
                    } catch (error) {
                        console.error(
                            "Error loading order items:",
                            error
                        );
                    }

                    const status =
                        String(
                            order.status || "pending"
                        )
                            .trim()
                            .toLowerCase();

                    const statusClass =
                        getOrderStatusClass(
                            status
                        );

                    const formattedStatus =
                        formatOrderStatus(
                            status
                        );

                    const total =
                        Number(
                            order.total
                        ) || 0;

                    const itemsHtml =
                        orderItems.length > 0
                            ? orderItems
                                .map(
                                    function (item) {
                                        const quantity =
                                            Number(
                                                item.quantity
                                            ) || 1;

                                        const price =
                                            Number(
                                                item.price
                                            ) || 0;

                                        const lineTotal =
                                            price *
                                            quantity;

                                        return `
                                            <div
                                                style="
                                                    display:flex;
                                                    justify-content:space-between;
                                                    align-items:center;
                                                    gap:20px;
                                                    padding:12px 0;
                                                    border-bottom:1px solid rgba(255,255,255,0.08);
                                                "
                                            >
                                                <div>
                                                    <strong>
                                                        ${escapeHtml(
                                                            item.product_name
                                                        )}
                                                    </strong>

                                                    <div
                                                        style="
                                                            margin-top:4px;
                                                            opacity:0.7;
                                                            font-size:13px;
                                                        "
                                                    >
                                                        ${quantity}
                                                        أ—
                                                        ${Number(price).toLocaleString()}
                                                        EGP
                                                    </div>
                                                </div>

                                                <strong>
                                                    ${Number(lineTotal).toLocaleString()}
                                                    EGP
                                                </strong>
                                            </div>
                                        `;
                                    }
                                )
                                .join("")
                            : `
                                <p
                                    style="
                                        opacity:0.65;
                                        margin:10px 0;
                                    "
                                >
                                    No order items found.
                                </p>
                              `;

                    const isPending =
                        status === "pending";

                    const isProcessing =
                        status === "processing";

                    const isCompleted =
                        status === "completed";

                    const isCancelled =
                        status === "cancelled";

                    return `
                        <div
                            class="product-card order-card"
                            style="
                                margin-bottom:20px;
                                width:100%;
                                display:block;
                                padding:0;
                                overflow:hidden;
                            "
                        >

                            <!-- ORDER HEADER -->

                            <div
                                style="
                                    padding:20px;
                                    border-bottom:1px solid rgba(255,255,255,0.08);
                                    display:flex;
                                    justify-content:space-between;
                                    align-items:flex-start;
                                    gap:20px;
                                    flex-wrap:wrap;
                                "
                            >

                                <div>
                                    <div
                                        style="
                                            font-size:12px;
                                            opacity:0.6;
                                            margin-bottom:5px;
                                            text-transform:uppercase;
                                            letter-spacing:1px;
                                        "
                                    >
                                        Order ID
                                    </div>

                                    <h3
                                        style="
                                            margin:0;
                                            font-size:20px;
                                        "
                                    >
                                        #${escapeHtml(
                                            String(order.id).slice(0, 8)
                                        )}
                                    </h3>

                                    <div
                                        style="
                                            margin-top:7px;
                                            font-size:13px;
                                            opacity:0.65;
                                        "
                                    >
                                        ${escapeHtml(
                                            formatOrderDate(
                                                order.created_at
                                            )
                                        )}
                                    </div>
                                </div>

                                <div
                                    style="
                                        padding:7px 13px;
                                        border-radius:999px;
                                        border:1px solid rgba(255,255,255,0.12);
                                        font-size:13px;
                                        font-weight:700;
                                        text-transform:uppercase;
                                    "
                                    class="order-status-badge order-status-${escapeHtml(
                                        statusClass
                                    )}"
                                >
                                    ${escapeHtml(
                                        formattedStatus
                                    )}
                                </div>

                            </div>


                            <!-- CUSTOMER -->

                            <div
                                style="
                                    padding:20px;
                                    display:grid;
                                    grid-template-columns:repeat(auto-fit,minmax(220px,1fr));
                                    gap:18px;
                                "
                            >

                                <div>
                                    <div
                                        style="
                                            font-size:12px;
                                            opacity:0.6;
                                            margin-bottom:5px;
                                        "
                                    >
                                        CUSTOMER
                                    </div>

                                    <strong>
                                        ${escapeHtml(
                                            order.customer_name
                                        )}
                                    </strong>
                                </div>

                                <div>
                                    <div
                                        style="
                                            font-size:12px;
                                            opacity:0.6;
                                            margin-bottom:5px;
                                        "
                                    >
                                        PHONE
                                    </div>

                                    <strong>
                                        ${escapeHtml(
                                            order.customer_phone
                                        )}
                                    </strong>
                                </div>

                                ${
                                    order.customer_email
                                        ? `
                                            <div>
                                                <div
                                                    style="
                                                        font-size:12px;
                                                        opacity:0.6;
                                                        margin-bottom:5px;
                                                    "
                                                >
                                                    EMAIL
                                                </div>

                                                <strong>
                                                    ${escapeHtml(
                                                        order.customer_email
                                                    )}
                                                </strong>
                                            </div>
                                          `
                                        : ""
                                }

                                <div
                                    style="
                                        grid-column:1 / -1;
                                    "
                                >
                                    <div
                                        style="
                                            font-size:12px;
                                            opacity:0.6;
                                            margin-bottom:5px;
                                        "
                                    >
                                        DELIVERY ADDRESS
                                    </div>

                                    <strong>
                                        ${escapeHtml(
                                            order.customer_address
                                        )}
                                    </strong>
                                </div>

                                ${
                                    order.notes
                                        ? `
                                            <div
                                                style="
                                                    grid-column:1 / -1;
                                                "
                                            >
                                                <div
                                                    style="
                                                        font-size:12px;
                                                        opacity:0.6;
                                                        margin-bottom:5px;
                                                    "
                                                >
                                                    NOTES
                                                </div>

                                                <strong>
                                                    ${escapeHtml(
                                                        order.notes
                                                    )}
                                                </strong>
                                            </div>
                                          `
                                        : ""
                                }

                            </div>


                            <!-- ORDER ITEMS -->

                            <div
                                style="
                                    margin:0 20px;
                                    padding:18px;
                                    border:1px solid rgba(255,255,255,0.08);
                                    border-radius:12px;
                                "
                            >

                                <div
                                    style="
                                        font-size:12px;
                                        opacity:0.65;
                                        letter-spacing:1px;
                                        margin-bottom:5px;
                                    "
                                >
                                    ORDER ITEMS
                                </div>

                                ${itemsHtml}

                            </div>


                            <!-- TOTAL -->

                            <div
                                style="
                                    padding:20px;
                                    display:flex;
                                    justify-content:space-between;
                                    align-items:center;
                                    gap:20px;
                                    flex-wrap:wrap;
                                "
                            >

                                <div>
                                    <div
                                        style="
                                            font-size:12px;
                                            opacity:0.6;
                                            margin-bottom:4px;
                                        "
                                    >
                                        ORDER TOTAL
                                    </div>

                                    <strong
                                        style="
                                            font-size:22px;
                                        "
                                    >
                                        ${Number(total).toLocaleString()}
                                        EGP
                                    </strong>
                                </div>

                                <div>
                                    <select
                                        class="order-status-select"
                                        data-order-id="${escapeHtml(order.id)}"
                                        style="
                                            min-width:170px;
                                            padding:10px 12px;
                                            border-radius:8px;
                                            background:transparent;
                                            color:inherit;
                                            border:1px solid rgba(255,255,255,0.15);
                                        "
                                    >
                                        <option
                                            value="pending"
                                            ${
                                                status === "pending"
                                                    ? "selected"
                                                    : ""
                                            }
                                        >
                                            Pending
                                        </option>

                                        <option
                                            value="processing"
                                            ${
                                                status === "processing"
                                                    ? "selected"
                                                    : ""
                                            }
                                        >
                                            Processing
                                        </option>

                                        <option
                                            value="completed"
                                            ${
                                                status === "completed"
                                                    ? "selected"
                                                    : ""
                                            }
                                        >
                                            Completed
                                        </option>

                                        <option
                                            value="cancelled"
                                            ${
                                                status === "cancelled"
                                                    ? "selected"
                                                    : ""
                                            }
                                        >
                                            Cancelled
                                        </option>

                                        <option
                                            value="shipped"
                                            ${
                                                status === "shipped"
                                                    ? "selected"
                                                    : ""
                                            }
                                        >
                                            Shipped
                                        </option>
                                    </select>
                                </div>

                            </div>


                            <!-- ACTIONS -->

                            <div
                                style="
                                    padding:0 20px 20px;
                                    display:flex;
                                    gap:10px;
                                    flex-wrap:wrap;
                                "
                            >

                                ${
                                    isPending
                                        ? `
                                            <button
                                                type="button"
                                                class="secondary-btn accept-order-btn"
                                                data-id="${escapeHtml(order.id)}"
                                            >
                                                âœ“ Accept Order
                                            </button>

                                            <button
                                                type="button"
                                                class="delete-btn reject-order-btn"
                                                data-id="${escapeHtml(order.id)}"
                                            >
                                                â€¢ Reject Order
                                            </button>
                                          `
                                        : ""
                                }

                                ${
                                    isProcessing
                                        ? `
                                            <button
                                                type="button"
                                                class="secondary-btn complete-order-btn"
                                                data-id="${escapeHtml(order.id)}"
                                            >
                                                âœ“ Complete Order
                                            </button>
                                          `
                                        : ""
                                }

                                ${
                                    isCompleted
                                        ? `
                                            <span
                                                style="
                                                    padding:10px 14px;
                                                    border-radius:8px;
                                                    border:1px solid rgba(255,255,255,0.1);
                                                    opacity:0.75;
                                                "
                                            >
                                                âœ“ Order Completed
                                            </span>
                                          `
                                        : ""
                                }

                                ${
                                    isCancelled
                                        ? `
                                            <span
                                                style="
                                                    padding:10px 14px;
                                                    border-radius:8px;
                                                    border:1px solid rgba(255,255,255,0.1);
                                                    opacity:0.75;
                                                "
                                            >
                                                â€¢ Order Cancelled
                                            </span>
                                          `
                                        : ""
                                }

                            </div>

                        </div>
                    `;
                }
            )
        );

    ordersList.innerHTML =
        orderCards.join("");


    /* =================================================
       ACCEPT BUTTONS
    ================================================= */

    const acceptButtons =
        ordersList.querySelectorAll(
            ".accept-order-btn"
        );

    acceptButtons.forEach(
        function (button) {
            button.addEventListener(
                "click",
                function () {
                    acceptOrder(
                        button.dataset.id
                    );
                }
            );
        }
    );


    /* =================================================
       REJECT BUTTONS
    ================================================= */

    const rejectButtons =
        ordersList.querySelectorAll(
            ".reject-order-btn"
        );

    rejectButtons.forEach(
        function (button) {
            button.addEventListener(
                "click",
                function () {
                    rejectOrder(
                        button.dataset.id
                    );
                }
            );
        }
    );


    /* =================================================
       COMPLETE BUTTONS
    ================================================= */

    const completeButtons =
        ordersList.querySelectorAll(
            ".complete-order-btn"
        );

    completeButtons.forEach(
        function (button) {
            button.addEventListener(
                "click",
                function () {
                    completeOrder(
                        button.dataset.id
                    );
                }
            );
        }
    );


    /* =================================================
       STATUS SELECTS
    ================================================= */

    const statusSelects =
        ordersList.querySelectorAll(
            ".order-status-select"
        );

    statusSelects.forEach(
        function (select) {
            select.addEventListener(
                "change",
                async function () {
                    const orderId =
                        select.dataset.orderId;

                    const newStatus =
                        select.value;

                    await updateOrderStatus(
                        orderId,
                        newStatus
                    );
                }
            );
        }
    );
}


/* =====================================================
   LOAD ORDERS
===================================================== */

async function loadOrders() {
    if (!isLoggedIn()) {
        return;
    }

    if (!ordersList) {
        return;
    }

    ordersList.innerHTML =
        "<p>Loading orders...</p>";

    try {
        const ordersResult =
            await adminSupabase
                .from("Orders")
                .select("*")
                .order(
                    "created_at",
                    {
                        ascending: false
                    }
                );

        if (ordersResult.error) {
            console.error(
                "Error loading orders:",
                ordersResult.error
            );

            ordersList.innerHTML =
                "<p>Could not load orders.</p>";

            return;
        }

        currentOrders =
            Array.isArray(ordersResult.data)
                ? ordersResult.data
                : [];

        updateOrderStats();

        await renderOrders();
    } catch (error) {
        console.error(
            "Load orders exception:",
            error
        );

        ordersList.innerHTML =
            "<p>Could not load orders.</p>";
    }
}


/* =====================================================
   CLEAR ALL ORDERS
===================================================== */

async function clearAllOrders() {
    if (!(await checkAuthentication())) {
        return;
    }

    if (currentOrders.length === 0) {
        alert("There are no orders to clear.");
        return;
    }

    const totalOrders =
        currentOrders.length;

    const confirmed =
        confirm(
            "WARNING!\n\n" +
            "This will permanently delete ALL " +
            totalOrders +
            " orders from the dashboard.\n\n" +
            "The related OrderItems will also be removed automatically.\n\n" +
            "This action cannot be undone.\n\n" +
            "Do you want to continue?"
        );

    if (!confirmed) {
        return;
    }

    const doubleConfirmed =
        confirm(
            "FINAL CONFIRMATION\n\n" +
            "Delete ALL orders permanently?"
        );

    if (!doubleConfirmed) {
        return;
    }

    const clearButton =
        document.getElementById(
            "clear-all-orders-btn"
        );

    let originalText =
        "CLEAR ALL ORDERS";

    if (clearButton) {
        originalText =
            clearButton.textContent;

        clearButton.disabled = true;
        clearButton.textContent =
            "CLEARING...";
    }

    try {
        /*
         * We delete the parent Orders rows.
         *
         * OrderItems.order_id has ON DELETE CASCADE,
         * so the related OrderItems are deleted
         * automatically by the database.
         *
         * The filter below intentionally matches
         * every real UUID instead of sending a
         * completely unfiltered DELETE request.
         */
        const result =
            await adminSupabase
                .from("Orders")
                .delete()
                .neq(
                    "id",
                    "00000000-0000-0000-0000-000000000000"
                );

        if (result.error) {
            console.error(
                "Error clearing orders:",
                result.error
            );

            alert(
                "Could not clear the orders.\n\n" +
                "Please check your Supabase Orders DELETE policy."
            );

            return;
        }

        currentOrders = [];

        if (ordersSearch) {
            ordersSearch.value = "";
        }

        if (ordersStatusFilter) {
            ordersStatusFilter.value = "all";
        }

        updateOrderStats();

        if (ordersList) {
            ordersList.innerHTML = `
                <div
                    style="
                        padding:40px 20px;
                        text-align:center;
                        opacity:0.75;
                    "
                >
                    <h3>No orders found</h3>
                    <p>
                        All orders have been cleared.
                    </p>
                </div>
            `;
        }

        alert(
            "All orders have been cleared successfully."
        );
    } catch (error) {
        console.error(
            "Clear all orders exception:",
            error
        );

        alert(
            "Could not clear the orders. Please try again."
        );
    } finally {
        if (clearButton) {
            clearButton.disabled = false;
            clearButton.textContent =
                originalText || "CLEAR ALL ORDERS";
        }
    }
}


/* =====================================================
   CREATE CLEAR ORDERS BUTTON
===================================================== */

function createClearOrdersButton() {
    if (!refreshOrdersBtn) {
        return;
    }

    let clearButton =
        document.getElementById(
            "clear-all-orders-btn"
        );

    if (clearButton) {
        return;
    }

    clearButton =
        document.createElement("button");

    clearButton.type =
        "button";

    clearButton.id =
        "clear-all-orders-btn";

    clearButton.className =
        "delete-btn";

    clearButton.textContent =
        "CLEAR ALL ORDERS";

    clearButton.style.marginLeft =
        "10px";

    clearButton.addEventListener(
        "click",
        clearAllOrders
    );

    refreshOrdersBtn.insertAdjacentElement(
        "afterend",
        clearButton
    );
}


/* =====================================================
   ORDERS SEARCH
===================================================== */

if (ordersSearch) {
    ordersSearch.addEventListener(
        "input",
        function () {
            renderOrders();
        }
    );
}


/* =====================================================
   ORDERS STATUS FILTER
===================================================== */

if (ordersStatusFilter) {
    ordersStatusFilter.addEventListener(
        "change",
        function () {
            renderOrders();
        }
    );
}


/* =====================================================
   REFRESH ORDERS
===================================================== */

if (refreshOrdersBtn) {
    refreshOrdersBtn.addEventListener(
        "click",
        async function () {
            if (!isLoggedIn()) {
                return;
            }

            const originalText =
                refreshOrdersBtn.textContent;

            refreshOrdersBtn.disabled = true;
            refreshOrdersBtn.textContent =
                "â†» Refreshing...";

            try {
                await loadOrders();
            } finally {
                refreshOrdersBtn.disabled = false;
                refreshOrdersBtn.textContent =
                    originalText || "â†» Refresh";
            }
        }
    );
}


/* =====================================================
   LOAD STORE SETTINGS
===================================================== */

async function loadStoreSettings() {
    if (!(await checkAuthentication())) {
        return;
    }

    try {
        const result =
            await adminSupabase
                .from("StoreSettings")
                .select("*")
                .limit(1)
                .single();

        if (result.error) {
            console.error(
                "Error loading store settings:",
                result.error
            );

            return;
        }

        const data =
            result.data || {};

        const storeName =
            document.getElementById(
                "store-name"
            );

        const storeDescription =
            document.getElementById(
                "store-description"
            );

        const storePhone =
            document.getElementById(
                "store-phone"
            );

        const storeEmail =
            document.getElementById(
                "store-email"
            );

        const storeAddress =
            document.getElementById(
                "store-address"
            );

        const ownerName =
            document.getElementById(
                "owner-name"
            );

        const ownerBio =
            document.getElementById(
                "owner-bio"
            );

        if (storeName) {
            storeName.value =
                data.store_name || "";
        }

        if (storeDescription) {
            storeDescription.value =
                data.store_description || "";
        }

        if (storePhone) {
            storePhone.value =
                data.phone || "";
        }

        if (storeEmail) {
            storeEmail.value =
                data.email || "";
        }

        if (storeAddress) {
            storeAddress.value =
                data.address || "";
        }

        if (ownerName) {
            ownerName.value =
                data.owner_name || "";
        }

        if (ownerBio) {
            ownerBio.value =
                data.owner_bio || "";
        }

        if (
            storeLogoPreview &&
            data.logo_url
        ) {
            storeLogoPreview.innerHTML = `
                <img
                    src="${escapeHtml(data.logo_url)}"
                    alt="Store Logo"
                    style="
                        max-width:180px;
                        max-height:100px;
                        object-fit:contain;
                        display:block;
                    "
                >
            `;
        } else if (storeLogoPreview) {
            storeLogoPreview.innerHTML = "";
        }
    } catch (error) {
        console.error(
            "Load store settings exception:",
            error
        );
    }
}


/* =====================================================
   SAVE STORE SETTINGS
===================================================== */

async function saveStoreSettings() {
    if (!(await checkAuthentication())) {
        return;
    }

    const storeName =
        document.getElementById(
            "store-name"
        );

    const storeDescription =
        document.getElementById(
            "store-description"
        );

    const phone =
        document.getElementById(
            "store-phone"
        );

    const email =
        document.getElementById(
            "store-email"
        );

    const address =
        document.getElementById(
            "store-address"
        );

    const ownerName =
        document.getElementById(
            "owner-name"
        );

    const ownerBio =
        document.getElementById(
            "owner-bio"
        );

    const message =
        document.getElementById(
            "settings-message"
        );

    if (
        !storeName ||
        !storeDescription ||
        !phone ||
        !email ||
        !address ||
        !ownerName ||
        !ownerBio
    ) {
        if (message) {
            message.textContent =
                "Settings form is incomplete.";
        }

        return;
    }

    try {
        const settingsResult =
            await adminSupabase
                .from("StoreSettings")
                .select("id")
                .limit(1)
                .single();

        if (
            settingsResult.error ||
            !settingsResult.data
        ) {
            console.error(
                "Error finding store settings:",
                settingsResult.error
            );

            if (message) {
                message.textContent =
                    "Could not find store settings.";
            }

            return;
        }

        const updateResult =
            await adminSupabase
                .from("StoreSettings")
                .update({
                    store_name:
                        storeName.value.trim(),

                    store_description:
                        storeDescription.value.trim(),

                    phone:
                        phone.value.trim(),

                    email:
                        email.value.trim(),

                    address:
                        address.value.trim(),

                    owner_name:
                        ownerName.value.trim(),

                    owner_bio:
                        ownerBio.value.trim(),

                    updated_at:
                        new Date().toISOString()
                })
                .eq(
                    "id",
                    settingsResult.data.id
                )
                .select("id")
                .single();

        if (
            updateResult.error ||
            !updateResult.data
        ) {
            console.error(
                "Error saving store settings:",
                updateResult.error
            );

            if (message) {
                message.textContent =
                    "Error saving settings.";
            }

            return;
        }

        if (message) {
            message.textContent =
                "Settings saved successfully.";

            setTimeout(
                function () {
                    if (message) {
                        message.textContent = "";
                    }
                },
                3000
            );
        }
    } catch (error) {
        console.error(
            "Save settings exception:",
            error
        );

        if (message) {
            message.textContent =
                "Error saving settings.";
        }
    }
}


if (saveSettingsButton) {
    saveSettingsButton.addEventListener(
        "click",
        saveStoreSettings
    );
}


/* =====================================================
   STORE LOGO
===================================================== */

if (storeLogoInput) {
    storeLogoInput.addEventListener(
        "change",
        async function () {
            if (!(await checkAuthentication())) {
                storeLogoInput.value = "";
                return;
            }

            const imageFile =
                storeLogoInput.files &&
                storeLogoInput.files.length
                    ? storeLogoInput.files[0]
                    : null;

            if (!imageFile) {
                return;
            }

            if (
                !imageFile.type ||
                !imageFile.type.startsWith(
                    "image/"
                )
            ) {
                alert(
                    "Please select an image file."
                );

                storeLogoInput.value = "";

                return;
            }

            const message =
                document.getElementById(
                    "settings-message"
                );

            if (message) {
                message.textContent =
                    "Uploading logo...";
            }

            try {
                const extension =
                    imageFile.name.includes(".")
                        ? imageFile.name
                            .split(".")
                            .pop()
                        : "png";

                const filePath =
                    "logo-" +
                    Date.now() +
                    "-" +
                    Math.random()
                        .toString(36)
                        .substring(2) +
                    "." +
                    extension;

                const uploadResult =
                    await adminSupabase.storage
                        .from("store-assets")
                        .upload(
                            filePath,
                            imageFile
                        );

                if (uploadResult.error) {
                    console.error(
                        "Logo upload error:",
                        uploadResult.error
                    );

                    if (message) {
                        message.textContent =
                            "Logo upload failed.";
                    }

                    return;
                }

                const urlResult =
                    adminSupabase.storage
                        .from("store-assets")
                        .getPublicUrl(
                            filePath
                        );

                const logoUrl =
                    urlResult.data
                        ? urlResult.data.publicUrl
                        : "";

                if (!logoUrl) {
                    if (message) {
                        message.textContent =
                            "Could not create logo URL.";
                    }

                    return;
                }

                const settingsResult =
                    await adminSupabase
                        .from("StoreSettings")
                        .select("id")
                        .limit(1)
                        .single();

                if (
                    settingsResult.error ||
                    !settingsResult.data
                ) {
                    console.error(
                        "Error finding store settings:",
                        settingsResult.error
                    );

                    if (message) {
                        message.textContent =
                            "Could not find store settings.";
                    }

                    return;
                }

                const updateResult =
                    await adminSupabase
                        .from("StoreSettings")
                        .update({
                            logo_url:
                                logoUrl,

                            updated_at:
                                new Date().toISOString()
                        })
                        .eq(
                            "id",
                            settingsResult.data.id
                        )
                        .select("id")
                        .single();

                if (
                    updateResult.error ||
                    !updateResult.data
                ) {
                    console.error(
                        "Error saving logo:",
                        updateResult.error
                    );

                    if (message) {
                        message.textContent =
                            "Could not save logo.";
                    }

                    return;
                }

                if (storeLogoPreview) {
                    storeLogoPreview.innerHTML = `
                        <img
                            src="${escapeHtml(logoUrl)}"
                            alt="Store Logo"
                            style="
                                max-width:180px;
                                max-height:100px;
                                object-fit:contain;
                                display:block;
                            "
                        >
                    `;
                }

                if (message) {
                    message.textContent =
                        "Logo saved successfully.";
                }

                storeLogoInput.value = "";
            } catch (error) {
                console.error(
                    "Logo upload exception:",
                    error
                );

                if (message) {
                    message.textContent =
                        "Logo upload failed.";
                }
            }
        }
    );
}


/* =====================================================
   ADMIN THEME
===================================================== */

function applyAdminTheme() {
    const root =
        document.documentElement;

    if (
        themeAccentColor &&
        /^#[0-9A-Fa-f]{6}$/.test(
            themeAccentColor.value
        )
    ) {
        root.style.setProperty(
            "--theme-accent",
            themeAccentColor.value
        );
    }

    if (
        themeBackgroundColor &&
        /^#[0-9A-Fa-f]{6}$/.test(
            themeBackgroundColor.value
        )
    ) {
        root.style.setProperty(
            "--theme-background",
            themeBackgroundColor.value
        );
    }

    if (
        themeTextColor &&
        /^#[0-9A-Fa-f]{6}$/.test(
            themeTextColor.value
        )
    ) {
        root.style.setProperty(
            "--theme-text",
            themeTextColor.value
        );
    }
}


/* =====================================================
   SYNC COLOR INPUTS
===================================================== */

function syncColorInput(
    colorInput,
    textInput
) {
    if (
        !colorInput ||
        !textInput
    ) {
        return;
    }

    colorInput.addEventListener(
        "input",
        function () {
            textInput.value =
                colorInput.value;

            applyAdminTheme();
        }
    );

    textInput.addEventListener(
        "input",
        function () {
            const value =
                textInput.value.trim();

            if (
                /^#[0-9A-Fa-f]{6}$/.test(
                    value
                )
            ) {
                colorInput.value =
                    value;

                applyAdminTheme();
            }
        }
    );
}


/* =====================================================
   LOAD THEME SETTINGS
===================================================== */

async function loadThemeSettings() {
    if (!(await checkAuthentication())) {
        return;
    }

    try {
        const result =
            await adminSupabase
                .from("ThemeSettings")
                .select("*")
                .limit(1)
                .single();

        if (
            result.error ||
            !result.data
        ) {
            console.error(
                "Error loading theme settings:",
                result.error
            );

            return;
        }

        const data =
            result.data;

        const accent =
            data.accent_color ||
            "#C9A227";

        const background =
            data.background_color ||
            "#080808";

        const text =
            data.text_color ||
            "#ffffff";

        if (themeMode) {
            themeMode.value =
                data.theme_mode ||
                "dark";
        }

        if (themeAccentColor) {
            themeAccentColor.value =
                accent;
        }

        if (themeAccentText) {
            themeAccentText.value =
                accent;
        }

        if (themeBackgroundColor) {
            themeBackgroundColor.value =
                background;
        }

        if (themeBackgroundText) {
            themeBackgroundText.value =
                background;
        }

        if (themeTextColor) {
            themeTextColor.value =
                text;
        }

        if (themeTextText) {
            themeTextText.value =
                text;
        }

        applyAdminTheme();
    } catch (error) {
        console.error(
            "Load theme settings exception:",
            error
        );
    }
}


/* =====================================================
   SAVE THEME SETTINGS
===================================================== */

async function saveThemeSettings() {
    if (!(await checkAuthentication())) {
        return;
    }

    if (
        !themeMode ||
        !themeAccentColor ||
        !themeBackgroundColor ||
        !themeTextColor
    ) {
        if (themeMessage) {
            themeMessage.textContent =
                "Theme form is incomplete.";
        }

        return;
    }

    const accent =
        themeAccentColor.value.trim();

    const background =
        themeBackgroundColor.value.trim();

    const text =
        themeTextColor.value.trim();

    if (
        !/^#[0-9A-Fa-f]{6}$/.test(accent) ||
        !/^#[0-9A-Fa-f]{6}$/.test(background) ||
        !/^#[0-9A-Fa-f]{6}$/.test(text)
    ) {
        if (themeMessage) {
            themeMessage.textContent =
                "Please enter valid HEX colors.";
        }

        return;
    }

    try {
        const settingsResult =
            await adminSupabase
                .from("ThemeSettings")
                .select("id")
                .limit(1)
                .single();

        if (
            settingsResult.error ||
            !settingsResult.data
        ) {
            console.error(
                "Error finding theme settings:",
                settingsResult.error
            );

            if (themeMessage) {
                themeMessage.textContent =
                    "Could not find theme settings.";
            }

            return;
        }

        const updateResult =
            await adminSupabase
                .from("ThemeSettings")
                .update({
                    theme_mode:
                        themeMode.value,

                    accent_color:
                        accent,

                    background_color:
                        background,

                    text_color:
                        text,

                    updated_at:
                        new Date().toISOString()
                })
                .eq(
                    "id",
                    settingsResult.data.id
                )
                .select("id")
                .single();

        if (
            updateResult.error ||
            !updateResult.data
        ) {
            console.error(
                "Error saving theme settings:",
                updateResult.error
            );

            if (themeMessage) {
                themeMessage.textContent =
                    "Error saving theme.";
            }

            return;
        }

        applyAdminTheme();

        if (themeMessage) {
            themeMessage.textContent =
                "Theme saved successfully.";

            setTimeout(
                function () {
                    if (themeMessage) {
                        themeMessage.textContent =
                            "";
                    }
                },
                3000
            );
        }
    } catch (error) {
        console.error(
            "Save theme exception:",
            error
        );

        if (themeMessage) {
            themeMessage.textContent =
                "Error saving theme.";
        }
    }
}


/* =====================================================
   COLOR INPUT EVENTS
===================================================== */

syncColorInput(
    themeAccentColor,
    themeAccentText
);

syncColorInput(
    themeBackgroundColor,
    themeBackgroundText
);

syncColorInput(
    themeTextColor,
    themeTextText
);


/* =====================================================
   THEME MODE
===================================================== */

if (themeMode) {
    themeMode.addEventListener(
        "change",
        function () {
            applyAdminTheme();
        }
    );
}


/* =====================================================
   SAVE THEME BUTTON
===================================================== */

if (saveThemeButton) {
    saveThemeButton.addEventListener(
        "click",
        saveThemeSettings
    );
}


createContentEditorNav();


/* =====================================================
   INITIAL STATE
===================================================== */

ensureFeaturedProductField();


hideAllMainSections();

if (dashboardSection) {
    dashboardSection.style.display = "none";
}

if (loginSection) {
    loginSection.style.display = "none";
}


/* =====================================================
   CREATE ORDERS CLEAR BUTTON
===================================================== */

createClearOrdersButton();


/* =====================================================
   INITIALIZE ADMIN
===================================================== */

checkSession();