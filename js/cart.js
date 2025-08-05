// Menunggu sampai semua konten HTML selesai dimuat
document.addEventListener("DOMContentLoaded", () => {

    // Ambil data keranjang dari localStorage, jika kosong maka gunakan array kosong
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    
    // Ambil elemen-elemen dari halaman HTML
    const cartContainer = document.getElementById("Product-Detail"); 
    const checkoutBtn = document.getElementById("Proceed-Checkout"); 
    const subtotalElement = document.getElementById("cart-subtotal");
    const shippingElement = document.getElementById("shipping");
    const totalElement = document.getElementById("total");

    // Fungsi untuk menampilkan ulang isi keranjang
    function updateCart() {
        let selectedSubtotal = 0;
        cartContainer.innerHTML = ""; // Hapus konten sebelumnya

        // Filter item yang dicentang (dipilih untuk checkout)
        const selectedItems = cart.filter(item => item.selected);
         // Hitung subtotal hanya dari item yang dicentang
        selectedSubtotal = selectedItems.reduce((sum, item) => {
            return sum + (item.price * item.quantity);
        }, 0);

        // Loop semua item di keranjang
        cart.forEach((item, index) => {
            const totalPrice = item.price * item.quantity;
            
            const itemElement = document.createElement("tr");
            itemElement.id = `cart-item-${item.id}`;
            itemElement.className = "border-b-2 border-[#B7B7B7] py-4";
            itemElement.innerHTML = `
                <td class="px-6 py-4 pl-10">
                    <button class="remove-item" data-index="${index}">
                        <img src="../Asset/trash.png" class="w-6 h-6 cursor-pointer mx-auto">
                    </button>
                </td>
                <td class="px-6 py-4 pl-10">
                    <input type="checkbox" class="item-select h-5 w-5 border-2 border-[#B7B7B7] rounded-full appearance-none checked:bg-[#B7B7B7] cursor-pointer" data-index="${index}" ${item.selected ? 'checked' : ''}>
                </td>
                <td class="px-6 py-4 pr-10">
                    <img src="${item.image}" class="w-20 h-20 object-contain">
                </td>
                <td class="px-6 py-4">
                    <span class="font-medium">${item.title}</span>
                </td>
                <td class="px-6 py-4 pr-10">
                    $${item.price.toFixed(2)}
                </td>
                <td class="px-6 py-4 pl-10">
                    <input type="number" min="1" value="${item.quantity}" class="quantity-update w-16 border-2 border-[#B7B7B7] rounded-full text-center" data-index="${index}">
                </td>
                <td class="px-6 py-4 pl-10">
                    $${totalPrice.toFixed(2)}
                </td>
            `;
            // Tambahkan item ke dalam container
            cartContainer.appendChild(itemElement);
        });

        // Tampilkan subtotal, ongkir, dan total
        subtotalElement.textContent = `$${selectedSubtotal.toFixed(2)}`;
        shippingElement.textContent = "Free";
        totalElement.textContent = `$${selectedSubtotal.toFixed(2)}`;
    }
    
    // Event untuk update quantity
    cartContainer.addEventListener("input", (e) => {
        if(e.target.classList.contains("quantity-update")) {
            const index = e.target.dataset.index;
            cart[index].quantity = parseInt(e.target.value);
            localStorage.setItem("cart", JSON.stringify(cart));
            updateCart();
        }
    });

    // Event untuk menghapus item dari keranjang
    cartContainer.addEventListener("click", (e) => {
        const removeBtn = e.target.closest(".remove-item");
        if (removeBtn) {
            const index = removeBtn.dataset.index;
            cart.splice(index, 1);
            localStorage.setItem("cart", JSON.stringify(cart));
            updateCart();
        }
    });

    // Event untuk select atau tidak
    cartContainer.addEventListener("change", (e) => {
        if (e.target.classList.contains("item-select")) {
            const index = e.target.dataset.index;
            cart[index].selected = e.target.checked;
            localStorage.setItem("cart", JSON.stringify(cart));
            updateCart();
        }
    });

    // Saat tombol Checkout ditekan
    checkoutBtn.addEventListener("click", () => {
        const selectedItems = cart.filter(item => item.selected);
        
        //kalau tidak ada item
        if (selectedItems.length === 0) {
            alert("Please select at least one product to proceed to checkout");
            return;
        }
        
        //// Simpan item terpilih ke localStorage dan arahkan ke halaman checkout
        localStorage.setItem("selectedCartItems", JSON.stringify(selectedItems));
        window.location.href = "Checkout.html";
    });

    // Pastikan semua item yang belum punya properti "selected", dibuat true
    cart = cart.map(item => ({
        ...item,
        selected: item.selected !== undefined ? item.selected : true
    }));
    
     // Simpan kembali cart yang sudah diperbarui
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCart();
});