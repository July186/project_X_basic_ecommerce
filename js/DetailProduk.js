// Mengambil parameter "id" dari URL
const urlParams = new URLSearchParams(window.location.search);
const productid = urlParams.get("id");

//untuk menampilkan detail produk berdasarkan ID
async function detailcontainer(id) {
    try {
        const response = await fetch(`https://fakestoreapi.com/products/${id}`);
        const product = await response.json();

        // Ambil elemen HTML untuk gambar produk
        const imagecontainer = document.getElementById("image-container");
        imagecontainer.innerHTML = ` 
            <div class="lg:border-3 rounded-md lg:border-[#B7B7B7] min-w-100 max-w-130 w-full lg:w-152 h-140 flex justify-center">
                <img src="${product.image}" alt="${product.title}" class="flex justify-center items-center h-full object-contain p-14"/>
            </div>
        `;

        // Ambil elemen HTML untuk detail produk
        const detailcontainer = document.getElementById("detail-product");
        detailcontainer.innerHTML = `
        <hr class="flex-grow border-1 lg:hidden border-[#B7B7B7]">
        <div class="p-12">
            <h1 class="text-2xl font-bold mb-2 ">${product.title}</h1>
            <h2 class="text-xl font-bold mb-4">$${product.price}</h2>
            <h3 class="text-xl font-bold mb-2">Description</h3>
            <p class="text-justify mb-4 mr-20 text-base">${product.description}</p>
            <button id="addToCart" class="bg-black text-white py-2 px-6 roundedlg cursor-pointer mr-5">Add To Cart</button>
            <button id="Checkout" class="bg-black text-white py-2 px-6 roundedlg cursor-pointer">Checkout</button>
        </div>
        `;

        // Tambahkan event listener pada tombol "Add to Cart"
        document.getElementById("addToCart").addEventListener("click", () => {
            addToCart(product);
        });

        // Tambahkan event listener pada tombol "Checkout"
        document.getElementById("Checkout").addEventListener("click", () => {
            const selectedItems = [{
                id: product.id,
                title: product.title,
                price: product.price,
                image: product.image,
                quantity: 1,
                selected: true
            }];

            // Simpan produk ke localStorage dengan key "selectedCartItems"
            localStorage.setItem("selectedCartItems", JSON.stringify(selectedItems));
            // Arahkan ke halaman checkout
            window.location.href = "Checkout.html";
        });

    } catch (error) {
        // Tampilkan error jika terjadi masalah saat fetch  
        console.error(error);
    }
}

// Fungsi untuk menambahkan produk ke dalam keranjang (cart)
function addToCart(product) {
    let cart = JSON.parse(localStorage.getItem("cart")) || []; // Ambil data keranjang dari localStorage
    const existingItem = cart.find((item) => item.id === product.id); // Cek apakah produk sudah ada

    // Jika sudah ada, tambah jumlahnya
    if (existingItem) {
        existingItem.quantity += 1;
        // Jika belum, tambahkan produk baru
    } else {
        cart.push({
            id: product.id,
            title: product.title,
            price: product.price,
            image: product.image,
            quantity: 1,
            selected: true
        });
    }

    // Simpan kembali ke localStorage
    localStorage.setItem("cart", JSON.stringify(cart));
    // Beri notifikasi ke pengguna
    alert(`${product.title} added to cart!`);
}

// Jalankan fungsi hanya jika ID produk tersedia dari URL
if (productid) {
    detailcontainer(productid);
} else {
    console.error("No product ID found in URL");
}