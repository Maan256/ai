const menuItems = [
  {
    id: 1,
    name: "Smoky BBQ Burger",
    category: "burgers",
    price: 15.9,
    rating: 4.9,
    description: "Beef patty, cheddar, caramelized onions, smoked BBQ sauce.",
    image:
      "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 2,
    name: "Crispy Chicken Crunch",
    category: "burgers",
    price: 13.5,
    rating: 4.8,
    description: "Crispy chicken, slaw, pickles, and spicy mayo on brioche.",
    image:
      "https://images.unsplash.com/photo-1550317138-10000687a72b?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 3,
    name: "Power Protein Bowl",
    category: "bowls",
    price: 16.4,
    rating: 4.9,
    description:
      "Grilled chicken, quinoa, greens, avocado, and lemon dressing.",
    image:
      "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 4,
    name: "Mediterranean Feast",
    category: "bowls",
    price: 14.8,
    rating: 4.7,
    description: "Hummus, falafel, couscous, roasted veggies, and tahini.",
    image:
      "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 5,
    name: "Salmon Sunset Roll",
    category: "sushi",
    price: 17.2,
    rating: 4.9,
    description: "Fresh salmon, avocado, cucumber, and sesame crunch.",
    image:
      "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 6,
    name: "Tokyo Dragon Roll",
    category: "sushi",
    price: 18.5,
    rating: 5.0,
    description: "Tempura shrimp, spicy mayo, eel sauce, and scallions.",
    image:
      "https://images.unsplash.com/photo-1553621042-f6e147245754?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 7,
    name: "Choco Lava Cake",
    category: "desserts",
    price: 8.9,
    rating: 4.8,
    description: "Warm chocolate cake with molten center and vanilla cream.",
    image:
      "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 8,
    name: "Berry Cheesecake",
    category: "desserts",
    price: 7.4,
    rating: 4.7,
    description:
      "Creamy cheesecake layered with berry compote and biscuit crust.",
    image:
      "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&w=900&q=80",
  },
];

const cart = [];
const menuGrid = document.getElementById("menuGrid");
const cartItems = document.getElementById("cartItems");
const subtotalEl = document.getElementById("subtotal");
const totalEl = document.getElementById("total");
const deliveryFeeEl = document.getElementById("deliveryFee");
const itemCountEl = document.getElementById("itemCount");
const toast = document.getElementById("toast");

const deliveryFee = 4.99;

function formatMoney(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);
}

function renderMenu(category = "all") {
  const filteredItems =
    category === "all"
      ? menuItems
      : menuItems.filter((item) => item.category === category);

  menuGrid.innerHTML = filteredItems
    .map(
      (item) => `
        <article class="menu-item">
          <img src="${item.image}" alt="${item.name}" />
          <div class="item-body">
            <div class="item-top">
              <h3>${item.name}</h3>
              <span class="item-price">${formatMoney(item.price)}</span>
            </div>
            <p class="meta">${item.description}</p>
            <div class="item-actions">
              <span class="rating">★ ${item.rating}</span>
              <button class="add-btn" data-id="${item.id}">Add</button>
            </div>
          </div>
        </article>
      `,
    )
    .join("");
}

function addToCart(id) {
  const item = menuItems.find((entry) => entry.id === Number(id));
  if (!item) return;

  const existing = cart.find((entry) => entry.id === item.id);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ ...item, quantity: 1 });
  }

  renderCart();
}

function updateQty(id, change) {
  const item = cart.find((entry) => entry.id === id);
  if (!item) return;

  item.quantity += change;
  if (item.quantity <= 0) {
    const index = cart.findIndex((entry) => entry.id === id);
    cart.splice(index, 1);
  }

  renderCart();
}

function renderCart() {
  if (cart.length === 0) {
    cartItems.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">🛒</div>
        <p>Your cart is empty</p>
        <small>Add some tasty dishes to get started.</small>
      </div>
    `;
  } else {
    cartItems.innerHTML = cart
      .map(
        (item) => `
          <div class="cart-item">
            <img src="${item.image}" alt="${item.name}" />
            <div class="item-info">
              <strong>${item.name}</strong>
              <span>${formatMoney(item.price * item.quantity)}</span>
            </div>
            <div class="item-controls">
              <div class="qty-box">
                <button class="qty-btn" data-action="decrease" data-id="${item.id}">−</button>
                <span>${item.quantity}</span>
                <button class="qty-btn" data-action="increase" data-id="${item.id}">+</button>
              </div>
            </div>
          </div>
        `,
      )
      .join("");
  }

  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const total = subtotal + deliveryFee;

  subtotalEl.textContent = formatMoney(subtotal);
  deliveryFeeEl.textContent = formatMoney(deliveryFee);
  totalEl.textContent = formatMoney(total);
  itemCountEl.textContent = `${cart.reduce((sum, item) => sum + item.quantity, 0)} items`;
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  window.clearTimeout(showToast.timeoutId);
  showToast.timeoutId = window.setTimeout(
    () => toast.classList.remove("show"),
    1800,
  );
}

function setupFilters() {
  const filterButtons = document.querySelectorAll(".filter");
  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      filterButtons.forEach((btn) => btn.classList.remove("active"));
      button.classList.add("active");
      renderMenu(button.dataset.category);
    });
  });
}

function bindEvents() {
  document.addEventListener("click", (event) => {
    const addButton = event.target.closest(".add-btn");
    if (addButton) {
      addToCart(addButton.dataset.id);
      showToast("Item added to cart");
    }

    const qtyButton = event.target.closest(".qty-btn");
    if (qtyButton) {
      const id = Number(qtyButton.dataset.id);
      const action = qtyButton.dataset.action;
      updateQty(id, action === "increase" ? 1 : -1);
    }

    const checkoutBtn = event.target.closest("#checkoutBtn");
    if (checkoutBtn) {
      if (cart.length === 0) {
        showToast("Your cart is empty");
        return;
      }
      showToast("Order placed successfully!");
      cart.length = 0;
      renderCart();
    }

    const quickOrder = event.target.closest("#quickOrder");
    if (quickOrder) {
      document.getElementById("menu").scrollIntoView({ behavior: "smooth" });
    }
  });
}

renderMenu();
renderCart();
setupFilters();
bindEvents();
