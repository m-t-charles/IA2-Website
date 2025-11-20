/* E-Gaming Boot Camp - Cart & Checkout Logic */

let cart = JSON.parse(localStorage.getItem("cart")) || [];

function addToCart(name, price, qty = 1) {
    let existing = cart.find(item => item.name === name);
    if (existing) {
        existing.qty += qty;
    } else {
        cart.push({ name, price, qty });
    }
    saveCart();
    alert(name + " added to cart!");
}

function saveCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
}

function clearCart() {
    cart = [];
    saveCart();
    alert("Cart cleared!");
    window.location.reload();
}

function renderCartTable(tableId) {
    let table = document.getElementById(tableId);
    if (!table) return;
    let tbody = table.querySelector("tbody");
    tbody.innerHTML = "";
    let subtotal = 0;
    cart.forEach(item => {
        let row = document.createElement("tr");
        let sub = item.price * item.qty;
        subtotal += sub;
        row.innerHTML = `
            <td>${item.name}</td>
            <td>$${item.price.toFixed(2)}</td>
            <td>${item.qty}</td>
            <td>$${sub.toFixed(2)}</td>
        `;
        tbody.appendChild(row);
    });
    let discount = subtotal > 50 ? 5 : 0;
    let tax = (subtotal - discount) * 0.15;
    let total = subtotal - discount + tax;
    let summary = document.getElementById("cart-summary");
    if (summary) {
        summary.innerHTML = `
            <tr><td>Items total</td><td class="right">$${subtotal.toFixed(2)}</td></tr>
            <tr><td>Discount</td><td class="right">-$${discount.toFixed(2)}</td></tr>
            <tr><td>Tax (15%)</td><td class="right">$${tax.toFixed(2)}</td></tr>
            <tr><td><strong>Total</strong></td><td class="right"><strong>$${total.toFixed(2)}</strong></td></tr>
        `;
    }
    return { subtotal, discount, tax, total };
}

function handleCheckout(formId) {
    let form = document.getElementById(formId);
    if (!form) return;
    form.addEventListener("submit", function(e) {
        e.preventDefault();
        let data = new FormData(form);
        let details = {};
        data.forEach((val, key) => details[key] = val);
        let totals = renderCartTable("checkout-table");
        localStorage.setItem("invoice", JSON.stringify({ details, cart, totals }));
        alert("Order confirmed! Redirecting to invoice...");
        window.location.href = "invoice.html";
    });
}

function renderInvoice() {
    let invoice = JSON.parse(localStorage.getItem("invoice"));
    if (!invoice) return;
    let tbody = document.getElementById("invoice-body");
    let summary = document.getElementById("invoice-summary");
    let detailsDiv = document.getElementById("invoice-details");
    tbody.innerHTML = "";
    invoice.cart.forEach(item => {
        let row = document.createElement("tr");
        let sub = item.price * item.qty;
        row.innerHTML = `
            <td>${item.name}</td>
            <td>${item.qty}</td>
            <td>$${item.price.toFixed(2)}</td>
            <td>$${sub.toFixed(2)}</td>
        `;
        tbody.appendChild(row);
    });
    summary.innerHTML = `
        <tr><td>Discount</td><td class="right">-$${invoice.totals.discount.toFixed(2)}</td></tr>
        <tr><td>Tax (15%)</td><td class="right">$${invoice.totals.tax.toFixed(2)}</td></tr>
        <tr><td><strong>Total</strong></td><td class="right"><strong>$${invoice.totals.total.toFixed(2)}</strong></td></tr>
    `;
    detailsDiv.innerHTML = `
        <p>Name: ${invoice.details["ship-name"]}</p>
        <p>Address: ${invoice.details["ship-address"]}</p>
        <p>Email: ${invoice.details["ship-email"]}</p>
        <p>Amount paid: $${invoice.details["amount"]}</p>
    `;
}