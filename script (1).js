document.addEventListener("DOMContentLoaded", function () {

  let cart = JSON.parse(localStorage.getItem("krunchiezCart") || "[]");

  const cartPanel = document.getElementById("cartPanel");
  const overlay = document.getElementById("overlay");
  const cartItems = document.getElementById("cartItems");
  const cartTotal = document.getElementById("cartTotal");
  const checkoutBtn = document.getElementById("checkoutBtn");
  const toast = document.getElementById("toast");

  // =========================
  // CART STORAGE
  // =========================

  function saveCart() {
    localStorage.setItem("krunchiezCart", JSON.stringify(cart));
  }

  function getTotal() {
    return cart.reduce(function (sum, item) {
      return sum + (item.price * item.quantity);
    }, 0);
  }

  function updateCount() {
    const counters = document.querySelectorAll("#cartCount");

    counters.forEach(function (counter) {
      counter.textContent = cart.reduce(function (sum, item) {
        return sum + item.quantity;
      }, 0);
    });
  }

  // =========================
  // TOAST
  // =========================

  function showToast(message) {
    if (!toast) return;

    toast.textContent = message;
    toast.classList.add("show");

    setTimeout(function () {
      toast.classList.remove("show");
    }, 1800);
  }

  // =========================
  // RENDER CART
  // =========================

  function renderCart() {

    if (!cartItems) return;

    if (cart.length === 0) {

      cartItems.innerHTML =
        '<p class="empty">Your cart is waiting for a crunch.</p>';

      if (cartTotal) {
        cartTotal.textContent = "₹0";
      }

      updateCount();
      return;
    }

    cartItems.innerHTML = cart.map(function (item, index) {

      return `
        <div class="cart-item">

          <div class="cart-item-info">
            <strong>${item.name}</strong>
            <span>₹${item.price} × ${item.quantity}</span>
          </div>

          <div class="cart-item-actions">

            <button type="button"
              data-action="decrease"
              data-index="${index}">
              −
            </button>

            <span>${item.quantity}</span>

            <button type="button"
              data-action="increase"
              data-index="${index}">
              +
            </button>

            <button type="button"
              data-action="remove"
              data-index="${index}">
              Remove
            </button>

          </div>

        </div>
      `;

    }).join("");

    if (cartTotal) {
      cartTotal.textContent = "₹" + getTotal();
    }

    updateCount();
  }

  // =========================
  // ADD TO CART
  // =========================

  document.addEventListener("click", function (event) {

    const button = event.target.closest(".add-btn");

    if (!button) return;

    const name = button.getAttribute("data-name");
    const price = Number(button.getAttribute("data-price"));
    const weight = button.getAttribute("data-weight") || "52 g";

    if (!name || !price) {
      console.error("Product information missing:", button);
      return;
    }

    const existing = cart.find(function (item) {
      return item.name === name;
    });

    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({
        name: name,
        price: price,
        weight: weight,
        quantity: 1
      });
    }

    saveCart();
    renderCart();

    showToast(name + " added to cart ✓");
  });

  // =========================
  // CART QUANTITY BUTTONS
  // =========================

  if (cartItems) {

    cartItems.addEventListener("click", function (event) {

      const button = event.target.closest("[data-action]");

      if (!button) return;

      const index = Number(button.getAttribute("data-index"));
      const action = button.getAttribute("data-action");

      if (!cart[index]) return;

      if (action === "increase") {
        cart[index].quantity++;
      }

      if (action === "decrease") {

        cart[index].quantity--;

        if (cart[index].quantity <= 0) {
          cart.splice(index, 1);
        }
      }

      if (action === "remove") {
        cart.splice(index, 1);
      }

      saveCart();
      renderCart();

    });

  }

  // =========================
  // OPEN CART
  // =========================

  function openCart() {

    if (cartPanel) {
      cartPanel.classList.add("open");
    }

    if (overlay) {
      overlay.classList.add("show");
    }

    renderCart();
  }

  // =========================
  // CLOSE CART
  // =========================

  function closeCart() {

    if (cartPanel) {
      cartPanel.classList.remove("open");
    }

    if (overlay) {
      overlay.classList.remove("show");
    }
  }

  // =========================
  // CART BUTTON
  // =========================

  document.addEventListener("click", function (event) {

    const button = event.target.closest("#openCart");

    if (button) {
      event.preventDefault();
      openCart();
    }

  });

  // =========================
  // CLOSE BUTTON
  // =========================

  document.addEventListener("click", function (event) {

    const button = event.target.closest("#closeCart");

    if (button) {
      event.preventDefault();
      closeCart();
    }

  });

  // =========================
  // OVERLAY
  // =========================

  if (overlay) {

    overlay.addEventListener("click", function () {
      closeCart();
    });

  }

  // =========================
  // CHECKOUT
  // =========================

  document.addEventListener("click", function (event) {

    const button = event.target.closest("#checkoutBtn");

    if (!button) return;

    event.preventDefault();

    if (cart.length === 0) {
      showToast("Your cart is empty!");
      return;
    }

    if (document.getElementById("checkoutModal")) return;

    const modal = document.createElement("div");

    modal.id = "checkoutModal";

    modal.innerHTML = `

      <div class="checkout-overlay"></div>

      <div class="checkout-modal">

        <button type="button" class="checkout-close">×</button>

        <div class="eyebrow">KRUNCHIEZ CHECKOUT</div>

        <h2>GRAB YOUR PACKS.</h2>

        <p>
          Order total:
          <strong>₹${getTotal()}</strong>
        </p>

        <form id="checkoutForm">

          <label>
            Name
            <input
              id="customerName"
              required
              placeholder="Your name"
            >
          </label>

          <label>
            Phone
            <input
              id="customerPhone"
              required
              inputmode="numeric"
              maxlength="10"
              placeholder="10-digit mobile number"
            >
          </label>

          <label>
            Delivery Address
            <textarea
              id="customerAddress"
              required
              placeholder="House / street / area / city / pincode"
            ></textarea>
          </label>

          <button
            class="btn btn-dark"
            type="submit"
            style="width:100%"
          >
            PLACE ORDER →
          </button>

          <p class="checkout-help">
            Your order will be prepared and sent to Krunchiez by email.
          </p>

        </form>

      </div>
    `;

    document.body.appendChild(modal);

    // CLOSE CHECKOUT

    modal.querySelector(".checkout-close").onclick = function () {
      modal.remove();
    };

    modal.querySelector(".checkout-overlay").onclick = function () {
      modal.remove();
    };

    // SUBMIT ORDER

    modal.querySelector("#checkoutForm").addEventListener(
      "submit",
      function (e) {

        e.preventDefault();

        const name =
          document.getElementById("customerName").value.trim();

        const phone =
          document.getElementById("customerPhone").value.trim();

        const address =
          document.getElementById("customerAddress").value.trim();

        const orderDetails = cart.map(function (item) {

          return (
            item.name +
            " × " +
            item.quantity +
            " = ₹" +
            (item.price * item.quantity)
          );

        }).join("\n");

        const subject = encodeURIComponent(
          "Krunchiez Order - " + name
        );

        const body = encodeURIComponent(
          "NEW KRUNCHIEZ ORDER\n\n" +
          "Customer: " + name + "\n" +
          "Phone: " + phone + "\n" +
          "Address: " + address + "\n\n" +
          "ORDER:\n" +
          orderDetails + "\n\n" +
          "TOTAL: ₹" + getTotal()
        );

       fetch("https://krunchiez-backend.krunchiezfoodspvt-ltd.workers.dev/create-order", {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    customer: {
      name: name,
      phone: phone,
      address: address
    },
    items: cart,
    total: getTotal()
  })
})
.then(function(response) {
  return response.json();
})
.then(function(data) {

  if (data.success) {

    alert("Order received by Krunchiez! 🎉");

    cart = [];
    saveCart();
    renderCart();

    modal.remove();

  } else {

    alert("Something went wrong. Please try again.");

  }

})
.catch(function(error) {

  console.error("Order error:", error);

  alert("Could not connect to Krunchiez server.");

});

      }
    );

  });

  // =========================
  // ESCAPE KEY
  // =========================

  document.addEventListener("keydown", function (event) {

    if (event.key === "Escape") {
      closeCart();
    }

  });

  // =========================
  // EXTRA CART STYLING
  // =========================

  const style = document.createElement("style");

  style.textContent = `

    .cart-item {
      padding: 14px 0;
      border-bottom: 1px solid rgba(0,0,0,.12);
    }

    .cart-item-info {
      display: flex;
      justify-content: space-between;
      gap: 12px;
      margin-bottom: 10px;
    }

    .cart-item-actions {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .cart-item-actions button {
      border: 1px solid #111;
      background: #fff;
      padding: 5px 9px;
      cursor: pointer;
    }

    .cart-item-actions button:last-child {
      margin-left: auto;
    }

    .checkout-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0,0,0,.65);
      z-index: 9998;
    }

    .checkout-modal {
      position: fixed;
      z-index: 9999;
      width: min(92vw,500px);
      max-height: 90vh;
      overflow: auto;
      left: 50%;
      top: 50%;
      transform: translate(-50%,-50%);
      background: #fff;
      color: #111;
      padding: 30px;
      box-shadow: 0 20px 60px rgba(0,0,0,.35);
    }

    .checkout-close {
      position: absolute;
      right: 15px;
      top: 10px;
      border: 0;
      background: transparent;
      font-size: 30px;
      cursor: pointer;
    }

    .checkout-modal label {
      display: block;
      margin: 16px 0;
      font-weight: 700;
    }

    .checkout-modal input,
    .checkout-modal textarea {
      display: block;
      width: 100%;
      box-sizing: border-box;
      margin-top: 7px;
      padding: 12px;
      border: 1px solid #bbb;
      font: inherit;
    }

    .checkout-modal textarea {
      min-height: 100px;
      resize: vertical;
    }

    .checkout-help {
      font-size: 12px;
      opacity: .65;
    }

  `;

  document.head.appendChild(style);

  // =========================
  // START
  // =========================

  renderCart();

  console.log("KRUNCHIEZ CART SCRIPT LOADED ✓");

});
