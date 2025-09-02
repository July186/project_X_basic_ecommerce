// Jalankan fungsi saat seluruh dokumen HTML telah dimuat
document.addEventListener("DOMContentLoaded", function () {
  // Ambil data dari localStorage jika ada, jika tidak, buat objek kosong
  shippingOptions = JSON.parse(localStorage.getItem('shippingOptions')) || {};
  productNotes = JSON.parse(localStorage.getItem('productNotes')) || {};
  
  // Tampilkan produk yang akan dipesan dan ringkasan belanja
  displayOrderItems();
  displayShoppingSummary();
  
  // Ketika tombol checkout ditekan
  document.body.addEventListener("click", function(e) {
    if(e.target.id === "order-btn") {
      placeOrder();
    }
  });
});

// Global state untuk menyimpan pilihan pengiriman dan catatan produk
let shippingOptions = {};
let productNotes = {};

function displayOrderItems() {
  const orderItemsContainer = document.getElementById("order-items-container");
  orderItemsContainer.innerHTML = "";

  // Ambil item yang dipilih dari localStorage
  const cart = JSON.parse(localStorage.getItem("selectedCartItems")) || [];
  
  // Jika kosong, tampilkan pesan
  if (cart.length === 0) {
    orderItemsContainer.innerHTML = '<p class="text-gray-500">No items selected</p>';
    return;
  }

  const itemsContainer = document.createElement("div");
  itemsContainer.className = "space-y-8";

  // Tampilkan setiap item
  cart.forEach((item) => {
    const quantity = item.quantity || 1;
    const itemElement = document.createElement("div");
    itemElement.className = "border-b pb-6";
    
    const shippingTypeId = `shipping-type-${item.id}`;
    const shippingMethodId = `shipping-method-${item.id}`;
    
    itemElement.innerHTML = `
      <div class="flex items-start">
        <img src="${item.image}" alt="${item.title}" class="w-16 h-16 object-contain mr-4">
        <div class="flex-1">
          <h3 class="font-semibold">${item.title}</h3>
          <div class="flex mt-1 font-bold">
          <p class="pl-2">${quantity}X</p>
          <span class="">$${item.price}</span>
          </div>
        </div>
      </div>
      
      <div class="mt-4 w-full bg-white border-2 border-[#B7B7B7] rounded-lg">
        <select id="${shippingTypeId}" class="w-full p-3 border-0 rounded-lg font-semibold bg-white shipping-type" data-id="${item.id}">
          <option value="reguler" ${shippingOptions[item.id]?.type === 'reguler' ? 'selected' : ''}>Reguler</option>
          <option value="instant" ${shippingOptions[item.id]?.type === 'instant' ? 'selected' : ''}>Instant</option>
          <option value="cargo" ${shippingOptions[item.id]?.type === 'cargo' ? 'selected' : ''}>Cargo</option>
        </select>
        <hr>
        
        <select id="${shippingMethodId}" class="w-full p-3 border-0 rounded-lg font-semibold bg-white shipping-method" data-id="${item.id}">
          <option value="fedex" ${shippingOptions[item.id]?.method === 'fedex' ? 'selected' : ''}>
          FedEx (Free Shipping)
          <p class="font-medium p-3 -mt-5">Estimated Arrive ${getDeliveryDate()}</p>
          </option>
          <option value="dhl" ${shippingOptions[item.id]?.method === 'dhl' ? 'selected' : ''}>
          DHL (Free Shipping)
          <p class="font-medium p-3 -mt-5">Estimated Arrive ${getDeliveryDate()}</p>
          </option>
        </select>
        <hr>
        
        <p class="font-medium p-3">With Delivery Insurance (Free)</p>
      </div>
      
      
      <div class="mt-4 w-full bg-white border border-black rounded-lg">
        <form class="relative w-full">
          <input
            type="text"
            class="note-input block w-full pl-10 py-2 text-gray-900 border border-gray-300 rounded-md focus:ring-gray-600 focus:border-gray-600"
            placeholder="Give Note"
            data-id="${item.id}"
            value="${productNotes[item.id] || ''}"
          >
          <div class="absolute inset-y-0 left-4 flex items-center">
            <img src="/asset/note.png" alt="Note" class="w-5 h-5">
          </div>
        </form>
      </div>
    `;
    
    itemsContainer.appendChild(itemElement);
  });
  
  // Masukkan ke halaman
  orderItemsContainer.appendChild(itemsContainer);
  
  // Tambahkan event listener ke setiap elemen interaktif
  document.querySelectorAll('.shipping-type').forEach(select => {
    select.addEventListener('change', saveShippingOptions);
  });
  
  document.querySelectorAll('.shipping-method').forEach(select => {
    select.addEventListener('change', saveShippingOptions);
  });
  
  document.querySelectorAll('.note-input').forEach(input => {
    input.addEventListener('input', saveProductNotes);
  });
}

// Simpan pilihan pengiriman ke localStorage
function saveShippingOptions(e) {
  const itemId = e.target.dataset.id;
  const type = e.target.id.includes('type') ? 'type' : 'method';
  
  if (!shippingOptions[itemId]) {
    shippingOptions[itemId] = {};
  }
  
  shippingOptions[itemId][type] = e.target.value;
  localStorage.setItem('shippingOptions', JSON.stringify(shippingOptions));
}

// Simpan catatan pengguna untuk produk tertentu
function saveProductNotes(e) {
  const itemId = e.target.dataset.id;
  productNotes[itemId] = e.target.value;
  localStorage.setItem('productNotes', JSON.stringify(productNotes));
}

// Menghitung dan menampilkan tanggal perkiraan pengiriman
function getDeliveryDate() {
  const today = new Date();
  const deliveryDays = 3 + Math.floor(Math.random() * 4);
  const deliveryDate = new Date(today);
  deliveryDate.setDate(today.getDate() + deliveryDays);
  
  const options = { month: 'long', day: 'numeric' };
  return deliveryDate.toLocaleDateString('en-US', options);
}

// Menampilkan ringkasan belanja: total harga dan ongkos kirim
function displayShoppingSummary() {
  const shoppingSummaryContainer = document.getElementById("shopping-summary");
  shoppingSummaryContainer.innerHTML = "";

  const cart = JSON.parse(localStorage.getItem("selectedCartItems")) || [];
  let subtotal = 0;

  cart.forEach((item) => {
    const quantity = item.quantity || 1;
    subtotal += parseFloat(item.price) * quantity;
  });

  const summaryHTML = `
    <h2 class="text-xl font-bold text-gray-800 mt-8">Shopping Summary</h2>
    <div class="mt-4 space-y-3">

      <div class="flex justify-between">
        <span class="font-medium">Product Total</span>
        <span class="font-medium">$${subtotal.toFixed(2)}</span>
      </div>

      <div class="flex justify-between">
        <span class="font-medium">Shipping</span>
        <span class="font-medium">Free</span>
      </div>

      <hr class="border-t border-2 mt-4">

      <div class="flex justify-between">
        <span class="font-bold">Shopping Total</span>
        <span class=" font-bold">$${subtotal.toFixed(2)}</span>
      </div>

    </div>

    <button id="order-btn" class="w-full mt-6 bg-black text-white font-bold py-3 px-4 rounded-lg cursor-pointer">
      Checkout
    </button>
  `;

  shoppingSummaryContainer.innerHTML = summaryHTML;
}

// Menyelesaikan pesanan
function placeOrder() {
  alert("Order Successful! Thank you for your purchase.");
  
  // Ambil data keranjang utama dan item yang sudah dibeli
  const mainCart = JSON.parse(localStorage.getItem("cart")) || [];
  const purchasedItems = JSON.parse(localStorage.getItem("selectedCartItems")) || [];
  
  // Hapus item yang dibeli dari keranjang utama
  const updatedCart = mainCart.filter(item => 
    !purchasedItems.some(purchased => purchased.id === item.id)
  );
  
  // Simpan perubahan dan hapus data terkait
  localStorage.setItem("cart", JSON.stringify(updatedCart));
  localStorage.removeItem("selectedCartItems");
  localStorage.removeItem("shippingOptions");
  localStorage.removeItem("productNotes");
  
  // Arahkan pengguna ke halaman utama
  window.location.href = "/Home.html";
}